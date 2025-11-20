---
name: "pytest-django Testing Patterns"
description: "Enforces pytest-django best practices with AAA pattern, mocker.Mock() (NEVER Mock()), proper fixture scopes, and 100% coverage target. Auto-activates on: pytest, test, AAA, mock, fixture, coverage, django test. Prevents Mock() import (CRITICAL), docstrings in tests, missing AAA structure, wrong fixture scope. Ensures mocker.Mock() usage, ZERO docstrings in tests, AAA pattern, session fixtures for immutable data, 100% coverage. Targets: 0 Mock() imports, 0 test docstrings, 100% AAA compliance, 100% coverage."
---

# pytest-django Testing Patterns

**Auto-activates when**: Discussing pytest, Django testing, mocking, fixtures, test coverage, or AAA pattern.

---

## 🎯 Mission

Enforce **100% AAA pattern compliance** with **mocker.Mock()** (NEVER Mock()), **ZERO docstrings**, and **100% coverage** in pytest-django tests for maintainable, self-documenting test suites.

---

## 📐 Core Principles

### 1. AAA Pattern (Arrange-Act-Assert) - MANDATORY

**Rule**: ALL tests MUST follow AAA structure. Test names should be descriptive enough that code is self-explanatory. NO docstrings or comments.

**Why it matters**: Self-documenting tests, clear test structure, easy to identify what broke, consistent test organization across codebase.

❌ WRONG - No structure, comments, docstrings
```python
# apps/core/tests/user_service_tests.py
import pytest
from apps.core.services import UserService

def test_create_user():
    """Test that user creation works."""  # ❌ NO DOCSTRINGS IN TESTS!
    # Create the user  # ❌ NO COMMENTS!
    user = UserService.create_user(
        email="test@example.com",
        password="Password123"
    )
    # Check it worked  # ❌ NO COMMENTS!
    assert user.email == "test@example.com"
```

✅ CORRECT - Clear AAA structure, no docstrings/comments
```python
# apps/core/tests/user_service_tests.py
import pytest
from apps.core.models import User
from apps.core.services import UserService

@pytest.mark.django_db
def test_create_user_with_valid_data_creates_user_successfully():
    email = "test@example.com"
    password = "Password123"

    user = UserService.create_user(email=email, password=password)

    assert user.email == email
    assert user.check_password(password)
    assert User.objects.filter(email=email).exists()
```

**AAA Structure Breakdown**:
```python
@pytest.mark.django_db
def test_<action>_<context>_<expected>():
    # Arrange - Set up test data (blank line after)
    data = {"email": "test@example.com"}

    # Act - Execute the code under test (blank line before and after)
    result = SomeService.some_method(data)

    # Assert - Verify expectations (blank line before)
    assert result.status == "success"
```

**Auto-check**:
- [ ] Test name follows `test_<action>_<context>_<expected>` pattern?
- [ ] ZERO docstrings in test file?
- [ ] ZERO comments in test file?
- [ ] Clear Arrange/Act/Assert sections with blank lines?
- [ ] Test name descriptive enough to understand without docs?

---

### 2. mocker.Mock() vs Mock() - CRITICAL

**Rule**: ALWAYS use `mocker.Mock()` from pytest-mock plugin. NEVER import `from unittest.mock import Mock`. This is a CRITICAL violation.

**Why it matters**: pytest-mock automatically cleans up mocks after each test, prevents test pollution, better integration with pytest fixtures, consistent mocking across codebase.

❌ WRONG - Direct Mock() import (FORBIDDEN!)
```python
# apps/core/tests/user_service_tests.py
from unittest.mock import Mock, patch  # ❌ CRITICAL VIOLATION!
import pytest
from apps.core.services import UserService, EmailService

@pytest.mark.django_db
def test_create_user_sends_welcome_email():
    # ❌ Using Mock() directly - NOT cleaned up automatically!
    mock_email_service = Mock()

    # ❌ Using patch - inconsistent with pytest patterns
    with patch('apps.core.services.EmailService.send_welcome_email') as mock_send:
        user = UserService.create_user_with_onboarding(
            email="test@example.com",
            password="Password123"
        )
        mock_send.assert_called_once()

    # Problem: Mock not cleaned up, may affect other tests!
```

✅ CORRECT - mocker.Mock() from pytest-mock
```python
# apps/core/tests/user_service_tests.py
import pytest
from apps.core.models import User
from apps.core.services import UserService, EmailService

@pytest.mark.django_db
def test_create_user_with_onboarding_sends_welcome_email(mocker):
    email = "test@example.com"
    password = "Password123"
    mock_send_email = mocker.patch.object(EmailService, 'send_welcome_email')

    user = UserService.create_user_with_onboarding(email=email, password=password)

    mock_send_email.assert_called_once_with(user)
    assert user.email == email
```

