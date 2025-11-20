# Multi-Tenant Test Fixtures Template

**Copy-paste ready fixtures for testing multi-tenant code**

---

## Critical Fixture: tenant_id

**The most important fixture for multi-tenant testing**

### Basic Implementation

```python
# conftest.py (root level)

import pytest
from apps.core.models import Company


@pytest.fixture(scope="function")
def tenant_id(db, settings):
    """
    ✅ CRITICAL: Activates middleware tenant context for tests

    Creates a test company and sets TENANT in settings.
    ALL multi-tenant tests should use this fixture.

    Scope: function (new company per test for isolation)
    """
    # Create test company
    company = Company.objects.create(
        name="Test Company",
        subdomain="testcompany",
        domain="testcompany.test"
    )

    # Configure as Tenant service (not Main)
    settings.TENANT = company.subdomain
    settings.MAIN_INSTANCE_URL = "http://localhost:8000"

    # Return company ID for assertions
    yield company.id

    # Cleanup happens automatically with function scope
```

### Advanced Implementation with Context Manager

```python
# conftest.py

import pytest
from contextlib import contextmanager
from apps.core.models import Company


@pytest.fixture(scope="function")
def tenant_id(db, settings):
    """
    ✅ Tenant context with automatic middleware activation

    Usage in tests:
        def test_something(tenant_id):
            # Middleware active, queries filtered by company
            users = User.objects.all()  # Only this tenant's users
    """
    company = Company.objects.create(
        name="Test Tenant",
        subdomain="testtenant",
        domain="testtenant.test"
    )

    # Activate tenant context
    settings.TENANT = company.subdomain

    # Simulate middleware tenant context
    from binora.middleware import tenant_context

    with tenant_context(company):
        yield company.id


@pytest.fixture(scope="session")
def main_service_mode(settings):
    """
    ✅ Fixture for testing Main service mode

    Sets TENANT=None and MAIN_INSTANCE_URL=None
    """
    settings.TENANT = None
    settings.MAIN_INSTANCE_URL = None
    yield


@pytest.fixture(scope="function")
def tenant_service_mode(settings, tenant_id):
    """
    ✅ Fixture for testing Tenant service mode

    Sets TENANT=subdomain and MAIN_INSTANCE_URL
    """
    settings.TENANT = "testtenant"
    settings.MAIN_INSTANCE_URL = "http://localhost:8000"
    yield tenant_id
```

---

## Company Fixtures

### Basic Company Fixture

```python
# conftest.py

@pytest.fixture(scope="function")
def company_factory(db):
    """
    ✅ Factory for creating companies dynamically

    Returns a function that creates companies
    """
    def _create_company(**kwargs):
        defaults = {
            "name": "Test Company",
            "subdomain": "testco",
            "domain": "testco.test"
        }
        defaults.update(kwargs)
        return Company.objects.create(**defaults)

    return _create_company


@pytest.fixture(scope="function")
def test_company(db):
    """
    ✅ Single test company

    From real Binora conftest.py (line 67)
    """
    return Company.objects.create(
        name="Bjumper TEST company",
        domain="bjumper.test",
        subdomain="bjumper"
    )


@pytest.fixture(scope="function")
def another_test_company(db):
    """
    ✅ Second company for cross-tenant tests

    From real Binora conftest.py (line 72)
    """
    return Company.objects.create(
        name="TeleCoCable TEST company",
        domain="telecocable.test",
        subdomain="telecocable"
    )
```

---

## User Fixtures

### Basic User Fixture

