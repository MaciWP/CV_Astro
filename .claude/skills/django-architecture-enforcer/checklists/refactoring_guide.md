# Refactoring Guide - From Monolithic to Service Layer

**Step-by-step guide to refactor existing code to service layer architecture**

---

## When to Use This Guide

Use this guide when:
- ✅ ViewSet has business logic (>20 lines per method)
- ✅ ViewSet contains ORM operations directly
- ✅ ViewSet sends emails, logs, or calls external APIs
- ✅ Code review identifies architecture violations
- ✅ Testing is difficult due to tight coupling

**Time estimate**: 1-3 hours per ViewSet (depending on complexity)

---

## Refactoring Process Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Analyze (15 min)                                    │
│ - Identify business logic in ViewSet                        │
│ - List dependencies (email, logging, external APIs)         │
│ - Document current behavior                                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Create Service (30 min)                             │
│ - Create services.py (if not exists)                        │
│ - Add service class with __init__ (DI)                      │
│ - Extract business logic to service methods                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Refactor ViewSet (20 min)                           │
│ - Add service instance to ViewSet                           │
│ - Replace business logic with service calls                 │
│ - Keep only HTTP concerns                                   │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Update Tests (30 min)                               │
│ - Create service tests (mock dependencies)                  │
│ - Update ViewSet tests (mock service)                       │
│ - Ensure 100% coverage maintained                           │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Validate (15 min)                                   │
│ - Run all tests                                             │
│ - Check coverage (should be same or better)                 │
│ - Verify no regressions                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Analyze Current Code

### 1.1 Identify Business Logic

**Look for these patterns in ViewSet methods:**

```python
# ❌ RED FLAGS - Business logic in ViewSet

# Direct ORM operations
User.objects.create(...)
asset.save()
Model.objects.filter(...).delete()

# Email/Notification sending
send_mail(...)
send_notification(...)
EmailService.send(...)

# Logging
logger.info(...)
AuditLog.objects.create(...)

# External API calls
requests.post(...)
stripe.charge.create(...)

# Complex validation
if complex_business_rule():
    ...

# File processing
process_file(...)
generate_report(...)
```

**Example analysis:**

```python
# apps/assets/views.py (BEFORE - Needs refactoring)

class AssetViewSet(viewsets.ModelViewSet):
    def create(self, request):
        # Line 1-5: HTTP (OK)
        serializer = AssetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Line 6-15: BUSINESS LOGIC (MUST MOVE)
        asset = Asset.objects.create(**serializer.validated_data)  # ORM
        asset.rack.occupied_units += asset.u_size  # Business rule
        asset.rack.save()  # ORM

        send_mail(  # Email
            subject=f"New asset: {asset.name}",
            message="...",
            recipient_list=["admin@example.com"]
        )

        AssetLog.objects.create(  # Logging
            asset=asset,
            action="created",
            user=request.user
        )

        # Line 16-18: HTTP (OK)
        return Response(
            AssetSerializer(asset).data,
            status=status.HTTP_201_CREATED
        )
```

**Analysis result:**
- **HTTP concerns**: Lines 1-5, 16-18 (stay in ViewSet)
- **Business logic**: Lines 6-15 (move to service)
- **Dependencies**: Asset model, Rack model, email, logging

---

### 1.2 Document Current Behavior

Create a checklist of what the code currently does:

```markdown
## Current AssetViewSet.create() Behavior

1. ✅ Validate input data (serializer)
2. ✅ Create Asset record
3. ✅ Update Rack occupied_units (+= asset.u_size)
4. ✅ Save Rack
5. ✅ Send email notification to admin
6. ✅ Create AssetLog entry
7. ✅ Return Asset data with 201 status

## Dependencies Identified
- Asset.objects (ORM)
- Rack model (ORM)
- send_mail (email)
- AssetLog.objects (logging)
- request.user (context)
```

---

## Step 2: Create Service Layer

### 2.1 Create services.py File

If `apps/<app>/services.py` doesn't exist:

```bash
touch apps/assets/services.py
```

### 2.2 Add Service Class with DI

**Template:**

```python
# apps/assets/services.py (NEW FILE)

from typing import Optional
from django.db import transaction
from django.core.mail import send_mail

from apps.assets.models import Asset, AssetLog


class AssetService:
    """
    Service layer for asset business logic.

    Dependencies injected via constructor for testability.
    """

    def __init__(
        self,
        assets_repository=Asset.objects,
        asset_logs_repository=AssetLog.objects,
        # Add other dependencies as needed
    ):
        """
        Initialize service with dependencies.

        Args:
            assets_repository: Asset ORM manager (default: Asset.objects)
            asset_logs_repository: AssetLog ORM manager (default: AssetLog.objects)
        """
        self.assets_repository = assets_repository
        self.asset_logs_repository = asset_logs_repository
```