**mocker Patterns**:
```python
# Mock a method on a class
mock_method = mocker.patch.object(SomeService, 'some_method')

# Mock a function
mock_func = mocker.patch('module.path.function_name')

# Mock with return value
mock_method = mocker.patch.object(SomeService, 'get_data', return_value={'key': 'value'})

# Spy on real method (calls real implementation but tracks calls)
spy_method = mocker.spy(SomeService, 'some_method')

# Create a Mock object
mock_obj = mocker.Mock()
mock_obj.some_attr = "value"
```

**Auto-check**:
- [ ] NO `from unittest.mock import Mock` imports anywhere?
- [ ] ALL mocks use `mocker` fixture parameter?
- [ ] mocker.patch.object() used instead of @patch decorator?
- [ ] All test functions with mocks have `mocker` parameter?

---

### 3. Fixture Scopes - Optimization

**Rule**: Use `scope='session'` for immutable, expensive-to-create fixtures. Use `scope='function'` (default) for mutable data that changes between tests.

**Why it matters**: Performance (don't recreate expensive data), test isolation (prevent test pollution), efficient resource usage, faster test suite execution.

❌ WRONG - Everything function-scoped (slow!)
```python
# conftest.py
import pytest
from apps.core.models import Company, User

@pytest.fixture  # Default scope='function' - recreated for EVERY test!
def company():
    """Creates company for every single test - SLOW!"""
    return Company.objects.create(
        name="Test Company",
        subdomain="testco"
    )

@pytest.fixture  # Recreated for every test - SLOW!
def admin_user(company):
    """Creates admin user for every test - SLOW!"""
    return User.objects.create(
        email="admin@testco.com",
        company=company,
        is_admin=True
    )

# Problem: If you have 100 tests, this creates 100 companies + 100 users!
```

✅ CORRECT - Optimized scopes
```python
# conftest.py
import pytest
from apps.core.models import Company, User

@pytest.fixture(scope='session')
def company_immutable():
    """Session-scoped for read-only company data (fast!)."""
    return Company.objects.create(
        name="Test Company",
        subdomain="testco"
    )

@pytest.fixture(scope='session')
def admin_user_immutable(company_immutable):
    """Session-scoped for read-only user (fast!)."""
    return User.objects.create(
        email="admin@testco.com",
        company=company_immutable,
        is_admin=True
    )

@pytest.fixture  # Function scope for mutable data
def user(company_immutable):
    """Function-scoped for tests that modify users."""
    return User.objects.create(
        email="user@testco.com",
        company=company_immutable
    )

# Usage:
@pytest.mark.django_db
def test_read_user_email(admin_user_immutable):
    # Uses session fixture (fast, shared across tests)
    assert admin_user_immutable.email == "admin@testco.com"

@pytest.mark.django_db
def test_update_user_name(user):
    # Uses function fixture (new user for this test)
    user.first_name = "Updated"
    user.save()
    assert user.first_name == "Updated"
```

**Fixture Scope Decision Tree**:
```
Is fixture data modified by tests?
├── YES → scope='function' (default, isolated)
└── NO → Is creation expensive (>100ms)?
    ├── YES → scope='session' (shared, fast)
    └── NO → scope='function' (simpler, safer)
```

**Auto-check**:
- [ ] Immutable fixtures use scope='session' or scope='module'?
- [ ] Mutable fixtures use scope='function' (default)?
- [ ] Expensive setup (DB data, API calls) in session-scoped fixtures?
- [ ] Tests don't modify session-scoped fixture data?

---

### 4. Test File Naming and Organization

**Rule**: Test files MUST be named `*_tests.py` (NOT `test_*.py`). Organize by tested module. One test file per source file.

**Why it matters**: Consistent discovery, clear mapping (user.py → user_tests.py), follows Binora Backend convention, avoids pytest collection confusion.

❌ WRONG - Inconsistent naming
```
apps/core/tests/
├── test_user.py          # ❌ Wrong pattern
├── users_test.py         # ❌ Wrong pattern
├── test_services.py      # ❌ Too generic
└── test_everything.py    # ❌ No clear mapping
```

✅ CORRECT - Consistent naming
```
apps/core/tests/
├── user_tests.py               # Tests for apps/core/models/user.py
├── user_service_tests.py       # Tests for apps/core/services.py (UserService)
├── user_views_tests.py         # Tests for apps/core/views/user.py
├── auth_backend_tests.py       # Tests for apps/core/utils/auth/
└── conftest.py                 # Shared fixtures for apps/core/tests/
```

**Test Organization Pattern**:
```python
# apps/core/tests/user_service_tests.py
import pytest
from apps.core.services import UserService

# Group tests by method/functionality
class TestUserServiceCreate:
    """Tests for UserService.create_user method."""

    @pytest.mark.django_db
    def test_create_user_with_valid_data_creates_user_successfully(self):
        # Test implementation
        pass

    @pytest.mark.django_db
    def test_create_user_with_duplicate_email_raises_error(self):
        # Test implementation
        pass

class TestUserServiceUpdate:
    """Tests for UserService.update_user method."""

    @pytest.mark.django_db
    def test_update_user_email_with_valid_email_succeeds(self):
        # Test implementation
        pass
```

**Auto-check**:
- [ ] All test files named `*_tests.py`?
- [ ] Clear mapping: `user.py` → `user_tests.py`?
- [ ] Related tests grouped in classes (TestServiceCreate, TestServiceUpdate)?
- [ ] conftest.py for shared fixtures per app?

---

### 5. Coverage Target: 100% Per File

**Rule**: Target 100% coverage per file. Use `pytest --cov=apps --cov-report=term-missing` to identify uncovered lines.

**Why it matters**: High code quality, catch edge cases, documentation through tests, prevent regressions, confidence in refactoring.

❌ WRONG - Incomplete coverage
```python
# apps/core/services.py
class UserService:
    @staticmethod
    def create_user(email: str, password: str) -> User:
        if not email:
            raise ValueError("Email required")  # Uncovered!
        if len(password) < 8:
            raise ValueError("Password too short")  # Uncovered!
        return User.objects.create(email=email, password=password)

# apps/core/tests/user_service_tests.py
@pytest.mark.django_db
def test_create_user_with_valid_data_creates_user():
    user = UserService.create_user("test@example.com", "Password123")
    assert user.email == "test@example.com"

# Coverage: 60% - Missing error cases!
```

✅ CORRECT - 100% coverage with edge cases
```python
# apps/core/services.py
class UserService:
    @staticmethod
    def create_user(email: str, password: str) -> User:
        if not email:
            raise ValueError("Email required")
        if len(password) < 8:
            raise ValueError("Password too short")
        return User.objects.create(email=email, password=password)

# apps/core/tests/user_service_tests.py
@pytest.mark.django_db
def test_create_user_with_valid_data_creates_user():
    user = UserService.create_user("test@example.com", "Password123")
    assert user.email == "test@example.com"

@pytest.mark.django_db
def test_create_user_with_empty_email_raises_value_error():
    with pytest.raises(ValueError, match="Email required"):
        UserService.create_user("", "Password123")

@pytest.mark.django_db
def test_create_user_with_short_password_raises_value_error():
    with pytest.raises(ValueError, match="Password too short"):
        UserService.create_user("test@example.com", "Pass")

# Coverage: 100% - All paths covered!
```

**Coverage Commands**:
```bash
# Run tests with coverage
nox -s test -- --cov=apps --cov-report=term-missing

# Check specific file
pytest apps/core/tests/user_service_tests.py --cov=apps/core/services --cov-report=term-missing

# Generate HTML report
pytest --cov=apps --cov-report=html
open htmlcov/index.html
```

**Auto-check**:
- [ ] All error cases tested (ValueError, exceptions)?
- [ ] All code branches tested (if/else, try/except)?
- [ ] Edge cases tested (empty, null, boundary values)?
- [ ] Coverage report shows 100% for file?
- [ ] No uncovered lines in `--cov-report=term-missing`?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Using unittest.mock.Mock Instead of mocker.Mock

❌ ANTI-PATTERN - Direct Mock import
```python
from unittest.mock import Mock, patch  # ❌ CRITICAL VIOLATION!

def test_something():
    mock = Mock()  # ❌ Not cleaned up automatically
```

✅ CORRECT - mocker fixture
```python
def test_something(mocker):
    mock = mocker.Mock()  # ✅ Cleaned up automatically
```

**Why it matters**: CRITICAL violation in Binora Backend. Mock() doesn't auto-cleanup, causes test pollution, inconsistent with pytest patterns.

---

### 2. Docstrings or Comments in Tests

❌ ANTI-PATTERN - Docstrings and comments
```python
def test_create_user():
    """Test that creating a user works."""  # ❌ NO DOCSTRINGS!
    # Arrange - Create user data  # ❌ NO COMMENTS!
    email = "test@example.com"
    # Act - Create user  # ❌ NO COMMENTS!
    user = UserService.create_user(email, "Password123")
    # Assert - Check user exists  # ❌ NO COMMENTS!
    assert user.email == email
```

✅ CORRECT - Self-explanatory test name, no docs
```python
def test_create_user_with_valid_email_creates_user_successfully():
    email = "test@example.com"

    user = UserService.create_user(email, "Password123")

    assert user.email == email
```

**Why it matters**: YOLO philosophy in Binora Backend. Code should be self-documenting. Test names descriptive enough.

---

### 3. Missing AAA Structure

❌ ANTI-PATTERN - No clear structure
```python
def test_user_creation():
    user = UserService.create_user("test@example.com", "Password123")
    assert user.email == "test@example.com"
    assert user.check_password("Password123")
    updated_email = "new@example.com"
    user.email = updated_email
    user.save()
    assert User.objects.get(id=user.id).email == updated_email
```

✅ CORRECT - Clear AAA sections
```python
def test_create_user_with_valid_data_creates_user_successfully():
    email = "test@example.com"
    password = "Password123"

    user = UserService.create_user(email, password)

    assert user.email == email
    assert user.check_password(password)

def test_update_user_email_with_valid_email_updates_successfully():
    user = User.objects.create(email="old@example.com")
    new_email = "new@example.com"

    user.email = new_email
    user.save()

    assert User.objects.get(id=user.id).email == new_email
```

**Why it matters**: Mixed arrange/act/assert is confusing. One test should test one thing. Separate tests for separate actions.

---

### 4. Wrong Fixture Scope

❌ ANTI-PATTERN - Session scope for mutable data
```python
@pytest.fixture(scope='session')  # ❌ Session scope but test modifies it!
def user():
    return User.objects.create(email="test@example.com")

def test_update_user_name(user):
    user.first_name = "Updated"  # ❌ Modifies session fixture!
    user.save()
    # This affects ALL other tests using this fixture!
```

✅ CORRECT - Function scope for mutable data
```python
@pytest.fixture  # Default scope='function' (new instance per test)
def user():
    return User.objects.create(email="test@example.com")

def test_update_user_name(user):
    user.first_name = "Updated"  # ✅ Isolated to this test
    user.save()
    assert user.first_name == "Updated"
```

**Why it matters**: Modifying shared fixtures causes test pollution. Tests should be isolated and independent.

---

### 5. Not Testing Error Cases

❌ ANTI-PATTERN - Only happy path
```python
@pytest.mark.django_db
def test_create_user():
    user = UserService.create_user("test@example.com", "Password123")
    assert user.email == "test@example.com"

# Coverage: 50% - Missing error cases!
```

✅ CORRECT - Happy path + error cases
```python
@pytest.mark.django_db
def test_create_user_with_valid_data_creates_user():
    user = UserService.create_user("test@example.com", "Password123")
    assert user.email == "test@example.com"

@pytest.mark.django_db
def test_create_user_with_empty_email_raises_error():
    with pytest.raises(ValueError):
        UserService.create_user("", "Password123")

@pytest.mark.django_db
def test_create_user_with_short_password_raises_error():
    with pytest.raises(ValueError):
        UserService.create_user("test@example.com", "123")

# Coverage: 100% - All paths covered!
```

**Why it matters**: Error handling is critical. 100% coverage target requires testing all code paths including errors.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] ZERO `from unittest.mock import Mock` imports?
- [ ] ALL mocks use `mocker` fixture?
- [ ] ZERO docstrings in test files?
- [ ] ZERO comments in test files?
- [ ] All tests follow AAA pattern with blank lines?

