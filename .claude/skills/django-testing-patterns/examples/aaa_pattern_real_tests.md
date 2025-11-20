# AAA Pattern - Real Binora Tests

**Real code from**: `apps/core/tests/user_views_tests.py`

---

## ✅ CORRECT: AAA Pattern

```python
@pytest.mark.django_db
class TestUserViewSet:

    def test_list_users_returns_200_with_authenticated_user(
        self,
        api_client,
        user_factory
    ):
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        # Act
        response = api_client.get("/api/users/")

        # Assert
        assert response.status_code == 200
        assert isinstance(response.data, list)

    def test_create_user_with_valid_data_returns_201(
        self,
        api_client,
        user_factory
    ):
        # Arrange
        admin = user_factory(is_superuser=True)
        api_client.force_authenticate(user=admin)

        data = {
            "email": "newuser@example.com",
            "first_name": "John",
            "last_name": "Doe"
        }

        # Act
        response = api_client.post("/api/users/", data)

        # Assert
        assert response.status_code == 201
        assert response.data["email"] == "newuser@example.com"
        assert User.objects.filter(email="newuser@example.com").exists()

    def test_create_user_without_email_returns_400(
        self,
        api_client,
        user_factory
    ):
        # Arrange
        admin = user_factory(is_superuser=True)
        api_client.force_authenticate(user=admin)

        data = {"first_name": "John"}  # Missing email

        # Act
        response = api_client.post("/api/users/", data)

        # Assert
        assert response.status_code == 400
        assert "email" in response.data
```

---

## Key Points

**Arrange**:
- Create test data
- Setup mocks
- Authenticate user

**Act**:
- Execute ONE action
- Usually one API call or method call

**Assert**:
- Verify expected outcomes
- Multiple asserts OK if related

**NO docstrings**: Test names are self-explanatory

---

## Benefits

- ✅ Easy to read
- ✅ Clear test structure
- ✅ Easy to debug when test fails
- ✅ Consistent across codebase

---

**Pattern**: ALL Binora tests follow AAA with blank lines
