# Test Generation - From Specs to Tests

**Goal**: Auto-generate high-quality tests from Given-When-Then specifications.

**Target**: 90%+ tests pass on first run

**Based on**: SPEC Scenario 1, TDD best practices (Kent Beck)

---

## Core Pattern: Given-When-Then → Test Code

### Step 1: Parse Specification

```typescript
// Input: User specification
const spec = `
Given user is logged in
When user clicks logout button
Then user is logged out
And session is destroyed
And user is redirected to login page
`;

// Parsed structure
const parsed = {
  given: ['user is logged in'],
  when: ['user clicks logout button'],
  then: [
    'user is logged out',
    'session is destroyed',
    'user is redirected to login page'
  ]
};
```

---

### Step 2: Generate Test Cases

**Generate 3 types of tests automatically:**

1. **Happy path** (Given-When-Then as-is)
2. **Edge cases** (boundary conditions)
3. **Error cases** (failure scenarios)

---

## Example: Complete Test Generation

### Input Spec

```
Given user is authenticated
When user submits valid email for password reset
Then reset email is sent
And user sees confirmation message
And reset token expires in 1 hour
```

### Generated Tests (Jest/Vitest)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { resetPassword, getResetToken } from './auth';

describe('Password Reset', () => {
  // Happy path (from spec)
  it('sends reset email when user submits valid email', async () => {
    // Given: user is authenticated
    const user = await createAuthenticatedUser({ email: 'test@example.com' });

    // When: user submits valid email
    const result = await resetPassword({ email: user.email });

    // Then: reset email is sent
    expect(result.emailSent).toBe(true);
    expect(result.recipient).toBe('test@example.com');

    // And: user sees confirmation message
    expect(result.message).toContain('Reset email sent');

    // And: reset token expires in 1 hour
    const token = await getResetToken(user.email);
    const expiresAt = new Date(token.expiresAt);
    const now = new Date();
    const diffHours = (expiresAt - now) / (1000 * 60 * 60);
    expect(diffHours).toBeCloseTo(1, 1); // ~1 hour ± 0.1
  });

  // Edge case 1: User not authenticated
  it('handles password reset for non-authenticated user', async () => {
    const result = await resetPassword({ email: 'nonexistent@example.com' });

    // Security: Don't reveal if email exists
    expect(result.emailSent).toBe(true); // Always return success
    expect(result.message).toContain('Reset email sent'); // Same message
  });

  // Edge case 2: Invalid email format
  it('rejects invalid email format', async () => {
    await expect(
      resetPassword({ email: 'invalid-email' })
    ).rejects.toThrow('Invalid email format');
  });

  // Edge case 3: Email already requested recently
  it('prevents multiple reset requests within 5 minutes', async () => {
    const email = 'test@example.com';

    // First request: success
    await resetPassword({ email });

    // Second request immediately: rate limited
    await expect(
      resetPassword({ email })
    ).rejects.toThrow('Please wait 5 minutes before requesting again');
  });

  // Error case 1: Email service down
  it('handles email service failure gracefully', async () => {
    mockEmailServiceFailure();

    const result = await resetPassword({ email: 'test@example.com' });

    // Fail gracefully, don't crash
    expect(result.emailSent).toBe(false);
    expect(result.error).toContain('Unable to send email');
  });

  // Error case 2: Database failure
  it('handles database failure when creating reset token', async () => {
    mockDatabaseFailure();

    await expect(
      resetPassword({ email: 'test@example.com' })
    ).rejects.toThrow('Service temporarily unavailable');
  });
});
```

---

## Generation Strategy

### Happy Path (Always Generate)

**Pattern**: Directly translate Given-When-Then to test code

```typescript
// Given X
const setup = setupGiven(parsed.given);

// When Y
const result = await executeWhen(parsed.when);

// Then Z (for each assertion)
parsed.then.forEach(assertion => {
  expect(result).toMatch(assertion);
});
```

---

### Edge Cases (Auto-Detect from Spec)

**Detect from keywords**:
- "valid" → Generate invalid case
- "authenticated" → Generate unauthenticated case
- "exists" → Generate non-existent case
- "active" → Generate inactive case
- Numbers (1 hour, 5 items) → Generate boundary (0, max, max+1)

**Example**:
```
"user submits valid email" → Generate "invalid email format"
"user is authenticated" → Generate "user not authenticated"
"expires in 1 hour" → Generate "token already expired"
```

---

### Error Cases (Common Patterns)

**Always generate for**:
1. **Network failures** (API calls, external services)
2. **Database failures** (queries, connections)
3. **Permission errors** (unauthorized access)
4. **Validation errors** (invalid input)
5. **Rate limiting** (too many requests)

---

## Framework-Specific Examples

### Jest (JavaScript/TypeScript)

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('happy path description', async () => {
    // Given-When-Then
  });

  it('edge case description', async () => {
    // Test edge case
  });

  it('error case description', async () => {
    // Test error handling
  });
});
```

