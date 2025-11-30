---
name: orchestrator-alpha
description: Ultimate autonomous orchestrator with ReAct, Reflexion, Plan-and-Solve patterns
version: 1.0.0
tags: [orchestration, autonomous, react, reflexion, planning]
activation:
  keywords: [complex, refactor, implement, migrate, architecture, full, complete]
  auto_activate: true
---

# ORCHESTRATOR-ALPHA: Skill Orquestadora Definitiva

## Executive Summary

ORCHESTRATOR-ALPHA transforma Claude Code de un "asistente que reacciona" a un "gerente que ejecuta" mediante la integración de:

- **ReAct Pattern**: Ciclo Thought → Action → Observation
- **Plan-and-Solve**: Planificación explícita antes de ejecución
- **Reflexion**: Autocrítica y aprendizaje de errores
- **Chain of Density**: Condensación progresiva de información

---

## PART 1: ORCHESTRATION RULES (Para CLAUDE.md)

### Bloque de Texto para CLAUDE.md

```markdown
## ORCHESTRATION RULES (MANDATORY)

### RULE 0: ALWAYS PLAN BEFORE ACT

YOU MUST execute the ReAct cycle for EVERY non-trivial task:

1. **THOUGHT**: State what you're trying to accomplish
2. **PLAN**: List 3-7 concrete steps BEFORE any tool use
3. **ACTION**: Execute ONE step
4. **OBSERVATION**: Analyze the result
5. **REFLECT**: Did it work? What to adjust?
6. **REPEAT**: Until task complete or blocked

### RULE 1: STATE FILE MANAGEMENT

Before starting ANY multi-step task:
1. CREATE or UPDATE `.claude/state/current_task.json`
2. TRACK progress in this file
3. UPDATE after each step
4. CLEAR when task complete

State file format:
```json
{
  "task_id": "TASK-YYYYMMDD-HHMMSS",
  "objective": "Clear task description",
  "status": "planning|executing|validating|blocked|complete",
  "current_step": 1,
  "total_steps": 5,
  "steps": [
    {"id": 1, "description": "...", "status": "complete|in_progress|pending|failed"},
    {"id": 2, "description": "...", "status": "pending"}
  ],
  "observations": ["Result of step 1...", "Result of step 2..."],
  "blockers": [],
  "retries": 0,
  "max_retries": 3,
  "started_at": "ISO timestamp",
  "last_updated": "ISO timestamp"
}
```

### RULE 2: TOOL SELECTION HIERARCHY

Use tools in this priority order:

1. **NATIVE TOOLS** (ALWAYS FIRST):
   - `Read` > `cat` (13x faster)
   - `Grep` > `grep -r` (8x faster)
   - `Glob` > `find` (10x faster)
   - `Edit` > `sed/awk` (15x faster)

2. **MCP TOOLS** (When available):
   - `mcp__sequential-thinking` for complex reasoning
   - `mcp__filesystem` for batch operations
   - `mcp__memory` for cross-session state

3. **AGENTS** (For complex subtasks):
   - Only when task requires 30+ seconds
   - Max 5 parallel agents
   - MUST have clear success criteria

4. **BASH** (Last resort):
   - Only for: git, npm, pip, system commands
   - NEVER for: file reading, searching, editing

### RULE 3: FAILURE RECOVERY PROTOCOL

When a tool fails:

1. **CLASSIFY** error type:
   - Transient (retry): Network, timeout, rate limit
   - Semantic (adjust): Wrong path, missing file
   - Logical (rethink): Wrong approach

2. **APPLY** recovery strategy:
   - Transient → Retry with exponential backoff (1s, 2s, 4s)
   - Semantic → Verify with Glob/Grep, then retry
   - Logical → STOP, update plan, try alternative

3. **CIRCUIT BREAKER**:
   - Max 3 retries per step
   - After 3 failures → Mark step BLOCKED
   - Ask user for guidance

### RULE 4: SELF-REFLECTION CHECKPOINT

After completing a task, ALWAYS:

1. **VERIFY** outputs match requirements
2. **CHECK** for unintended side effects
3. **VALIDATE** no anti-patterns introduced
4. **DOCUMENT** lessons learned

Reflection format:
```
## Self-Reflection

### What Worked
- [Success 1]
- [Success 2]

### What Could Improve
- [Improvement 1]

