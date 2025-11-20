---
name: "API Error Handling (Universal)"
description: "Enforces consistent error handling patterns across REST APIs (FastAPI, Express, Spring Boot, ASP.NET, Django). Auto-activates on: error, exception, http status, 400, 404, 500, try catch, error handling. Prevents inconsistent responses, missing status codes, leaked stack traces, unhandled exceptions. Ensures structured error format (code, message, details), proper status codes (4xx client, 5xx server), logging, validation errors. Tech-agnostic: adapts to Python/TypeScript/Java/C#. Targets: 100% handled exceptions, 0 500 for client errors, <10ms error response time."
---

# API Error Handling (Universal)

**Auto-activates when**: Discussing error handling, HTTP status codes, exceptions, or API responses across ANY backend framework.

**Supports**: FastAPI (Python), Express (TypeScript), Spring Boot (Java), ASP.NET Core (C#), Django (Python), Go (net/http)

---

## 🎯 Mission

Enforce **consistent, structured error responses** across all API endpoints for predictable client error handling and debugging.

---

## 📐 Core Principles

### 1. Structured Error Format

**Rule**: All errors MUST return consistent JSON structure with code, message, and details.

**Universal Format**:
```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": {
      "userId": 123,
      "resource": "users"
    },
    "timestamp": "2025-10-20T14:32:00Z"
  }
}
```

#### FastAPI (Python)
```python
# ✅ CORRECT - Structured error
from fastapi import HTTPException, status

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "code": "USER_NOT_FOUND",
                    "message": f"User {user_id} not found",
                    "details": {"userId": user_id}
                }
            }
        )
    return user
```

#### Express (TypeScript)
```typescript
// ✅ CORRECT - Structured error
app.get('/users/:userId', async (req, res) => {
  const user = await db.getUser(req.params.userId);
  if (!user) {
    return res.status(404).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: `User ${req.params.userId} not found`,
        details: { userId: req.params.userId },
        timestamp: new Date().toISOString(),
      },
    });
  }
  res.json(user);
});
```

#### Spring Boot (Java)
```java
// ✅ CORRECT - Structured error
@GetMapping("/users/{userId}")
public ResponseEntity<?> getUser(@PathVariable Long userId) {
    Optional<User> user = userRepository.findById(userId);
    if (user.isEmpty()) {
        ErrorResponse error = new ErrorResponse(
            "USER_NOT_FOUND",
            "User " + userId + " not found",
            Map.of("userId", userId),
            Instant.now()
        );
        return ResponseEntity.status(404).body(error);
    }
    return ResponseEntity.ok(user.get());
}
```

**Auto-check**:
- [ ] Error responses have structured format (code, message, details)?
- [ ] Error code is machine-readable (SCREAMING_SNAKE_CASE)?
- [ ] Message is human-readable?
- [ ] Timestamp included?

---

### 2. Proper HTTP Status Codes

**Rule**: Use correct status codes: 4xx for client errors, 5xx for server errors.

**Status Code Reference**:

| Code | Meaning | Use Case |
|------|---------|----------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Invalid request body, validation failure |
| **401** | Unauthorized | Missing or invalid authentication |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource already exists, concurrency conflict |
| **422** | Unprocessable | Valid syntax but semantic error (Pydantic) |
| **500** | Internal Error | Unexpected server error |
| **503** | Service Unavailable | Temporary outage, rate limit |

#### FastAPI Example
```python
# ❌ WRONG - 500 for client error
@app.post("/users")
async def create_user(user: UserCreate):
    if await db.email_exists(user.email):
        raise Exception("Email exists")  # Returns 500! Wrong!

# ✅ CORRECT - 409 for conflict
@app.post("/users", status_code=201)
async def create_user(user: UserCreate):
    if await db.email_exists(user.email):
        raise HTTPException(
            status_code=409,  # Conflict
            detail={"error": {
                "code": "EMAIL_ALREADY_EXISTS",
                "message": f"Email {user.email} already registered"
            }}
        )
    return await db.create_user(user)
```

**Auto-check**:
- [ ] Client errors use 4xx (not 500)?
- [ ] Server errors use 5xx?
- [ ] 404 for missing resources (not 400)?
- [ ] 409 for conflicts (not 400)?

---

### 3. No Leaked Stack Traces in Production

**Rule**: NEVER expose stack traces in production responses.

#### FastAPI
```python
# ❌ WRONG - Stack trace leaked
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.get_user(user_id)
    return user  # If error, stack trace returned!

# ✅ CORRECT - Global exception handler
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)  # Log stack trace
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                # NO stack trace here!
            }
        }
    )
```

#### Express
```typescript
// ✅ CORRECT - Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled exception', { error: err.stack });  // Log, don't return
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred',
      // Stack trace only in dev, never production
    },
  });
});
```

**Auto-check**:
- [ ] Global exception handler registered?
- [ ] Stack traces logged (not returned in response)?
- [ ] Production responses hide internal details?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Inconsistent Error Shapes

```typescript
// ❌ ANTI-PATTERN - Different error formats
app.get('/user1', (req, res) => {
  res.status(404).json({ error: 'Not found' });  // String
});

app.get('/user2', (req, res) => {
  res.status(404).json({ message: 'User missing', code: 404 });  // Different keys
});

app.get('/user3', (req, res) => {
  res.status(404).send('Not found');  // Plain text!
});
```

**Why**: Inconsistent errors break client error handling logic.

---

### 2. 500 for Client Errors

```python
# ❌ ANTI-PATTERN - Wrong status code
@app.post("/users")
async def create_user(user: UserCreate):
    if not user.email:
        raise Exception("Email required")  # Returns 500, should be 400!
```

**Why**: 500 = server fault. 400 = client fault. Distinguish for proper error handling.

---

### 3. Generic Error Messages

```java
// ❌ ANTI-PATTERN - Vague error
if (user == null) {
    throw new RuntimeException("Error");  // What error?
}

// ✅ CORRECT - Specific error
if (user == null) {
    throw new UserNotFoundException(
        "USER_NOT_FOUND",
        "User with ID " + userId + " not found",
        Map.of("userId", userId)
    );
}
```

**Why**: Generic messages make debugging impossible.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] All error responses have structured format (code, message)?
- [ ] Status codes correct (4xx client, 5xx server)?
- [ ] No stack traces in production responses?
- [ ] Global exception handler registered?

