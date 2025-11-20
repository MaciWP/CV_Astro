---
name: database-query-optimizer
description: |
  This skill optimizes database queries to fix N+1 problems, add indexes, and improve performance.
  Supports PostgreSQL, MySQL, MongoDB, Redis with ORMs (SQLAlchemy, Prisma, TypeORM, Mongoose).
  Detects slow queries, suggests indexes, rewrites inefficient queries, and adds eager loading.
  Activate when user says "optimize queries", "fix N+1", "slow database", "add indexes", or performance issues.
  Output: Optimized queries with indexes, eager loading, query analysis, and before/after benchmarks.
---

# Database Query Optimizer

> **Purpose**: Detect and fix slow database queries, N+1 problems, missing indexes

---

## When to Use This Skill

Activate when:
- ✅ User reports slow API responses or database queries
- ✅ N+1 query problem detected (multiple queries in loop)
- ✅ Missing indexes causing full table scans
- ✅ Inefficient JOIN queries
- ✅ User says: "optimize database", "queries are slow", "fix N+1"
- ✅ Need to improve query performance (target: <100ms)

---

## What This Skill Does

**Optimizes queries by**:
1. **Detecting N+1 problems** - Finds queries in loops
2. **Adding indexes** - Creates indexes on frequently queried columns
3. **Eager loading** - Loads related data in single query (JOIN)
4. **Query rewriting** - Optimizes SELECT, WHERE, JOIN clauses
5. **Pagination** - Adds LIMIT/OFFSET for large result sets
6. **Caching strategy** - Suggests Redis caching for read-heavy queries
7. **Query analysis** - EXPLAIN ANALYZE for query plans
8. **Benchmarking** - Before/after performance metrics

---

## Supported Technologies

### Databases
- **PostgreSQL** (recommended) - Advanced indexing, EXPLAIN ANALYZE
- **MySQL** - Indexes, query optimization
- **MongoDB** - Aggregation pipeline optimization, indexes
- **Redis** - Query result caching

### ORMs
- **SQLAlchemy** (Python) - Eager loading, query optimization
- **Prisma** (Node/Bun/TypeScript) - Include, select optimization
- **TypeORM** (TypeScript) - Relations, query builder
- **Mongoose** (MongoDB) - Population, lean queries
- **Drizzle** (TypeScript) - Type-safe queries

---

## Common Problems & Solutions

### Problem 1: N+1 Query

**Bad (N+1)**:
```python
# SQLAlchemy - Fetches users, then N queries for posts
users = db.query(User).all()  # 1 query
for user in users:
    posts = user.posts  # N queries (lazy loading)
    print(f"{user.name}: {len(posts)} posts")
```

**Good (Eager Loading)**:
```python
# SQLAlchemy - Single query with JOIN
from sqlalchemy.orm import joinedload

users = db.query(User).options(joinedload(User.posts)).all()  # 1 query
for user in users:
    posts = user.posts  # Already loaded, 0 queries
    print(f"{user.name}: {len(posts)} posts")
```

**Prisma (TypeScript)**:
```typescript
// Bad (N+1)
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } });
}

// Good (include)
const users = await prisma.user.findMany({
  include: { posts: true }  // Single query with JOIN
});
```

---

### Problem 2: Missing Indexes

**Symptoms**:
- Slow WHERE clauses
- Slow ORDER BY
- Full table scans (EXPLAIN shows "Seq Scan")

**Solution - Add Indexes**:

```sql
-- PostgreSQL
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Composite index for multiple columns
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Partial index (filtered)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Full-text search index
CREATE INDEX idx_posts_content_fts ON posts USING gin(to_tsvector('english', content));
```

**Migration (Alembic - Python)**:
```python
def upgrade():
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_posts_user_id', 'posts', ['user_id'])
```

**Prisma Schema**:
```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique

  @@index([email])
}

model Post {
  id        Int      @id @default(autoincrement())
  userId    Int
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([createdAt(sort: Desc)])
}
```

---

### Problem 3: SELECT * (Fetching Unnecessary Data)

**Bad**:
```python
# Fetches ALL columns (wasteful)
users = db.query(User).all()
```

**Good**:
```python
# Only fetch needed columns
users = db.query(User.id, User.name, User.email).all()
```

**Prisma**:
```typescript
// Bad
const users = await prisma.user.findMany();

// Good - select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
});
```

---

### Problem 4: No Pagination (Fetching Too Many Rows)

**Bad**:
```python
# Fetches all users (could be 10,000+)
users = db.query(User).all()
```

**Good - Pagination**:
```python
# Fetch 20 users per page
page = 1
page_size = 20
users = db.query(User).offset((page - 1) * page_size).limit(page_size).all()
```

