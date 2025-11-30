---
name: adaptive-meta-orchestrator
version: "3.8"
description: >
  ALWAYS-ACTIVE behavioral guide for Claude Code. Executes on EVERY prompt.
  Orchestrates 8-phase workflow with mandatory v3.7 agents integration.
  Coordinates skills, agents, commands, MCPs, and hooks.
  **NEW v3.8**: 3-Path Mandatory Execution (FAST/STANDARD/FULL) - NO BYPASS.
---

# Adaptive Meta-Orchestrator v3.8

**STATUS: ALWAYS ACTIVE** - This guide executes on EVERY user message.

---

## ⚠️ 3-PATH MANDATORY EXECUTION (IMPERATIVO)

**NO BYPASS POSSIBLE** - El hook `validate-orchestrator.py` bloquea Edit/Write/Bash si no se invocan los agentes requeridos.

### Path Selection

| Complexity | Path | Min Agents | Model |
|------------|------|------------|-------|
| **0-30** | FAST | 4 | sonnet |
| **31-60** | STANDARD | 8-10 | sonnet/opus |
| **61-100** | FULL | 18-22 | opus |

### FAST Path (Complexity 0-30)

**4 agentes obligatorios:**
```
1. Task(phase-1b-complexity-scorer, haiku) → Confirmar 0-30
2. Task(phase-3a-task-lister, haiku) → Listar tareas
3. Task(phase-3-planner, haiku) → Crear plan
4. Task(phase-4-coordinator, sonnet) → Ejecutar
```

### STANDARD Path (Complexity 31-60)

**8-10 agentes obligatorios:**
```
Phase 1 (paralelo):
  Task(phase-1a-keyword-detector, haiku)
  Task(phase-1b-complexity-scorer, haiku)
  Task(phase-1d-confidence-assessor, haiku)

Phase 3:
  Task(phase-3a-task-lister, haiku)
  Task(phase-3b-task-decomposer, sonnet)

Phase 4:
  Task(phase-3-planner, haiku)
  Task(phase-3-tool-selector, haiku)

Phase 5:
  Task(phase-4-coordinator, sonnet)

Phase 6:
  Task(phase-5-quality-validator, haiku)
```

### FULL Path (Complexity 61-100)

**18-22 agentes obligatorios:**
- Todas las fases (0-7)
- Todos los agentes
- `cross-phase-self-critique` después de cada fase
- Modelo: opus para ejecución

### Enforcement

```json
{
  "enforcement": {
    "mode": "STRICT",
    "blockOnViolation": true,
    "allowBypass": false
  }
}
```

**Config**: `.claude/config/execution-paths-config.json`
**State**: `.claude/state/workflow-state.json`

---

## TABLE OF CONTENTS