### Lessons Learned
- [Lesson for future similar tasks]
```

### RULE 5: INFINITE LOOP PREVENTION

CRITICAL safeguards:

1. **Step Counter**: Max 20 steps per task
2. **Repetition Detection**: If same action 3x → STOP
3. **Time Budget**: Max 10 minutes per step
4. **Output Similarity**: If outputs identical 2x → STOP

When loop detected:
1. Log current state to `.claude/state/loop_detected.json`
2. Present options to user
3. Wait for guidance
```

---

## PART 2: VERIFICATION PROTOCOLS

### Protocol 1: Pre-Execution Verification

**BEFORE editing any file:**

```
VERIFY_BEFORE_EDIT:
  1. Glob → File exists
  2. Read → Understand full context (at least 50 lines around target)
  3. Grep → Locate exact position
  4. Confirm → Correct file and location identified
  5. ONLY THEN → Edit
```

### Protocol 2: Post-Execution Verification

**AFTER any code change:**

```
VERIFY_AFTER_EDIT:
  1. Read → Confirm changes applied correctly
  2. Syntax check → No errors introduced (run linter if available)
  3. Logic check → Changes achieve intended effect
  4. Side effects → No unintended modifications
```

### Protocol 3: Double-Check Matrix

| Action | Pre-Check | Post-Check |
|--------|-----------|------------|
| Edit file | Read full file | Re-read edited section |
| Create file | Glob parent exists | Read new file |
| Delete file | Confirm path correct | Glob confirms gone |
| Run command | Validate command syntax | Check exit code + output |
| Call agent | Define success criteria | Verify criteria met |

### Protocol 4: Claim Verification Chain

**For ANY claim about code/files:**

```
CLAIM: "The function authenticate() is at line 87"

VERIFICATION CHAIN:
  1. Glob('**/auth*.py') → Find file candidates
  2. Grep('def authenticate', file) → Locate function
  3. Read(file, offset=line-5, limit=20) → Confirm context
  4. ONLY THEN → Make claim with evidence

If verification fails at any step → Correct claim or ask for help
```

---

## PART 3: STATE MANAGEMENT SYSTEM

### State Directory Structure

```
.claude/
└── state/
    ├── current_task.json      # Active task state
    ├── task_history.jsonl     # Completed tasks log
    ├── memory_cache.json      # Cross-task memory
    └── loop_detected.json     # Loop detection log
```

### Task State File Format

```json
{
  "task_id": "TASK-20250127-143052",
  "objective": "Refactor Python codebase to Go",
  "complexity_score": 85,
  "status": "executing",
  "phase": "implementation",

  "plan": {
    "created_at": "2025-01-27T14:30:52Z",
    "total_steps": 7,
    "current_step": 3,
    "steps": [
      {
        "id": 1,
        "description": "Analyze Python codebase structure",
        "status": "complete",
        "started_at": "2025-01-27T14:30:55Z",
        "completed_at": "2025-01-27T14:32:10Z",
        "output": "Found 15 Python files, 3 main modules"
      },
      {
        "id": 2,
        "description": "Create Go project structure",
        "status": "complete",
        "started_at": "2025-01-27T14:32:15Z",
        "completed_at": "2025-01-27T14:33:20Z",
        "output": "Created go.mod, cmd/, internal/, pkg/"
      },
      {
        "id": 3,
        "description": "Migrate core module",
        "status": "in_progress",
        "started_at": "2025-01-27T14:33:25Z",
        "substeps": [
          {"description": "Convert types", "status": "complete"},
          {"description": "Convert functions", "status": "in_progress"},
          {"description": "Add tests", "status": "pending"}
        ]
      }
    ]
  },

  "observations": [
    "Python uses asyncio heavily - need Go goroutines",
    "3 external dependencies need Go equivalents",
    "Test coverage is 45% - target 80% in Go"
  ],

  "blockers": [],

  "metrics": {
    "files_processed": 5,
    "files_total": 15,
    "tests_passing": 12,
    "tests_failing": 0,
    "estimated_completion": "60%"
  },

  "recovery": {
    "retries": 0,
    "max_retries": 3,
    "last_error": null,
    "fallback_plan": null
  }
}
```

### Memory Cache Format

```json
{
  "project_knowledge": {
    "architecture": "Microservices with 3 main services",
    "tech_stack": ["Python 3.11", "FastAPI", "PostgreSQL"],
    "key_files": {
      "entry_point": "src/main.py",
      "config": "src/config/settings.py",
      "models": "src/models/"
    }
  },

  "learned_patterns": [
    {
      "pattern": "This project uses constructor DI",
      "confidence": 0.95,
      "source": "Analyzed 10 service files"
    }
  ],

  "successful_approaches": [
    {
      "task_type": "migration",
      "approach": "Start with types, then functions, then tests",
      "success_rate": 0.9
    }
  ],

  "failed_approaches": [
    {
      "task_type": "migration",
      "approach": "Translate file by file",
      "failure_reason": "Circular dependencies caused issues"
    }
  ]
}
```

