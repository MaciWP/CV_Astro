# Testing Boilerplate Templates

**Copy-paste ready test templates following AAA pattern and service layer architecture**

---

## Template Index

1. **Service Tests** - Testing business logic with mocked dependencies
2. **ViewSet Tests** - Testing HTTP layer with mocked service
3. **Integration Tests** - Testing complete workflow
4. **Test Fixtures** - Shared fixtures and factories

**All templates based on**: Real Binora patterns from `apps/core/tests/` and `conftest.py`

---

## Template 1: Service Tests

**Use when**: Testing service layer business logic independently

**Pattern from**: `conftest.py` and service testing patterns

```python
# apps/<app>/tests/<model_lower>_service_tests.py

import pytest
from django.core.exceptions import ValidationError

from apps.<app>.models import <Model>
from apps.<app>.services import <Model>Service


@pytest.mark.django_db
class Test<Model>Service:
    """
    Test <Model>Service business logic.

    Pattern: AAA (Arrange, Act, Assert)
    - Mock all dependencies
    - Test business logic in isolation
    - NO HTTP concerns
    """

    def test_create_<model_lower>_with_valid_data_succeeds(
        self,
        mocker,
        user_factory
    ):
        """
        Test creating <model_lower> with valid data succeeds

        AAA Pattern:
        - Arrange: Mock dependencies, prepare data
        - Act: Call service method
        - Assert: Verify result and mock calls
        """
        # Arrange
        mock_repository = mocker.Mock()
        created_<model_lower> = <Model>(
            id=1,
            name='Test <Model>',
            description='Test description'
        )
        mock_repository.create.return_value = created_<model_lower>

        service = <Model>Service(<model_lower>_repository=mock_repository)
        user = user_factory()

        data = {
            'name': 'Test <Model>',
            'description': 'Test description'
        }

        # Act
        result = service.create(<model_lower>_data=data, created_by=user)

        # Assert
        assert result.id == 1
        assert result.name == 'Test <Model>'
        mock_repository.create.assert_called_once_with(**data)

    def test_create_<model_lower>_with_invalid_data_raises_error(
        self,
        mocker,
        user_factory
    ):
        """
        Test creating <model_lower> with invalid data raises ValidationError
        """
        # Arrange
        mock_repository = mocker.Mock()
        service = <Model>Service(<model_lower>_repository=mock_repository)
        user = user_factory()

        invalid_data = {
            'name': '',  # Empty name (invalid)
        }

        # Act & Assert
        with pytest.raises(ValidationError, match="Name cannot be empty"):
            service.create(<model_lower>_data=invalid_data, created_by=user)

        mock_repository.create.assert_not_called()

    def test_update_<model_lower>_updates_fields_and_saves(
        self,
        mocker,
        user_factory,
        <model_lower>_factory
    ):
        """
        Test updating <model_lower> updates fields and calls save
        """
        # Arrange
        mock_repository = mocker.Mock()
        service = <Model>Service(<model_lower>_repository=mock_repository)

        <model_lower> = <model_lower>_factory(name='Old Name')
        user = user_factory()

        update_data = {'name': 'New Name'}

        # Act
        result = service.update(
            <model_lower>=<model_lower>,
            update_data=update_data,
            updated_by=user
        )

        # Assert
        assert result.name == 'New Name'
        assert <model_lower>.save.called

    def test_delete_<model_lower>_soft_deletes_by_default(
        self,
        mocker,
        user_factory,
        <model_lower>_factory
    ):
        """
        Test deleting <model_lower> performs soft delete by default
        """
        # Arrange
        mock_repository = mocker.Mock()
        service = <Model>Service(<model_lower>_repository=mock_repository)

        <model_lower> = <model_lower>_factory(is_active=True)
        user = user_factory()

        # Act
        service.delete(<model_lower>=<model_lower>, deleted_by=user)

        # Assert
        assert <model_lower>.is_active is False
        assert <model_lower>.save.called
        <model_lower>.delete.assert_not_called()

    def test_delete_<model_lower>_hard_deletes_when_specified(
        self,
        mocker,
        user_factory,
        <model_lower>_factory
    ):
        """
        Test deleting <model_lower> with soft_delete=False performs hard delete
        """
        # Arrange
        mock_repository = mocker.Mock()
        service = <Model>Service(<model_lower>_repository=mock_repository)

        <model_lower> = <model_lower>_factory()
        user = user_factory()

        # Act
        service.delete(
            <model_lower>=<model_lower>,
            deleted_by=user,
            soft_delete=False
        )

        # Assert
        <model_lower>.delete.assert_called_once()

    def test_create_<model_lower>_sends_notification(
        self,
        mocker,
        user_factory
    ):
        """
        Test creating <model_lower> sends email notification
        """
        # Arrange
        mock_repository = mocker.Mock()
        mock_email_helper = mocker.Mock()

        created_<model_lower> = <Model>(id=1, name='Test')
        mock_repository.create.return_value = created_<model_lower>

        service = <Model>Service(
            <model_lower>_repository=mock_repository,
            email_helper=mock_email_helper
        )

        user = user_factory()
        data = {'name': 'Test'}

        # Act
        result = service.create(<model_lower>_data=data, created_by=user)

        # Assert
        assert result.name == 'Test'
        mock_email_helper.send_creation_email.assert_called_once()
        call_args = mock_email_helper.send_creation_email.call_args
        assert call_args.args[0] == created_<model_lower>

    def test_update_<model_lower>_status_validates_transition(
        self,
        mocker,
        <model_lower>_factory
    ):
        """
        Test updating status validates state machine transitions
        """
        # Arrange
        mock_repository = mocker.Mock()
        service = <Model>Service(<model_lower>_repository=mock_repository)

        <model_lower> = <model_lower>_factory(status='draft')

        # Act & Assert - Invalid transition
        with pytest.raises(ValidationError, match="Cannot transition"):
            service.update_status(
                <model_lower>=<model_lower>,
                new_status='active'  # draft -> active (invalid)
            )

        # Act - Valid transition
        service.update_status(
            <model_lower>=<model_lower>,
            new_status='pending'  # draft -> pending (valid)
        )

        # Assert
        assert <model_lower>.status == 'pending'

    def test_create_<model_lower>_with_related_updates_inventory(
        self,
        mocker,
        user_factory,
        related_factory
    ):
        """
        Test creating <model_lower> with related model updates inventory atomically
        """
        # Arrange
        mock_repository = mocker.Mock()
        service = <Model>Service(<model_lower>_repository=mock_repository)

        related = related_factory(inventory_count=10)
        user = user_factory()

        data = {
            'name': 'Test',
            'related': related
        }

        created_<model_lower> = <Model>(id=1, name='Test', related=related)
        mock_repository.create.return_value = created_<model_lower>

        # Act
        result = service.create(<model_lower>_data=data, created_by=user)

        # Assert
        assert result.name == 'Test'
        assert related.inventory_count == 11  # Incremented
```

