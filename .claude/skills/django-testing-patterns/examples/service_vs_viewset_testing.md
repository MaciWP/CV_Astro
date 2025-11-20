# Service vs ViewSet Testing Strategies

**Different layers = different testing approaches**

---

## Service Tests: Business Logic

**Goal**: Test business logic in isolation with mocked dependencies

```python
@pytest.mark.django_db
class TestAssetService:

    def test_create_asset_updates_rack_inventory(self, mocker, user_factory):
        # Arrange
        mock_assets_repo = mocker.Mock()
        mock_racks_repo = mocker.Mock()

        rack = mocker.Mock(occupied_units=10)
        asset_data = {"name": "Test", "rack": rack, "u_size": 2}

        service = AssetService(
            assets_repository=mock_assets_repo,
            racks_repository=mock_racks_repo
        )

        # Act
        service.create(asset_data)

        # Assert
        assert rack.occupied_units == 12  # Updated
        rack.save.assert_called_once()
```

**What to test**:
- ✅ Business logic execution
- ✅ Mock interactions
- ✅ State changes
- ❌ NOT HTTP concerns

---

## ViewSet Tests: HTTP Layer

**Goal**: Test HTTP delegation to service with mocked service

```python
@pytest.mark.django_db
class TestAssetViewSet:

    def test_create_asset_delegates_to_service(self, api_client, user_factory, mocker):
        # Arrange
        user = user_factory()
        api_client.force_authenticate(user=user)

        mock_asset = mocker.Mock(id=1, name="Test")
        mock_service = mocker.patch.object(
            AssetService,
            'create',
            return_value=mock_asset
        )

        data = {"name": "Test"}

        # Act
        response = api_client.post("/api/assets/", data)

        # Assert - HTTP concerns
        assert response.status_code == 201
        assert response.data["name"] == "Test"

        # Assert - Delegation
        mock_service.assert_called_once()
```

**What to test**:
- ✅ HTTP status codes
- ✅ Response format
- ✅ Delegation to service
- ✅ Authentication/permissions
- ❌ NOT business logic details

---

## Comparison

| Aspect | Service Tests | ViewSet Tests |
|--------|--------------|---------------|
| **Focus** | Business logic | HTTP layer |
| **Mocks** | Dependencies | Service |
| **Assertions** | Logic execution | HTTP responses |
| **Coverage** | Business rules | API contract |

---

**Pattern**: Service tests + ViewSet tests = Complete coverage
