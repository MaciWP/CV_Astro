# Testing Patterns - Binora Backend

Target: 100% coverage per file. Framework: pytest-django.

## File Organization

```
apps/<app>/tests/
├── conftest.py              # App-specific fixtures
├── models_tests.py
├── services_tests.py
├── serializers_tests.py
└── views_tests.py
```

Root `conftest.py` for global fixtures.

## Naming Conventions

### Files
Pattern: `*_tests.py` (mandatory)

### Tests
Pattern: `test_<action>_<context>_<expected>`

Examples:
- `test_create_user_with_valid_data_succeeds`
- `test_delete_item_without_permission_raises_403`
- `test_calculate_total_with_empty_list_returns_zero`

### Classes
Pattern: `Test<Functionality>`

Use when multiple tests share setup. Otherwise, use standalone functions.

### Fixtures
Pattern: `<entity>_<modifier>`

Examples:
- `user` - Basic entity
- `user_with_company` - With relation
- `authenticated_user` - With state
- `invalid_user_data` - Test data

## AAA Pattern (Mandatory)

```python
def test_something(mocker):
    # Arrange - Prepare data and state
    user = create_user()
    mock_service = mocker.Mock()

    # Act - Execute the action
    result = perform_action(user, mock_service)

    # Assert - Verify results
    assert result.status_code == 200
    mock_service.method.assert_called_once()
```

## Fixtures

### Scope Strategy

| Data Type | Scope | Why |
|-----------|-------|-----|
| Immutable data (permissions, types) | session | Never changes |
| Hierarchies/heavy config | module or class | Expensive to create |
| Users/mutable data | function | Modified in tests |
| API clients | function | Maintain state |
| Test-modified data | function | Avoid contamination |

**Default**: Use function scope (safest).

### Location Rules

| Fixture used in | Location |
|----------------|----------|
| Single test | Same test file |
| Multiple tests (same app) | `apps/<app>/tests/conftest.py` |
| Multiple apps | `/conftest.py` (root) |
| Configuration/setup | `/conftest.py` (root) |

## Mocking Strategy

### Always Mock
- External HTTP calls
- Email sending
- File system operations
- Third-party services (AWS, external APIs)
- Random number generation (when deterministic test needed)

### Never Mock
- Django ORM methods (save, delete, filter)
- Model validations
- Django authentication methods
- Business logic being tested
- Simple calculations/transformations

### Critical Rule

✅ **ALWAYS**: `mocker.Mock()`
❌ **NEVER**: `Mock()` (without mocker fixture)

```python
# Correct
def test_something(mocker):
    mock_service = mocker.Mock()

# Wrong
from unittest.mock import Mock
def test_something():
    mock_service = Mock()  # ❌
```

### Mock Principles
- Mock at system boundaries
- Preserve real behavior for internal logic
- Verify interactions when relevant
- One mock per concept

## Test Organization

### Independent Tests
- No order dependency
- Each test prepares own state
- Can run in any order

### One Concept Per Test
```python
# Good
def test_create_user_validates_email():
    pass

def test_create_user_sends_notification():
    pass

# Bad
def test_create_user():  # Tests multiple things
    pass
```

## Constants and Values

Define in `tests/constants.py` or conftest:
- Test domains (`.test`, `.example`)
- Default passwords
- Limit values
- Test configurations

Use realistic but obvious test values.

## Performance

- Use appropriate scope (session > module > function)
- Share heavy fixtures when safe
- Avoid unnecessary I/O in setup

## Anti-patterns (Avoid)

❌ Multiple unrelated asserts
❌ Complex fixture logic
❌ Order-dependent tests
❌ Over-mocking internals
❌ Repeated hardcoded values
❌ Tests without clear assertion
❌ Setup more complex than tested code
❌ Tests that only verify mocks
❌ Fixtures with side effects
❌ Tests that never fail

## Coverage Target

100% per file (per CLAUDE.md requirement)

Verify:
```bash
nox -s test -- apps/<app>/ --cov --cov-report=term-missing
```

## Reference

Example tests: `apps/core/tests/user_views_tests.py`
Example fixtures: `conftest.py` (root)