---
name: api-integration-layer
description: |
  This skill creates type-safe API client layers with auto-retry, error handling, and loading states.
  Supports Fetch API, Axios, TanStack Query (React Query), with TypeScript types, interceptors, and caching.
  Generates API clients, request/response types, error handling, loading states, optimistic updates.
  Activate when user says "API client", "fetch data", "call backend", "integrate API", or needs HTTP requests.
  Output: Type-safe API client with error handling, loading states, caching, and retry logic.
---

# API Integration Layer

> **Purpose**: Create type-safe API clients with error handling and caching

---

## When to Use

- ✅ Call backend APIs from frontend
- ✅ Need type-safe requests/responses
- ✅ Handle loading states, errors, retries
- ✅ Cache API responses
- ✅ User says: "API client", "fetch data", "call backend"

---

## TanStack Query (React Query)

```typescript
// api/users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

// API functions
async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
}

async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete user');
}

// React Query hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
    enabled: id > 0 // Only fetch if ID is valid
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}
```

**Usage in Component**:
```tsx
import { useUsers, useCreateUser } from './api/users';

function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async () => {
    await createUser.mutateAsync({
      name: 'John Doe',
      email: 'john@example.com'
    });
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>

      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Axios Client with Interceptors

```typescript
// api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Refresh token on 401
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/refresh', { refreshToken });

        const { token } = response.data;
        localStorage.setItem('token', token);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Refresh failed, logout
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

**API Service**:
```typescript
// api/users.ts
import apiClient from './client';

interface User {
  id: number;
  name: string;
  email: string;
}

export const usersApi = {
  getAll: () => apiClient.get<User[]>('/users').then(res => res.data),

  getById: (id: number) =>
    apiClient.get<User>(`/users/${id}`).then(res => res.data),

  create: (user: Omit<User, 'id'>) =>
    apiClient.post<User>('/users', user).then(res => res.data),

  update: (id: number, user: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, user).then(res => res.data),

  delete: (id: number) =>
    apiClient.delete(`/users/${id}`).then(res => res.data)
};
```

---

**Skill Version**: 1.0.0
**Technologies**: TanStack Query, Axios, Fetch API
**Output**: Type-safe API client with caching, error handling, loading states
