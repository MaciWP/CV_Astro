---
name: "FastAPI Endpoint Validation"
description: "Enforces FastAPI endpoint best practices with Pydantic validation in Python projects. Auto-activates on: fastapi, endpoint, route, pydantic, validation, request, response. Prevents missing validation (raw dict), inconsistent responses, unhandled exceptions, missing status codes. Ensures Pydantic models for requests/responses, dependency injection, HTTPException usage, async/await patterns. Validates model inheritance (BaseModel), status codes (201, 400, 404, 500), OpenAPI docs. Targets: 100% validated endpoints, 0 raw dicts, <50ms validation overhead."
---

# FastAPI Endpoint Validation

**Auto-activates when**: Discussing FastAPI endpoints, routes, Pydantic models, or API validation in Python projects.

---

## 🎯 Mission

Enforce **Pydantic validation** on all FastAPI endpoints for type-safe, self-documenting APIs with automatic OpenAPI generation.

---

## 📐 Core Principles

### 1. Pydantic Models for Requests

**Rule**: All request bodies MUST use Pydantic BaseModel, never raw dicts.

```python
# ❌ WRONG - No validation
from fastapi import FastAPI

app = FastAPI()

@app.post("/users")
async def create_user(user: dict):  # No validation!
    # Any data shape allowed - security risk!
    return {"id": 1, "name": user.get("name")}

# ✅ CORRECT - Pydantic validation
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field

app = FastAPI()

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=18, le=120)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "age": 25
            }
        }

@app.post("/users", status_code=201)
async def create_user(user: UserCreate):
    # Validation automatic! Invalid data = 422 response
    return {"id": 1, "name": user.name, "email": user.email}
```

**Auto-check**:
- [ ] Endpoint uses Pydantic BaseModel (not dict)?
- [ ] Fields have validation (min_length, ge, regex)?
- [ ] Example data in Config.json_schema_extra?

---

### 2. Response Models

**Rule**: Specify response_model for type-safe responses and OpenAPI docs.

```python
# ❌ WRONG - Untyped response
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id, "name": "John"}  # Shape not enforced!

# ✅ CORRECT - Typed response model
from pydantic import BaseModel

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True  # For ORM models

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    # FastAPI validates response matches UserResponse
    user = await db.get_user(user_id)
    return user  # Pydantic converts ORM → dict
```

**Auto-check**:
- [ ] Endpoint has response_model parameter?
- [ ] Response model inherits BaseModel?
- [ ] Response matches model shape (auto-validated)?

---

### 3. HTTPException for Errors

**Rule**: Use HTTPException with status codes, never raw raise Exception.

```python
# ❌ WRONG - Generic exception
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.get_user(user_id)
    if not user:
        raise Exception("User not found")  # 500 error! Wrong code

# ✅ CORRECT - HTTPException with proper status
from fastapi import HTTPException, status

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    user = await db.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found",
        )
    return user
```

**Auto-check**:
- [ ] Uses HTTPException (not Exception)?
- [ ] Status code appropriate (404, 400, 401, 403, 500)?
- [ ] Detail message descriptive?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Missing Validation

```python
# ❌ ANTI-PATTERN - No type hints
@app.post("/users")
async def create_user(name, email):  # No types!
    return {"id": 1, "name": name}

# ❌ ANTI-PATTERN - Raw dict
@app.post("/users")
async def create_user(user: dict):  # dict allows anything!
    return {"id": 1}
```

**Why**: No validation = security risk, bugs, unclear API contract.

---

### 2. Inconsistent Responses

```python
# ❌ ANTI-PATTERN - Inconsistent shape
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    if user_id == 1:
        return {"id": 1, "name": "John"}
    else:
        return {"user_id": 2, "full_name": "Jane"}  # Different keys!
```

**Why**: Inconsistent responses break client code, hard to document.

---

### 3. Blocking I/O in Async

```python
# ❌ ANTI-PATTERN - Blocking call in async
import time

@app.get("/slow")
async def slow_endpoint():
    time.sleep(5)  # Blocks event loop! Kills performance
    return {"status": "done"}

# ✅ CORRECT - Non-blocking async
import asyncio

@app.get("/fast")
async def fast_endpoint():
    await asyncio.sleep(5)  # Non-blocking, allows concurrency
    return {"status": "done"}
```

**Why**: Blocking calls in async endpoints destroy concurrency benefits.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] All request bodies use Pydantic BaseModel (not dict)?
- [ ] All endpoints have response_model?
- [ ] HTTPException used (not raw Exception)?
- [ ] Status codes correct (201, 400, 404, 422, 500)?

### High Priority
- [ ] Pydantic models have Field() validation?
- [ ] Models have json_schema_extra examples?
- [ ] No blocking I/O in async endpoints (time.sleep, requests.get)?
- [ ] Database calls use async (await db.query)?

### Medium Priority
- [ ] OpenAPI docs auto-generated (/docs endpoint)?
- [ ] Response models use from_attributes for ORM?
- [ ] Dependency injection used (Depends())?
- [ ] Router organization (APIRouter, not global app)?

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `app/models/` | Pydantic request/response models |
| `app/routes/` | Endpoint routers by domain |
| `app/dependencies/` | Dependency injection functions |
| `app/exceptions.py` | Custom HTTPException classes |
| `docs/API_STANDARDS.md` | API design guidelines |

---

## 🎯 Activation Criteria

**Keywords**: "fastapi", "endpoint", "route", "pydantic", "validation", "request", "response", "@app.post", "@app.get"

**Auto-suggest when**:
- User creates new FastAPI endpoint
- User adds request/response handling
- User mentions validation or API design
- User discusses status codes or errors

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Validation Coverage**: 100% (all endpoints use Pydantic)
