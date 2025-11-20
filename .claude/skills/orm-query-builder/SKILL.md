---
name: orm-query-builder
description: |
  This skill generates optimized ORM queries with relationships, filtering, and type safety.
  Supports SQLAlchemy (Python), Prisma (TypeScript), TypeORM (TypeScript), Drizzle (TypeScript), Django ORM.
  Creates queries with eager loading, filtering, sorting, pagination, transactions, type-safe query builders.
  Activate when user says "ORM query", "database query", "SQLAlchemy query", "Prisma query", or needs database access.
  Output: Type-safe ORM queries with relationships, filtering, optimization, and error handling.
---

# ORM Query Builder

> **Purpose**: Generate optimized, type-safe ORM queries with relationships

---

## When to Use

- ✅ Query database using ORM (not raw SQL)
- ✅ Fetch related data (JOIN operations)
- ✅ Filter, sort, paginate results
- ✅ User says: "ORM query", "database query", "fetch users with posts"

---

## Prisma (TypeScript)

```typescript
// Fetch user with related posts
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    },
    profile: true
  }
});

// Create with relations
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' }
      ]
    }
  },
  include: { posts: true }
});

// Update with nested operations
await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      deleteMany: { published: false },
      updateMany: {
        where: { views: { lt: 100 } },
        data: { featured: false }
      }
    }
  }
});

// Transaction
await prisma.$transaction([
  prisma.user.create({ data: { email: 'user1@example.com' } }),
  prisma.user.create({ data: { email: 'user2@example.com' } })
]);

// Aggregations
const stats = await prisma.post.aggregate({
  _count: true,
  _avg: { views: true },
  _max: { createdAt: true },
  where: { published: true }
});
```

---

## SQLAlchemy (Python)

```python
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy import select, and_, or_

# Eager loading (avoid N+1)
user = db.query(User)\
    .options(
        joinedload(User.posts),
        selectinload(User.profile)
    )\
    .filter(User.id == 1)\
    .first()

# Complex filtering
users = db.query(User)\
    .filter(
        and_(
            User.active == True,
            or_(
                User.role == 'admin',
                User.created_at > datetime(2023, 1, 1)
            )
        )
    )\
    .order_by(User.created_at.desc())\
    .limit(20)\
    .all()

# Create with relations
user = User(
    email='user@example.com',
    posts=[
        Post(title='Post 1'),
        Post(title='Post 2')
    ]
)
db.add(user)
db.commit()

# Transaction
try:
    user1 = User(email='user1@example.com')
    user2 = User(email='user2@example.com')
    db.add_all([user1, user2])
    db.commit()
except Exception:
    db.rollback()
    raise

# Aggregations
from sqlalchemy import func

stats = db.query(
    func.count(Post.id).label('total'),
    func.avg(Post.views).label('avg_views'),
    func.max(Post.created_at).label('latest')
).filter(Post.published == True).first()
```

---

**Skill Version**: 1.0.0
**Technologies**: Prisma, SQLAlchemy, TypeORM, Drizzle, Django ORM
**Output**: Type-safe queries with relationships, filtering, transactions
