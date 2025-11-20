# Comprehensive Multi-Tenant Audit Checklist

**Deep audit guide for Binora Backend multi-tenant compliance**

Use this checklist before major releases, during code reviews, or when investigating potential multi-tenant violations.

---

## 🎯 Audit Levels

**Level 1: Quick Scan** (~5 minutes)
- Grep for critical violations
- Check recent changes only

**Level 2: Module Audit** (~15-30 minutes)
- Full app directory scan
- Review all ViewSets and Services
- Validate tests

**Level 3: Full Compliance** (~1-2 hours)
- Entire codebase scan
- Cross-app analysis
- Performance review
- Security audit

---

## LEVEL 1: Quick Scan (5 minutes)

### Critical Pattern Detection

Run these commands to find violations:

```bash
# 1. Manual tenant_id filtering (CRITICAL)
grep -r "\.filter(company=" apps/*/views/ apps/*/services.py --exclude-dir=tests

# 2. Manual tenant_id in queries (CRITICAL)
grep -r "\.filter(tenant_id=" apps/ --exclude-dir=tests

# 3. Company parameters in services (HIGH)
grep -r "company: Company" apps/*/services.py

# 4. Mock() without mocker (HIGH)
grep -r "from unittest.mock import Mock" apps/*/tests/

# 5. get_queryset with company filter (CRITICAL)
grep -r "def get_queryset" apps/*/views/ -A 5 | grep "filter(company"
```

**Expected Result**: All commands should return ZERO results (or only in middleware/core)

**If violations found**:
- Stop and fix immediately
- Run `/check-tenant` on affected files
- Re-run quick scan to verify fix

---

## LEVEL 2: Module Audit (15-30 minutes)

### Section A: Models

**File pattern**: `apps/*/models/*.py`, `apps/*/models.py`

#### Checklist for Each Model

- [ ] **Inheritance Check**
  ```bash
  # Find models that should inherit AuditModel but don't
  grep -r "class.*models.Model" apps/*/models/ | grep -v "AuditModel"
  ```
  - Models with company scope MUST inherit `AuditModel`
  - Global models (like `Company` itself) can inherit `models.Model`

- [ ] **Manual Company Field**
  ```bash
  # Find manual company ForeignKey definitions
  grep -r "company.*=.*ForeignKey.*Company" apps/*/models/
  ```
  - Should return ZERO results (except in AuditModel definition)
  - All company FKs should be inherited

- [ ] **Index Optimization**
  ```python
  # Check Meta.indexes includes company for filtered fields
  class Meta:
      indexes = [
          models.Index(fields=["company", "status"]),  # ✅
          models.Index(fields=["status"]),  # ⚠️ Missing company
      ]
  ```
  - Frequently filtered fields should have composite index with company

- [ ] **Unique Constraints**
  ```python
  # Ensure uniqueness includes company
  class Meta:
      unique_together = [["company", "code"]]  # ✅
      # NOT: unique_together = [["code"]]  # ❌
  ```

**Common Issues**:
- Forgetting to inherit AuditModel
- Adding manual company field
- Unique constraints without company
- Missing indexes on filtered fields

---

### Section B: Services

**File pattern**: `apps/*/services.py`, `apps/*/services/*.py`

#### Checklist for Each Service

- [ ] **NO Company Parameters**
  ```bash
  # Find methods with company parameters
  grep -rn "def.*company: Company" apps/*/services.py
  ```
  - Should return ZERO results
  - Company filtering handled by middleware

- [ ] **Dependency Injection Pattern**
  ```python
  # ✅ CORRECT pattern
  def __init__(
      self,
      repository=Model.objects,  # ✅ Default provided
      helper=Helper,
  ):
      self.repository = repository
  ```
  - All dependencies injected via __init__
  - Defaults provided for production use
  - Enables easy testing with mocks

- [ ] **Type Hints Present**
  ```bash
  # Find methods without return type hints
  grep -rn "def [^_].*) -> None:" apps/*/services.py | grep -v "-> "
  ```
  - All parameters should have type hints
  - All return values should have type hints
  - Use `Optional[T]` for nullable returns

