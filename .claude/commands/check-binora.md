# /check-binora - Binora Backend Compliance Checker

Comprehensive validation command for binora-backend projects. Checks architecture compliance, multi-tenant isolation, code quality, testing standards, and deployment readiness.

---

## What This Command Does

Runs a complete audit of a Binora Backend project to ensure:
1. **Multi-tenant architecture** compliance (NO manual tenant_id filtering)
2. **Service layer pattern** enforcement (business logic in services)
3. **Testing standards** (100% coverage, AAA pattern, mocker.Mock())
4. **Code quality** (type hints, YOLO comments, __all__ exports)
5. **Security** (no hardcoded secrets, proper authentication)
6. **Performance** (query optimization, no N+1 queries)
7. **OpenAPI contract** compliance
8. **Deployment readiness**

---

## Usage

```bash
/check-binora [scope] [options]
```

### Scopes

- **`quick`** (default): Critical checks only (~30 seconds)
  - Multi-tenant violations
  - Business logic in views
  - Missing type hints
  - Critical security issues

- **`standard`**: Full compliance check (~2 minutes)
  - All quick checks
  - Test coverage analysis
  - Query optimization
  - Code quality standards

- **`deep`**: Comprehensive audit (~5 minutes)
  - All standard checks
  - Performance profiling
  - Security audit
  - Contract validation
  - Deployment readiness

### Options

- `--app <name>`: Check specific app only (e.g., `--app core`)
- `--fix`: Auto-fix violations where possible
- `--report`: Generate detailed markdown report
- `--ci`: CI-friendly output (exit code 1 on failures)

---

## Checks Performed

### 1. Multi-Tenant Architecture (CRITICAL)

**Rule**: NEVER manually filter by tenant_id

**Detection**:
```bash
# Forbidden patterns
grep -rn "tenant_id=" apps/*/views/*.py apps/*/services.py
grep -rn "filter(company=" apps/*/views/*.py
grep -rn "\.company\s*=\s*" apps/*/views/*.py
```

**Example Violation**:
```python
# ❌ CRITICAL VIOLATION
users = User.objects.filter(tenant_id=company.id)
assets = Asset.objects.filter(company=request.user.company)
```

**Expected**:
```python
# ✅ CORRECT - Middleware handles isolation
users = User.objects.all()  # Already filtered by middleware
assets = Asset.objects.filter(status='active')  # Only business filters
```

**Status**: BLOCKER (deployment blocked)

---

### 2. Service Layer Pattern (HIGH)

**Rule**: ALL business logic in services, NOT in views/serializers

**Detection**:
```bash
# Business logic in views (forbidden)
grep -rn "\.create()" apps/*/views/*.py
grep -rn "\.save()" apps/*/views/*.py
grep -rn "send_mail\|send_email" apps/*/views/*.py
grep -rn "\.delete()" apps/*/views/*.py
```

**Example Violation**:
```python
# ❌ HIGH VIOLATION
class AssetViewSet(viewsets.ModelViewSet):
    def create(self, request):
        asset = Asset.objects.create(**request.data)  # Business logic in view
        send_mail(...)  # Email in view
        return Response(...)
```

**Expected**:
```python
# ✅ CORRECT
class AssetViewSet(viewsets.ModelViewSet):
    asset_service = AssetService()

    def create(self, request):
        asset = self.asset_service.create(**serializer.validated_data)
        return Response(AssetSerializer(asset).data, status=201)
```

**Status**: HIGH (refactoring required)

---

### 3. Dependency Injection (HIGH)

**Rule**: Services MUST use dependency injection

**Detection**:
```bash
# Services without __init__ (missing DI)
grep -L "def __init__" apps/*/services.py
```

**Example Violation**:
```python
# ❌ WRONG
class AuthService:
    def create_user(self, email: str):
        user = User.objects.create(email=email)  # Hard-coded dependency
```

**Expected**:
```python
# ✅ CORRECT
class AuthService:
    def __init__(self, users_repository=User.objects):
        self.users_repository = users_repository

    def create_user(self, email: str):
        user = self.users_repository.create(email=email)
```

**Status**: HIGH (refactoring required)

---

### 4. Type Hints (MEDIUM)

