---
name: "Pytest Test Structure"
description: "Enforces pytest best practices in Python test suites. Auto-activates on: pytest, test, fixture, mock, assert, coverage. Prevents test interdependence, missing fixtures, unclear assertions, slow tests (>1s unit), setup duplication. Ensures AAA pattern (Arrange-Act-Assert), fixture scoping, parametrize for cases, descriptive names (test_should_*). Validates conftest.py usage, @pytest.mark usage, 80%+ coverage, isolated tests. Targets: <100ms unit tests, 0 test order dependencies, 100% isolated."
---

# Pytest Test Structure

**Auto-activates when**: Discussing pytest tests, fixtures, mocking, or test coverage in Python projects.

---

## 🎯 Mission

Enforce **AAA pattern and fixture best practices** in pytest for fast, isolated, maintainable test suites.

---

## 📐 Core Principles

### 1. AAA Pattern (Arrange-Act-Assert)

**Rule**: Every test follows Arrange → Act → Assert structure with clear separation.

```python
# ❌ WRONG - Unclear structure
def test_user_service():
    service = UserService()
    user = service.create_user("John", "john@example.com")
    assert user.name == "John"
    assert user.email == "john@example.com"
    user2 = service.get_user(user.id)
    assert user2.name == "John"

# ✅ CORRECT - AAA pattern
def test_should_create_user_with_valid_data():
    # Arrange
    service = UserService()
    name = "John"
    email = "john@example.com"

    # Act
    user = service.create_user(name, email)

    # Assert
    assert user.name == name
    assert user.email == email
    assert user.id is not None

def test_should_retrieve_created_user():
    # Arrange
    service = UserService()
    created_user = service.create_user("John", "john@example.com")

    # Act
    retrieved_user = service.get_user(created_user.id)

    # Assert
    assert retrieved_user.id == created_user.id
    assert retrieved_user.name == created_user.name
```

**Auto-check**:
- [ ] Test has clear Arrange/Act/Assert sections (comments)?
- [ ] One logical assertion per test (not 10+)?
- [ ] Test name describes expected behavior (test_should_*)?

---

### 2. Fixtures for Setup

**Rule**: Use fixtures for common setup, never duplicate setup code.

```python
# ❌ WRONG - Setup duplication
def test_user_creation():
    db = Database(url="postgresql://localhost/test")
    db.connect()
    service = UserService(db)
    # Test logic...
    db.disconnect()

def test_user_deletion():
    db = Database(url="postgresql://localhost/test")
    db.connect()
    service = UserService(db)
    # Test logic...
    db.disconnect()

# ✅ CORRECT - Fixture reuse
import pytest

@pytest.fixture
def db():
    """Provide test database connection."""
    database = Database(url="postgresql://localhost/test")
    database.connect()
    yield database
    database.disconnect()

@pytest.fixture
def user_service(db):
    """Provide UserService with test database."""
    return UserService(db)

def test_should_create_user(user_service):
    # Arrange
    name = "John"

    # Act
    user = user_service.create_user(name, "john@example.com")

    # Assert
    assert user.name == name

def test_should_delete_user(user_service):
    # Arrange
    user = user_service.create_user("John", "john@example.com")

    # Act
    user_service.delete_user(user.id)

    # Assert
    assert user_service.get_user(user.id) is None
```

**Auto-check**:
- [ ] Common setup in fixtures (not duplicated)?
- [ ] Fixtures in conftest.py for reuse?
- [ ] Fixture scoping appropriate (function/class/module/session)?

---

### 3. Parametrize for Test Cases

**Rule**: Use @pytest.mark.parametrize for multiple test cases, not copy-paste tests.

```python
# ❌ WRONG - Copy-pasted tests
def test_validate_email_valid():
    assert validate_email("john@example.com") == True

def test_validate_email_no_at():
    assert validate_email("johnexample.com") == False

def test_validate_email_no_domain():
    assert validate_email("john@") == False

def test_validate_email_empty():
    assert validate_email("") == False

# ✅ CORRECT - Parametrized test
import pytest

@pytest.mark.parametrize("email,expected", [
    ("john@example.com", True),
    ("johnexample.com", False),
    ("john@", False),
    ("", False),
    ("test@domain.co.uk", True),
    ("invalid@", False),
])
def test_should_validate_email(email, expected):
    # Act
    result = validate_email(email)

    # Assert
    assert result == expected
```