**Pattern from**: `apps/core/services.py:36-46` (AuthService)

---

### 2.3 Extract Business Logic to Service Method

**Before (in ViewSet):**
```python
# ❌ ViewSet with business logic (lines 6-15)
asset = Asset.objects.create(**serializer.validated_data)
asset.rack.occupied_units += asset.u_size
asset.rack.save()

send_mail(...)
AssetLog.objects.create(...)
```

**After (in Service):**
```python
# ✅ Service method with business logic
# apps/assets/services.py

from django.contrib.auth import get_user_model

User = get_user_model()


class AssetService:
    # ... __init__ from above ...

    @transaction.atomic
    def create_asset(
        self,
        asset_data: dict,
        created_by: User
    ) -> Asset:
        """
        Create asset with business logic.

        Business operations:
        1. Create Asset record
        2. Update Rack inventory
        3. Send notification email
        4. Log creation

        Args:
            asset_data: Validated asset data from serializer
            created_by: User creating the asset

        Returns:
            Created Asset instance
        """
        # Create asset
        asset = self.assets_repository.create(**asset_data)

        # Update rack inventory
        if asset.rack:
            asset.rack.occupied_units += asset.u_size
            asset.rack.save()

        # Send notification
        self._send_creation_notification(asset)

        # Log creation
        self._log_asset_creation(asset, created_by)

        return asset

    # Private helper methods

    def _send_creation_notification(self, asset: Asset) -> None:
        """Send email notification for asset creation"""
        send_mail(
            subject=f"New asset: {asset.name}",
            message=f"Asset {asset.name} was created.",
            from_email="noreply@example.com",
            recipient_list=["admin@example.com"]
        )

    def _log_asset_creation(self, asset: Asset, user: User) -> None:
        """Log asset creation"""
        self.asset_logs_repository.create(
            asset=asset,
            action="created",
            user=user
        )
```

**Key improvements:**
- ✅ Type hints on all parameters
- ✅ `@transaction.atomic` ensures atomicity
- ✅ Clear docstring explaining business operations
- ✅ Private helper methods (`_send_`, `_log_`) for organization
- ✅ Uses injected dependencies (`self.assets_repository`)

---

## Step 3: Refactor ViewSet

### 3.1 Add Service Instance

```python
# apps/assets/views.py

from apps.assets.services import AssetService


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related('rack').order_by('code')
    serializer_class = AssetSerializer

    # ✅ Add service instance
    asset_service = AssetService()
```

---

### 3.2 Replace Business Logic with Service Call

**Before (50 lines with business logic):**
```python
# ❌ BEFORE
def create(self, request):
    serializer = AssetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # 40 lines of business logic...
    asset = Asset.objects.create(**serializer.validated_data)
    asset.rack.occupied_units += asset.u_size
    asset.rack.save()
    send_mail(...)
    AssetLog.objects.create(...)

    return Response(
        AssetSerializer(asset).data,
        status=status.HTTP_201_CREATED
    )
```

**After (10 lines, HTTP only):**
```python
# ✅ AFTER
def create(self, request):
    # HTTP: Validate input
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # DELEGATE: Business logic in service
    asset = self.asset_service.create_asset(
        asset_data=serializer.validated_data,
        created_by=request.user
    )

    # HTTP: Format response
    output_serializer = AssetSerializer(asset)
    return Response(output_serializer.data, status=status.HTTP_201_CREATED)
```

**Comparison:**
- **BEFORE**: 50 lines (HTTP + business logic mixed)
- **AFTER**: 10 lines (HTTP only)
- **Business logic**: Now in service (testable independently)

---

### 3.3 Handle Service Exceptions

Services may raise exceptions - ViewSet converts them to HTTP responses:

```python
# ✅ ViewSet with proper error handling

def create(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        asset = self.asset_service.create_asset(
            asset_data=serializer.validated_data,
            created_by=request.user
        )
    except ValueError as e:
        # Convert business exception to HTTP 400
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except PermissionError as e:
        # Convert permission exception to HTTP 403
        return Response(
            {"error": str(e)},
            status=status.HTTP_403_FORBIDDEN
        )

    output_serializer = AssetSerializer(asset)
    return Response(output_serializer.data, status=status.HTTP_201_CREATED)
```

---

## Step 4: Update Tests

### 4.1 Create Service Tests

**New file**: `apps/assets/tests/asset_service_tests.py`

