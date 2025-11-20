---
name: "React State Management"
description: "Enforces Redux Toolkit patterns in React TypeScript projects. Auto-activates on: redux, state, slice, reducer, action, selector, thunk. Prevents prop drilling (>2 levels), useState for global state, direct state mutation, synchronous async logic. Ensures createSlice usage, typed selectors, RTK Query for API, immer-based reducers. Validates slice structure, naming conventions (camelCase actions), TypeScript types (RootState, AppDispatch). Targets: 0 prop drilling, 100% typed state, <50ms selector compute time."
---

# React State Management

**Auto-activates when**: Discussing Redux, state management, slices, or global state in React TypeScript projects.

---

## 🎯 Mission

Enforce **Redux Toolkit best practices** with TypeScript for predictable, testable state management in React applications.

---

## 📐 Core Principles

### 1. createSlice for State

**Rule**: Use Redux Toolkit's createSlice, never hand-written reducers.

```typescript
// ❌ WRONG - Manual reducer
const initialState = { count: 0 };

function counterReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }; // Easy to mutate by mistake
    default:
      return state;
  }
}

// ✅ CORRECT - createSlice with Immer
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  count: number;
  status: 'idle' | 'loading';
}

const initialState: CounterState = {
  count: 0,
  status: 'idle',
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.count += 1; // Immer allows "mutation"
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.count += action.payload;
    },
  },
});

export const { increment, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

**Auto-check**:
- [ ] Using createSlice (not hand-written switch/case)?
- [ ] State interface defined with TypeScript?
- [ ] Actions exported as const { action } = slice.actions?

---

### 2. Typed Selectors

**Rule**: All selectors must be typed with RootState.

```typescript
// ❌ WRONG - Untyped selector
export const selectCount = (state: any) => state.counter.count;

// ✅ CORRECT - Typed selector
import { RootState } from '@/store';

export const selectCount = (state: RootState) => state.counter.count;
export const selectCounterStatus = (state: RootState) => state.counter.status;

// Usage in component
import { useAppSelector } from '@/hooks/redux';

function Counter() {
  const count = useAppSelector(selectCount); // Type-safe!
  const status = useAppSelector(selectCounterStatus);

  return <div>{count}</div>;
}
```

**Auto-check**:
- [ ] Selectors accept RootState parameter?
- [ ] Selectors in separate selectors.ts file?
- [ ] Components use useAppSelector (typed hook)?

---

### 3. Async Logic with Thunks

**Rule**: Use createAsyncThunk for API calls, not useEffect.

```typescript
// ❌ WRONG - API call in component
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser); // No loading state, error handling
  }, []);

  return <div>{user?.name}</div>;
}

// ✅ CORRECT - createAsyncThunk
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: string) => {
    const response = await fetch(`/api/user/${userId}`);
    return (await response.json()) as User;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, loading: false, error: null } as UserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

// Usage in component
function UserProfile({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user?.name}</div>;
}
```

**Auto-check**:
- [ ] API calls use createAsyncThunk (not fetch in useEffect)?
- [ ] Thunk has pending/fulfilled/rejected cases?
- [ ] Loading and error states tracked in slice?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Prop Drilling (>2 Levels)

```typescript
// ❌ ANTI-PATTERN - Prop drilling 4 levels deep
function App() {
  const [user, setUser] = useState(null);
  return <Parent user={user} setUser={setUser} />;
}

function Parent({ user, setUser }) {
  return <Child user={user} setUser={setUser} />;
}

function Child({ user, setUser }) {
  return <GrandChild user={user} setUser={setUser} />;
}

function GrandChild({ user, setUser }) {
  return <button onClick={() => setUser(null)}>{user?.name}</button>;
}

// ✅ CORRECT - Redux eliminates prop drilling
function App() {
  return <Parent />;
}

function Parent() {
  return <Child />;
}

function Child() {
  return <GrandChild />;
}

function GrandChild() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  return <button onClick={() => dispatch(clearUser())}>{user?.name}</button>;
}
```

**Why**: Prop drilling makes components coupled, hard to refactor, verbose.

---

### 2. useState for Global State

```typescript
// ❌ ANTI-PATTERN - useState for app-wide data
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // Passing to 20+ components... nightmare!
  return <Layout theme={theme} user={user} cart={cart} />;
}

// ✅ CORRECT - Redux for global state
// store/slices/themeSlice.ts
const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' as 'light' | 'dark' },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});
```

**Why**: useState is for local component state, not global app state.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] No hand-written switch/case reducers?
- [ ] All state mutations use createSlice (Immer)?
- [ ] No direct state mutation (state.x = y outside createSlice)?
- [ ] Async logic uses createAsyncThunk (not useEffect fetch)?

### High Priority
- [ ] Selectors typed with RootState?
- [ ] Selectors in separate selectors.ts files?
- [ ] Custom hooks (useAppSelector, useAppDispatch) used?
- [ ] Loading/error states tracked for async operations?

### Medium Priority
- [ ] Prop drilling limited to ≤2 levels?
- [ ] Global state in Redux (not useState in App.tsx)?
- [ ] Slice files organized: slices/, selectors/, thunks/?
- [ ] Action names camelCase (not SCREAMING_SNAKE_CASE)?

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `store/index.ts` | Redux store configuration |
| `store/slices/` | Feature slices (one per domain) |
| `store/selectors/` | Typed selectors |
| `hooks/redux.ts` | Typed useAppSelector/useAppDispatch hooks |
| `docs/STATE_MANAGEMENT.md` | State architecture guide |

---

## 🎯 Activation Criteria

**Keywords**: "redux", "state", "slice", "reducer", "action", "selector", "thunk", "useSelector", "dispatch"

**Auto-suggest when**:
- User creates new slice
- User adds async logic (fetch, API call)
- User mentions prop drilling or passing props
- User discusses global state management

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**State Pattern Compliance**: 100% Redux Toolkit, 0 manual reducers
