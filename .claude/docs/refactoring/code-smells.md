# Code Smell Detection - Patterns and Thresholds

**Goal**: Automatically detect quality issues using industry-standard thresholds.

**Based on**: SonarQube (gold standard 2024), Martin Fowler, Kent Beck

---

## Detection Strategy

### Priority-Based Detection

```typescript
interface CodeSmell {
  type: 'complexity' | 'long-method' | 'duplication' | 'large-class' | 'dead-code';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: { file: string; lines: [number, number] };
  refactoringCost: 'low' | 'medium' | 'high';
  priority: number; // (severity × impact) / cost
}

// Example prioritization
const prioritize = (smell: CodeSmell) => {
  const severityScore = { critical: 10, high: 7, medium: 5, low: 2 };
  const impactScore = smell.type === 'complexity' ? 10 : 5;
  const costScore = { low: 1, medium: 3, high: 5 };

  return (severityScore[smell.severity] * impactScore) / costScore[smell.refactoringCost];
};
```

---

## 1. Cyclomatic Complexity (CRITICAL)

### What It Measures

**Number of independent paths through code** (branches, loops, conditions).

```typescript
// Example: Calculate complexity
function calculateComplexity(code: string): number {
  let complexity = 1; // Base complexity

  // +1 for each decision point
  complexity += countMatches(code, /if\s*\(/g);
  complexity += countMatches(code, /else\s+if\s*\(/g);
  complexity += countMatches(code, /\?\s*.*\s*:/g); // Ternary
  complexity += countMatches(code, /for\s*\(/g);
  complexity += countMatches(code, /while\s*\(/g);
  complexity += countMatches(code, /case\s+/g);
  complexity += countMatches(code, /&&/g);
  complexity += countMatches(code, /\|\|/g);

  return complexity;
}
```

---

### Thresholds (Industry Standard)

| Complexity | Severity | Action | Source |
|-----------|----------|--------|--------|
| **1-10** | ✅ Good | No action needed | Industry standard |
| **11-15** | 🟡 Medium | Consider refactoring | SonarQube threshold |
| **16-25** | 🟠 High | Refactor recommended | Literature |
| **26+** | 🔴 Critical | Refactor immediately | SonarQube critical |

**SonarQube default**: Raises code smell at CC > 15

---

### Detection Pattern

```typescript
async function detectComplexity(file: string): Promise<CodeSmell[]> {
  const functions = await extractFunctions(file);
  const smells: CodeSmell[] = [];

  for (const func of functions) {
    const complexity = calculateComplexity(func.code);

    if (complexity > 10) {
      smells.push({
        type: 'complexity',
        severity: complexity > 25 ? 'critical' :
                  complexity > 15 ? 'high' : 'medium',
        location: { file, lines: [func.startLine, func.endLine] },
        refactoringCost: complexity > 20 ? 'high' : 'medium',
        priority: (complexity > 25 ? 10 : 7) * 10 / (complexity > 20 ? 5 : 3),
        details: {
          function: func.name,
          complexity,
          threshold: 10,
          suggestion: 'Extract methods, reduce nesting, use early returns'
        }
      });
    }
  }

  return smells;
}
```

---

### Examples

#### ❌ HIGH COMPLEXITY (CC = 18)

```typescript
function processOrder(order: Order): OrderResult {
  // +1 base
  if (!order) return null; // +1 (CC = 2)

  if (!order.items || order.items.length === 0) return null; // +1 (CC = 3)

  if (!order.user) return null; // +1 (CC = 4)

  if (order.status === 'pending') { // +1 (CC = 5)
    if (order.payment.method === 'credit-card') { // +1 (CC = 6)
      // Process credit card
    } else if (order.payment.method === 'paypal') { // +1 (CC = 7)
      // Process paypal
    } else { // No +1 (else doesn't add)
      throw new Error('Invalid payment method');
    }
  } else if (order.status === 'paid') { // +1 (CC = 8)
    if (order.shipping.method === 'express') { // +1 (CC = 9)
      // Calculate express shipping
    } else if (order.shipping.method === 'standard') { // +1 (CC = 10)
      // Calculate standard shipping
    }
  } else if (order.status === 'shipped') { // +1 (CC = 11)
    if (order.tracking && order.tracking.isActive) { // +2 (&&) (CC = 13)
      // Update tracking
    }
  } else if (order.status === 'delivered') { // +1 (CC = 14)
    if (order.user.isPremium || order.total > 100) { // +2 (||) (CC = 16)
      // Apply premium rewards
    }
  } else if (order.status === 'cancelled') { // +1 (CC = 17)
    // Process refund
  } else { // No +1
    throw new Error('Unknown status');
  }

  return result; // +1 (return path) (CC = 18)
}
```

