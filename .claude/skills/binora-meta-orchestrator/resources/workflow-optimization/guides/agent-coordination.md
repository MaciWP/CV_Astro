# Agent Coordination Intelligence

**Parallel orchestration strategies + complexity thresholds for optimal agent delegation.**

---

## Overview

This reference covers:
- When to use Skills vs Agents
- Parallel orchestration (2-5 agents optimal)
- Dependency graphs for sequencing
- Complexity thresholds and warnings
- Workload distribution strategies

**Usage**: Referenced from `SKILL.md` Phase 3 (Skill Coordination) for agent delegation decisions.

---

## Skills vs Agents Decision Matrix

### When to Use Skills

**Characteristics**:
- Real-time guidance (<5min response)
- Single domain expertise
- Enforcement of patterns/anti-patterns
- Immediate feedback during coding

**Use Cases**:
- Architecture review (flutter-architecture-quality-enforcer)
- State management guidance (riverpod-state-management)
- Database query optimization (isar-database-patterns, database-query-reviewer)
- Security audits (security-auditor)
- Accessibility compliance (accessibility-enforcer)

**Example**:
```
User: "How do I create an AsyncNotifier provider?"

Decision: USE SKILL
- Task type: Question (guidance needed)
- Complexity: Low (single file, ~15min)
- Domain: State management
- Response time: <2min

Action: Skill(riverpod-state-management)
```

### When to Use Agents

**Characteristics**:
- Complex multi-step workflows (>5min)
- Parallel subtasks (can run independently)
- File generation/modification
- Comprehensive analysis requiring multiple operations

**Use Cases**:
- Documentation (bug-documenter, decision-documenter, progress-tracker)
- Complex refactoring (multiple files, dependency updates)
- Parallel research (investigate 5 different approaches)
- Batch operations (update 20 files with same pattern)

**Example**:
```
User: "Document the Statistics feature in product decisions"

Decision: USE AGENT
- Task type: Documentation (multi-file analysis)
- Complexity: Medium (analyze screens, extract UI elements, document flows)
- Duration: ~10min
- Can run asynchronously

Action: @decision-documenter: "Document Statistics feature..."
```

### Decision Algorithm

```
IF task_duration < 5min AND single_domain:
  → USE SKILL (real-time guidance)

ELSE IF task_duration > 5min AND multi_step:
  IF subtasks_independent AND count(subtasks) <= 5:
    → USE AGENTS (parallel execution)
  ELSE IF subtasks_sequential OR count(subtasks) > 5:
    → USE SKILL + Manual breakdown (avoid complexity explosion)

ELSE:
  → USE SKILL (default to simpler approach)
```

---

## Parallel Orchestration

### Optimal Agent Count: 2-5

**Research Finding**: 2-5 agents optimal, >5 agents = exponential complexity increase.

**Why?**
- Coordination overhead grows O(n²)
- 5 agents = 10 communication channels
- 10 agents = 45 communication channels
- Result: Diminishing returns, increased failure rate

### Parallel Execution Strategy

**Pattern**: Launch agents concurrently, collect results, synthesize.

**Example - Parallel Documentation**:
```
User: "Document current sprint: features completed, bugs fixed, progress"

🤖 AGENT COORDINATION
- Complexity: High (3 independent subtasks)
- Strategy: Parallel agent delegation

Launching in parallel:
1. @progress-tracker: "Generate sprint summary with completion percentages"
2. @decision-documenter: "List features completed this sprint with specs"
3. @bug-documenter: "List bugs fixed this sprint with root causes"

[All 3 agents run simultaneously, ~3min each]

Synthesis:
- Collected results from 3 agents
- Cross-referenced feature IDs
- Generated unified sprint report
- Total time: ~4min (vs 12min sequential)
```

### Dependency Management

**Problem**: Some tasks depend on others completing first.

**Solution**: Dependency graph + sequential execution for dependent tasks.

**Example - Dependent Tasks**:
```
User: "Refactor CameraService to use constructor DI, then update all screens"

🤖 AGENT COORDINATION
- Complexity: High (2 dependent tasks)
- Strategy: Sequential execution (Task 2 depends on Task 1)

Dependency Graph:
  Task 1: Refactor CameraService (add interface, constructor DI)
    ↓ (Task 2 depends on new CameraServiceInterface)
  Task 2: Update screens (inject CameraServiceInterface via constructor)

Execution:
1. Task 1: Complete CameraService refactor (manual, ~10min)
2. Validate: CameraServiceInterface exists, tests pass
3. Task 2: Update 3 screens with Grep + Edit (batch operation, ~5min)

Total: ~15min sequential (cannot parallelize due to dependency)
```

---

## Complexity Thresholds

### Low Complexity (1 Skill)

**Criteria**:
- Single file
- <15min duration
- Confidence >90%

**Example**: "Add logging to this function"
**Action**: Skill(logging-service-enforcer) + direct implementation

