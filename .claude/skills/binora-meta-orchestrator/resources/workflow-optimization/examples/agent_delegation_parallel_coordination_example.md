# Agent Delegation & Parallel Coordination Example

This example demonstrates how to effectively delegate work to multiple agents in parallel, achieving 3-4x speedup for complex multi-step workflows.

---

## When to Delegate to Agents

| Factor | Use Skills | Use Agents |
|--------|-----------|------------|
| **Duration** | <5 minutes | >5 minutes |
| **Subtasks** | Sequential or single | Independent, parallel |
| **Files** | 1-2 files | 3+ files |
| **Complexity** | Low (single domain) | High (multi-domain) |
| **Count** | 1-2 skills | 2-5 agents (optimal) |

**Key Rule**: 2-5 agents optimal (research shows >5 = exponential complexity)

---

## Scenario: Sprint Documentation

**Goal**: Document completed sprint with features, bugs fixed, and progress metrics

### ❌ ANTI-PATTERN: Sequential Documentation (12 minutes)

```
User: "Document this sprint: features completed, bugs fixed, progress"

Claude (Message 1): Let me check AI_PRODUCT_DECISIONS.md...
[Reads file, searches for completed features]
[Manually identifies 3 features: Statistics, Camera Service, Dark Mode]
[Writes feature summary]
Time: 4 minutes

Claude (Message 2): Now let me check AI_BUGS_KNOWLEDGE.md...
[Reads file, searches for bugs fixed this sprint]
[Identifies 5 bugs: BUG-001, BUG-002, ...]
[Writes bug summary with root causes]
Time: 4 minutes

Claude (Message 3): Finally, let me check AI_PROGRESS_TRACKER.md...
[Reads file, calculates completion percentages]
[Updates progress metrics, velocity]
[Writes progress summary]
Time: 4 minutes

TOTAL TIME: 12 minutes (sequential)
WORKLOAD: Claude does everything manually
BOTTLENECK: Single-threaded execution
```

### ✅ CORRECT: Parallel Agent Delegation (4 minutes)

```
User: "Document this sprint: features completed, bugs fixed, progress"

Claude:
🎯 SKILL COORDINATION
- Task Type: Documentation (multi-file analysis)
- Complexity: High (3 independent subtasks, >5min each)
- Strategy: Parallel agent delegation (optimal: 3 agents)

⚡ AGENT DELEGATION - PARALLEL EXECUTION

Launching 3 agents in parallel:

1️⃣ @decision-documenter: "Analyze AI_PRODUCT_DECISIONS.md and list all features marked as completed in Sprint 2025-W43. For each feature, extract: ID, name, completion date, key components."

2️⃣ @bug-documenter: "Analyze AI_BUGS_KNOWLEDGE.md and list all bugs fixed in Sprint 2025-W43. For each bug, extract: ID, symptom, root cause, solution, prevention pattern."

3️⃣ @progress-tracker: "Generate sprint summary for 2025-W43 with: completion percentages, velocity (features/week), blockers resolved, next priorities."

[All 3 agents run simultaneously]

---

[Agent 1 Returns after 3.5 minutes]:
Features Completed (Sprint 2025-W43):
- FEATURE-017: Statistics Dashboard (Oct 25, StatisticsScreen + fl_chart)
- FEATURE-018: Camera Service DI (Oct 26, CameraService interface refactor)
- FEATURE-019: Dark Mode (Oct 27, ThemeNotifier + Material Design 3 colors)

[Agent 2 Returns after 4 minutes]:
Bugs Fixed (Sprint 2025-W43):
- BUG-2025102501: Isar query slow (root cause: missing @Index, solution: added @Index(), 22.5x faster)
- BUG-2025102502: StateError in deleteGame (root cause: no orElse, solution: added null check)
- BUG-2025102601: ONNX FP16 incompatible (root cause: Float32List mismatch, solution: FP16→FP32 I/O conversion)
- BUG-2025102701: Camera dispose crash (root cause: CameraController not disposed, solution: @override dispose())
- BUG-2025102801: Memory leak in providers (root cause: missing ref.onDispose, solution: added cleanup)

[Agent 3 Returns after 3 minutes]:
Sprint 2025-W43 Summary:
- Completion: 14/20 features (70%)
- Velocity: 3 features/week (up from 2.5)
- Blockers Resolved: 5/5 (100%)
- Test Coverage: 82% (up from 78%)
- Next Priority: FEATURE-020 (Cloud Sync)

---

Claude (Synthesis):
✅ SPRINT 2025-W43 COMPLETE

**Features Delivered** (3):
1. FEATURE-017: Statistics Dashboard
2. FEATURE-018: Camera Service DI Refactor
3. FEATURE-019: Dark Mode Implementation

**Bugs Fixed** (5):
- BUG-2025102501: Isar query optimization (22.5x faster)
- BUG-2025102502: StateError null safety
- BUG-2025102601: ONNX FP16 compatibility
- BUG-2025102701: Camera disposal
- BUG-2025102801: Provider memory leak

**Progress Metrics**:
- 70% overall completion (14/20 features)
- Velocity: 3 features/week (+20% improvement)
- Test coverage: 82% (target: >80%)

**Next Sprint**: FEATURE-020 (Cloud Sync) is top priority.

TOTAL TIME: 4 minutes (longest agent: 4min)
SPEEDUP: 3x faster (12min → 4min)
WORKLOAD: Distributed across 3 specialized agents
```

