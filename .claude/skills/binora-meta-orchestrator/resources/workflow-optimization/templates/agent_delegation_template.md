# Agent Delegation Template

**Copy-paste template for delegating work to specialized agents in Claude Code.**

---

## Basic Agent Invocation

```
@{{AGENT_NAME}}: "{{CLEAR_TASK_DESCRIPTION}}"
```

**Placeholders**:
- `{{AGENT_NAME}}`: One of the 3 documentation agents
- `{{CLEAR_TASK_DESCRIPTION}}`: Specific, actionable task with success criteria

---

## Available Agents (EasyBoard)

| Agent | Purpose | Typical Duration |
|-------|---------|------------------|
| **@bug-documenter** | Document bugs with root causes, solutions, prevention patterns | 3-5 min |
| **@decision-documenter** | Maintain feature specs, design decisions in AI_PRODUCT_DECISIONS.md | 3-5 min |
| **@progress-tracker** | Track development progress, sync with product decisions | 3-4 min |

**Note**: These are the ONLY agents in EasyBoard project. For other tasks, use skills or manual implementation.

---

## Pre-Delegation Checklist

**ALWAYS verify before delegating:**

- [ ] **Duration**: Task >5 minutes? (If <5min, use skill instead)
- [ ] **Independence**: Task can run independently? (No dependencies on other work)
- [ ] **Clear success criteria**: Agent knows when task is complete?
- [ ] **Correct agent**: Agent specializes in this domain?
- [ ] **Count**: Delegating to 2-5 agents? (>5 = exponential complexity)

**If ANY answer is NO**: Reconsider delegation (use skill or manual implementation).

---

## Template 1: Document Bug (@bug-documenter)

```
@bug-documenter: "Document {{BUG_ID}} ({{BUG_SYMPTOM}}) with root cause analysis, solution, and prevention pattern in AI_BUGS_KNOWLEDGE.md"
```

### Example:
```
@bug-documenter: "Document BUG-2025102801 (ONNX FP16 incompatible with Float32List) with root cause analysis, solution (convert_fp16_to_fp32_io.py script), and prevention pattern (always check tensor dtype compatibility)"
```

### Checklist:
- [ ] Bug ID provided? (e.g., BUG-2025102801)
- [ ] Symptom described? (e.g., "Runtime error: Expected FP16, got FP32")
- [ ] Solution known? (e.g., "Use conversion script")
- [ ] Prevention pattern identified? (e.g., "Check dtype before inference")

---

## Template 2: Document Feature (@decision-documenter)

```
@decision-documenter: "Document FEATURE-{{ID}} ({{FEATURE_NAME}}) in AI_PRODUCT_DECISIONS.md with: feature specification, expected behavior of buttons/screens, user flows, and design decisions"
```

### Example:
```
@decision-documenter: "Document FEATURE-017 (Statistics Dashboard) in AI_PRODUCT_DECISIONS.md with: fl_chart implementation, win rate trends display, match history list, CSV export button (premium-only), entry from MainScreen Profile tab"
```

### Checklist:
- [ ] Feature ID provided? (e.g., FEATURE-017)
- [ ] Feature name clear? (e.g., "Statistics Dashboard")
- [ ] Key components listed? (e.g., "fl_chart, CSV export")
- [ ] Entry point specified? (e.g., "MainScreen Profile tab")

---

## Template 3: Update Progress (@progress-tracker)

```
@progress-tracker: "{{ACTION}} FEATURE-{{ID}} ({{FEATURE_NAME}}) in AI_PROGRESS_TRACKER.md: {{DETAILS}}"
```

### Actions:
- `Mark as completed` - Feature finished, tests passing
- `Move to in-progress` - Starting work now
- `Mark as blocked` - Dependency preventing progress
- `Generate sprint summary` - Current week status

### Example 1: Mark Complete
```
@progress-tracker: "Mark FEATURE-019 (Dark Mode) as completed in AI_PROGRESS_TRACKER.md: All screens updated with ThemeNotifier, Material Design 3 colors, persistence with SharedPreferences, tests passing (82% coverage)"
```

### Example 2: Sprint Summary
```
@progress-tracker: "Generate sprint summary for 2025-W43 in AI_PROGRESS_TRACKER.md with: completion percentages, velocity (features/week), blockers resolved, test coverage metrics, next priorities"
```

### Checklist:
- [ ] Action specified? (complete, in-progress, blocked, summary)
- [ ] Feature ID provided (if applicable)?
- [ ] Details included? (what changed, metrics)
- [ ] Next steps clear? (for blocked items)

---

## Parallel Agent Delegation (2-5 Agents)

**When to Use Parallel**: Multiple independent subtasks, each >5min

### Template:
```
🎯 SKILL COORDINATION
- Task Type: {{TASK_TYPE}} (documentation, analysis, etc.)
- Complexity: HIGH ({{N}} independent subtasks)
- Strategy: Parallel agent delegation

Launching {{N}} agents in parallel:

1️⃣ @{{AGENT_1}}: "{{TASK_1}}"

2️⃣ @{{AGENT_2}}: "{{TASK_2}}"

3️⃣ @{{AGENT_3}}: "{{TASK_3}}"

[All {{N}} agents run simultaneously, ~{{DURATION}}min each]

Total time: ~{{MAX_DURATION}}min (vs {{SEQUENTIAL_TIME}}min sequential = {{SPEEDUP}}x faster)
```