### High Priority
- [ ] Error codes machine-readable (SCREAMING_SNAKE_CASE)?
- [ ] Messages human-readable and specific?
- [ ] 404 for missing resources (not 500)?
- [ ] Validation errors return 400 or 422 (not 500)?

### Medium Priority
- [ ] Timestamp included in errors?
- [ ] Details field provides context?
- [ ] Errors logged with stack traces server-side?
- [ ] Custom error classes for common cases?

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `{{ProjectStructure}}/exceptions.{{ext}}` | Custom exception classes |
| `{{ProjectStructure}}/middleware/error_handler.{{ext}}` | Global error middleware |
| `docs/API_ERROR_CODES.md` | Complete error code reference |
| `{{ProjectStructure}}/models/error_response.{{ext}}` | Error response schema |

---

## 🎯 Activation Criteria

**Keywords**: "error", "exception", "http status", "400", "404", "500", "try catch", "error handling", "HTTPException"

**Auto-suggest when**:
- User creates new API endpoint
- User adds try/catch or error handling
- User mentions status codes or exceptions
- User discusses validation or error responses

---

## 🔧 Tech Stack Adaptations

**This skill adapts to**:

| Tech Stack | Exception Type | Status Code Constant | Error Handler |
|------------|----------------|----------------------|---------------|
| **FastAPI** | `HTTPException` | `status.HTTP_*` | `@app.exception_handler(Exception)` |
| **Express** | `throw new Error()` | `404`, `500` | `app.use((err, req, res, next) => {})` |
| **Spring Boot** | `ResponseStatusException` | `HttpStatus.*` | `@ControllerAdvice` |
| **Django** | `Http404`, `ValidationError` | `status.HTTP_*` | Custom middleware |
| **ASP.NET Core** | `HttpResponseException` | `StatusCodes.*` | `UseExceptionHandler()` |
| **Go** | `http.Error()` | `http.StatusNotFound` | Middleware func |

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Error Handling Coverage**: 100% (all endpoints use structured errors)
