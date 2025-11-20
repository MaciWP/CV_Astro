# Quality Gates - CI/CD Enforcement

**Goal**: Block code merges that degrade quality metrics.

**Target**: 100% quality violations blocked

**Based on**: SonarQube Quality Gates (industry standard)

---

## Quality Gate Concept

**Quality Gate = Set of thresholds that code must meet to be merged**

```typescript
interface QualityGate {
  complexity: { max: number; maxIncrease: number };
  duplication: { max: string; maxIncrease: string };
  coverage: { min: number; minDecrease: number };
  issues: { critical: number; high: number };
}

const QUALITY_GATE: QualityGate = {
  complexity: {
    max: 450,           // Total CC across codebase
    maxIncrease: 10     // Max CC increase per PR
  },
  duplication: {
    max: '5%',          // Max duplication in codebase
    maxIncrease: '+1%'  // Max duplication increase per PR
  },
  coverage: {
    min: 80,            // Min test coverage
    minDecrease: -2     // Max coverage decrease per PR
  },
  issues: {
    critical: 0,        // Zero critical issues allowed
    high: 0             // Zero high issues allowed
  }
};
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Quality Gates

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Full history for comparison

      - name: Install dependencies
        run: npm install

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Analyze code quality
        run: |
          npm run analyze:complexity
          npm run analyze:duplication

      - name: Check quality gates
        run: node scripts/check-quality-gates.js

      - name: Post PR comment
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('quality-report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
```

---

### Quality Gate Script

```typescript
// scripts/check-quality-gates.ts
import { readCoverageReport, analyzeComplexity, analyzeDuplication } from './utils';

async function checkQualityGates() {
  // Step 1: Get current metrics
  const current = {
    complexity: await analyzeComplexity('src/'),
    duplication: await analyzeDuplication('src/'),
    coverage: await readCoverageReport()
  };

  // Step 2: Get base metrics (main branch)
  const base = await getBaseMetrics('main');

  // Step 3: Calculate deltas
  const deltas = {
    complexity: current.complexity.total - base.complexity.total,
    duplication: parseFloat(current.duplication.percentage) - parseFloat(base.duplication.percentage),
    coverage: current.coverage.percentage - base.coverage.percentage
  };

  // Step 4: Check gates
  const violations: string[] = [];

  // Complexity gate
  if (current.complexity.total > QUALITY_GATE.complexity.max) {
    violations.push(
      `Total complexity ${current.complexity.total} exceeds max ${QUALITY_GATE.complexity.max}`
    );
  }
  if (deltas.complexity > QUALITY_GATE.complexity.maxIncrease) {
    violations.push(
      `Complexity increased by ${deltas.complexity} (max allowed: ${QUALITY_GATE.complexity.maxIncrease})`
    );
  }

  // Duplication gate
  const maxDup = parseFloat(QUALITY_GATE.duplication.max);
  if (parseFloat(current.duplication.percentage) > maxDup) {
    violations.push(
      `Duplication ${current.duplication.percentage}% exceeds max ${QUALITY_GATE.duplication.max}`
    );
  }
  if (deltas.duplication > 1) {
    violations.push(
      `Duplication increased by ${deltas.duplication.toFixed(1)}% (max allowed: +1%)`
    );
  }

  // Coverage gate
  if (current.coverage.percentage < QUALITY_GATE.coverage.min) {
    violations.push(
      `Coverage ${current.coverage.percentage}% below min ${QUALITY_GATE.coverage.min}%`
    );
  }
  if (deltas.coverage < QUALITY_GATE.coverage.minDecrease) {
    violations.push(
      `Coverage decreased by ${Math.abs(deltas.coverage).toFixed(1)}% (max allowed: ${Math.abs(QUALITY_GATE.coverage.minDecrease)}%)`
    );
  }

  // Step 5: Report results
  if (violations.length > 0) {
    await generateQualityReport(violations, current, base, deltas);
    console.error('\n❌ Quality Gate FAILED\n');
    violations.forEach(v => console.error(`  - ${v}`));
    process.exit(1);
  } else {
    console.log('\n✅ Quality Gate PASSED\n');
    await generateQualityReport([], current, base, deltas);
    process.exit(0);
  }
}

checkQualityGates();
```

---

### Quality Report Template

````markdown
## 📊 Quality Gate Report

### Summary
{status} **Quality Gate {PASSED/FAILED}**

---

### Metrics Comparison

| Metric | Base (main) | Current (PR) | Delta | Status |
|--------|-------------|--------------|-------|--------|
| **Complexity** | {base.complexity} | {current.complexity} | {delta} | {status} |
| **Duplication** | {base.duplication}% | {current.duplication}% | {delta}% | {status} |
| **Coverage** | {base.coverage}% | {current.coverage}% | {delta}% | {status} |

---

### Violations

{if violations.length > 0}
#### ❌ Quality Gate Failures

1. **Complexity increased by +13** (threshold: +10)
   - File: `src/checkout/process.ts`
   - Function: `processCheckout` (CC: 18, was: 10)
   - Suggested: Extract validation, reduce nesting

