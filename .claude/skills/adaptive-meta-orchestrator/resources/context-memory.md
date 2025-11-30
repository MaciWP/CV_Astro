# Context & Memory - Complete Guide

**Token budget management + cross-session learning + TOON format optimization (30-60% token savings).**

**Version**: 2.0.0
**Last Updated**: 2025-01-18
**Token Size**: ~6K tokens

---

## Overview

This reference provides complete context and memory management:

1. **Token Budget Monitoring** - 75%/87.5%/95% alerts, cleanup protocols
2. **Cross-Session Learning** - 4 pattern types (routing, complexity, bottlenecks, improvements)
3. **TOON Format** - 30-60% token savings for tabular data

**Use when**: Managing token budgets, storing patterns for future sessions, or optimizing large datasets.

---

## Part 1: Token Budget Monitoring

### Budget Thresholds

| Threshold | Tokens | Status | Action |
|-----------|--------|--------|--------|
| **<75%** | <150K | ✅ Safe | Proceed normally, no restrictions |
| **75-87.5%** | 150K-175K | ⚠️ Warning | Avoid loading large files (>10K), prioritize Context7 MCP |
| **87.5-95%** | 175K-190K | 🚨 Alert | Coordinate with knowledge-preserver BEFORE loading more |
| **>95%** | >190K | 🔥 Critical | MANDATORY cleanup, preserve session state first |

---

### Monitoring Protocol

**Check in every Phase 4 (Execution)**:

```markdown
⚡ TOOL OPTIMIZATION
- Token Budget: 145K/200K (72.5% - Safe)
```

---

### Warning Actions (75%+)

1. **Prioritize MCP over Read** for documentation (~500 tokens vs 5K)
2. **Avoid large files** (>10K tokens) unless critical
3. **Progressive disclosure** (load summaries first, details on-demand)

**Token-Efficient Strategies**:

