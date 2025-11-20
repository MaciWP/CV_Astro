---
name: auth-flow-builder
description: |
  This skill builds complete authentication flows (JWT, OAuth, session-based) with security best practices.
  Supports Python (FastAPI, Flask), Node.js/Bun (Hono, Express), and includes registration, login, logout, refresh tokens, password reset.
  Implements bcrypt/argon2 hashing, JWT signing/verification, session management, CSRF protection, rate limiting.
  Activate when user says "add authentication", "build login", "JWT auth", "OAuth integration", or needs secure auth.
  Output: Complete auth system with endpoints, middleware, security, tests, and documentation.
---

# Auth Flow Builder

> **Purpose**: Build secure authentication systems with best practices

---

## When to Use This Skill

Activate when:
- ✅ User needs authentication for their app
- ✅ Building login/registration/logout flows
- ✅ Implementing JWT or session-based auth
- ✅ OAuth integration (Google, GitHub, etc.)
- ✅ Password reset/email verification
- ✅ User says: "add auth", "build login", "secure API", "protect routes"

---

## What This Skill Does

**Generates complete auth system with**:
1. **Registration** - Create account with validation
2. **Login** - Email/password authentication
3. **Logout** - Session invalidation
4. **Refresh tokens** - JWT token renewal
5. **Password reset** - Email-based reset flow
6. **Email verification** - Confirm email addresses
7. **OAuth integration** - Google, GitHub, etc.
8. **Protected routes** - Middleware for auth checks
9. **Security** - Password hashing, CSRF protection, rate limiting

---

## Supported Technologies

### Backend Frameworks
- **FastAPI** (Python) - Async, modern, built-in OAuth2
- **Flask** (Python) - Lightweight, Flask-Login extension
- **Hono** (Bun/Node) - Fast, TypeScript-first
- **Express** (Node.js) - Classic with Passport.js

### Auth Strategies
- **JWT** (recommended) - Stateless, scalable
- **Session-based** - Server-side sessions (Redis/database)
- **OAuth 2.0** - Third-party providers (Google, GitHub)

### Security Libraries
- **bcrypt / argon2** - Password hashing
- **PyJWT / jsonwebtoken** - JWT signing/verification
- **python-jose** - JWT + OAuth (FastAPI)
- **Passport.js** - Node.js authentication middleware

---

## Auth Flow Patterns

### Pattern 1: JWT Authentication (Stateless)

**Flow**:
```
1. User registers → Hash password → Save to DB
2. User logs in → Verify password → Generate JWT access + refresh tokens
3. Client stores tokens (localStorage/cookie)
4. Client sends access token in Authorization header
5. Server verifies token → Extract user ID → Process request
6. Access token expires → Client uses refresh token → Get new access token
```

**FastAPI Implementation**:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import secrets

router = APIRouter(prefix="/auth", tags=["auth"])

# Configuration
SECRET_KEY = secrets.token_urlsafe(32)  # Store in env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        token_type: str = payload.get("type")

        if user_id is None or token_type != "access":
            raise credentials_exception

        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception

    return user

