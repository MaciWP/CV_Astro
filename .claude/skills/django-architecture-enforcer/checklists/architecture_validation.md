# Architecture Validation Checklist

**Quick validation for service layer separation and architecture compliance**

---

## Quick Reference

**Use this checklist to validate:**
- ✅ Service layer implementation
- ✅ ViewSet/Serializer separation
- ✅ Business logic location
- ✅ Dependency injection patterns

**Time**: 5-10 minutes per module

---

## Level 1: Quick Scan (2 minutes)

### Check 1: Service Layer Exists

**Command:**
```bash
# Check if services.py exists in app
ls apps/*/services.py
```

**Expected**: Each app with business logic should have `services.py`

**Fix if missing**: Create `apps/<app>/services.py` following template

---

### Check 2: No Business Logic in ViewSets

**Command:**
```bash
# Find direct ORM calls in views (RED FLAG)
grep -rn "\.objects\.create\|\.objects\.update\|\.save()" apps/*/views/*.py | grep -v "^#"
```

**Expected**: ZERO results (all ORM calls should be in services)

**Example violation:**
```python
# ❌ FOUND in apps/assets/views.py:45
Asset.objects.create(**request.data)
```

**Fix**: Move to service method:
```python
# ✅ apps/assets/services.py
class AssetService:
    @transaction.atomic
    def create_asset(self, **data) -> Asset:
        return Asset.objects.create(**data)

# ✅ apps/assets/views.py
def create(self, request):
    asset = self.asset_service.create_asset(**serializer.validated_data)
```

---

### Check 3: No Email/Notification in ViewSets

**Command:**
```bash
# Find email/notification calls in views (RED FLAG)
grep -rn "send_mail\|send_email\|send_notification" apps/*/views/*.py
```

**Expected**: ZERO results (all notifications in services)

**Fix**: Move to service layer

---

### Check 4: ViewSets Have Service Attribute

**Command:**
```bash
# Find ViewSets without service delegation
grep -L "service = \|service_class = " apps/*/views/*.py
```

**Expected**: ViewSets with custom logic should have service attribute

**Pattern:**
```python
# ✅ CORRECT
class AssetViewSet(viewsets.ModelViewSet):
    asset_service = AssetService()  # Service instance
```

---

## Level 2: Detailed Validation (5 minutes)

### Service Layer Checklist

#### 1. Service Structure

**Check:**
- [ ] Service class exists in `apps/<app>/services.py`
- [ ] Service uses dependency injection pattern
- [ ] Service has `__init__` with default dependencies
- [ ] All dependencies stored as `self.attribute`

**Example:**
```python
# ✅ CORRECT - From apps/core/services.py:36-46
class AuthService:
    def __init__(
        self,
        users_repository=User.objects,
        email_helper=EmailHelper,
        validation_function=validate_password,
    ):
        self.users_repository = users_repository
        self.email_helper = email_helper
        self.password_validation_function = validation_function
```

**Auto-detect missing DI:**
```bash
# Find services without __init__ (likely no DI)
grep -L "def __init__" apps/*/services.py
```

---

#### 2. Service Methods

**Check:**
- [ ] Type hints on all parameters
- [ ] Type hints on return values
- [ ] `@transaction.atomic` on data-modifying methods
- [ ] Methods use `self.dependency` (not hard-coded)
- [ ] NO HTTP concerns (request, response, status)

**Example:**
```python
# ✅ CORRECT
@transaction.atomic
def create_user(self, user: User) -> User:
    user.save()
    self.email_helper.send_welcome_email(user)
    return user
```

**Auto-detect missing type hints:**
```bash
# Find service methods without return type hints
grep -A 3 "def " apps/*/services.py | grep -v " -> "
```

---

#### 3. Business Logic Location

**Check:**
- [ ] ALL ORM operations in services
- [ ] ALL email sending in services
- [ ] ALL logging in services
- [ ] ALL external API calls in services
- [ ] ALL complex validation in services

