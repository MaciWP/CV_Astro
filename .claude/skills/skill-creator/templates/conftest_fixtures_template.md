# conftest.py Fixtures Template (pytest-django)

**Purpose**: Generate pytest fixtures for Django tests following Binora Backend patterns (session vs function scope, immutable vs mutable data).

**Usage**: Replace {{slots}} with actual values for your implementation.

---

## conftest.py Template

```python
# {{conftest_path}}/conftest.py
import pytest
from rest_framework.test import APIClient
from typing import TYPE_CHECKING

{{#model_imports}}
from apps.{{app_name}}.models import {{ModelName}}
{{/model_imports}}

if TYPE_CHECKING:
    from apps.core.models import User, Company


{{#session_fixtures}}
@pytest.fixture(scope='session')
def {{fixture_name}}():
    """
    {{fixture_description}}

    Scope: session (shared across all tests, immutable).
    """
    {{fixture_implementation}}
    return {{return_value}}
{{/session_fixtures}}


{{#function_fixtures}}
@pytest.fixture
def {{fixture_name}}({{#dependencies}}{{dep_fixture}}{{#not_last}}, {{/not_last}}{{/dependencies}}):
    """
    {{fixture_description}}

    Scope: function (new instance per test, mutable).
    """
    {{fixture_implementation}}
    return {{return_value}}
{{/function_fixtures}}


{{#parametrized_fixtures}}
@pytest.fixture(params={{param_values}})
def {{fixture_name}}(request{{#dependencies}}, {{dep_fixture}}{{/dependencies}}):
    """
    {{fixture_description}}

    Parametrized: runs test multiple times with different values.
    """
    {{fixture_implementation}}
    return {{return_value}}
{{/parametrized_fixtures}}


{{#api_fixtures}}
@pytest.fixture
def api_client():
    """
    DRF API client for testing ViewSets.

    Use api_client.force_authenticate(user=user) to authenticate.
    """
    return APIClient()
{{/api_fixtures}}
```

---

## Slot Definitions

### General Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{conftest_path}}` | conftest.py location | `apps/assets/tests`, root `.` |
| `{{app_name}}` | Django app name | `assets`, `core` |
| `{{ModelName}}` | Model class name | `Asset`, `User`, `Company` |

### Fixture Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{fixture_name}}` | Fixture function name | `company`, `admin_user`, `api_client` |
| `{{fixture_description}}` | Fixture purpose | `Test company for multi-tenant tests` |
| `{{fixture_implementation}}` | Fixture body code | Model creation, setup logic |
| `{{return_value}}` | What fixture returns | `company`, `user`, `APIClient()` |
| `{{dependencies}}` | Other fixtures needed | `company`, `admin_user` |
| `{{param_values}}` | Parametrize values | `['active', 'inactive']`, `[1, 5, 10]` |

---

## Complete Example Templates

### Template 1: Session-Scoped Company Fixture (Immutable)

**Input values**:
- `{{fixture_name}}` = `company_immutable`
- `{{fixture_description}}` = `Test company for read-only tests (session-scoped)`
- `{{return_value}}` = `company`

**Generated code**:
```python
@pytest.fixture(scope='session')
def company_immutable():
    """
    Test company for read-only tests (session-scoped).

    Scope: session (shared across all tests, immutable).
    """
    company = Company.objects.create(
        name="Test Company",
        subdomain="testco"
    )
    return company
```

### Template 2: Function-Scoped User Fixture (Mutable)

**Input values**:
- `{{fixture_name}}` = `user`
- `{{fixture_description}}` = `Test user for mutable tests`
- `{{dependencies}}` = `company_immutable`
- `{{return_value}}` = `user`

**Generated code**:
```python
@pytest.fixture
def user(company_immutable):
    """
    Test user for mutable tests.

    Scope: function (new instance per test, mutable).
    """
    user = User.objects.create(
        email="test@testco.com",
        first_name="Test",
        last_name="User",
        company=company_immutable
    )
    return user
```

