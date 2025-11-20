# Service Test Template

**Pattern**: Testing business logic with mocked dependencies

---

## Template: Basic Service Test

```python
# apps/<app>/tests/<model>_service_tests.py

import pytest
from apps.<app>.models import <Model>
from apps.<app>.services import <Model>Service


@pytest.mark.django_db
class Test<Model>Service:

    def test_create_<model>_with_valid_data_succeeds(self, mocker, user_factory):
        # Arrange
        mock_repository = mocker.Mock()
        mock_email = mocker.Mock()
        
        created_<model> = <Model>(id=1, name="Test")
        mock_repository.create.return_value = created_<model>
        
        service = <Model>Service(
            <model>_repository=mock_repository,
            email_helper=mock_email
        )
        
        user = user_factory()
        data = {"name": "Test"}

        # Act
        result = service.create(data=data, created_by=user)

        # Assert
        assert result.name == "Test"
        mock_repository.create.assert_called_once_with(**data)
        mock_email.send_creation_email.assert_called_once()

    def test_create_<model>_with_invalid_data_raises_error(self, mocker):
        # Arrange
        mock_repository = mocker.Mock()
        service = <Model>Service(<model>_repository=mock_repository)
        
        invalid_data = {"name": ""}

        # Act & Assert
        with pytest.raises(ValidationError, match="Name cannot be empty"):
            service.create(data=invalid_data, created_by=mocker.Mock())
        
        mock_repository.create.assert_not_called()
```

---

**Key Points**:
- Use `mocker.Mock()` NOT `Mock()`
- AAA pattern with blank lines
- NO docstrings
- Test name format: `test_<action>_<context>_<expected>`

---

**Real Example**: `apps/core/tests/auth_service_tests.py`
