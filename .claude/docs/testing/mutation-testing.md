# Mutation Testing - Verify Root Functionality

**Goal**: Ensure tests verify root functionality, not superficial checks.

**Target**: 80%+ mutation score (quality > coverage)

**Golden Rule**: If mutating code doesn't fail tests, tests are superficial.

**Based on**: Meta 2025 research, Martin Fowler recommendations, expert consensus

---

## What is Mutation Testing?

**Mutation testing = Testing your tests**

1. **Mutate code** (introduce bugs artificially)
2. **Run tests** against mutated code
3. **Tests should FAIL** (detect the bug)
4. **If tests still pass** → Tests are superficial (not verifying root functionality)

---

## Example: Why Mutation Testing Matters

### Superficial Test (Coverage = 100%, Quality = 0%)

```typescript
// Function to test
function validateEmail(email: string): boolean {
  if (!email.includes('@')) return false;
  if (email.length < 5) return false;
  if (!email.includes('.')) return false;
  return true;
}

// ❌ SUPERFICIAL TEST (Bad)
it('validates email', () => {
  const result = validateEmail('test@example.com');
  expect(result).toBeTruthy(); // Just checks SOMETHING returned
});

// Test coverage: 100% ✅
// Mutation score: 10% ❌
```

**Why superficial?**

```typescript
// Mutant 1: Always return true
function validateEmail(email: string): boolean {
  return true; // MUTATED
}
// ❌ Test still passes! (expects truthy, gets true)

// Mutant 2: Remove @ check
function validateEmail(email: string): boolean {
  // if (!email.includes('@')) return false; // REMOVED
  if (email.length < 5) return false;
  if (!email.includes('.')) return false;
  return true;
}
// ❌ Test still passes! (test@example.com has . and length)

// Mutant 3: Change < to <=
function validateEmail(email: string): boolean {
  if (!email.includes('@')) return false;
  if (email.length <= 5) return false; // MUTATED
  if (!email.includes('.')) return false;
  return true;
}
// ❌ Test still passes! (test@example.com has length > 5)
```

**Result**: 9 mutants generated, 1 killed (11% mutation score) ❌

---

### Root Functionality Test (Coverage = 100%, Quality = 90%)

```typescript
// ✅ ROOT FUNCTIONALITY (Good)
it('validates email format strictly', () => {
  // Valid case
  expect(validateEmail('test@example.com')).toBe(true);

  // Invalid: No @
  expect(validateEmail('invalid')).toBe(false);

  // Invalid: No domain
  expect(validateEmail('test@')).toBe(false);

  // Invalid: No username
  expect(validateEmail('@example.com')).toBe(false);

  // Invalid: Too short
  expect(validateEmail('t@e.c')).toBe(false);

  // Invalid: No dot in domain
  expect(validateEmail('test@example')).toBe(false);
});

// Test coverage: 100% ✅
// Mutation score: 90% ✅
```

**Why root functionality?**

```typescript
// Mutant 1: Always return true
function validateEmail(email: string): boolean {
  return true; // MUTATED
}
// ✅ Test FAILS! (expects false for 'invalid', gets true) - KILLED

// Mutant 2: Remove @ check
function validateEmail(email: string): boolean {
  // if (!email.includes('@')) return false; // REMOVED
  if (email.length < 5) return false;
  if (!email.includes('.')) return false;
  return true;
}
// ✅ Test FAILS! (expects false for 'invalid', gets true) - KILLED

// Mutant 3: Change < to <=
function validateEmail(email: string): boolean {
  if (!email.includes('@')) return false;
  if (email.length <= 5) return false; // MUTATED
  if (!email.includes('.')) return false;
  return true;
}
// ✅ Test FAILS! (expects true for 't@e.c' length=5, gets false) - KILLED
```

**Result**: 9 mutants generated, 8 killed (89% mutation score) ✅

---

## Mutation Operators (Common Mutations)

### 1. Arithmetic Operators

```typescript
// Original
const total = price + tax;

// Mutants
const total = price - tax;   // + → -
const total = price * tax;   // + → *
const total = price / tax;   // + → /
```

---

### 2. Relational Operators

```typescript
// Original
if (age >= 18) { /* ... */ }

// Mutants
if (age > 18) { /* ... */ }   // >= → >
if (age <= 18) { /* ... */ }  // >= → <=
if (age < 18) { /* ... */ }   // >= → <
if (age == 18) { /* ... */ }  // >= → ==
```

