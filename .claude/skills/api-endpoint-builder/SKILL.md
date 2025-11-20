---
name: api-endpoint-builder
description: |
  This skill builds REST and GraphQL API endpoints with validation, error handling, and documentation.
  Supports Python (FastAPI, Flask), Node.js (Express, Fastify, Hono), Bun, and Go (Gin, Echo).
  Generates request/response validation (Pydantic, Zod), OpenAPI docs, error responses, and tests.
  Activate when user says "create API endpoint", "add REST route", "build GraphQL resolver", or needs CRUD operations.
  Output: Production-ready endpoint code with validation, error handling, tests, and documentation.
---

# API Endpoint Builder

> **Purpose**: Generate production-ready API endpoints with validation, error handling, and documentation

---

## When to Use This Skill

Activate when:
- ✅ User wants to create REST API endpoints (GET, POST, PUT, DELETE)
- ✅ User needs GraphQL resolvers/mutations
- ✅ Building CRUD operations for a resource
- ✅ Adding new routes to existing API
- ✅ Need request/response validation
- ✅ Requests like: "create user endpoint", "add product API", "build order routes"

---

## What This Skill Does

**Generates complete API endpoints with**:
1. **Route handler** - HTTP method, path, parameters
2. **Request validation** - Body, query params, headers (Pydantic/Zod)
3. **Response schema** - Typed responses with status codes
4. **Error handling** - Standardized error responses (400, 404, 500)
5. **Database integration** - ORM queries (Prisma, SQLAlchemy)
6. **Authentication** - JWT/session checks if needed
7. **Documentation** - OpenAPI/Swagger annotations
8. **Tests** - Unit tests for endpoint logic

---

## Supported Technologies

### Python
- **FastAPI** (recommended) - Async, Pydantic validation, auto OpenAPI
- **Flask** - Lightweight, Flask-RESTful extension
- **Django REST Framework** - Full-featured with serializers

### Node.js / Bun
- **Hono** (recommended for Bun) - Fast, TypeScript-first
- **Express** - Classic, middleware-based
- **Fastify** - High performance, schema validation
- **NestJS** - Enterprise, decorator-based

### Go
- **Gin** - Fast HTTP framework
- **Echo** - Minimalist, high performance
- **Fiber** - Express-inspired

---

## Output Format

### REST Endpoint Structure

**FastAPI (Python)**:
```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

# Request schemas
class UserCreate(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2, max_length=100)

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: str

    class Config:
        from_attributes = True

# Endpoints
@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """Create a new user with validation"""
    # Check if user exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.get("/", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List users with pagination"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user.dict().items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete user"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return None
```

**Hono (Bun/Node)**:
```typescript
import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from './database';
import { users } from './schema';
import { eq } from 'drizzle-orm';

const app = new Hono();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100)
});

const userResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string()
});

// Endpoints
app.post('/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json');

  // Check if user exists
  const existing = await db.select().from(users).where(eq(users.email, data.email)).get();
  if (existing) {
    return c.json({ error: 'Email already registered' }, 400);
  }

  // Create user
  const user = await db.insert(users).values(data).returning().get();

  return c.json(user, 201);
});

app.get('/users/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  const user = await db.select().from(users).where(eq(users.id, id)).get();
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user);
});

app.get('/users', async (c) => {
  const skip = parseInt(c.req.query('skip') || '0');
  const limit = parseInt(c.req.query('limit') || '100');

  const userList = await db.select().from(users).limit(limit).offset(skip).all();

  return c.json(userList);
});

export default app;
```

---

## Best Practices

1. **Validation First**
   - Validate all inputs (body, query, params, headers)
   - Use type-safe schemas (Pydantic, Zod)
   - Return clear validation errors (400 Bad Request)

2. **Error Handling**
   - Use standard HTTP status codes
   - Return consistent error format
   ```json
   {
     "error": "User not found",
     "code": "USER_NOT_FOUND",
     "status": 404
   }
   ```

3. **Security**
   - Authenticate protected endpoints
   - Validate authorization (user owns resource)
   - Sanitize inputs (prevent SQL injection, XSS)
   - Rate limit endpoints

4. **Performance**
   - Use pagination for list endpoints (skip/limit)
   - Optimize database queries (avoid N+1)
   - Add caching for read-heavy endpoints (Redis)

5. **Documentation**
   - Add docstrings/comments
   - Generate OpenAPI/Swagger docs
   - Include request/response examples

---

## Common Patterns

### CRUD Operations
```
POST   /resources        → Create
GET    /resources/:id    → Read one
GET    /resources        → Read list (with pagination)
PUT    /resources/:id    → Update
DELETE /resources/:id    → Delete
```

### Nested Resources
```
GET /users/:userId/posts           → User's posts
POST /users/:userId/posts          → Create post for user
GET /posts/:postId/comments        → Post comments
```

### Filtering & Search
```
GET /products?category=electronics&min_price=100&max_price=500
GET /users?search=john&role=admin&sort=created_at&order=desc
```

### Bulk Operations
```
POST /users/bulk       → Create multiple users
DELETE /users/bulk     → Delete multiple users
```

---

## Tests

**Always generate tests for endpoints**:

```python
# test_users.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users", json={
        "email": "test@example.com",
        "password": "password123",
        "name": "Test User"
    })
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"

def test_create_user_duplicate_email():
    # Create first user
    client.post("/users", json={
        "email": "duplicate@example.com",
        "password": "password123",
        "name": "User One"
    })

    # Try to create duplicate
    response = client.post("/users", json={
        "email": "duplicate@example.com",
        "password": "password456",
        "name": "User Two"
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_get_user_not_found():
    response = client.get("/users/99999")
    assert response.status_code == 404
```

---

## Integration with Other Skills

- **data-validator-generator** - Creates Pydantic/Zod schemas
- **database-query-optimizer** - Optimizes ORM queries
- **auth-flow-builder** - Adds JWT/OAuth authentication
- **test-suite-generator** - Generates comprehensive tests
- **api-integration-layer** (frontend) - Creates client for these endpoints

---

**Skill Version**: 1.0.0
**Technologies**: Python (FastAPI, Flask), Node/Bun (Hono, Express, Fastify), Go (Gin, Echo)
**Output**: Complete API endpoints with validation, error handling, tests, and docs