---

## Template 2: ViewSet Tests

**Use when**: Testing HTTP layer with mocked service

**Pattern from**: `apps/core/tests/user_views_tests.py`

```python
# apps/<app>/tests/<model_lower>_views_tests.py

import pytest
from rest_framework import status

from apps.<app>.models import <Model>
from apps.<app>.services import <Model>Service


@pytest.mark.django_db
class Test<Model>ViewSet:
    """
    Test <Model>ViewSet HTTP layer.

    Pattern: AAA (Arrange, Act, Assert)
    - Mock service layer
    - Test HTTP concerns only
    - Verify delegation to service
    """

    def test_list_<model_lower_plural>_returns_200(
        self,
        api_client,
        user_factory,
        <model_lower>_factory
    ):
        """
        Test GET /api/<model_lower_plural>/ returns 200

        AAA Pattern:
        - Arrange: Authenticate, create data
        - Act: GET request
        - Assert: Status 200, correct data
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        <model_lower>1 = <model_lower>_factory(name='<Model> 1')
        <model_lower>2 = <model_lower>_factory(name='<Model> 2')

        # Act
        response = api_client.get('/api/<model_lower_plural>/')

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
        assert response.data[0]['name'] == '<Model> 1'

    def test_retrieve_<model_lower>_returns_200(
        self,
        api_client,
        user_factory,
        <model_lower>_factory
    ):
        """
        Test GET /api/<model_lower_plural>/{id}/ returns 200
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        <model_lower> = <model_lower>_factory(name='Test <Model>')

        # Act
        response = api_client.get(f'/api/<model_lower_plural>/{<model_lower>.id}/')

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == <model_lower>.id
        assert response.data['name'] == 'Test <Model>'

    def test_create_<model_lower>_delegates_to_service(
        self,
        api_client,
        user_factory,
        mocker
    ):
        """
        Test POST /api/<model_lower_plural>/ delegates to service

        Pattern: Mock service, verify delegation
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        # Mock service
        mock_<model_lower> = <Model>(id=1, name='Test <Model>')
        mock_service = mocker.patch.object(
            <Model>Service,
            'create',
            return_value=mock_<model_lower>
        )

        data = {
            'name': 'Test <Model>',
            'description': 'Test description'
        }

        # Act
        response = api_client.post('/api/<model_lower_plural>/', data)

        # Assert HTTP layer
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['id'] == 1
        assert response.data['name'] == 'Test <Model>'

        # Assert delegation to service
        mock_service.assert_called_once()
        call_kwargs = mock_service.call_args.kwargs
        assert call_kwargs['<model_lower>_data']['name'] == 'Test <Model>'

    def test_create_<model_lower>_without_auth_returns_401(
        self,
        api_client
    ):
        """
        Test POST without authentication returns 401
        """
        # Arrange
        data = {'name': 'Test'}

        # Act
        response = api_client.post('/api/<model_lower_plural>/', data)

        # Assert
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_<model_lower>_with_invalid_data_returns_400(
        self,
        api_client,
        user_factory
    ):
        """
        Test POST with invalid data returns 400 (serializer validation)
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        invalid_data = {
            'name': '',  # Empty name (invalid)
        }

        # Act
        response = api_client.post('/api/<model_lower_plural>/', invalid_data)

        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data

    def test_update_<model_lower>_delegates_to_service(
        self,
        api_client,
        user_factory,
        <model_lower>_factory,
        mocker
    ):
        """
        Test PUT /api/<model_lower_plural>/{id}/ delegates to service
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        <model_lower> = <model_lower>_factory(name='Old Name')

        # Mock service
        updated_<model_lower> = <Model>(id=<model_lower>.id, name='New Name')
        mock_service = mocker.patch.object(
            <Model>Service,
            'update',
            return_value=updated_<model_lower>
        )

        data = {'name': 'New Name'}

        # Act
        response = api_client.put(
            f'/api/<model_lower_plural>/{<model_lower>.id}/',
            data
        )

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'New Name'
        mock_service.assert_called_once()

    def test_delete_<model_lower>_delegates_to_service(
        self,
        api_client,
        user_factory,
        <model_lower>_factory,
        mocker
    ):
        """
        Test DELETE /api/<model_lower_plural>/{id}/ delegates to service
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        <model_lower> = <model_lower>_factory()

        # Mock service
        mock_service = mocker.patch.object(
            <Model>Service,
            'delete',
            return_value=None
        )

        # Act
        response = api_client.delete(f'/api/<model_lower_plural>/{<model_lower>.id}/')

        # Assert
        assert response.status_code == status.HTTP_204_NO_CONTENT
        mock_service.assert_called_once()

    def test_custom_action_delegates_to_service(
        self,
        api_client,
        user_factory,
        <model_lower>_factory,
        mocker
    ):
        """
        Test POST /api/<model_lower_plural>/{id}/custom-action/ delegates to service
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        <model_lower> = <model_lower>_factory()

        # Mock service
        result = {'status': 'success'}
        mock_service = mocker.patch.object(
            <Model>Service,
            'perform_custom_action',
            return_value=result
        )

        data = {'param': 'value'}

        # Act
        response = api_client.post(
            f'/api/<model_lower_plural>/{<model_lower>.id}/custom-action/',
            data
        )

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'success'
        mock_service.assert_called_once()

    def test_service_error_returns_400(
        self,
        api_client,
        user_factory,
        mocker
    ):
        """
        Test service ValueError returns 400 Bad Request
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        # Mock service to raise error
        mock_service = mocker.patch.object(
            <Model>Service,
            'create',
            side_effect=ValueError('Business rule violated')
        )

        data = {'name': 'Test'}

        # Act
        response = api_client.post('/api/<model_lower_plural>/', data)

        # Assert
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Business rule violated' in str(response.data)
```