**Auto-check**:
- [ ] Multiple similar tests use parametrize (not copy-paste)?
- [ ] Parametrize has descriptive test case names?
- [ ] Edge cases included (empty, None, invalid)?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Test Interdependence

```python
# ❌ ANTI-PATTERN - Tests depend on order
_shared_user = None

def test_create_user(user_service):
    global _shared_user
    _shared_user = user_service.create_user("John", "john@example.com")
    assert _shared_user.id is not None

def test_update_user(user_service):
    # Fails if test_create_user didn't run first!
    global _shared_user
    user_service.update_user(_shared_user.id, name="Jane")
    assert user_service.get_user(_shared_user.id).name == "Jane"
```

**Why**: Tests must be isolated, order-independent. Use fixtures instead.

---

### 2. Slow Unit Tests

```python
# ❌ ANTI-PATTERN - Slow test (>1 second)
def test_user_service():
    service = UserService(real_database_connection)  # Real DB!
    time.sleep(2)  # Wait for DB
    user = service.create_user("John", "john@example.com")
    assert user.id is not None

# ✅ CORRECT - Fast test with mock (<100ms)
from unittest.mock import Mock

def test_should_create_user_with_mocked_db():
    # Arrange
    mock_db = Mock()
    mock_db.insert.return_value = {"id": 1, "name": "John"}
    service = UserService(mock_db)

    # Act
    user = service.create_user("John", "john@example.com")

    # Assert
    assert user.id == 1
    mock_db.insert.assert_called_once()
```

**Why**: Unit tests should be <100ms. Use mocks/fakes for external dependencies.

---

### 3. Vague Assertions

```python
# ❌ ANTI-PATTERN - Vague assertion
def test_user_creation():
    user = create_user("John", "john@example.com")
    assert user  # What are we checking?

# ✅ CORRECT - Specific assertions
def test_should_create_user_with_all_fields():
    # Arrange
    name = "John"
    email = "john@example.com"

    # Act
    user = create_user(name, email)

    # Assert
    assert user.id is not None, "User should have an ID"
    assert user.name == name, f"Expected name {name}"
    assert user.email == email, f"Expected email {email}"
    assert user.created_at is not None, "Should have creation timestamp"
```

**Why**: Specific assertions make failures easier to debug.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] All tests follow AAA pattern (Arrange-Act-Assert)?
- [ ] No global variables shared between tests?
- [ ] Tests can run in any order (isolated)?
- [ ] Unit tests complete in <100ms each?

### High Priority
- [ ] Common setup uses fixtures (not duplicated)?
- [ ] Fixtures scoped correctly (function/module/session)?
- [ ] External dependencies mocked (DB, API, filesystem)?
- [ ] Test names descriptive (test_should_*)?

### Medium Priority
- [ ] Parametrize used for multiple cases (not copy-paste)?
- [ ] Coverage >80% (run: pytest --cov)?
- [ ] Markers used (@pytest.mark.slow, @pytest.mark.integration)?
- [ ] conftest.py for shared fixtures?

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `tests/conftest.py` | Shared fixtures and configuration |
| `tests/unit/` | Fast unit tests (<100ms) |
| `tests/integration/` | Slower integration tests (mocked external) |
| `tests/e2e/` | End-to-end tests (real dependencies) |
| `docs/TESTING.md` | Testing strategy and guidelines |

---

## 🎯 Activation Criteria

**Keywords**: "pytest", "test", "fixture", "mock", "assert", "coverage", "unittest", "@pytest"

**Auto-suggest when**:
- User writes new test function
- User mentions testing or test coverage
- User creates conftest.py or adds fixtures
- User discusses mocking or test isolation

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Test Quality Targets**: <100ms unit tests, 80%+ coverage, 100% isolated