```python
# conftest.py

@pytest.fixture(scope="function")
def user_factory(db):
    """
    ✅ Factory for creating users

    NO company parameter - middleware adds it via tenant_id fixture
    """
    from apps.core.models import User

    def _create_user(**kwargs):
        defaults = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User"
        }
        defaults.update(kwargs)

        # ✅ NO company in defaults - middleware adds it
        return User.objects.create(**defaults)

    return _create_user


@pytest.fixture(scope="function")
def api_user(db, test_company, team_all_permissions):
    """
    ✅ User with password for API testing

    From real Binora conftest.py (line 98)
    """
    from django.contrib.auth import get_user_model

    User = get_user_model()

    user = User.objects.create(
        email="api@bjumper.com",
        first_name="Api",
        last_name="User"
    )

    password = "api-s3cr3t"
    user.set_password(password)
    user.save()

    user.groups.add(team_all_permissions)

    # Add password as attribute for easy access in tests
    setattr(user, "raw_password", password)

    return user


@pytest.fixture(scope="function")
def api_user_with_company(api_user, test_company):
    """
    ✅ User with company relationship

    From real Binora conftest.py (line 121)
    """
    from apps.core.models import CompanyUser

    test_company.save()

    CompanyUser.objects.create(
        user=api_user,
        company=test_company,
        is_default=True
    )

    return api_user
```

---

## API Client Fixtures

### Basic API Client

```python
# conftest.py

@pytest.fixture(scope="function")
def api_client():
    """
    ✅ DRF API client for testing endpoints

    From real Binora conftest.py (line 93)
    """
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture(scope="function")
def authenticated_api_client(api_client, user_factory):
    """
    ✅ Pre-authenticated API client
    """
    user = user_factory(email="auth@example.com")
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture(scope="function")
def admin_api_client(api_client, user_factory):
    """
    ✅ API client authenticated as admin
    """
    user = user_factory(email="admin@example.com", is_staff=True)
    api_client.force_authenticate(user=user)
    return api_client
```

---

## Model Factories

### Factory Pattern for Models

```python
# apps/{app}/tests/conftest.py

import pytest
from apps.{app}.models import {Model}


@pytest.fixture(scope="function")
def {model}_factory(db):
    """
    ✅ Factory for creating {model} instances

    NO company parameter - middleware adds it via tenant_id
    """
    def _create_{model}(**kwargs):
        defaults = {
            "name": "Test {Model}",
            "status": {Model}.Status.ACTIVE,
        }
        defaults.update(kwargs)

        # ✅ NO company in defaults - middleware adds it
        return {Model}.objects.create(**defaults)

    return _create_{model}
```

### Real Example: Asset Factory

```python
# apps/assets/tests/conftest.py

import pytest
from apps.assets.models import Asset


@pytest.fixture(scope="function")
def asset_factory(db):
    """
    ✅ Factory for creating assets

    Based on real Binora patterns
    """
    def _create_asset(**kwargs):
        defaults = {
            "name": "Test Asset",
            "asset_type": Asset.Type.SERVER,
            "status": Asset.Status.PRODUCTION,
        }
        defaults.update(kwargs)

        # ✅ NO company - middleware adds it
        return Asset.objects.create(**defaults)

    return _create_asset


@pytest.fixture(scope="function")
def server_asset(asset_factory):
    """
    ✅ Pre-configured server asset
    """
    return asset_factory(
        name="Test Server",
        asset_type=Asset.Type.SERVER
    )


@pytest.fixture(scope="function")
def maintenance_asset(asset_factory):
    """
    ✅ Asset in maintenance status
    """
    return asset_factory(
        status=Asset.Status.MAINTENANCE
    )
```

---

## Service Mock Fixtures

### Service with Mocked Dependencies

```python
# apps/{app}/tests/conftest.py

import pytest


@pytest.fixture(scope="function")
def {model}_service_mock(mocker):
    """
    ✅ Mocked service with all dependencies

    Based on real AuthService mock pattern (conftest.py line 77)
    """
    from apps.{app}.services import {Model}Service

    # Mock repository
    mock_repository = mocker.Mock()
    mock_repository.get.return_value = mocker.Mock(id=1, name="Test")
    mock_repository.create.return_value = mocker.Mock(id=1)

    # Mock other dependencies
    mock_helper = mocker.Mock()

    return {Model}Service(
        {model}_repository=mock_repository,
        helper=mock_helper,
    )


@pytest.fixture(scope="function")
def auth_service_mock(mocker, test_user):
    """
    ✅ Real example from conftest.py (line 77)

    Mocked AuthService for testing
    """
    from apps.core.services import AuthService

    fake_users_repository = mocker.Mock()
    mocker.patch.object(fake_users_repository, "get", return_value=test_user)

    return AuthService(
        users_repository=fake_users_repository,
        email_helper=mocker.Mock(),
        validation_function=mocker.Mock(return_value=True),
        token_generator=mocker.Mock(return_value="GENERATED-TOKEN"),
        request=mocker.Mock(),
    )
```

