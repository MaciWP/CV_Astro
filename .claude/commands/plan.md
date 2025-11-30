---
description: Execute Phase 1-3 (evaluation + planning) and show plan before execution
---

# Plan Task Before Execution

**Analyzes your request, scores complexity, and shows a detailed plan before executing.**

## Usage

```
/plan [your task description]
```

Or just `/plan` and then describe what you want.

---

## What This Command Does

Executes **Phases 1-3** of the Orchestrator workflow:

```
Phase 1: EVALUATION (parallel)
  ├── Detect keywords (CRITICAL/HIGH/MEDIUM/LOW)
  ├── Score complexity (0-100)
  ├── Assess prompt quality
  └── Calculate confidence level

Phase 2: CONTEXT LOADING
  └── Load minimal required context

Phase 3: PLANNING
  ├── List 3-7 high-level tasks
  ├── Decompose into subtasks (if complex)
  ├── Analyze dependencies
  ├── Select optimal tools
  └── Determine execution strategy
```

**Then STOPS and shows you the plan before executing.**

---

## Output Format

After running `/plan`, you'll see:

```
## ANALYSIS

| Metric | Value |
|--------|-------|
| Complexity | 65/100 (HIGH) |
| Confidence | 85% |
| Strategy | Hybrid (seq + parallel) |
| Estimated Duration | ~5 minutes |

## PLAN

1. [T1] First task
   - Tools: Read, Grep
   - Duration: ~30s

2. [T2] Second task (depends on T1)
   - Tools: Edit
   - Duration: ~1min

3. [T3] Third task (parallel with T2)
   - Tools: agent:seo-optimizer
   - Duration: ~2min

## EXECUTION ORDER

T1 → [T2, T3] (parallel) → Done

---

¿Ejecuto este plan? (sí/no)
```

---

## When to Use

Use `/plan` when:

- **Complex tasks** - Multiple files, agents, or steps
- **Uncertain scope** - Want to see what Claude will do first
- **Learning** - Understand how the orchestrator works
- **Validation** - Verify the approach before execution

---

## Examples

### Example 1: Feature Implementation

```
/plan Add dark mode toggle to the navigation
```

Output:
```
Complexity: 55/100 (MEDIUM)
Tasks:
1. Analyze current navigation structure
2. Create dark mode state management
3. Add toggle component
4. Apply CSS/Tailwind dark variants
5. Test functionality
```

### Example 2: Performance Optimization

```
/plan Optimize Lighthouse LCP score
```

Output:
```
Complexity: 70/100 (HIGH)
Tasks:
1. Run Lighthouse audit
2. Identify LCP bottlenecks
3. Optimize hero image (WebP, sizes)
4. Add preload hints
5. Validate improvement
```

### Example 3: Bug Investigation

```
/plan Debug why translations aren't loading in production
```

Output:
```
Complexity: 45/100 (MEDIUM)
Tasks:
1. Check i18n configuration
2. Verify locale files exist
3. Analyze build output
4. Test SSR vs CSR loading
5. Propose fix
```

---

## After Planning

Once you see the plan:

- **"sí" / "yes" / "adelante"** → Execute the plan
- **"no"** → Cancel and discuss alternatives
- **"modifica X"** → Adjust specific steps
- **Ask questions** → Clarify before proceeding

---

## Comparison: With vs Without /plan

| Aspect | Without /plan | With /plan |
|--------|---------------|------------|
| Visibility | Claude just executes | See plan first |
| Control | Trust Claude's judgment | Approve before execution |
| Speed | Faster (no pause) | Slightly slower |
| Risk | Higher (might do wrong thing) | Lower (can catch mistakes) |

**Recommendation**: Use `/plan` for complex tasks, skip for simple ones.

---

## Technical Details

**Agents invoked** (Phase 1 - parallel):
- `phase-1a-keyword-detector`
- `phase-1b-complexity-scorer`
- `phase-1c-prompt-quality`
- `phase-1d-confidence-assessor`

**Agents invoked** (Phase 3 - if complexity >40):
- `phase-3a-task-lister`
- `phase-3b-task-decomposer` (if complexity >60)
- `phase-3-dependency-analyzer`
- `phase-3-tool-selector`
- `phase-3-strategy-determiner`

**Total token cost**: ~2-4K tokens for planning

---

**Version**: 1.0.0
**Category**: orchestrator
**Phases**: 1-3 (Evaluation + Planning)