✅ **Prefer** (Low Token Cost):
- Context7 MCP for docs (~500 tokens vs 5K)
- `Grep('pattern', output_mode='files_with_matches')` (paths only)
- `Read(file, offset=X, limit=Y)` for large files (>500 lines)
- File path references (don't re-read)

❌ **Avoid** (High Token Cost):
- Reading entire large files when excerpts suffice
- WebSearch results (unpredictable token cost)
- Repeated reads of same file
- Unnecessary context loads

---

### Alert Actions (87.5%+)

1. **Coordinate with knowledge-preserver**:
   ```
   @knowledge-preserver: "Save current WIP before cleanup: [task summary]"
   ```
2. **Preserve to AI_*.md** files (BUGS, DECISIONS, PROGRESS)
3. **Execute cleanup** (remove stale context, consolidate references)
4. **Resume** with preserved knowledge loaded

---

### Critical Actions (95%+)

1. **STOP** current task immediately
2. **MANDATORY** knowledge preservation
3. **Execute** full cleanup
4. **Warn** user of session interruption

---

## Part 2: Cross-Session Learning

### Memory Tool Integration

**Purpose**: Store patterns so future sessions learn from past executions.

**API**:
```python
# Store pattern
memory.store_routing_pattern(
    prompt="Create REST API for users",
    selected_agent="backend-dev",
    success=True,
    confidence=95
)

# Retrieve recommendation
recommendation = memory.get_routing_recommendation("Build GraphQL API")
# Returns: {'recommended_agent': 'backend-dev', 'confidence': 92, ...}
```

---

### 4 Pattern Types

#### 1. Routing Patterns

**Purpose**: Learn which agents work best for which prompts.

**Pattern Stored**:
```json
{
  "keywords": ["create", "rest", "api", "users"],
  "agent": "backend-dev",
  "success": true,
  "confidence": 95,
  "timestamp": "2025-01-18T10:30:00"
}
```

**Retrieval Algorithm**:
1. Extract keywords from prompt
2. Find patterns with keyword overlap
3. Group by agent, calculate success rate
4. Score = `success_rate × 100 + avg_overlap × 10`
5. Return best agent

---

#### 2. Complexity Calibration

**Purpose**: Self-correcting complexity estimates over time.

**Pattern Stored**:
```json
{
  "estimated": 27,
  "actual": 32,
  "factors": {"file_count": 8, "duration": 10, "dependencies": 5, "risk": 4},
  "project": "fastapi",
  "timestamp": "2025-01-18"
}
```

**Calibration Factor** (after 10+ samples):
```python
calibration_factor = sum(actual) / sum(estimated)
# Example: 320 / 270 = 1.18 (we under-estimate by 18%)

adjusted_score = complexity × calibration_factor
# 27 × 1.18 = 31.9 → More accurate
```

---

#### 3. Bottleneck Detection

**Purpose**: Identify recurring inefficiencies.

**Pattern Examples**:
- Sequential file reads (should be parallel)
- Repeated context loading (should cache)
- Bash for file operations (should use native tools)
- Large file reads without offset/limit

**Pattern Stored**:
```json
{
  "type": "sequential_reads",
  "description": "5 files read sequentially",
  "improvement": "Execute Read calls in parallel",
  "estimated_savings": "4x speedup",
  "occurrences": 12
}
```

---

#### 4. Improvement Proposals

**Purpose**: Detect patterns (3+ occurrences) → Propose automation.

**Pattern Stored**:
```json
{
  "pattern": "Glob('**/*.ts') used 5 times",
  "proposal": "Create /find-ts-files command",
  "effort": "5 minutes",
  "impact": "2x faster file discovery",
  "priority": "medium"
}
```

---

### Knowledge Preservation Operations

#### READ Operation

**Purpose**: Retrieve past knowledge from AI_*.md files.

**Sources**:
1. **AI_BUGS_KNOWLEDGE.md** - Known bugs, root causes, solutions
2. **AI_PRODUCT_DECISIONS.md** - Feature specs, design decisions
3. **AI_PROGRESS_TRACKER.md** - Sprint status, completed work

**Protocol**:
```markdown
🧠 CONTEXT MANAGEMENT (READ)
- Source: AI_BUGS_KNOWLEDGE.md
- Query: "ONNX FP16 compatibility issues"
- Result: BUG-2025102602 confirms FP16/Float32List incompatibility
- Application: Warn user about FP16 models, suggest conversion script
```

---

#### WRITE Operation

**Purpose**: Document new knowledge for future sessions.

**When**:
- Bug fixed → AI_BUGS_KNOWLEDGE.md
- Design decision made → AI_PRODUCT_DECISIONS.md
- Work completed → AI_PROGRESS_TRACKER.md

**Protocol**:
```markdown
🧠 CONTEXT MANAGEMENT (WRITE)
- Destination: AI_BUGS_KNOWLEDGE.md
- Entry: BUG-2025011801 - N+1 query in UserService.get_with_orders()
- Solution: Added selectinload() for orders relationship
- Prevention: Always use eager loading for relationships accessed in loop
```

---

#### REFLECT Operation

**Purpose**: Analyze workflow efficiency, propose improvements.

**Protocol**:
```markdown
🧠 CONTEXT MANAGEMENT (REFLECT)
- Workflow analyzed: Last 20 executions
- Patterns detected:
  1. Sequential file reads (12 occurrences) → Parallelize
  2. Bash for file ops (8 occurrences) → Use native tools
  3. Large file reads (5 occurrences) → Use offset/limit
- Proposals generated: 3 improvements with estimated 4x speedup
```

---

## Part 3: TOON Format Optimization

### Overview

**TOON (Token-Oriented Object Notation)** - Compact serialization for LLM contexts.

**Key Benefits**:
- **30-60% token reduction** for tabular data
- Human-readable (unlike binary)
- Lossless (full JSON restore)
- Optimized for uniform object lists

---

### Eligibility Detection

TOON beneficial when **ALL** conditions met:

1. **Data Structure**: List of objects
   ```python
   ✅ [{'id': 1, 'name': 'A'}, {'id': 2, 'name': 'B'}]
   ❌ {'users': [...]}  # Not a list
   ```

2. **Uniformity**: Same keys
   ```python
   ✅ All objects have {'id', 'name', 'age'}
   ❌ Different keys per object
   ```

3. **Size**: >10 items
   ```python
   ✅ 50 task records
   ❌ 5 task records  # Overhead not worth it
   ```

4. **Nesting**: ≤2 depth levels
   ```python
   ✅ {'id': 1, 'meta': {'created': '2025-01-01'}}  # Depth 2
   ❌ {'a': {'b': {'c': {'d': 1}}}}  # Depth 4 - too deep
   ```

---

### TOON vs JSON Comparison

**Example: Task Metrics (50 items)**

**JSON** (minified):
```json
[{"task_id":"T001","agent":"backend","duration":120,"success":true},...]
```
**Size**: ~2,500 chars → ~625 tokens

**TOON**:
```
tasks[50]{task_id,agent,duration,success}:
  T001 backend 120 true
  T002 frontend 95 true
  T003 backend 145 false
  ...
```
**Size**: ~1,000 chars → ~250 tokens

**Savings**: 375 tokens (60% reduction)

---

### Usage

**Automatic Optimization**:
```python
from core.toon_optimizer import get_optimizer

optimizer = get_optimizer()

# Large dataset
data = [
    {'task_id': 'T1', 'agent': 'backend', 'duration': 120},
    # ... 50+ more
]

# Optimize (auto-detect TOON eligibility)
optimized_str, metadata = optimizer.optimize_context(data)
# Returns TOON format if beneficial, JSON otherwise
```

**When TOON Applied**:
- Task metrics (50+ tasks)
- Agent performance data (20+ agents)
- Execution history (30+ executions)
- Test results (100+ tests)

---

## Best Practices

### DO ✅

- **Monitor token budget** in every Phase 4
- **Apply alerts** at 75%/87.5%/95% thresholds
- **Store patterns** for cross-session learning (routing, complexity, bottlenecks)
- **Preserve knowledge** to AI_*.md files before cleanup
- **Use TOON format** for large tabular datasets (>10 items, uniform keys)
- **Prioritize MCP** over Read for documentation when budget tight
- **Use offset/limit** for large files (>500 lines)
- **Reference previous reads** instead of re-loading

### DON'T ❌

- **Ignore token budget** (leads to context overflow)
- **Skip knowledge preservation** before cleanup (loses work)
- **Re-read files** already in context (wasteful)
- **Load entire large files** when excerpts suffice
- **Use JSON** for large tabular data when TOON eligible
- **Forget to calibrate** complexity estimates over time
- **Miss pattern detection** opportunities (3+ occurrences)

---

## Quick Reference

**When to load this reference**:
- Token budget >75% (need cleanup guidance)
- Storing patterns for cross-session learning
- Optimizing large datasets with TOON format
- Need knowledge preservation protocols
- Implementing memory calibration

**Integration with SKILL.md**:
- SKILL.md provides core principles (verify before claiming, progressive disclosure)
- This reference provides full token budgets + memory patterns + TOON format
- Load this when managing context or implementing cross-session learning

---

**Last Updated**: 2025-01-18
**Source Documents**: context-management.md (364 lines), pattern-storage.md (~600 lines), token-optimization.md (334 lines)
**Consolidated Size**: ~1,300 lines → ~6K tokens
**Optimization**: Unified budget thresholds, consolidated memory patterns, added TOON format guide