- [ ] **Dual-Mode Detection (if applicable)**
  ```python
  # Services that forward to Main must check service type
  if settings.MAIN_INSTANCE_URL is not None:
      # Tenant mode
  else:
      # Main mode
  ```
  - Check for auth-related operations
  - User management operations
  - Operations that modify Main data

- [ ] **Transaction Management**
  ```python
  # Data modification methods should use transactions
  @transaction.atomic
  def update_resource(self, instance, data):
      # ...
  ```
  - All create/update/delete operations
  - Methods that touch multiple models
  - Critical business workflows

**Common Issues**:
- Company parameters in method signatures
- Missing type hints
- No dependency injection
- Forgetting dual-mode check for auth operations
- Missing @transaction.atomic

---

### Section C: ViewSets

**File pattern**: `apps/*/views/*.py`, `apps/*/views.py`

#### Checklist for Each ViewSet

- [ ] **Queryset Optimization**
  ```python
  # ✅ CORRECT
  queryset = Model.objects.select_related(
      "foreign_key"
  ).prefetch_related(
      "many_to_many"
  ).order_by("field")

  # ❌ WRONG
  queryset = Model.objects.all()  # No optimization
  ```
  - `select_related()` for ForeignKey/OneToOne
  - `prefetch_related()` for ManyToMany/reverse FK
  - `order_by()` ALWAYS present

- [ ] **NO Manual Tenant Filtering**
  ```bash
  # Find manual company filtering in queryset
  grep -rn "queryset.*filter(company" apps/*/views/

  # Find in get_queryset() method
  grep -rn "def get_queryset" apps/*/views/ -A 10 | grep "company"
  ```
  - Should return ZERO results (except special cases like CompanyViewSet)

- [ ] **Service Delegation**
  ```python
  # ✅ Business logic in service
  def create(self, request):
      serializer = self.get_serializer(data=request.data)
      serializer.is_valid(raise_exception=True)

      instance = self.service.create_resource(
          **serializer.validated_data
      )
      # ...

  # ❌ Business logic in view
  def create(self, request):
      instance = Model.objects.create(**request.data)  # ❌
      send_email(instance)  # ❌
  ```
  - All business logic delegated to services
  - Views handle HTTP only (request, response, status)

- [ ] **Serializer Dispatch**
  ```python
  def get_serializer_class(self):
      return {
          "create": InputSerializer,
          "update": InputSerializer,
      }.get(self.action, OutputSerializer)
  ```
  - Different serializers for different actions
  - Input serializers for create/update
  - Output serializers for list/retrieve

- [ ] **Frontend Permissions**
  ```python
  frontend_permissions = {
      "list": [FrontendPermissions.APP__RESOURCE.READ],
      "create": [FrontendPermissions.APP__RESOURCE.WRITE],
      # ...
  }
  ```
  - All actions have permission mapping
  - Custom actions included

**Common Issues**:
- Missing query optimization
- Manual tenant filtering in queryset
- Business logic in views
- No serializer dispatch
- Missing frontend permissions

---

### Section D: Serializers

**File pattern**: `apps/*/serializers/*.py`, `apps/*/serializers.py`

#### Checklist for Each Serializer

- [ ] **NO Company Fields**
  ```bash
  # Find company fields in serializers
  grep -rn "company.*=.*Field" apps/*/serializers/
  ```
  - Should return ZERO results
  - Company added by middleware automatically

- [ ] **Input/Output Separation**
  ```python
  # ✅ CORRECT pattern
  class ResourceInputSerializer(serializers.Serializer):
      # Validation only
      name = serializers.CharField(max_length=100)

  class ResourceOutputSerializer(serializers.ModelSerializer):
      # Read-only representation
      class Meta:
          model = Resource
          fields = ["id", "name", "created_at"]
  ```
  - Separate serializers for input vs output
  - Input for create/update actions
  - Output for list/retrieve actions

