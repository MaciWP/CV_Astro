# Conflict Resolution - Orchestrator v3.7

> Reference: `.claude/config/orchestrator-settings.json` → `features.conflictResolution`

## Purpose

Automatically resolve conflicts when multiple agents provide contradictory outputs or recommendations.

---

## Conflict Types

### Type 1: Output Conflicts
When two agents produce different outputs for the same task.

**Example**:
- `backend-expert` suggests REST endpoint
- `frontend-expert` suggests GraphQL endpoint

**Resolution**: Apply priority strategy based on task type.

### Type 2: Resource Conflicts
When multiple agents try to modify the same file simultaneously.

**Example**:
- Agent A wants to edit `src/utils/api.ts` line 50
- Agent B wants to edit `src/utils/api.ts` line 52

**Resolution**: Sequential execution with merge detection.

### Type 3: Strategy Conflicts
When agents recommend different approaches.

**Example**:
- `security-scanner` recommends blocking the request
- `performance-profiler` recommends allowing with caching

**Resolution**: Escalation to user with options.

---

## Resolution Strategies

### 1. Priority Strategy (Default)

```yaml
priority_order:
  - CRITICAL: security, secrets, production
  - HIGH: performance, architecture, multi-tenant
  - MEDIUM: testing, quality, refactoring
  - LOW: documentation, style, formatting

rule: Higher priority agent wins
example: security-scanner (CRITICAL) > performance-profiler (HIGH)
```

### 2. Consensus Strategy

```yaml
when: Multiple agents with same priority
process:
  1. Collect all agent outputs
  2. Identify common elements (intersection)
  3. Present differences to user if no consensus
  4. Merge compatible recommendations

example:
  agent_1: "Add index on user_id"
  agent_2: "Add index on user_id and created_at"
  consensus: "Add indexes on user_id and created_at" (union)
```

### 3. Escalation Strategy

```yaml
when:
  - Critical conflict (affects security/data)
  - No clear winner from priority
  - User trust level < 3

process:
  1. Pause execution
  2. Present conflict to user via AskUserQuestion
  3. Format: "Conflicto detectado entre {agent_1} y {agent_2}..."
  4. Options: [Agent 1 approach] | [Agent 2 approach] | [Hybrid] | [Ask me later]
  5. Resume with selected approach
```

---

## Conflict Detection

### Pre-Execution Detection

Before Phase 5 (Execution), check for potential conflicts:

```yaml
checks:
  - file_overlap: Do multiple subtasks touch same file?
  - strategy_clash: Do agents recommend incompatible approaches?
  - resource_contention: Do agents need exclusive resources?

if_detected:
  - Reorder subtasks to avoid conflict
  - Or flag for resolution before execution
```

### Runtime Detection

During Phase 5 (Execution), monitor for conflicts:

```yaml
monitors:
  - file_write_collision: Two writes to same file
  - output_contradiction: Outputs that negate each other
  - state_mutation: Conflicting state changes

if_detected:
  - Pause execution
  - Apply resolution strategy
  - Resume or rollback
```

---

## Resolution Matrix

| Conflict Type | Agent 1 Priority | Agent 2 Priority | Resolution |
|---------------|------------------|------------------|------------|
| Output | CRITICAL | Any | Agent 1 wins |
| Output | Same | Same | Consensus |
| Resource | Any | Any | Sequential + merge |
| Strategy | CRITICAL | HIGH | Agent 1 wins |
| Strategy | HIGH | HIGH | Escalate to user |
| Strategy | LOW | LOW | Either (log decision) |

---

## Implementation in Orchestrator

### Phase 3 (Decomposition)
```yaml
action: Detect potential conflicts in subtask list
output: Flag conflicting subtasks for resolution
```

### Phase 4 (Planning)
```yaml
action: Resolve strategy conflicts before execution
output: Unified plan with no conflicts
```

### Phase 5 (Execution)
```yaml
action: Monitor for runtime conflicts
output: Pause and resolve if detected
```

### Phase 7 (Consolidation)
```yaml
action: Log conflict resolutions for learning
output: Update conflict patterns in memory
```

---

## Logging

All conflict resolutions are logged to `.claude/state/decisions.jsonl`:

```json
{
  "timestamp": "2025-01-29T10:30:00Z",
  "type": "conflict_resolution",
  "conflictType": "strategy",
  "agents": ["security-scanner", "performance-profiler"],
  "strategy": "escalation",
  "resolution": "user_choice",
  "userChoice": "security-scanner",
  "reason": "User prioritized security over performance"
}
```

---

## User Trust Integration

Conflict resolution behavior adapts to user trust level:

| Trust Level | Behavior |
|-------------|----------|
| 1-2 | Always escalate conflicts to user |
| 3 | Auto-resolve LOW/MEDIUM, escalate HIGH/CRITICAL |
| 4 | Auto-resolve up to HIGH, escalate CRITICAL |
| 5 | Auto-resolve all, notify user of decisions |

---

*Part of Orchestrator v3.7 - Conflict Resolution Module*
