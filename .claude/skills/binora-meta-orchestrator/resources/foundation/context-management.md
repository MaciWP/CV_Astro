# Context Management & Knowledge Preservation

**Token budget monitoring + knowledge preservation operations for session continuity.**

---

## Overview

**"Most agent failures are context failures, not model failures."** - Anthropic 2025 Research

This reference covers:
- Token budget monitoring (75%/87.5%/95% alerts)
- READ/WRITE/REFLECT operations for knowledge preservation
- Integration with knowledge-preserver agent
- Session continuity strategies

**Usage**: Referenced from `SKILL.md` Phase 4 (Tool Optimization) for token checks.

---

## Token Budget Monitoring

### Budget Thresholds

| Threshold | Tokens | Status | Action |
|-----------|--------|--------|--------|
| <75% | <150K | ✅ **Safe** | Proceed normally, no restrictions |
| 75-87.5% | 150K-175K | ⚠️ **Warning** | Consider cleanup opportunities, avoid loading large files |
| 87.5-95% | 175K-190K | 🚨 **Alert** | Coordinate with knowledge-preserver BEFORE loading more context |
| >95% | >190K | 🔥 **Critical** | MANDATORY cleanup, preserve session state first |

### Monitoring Protocol

**ALWAYS check in Phase 4 (Tool Optimization)**:

```markdown
⚡ TOOL OPTIMIZATION
- Token Budget: X/200K (Y% - [Safe|Warning|Alert|Critical])
```

**Warning (75%+) Actions**:
1. Prioritize Context7 MCP over Read for documentation (lower token cost)
2. Avoid loading files >10K tokens unless critical
3. Consider progressive disclosure (load summaries first, details on-demand)

**Alert (87.5%+) Actions**:
1. Coordinate with knowledge-preserver agent:
   ```
   @knowledge-preserver: "Save current WIP before cleanup: [task summary]"
   ```
2. Preserve to AI_BUGS_KNOWLEDGE.md, AI_PRODUCT_DECISIONS.md, AI_PROGRESS_TRACKER.md
3. Execute cleanup (remove stale context, consolidate references)
4. Resume with preserved knowledge loaded

**Critical (95%+) Actions**:
1. STOP current task immediately
2. MANDATORY knowledge preservation
3. Execute full cleanup
4. Warn user of session interruption

### Token-Efficient Strategies