---

## Agent Coordination Breakdown

### Step 1: Task Classification

```
📊 REQUEST ANALYSIS
- Prompt Quality: 75/100 (clear goal, specific deliverables)
- Task Type: Documentation (multi-file analysis)

🧩 WORKFLOW PLANNING
- Complexity: HIGH (3 independent subtasks, ~12min sequential)
- Files: 3 (AI_PRODUCT_DECISIONS.md, AI_BUGS_KNOWLEDGE.md, AI_PROGRESS_TRACKER.md)
- Dependencies: None (subtasks independent)
```

### Step 2: Agent Selection

```
🎯 SKILL COORDINATION
- Option 1: Skills (manual analysis)
  ❌ Time: 12min sequential
  ❌ Workload: High (Claude does everything)

- Option 2: 1 General Agent (sequential)
  ⚠️ Time: 10min (slightly faster)
  ⚠️ Still sequential bottleneck

- Option 3: 3 Specialized Agents (PARALLEL)
  ✅ Time: 4min (3x speedup)
  ✅ Optimal agent count (2-5 recommended)
  ✅ Workload distributed

Decision: PARALLEL AGENT DELEGATION (3 agents)
```

### Step 3: Workload Distribution

```
Agent 1 (@decision-documenter):
- Task: Extract completed features
- Input: AI_PRODUCT_DECISIONS.md
- Output: Feature list with IDs, names, dates
- Estimated Time: 3-4 minutes

Agent 2 (@bug-documenter):
- Task: Extract fixed bugs
- Input: AI_BUGS_KNOWLEDGE.md
- Output: Bug list with root causes, solutions
- Estimated Time: 4-5 minutes (most data)

Agent 3 (@progress-tracker):
- Task: Calculate sprint metrics
- Input: AI_PROGRESS_TRACKER.md
- Output: Completion %, velocity, priorities
- Estimated Time: 3 minutes
```

### Step 4: Parallel Execution

```
Timeline:
0:00 → Launch all 3 agents simultaneously
3:00 → Agent 3 returns (progress metrics)
3:30 → Agent 1 returns (features list)
4:00 → Agent 2 returns (bugs list)
4:30 → Claude synthesizes results

Total Wall Time: 4.5 minutes
Total Work Time: 10.5 minutes (3 + 3.5 + 4)
Efficiency: 2.3x parallelism (10.5 / 4.5)
```

### Step 5: Result Synthesis

```
Claude combines results:
1. Cross-reference feature IDs (FEATURE-017, -018, -019)
2. Validate bug fix dates (all in Sprint 2025-W43)
3. Correlate velocity with features delivered (3 = on track)
4. Generate unified report (markdown format)

Synthesis Time: 30 seconds
Total Time: 4.5 minutes
```

---

## Real-World Performance Comparison

| Approach | Time | Agents | Speedup | Complexity |
|----------|------|--------|---------|------------|
| ❌ Sequential (manual) | 12 min | 0 | 1x | Low |
| ⚠️ Single agent | 10 min | 1 | 1.2x | Medium |
| ✅ 3 parallel agents | 4 min | 3 | 3x | Optimal |
| ⚠️ 6 parallel agents | 5 min | 6 | 2.4x | Too many! |
| ❌ 10 parallel agents | 8 min | 10 | 1.5x | Exponential overhead |