2. **Duplication increased by +1.3%** (threshold: +1%)
   - Lines 45-60 in `src/checkout/process.ts` duplicate `src/orders/validate.ts:78-93`
   - Suggested: Extract `validateCheckoutData()` function

{else}
#### ✅ All Gates Passed

No quality violations detected.
{end if}

---

### Recommendations

{if violations.length > 0}
#### Auto-Refactoring Available

Claude Code can automatically refactor these issues:

1. **Extract methods** in `processCheckout`
   - Reduces complexity from 18 → 6 (67% reduction)
   - Estimated time: 15 seconds

2. **Remove duplication**
   - Extract shared `validateCheckoutData()` function
   - Reduces duplication by 15 lines

[Apply Auto-Refactoring](#) | [Review Suggestions](#)
{end if}

---

**Quality Gate Configuration**: [view .quality-gate.yml](#)
````

---

## Threshold Configuration

### SonarQube Standard

```yaml
# .sonarqube.yml
sonar.qualitygate:
  name: "Default Quality Gate"
  conditions:
    - metric: complexity
      op: GT
      error: 450

    - metric: duplicated_lines_density
      op: GT
      error: 5.0

    - metric: coverage
      op: LT
      error: 80.0

    - metric: critical_violations
      op: GT
      error: 0

    - metric: major_violations
      op: GT
      error: 0
```

---

### Project-Specific Thresholds

```typescript
// .quality-gate.ts
export const QUALITY_THRESHOLDS = {
  // Complexity (adjust based on project size)
  complexity: {
    function: {
      max: 10,      // Per function
      critical: 15
    },
    file: {
      max: 100,     // Per file
      critical: 200
    },
    project: {
      max: 450,     // Total project
      maxIncrease: 10 // Per PR
    }
  },

  // Duplication
  duplication: {
    lines: {
      max: 5,       // Max lines in duplicate block
      maxOccurrences: 2 // Max times duplicated
    },
    percentage: {
      max: 5.0,     // Max % of codebase
      maxIncrease: 1.0 // Per PR
    }
  },

  // Coverage
  coverage: {
    lines: {
      min: 80,      // Min line coverage
      minDecrease: -2 // Max decrease per PR
    },
    branches: {
      min: 75       // Min branch coverage
    }
  },

  // Method/Function Length
  methodLength: {
    max: 50,        // Max lines per method
    critical: 100
  }
};
```

---

## Enforcement Strategies

### 1. Hard Block (Recommended)

```typescript
// Merge blocked if ANY gate fails
if (violations.length > 0) {
  console.error('❌ Quality gate failed - merge blocked');
  process.exit(1); // Fail CI/CD
}
```

**Pros**: Guarantees quality
**Cons**: Can slow development

---

### 2. Soft Block (Warning Only)

```typescript
// Warn but don't block
if (violations.length > 0) {
  console.warn('⚠️ Quality gate warnings:');
  violations.forEach(v => console.warn(`  - ${v}`));
  // Don't exit(1), allow merge with warning
}
```

**Pros**: Flexible
**Cons**: Quality can degrade

---

### 3. Tiered Approach (Balanced)

```typescript
// Critical violations: block
// Non-critical violations: warn

const criticalViolations = violations.filter(v => v.severity === 'critical');
const nonCriticalViolations = violations.filter(v => v.severity !== 'critical');

if (criticalViolations.length > 0) {
  console.error('❌ Critical quality violations - merge blocked');
  process.exit(1);
} else if (nonCriticalViolations.length > 0) {
  console.warn('⚠️ Quality warnings (non-blocking):');
  nonCriticalViolations.forEach(v => console.warn(`  - ${v}`));
  // Allow merge with warnings
}
```

**Pros**: Balance between quality and velocity
**Cons**: Requires good severity classification

---

## Auto-Refactoring Integration

```typescript
// Offer auto-refactoring for violations
if (violations.length > 0) {
  console.log('\n🤖 Auto-Refactoring Available\n');

  const refactorings = suggestRefactorings(violations);
  refactorings.forEach((r, i) => {
    console.log(`${i+1}. ${r.description}`);
    console.log(`   Impact: ${r.impact}`);
    console.log(`   Time: ${r.estimatedTime}`);
  });

  console.log('\nRun: npm run auto-refactor');
}
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Enforcement** | 100% violations blocked | CI/CD logs |
| **False Positives** | <5% | Manual review |
| **Refactoring Adoption** | >80% use auto-refactor | Usage logs |
| **Quality Trend** | Improving over time | Weekly reports |

---

## Quick Reference

**Standard Thresholds** (SonarQube):
- Complexity: ≤ 10 per function, ≤ 450 total
- Duplication: < 5% of codebase
- Coverage: ≥ 80%
- Critical issues: 0

**Enforcement**:
- Hard block: Fails CI/CD (recommended)
- Soft block: Warning only (flexible)
- Tiered: Block critical, warn non-critical (balanced)

**Best Practice**:
1. Set thresholds based on current state
2. Gradually tighten over time
3. Offer auto-refactoring for violations
4. Review thresholds quarterly

---

**Version**: 1.0.0
**Based on**: SonarQube Quality Gates (industry standard)
**Target**: 100% quality violations blocked