- [ ] **NO Business Logic**
  ```python
  # ❌ WRONG - Business logic in serializer
  def create(self, validated_data):
      instance = Model.objects.create(**validated_data)
      send_email(instance)  # ❌ Business logic
      return instance

  # ✅ CORRECT - Validation only
  def validate_field(self, value):
      if not valid:
          raise ValidationError("Invalid")
      return value
  ```
  - Serializers validate only
  - No business logic (emails, notifications, etc.)
  - Create/update logic in services

**Common Issues**:
- Company fields in serializers
- No input/output separation
- Business logic in create/update methods

---

### Section E: Tests

**File pattern**: `apps/*/tests/*_tests.py`

#### Checklist for Each Test File

- [ ] **tenant_id Fixture Used**
  ```python
  @pytest.mark.django_db
  def test_something(api_client, user_factory, tenant_id):
      # tenant_id fixture ensures middleware is active
      user = user_factory()  # Uses tenant from fixture
  ```
  - All multi-tenant tests use tenant_id fixture
  - Ensures middleware context

- [ ] **NO Mock() Import**
  ```bash
  # Find unittest.mock imports (FORBIDDEN)
  grep -rn "from unittest.mock import Mock" apps/*/tests/
  ```
  - Should return ZERO results
  - Always use `mocker.Mock()` from pytest-mock

- [ ] **AAA Pattern**
  ```python
  def test_action_context_result():
      # Arrange
      data = {"field": "value"}

      # Act
      result = function(data)

      # Assert
      assert result == expected
  ```
  - Arrange: Setup test data
  - Act: Execute action
  - Assert: Verify result

- [ ] **Cross-Tenant Isolation Tests**
  ```python
  def test_cannot_access_other_tenant_data(
      api_client,
      user_factory,
      company_factory
  ):
      user = user_factory(company=company1)
      resource = resource_factory(company=company2)  # Different company

      api_client.force_authenticate(user=user)
      response = api_client.get(f"/api/resources/{resource.id}/")

      assert response.status_code == status.HTTP_404_NOT_FOUND  # ✅
  ```
  - Test that middleware blocks cross-tenant access
  - Verify 404 (not 403) for tenant isolation

- [ ] **Service Mocking**
  ```python
  def test_view_delegates_to_service(api_client, mocker):
      mock_service = mocker.patch.object(
          Service,
          "method_name",
          return_value=expected
      )

      response = api_client.post("/api/endpoint/", data)

      mock_service.assert_called_once_with(expected_params)
  ```
  - Mock service methods to verify delegation
  - Check parameters passed to service

**Common Issues**:
- Missing tenant_id fixture
- Using Mock() instead of mocker.Mock()
- No AAA pattern
- Missing cross-tenant isolation tests
- Not mocking service calls

---

## LEVEL 3: Full Compliance (1-2 hours)

### Cross-App Analysis

#### 1. Middleware Configuration

**File**: `binora/settings.py`

```python
# Verify middleware is active
MIDDLEWARE = [
    # ...
    'binora.middleware.MultitenantMiddleware',  # ✅ Must be present
    # ...
]

# Verify tenant configuration (Tenant services only)
TENANT = "subdomain"  # or None for Main
MAIN_INSTANCE_URL = "http://localhost:8000"  # or None for Main
```

**Check**:
- [ ] MultitenantMiddleware in MIDDLEWARE list
- [ ] TENANT configured correctly
- [ ] MAIN_INSTANCE_URL set for Tenant services

---

#### 2. Database Query Analysis

Run query analysis to find N+1 queries:

```bash
# Use Django Debug Toolbar or django-silk
python manage.py runserver --debug

# Or use query profiler
python manage.py query_analysis apps/assets/views/asset.py:AssetViewSet
```

**Check for**:
- N+1 query patterns
- Missing select_related/prefetch_related
- Unnecessary database hits

---

#### 3. Performance Audit

**Index Coverage**:
```sql
-- Check index usage (PostgreSQL)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY tablename;
```

