# pytest-django Test Template

**Purpose**: Generate pytest-django tests following Binora Backend patterns (AAA, mocker.Mock(), ZERO docstrings/comments, 100% coverage).

**Usage**: Replace {{slots}} with actual values for your implementation.

---

## Test Class Template

```python
# apps/{{app_name}}/tests/{{module_name}}_tests.py
import pytest
from django.core.exceptions import ValidationError

from apps.{{app_name}}.models import {{ModelName}}
from apps.{{app_name}}.services import {{ServiceName}}
{{#related_imports}}
from apps.{{related_app}}.models import {{RelatedModel}}
{{/related_imports}}


class Test{{ServiceName}}{{MethodName}}:
    {{#test_cases}}
    @pytest.mark.django_db
    def test_{{action}}_{{context}}_{{expected}}(self{{#uses_mocker}}, mocker{{/uses_mocker}}{{#uses_fixtures}}, {{fixture_names}}{{/uses_fixtures}}):
        {{#arrange_section}}
        {{arrange_code}}
        {{/arrange_section}}

        {{#act_section}}
        {{act_code}}
        {{/act_section}}

        {{#assert_section}}
        {{assert_code}}
        {{/assert_section}}
    {{/test_cases}}
```

---

## Slot Definitions

### General Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{app_name}}` | Django app name | `assets`, `core` |
| `{{module_name}}` | Module being tested | `user_service`, `asset_views` |
| `{{ModelName}}` | Model class name | `Asset`, `User` |
| `{{ServiceName}}` | Service class name | `AssetService`, `UserService` |
| `{{MethodName}}` | Method being tested | `Create`, `Update`, `Delete` |

### Test Case Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{action}}` | Action being tested | `create_user`, `update_asset` |
| `{{context}}` | Test context/scenario | `with_valid_data`, `with_duplicate_email` |
| `{{expected}}` | Expected outcome | `creates_user_successfully`, `raises_validation_error` |
| `{{uses_mocker}}` | Include mocker param? | `True`/`False` |
| `{{uses_fixtures}}` | Include fixtures? | `True`/`False` |
| `{{fixture_names}}` | Fixture parameter names | `company, admin_user` |

### Test Section Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{arrange_code}}` | Setup test data | See examples below |
| `{{act_code}}` | Execute code under test | See examples below |
| `{{assert_code}}` | Verify expectations | See examples below |

---

## Complete Example Templates

### Template 1: Service Create Method (Happy Path)

**Input values**:
- `{{action}}` = `create_asset`
- `{{context}}` = `with_valid_data`
- `{{expected}}` = `creates_asset_successfully`
- `{{uses_mocker}}` = `False`
- `{{uses_fixtures}}` = `True`, `company, admin_user`

**Generated code**:
```python
@pytest.mark.django_db
def test_create_asset_with_valid_data_creates_asset_successfully(self, company, admin_user):
    name = "Test Asset"
    serial_number = "SN12345"

    asset = AssetService.create_asset(
        name=name,
        serial_number=serial_number,
        created_by=admin_user
    )

    assert asset.name == name
    assert asset.serial_number == serial_number
    assert asset.created_by == admin_user
    assert Asset.objects.filter(serial_number=serial_number).exists()
```

### Template 2: Service Create Method (Error Case)

**Input values**:
- `{{action}}` = `create_asset`
- `{{context}}` = `with_duplicate_serial_number`
- `{{expected}}` = `raises_validation_error`
- `{{uses_mocker}}` = `False`
- `{{uses_fixtures}}` = `True`, `company, admin_user`

**Generated code**:
```python
@pytest.mark.django_db
def test_create_asset_with_duplicate_serial_number_raises_validation_error(self, company, admin_user):
    serial_number = "SN12345"
    Asset.objects.create(
        name="Existing Asset",
        serial_number=serial_number,
        company=company,
        created_by=admin_user
    )

    with pytest.raises(ValidationError, match="Serial number already exists"):
        AssetService.create_asset(
            name="New Asset",
            serial_number=serial_number,
            created_by=admin_user
        )
```