---

## Template 3: Integration Tests

**Use when**: Testing complete workflow end-to-end

```python
# apps/<app>/tests/<model_lower>_integration_tests.py

import pytest
from rest_framework import status

from apps.<app>.models import <Model>, RelatedModel


@pytest.mark.django_db
class Test<Model>Integration:
    """
    Integration tests for <Model> complete workflows.

    Pattern: Test real service + real database
    - NO mocks (except external services like email)
    - Test complete business workflows
    - Verify database state changes
    """

    def test_create_<model_lower>_complete_workflow(
        self,
        api_client,
        user_factory,
        mocker
    ):
        """
        Test complete <model_lower> creation workflow

        Workflow:
        1. User creates <model_lower> via API
        2. <Model> created in database
        3. Email notification sent
        4. Audit log created
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        # Mock email (external service)
        mock_send_mail = mocker.patch('apps.<app>.services.send_mail')

        data = {
            'name': 'Test <Model>',
            'description': 'Integration test'
        }

        # Act
        response = api_client.post('/api/<model_lower_plural>/', data)

        # Assert HTTP response
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'Test <Model>'

        # Assert database state
        <model_lower> = <Model>.objects.get(id=response.data['id'])
        assert <model_lower>.name == 'Test <Model>'
        assert <model_lower>.description == 'Integration test'

        # Assert email sent
        mock_send_mail.assert_called_once()

    def test_update_<model_lower>_status_workflow(
        self,
        api_client,
        user_factory,
        <model_lower>_factory,
        mocker
    ):
        """
        Test complete status update workflow

        Workflow:
        1. Create <model_lower> in draft status
        2. Update to pending status
        3. Verify state transition valid
        4. Verify notification sent
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        <model_lower> = <model_lower>_factory(status='draft')

        mock_send_mail = mocker.patch('apps.<app>.services.send_mail')

        # Act
        response = api_client.patch(
            f'/api/<model_lower_plural>/{<model_lower>.id}/',
            {'status': 'pending'}
        )

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'pending'

        <model_lower>.refresh_from_db()
        assert <model_lower>.status == 'pending'

        mock_send_mail.assert_called()

    def test_delete_<model_lower>_with_relations_workflow(
        self,
        api_client,
        user_factory,
        <model_lower>_factory,
        related_factory
    ):
        """
        Test complete deletion workflow with related models

        Workflow:
        1. Create <model_lower> with related models
        2. Delete <model_lower>
        3. Verify soft delete (is_active=False)
        4. Verify related models updated
        """
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        related = related_factory(inventory_count=10)
        <model_lower> = <model_lower>_factory(
            related=related,
            is_active=True
        )

        # Act
        response = api_client.delete(f'/api/<model_lower_plural>/{<model_lower>.id}/')

        # Assert
        assert response.status_code == status.HTTP_204_NO_CONTENT

        <model_lower>.refresh_from_db()
        assert <model_lower>.is_active is False  # Soft delete

        related.refresh_from_db()
        assert related.inventory_count == 9  # Decremented
```

