# Claude Code Enhancement System - CV_Astro Project

```
═══════════════════════════════════════════════════════════════════════════════
                    ADAPTIVE META-ORCHESTRATOR v3.7
═══════════════════════════════════════════════════════════════════════════════

   BEHAVIORAL GUIDE: .claude/skills/adaptive-meta-orchestrator/SKILL.md

   This guide ALWAYS EXECUTES on every prompt. It teaches Claude Code:
   • EVALUATE before claiming (Glob/Grep first)
   • SCORE complexity (0-100) to select tools
   • SELECT strategy (sequential/parallel/hybrid)
   • EXECUTE with native tools (13x faster than Bash)
   • LEARN from patterns (suggest automation)

═══════════════════════════════════════════════════════════════════════════════
```

## MANDATORY AGENT WORKFLOW (NO EXCEPTIONS)

**AFTER activating `Skill('adaptive-meta-orchestrator')`, execute these phases:**

### Phase 0: PRE-ANALYSIS (if token budget >75%)
```
Task({subagent_type: 'phase-0-pre-analysis', prompt: 'Compress context', model: 'haiku'})
```

### Phase 1: EVALUATION - Run ALL 4 agents in PARALLEL
```
Task({subagent_type: 'phase-1a-keyword-detector', prompt: '...', model: 'haiku'})
Task({subagent_type: 'phase-1b-complexity-scorer', prompt: '...', model: 'haiku'})
Task({subagent_type: 'phase-1c-prompt-quality', prompt: '...', model: 'haiku'})
Task({subagent_type: 'phase-1d-confidence-assessor', prompt: '...', model: 'haiku'})
```
THEN: `Task({subagent_type: 'cross-phase-self-critique', prompt: 'Evaluate Phase 1', model: 'haiku'})`

### Phase 2: COMPLEXITY SCORING
```
Task({subagent_type: 'phase-1b-complexity-scorer', prompt: 'Score task complexity 0-100', model: 'haiku'})
```

### Phase 3: DECOMPOSITION (if complexity >40)
```
Task({subagent_type: 'phase-3a-task-lister', prompt: 'List tasks', model: 'haiku'})
Task({subagent_type: 'phase-3b-task-decomposer', prompt: 'Decompose tasks', model: 'sonnet'})
Task({subagent_type: 'phase-3-dependency-analyzer', prompt: 'Analyze dependencies', model: 'haiku'})
```
THEN: `Task({subagent_type: 'cross-phase-self-critique', prompt: 'Evaluate Phase 3', model: 'haiku'})`

### Phase 4: PLANNING
```
Task({subagent_type: 'phase-3-planner', prompt: 'Create execution plan', model: 'haiku'})
Task({subagent_type: 'phase-3-tool-selector', prompt: 'Select optimal tools', model: 'haiku'})
Task({subagent_type: 'phase-3-strategy-determiner', prompt: 'Determine execution strategy', model: 'haiku'})
```

### Phase 5: EXECUTION - Delegate to specialists
```
Task({subagent_type: 'phase-4-coordinator', prompt: 'Coordinate execution', model: 'sonnet'})
# Coordinator invokes specialists:
Task({subagent_type: 'astro-expert' | 'seo-optimizer' | 'i18n-manager' | etc, prompt: '...', model: 'sonnet'})
```

### Phase 6: VALIDATION
```
Task({subagent_type: 'phase-5-coordinator', prompt: 'Coordinate validation', model: 'haiku'})
Task({subagent_type: 'phase-5-quality-validator', prompt: 'Validate quality', model: 'haiku'})
Task({subagent_type: 'phase-5-architecture-validator', prompt: 'Validate architecture', model: 'haiku'})
Task({subagent_type: 'phase-5-security-scanner', prompt: 'Scan for security issues', model: 'haiku'})
Task({subagent_type: 'cross-phase-self-critique', prompt: 'Evaluate results', model: 'haiku'})
```

### Phase 7: CONSOLIDATION (for significant tasks)
```
Task({subagent_type: 'phase-6-consolidation', prompt: 'Store patterns and update knowledge graph', model: 'sonnet'})
```

**CRITICAL RULES:**
- Phase 1 verification (Glob/Grep) is ONLY for checking existence
- After Phase 1, ALL work is delegated to agents
- Run `cross-phase-self-critique` after Phases 1, 3, 6
- NEVER read files to understand code yourself - delegate to specialists

---

## 5-TIER COMPLEXITY SYSTEM (NO BYPASS POSSIBLE)

**MANDATORY**: Based on complexity score (0-100), you MUST follow ONE of these 5 tiers. NO EXCEPTIONS.

### Tier Selection by Complexity Score

