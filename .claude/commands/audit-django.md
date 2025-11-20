# /audit-django - Django/DRF Code Quality Audit

Comprehensive code quality audit for Django REST Framework projects. Analyzes architecture, security, performance, testing, and adherence to Django/DRF best practices.

---

## What This Command Does

Performs deep analysis of Django/DRF code to ensure:
1. **Architecture patterns** (ViewSets → Services → Models)
2. **DRF best practices** (serializers, permissions, filtering)
3. **Django patterns** (models, managers, signals, middleware)
4. **Security** (OWASP Top 10, Django-specific)
5. **Performance** (query optimization, caching, async)
6. **Testing** (pytest-django, factories, coverage)
7. **Code quality** (PEP 8, type hints, complexity)

**Target**: ANY Django/DRF project (not just Binora)

---

## Usage

```bash
/audit-django [scope] [focus]
```

### Scopes

- **`app <name>`**: Audit specific app (e.g., `app core`)
- **`file <path>`**: Audit specific file
- **`full`**: Audit entire project
- **`recent`**: Audit recently changed files (git diff)

### Focus Areas

- **`architecture`**: Service layer, business logic separation
- **`security`**: Vulnerabilities, auth, permissions
- **`performance`**: N+1 queries, indexes, caching
- **`testing`**: Coverage, patterns, quality
- **`quality`**: Code style, complexity, maintainability
- **`all`** (default): All focus areas

---

## Audit Checks

### 1. Architecture Patterns

**Service Layer Separation**:
```bash
# Detect business logic in views (anti-pattern)
Grep(".save()", path="apps/*/views/*.py")
Grep(".create()", path="apps/*/views/*.py")
Grep("send_mail|send_email", path="apps/*/views/*.py")
```

**Checks**:
- ✅ Business logic in services (not views)
- ✅ Dependency injection in services
- ✅ Type hints on service methods
- ✅ Transaction management (@transaction.atomic)
- ✅ Views delegate to services

**Example Violation**:
```python
# ❌ Business logic in view
class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        user = User(**serializer.validated_data)
        user.set_password(generate_password())
        user.save()
        EmailHelper.send_welcome(user)  # Business logic in view
```

**Expected Pattern**:
```python
# ✅ Thin view, delegates to service
class UserViewSet(viewsets.ModelViewSet):
    auth_service = AuthService()

    def create(self, request):
        user = self.auth_service.create_user(**serializer.validated_data)
        return Response(UserSerializer(user).data, status=201)
```

---

### 2. DRF Serializer Patterns

**Input/Output Separation**:
```bash
# Detect missing I/O serializer separation
Grep("class.*Serializer.*ModelSerializer", output_mode="files_with_matches")
# Check if only ONE serializer per model (anti-pattern)
```

**Checks**:
- ✅ Separate input/output serializers
- ✅ Validation in serializers (not views)
- ✅ Read-only fields properly marked
- ✅ Method fields use source (not SerializerMethodField when possible)
- ✅ No business logic in serializers

**Example Pattern**:
```python
# ✅ CORRECT - Separate I/O serializers
class UserSerializer(serializers.ModelSerializer):  # Output
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

class UserCreateSerializer(serializers.Serializer):  # Input
    email = serializers.EmailField()
    name = serializers.CharField(max_length=255)

    def validate_email(self, value):
        # Validation logic
        return value
```

---

### 3. Query Optimization

**N+1 Detection**:
```bash
# Find potential N+1 queries
Grep("objects.all()", path="apps/*/views/*.py")
Grep("objects.filter", path="apps/*/views/*.py")
# Check if select_related/prefetch_related used
```

**Checks**:
- ✅ select_related for ForeignKey
- ✅ prefetch_related for M2M/reverse FK
- ✅ order_by() always specified for pagination
- ✅ .only() / .defer() for large models
- ✅ Queryset optimization in get_queryset()

**Example Pattern**:
```python
# ✅ CORRECT - Optimized queryset
class AssetViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Asset.objects.select_related(
            'company',
            'asset_type',
            'assigned_to'
        ).prefetch_related(
            'tags'
        ).order_by('code')
```

---

### 4. Security Analysis

**OWASP Top 10 for Django**:

**SQL Injection**:
```bash
# Detect raw SQL without parameterization
Grep("raw\\(", path="apps/")
Grep("extra\\(", path="apps/")
Grep("execute\\(", path="apps/")
```

**XSS (Cross-Site Scripting)**:
```bash
# Detect unsafe template rendering
Grep("|safe", path="templates/")
Grep("mark_safe", path="apps/")
```

**Authentication/Authorization**:
```bash
# Missing authentication
Grep("permission_classes = \\[\\]", path="apps/*/views/*.py")
# Weak password validation
Grep("MinimumLengthValidator", path="settings/")
```

**Sensitive Data Exposure**:
```bash
# Passwords in serializers
Grep("fields = '__all__'", path="apps/*/serializers/*.py")
# Logging sensitive data
Grep("logger.*password|logger.*token", path="apps/")
```

