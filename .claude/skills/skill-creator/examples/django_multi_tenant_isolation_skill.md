---
name: "Django Multi-Tenant Isolation"
description: "Enforces transparent multi-tenant isolation in Django projects using middleware. Auto-activates on: tenant, multi-tenant, tenant_id, company, isolation, middleware, cross-tenant. Prevents manual tenant_id filtering (CRITICAL security violation), bypassing middleware, cross-tenant data leaks. Ensures middleware handles ALL isolation, queries are tenant-agnostic, tests validate isolation. Validates NO tenant_id in QuerySet filters, MultitenantMiddleware configured, all models inherit TenantAwareModel. Targets: 100% transparent isolation, 0 manual tenant_id filters, 0 cross-tenant vulnerabilities."
---

# Django Multi-Tenant Isolation

**Auto-activates when**: Discussing multi-tenancy, tenant isolation, company filtering, data security, or cross-tenant issues.

---

## 🎯 Mission

Enforce **100% transparent multi-tenant isolation** using middleware to prevent cross-tenant data leaks and security vulnerabilities.

---

## 📐 Core Principles

### 1. Transparent Middleware Isolation (CRITICAL)

**Rule**: NEVER manually filter by tenant_id or company. Middleware handles ALL tenant isolation automatically and transparently.

**Why it matters**: Manual filtering is error-prone (one missed filter = cross-tenant data leak), creates security vulnerabilities, violates transparent isolation architecture, not scalable.

❌ WRONG - Manual tenant_id filtering (FORBIDDEN!)
```python
# CRITICAL VIOLATION #1 - Manual tenant_id in filter
def get_company_users(company_id):
    # FORBIDDEN! Middleware should handle this
    return User.objects.filter(tenant_id=company_id)

# CRITICAL VIOLATION #2 - Manual company in filter
def get_assets(company):
    # FORBIDDEN! Middleware should handle this
    return Asset.objects.filter(company=company)

# CRITICAL VIOLATION #3 - Manual tenant check in service
class AssetService:
    @staticmethod
    def get_asset(asset_id, company_id):
        # FORBIDDEN! Don't pass company_id manually
        return Asset.objects.filter(id=asset_id, tenant_id=company_id).first()

# CRITICAL VIOLATION #4 - Manual filtering in ViewSet
class AssetViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        company = self.request.user.company
        # FORBIDDEN! Middleware handles this
        return Asset.objects.filter(company=company)
```

✅ CORRECT - Middleware automatic filtering (trust the middleware!)
```python
# ✅ Middleware automatically adds tenant_id to ALL queries
def get_users():
    # Middleware adds: .filter(tenant_id=current_tenant)
    return User.objects.all()

# ✅ Additional filters work with middleware
def get_active_assets():
    # Middleware adds tenant_id automatically
    # This becomes: Asset.objects.filter(status='active', tenant_id=current_tenant)
    return Asset.objects.filter(status='active')

# ✅ Service layer - no tenant_id needed
class AssetService:
    @staticmethod
    def get_asset_by_id(asset_id: int) -> Asset:
        # Middleware ensures only current tenant's assets returned
        return Asset.objects.select_related('created_by').get(id=asset_id)

# ✅ ViewSet - no company filtering
class AssetViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # Middleware handles tenant filtering
        return Asset.objects.select_related('company', 'created_by').order_by('-created_at')
```

**How Middleware Works** (for understanding):
```python
# binora/middleware.py (Simplified)
class MultitenantMiddleware:
    def process_request(self, request):
        # Extract tenant from subdomain or header
        tenant = self.get_tenant_from_request(request)

        # Inject tenant filter into ALL QuerySets
        # User.objects.all() becomes User.objects.filter(tenant_id=tenant.id)
        # Asset.objects.filter(status='active') becomes Asset.objects.filter(status='active', tenant_id=tenant.id)
```

**Auto-check**:
- [ ] NO manual tenant_id in ANY QuerySet filter?
- [ ] NO manual company parameter in function signatures?
- [ ] NO company filtering in get_queryset()?
- [ ] Middleware configured in settings.MIDDLEWARE?

---

### 2. Tenant-Aware Models

**Rule**: All multi-tenant models MUST inherit from TenantAwareModel. NO manual tenant_id field.

**Why it matters**: Consistent schema, automatic migrations, proper indexes, prevents missing tenant field.

