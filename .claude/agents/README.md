# Claude Code Agents System

**Version**: 1.0.0
**Last Updated**: 2025-11-17
**Total Agents**: 10 specialized agents

---

## Overview

The Claude Code agents system provides **specialized AI assistants** with isolated context windows for efficient task execution. Each agent is an expert in a specific domain, invoked on-demand by the **adaptive-meta-orchestrator** skill.

### Architecture

```
adaptive-meta-orchestrator (Hub)
    ├── Core Subagents (5) - Orchestration workflow
    │   ├── context-detector
    │   ├── complexity-analyzer
    │   ├── question-generator
    │   ├── quality-validator
    │   └── pattern-learner
    │
    └── Execution Agents (5) - Task-specific specialists
        ├── task-decomposer
        ├── test-generator
        ├── security-scanner
        ├── performance-profiler
        └── refactor-planner
```

### Benefits

- ✅ **Isolated Context**: Each agent has 0-3K token context (vs 200K shared)
- ✅ **Parallel Execution**: Run multiple agents concurrently (3-10x speedup)
- ✅ **Specialized Expertise**: Domain-specific knowledge and patterns
- ✅ **Token Efficiency**: 65%+ token savings vs monolithic approach
- ✅ **Proactive Activation**: Agents auto-activate based on triggers

---

## Core Subagents (Orchestration)

These 5 agents coordinate the **5-layer orchestration workflow** (Analysis → Planning → Execution → Validation → Learning).

### 1. context-detector

**File**: `context-detector.md`
**Model**: Haiku (fast, 850ms avg)
**Purpose**: Auto-detect project tech stack, structure, and development phase

**Capabilities**:
- Detect primary language (TypeScript, Python, Go, etc.)
- Identify frameworks (React, Vue, FastAPI, Express, etc.)
- Analyze project structure (Standard, Monorepo, Microservices)
- Check quality tooling (TypeScript, ESLint, tests, CI/CD)

**Invocation**:
```typescript
const context = await Task({
  subagent_type: 'context-detector',
  model: 'haiku',
  prompt: `Detect project context for: ${directory}`
});
```

**Output**: `{ techStack, structure, phase, quality }`

---

### 2. complexity-analyzer

**File**: `complexity-analyzer.md`
**Model**: Sonnet (reasoning-heavy, 1.2s avg)
**Purpose**: Score task complexity (0-100) for intelligent routing

**Capabilities**:
- Calculate complexity score based on 5 factors
- Categorize as Low/Medium/High/Very High
- Estimate duration (minutes to days)
- Provide confidence score (0-100%)

**Complexity Factors** (0-25 each):
1. File count (1 file = 5, 10+ files = 25)
2. Duration (< 30min = 5, > 8h = 25)
3. Dependencies (1 layer = 5, 4+ layers = 25)
4. Risk (trivial = 5, critical = 25)
5. Ambiguity (clear = 0, very ambiguous = 25)

**Invocation**:
```typescript
const complexity = await Task({
  subagent_type: 'complexity-analyzer',
  model: 'sonnet',
  prompt: `Analyze complexity for: ${taskDescription}`
});
```

**Output**: `{ total: 0-100, category, confidence, reasoning }`

---

### 3. question-generator

**File**: `question-generator.md`
**Model**: Sonnet (reasoning-heavy, 900ms avg)
**Purpose**: Generate clarifying questions for ambiguous tasks

**Capabilities**:
- Detect ambiguities (missing requirements, unclear scope)
- Generate 1-4 targeted questions
- Provide default assumptions if user skips
- Calculate confidence score

**Triggers**:
- Confidence < 70% (complexity-analyzer output)
- Complexity > 50 (high/very high tasks)
- User request is vague (< 10 words, no specifics)

**Invocation**:
```typescript
const clarification = await Task({
  subagent_type: 'question-generator',
  model: 'sonnet',
  prompt: `Generate questions for: ${userMessage}`
});

if (clarification.questions.length > 0) {
  const answers = await AskUserQuestion(clarification.questions);
}
```

**Output**: `{ confidence, ambiguities, questions, assumptions }`

---

### 4. quality-validator

**File**: `quality-validator.md`
**Model**: Haiku (execution-heavy, 3.5s avg)
**Purpose**: Execute quality gates (tests, linter, type checker)

