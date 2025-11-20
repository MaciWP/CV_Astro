# Common Test Mistakes and Fixes

**Anti-patterns in testing and how to fix them**

---

## Mistake 1: Docstrings in Tests

```python
# ❌ WRONG
def test_create_user():
    """Test creating a user with valid data."""  # NO DOCSTRINGS!
    ...

# ✅ CORRECT
def test_create_user_with_valid_data_succeeds():
    # Self-explanatory name, no docstring needed
    ...
```

**Rule**: NO docstrings in tests. Ever.

---

## Mistake 2: Using Mock() Instead of mocker.Mock()

```python
# ❌ WRONG
from unittest.mock import Mock

def test_service():
    mock = Mock()

# ✅ CORRECT
def test_service(mocker):
    mock = mocker.Mock()
```

**Rule**: Always use mocker fixture

---

## Mistake 3: No AAA Structure

```python
# ❌ WRONG - No clear structure
def test_endpoint(api_client):
    user = User.objects.create(email="test@example.com")
    api_client.force_authenticate(user=user)
    response = api_client.get("/api/users/")
    assert response.status_code == 200

# ✅ CORRECT - Clear AAA
def test_endpoint(api_client, user_factory):
    # Arrange
    user = user_factory()
    api_client.force_authenticate(user=user)

    # Act
    response = api_client.get("/api/users/")

    # Assert
    assert response.status_code == 200
```

---

## Mistake 4: Testing Implementation Instead of Behavior

```python
# ❌ WRONG - Tests implementation
def test_service(mocker):
    mock_repo = mocker.Mock()
    service = UserService(users_repository=mock_repo)

    service.create(email="test@example.com")

    # Testing HOW it's implemented
    assert service.users_repository == mock_repo

# ✅ CORRECT - Tests behavior
def test_service(mocker):
    mock_repo = mocker.Mock()
    mock_repo.create.return_value = User(id=1)

    service = UserService(users_repository=mock_repo)
    result = service.create(email="test@example.com")

    # Testing WHAT it does
    assert result.id == 1
    mock_repo.create.assert_called_once()
```

---

## Mistake 5: Not Using Fixtures

```python
# ❌ WRONG - Direct instantiation
def test_endpoint():
    client = APIClient()
    user = User.objects.create(email="test@example.com")

# ✅ CORRECT - Use fixtures
def test_endpoint(api_client, user_factory):
    user = user_factory()
```

---

## Mistake 6: Missing @pytest.mark.django_db

```python
# ❌ WRONG - Database access without marker
def test_create_user():
    user = User.objects.create(...)  # FAILS!

# ✅ CORRECT
@pytest.mark.django_db
def test_create_user():
    user = User.objects.create(...)  # Works
```

---

## Mistake 7: Not Verifying Mocks

```python
# ❌ WRONG - Mock not verified
def test_service(mocker):
    mock_email = mocker.Mock()
    service = UserService(email_helper=mock_email)

    service.create(email="test@example.com")
    # No verification of mock_email!

# ✅ CORRECT - Verify mock called
def test_service(mocker):
    mock_email = mocker.Mock()
    service = UserService(email_helper=mock_email)

    service.create(email="test@example.com")

    mock_email.send_welcome_email.assert_called_once()
```

---

## Mistake 8: Testing Multiple Things

```python
# ❌ WRONG - Tests too much
def test_user_crud(api_client, user_factory):
    # Create
    response = api_client.post(...)
    assert response.status_code == 201

    # List
    response = api_client.get(...)
    assert len(response.data) == 1

    # Update
    response = api_client.put(...)
    assert response.status_code == 200

# ✅ CORRECT - One test per behavior
def test_create_user_returns_201(api_client):
    ...

def test_list_users_returns_all_users(api_client):
    ...

def test_update_user_returns_200(api_client):
    ...
```

---

## Mistake 9: Poor Test Names

```python
# ❌ WRONG
def test_user()
def test_1()
def test_create()

# ✅ CORRECT
def test_create_user_with_valid_email_succeeds()
def test_create_user_with_duplicate_email_returns_400()
def test_list_users_without_auth_returns_401()
```

---

## Mistake 10: Not Testing Error Cases

```python
# ❌ INCOMPLETE - Only happy path
def test_create_user(service):
    user = service.create(email="test@example.com")
    assert user.email == "test@example.com"

# ✅ COMPLETE - Happy + error paths
def test_create_user_with_valid_email_succeeds(service):
    user = service.create(email="test@example.com")
    assert user.email == "test@example.com"

def test_create_user_with_invalid_email_raises_error(service):
    with pytest.raises(ValidationError):
        service.create(email="invalid")

def test_create_user_with_duplicate_email_raises_error(service, user_factory):
    user_factory(email="test@example.com")

    with pytest.raises(ValidationError):
        service.create(email="test@example.com")
```

---

**Rule**: Test both happy path AND error cases for 100% coverage