**Checks**:
- ✅ Parameterized queries (no raw SQL)
- ✅ Authentication on all endpoints
- ✅ Permission classes properly configured
- ✅ No sensitive data in serializers
- ✅ CSRF protection enabled
- ✅ Secure password hashing
- ✅ No hardcoded secrets

---

### 5. Model Design

**Best Practices**:
```bash
# Check for missing indexes on filtered fields
Read('apps/*/models.py')
# Analyze which fields are filtered in views
# Cross-reference with db_index=True
```

**Checks**:
- ✅ Indexes on frequently filtered fields
- ✅ Proper field choices (not magic strings)
- ✅ Custom managers for common queries
- ✅ __str__() method defined
- ✅ Meta class with ordering
- ✅ Constraints defined (unique_together, etc.)

**Example Pattern**:
```python
# ✅ CORRECT - Well-designed model
class Asset(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    code = models.CharField(max_length=50, unique=True, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True  # Frequently filtered
    )
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    class Meta:
        ordering = ['code']
        indexes = [
            models.Index(fields=['company', 'status']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'code'],
                name='unique_code_per_company'
            ),
        ]

    def __str__(self):
        return f"{self.code} ({self.get_status_display()})"
```

---

### 6. Testing Standards

**pytest-django Patterns**:
```bash
# Check test file naming
Glob('apps/*/tests/*.py')
# Verify *_tests.py pattern (not test_*.py)

# Check for AAA pattern
Grep("# Arrange|# Act|# Assert", path="apps/*/tests/")

# Check mock usage
Grep("from unittest.mock import Mock", path="apps/*/tests/")
# Should use mocker.Mock() instead
```

**Checks**:
- ✅ File naming: `*_tests.py`
- ✅ AAA pattern (Arrange → Act → Assert)
- ✅ mocker.Mock() (not Mock())
- ✅ Factory pattern for test data
- ✅ Fixtures in conftest.py
- ✅ 100% coverage target
- ✅ No docstrings in tests (concise test names)

---

### 7. Code Quality

**Complexity Analysis**:
```bash
# Cyclomatic complexity (SonarQube thresholds)
# CC > 10: Needs refactoring
# CC > 15: Critical
```

**Checks**:
- ✅ Methods < 50 lines
- ✅ Classes < 300 lines
- ✅ Cyclomatic complexity < 10
- ✅ No code duplication > 5%
- ✅ Type hints on all functions
- ✅ Descriptive variable names

---

## Output Format

### Summary View