### Template 3: Admin User Fixture with Dependencies

**Generated code**:
```python
@pytest.fixture
def admin_user(company_immutable):
    """
    Test admin user with admin permissions.

    Scope: function (new instance per test, mutable).
    """
    user = User.objects.create(
        email="admin@testco.com",
        first_name="Admin",
        last_name="User",
        company=company_immutable,
        is_admin=True,
        is_superuser=True
    )
    return user
```

### Template 4: API Client Fixture

**Generated code**:
```python
@pytest.fixture
def api_client():
    """
    DRF API client for testing ViewSets.

    Use api_client.force_authenticate(user=user) to authenticate.
    """
    return APIClient()
```

### Template 5: Authenticated API Client

**Generated code**:
```python
@pytest.fixture
def authenticated_client(api_client, admin_user):
    """
    Pre-authenticated API client with admin user.

    Use for tests requiring authentication.
    """
    api_client.force_authenticate(user=admin_user)
    return api_client
```

### Template 6: Parametrized Fixture (Multiple Test Runs)

**Generated code**:
```python
@pytest.fixture(params=['active', 'inactive', 'maintenance'])
def asset_status(request):
    """
    Parametrized asset status for testing all status values.

    Parametrized: runs test multiple times with different values.
    """
    return request.param
```

### Template 7: Multiple Related Objects Fixture

**Generated code**:
```python
@pytest.fixture
def assets(company_immutable, admin_user):
    """
    Create 5 test assets for list/pagination tests.

    Scope: function (new instances per test, mutable).
    """
    assets = [
        Asset.objects.create(
            name=f"Asset {i}",
            serial_number=f"SN{i}",
            company=company_immutable,
            created_by=admin_user
        )
        for i in range(1, 6)
    ]
    return assets
```

---

## Common Fixture Patterns

### Root conftest.py (Shared Across All Apps)

```python
# conftest.py (root)
import pytest
from rest_framework.test import APIClient
from apps.core.models import Company, User


@pytest.fixture(scope='session')
def company_immutable():
    """Session-scoped test company (immutable)."""
    return Company.objects.create(
        name="Test Company",
        subdomain="testco"
    )


@pytest.fixture(scope='session')
def admin_user_immutable(company_immutable):
    """Session-scoped admin user (immutable, read-only)."""
    return User.objects.create(
        email="admin@testco.com",
        company=company_immutable,
        is_admin=True
    )


@pytest.fixture
def api_client():
    """DRF API client."""
    return APIClient()
```

### App-Level conftest.py (App-Specific Fixtures)

```python
# apps/assets/tests/conftest.py
import pytest
from apps.assets.models import Asset


@pytest.fixture
def asset(company_immutable, admin_user_immutable):
    """Function-scoped test asset."""
    return Asset.objects.create(
        name="Test Asset",
        serial_number="SN123",
        company=company_immutable,
        created_by=admin_user_immutable
    )


@pytest.fixture
def assets_list(company_immutable, admin_user_immutable):
    """Create 10 assets for pagination tests."""
    return [
        Asset.objects.create(
            name=f"Asset {i}",
            serial_number=f"SN{i:03d}",
            company=company_immutable,
            created_by=admin_user_immutable
        )
        for i in range(1, 11)
    ]
```

---

## Fixture Scope Decision Tree

```
Is fixture data modified by tests?
├── YES → scope='function' (default, isolated)
└── NO → Is creation expensive (>100ms)?
    ├── YES → scope='session' (shared, fast)
    └── NO → scope='function' (simpler, safer)
```

### Session-Scoped Fixtures (Immutable, Shared)

**Use when**:
- Data is never modified by tests
- Creation is expensive (DB queries, API calls)
- Same data works for many tests

**Examples**:
- Read-only company
- Read-only admin user
- Static configuration data

