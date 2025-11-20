# Coverage Improvement Guide

**How to reach 100% coverage**

---

## Step 1: Identify Uncovered Lines

```bash
# Generate HTML coverage report
pytest apps/core/tests/ --cov=apps/core --cov-report=html

# Open htmlcov/index.html in browser
# Red lines = not covered
```

---

## Step 2: Common Uncovered Patterns

### Pattern 1: Error Handling

```python
# Uncovered: exception branches
try:
    user = User.objects.get(id=user_id)
except User.DoesNotExist:  # ← Not covered
    raise ValueError("User not found")
```

**Fix**: Add test for error case

```python
def test_get_user_with_invalid_id_raises_error(mocker):
    # Arrange
    mock_repo = mocker.Mock()
    mock_repo.get.side_effect = User.DoesNotExist
    
    service = UserService(users_repository=mock_repo)

    # Act & Assert
    with pytest.raises(ValueError, match="User not found"):
        service.get_user(user_id=999)
```

### Pattern 2: Conditional Branches

```python
# Uncovered: else branch
if status == 'active':
    send_notification(asset)
else:  # ← Not covered
    log_inactive(asset)
```

**Fix**: Test both branches

```python
def test_with_active_status_sends_notification(mocker):
    # Test if branch
    ...

def test_with_inactive_status_logs_only(mocker):
    # Test else branch
    ...
```

### Pattern 3: Edge Cases

```python
# Uncovered: empty list case
if assets:
    process(assets)
else:  # ← Not covered
    return None
```

**Fix**: Test edge case

```python
def test_process_with_empty_list_returns_none():
    result = service.process([])
    assert result is None
```

---

## Step 3: Write Missing Tests

### Template for Uncovered Line

1. **Identify**: What condition triggers this line?
2. **Arrange**: Setup data to trigger condition
3. **Act**: Execute code path
4. **Assert**: Verify expected behavior

---

## Step 4: Re-run Coverage

```bash
pytest apps/core/tests/ --cov=apps/core --cov-report=term-missing
```

**Target**: 100% or 95%+

---

## Quick Wins

**Most common uncovered**:
- Error handling (try/except)
- Else branches
- Early returns
- Validation failures
- Edge cases (empty, None, 0)

**Strategy**: Test error paths + happy paths

---

**Tool**: `--cov-report=term-missing` shows exact uncovered lines