| Complexity | Tier | Min Agents | Model | Direct Tools Allowed |
|------------|------|------------|-------|---------------------|
| **0-30** | TRIVIAL | 1 | haiku | YES (after scorer) |
| **31-50** | FAST | 3 | haiku | NO (need coordinator) |
| **51-70** | STANDARD | 6 | sonnet | NO (need coordinator) |
| **71-85** | ADVANCED | 10 | sonnet | NO (need coordinator) |
| **86-100** | FULL | 21+ | opus | NO (need coordinator) |

### TRIVIAL Tier (0-30) - Direct Tool Access

**UNIQUE FEATURE**: After complexity-scorer, main session can use Read/Glob/Grep/Edit/Write/Bash directly.

```
Workflow:
1. phase-1b-complexity-scorer (haiku) → Confirms complexity 0-30
2. THEN: Use tools directly (Read, Glob, Grep, Edit, Write, Bash)

Examples:
- Add a single translation key
- Fix a typo in one file
- Read a configuration file
```

### FAST Tier (31-50) - Minimal Coordination

```
Required Agents (3):
1. phase-1b-complexity-scorer (haiku) → Score complexity
2. phase-3a-task-lister (haiku) → List tasks
3. phase-4-coordinator (haiku) → Execute via coordinator

Examples:
- Create a simple component
- Add translations to multiple locales
- Update configuration in 2-3 files
```

### STANDARD Tier (51-70) - Full Planning

```
Required Agents (6):
1. phase-1b-complexity-scorer (haiku) → Score complexity
2. phase-1a-keyword-detector (haiku) → Detect keywords
3. phase-3a-task-lister (haiku) → List tasks
4. phase-3-planner (haiku) → Create execution plan
5. phase-4-coordinator (sonnet) → Execute via coordinator
6. phase-5-quality-validator (haiku) → Validate quality

Examples:
- Implement new feature with multiple components
- SEO optimization across pages
- Performance improvements with testing
```

### ADVANCED Tier (71-85) - Architecture Review

```
Required Agents (10):
1. phase-1b-complexity-scorer (haiku)
2. phase-1a-keyword-detector (haiku)
3. phase-1d-confidence-assessor (haiku)
4. phase-3a-task-lister (haiku)
5. phase-3b-task-decomposer (sonnet)
6. phase-3-planner (haiku)
7. phase-3-tool-selector (haiku)
8. phase-4-coordinator (sonnet)
9. phase-5-quality-validator (haiku)
10. phase-5-architecture-validator (haiku)

Examples:
- Major refactoring with architecture changes
- Multi-page feature with i18n, SEO, and performance
- Security audit and remediation
```

### FULL Tier (86-100) - Maximum Validation

```
Required Agents (21+):
ALL phases, ALL agents, including:
- phase-0-pre-analysis
- All Phase 1 agents (4)
- cross-phase-self-critique (multiple)
- All Phase 3 agents (6)
- All Phase 5 agents (5)
- phase-6-consolidation

Examples:
- Complete site redesign
- Multi-agent system implementation
- Production deployment with full validation
```

### Critical Keywords (Force STANDARD or Higher)

Regardless of complexity score, these keywords elevate to STANDARD minimum:

- `security`, `deploy`, `deployment`, `secrets`, `production`, `prod`
- `database`, `migration`

### Enforcement Rules

1. **Hook validates**: `validate-orchestrator.py` tracks all agent invocations
2. **Block on violation**: Edit/Write/Bash blocked until minimum agents invoked
3. **NO BYPASS**: `enforcement.allowBypass = false` in config
4. **Config location**: `.claude/config/complexity-tiers.json`
5. **TRIVIAL exception**: ONLY tier that allows direct tool usage (after scorer)

### Trust Level Reduction (Future)

High-trust users (level 5) can reduce tier by 1 level:
- FAST → TRIVIAL
- STANDARD → FAST
- ADVANCED → STANDARD
- FULL → ADVANCED

Floor: TRIVIAL (cannot reduce below)

---

## QUICK REFERENCE

**Top 5 Rules**:
1) Orchestrator ALWAYS first
2) **DELEGATE to agents** (orchestrator does NOT execute, except TRIVIAL tier)
3) Phase 1 verification only (Glob/Grep to check existence)
4) Ask if uncertain (<70% confidence)
5) Parallelize agent invocations (3-5x faster)

### Phase 1 Verification Tools (ONLY for existence checks)

| Check | Tool | Purpose | When OK | When DELEGATE |
|-------|------|---------|---------|---------------|
| File exists | Glob | `Glob('src/components/**/*.astro')` | Check existence | Reading content → delegate |
| Function exists | Grep | `Grep('ResponsiveImage', type: 'astro')` | Verify name exists | Understanding logic → delegate |
| Pattern search | Grep | `Grep('TODO\|FIXME', output_mode: 'files')` | Count occurrences | Analyzing patterns → delegate |