**Key Insight**: 2-5 agents optimal, >5 = diminishing returns due to coordination overhead (O(n²)).

---

## Scenario 2: Dependent Tasks (Sequential Required)

**Goal**: Refactor CameraService to use DI, then update 3 screens

### ❌ ANTI-PATTERN: Parallel When Dependent (Fails)

```
User: "Refactor CameraService to use constructor DI, then update all screens"

Claude (WRONG): Let me launch agents in parallel...

1️⃣ @agent1: "Refactor CameraService to add CameraServiceInterface"
2️⃣ @agent2: "Update CameraScreen to inject CameraServiceInterface"
3️⃣ @agent3: "Update ValidationScreen to inject CameraServiceInterface"

[All 3 agents run simultaneously]

Result:
- Agent 1: Creates CameraServiceInterface (SUCCESS)
- Agent 2: Fails - CameraServiceInterface doesn't exist yet (FAILURE)
- Agent 3: Fails - CameraServiceInterface doesn't exist yet (FAILURE)

TOTAL TIME: 5 minutes
SUCCESS RATE: 33% (1/3 agents)
WASTED EFFORT: 10 minutes (2 failed agents)
```

### ✅ CORRECT: Sequential When Dependent

```
User: "Refactor CameraService to use constructor DI, then update all screens"

Claude:
🧩 WORKFLOW PLANNING
- Complexity: High (dependent tasks)
- Dependency Graph:
  Task 1: Refactor CameraService (create interface)
    ↓ (Task 2 depends on CameraServiceInterface existing)
  Task 2: Update 3 screens (inject CameraServiceInterface)

⚡ TOOL OPTIMIZATION
- Strategy: SEQUENTIAL (Task 2 depends on Task 1)
- NO PARALLEL AGENTS (dependency prevents parallelism)

---

Step 1: Refactor CameraService
[Manual implementation with flutter-architecture-quality-enforcer skill]
1. Create CameraServiceInterface abstract class
2. Implement CameraService with interface
3. Update providers to use interface
4. Run tests (ensure all pass)

Time: 8 minutes
Result: ✅ CameraServiceInterface exists

---

Step 2: Update Screens (batch operation)
[Grep for old pattern, Edit with new pattern]

Grep("CameraService()", glob="**/*_screen.dart")
→ Finds: CameraScreen, ValidationScreen, NewMatchScreen

Edit each file (parallel Edits, now safe):
- Replace: `CameraService()` with `ref.watch(cameraServiceProvider)`
- Add constructor DI where needed

Time: 3 minutes
Result: ✅ All screens updated

---

TOTAL TIME: 11 minutes (sequential)
SUCCESS RATE: 100% (correct dependencies)
ALTERNATIVE: 5min + 10min wasted = 15min (if parallel attempted)
TIME SAVED: 4 minutes (vs failed parallel attempt)
```

---

## Dependency Management Decision Tree

```
START: Multiple subtasks?
  │
  ├─ NO → Use single skill/manual (low complexity)
  │
  └─ YES → Check dependencies
      │
      ├─ Independent tasks? → PARALLEL AGENTS (2-5 optimal)
      │   │
      │   ├─ 2-5 tasks? → ✅ PARALLEL AGENTS
      │   │
      │   └─ >5 tasks? → ⚠️ Batch into groups of 5
      │
      └─ Dependent tasks? → SEQUENTIAL EXECUTION
          │
          ├─ Linear dependency (A→B→C)? → Sequential stages
          │
          └─ Complex dependencies (A→B, A→C, B→D)?
              → Parallelize within stages:
                Stage 1: A (required first)
                Stage 2: B, C in parallel (depend on A)
                Stage 3: D (depends on B)
```

---

## Checklist: Should I Delegate to Agents?

Before delegating, ask:

1. **Duration Check**:
   - [ ] Is each subtask >5 minutes?
   - [ ] Is total duration >10 minutes?

2. **Independence Check**:
   - [ ] Can subtasks run simultaneously?
   - [ ] No data dependencies between subtasks?
   - [ ] Results can be synthesized after completion?

