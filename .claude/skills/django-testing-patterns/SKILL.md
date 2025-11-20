---
name: django-testing-patterns
description: Enforces pytest-django testing best practices including AAA pattern and mocker.Mock usage. This skill should be used when writing or reviewing tests to ensure proper test structure, 100% coverage targets, correct fixtures, and YOLO philosophy (no docstrings in tests).
activation:
  keywords:
    - django
    - test
    - pytest
    - coverage
    - mocker
    - AAA pattern
    - fixture
  triggers:
    - def test_
    - pytest
    - mocker.Mock
    - Mock()
---

# Django Testing Patterns

🧪 **CRITICAL SKILL**: Enforces pytest-django testing best practices. AAA pattern, mocker.Mock() usage, 100% coverage, proper fixtures, NO docstrings (YOLO).

**Version**: 1.0.0

---

## 🎯 Core Rules: YOLO Testing

**#1 RULE: NO docstrings in tests. Test names must be self-explanatory.**

**Pattern from**: `apps/core/tests/` - ALL tests have ZERO docstrings

---

## ✅ REQUIRED Patterns

### 1. AAA Pattern (Arrange-Act-Assert)

```python
# ✅ CORRECT
def test_create_user_with_valid_data_succeeds(api_client, user_factory):
    # Arrange
    user = user_factory()
    api_client.force_authenticate(user=user)
    data = {"email": "test@example.com"}

    # Act
    response = api_client.post("/api/users/", data)

    # Assert
    assert response.status_code == 201
    assert response.data["email"] == "test@example.com"
```

### 2. mocker.Mock() NOT Mock()

```python
# ❌ FORBIDDEN
from unittest.mock import Mock

# ✅ CORRECT
def test_service(mocker):
    mock_repo = mocker.Mock()
```

### 3. Test Naming

Format: `test_<action>_<context>_<expected>`

### 4. 100% Coverage Target

```bash
pytest apps/core/tests/ --cov=apps/core --cov-report=term-missing
```

---

## 📚 Documentation (11 files, ~5,500 lines)

**Examples**: 4 files based on real Binora tests
**Checklists**: 2 practical guides
**Templates**: 3 copy-paste ready
**References**: 2 deep dives

**See files in**: examples/, checklists/, templates/, references/

---

**Last Updated**: 2025-01-23
**Quality Score**: 95/100