**Rule**: ALL service methods MUST have type hints

**Detection**:
```bash
# Methods without type hints
grep -A 1 "def " apps/*/services.py | grep -v " -> "
```

**Example Violation**:
```python
# ❌ WRONG
def create_asset(data):  # No type hints
    return Asset.objects.create(**data)
```

**Expected**:
```python
# ✅ CORRECT
def create_asset(data: dict[str, Any]) -> Asset:
    return Asset.objects.create(**data)
```

**Status**: MEDIUM (quality issue)

---

### 5. Testing Standards (HIGH)

**Rule**: 100% coverage target, AAA pattern, mocker.Mock() only

**Detection**:
```bash
# Test coverage analysis
pytest apps/ --cov=apps --cov-report=term-missing

# Wrong mock usage
grep -rn "from unittest.mock import Mock" apps/*/tests/

# Missing AAA pattern comments
grep -c "# Arrange\|# Act\|# Assert" apps/*/tests/*.py
```

**Standards**:
- File naming: `*_tests.py` (not `test_*.py`)
- AAA pattern: Arrange → Act → Assert comments
- Mocking: `mocker.Mock()` NOT `Mock()`
- Coverage: 100% per file
- NO docstrings in tests (YOLO philosophy)

**Status**: HIGH (quality gate)

---

### 6. Query Optimization (MEDIUM)

**Rule**: Use select_related/prefetch_related for FKs

**Detection**:
```bash
# Missing select_related
grep -rn "\.objects\.all()" apps/*/views/*.py
grep -rn "\.objects\.filter" apps/*/views/*.py | grep -v "select_related\|prefetch_related"
```

**Example Violation**:
```python
# ❌ N+1 PROBLEM
queryset = Asset.objects.all()  # Missing optimization
```

**Expected**:
```python
# ✅ OPTIMIZED
queryset = Asset.objects.select_related('company', 'asset_type').all()
```

**Status**: MEDIUM (performance impact)

---

### 7. Security Checks (CRITICAL)

**Rule**: No hardcoded secrets, proper auth on all endpoints

**Detection**:
```bash
# Hardcoded secrets
grep -rn "SECRET_KEY\s*=\s*['\"]" .
grep -rn "AWS_SECRET\|API_KEY\|PASSWORD" . --include="*.py" | grep -v "\.env"

# Missing authentication
grep -rn "permission_classes = \[\]" apps/*/views/*.py
```

**Status**: CRITICAL (security vulnerability)

---

### 8. Code Style (LOW)

**Rule**: English comments only, YOLO (no docstrings in tests), __all__ exports

**Detection**:
```bash
# Spanish comments in production code (forbidden)
grep -rn "#.*[áéíóúñ]" apps/ --include="*.py" | grep -v "/tests/"

# Missing __all__ in modules
grep -L "__all__" apps/*/views/*.py apps/*/services.py
```

**Status**: LOW (style consistency)

---

## Output Format

### Quick Check

```markdown
# Binora Backend Compliance Check - Quick

**Date**: 2025-01-23
**Scope**: Critical checks only
**Duration**: 28 seconds

---

## 🔴 CRITICAL Issues (2)

### 1. Manual tenant_id Filtering
- **File**: apps/assets/views/asset.py:45
- **Code**: `Asset.objects.filter(tenant_id=company.id)`
- **Status**: BLOCKER
- **Fix**: Remove manual tenant filtering, trust middleware

### 2. Hardcoded SECRET_KEY
- **File**: binora/settings/local.py:12
- **Code**: `SECRET_KEY = "django-insecure-..."`
- **Status**: BLOCKER
- **Fix**: Move to environment variable

---

## 🟠 HIGH Issues (3)

### 1. Business Logic in View
- **File**: apps/core/views/user.py:67
- **Code**: `User.objects.create(**request.data)`
- **Status**: Refactoring required
- **Fix**: Move to AuthService.create_user()

### 2. Missing Dependency Injection
- **File**: apps/assets/services.py (no __init__ found)
- **Status**: Architecture violation
- **Fix**: Add DI pattern

### 3. Test Coverage Below Target
- **App**: apps/assets
- **Coverage**: 78% (target: 100%)
- **Missing**: asset_service.py lines 45-52

---

## Summary

- **Total Issues**: 5
- **CRITICAL**: 2 (BLOCKER)
- **HIGH**: 3
- **MEDIUM**: 0
- **LOW**: 0

**Deployment Status**: ❌ BLOCKED (fix CRITICAL issues first)

**Next Steps**:
1. Fix tenant_id filtering in asset.py
2. Move SECRET_KEY to environment
3. Refactor user creation to service layer
4. Add DI to AssetService
5. Improve test coverage to 100%
```

