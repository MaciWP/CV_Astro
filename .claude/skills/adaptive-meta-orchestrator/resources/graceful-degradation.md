# Graceful Degradation - Orchestrator v3.7

> Reference: `.claude/config/orchestrator-settings.json` → `features.gracefulDegradation`

## Purpose

When specialized agents/tools fail or are unavailable, gracefully fall back to simpler approaches while maintaining quality.

---

## 5 Degradation Levels

```
Level 1: FULL ORCHESTRATION (optimal)
    ↓ (if fails)
Level 2: REDUCED ORCHESTRATION (fewer agents)
    ↓ (if fails)
Level 3: SINGLE AGENT (best-fit agent only)
    ↓ (if fails)
Level 4: HEURISTIC FALLBACK (rule-based)
    ↓ (if fails)
Level 5: DIRECT RESPONSE (no orchestration)
```

---

## Level Details

### Level 1: Full Orchestration (Optimal)

```yaml
description: All 8 phases execute, all agents available
when: Normal operation, no failures
agents: Full complement (specialized + validators)
quality: 100%
speed: Baseline

example:
  - Phase 0: Pre-Analysis ✓
  - Phase 1: 4 parallel agents ✓
  - Phase 2: Context loader ✓
  - Phase 3: task-lister + task-decomposer ✓
  - Phase 4: plan-iterator with HITL ✓
  - Phase 5: Multi-agent execution ✓
  - Phase 6: Full validation ✓
  - Phase 7: Consolidation + learning ✓
```

### Level 2: Reduced Orchestration

```yaml
description: Core phases only, skip non-critical agents
when: Timeout on non-critical agents, token budget tight
agents: Core only (backend-expert, frontend-expert, testing-agent)
quality: 85%
speed: 1.5x faster

skipped:
  - Phase 0: Cache check only (no budget analysis)
  - Phase 3: Skip task-lister, use task-decomposer directly
  - Phase 6: Quality gates only (skip full validation)
  - Phase 7: Skip pattern detection, basic logging only

example:
  User: "Add translation key"
  → Skip detailed analysis
  → Use i18n-manager directly
  → Basic validation
  → Done
```

### Level 3: Single Agent

```yaml
description: Best-fit agent handles entire task
when: Multiple agent failures, high urgency
agents: 1 (most relevant to task)
quality: 70%
speed: 3x faster

selection_criteria:
  - Keyword match score
  - Historical success rate for task type
  - Agent availability

example:
  User: "Fix N+1 query in UserViewSet"
  Keywords: ["N+1", "query", "ViewSet"]
  Best fit: backend-expert (highest match)
  → Single agent execution
  → Basic validation
  → Done
```

### Level 4: Heuristic Fallback

```yaml
description: Rule-based response without agents
when: All agent invocations fail, MCP unavailable
agents: None
quality: 50%
speed: 5x faster

heuristics:
  - Pattern matching from known solutions
  - Template-based responses
  - Historical similar requests

example:
  User: "Add index to model"
  Pattern: "add index" → template response
  Response: "Based on common patterns, add db_index=True to the field..."
  → No agent, no validation
  → Warn user about reduced quality
```

### Level 5: Direct Response

```yaml
description: Direct LLM response, no orchestration
when: Catastrophic failure, emergency fallback
agents: None
quality: 30%
speed: 10x faster

behavior:
  - Skip all phases
  - Respond directly from LLM knowledge
  - Log as degraded response
  - Recommend retry later

example:
  System: "Multiple failures detected, falling back to direct response"
  User: "Create component"
  Response: "Here's a basic component template: ..."
  Warning: "⚠️ This response was generated without full orchestration. Quality may be reduced."
```

---

## Degradation Triggers

### Automatic Triggers

```yaml
level_2_triggers:
  - agent_timeout > 30s
  - token_budget > 80%
  - non_critical_agent_failure

level_3_triggers:
  - 2+ agent failures in sequence
  - token_budget > 90%
  - user_urgency_signal: "quick", "fast", "urgente"

level_4_triggers:
  - all_agents_failed
  - mcp_unavailable
  - token_budget > 95%

level_5_triggers:
  - catastrophic_error
  - system_overload
  - user_explicit_request: "just answer directly"
```

### Manual Triggers

User can force degradation level:
- `/quick` → Level 3 (single agent)
- `/direct` → Level 5 (no orchestration)

---

## Recovery

After degradation, attempt recovery:

```yaml
recovery_strategy:
  check_interval: 60s

  level_5_to_4:
    condition: Basic pattern matching works
    action: Enable heuristics

  level_4_to_3:
    condition: At least 1 agent responds
    action: Enable single agent mode

  level_3_to_2:
    condition: Core agents available
    action: Enable reduced orchestration

  level_2_to_1:
    condition: All systems nominal
    action: Enable full orchestration
```

---

## Quality Indicators

Show user current degradation state:

```
Level 1: ✅ Full orchestration active
Level 2: ⚡ Reduced orchestration (faster, slightly less thorough)
Level 3: 🔧 Single agent mode (fast, basic quality)
Level 4: 📋 Heuristic mode (very fast, limited quality)
Level 5: ⚠️ Direct response (emergency fallback)
```

---

## Logging

All degradation events logged to `.claude/state/decisions.jsonl`:

```json
{
  "timestamp": "2025-01-29T10:30:00Z",
  "type": "degradation",
  "previousLevel": 1,
  "newLevel": 3,
  "trigger": "agent_timeout",
  "failedAgent": "security-scanner",
  "taskId": "task_abc123",
  "recoveryPlan": "retry_in_60s"
}
```

---

## Configuration

In `.claude/config/orchestrator-settings.json`:

```json
{
  "gracefulDegradation": {
    "enabled": true,
    "levels": 5,
    "fallbackToHeuristics": true,
    "autoRecover": true,
    "recoveryInterval": 60,
    "notifyUser": true
  }
}
```

---

## Integration with Trust Levels

| Trust Level | Max Auto-Degradation | Notify User |
|-------------|---------------------|-------------|
| 1-2 | Level 2 | Always |
| 3 | Level 3 | Level 3+ |
| 4 | Level 4 | Level 4+ |
| 5 | Level 5 | Never (silent) |

---

*Part of Orchestrator v3.7 - Graceful Degradation Module*
