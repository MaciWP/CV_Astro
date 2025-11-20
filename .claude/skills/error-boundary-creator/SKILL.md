---
name: error-boundary-creator
description: Create error boundaries for React, error handling with fallback UI, error logging. React Error Boundary, error recovery. Keywords - error boundary, error handling, react error boundary, fallback ui, error logging, error recovery, componentDidCatch
---

# Error Boundary Creator

## When to Use This Skill

Activate when:
- Wrapping components that might crash
- Need graceful error handling in production
- Want to log errors to external services
- Building resilient UI with fallback components
- Preventing entire app crash from single component failure

## What This Skill Does

Creates error boundaries with:
- Catch errors in component tree
- Fallback UI when errors occur
- Error logging to external services
- Error recovery (retry button)
- Different error boundaries for different sections
- Development vs production error displays

## Supported Technologies

**React**:
- Class component with `componentDidCatch`
- react-error-boundary (library)
- Error logging: Sentry, Rollbar, LogRocket

**Vue 3**:
- `errorHandler` app config
- `onErrorCaptured` hook

## Example: Basic Error Boundary (React)

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to external service
    console.error('Error caught by boundary:', error, errorInfo);

    // Send to error tracking service (Sentry, Rollbar, etc.)
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-gray-600">
                    We're sorry for the inconvenience.
                  </p>
                </div>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">
                    {this.state.error.message}
                  </p>
                  <pre className="mt-2 text-xs text-red-700 overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </div>
              )}

              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Example: Error Boundary with Retry (react-error-boundary)

```tsx
// components/ErrorBoundaryWithRetry.tsx
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-gray-600">{error.message}</p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={resetErrorBoundary}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppWithErrorBoundary({ children }: { children: ReactNode }) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log to external service
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);

    // Send to Sentry, Rollbar, etc.
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}
```

## Example: Multiple Error Boundaries (Section-Level)

```tsx
// App.tsx
function App() {
  return (
    <div>
      {/* Global error boundary */}
      <ErrorBoundary fallback={<GlobalErrorFallback />}>
        <Header />

        <main>
          {/* Sidebar error boundary */}
          <ErrorBoundary fallback={<SidebarErrorFallback />}>
            <Sidebar />
          </ErrorBoundary>

          {/* Content error boundary */}
          <ErrorBoundary fallback={<ContentErrorFallback />}>
            <Content />
          </ErrorBoundary>
        </main>
      </ErrorBoundary>
    </div>
  );
}

// Fallback components
function SidebarErrorFallback() {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4">
      <p className="text-sm text-red-700">
        Sidebar failed to load. The rest of the app is still working.
      </p>
    </div>
  );
}
```

## Example: Error Logging to Sentry

```tsx
// utils/errorLogging.ts
import * as Sentry from '@sentry/react';

// Initialize Sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error Boundary with Sentry
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Usage
function App() {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <div>
          <h1>An error occurred</h1>
          <p>{error.message}</p>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
      showDialog
    >
      <MyApp />
    </SentryErrorBoundary>
  );
}
```

## Example: Vue 3 Error Handling

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  console.error('Component:', instance);
  console.error('Error info:', info);

  // Log to external service
  // logErrorToService(err, { component: instance, info });
};

app.mount('#app');
```

```vue
<!-- components/ErrorBoundary.vue -->
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);
const error = ref<Error | null>(null);

onErrorCaptured((err: Error) => {
  hasError.value = true;
  error.value = err;
  console.error('Error captured:', err);

  // Prevent error from propagating
  return false;
});

const retry = () => {
  hasError.value = false;
  error.value = null;
};
</script>

<template>
  <div v-if="hasError" class="rounded-lg bg-red-50 p-4">
    <h2 class="text-lg font-semibold text-red-900">Something went wrong</h2>
    <p class="mt-2 text-sm text-red-700">{{ error?.message }}</p>
    <button
      @click="retry"
      class="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      Try again
    </button>
  </div>
  <slot v-else />
</template>
```

## Best Practices

1. **Multiple boundaries** - Wrap different sections separately
2. **User-friendly messages** - Don't show technical errors to users
3. **Development vs production** - Show stack traces only in dev
4. **Error logging** - Always log to external service (Sentry)
5. **Retry functionality** - Allow users to retry failed operations
6. **Navigation fallback** - Provide "Go home" button
7. **Test error boundaries** - Manually trigger errors to test

## What Error Boundaries DON'T Catch

❌ Event handlers (use try/catch)
❌ Async code (setTimeout, promises)
❌ Server-side rendering
❌ Errors in error boundary itself

```tsx
// ❌ NOT caught by error boundary
function MyComponent() {
  const handleClick = () => {
    throw new Error('This will not be caught!');
  };

  return <button onClick={handleClick}>Click me</button>;
}

// ✅ Use try/catch for event handlers
function MyComponent() {
  const handleClick = () => {
    try {
      // Code that might fail
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Integration with Other Skills

- **loading-states-handler** - Show loading before error
- **api-integration-layer** - Handle API errors
- **logging-strategy** - Log errors to backend

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