---

## Permission Fixtures

### Team with All Permissions

```python
# conftest.py

import pytest
from django.contrib.auth.models import Permission
from apps.core.models import Team


@pytest.fixture(scope="session")
def team_all_permissions(db, django_db_blocker):
    """
    ✅ Team with all permissions

    Scope: session (expensive to create, reuse across tests)
    """
    with django_db_blocker.unblock():
        team = Team.objects.create(name="All Permissions Team")

        # Add all permissions
        all_permissions = Permission.objects.all()
        team.permissions.set(all_permissions)

        return team


@pytest.fixture(scope="function")
def team_factory(db):
    """
    ✅ Factory for creating teams with specific permissions
    """
    def _create_team(name="Test Team", permissions=None):
        team = Team.objects.create(name=name)

        if permissions:
            team.permissions.set(permissions)

        return team

    return _create_team
```

---

## Usage Examples

### Test with tenant_id Fixture

```python
# apps/assets/tests/views_tests.py

import pytest
from rest_framework import status


@pytest.mark.django_db
def test_list_assets_filtered_by_tenant(
    api_client,
    user_factory,
    asset_factory,
    tenant_id  # ✅ Activates middleware
):
    """
    ✅ Tenant isolation test

    Middleware filters assets automatically
    """
    user = user_factory(email="test@example.com")
    api_client.force_authenticate(user=user)

    # Create assets (middleware adds company from tenant_id fixture)
    asset1 = asset_factory(name="Asset 1")
    asset2 = asset_factory(name="Asset 2")

    response = api_client.get("/api/assets/")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2
```

### Test Cross-Tenant Isolation

```python
@pytest.mark.django_db
def test_cannot_access_other_tenant_data(
    api_client,
    user_factory,
    asset_factory,
    company_factory
):
    """
    ✅ Verify middleware blocks cross-tenant access
    """
    # Create two companies
    company1 = company_factory(subdomain="company1")
    company2 = company_factory(subdomain="company2")

    # User in company1
    user = user_factory(email="user1@company1.com", company=company1)
    api_client.force_authenticate(user=user)

    # Asset in company2
    other_asset = asset_factory(name="Other Asset", company=company2)

    # Try to access other company's asset
    response = api_client.get(f"/api/assets/{other_asset.id}/")

    # ✅ Middleware should block (404, not 403)
    assert response.status_code == status.HTTP_404_NOT_FOUND
```

### Test Service with Mocked Repository

```python
@pytest.mark.django_db
def test_service_create_with_mock(mocker):
    """
    ✅ Test service business logic with mocked repository
    """
    from apps.assets.services import AssetService

    # Mock repository
    mock_repo = mocker.Mock()
    mock_repo.create.return_value = mocker.Mock(id=1, name="Test Asset")

    # Inject mock
    service = AssetService(assets_repository=mock_repo)

    data = {"name": "Test Asset", "status": "active"}
    result = service.create_asset(**data)

    # Verify repository called
    mock_repo.create.assert_called_once_with(**data)
    assert result.name == "Test Asset"
```

### Test Dual-Mode Service