```markdown
# Django/DRF Code Quality Audit

**Project**: binora-backend
**Scope**: apps/core
**Date**: 2025-01-23
**Duration**: 45 seconds

---

## 📊 Overall Score: 82/100

| Category | Score | Status |
|----------|-------|--------|
| Architecture | 78/100 | 🟡 GOOD |
| Security | 85/100 | 🟢 EXCELLENT |
| Performance | 72/100 | 🟡 NEEDS WORK |
| Testing | 88/100 | 🟢 EXCELLENT |
| Code Quality | 90/100 | 🟢 EXCELLENT |

---

## 🔴 CRITICAL Issues (0)

None found. ✅

---

## 🟠 HIGH Issues (3)

### 1. Business Logic in View
- **File**: apps/core/views/user.py:67
- **Pattern**: `User.objects.create()` in ViewSet.create()
- **Impact**: Architecture violation, hard to test
- **Fix**: Move to AuthService.create_user()
- **Effort**: 2 hours

### 2. Missing Query Optimization
- **File**: apps/core/views/user.py:23
- **Pattern**: `User.objects.all()` without select_related
- **Impact**: N+1 queries (200+ queries for 100 users)
- **Fix**: Add `.select_related('company')`
- **Effort**: 5 minutes

### 3. Low Test Coverage
- **File**: apps/core/services.py
- **Coverage**: 78% (target: 100%)
- **Missing**: Lines 45-52 (error handling)
- **Fix**: Add tests for exception scenarios
- **Effort**: 1 hour

---

## 🟡 MEDIUM Issues (7)

### 1. Missing Type Hints (3 occurrences)
- apps/core/services.py:34 - `create_user(data)`
- apps/assets/services.py:67 - `assign_asset(asset, user)`
- apps/hierarchy/services.py:12 - `get_tree(node)`

**Fix**: Add type hints to all method signatures

### 2. No Indexes on Filtered Fields (2 occurrences)
- Asset.status - Frequently filtered, no db_index
- User.is_active - Used in filtering, no index

**Fix**: Add `db_index=True` to these fields

### 3. Serializer I/O Not Separated (2 occurrences)
- UserSerializer - Used for both input and output
- AssetSerializer - Single serializer for all operations

**Fix**: Split into separate input/output serializers

---

## 🟢 Best Practices Followed (15)

- ✅ CSRF protection enabled
- ✅ Authentication required on all endpoints
- ✅ Password hashing with Django defaults
- ✅ No raw SQL queries
- ✅ Proper permission classes
- ✅ Transaction management in services
- ✅ Dependency injection pattern
- ✅ Factory pattern in tests
- ✅ AAA pattern in tests
- ✅ English comments only
- ✅ __all__ exports defined
- ✅ Proper field choices (not magic strings)
- ✅ Custom managers for common queries
- ✅ __str__() methods defined
- ✅ Meta class ordering specified

---

## 📈 Metrics

### Code Complexity
- **Average CC**: 4.2 (target: <10) ✅
- **Max CC**: 12 (in `apps/core/services.py:create_user_for_company`)
- **Methods >50 lines**: 2 (target: 0)
- **Classes >300 lines**: 0 ✅

### Test Coverage
- **Overall**: 85% (target: 100%)
- **apps/core**: 92% ✅
- **apps/assets**: 78% 🟡
- **apps/hierarchy**: 88% ✅

### Performance
- **N+1 Queries**: 3 detected
- **Missing Indexes**: 2 fields
- **Unoptimized Queries**: 5 ViewSets

### Security
- **Critical Vulnerabilities**: 0 ✅
- **High Vulnerabilities**: 0 ✅
- **Medium Vulnerabilities**: 1 (weak rate limiting)
- **Low Vulnerabilities**: 2 (info disclosure in errors)

---

## 🎯 Recommended Actions

### Immediate (This Sprint)
1. Move business logic from views to services (2 hours)
2. Add select_related to optimize queries (30 minutes)
3. Increase test coverage to 100% (3 hours)

### Short-term (Next Sprint)
4. Add type hints to all methods (1 hour)
5. Add indexes to filtered fields (30 minutes + migration)
6. Split serializers into input/output (2 hours)

### Long-term (Backlog)
7. Refactor high complexity methods (4 hours)
8. Improve error handling consistency (2 hours)
9. Add caching layer (8 hours)

---

## 💡 Proactive Suggestions

Based on codebase analysis, consider:

1. **Create shared service base class**: Common patterns detected across 5 services
2. **Extract query optimizer util**: 12 ViewSets with similar select_related patterns
3. **Generate missing tests**: 15 methods without test coverage
4. **Add API rate limiting**: Only 2 endpoints have throttling

---

## 🔍 Deep Dive (Optional)

### Architecture Violations by File

| File | Violations | Severity |
|------|-----------|----------|
| apps/core/views/user.py | 2 | HIGH |
| apps/assets/views/asset.py | 1 | MEDIUM |
| apps/hierarchy/services.py | 1 | MEDIUM |

### Security Risk Heatmap

| Category | Risk Level | Count |
|----------|-----------|-------|
| SQL Injection | ✅ NONE | 0 |
| XSS | ✅ NONE | 0 |
| Auth Bypass | ✅ NONE | 0 |
| Data Exposure | 🟡 MEDIUM | 1 |
| CSRF | ✅ NONE | 0 |

---

## ✅ Success Criteria

**Audit Passes If**:
- Zero CRITICAL issues
- <5 HIGH issues
- Coverage >80%
- No SQL injection vulnerabilities
- No auth bypasses

**Current Status**: ✅ PASS (0 CRITICAL, 3 HIGH, 85% coverage)

**To Reach 100/100 Score**:
- Fix all HIGH issues (3)
- Reach 100% test coverage
- Add missing type hints
- Optimize all N+1 queries
```

---

## CI Integration

### GitHub Actions Example

```yaml
name: Django Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Django Audit
        run: |
          claude /audit-django full all --report
          # Fails if CRITICAL issues found
          exit $?
```

### Exit Codes

- `0`: Audit passed (no blockers)
- `1`: CRITICAL issues (blocker)
- `2`: HIGH issues (review required)
- `3`: MEDIUM/LOW issues only
- `4`: Audit failed (error)

---

## Integration with Agents

**Automatically triggers**:
- `django-codebase-auditor` (comprehensive review)
- `django-security-auditor` (deep security scan)
- `django-performance-analyzer` (N+1 detection)
- `django-test-generator` (coverage improvement)

**Suggests**:
- `/django-coverage` for detailed coverage
- `/django-query-analysis` for query profiling
- `/check-binora` for multi-tenant checks (if applicable)

---

## Quality Standards

Every audit MUST:
1. ✅ Scan all specified files completely
2. ✅ Provide exact file:line references
3. ✅ Show violation code snippets
4. ✅ Estimate fix effort
5. ✅ Calculate compliance score
6. ✅ Suggest actionable improvements
7. ✅ Generate exportable report

---

## Success Criteria

- ✅ 100% accuracy in pattern detection
- ✅ Zero false positives
- ✅ Precise file:line references
- ✅ Actionable recommendations
- ✅ Correct severity classification
- ✅ Fast execution (<2 minutes full audit)
- ✅ CI-friendly output

---

**Last Updated**: 2025-01-23
**Version**: 1.0.0
**Target**: Any Django/DRF project
