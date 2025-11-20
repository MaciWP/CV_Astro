---
description: Load comprehensive refactoring patterns for code quality improvement
---

# Load Refactoring Patterns

Load detailed refactoring documentation for detecting code smells and applying safe refactorings.

## Usage

```
/load-refactoring-patterns
```

---

## What This Command Does

Loads **comprehensive refactoring patterns** into context:

1. **README.md** (4.2 KB) - Overview, core principles, quick reference
2. **code-smells.md** (13.5 KB) - Detection patterns (complexity, duplication, long methods)
3. **safe-refactoring.md** (12.8 KB) - Extract method, behavior preservation, testing
4. **legacy-modernization.md** (11.2 KB) - var→const, callbacks→async, class→hooks
5. **quality-gates.md** (10.5 KB) - CI/CD enforcement, thresholds

**Total**: ~52 KB of refactoring patterns and quality improvement strategies

---

## When to Use

Load refactoring patterns when:

### Code Review Issues
- High cyclomatic complexity detected (CC > 10)
- Long methods found (> 50 lines)
- Code duplication identified (> 5%)
- Large classes (> 200 lines)

### Refactoring Tasks
- Extracting methods from long functions
- Removing duplicated code
- Modernizing legacy codebase
- Improving code quality

### CI/CD Setup
- Setting up quality gates
- Configuring SonarQube thresholds
- Blocking low-quality merges

---

## What You'll Learn

### 1. Code Smell Detection (SonarQube Standard)

**Detect quality issues automatically**:

```typescript
// Detection thresholds (industry standard)
const THRESHOLDS = {
  complexity: 10,      // CC > 10 = refactor
  methodLength: 50,    // > 50 lines = refactor
  duplication: 5,      // > 5% = refactor
};
```

**Tools**: SonarQube (gold standard), CodeClimate, ESLint

**Metrics**:
- Cyclomatic Complexity: 1-10 (good), 11-15 (medium), 16+ (high)
- Method Length: 1-50 (good), 51-100 (medium), 101+ (critical)
- Duplication: 0-5% (good), 6-10% (medium), 11%+ (critical)

---

### 2. Safe Refactoring (IntelliJ IDEA Pattern)

**Preserve behavior through testing**:

```typescript
// Safety protocol
1. Run tests BEFORE refactoring
2. Apply refactoring
3. Run tests AFTER refactoring
4. Tests must pass (same count, same results)
5. If tests fail → ROLLBACK immediately
```

**Safe refactorings**:
- Rename variable/function
- Extract constant
- Extract method (pure functions)
- Inline temp variable

**Risky refactorings** (ask user first):
- Extract class
- Move method
- Change signature

---

### 3. Remove Duplication (Martin Fowler Top Priority)

**DRY Principle enforcement**:

```typescript
// ❌ BAD: Duplicated (3 files)
if (!user || !user.email) throw new Error('User email required');
if (!isValidEmail(user.email)) throw new Error('Invalid email');

// ✅ GOOD: Extracted
export function validateUserEmail(user: User): void {
  if (!user || !user.email) throw new Error('User email required');
  if (!isValidEmail(user.email)) throw new Error('Invalid email');
}
```

**Target**: < 5% duplication in codebase

---

### 4. Modernize Legacy Code

**Common transformations**:

```javascript
// var → const/let
var name = 'Alice';  // ❌
const name = 'Alice'; // ✅

// Callbacks → Async/Await
fetchData(function(err, data) { /* ... */ }); // ❌
const data = await fetchData();                // ✅

// Class components → Hooks
class Dashboard extends React.Component { /* ... */ } // ❌
const Dashboard = () => { /* hooks */ };               // ✅
```

**Priority**: Impact-driven (callbacks→async first, high impact)

---

### 5. Quality Gates (CI/CD Enforcement)

**Block merges that degrade quality**:

```typescript
const QUALITY_GATE = {
  complexity: {
    max: 450,           // Total CC across codebase
    maxIncrease: 10     // Max CC increase per PR
  },
  duplication: {
    max: '5%',          // Max duplication
    maxIncrease: '+1%'  // Max increase per PR
  },
  coverage: {
    min: 80,            // Min test coverage
    minDecrease: -2     // Max coverage decrease
  }
};
```

**Enforcement**: Block merge if ANY gate fails (hard block recommended)

---

## Execute Reads

This command will load all refactoring documentation:

```typescript
// 1. Read overview + core principles
await Read({ file_path: '.claude/docs/refactoring/README.md' });

// 2. Read code smell detection patterns
await Read({ file_path: '.claude/docs/refactoring/code-smells.md' });

// 3. Read safe refactoring patterns
await Read({ file_path: '.claude/docs/refactoring/safe-refactoring.md' });

// 4. Read legacy modernization patterns
await Read({ file_path: '.claude/docs/refactoring/legacy-modernization.md' });

// 5. Read quality gates configuration
await Read({ file_path: '.claude/docs/refactoring/quality-gates.md' });
```

---

## Success Metrics (Expert Standards)

| Metric | Threshold | Source |
|--------|-----------|--------|
| **Cyclomatic Complexity** | ≤ 10 | Industry standard (SonarQube: 15) |
| **Method Length** | ≤ 50 lines | Industry standard |
| **Code Duplication** | < 5% | Industry standard |
| **Refactoring Safety** | 99%+ tests pass | IntelliJ IDEA |

---

## Quick Start

**After loading, follow this workflow:**

1. **Detect code smells**:
   - Analyze complexity (CC > 10)
   - Find long methods (> 50 lines)
   - Detect duplication (> 5%)

2. **Prioritize**:
   - Duplication first (highest impact/cost ratio)
   - Complexity second (bug-prone)
   - Long methods third (maintainability)

3. **Refactor safely**:
   - Run tests before
   - Apply refactoring
   - Run tests after
   - Rollback if tests fail

4. **Verify quality gates**:
   - Check complexity didn't increase > +10
   - Check duplication didn't increase > +1%
   - Check coverage didn't decrease > -2%

---

## Related Commands

- `/load-anti-hallucination` - Validation patterns
- `/load-context-management` - Token optimization
- `/load-security` - Vulnerability detection
- `/load-testing-strategy` - Test generation patterns
- `/claude-docs` - Browse all .claude/ documentation

---

**Version**: 1.0.0
**Module**: 17-REFACTORING-PATTERNS (Opción B - Core Recommendations)
**Documentation Size**: ~52 KB (5 files)
**Based on**: Martin Fowler, SonarQube (2024), IntelliJ IDEA
**Target**: 95%+ smell detection, 99%+ safe refactorings
**Status**: Ready to load