### Medium Complexity (2-3 Skills OR 1 Agent)

**Criteria**:
- 2-3 files
- 15-45min duration
- Confidence 70-90%

**Example**: "Create provider for game collection with Isar integration"
**Action**:
- Skill(riverpod-state-management) for provider patterns
- Skill(isar-database-patterns) for database operations
- Manual implementation with skill guidance

### High Complexity (3+ Skills OR 2-5 Agents)

**Criteria**:
- 4+ files
- >45min duration
- Confidence <70%

**Example**: "Implement dark mode across entire app"
**Action**:
- Skill(flutter-architecture-quality-enforcer) for architecture review
- Skill(accessibility-enforcer) for WCAG contrast validation
- Skill(testing-enforcer) for test coverage
- Consider agent for batch color replacement (20+ files)

### Very High Complexity (>5 Agents - WARNING)

**Criteria**:
- 10+ files
- >2 hours duration
- Coordination overhead > benefit

**Example**: "Refactor entire codebase to use new architecture"
**Action**: ⚠️ WARN USER about complexity
- Break down into phases (Phase 1: Services, Phase 2: Screens, etc.)
- Execute phases sequentially
- Use agents sparingly (max 5 per phase)

**Warning Message**:
```
⚠️ COMPLEXITY WARNING

Task requires >5 agents (detected: 8 subtasks).

Recommendation: Break down into phases to avoid coordination overhead.

Proposed Phasing:
- Phase 1: Refactor Services (5 services, ~2 hours) [3 agents max]
- Phase 2: Update Screens (8 screens, ~3 hours) [4 agents max]
- Phase 3: Update Tests (13 files, ~2 hours) [3 agents max]

Proceed with phased approach? (Y/N)
```

---

## Workload Distribution

### Balanced Distribution

**Goal**: Distribute work evenly across agents to minimize total time.

**Example - Unbalanced**:
```
Agent 1: 10 files (30min)
Agent 2: 2 files (6min)
Agent 3: 1 file (3min)
Total: 30min (bottlenecked by Agent 1)
```

**Example - Balanced**:
```
Agent 1: 5 files (15min)
Agent 2: 4 files (12min)
Agent 3: 4 files (12min)
Total: 15min (50% faster)
```

### Load Balancing Algorithm

```
1. Estimate duration per subtask
2. Sort subtasks by duration (descending)
3. Assign longest tasks first to balance load
4. Max 5 agents (split into phases if needed)
```

---

## Agent Selection Guide

### 3 Documentation Agents

| Agent | Use When | Input | Output |
|-------|----------|-------|--------|
| **bug-documenter** | Bug fixed | Symptom + root cause + solution | BUG-YYYYMMDDXX in AI_BUGS_KNOWLEDGE.md |
| **decision-documenter** | Design decision made | Feature spec + rationale + alternatives | FEATURE-XXX in AI_PRODUCT_DECISIONS.md |
| **progress-tracker** | Work completed | Task summary + completion status | Updated AI_PROGRESS_TRACKER.md |

**Example - Coordinated Documentation**:
```
After completing dark mode:

@decision-documenter: "Document dark mode feature: Theme system with M3 colors,
persistence via Isar, manual toggle in settings"

@progress-tracker: "Mark FEATURE-019 (Dark Mode) as completed, update completion
percentage"
```

---

## Integration with SKILL.md Phase 3

**Output Format**:
```
🎯 SKILL COORDINATION
- Skills to Activate: Skill(X), Skill(Y)
- Agent Delegation: [YES: @agent-name for parallel subtask | NO: skills sufficient]
- Rationale: [Domain match, complexity threshold, dependencies]
```

**Decision Logic**:
```
IF complexity <= Medium AND duration < 5min:
  Agent Delegation: NO (skills sufficient)

ELSE IF complexity == High AND subtasks_independent AND count <= 5:
  Agent Delegation: YES (parallel execution)
  Launch agents in parallel

ELSE IF count > 5:
  Agent Delegation: WARN (complexity too high, suggest phasing)

ELSE:
  Agent Delegation: NO (sequential dependencies, manual better)
```

---

## Best Practices

### DO ✅

- Use skills for <5min tasks (real-time guidance)
- Use 2-5 agents for parallel work (optimal range)
- Balance workload across agents (minimize bottlenecks)
- Check dependencies before parallel launch
- Phase complex tasks (avoid >5 agents)

### DON'T ❌

- Delegate simple tasks to agents (overhead > benefit)
- Launch >5 agents simultaneously (coordination explosion)
- Parallelize dependent tasks (will fail)
- Ignore complexity warnings (leads to failures)
- Use agents for real-time guidance (skills better)

---

**Last Updated**: 2025-10-28
**Research**: 2-5 agents optimal, >5 = exponential complexity (Multi-Agent Systems Research 2025)
**Integration**: Called from SKILL.md Phase 3 (Skill Coordination)