❌ WRONG - Manual tenant field
```python
from django.db import models

class Asset(models.Model):
    name = models.CharField(max_length=100)
    tenant_id = models.IntegerField()  # Manual field, no index, no constraint!
    status = models.CharField(max_length=20)

    class Meta:
        db_table = 'assets'
```

✅ CORRECT - Inherit TenantAwareModel
```python
from django.db import models
from apps.core.models import TenantAwareModel

class Asset(TenantAwareModel):  # Inherits tenant_id automatically
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20)

    class Meta:
        db_table = 'assets'
        indexes = [
            # tenant_id automatically included in compound indexes
            models.Index(fields=['tenant_id', 'status']),
            models.Index(fields=['tenant_id', 'created_at']),
        ]
```

**What TenantAwareModel provides**:
```python
# apps/core/models.py
class TenantAwareModel(models.Model):
    tenant_id = models.ForeignKey(
        'Company',
        on_delete=models.CASCADE,
        db_index=True  # Automatic index!
    )

    class Meta:
        abstract = True
```

**Auto-check**:
- [ ] Model inherits TenantAwareModel?
- [ ] NO manual tenant_id field definition?
- [ ] Compound indexes include tenant_id first?
- [ ] Model listed in settings.TENANT_MODELS?

---

### 3. Main Service vs Tenant Services

**Rule**: Understand the two service types. Main Service (TENANT=None) sees all data. Tenant Services (TENANT=subdomain) see only tenant data.

**Why it matters**: Main Service for admin/management, Tenant Services for tenant-specific operations. Different settings, different databases potentially.

**Main Service** (port 8000, TENANT=None):
```python
# Environment: TENANT=None
# Sees: ALL tenants data
# Use case: Admin dashboard, tenant management, reporting

# Example: Create new tenant
def create_tenant(name, subdomain):
    # Main service can create tenants
    company = Company.objects.create(name=name, subdomain=subdomain)
    return company

# Example: List all tenants
def list_all_tenants():
    # Main service sees all companies
    return Company.objects.all()
```

**Tenant Service** (port 8001+, TENANT=acme):
```python
# Environment: TENANT=acme
# Sees: Only 'acme' tenant data (middleware filters)
# Use case: Tenant-specific operations

# Example: Get users
def get_users():
    # Middleware automatically filters by tenant_id
    # Only returns users for 'acme' tenant
    return User.objects.all()

# Example: Create asset
def create_asset(name):
    # Asset automatically assigned to 'acme' tenant
    return Asset.objects.create(name=name)
```

**Auto-check**:
- [ ] Understand which service type you're in (Main vs Tenant)?
- [ ] Main Service handles cross-tenant operations?
- [ ] Tenant Services rely on middleware filtering?
- [ ] Same codebase, different TENANT env variable only?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Manual Tenant Filtering (CRITICAL)

❌ ANTI-PATTERN - Explicit tenant_id
```python
# CRITICAL VIOLATION
User.objects.filter(tenant_id=company.id)  # FORBIDDEN!
Asset.objects.filter(company=current_company)  # FORBIDDEN!
Team.objects.filter(company_id=request.user.company.id)  # FORBIDDEN!
```

✅ CORRECT - Middleware handles it
```python
User.objects.all()  # Middleware adds tenant_id automatically
Asset.objects.filter(status='active')  # Middleware adds tenant_id
Team.objects.select_related('members')  # Middleware adds tenant_id
```

**Why it matters**: One missed filter = cross-tenant data leak = CRITICAL security breach. Customer A sees Customer B's data.

**Real-world impact**:
```python
# ❌ DISASTER SCENARIO - One line without tenant filter
def get_sensitive_data():
    # Developer forgot to add tenant_id filter
    return SensitiveData.objects.all()  # Returns ALL tenants data!
    # Customer A can see Customer B's sensitive data!
    # GDPR violation, security breach, lawsuit

# ✅ SAFE - Middleware prevents this
def get_sensitive_data():
    return SensitiveData.objects.all()  # Middleware ensures only current tenant's data
```

---

### 2. Passing tenant_id/company as Parameters

❌ ANTI-PATTERN - tenant_id in function signatures
```python
def get_assets(company_id: int):  # ❌ Don't pass company_id
    return Asset.objects.filter(tenant_id=company_id)

class AssetService:
    @staticmethod
    def create_asset(name: str, company_id: int):  # ❌ Don't pass company_id
        return Asset.objects.create(name=name, tenant_id=company_id)
```

