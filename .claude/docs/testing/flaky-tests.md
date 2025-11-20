# Flaky Tests - Detection and Fixing

**Goal**: Identify and fix tests that pass/fail randomly (unreliable tests).

**Target**: 100% flaky tests detected, 80%+ auto-fixable

**Impact**: Major problem in 2024 CI/CD (CircleCI, Datadog, Semaphore all have detection tools)

---

## What is a Flaky Test?

**Flaky test = Test with non-deterministic behavior**

```typescript
// Run 1: ✅ PASS
// Run 2: ❌ FAIL
// Run 3: ✅ PASS
// Run 4: ✅ PASS
// Run 5: ❌ FAIL
// → 60% pass rate = FLAKY
```

**Problem**: Destroys CI/CD reliability
- Developers ignore red builds ("probably flaky")
- Real bugs slip through ("thought it was flaky")
- Wastes time re-running builds

---

## Common Causes of Flakiness

### 1. Race Conditions (Async/Await)

```typescript
// ❌ FLAKY: Doesn't wait for data
it('dashboard shows metrics', () => {
  render(<Dashboard />);
  expect(screen.getByText('Total Events: 150')).toBeInTheDocument();
  // Sometimes passes (data loaded fast), sometimes fails (data slow)
});

// ✅ STABLE: Waits for async data
it('dashboard shows metrics', async () => {
  render(<Dashboard />);
  await waitFor(() => {
    expect(screen.getByText('Total Events: 150')).toBeInTheDocument();
  }, { timeout: 3000 });
});
```

---

### 2. Timing Dependencies

```typescript
// ❌ FLAKY: Hardcoded sleep (brittle)
it('shows success message after save', async () => {
  await saveData();
  await new Promise(resolve => setTimeout(resolve, 100)); // 100ms might not be enough
  expect(screen.getByText('Saved successfully')).toBeInTheDocument();
});

// ✅ STABLE: Wait for condition
it('shows success message after save', async () => {
  await saveData();
  await waitFor(() => {
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });
});
```

---

### 3. Shared State (Test Isolation)

```typescript
// ❌ FLAKY: Tests share global state
let currentUser = null;

it('test A: user can login', () => {
  currentUser = { id: 1, name: 'Alice' }; // Modifies global state
  expect(currentUser.name).toBe('Alice');
});

it('test B: user can view profile', () => {
  expect(currentUser.name).toBe('Alice'); // Depends on test A running first
  // Fails if test B runs before test A, or if test A fails
});

// ✅ STABLE: Each test has independent setup
it('test A: user can login', () => {
  const user = { id: 1, name: 'Alice' }; // Local state
  expect(user.name).toBe('Alice');
});

it('test B: user can view profile', () => {
  const user = { id: 1, name: 'Alice' }; // Independent setup
  expect(user.name).toBe('Alice');
});
```

---

### 4. Random Data / Current Time

```typescript
// ❌ FLAKY: Uses random data
it('generates unique ID', () => {
  const id = generateId(); // Uses Math.random()
  expect(id).toBe('abc123'); // Fails when random value changes
});

// ✅ STABLE: Mock random source
it('generates unique ID', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.123456);
  const id = generateId();
  expect(id).toBe('abc123'); // Deterministic
});

// ❌ FLAKY: Uses current time
it('shows current date', () => {
  const date = getCurrentDate(); // Uses new Date()
  expect(date).toBe('2025-11-17'); // Fails next day
});

// ✅ STABLE: Mock time
it('shows current date', () => {
  vi.setSystemTime(new Date('2025-11-17'));
  const date = getCurrentDate();
  expect(date).toBe('2025-11-17'); // Always same date
});
```

---

### 5. External Dependencies (Network, Database)

```typescript
// ❌ FLAKY: Calls real API
it('fetches user data', async () => {
  const user = await fetchUser(123); // Network call
  expect(user.name).toBe('Alice');
  // Fails if: API down, network slow, rate limited, data changed
});

// ✅ STABLE: Mock API
it('fetches user data', async () => {
  vi.mocked(fetchUser).mockResolvedValue({ id: 123, name: 'Alice' });
  const user = await fetchUser(123);
  expect(user.name).toBe('Alice'); // Always same result
});
```

---

### 6. Test Order Dependencies