### Template 3: Service with Mocking (External Dependency)

**Input values**:
- `{{action}}` = `create_user`
- `{{context}}` = `with_email_notification`
- `{{expected}}` = `sends_welcome_email`
- `{{uses_mocker}}` = `True`
- `{{uses_fixtures}}` = `True`, `company`

**Generated code**:
```python
@pytest.mark.django_db
def test_create_user_with_email_notification_sends_welcome_email(self, mocker, company):
    email = "test@example.com"
    password = "Password123"
    mock_send_email = mocker.patch.object(EmailService, 'send_welcome_email')

    user = UserService.create_user_with_onboarding(
        email=email,
        password=password
    )

    mock_send_email.assert_called_once_with(user)
    assert user.email == email
```

### Template 4: ViewSet Test (API Endpoint)

**Input values**:
- `{{action}}` = `list_assets`
- `{{context}}` = `as_authenticated_user`
- `{{expected}}` = `returns_200_with_assets`
- `{{uses_mocker}}` = `False`
- `{{uses_fixtures}}` = `True`, `api_client, admin_user, company`

**Generated code**:
```python
@pytest.mark.django_db
def test_list_assets_as_authenticated_user_returns_200_with_assets(self, api_client, admin_user, company):
    api_client.force_authenticate(user=admin_user)
    Asset.objects.create(name="Asset 1", serial_number="SN1", company=company, created_by=admin_user)
    Asset.objects.create(name="Asset 2", serial_number="SN2", company=company, created_by=admin_user)

    response = api_client.get('/api/assets/')

    assert response.status_code == 200
    assert len(response.data['results']) == 2
    assert response.data['results'][0]['name'] == "Asset 2"
```

### Template 5: ViewSet Create with Validation Error

**Input values**:
- `{{action}}` = `create_asset`
- `{{context}}` = `with_invalid_data`
- `{{expected}}` = `returns_400_with_errors`
- `{{uses_mocker}}` = `False`
- `{{uses_fixtures}}` = `True`, `api_client, admin_user`

**Generated code**:
```python
@pytest.mark.django_db
def test_create_asset_with_invalid_data_returns_400_with_errors(self, api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    data = {"name": ""}

    response = api_client.post('/api/assets/', data=data)

    assert response.status_code == 400
    assert 'name' in response.data
```

---

## Common Arrange Patterns

### Simple Data Setup
```python
# Arrange
email = "test@example.com"
password = "Password123"
```

### Model Instance Creation
```python
# Arrange
user = User.objects.create(
    email="test@example.com",
    company=company,
    created_by=admin_user
)
```

### Multiple Instances
```python
# Arrange
assets = [
    Asset.objects.create(name=f"Asset {i}", serial_number=f"SN{i}", company=company, created_by=admin_user)
    for i in range(5)
]
```

### Mock Setup
```python
# Arrange
mock_send_email = mocker.patch.object(EmailService, 'send_welcome_email')
mock_send_email.return_value = None
```

---

## Common Act Patterns

### Service Method Call
```python
# Act
asset = AssetService.create_asset(
    name=name,
    serial_number=serial_number,
    created_by=admin_user
)
```

### ViewSet API Call
```python
# Act
response = api_client.post('/api/assets/', data=data)
```

### Exception Expected
```python
# Act & Assert
with pytest.raises(ValidationError, match="Error message"):
    AssetService.create_asset(...)
```

---

## Common Assert Patterns

### Model Field Assertions
```python
# Assert
assert asset.name == name
assert asset.serial_number == serial_number
assert asset.created_by == admin_user
```

### Database State Assertions
```python
# Assert
assert Asset.objects.filter(serial_number=serial_number).exists()
assert Asset.objects.count() == 1
```