# Endpoints
@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(user: UserRegister, db: Session = Depends(get_db)):
    """Register new user"""
    # Check if user exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Generate tokens
    access_token = create_access_token(data={"sub": db_user.id})
    refresh_token = create_refresh_token(data={"sub": db_user.id})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with email and password"""
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate tokens
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)

@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        token_type: str = payload.get("type")

        if user_id is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        # Generate new access token
        access_token = create_access_token(data={"sub": user_id})

        return TokenResponse(access_token=access_token, refresh_token=refresh_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name
    }

# Protected route example
@router.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    """Example protected route"""
    return {"message": f"Hello {current_user.name}, you are authenticated!"}
```

---

### Pattern 2: Session-Based Auth (Stateful)

**Hono + Redis Session**:

```typescript
import { Hono } from 'hono';
import { createClient } from 'redis';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono();
const redis = createClient({ url: 'redis://localhost:6379' });
await redis.connect();

// Session middleware
app.use('*', async (c, next) => {
  const sessionId = c.req.cookie('session_id');
  if (sessionId) {
    const userId = await redis.get(`session:${sessionId}`);
    if (userId) {
      c.set('userId', parseInt(userId));
    }
  }
  await next();
});

// Registration
app.post('/auth/register', async (c) => {
  const { email, password, name } = await c.req.json();

  // Check if user exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return c.json({ error: 'Email already registered' }, 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await db.user.create({
    data: { email, name, hashedPassword }
  });

  // Create session
  const sessionId = uuidv4();
  await redis.setEx(`session:${sessionId}`, 3600 * 24 * 7, user.id.toString());  // 7 days

  // Set cookie
  c.header('Set-Cookie', `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${3600 * 24 * 7}`);

  return c.json({ id: user.id, email: user.email, name: user.name }, 201);
});

// Login
app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();

  // Find user
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  // Verify password
  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  // Create session
  const sessionId = uuidv4();
  await redis.setEx(`session:${sessionId}`, 3600 * 24 * 7, user.id.toString());

  // Set cookie
  c.header('Set-Cookie', `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${3600 * 24 * 7}`);

  return c.json({ id: user.id, email: user.email, name: user.name });
});

// Logout
app.post('/auth/logout', async (c) => {
  const sessionId = c.req.cookie('session_id');
  if (sessionId) {
    await redis.del(`session:${sessionId}`);
  }

  c.header('Set-Cookie', `session_id=; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
  return c.json({ message: 'Logged out successfully' });
});

// Protected route
app.get('/auth/me', async (c) => {
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  return c.json({ id: user.id, email: user.email, name: user.name });
});

// Auth middleware for protected routes
const requireAuth = async (c, next) => {
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};

app.get('/protected', requireAuth, async (c) => {
  return c.json({ message: 'You are authenticated!' });
});
```

---

## Security Best Practices

### 1. Password Hashing (bcrypt/argon2)

```python
# NEVER store plain passwords
# BAD
user.password = "password123"  # ❌ Plain text

# GOOD
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed = pwd_context.hash("password123")  # ✅ Hashed
user.hashed_password = hashed

# Verify
pwd_context.verify("password123", user.hashed_password)  # True
```

### 2. JWT Best Practices

- ✅ Use strong secret key (32+ characters, random)
- ✅ Set expiration (15-30 min access, 7 days refresh)
- ✅ Include token type in payload (access vs refresh)
- ✅ Validate token type on each endpoint
- ❌ Never store sensitive data in JWT (it's not encrypted)
- ✅ Use HTTPS only (prevent token interception)

### 3. Rate Limiting (Prevent Brute Force)

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/login")
@limiter.limit("5/minute")  # Max 5 login attempts per minute
async def login(...):
    ...
```

### 4. CSRF Protection (Session-based auth)

```typescript
// Generate CSRF token
const csrfToken = uuidv4();
await redis.setEx(`csrf:${sessionId}`, 3600, csrfToken);

// Verify CSRF token on POST/PUT/DELETE
app.post('/protected', async (c) => {
  const sessionId = c.req.cookie('session_id');
  const csrfToken = c.req.header('X-CSRF-Token');

  const storedToken = await redis.get(`csrf:${sessionId}`);
  if (csrfToken !== storedToken) {
    return c.json({ error: 'Invalid CSRF token' }, 403);
  }

  // Process request
});
```

### 5. HTTP-Only Cookies (Prevent XSS)

```typescript
// Set HttpOnly flag (JavaScript can't access)
c.header('Set-Cookie', `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict`);
```

---

## Password Reset Flow

```python
import secrets
from datetime import datetime, timedelta

@router.post("/forgot-password")
async def forgot_password(email: EmailStr, db: Session = Depends(get_db)):
    """Send password reset email"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Don't reveal if email exists (security)
        return {"message": "If email exists, reset link sent"}

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)

    # Save token to database
    db.query(User).filter(User.id == user.id).update({
        "reset_token": reset_token,
        "reset_token_expires": expires_at
    })
    db.commit()

    # Send email (use SendGrid, AWS SES, etc.)
    reset_link = f"https://example.com/reset-password?token={reset_token}"
    send_email(user.email, "Password Reset", f"Click here: {reset_link}")

    return {"message": "If email exists, reset link sent"}

@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    """Reset password with token"""
    user = db.query(User).filter(
        User.reset_token == token,
        User.reset_token_expires > datetime.utcnow()
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Update password
    user.hashed_password = hash_password(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {"message": "Password reset successfully"}
```

---

## Integration with Other Skills

- **api-endpoint-builder** - Create auth endpoints
- **data-validator-generator** - Validate login/register inputs
- **rate-limiter-implementer** - Protect auth routes from brute force
- **email-template-builder** - Send verification/reset emails

---

**Skill Version**: 1.0.0
**Auth Types**: JWT (stateless), Session-based (stateful), OAuth 2.0
**Security**: bcrypt, JWT, CSRF, rate limiting, HTTP-only cookies
**Output**: Complete auth system with registration, login, logout, refresh, password reset