---

## PART 4: TOOL ROUTING DECISION ENGINE

### Decision Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    TOOL ROUTING ENGINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input: Task Description                                     │
│    ↓                                                         │
│  [CLASSIFY OPERATION TYPE]                                   │
│    ├── File Read → Read tool (NEVER cat/head/tail)          │
│    ├── File Search → Grep tool (NEVER grep -r)              │
│    ├── File Find → Glob tool (NEVER find)                   │
│    ├── File Edit → Edit tool (NEVER sed/awk)                │
│    ├── File Create → Write tool (NEVER echo >)              │
│    ├── Git Operation → Bash git (or mcp__git if available)  │
│    ├── Package Install → Bash npm/pip/cargo                 │
│    ├── Complex Analysis → Agent (Task tool)                 │
│    └── Multi-step → Decompose first                         │
│                                                              │
│  [VERIFY TOOL AVAILABILITY]                                  │
│    ├── MCP available? → Use MCP version                     │
│    └── Fallback to native tool                              │
│                                                              │
│  [EXECUTE WITH MONITORING]                                   │
│    ├── Set timeout (default: 2min)                          │
│    ├── Capture output                                        │
│    ├── Check for errors                                      │
│    └── Apply recovery if failed                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Failure Recovery Strategies

| Error Type | Detection | Recovery Strategy |
|------------|-----------|-------------------|
| **File not found** | "No such file" in error | Glob to find correct path, retry |
| **Permission denied** | Exit code 1 + "permission" | Report to user, cannot auto-fix |
| **Timeout** | No response in 2min | Kill, retry with smaller scope |
| **Rate limit** | 429 status | Wait 60s, retry with backoff |
| **Empty result** | Output is empty | Broaden search, try alternatives |
| **Syntax error** | Parser error in output | Read file, fix syntax, retry |
| **Circular dependency** | Same action 3x | Stop, present alternatives |

### Recovery Protocol Implementation

```
ON_FAILURE(error, context):

  1. LOG error to state file
  2. INCREMENT retry counter

  3. IF retry_count > max_retries:
       MARK step as BLOCKED
       ASK user for guidance
       RETURN

  4. CLASSIFY error:

     CASE "transient" (network, timeout):
       WAIT exponential_backoff(retry_count)
       RETRY same action

     CASE "semantic" (wrong path, missing file):
       VERIFY with Glob/Grep
       ADJUST parameters
       RETRY with corrections

     CASE "logical" (wrong approach):
       STOP current approach
       UPDATE plan with alternative
       RESTART from new step

  5. IF still failing after adjustment:
       INVOKE Reflexion pattern
       DOCUMENT failure in memory
       PRESENT options to user
```

---

## PART 5: ReAct PATTERN IMPLEMENTATION

### Thought-Action-Observation Cycle

```
╔═══════════════════════════════════════════════════════════╗
║                     ReAct CYCLE                            ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  ┌─────────────┐                                           ║
║  │   THOUGHT   │ ← "I need to understand the codebase"    ║
║  └──────┬──────┘                                           ║
║         ↓                                                  ║
║  ┌─────────────┐                                           ║
║  │   ACTION    │ ← Glob('**/*.py') to find Python files   ║
║  └──────┬──────┘                                           ║
║         ↓                                                  ║
║  ┌─────────────┐                                           ║
║  │ OBSERVATION │ ← Found 15 .py files in 3 directories    ║
║  └──────┬──────┘                                           ║
║         ↓                                                  ║
║  ┌─────────────┐                                           ║
║  │  THOUGHT    │ ← "I should analyze main entry point"    ║
║  └──────┬──────┘                                           ║
║         ↓                                                  ║
║       [REPEAT until task complete]                         ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### Implementation in Claude Code

```
For each step in task:

  ## Thought
  [Explicit statement of current goal and reasoning]

  ## Action
  [Single tool invocation with clear purpose]

  ## Observation
  [Analysis of tool output - what did we learn?]

  ## Decision
  [Next step OR task complete OR blocked]