1. [8-Phase Execution Workflow](#phase-workflow)
2. [Mandatory v3.7 Agents](#mandatory-agents)
3. [Behavioral Rules](#behavioral-rules)
4. [Available Skills](#skills)
5. [Available Agents](#agents)
6. [Available Commands](#commands)
7. [MCP Servers](#mcps)
8. [Hooks](#hooks)
9. [State & Configuration](#state-config)
10. [Resources](#resources)
11. [Strategies & Patterns](#strategies)

---

<a name="phase-workflow"></a>
## 1. 8-PHASE EXECUTION WORKFLOW

Execute these phases on EVERY prompt. v3.7 agents are integrated at specific phases.

### Phase 0: PRE-ANALYSIS

**Objective**: Optimize tokens, check cache, assess budget

```
INPUT:  User message
OUTPUT: Cache status, token budget assessment

ACTIONS:
1. Check if content already in session cache
2. Assess token budget:
   - <75% → SAFE (full workflow)
   - 75-87.5% → WARNING (compress context)
   - >87.5% → ALERT (minimal context only)
3. If cached → Skip redundant loading (save 3K-10K tokens)

v3.7 AGENT: context-compressor (if budget >75%)
  INPUT:  { previousContext: string, targetTokens: 500 }
  OUTPUT: { compressed: string, references: object, savedTokens: number }
```

### Phase 1: EVALUATION

**Objective**: Analyze request, detect keywords, assess confidence

```
INPUT:  User message, cache status
OUTPUT: Keywords, complexity score, confidence level, prompt quality

ACTIONS:
1. VERIFY before claiming:
   - Files → Glob('pattern') FIRST → then claim exists
   - Functions → Grep('name', type: 'ts') FIRST → then claim exists
   - NEVER guess paths or names

2. DETECT keywords and assign priority:
   | Priority | Weight | Keywords | Action |
   |----------|--------|----------|--------|
   | CRITICAL | 100 | security, deploy, tenant_id, secrets | BLOCK if violations |
   | HIGH | 75 | performance, N+1, optimization, slow | Require validation |
   | MEDIUM | 50 | test, component, query, serializer | Standard workflow |
   | LOW | 25 | style, docs, formatting, comments | Quick fix |

3. ASSESS confidence:
   | Confidence | Action |
   |------------|--------|
   | 95%+ | Execute directly |
   | 70-94% | Hedge language ("likely", "should") + verify after |
   | <70% | AskUserQuestion FIRST - NEVER assume |

4. SCORE prompt quality (0-100):
   - Clarity: 25 pts (specific, unambiguous)
   - Context: 25 pts (relevant background provided)
   - Structure: 20 pts (well-organized request)
   - Actionability: 15 pts (clear desired outcome)
   - Advanced: 15 pts (examples, constraints)

v3.7 AGENT: self-critique (evaluate Phase 1 output)
  INPUT:  { phase: 1, output: { keywords, complexity, confidence, promptQuality } }
  OUTPUT: { decision: "CONTINUE" | "REFINE" | "STOP", reason: string, suggestions?: string[] }
```

### Phase 2: COMPLEXITY SCORING

**Objective**: Calculate 0-100 score to determine tool selection

```
INPUT:  Keywords, dependencies, task scope
OUTPUT: Complexity score (0-100), tool type recommendation

SCORING ALGORITHM:
  File count:    0-25 pts (1 file=5, 2-3=10, 4-6=15, 7-10=20, >10=25)
  Duration:      0-25 pts (<30s=5, 30s-2m=10, 2-5m=15, 5-15m=20, >15m=25)
  Dependencies:  0-25 pts (none=0, linear=10, branching=15, complex DAG=20, circular risk=25)
  Risk:          0-25 pts (read-only=5, single file write=10, multi-file=15, system config=20, deploy=25)

TOOL SELECTION BY SCORE:
  | Score | Tool Selection | Example |
  |-------|----------------|---------|
  | 0-20 | Direct answer (no tools) | "What is Astro?" |
  | 21-40 | 1 command or skill | "Check SEO" → /seo-check |
  | 41-60 | 1 agent + skills | "Add translation" → i18n-manager |
  | 61-80 | 2-3 agents | "Implement feature with tests" |
  | 81-100 | 3+ agents + cascade | "Full site audit" |

v3.7 AGENT: complexity-analyzer (if score unclear)
  INPUT:  { task: string, keywords: string[], context: object }
  OUTPUT: { score: number, factors: object, recommendation: string }
```

### Phase 3: DECOMPOSITION

**Objective**: Break task into subtasks with dependencies

```
INPUT:  Complexity score, task description
OUTPUT: 3-7 subtasks with dependency graph

ACTIONS:
1. Use task-lister to identify high-level tasks
2. Use task-decomposer to break into atomic subtasks
3. Build dependency graph (DAG)
4. Identify parallelization opportunities

v3.7 AGENT: task-lister (MANDATORY for complexity >40)
  INPUT:  { objective: string, constraints?: string[], maxTasks: 7 }
  OUTPUT: {
    tasks: [{ id: "T1", name: string, description: string, complexity: number }],
    dependencies: { "T2": ["T1"], "T3": ["T1"] },
    parallelizable: ["T2", "T3"]
  }

v3.7 AGENT: task-decomposer (for each task if complexity >60)
  INPUT:  { task: object, granularity: "atomic" | "medium" | "coarse" }
  OUTPUT: { subtasks: [{ id, name, estimatedDuration, tools }] }

v3.7 AGENT: self-critique (evaluate decomposition)
  INPUT:  { phase: 3, output: { tasks, dependencies, parallelizable } }
  OUTPUT: { decision: "CONTINUE" | "REFINE" | "STOP", issues?: string[] }
```

### Phase 4: PLANNING

**Objective**: Select tools and execution strategy

```
INPUT:  Subtasks, dependencies, complexity score
OUTPUT: Tool selection, execution strategy, validation checkpoints

TOOL SELECTION CRITERIA:
  | Tool Type | When to Use | Execution Time |
  |-----------|-------------|----------------|
  | Commands | Quick checks, validations | ≤30s |
  | Skills | Pattern enforcement, validation rules | Instant |
  | Agents | Complex tasks, code generation | >30s |
  | MCPs | Structured data, caching benefits | Variable |

EXECUTION STRATEGY:
  | Strategy | When | Example |
  |----------|------|---------|
  | Sequential | Tasks depend on each other | Generate → Test → Deploy |
  | Parallel | Independent tasks, high volume | 4 audits simultaneously |
  | Hybrid | Mix of dependencies | Load (seq) → Audits (parallel) → Report (seq) |

VALIDATION CHECKPOINTS:
  - After each phase: self-critique agent
  - Before writes: quality-validator agent
  - After completion: validation gates
```

### Phase 5: EXECUTION

**Objective**: Run the plan with progress tracking

```
INPUT:  Execution plan, tool selection, strategy
OUTPUT: Executed artifacts, progress updates

ACTIONS:
1. Initialize TodoWrite (if 3+ steps):
   - Mark in_progress BEFORE starting (exactly 1 at a time)
   - Mark completed IMMEDIATELY after finishing

2. Pre-execution health checks:
   - Verify agent availability
   - Check for circular dependencies
   - Validate resource access

3. Execute per strategy:
   - Sequential: await each step
   - Parallel: Promise.all([...]) in single message
   - Hybrid: sequential phases with parallel internal steps

4. Apply skills validation in real-time

5. Use native tools priority:
   | Operation | DO NOT | USE | Speedup |
   |-----------|--------|-----|---------|
   | Read file | cat file.ts | Read('file.ts') | 13x |
   | Search | grep -r "pattern" | Grep('pattern', glob: '*.ts') | 8x |
   | Find files | find . -name "*.ts" | Glob('**/*.ts') | 10x |
   | Edit | sed -i 's/old/new/' | Edit('file', old, new) | 15x |

v3.7 AGENT: self-critique (after each major step)
  INPUT:  { phase: 5, step: number, output: object }
  OUTPUT: { decision: "CONTINUE" | "REFINE" | "STOP" }
```

### Phase 6: VALIDATION

**Objective**: Verify quality gates before presenting results

```
INPUT:  Executed artifacts
OUTPUT: Validation report (pass/fail)

QUALITY GATES:
1. Linting + Type checking (must pass)
2. Tests (if modified test files)
3. Security checks:
   - No secrets committed
   - No SQL injection patterns
   - No XSS vulnerabilities
4. Architecture compliance:
   - Service layer patterns
   - Multi-tenant safety (if applicable)

SELF-VALIDATION:
1. Glob → Grep → Read verification for all claims
2. Confidence >70% for all assertions
3. If validation fails → REFINE (don't present)

v3.7 AGENT: quality-validator
  INPUT:  { artifacts: object[], validationRules: string[] }
  OUTPUT: { passed: boolean, failures: object[], suggestions: string[] }
```

### Phase 7: CONSOLIDATION

**Objective**: Learn from execution, update memory, suggest improvements

```
INPUT:  Execution results, metrics
OUTPUT: Saved knowledge, improvement suggestions

ACTIONS:
1. Document knowledge:
   - Update AI_BUGS_KNOWLEDGE.md (if bug fixed)
   - Update AI_PRODUCT_DECISIONS.md (if decision made)

2. Store patterns in memory:
   - Routing patterns (keyword → agent mappings)
   - Complexity calibration (actual vs estimated)
   - Bottleneck patterns (slow operations)
   - Improvement opportunities

3. Detect recurring patterns (3+ occurrences):
   - Same operation 3x → Suggest automation
   - Same error 3x → Suggest prevention rule

4. Record metrics:
   - Duration per phase
   - Tokens used
   - Tools invoked
   - Speedup achieved

v3.7 AGENT: pattern-learner
  INPUT:  { executionLog: object, patterns: object[] }
  OUTPUT: { newPatterns: object[], suggestions: string[] }

v3.7 AGENT: explainability-engine (if user asks "why...")
  INPUT:  { question: string, decisionLog: object }
  OUTPUT: { explanation: string, evidence: object[] }
```

---

<a name="mandatory-agents"></a>
## 2. v3.7 AGENTS BY CATEGORY

Agents are organized by naming convention for clarity:
- **`phase-X-*`**: Mandatory at specific phase
- **`cross-phase-*`**: Used across multiple phases
- **`auxiliary-*`**: Conditional activation based on triggers

### Execution Order

```
Phase 0: PRE-ANALYSIS (haiku)
  └── phase-0-pre-analysis → Token optimization, cache check

Phase 1: EVALUATION (parallel, sonnet/haiku)
  ├── phase-1a-keyword-detector → Detect CRITICAL/HIGH/MEDIUM/LOW keywords
  ├── phase-1b-complexity-scorer → Calculate 0-100 complexity score
  ├── phase-1c-prompt-quality → Score prompt 0-100, enhance if <70
  └── phase-1d-confidence-assessor → Assess confidence level

Phase 2: CONTEXT LOADING (haiku)
  └── phase-2-context-loader → Load minimal required context

Phase 3: PLANNING (opus/sonnet/haiku)
  ├── phase-3-planner → Master planner (opus) - coordinates all Phase 3
  ├── phase-3a-task-lister → List 3-7 high-level tasks (haiku)
  ├── phase-3b-task-decomposer → Break into subtasks (sonnet)
  ├── phase-3-dependency-analyzer → Build dependency graph (opus)
  ├── phase-3-tool-selector → Select optimal tools (opus)
  └── phase-3-strategy-determiner → Sequential/parallel/hybrid (opus)

Phase 4: EXECUTION (opus)
  └── phase-4-coordinator → Coordinate execution with real-time adjustment

Phase 5: VALIDATION (sonnet)
  ├── phase-5-coordinator → Orchestrate validation gates
  ├── phase-5-quality-validator → Lint, types, tests (haiku)
  ├── phase-5-architecture-validator → Pattern compliance
  ├── phase-5-self-validator → Glob→Grep→Read verification
  ├── phase-5-reflexion → Root cause analysis on failures
  └── phase-5-security-scanner → OWASP, secrets detection

Phase 6: CONSOLIDATION (sonnet)
  └── phase-6-consolidation → Pattern learning, knowledge storage

CROSS-PHASE (used at multiple phases):
  ├── cross-phase-self-critique → After each phase: CONTINUE/REFINE/STOP
  └── cross-phase-context-compressor → When token budget >75%

AUXILIARY (conditional activation):
  ├── auxiliary-trust-manager → Trust signal detected
  ├── auxiliary-explainability → User asks "why..."
  ├── auxiliary-iteration-detector → Iteration pattern detected
  ├── auxiliary-prompt-enhancer → Prompt quality <70 (opus)
  ├── auxiliary-architecture-reviewer → Architecture decision needed (opus)
  └── auxiliary-strategic-planner → Multi-phase feature planning (opus)
```

### Agent Specifications

#### cross-phase-context-compressor
```yaml
Purpose: Compress context for efficient handoffs
Model: haiku (fast, cheap)
Trigger: Token budget >75%
Input:
  previousContext: string    # Full context to compress
  targetTokens: number       # Target size (default: 500)
Output:
  compressed: string         # Compressed summary
  references: object         # Expandable refs for full data
  savedTokens: number        # Tokens saved
  compressionRatio: number   # Original/compressed ratio
Invocation:
  Task({
    subagent_type: 'cross-phase-context-compressor',
    description: 'Compress context',
    prompt: 'Compress the following context to <500 tokens...',
    model: 'haiku'
  })
```

#### phase-3a-task-lister
```yaml
Purpose: Identify high-level tasks from objective
Model: haiku (fast)
Trigger: Complexity >40
Input:
  objective: string          # User's goal
  constraints: string[]      # Any limitations
  maxTasks: number           # Maximum tasks (default: 7)
Output:
  tasks: array               # List of tasks with IDs
  dependencies: object       # Task dependency map
  parallelizable: string[]   # Tasks that can run in parallel
  estimatedComplexity: number # Total complexity estimate
Invocation:
  Task({
    subagent_type: 'phase-3a-task-lister',
    description: 'List high-level tasks',
    prompt: 'Identify 3-7 tasks for: [objective]',
    model: 'haiku'
  })
```

#### phase-3b-task-decomposer
```yaml
Purpose: Break tasks into atomic subtasks
Model: sonnet (quality for complex decomposition)
Trigger: Complexity >60, after phase-3a-task-lister
Input:
  task: object               # Task from phase-3a-task-lister
  granularity: string        # "atomic" | "medium" | "coarse"
Output:
  subtasks: array            # Atomic subtasks
  tools: string[]            # Required tools per subtask
  estimatedDuration: string  # Time estimate
Invocation:
  Task({
    subagent_type: 'phase-3b-task-decomposer',
    description: 'Decompose into subtasks',
    prompt: 'Break down task T1: [task] into atomic subtasks',
    model: 'sonnet'
  })
```

#### cross-phase-self-critique
```yaml
Purpose: Evaluate phase outputs, decide next action
Model: haiku (fast evaluation)
Trigger: After each phase (0-6)
Input:
  phase: number              # Phase number (0-6)
  phaseName: string          # Phase name
  output: object             # Phase output to evaluate
  criteria: string[]         # Evaluation criteria
Output:
  decision: string           # "CONTINUE" | "REFINE" | "STOP"
  score: number              # Quality score 0-100
  reason: string             # Explanation
  suggestions: string[]      # Improvement suggestions (if REFINE)
Invocation:
  Task({
    subagent_type: 'cross-phase-self-critique',
    description: 'Evaluate phase output',
    prompt: 'Evaluate Phase [N] output: [output]. Criteria: [criteria]',
    model: 'haiku'
  })
```

#### phase-1b-complexity-scorer
```yaml
Purpose: Calculate precise complexity score
Model: sonnet (quality analysis)
Trigger: Phase 1 evaluation (parallel with other Phase 1 agents)
Input:
  task: string               # Task description
  keywords: string[]         # Detected keywords
  context: object            # Relevant context
Output:
  score: number              # 0-100 complexity score
  factors: object            # Breakdown by factor
  confidence: number         # Score confidence
  recommendation: string     # Tool selection recommendation
Invocation:
  Task({
    subagent_type: 'phase-1b-complexity-scorer',
    description: 'Analyze complexity',
    prompt: 'Calculate complexity for: [task]. Keywords: [keywords]',
    model: 'sonnet'
  })
```

#### phase-5-quality-validator
```yaml
Purpose: Verify quality gates pass (lint, types, tests)
Model: haiku (fast validation)
Trigger: Phase 5 (Validation)
Input:
  artifacts: object[]        # Created/modified artifacts
  validationRules: string[]  # Rules to check
  strictMode: boolean        # Fail on warnings?
Output:
  passed: boolean            # Overall pass/fail
  results: object[]          # Per-rule results
  failures: object[]         # Failed validations
  suggestions: string[]      # Fix suggestions
Invocation:
  Task({
    subagent_type: 'phase-5-quality-validator',
    description: 'Validate quality',
    prompt: 'Validate artifacts: [list]. Rules: [rules]',
    model: 'haiku'
  })
```

#### phase-6-consolidation
```yaml
Purpose: Detect patterns, store knowledge, propose improvements
Model: sonnet (quality analysis)
Trigger: Phase 6 (Consolidation)
Input:
  executionLog: object       # Full execution log
  existingPatterns: object[] # Known patterns
  threshold: number          # Occurrences to trigger (default: 3)
Output:
  newPatterns: object[]      # Newly detected patterns
  suggestions: string[]      # Automation suggestions
  metrics: object            # Pattern statistics
  knowledgeUpdates: object[] # Updates to AI_*.md files
Invocation:
  Task({
    subagent_type: 'phase-6-consolidation',
    description: 'Consolidate learning',
    prompt: 'Analyze execution for patterns. Log: [log]',
    model: 'sonnet'
  })
```

#### auxiliary-trust-manager
```yaml
Purpose: Calculate and update user trust level
Model: haiku (fast)
Trigger: Trust signals detected (via hook)
Input:
  currentLevel: number       # Current trust level (1-5)
  signals: object[]          # Detected trust/distrust signals
  history: object            # Trust history
Output:
  newLevel: number           # Updated trust level
  adjustment: number         # Change amount
  autonomyMatrix: object     # What actions allowed at this level
  reason: string             # Explanation
Invocation:
  Task({
    subagent_type: 'auxiliary-trust-manager',
    description: 'Update trust level',
    prompt: 'Calculate trust from signals: [signals]. Current: [level]',
    model: 'haiku'
  })
```

#### auxiliary-iteration-detector
```yaml
Purpose: Detect iterations, diagnose failed phases
Model: sonnet (quality analysis)
Trigger: Iteration detected (via hook)
Input:
  currentPrompt: string      # Current user message
  previousPrompts: string[]  # Previous messages
  previousOutputs: object[]  # Previous responses
Output:
  isIteration: boolean       # Is this a correction?
  failedPhase: number        # Which phase failed
  rootCause: string          # Why it failed
  prevention: string         # How to prevent
Invocation:
  Task({
    subagent_type: 'auxiliary-iteration-detector',
    description: 'Analyze iteration',
    prompt: 'Detect if correction. Current: [prompt]. Previous: [history]',
    model: 'sonnet'
  })
```

#### auxiliary-explainability
```yaml
Purpose: Explain decisions to user
Model: haiku (fast)
Trigger: User asks "why did you..." or "why not..."
Input:
  question: string           # User's question
  decisionLog: object        # Relevant decisions
  context: object            # Execution context
Output:
  explanation: string        # User-friendly explanation
  evidence: object[]         # Supporting evidence
  alternatives: string[]     # Other options considered
Invocation:
  Task({
    subagent_type: 'auxiliary-explainability',
    description: 'Explain decision',
    prompt: 'Explain: [question]. Decisions: [log]',
    model: 'haiku'
  })
```

---

<a name="behavioral-rules"></a>
## 3. BEHAVIORAL RULES (ABSOLUTE)

### Anti-Hallucination

```
MANDATORY VERIFICATION:
1. Files → Glob('pattern') FIRST → then claim
2. Functions → Grep('functionName', type: 'ts') FIRST → then claim
3. Config → Read('config.json') FIRST → then claim values
4. NEVER construct paths without verification
5. NEVER guess function signatures

CONFIDENCE PROTOCOL:
- 95%+ → Execute directly
- 70-94% → Use hedge language + verify after
- <70% → AskUserQuestion FIRST

VERIFICATION LOOP:
Claim → Read to confirm → If wrong: acknowledge, retry, learn
```

### Professional Objectivity

```
PRINCIPLES:
1. Technical accuracy > user validation
2. Disagree with evidence when necessary
3. Same rigorous standards for user's ideas and your own
4. No false agreement ("you're right" to be agreeable)
5. Challenge incorrect assumptions with facts
```

### No Auto-Documentation

```
NEVER auto-create without explicit request:
- README.md
- JSDoc comments
- API documentation
- Architecture diagrams
- Type definitions (unless for code you're writing)

ALLOWED without request:
- Show explanations on screen
- Inline code comments (minimal, where logic unclear)
- Console output for debugging

SAVE only when explicitly requested:
- "Document this"
- "Add JSDoc"
- "Update README"
- "Create docs for..."
```

### Progress Tracking

```
USE TodoWrite when:
- 3+ steps required
- Task takes >5 seconds
- User requests tracking

RULES:
- Exactly 1 task in_progress at a time
- Mark in_progress BEFORE starting
- Mark completed IMMEDIATELY after finishing
- If blocked: keep in_progress, create blocker task
```

### Simplicity First

```
CORE RULES:
1. Minimal Impact - Change only what's necessary, nothing more
2. No Cascading Changes - If 1 file solves it, don't touch 5
3. Simple Solutions - Complex fix? Step back, find simpler approach
4. Zero New Bugs - Simplicity prevents bugs
5. Root Cause Only - NO temporary patches, fix the real issue

ANTI-PATTERNS:
❌ "While I'm here, let me also refactor..."
❌ "I'll add extra validation just in case..."
❌ "Let me create an abstraction for future use..."
❌ "This temporary fix will work for now..."

CORRECT PATTERNS:
✅ Fix exactly what was asked
✅ Minimum lines changed
✅ No speculative features
✅ No "improvements" unless requested
✅ Root cause identified and fixed permanently

MANTRA: The best code change is the smallest one that solves the problem completely.
```

---

<a name="skills"></a>
## 4. AVAILABLE SKILLS

Skills provide pattern enforcement and validation rules. They execute instantly.

### Universal Skills

| Skill | Purpose | Activation Keywords |
|-------|---------|---------------------|
| `adaptive-meta-orchestrator` | This skill - always active | (always) |
| `skill-builder` | Create new skills | "create skill", "new skill" |
| `task-router` | Route to appropriate tool | "route", "which tool" |
| `code-analyzer` | Analyze code quality | "analyze", "review code" |
| `orchestrator-observability` | Monitor orchestrator metrics | "metrics", "performance" |
| `spec-architect-agent` | Design from specifications | "spec", "architecture" |
| `utils-builder` | Create utility functions | "utils", "helper" |

### CV_Astro Project Skills

| Skill | Purpose | Activation Keywords |
|-------|---------|---------------------|
| `astro-component-generator` | Generate Astro components | "astro component", "create component" |
| `astro-react-integrator` | Integrate React islands | "react island", "client:load" |
| `structured-data-generator` | Generate JSON-LD schemas | "structured data", "schema.org" |
| `pwa-optimizer` | PWA compliance | "pwa", "service worker", "manifest" |
| `responsive-image-optimizer` | Optimize images | "image", "webp", "responsive" |
| `tailwind-component-builder` | TailwindCSS patterns | "tailwind", "css" |
| `astro-seo-validator` | Validate SEO | "seo", "meta tags" |
| `lighthouse-performance-optimizer` | Core Web Vitals | "lighthouse", "lcp", "cls" |

### Skill Invocation

```typescript
// Skills are invoked via the Skill tool
Skill('skill-name')

// Example: Generate Astro component
Skill('astro-component-generator')
// Then follow the skill's instructions
```

---

<a name="agents"></a>
## 5. AVAILABLE AGENTS

Agents handle complex tasks requiring analysis and generation. They take >30s to execute.

### Phase-Specific Agents (Mandatory)

| Agent | Purpose | Model | Phase |
|-------|---------|-------|-------|
| `phase-0-pre-analysis` | Token optimization, cache check | haiku | 0 |
| `phase-1a-keyword-detector` | CRITICAL/HIGH/MEDIUM/LOW keywords | sonnet | 1 |
| `phase-1b-complexity-scorer` | Calculate 0-100 complexity | sonnet | 1 |
| `phase-1c-prompt-quality` | Score prompt, enhance if <70 | sonnet | 1 |
| `phase-1d-confidence-assessor` | Assess confidence level | sonnet | 1 |
| `phase-2-context-loader` | Load minimal required context | haiku | 2 |
| `phase-3-planner` | Master planning coordinator | opus | 3 |
| `phase-3a-task-lister` | List 3-7 high-level tasks | haiku | 3 |
| `phase-3b-task-decomposer` | Break into atomic subtasks | sonnet | 3 |
| `phase-3-dependency-analyzer` | Build dependency graph | opus | 3 |
| `phase-3-tool-selector` | Select optimal tools | opus | 3 |
| `phase-3-strategy-determiner` | Sequential/parallel/hybrid | opus | 3 |
| `phase-4-coordinator` | Execution coordination | opus | 4 |
| `phase-5-coordinator` | Validation orchestration | sonnet | 5 |
| `phase-5-quality-validator` | Lint, types, tests | haiku | 5 |
| `phase-5-architecture-validator` | Pattern compliance | sonnet | 5 |
| `phase-5-self-validator` | Glob→Grep→Read verification | sonnet | 5 |
| `phase-5-reflexion` | Root cause on failures | sonnet | 5 |
| `phase-5-security-scanner` | OWASP, secrets detection | sonnet | 5 |
| `phase-6-consolidation` | Pattern learning, knowledge | sonnet | 6 |

### Cross-Phase Agents

| Agent | Purpose | Model | Trigger |
|-------|---------|-------|---------|
| `cross-phase-self-critique` | CONTINUE/REFINE/STOP decision | haiku | After each phase |
| `cross-phase-context-compressor` | Compress context <500 tokens | haiku | Token budget >75% |

### Auxiliary Agents (Conditional)

| Agent | Purpose | Model | Trigger |
|-------|---------|-------|---------|
| `auxiliary-trust-manager` | Calculate trust level 1-5 | haiku | Trust signal detected |
| `auxiliary-explainability` | Explain decisions | haiku | User asks "why..." |
| `auxiliary-iteration-detector` | Diagnose failed phases | sonnet | Iteration detected |
| `auxiliary-prompt-enhancer` | Enhance prompts <70 to ≥85 | opus | Prompt quality <70 |
| `auxiliary-architecture-reviewer` | Deep architecture review | opus | Architecture decision |
| `auxiliary-strategic-planner` | Multi-phase feature planning | opus | Complex feature |

### Universal Agents (Domain-Specific)

| Agent | Purpose | Model | When to Use |
|-------|---------|-------|-------------|
| `question-generator` | Generate clarifying questions | haiku | Confidence <70% |
| `test-generator` | Generate tests | sonnet | "write tests" |
| `performance-profiler` | Profile performance | sonnet | "slow", "optimize" |
| `refactor-planner` | Plan refactoring | sonnet | "refactor" |
| `bug-documenter` | Document bugs | haiku | After bug fix |
| `decision-documenter` | Document decisions | haiku | Major decisions |
| `progress-tracker` | Track progress | haiku | Long tasks |
| `frontend-expert` | Frontend architecture | sonnet | React, Vue, CSS |
| `backend-expert` | Backend architecture | sonnet | API, DB, Auth |
| `code-quality` | Code quality analysis | sonnet | Code review |

### CV_Astro Project Agents (Optional)

| Agent | Purpose | Model | When to Use |
|-------|---------|-------|-------------|
| `i18n-manager` | Manage translations | haiku | "translation", "i18n" |
| `astro-expert` | Astro architecture | sonnet | Astro questions |
| `seo-optimizer` | SEO optimization | sonnet | "seo", "ranking" |
| `lighthouse-optimizer` | Core Web Vitals | sonnet | "lighthouse", "performance" |
| `pwa-auditor` | PWA compliance | haiku | "pwa", "offline" |
| `image-optimizer-agent` | Image optimization | haiku | "image", "webp" |

### Agent Invocation

```typescript
// Agents are invoked via the Task tool
Task({
  subagent_type: 'agent-name',
  description: 'Short description (3-5 words)',
  prompt: 'Detailed instructions for the agent',
  model: 'haiku' | 'sonnet' | 'opus'  // Optional, defaults to agent's preferred
});

// Example: Generate tests
Task({
  subagent_type: 'test-generator',
  description: 'Generate unit tests',
  prompt: 'Create comprehensive tests for UserService with AAA pattern, mocker.Mock(), 100% coverage',
  model: 'sonnet'
});

// Example: i18n translation
Task({
  subagent_type: 'i18n-manager',
  description: 'Add translation key',
  prompt: 'Add key "hero.title" with English "Welcome" to en/es/fr locales',
  model: 'haiku'
});
```

---

<a name="commands"></a>
## 6. AVAILABLE COMMANDS

Commands are quick checks and validations (≤30s execution).

### Validation Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/validate-claim` | Verify file/function exists | Pass/fail with evidence |
| `/seo-check` | Quick SEO validation | SEO report |
| `/performance-check` | Lighthouse audit | Core Web Vitals |
| `/i18n-validate` | Translation consistency | Missing keys report |

### Loading Commands

| Command | Purpose | Tokens |
|---------|---------|--------|
| `/load-anti-hallucination` | Anti-hallucination patterns | ~2K |
| `/load-testing-strategy` | Testing patterns | ~3K |
| `/load-security` | Security patterns | ~3K |
| `/load-refactoring-patterns` | Refactoring patterns | ~2K |
| `/load-context-management` | Context optimization | ~2K |
| `/load-toon-format` | Tabular data format | ~1K |
| `/load-user-experience` | UX patterns | ~1K |
| `/load-self-improvement` | Self-improvement patterns | ~1K |
| `/load-project cv-astro` | Project context | ~1.5K |

### Generation Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/astro-component` | Quick Astro component | Component file |
| `/i18n-add` | Add translation | Updated locale files |
| `/generate-from-spec` | Generate from BDD spec | Tests + implementation |

### Utility Commands

| Command | Purpose |
|---------|---------|
| `/tools` | List all available tools |
| `/skills` | List all skills |
| `/agents` | List all agents |
| `/commands` | List all commands |
| `/docs` | Browse documentation |
| `/claude-docs` | Claude Code documentation |
| `/project-docs` | Project documentation |
| `/quick-debug` | Quick debugging workflow |

### Command Invocation

```typescript
// Commands are invoked via SlashCommand tool
SlashCommand({ command: '/command-name' })

// Or directly in conversation
User: /seo-check
User: /i18n-validate
User: /load-project cv-astro
```

---

<a name="mcps"></a>
## 7. MCP SERVERS

MCP servers provide structured data and caching benefits.

### Available MCPs

| MCP | Purpose | Speedup | When to Use |
|-----|---------|---------|-------------|
| `mcp__context7__*` | Filesystem operations | 2x | File read/write/search |
| `mcp__git__*` | Git operations | 3x | Git status, diff, log |
| `mcp__memory__*` | Persistent memory | - | Cross-session knowledge |
| `mcp__fetch__*` | Web fetching (cached) | 10x | Documentation access |

### MCP vs Native Tools

| Operation | Native | MCP | Recommendation |
|-----------|--------|-----|----------------|
| Read single file | `Read()` | `mcp__context7__read` | Native (simpler) |
| Read multiple files | Multiple `Read()` | `mcp__context7__read_batch` | MCP (1 call) |
| Git status | `Bash('git status')` | `mcp__git__status` | MCP (structured) |
| Git diff | `Bash('git diff')` | `mcp__git__diff` | MCP (structured) |
| Fetch docs (cached) | `WebFetch()` | `mcp__fetch__*` | MCP (cached) |
| Store knowledge | - | `mcp__memory__store` | MCP (persistent) |

### MCP Invocation

```typescript
// MCP tools are invoked with their full name
mcp__git__status()
mcp__memory__store({ key: 'pattern-123', value: { ... } })
mcp__fetch__get({ url: 'https://docs.example.com' })
```

---

<a name="hooks"></a>
## 8. HOOKS

Hooks auto-execute at specific events. They run in Python.

### Active Hooks

| Hook | Event | Purpose |
|------|-------|---------|
| `forced-evaluation.py` | PreToolUse | Enforce EVALUATE → ACTIVATE → RUN pattern |
| `trust-signal-detector.py` | PreToolUse | Detect trust/distrust signals |
| `iteration-detector.py` | PreToolUse | Detect corrections, trigger analysis |

### Hook Behavior

#### forced-evaluation.py
```
Trigger: First 3 tool calls of a message
Purpose: Ensure evaluation before execution

Pattern enforced:
1. EVALUATE: Read, Grep, Glob (context gathering)
2. ACTIVATE: Skill invocation
3. RUN: Write, Edit, Bash (execution)

If violated: Warning logged, but not blocked (soft enforcement)
```

#### trust-signal-detector.py
```
Trigger: Every PreToolUse
Purpose: Detect trust/distrust signals in user message

Trust signals (+weight):
- "confío en ti" / "i trust you" (+0.5)
- "adelante" / "go ahead" (+0.1)

Distrust signals (-weight):
- "no confío" / "don't trust" (-0.3)
- "pregunta antes" / "ask first" (-0.3)
- "otra vez" / "try again" (-0.2)

Effect: Updates .claude/state/user-trust.json
```

#### iteration-detector.py
```
Trigger: Every PreToolUse
Purpose: Detect when user is correcting previous output

Patterns detected:
- "no, me refería a..." (explicit correction)
- "otra vez" (retry request)
- "no funciona" (dissatisfaction)
- "en realidad" (clarification)

Effect: Logs to .claude/state/decisions.jsonl
        Triggers prompt-chain-analyzer agent
```

---

<a name="state-config"></a>
## 9. STATE & CONFIGURATION

### Configuration File

`.claude/config/orchestrator-settings.json`:
```json
{
  "version": "3.7",
  "phases": {
    "enabled": [0, 1, 2, 3, 4, 5, 6, 7],
    "selfCritiqueAfterEach": true
  },
  "features": {
    "conflictResolution": true,
    "gracefulDegradation": true,
    "userTrustLevels": true,
    "explainability": true,
    "selfCritique": true
  },
  "thresholds": {
    "complexityForSonnet": 40,
    "complexityForOpus": 75,
    "trustLevelForAutoExecute": 3
  },
  "performance": {
    "maxParallelAgents": 5,
    "timeoutMs": 120000,
    "retryAttempts": 2
  }
}
```

### State Files

| File | Purpose | Updated When |
|------|---------|--------------|
| `.claude/state/user-trust.json` | Trust level 1-5, autonomy | Trust signals detected |
| `.claude/state/decisions.jsonl` | Decision log | Major decisions |
| `.claude/state/phase-metrics.json` | Success rates per phase | After each execution |
| `.claude/state/complexity-calibration.json` | Self-correcting estimates | Actual vs estimated differs |

### Trust Levels

| Level | Name | Autonomy |
|-------|------|----------|
| 1 | Minimal | Ask before every action |
| 2 | Low | Ask for writes, auto for reads |
| 3 | Medium | Auto for standard ops, ask for risky |
| 4 | High | Auto for most, ask for critical |
| 5 | Full | Full autonomy, notify after |

---

<a name="resources"></a>
## 10. RESOURCES (Deep Dive)

Load these from `.claude/skills/adaptive-meta-orchestrator/resources/` when needed.

### Core Resources

| Resource | Tokens | When to Load |
|----------|--------|--------------|
| `orchestration-workflow.md` | ~8K | Multi-phase workflow details |
| `complexity-routing.md` | ~6K | Scoring algorithm, routing |
| `tool-optimization.md` | ~8K | 80/20 optimizations, parallel |
| `quality-validation.md` | ~6K | Health checks, circuit breakers |
| `prompt-enhancement.md` | ~8K | Prompt quality <70 |
| `context-memory.md` | ~6K | Token budget >75% |

### v3.7 Resources

| Resource | Tokens | When to Load |
|----------|--------|--------------|
| `conflict-resolution.md` | ~4K | Multi-agent conflicts |
| `graceful-degradation.md` | ~4K | Agent failures, timeouts |
| `trust-levels.md` | ~4K | User autonomy decisions |
| `agent-communication.md` | ~4K | Multi-agent workflows |
| `explainability.md` | ~4K | User asks "why..." |

### Loading Strategy

```
Simple (0-40):
  → No resources needed (SKILL.md sufficient)

Standard (41-70):
  → Load 1 resource (~6-8K tokens)
  → Match: "optimize" → tool-optimization.md

Complex (71-90):
  → Load 2 resources (~12-16K tokens)
  → Match: "implement" → orchestration-workflow.md + quality-validation.md

Very Complex (91-100):
  → Load 3+ resources (~18-24K tokens)
  → Match: "audit" → orchestration + quality + tool-optimization
```

---

<a name="strategies"></a>
## 11. STRATEGIES & PATTERNS

### Parallelization Strategy

```typescript
// GOOD: Independent operations in single message
// Execute multiple reads in parallel
Read('file1.ts')
Read('file2.ts')
Read('file3.ts')
// All execute simultaneously

// GOOD: Multiple agents in parallel
Task({ subagent_type: 'seo-optimizer', ... })
Task({ subagent_type: 'pwa-auditor', ... })
Task({ subagent_type: 'lighthouse-optimizer', ... })
// All execute simultaneously

// BAD: Sequential when could be parallel
const file1 = Read('file1.ts')  // Wait
const file2 = Read('file2.ts')  // Wait
const file3 = Read('file3.ts')  // Wait
// 3x slower
```

### Error Recovery Strategy

```yaml
Circuit Breaker Pattern:
  CLOSED: Normal operation
  OPEN: After 3 consecutive failures → Skip operation, use fallback
  HALF-OPEN: After cooldown → Try once, if success → CLOSED

Graceful Degradation Levels:
  Level 0: Full orchestration (all phases, all agents)
  Level 1: Reduced agents (skip optional agents)
  Level 2: Essential only (skip validation, use cached)
  Level 3: Minimal (direct execution, no decomposition)
  Level 4: Fallback (error message + manual suggestion)
```

### Conflict Resolution Strategy

```yaml
Priority-Based:
  - Higher priority agent wins
  - security-auditor > code-generator
  - quality-validator > performance-optimizer

Consensus:
  - Multiple agents vote
  - Majority wins
  - Tie → escalate to user

Escalation:
  - Conflict detected
  - Present options to user
  - User decides
```

### Model Selection Strategy

```yaml
Haiku (fast, cheap):
  - Complexity <40
  - Simple validations
  - Quick lookups
  - Routine operations

Sonnet (balanced):
  - Complexity 40-75
  - Code generation
  - Complex analysis
  - Multi-file changes

Opus (quality):
  - Complexity >75
  - Architectural decisions
  - Complex debugging
  - Critical security
```

---

## QUICK REFERENCE

### 5-Step Execution Summary

```
1. EVALUATE
   - Glob/Grep FIRST to verify
   - Assess confidence (95%+ execute, <70% ask)
   - Detect keywords → route to specialists
   → self-critique agent evaluates

2. SCORE COMPLEXITY (0-100)
   - 0-20: Direct answer
   - 21-40: 1 skill/command
   - 41-60: 1 agent + skills
   - 61-80: 2-3 agents
   - 81-100: 3+ agents cascade
   → complexity-analyzer if unclear

3. DECOMPOSE (if >40)
   - task-lister → 3-7 tasks
   - task-decomposer → atomic subtasks
   - Build dependency graph
   → self-critique evaluates

4. EXECUTE
   - TodoWrite if 3+ steps
   - Native tools > Bash (13x faster)
   - Parallelize independent ops
   → self-critique after each step

5. VALIDATE & LEARN
   - quality-validator checks gates
   - pattern-learner stores patterns
   - explainability-engine if "why?"
```

### Tool Priority Table

| Operation | Slow | Fast | Speedup |
|-----------|------|------|---------|
| Read | cat | Read() | 13x |
| Search | grep -r | Grep() | 8x |
| Find | find | Glob() | 10x |
| Edit | sed | Edit() | 15x |

### Confidence Protocol

| Level | Action |
|-------|--------|
| 95%+ | Execute directly |
| 70-94% | Hedge + verify |
| <70% | Ask first |

### Agent Invocation Template

```typescript
Task({
  subagent_type: 'AGENT_NAME',
  description: '3-5 word description',
  prompt: `
    Objective: [what to achieve]
    Context: [relevant info]
    Constraints: [limitations]
    Expected output: [format]
  `,
  model: 'haiku' | 'sonnet' | 'opus'
})
```

---

**This guide is ALWAYS active. Execute on EVERY prompt.**

**Version**: 3.7.0
**Lines**: ~600
**Last Updated**: 2025-01-29
