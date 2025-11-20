# TOON Format - Token-Oriented Object Notation

**Purpose**: Reduce token usage by 40-60% for tabular data

**When to use**: Arrays of uniform objects (benchmark results, test reports, tables)

**When NOT to use**: Deeply nested structures (use JSON instead)

---

## Format Basics

### JSON (Verbose - 125 tokens)

```json
{
  "tests": [
    { "name": "login", "passed": 12, "failed": 0, "duration_ms": 2400 },
    { "name": "signup", "passed": 8, "failed": 1, "duration_ms": 3100 },
    { "name": "logout", "passed": 15, "failed": 0, "duration_ms": 1800 }
  ]
}
```

### TOON (Compact - 65 tokens, 48% savings)

```toon
tests[3	]{name	passed	failed	duration_ms}:
  login	12	0	2400
  signup	8	1	3100
  logout	15	0	1800
```

**Syntax**:
- `tests[3	]`: Array name + length
- `{name	passed	...}`: Column headers (tab-separated)
- Data rows: Tab-separated values

---

## When to Use TOON

### ✅ Good Use Cases (40-60% token savings)

1. **Benchmark results**
```toon
benchmarks[2	]{approach	duration_ms	files	speedup}:
  Sequential	225	5	1x
  Parallel	45	5	5x
```

2. **Test reports**
```toon
tests[4	]{suite	passed	failed	skipped}:
  unit	145	2	0
  integration	78	1	3
  e2e	34	0	12
  performance	8	0	4
```

3. **Vulnerability scans**
```toon
vulnerabilities[3	]{id	type	severity	file	line}:
  SQL-001	SQL Injection	critical	auth.ts	45
  XSS-002	XSS	high	profile.vue	78
  CSRF-003	CSRF	medium	api.ts	120
```

4. **Performance metrics**
```toon
metrics[3	]{operation	time_ms	memory_mb	cpu_percent}:
  read	15	120	25
  write	45	180	60
  delete	8	95	15
```

### ❌ Bad Use Cases (Use JSON instead)

1. **Nested structures**
```json
{
  "server": {
    "host": "localhost",
    "port": 3000,
    "ssl": { "enabled": true, "cert": "/path/to/cert" }
  }
}
```

2. **Non-uniform arrays**
```json
[
  { "type": "user", "name": "Alice", "role": "admin" },
  { "type": "post", "title": "Hello", "content": "..." },
  { "type": "comment", "text": "Nice!", "author": "Bob" }
]
```

3. **Complex nested arrays**
```json
{
  "results": [
    {
      "test": "login",
      "steps": [
        { "action": "navigate", "status": "pass" },
        { "action": "fill", "status": "pass" }
      ]
    }
  ]
}
```

---

## Quick Decision Guide

```typescript
// Should I use TOON?
if (data is array of objects with same fields) {
  → Use TOON (40-60% savings)
} else if (data is deeply nested) {
  → Use JSON (better readability)
} else if (data is mixed/non-uniform) {
  → Use JSON (TOON doesn't help)
}
```

---

## Integration with Claude Code

**Claude can:**
- ✅ Read TOON format natively
- ✅ Generate TOON output when requested
- ✅ Convert JSON → TOON for token efficiency

**Usage in specs/docs:**
```markdown
Performance benchmark results:

```toon
results[2	]{approach	files	duration_ms	tokens}:
  Sequential	5	225	15000
  Parallel	5	45	15000
```

Token savings: 51% vs JSON
```

---

## Success Metrics

**Token Reduction**:
- Tabular data: 40-60% reduction
- Skill prompts: 50%+ reduction
- Documentation: 45-55% reduction

**Quality**:
- No comprehension degradation
- Maintains readability
- Easier to scan than JSON for tables

---

**Version**: 1.0.0 (Simple)
**Target**: 40-60% token reduction for tabular data
**Status**: Ready to use
