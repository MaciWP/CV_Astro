# Test Quality Validation Checklist

**Quick validation for test quality**

---

## Level 1: Quick Scan (1 min)

### Check 1: No Docstrings

```bash
# Find docstrings in tests
grep -rn '"""' apps/*/tests/*_tests.py

# Expected: 0 results
```

### Check 2: No unittest.mock

```bash
# Find unittest.mock imports
grep -rn "from unittest.mock import" apps/*/tests/

# Expected: 0 results
```

### Check 3: AAA Pattern

```bash
# Check for AAA comments (should have Arrange, Act, Assert)
grep -rn "# Arrange\|# Act\|# Assert" apps/*/tests/*_tests.py

# Expected: All test files
```

---

## Level 2: Detailed Check (5 min)

### Check 4: Test Naming

**Format**: `test_<action>_<context>_<expected>`

```bash
# Find tests with poor names
grep -rn "def test_\w\{1,10\}(" apps/*/tests/

# Expected: Few or none (long descriptive names)
```

### Check 5: Coverage

```bash
# Check coverage for app
pytest apps/core/tests/ --cov=apps/core --cov-report=term-missing

# Target: 95%+ (100% ideal)
```

### Check 6: @pytest.mark.django_db

```bash
# Find test classes without @pytest.mark.django_db
grep -B 1 "class Test" apps/*/tests/*.py | grep -v "@pytest.mark.django_db"

# Expected: 0 (all test classes should have it)
```

---

## Level 3: Quality Check (10 min)

### Check 7: Fixture Usage

```python
# ✅ GOOD - Uses fixtures
def test_create_user(api_client, user_factory):
    user = user_factory()  # Using factory
    api_client.force_authenticate(user=user)  # Using api_client

# ❌ BAD - Direct instantiation
def test_create_user():
    client = APIClient()  # Should use api_client fixture
    user = User.objects.create(...)  # Should use user_factory
```

### Check 8: Mock Verification

```python
# ✅ GOOD - Verifies mocks
def test_service(mocker):
    mock_repo = mocker.Mock()
    service.create(...)

    mock_repo.create.assert_called_once()  # Verification

# ❌ BAD - No verification
def test_service(mocker):
    mock_repo = mocker.Mock()
    service.create(...)
    # No assertion on mock!
```

---

## Automated Script

```bash
#!/bin/bash
echo "=== Test Quality Check ==="

echo "1. Checking for docstrings in tests..."
docstrings=$(grep -rn '"""' apps/*/tests/*_tests.py 2>/dev/null | wc -l)
if [ $docstrings -gt 0 ]; then
    echo "❌ FAIL: Found $docstrings docstrings"
else
    echo "✅ PASS: No docstrings"
fi

echo "2. Checking for unittest.mock..."
mock_usage=$(grep -rn "from unittest.mock" apps/*/tests/ 2>/dev/null | wc -l)
if [ $mock_usage -gt 0 ]; then
    echo "❌ FAIL: Found $mock_usage unittest.mock usages"
else
    echo "✅ PASS: Using mocker"
fi

echo "3. Checking AAA pattern..."
aaa_tests=$(grep -rl "# Arrange" apps/*/tests/ 2>/dev/null | wc -l)
echo "✅ Files with AAA: $aaa_tests"

echo "4. Running coverage..."
pytest apps/core/tests/ --cov=apps/core --cov-report=term-missing -q
```

---

## Quick Fix Guide

**Violation**: Docstrings in tests
**Fix**: Remove all docstrings, make test names descriptive

**Violation**: unittest.mock
**Fix**: Replace with mocker fixture

**Violation**: No AAA structure
**Fix**: Add blank lines and comments (# Arrange, # Act, # Assert)

**Violation**: Low coverage
**Fix**: Add missing tests, see `coverage_improvement_guide.md`

---

**Usage**: Run before PR, after writing tests
