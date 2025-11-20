---
description: Load proactive improvement patterns for Claude Code self-enhancement
---

# Load Self-Improvement Patterns

Load comprehensive self-improvement documentation for proactive Claude Code enhancement.

## Usage

```
/load-self-improvement
```

---

## What This Command Does

Loads **proactive pattern detection and suggestions** into context:

1. **README.md** (3 KB) - Overview, Golden Rule (be proactive), core principles
2. **pattern-detection.md** (8 KB) - What patterns to detect, thresholds, algorithms
3. **proactive-suggestions.md** (10 KB) - How to suggest improvements, templates, timing

**Total**: ~21 KB of self-improvement patterns and proactive strategies

---

## When to Use

Load self-improvement patterns when:

### Proactive Improvement Mode
- User completes a task successfully (suggest optimizations)
- Pattern detected (repeated workflows, duplicated code, errors)
- Need to propose creating skills/agents/commands/MCPs

### Pattern Detection
- Same workflow repeated 3+ times (suggest skill creation)
- Code duplicated in 3+ files (suggest extraction)
- Same error occurs 3+ times (suggest prevention rule)
- Same command used 3+ times (suggest slash command)

### Learning from Usage
- User frequently searches certain patterns (suggest command)
- Missing documentation for frequent topics (suggest research)
- Opportunities for optimization detected

---

## What You'll Learn

### 1. Golden Rule (CRITICAL)

**Be PROACTIVE with Claude Code improvements.**

```typescript
// ✅ ALWAYS: Detect and suggest
[Detecta: Glob('**/*.ts') usado 3 veces]
Claude: "He notado que buscas archivos TypeScript frecuentemente.
¿Quieres que cree un comando /find-ts-files?"

// ✅ ALWAYS: Propose when you see opportunities
[Detecta: validateEmail() duplicado en 3 archivos]
Claude: "Detecto validación de email en 3 lugares.
¿Extraigo a src/utils/validation.ts?"

// ❌ NEVER: Stay silent about patterns
[Detecta: Error repetido 3 veces]
Claude: [Silence]  // WRONG - Should suggest prevention
```

**What to suggest creating**:
- ✅ New skills (via skill-builder)
- ✅ New agents (specialized subagents)
- ✅ New commands (slash commands)
- ✅ New MCPs (tool integrations)
- ✅ New documentation (patterns learned)
- ✅ Research (best practices 2024-2025)

---

### 2. Pattern Detection (3+ Occurrences)

**Detect patterns automatically:**

```typescript
// Detection threshold
const THRESHOLD = {
  occurrences: 3,       // 3+ times = suggest
  confidence: 0.75,     // 75%+ confidence required
  timeWindow: 7 days    // Within 7 days
};

// Pattern types
1. Repeated workflows → Create skill
2. Duplicated code → Extract to utils
3. Repeated errors → Create prevention rule
4. Repeated commands → Create slash command
5. Repeated Glob patterns → Create find command
6. Missing documentation → Research or create docs
```

**Detection algorithms**:
- Frequency analysis (count occurrences)
- Sequence mining (find workflow patterns)
- Similarity detection (group similar code/errors)
- Semantic search (topic clustering)

---

### 3. Proactive Suggestions (Ask, Don't Assume)

**How to suggest improvements:**

```markdown
**Template**:
He notado {pattern} ({occurrences} veces).

¿Quieres que:
A) {primary_suggestion}
B) {alternative}
C) Ignore (no es necesario)

Benefits: {benefits}
Time saved: {time_estimate}
```

**Timing rules**:
- Errors: Immediate (prevent next occurrence)
- Workflows: End of task (don't interrupt)
- Commands: Daily summary (batch to avoid spam)

**Frequency limits**:
- Max 2 suggestions per hour
- Max 5 suggestions per session
- Max 10 suggestions per day
- Min 15 min between suggestions

---

## Execute Reads

This command will load all self-improvement documentation:

```typescript
// 1. Read overview + Golden Rule
await Read({ file_path: '.claude/docs/self-improvement/README.md' });

// 2. Read pattern detection algorithms
await Read({ file_path: '.claude/docs/self-improvement/pattern-detection.md' });

// 3. Read suggestion templates and timing
await Read({ file_path: '.claude/docs/self-improvement/proactive-suggestions.md' });
```

---

## Success Metrics (Target)

| Metric | Threshold | Source |
|--------|-----------|--------|
| **Patterns detected** | 5-10/week | Automatic logging |
| **Suggestions made** | 3-5/week | Proactive suggestions |
| **Acceptance rate** | >60% | User accepts suggestion |
| **False positives** | <20% | User rejects as invalid |
| **User satisfaction** | 4.5/5 | Suggestion helpfulness |

---

## Quick Start

**After loading, follow this workflow:**

1. **Golden Rule (Be Proactive)**:
   - Detect patterns (3+ occurrences)
   - Suggest improvements (skills, agents, commands, MCPs, docs)
   - Always ASK, never ASSUME

2. **Pattern Detection**:
   - Monitor tool usage (Grep, Read, Edit, Bash, Glob)
   - Group similar activities
   - Calculate confidence (>75% to suggest)

3. **Proactive Suggestions**:
   - Use templates (pattern → suggestion → options)
   - Respect timing (immediate for errors, end-of-task for workflows)
   - Respect limits (max 2/hour, 5/session, 10/day)

4. **Learning from Feedback**:
   - Track acceptance rate (target: >60%)
   - Analyze rejections (why did user say no?)
   - Adjust thresholds dynamically

---

## Real-World Examples

**Example 1: Create Skill**
```
[User does Grep → Read → Edit → Bash 3 times]

"He notado este workflow 3 veces:
 Grep → Read → Edit → Bash (tests)

¿Quieres que cree una skill 'modify-function'?"
```

**Example 2: Extract Duplication**
```
[validateEmail() in 3 files]

"Detecto validación de email en 3 archivos.
¿Extraigo a src/utils/validation.ts?"
```

**Example 3: Prevent Error**
```
[FileNotFoundError with Read 3 times]

"Error repetido: Read con wildcards.
¿Creo validación pre-Read que sugiera Glob?"
```

**Example 4: Create Command**
```
[Glob('**/*.ts') 3 times]

"Buscas archivos TypeScript frecuentemente.
¿Creo comando /find-ts?"
```

---

## Related Commands

- `/load-anti-hallucination` - Validation patterns (verify before suggesting)
- `/load-testing-strategy` - Test generation patterns
- `/load-refactoring-patterns` - Code quality improvement
- `/load-user-experience` - Error messages, progress tracking

---

**Version**: 1.0.0
**Module**: 10-SELF-IMPROVEMENT (Opción B - Proactive Pattern Detection)
**Documentation Size**: ~21 KB (3 files)
**Based on**: Expert consensus 2024-2025, user's vision of proactivity
**Target**: 60%+ acceptance rate, 5-10 patterns detected/week
**Status**: Ready to load
