# Check Tenant

Scan for manual tenant_id filtering - the #1 CRITICAL architecture violation in Binora Backend.

## Usage

```
/check-tenant [path]
```

**Examples:**
```
/check-tenant apps/core/
/check-tenant apps/assets/views/assets.py
/check-tenant .
```

## What It Checks

Searches for **manual tenant_id filtering** which violates transparent isolation principle.

### Forbidden Patterns ❌

```python
# CRITICAL violations
User.objects.filter(tenant_id=company.id)
Asset.objects.filter(tenant_id=request.user.company_id, status="active")
queryset.filter(tenant_id=tenant.id)
```

### Correct Patterns ✅

```python
# Middleware handles tenant_id automatically
User.objects.filter(email=email)
Asset.objects.filter(status="active")
queryset.filter(is_active=True)
```

## Why This Matters

**Multi-tenant architecture**: Transparent isolation via middleware.

**Middleware** (`binora/middleware.py`):
- Automatically adds tenant_id filter to ALL queries
- Application code should be tenant-agnostic
- Manual filtering breaks this principle

**Impact of violation**:
- Data leakage between tenants (CRITICAL security issue)
- Breaks architectural principle
- Makes code harder to maintain
- Bypasses middleware logic

## Process

1. **Search**: Grep for "tenant_id" in path
2. **Analyze**: Check each occurrence
3. **Classify**:
   - CRITICAL: Manual filtering in queries
   - OK: Model field definition
   - OK: Middleware code
4. **Report**: Only violations

## Output Format

### Pass

```
✅ TENANT CHECK PASS

Path: apps/core/
No manual tenant_id filtering found.

Middleware handles all tenant isolation transparently.
```

### Fail

```
❌ TENANT CHECK FAIL - CRITICAL VIOLATIONS

Path: apps/assets/
Found 2 manual tenant_id filtering violations:

1. apps/assets/views/assets.py:45
   > assets = Asset.objects.filter(tenant_id=company.id, status="active")

   VIOLATION: Manual tenant_id in query filter
   SEVERITY: CRITICAL

   FIX:
   > assets = Asset.objects.filter(status="active")
   # Middleware adds tenant_id automatically

2. apps/hierarchy/views/datacenter.py:78
   > datacenter = Datacenter.objects.get(id=dc_id, tenant_id=request.user.company_id)

   VIOLATION: Manual tenant_id in query
   SEVERITY: CRITICAL

   FIX:
   > datacenter = Datacenter.objects.get(id=dc_id)
   # Middleware scopes query to current tenant

Total violations: 2
All must be fixed before commit.
```

## When to Use

- **After writing queries**: Check immediately
- **Before commit**: Mandatory check
- **In PR review**: Verify compliance
- **After refactoring**: Ensure no new violations
- **Regular audits**: Periodic compliance check

## False Positives (Ignored)

These are OK and won't be flagged:

1. **Model field definitions**:
   ```python
   tenant_id = models.ForeignKey(Company, ...)
   ```

2. **Middleware code**:
   ```python
   # In binora/middleware.py
   queryset = queryset.filter(tenant_id=current_tenant)
   ```

3. **Test fixtures**:
   ```python
   # In conftest.py
   user = User.objects.create(tenant_id=company.id)
   ```

4. **Migration files**:
   ```python
   # In migrations/
   AddField('Asset', 'tenant_id', ...)
   ```

## Related

- `/quick-audit` - Includes tenant check
- `multi-tenant-enforcer` - Full agent version
- `.claude/core/architecture.md` - Multi-tenant patterns
- `.claude/core/forbidden.md` - All violations

## Architecture Reference

**Transparent Isolation**:
- Application code: Tenant-agnostic
- Middleware: Adds tenant_id automatically
- Tests: Run against Main service (same code)

**See**: `.claude/core/architecture.md` for details

## Time Estimate

~1 minute for full app scan

## Exit Codes

- 0: Pass (no violations)
- 1: Fail (violations found)