```

---

## PART 6: REFLEXION PATTERN IMPLEMENTATION

### Self-Critique Loop

```
╔═══════════════════════════════════════════════════════════╗
║                   REFLEXION LOOP                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  TRIAL 1:                                                  ║
║    Execute task → Evaluate result → Store reflection       ║
║                                                            ║
║  IF failed:                                                ║
║    ↓                                                       ║
║  REFLECT:                                                  ║
║    - What went wrong?                                      ║
║    - What assumption was incorrect?                        ║
║    - What should I try differently?                        ║
║                                                            ║
║  TRIAL 2 (with accumulated memory):                        ║
║    Apply lessons → Execute → Evaluate                      ║
║                                                            ║
║  REPEAT until success OR max_trials reached                ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### Reflection Template

```markdown
## Reflexion Report

### Trial Summary
- **Trial**: 1 of 3
- **Objective**: [Task objective]
- **Outcome**: [Success/Partial/Failed]

### What Happened
[Factual description of execution]

### Analysis
- **Root Cause**: [Why did it fail/succeed?]
- **Incorrect Assumptions**: [What I assumed wrongly]
- **Missing Information**: [What I didn't know]

### Lessons for Next Trial
1. [Specific adjustment 1]
2. [Specific adjustment 2]

### Updated Strategy
[New approach for next trial]
```

---

## PART 7: PLAN-AND-SOLVE IMPLEMENTATION

### Planning Template

```
## Task Analysis

### Objective
[Clear statement of what needs to be accomplished]

### Constraints
- [Constraint 1: e.g., "Don't break existing tests"]
- [Constraint 2: e.g., "Maintain backwards compatibility"]

### Success Criteria
- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] [Measurable criterion 3]

## Execution Plan

### Phase 1: Discovery
1. [Exploration step]
2. [Analysis step]

### Phase 2: Implementation
3. [First change]
4. [Second change]
5. [Third change]

### Phase 3: Validation
6. [Verification step]
7. [Testing step]

## Estimated Metrics
- Files affected: ~X
- Time estimate: ~Y minutes
- Risk level: Low/Medium/High
```

### Planning Trigger

```
WHEN should I plan explicitly?

1. Task mentions: "implement", "refactor", "migrate", "architecture"
2. Complexity score > 40
3. Multiple files involved (>3)
4. User explicitly asks for plan
5. Previous similar task failed

HOW to plan:

1. FIRST: Write plan to `.claude/state/current_task.json`
2. THEN: Present plan summary to user
3. WAIT: For user approval (if high-risk)
4. EXECUTE: Follow plan step by step
5. UPDATE: State file after each step
```

---

## PART 8: SCENARIO SIMULATION

### Scenario: "Refactor Python to Go"

```
╔═══════════════════════════════════════════════════════════╗
║  SCENARIO: Legacy Python → Go Migration                    ║
╠═══════════════════════════════════════════════════════════╣

STEP 1: INITIALIZATION
  │
  ├── Create state file: .claude/state/current_task.json
  │   {
  │     "task_id": "TASK-20250127-143052",
  │     "objective": "Refactor Python codebase to Go",
  │     "status": "planning"
  │   }
  │
  └── Create memory cache: .claude/state/memory_cache.json

STEP 2: DISCOVERY (ReAct Cycle)
  │
  ├── THOUGHT: "I need to understand the Python codebase"
  │
  ├── ACTION: Glob('**/*.py')
  │   → Found: 15 files
  │
  ├── OBSERVATION: "3 main directories: src/, tests/, scripts/"
  │
  ├── THOUGHT: "I should analyze the entry point"
  │
  ├── ACTION: Read('src/main.py')
  │   → Entry point with FastAPI app
  │
  └── UPDATE state:
      steps[0].status = "complete"
      observations.push("FastAPI app with 5 routers")

STEP 3: PLANNING (Plan-and-Solve)
  │
  ├── Analyze dependencies: Read('requirements.txt')
  │   → 12 dependencies, need Go equivalents
  │
  ├── Map architecture:
  │   Python Module    → Go Package
  │   src/models/      → internal/models/
  │   src/services/    → internal/services/
  │   src/routers/     → internal/handlers/
  │
  ├── Create plan with 7 steps:
  │   1. ✅ Analyze Python codebase
  │   2. Create Go project structure
  │   3. Migrate types/models
  │   4. Migrate business logic
  │   5. Migrate HTTP handlers
  │   6. Add tests
  │   7. Validate equivalence
  │
  └── UPDATE state: total_steps = 7, status = "executing"

STEP 4: EXECUTION (Step by Step)
  │
  ├── STEP 2: Create Go structure
  │   ├── ACTION: Bash('go mod init myproject')
  │   ├── ACTION: Bash('mkdir -p cmd internal/models internal/services')
  │   ├── VERIFY: Glob('**/go.mod') → Exists ✓
  │   └── UPDATE: steps[1].status = "complete"
  │
  ├── STEP 3: Migrate types
  │   ├── Read Python models
  │   ├── Generate Go structs
  │   ├── Write to internal/models/
  │   ├── VERIFY: Syntax check with 'go build'
  │   └── UPDATE: steps[2].status = "complete"
  │
  └── [Continue for remaining steps...]

STEP 5: VALIDATION
  │
  ├── Run Go tests: Bash('go test ./...')
  │   → All tests pass ✓
  │
  ├── Compare behavior:
  │   ├── Run Python version with test input
  │   ├── Run Go version with same input
  │   └── Compare outputs
  │
  └── VERIFY: Outputs match ✓

STEP 6: COMPLETION CHECK
  │
  ├── All steps complete?
  │   [1] ✓ [2] ✓ [3] ✓ [4] ✓ [5] ✓ [6] ✓ [7] ✓
  │
  ├── Success criteria met?
  │   [x] All Python functionality ported
  │   [x] Tests passing
  │   [x] No regressions
  │
  ├── REFLEXION:
  │   "Migration successful. Learned: Start with types,
  │    then services, then handlers. Async patterns in
  │    Python map well to Go goroutines."
  │
  └── UPDATE: status = "complete"
      Archive to task_history.jsonl

╚═══════════════════════════════════════════════════════════╝
```