### High Priority
- [ ] Test file names use `*_tests.py` pattern?
- [ ] Test names follow `test_<action>_<context>_<expected>`?
- [ ] Immutable fixtures use scope='session'?
- [ ] Mutable fixtures use scope='function'?
- [ ] Coverage ≥100% per file?

### Medium Priority
- [ ] Tests grouped in classes by functionality?
- [ ] All error cases tested (ValueError, exceptions)?
- [ ] All code branches tested (if/else)?
- [ ] Edge cases tested (empty, null, boundary)?
- [ ] mocker.patch.object() used instead of @patch?

---

## 📚 Reference Documents

| File | Purpose |
|------|---------|
| `apps/core/tests/user_service_tests.py` | AAA pattern examples |
| `apps/core/tests/user_views_tests.py` | ViewSet testing with mocker |
| `conftest.py` (root) | Session-scoped fixtures (db_with_data) |
| `apps/*/conftest.py` | App-specific fixtures |
| `CLAUDE.md` | Testing guidelines and YOLO philosophy |
| `.claude/core/testing.md` | Comprehensive testing patterns |

---

## 🎯 Activation Criteria

**Keywords**: "pytest", "test", "AAA", "mock", "mocker", "fixture", "coverage", "django test", "unittest.mock"

**Auto-suggest when**:
- User creates test file
- User imports from unittest.mock
- User adds docstrings to tests
- User creates fixtures
- User discusses test coverage
- User writes tests without AAA structure
- User mentions mocking or patching

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Testing Targets**: 0 Mock() imports, 0 docstrings in tests, 100% AAA compliance, 100% coverage per file