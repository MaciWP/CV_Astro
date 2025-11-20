# Safe Refactoring - Behavior Preservation

**Goal**: Apply refactorings that preserve behavior (tests pass before/after).

**Target**: 99%+ refactorings preserve behavior

**Based on**: IntelliJ IDEA (safe refactoring standard), Martin Fowler principles

---

## Core Safety Rule

```
1. Run tests BEFORE refactoring
2. Apply refactoring
3. Run tests AFTER refactoring
4. Tests must pass (same count, same results)
5. If tests fail → ROLLBACK immediately
```

**Never refactor without tests** - Too risky for production code.

---

## Safe vs Risky Refactorings

### Safe Refactorings (Auto-Apply OK)

```typescript
const SAFE_REFACTORINGS = [
  'rename-variable',      // Local scope only
  'rename-function',      // If tests exist
  'extract-const',        // Pure values
  'inline-temp',          // Remove unnecessary variable
  'replace-temp-with-query' // If pure function
];

function isSafeToAutoApply(refactoring: Refactoring): boolean {
  return SAFE_REFACTORINGS.includes(refactoring.type)
    && refactoring.hasTests
    && refactoring.typeCheckPasses;
}
```

---

### Risky Refactorings (Ask User First)

```typescript
const RISKY_REFACTORINGS = [
  'extract-class',        // Changes architecture
  'move-method',          // Changes relationships
  'change-signature',     // Breaks API
  'introduce-parameter',  // Modifies interface
  'remove-parameter'      // Modifies interface
];

function requiresUserConfirmation(refactoring: Refactoring): boolean {
  return RISKY_REFACTORINGS.includes(refactoring.type)
    || refactoring.affectsMultipleFiles
    || !refactoring.hasTests;
}
```

---

## 1. Extract Method (Most Common)

### Pattern (IntelliJ IDEA)

```typescript
async function refactorExtractMethod(
  file: string,
  startLine: number,
  endLine: number,
  newMethodName: string
): Promise<RefactorResult> {
  // Step 1: Run tests BEFORE
  const testsBefore = await runTests();
  if (!testsBefore.allPassed) {
    throw new Error('Tests must pass before refactoring');
  }

  // Step 2: Analyze code to extract
  const codeBlock = await getLines(file, startLine, endLine);
  const analysis = analyzeCodeBlock(codeBlock);

  // Step 3: Detect parameters and return value
  const parameters = analysis.externalVariables; // Variables used but not defined
  const returnValue = analysis.modifiedVariables; // Variables modified inside

  // Step 4: Generate new method
  const newMethod = generateMethod({
    name: newMethodName,
    parameters,
    returnValue,
    body: codeBlock
  });

  // Step 5: Replace original code with method call
  const methodCall = generateMethodCall(newMethodName, parameters);

  // Step 6: Apply refactoring
  await replaceLines(file, startLine, endLine, methodCall);
  await insertMethod(file, newMethod);

  // Step 7: Run tests AFTER
  const testsAfter = await runTests();

  // Step 8: Verify
  if (testsAfter.passed !== testsBefore.passed) {
    await rollback();
    throw new Error('Refactoring broke tests - rolled back');
  }

  return {
    success: true,
    methodName: newMethodName,
    linesReduced: (endLine - startLine + 1) - 1,
    complexityReduction: calculateComplexity(codeBlock) - 1
  };
}
```

---

### Example

#### BEFORE: Long method (60 lines, CC = 12)

```typescript
function processCheckout(cart: Cart): CheckoutResult {
  // Validation (15 lines)
  if (!cart) throw new Error('Cart required');
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cart must have items');
  }
  if (!cart.user || !cart.user.email) {
    throw new Error('User email required');
  }
  if (!cart.payment || !cart.payment.method) {
    throw new Error('Payment method required');
  }

  // Calculate total (20 lines)
  let subtotal = 0;
  for (const item of cart.items) {
    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for ${item.name}`);
    }
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.08;
  const shipping = cart.items.length > 5 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  // Apply discounts (15 lines)
  let discount = 0;
  if (cart.user.isPremium) {
    discount = total * 0.10;
  }
  if (cart.coupon) {
    const couponDiscount = validateAndApplyCoupon(cart.coupon, subtotal);
    discount += couponDiscount;
  }
  const finalTotal = total - discount;

  // Process payment (10 lines)
  const payment = await processPayment({
    amount: finalTotal,
    method: cart.payment.method,
    userId: cart.user.id
  });

  return { orderId: generateId(), total: finalTotal, payment };
}
```

**Problems**:
- 60 lines (threshold: 50)
- CC = 12 (threshold: 10)
- Hard to test individual parts

---

#### AFTER: Extracted methods (8 lines, CC = 3)

```typescript
function processCheckout(cart: Cart): CheckoutResult {
  validateCart(cart);                          // Extracted
  const total = calculateTotal(cart);          // Extracted
  const finalTotal = applyDiscounts(cart, total); // Extracted
  const payment = await processPayment(cart.user.id, cart.payment.method, finalTotal);

  return { orderId: generateId(), total: finalTotal, payment };
}

// Extracted validation
function validateCart(cart: Cart): void {
  if (!cart) throw new Error('Cart required');
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cart must have items');
  }
  if (!cart.user || !cart.user.email) {
    throw new Error('User email required');
  }
  if (!cart.payment || !cart.payment.method) {
    throw new Error('Payment method required');
  }
}