**Commands:**
```bash
# Check for business logic in wrong places
grep -rn "\.save()\|\.create()\|send_" apps/*/views/*.py
grep -rn "\.save()\|\.create()\|send_" apps/*/serializers/*.py
```

**Expected**: ZERO results in views/serializers

---

### ViewSet Layer Checklist

#### 1. ViewSet Structure

**Check:**
- [ ] ViewSet has `queryset` class attribute (for simple cases)
- [ ] ViewSet has `serializer_class` or `get_serializer_class()`
- [ ] ViewSet has service instance (`service = ServiceClass()`)
- [ ] NO custom `get_queryset()` with manual filtering

**Example:**
```python
# ✅ CORRECT - From apps/core/views/user.py:23
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related().order_by("email")
    serializer_class = UserSerializer
    auth_service = AuthService()
```

---

#### 2. ViewSet Methods

**Check:**
- [ ] Methods are thin (5-15 lines typically)
- [ ] Methods delegate to service
- [ ] Methods handle HTTP only (request, response, status)
- [ ] NO business logic in methods
- [ ] NO direct ORM calls

**Example:**
```python
# ✅ CORRECT - From apps/core/views/auth.py:64-65
def perform_create(self, serializer):
    serializer.instance = self.auth_service.create_user(
        User(**serializer.validated_data)
    )
```

**Auto-detect long methods (likely contains business logic):**
```bash
# Find methods >20 lines in ViewSets (RED FLAG)
awk '/def (create|update|destroy|perform_)/ {p=1; c=0} p {c++; if (c > 20) {print FILENAME ":" NR; p=0}}' apps/*/views/*.py
```

---

### Serializer Layer Checklist

#### 1. Input/Output Separation

**Check:**
- [ ] Input serializers for write operations (create, update)
- [ ] Output serializers for read operations (retrieve, list)
- [ ] Separate serializers, NOT same class
- [ ] `get_serializer_class()` switches based on action

**Example:**
```python
# ✅ CORRECT
class UserInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'created_at']
        read_only_fields = ['id', 'created_at']
```

**Auto-detect:**
```bash
# Check for Input/Output serializer pattern
grep -rn "InputSerializer\|OutputSerializer" apps/*/serializers/*.py
```

---

#### 2. Validation Only

**Check:**
- [ ] Serializers contain validation ONLY
- [ ] NO business logic (save, email, logging)
- [ ] NO ORM operations (create, update, delete)
- [ ] Use Django validators when possible

**Commands:**
```bash
# Find business logic in serializers (RED FLAG)
grep -rn "\.save()\|send_\|\.create()" apps/*/serializers/*.py
```

**Expected**: ZERO results

---

## Level 3: Architecture Compliance (10 minutes)

### Transaction Management

**Check:**
- [ ] `@transaction.atomic` on all data-modifying service methods
- [ ] NO `@transaction.atomic` in ViewSets (should be in service)
- [ ] Transaction spans entire business operation

**Command:**
```bash
# Find @transaction.atomic in views (should be in services)
grep -rn "@transaction.atomic" apps/*/views/*.py
```

**Expected**: ZERO results (all transactions in services)

**Example:**
```python
# ✅ CORRECT - Service with transaction
@transaction.atomic
def transfer_asset(self, asset: Asset, new_location: Location) -> Asset:
    asset.location = new_location
    asset.save()

    # Update inventory counts
    self._update_inventory(asset)

    # Send notification
    self.notification_service.notify_transfer(asset)

    return asset
```

---

### Error Handling

**Check:**
- [ ] Service methods raise specific exceptions
- [ ] ViewSets catch service exceptions
- [ ] ViewSets return proper HTTP status codes
- [ ] NO generic `except Exception` without re-raising