```python
# apps/assets/tests/asset_service_tests.py (NEW FILE)

import pytest
from apps.assets.models import Asset
from apps.assets.services import AssetService


@pytest.mark.django_db
class TestAssetService:
    """Test AssetService business logic"""

    def test_create_asset_updates_rack_inventory(
        self,
        mocker,
        user_factory,
        rack_factory
    ):
        """
        Test creating asset updates rack occupied_units

        AAA Pattern:
        - Arrange: Mock dependencies, create rack
        - Act: Call create_asset
        - Assert: Rack inventory updated
        """
        # Arrange
        mock_assets_repo = mocker.Mock()
        mock_logs_repo = mocker.Mock()

        rack = rack_factory(occupied_units=0)
        asset_data = {
            'name': 'Test Asset',
            'rack': rack,
            'u_size': 2
        }
        user = user_factory()

        # Mock asset creation
        created_asset = Asset(
            id=1,
            name='Test Asset',
            rack=rack,
            u_size=2
        )
        mock_assets_repo.create.return_value = created_asset

        service = AssetService(
            assets_repository=mock_assets_repo,
            asset_logs_repository=mock_logs_repo
        )

        # Act
        asset = service.create_asset(
            asset_data=asset_data,
            created_by=user
        )

        # Assert
        assert asset.name == 'Test Asset'
        assert rack.occupied_units == 2  # Updated
        mock_logs_repo.create.assert_called_once()

    def test_create_asset_sends_notification(self, mocker, user_factory):
        """
        Test creating asset sends email notification
        """
        mock_send_mail = mocker.patch('apps.assets.services.send_mail')
        mock_assets_repo = mocker.Mock()

        asset_data = {'name': 'Test Asset'}
        user = user_factory()

        created_asset = Asset(id=1, name='Test Asset')
        mock_assets_repo.create.return_value = created_asset

        service = AssetService(assets_repository=mock_assets_repo)

        asset = service.create_asset(
            asset_data=asset_data,
            created_by=user
        )

        mock_send_mail.assert_called_once()
        call_kwargs = mock_send_mail.call_args.kwargs
        assert 'Test Asset' in call_kwargs['subject']
```

**Pattern notes:**
- ✅ AAA pattern (Arrange, Act, Assert)
- ✅ Mock all dependencies
- ✅ Test business logic in isolation
- ✅ NO docstrings (YOLO - test names are self-explanatory)

---

### 4.2 Update ViewSet Tests

**Update existing tests** to mock service instead of testing business logic:

**Before (testing business logic in view test):**
```python
# ❌ BEFORE - View test testing business logic
def test_create_asset_updates_rack(api_client, user_factory, rack_factory):
    user = user_factory()
    api_client.force_authenticate(user=user)

    rack = rack_factory(occupied_units=0)

    response = api_client.post('/api/assets/', {
        'name': 'Test',
        'rack': rack.id,
        'u_size': 2
    })

    assert response.status_code == 201
    rack.refresh_from_db()
    assert rack.occupied_units == 2  # Testing business logic!
```

**After (testing HTTP delegation only):**
```python
# ✅ AFTER - View test testing HTTP delegation
def test_create_asset_delegates_to_service(
    api_client,
    user_factory,
    mocker
):
    user = user_factory()
    api_client.force_authenticate(user=user)

    # Mock service
    mock_asset = Asset(id=1, name='Test')
    mock_service = mocker.patch.object(
        AssetService,
        'create_asset',
        return_value=mock_asset
    )

    response = api_client.post('/api/assets/', {
        'name': 'Test',
        'u_size': 2
    })

    # Assert HTTP layer
    assert response.status_code == 201
    assert response.data['name'] == 'Test'

    # Assert delegation
    mock_service.assert_called_once()
    call_kwargs = mock_service.call_args.kwargs
    assert call_kwargs['asset_data']['name'] == 'Test'
    assert call_kwargs['created_by'] == user
```

**Key changes:**
- ❌ BEFORE: Tested business logic (rack update) in view test
- ✅ AFTER: Mock service, test HTTP layer only
- ✅ Business logic tested separately in service tests

---

## Step 5: Validate Refactoring

### 5.1 Run All Tests

```bash
# Run all tests
nox -s test

# Run specific app tests
pytest apps/assets/tests/ -v

# Check coverage
pytest apps/assets/tests/ --cov=apps/assets --cov-report=term-missing
```

**Expected:**
- ✅ All tests pass
- ✅ Coverage maintained or improved (target 100%)
- ✅ NO regressions

---

### 5.2 Validate Architecture

**Run architecture validation:**

```bash
# Check for business logic in views
grep -rn "\.create()\|\.save()\|send_" apps/assets/views/*.py

# Expected: ZERO results
```

**Check service layer:**

```bash
# Verify service has DI
grep -A 5 "def __init__" apps/assets/services.py

# Verify service has type hints
grep -c " -> " apps/assets/services.py

# Expected: Type hints on all methods
```

---

### 5.3 Behavior Verification Checklist

Use the checklist from Step 1.2 to verify all behavior preserved:

```markdown
## Verify AssetViewSet.create() Behavior

- [x] Validate input data (serializer) - Still works ✅
- [x] Create Asset record - In service ✅
- [x] Update Rack occupied_units - In service ✅
- [x] Save Rack - In service ✅
- [x] Send email notification - In service ✅
- [x] Create AssetLog entry - In service ✅
- [x] Return Asset data with 201 - Still in view ✅

✅ ALL behavior preserved, now properly separated
```

---

## Common Refactoring Patterns

### Pattern 1: Extract Email Sending

**Before:**
```python
# ❌ In ViewSet
send_mail(
    subject="...",
    message="...",
    from_email="...",
    recipient_list=[...]
)
```

**After:**
```python
# ✅ In Service - private method
def _send_notification(self, entity):
    send_mail(
        subject=f"Notification: {entity.name}",
        message="...",
        from_email="noreply@example.com",
        recipient_list=["admin@example.com"]
    )

# Called from main service method
@transaction.atomic
def create_entity(self, data):
    entity = self.repository.create(**data)
    self._send_notification(entity)  # Extracted
    return entity
```

---

### Pattern 2: Extract Complex Validation

**Before:**
```python
# ❌ In ViewSet
if obj.status == 'active' and not user.has_perm('can_modify_active'):
    return Response({"error": "..."}, status=403)
```

**After:**
```python
# ✅ In Service - raises exception
def _validate_can_modify(self, obj, user):
    if obj.status == 'active' and not user.has_perm('can_modify_active'):
        raise PermissionError("Cannot modify active objects")

# ViewSet catches exception
try:
    self.service.update_entity(obj, user, data)
except PermissionError as e:
    return Response({"error": str(e)}, status=403)
```

---

### Pattern 3: Extract Multi-Model Operations

**Before:**
```python
# ❌ In ViewSet
asset = Asset.objects.create(**data)
asset.rack.occupied_units += asset.u_size
asset.rack.save()
inventory.total_assets += 1
inventory.save()
```

**After:**
```python
# ✅ In Service - atomic transaction
@transaction.atomic
def create_asset(self, asset_data):
    asset = self.assets_repository.create(**asset_data)

    # Update related models atomically
    if asset.rack:
        asset.rack.occupied_units += asset.u_size
        asset.rack.save()

    inventory = self.inventory_repository.get_or_create_default()
    inventory.total_assets += 1
    inventory.save()

    return asset
```

---

## Refactoring Checklist

### Pre-Refactoring
- [ ] Read and understand current ViewSet behavior
- [ ] Document all business operations performed
- [ ] List all dependencies (email, logging, external APIs)
- [ ] Ensure tests exist and pass (baseline)
- [ ] Check coverage percentage (baseline)

### During Refactoring
- [ ] Create `services.py` if missing
- [ ] Add service class with `__init__` (DI pattern)
- [ ] Extract business logic to service methods
- [ ] Add type hints to all service methods
- [ ] Use `@transaction.atomic` for data operations
- [ ] Update ViewSet to use service
- [ ] Keep ViewSet methods thin (5-15 lines)
- [ ] Create service tests with mocked dependencies
- [ ] Update ViewSet tests to mock service

### Post-Refactoring
- [ ] All tests pass
- [ ] Coverage maintained or improved
- [ ] NO business logic in ViewSet (grep check)
- [ ] Service has DI pattern
- [ ] Type hints on all service methods
- [ ] All behavior documented in Step 1.2 preserved
- [ ] Code review approved

---

## Time Estimates

**Small ViewSet** (1-2 custom methods):
- Analysis: 15 min
- Service creation: 30 min
- ViewSet refactoring: 15 min
- Tests update: 30 min
- Validation: 10 min
- **Total**: ~1.5 hours

**Medium ViewSet** (3-5 custom methods):
- Analysis: 30 min
- Service creation: 45 min
- ViewSet refactoring: 30 min
- Tests update: 45 min
- Validation: 15 min
- **Total**: ~2.5 hours

**Large ViewSet** (6+ custom methods):
- Analysis: 45 min
- Service creation: 60 min
- ViewSet refactoring: 45 min
- Tests update: 60 min
- Validation: 30 min
- **Total**: ~4 hours

---

## Next Steps

After refactoring:

1. **Review**: Have another developer review the changes
2. **Document**: Update any relevant documentation
3. **Deploy**: Follow standard deployment process
4. **Monitor**: Watch for any unexpected behavior in production

**See also:**
- `examples/business_logic_separation.md` - Complete before/after example
- `templates/service_boilerplate.md` - Service templates
- `checklists/architecture_validation.md` - Validation scripts

---

**Last Updated**: 2025-01-23
**Usage**: Refactoring monolithic ViewSets to service layer
**Quality Score**: 95/100