---

### 3. Logical Operators

```typescript
// Original
if (isLoggedIn && hasPermission) { /* ... */ }

// Mutants
if (isLoggedIn || hasPermission) { /* ... */ }  // && → ||
if (!isLoggedIn && hasPermission) { /* ... */ } // Add negation
if (isLoggedIn && !hasPermission) { /* ... */ } // Add negation
```

---

### 4. Return Values

```typescript
// Original
return true;

// Mutants
return false;  // Negate boolean
return null;   // Return null
return;        // Return undefined
```

---

### 5. Conditional Boundaries

```typescript
// Original
if (count > 0) { /* ... */ }

// Mutants
if (count >= 0) { /* ... */ }  // > → >=
if (count < 0) { /* ... */ }   // > → <
if (count == 0) { /* ... */ }  // > → ==
if (true) { /* ... */ }        // Remove condition
if (false) { /* ... */ }       // Negate condition
```

---

## Tools for Mutation Testing

### JavaScript/TypeScript

**Stryker Mutator** (Most popular)
```bash
npm install --save-dev @stryker-mutator/core

# Run mutation testing
npx stryker run
```

**Configuration** (stryker.conf.json):
```json
{
  "mutate": ["src/**/*.ts"],
  "testRunner": "vitest",
  "coverageAnalysis": "perTest",
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 60
  },
  "mutator": {
    "plugins": ["@stryker-mutator/typescript-checker"]
  }
}
```

---

### Python

**mutmut** (Popular)
```bash
pip install mutmut

# Run mutation testing
mutmut run
```

---

### Go

**go-mutesting**
```bash
go get -u github.com/zimmski/go-mutesting

# Run mutation testing
go-mutesting ./...
```

---

## Practical Strategy: Budget-Based Mutation Testing

**Problem**: Mutation testing is SLOW (can take hours for large codebases)

**Solution**: Target critical modules only, 5-minute budget (Meta recommendation)

### Configuration

```typescript
const mutationConfig = {
  // Only test critical modules
  targetModules: [
    'src/auth/**/*.ts',      // Authentication (security-critical)
    'src/payment/**/*.ts',   // Payment processing (money)
    'src/security/**/*.ts',  // Security utilities
    'src/validation/**/*.ts' // Input validation
  ],

  // Time budget: 5 minutes
  budget: 300000, // 5 min in milliseconds

  // Sample 20% of mutants (faster, still effective)
  sampleRate: 0.20,

  // Threshold: 80% mutation score
  threshold: 0.80
};
```

**Why this works**:
- 80/20 rule: 20% of code causes 80% of bugs
- Critical modules (auth, payment) need highest quality
- 5 minutes is acceptable in CI/CD pipeline
- 20% sampling still catches most weak tests

---

## Quality Gates in CI/CD

### GitHub Actions Example

```yaml
name: Quality Gates

on: [pull_request]

jobs:
  test-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Run mutation testing (critical modules only)
        run: npm run test:mutation

      - name: Check quality gates
        run: node scripts/check-quality-gates.js
```

### Quality Gate Script

```typescript
// scripts/check-quality-gates.js
import { readCoverageReport, readMutationReport } from './utils';

async function checkQualityGates() {
  const coverage = await readCoverageReport();
  const mutation = await readMutationReport();

  const gates = {
    coverageMin: 80,   // Minimum 80% code coverage
    mutationMin: 80,   // Minimum 80% mutation score
    priority: 'mutation' // Block if mutation fails, even if coverage passes
  };

  let failed = false;

  // Check coverage
  if (coverage.percentage < gates.coverageMin) {
    console.error(`❌ Coverage: ${coverage.percentage}% (threshold: ${gates.coverageMin}%)`);
    failed = true;
  } else {
    console.log(`✅ Coverage: ${coverage.percentage}% (threshold: ${gates.coverageMin}%)`);
  }

  // Check mutation score
  if (mutation.score < gates.mutationMin) {
    console.error(`❌ Mutation Score: ${mutation.score}% (threshold: ${gates.mutationMin}%)`);
    console.error(`\nWeak tests detected in:`);
    mutation.weakTests.forEach(test => {
      console.error(`  - ${test.file}:${test.line} - ${test.reason}`);
    });
    failed = true;
  } else {
    console.log(`✅ Mutation Score: ${mutation.score}% (threshold: ${gates.mutationMin}%)`);
  }

  if (failed) {
    console.error('\n❌ Quality gates FAILED. Fix tests before merging.');
    process.exit(1);
  } else {
    console.log('\n✅ All quality gates PASSED.');
    process.exit(0);
  }
}

checkQualityGates();
```

