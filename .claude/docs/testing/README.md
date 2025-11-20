# Testing Strategy - Overview

**Goal**: Enable Claude Code to generate high-quality tests that verify root functionality.

**Target**: 90%+ test pass rate on first generation, 80%+ mutation score

---

## 🏆 GOLDEN RULE (CRITICAL)

**Tests must verify ROOT FUNCTIONALITY, not superficial checks to pass.**

### What This Means

```typescript
// ❌ SUPERFICIAL TEST (Bad - Fake pass)
it('validates email', () => {
  const result = validateEmail('test@example.com');
  expect(result).toBeTruthy(); // Checks SOMETHING returned, not WHAT
  // Problem: If code is "return true", test still passes
});

// ✅ ROOT FUNCTIONALITY (Good - Real verification)
it('validates email format strictly', () => {
  // Valid case
  expect(validateEmail('test@example.com')).toBe(true);

  // Invalid cases (verify actual validation logic)
  expect(validateEmail('invalid')).toBe(false);          // No @
  expect(validateEmail('test@')).toBe(false);            // No domain
  expect(validateEmail('@example.com')).toBe(false);     // No user
  expect(validateEmail('test@a')).toBe(false);           // Domain too short
});
```

**Why**: Mutation testing will detect superficial tests. If you mutate `validateEmail` to `return true`, the superficial test passes (false positive), but the root functionality test fails (correct detection).

---

## 📚 Core Techniques (Expert-Validated)

### 1. Test Generation (SPEC Scenario 1)
**Purpose**: Auto-generate tests from Given-When-Then specs
**Success**: 90%+ tests pass on first run
**Docs**: `test-generation.md`

### 2. Mutation Testing (SPEC Scenario 2)
**Purpose**: Verify tests check root functionality, not superficial
**Success**: 80%+ mutation score (quality > coverage)
**Docs**: `mutation-testing.md`

### 3. Flaky Test Detection (SPEC Scenario 3)
**Purpose**: Identify unreliable tests (pass/fail randomly)
**Success**: 100% flaky tests detected
**Docs**: `flaky-tests.md`

### 4. Quality Gates (SPEC Scenario 5)
**Purpose**: Enforce coverage + mutation thresholds in CI/CD
**Success**: 100% violations blocked
**Docs**: Inline examples in mutation-testing.md

---

## ❌ Excluded from Implementation (Low Priority)

**Property-based testing** (SPEC Scenario 6):
- Useful for mathematical/algorithm functions
- Less common in typical web apps
- Not mainstream in 2024-2025 expert recommendations

**Test maintenance/redundancy** (SPEC Scenario 7):
- Nice-to-have, not critical
- Can be addressed later

**Coverage gap visualization** (SPEC Scenario 4):
- Already covered by existing tools (Jest, Vitest, Pytest)
- Redundant with standard coverage reports

---

## 🎯 When to Use This Module

**Load full documentation when:**
- Generating tests for new features
- User asks for "comprehensive tests"
- Security-critical code (auth, payment, data validation)
- Test quality is low (mutation score <80%)

**Use command**:
```
/load-testing-strategy
```

---

## Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| **Test pass rate (first run)** | >90% | Tests work immediately |
| **Mutation score** | >80% | Tests verify root functionality |
| **Flaky test detection** | 100% | Identify all unreliable tests |
| **Quality gate enforcement** | 100% | Block low-quality code |

---

## Quick Reference

**Golden Rule**: Verify root functionality, not superficial
**Priority**: Mutation score >80% > Code coverage >80%
**Critical modules**: auth/*, payment/*, security/*
**Flaky tests**: Run 10-50 times to detect

---

**Version**: 1.0.0 (Opción B - Core Recommendations)
**Based on**: Expert consensus 2024-2025 (Meta, Martin Fowler, industry tools)
**Aligned with**: SPEC Scenarios 1, 2, 3, 5 (excluding 4, 6, 7)