```typescript
// ❌ FLAKY: Tests assume specific order
describe('User flow', () => {
  it('step 1: create user', async () => {
    await createUser({ name: 'Alice' });
    // User stored in database
  });

  it('step 2: update user', async () => {
    await updateUser({ name: 'Alice Updated' });
    // Fails if step 1 didn't run or database was cleared
  });
});

// ✅ STABLE: Each test independent
describe('User flow', () => {
  beforeEach(async () => {
    await createUser({ name: 'Alice' }); // Setup for EACH test
  });

  it('can create user', async () => {
    const user = await getUser();
    expect(user.name).toBe('Alice');
  });

  it('can update user', async () => {
    await updateUser({ name: 'Alice Updated' });
    const user = await getUser();
    expect(user.name).toBe('Alice Updated');
  });
});
```

---

## Detection Strategies (2024 Best Practices)

### Strategy 1: Run Multiple Times (Statistical Analysis)

```bash
# Run test suite 10 times
for i in {1..10}; do
  npm test
done

# Analyze results
# If any test fails 1+ times but not always → FLAKY
```

**Tools that do this automatically**:
- **CircleCI Test Insights**: Tracks flakiness across builds
- **Datadog Test Visibility**: Flakiness score per test
- **Semaphore Flaky Tests Dashboard**: Identifies patterns

---

### Strategy 2: Automated Detection Script

```typescript
// scripts/detect-flaky-tests.ts
async function detectFlakyTests(runs: number = 10) {
  const results = new Map<string, { passed: number; failed: number }>();

  for (let i = 0; i < runs; i++) {
    const testResult = await runTests();

    testResult.tests.forEach(test => {
      const stats = results.get(test.name) || { passed: 0, failed: 0 };
      if (test.status === 'passed') {
        stats.passed++;
      } else {
        stats.failed++;
      }
      results.set(test.name, stats);
    });
  }

  // Identify flaky tests (passed AND failed at least once)
  const flakyTests = [];
  results.forEach((stats, testName) => {
    if (stats.passed > 0 && stats.failed > 0) {
      const passRate = stats.passed / runs;
      flakyTests.push({
        name: testName,
        passRate,
        runs,
        flakiness: 1 - Math.abs(passRate - 0.5) * 2 // 0-1 scale
      });
    }
  });

  return flakyTests.sort((a, b) => b.flakiness - a.flakiness);
}

// Run detection
const flaky = await detectFlakyTests(10);
flaky.forEach(test => {
  console.log(`❌ ${test.name} - ${(test.passRate * 100).toFixed(0)}% pass rate`);
});
```

---

### Strategy 3: Quarantine Flaky Tests

**Best Practice (2024)**: Move flaky tests to separate non-blocking run

```typescript
// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'stable',
      testMatch: ['<rootDir>/src/**/*.test.ts'],
      testPathIgnorePatterns: ['<rootDir>/src/**/*.flaky.test.ts']
    },
    {
      displayName: 'quarantine',
      testMatch: ['<rootDir>/src/**/*.flaky.test.ts'],
      // Don't fail CI if quarantine tests fail
      testResultsProcessor: './scripts/quarantine-processor.js'
    }
  ]
};
```

**Benefits**:
- Main CI pipeline stays green (stable tests only)
- Flaky tests still run (can be investigated)
- Prevents desensitization to red builds

---

## Fixing Flaky Tests (4-Step Approach)

### Step 1: Isolate (Remove Dependencies)

```typescript
// Before: Depends on external API
it('fetches and displays user', async () => {
  const user = await fetchUserFromAPI(123);
  render(<UserProfile user={user} />);
  expect(screen.getByText(user.name)).toBeInTheDocument();
});

// After: Mock API dependency
it('fetches and displays user', async () => {
  const mockUser = { id: 123, name: 'Alice' };
  vi.mocked(fetchUserFromAPI).mockResolvedValue(mockUser);

  const user = await fetchUserFromAPI(123);
  render(<UserProfile user={user} />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

---

### Step 2: Eliminate (Remove Timing Issues)

```typescript
// Before: Hardcoded sleep
it('shows success message', async () => {
  await saveData();
  await new Promise(resolve => setTimeout(resolve, 500));
  expect(screen.getByText('Saved')).toBeInTheDocument();
});

// After: Wait for condition
it('shows success message', async () => {
  await saveData();
  await waitFor(() => {
    expect(screen.getByText('Saved')).toBeInTheDocument();
  }, { timeout: 3000 });
});
```

---

### Step 3: Strengthen (Add Explicit Waits)

```typescript
// Before: Implicit wait (race condition)
it('form submission works', async () => {
  render(<Form />);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByText('Success')).toBeInTheDocument(); // Fails if async
});

