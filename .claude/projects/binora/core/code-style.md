# Code Style Guide - Binora Backend

Python code style conventions for Django 5.0 + DRF 3.14 multi-tenant backend.

---

## Module Exports (`__all__`)

### When to Use `__all__`

**✅ USE `__all__` when:**

1. **`__init__.py` that re-exports from submodules**
   ```python
   # apps/core/serializers/__init__.py
   from .user import UserCreateSerializer
   from .user import UserSerializer
   from .user import UserUpdateSerializer

   __all__ = [
       "UserSerializer",
       "UserCreateSerializer",
       "UserUpdateSerializer",
   ]
   ```

2. **Module has 3+ public exports**
   - Documents API clearly
   - Helps IDE autocompletion

3. **Want to hide internal imports**
   ```python
   # Without __all__, these would be exported:
   from typing import Any, Dict  # ❌ Would be public
   from django.db import models  # ❌ Would be public

   # Helper functions
   def _internal_helper():  # ❌ Would be public
       pass

   # With __all__, only export what you want:
   __all__ = ["PublicClass"]
   ```

**❌ DO NOT USE `__all__` when:**

1. **Monolithic files** (`serializers.py`, `views.py`)
   - Single file with all classes
   - No `__init__.py` re-exporting

2. **Empty `__init__.py`**
   - No exports to document

3. **Only 1-2 exports**
   - Overkill for small modules

### Format

```python
# ✅ GOOD - imports first, __all__ at end
from .user import UserCreateSerializer
from .user import UserSerializer
from .user import UserUpdateSerializer

__all__ = [
    "UserSerializer",           # Alphabetical order
    "UserCreateSerializer",
    "UserUpdateSerializer",
]
```

```python
# ❌ BAD - __all__ before imports (less readable)
__all__ = ["UserSerializer"]

from .user import UserSerializer
```

### Current Project Usage

```bash
# ✅ Using __all__:
apps/core/serializers/__init__.py
apps/assets/serializers/__init__.py
apps/core/views/__init__.py
apps/assets/views/__init__.py
apps/hierarchy/views/__init__.py

# ❌ Not using __all__ (correct):
apps/frontend/serializers.py  # Monolithic file
apps/processes/serializers.py # Empty
apps/library/serializers.py   # Empty
```

### Benefits

1. ✅ **Documents public API** - Clear what should be imported
2. ✅ **Better IDE support** - Autocomplete shows only public items
3. ✅ **Prevents accidental exports** - Internal imports stay internal
4. ✅ **Python standard (PEP 8)** - Recommended way to define module API
5. ✅ **Tools respect it** - Sphinx, mypy, type checkers use `__all__`

---

## Import Organization

### Order

1. Standard library
2. Third-party packages (Django, DRF, etc.)
3. Local imports (apps.*)

```python
# ✅ GOOD
import logging
from typing import Any, Dict

from django.conf import settings
from rest_framework import serializers

from apps.core.models import User
from apps.core.serializers.auth import UserMeSerializer
```

### Import Style

```python
# ✅ GOOD - Explicit imports
from apps.core.models import User
from apps.core.models import Team

# ❌ BAD - Star imports (except in __init__.py with __all__)
from apps.core.models import *
```

---

## Type Hints

**REQUIRED on all functions** - Parameters and return values

```python
# ✅ GOOD
def create_user(email: str, first_name: str, company: Company) -> User:
    pass

# ❌ BAD
def create_user(email, first_name, company):
    pass
```

### Complex Types

```python
from typing import Any, Dict, List, Optional

def update_user(data: Dict[str, Any]) -> Optional[User]:
    pass

def get_users() -> List[User]:
    pass
```

---

## Comments Policy (YOLO Philosophy)

**Code should be self-explanatory** - Minimal or NO comments

### ❌ DO NOT Comment

```python
# ❌ Obvious comments
user = User.objects.get(email=email)  # Get user by email

# ❌ Comments in tests
def test_create_user_succeeds():
    """Test that creating a user succeeds."""  # NO DOCSTRINGS IN TESTS
    # Arrange
    data = {"email": "test@example.com"}
    # Act
    user = User.objects.create(**data)
    # Assert
    assert user.email == data["email"]
```

### ✅ ONLY Comment When

1. **Non-obvious algorithms** with complexity
2. **Security-critical details** requiring explanation
3. **Complex business logic** that can't be simplified
4. **TODOs** with context

```python
# ✅ Good comment - explains WHY
# Disable email uniqueness validator because service handles
# user reuse logic for multi-tenant scenarios
extra_kwargs = {
    "email": {"validators": []},
}

# ✅ Good TODO
# TODO: all user must have team but main instance users
# don't have team we have to fix this
```

---

## Naming Conventions

### Classes

```python
# ✅ PascalCase
class UserCreateSerializer(serializers.HyperlinkedModelSerializer):
    pass
```

### Functions/Methods

```python
# ✅ snake_case
def create_user_for_company(self, email: str) -> User:
    pass
```

### Variables

```python
# ✅ snake_case
user_email = "test@example.com"
is_active = True
```

### Constants

```python
# ✅ UPPER_SNAKE_CASE
MAX_LOGIN_ATTEMPTS = 5
DEFAULT_PAGE_SIZE = 20
```

### Private/Internal

```python
# ✅ Leading underscore for internal
def _internal_helper(value: str) -> bool:
    pass

_INTERNAL_CONSTANT = 100
```

---

## File Organization

### Serializers

```python
# serializers/user.py
class UserSerializer(HyperlinkedModelSerializer):
    pass

class UserCreateSerializer(HyperlinkedModelSerializer):
    pass

class UserUpdateSerializer(HyperlinkedModelSerializer):
    pass

# serializers/__init__.py
from .user import UserSerializer
from .user import UserCreateSerializer
from .user import UserUpdateSerializer

__all__ = [
    "UserSerializer",
    "UserCreateSerializer",
    "UserUpdateSerializer",
]
```

### Views

```python
# views/user.py
class UserViewSet(ModelViewSet):
    pass

# views/__init__.py
from .user import UserViewSet

__all__ = ["UserViewSet"]
```

---

## Serializers

### Use HyperlinkedModelSerializer When Possible

```python
# ✅ GOOD - Uses model definition
class UserCreateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name"]
        extra_kwargs = {
            "email": {"required": True},
        }

# ❌ AVOID - Manual field definition (unless necessary)
class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    # ... duplicates model definition
```

**When to use base `Serializer`:**
- DTOs that don't map 1:1 to model
- Complex validation logic
- No underlying model

---

## Django/DRF Patterns

### Service Delegation

```python
# ✅ Views delegate to services
class UserViewSet(ModelViewSet):
    def create(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Delegate to service
        user = AuthService().create_user_for_company(
            email=serializer.validated_data["email"],
            # ...
        )

        return Response(UserSerializer(user).data, status=201)
```

### Query Optimization

```python
# ✅ ALWAYS optimize queries
queryset = User.objects.select_related(
    "company"
).prefetch_related(
    "companies",
    "groups"
).order_by("email")
```

---

## Version

**Version**: 1.0
**Last Updated**: 2025-01-16
**Philosophy**: YOLO approach - self-explanatory code, minimal comments
