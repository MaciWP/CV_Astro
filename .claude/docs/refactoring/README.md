# Refactoring Patterns - Overview

**Goal**: Detect code smells and apply safe refactorings to improve code quality.

**Target**: 95%+ smell detection accuracy, 99%+ safe refactorings

**Based on**: Martin Fowler (foundational), SonarQube (gold standard), IntelliJ IDEA (safe refactoring)

---

## 🎯 Core Refactoring Principles

### 1. Continuous, Not One-Time

**Martin Fowler**:
> "Refactoring isn't a one-time project; it's a continuous process that becomes part of your development workflow."

**Apply**: Refactor as you code, not as separate cleanup phase.

---

### 2. Safety First (Behavior Preservation)

**IntelliJ IDEA standard**:
- Always run tests BEFORE refactoring
- Apply refactoring
- Run tests AFTER refactoring
- Tests must pass with same results

**Never refactor without tests** - Too risky.

---

### 3. Small Steps

**Kent Beck principle**:
- Make small, incremental changes
- Each change preserves behavior
- Easier to verify, easier to rollback

**Bad**: Refactor entire file at once (high risk)
**Good**: Refactor one method at a time (low risk)

---

## 📚 Core Techniques (Expert-Validated)

### 1. Detect Code Smells (SonarQube Standard)
**Purpose**: Identify quality issues automatically
**Metrics**: Complexity (CC > 10), Long methods (> 50 lines), Duplication (> 5%)
**Docs**: `code-smells.md`

### 2. Safe Refactoring (IntelliJ Pattern)
**Purpose**: Extract method, rename, inline safely
**Safety**: Tests pass before/after, type check passes
**Docs**: `safe-refactoring.md`

### 3. Remove Duplication (Martin Fowler Top Priority)
**Purpose**: DRY principle, extract shared functions
**Target**: <5% duplication in codebase
**Docs**: `code-smells.md` (duplication section)

### 4. Modernize Legacy Code (Common Real-World Need)
**Purpose**: var → const/let, callbacks → async/await, class → hooks
**Impact**: Better readability, fewer bugs
**Docs**: `legacy-modernization.md`

### 5. Quality Gates (CI/CD Best Practice)
**Purpose**: Block merge if quality degrades
**Thresholds**: Complexity +10 max, Duplication +1% max
**Docs**: `quality-gates.md`

---

## ❌ Excluded from Implementation (Low Priority)

**Design pattern detection** (SPEC Scenario 5):
- Detecting Strategy pattern opportunities is advanced
- Requires semantic analysis
- Not core refactoring need
- Can be added later

**Tracking over time** (SPEC Scenario 7):
- Requires persistent memory (module 09)
- Nice-to-have, not critical
- Metrics can be tracked externally (SonarQube)

---

## 🚨 Common Code Smells (Quick Reference)

### 1. High Cyclomatic Complexity
**Threshold**: CC > 10 (industry standard), CC > 15 (SonarQube critical)
```typescript
// ❌ BAD: CC = 12 (too many branches)
function processOrder(order) {
  if (!order) return;
  if (!order.items) return;
  if (!order.user) return;
  if (order.status === 'pending') { /* ... */ }
  else if (order.status === 'paid') { /* ... */ }
  else if (order.status === 'shipped') { /* ... */ }
  else if (order.status === 'delivered') { /* ... */ }
  // ... 8 more conditions
}

// ✅ GOOD: CC = 3 (extract validation, use strategy)
function processOrder(order) {
  validateOrder(order);
  const processor = orderProcessors[order.status];
  return processor.process(order);
}
```

---

### 2. Long Method
**Threshold**: > 50 lines (industry standard)
```typescript
// ❌ BAD: 150 lines
function processCheckout(cart) {
  // Validation (15 lines)
  // Calculate total (20 lines)
  // Apply discounts (15 lines)
  // Process payment (20 lines)
  // Send email (10 lines)
  // Update inventory (15 lines)
  // ... (55 more lines)
}

// ✅ GOOD: 8 lines (extract sub-functions)
function processCheckout(cart) {
  validateCart(cart);
  const total = calculateTotal(cart);
  const finalTotal = applyDiscounts(cart, total);
  const payment = await processPayment(finalTotal);
  await sendConfirmationEmail(cart, payment);
  await updateInventory(cart);
  return { payment, total: finalTotal };
}
```

---

### 3. Code Duplication
**Threshold**: > 5% of codebase (industry standard)
```typescript
// ❌ BAD: Duplicated validation (3 files)
// File 1: orders.ts
if (!user || !user.email) throw new Error('User email required');
if (!isValidEmail(user.email)) throw new Error('Invalid email');

// File 2: auth.ts
if (!user || !user.email) throw new Error('User email required');
if (!isValidEmail(user.email)) throw new Error('Invalid email');

// File 3: profile.ts
if (!user || !user.email) throw new Error('User email required');
if (!isValidEmail(user.email)) throw new Error('Invalid email');

// ✅ GOOD: Extract shared function
// utils/validation.ts
export function validateUserEmail(user: User): void {
  if (!user || !user.email) throw new Error('User email required');
  if (!isValidEmail(user.email)) throw new Error('Invalid email');
}

// All files: Import and use
import { validateUserEmail } from './utils/validation';
validateUserEmail(user);
```

---

### 4. Legacy Patterns
```typescript
// ❌ BAD: var, callbacks
var data = null;
fetchData(function(err, result) {
  if (err) console.error(err);
  else data = result;
});

// ✅ GOOD: const, async/await
const data = await fetchData();
```

---

## 🎯 When to Use This Module

**Load full documentation when:**
- Code review shows high complexity (CC > 10)
- Long methods detected (> 50 lines)
- Duplication found (> 5% of file)
- Modernizing legacy codebase
- Setting up quality gates in CI/CD

**Use command**:
```
/load-refactoring-patterns
```

---

## Success Metrics (Expert Standards)

| Metric | Threshold | Source |
|--------|-----------|--------|
| **Cyclomatic Complexity** | CC ≤ 10 | Industry standard (SonarQube: 15) |
| **Method Length** | ≤ 50 lines | Industry standard |
| **Code Duplication** | < 5% | Industry standard |
| **Refactoring Safety** | 99%+ tests pass | IntelliJ IDEA standard |

---

## Quick Reference

**Detection Thresholds**:
- Complexity: CC > 10 (high), CC > 15 (critical)
- Method length: > 50 lines (refactor), > 100 lines (critical)
- Duplication: > 5% (refactor), > 10% (critical)

**Safety Rules**:
1. Run tests BEFORE refactoring
2. Apply refactoring
3. Run tests AFTER refactoring
4. Tests must pass (same count, same results)

**Priority** (Martin Fowler):
1. Duplication (highest impact)
2. Complexity (bug-prone)
3. Long methods (hard to maintain)

---

**Version**: 1.0.0 (Opción B - Core Recommendations)
**Based on**: Martin Fowler, SonarQube (2024), IntelliJ IDEA
**Excludes**: Design pattern detection, tracking over time (low priority)
