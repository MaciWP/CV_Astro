# Complete Style Guide

**All code style rules for Binora Backend**

---

## 1. YOLO Comments

**Rule**: Minimal/NO comments

**Allowed**:
- Complex algorithms
- Security-critical
- External bug workarounds

**Forbidden**:
- Obvious comments
- What code does (should be self-explanatory)
- Docstrings in tests

---

## 2. Type Hints

**Required**: ALL function parameters and returns

```python
from typing import Optional, List, Dict
from django.db.models import QuerySet

def func(param: str, opt: Optional[int] = None) -> List[User]:
    pass
```

---

## 3. Imports

**Organization**:
1. Standard library
2. Third-party (Django, DRF)
3. Local (project)

**__all__**: Required in all modules

```python
__all__ = ["Class1", "function1"]
```

---

## 4. Naming

- Variables: `snake_case`
- Functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_CASE`
- Private: `_prefix`

---

## 5. Formatting

**Tool**: `black` (auto-format)

```bash
black apps/
```

**Line length**: 88 chars (black default)

**Strings**: Double quotes `"string"`

---

## 6. Docstrings

**Only for**:
- Public API (modules, classes, public methods)
- Complex business logic

**Format**: Brief one-liner

```python
def create_user(email: str) -> User:
    """Create user with email."""
    pass
```

**NOT for**:
- Tests (ZERO docstrings)
- Private methods (unless complex)
- Obvious code

---

## 7. Testing

**Test files**: NO docstrings, NO comments

**Test names**: `test_<action>_<context>_<expected>`

---

**Tools**:
- `black`: Auto-format
- `isort`: Auto-organize imports
- `mypy`: Type checking
- `flake8`: Linting

---

**Full reference**: `.claude/core/code-style.md`
