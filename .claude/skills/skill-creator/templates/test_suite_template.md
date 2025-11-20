# Test Suite Template (Universal)

**Use this template for**: pytest (Python), Jest (TypeScript/JavaScript), JUnit (Java), xUnit (C#), Flutter Test (Dart)

**Instructions**: Replace all `{{SlotName}}` placeholders with actual values from your project context.

---

## pytest (Python) Example

```python
"""
{{TestFileDescription}}

Tests for {{TargetClass}} in {{targetModule}}.

Test Coverage:
- {{TestCategory1}}: {{testCount1}} tests
- {{TestCategory2}}: {{testCount2}} tests
- Edge cases: {{edgeCaseCount}} tests
"""

import pytest
from unittest.mock import Mock, patch, AsyncMock
from {{projectStructure}}.{{targetModule}} import {{TargetClass}}
from {{projectStructure}}.models import {{ModelClass}}
from {{projectStructure}}.exceptions import {{ExceptionClass1}}, {{ExceptionClass2}}


# Fixtures
@pytest.fixture
def mock_{{dependencyName}}():
    """Provide mocked {{DependencyDescription}}."""
    mock = Mock()
    mock.{{method1}}.return_value = {{mockReturn1}}
    mock.{{method2}}.side_effect = {{mockSideEffect2}}
    return mock


@pytest.fixture
def {{targetInstance}}(mock_{{dependencyName}}):
    """Provide {{TargetClass}} instance with mocked dependencies."""
    return {{TargetClass}}({{dependency}}=mock_{{dependencyName}})


@pytest.fixture
def sample_{{entityName}}():
    """Provide sample {{EntityDescription}} for testing."""
    return {{ModelClass}}(
        {{field1}}={{value1}},
        {{field2}}={{value2}},
        {{field3}}={{value3}},
    )


# Happy Path Tests
class Test{{TargetClass}}HappyPath:
    """Test {{TargetClass}} normal/expected behavior."""

    def test_should_{{action1}}_when_{{condition1}}(
        self,
        {{targetInstance}},
        sample_{{entityName}},
    ):
        """{{TestDescription1}}"""
        # Arrange
        {{arrangeVariable1}} = {{arrangeValue1}}
        {{arrangeVariable2}} = {{arrangeValue2}}

        # Act
        result = {{targetInstance}}.{{methodName}}(
            {{param1}}={{arrangeVariable1}},
            {{param2}}={{arrangeVariable2}},
        )

        # Assert
        assert result.{{field1}} == {{expectedValue1}}
        assert result.{{field2}} == {{expectedValue2}}
        assert {{targetInstance}}.{{dependency}}.{{method1}}.call_count == 1

    @pytest.mark.asyncio
    async def test_should_{{action2}}_async_when_{{condition2}}(
        self,
        {{targetInstance}},
    ):
        """{{TestDescription2}}"""
        # Arrange
        {{targetInstance}}.{{dependency}}.{{method2}} = AsyncMock(
            return_value={{asyncReturn}}
        )

        # Act
        result = await {{targetInstance}}.{{asyncMethodName}}({{asyncParam}})

        # Assert
        assert result == {{expectedAsyncResult}}
        {{targetInstance}}.{{dependency}}.{{method2}}.assert_awaited_once_with({{asyncParam}})

    @pytest.mark.parametrize("{{paramName}},expected", [
        ({{testCase1Input}}, {{testCase1Expected}}),
        ({{testCase2Input}}, {{testCase2Expected}}),
        ({{testCase3Input}}, {{testCase3Expected}}),
        ({{testCase4Input}}, {{testCase4Expected}}),
    ])
    def test_should_{{action3}}_with_various_inputs(
        self,
        {{targetInstance}},
        {{paramName}},
        expected,
    ):
        """{{TestDescription3}}"""
        # Act
        result = {{targetInstance}}.{{methodName}}({{paramName}})

        # Assert
        assert result == expected


# Error Handling Tests
class Test{{TargetClass}}ErrorHandling:
    """Test {{TargetClass}} error scenarios."""

    def test_should_raise_{{exception1}}_when_{{errorCondition1}}(
        self,
        {{targetInstance}},
    ):
        """{{ErrorTestDescription1}}"""
        # Arrange
        {{targetInstance}}.{{dependency}}.{{method1}}.side_effect = {{ExceptionClass1}}(
            "{{errorMessage1}}"
        )

        # Act & Assert
        with pytest.raises({{ExceptionClass1}}, match="{{errorPattern1}}"):
            {{targetInstance}}.{{methodName}}({{invalidParam}})

    def test_should_handle_{{exception2}}_gracefully(
        self,
        {{targetInstance}},
    ):
        """{{ErrorTestDescription2}}"""
        # Arrange
        {{targetInstance}}.{{dependency}}.{{method2}}.side_effect = {{ExceptionClass2}}()

        # Act
        result = {{targetInstance}}.{{methodName}}({{param}})

        # Assert
        assert result is None  # or default value
        # Verify error was logged (if applicable)


# Edge Cases
class Test{{TargetClass}}EdgeCases:
    """Test {{TargetClass}} boundary conditions."""

    @pytest.mark.parametrize("edge_input", [
        None,
        "",
        [],
        {},
        {{extremeValue1}},
        {{extremeValue2}},
    ])
    def test_should_handle_edge_case_inputs(
        self,
        {{targetInstance}},
        edge_input,
    ):
        """{{EdgeCaseDescription}}"""
        # Act & Assert
        # Should not raise exception
        result = {{targetInstance}}.{{methodName}}(edge_input)
        assert result is not None

    def test_should_handle_empty_{{collection}}(self, {{targetInstance}}):
        """{{EmptyCollectionDescription}}"""
        # Arrange
        empty_{{collection}} = []

        # Act
        result = {{targetInstance}}.{{methodName}}(empty_{{collection}})

        # Assert
        assert result == {{emptyExpected}}

    def test_should_handle_large_{{collection}}(self, {{targetInstance}}):
        """{{LargeCollectionDescription}}"""
        # Arrange
        large_{{collection}} = [{{sampleItem}}] * {{largeSize}}

        # Act
        result = {{targetInstance}}.{{methodName}}(large_{{collection}})

        # Assert
        assert len(result) == {{largeSize}}


# Integration Tests (if applicable)
@pytest.mark.integration
class Test{{TargetClass}}Integration:
    """Test {{TargetClass}} with real dependencies."""

    @pytest.fixture
    def real_{{targetInstance}}(self):
        """Provide {{TargetClass}} with real dependencies."""
        return {{TargetClass}}({{dependency}}={{RealDependency}}())

    def test_integration_{{scenario}}(self, real_{{targetInstance}}):
        """{{IntegrationTestDescription}}"""
        # Arrange
        {{realArrangeVariable}} = {{realArrangeValue}}

        # Act
        result = real_{{targetInstance}}.{{methodName}}({{realArrangeVariable}})

        # Assert
        assert result.{{field}} == {{realExpected}}
```

---

## Jest (TypeScript) Example

```typescript
/**
 * {{TestFileDescription}}
 *
 * Tests for {{TargetClass}} in {{targetModule}}.
 */

import { {{TargetClass}} } from '@/{{targetModule}}';
import { {{DependencyClass}} } from '@/{{dependencyModule}}';
import { {{ModelClass}} } from '@/models/{{modelModule}}';
import { {{ExceptionClass1}}, {{ExceptionClass2}} } from '@/exceptions';

// Mocks
jest.mock('@/{{dependencyModule}}');

describe('{{TargetClass}}', () => {
  let {{targetInstance}}: {{TargetClass}};
  let mock{{DependencyClass}}: jest.Mocked<{{DependencyClass}}>;

  beforeEach(() => {
    mock{{DependencyClass}} = new {{DependencyClass}}() as jest.Mocked<{{DependencyClass}}>;
    {{targetInstance}} = new {{TargetClass}}(mock{{DependencyClass}});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('{{methodName}}', () => {
    it('should {{action1}} when {{condition1}}', () => {
      // Arrange
      const {{param1}} = {{value1}};
      mock{{DependencyClass}}.{{method1}}.mockReturnValue({{mockReturn}});

      // Act
      const result = {{targetInstance}}.{{methodName}}({{param1}});

      // Assert
      expect(result.{{field1}}).toBe({{expected1}});
      expect(mock{{DependencyClass}}.{{method1}}).toHaveBeenCalledWith({{param1}});
      expect(mock{{DependencyClass}}.{{method1}}).toHaveBeenCalledTimes(1);
    });

    it('should {{action2}} when {{condition2}}', async () => {
      // Arrange
      mock{{DependencyClass}}.{{asyncMethod}}.mockResolvedValue({{asyncReturn}});

      // Act
      const result = await {{targetInstance}}.{{asyncMethodName}}({{asyncParam}});

      // Assert
      expect(result).toEqual({{expectedAsyncResult}});
    });

    it.each([
      [{{input1}}, {{expected1}}],
      [{{input2}}, {{expected2}}],
      [{{input3}}, {{expected3}}],
    ])('should return %s when input is %s', (input, expected) => {
      // Act
      const result = {{targetInstance}}.{{methodName}}(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('error handling', () => {
    it('should throw {{ExceptionClass1}} when {{errorCondition}}', () => {
      // Arrange
      mock{{DependencyClass}}.{{method1}}.mockImplementation(() => {
        throw new {{ExceptionClass1}}('{{errorMessage}}');
      });

      // Act & Assert
      expect(() => {{targetInstance}}.{{methodName}}({{invalidParam}})).toThrow(
        {{ExceptionClass1}}
      );
      expect(() => {{targetInstance}}.{{methodName}}({{invalidParam}})).toThrow(
        '{{errorMessage}}'
      );
    });
  });

  describe('edge cases', () => {
    it.each([null, undefined, '', [], {}])(
      'should handle edge case: %s',
      (edgeInput) => {
        // Act & Assert
        expect(() => {{targetInstance}}.{{methodName}}(edgeInput)).not.toThrow();
      }
    );
  });
});
```

---

## Slot Reference

| Slot | Purpose | Example Values |
|------|---------|----------------|
| `{{TestFileDescription}}` | What this test file covers | `User service tests`, `Product repository integration tests` |
| `{{TargetClass}}` | Class being tested | `UserService`, `ProductRepository`, `OrderManager` |
| `{{targetModule}}` | Module path | `services.user_service`, `repositories/product` |
| `{{targetInstance}}` | Instance variable name | `userService`, `productRepo`, `orderManager` |
| `{{DependencyClass}}` | Mocked dependency class | `Database`, `ApiClient`, `EmailService` |
| `{{dependencyName}}` | Dependency variable name | `database`, `apiClient`, `emailService` |
| `{{methodName}}` | Method being tested | `createUser`, `getProduct`, `calculateTotal` |
| `{{action1}}`, `{{action2}}` | What method does | `create user`, `fetch products`, `send email` |
| `{{condition1}}`, `{{condition2}}` | Test condition | `valid data provided`, `user exists`, `API available` |
| `{{param1}}`, `{{param2}}` | Method parameters | `userId`, `email`, `productId`, `quantity` |
| `{{value1}}`, `{{value2}}` | Test values | `"John"`, `25`, `["item1", "item2"]`, `{ id: 1 }` |
| `{{mockReturn}}` | Mocked return value | `User(id=1, name="John")`, `{ success: true }`, `[]` |
| `{{expected1}}`, `{{expected2}}` | Expected results | `"John"`, `1`, `true`, `null` |
| `{{ExceptionClass1}}` | Exception type | `ValueError`, `UserNotFoundError`, `ValidationError` |
| `{{errorCondition}}` | Error trigger | `user not found`, `invalid email`, `database down` |
| `{{errorMessage}}` | Error message | `User not found`, `Invalid email format` |
| `{{collection}}` | Collection type | `users`, `items`, `products`, `results` |

---

## Usage Instructions

1. **Identify testing framework** from Step 1
2. **Choose appropriate template** (pytest, Jest, JUnit, etc.)
3. **Replace {{slots}}** with test-specific values
4. **Follow AAA pattern**: Arrange-Act-Assert
5. **Run tests** to ensure they pass/fail correctly
6. **Check coverage**: Aim for >80%

---

## Best Practices

- **Naming**: `test_should_action_when_condition` (Python) or `should action when condition` (Jest)
- **One assertion per test**: Test one behavior, not 10
- **Fixtures**: Reuse common setup (pytest.fixture, beforeEach)
- **Mocks**: Mock external dependencies (DB, API, filesystem)
- **Parametrize**: Use parametrize/it.each for multiple cases
- **Fast**: Unit tests <100ms, integration <1s
- **Isolated**: Tests must be order-independent
- **Coverage**: >80% line coverage, >90% branch coverage

---

**Last Updated**: 2025-10-20
**Compatible With**: pytest 7+, Jest 29+, JUnit 5+, xUnit 2+, Flutter Test 3+