**Anti-Pattern**: Using Read/Grep to understand code → DELEGATE to `astro-expert`, `code-analyzer`, etc.

**Exception**: TRIVIAL tier (0-30) can use Read/Edit/Write/Bash directly after complexity-scorer

---

## 🤝 PROFESSIONAL OBJECTIVITY

**Prioritize technical accuracy over validating user's beliefs.**

1. Disagree when necessary (with evidence)
2. Factual analysis first (ignore emotional tone)
3. Challenge assumptions (question incorrect premises)
4. No false agreement (don't say "you're right" to be agreeable)
5. Rigorous standards (same for user's ideas and your own)

**Goal**: Objective guidance > false agreement

---

## 🎯 SIMPLICITY FIRST

**Every change should impact MINIMUM code necessary.**

### Core Rules

1. **Minimal Impact**: Change only what's necessary for the task - nothing more
2. **No Cascading Changes**: If 1 file solves it, don't touch 5
3. **Simple Solutions**: If a fix seems complex, step back and find simpler approach
4. **Zero New Bugs**: Your goal is to NOT introduce bugs - simplicity prevents them
5. **Root Cause Only**: Find and fix the real issue - NO temporary patches

### Anti-Patterns to Avoid

```
❌ "While I'm here, let me also refactor this..."
❌ "I'll add extra validation just in case..."
❌ "Let me create an abstraction for future use..."
❌ "This temporary fix will work for now..."
```

### Correct Patterns

```
✅ Fix exactly what was asked
✅ Minimum lines changed
✅ No speculative features
✅ No "improvements" unless requested
✅ Root cause identified and fixed permanently
```

**Mantra**: The best code change is the smallest one that solves the problem completely.

---

## 🎯 PROJECT OBJECTIVE

**Mission**: Best programmer in the world | **Approach**: Honest metrics, root cause solutions, continuous improvement

**Core Principles**: 1) Anti-hallucination FIRST 2) Ask when uncertain (<70%) 3) Fix root causes 4) Measurable quality 5) Universal applicability

---

## 🛡️ ANTI-HALLUCINATION (CRITICAL)

**Mandatory Rules**:

1. **Files**: `Glob` FIRST → then claim
2. **Functions**: `Grep` FIRST → then claim
3. **Ambiguity**: `AskUserQuestion` FIRST → then execute
4. **Confidence <70%**: ASK, don't assume
5. **Verification**: After claiming → READ/GREP to confirm

**Confidence Levels**:
- **95%+** (execute): Standard library, files already read, user-provided paths
- **70-85%** (hedge + verify): Project-specific code, config files, constructed paths
- **<70%** (ask): Ambiguous requirements, multiple interpretations, unclear intent

**Verification Loop**: Claim → Read to confirm → If wrong: acknowledge, retry, learn

**For complex tasks**: `/load-anti-hallucination` → Comprehensive patterns

---

## ⚡ CONTEXT & OPTIMIZATION

**Context Management**: File refs (not content), adaptive windows, relevance filtering → 70% token reduction
**TOON Format**: Tabular data → 40-60% token savings
**Parallelization**: Multiple tool calls in ONE message → 2-5x speedup for I/O

**For details**: `/load-context-management`, `/load-toon-format`

---

## 🔌 MCP SERVERS (2-10x SPEEDUP)

**4 servers**: filesystem (2x), git (3x), memory (persistent knowledge), fetch (10x cached)

| Operation | Native | MCP | Speedup | Context |
|-----------|--------|-----|---------|---------|
| Git status | 100ms | 30ms | 3x | Structured data |
| Docs (cached) | 3s | 300ms | 10x | Cached, LLM-optimized |
| Docs (first) | 3s | 2-4s | ~1x | First-time similar |
| API query | 200ms | 20ms | 10x | Direct API |

**Note**: MCP advantage = structured data + caching (not just raw speed)

---

## 🚀 PERFORMANCE

**Adaptive Model Selection**: Haiku (<50 complexity) = 2x faster, 10x cheaper | Sonnet (≥50) = best quality

**Tool Selection**: Native tools (Read, Grep, Glob) > Bash (13x faster for file ops)

**Batch Operations**: Multiple in ONE message → 3x faster (avoid network latency)

**Targets**: Simple <1s, Standard <2s, Complex <5s, 50%+ cost savings

---

## 🎯 KEYWORD-BASED AUTO-ACTIVATION

CV_Astro supports **automatic skill/agent activation** based on keywords detected in your messages.

### How Auto-Activation Works