- Identify unused indexes
- Check missing indexes on filtered fields

**Query Performance**:
```bash
# Run tests with query counting
pytest --count-queries apps/assets/tests/
```

- Verify query counts are reasonable
- Check for query optimization opportunities

---

#### 4. Security Audit

**SQL Injection**:
```bash
# Find raw SQL (potential injection points)
grep -rn "\.raw(" apps/
grep -rn "\.extra(" apps/
```
- Review all raw SQL for parameterization
- Ensure user input is sanitized

**Data Exposure**:
```bash
# Find serializers that might expose sensitive data
grep -rn "password" apps/*/serializers/ | grep -v "PasswordField"
grep -rn "token" apps/*/serializers/ | grep -v "exclude"
```
- Verify sensitive fields are excluded
- Check write_only on password fields

---

### Compliance Report

After completing audit, generate report:

```markdown
# Multi-Tenant Compliance Report

**Date**: YYYY-MM-DD
**Auditor**: [Name]
**Scope**: [App/Module or Full Codebase]

## Summary

- **Critical Violations**: X
- **High Priority**: Y
- **Medium Priority**: Z
- **Low Priority**: W

## Critical Violations

1. **Manual tenant_id filtering in apps/assets/views.py:45**
   - Severity: CRITICAL
   - Impact: Data leak risk
   - Fix: Remove manual filter, trust middleware

## Recommendations

1. Add composite indexes on [models]
2. Optimize queries in [viewsets]
3. Refactor business logic from [views] to [services]

## Compliance Score

- Models: 95%
- Services: 90%
- ViewSets: 85%
- Serializers: 100%
- Tests: 80%

**Overall**: 90% (Target: 95%+)
```

---

## Automation

### Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running multi-tenant compliance check..."

# Critical pattern checks
if grep -r "\.filter(company=" apps/*/views/ apps/*/services.py --exclude-dir=tests > /dev/null; then
    echo "❌ CRITICAL: Manual company filtering detected"
    exit 1
fi

if grep -r "from unittest.mock import Mock" apps/*/tests/ > /dev/null; then
    echo "❌ HIGH: Mock() without mocker detected"
    exit 1
fi

echo "✅ Multi-tenant compliance check passed"
```

### CI/CD Integration

Add to `.github/workflows/ci.yml`:

```yaml
- name: Multi-Tenant Compliance Check
  run: |
    chmod +x ./.github/scripts/check-tenant.sh
    ./.github/scripts/check-tenant.sh
```

---

## Quick Fix Guide

### Fix 1: Remove Manual Company Filter

**Before**:
```python
def get_queryset(self):
    return Asset.objects.filter(company=self.request.user.company)
```

**After**:
```python
queryset = Asset.objects.select_related().order_by("code")
# Middleware handles company filtering
```

### Fix 2: Remove Company Parameter

**Before**:
```python
def update_resource(self, instance: Resource, company: Company, data: dict):
    if instance.company != company:
        raise PermissionDenied()
```

**After**:
```python
def update_resource(self, instance: Resource, data: dict):
    # Middleware ensures instance belongs to tenant
```

### Fix 3: Use mocker.Mock()

**Before**:
```python
from unittest.mock import Mock
mock_service = Mock()
```

**After**:
```python
def test_something(mocker):
    mock_service = mocker.Mock()
```

---

## Resources

**Documentation**:
- `.claude/core/architecture.md` - Multi-tenant architecture
- `.claude/core/forbidden.md` - Anti-patterns catalog
- `binora/middleware.py` - Middleware implementation

**Tools**:
- `/check-tenant` - Quick tenant compliance check
- `multi-tenant-enforcer` agent - Deep scan
- `django-codebase-auditor` agent - Full code review

**Examples**:
- `apps/core/views/auth.py` - Correct ViewSet pattern
- `apps/core/services.py` - Correct Service pattern
- `apps/core/tests/user_views_tests.py` - Correct test pattern

---

**Last Updated**: 2025-01-23
**Version**: 1.0 (Comprehensive Audit)
