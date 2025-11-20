# Quick Style Fixes

**Common violations and instant fixes**

---

## Fix 1: Remove Obvious Comments

**Before**:
```python
# Create user
user = User.objects.create(email=email)
# Send email
send_email(user)
```

**After**:
```python
user = User.objects.create(email=email)
send_email(user)
```

---

## Fix 2: Add Type Hints

**Before**:
```python
def get_users(status):
    return User.objects.filter(status=status)
```

**After**:
```python
from django.db.models import QuerySet

def get_users(status: str) -> QuerySet[User]:
    return User.objects.filter(status=status)
```

---

## Fix 3: Add __all__

**Before**:
```python
# apps/core/services.py

class UserService:
    pass
```

**After**:
```python
# apps/core/services.py

__all__ = ["UserService"]

class UserService:
    pass
```

---

## Fix 4: Organize Imports

**Before**:
```python
from apps.core.models import User
from django.db import models
import os
```

**After**:
```python
import os

from django.db import models

from apps.core.models import User
```

**Tool**: `isort apps/core/services.py`

---

**Speed**: Most fixes automated with tools
