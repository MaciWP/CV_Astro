# YOLO Philosophy - Complete Guide

**Why minimal/NO comments in Binora Backend**

**Reference**: `CLAUDE.md` and `.claude/core/code-style.md`

---

## Core Principle

**Code should be self-explanatory. Comments are a code smell.**

---

## Why YOLO?

**1. Comments lie**:
```python
# Increment counter
counter -= 1  # Code changed, comment didn't!
```

**2. Comments clutter**:
```python
# ❌ 50% of lines are comments
# Create user
user = User.objects.create(email=email)
# Send email
send_email(user)
# Log event
log_event(user)
# Return user
return user

# ✅ Clear without comments
user = User.objects.create(email=email)
send_email(user)
log_event(user)
return user
```

**3. Comments hide bad code**:
```python
# ❌ Comment needed because code unclear
# Get all active users that haven't been emailed
users = User.objects.filter(is_active=True, last_email_sent__isnull=True)

# ✅ Self-explanatory
users = User.objects.get_users_pending_email()
```

---

## When Comments ARE Allowed

**ONLY for**:
1. Complex algorithms
2. Security-critical code
3. Workarounds for external bugs
4. Legal/license info

**Examples**:

```python
# ✅ OK - Complex algorithm
# Binary search: O(log n) vs O(n) due to 10M+ records
# Tested with 50M records, avg 15ms vs 2000ms
def find_user_optimized(user_id):
    ...

# ✅ OK - Security-critical
# SECURITY: Rate limit per IP to prevent brute force
# Max 5 attempts per minute per IP address
def login(request):
    ...

# ✅ OK - External bug workaround
# WORKAROUND: Django 5.0 bug #12345
# Remove when upgrading to 5.1+
# See: https://code.djangoproject.com/ticket/12345
if DJANGO_VERSION < (5, 1):
    ...
```

---

## YOLO in Tests

**Tests have ZERO docstrings or comments**:

```python
# ❌ FORBIDDEN
def test_create_user():
    """Test creating a user."""  # NO!
    # Arrange  # NO!
    ...

# ✅ CORRECT
def test_create_user_with_valid_email_succeeds():
    user = user_factory(email="test@example.com")
    assert user.email == "test@example.com"
```

**Test names must be self-explanatory**

---

## How to Write Self-Explanatory Code

**1. Descriptive names**:
```python
# ❌ Needs comment
# Get users
u = User.objects.filter(a=True)

# ✅ Self-explanatory
active_users = User.objects.filter(is_active=True)
```

**2. Extract methods**:
```python
# ❌ Needs comment
if user.is_active and not user.email_verified and user.created_at > threshold:
    # Complex condition needs explanation

# ✅ Self-explanatory
if user.needs_email_verification_reminder():
    ...
```

**3. Type hints**:
```python
# ❌ Unclear
def process(data):
    ...

# ✅ Clear
def process(data: Dict[str, List[User]]) -> QuerySet[Asset]:
    ...
```

---

**Rule**: If you need a comment, refactor the code first
