---
description: Load TOON format documentation for token-efficient tabular data
---

# Load TOON Format

Load TOON (Token-Oriented Object Notation) documentation for representing tabular data with 40-60% token savings.

## Usage

```
/load-toon-format
```

---

## What This Command Does

Loads **TOON format syntax and usage patterns** into context:

1. **README.md** (5 KB) - Format basics, when to use, decision guide

**Total**: ~5 KB of TOON documentation

---

## When to Use

Load TOON format when:

### Token Optimization Scenarios
- Working with benchmark data or test results (tabular format)
- Need to represent arrays of uniform objects efficiently
- Documenting performance metrics or vulnerability scans
- Creating specs with structured data examples

### Format Decision
- Data is uniform arrays of objects → Consider TOON
- Data is deeply nested → Use JSON instead
- Need maximum token efficiency → Use TOON for tables

---

## What You'll Learn

### 1. TOON Syntax

**JSON (125 tokens)**:
```json
{
  "tests": [
    { "name": "login", "passed": 12, "failed": 0 },
    { "name": "signup", "passed": 8, "failed": 1 }
  ]
}
```

**TOON (65 tokens, 48% savings)**:
```toon
tests[2	]{name	passed	failed}:
  login	12	0
  signup	8	1
```

### 2. When to Use TOON (40-60% savings)

✅ **Good use cases**:
- Benchmark results
- Test reports
- Vulnerability scans
- Performance metrics
- Any uniform array of objects

❌ **Bad use cases** (use JSON instead):
- Nested structures
- Non-uniform arrays
- Complex hierarchical data

### 3. Quick Decision Guide

```typescript
if (data is array of objects with same fields) {
  → Use TOON (40-60% savings)
} else if (data is deeply nested) {
  → Use JSON (better readability)
}
```

---

## Execute Reads

This command will load TOON format documentation:

```typescript
// Load TOON format guide
await Read({ file_path: '.claude/docs/toon-format/README.md' });
```

---

## Success Metrics (Target)

| Metric | Target | Source |
|--------|--------|--------|
| **Token reduction** | 40-60% | Tabular data compression |
| **Comprehension** | No degradation | Same information, compact format |
| **Use cases** | 5+ scenarios | Benchmarks, tests, scans, metrics |

---

## Quick Start

**After loading, use TOON for:**

1. **Benchmark results**:
```toon
benchmarks[2	]{approach	duration_ms	speedup}:
  Sequential	225	1x
  Parallel	45	5x
```

2. **Test reports**:
```toon
tests[3	]{suite	passed	failed}:
  unit	145	2
  integration	78	1
  e2e	34	0
```

3. **Vulnerability scans**:
```toon
vulnerabilities[2	]{id	type	severity	file}:
  SQL-001	SQL Injection	critical	auth.ts
  XSS-002	XSS	high	profile.vue
```

---

## Related Commands

- `/load-context-management` - Token optimization strategies
- `/docs` - Browse all available documentation

---

**Version**: 1.0.0
**Module**: 19-TOON-FORMAT (Simple Implementation)
**Documentation Size**: ~5 KB (1 file)
**Target**: 40-60% token reduction for tabular data
**Status**: Ready to load
