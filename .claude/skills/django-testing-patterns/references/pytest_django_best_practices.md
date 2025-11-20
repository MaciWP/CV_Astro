# pytest-django Best Practices

**Complete guide to pytest-django patterns in Binora Backend**

---

## 1. Test File Structure

```
apps/<app>/tests/
├── __init__.py
├── conftest.py (app-specific fixtures)
├── <model>_service_tests.py (service tests)
├── <model>_views_tests.py (viewset tests)
└── <model>_serializer_tests.py (serializer tests)
```

---

## 2. Test Class Naming

```python
# ✅ CORRECT
class TestUserService:
class TestUserViewSet:
class TestUserSerializer:

# ❌ WRONG
class UserTests:
class TestUser:
```

---

## 3. Fixtures

**Scope selection**:
- `session`: Database setup, immutable config
- `module`: Shared across test file
- `class`: Shared in test class
- `function`: Default, new each test

```python
# Use function scope for mutable data
@pytest.fixture
def user_factory():
    # New factory each test

# Use session for immutable
@pytest.fixture(scope="session")
def django_db_setup():
    # Once per test session
```

---

## 4. Markers

```python
# Database access required
@pytest.mark.django_db
class TestUserService:
    pass

# Skip slow tests
@pytest.mark.slow
def test_bulk_operation():
    pass

# Run only: pytest -m "not slow"
```

---

## 5. Parametrize

```python
@pytest.mark.parametrize("status,expected", [
    ("active", True),
    ("inactive", False),
    ("pending", False),
])
def test_is_active_status(status, expected):
    asset = Asset(status=status)
    assert asset.is_active() == expected
```

---

## 6. API Client Patterns

```python
# Basic request
response = api_client.get("/api/users/")

# With auth
api_client.force_authenticate(user=user)

# With data
response = api_client.post("/api/users/", data)

# Check status
assert response.status_code == 200
```

---

## 7. Factory Patterns

```python
# Basic usage
user = user_factory()

# Override fields
user = user_factory(email="custom@example.com")

# Create multiple
users = user_factory.create_batch(5)
```

---

## 8. Mock Patterns

```python
# Mock method
mock_repo = mocker.Mock()
mock_repo.get.return_value = user

# Mock with side effect
mock_repo.get.side_effect = User.DoesNotExist

# Patch class
mock_service = mocker.patch.object(UserService, 'create')

# Verify calls
mock_repo.create.assert_called_once_with(email="test@example.com")
```

---

## 9. Transaction Handling

```python
# Automatic rollback with @pytest.mark.django_db
@pytest.mark.django_db
def test_creates_user():
    User.objects.create(email="test@example.com")
    # Rolled back after test

# Force commit (rare)
@pytest.mark.django_db(transaction=True)
def test_with_commit():
    pass
```

---

## 10. Running Tests

```bash
# All tests
pytest

# Specific app
pytest apps/core/tests/

# Specific file
pytest apps/core/tests/user_views_tests.py

# Specific test
pytest apps/core/tests/user_views_tests.py::TestUserViewSet::test_create

# With coverage
pytest --cov=apps/core --cov-report=html

# Parallel (fast)
pytest -n auto

# Verbose
pytest -v

# Stop on first failure
pytest -x
```

---

**Reference**: pytest-django docs + Binora patterns