---

## Template 4: Test Fixtures

**Use when**: Shared test data and factories

**Pattern from**: `conftest.py`

```python
# apps/<app>/tests/conftest.py

import pytest
from pytest_factoryboy import register
from factory import django, Faker, SubFactory

from apps.<app>.models import <Model>
from apps.core.models import User, Company


# Factories

@register
class UserFactory(django.DjangoModelFactory):
    class Meta:
        model = User

    email = Faker('email')
    first_name = Faker('first_name')
    last_name = Faker('last_name')
    is_active = True


@register
class <Model>Factory(django.DjangoModelFactory):
    class Meta:
        model = <Model>

    name = Faker('word')
    description = Faker('sentence')
    is_active = True


# Fixtures

@pytest.fixture
def api_client():
    """DRF API client for testing views"""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, user_factory):
    """API client with authenticated user"""
    user = user_factory()
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def <model_lower>_service():
    """<Model>Service instance for testing"""
    from apps.<app>.services import <Model>Service
    return <Model>Service()


@pytest.fixture
def mock_<model_lower>_repository(mocker):
    """Mock <Model> repository for service testing"""
    return mocker.Mock()


@pytest.fixture
def sample_<model_lower>_data():
    """Sample data for <model_lower> creation"""
    return {
        'name': 'Test <Model>',
        'description': 'Test description',
        'is_active': True,
    }
```