---

## Improving Mutation Score

### Pattern 1: Add Negative Test Cases

```typescript
// Initial test (mutation score: 40%)
it('calculates total price', () => {
  const total = calculateTotal([10, 20, 30]);
  expect(total).toBe(60);
});

// Improved test (mutation score: 85%)
it('calculates total price for various inputs', () => {
  // Happy path
  expect(calculateTotal([10, 20, 30])).toBe(60);

  // Edge case: Empty array
  expect(calculateTotal([])).toBe(0);

  // Edge case: Single item
  expect(calculateTotal([42])).toBe(42);

  // Edge case: Negative numbers
  expect(calculateTotal([10, -5, 15])).toBe(20);

  // Edge case: Decimals
  expect(calculateTotal([10.5, 20.3])).toBeCloseTo(30.8, 2);
});
```

---

### Pattern 2: Test Boundary Conditions

```typescript
// Initial test (mutation score: 30%)
it('validates age range', () => {
  expect(isValidAge(25)).toBe(true);
});

// Improved test (mutation score: 90%)
it('validates age range strictly', () => {
  // Valid ages
  expect(isValidAge(0)).toBe(true);   // Boundary: min
  expect(isValidAge(18)).toBe(true);  // Common case
  expect(isValidAge(150)).toBe(true); // Boundary: max

  // Invalid ages
  expect(isValidAge(-1)).toBe(false);  // Below min
  expect(isValidAge(151)).toBe(false); // Above max
  expect(isValidAge(NaN)).toBe(false); // Invalid type
});
```

---

### Pattern 3: Test All Logical Branches

```typescript
// Function with logical branches
function canAccessResource(user: User, resource: Resource): boolean {
  if (!user.isAuthenticated) return false;
  if (!user.hasPermission(resource.id)) return false;
  if (resource.isDeleted) return false;
  return true;
}

// Initial test (mutation score: 40%)
it('allows access for authenticated user', () => {
  const user = { isAuthenticated: true, hasPermission: () => true };
  const resource = { id: 1, isDeleted: false };
  expect(canAccessResource(user, resource)).toBe(true);
});

// Improved test (mutation score: 95%)
it('checks all access conditions', () => {
  const validUser = { isAuthenticated: true, hasPermission: () => true };
  const validResource = { id: 1, isDeleted: false };

  // All conditions met: allow
  expect(canAccessResource(validUser, validResource)).toBe(true);

  // Not authenticated: deny
  const unauthUser = { ...validUser, isAuthenticated: false };
  expect(canAccessResource(unauthUser, validResource)).toBe(false);

  // No permission: deny
  const noPermUser = { ...validUser, hasPermission: () => false };
  expect(canAccessResource(noPermUser, validResource)).toBe(false);

  // Resource deleted: deny
  const deletedResource = { ...validResource, isDeleted: true };
  expect(canAccessResource(validUser, deletedResource)).toBe(false);
});
```

---

## Success Metrics (Meta Research 2025)

**Meta's Automated Compliance Hardening (ACH) tool results:**
- 73% of LLM-generated tests accepted by engineers
- Mutation testing now scalable with LLM assistance
- "Most powerful form of software testing"

**Industry benchmarks**:
- Mutation score >80% = High-quality tests
- Mutation score 60-80% = Adequate tests
- Mutation score <60% = Weak tests (superficial)

---

## Quick Reference

**Golden Rule**: Tests must kill mutants (detect bugs)
**Priority**: Mutation score >80% > Code coverage >80%
**Budget**: 5 minutes, critical modules only
**Sampling**: 20% of mutants (faster, effective)

**Tools**:
- JavaScript/TypeScript: Stryker Mutator
- Python: mutmut
- Go: go-mutesting

**Improvement Patterns**:
1. Add negative test cases
2. Test boundary conditions
3. Test all logical branches

---

**Version**: 1.0.0
**Target**: 80%+ mutation score
**Based on**: Meta 2025, Martin Fowler, expert consensus
