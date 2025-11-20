# ViewSet Test Template

**Pattern**: Testing HTTP layer with mocked service

---

## Template: Basic ViewSet Test

```python
# apps/<app>/tests/<model>_views_tests.py

import pytest
from rest_framework import status
from apps.<app>.services import <Model>Service


@pytest.mark.django_db
class Test<Model>ViewSet:

    def test_list_<models>_returns_200(self, api_client, user_factory, <model>_factory):
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)
        
        <model>1 = <model>_factory(name="Test 1")
        <model>2 = <model>_factory(name="Test 2")

        # Act
        response = api_client.get("/api/<models>/")

        # Assert
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_create_<model>_delegates_to_service(self, api_client, user_factory, mocker):
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)
        
        mock_<model> = mocker.Mock(id=1, name="Test")
        mock_service = mocker.patch.object(
            <Model>Service,
            'create',
            return_value=mock_<model>
        )
        
        data = {"name": "Test"}

        # Act
        response = api_client.post("/api/<models>/", data)

        # Assert
        assert response.status_code == status.HTTP_201_CREATED
        mock_service.assert_called_once()

    def test_create_<model>_without_auth_returns_401(self, api_client):
        # Arrange
        data = {"name": "Test"}

        # Act
        response = api_client.post("/api/<models>/", data)

        # Assert
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

---

**Key Points**:
- Mock service layer
- Test HTTP concerns only  
- NO docstrings
- AAA pattern

---

**Real Example**: `apps/core/tests/user_views_tests.py`