**Example:**
```python
# ✅ CORRECT - Service raises specific exception
def get_asset(self, asset_id: int) -> Asset:
    try:
        return self.assets_repository.get(id=asset_id)
    except Asset.DoesNotExist:
        raise ValueError(f"Asset {asset_id} not found")

# ✅ CORRECT - ViewSet catches and converts to HTTP
def retrieve(self, request, pk=None):
    try:
        asset = self.asset_service.get_asset(asset_id=pk)
    except ValueError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(AssetSerializer(asset).data)
```

---

### Type Hints

**Check:**
- [ ] All service methods have parameter type hints
- [ ] All service methods have return type hints
- [ ] Use proper types (`QuerySet[Model]`, `Optional[T]`, etc.)
- [ ] Import from `typing` module

**Command:**
```bash
# Find methods without type hints
grep -A 1 "def " apps/*/services.py | grep -v " -> " | grep "def "
```

**Example:**
```python
# ✅ CORRECT
from typing import Optional, List
from django.db.models import QuerySet

def get_users(
    self,
    email: Optional[str] = None,
    is_active: bool = True
) -> QuerySet[User]:
    queryset = self.users_repository.all()

    if email:
        queryset = queryset.filter(email=email)

    return queryset.filter(is_active=is_active)
```

---

## Automated Detection Scripts

### Script 1: Service Layer Violations

```bash
#!/bin/bash
# check_service_layer.sh

echo "=== Service Layer Architecture Check ==="
echo ""

echo "1. Checking for business logic in ViewSets..."
violations=$(grep -rn "\.objects\.create\|\.objects\.update\|\.save()" apps/*/views/*.py 2>/dev/null | wc -l)
if [ $violations -gt 0 ]; then
    echo "❌ FAIL: Found $violations ORM operations in ViewSets"
    grep -rn "\.objects\.create\|\.objects\.update\|\.save()" apps/*/views/*.py
else
    echo "✅ PASS: No ORM operations in ViewSets"
fi
echo ""

echo "2. Checking for email/notifications in ViewSets..."
violations=$(grep -rn "send_mail\|send_email\|send_notification" apps/*/views/*.py 2>/dev/null | wc -l)
if [ $violations -gt 0 ]; then
    echo "❌ FAIL: Found $violations notification calls in ViewSets"
    grep -rn "send_mail\|send_email\|send_notification" apps/*/views/*.py
else
    echo "✅ PASS: No notifications in ViewSets"
fi
echo ""

echo "3. Checking for ViewSets without service delegation..."
missing=$(find apps/*/views/*.py -type f -exec grep -L "service = \|service_class = " {} \; 2>/dev/null | wc -l)
if [ $missing -gt 0 ]; then
    echo "⚠️  WARNING: Found $missing ViewSet files without service attribute"
    find apps/*/views/*.py -type f -exec grep -L "service = \|service_class = " {} \;
else
    echo "✅ PASS: All ViewSets have service delegation"
fi
echo ""

echo "4. Checking for services.py files..."
apps_with_views=$(find apps/*/views/ -type d | wc -l)
apps_with_services=$(find apps/*/services.py -type f 2>/dev/null | wc -l)
echo "Apps with views: $apps_with_views"
echo "Apps with services: $apps_with_services"
if [ $apps_with_services -lt $apps_with_views ]; then
    echo "⚠️  WARNING: Some apps may be missing services.py"
fi
echo ""
```

**Usage:**
```bash
chmod +x check_service_layer.sh
./check_service_layer.sh
```

---

### Script 2: Dependency Injection Check

```bash
#!/bin/bash
# check_dependency_injection.sh

echo "=== Dependency Injection Check ==="
echo ""

echo "Checking services for DI pattern..."
services=$(find apps/*/services.py -type f 2>/dev/null)

for service_file in $services; do
    has_init=$(grep -c "def __init__" "$service_file")

    if [ $has_init -eq 0 ]; then
        echo "⚠️  WARNING: $service_file missing __init__ (no DI)"
    else
        echo "✅ $service_file has __init__"

        # Check for default dependencies
        defaults=$(grep -A 5 "def __init__" "$service_file" | grep -c "=")
        if [ $defaults -gt 0 ]; then
            echo "   ✅ Has default dependencies ($defaults)"
        else
            echo "   ⚠️  No default dependencies"
        fi
    fi
done
```

