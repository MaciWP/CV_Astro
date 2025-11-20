---
description: Load comprehensive anti-hallucination validation patterns into context
---

# Load Anti-Hallucination Documentation

Load all anti-hallucination validation patterns, confidence scoring rules, and real examples into your current context.

## What Gets Loaded

1. **Overview** - Problem statement, quick rules, metrics
2. **File Validation** - 3-stage validation (Exact → Wildcard → Fuzzy)
3. **Function Validation** - Grep patterns, multi-language support
4. **Confidence Scoring** - Domain-adaptive thresholds, decision tree
5. **Real Examples** - Before/after comparisons, common patterns

## Execute Reads

Read the following documentation files:

1. Read `.claude/docs/anti-hallucination/README.md`
2. Read `.claude/docs/anti-hallucination/file-validation.md`
3. Read `.claude/docs/anti-hallucination/function-validation.md`
4. Read `.claude/docs/anti-hallucination/confidence-scoring.md`
5. Read `.claude/docs/anti-hallucination/examples.md`

## After Loading

Acknowledge with a summary:

```
✅ Anti-hallucination patterns loaded:

📁 File Validation: 3-stage (Exact → Wildcard → Fuzzy), <100ms
🔍 Function Validation: Multi-pattern Grep, <50ms
📊 Confidence Scoring: Domain-adaptive (Frontend 65-85%, Backend 70-90%, DB/Security 75-92%)
📚 Examples: 8 real cases with before/after comparisons

Ready to validate claims before making assertions.

Core rules:
1. Files: Glob FIRST, then claim
2. Functions: Grep FIRST, then claim
3. Ambiguity: AskUserQuestion FIRST, then execute
4. Confidence: If <70%, ASK don't assume
```

## When to Use

- **Complex tasks** requiring multiple file/function operations
- **Before major refactoring** to ensure all paths are validated
- **When starting a new session** to refresh validation patterns
- **When uncertain** about file locations or function names

## Integration

**From skills/agents:**
```markdown
# In skill Layer 1 (Analysis)
If task is complex → SlashCommand('/load-anti-hallucination')
```

**From user:**
```
/load-anti-hallucination
```

---

**Version**: 1.0.0
**Documentation**: `.claude/docs/anti-hallucination/`
**Related**: `/validate-claim`, `/docs`
