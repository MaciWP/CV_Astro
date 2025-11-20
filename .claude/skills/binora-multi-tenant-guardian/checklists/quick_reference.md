# Multi-Tenant Quick Reference Checklist

**1-page reference for multi-tenant compliance in Binora Backend**

---

## ✅ Pre-Commit Checklist

Before committing any code that touches queries or services:

### Views & ViewSets

- [ ] **NO `.filter(company=...)`** in queryset or get_queryset()
- [ ] **NO `.filter(tenant_id=...)`** anywhere in views
- [ ] **NO `company_id` filtering** in custom queries
- [ ] **Query optimization present**: select_related(), prefetch_related(), order_by()
- [ ] **Service delegation**: Business logic in services, not views

### Services

- [ ] **NO `company: Company` parameter** in service method signatures
- [ ] **Dual-mode pattern** for cross-service operations (check `settings.MAIN_INSTANCE_URL`)
- [ ] **Dependency injection** with defaults (e.g., `users_repository=User.objects`)
- [ ] **Type hints** on all parameters and return values

### Models

- [ ] **Company ForeignKey** present for tenant-scoped models
- [ ] **NO manual tenant queries** in model managers
- [ ] **Proper indexes** on filtered fields

### Tests

- [ ] **tenant_id fixture** used for isolation tests
- [ ] **Both Main and Tenant modes** tested for dual-mode services
- [ ] **Middleware active** in test configuration

---

## 🔍 Quick Validation Commands

### 1. Grep for Violations

```bash
# Find manual company filtering (should return nothing)
grep -r "\.filter(company=" apps/*/views/ apps/*/services.py

# Find manual tenant_id filtering (should return nothing)
grep -r "\.filter(tenant_id=" apps/ --exclude-dir=tests

# Find company parameters in services (review carefully)
grep -r "company: Company" apps/*/services.py
```

### 2. Run Tenant Check Command

```bash
# Check specific app
/check-tenant apps/core/

# Check all apps
/check-tenant apps/
```

### 3. Use Multi-Tenant Enforcer Agent

```bash
# Deep scan with agent
Task: multi-tenant-enforcer
Prompt: "Scan apps/<app>/ for all multi-tenant violations"
```

---

## 🎯 Common Violations & Quick Fixes

### Violation 1: Manual Company Filter in ViewSet

```python
# ❌ WRONG
class AssetViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Asset.objects.filter(company=self.request.user.company)
```

**Quick Fix:**

```python
# ✅ CORRECT
class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related('rack').order_by('name')
    # Middleware handles company filtering automatically
```

### Violation 2: Company Parameter in Service

```python
# ❌ WRONG
class AssetService:
    @staticmethod
    def get_assets(company: Company, status: str) -> QuerySet[Asset]:
        return Asset.objects.filter(company=company, status=status)
```

**Quick Fix:**

```python
# ✅ CORRECT
class AssetService:
    @staticmethod
    def get_assets(status: str) -> QuerySet[Asset]:
        # Middleware filters by company automatically
        return Asset.objects.filter(status=status)
```

### Violation 3: Manual Ownership Check

```python
# ❌ WRONG
def update_asset(asset_id: int, company: Company, **data) -> Asset:
    asset = Asset.objects.get(id=asset_id)
    if asset.company != company:  # ❌ Manual check
        raise PermissionDenied("Not your asset")
```

**Quick Fix:**

```python
# ✅ CORRECT
def update_asset(asset_id: int, **data) -> Asset:
    # Middleware filters query - if asset doesn't belong to tenant,
    # .get() raises DoesNotExist automatically
    asset = Asset.objects.get(id=asset_id)
    # No manual check needed!
```

---

## 📋 Service Type Quick Reference

### Detect Service Type at Runtime

```python
from django.conf import settings

# Check if Main service
if settings.MAIN_INSTANCE_URL is None:
    # Running in Main service
    # Can see all companies
    # Handle operations directly
else:
    # Running in Tenant service
    # Can see only settings.TENANT company
    # Forward auth operations to Main
```

### Middleware Configuration Checklist

```python
# binora/settings.py

# ✅ Required middleware
MIDDLEWARE = [
    # ...
    'binora.middleware.MultitenantMiddleware',  # Must be present
    # ...
]

# ✅ Tenant configuration (Tenant services only)
TENANT = "acme"  # or None for Main
MAIN_INSTANCE_URL = "http://localhost:8000"  # or None for Main
```

---

## 🚨 Critical Rules (Never Violate)

1. **🔥 NEVER** manually filter by `company` or `tenant_id`
2. **🔥 NEVER** add `company: Company` parameters to service methods
3. **🔥 NEVER** bypass middleware with raw SQL
4. **🔥 NEVER** assume single-mode (always check `settings.MAIN_INSTANCE_URL`)
5. **🔥 NEVER** disable `MultitenantMiddleware`

---

## 🎓 Quick Learning Paths

### For New Developers

1. Read: `.claude/core/architecture.md` (multi-tenant overview)
2. Study: `apps/core/views/user.py:23` (correct ViewSet pattern)
3. Study: `apps/core/services.py:357-374` (dual-mode service pattern)
4. Review: `binora/middleware.py` (middleware implementation)
5. Practice: Run `/check-tenant` on example code

### For Code Reviews

1. **Grep for violations** (see commands above)
2. **Check service signatures** (no Company parameters)
3. **Verify dual-mode** for auth operations
4. **Run `/check-tenant`** on changed files
5. **Validate tests** use tenant_id fixture

---

## 📊 Quality Gates

Before merging:

- [ ] `/check-tenant` passes with ZERO violations
- [ ] Grep commands return NO manual filtering
- [ ] Tests pass with `tenant_id` fixture
- [ ] Coverage 100% including tenant isolation tests
- [ ] Code review approved by senior dev

---

## 🔗 Quick Links

| Resource | Location | Purpose |
|----------|----------|---------|
| Architecture Docs | `.claude/core/architecture.md` | Multi-tenant overview |
| Forbidden Patterns | `.claude/core/forbidden.md` | Anti-patterns catalog |
| UserViewSet Example | `apps/core/views/user.py:23` | Correct ViewSet pattern |
| AuthService Example | `apps/core/services.py:357-374` | Dual-mode service |
| Middleware | `binora/middleware.py` | Isolation implementation |
| Check Command | `/check-tenant` | Validation tool |
| Enforcer Agent | `multi-tenant-enforcer` | Deep scan agent |

---

## 💡 Pro Tips

1. **When in doubt, check Main**: Look at `apps/core/` for reference patterns
2. **Trust the middleware**: It's battle-tested, don't reinvent tenant filtering
3. **Use the tools**: `/check-tenant` catches 95% of violations
4. **Ask before coding**: If pattern seems complex, check with senior dev
5. **Test both modes**: Services that touch auth must test Main AND Tenant

---

**Print this page** and keep it visible while coding!

**Last Updated**: 2025-01-23
**Version**: 1.0 (Quick Reference)
