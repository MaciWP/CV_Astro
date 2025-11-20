# Quick Audit

Fast validation focusing on CRITICAL issues only. Use before commits for rapid quality check.

## Usage

```
/quick-audit [path]
```

**Examples:**
```
/quick-audit apps/core/
/quick-audit apps/assets/views/assets.py
/quick-audit .
```

## What It Checks

### CRITICAL Issues (Blocking)
1. **Manual tenant_id filtering**
   - Searches for `.filter(tenant_id=`
   - Violates transparent isolation principle

2. **Business logic in views/serializers**
   - Checks for save(), create(), complex operations in views
   - Should be in services

3. **Mock() without mocker**
   - Searches for `from unittest.mock import Mock`
   - Must use `mocker.Mock()` instead

### HIGH Issues (Warning)
4. **Missing type hints**
   - Scans function definitions
   - All parameters and returns need types

5. **Comments in tests**
   - Detects # comments in test files
   - Tests must be self-explanatory (YOLO policy)

6. **Obvious comments**
   - Patterns like "# Create", "# Check if", "# Get"
   - Code should be self-documenting

### Historical Errors to Avoid
**See**: `.claude/core/pr-review-checklist.md` for complete list

Quick checks for common historical errors:
- [ ] No reimplementing library features (use libraries fully)
- [ ] Helpers use class-based style (not functions)
- [ ] Single constraint definition style (Meta.constraints)
- [ ] Fixture reuse checked (root/app conftest)

## Process

1. Scan files in path
2. Run pattern matching for violations
3. Report CRITICAL issues immediately
4. Exit with status code

## Output Format

### Pass
```
✅ QUICK AUDIT PASS
Path: apps/core/
Files checked: 12
Critical issues: 0
```

### Fail
```
❌ QUICK AUDIT FAIL
Path: apps/core/
Files checked: 12
Critical issues: 3

CRITICAL Issues:
1. apps/core/views/user.py:45
   Manual tenant_id filtering
   > User.objects.filter(tenant_id=company.id, email=email)
   FIX: Remove tenant_id, middleware handles it

2. apps/assets/services.py:67
   Business logic in view
   > asset.save(); send_notification(asset)
   FIX: Move to AssetService

3. apps/hierarchy/models.py:23
   Missing type hint
   > def create_rack(name, datacenter):
   FIX: Add types: def create_rack(name: str, datacenter: Datacenter) -> Rack:
```

## When to Use

- **Before commit**: Fast pre-commit check
- **After changes**: Verify no new violations
- **In PR review**: Quick quality gate
- **During development**: Continuous validation

## vs. django-codebase-auditor

| Feature | quick-audit | django-codebase-auditor |
|---------|-------------|-------------------------|
| Speed | 30 seconds | 2-5 minutes |
| Depth | CRITICAL only | 6-layer comprehensive |
| Use case | Pre-commit | Pre-PR, deep review |

## Related

- `/check-tenant` - Multi-tenant specific scan
- `django-codebase-auditor` - Comprehensive audit
- `multi-tenant-enforcer` - Tenant isolation check
- `.claude/core/pr-review-checklist.md` - Full PR review standards

## Implementation

Uses:
- Grep for pattern matching
- Read for code analysis
- Minimal reporting (fail fast)