**Pattern**:
```python
@pytest.fixture(scope='session')
def company_immutable():
    """Immutable company shared across all tests."""
    return Company.objects.create(name="Test Co", subdomain="test")
```

### Function-Scoped Fixtures (Mutable, Isolated)

**Use when**:
- Data is modified by tests
- Tests need isolation
- Creation is fast

**Examples**:
- Users that tests will update
- Assets that tests will modify
- Mutable state

**Pattern**:
```python
@pytest.fixture
def user(company_immutable):
    """Mutable user, new instance per test."""
    return User.objects.create(
        email="test@example.com",
        company=company_immutable
    )
```

---

## Advanced Fixture Patterns

### Fixture Factory (Dynamic Creation)

```python
@pytest.fixture
def user_factory(company_immutable):
    """
    Factory for creating multiple users with different attributes.

    Usage:
        user1 = user_factory(email="user1@test.com")
        user2 = user_factory(email="user2@test.com", is_admin=True)
    """
    def _create_user(**kwargs):
        defaults = {
            'company': company_immutable,
            'first_name': 'Test',
            'last_name': 'User',
        }
        defaults.update(kwargs)
        return User.objects.create(**defaults)
    return _create_user
```

### Autouse Fixture (Automatic Setup)

```python
@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """
    Enable database access for all tests automatically.

    No need to add @pytest.mark.django_db to each test.
    """
    pass
```

### Cleanup Fixture (Teardown)

```python
@pytest.fixture
def temp_file():
    """Create temp file and clean up after test."""
    file_path = '/tmp/test_file.txt'
    with open(file_path, 'w') as f:
        f.write('test data')

    yield file_path  # Test runs here

    # Cleanup after test
    if os.path.exists(file_path):
        os.remove(file_path)
```

---

## Parametrized Fixtures

### Simple Parametrization

```python
@pytest.fixture(params=[1, 5, 10, 100])
def page_size(request):
    """Test with different page sizes."""
    return request.param

# Usage in test:
def test_pagination_works_with_different_sizes(page_size, assets_list, api_client):
    # Test runs 4 times with page_size = 1, 5, 10, 100
    pass
```

### Dict Parametrization

```python
@pytest.fixture(params=[
    {'name': 'Asset 1', 'status': 'active'},
    {'name': 'Asset 2', 'status': 'inactive'},
    {'name': 'Asset 3', 'status': 'maintenance'},
])
def asset_data(request):
    """Different asset data combinations."""
    return request.param
```

---

## Fixture Dependency Chains

```python
# Root conftest.py
@pytest.fixture(scope='session')
def company_immutable():
    return Company.objects.create(name="Test Co", subdomain="test")


@pytest.fixture(scope='session')
def admin_user_immutable(company_immutable):
    return User.objects.create(
        email="admin@test.com",
        company=company_immutable,  # Depends on company_immutable
        is_admin=True
    )


# App conftest.py
@pytest.fixture
def asset(company_immutable, admin_user_immutable):
    return Asset.objects.create(
        name="Asset",
        company=company_immutable,  # Depends on company_immutable
        created_by=admin_user_immutable  # Depends on admin_user_immutable
    )
```

---

## Validation Checklist

After generating conftest.py from this template, verify:

- [ ] Immutable fixtures use scope='session'?
- [ ] Mutable fixtures use scope='function' (default)?
- [ ] Expensive fixtures (DB, API) use session scope?
- [ ] Fixture names descriptive (company_immutable vs company)?
- [ ] Fixture dependencies correct (company before user)?
- [ ] NO business logic in fixtures (just data setup)?
- [ ] Parametrized fixtures for testing multiple scenarios?
- [ ] API client fixture available for ViewSet tests?
- [ ] Root conftest.py has shared fixtures?
- [ ] App conftest.py has app-specific fixtures?

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Pattern**: Session vs function scope, immutable vs mutable, fixture factories, parametrization