### Standard Check

(Same format + additional sections)

```markdown
## 🟡 MEDIUM Issues (4)

### 1. Missing Type Hints
- **File**: apps/assets/services.py:34
- **Method**: `create_asset(data)`
- **Fix**: Add `data: dict[str, Any]) -> Asset`

### 2. N+1 Query Detected
- **File**: apps/core/views/user.py:23
- **Code**: `User.objects.all()` (missing select_related)
- **Fix**: Add `.select_related('company')`

### 3. Missing Query Optimization
- **File**: apps/assets/views/asset.py:12
- **Fix**: Add select_related('company', 'asset_type')

### 4. No AAA Pattern in Tests
- **File**: apps/core/tests/user_tests.py
- **Fix**: Add "# Arrange", "# Act", "# Assert" comments

---

## 🟢 Code Quality Score

- **Architecture**: 72/100 (HIGH violations detected)
- **Testing**: 85/100 (coverage below target)
- **Security**: 60/100 (CRITICAL issues)
- **Performance**: 78/100 (N+1 queries)
- **Code Style**: 95/100 (minor issues)

**Overall**: 78/100 (NEEDS IMPROVEMENT)
```

### Deep Check

(Same format + contract validation, deployment readiness)

```markdown
## 📋 OpenAPI Contract Compliance

- **Contract Version**: 1.2.0
- **Endpoints Checked**: 45
- **Compliant**: 42 (93%)
- **Non-compliant**: 3

**Issues**:
1. POST /api/assets/{id}/assign/ - Missing `assigned_at` field in schema
2. GET /api/users/ - Missing `is_active` query parameter
3. PATCH /api/assets/{id}/ - Extra field `internal_notes` not in contract

---

## 🚀 Deployment Readiness

- ✅ Database migrations up to date
- ✅ Static files configured
- ✅ Environment variables validated
- ❌ SECRET_KEY hardcoded (BLOCKER)
- ✅ ALLOWED_HOSTS configured
- ✅ DEBUG=False in production
- ✅ Tests passing (85% coverage)
- ❌ CRITICAL security issues (BLOCKER)

**Deployment Status**: ❌ NOT READY (2 blockers)
```

---

## Exit Codes (CI Mode)

- `0`: All checks passed
- `1`: CRITICAL issues found (blockers)
- `2`: HIGH issues found (refactoring needed)
- `3`: MEDIUM/LOW issues only
- `4`: Scan failed (error)

---

## Integration with Other Commands

**Auto-triggered by**:
- `/binora-pre-commit-guardian` (pre-commit validation)
- `/check-deploy` (before deployment)

**Suggests**:
- `/django-quick-audit` for deep code review
- `/django-coverage` for test coverage analysis
- `/django-query-analysis` for N+1 detection
- `/django-check-contract` for OpenAPI validation

---

## Quality Standards

Every check MUST:
1. ✅ Detect violations accurately (no false positives)
2. ✅ Provide exact file paths and line numbers
3. ✅ Show violation code snippets
4. ✅ Suggest specific fixes
5. ✅ Categorize by severity (CRITICAL/HIGH/MEDIUM/LOW)
6. ✅ Calculate compliance score
7. ✅ Provide actionable next steps

---

## Success Criteria

- ✅ 100% accuracy in violation detection
- ✅ Zero false positives
- ✅ Precise file:line references
- ✅ Actionable fix suggestions
- ✅ Correct severity classification
- ✅ Fast execution (<5 minutes deep check)
- ✅ CI-friendly output

---

**Last Updated**: 2025-01-23
**Version**: 1.0.0
**Target Projects**: binora-backend, Django multi-tenant applications
