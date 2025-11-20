---
name: cache-strategy-builder
description: |
  This skill implements caching strategies (Redis, in-memory) with TTL, invalidation, and patterns.
  Supports Redis (ioredis, redis-py), in-memory (LRU cache), with cache-aside, write-through, read-through patterns.
  Creates cache wrappers, TTL management, cache invalidation, cache warming, decorator patterns.
  Activate when user says "add caching", "Redis cache", "cache strategy", "improve performance with cache".
  Output: Complete caching implementation with Redis/in-memory, TTL, invalidation, and performance boost.
---

# Cache Strategy Builder

> **Purpose**: Implement caching strategies to improve performance

---

## When to Use

- ✅ Frequently accessed data (user profiles, settings)
- ✅ Expensive computations or queries
- ✅ Reduce database load
- ✅ User says: "add caching", "use Redis", "cache results"

---

## Redis Cache (Python)

```python
import redis
import json
from functools import wraps
from typing import Any, Callable, Optional

cache = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def cached(ttl: int = 300, key_prefix: str = ''):
    """Cache decorator with TTL"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{str(args)}:{str(kwargs)}"

            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value:
                return json.loads(cached_value)

            # Cache miss - call function
            result = func(*args, **kwargs)

            # Store in cache
            cache.setex(cache_key, ttl, json.dumps(result))

            return result
        return wrapper
    return decorator

# Usage
@cached(ttl=600, key_prefix='user')
def get_user(user_id: int):
    # Expensive database query
    return db.query(User).filter(User.id == user_id).first()

# Cache invalidation
def invalidate_user_cache(user_id: int):
    pattern = f"user:get_user:({user_id},)*"
    keys = cache.keys(pattern)
    if keys:
        cache.delete(*keys)

# Update and invalidate
def update_user(user_id: int, data: dict):
    user = db.query(User).filter(User.id == user_id).first()
    for key, value in data.items():
        setattr(user, key, value)
    db.commit()

    # Invalidate cache
    invalidate_user_cache(user_id)

    return user
```

---

## Redis Cache (TypeScript)

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

async function cached<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Try cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  // Cache miss
  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage
async function getUser(userId: number) {
  return cached(
    `user:${userId}`,
    600, // 10 minutes
    async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: { posts: true }
      });
    }
  );
}

// Cache invalidation
async function invalidateUser(userId: number) {
  await redis.del(`user:${userId}`);
}
```

---

## Cache-Aside Pattern

```typescript
class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Fetch from source
    const data = await fetchFn();

    // Store in cache
    await this.set(key, data, ttl);

    return data;
  }
}

export const cacheService = new CacheService();

// Usage
const user = await cacheService.getOrFetch(
  `user:${userId}`,
  () => fetchUserFromDb(userId),
  600
);
```

---

**Skill Version**: 1.0.0
**Technologies**: Redis, in-memory (LRU), cache patterns
**Output**: Caching with TTL, invalidation, decorators, performance boost