3. **Agent Count Check**:
   - [ ] Are there 2-5 subtasks? (optimal range)
   - [ ] Not >5 subtasks? (exponential overhead)

4. **Specialization Check**:
   - [ ] Do specialized agents exist for these subtasks?
   - [ ] Are agents @bug-documenter, @decision-documenter, @progress-tracker relevant?

**If 3+ answers are YES**: Delegate to parallel agents (3x speedup)

**If "Independence Check" is NO**: Use sequential execution (no parallelism possible)

---

## Agent Coordination Patterns

### Pattern 1: Parallel Documentation (Independent)

```
User: "Document sprint: features + bugs + progress"

Agents (3 parallel):
- @decision-documenter → Features
- @bug-documenter → Bugs
- @progress-tracker → Progress

Dependency: None (independent)
Time: 4 min (vs 12 min sequential)
Speedup: 3x
```

### Pattern 2: Research & Implement (Sequential)

```
User: "Research 3 state management approaches, then implement best one"

Stage 1: Research (parallel)
- @agent1 → Research Riverpod
- @agent2 → Research Bloc
- @agent3 → Research Provider

Stage 2: Decide (manual)
- Compare results → Choose Riverpod

Stage 3: Implement (skills)
- Skill(riverpod-state-management) → Implement

Time: 15 min (5 research + 2 decide + 8 implement)
```

### Pattern 3: Refactor & Update (Sequential with Batch)

```
User: "Refactor Service, then update 10 screens"

Stage 1: Refactor Service (manual)
- Create interface, update implementation
- Time: 10 min

Stage 2: Update Screens (batch)
- Grep for old pattern
- Edit 10 files in parallel (Batch Edit)
- Time: 3 min

Total: 13 min (vs 40 min sequential manual edits)
```

---

## Common Mistakes

### Mistake 1: Too Many Agents (>5)

```
❌ BAD: Launch 10 agents for 10 subtasks
Result: Exponential coordination overhead (45 communication channels)
Time: 8 min (vs 5 min with 5 agents)

✅ GOOD: Batch 10 subtasks into 2 groups of 5
Result: 5 agents per group, sequential groups
Time: 6 min (optimal)
```

### Mistake 2: Parallel When Dependent

```
❌ BAD: Parallel agents for "Refactor A, then update B"
Result: Agent B fails (dependency not met)
Wasted: 5 min

✅ GOOD: Sequential "Refactor A → Update B"
Result: Both succeed
Time: 11 min (correct)
```

### Mistake 3: Agents for <5min Tasks

```
❌ BAD: @agent "Add logging to this function"
Result: Agent overhead > task complexity
Time: 3 min (2 min agent + 1 min task)

✅ GOOD: Skill(logging-service-enforcer) + manual
Result: Direct implementation
Time: 1 min
```

### Mistake 4: No Result Synthesis

```
❌ BAD: 3 agents return results → present raw to user
Result: User must correlate data manually

✅ GOOD: 3 agents return results → Claude synthesizes → unified report
Result: Single cohesive document
Time: +30s synthesis, much better UX
```

---

## Best Practices Summary

1. **2-5 agents optimal** (research-backed, >5 = exponential overhead)
2. **Check dependencies** (parallel only if independent)
3. **Distribute workload** (balance agent tasks ~3-5min each)
4. **Synthesize results** (don't dump raw agent outputs)
5. **Fallback to skills** (agents for >5min tasks, skills for <5min)

---

## Performance Metrics

| Agents | Communication Channels | Overhead | Speedup | Efficiency |
|--------|------------------------|----------|---------|------------|
| 1 | 0 | 0% | 1x | 100% |
| 2 | 1 | 5% | 1.9x | 95% |
| 3 | 3 | 10% | 2.7x | 90% |
| 5 | 10 | 20% | 4.0x | 80% |
| 10 | 45 | 50% | 5.0x | 50% |

**Formula**: Communication channels = n × (n-1) / 2
**Key Insight**: Speedup saturates at 5 agents, efficiency drops sharply after 5.

---

**Last Updated**: 2025-10-28
**Performance Impact**: 3-4x speedup for multi-step documentation/analysis tasks
**Applies To**: Sprint documentation, multi-domain research, batch operations
**Optimal Agent Count**: 2-5 (research-backed)