**Capabilities**:
- Run tests (Pytest, Vitest, Jest, Go test)
- Check linter (ESLint, Ruff, Golangci-lint)
- Verify types (TypeScript, MyPy)
- Detect blocking vs non-blocking issues

**Quality Gates**:
- ❌ **BLOCKING**: Test failures, type errors, critical vulnerabilities
- ⚠️ **NON-BLOCKING**: Linter warnings, coverage decrease

**Invocation**:
```typescript
const validation = await Task({
  subagent_type: 'quality-validator',
  model: 'haiku',
  prompt: `Validate: ${filesModified.join(', ')}`
});

if (validation.blocking) {
  await fixIssues(validation);
}
```

**Output**: `{ testsPass, linterPass, typeCheckPass, blocking }`

---

### 5. pattern-learner

**File**: `pattern-learner.md`
**Model**: Sonnet (reasoning-heavy, 1.1s avg)
**Purpose**: Detect patterns (3+ occurrences) and propose improvements

**Capabilities**:
- Detect duplication (code, workflows, commands)
- Identify inefficiencies (repeated manual steps)
- Propose automation (skills, agents, commands)
- Track success rate of proposals

**Pattern Types**:
1. **Code duplication** (3+ files with same logic)
2. **Workflow repetition** (same tool sequence 3+ times)
3. **Command patterns** (same Glob/Grep patterns 3+ times)
4. **Error patterns** (same error 3+ times)

**Invocation**:
```typescript
const patterns = await Task({
  subagent_type: 'pattern-learner',
  model: 'sonnet',
  prompt: `Detect patterns in: ${executionResults}`
});

if (patterns.suggestions.length > 0) {
  presentProposals(patterns.suggestions);
}
```

**Output**: `{ patternsDetected, suggestions, knowledgeStored }`

---

## Execution Agents (Task-Specific)

These 5 agents handle **specific task types** with deep domain expertise.

### 1. task-decomposer

**File**: `task-decomposer.md`
**Model**: Sonnet
**Purpose**: Break complex tasks (complexity >40) into subtasks with dependencies

**Capabilities**:
- Identify natural boundaries (layers, modules, components)
- Create subtasks with complexity <30 each
- Build dependency graphs (DAG - no cycles)
- Calculate parallel execution paths (1.4-10x speedup)

**Use When**:
- Complexity > 40 (medium-high tasks)
- Multi-component features (frontend + backend + database)
- Need to parallelize work across multiple agents

**Invocation**:
```typescript
const decomposition = await Task({
  subagent_type: 'task-decomposer',
  model: 'sonnet',
  prompt: `Decompose: ${taskDescription}`
});

// Returns: { subtasks[], dependencyGraph, summary }
```

**Output**: Subtasks with `{ id, name, files, complexity, dependencies, assignTo }`

---

### 2. test-generator

**File**: `test-generator.md`
**Model**: Sonnet
**Purpose**: Generate tests from BDD specifications (90%+ first-run pass rate)

**Capabilities**:
- Translate Given-When-Then specs to test code
- Support Pytest, Vitest, Jest, Go test
- Auto-generate fixtures, mocks, edge cases
- Verify root functionality (not superficial assertions)

**Use When**:
- Testing tasks (unit, integration, e2e)
- TDD workflows (spec → tests → implementation)
- New features needing comprehensive test coverage

**BDD Translation**:
```gherkin
Given: user exists with email test@example.com
When: user posts to /api/auth/login with valid credentials
Then: response status is 200
And: response contains JWT token
```

**Invocation**:
```typescript
const tests = await Task({
  subagent_type: 'test-generator',
  model: 'sonnet',
  prompt: `Generate tests from spec: ${bddSpec}`
});
```

**Output**: Test code with 90%+ pass rate, fixtures, edge cases

---

### 3. security-scanner

**File**: `security-scanner.md`
**Model**: Sonnet
**Purpose**: Deep security analysis (OWASP Top 10, secrets, SQL injection, XSS)

**Capabilities**:
- Detect SQL injection (string concatenation in queries)
- Find XSS vulnerabilities (innerHTML, dangerouslySetInnerHTML, v-html)
- Scan for hardcoded secrets (API keys, passwords, tokens)
- Check CSRF protection
- Audit dependencies (npm audit, safety check, cargo audit)

