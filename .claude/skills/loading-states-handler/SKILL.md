---
name: loading-states-handler
description: |
  This skill creates loading states, skeletons, spinners, and error boundaries for async operations.
  Supports React (Suspense, Error Boundaries), Vue 3 (Suspense), with skeleton screens, spinners, progress bars.
  Generates loading components, skeleton loaders, error fallbacks, retry logic, optimistic UI.
  Activate when user says "loading state", "show spinner", "skeleton loader", "handle loading", or needs async UI feedback.
  Output: Complete loading system with skeletons, spinners, error boundaries, and retry mechanisms.
---

# Loading States Handler

> **Purpose**: Create loading states, skeletons, and error boundaries

---

## When to Use

- ✅ Show loading during API calls
- ✅ Skeleton screens while data loads
- ✅ Error boundaries for error handling
- ✅ User says: "loading state", "spinner", "skeleton", "handle loading"

---

## React Suspense + Error Boundary

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage with Suspense**:
```tsx
import { Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton />}>
        <UsersList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Skeleton Loaders

```tsx
// components/Skeleton.tsx
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
  );
}

// Usage
function UserCardSkeleton() {
  return (
    <div className="p-4 border rounded space-y-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function UsersListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

---

## Loading Hook

```typescript
// hooks/useAsync.ts
import { useState, useEffect } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: any[] = []
): UseAsyncState<T> & { retry: () => void } {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const execute = async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  };

  useEffect(() => {
    execute();
  }, deps);

  return { ...state, retry: execute };
}
```

**Usage**:
```tsx
function UserProfile({ userId }: { userId: number }) {
  const { data: user, loading, error, retry } = useAsync(
    () => fetch(`/api/users/${userId}`).then(res => res.json()),
    [userId]
  );

  if (loading) return <UserCardSkeleton />;

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded">
        <p className="text-red-600">{error.message}</p>
        <button onClick={retry} className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

---

**Skill Version**: 1.0.0
**Technologies**: React (Suspense, Error Boundaries), Vue 3, skeletons, spinners
**Output**: Loading states, skeleton loaders, error boundaries, retry logic