### Example: Sprint Documentation
```
🎯 SKILL COORDINATION
- Task Type: Documentation (multi-file analysis)
- Complexity: HIGH (3 independent subtasks)
- Strategy: Parallel agent delegation (optimal: 3 agents)

Launching 3 agents in parallel:

1️⃣ @decision-documenter: "Analyze AI_PRODUCT_DECISIONS.md and list all features marked as completed in Sprint 2025-W43. For each feature, extract: ID, name, completion date, key components."

2️⃣ @bug-documenter: "Analyze AI_BUGS_KNOWLEDGE.md and list all bugs fixed in Sprint 2025-W43. For each bug, extract: ID, symptom, root cause, solution, prevention pattern."

3️⃣ @progress-tracker: "Generate sprint summary for 2025-W43 with: completion percentages, velocity (features/week), blockers resolved, next priorities."

[All 3 agents run simultaneously, ~3-4min each]

Total time: ~4min (vs 12min sequential = 3x faster)
```

---

## Dependency Management

**Sequential Execution Required When**:
- Task B depends on Task A output
- Linear workflow (A → B → C)
- Data must be generated before next step

### Template:
```
🧩 WORKFLOW PLANNING
- Complexity: HIGH (dependent tasks)
- Dependency Graph:
  Task 1: {{FIRST_TASK}}
    ↓ (Task 2 depends on {{DEPENDENCY}})
  Task 2: {{SECOND_TASK}}

⚡ TOOL OPTIMIZATION
- Strategy: SEQUENTIAL (Task 2 depends on Task 1)
- NO PARALLEL AGENTS (dependency prevents parallelism)

---

Step 1: {{FIRST_TASK}}
[Manual implementation or agent]
Time: {{DURATION_1}}min
Result: ✅ {{DEPENDENCY}} exists

---

Step 2: {{SECOND_TASK}}
[Now safe to proceed]
Time: {{DURATION_2}}min
Result: ✅ {{FINAL_OUTPUT}}

---

TOTAL TIME: {{TOTAL}}min (sequential)
```

---

## Common Mistakes to Avoid

### Mistake 1: Delegating <5min Tasks

```
❌ BAD:
@bug-documenter: "Add one line to AI_BUGS_KNOWLEDGE.md"
Overhead: 2min agent invocation > 1min task

✅ GOOD:
Manual edit (Edit tool): 30s
```

### Mistake 2: Vague Task Description

```
❌ BAD:
@decision-documenter: "Document the Statistics feature"
Missing: What aspects? Expected behavior? User flows?

✅ GOOD:
@decision-documenter: "Document FEATURE-017 (Statistics Dashboard) with: fl_chart implementation, win rate trends, match history list, CSV export (premium-only), entry from Profile tab"
```

### Mistake 3: Too Many Agents (>5)

```
❌ BAD: 10 agents for 10 subtasks
Coordination channels: 45
Overhead: Exponential
Time: 8min (worse than 5min with 5 agents)

✅ GOOD: Batch 10 subtasks into 2 groups of 5
Group 1: 5 agents (4min)
Group 2: 5 agents (4min)
Total: 8min sequential groups, but manageable
```

### Mistake 4: Parallel When Dependent

```
❌ BAD:
1️⃣ @agent1: "Refactor CameraService interface"
2️⃣ @agent2: "Update screens with CameraServiceInterface"  ← Depends on #1!
Result: Agent 2 fails (interface doesn't exist yet)

✅ GOOD:
Step 1: Refactor CameraService (manual/agent1)
Step 2: Update screens (manual/agent2, AFTER Step 1 complete)
```

---

## Decision Algorithm

```python
def should_delegate_to_agent(task):
    # Check duration
    if estimated_duration < 5min:
        return False  # Use skill or manual

    # Check independence
    if has_dependencies():
        return False  # Sequential execution required

    # Check agent availability
    if agent_exists_for_domain(task):
        # Check agent count
        if total_agents_planned <= 5:
            return True  # ✅ Delegate
        else:
            return "Batch into groups of 5"  # ⚠️ Too many
    else:
        return False  # No agent for this domain
```

---

## Checklist: Ready to Delegate?

Before delegating, verify:

- [ ] Task duration >5 minutes?
- [ ] Task is independent (no dependencies)?
- [ ] Success criteria clear?
- [ ] Correct agent for domain?
- [ ] Total agents ≤5 (or batched)?
- [ ] Task description specific and actionable?

**If 5+ answers are YES**: Proceed with delegation using template above.
**If 2+ answers are NO**: Use skill or manual implementation instead.

---

**Last Updated**: 2025-10-28
**Use Case**: Delegate documentation/analysis tasks to specialized agents
**Optimal Agent Count**: 2-5 (research-backed, >5 = O(n²) coordination overhead)
**Speedup**: 3-4x faster for multi-step parallel workflows