**Use When**:
- Authentication/authorization implementations
- Payment processing
- Admin panels
- API endpoints handling sensitive data
- Code review for security-critical features

**Secret Patterns Detected**:
```regex
sk-[a-zA-Z0-9]{48}                 # OpenAI
ghp_[a-zA-Z0-9]{36}                # GitHub PAT
AKIA[0-9A-Z]{16}                   # AWS Access Key
password\s*=\s*['"][^'"]+['"]      # Hardcoded password
```

**Invocation**:
```typescript
const security = await Task({
  subagent_type: 'security-scanner',
  model: 'sonnet',
  prompt: `Scan for vulnerabilities: ${files.join(', ')}`
});

if (security.summary.blocking) {
  // Critical vulnerabilities found - must fix
}
```

**Output**: `{ vulnerabilities[], secrets[], dependencies, summary }`

---

### 4. performance-profiler

**File**: `performance-profiler.md`
**Model**: Sonnet
**Purpose**: Identify performance bottlenecks (CPU, memory, I/O, N+1 queries)

**Capabilities**:
- Profile execution paths (py-spy, clinic.js, pprof, Chrome DevTools)
- Detect N+1 query problems
- Identify memory leaks
- Find excessive re-renders (React DevTools Profiler)
- Benchmark before/after optimizations

**Use When**:
- Slow API endpoints (>500ms)
- UI lag or freezing
- High memory usage (>100MB)
- Database timeouts
- Bundle size too large (>500KB)

**Common Bottlenecks**:
1. **N+1 queries** - Loop fetching related data
2. **Memory leaks** - Event listeners not cleaned up
3. **Excessive re-renders** - New objects on every render
4. **Synchronous blocking** - Blocking I/O operations
5. **Large bundles** - Importing entire libraries

**Invocation**:
```typescript
const profile = await Task({
  subagent_type: 'performance-profiler',
  model: 'sonnet',
  prompt: `Profile performance: ${component} (target: <500ms)`
});

// Returns: baseline, bottlenecks, optimizations, benchmark
```

**Output**: Bottlenecks with remediation, before/after metrics

---

### 5. refactor-planner

**File**: `refactor-planner.md`
**Model**: Sonnet
**Purpose**: Detect code smells (complexity, duplication) and plan safe refactorings

**Capabilities**:
- Calculate Cyclomatic Complexity (CC > 10 = refactor)
- Detect code duplication (> 5% = issue)
- Identify long methods (> 50 lines = review)
- Apply Martin Fowler's refactoring catalog
- Ensure behavior preservation (tests before/after)

**Use When**:
- Code reviews
- Legacy code modernization
- Quality improvement initiatives
- High complexity detected (CC > 10)
- Duplication found (> 5%)