**Detection**: CC = 18 > 15 → HIGH severity

---

#### ✅ LOW COMPLEXITY (CC = 6)

```typescript
// Refactored: Extract methods
function processOrder(order: Order): OrderResult {
  validateOrder(order); // CC = 3
  const processor = getOrderProcessor(order.status); // CC = 1
  return processor.process(order); // CC = 2
  // Total: CC = 6 ✅
}

function validateOrder(order: Order): void {
  if (!order) throw new Error('Order required'); // +1
  if (!order.items || order.items.length === 0) { // +2 (||)
    throw new Error('Order must have items');
  }
  // CC = 3
}

function getOrderProcessor(status: string): OrderProcessor {
  const processors = {
    'pending': new PendingProcessor(),
    'paid': new PaidProcessor(),
    'shipped': new ShippedProcessor(),
    'delivered': new DeliveredProcessor(),
    'cancelled': new CancelledProcessor()
  };

  return processors[status] || throw new Error('Unknown status');
  // CC = 1 (no branches with Strategy pattern)
}
```

---

## 2. Long Method

### Thresholds

| Lines | Severity | Action |
|-------|----------|--------|
| **1-50** | ✅ Good | No action |
| **51-100** | 🟡 Medium | Consider extracting |
| **101-150** | 🟠 High | Refactor recommended |
| **151+** | 🔴 Critical | Refactor immediately |

**Industry standard**: 50 lines max

---

### Detection Pattern

```typescript
async function detectLongMethods(file: string): Promise<CodeSmell[]> {
  const functions = await extractFunctions(file);
  const smells: CodeSmell[] = [];

  for (const func of functions) {
    const lines = func.endLine - func.startLine + 1;

    if (lines > 50) {
      smells.push({
        type: 'long-method',
        severity: lines > 150 ? 'critical' :
                  lines > 100 ? 'high' : 'medium',
        location: { file, lines: [func.startLine, func.endLine] },
        refactoringCost: 'medium',
        priority: (lines > 150 ? 10 : lines > 100 ? 7 : 5) * 5 / 3,
        details: {
          function: func.name,
          lines,
          threshold: 50,
          suggestion: 'Extract logical sections into sub-functions'
        }
      });
    }
  }

  return smells;
}
```

---

### Why Long Methods Are Bad

1. **Hard to understand**: Too much to keep in mind
2. **Difficult to test**: Many code paths
3. **Bug-prone**: Changes affect too much
4. **Not reusable**: Too specific

**Martin Fowler**: "Whenever I feel the need to comment something, I write a method instead."

---

## 3. Code Duplication (Top Priority - Fowler)

### Thresholds

| Duplication | Severity | Action |
|------------|----------|--------|
| **0-5%** | ✅ Good | No action |
| **6-10%** | 🟡 Medium | Consider extracting |
| **11-15%** | 🟠 High | Refactor recommended |
| **16%+** | 🔴 Critical | Refactor immediately |

**Industry standard**: < 5% duplication

---

### Detection Pattern

```typescript
async function detectDuplication(files: string[]): Promise<CodeSmell[]> {
  const codeBlocks = await extractCodeBlocks(files);
  const duplicates: Map<string, Location[]> = new Map();

  // Find duplicates (simplified - real tools use AST comparison)
  for (let i = 0; i < codeBlocks.length; i++) {
    for (let j = i + 1; j < codeBlocks.length; j++) {
      const similarity = calculateSimilarity(codeBlocks[i], codeBlocks[j]);

      if (similarity > 0.85) { // 85% similar = duplicate
        const key = normalizeCode(codeBlocks[i].code);
        if (!duplicates.has(key)) {
          duplicates.set(key, []);
        }
        duplicates.get(key).push(codeBlocks[i].location, codeBlocks[j].location);
      }
    }
  }

  const smells: CodeSmell[] = [];

  for (const [code, locations] of duplicates) {
    if (locations.length >= 2) {
      const duplicatedLines = code.split('\n').length * (locations.length - 1);
      const totalLines = await countTotalLines(files);
      const percentage = (duplicatedLines / totalLines) * 100;

      smells.push({
        type: 'duplication',
        severity: percentage > 15 ? 'critical' :
                  percentage > 10 ? 'high' : 'medium',
        location: locations[0], // First occurrence
        refactoringCost: 'low', // Usually easy to extract
        priority: (percentage > 15 ? 10 : 7) * 5 / 1, // High priority, low cost
        details: {
          occurrences: locations.length,
          duplicatedLines,
          percentage: `${percentage.toFixed(1)}%`,
          locations,
          suggestion: 'Extract shared function'
        }
      });
    }
  }

  return smells;
}
```

