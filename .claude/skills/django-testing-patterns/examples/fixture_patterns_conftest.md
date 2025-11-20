# Fixture Patterns from conftest.py

**Real code**: `conftest.py:77-150`

---

## Pattern 1: Factory Registration

```python
# conftest.py

from pytest_factoryboy import register
from factory import django, Faker


@register
class UserFactory(django.DjangoModelFactory):
    class Meta:
        model = User

    email = Faker('email')
    first_name = Faker('first_name')
    is_active = True
```

**Usage**:
```python
def test_list_users(user_factory):
    user = user_factory()  # Creates User
    user2 = user_factory(email="custom@example.com")  # Override
```

---

## Pattern 2: API Client Fixture

```python
@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()
```

**Usage**:
```python
def test_endpoint(api_client):
    response = api_client.get("/api/users/")
    assert response.status_code == 200
```

---

## Pattern 3: Multi-Tenant Fixture (CRITICAL)

```python
@pytest.fixture
def tenant_id(db):
    from apps.hierarchy.models import Company
    company = Company.objects.create(
        name="Test Company",
        subdomain="test"
    )
    return company.id
```

**Usage**:
```python
def test_multi_tenant_isolation(api_client, user_factory, tenant_id):
    # tenant_id automatically sets up company context
    user = user_factory()
    # ...
```

---

## Pattern 4: Fixture Scopes

```python
# Session scope - shared across all tests
@pytest.fixture(scope="session")
def django_db_setup():
    # Database setup

# Function scope - new for each test (default)
@pytest.fixture
def user_factory():
    # Recreated each test
```

---

**Real Reference**: `conftest.py` lines 77-150