### API Response Assertions
```python
# Assert
assert response.status_code == 200
assert response.data['name'] == "Asset Name"
assert len(response.data['results']) == 5
```

### Mock Call Assertions
```python
# Assert
mock_send_email.assert_called_once_with(user)
mock_send_email.assert_called_once()
assert mock_send_email.call_count == 2
```

---

## Fixture Patterns

### Session-Scoped Fixture (Immutable Data)
```python
# conftest.py
@pytest.fixture(scope='session')
def company_immutable():
    return Company.objects.create(
        name="Test Company",
        subdomain="testco"
    )
```

### Function-Scoped Fixture (Mutable Data)
```python
# conftest.py
@pytest.fixture
def user(company):
    return User.objects.create(
        email="test@example.com",
        company=company
    )
```

### API Client Fixture
```python
# conftest.py
@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()
```

---

## Mocker Patterns

### Patch Method on Class
```python
mock_method = mocker.patch.object(SomeService, 'some_method')
```

### Patch with Return Value
```python
mock_method = mocker.patch.object(
    SomeService,
    'get_data',
    return_value={'key': 'value'}
)
```

### Spy on Real Method
```python
spy_method = mocker.spy(SomeService, 'some_method')
```

### Multiple Mocks
```python
mock_email = mocker.patch.object(EmailService, 'send_email')
mock_audit = mocker.patch.object(AuditService, 'log_action')
```

---

## Edge Cases to Test

### Boundary Values
```python
@pytest.mark.django_db
def test_create_asset_with_max_length_name_creates_successfully(self, admin_user):
    name = "A" * 100

    asset = AssetService.create_asset(name=name, serial_number="SN1", created_by=admin_user)

    assert asset.name == name
```

### Empty/Null Values
```python
@pytest.mark.django_db
def test_create_asset_with_empty_name_raises_validation_error(self, admin_user):
    with pytest.raises(ValidationError):
        AssetService.create_asset(name="", serial_number="SN1", created_by=admin_user)
```

### Unauthorized Access
```python
@pytest.mark.django_db
def test_list_assets_as_unauthenticated_user_returns_401(self, api_client):
    response = api_client.get('/api/assets/')

    assert response.status_code == 401
```

---

## Test Organization Pattern

```python
# apps/core/tests/user_service_tests.py
import pytest
from apps.core.services import UserService
from apps.core.models import User


class TestUserServiceCreate:

    @pytest.mark.django_db
    def test_create_user_with_valid_data_creates_user_successfully(self, company):
        # Happy path
        pass

    @pytest.mark.django_db
    def test_create_user_with_duplicate_email_raises_validation_error(self, company):
        # Error case
        pass

    @pytest.mark.django_db
    def test_create_user_with_short_password_raises_validation_error(self, company):
        # Validation error
        pass


class TestUserServiceUpdate:

    @pytest.mark.django_db
    def test_update_user_email_with_valid_email_updates_successfully(self, user):
        # Happy path
        pass

    @pytest.mark.django_db
    def test_update_user_with_nonexistent_id_raises_does_not_exist(self):
        # Not found error
        pass
```

---

## Validation Checklist

After generating tests from this template, verify:

- [ ] ZERO docstrings in test file?
- [ ] ZERO comments in test file?
- [ ] Test name follows `test_<action>_<context>_<expected>` pattern?
- [ ] Clear AAA structure with blank lines?
- [ ] Uses mocker.Mock() (NEVER Mock())?
- [ ] No `from unittest.mock import Mock` import?
- [ ] Fixtures used for setup (not creating data in test)?
- [ ] All error cases tested (ValidationError, DoesNotExist)?
- [ ] All code branches tested (if/else)?
- [ ] Tests grouped in classes by functionality?
- [ ] @pytest.mark.django_db on all tests that access DB?

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Pattern**: AAA, mocker.Mock(), ZERO docstrings, 100% coverage target
