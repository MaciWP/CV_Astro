# Claude Code Enhancement System - CV_Astro Project

```
═══════════════════════════════════════════════════════════════════════════════
 ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗     ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║     ██║     ███████║██║   ██║██║  ██║█████╗      ██║     ██║   ██║██║  ██║█████╗
██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝      ██║     ██║   ██║██║  ██║██╔══╝
╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗    ╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
═══════════════════════════════════════════════════════════════════════════════

🚨 MANDATORY FIRST ACTION - NO EXCEPTIONS 🚨

BEFORE analyzing user's message → EXECUTE: Skill('adaptive-meta-orchestrator')

Applies to: ALL messages (complex, simple, questions, greetings, EVERYTHING)
The orchestrator decides complexity and routes appropriately.
YOU just activate it. ALWAYS. FIRST. NO THINKING.

═══════════════════════════════════════════════════════════════════════════════
```

## 🚀 QUICK REFERENCE

**Top 5 Rules**: 1) Orchestrator ALWAYS first 2) Validate before claiming (`Glob`/`Grep`) 3) Ask if uncertain (<70% confidence) 4) Verify after claiming (Read to confirm) 5) Parallelize independent ops (3-5x faster)

| Task | Tool | Example | Time |
|------|------|---------|------|
| Check file | Glob | `Glob('src/components/**/*.astro')` | 85ms |
| Find component | Grep | `Grep('ResponsiveImage', type: 'astro')` | 120ms |
| Read file | Read | `Read('src/layouts/Layout.astro')` | 15ms |
| Ask user | AskUserQuestion | When confidence <70% | - |

**Key Commands**: `/astro-component`, `/i18n-add`, `/seo-check`, `/performance-check`, `/validate-claim`

---

## 🤖 ORCHESTRATOR RULE (ABSOLUTE)

**ACTIVATE `adaptive-meta-orchestrator` ON EVERY USER MESSAGE - NO EXCEPTIONS**

```
Skill('adaptive-meta-orchestrator')
```

**WHY this design?**
- **Single decision point**: Orchestrator decides complexity, not you (no logic duplication)
- **Consistent routing**: All tasks through same entry point (predictable behavior)
- **Adaptive optimization**: Learns patterns over time
- **If YOU decide when to activate, YOU become the orchestrator** (anti-pattern)

**The orchestrator decides**: Trivial → direct response | Complex → full workflow with specialized agents

**If you violated**: STOP → Recognize internally → Activate orchestrator NOW → Continue

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
├── skills/                                      # 15 total (7 universal + 8 cv-astro)
│   ├── adaptive-meta-orchestrator/              # Master orchestrator
│   │   ├── SKILL.md
│   │   └── resources/
│   │       └── agent-routing/
│   │           └── routing-algorithm.md         # Keyword mapping logic
│   ├── astro-component-generator/SKILL.md       # YAML frontmatter
│   ├── astro-react-integrator/SKILL.md          # YAML frontmatter
│   ├── structured-data-generator/SKILL.md       # YAML frontmatter
│   ├── pwa-optimizer/SKILL.md                   # YAML frontmatter
│   ├── responsive-image-optimizer/SKILL.md      # YAML frontmatter
│   ├── tailwind-component-builder/SKILL.md      # YAML frontmatter
│   ├── astro-seo-validator/SKILL.md             # YAML frontmatter
│   ├── lighthouse-performance-optimizer/SKILL.md # YAML frontmatter
│   ├── auto-discovery/SKILL.md                  # Auto-catalog tools
│   └── ...
├── agents/                                      # 22 total (16 universal + 6 cv-astro)
│   ├── i18n-manager.md                          # YAML frontmatter
│   ├── astro-expert.md                          # YAML frontmatter
│   ├── seo-optimizer.md                         # YAML frontmatter
│   ├── lighthouse-optimizer.md                  # YAML frontmatter
│   ├── pwa-auditor.md                           # YAML frontmatter
│   ├── image-optimizer-agent.md                 # YAML frontmatter
│   └── ...
├── commands/                                    # 23 total (18 universal + 5 cv-astro)
│   ├── load-project.md                          # Load project context
│   ├── astro-component.md                       # Quick component generation
│   ├── i18n-add.md                              # Add translation
│   ├── seo-check.md                             # SEO validation
│   ├── i18n-validate.md                         # Translation consistency
│   ├── performance-check.md                     # Lighthouse audit
│   ├── validate-claim.md
│   └── ...
├── docs/                                        # Reference documentation
│   ├── ANTI-HALLUCINATION.md
│   ├── CONTEXT-MANAGEMENT.md
│   ├── TESTING-STRATEGY.md
│   └── ...
└── projects/                                    # Project-specific context
    └── cv-astro/
        ├── README.md                            # Quick overview
        ├── core/                                # Always-loaded (~1,500 tokens)
        │   ├── architecture.md                  # Astro/React patterns
        │   ├── i18n.md                          # Translation management
        │   ├── seo.md                           # Swiss/Spanish SEO
        │   └── workflows.md                     # Common dev workflows
        └── knowledge/                           # On-demand references
            └── (future expansions)
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

### Agents (22)