**Prisma**:
```typescript
const page = 1;
const pageSize = 20;

const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
});

const totalCount = await prisma.user.count();
const totalPages = Math.ceil(totalCount / pageSize);
```

---

### Problem 5: Inefficient JOINs

**Bad (Multiple Queries)**:
```sql
-- Query 1: Get orders
SELECT * FROM orders WHERE user_id = 123;

-- Query 2: Get user for each order
SELECT * FROM users WHERE id = 123;

-- Query 3: Get products for each order
SELECT * FROM products WHERE id IN (1, 2, 3);
```

**Good (Single Query with JOINs)**:
```sql
SELECT
  orders.id,
  orders.total,
  users.name AS user_name,
  products.name AS product_name
FROM orders
JOIN users ON orders.user_id = users.id
JOIN order_items ON orders.id = order_items.order_id
JOIN products ON order_items.product_id = products.id
WHERE orders.user_id = 123;
```

**SQLAlchemy**:
```python
from sqlalchemy.orm import joinedload

orders = db.query(Order)\
    .options(
        joinedload(Order.user),
        joinedload(Order.items).joinedload(OrderItem.product)
    )\
    .filter(Order.user_id == 123)\
    .all()
```

---

## Query Analysis Tools

### PostgreSQL EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- Output:
-- Seq Scan on users  (cost=0.00..15.50 rows=1 width=100) (actual time=0.050..0.052 rows=1 loops=1)
--   Filter: (email = 'user@example.com'::text)
-- Planning Time: 0.100 ms
-- Execution Time: 0.080 ms
```

**Interpretation**:
- `Seq Scan` = Full table scan (BAD) → Need index
- `Index Scan` = Using index (GOOD)
- `cost=0.00..15.50` = Estimated cost
- `actual time=0.050..0.052` = Real execution time

**After adding index**:
```sql
CREATE INDEX idx_users_email ON users(email);

EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- Output:
-- Index Scan using idx_users_email on users  (cost=0.15..8.17 rows=1 width=100) (actual time=0.010..0.012 rows=1 loops=1)
--   Index Cond: (email = 'user@example.com'::text)
-- Planning Time: 0.050 ms
-- Execution Time: 0.030 ms
```

**Improvement**: 0.080ms → 0.030ms (2.7x faster)

---

## Caching Strategy

### Redis for Read-Heavy Queries

```python
import redis
import json

cache = redis.Redis(host='localhost', port=6379, db=0)

def get_user(user_id: int):
    # Check cache first
    cache_key = f"user:{user_id}"
    cached = cache.get(cache_key)
    if cached:
        return json.loads(cached)

    # Cache miss - query database
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        # Cache for 5 minutes
        cache.setex(cache_key, 300, json.dumps(user.to_dict()))

    return user
```

**TypeScript (Node/Bun)**:
```typescript
import { Redis } from 'ioredis';

const redis = new Redis();

async function getUser(userId: number) {
  const cacheKey = `user:${userId}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Query database
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(user));
  }

  return user;
}
```

---

## Best Practices

1. **Always Use Indexes**
   - Index foreign keys (user_id, post_id, etc.)
   - Index frequently queried columns (email, username, status)
   - Index columns in WHERE, ORDER BY, JOIN clauses

2. **Avoid N+1 Queries**
   - Use eager loading (joinedload, include)
   - Batch queries when possible
   - Use DataLoader pattern (GraphQL)

3. **Limit Result Sets**
   - Always paginate large result sets
   - Use LIMIT/OFFSET or cursor pagination
   - Target: <100 rows per query

4. **Select Only Needed Columns**
   - Avoid SELECT *
   - Only fetch columns you'll use
   - Reduces data transfer and memory

5. **Monitor Query Performance**
   - Use EXPLAIN ANALYZE regularly
   - Set up slow query logging (>100ms)
   - Track query metrics (APM tools)

---

## Optimization Checklist

- [ ] **Indexes created** on foreign keys and WHERE clauses
- [ ] **N+1 queries eliminated** with eager loading
- [ ] **Pagination added** for list endpoints
- [ ] **SELECT optimized** (only needed columns)
- [ ] **EXPLAIN ANALYZE run** to verify query plan
- [ ] **Benchmarks collected** (before/after timings)
- [ ] **Caching added** for read-heavy queries (Redis)
- [ ] **Monitoring set up** for slow queries

---

## Integration with Other Skills

- **api-endpoint-builder** - Optimize queries in API routes
- **orm-query-builder** - Generate optimized ORM queries
- **cache-strategy-builder** - Add Redis caching
- **performance-profiler** - Identify slow queries

---

**Skill Version**: 1.0.0
**Databases**: PostgreSQL, MySQL, MongoDB, Redis
**ORMs**: SQLAlchemy, Prisma, TypeORM, Mongoose, Drizzle
**Target**: <100ms query execution, eliminate N+1, add indexes
