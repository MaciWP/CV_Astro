# Coverage

Generate test coverage report with actionable improvement suggestions. Target: 100% per file.

## Usage

```
/coverage [path]
```

**Examples:**
```
/coverage apps/core/
/coverage apps/assets/services.py
/coverage .
```

## What It Does

1. **Run Tests with Coverage**:
   ```bash
   nox -s test -- [path] --cov --cov-report=term-missing
   ```

2. **Parse Results**:
   - Overall coverage %
   - Per-file coverage %
   - Missing lines
   - Uncovered branches

3. **Analyze Gaps**:
   - Which functions untested
   - Which code paths missing
   - Error handling coverage

4. **Suggest Tests**:
   - Specific test names
   - What to test
   - Expected coverage increase

## Output Format

```
COVERAGE REPORT

Path: apps/core/
Target: 100% per file

─────────────────────────────────────────
SUMMARY
─────────────────────────────────────────
Overall: 88.5% (2 files below target)

─────────────────────────────────────────
PER-FILE RESULTS
─────────────────────────────────────────

✅ apps/core/views/user.py: 94%
   Status: PASS (above 100% target)

⚠️ apps/core/services.py: 87%
   Status: BELOW TARGET (-3%)
   Missing lines: 45-48, 67-69, 102
   Missing branches: 78 (else), 91 (except)

   UNCOVERED CODE:
   1. Lines 45-48: Error handling in create_user_for_company()
      ```python
      45  except ValidationError as e:
      46      logger.error(f"Validation failed: {e}")
      47      raise
      48  return user
      ```

   2. Lines 67-69: Email sending fallback
      ```python
      67  except EmailError:
      68      # Log but don't fail
      69      logger.warning("Email failed")
      ```

   SUGGESTED TESTS:
   - test_create_user_with_invalid_data_raises_validation_error()
     → Test error handling (lines 45-48)
     → Expected coverage gain: +2%

   - test_create_user_email_failure_logs_warning()
     → Test email error handling (lines 67-69)
     → Expected coverage gain: +1.5%

   After these tests: 87% → 90.5% ✅

❌ apps/core/serializers/user.py: 78%
   Status: CRITICAL (-12% from target)
   Missing lines: 23-28, 45-50, 67-72

   UNCOVERED CODE:
   1. Lines 23-28: validate_email() method
   2. Lines 45-50: validate_phone() method
   3. Lines 67-72: create() method error handling

   SUGGESTED TESTS:
   - test_user_serializer_validates_email_format()
   - test_user_serializer_validates_phone_format()
   - test_user_serializer_create_handles_duplicate_email()
   - test_user_serializer_create_handles_invalid_team()

   After these tests: 78% → 93% ✅

─────────────────────────────────────────
ACTION PLAN
─────────────────────────────────────────

Priority 1 (CRITICAL - <80%):
1. Fix apps/core/serializers/user.py
   - Add 4 tests
   - Estimated time: 30 minutes
   - Coverage gain: 78% → 93%

Priority 2 (BELOW TARGET - 80-100%):
2. Fix apps/core/services.py
   - Add 2 tests
   - Estimated time: 15 minutes
   - Coverage gain: 87% → 90.5%

TOTAL TIME: ~45 minutes
RESULT: All files 100% ✅

─────────────────────────────────────────
NEXT STEPS
─────────────────────────────────────────

1. Generate tests:
   Use django-test-generator to create suggested tests

2. Verify improvement:
   Re-run: /coverage apps/core/

3. Iterate until all files 100%
```

## When to Use

- **After writing code**: Check coverage immediately
- **Before PR**: Ensure 100% target met
- **In PR review**: Verify test quality
- **Sprint planning**: Identify technical debt
- **Regular audits**: Monitor coverage trends

## Coverage Target

**Project Standard**: 100% per file

**Thresholds**:
- ✅ PASS: ≥100%
- ⚠️ WARNING: 80-89%
- ❌ CRITICAL: <80%

## Related

- `django-test-generator` - Create suggested tests
- `/fix-tests` - Debug failing tests
- `.claude/core/testing.md` - Testing patterns

## Advanced Usage

### With specific test file
```
/coverage apps/core/ --test-file=apps/core/tests/services_tests.py
```

### HTML report
After `/coverage`, open detailed HTML:
```bash
open htmlcov/index.html
```

### Branch coverage
Coverage includes:
- Line coverage (default)
- Branch coverage (if/else, try/except)

## Implementation

Uses:
- nox for test execution
- pytest-cov for coverage measurement
- Coverage.py under the hood
- Custom parsing and analysis

## Time Estimate

- Small file: 30 seconds
- App (10 files): 1-2 minutes
- Full project: 3-5 minutes

## Benefits

- Identifies untested code
- Suggests specific tests
- Provides actionable steps
- Estimates time to target
- Tracks progress