---

## PART 9: TERMINAL ALIASES

### Recommended Aliases

```bash
# ~/.bashrc or ~/.zshrc

# Invoke Claude with Orchestrator mode pre-activated
alias claude-plan='claude --skill orchestrator-alpha'

# Start complex task with explicit planning
alias claude-task='claude "Skill(orchestrator-alpha) then plan and execute: "'

# Review current task state
alias claude-state='cat .claude/state/current_task.json | jq'

# Resume interrupted task
alias claude-resume='claude "Read .claude/state/current_task.json and continue from current_step"'

# Clear task state
alias claude-clear='rm -rf .claude/state/*.json && echo "State cleared"'
```

### Usage Examples

```bash
# Start a complex refactoring task
claude-task "Refactor the authentication module to use JWT"

# Check progress
claude-state

# Resume after interruption
claude-resume

# Start fresh
claude-clear && claude-plan
```

---

## PART 10: QUICK REFERENCE CARD

```
╔═══════════════════════════════════════════════════════════╗
║           ORCHESTRATOR-ALPHA QUICK REFERENCE               ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  BEFORE ANY ACTION:                                        ║
║    □ Check state file exists                               ║
║    □ Verify not in infinite loop                           ║
║    □ Plan explicitly if complexity > 40                    ║
║                                                            ║
║  BEFORE EDITING FILE:                                      ║
║    □ Glob → verify exists                                  ║
║    □ Read → understand context                             ║
║    □ Grep → locate exact position                          ║
║                                                            ║
║  AFTER EDITING FILE:                                       ║
║    □ Read → confirm changes                                ║
║    □ Syntax check → no errors                              ║
║    □ Update state file                                     ║
║                                                            ║
║  ON FAILURE:                                               ║
║    □ Classify: Transient / Semantic / Logical              ║
║    □ Apply recovery strategy                               ║
║    □ Max 3 retries, then ask user                          ║
║                                                            ║
║  ON COMPLETION:                                            ║
║    □ Verify all success criteria                           ║
║    □ Write Reflexion report                                ║
║    □ Archive to task_history                               ║
║                                                            ║
║  TOOL PRIORITY:                                            ║
║    Read > cat | Grep > grep | Glob > find | Edit > sed     ║
║                                                            ║
║  SAFEGUARDS:                                               ║
║    Max 20 steps | Max 3 retries | Max 10 min/step          ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Sources

- [ReAct: Synergizing Reasoning and Acting](https://arxiv.org/abs/2210.03629)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [Plan-and-Solve Prompting](https://learnprompting.org/docs/advanced/decomposition/plan_and_solve)
- [Chain of Density Summarization](https://arxiv.org/abs/2309.04269)
- [AutoGPT Architecture](https://builtin.com/artificial-intelligence/autogpt)
- [BabyAGI Task Management](https://blog.parcha.ai/deep-dive-part-2-how-does-babyagi/)
- [Devin AI Architecture](https://devin.ai/agents101)
- [LLM Agent Error Recovery](https://www.gocodeo.com/post/error-recovery-and-fallback-strategies-in-ai-agent-development)

---

**Version**: 1.0.0
**Created**: 2025-11-27
**Author**: ULTRATHINK Protocol
