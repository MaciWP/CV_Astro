# Create PR

Generate PR description with full validation suite. Runs all quality checks before allowing PR creation.

## Usage

```
/create-pr [base-branch]
```

**Default base branch**: `dev`

**Examples:**
```
/create-pr
/create-pr dev
/create-pr main
```

## What It Does

### 1. Run Validations (Parallel)

Executes simultaneously:
```bash
nox -s format
nox -s lint
nox -s types_check
nox -s test -- --cov
```

Plus:
- django-codebase-auditor on changed files
- Multi-tenant check via /check-tenant

### 2. Validation Gate

**If ANY fail**: STOP and report issues

**Output:**
```
❌ PR VALIDATION FAILED

Failures:
1. lint: 3 issues
   - apps/core/views.py:45 - Line too long
   - apps/assets/models.py:23 - Unused import

2. tests: 2 failures
   - test_create_asset_with_invalid_data
   - test_update_user_permissions

3. audit: 1 CRITICAL issue
   - apps/hierarchy/views.py:67 - Manual tenant_id filtering

FIX ISSUES BEFORE CREATING PR
```

### 3. Analyze Changes

```bash
git diff [base-branch]...HEAD
```

Extracts:
- Modified files
- Added/deleted lines
- Commit messages
- Affected modules

### 4. Generate PR Description

Creates structured PR body:

```markdown
# [Type] Title

## Summary
Brief description of changes

## Changes
- Bullet point list of modifications
- Organized by category (features, fixes, refactoring)

## Testing
- Test coverage: X%
- New tests added: N
- All tests passing: ✅

## Validation Results
✅ format - passed
✅ lint - passed
✅ types - passed
✅ tests - 127 passed, 2 skipped, coverage: 91%
✅ audit - 0 critical issues, 2 medium suggestions

## Breaking Changes
[If any]

## Migration Required
[If any]

## Checklist
- [x] Tests added/updated
- [x] Documentation updated (if needed)
- [x] No breaking changes (or documented)
- [x] Migration tested (if applicable)
```

## Output Format

### Success

```
✅ PR VALIDATION PASSED

All checks passed:
✅ format - no changes needed
✅ lint - 0 issues
✅ types - no errors
✅ tests - 127 passed, coverage 91%
✅ audit - 0 critical issues

─────────────────────────────────
PR DESCRIPTION
─────────────────────────────────

Title: [Feature] Asset status filtering

## Summary
Added filtering by status to AssetViewSet with django-filter integration.
Allows users to filter assets by active/inactive/maintenance status.

## Changes
- Created AssetFilterSet in apps/assets/filters.py
- Updated AssetViewSet to use DjangoFilterBackend
- Added tests for filter functionality
- Updated API documentation

## Testing
- Test coverage: 94% (target: 100%)
- New tests: 8 tests for filter scenarios
- All tests passing: ✅

## Validation Results
✅ format - passed
✅ lint - passed
✅ types - passed
✅ tests - 135 passed, coverage 91.2%
✅ audit - 0 critical issues

## Breaking Changes
None

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] No breaking changes
- [x] No migrations required

─────────────────────────────────

Ready to create PR:
git push origin [branch]
gh pr create --base dev --title "[Feature] Asset status filtering" --body "[paste above]"
```

### Failure

```
❌ PR VALIDATION FAILED

Must fix before creating PR.

See issues above and re-run /create-pr after fixes.
```

## When to Use

- Ready to create PR
- Want comprehensive validation
- Need structured PR description
- Ensure quality before review

## Pre-requisites

1. Changes committed locally
2. All files added to git
3. Virtual environment activated
4. Dependencies installed

## Related

- `/quick-audit` - Fast pre-check
- `pre-commit-guardian` - Similar validation
- `.claude/core/workflows.md` - PR workflow

## Configuration

Validation suite can be customized in command implementation.

Default checks:
- Code formatting (Black)
- Linting (flake8)
- Type checking (mypy)
- Tests with coverage (pytest)
- Architecture audit
- Multi-tenant compliance

## Time Estimate

- Validation: 2-3 minutes (parallel execution)
- PR generation: 30 seconds
- Total: ~3-5 minutes

## Benefits

- Catches issues before PR review
- Consistent PR descriptions
- Saves reviewer time
- Enforces quality standards
- Prevents broken PRs
