---
description: Load comprehensive testing strategy patterns for high-quality test generation
---

# Load Testing Strategy

Load detailed testing documentation for generating high-quality tests that verify root functionality.

## Usage

```
/load-testing-strategy
```

---

## What This Command Does

Loads **comprehensive testing patterns** into context:

1. **README.md** (3.5 KB) - Overview, Golden Rule, quick reference
2. **test-generation.md** (11.8 KB) - Given-When-Then → test code patterns
3. **mutation-testing.md** (14.2 KB) - Verify root functionality, not superficial
4. **flaky-tests.md** (12.1 KB) - Detection and fixing unreliable tests

**Total**: ~42 KB of testing patterns and generation strategies

---

## When to Use

Load testing strategy when:

### Test Generation Tasks
- Generating tests for new features
- User asks for "comprehensive tests"
- TDD workflow (write tests before implementation)
- Converting specs to test code

### Test Quality Issues
- Test coverage high but mutation score low (<80%)
- Tests are superficial (just check something returned)
- Need to verify root functionality
- Security-critical code (auth, payment, validation)

### Flaky Test Problems
- Tests pass/fail randomly
- CI/CD builds unreliable
- Race conditions or timing issues
- Tests depend on external services

---

## What You'll Learn

### 🏆 Golden Rule (CRITICAL)

**Tests must verify ROOT FUNCTIONALITY, not superficial checks.**

```typescript
// ❌ SUPERFICIAL (Bad)
it('validates email', () => {
  expect(validateEmail('test@example.com')).toBeTruthy();
});

// ✅ ROOT FUNCTIONALITY (Good)
it('validates email strictly', () => {
  expect(validateEmail('test@example.com')).toBe(true);  // Valid
  expect(validateEmail('invalid')).toBe(false);          // No @
  expect(validateEmail('test@')).toBe(false);            // No domain
});
```

**Why**: Mutation testing detects superficial tests (if mutating code doesn't fail tests, tests are weak).

---

### 1. Test Generation (90%+ First-Run Pass Rate)

**Auto-generate from Given-When-Then specs**:

```
Given user is logged in
When user clicks logout
Then user is logged out
And session is destroyed
And user is redirected to login page
```

**Generates**:
- Happy path test (spec as-is)
- Edge cases (unauthenticated, invalid session)
- Error cases (API failure, network error)

**Success**: 90%+ tests pass on first run

---

### 2. Mutation Testing (80%+ Mutation Score)

**Test your tests** - Ensure they verify root functionality:

```typescript
// Mutation testing process:
1. Mutate code (introduce bugs): return true → return false
2. Run tests against mutated code
3. Tests should FAIL (detect the bug)
4. If tests PASS → Tests are superficial ❌
```

**Target**: 80%+ mutation score (% of mutants killed)

**Tools**:
- JavaScript/TypeScript: Stryker Mutator
- Python: mutmut
- Go: go-mutesting

**Budget**: 5 minutes, critical modules only (auth/*, payment/*, security/*)

---

### 3. Flaky Test Detection (100% Detection)

**Identify tests that pass/fail randomly**:

```typescript
// Detection: Run test 10-50 times
// If passes sometimes, fails sometimes → FLAKY

// Common causes:
- Race conditions (async/await)
- Timing dependencies (setTimeout)
- Shared state (global variables)
- Random data (Math.random, Date.now)
- External dependencies (API, database)
```

**Fix patterns**:
1. **Isolate**: Mock dependencies
2. **Eliminate**: Remove hardcoded sleeps
3. **Strengthen**: Add explicit waits (waitFor)
4. **Simplify**: Split complex tests

**Tools**: CircleCI, Datadog, Semaphore (all have flaky detection)

---

### 4. Quality Gates (CI/CD Enforcement)

```typescript
// Enforce thresholds in CI/CD:
const qualityGates = {
  coverageMin: 80,   // 80% code coverage
  mutationMin: 80,   // 80% mutation score
  priority: 'mutation' // Block if mutation fails
};

// Block merge if quality drops
```

---

## Execute Reads

This command will load all testing documentation:

```typescript
// 1. Read overview + golden rule
await Read({ file_path: '.claude/docs/testing/README.md' });

// 2. Read test generation patterns
await Read({ file_path: '.claude/docs/testing/test-generation.md' });

// 3. Read mutation testing (verify root functionality)
await Read({ file_path: '.claude/docs/testing/mutation-testing.md' });

// 4. Read flaky test detection + fixing
await Read({ file_path: '.claude/docs/testing/flaky-tests.md' });
```

---

## Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| **Test pass rate (first run)** | >90% | Generated tests work immediately |
| **Mutation score** | >80% | Tests verify root functionality |
| **Flaky test detection** | 100% | Identify all unreliable tests |
| **Auto-fix rate** | >80% | Most flaky tests fixable with patterns |

---

## Framework Support

**JavaScript/TypeScript**:
- Jest
- Vitest
- Mocha

**Python**:
- Pytest
- unittest

**Go**:
- go test
- testify

**All patterns adapt to any framework**

---

## Related Commands

- `/load-anti-hallucination` - Validation patterns
- `/load-context-management` - Token optimization
- `/load-security` - Vulnerability detection
- `/claude-docs` - Browse all .claude/ documentation

---

## Quick Start

**After loading, use these patterns:**

1. **Generate tests**: Convert Given-When-Then specs → test code
2. **Verify quality**: Run mutation testing (target >80% score)
3. **Fix flaky tests**: Run 10x, detect patterns, apply fixes
4. **Enforce gates**: Add coverage + mutation checks to CI/CD

---

**Version**: 1.0.0
**Module**: 18-TESTING-STRATEGY (Opción B - Core Recommendations)
**Documentation Size**: ~42 KB (4 files)
**Based on**: Expert consensus 2024-2025 (Meta, Martin Fowler, CircleCI, Datadog)
**Target**: 90%+ test pass rate, 80%+ mutation score
**Status**: Ready to load
