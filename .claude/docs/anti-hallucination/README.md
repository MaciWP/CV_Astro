# Anti-Hallucination System

**Target**: Reduce hallucination rate from 4.5% → <1%

---

## Quick Reference

### Core Rules (Always Apply)

1. **File Validation**: `Glob` before claiming file exists
2. **Function Validation**: `Grep` before claiming function exists
3. **Ambiguity Check**: `AskUserQuestion` when unclear
4. **Confidence Threshold**: ASK if <70% confident

### Load Full Documentation

```
/load-anti-hallucination
```

This command loads all validation patterns into your context.

---

## Problem Statement

**Claude hallucinates 4.5% of the time:**
- 40% file paths that don't exist
- 25% functions that don't exist
- 20% wrong API schemas
- 15% unverified performance claims

**Solution**: Pre-execution validation with confidence scoring.

---

## Documentation Structure

### 1. [File Validation](file-validation.md)
- 3-stage validation (Exact → Wildcard → Fuzzy)
- Glob patterns and wildcard search
- Levenshtein distance matching (max distance: 2)
- **Target**: 90% prevention, <100ms latency

### 2. [Function Validation](function-validation.md)
- Grep-based function search
- Multiple pattern matching (function, const, export, class methods)
- Fuzzy matching for similar function names
- **Target**: 85% prevention, <50ms latency

### 3. [Confidence Scoring](confidence-scoring.md)
- File verified: +30%
- Function verified: +25%
- Past success: +25%
- Clear requirements: +20%
- **Domain-adaptive thresholds**:
  - Frontend: <65% ask, >85% proceed
  - Backend: <70% ask, >90% proceed
  - Database/Security: <75% ask, >92% proceed

### 4. [Examples & Patterns](examples.md)
- Real hallucination cases prevented
- Before/after comparisons
- Common mistakes and fixes
- Integration patterns

---

## Quick Examples

### ❌ Wrong: Hallucinating File Path
```typescript
// DON'T
"I'll update the authentication logic in src/services/auth.ts"
// File might not exist!
```

### ✅ Correct: Validate First
```typescript
// DO
const authFiles = await Glob({ pattern: '**/auth*.ts' });

if (authFiles.length === 0) {
  await AskUserQuestion({
    question: 'I couldn\'t find auth implementation. Where should I look?',
    // ... options
  });
} else {
  // File exists, proceed
  "I'll update the authentication logic in " + authFiles[0]
}
```

### ❌ Wrong: Assuming Function Exists
```typescript
// DON'T
"I'll update the validateJWT() function"
// Function might not exist or have different name!
```

### ✅ Correct: Grep First
```typescript
// DO
const hasFunction = await Grep({
  pattern: 'validateJWT',
  path: authFiles[0],
  output_mode: 'files_with_matches'
});

if (!hasFunction) {
  // Search for similar functions
  await AskUserQuestion({
    question: 'I couldn\'t find validateJWT(). Which function should I use?',
    // ... show similar function names
  });
}
```

---

## Confidence-Based Language

| Confidence | Action | Language Example |
|------------|--------|------------------|
| <65% | **ASK** | "I couldn't find X. Can you verify where it is?" |
| 65-85% | **HEDGE** | "This might be in src/auth.ts. Let me check..." |
| >85% | **CONFIDENT** | "I'll update src/auth.ts" |

---

## Integration Points

### In CLAUDE.md
✅ Core rules (4 lines) loaded automatically in every conversation

### In Skills/Agents
Use: `SlashCommand('/load-anti-hallucination')` when handling complex tasks

### In Commands
Use: `/validate-claim <file> <function>` to validate specific claims

---

## Commands Available

- **`/load-anti-hallucination`** - Load all validation patterns
- **`/validate-claim`** - Validate specific file/function claim
- **`/docs`** - Browse all available documentation

---

## Success Metrics

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Hallucination Rate | 4.5% | <1.0% | ⏳ Measuring |
| Prevention Rate | 0% | 80-85% | ⏳ Measuring |
| User Questions | 0.2/task | 0.9/task | ⏳ Measuring |
| Latency | N/A | <100ms | ✅ ~60ms |

---

## Files in This Directory

1. **README.md** (this file) - Overview and quick reference
2. **file-validation.md** - File path validation patterns
3. **function-validation.md** - Function existence validation
4. **confidence-scoring.md** - Confidence calculation and thresholds
5. **examples.md** - Real cases and patterns

---

**Version**: 1.0.0
**Last Updated**: 2025-11-17
**Command**: `/load-anti-hallucination` to load all docs