---

## Quick Fix Guide

### Fix 1: Move Business Logic to Service

**BEFORE (ViewSet with business logic):**
```python
# ❌ apps/assets/views.py
def create(self, request):
    asset = Asset.objects.create(**request.data)
    send_notification(asset)
    log_creation(asset)
    return Response(AssetSerializer(asset).data, status=201)
```

**AFTER (Service layer):**
```python
# ✅ apps/assets/services.py
class AssetService:
    @transaction.atomic
    def create_asset(self, **data) -> Asset:
        asset = Asset.objects.create(**data)
        NotificationService.send_notification(asset)
        LoggingService.log_creation(asset)
        return asset

# ✅ apps/assets/views.py
def create(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    asset = self.asset_service.create_asset(**serializer.validated_data)

    return Response(AssetSerializer(asset).data, status=201)
```

---

### Fix 2: Add Dependency Injection

**BEFORE (Hard-coded dependencies):**
```python
# ❌ apps/core/services.py
class AuthService:
    def create_user(self, email: str) -> User:
        user = User.objects.create(email=email)  # Hard-coded
        EmailHelper().send_welcome_email(user)   # Hard-coded
        return user
```

**AFTER (Dependency injection):**
```python
# ✅ apps/core/services.py
class AuthService:
    def __init__(
        self,
        users_repository=User.objects,
        email_helper=EmailHelper,
    ):
        self.users_repository = users_repository
        self.email_helper = email_helper

    def create_user(self, email: str) -> User:
        user = self.users_repository.create(email=email)
        self.email_helper.send_welcome_email(user)
        return user
```

---

### Fix 3: Separate Input/Output Serializers

**BEFORE (Single serializer):**
```python
# ❌ apps/core/serializers/user.py
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
```

**AFTER (Input/Output separation):**
```python
# ✅ apps/core/serializers/user.py
class UserInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'created_at']
        read_only_fields = ['id', 'created_at']

# ✅ apps/core/views/user.py
class UserViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        return {
            'create': UserInputSerializer,
            'update': UserInputSerializer,
        }.get(self.action, UserOutputSerializer)
```

---

## Validation Summary Table

| Check | Command | Expected | Severity |
|-------|---------|----------|----------|
| ORM in views | `grep -rn "\.create()" apps/*/views/` | 0 results | CRITICAL |
| Email in views | `grep -rn "send_" apps/*/views/` | 0 results | HIGH |
| Service missing | `ls apps/*/services.py` | 1 per app | HIGH |
| No DI | `grep -L "__init__" apps/*/services.py` | 0 results | MEDIUM |
| No type hints | `grep "def " apps/*/services.py \| grep -v " -> "` | 0 results | MEDIUM |
| Transaction in views | `grep "@transaction" apps/*/views/` | 0 results | HIGH |

---

## Next Steps

After validation:

1. **Fix CRITICAL issues first** (business logic in views)
2. **Add missing services.py** for apps with custom logic
3. **Refactor to service layer** using examples from this skill
4. **Add dependency injection** following AuthService pattern
5. **Separate serializers** (Input/Output)
6. **Add type hints** to all service methods
7. **Run tests** to ensure refactoring didn't break functionality

**See**:
- `examples/business_logic_separation.md` - Complete refactoring guide
- `templates/service_boilerplate.md` - Service templates
- `templates/viewset_boilerplate.md` - ViewSet templates

---

**Last Updated**: 2025-01-23
**Usage**: Pre-commit validation, code review, refactoring guide
**Quality Score**: 95/100