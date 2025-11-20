# conftest.py Patterns

**Pattern**: Fixtures and factories from real Binora code

**Real file**: `conftest.py:77-150`

---

## Pattern 1: Factory Registration

```python
# conftest.py

import pytest
from pytest_factoryboy import register
from factory import django, Faker, SubFactory

from apps.core.models import User, Company


@register
class UserFactory(django.DjangoModelFactory):
    class Meta:
        model = User

    email = Faker('email')
    first_name = Faker('first_name')
    last_name = Faker('last_name')
    is_active = True


@register
class CompanyFactory(django.DjangoModelFactory):
    class Meta:
        model = Company

    name = Faker('company')
    subdomain = Faker('word')
```

---

## Pattern 2: Essential Fixtures

```python
@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, user_factory):
    user = user_factory()
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def tenant_id(db):
    """CRITICAL: Multi-tenant fixture"""
    from apps.hierarchy.models import Company
    company = Company.objects.create(name="Test Company", subdomain="test")
    return company.id
```

---

## Pattern 3: Service Mocking

```python
@pytest.fixture
def mock_<model>_repository(mocker):
    return mocker.Mock()


@pytest.fixture
def mock_email_helper(mocker):
    return mocker.Mock()
```

---

**Usage**:

```python
def test_create_user(api_client, user_factory):
    user = user_factory()  # Uses registered factory
    api_client.force_authenticate(user=user)
    # ...
```

---

**Real Reference**: `conftest.py` lines 77-150