// After: Explicit wait
it('form submission works', async () => {
  render(<Form />);
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  }, { timeout: 5000 });
});
```

---

### Step 4: Simplify (Reduce Complexity)

```typescript
// Before: Complex test with multiple async operations
it('complete user flow', async () => {
  await login();
  await navigateToDashboard();
  await loadData();
  await clickButton();
  await waitForAnimation();
  expect(screen.getByText('Done')).toBeInTheDocument();
  // Too many moving parts, hard to debug flakiness
});

// After: Split into smaller, focused tests
it('user can login', async () => {
  await login();
  expect(isLoggedIn()).toBe(true);
});

it('dashboard loads data', async () => {
  await setupLoggedInUser();
  await navigateToDashboard();
  await waitFor(() => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

---

## Framework-Specific Patterns

### React Testing Library (waitFor)

```typescript
import { render, screen, waitFor } from '@testing-library/react';

it('loads and displays data', async () => {
  render(<DataComponent />);

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  }, {
    timeout: 3000,      // Max 3 seconds
    interval: 100,      // Check every 100ms
    onTimeout: (error) => {
      console.error('Data did not load:', error);
    }
  });
});
```

---

### Vitest (Time Mocking)

```typescript
import { vi } from 'vitest';

it('shows current date', () => {
  // Mock system time
  const mockDate = new Date('2025-11-17T10:00:00Z');
  vi.setSystemTime(mockDate);

  const date = getCurrentDate();
  expect(date).toBe('2025-11-17');

  // Restore real time
  vi.useRealTimers();
});
```

---

### Pytest (Fixtures for Isolation)

```python
import pytest

@pytest.fixture
def isolated_user():
    """Each test gets a fresh user (no shared state)"""
    user = User(name='Alice', email='alice@example.com')
    yield user
    # Cleanup after test
    user.delete()

def test_user_creation(isolated_user):
    assert isolated_user.name == 'Alice'

def test_user_update(isolated_user):
    isolated_user.update(name='Alice Updated')
    assert isolated_user.name == 'Alice Updated'
```

---

### Go (Table-Driven Tests with t.Parallel)

```go
func TestValidation(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected bool
    }{
        {"valid email", "test@example.com", true},
        {"invalid email", "invalid", false},
    }

    for _, tt := range tests {
        tt := tt // Capture range variable
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel() // Run tests in parallel (isolates state)
            result := validateEmail(tt.input)
            if result != tt.expected {
                t.Errorf("got %v, want %v", result, tt.expected)
            }
        })
    }
}
```

---

## Continuous Monitoring (2024 Tools)

### CircleCI Test Insights

```yaml
# .circleci/config.yml
version: 2.1

orbs:
  test-insights: circleci/test-insights@1.0

jobs:
  test:
    steps:
      - checkout
      - run: npm test
      - test-insights/upload-results:
          path: test-results
          # Automatically detects flaky tests
```

**Features**:
- Tracks 100 most recent test runs
- Flags non-deterministic tests
- Shows flakiness trends over time

---

### Datadog Test Visibility

```typescript
// jest.config.js
module.exports = {
  reporters: [
    'default',
    ['datadog-ci-jest-reporter', {
      service: 'my-app',
      env: 'ci'
    }]
  ]
};
```

**Features**:
- Flakiness score per test
- Root cause analysis (timing, dependencies)
- Alerts when new flaky tests introduced

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Detection Rate** | 100% | Run 10-50 times, all flaky tests identified |
| **False Positives** | <5% | Quarantined tests that are actually stable |
| **Auto-Fix Rate** | >80% | % of flaky tests fixed by applying patterns |
| **Time to Fix** | <1 hour | Average time from detection to fix |

---

## Quick Reference

**Detection**: Run 10-50 times, track pass/fail rate
**Quarantine**: Separate flaky tests from main pipeline
**Fix Patterns**:
1. Isolate: Mock dependencies
2. Eliminate: Remove hardcoded sleeps
3. Strengthen: Add explicit waits
4. Simplify: Split complex tests

**Tools**:
- CircleCI Test Insights
- Datadog Test Visibility
- Semaphore Flaky Tests Dashboard
- Custom detection scripts

**Common Causes**:
- Race conditions (async/await)
- Timing dependencies (setTimeout)
- Shared state (global variables)
- Random data (Math.random, Date.now)
- External dependencies (API, database)
- Test order dependencies

---

**Version**: 1.0.0
**Target**: 100% detection, 80%+ auto-fix
**Based on**: 2024 industry tools, expert best practices