```python
@pytest.mark.django_db
def test_service_in_main_mode(settings, mocker):
    """
    ✅ Test service in Main mode (TENANT=None)
    """
    from apps.core.services import AuthService

    # Configure as Main service
    settings.MAIN_INSTANCE_URL = None
    settings.TENANT = None

    service = AuthService()
    user_data = {"email": "test@example.com"}

    user = service.create_user_for_company(user_data)

    # In Main mode, creates directly (no forwarding)
    assert user.email == "test@example.com"


@pytest.mark.django_db
def test_service_in_tenant_mode(settings, mocker):
    """
    ✅ Test service in Tenant mode (TENANT=subdomain)
    """
    from apps.core.services import AuthService

    # Configure as Tenant service
    settings.MAIN_INSTANCE_URL = "http://localhost:8000"
    settings.TENANT = "testco"

    # Mock request to Main
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"email": "test@example.com"}

    mocker.patch("requests.request", return_value=mock_response)

    service = AuthService()
    user_data = {"email": "test@example.com"}

    user = service.create_user_for_company(user_data, auth_token="fake-token")

    # In Tenant mode, forwards to Main
    assert user.email == "test@example.com"
```

---

## Fixture Scopes

### When to Use Each Scope

**session**: Expensive to create, immutable, shared across all tests
- Content types
- Permissions
- Teams with predefined permissions

**module**: Shared within a test file
- Rarely used (usually function or session is better)

**function**: Default, creates fresh instance per test
- Users
- Companies
- Model instances
- API clients

**Example**:

```python
@pytest.fixture(scope="session")
def contenttypes(django_db_setup, django_db_blocker):
    """
    ✅ Session scope: Expensive, immutable

    From real conftest.py (line 61)
    """
    with django_db_blocker.unblock():
        from django.contrib.contenttypes.models import ContentType
        return {
            f"{ct.app_label}.{ct.model}": ct
            for ct in ContentType.objects.all()
        }


@pytest.fixture(scope="function")
def user_factory(db):
    """
    ✅ Function scope: Creates new users per test
    """
    def _create_user(**kwargs):
        from apps.core.models import User
        return User.objects.create(**kwargs)
    return _create_user
```

---

## Checklist for Test Fixtures

- [ ] **tenant_id fixture** exists and used in multi-tenant tests
- [ ] **NO manual company** in factory defaults
- [ ] **Factory pattern** for dynamic object creation
- [ ] **Proper scope** (session for expensive, function for mutable)
- [ ] **mocker.Mock()** not Mock() for mocking
- [ ] **Dependency injection** tested via mocked dependencies
- [ ] **Cross-tenant tests** verify isolation
- [ ] **Dual-mode tests** for Main/Tenant services (if applicable)

---

## Anti-Patterns (Don't Do This)

### ❌ Manual Company in Factory

```python
# ❌ WRONG
@pytest.fixture
def asset_factory(db, test_company):
    def _create_asset(**kwargs):
        defaults = {"company": test_company}  # ❌ Manual company
        defaults.update(kwargs)
        return Asset.objects.create(**defaults)
    return _create_asset

# ✅ CORRECT
@pytest.fixture
def asset_factory(db):
    def _create_asset(**kwargs):
        # ✅ NO company - middleware adds it
        return Asset.objects.create(**kwargs)
    return _create_asset
```

### ❌ Using Mock() Instead of mocker

```python
# ❌ WRONG
from unittest.mock import Mock

def test_something():
    mock = Mock()  # ❌ Direct Mock import

# ✅ CORRECT
def test_something(mocker):
    mock = mocker.Mock()  # ✅ pytest-mock mocker
```

### ❌ Wrong Fixture Scope

```python
# ❌ WRONG - Mutable data at session scope
@pytest.fixture(scope="session")
def test_user(db):
    return User.objects.create(email="test@example.com")  # ❌ Can be modified

# ✅ CORRECT - Function scope for mutable data
@pytest.fixture(scope="function")
def test_user(db):
    return User.objects.create(email="test@example.com")  # ✅ Fresh per test
```

---

**Use these fixture templates** for all multi-tenant testing!

**Last Updated**: 2025-01-23
**Based on**: Real Binora conftest.py patterns