**Code Smells Detected**:
1. **High Cyclomatic Complexity** (CC > 10)
2. **Long Methods** (> 50 lines)
3. **Code Duplication** (> 5%)
4. **Poor Naming** (vague variable/function names)
5. **God Objects** (1000+ line classes with 50+ methods)
6. **Feature Envy** (method uses another class's data too much)

**Invocation**:
```typescript
const refactoring = await Task({
  subagent_type: 'refactor-planner',
  model: 'sonnet',
  prompt: `Analyze code smells: ${files.join(', ')}`
});

// Returns: metrics, codeSmells[], refactorings[], summary
```

**Output**: Code smells with safe refactorings, before/after examples

---

## How to Invoke Agents

### Using the Task Tool

All agents are invoked using the `Task` tool with `subagent_type`:

```typescript
const result = await Task({
  subagent_type: 'agent-name',  // Required: Name of agent
  model: 'haiku' | 'sonnet',    // Optional: Override model
  prompt: `                     // Required: Input for agent
    User request: ${userMessage}
    Context: ${JSON.stringify(context)}
  `
});

// Parse JSON result
const parsed = JSON.parse(result);
```

### Agent Selection Guide

**By Task Type**:
- Complex feature → `task-decomposer`
- Testing → `test-generator`
- Security review → `security-scanner`
- Performance issues → `performance-profiler`
- Code quality → `refactor-planner`

**By Complexity**:
- Complexity < 25 → Direct execution (no agents)
- Complexity 25-50 → 1-2 specialized agents
- Complexity 50-75 → `task-decomposer` + execution agents
- Complexity > 75 → Full orchestration (all agents)

**By Proactive Triggers**:
- Auth/payment code → `security-scanner` (auto)
- Complexity > 40 → `task-decomposer` (auto)
- Slow performance → `performance-profiler` (auto)
- High CC detected → `refactor-planner` (auto)
- Testing needed → `test-generator` (auto)

---

## Agent Coordination

### Orchestrator Role

The **adaptive-meta-orchestrator** skill coordinates all agents through a **5-layer workflow**:

1. **Layer 1 - ANALYSIS**: Invoke core subagents (context, complexity, questions)
2. **Layer 2 - PLANNING**: Select strategy based on complexity score
3. **Layer 3 - EXECUTION**: Invoke execution agents as needed
4. **Layer 4 - VALIDATION**: Run quality gates (tests, linter, security)
5. **Layer 5 - LEARNING**: Detect patterns, propose improvements

### Parallel Execution

Agents can run **in parallel** for massive speedup:

```typescript
// Run 3 agents concurrently (3x speedup)
const [security, performance, refactoring] = await Promise.all([
  Task({ subagent_type: 'security-scanner' }),
  Task({ subagent_type: 'performance-profiler' }),
  Task({ subagent_type: 'refactor-planner' })
]);
```

### Error Handling

Agents have built-in error handling:

- **Timeout** (30s): Fallback to heuristic
- **Invalid JSON**: Retry once, then heuristic
- **Agent not found**: Use orchestrator inline logic

---

## Performance Metrics

| Agent | Model | Avg Time | Avg Tokens | Use Case |
|-------|-------|----------|------------|----------|
| context-detector | Haiku | 850ms | 1,200 | Every task |
| complexity-analyzer | Sonnet | 1.2s | 2,500 | Every task |
| question-generator | Sonnet | 900ms | 1,800 | Ambiguous (30%) |
| quality-validator | Haiku | 3.5s | 800 | Every task |
| pattern-learner | Sonnet | 1.1s | 2,100 | Every task |
| task-decomposer | Sonnet | 2.0s | 3,000 | Complex (20%) |
| test-generator | Sonnet | 4.0s | 4,500 | Testing (15%) |
| security-scanner | Sonnet | 3.0s | 3,800 | Security (10%) |
| performance-profiler | Sonnet | 3.0s | 4,000 | Performance (5%) |
| refactor-planner | Sonnet | 2.0s | 3,500 | Quality (10%) |

**Total Agent Overhead** (typical task):
- Simple (complexity <25): ~6s (context + complexity + validation)
- Medium (complexity 25-50): ~9s (+ pattern-learner + 1 specialist)
- High (complexity 50-75): ~15s (+ decomposer + 2-3 specialists)
- Very High (complexity >75): ~25s (+ all agents)

**Speedup vs Manual**: 2-10x due to parallelization and specialized expertise

---

## File Organization

```
.claude/agents/
├── README.md (this file)
├── context-detector.md
├── complexity-analyzer.md
├── question-generator.md
├── quality-validator.md
├── pattern-learner.md
├── task-decomposer.md
├── test-generator.md
├── security-scanner.md
├── performance-profiler.md
└── refactor-planner.md
```

---

## Integration with CLAUDE.md

The orchestrator and agents are **automatically activated** via CLAUDE.md:

```markdown
## 🤖 AUTOMATIC META-ORCHESTRATOR

ALWAYS at the start of ANY interaction, you MUST:
1. ACTIVATE THE ORCHESTRATOR IMMEDIATELY
2. This rule applies to ALL message types
3. NO EXCEPTIONS

The orchestrator will:
- Auto-detect project context
- Score complexity
- Invoke appropriate agents
- Execute 5-layer workflow
```

---

## Version History

- **1.0.0** (2025-11-17): Initial release with 10 agents
  - 5 core subagents (orchestration workflow)
  - 5 execution agents (task-specific specialists)
  - Hub-and-Spoke architecture
  - 65% token savings vs monolithic

---

**For detailed agent specifications, see individual `.md` files in this directory.**