**Prefer** (Low Token Cost):
- Context7 MCP for official docs (~500 tokens vs 5K for full docs)
- Grep with `output_mode="files_with_matches"` (file paths only)
- Targeted Read with offset/limit parameters
- References to existing files (mention file path, don't read)

**Avoid** (High Token Cost):
- Reading entire large files (>5K tokens) when excerpts sufficient
- WebSearch results (unpredictable token cost)
- Repeated reads of same file (cache information)
- Loading context files unnecessarily

---

## Knowledge Preservation Operations

### READ Operation

**Purpose**: Retrieve past knowledge from project knowledge bases.

**When to Use**:
- Self-validation (check for known bugs, prior decisions)
- Context building (understand project history)
- Avoiding rework (check if task already addressed)

**Sources**:
1. **AI_BUGS_KNOWLEDGE.md**: Known bugs, root causes, solutions, prevention patterns
2. **AI_PRODUCT_DECISIONS.md**: Feature specs, design decisions, button behaviors
3. **AI_PROGRESS_TRACKER.md**: Sprint status, completed work, priorities

**Protocol**:
```markdown
🧠 CONTEXT MANAGEMENT (READ)
- Source: AI_BUGS_KNOWLEDGE.md
- Query: "ONNX FP16 compatibility issues"
- Result: BUG-2025102602 confirms FP16/Float32List incompatibility
- Application: Warn user about FP16 models, suggest conversion script
```

**Example - Self-Validation**:
```
User: "Can I use FP16 ONNX models?"
Assistant:
📚 READ Operation
- Source: AI_BUGS_KNOWLEDGE.md
- Search: "FP16 ONNX"
- Found: BUG-2025102602 (FP16 tensors incompatible with Float32List)
- Result: NO - requires conversion via convert_fp16_to_fp32_io.py

✅ QUALITY ASSURANCE (Self-Validation)
- Confidence: 95/100 (verified against bug knowledge base)
- Recommendation: Export ONNX as FP32, OR use conversion script
```

### WRITE Operation

**Purpose**: Store new knowledge for future sessions.

**When to Use**:
- Bug fixed (document root cause + solution)
- Design decision made (document rationale + alternatives)
- Feature completed (document specs + patterns)

**Targets**:
1. **AI_BUGS_KNOWLEDGE.md**: via @bug-documenter agent
2. **AI_PRODUCT_DECISIONS.md**: via @decision-documenter agent
3. **AI_PROGRESS_TRACKER.md**: via @progress-tracker agent

**Protocol**:
```markdown
💾 WRITE Operation
- Target: AI_BUGS_KNOWLEDGE.md
- Content: BUG-2025MMDDXX - [Title], Root Cause, Solution, Prevention
- Agent: @bug-documenter
- Purpose: Prevent recurrence in future sessions
```

**Example - Bug Documentation**:
```
After fixing hot reload issue:

@bug-documenter: "Document BUG-2025102801: Hot reload not applying changes
in EasyBoard Flutter project. Root cause: Kotlin/Gradle cache corruption
not syncing with Flutter. Solution: MANDATORY `flutter clean && flutter run`
for all code changes. Prevention: Add to troubleshooting docs, warn in
CLAUDE.md."
```

### REFLECT Operation

**Purpose**: Learn from experience, improve future responses.

**When to Use**:
- After completing complex task
- After fixing critical bug
- When discovering new patterns/anti-patterns

**Protocol**:
```markdown
📝 REFLECT Operation
1. What was done?
2. What worked well?
3. What could be improved?
4. Generalizable lessons?
5. WRITE lessons to knowledge base
```

**Example - Post-Mortem Reflection**:
```
After implementing dark mode:

📝 REFLECTION

What was done:
- Created dark ColorScheme (Material Design 3)
- Replaced 47 hardcoded color references across 16 screens
- Added ThemeProvider with Riverpod + Isar persistence
- Validated WCAG AA contrast ratios

What worked well:
- Grep parallel with Context7 MCP found all color references quickly
- Material Design 3 system prevented custom color issues
- Accessibility skill caught contrast ratio violations early

What could be improved:
- Should have used sed/awk script for mass color replacement (30min manual work)
- Could have generated screenshot tests automatically
- Theme animation could be smoother (add AnimatedTheme widget)

Generalizable lessons:
1. ALWAYS use automated refactoring for mass replacements (50+ instances)
2. Material Design 3 system colors prevent dark mode issues
3. WCAG validation should be part of CI/CD, not manual

WRITE to AI_PRODUCT_DECISIONS.md:
[Documents dark mode implementation patterns for future features]
```

---

## Integration with knowledge-preserver Agent

### When to Invoke

**Manual invocation**:
```
@knowledge-preserver: "Save current progress before context cleanup"
```

**Automatic triggers** (token-budget-monitor):
- 87.5% threshold reached (175K tokens)
- Feature switch detected (ML → UI, Database → Screens)
- User requests `/clear` command

### Workflow

1. **knowledge-preserver activates**
2. **Scans conversation history**:
   - Undocumented bugs fixed
   - Design decisions made
   - Work-in-progress state
3. **Coordinates documentation agents**:
   - @bug-documenter: Preserve bug fixes
   - @decision-documenter: Preserve design decisions
   - @progress-tracker: Preserve WIP state
4. **Confirms preservation complete**
5. **Safe to proceed with cleanup**

### Example - Coordinated Preservation

```
Token Budget: 176K/200K (88% - 🚨 ALERT)

🧠 CONTEXT MANAGEMENT (Preservation Required)
- Status: Alert threshold reached
- Action: Coordinating with knowledge-preserver

@knowledge-preserver: "Preserve session state before cleanup:
- Bug fixed: Hot reload not working (MANDATORY flutter clean)
- Design decision: Chose ListView.builder over pagination for match history
- WIP: Dark mode 80% complete (Phase 3 pending: persistence)"

[knowledge-preserver responds with preservation confirmation]

✅ Preservation Complete
- BUG-2025102801 documented in AI_BUGS_KNOWLEDGE.md
- Dark mode decision documented in AI_PRODUCT_DECISIONS.md
- WIP state saved in AI_PROGRESS_TRACKER.md

Safe to proceed with context cleanup.
```

---

## Session Continuity Strategies

### Progressive Disclosure

**Principle**: Load minimal context initially, load details on-demand.

**Strategy**:
1. **Initial**: Load CLAUDE.md (project instructions) + critical-context.md
2. **On-Demand**: Load architecture-patterns.md when DI question arises
3. **Targeted**: Load specific sections via grep, not entire files

**Example**:
```
Instead of:
  Read .claude/context/architecture-patterns.md (5K tokens)

Use:
  Grep "constructor injection" in architecture-patterns.md (200 tokens)
  Read specific section if needed (1K tokens)
```

### Context Consolidation

**When**: At 75%+ token usage

**Actions**:
1. **Summarize** long conversations (preserve decisions, drop debug logs)
2. **Archive** completed work (move to AI_PROGRESS_TRACKER.md)
3. **Deduplicate** repeated information
4. **Remove** stale references (outdated files, abandoned approaches)

### Feature Switch Detection

**Problem**: Switching between unrelated domains fragments context.

**Example**:
```
Session starts: ML inference optimization (ONNX, tensors, YOLO)
[1 hour passes, 100K tokens]
User: "Now add dark mode to settings screen"
[Domain switch: ML → UI]
Result: ML context now stale, but consuming 50K tokens
```

**Detection**:
- token-budget-monitor watches for domain keyword switches
- Flags when >30K tokens from previous domain remain loaded

**Action**:
- Suggest context cleanup: "Previous ML context (50K tokens) now stale. Preserve decisions and cleanup?"

---

## Token Optimization Tips

### High-Value Context (Keep)

- CLAUDE.md (project instructions)
- .claude/context/critical-context.md (non-negotiable rules)
- Current file being edited
- Recent conversation (last 10 messages)
- Active skills (currently triggered)

### Low-Value Context (Remove at 75%+)

- Debug logs from resolved issues
- Exploratory reads (files checked but not edited)
- Outdated references (superseded by newer approaches)
- Duplicate information (same pattern explained multiple times)
- Completed work details (preserve summary, remove implementation details)

### Context Efficiency Metrics

**Good Session** (<75% token usage):
- Focused on single domain/feature
- Progressive disclosure (load as needed)
- Efficient tool usage (parallel, MCP-first)

**Poor Session** (>87.5% token usage):
- Multiple domain switches
- Large file dumps
- Repeated information
- Stale context not cleaned

---

## Best Practices

### DO ✅

- Check token budget in EVERY Phase 4
- Preserve knowledge BEFORE cleanup (never lose work)
- Use Context7 MCP for official docs (3-5x token savings)
- Read AI_BUGS_KNOWLEDGE.md for self-validation
- Coordinate with knowledge-preserver at 87.5%+

### DON'T ❌

- Ignore token warnings (leads to emergency cleanup)
- Load full files when excerpts sufficient
- Repeat information (summarize, reference, don't restate)
- Clean context without preserving first (knowledge loss)
- Switch domains without cleanup (context fragmentation)

---

**Last Updated**: 2025-10-28
**Research**: "Most agent failures are context failures not model failures" - Anthropic 2025
**Integration**: Called from SKILL.md Phase 4 (Tool Optimization)