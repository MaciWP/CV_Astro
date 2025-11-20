---
name: state-management-setup
description: |
  This skill sets up state management for React, Vue, or Svelte applications.
  Supports Pinia (Vue 3), Redux Toolkit (React), Zustand (React), Context API (React), Svelte stores.
  Creates stores, actions, selectors, TypeScript types, persistence (localStorage), and dev tools integration.
  Activate when user says "state management", "setup Pinia", "Redux store", "global state", or needs shared state.
  Output: Complete state management setup with stores, actions, TypeScript, persistence, and DevTools.
---

# State Management Setup

> **Purpose**: Set up global state management with stores, actions, and persistence

---

## When to Use

- ✅ Need shared state across components
- ✅ User authentication state (currentUser, isLoggedIn)
- ✅ Shopping cart, theme, settings
- ✅ User says: "state management", "setup store", "global state"

---

## Pinia (Vue 3) - Recommended

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const isLoggedIn = computed(() => currentUser.value !== null);

  // Actions
  async function login(email: string, password: string) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Login failed');

    currentUser.value = await response.json();
  }

  function logout() {
    currentUser.value = null;
  }

  async function fetchUser() {
    const response = await fetch('/api/me');
    currentUser.value = await response.json();
  }

  return { currentUser, isLoggedIn, login, logout, fetchUser };
}, {
  persist: true // Persist to localStorage
});
```

**Usage in Component**:
```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

async function handleLogin() {
  await userStore.login('user@example.com', 'password');
}
</script>

<template>
  <div v-if="userStore.isLoggedIn">
    <p>Welcome, {{ userStore.currentUser?.name }}</p>
    <button @click="userStore.logout">Logout</button>
  </div>
  <div v-else>
    <button @click="handleLogin">Login</button>
  </div>
</template>
```

---

## Redux Toolkit (React)

```typescript
// store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Login failed');

    return await response.json();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
```

**Usage**:
```tsx
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loginUser, logout } from './store/slices/userSlice';

function App() {
  const dispatch = useAppDispatch();
  const { currentUser, loading } = useAppSelector(state => state.user);

  const handleLogin = () => {
    dispatch(loginUser({ email: 'user@example.com', password: 'password' }));
  };

  return (
    <div>
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.name}</p>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      )}
    </div>
  );
}
```

---

## Zustand (React) - Lightweight

```typescript
// store/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,

      login: async (email: string, password: string) => {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const user = await response.json();
        set({ currentUser: user });
      },

      logout: () => set({ currentUser: null })
    }),
    {
      name: 'user-storage' // localStorage key
    }
  )
);
```

**Usage**:
```tsx
import { useUserStore } from './store/useUserStore';

function App() {
  const { currentUser, login, logout } = useUserStore();

  return (
    <div>
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('user@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

---

**Skill Version**: 1.0.0
**Technologies**: Pinia (Vue 3), Redux Toolkit, Zustand, Context API
**Output**: Complete state management with stores, actions, TypeScript, persistence