1. **Keyword Detection**: Orchestrator scans your message for technology keywords (astro, react, i18n, seo, etc.)
2. **Skill Matching**: Matches keywords against YAML frontmatter in `.claude/skills/*/SKILL.md`
3. **Agent Routing**: Routes to specialized agents based on keyword weights
4. **Context Loading**: Auto-loads project context when project-specific keywords detected

### YAML Frontmatter Format

All specialized skills/agents have activation metadata:

```yaml
---
name: astro-component-generator
description: Generate Astro components with TypeScript frontmatter and i18n support
activation:
  keywords:
    - astro component
    - create astro
    - new component
  triggers:
    - "\.astro$"
  auto_load_project: cv-astro  # Auto-load CV_Astro context
---
```

### Specialized Skills/Agents

**CV_Astro-Specific** (8 skills + 6 agents + 5 commands):
- **Skills**: astro-component-generator, astro-react-integrator, structured-data-generator, pwa-optimizer, responsive-image-optimizer, tailwind-component-builder, astro-seo-validator, lighthouse-performance-optimizer
- **Agents**: i18n-manager, astro-expert, seo-optimizer, lighthouse-optimizer, pwa-auditor, image-optimizer-agent
- **Commands**: /astro-component, /i18n-add, /seo-check, /i18n-validate, /performance-check

**Universal** (7 skills + 16 agents):
- Always available regardless of keywords

### Example Activation Flows

**Flow 1: Astro Component Creation**
```
User: "Create an Astro component for the hero section"
  ↓
Keywords detected: "astro component", "hero"
  ↓
Skills activated: astro-component-generator
  ↓
Auto-loads: /load-project cv-astro
  ↓
Generates: Component with TypeScript Props, TailwindCSS, i18n support
```

**Flow 2: i18n Translation**
```
User: "Add translation for contact form title"
  ↓
Keywords detected: "translation", "add"
  ↓
Agent activated: i18n-manager
  ↓
Auto-loads: cv-astro context
  ↓
Result: Translation added to en/es/fr locale files
```

**Flow 3: SEO Optimization**
```
User: "Optimize SEO for Swiss market"
  ↓
Keywords detected: "seo", "swiss"
  ↓
Agent activated: seo-optimizer
  ↓
Auto-loads: cv-astro context
  ↓
Validates: Structured data, meta tags, hreflang, sitemap
```

### Directory Structure

```
.claude/
├── skills/
│   └── adaptive-meta-orchestrator/              # Behavioral guide (v3.7)
│       ├── SKILL.md                             # Always-execute guide
│       └── resources/                           # Deep-dive docs (11 files)
│           ├── orchestration-workflow.md
│           ├── complexity-routing.md
│           ├── tool-optimization.md
│           ├── quality-validation.md
│           ├── prompt-enhancement.md
│           ├── context-memory.md
│           ├── conflict-resolution.md          # v3.7
│           ├── graceful-degradation.md         # v3.7
│           ├── trust-levels.md                 # v3.7
│           ├── agent-communication.md          # v3.7
│           └── explainability.md               # v3.7
├── agents/                                      # 28+ agents
│   ├── task-lister.md                          # v3.7 - List tasks
│   ├── self-critique.md                        # v3.7 - Phase evaluation
│   ├── prompt-chain-analyzer.md                # v3.7 - Iteration detection
│   ├── trust-manager.md                        # v3.7 - Trust levels
│   ├── explainability-engine.md                # v3.7 - Decision explanation
│   ├── context-compressor.md                   # v3.7 - Context compression
│   └── ...
├── hooks/                                       # Auto-execute hooks
│   ├── forced-evaluation.py                    # v3.7 - EVALUATE→ACTIVATE→RUN
│   ├── trust-signal-detector.py                # v3.7 - Trust signals
│   └── iteration-detector.py                   # v3.7 - Correction detection
├── config/
│   ├── orchestrator-settings.json              # v3.7 config
│   └── complexity-tiers.json                   # v3.7 5-tier system
├── state/                                       # Runtime state
│   ├── user-trust.json                         # v3.7 - Trust level
│   ├── decisions.jsonl                         # v3.7 - Decision log
│   ├── phase-metrics.json                      # v3.7 - Success rates
│   └── complexity-calibration.json             # v3.7 - Self-correction
├── commands/                                    # Slash commands
├── docs/                                        # Reference docs
└── projects/cv-astro/                           # Project context
```

### Performance Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Activation Time | Manual invocation | Auto-detected | **Instant** |
| Context Loading | Manual /load-project | Auto-loaded | **2-3x faster** |
| Accuracy | Generic responses | Specialized | **99%+ compliant** |
| Developer UX | Remember commands | Just describe task | **Seamless** |

---

## 🛡️ SECURITY

**8 Core Rules**:

1. **NEVER commit secrets** - Scan before commit (OpenAI, GitHub, AWS, Google, Slack, Stripe patterns)
2. **Parameterized queries** - NO string concat in SQL
3. **Validate inputs** - Zod/similar sanitization
4. **Escape outputs** - Prevent XSS (use framework escaping)
5. **CSRF tokens** - State-changing requests
6. **Auth validation** - Verify JWT/session on protected routes
7. **Rate limiting** - Prevent brute force/DDoS
8. **Input length** - Prevent buffer overflow

**Quick Check**: SQL injection, XSS, path traversal, command injection, secrets, CSRF, auth, rate limiting

**For production**: `/load-security` → OWASP Top 10 + expanded patterns

**Target**: <1% incidents, 95%+ secret detection

---

## 🧪 TESTING

**Golden Rule**: Tests verify ROOT FUNCTIONALITY, not superficial checks

```typescript
// ❌ SUPERFICIAL
expect(validateEmail('test@example.com')).toBeTruthy();

// ✅ ROOT FUNCTIONALITY
expect(validateEmail('test@example.com')).toBe(true);
expect(validateEmail('invalid')).toBe(false);
expect(validateEmail('test@')).toBe(false);
```

**4 Rules**: 1) Generate from Given-When-Then (65-75% pass rate realistic) 2) Mutation testing (75-85% score) 3) Detect flaky tests 4) Quality gates (block if mutation <75%)

**Why**: Mutation testing detects superficial tests

**For new features**: `/load-testing-strategy` → Generation + mutation + flaky detection

**Target**: 65-75% first-gen pass, 75-85% mutation score

---

## 🔧 REFACTORING

**Safety Protocol**: Run tests BEFORE → refactor → tests AFTER → must pass → else ROLLBACK

**Thresholds** (SonarQube): CC >10 (refactor), >15 (critical) | Methods >50 lines (refactor), >100 (critical) | Duplication >5% (refactor), >10% (critical)

**Priority**: Duplication > Complexity > Length (Martin Fowler)

**For code reviews**: `/load-refactoring-patterns` → Smell detection + safe refactoring

**Target**: 95%+ detection, 99%+ safe refactorings

---

## 💬 USER EXPERIENCE

**Golden Rule: NO AUTO-DOCUMENTATION**

NEVER save docs without explicit request:
- ❌ Auto-create: README.md, JSDoc, API docs, diagrams
- ✅ Show on screen: Explanations, analysis, summaries
- ✅ Save when asked: "Document this", "Add JSDoc", "Update README"

**Error Messages**: `file:line - Specific error - Suggested fix` (verify file exists first with Glob)

**Progress**: TodoWrite for 3+ steps or >5s tasks (mark completed IMMEDIATELY, 1 in_progress at a time)

**Target**: 4.5/5 satisfaction, 0% unwanted docs

---

## 🔄 SELF-IMPROVEMENT

**Golden Rule: PROACTIVE SUGGESTIONS**

Detect patterns (3+ occurrences, >75% confidence) → Suggest: skills, agents, commands, MCPs, utils extraction

**Examples**: Glob('**/*.astro') 3x → "Create /find-astro-components?" | translateText() in 3 files → "Extract to i18n utils?" | Same SEO error 3x → "Add SEO validation rule?"

**Timing**: Errors=immediate, Workflows=end of task, Commands=daily summary | **Limits**: Max 2/hour, 5/session, 15min between

**Target**: 60%+ acceptance, 5-10 patterns/week

---

## 🐛 DEBUGGING

**5-Step Workflow**: 1) Reproduce issue 2) Locate error (stack trace bottom-up) 3) Trace backwards 4) Isolate cause (minimal reproduction) 5) Fix + verify (tests before/after)

**Stack Trace**: Read BOTTOM-UP for root cause

**Common Commands**: `Grep('console.log')`, `Grep('TODO|FIXME|BUG')`, `Grep('try|catch|throw')`

**Quick debug**: `/quick-debug`

---

## 📁 PROJECT-SPECIFIC CONTEXT

**Purpose**: Load specialized knowledge for CV_Astro project (Astro 5.5.2 + React 18 + i18n)

### .claude/projects/cv-astro/ Structure

```
.claude/projects/cv-astro/
├── README.md                  # Project overview & usage guide
├── core/                      # Always-load documentation
│   ├── architecture.md        # Astro/React patterns, component guidelines
│   ├── i18n.md                # Translation management (en/es/fr)
│   ├── seo.md                 # Swiss (Zurich) & Spanish SEO optimization
│   └── workflows.md           # Common development workflows
└── knowledge/                 # Reference documentation (load on demand)
    └── (future expansions)
```

### Loading Project Context

**Command**: `/load-project cv-astro`

