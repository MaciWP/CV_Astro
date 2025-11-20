# Import Organization

**Rule**: Imports must be organized in 3 groups

---

## Correct Organization

```python
# apps/core/services.py

# 1. Standard library
import os
from typing import Optional, List

# 2. Third-party (Django, DRF, external)
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import serializers

# 3. Local (project modules)
from apps.core.models import User, Company
from apps.core.utils.email import EmailHelper
```

---

## __all__ Declaration

```python
# apps/core/services.py

__all__ = ["UserService", "AuthService"]

from typing import Optional
from apps.core.models import User


class UserService:
    pass


class AuthService:
    pass
```

**Benefits**:
- Explicit public API
- Better IDE autocomplete
- Prevents accidental imports

---

## Import Aliases

```python
# ✅ CORRECT - Standard aliases
import pandas as pd
import numpy as np
from django.contrib.auth import get_user_model

User = get_user_model()

# ❌ WRONG - Confusing aliases
from apps.core.models import User as U
```

---

**Tool**: `isort` (auto-organize imports)
