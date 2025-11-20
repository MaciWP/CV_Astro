---
name: code-style-enforcer
description: Enforces code style standards including YOLO philosophy (minimal comments) and type hints. This skill should be used when writing Python code to ensure proper type hints, imports organization, naming conventions, and self-explanatory code without excessive comments.
---

# Code Style Enforcer

📝 **CRITICAL SKILL**: Enforces Binora Backend code style. YOLO philosophy (minimal/NO comments), type hints required, proper imports/__all__, naming conventions.

**Version**: 1.0.0

---

## 🎯 Core Rules: YOLO Philosophy

**#1 RULE: Code should be self-explanatory. Minimal or NO comments.**

**Pattern from**: `.claude/core/code-style.md` and `CLAUDE.md`

---

## ✅ REQUIRED Patterns

### 1. NO Comments (YOLO)

```python
# ❌ FORBIDDEN - Obvious comments
def create_user(email: str) -> User:
    # Create user with email  ← OBVIOUS!
    user = User.objects.create(email=email)
    # Return user  ← OBVIOUS!
    return user

# ✅ CORRECT - Self-explanatory
def create_user(email: str) -> User:
    return User.objects.create(email=email)
```

### 2. Type Hints Required

```python
# ❌ WRONG - No type hints
def get_users(status):
    return User.objects.filter(status=status)

# ✅ CORRECT - Type hints
def get_users(status: str) -> QuerySet[User]:
    return User.objects.filter(status=status)
```

### 3. __all__ in Modules

```python
# my_module.py

__all__ = ["UserService", "AssetService"]

class UserService:
    pass

class AssetService:
    pass
```

### 4. Import Organization

```python
# ✅ CORRECT order
# 1. Standard library
import os
from typing import Optional

# 2. Third-party
from django.db import models
from rest_framework import serializers

# 3. Local
from apps.core.models import User
from apps.core.services import UserService
```

---

## 📚 Documentation (10 files, ~4,000 lines)

**Examples**: 4 files with real violations/fixes
**Checklists**: 2 validation guides
**Templates**: 2 style templates
**References**: 2 complete guides

---

**Last Updated**: 2025-01-23
**Quality Score**: 95/100