**What gets loaded**:
1. **README.md** - Quick overview
2. **core/*.md** - All core documentation (architecture, i18n, SEO, workflows)
3. **Token-efficient summary** - <1,500 tokens, <2 seconds

**Auto-loading**: Skills/agents can specify `auto_load_project: cv-astro` in YAML frontmatter to automatically load context when activated

### When to Use

- Creating Astro components → Auto-loaded via keyword detection
- Adding translations → Auto-loaded by i18n-manager agent
- SEO optimization → Auto-loaded by seo-optimizer agent
- Manual loading → `/load-project cv-astro` if needed

### Benefits

- **Fast**: <2 seconds to load, ~1,500 tokens
- **Accurate**: 100% project-specific patterns
- **On-demand**: Load only when needed
- **Stack-specific**: Astro 5.5.2, React 18, TailwindCSS 3.4.1, i18next

---

## 📚 AVAILABLE TOOLS

### Commands (23)

**Universal (18)**: `/tools`, `/skills`, `/agents`, `/commands`, `/validate-claim`, `/load-anti-hallucination`, `/load-context-management`, `/load-toon-format`, `/generate-from-spec`, `/load-security`, `/load-testing-strategy`, `/load-refactoring-patterns`, `/load-user-experience`, `/load-self-improvement`, `/docs`, `/claude-docs`, `/project-docs`, `/quick-debug`

**CV_Astro-specific (5)**: `/astro-component`, `/i18n-add`, `/seo-check`, `/i18n-validate`, `/performance-check`

---

### Skills (15)

**Universal (7)**: adaptive-meta-orchestrator, skill-builder, task-router, code-analyzer, orchestrator-observability, spec-architect-agent, utils-builder, persistent-memory

**CV_Astro-specific (8)**: astro-component-generator, astro-react-integrator, structured-data-generator, pwa-optimizer, responsive-image-optimizer, tailwind-component-builder, astro-seo-validator, lighthouse-performance-optimizer

---

### Agents (60 total)

**Phase-Specific (20)** - Mandatory per phase:
- Phase 0: `phase-0-pre-analysis`
- Phase 1: `phase-1a-keyword-detector`, `phase-1b-complexity-scorer`, `phase-1c-prompt-quality`, `phase-1d-confidence-assessor`
- Phase 2: `phase-2-context-loader`
- Phase 3: `phase-3-planner`, `phase-3a-task-lister`, `phase-3b-task-decomposer`, `phase-3-dependency-analyzer`, `phase-3-tool-selector`, `phase-3-strategy-determiner`
- Phase 4: `phase-4-coordinator`
- Phase 5: `phase-5-coordinator`, `phase-5-quality-validator`, `phase-5-architecture-validator`, `phase-5-self-validator`, `phase-5-reflexion`, `phase-5-security-scanner`
- Phase 6: `phase-6-consolidation`

**Cross-Phase (2)**: `cross-phase-self-critique`, `cross-phase-context-compressor`

**Auxiliary (6)** - Conditional activation:
`auxiliary-trust-manager`, `auxiliary-explainability`, `auxiliary-iteration-detector`, `auxiliary-prompt-enhancer` (opus), `auxiliary-architecture-reviewer` (opus), `auxiliary-strategic-planner` (opus)

**Universal (10)**: question-generator, test-generator, performance-profiler, refactor-planner, bug-documenter, decision-documenter, progress-tracker, frontend-expert, backend-expert, code-quality

**CV_Astro-specific (6)**: i18n-manager, astro-expert, seo-optimizer, lighthouse-optimizer, pwa-auditor, image-optimizer-agent

**Django/Binora (16)**: django-codebase-auditor, django-performance-analyzer, django-security-auditor, django-test-generator, django-feature-planner, django-service-layer-generator, django-contract-compliance-validator, binora-deployment-checker, binora-pre-commit-guardian, binora-multi-tenant-enforcer, security-auditor, performance-analyzer, testing-agent, refactor-agent, pr-comment-generator

**Invocation syntax**:
```typescript
Task({
  subagent_type: 'i18n-manager',
  description: 'Add translation to all locales',
  prompt: 'Add translation key "hero.title" with English text "Welcome" to en/es/fr locales',
  model: 'haiku'  // Optional: haiku (speed), sonnet (quality)
});
```

---

### MCPs (4)

| MCP | Purpose | When to Use |
|-----|---------|-------------|
| `mcp__context7__*` | Filesystem operations | File read/write/search |
| `mcp__git__*` | Git operations | Git status, diff, log |
| `mcp__memory__*` | Persistent memory | Cross-session knowledge |
| `mcp__fetch__*` | Web fetching (cached) | Documentation access |

**Note**: MCPs provide structured data and caching benefits.

---

## 🔄 ORCHESTRATOR-DRIVEN WORKFLOWS

**CRITICAL**: ALL workflows start with `adaptive-meta-orchestrator` (automatic, per ORCHESTRATOR RULE). The orchestrator analyzes your request, detects keywords, and executes the appropriate workflow using commands, agents, and skills.

### Universal Pattern (ALL Requests)

```
User: "Any request"
  ↓
adaptive-meta-orchestrator (ALWAYS FIRST - automatic)
  ↓
Phase 0: Pre-Analysis (if token budget >75%)
  - Agent: phase-0-pre-analysis (compress context)
  ↓
Phase 1: Evaluation (4 agents in PARALLEL)
  - Agent: phase-1a-keyword-detector (detect keywords)
  - Agent: phase-1b-complexity-scorer (score 0-100)
  - Agent: phase-1c-prompt-quality (assess clarity)
  - Agent: phase-1d-confidence-assessor (confidence level)
  - Self-critique after Phase 1
  ↓
Phase 2: Complexity Scoring
  - Re-score based on Phase 1 findings
  - Determine tier (TRIVIAL/FAST/STANDARD/ADVANCED/FULL)
  ↓
Phase 3: Decomposition (if complexity >40)
  - Agent: phase-3a-task-lister (list all tasks)
  - Agent: phase-3b-task-decomposer (break down complex tasks)
  - Agent: phase-3-dependency-analyzer (identify dependencies)
  - Self-critique after Phase 3
  ↓
Phase 4: Planning
  - Agent: phase-3-planner (create execution plan)
  - Agent: phase-3-tool-selector (select optimal tools)
  - Agent: phase-3-strategy-determiner (sequential/parallel/hybrid)
  ↓
Phase 5: Execution
  - Agent: phase-4-coordinator (coordinate execution)
  - Specialists: astro-expert, seo-optimizer, i18n-manager, etc.
  ↓
Phase 6: Validation
  - Agent: phase-5-coordinator (coordinate validation)
  - Agent: phase-5-quality-validator (quality checks)
  - Agent: phase-5-architecture-validator (architecture review)
  - Agent: phase-5-security-scanner (security scan)
  - Self-critique after Phase 6
  ↓
Phase 7: Consolidation (for significant tasks)
  - Agent: phase-6-consolidation (update knowledge graph)
```

### Example 1: Create Astro Component

```
User: "Create an Astro component for the contact form with i18n"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "astro component", "i18n"
Complexity: 45/100 → FAST tier
  ↓
Orchestrator workflow:
  1. Auto-load: /load-project cv-astro (auto_load_project: cv-astro)
  2. Skill: astro-component-generator (generate component)
  3. Validates: TypeScript Props interface, TailwindCSS patterns
  4. Adds: i18n integration with t() helper
  5. Creates: src/components/ContactForm.astro
  ↓
Result: Component created with full i18n support
```

### Example 2: Add Translation (TRIVIAL)

```
User: "Add translation for button text 'Submit'"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "translation", "add"
Complexity: 15/100 → TRIVIAL tier
  ↓
Orchestrator workflow:
  1. phase-1b-complexity-scorer → Confirms TRIVIAL (0-30)
  2. Direct tool usage allowed → Read locales, Write updates
  3. Updates: public/locales/{en,es,fr}/common.json
  ↓
Result: Translation added (no coordinator needed)
```

### Example 3: SEO Optimization for Swiss Market

```
User: "Optimize SEO for Switzerland with structured data"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "seo", "switzerland", "structured data"
Complexity: 65/100 → STANDARD tier
  ↓
Orchestrator workflow:
  1. Auto-load: /load-project cv-astro
  2. Agent: seo-optimizer (comprehensive SEO audit)
  3. Skill: structured-data-generator (Person schema with Zurich address)
  4. Validates: Meta tags, hreflang (en/es/fr), canonical URLs
  5. Checks: Sitemap completeness
  6. Command: /seo-check (final validation)
  ↓
Result: Full SEO optimization + validation report
```

### Example 4: Performance Optimization (ADVANCED)

```
User: "Optimize Lighthouse score, especially LCP"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "lighthouse", "lcp", "optimize"
Complexity: 75/100 → ADVANCED tier
  ↓
Orchestrator workflow:
  1. Auto-load: cv-astro context
  2. Command: /performance-check (run Lighthouse audit)
  3. Agent: lighthouse-optimizer (analyze metrics)
  4. Identifies: Large unoptimized images, no preload for hero
  5. Skill: responsive-image-optimizer (generate WebP)
  6. Adds: <link rel="preload"> for LCP image
  7. Re-runs: Lighthouse audit
  ↓
Result: LCP improved from 4.2s to 1.8s, score 92/100
```

### Orchestrator Decision Logic

The orchestrator analyzes requests through 8 sequential phases:

**Phase 0: Pre-Analysis (Conditional)**
- Triggered if token budget >75%
- Agent: phase-0-pre-analysis
- Compresses context to reduce token usage
- Prepares optimized prompt for Phase 1

**Phase 1: Evaluation (4 Parallel Agents)**
- Agent: phase-1a-keyword-detector → Scan for technology/domain keywords
- Agent: phase-1b-complexity-scorer → Initial complexity score (0-100)
- Agent: phase-1c-prompt-quality → Assess clarity and completeness
- Agent: phase-1d-confidence-assessor → Confidence level (0-100%)
- Self-critique: Evaluate Phase 1 results

**Phase 2: Complexity Scoring**
- Re-score based on Phase 1 findings
- Determines tier (TRIVIAL/FAST/STANDARD/ADVANCED/FULL)
- Categorizes task by tool access requirements

**Phase 3: Decomposition (if complexity >40)**
- Agent: phase-3a-task-lister → List all required tasks
- Agent: phase-3b-task-decomposer → Break down complex tasks into subtasks
- Agent: phase-3-dependency-analyzer → Identify task dependencies
- Self-critique: Evaluate decomposition quality

**Phase 4: Planning**
- Agent: phase-3-planner → Create execution plan with validation gates
- Agent: phase-3-tool-selector → Select optimal tools (commands/agents/skills)
- Agent: phase-3-strategy-determiner → Sequential/Parallel/Hybrid execution
- Output: Execution plan with dependency graph

**Phase 5: Execution**
- Agent: phase-4-coordinator → Orchestrate execution across specialists
- Specialists: astro-expert, seo-optimizer, i18n-manager, etc.
- Execute per strategy (parallel for independent tasks, sequential for dependencies)
- Track progress with TodoWrite

**Phase 6: Validation**
- Agent: phase-5-coordinator → Coordinate validation activities
- Agent: phase-5-quality-validator → Validate code quality, tests, linting
- Agent: phase-5-architecture-validator → Review architectural compliance
- Agent: phase-5-security-scanner → Scan for security vulnerabilities
- Self-critique: Evaluate overall results

**Phase 7: Consolidation (for significant tasks)**
- Agent: phase-6-consolidation → Update knowledge graph
- Store patterns for future use
- Log decision rationale
- Update calibration metrics

**Execution Strategy Decision:**

| Strategy | When to Use | Rationale | Example |
|----------|-------------|-----------|---------|
| **Sequential** | Tasks have dependencies | Step N needs output from Step N-1 | Generate component → Add i18n → Validate |
| **Parallel** | Tasks are independent + high volume | No shared state, can run simultaneously | SEO + Performance + PWA + i18n audits |
| **Hybrid** | Mix of dependencies | Some sequential, some parallel | Load context (seq) → Run 3 audits (parallel) → Report (seq) |

**Examples of Execution Strategy Decision:**

```
High complexity (85) + Independent tasks → Parallel
  "Audit entire site"
  → Run 4 agents in parallel (SEO, performance, PWA, i18n)

High complexity (85) + Sequential dependencies → Sequential
  "Implement new page with SEO"
  → Generate component (seq) → Add SEO schema (seq) → Validate (seq)

Medium complexity (50) + High volume → Parallel
  "Optimize all images"
  → Run responsive-image-optimizer for all images in parallel

TRIVIAL complexity (15) + Single task → Direct
  "Add translation for button"
  → Direct Read/Write (no coordinator needed)
```

**Key Principle**: Complexity determines *tier*, task structure determines *execution strategy*.

---

## ✅ SUCCESS CRITERIA

**Performance**: 2-5x speedup (routine tasks), native tools > Bash, parallelization applied

**Quality**: Zero linting/TS errors, tests pass, CC <10, methods <50 lines

**Anti-Hallucination**: Files/functions verified, confidence assessed, <5% hallucination rate

**Testing**: 65-75% first-gen pass, 75-85% mutation score, root functionality verified

**Security**: 95%+ secret detection, <1% incidents, OWASP Top 10 applied

**Documentation**: AI_*.md updated when applicable, 0% unwanted docs

**Root Cause**: Addressed (not superficial), proactive improvements proposed, 4.5/5 satisfaction

---

**System Version**: 3.7.0 (CV_Astro + Orchestrator v3.7)
**Behavioral Guide**: `.claude/skills/adaptive-meta-orchestrator/SKILL.md`
**Stack**: Astro 5.5.2 + React 18 + TypeScript + TailwindCSS 3.4.1 + i18next
**Markets**: Switzerland (Zurich) + Spain
**Scope**: Astro SSG, React islands, i18n, SEO optimization, PWA, performance