**Universal (16)**: context-detector, complexity-analyzer, question-generator, quality-validator, pattern-learner, task-decomposer, test-generator, security-scanner, performance-profiler, refactor-planner, bug-documenter, decision-documenter, progress-tracker, frontend-expert, backend-expert, code-quality

**CV_Astro-specific (6)**: i18n-manager, astro-expert, seo-optimizer, lighthouse-optimizer, pwa-auditor, image-optimizer-agent

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
Phase 0: Context Loading & Prompt Analysis
  - Agent: context-detector (analyze what context is needed)
  - Load relevant knowledge:
    * /load-anti-hallucination (if files/functions mentioned)
    * /load-testing-strategy (if "test", "coverage" detected)
    * /load-security (if "security", "audit", "deploy" detected)
    * /load-refactoring-patterns (if "refactor", "improve" detected)
    * /load-project cv-astro (if CV_Astro keywords detected)
  ↓
Phase 1: Keyword Analysis
  - Keywords detected (astro, react, i18n, seo, performance, etc.)
  - Priority weights (CRITICAL > HIGH > MEDIUM > LOW)
  - Match against YAML frontmatter
  ↓
Phase 2: Complexity Scoring (0-100)
  - Determine tool type needed
  - Score based on task scope and dependencies
  ↓
Phase 3: Workflow Decision
  - Select tools (commands, agents, skills)
  - Determine execution strategy (sequential, parallel, hybrid)
  - Plan validation steps
  ↓
Phase 4: Execution & Validation
  - Execute workflow with selected tools
  - Apply skills validation
  - Verify results
```

### Example 1: Create Astro Component

```
User: "Create an Astro component for the contact form with i18n"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "astro component", "i18n"
Complexity: 45/100 (medium)
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

### Example 2: Add Translation

```
User: "Add translation for the hero section title in all languages"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "translation", "add", "languages"
Complexity: 35/100 (low-medium)
  ↓
Orchestrator workflow:
  1. Auto-load: cv-astro context
  2. Agent: i18n-manager (manage translations)
  3. Prompts for: English text, context
  4. Generates: Spanish (es-ES) and French (Swiss French) translations
  5. Updates: public/locales/{en,es,fr}/common.json
  6. Validates: JSON syntax, no duplicates
  ↓
Result: Translation added to all 3 locales
```

### Example 3: SEO Optimization for Swiss Market

```
User: "Optimize SEO for Switzerland with structured data"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "seo", "switzerland", "structured data"
Complexity: 65/100 (medium-high)
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

### Example 4: Performance Optimization

```
User: "Optimize Lighthouse score, especially LCP"
  ↓
adaptive-meta-orchestrator
  ↓
Keywords detected: "lighthouse", "lcp", "optimize"
Complexity: 70/100 (high)
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

The orchestrator analyzes requests through 4 independent phases:

**Phase 1: Keyword Analysis**
- Scans user message for technology/domain keywords
- Assigns priority weights: CRITICAL (security, deploy) > HIGH (performance, SEO) > MEDIUM (i18n, components) > LOW (style, formatting)
- Matches detected keywords against `activation:` YAML frontmatter in skills/agents
- Determines if project context auto-loading required (`auto_load_project: cv-astro`)

**Phase 2: Complexity Scoring (0-100)**

Determines *what tools* to use, not *how* to execute:

| Score | Response Type | Tool Selection | Example |
|-------|---------------|----------------|---------|
| 0-20 | Direct answer | None | "What is Astro?" → Text response |
| 21-40 | Skill validation | 1 skill | "Check this SEO" → astro-seo-validator |
| 41-60 | Single agent | 1 agent + skills | "Add translation" → i18n-manager |
| 61-80 | Multiple agents | 2-3 agents | "Optimize SEO + performance" → seo + lighthouse |
| 81-100 | Agent cascade | 3+ agents + validation | "Full site audit" → SEO + PWA + performance + i18n |

**Phase 3: Tool Selection**

Based on task nature (independent of complexity):

- **Commands**: Quick checks, validations (≤30s execution)
  - `/seo-check`, `/performance-check`, `/i18n-validate`
- **Skills**: Validation rules, pattern enforcement (no heavy computation)
  - `astro-component-generator`, `structured-data-generator`, `pwa-optimizer`
- **Agents**: Complex tasks, analysis (>30s execution)
  - `i18n-manager`, `seo-optimizer`, `lighthouse-optimizer`

**Phase 4: Execution Strategy**

Determined by *task dependencies* and *work volume* (independent of complexity):

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

Low complexity (30) + Single task → Direct
  "Add translation for button"
  → i18n-manager agent (single operation)
```

**Key Principle**: Complexity determines *tool type*, task structure determines *execution strategy*.

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

**System Version**: 3.0.0 (CV_Astro Specialized)
**Purpose**: CV_Astro Project Enhancement System
**Stack**: Astro 5.5.2 + React 18 + TypeScript + TailwindCSS 3.4.1 + i18next
**Markets**: Switzerland (Zurich) 🇨🇭 + Spain 🇪🇸
**Scope**: Astro SSG, React islands, i18n, SEO optimization, PWA, performance
