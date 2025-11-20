---
name: navigation-routing-setup
description: Setup navigation and routing with React Router, Vue Router, TanStack Router. Protected routes, layouts, nested routes, breadcrumbs. Keywords - routing, navigation, react router, vue router, protected routes, nested routes, route guards, breadcrumbs
---

# Navigation/Routing Setup

## When to Use This Skill

Activate when:
- Setting up routing for single-page applications
- Need protected routes (authentication required)
- Building nested routes with layouts
- Implementing route guards and navigation guards
- Creating breadcrumbs and active link highlighting

## What This Skill Does

Sets up routing with:
- Client-side routing (SPA navigation)
- Protected routes (redirect if not authenticated)
- Nested routes and layouts
- Route guards (before navigation)
- Active link styling
- Breadcrumbs
- Route-based code splitting
- 404 Not Found pages

## Supported Technologies

**React**:
- React Router v6 (most popular)
- TanStack Router (type-safe)
- Next.js App Router (file-based)

**Vue**:
- Vue Router v4 (official)
- Nuxt routing (file-based)

## Example: React Router v6 Setup

```tsx
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Auth routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes with DashboardLayout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Example: Layout with Outlet (React Router)

```tsx
// layouts/DashboardLayout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">My App</h1>
        </div>

        <nav className="mt-8 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

## Example: Vue Router v4 Setup

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Layouts
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

// Pages
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
        meta: { title: 'Home' },
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: { title: 'Login', requiresGuest: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/RegisterPage.vue'), // Lazy loading
        meta: { title: 'Register', requiresGuest: true },
      },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardPage,
        meta: { title: 'Dashboard' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfilePage,
        meta: { title: 'Profile' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { title: 'Settings' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { title: '404 Not Found' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Set page title
  document.title = `${to.meta.title || 'App'} | My App`;

  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
```

## Example: Breadcrumbs Component (React)

```tsx
// components/Breadcrumbs.tsx
import { Link, useMatches } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

interface BreadcrumbMatch {
  pathname: string;
  handle?: {
    crumb?: (data: any) => { label: string; to: string };
  };
  data?: any;
}

export function Breadcrumbs() {
  const matches = useMatches() as BreadcrumbMatch[];

  const breadcrumbs = matches
    .filter((match) => match.handle?.crumb)
    .map((match) => match.handle!.crumb!(match.data));

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.to} className="flex items-center">
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            {index === breadcrumbs.length - 1 ? (
              <span className="ml-2 text-gray-900">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Usage in route config
{
  path: '/users/:id',
  element: <UserDetailPage />,
  loader: async ({ params }) => {
    return { user: await fetchUser(params.id) };
  },
  handle: {
    crumb: (data) => ({
      label: data.user.name,
      to: `/users/${data.user.id}`,
    }),
  },
}
```

## Example: Route-based Code Splitting

```tsx
// React Router with lazy loading
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## Best Practices

1. **Protected routes** - Use wrapper components or route guards
2. **Layouts** - Use nested routes with `<Outlet>` (React) or child routes (Vue)
3. **Active links** - Highlight current route in navigation
4. **Lazy loading** - Code split routes for better performance
5. **Route guards** - Check authentication before navigation
6. **Redirect** - Redirect unauthorized users to login
7. **404 page** - Catch-all route for not found
8. **Breadcrumbs** - Show current location in hierarchy
9. **Meta tags** - Set page title per route

## Common Routing Patterns

**1. Protected Route**:
```tsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

**2. Redirect if authenticated**:
```tsx
if (isAuthenticated) return <Navigate to="/dashboard" />;
```

**3. Nested routes**:
```tsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="overview" element={<Overview />} />
  <Route path="stats" element={<Stats />} />
</Route>
```

**4. Dynamic routes**:
```tsx
<Route path="/users/:id" element={<UserDetail />} />
```

**5. Query parameters**:
```tsx
const [searchParams] = useSearchParams();
const page = searchParams.get('page') || '1';
```

## Integration with Other Skills

- **auth-flow-builder** - Protect routes with authentication
- **state-management-setup** - Store authentication state
- **loading-states-handler** - Loading states during navigation

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