---

### Example

#### ❌ DUPLICATION (3 occurrences)

```typescript
// File 1: orders.ts
if (!user || !user.email) {
  throw new Error('User email required');
}
if (!isValidEmail(user.email)) {
  throw new Error('Invalid email format');
}

// File 2: auth.ts
if (!user || !user.email) {
  throw new Error('User email required');
}
if (!isValidEmail(user.email)) {
  throw new Error('Invalid email format');
}

// File 3: profile.ts
if (!user || !user.email) {
  throw new Error('User email required');
}
if (!isValidEmail(user.email)) {
  throw new Error('Invalid email format');
}
```

**Detection**: 12 lines duplicated 3 times = 24 duplicated lines

---

#### ✅ NO DUPLICATION (Extracted)

```typescript
// utils/validation.ts
export function validateUserEmail(user: User | null): void {
  if (!user || !user.email) {
    throw new Error('User email required');
  }
  if (!isValidEmail(user.email)) {
    throw new Error('Invalid email format');
  }
}

// All files
import { validateUserEmail } from './utils/validation';
validateUserEmail(user);
```

---

## 4. Large Class (God Object)

### Thresholds

| Lines of Code | Severity | Action |
|--------------|----------|--------|
| **1-200** | ✅ Good | No action |
| **201-400** | 🟡 Medium | Consider splitting |
| **401-600** | 🟠 High | Split recommended |
| **601+** | 🔴 Critical | Split immediately |

**Single Responsibility Principle**: Class should have one reason to change

---

## 5. Dead Code

### Detection

```typescript
async function detectDeadCode(file: string): Promise<CodeSmell[]> {
  const exports = await extractExports(file);
  const imports = await findAllImports(file);
  const deadCode: CodeSmell[] = [];

  for (const exp of exports) {
    const usages = await findUsages(exp.name);

    if (usages.length === 0) {
      deadCode.push({
        type: 'dead-code',
        severity: 'low', // Dead code is not critical, but clutters
        location: { file, lines: [exp.line, exp.line] },
        refactoringCost: 'low', // Just delete
        priority: 2 * 2 / 1,
        details: {
          name: exp.name,
          type: exp.type, // function, class, const
          suggestion: `Remove unused ${exp.type} '${exp.name}'`
        }
      });
    }
  }

  return deadCode;
}
```

---

## Prioritization Strategy

```typescript
function prioritizeSmells(smells: CodeSmell[]): CodeSmell[] {
  return smells.sort((a, b) => b.priority - a.priority);
}

// Example output
const prioritized = [
  { type: 'duplication', severity: 'high', priority: 35 },  // Highest (high impact, low cost)
  { type: 'complexity', severity: 'critical', priority: 20 }, // High (critical severity)
  { type: 'long-method', severity: 'medium', priority: 8.3 }, // Medium
  { type: 'dead-code', severity: 'low', priority: 4 }        // Lowest
];
```

---

## Quick Reference

**Detection Commands**:
```typescript
// Detect all smells
const smells = await detectAllSmells('src/');

// Filter by severity
const critical = smells.filter(s => s.severity === 'critical');

// Prioritize
const prioritized = prioritizeSmells(smells);

// Show top 5
console.log('Top 5 code smells to fix:');
prioritized.slice(0, 5).forEach((smell, i) => {
  console.log(`${i+1}. ${smell.type} (${smell.severity}) - ${smell.details.suggestion}`);
});
```

**Thresholds Summary**:
- Complexity: > 10 (medium), > 15 (high), > 25 (critical)
- Long method: > 50 (medium), > 100 (high), > 150 (critical)
- Duplication: > 5% (medium), > 10% (high), > 15% (critical)

---

**Version**: 1.0.0
**Based on**: SonarQube (2024), Martin Fowler, Kent Beck
**Thresholds**: Industry standard (conservative)