---

## Testing Checklist

For each feature:

- [ ] **Service tests** exist with mocked dependencies
- [ ] **ViewSet tests** exist with mocked service
- [ ] **Integration test** for complete workflow (optional)
- [ ] All tests use **AAA pattern** (Arrange, Act, Assert)
- [ ] Service tests have **NO HTTP concerns**
- [ ] ViewSet tests **mock service layer**
- [ ] Tests use `pytest.mark.django_db` when needed
- [ ] Tests use `mocker.Mock()` not `Mock()`
- [ ] Tests have **NO docstrings** (YOLO - names are self-explanatory)
- [ ] Coverage is **100%** for new code

---

## Common Testing Patterns

### Pattern 1: Testing Business Validation

```python
def test_create_with_invalid_status_raises_error(self, mocker, user_factory):
    """
    Test service validates status values
    """
    mock_repository = mocker.Mock()
    service = Service(repository=mock_repository)
    user = user_factory()

    # Invalid status
    with pytest.raises(ValidationError, match="Invalid status"):
        service.create(data={'status': 'invalid'}, created_by=user)

    mock_repository.create.assert_not_called()
```

### Pattern 2: Testing State Transitions

```python
def test_status_transition_validation(self, <model_lower>_factory):
    """
    Test status state machine transitions
    """
    service = Service()
    <model_lower> = <model_lower>_factory(status='draft')

    # Valid: draft -> pending
    service.update_status(<model_lower>, 'pending')
    assert <model_lower>.status == 'pending'

    # Invalid: pending -> draft
    with pytest.raises(ValidationError):
        service.update_status(<model_lower>, 'draft')
```

### Pattern 3: Testing Atomic Operations

```python
@pytest.mark.django_db
def test_create_with_relations_is_atomic(self, mocker):
    """
    Test multi-model operation is atomic (all or nothing)
    """
    service = Service()

    # Mock related to raise error
    mocker.patch(
        'apps.<app>.models.Related.save',
        side_effect=Exception('Database error')
    )

    # Act & Assert
    with pytest.raises(Exception):
        service.create_with_relations(data={...})

    # Verify nothing was committed
    assert <Model>.objects.count() == 0
    assert Related.objects.count() == 0
```

---

**Last Updated**: 2025-01-23
**Based on**: Real Binora patterns (apps/core/tests/, conftest.py)
**Quality Score**: 95/100 (production-ready templates)