✅ CORRECT - No tenant parameters
```python
def get_assets():  # ✅ No company_id needed
    return Asset.objects.all()

class AssetService:
    @staticmethod
    def create_asset(name: str) -> Asset:  # ✅ No company_id parameter
        # Middleware automatically sets tenant_id
        return Asset.objects.create(name=name)
```

**Why it matters**: Passing tenant_id explicitly bypasses middleware, creates opportunities for mistakes.

---

### 3. Tenant Checks in Business Logic

❌ ANTI-PATTERN - Manual tenant validation
```python
def update_asset(asset_id, user):
    asset = Asset.objects.get(id=asset_id)

    # Manual tenant check (BAD!)
    if asset.company != user.company:
        raise PermissionDenied("Asset belongs to different tenant")

    asset.name = "Updated"
    asset.save()
```

✅ CORRECT - Trust middleware
```python
def update_asset(asset_id: int) -> Asset:
    # Middleware ensures only current tenant's assets are queried
    # If asset belongs to different tenant, DoesNotExist is raised automatically
    asset = Asset.objects.get(id=asset_id)

    asset.name = "Updated"
    asset.save()
    return asset
```

**Why it matters**: Manual checks redundant, add complexity, slow down code.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix - SECURITY)
- [ ] NO manual tenant_id in QuerySet filters anywhere?
- [ ] NO manual company in QuerySet filters?
- [ ] NO tenant_id/company_id function parameters?
- [ ] NO manual tenant checks in if statements?

### High Priority
- [ ] All multi-tenant models inherit TenantAwareModel?
- [ ] Middleware configured in settings.MIDDLEWARE?
- [ ] Middleware listed BEFORE authentication middleware?
- [ ] TENANT environment variable set correctly?

### Medium Priority
- [ ] Compound indexes include tenant_id first?
- [ ] Tests validate tenant isolation (can't access other tenant's data)?
- [ ] Admin interface considers multi-tenancy?
- [ ] Logging includes tenant context?

### Testing Isolation
- [ ] Test creates users in different tenants?
- [ ] Test verifies User A can't access User B's data?
- [ ] Test confirms middleware filtering works?
- [ ] Test validates DoesNotExist raised for cross-tenant access?

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `CLAUDE.md:78-95` | Multi-tenant transparent isolation principle |
| `.claude/core/architecture.md` | Middleware pattern architecture details |
| `binora/middleware.py` | MultitenantMiddleware implementation |
| `apps/core/models.py` | TenantAwareModel base class |
| `binora/settings.py` | TENANT_MODELS configuration |

---

## 🎯 Activation Criteria

**Keywords**: "tenant", "multi-tenant", "tenant_id", "company", "isolation", "cross-tenant", "middleware", "data leak", "security"

**Auto-suggest when**:
- User creates Django model/ViewSet with company field
- User mentions filtering by company or tenant
- User discusses data isolation or security
- User implements get_queryset() method
- User writes service methods with company_id parameter
- User discusses cross-tenant access or data leaks

---

## 🧪 Testing Multi-Tenant Isolation

### Example Test
```python
import pytest
from apps.core.models import User, Company

@pytest.mark.django_db
def test_tenant_isolation_prevents_cross_tenant_access():
    # Arrange - Create two tenants
    company_a = Company.objects.create(name="Company A", subdomain="companya")
    company_b = Company.objects.create(name="Company B", subdomain="companyb")

    user_a = User.objects.create(email="user@companya.com", company=company_a)
    user_b = User.objects.create(email="user@companyb.com", company=company_b)

    # Act - Simulate tenant A context (middleware would set this)
    with tenant_context(company_a):
        users = User.objects.all()

    # Assert - Only tenant A's users returned
    assert users.count() == 1
    assert users.first() == user_a
    assert user_b not in users  # Tenant B's user not visible

@pytest.mark.django_db
def test_cross_tenant_access_raises_does_not_exist():
    # Arrange
    company_a = Company.objects.create(name="Company A")
    company_b = Company.objects.create(name="Company B")
    asset_b = Asset.objects.create(name="Asset B", company=company_b)

    # Act & Assert - Tenant A tries to access Tenant B's asset
    with tenant_context(company_a):
        with pytest.raises(Asset.DoesNotExist):
            Asset.objects.get(id=asset_b.id)  # Middleware filters it out
```

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Isolation Target**: 100% (0 manual tenant_id filters, 0 cross-tenant vulnerabilities)