---

### Vitest (JavaScript/TypeScript - Modern)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('happy path', async () => {
    // Same as Jest
  });
});
```

---

### Pytest (Python)

```python
import pytest

class TestFeatureName:
    def setup_method(self):
        # Setup
        pass

    def test_happy_path(self):
        # Given
        user = create_authenticated_user(email='test@example.com')

        # When
        result = reset_password(email=user.email)

        # Then
        assert result.email_sent is True
        assert result.message == 'Reset email sent'

    def test_invalid_email_format(self):
        # When/Then
        with pytest.raises(ValueError, match='Invalid email format'):
            reset_password(email='invalid-email')

    def test_email_service_failure(self, monkeypatch):
        # Mock email service failure
        monkeypatch.setattr('email_service.send', lambda x: raise Exception())

        # When
        result = reset_password(email='test@example.com')

        # Then
        assert result.email_sent is False
        assert 'Unable to send email' in result.error
```

---

### Go Test

```go
package auth_test

import (
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestPasswordReset_HappyPath(t *testing.T) {
    // Given: user is authenticated
    user := createAuthenticatedUser("test@example.com")

    // When: user submits valid email
    result, err := resetPassword(user.Email)

    // Then: reset email is sent
    assert.NoError(t, err)
    assert.True(t, result.EmailSent)
    assert.Contains(t, result.Message, "Reset email sent")
}

func TestPasswordReset_InvalidEmail(t *testing.T) {
    // When/Then
    _, err := resetPassword("invalid-email")
    assert.Error(t, err)
    assert.Contains(t, err.Error(), "Invalid email format")
}
```

---

## Success Criteria

### Target: 90%+ First-Run Pass Rate

**Achieved by**:
1. **Clear spec parsing** - Unambiguous Given-When-Then
2. **Complete setup** - All "Given" conditions properly mocked/created
3. **Accurate assertions** - "Then" statements correctly translated
4. **Error handling** - Try/catch for async, expect().rejects for promises
5. **Proper cleanup** - beforeEach/afterEach, transaction rollback

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Incomplete Setup

```typescript
// ❌ BAD: Assumes user exists
it('user can logout', async () => {
  await logout(); // ERROR: No user logged in
});

// ✅ GOOD: Proper setup
it('user can logout', async () => {
  const user = await loginUser({ email: 'test@example.com' });
  await logout(user);
  expect(isLoggedIn()).toBe(false);
});
```

---

### ❌ Mistake 2: Superficial Assertions

```typescript
// ❌ BAD: Checks something returned, not what
it('validates email', () => {
  const result = validateEmail('test@example.com');
  expect(result).toBeTruthy(); // Superficial
});

// ✅ GOOD: Verifies root functionality (Golden Rule)
it('validates email format', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid')).toBe(false);
  expect(validateEmail('test@')).toBe(false);
});
```

---

### ❌ Mistake 3: Flaky Async Tests

```typescript
// ❌ BAD: Race condition
it('dashboard shows data', () => {
  render(<Dashboard />);
  expect(screen.getByText('Total: 150')).toBeInTheDocument(); // Fails if data not loaded
});

// ✅ GOOD: Wait for async data
it('dashboard shows data', async () => {
  render(<Dashboard />);
  await waitFor(() => {
    expect(screen.getByText('Total: 150')).toBeInTheDocument();
  });
});
```

---

## Integration with Mutation Testing

**After generating tests, verify quality with mutation testing:**

```typescript
// Step 1: Generate tests from spec
const tests = generateTestsFromSpec(spec);

// Step 2: Run tests (should pass 90%+)
const testResult = await runTests(tests);
console.log(`Pass rate: ${testResult.passRate}%`); // 92% ✅

// Step 3: Run mutation testing (verify root functionality)
const mutationResult = await runMutationTests(tests);
console.log(`Mutation score: ${mutationResult.score}%`); // 85% ✅

// If mutation score <80%, tests are superficial → regenerate with stronger assertions
```

---

**Version**: 1.0.0
**Target**: 90%+ first-run pass rate
**Next**: See `mutation-testing.md` to verify test quality
