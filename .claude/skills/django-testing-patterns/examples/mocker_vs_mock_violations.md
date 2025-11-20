# mocker.Mock() vs Mock() Violations

**Critical**: NEVER use `unittest.mock.Mock`, ALWAYS use `mocker.Mock()`

---

## ❌ VIOLATION: unittest.mock

```python
# ❌ FORBIDDEN
from unittest.mock import Mock, patch

def test_service():
    mock_repo = Mock()  # WRONG
    service = Service(repository=mock_repo)
    # ...
```

---

## ✅ CORRECT: mocker fixture

```python
# ✅ CORRECT
def test_service(mocker):
    mock_repo = mocker.Mock()  # RIGHT
    service = Service(repository=mock_repo)
    # ...
```

---

## Why mocker.Mock()?

**1. Automatic cleanup**:
```python
# mocker cleans up after test automatically
def test_with_mocker(mocker):
    mock = mocker.Mock()
    # Mock automatically cleaned up after test
```

**2. Better integration with pytest**:
```python
# mocker.patch works better with pytest
def test_with_patch(mocker):
    mock_service = mocker.patch('apps.core.services.AuthService')
    # ...
```

**3. Consistent with pytest philosophy**:
- pytest fixtures > unittest patterns
- mocker is pytest-mock fixture

---

## Detection

```bash
# Find violations
grep -rn "from unittest.mock import Mock" apps/*/tests/

# Expected: 0 results
```

---

## Fix

```python
# BEFORE
from unittest.mock import Mock

def test_service():
    mock = Mock()

# AFTER
def test_service(mocker):
    mock = mocker.Mock()
```

---

**Rule**: If you need Mock/patch, use `mocker` fixture
