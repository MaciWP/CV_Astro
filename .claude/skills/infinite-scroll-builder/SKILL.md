---
name: infinite-scroll-builder
description: Implement infinite scroll with Intersection Observer, React Query, virtual scrolling. Load more data on scroll. TanStack Query, SWR. Keywords - infinite scroll, load more, pagination, intersection observer, virtual scroll, tanstack query infinite, lazy loading
---

# Infinite Scroll Builder

## When to Use This Skill

Activate when:
- Implementing infinite scroll (load more on scroll)
- Building paginated lists that load automatically
- Need virtual scrolling for large lists (10k+ items)
- Want smooth scroll performance
- Building social media feeds or infinite galleries

## What This Skill Does

Implements infinite scroll with:
- Intersection Observer (detect scroll position)
- Automatic loading on scroll
- Loading indicators
- Virtual scrolling for performance (large lists)
- Integration with TanStack Query / SWR
- Error handling and retry

## Supported Technologies

**React**:
- TanStack Query (React Query) - useInfiniteQuery
- SWR - useSWRInfinite
- react-intersection-observer
- react-virtual (virtual scrolling)

**Vue 3**:
- TanStack Query Vue
- VueUse - useInfiniteScroll

## Example: Infinite Scroll with TanStack Query (React)

```tsx
// hooks/useInfiniteUsers.ts
import { useInfiniteQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersResponse {
  users: User[];
  nextCursor: number | null;
}

async function fetchUsers({ pageParam = 0 }: { pageParam?: number }): Promise<UsersResponse> {
  const response = await fetch(`/api/users?cursor=${pageParam}&limit=20`);
  return response.json();
}

export function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
}
```

```tsx
// components/UserList.tsx
import { useInfiniteUsers } from '../hooks/useInfiniteUsers';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function UserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteUsers();

  // Intersection Observer to trigger loading
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.users.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border p-4 hover:bg-gray-50"
            >
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      ))}

      {/* Intersection Observer trigger */}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : hasNextPage ? (
          <div className="text-gray-500">Scroll for more</div>
        ) : (
          <div className="text-gray-500">No more users</div>
        )}
      </div>
    </div>
  );
}
```

## Example: Virtual Scrolling (Large Lists)

```tsx
// components/VirtualUserList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useInfiniteUsers } from '../hooks/useInfiniteUsers';

export function VirtualUserList() {
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers();

  // Flatten all pages into single array
  const allUsers = data?.pages.flatMap((page) => page.users) ?? [];

  // Virtual scrolling
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allUsers.length + 1 : allUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated height of each item
    overscan: 5, // Number of items to render outside visible area
  });

  // Fetch more when scrolling near bottom
  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);

    if (
      lastItem &&
      lastItem.index >= allUsers.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allUsers.length,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ]);

  return (
    <div
      ref={parentRef}
      className="h-screen overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index > allUsers.length - 1;
          const user = allUsers[virtualItem.index];

          return (
            <div
              key={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <div>Loading more...</div>
                ) : (
                  <div>No more users</div>
                )
              ) : (
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Example: Vue 3 Infinite Scroll

```vue
<!-- components/UserList.vue -->
<script setup lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query';
import { useIntersectionObserver } from '@vueuse/core';
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

const loadMoreTrigger = ref<HTMLElement | null>(null);

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery({
  queryKey: ['users'],
  queryFn: async ({ pageParam = 0 }) => {
    const response = await fetch(`/api/users?cursor=${pageParam}&limit=20`);
    return response.json();
  },
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  initialPageParam: 0,
});

// All users from all pages
const allUsers = computed(() => {
  return data.value?.pages.flatMap((page) => page.users) ?? [];
});

// Intersection Observer to load more
useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    if (isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
      fetchNextPage();
    }
  },
  { threshold: 0 }
);
</script>

<template>
  <div class="space-y-4">
    <div v-if="isLoading">Loading...</div>

    <div v-else>
      <div
        v-for="user in allUsers"
        :key="user.id"
        class="rounded-lg border p-4 hover:bg-gray-50"
      >
        <h3 class="font-medium">{{ user.name }}</h3>
        <p class="text-sm text-gray-600">{{ user.email }}</p>
      </div>

      <!-- Load more trigger -->
      <div ref="loadMoreTrigger" class="py-4 text-center">
        <div v-if="isFetchingNextPage">Loading more...</div>
        <div v-else-if="hasNextPage" class="text-gray-500">
          Scroll for more
        </div>
        <div v-else class="text-gray-500">No more users</div>
      </div>
    </div>
  </div>
</template>
```

## Backend: Cursor-based Pagination

```python
# FastAPI cursor-based pagination
from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

@router.get("/users")
async def get_users(
    cursor: int = Query(default=0),
    limit: int = Query(default=20, le=100)
):
    """Get paginated users with cursor-based pagination"""

    # Query users after cursor
    users = await db.query(User).filter(User.id > cursor).limit(limit).all()

    # Determine next cursor
    next_cursor = users[-1].id if len(users) == limit else None

    return {
        "users": [user.dict() for user in users],
        "nextCursor": next_cursor
    }
```

## Best Practices

1. **Use cursor-based pagination** - More reliable than offset/limit
2. **Intersection Observer** - Better performance than scroll events
3. **Virtual scrolling** - For lists with 1000+ items
4. **Loading indicators** - Show when fetching next page
5. **Error handling** - Retry button if load fails
6. **Debounce** - Prevent multiple simultaneous fetches
7. **Skeleton loaders** - Better UX than spinners

## Performance Comparison

| List Size | Technique | Performance |
|-----------|-----------|-------------|
| < 100 items | Standard rendering | ✅ Excellent |
| 100-1000 items | Infinite scroll | ✅ Good |
| 1000-10k items | Virtual scrolling | ✅ Good |
| 10k+ items | Virtual scrolling + windowing | ⚠️ Required |

## Common Pitfalls

```tsx
// ❌ BAD: Using scroll events (poor performance)
window.addEventListener('scroll', handleScroll);

// ✅ GOOD: Using Intersection Observer
const { ref, inView } = useInView();

// ❌ BAD: Offset-based pagination (unreliable with inserts/deletes)
/api/users?offset=20&limit=20

// ✅ GOOD: Cursor-based pagination
/api/users?cursor=123&limit=20
```

## Integration with Other Skills

- **api-integration-layer** - Use TanStack Query for infinite scroll
- **loading-states-handler** - Show loading skeletons
- **table-datagrid-builder** - Infinite scroll in tables

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