// Extracted calculation
function calculateTotal(cart: Cart): number {
  let subtotal = 0;
  for (const item of cart.items) {
    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for ${item.name}`);
    }
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.08;
  const shipping = cart.items.length > 5 ? 0 : 9.99;
  return subtotal + tax + shipping;
}

// Extracted discounts
function applyDiscounts(cart: Cart, total: number): number {
  let discount = 0;
  if (cart.user.isPremium) {
    discount = total * 0.10;
  }
  if (cart.coupon) {
    discount += validateAndApplyCoupon(cart.coupon, total);
  }
  return total - discount;
}
```

**Benefits**:
- Main function: 8 lines (down from 60)
- CC = 3 (down from 12)
- Each function testable independently
- Clear single responsibility

---

## 2. Rename (Safe with Conflict Detection)

### Pattern (IntelliJ IDEA)

```typescript
async function refactorRename(
  file: string,
  oldName: string,
  newName: string
): Promise<RefactorResult> {
  // Step 1: Find all usages
  const usages = await findAllUsages(oldName, file);

  // Step 2: Detect conflicts
  const conflicts = await detectNameConflicts(newName, usages);
  if (conflicts.length > 0) {
    throw new Error(`Name '${newName}' conflicts with existing: ${conflicts.join(', ')}`);
  }

  // Step 3: Run tests BEFORE
  const testsBefore = await runTests();

  // Step 4: Rename all occurrences
  for (const usage of usages) {
    await replaceText(usage.file, usage.line, oldName, newName);
  }

  // Step 5: Run tests AFTER
  const testsAfter = await runTests();

  // Step 6: Verify
  if (testsAfter.passed !== testsBefore.passed) {
    await rollback();
    throw new Error('Rename broke tests - rolled back');
  }

  return {
    success: true,
    oldName,
    newName,
    occurrencesRenamed: usages.length
  };
}
```

---

## 3. Inline Function (Safe if Pure)

### When to Inline

```typescript
// ❌ DON'T inline if:
// 1. Function is reused (> 1 call site)
// 2. Function name provides clarity
// 3. Function has side effects

// ✅ DO inline if:
// 1. Function called once
// 2. Function body is clearer than name
// 3. Function is trivial wrapper

// BEFORE: Unnecessary wrapper
function getTax(amount: number): number {
  return amount * 0.08;
}

const tax = getTax(subtotal);

// AFTER: Inlined
const tax = subtotal * 0.08;
```

---

## 4. Extract Constant (Always Safe)

### Pattern

```typescript
// BEFORE: Magic numbers
if (user.age >= 18 && user.age <= 65) {
  // ...
}
const discount = total * 0.15;

// AFTER: Named constants
const MIN_ADULT_AGE = 18;
const MAX_WORKING_AGE = 65;
const PREMIUM_DISCOUNT_RATE = 0.15;

if (user.age >= MIN_ADULT_AGE && user.age <= MAX_WORKING_AGE) {
  // ...
}
const discount = total * PREMIUM_DISCOUNT_RATE;
```

**Benefits**:
- Self-documenting
- Easy to change (one place)
- Always safe (no behavior change)

---

## 5. Remove Duplication (DRY Principle)

### Pattern

```typescript
async function refactorRemoveDuplication(
  duplicates: DuplicateBlock[]
): Promise<RefactorResult> {
  // Step 1: Run tests BEFORE
  const testsBefore = await runTests();

  // Step 2: Extract shared function
  const sharedFunction = generateSharedFunction(duplicates);
  const targetFile = findBestLocation(duplicates);
  await insertFunction(targetFile, sharedFunction);

  // Step 3: Replace all duplicates with function call
  for (const duplicate of duplicates) {
    const functionCall = generateFunctionCall(sharedFunction.name);
    await replaceLines(
      duplicate.file,
      duplicate.startLine,
      duplicate.endLine,
      functionCall
    );
    await addImport(duplicate.file, sharedFunction.name, targetFile);
  }

  // Step 4: Run tests AFTER
  const testsAfter = await runTests();

  // Step 5: Verify
  if (testsAfter.passed !== testsBefore.passed) {
    await rollback();
    throw new Error('Deduplication broke tests - rolled back');
  }

  return {
    success: true,
    functionName: sharedFunction.name,
    duplicatesRemoved: duplicates.length,
    linesReduced: calculateLinesReduced(duplicates)
  };
}
```

---

## Verification Checklist

**Before refactoring**:
- [ ] All tests pass
- [ ] Type checker passes (TypeScript, mypy, etc.)
- [ ] Linter passes
- [ ] Code compiles/runs

**After refactoring**:
- [ ] All tests still pass (same count)
- [ ] Type checker still passes
- [ ] Linter still passes
- [ ] Code still compiles/runs
- [ ] Behavior unchanged (manual verification if needed)

**If ANY fail**: ROLLBACK immediately

---

## Tools Integration

### TypeScript

```typescript
// Always run type check
const typeCheck = await runTypeChecker();
if (typeCheck.errors.length > 0) {
  console.error('Type errors after refactoring:');
  typeCheck.errors.forEach(err => console.error(err));
  await rollback();
}
```

### Tests

```typescript
// Compare test results
function verifyTestResults(before: TestResult, after: TestResult): boolean {
  return before.passed === after.passed
    && before.failed === after.failed
    && before.total === after.total;
}
```

---

## Quick Reference

**Safe Refactorings** (low risk):
- Rename variable/function (with tests)
- Extract constant
- Inline temp variable
- Extract method (small, pure)

**Risky Refactorings** (high risk):
- Extract class
- Move method
- Change signature
- Remove parameter

**Safety Protocol**:
1. Tests pass before → Apply → Tests pass after
2. If tests fail → Rollback immediately
3. Never commit broken code

---

**Version**: 1.0.0
**Based on**: IntelliJ IDEA safe refactoring, Martin Fowler
**Target**: 99%+ success rate (behavior preservation)
