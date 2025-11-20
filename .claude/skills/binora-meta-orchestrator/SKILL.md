---
name: binora-backend-performance-orchestrator
description: META-SKILL ORCHESTRATOR - ALWAYS-ACTIVE. Orchestrates 100% Binora Backend workflows (Django 5.0+DRF 3.14+PostgreSQL multi-tenant) through 6-phase execution (Pre-Analysis, Request Analysis, Workflow Planning, Skill Coordination, Tool Optimization, Quality Assurance). Enforces P0 CRITICAL rules (NO manual tenant_id, service layer mandatory, YOLO comments). Selects optimal model (Sonnet/Haiku). MCP-first strategy (Context7/db/github/sequential-thinking). Target: 3-5x speedup, 95%+ P1 compliance, <500 token overhead.
activation:
  keywords:
    - binora
    - binora-backend
    - multi-tenant
    - tenant_id
    - django
    - drf
    - ViewSet
    - service layer
    - test coverage
  always_active: true
  auto_load_project: binora
tech_stacks: [Django 5.0, DRF 3.14, PostgreSQL, pytest-django]
version: 5.0.0
---

# Binora Backend Performance Orchestrator - META-SKILL

**ALWAYS-ACTIVE** - Executes on EVERY request as the central orchestrator for Binora Backend workflows.

## Mission

Orchestrate **100% of Binora Backend workflows** (Django 5.0 + DRF 3.14 + PostgreSQL multi-tenant) through **6-phase systematic execution** achieving **3-5x workflow speedup**, **95%+ P1 compliance**, **optimal model selection (Sonnet/Haiku)**, and **<500 token overhead**.

---

## 6-Phase Orchestration Workflow

### Phase 0: Pre-Analysis (Fast Filter)

**ALWAYS execute FIRST - Determines workflow path:**

1. **Quick score (0-100):**
   - Score >90: Skip Phase 1, proceed to Phase 2 (save ~500 tokens + 5s)
   - Score 70-90: Light Phase 1 (context only)
   - Score 40-69: Full Phase 1 (Template pattern)
   - Score <40: Enhanced Phase 1 (Cognitive Verifier)

2. **Keyword detection (Auto-flag risk):**
   - ⚠️ **CRITICAL**: `tenant_id`, `filter(tenant`, `.filter(company_id`
   - ⚠️ **HIGH**: `ViewSet`, `business logic`, `Mock()`, `serializer.save()`
   - ⚠️ **MEDIUM**: `query`, `objects.all()`, `test`, `def test_`
   - ⚠️ **LOW**: `comment`, `docstring`, `type hint`

3. **Risk flagging:**
   - CRITICAL (P0): Manual tenant filtering → REJECT immediately
   - HIGH (P1): Service layer violation → Activate `django-architecture-enforcer`
   - MEDIUM (P2): Query optimization needed → Activate `django-query-optimizer`
   - LOW (P3): Code style issues → Activate `code-style-enforcer`

4. **Model pre-selection:**
   - Complexity HIGH OR Risk CRITICAL → **Sonnet 4.5** + Thinking (8192)
   - Complexity MEDIUM → **Sonnet 4.5** + Thinking (4096)
   - Complexity LOW → **Haiku 4.5**

**Auto-Check:**
- [ ] Quick score calculated?
- [ ] Keywords detected and risk flagged?
- [ ] Model pre-selected based on complexity + risk?

---

### Phase 1: Request Analysis (Binora-Enhanced)

**Execute when score <90 (from Phase 0):**

1. **Binora-specific scoring rubric (0-100):**
   - **Clarity** (0-25): Action verbs? File paths? Scope clear?
   - **Context** (0-25): Multi-tenant aware? Service layer mentioned? Django/DRF patterns?
   - **Structure** (0-20): XML tags? Step-by-step? Organized?
   - **Examples** (0-15): Code samples? Expected output?
   - **Actionability** (0-15): Success criteria? Measurable outcomes?

   **Binora bonuses (+25):**
   - +5: Specific files mentioned (`apps/core/...`)
   - +5: Django/DRF patterns referenced
   - +5: Multi-tenant considerations included
   - +5: Testing/coverage mentioned
   - +5: Clear success criteria

2. **Enhancement patterns:**
   - Score <40: **Cognitive Verifier** (break into sub-questions)
   - Score 40-69: **Template Pattern** (`<task><context><expected_output>`)
   - Score 70-89: **Context Building** (add constraints, dependencies)

**Auto-Check:**
- [ ] Prompt scored with Binora bonuses?
- [ ] Enhancement pattern applied if needed?
- [ ] Enhanced version improves score by +20-30 points?

---

### Phase 2: Workflow Planning (Model Selection + Resources)

**ALWAYS execute - Determines execution strategy:**

1. **Task classification:**
   - **Bug**: symptom → diagnosis → fix → test
   - **Feature**: requirements → design → implement → test
   - **Refactor**: audit → plan → refactor → validate
   - **Question**: research → synthesize → answer with examples

2. **Complexity estimation:**
   - **Low**: Single file, <15min, 1 skill, confidence >90%
   - **Medium**: 2-3 files, 15-45min, 2-3 skills, confidence 70-90%
   - **High**: 4+ files, >45min, 3+ skills OR 1+ agent, confidence <70%

3. **Model selection matrix:**

| Complexity | Risk Level | Model | Thinking Budget | Use Case |
|------------|-----------|-------|----------------|----------|
| High | Any | **Sonnet 4.5** | 8192 tokens | Architectural decisions, complex implementation, CRITICAL validation |
| Medium | HIGH/CRITICAL | **Sonnet 4.5** | 4096 tokens | Standard implementation, refactoring |
| Medium | LOW/MEDIUM | **Sonnet 4.5** | 2048 tokens | Simple implementation |
| Low | Any | **Haiku 4.5** | 0 (disabled) | Exploration, simple queries, documentation |

4. **Resource selection:**
   - **Slash commands** (<2min): `/quick-audit`, `/check-tenant`, `/coverage`
   - **Agents** (>5min): `django-test-generator` (100% coverage), `service-layer-generator`
   - **Skills** (auto): P0 CRITICAL always active, P1-P3 on-demand
   - **MCPs** (research): Context7 (docs), db (schema), github (history), sequential-thinking (complex reasoning)

**Auto-Check:**
- [ ] Task classified correctly?
- [ ] Complexity estimated with confidence level?
- [ ] Model selected based on complexity + risk?
- [ ] Resources identified (commands/agents/skills/MCPs)?

---

### Phase 3: Skill Coordination (Priority-Based)

**ALWAYS suggest relevant skills based on domain:**

1. **Priority-based skill activation:**

   **P0 CRITICAL (ALWAYS active):**
   - `multi-tenant-guardian` ⚠️ - Prevents manual tenant_id filtering
   - `django-architecture-enforcer` ⚠️ - Enforces service layer delegation

   **P1 HIGH (Activate on-demand):**
   - `django-query-optimizer` - Enforces select_related/prefetch_related/order_by
   - `postgresql-performance` - Database indexes, migration safety
   - `django-testing-patterns` - AAA pattern, 100% coverage, mocker.Mock()

   **P2 MEDIUM (Suggest if relevant):**
   - `drf-serializer-patterns` - Input/Output separation, validation-only
   - `code-style-enforcer` - Type hints, YOLO comments, imports

   **P3 LOW (Optional):**
   - `openapi-contract-validator` - Match OpenAPI spec
   - `openapi-contract-editor` - Create/update contracts

2. **Agent delegation (10 agents available):**
   - **Planning**: `feature-planner`, `django-codebase-auditor`, `performance-analyzer`, `contract-compliance-validator`
   - **Generation**: `django-test-generator`, `service-layer-generator`
   - **Validation**: `multi-tenant-enforcer`, `security-auditor`, `pre-commit-guardian`, `deployment-checker`

   **Use agents when**: Complex multi-step (>5min), parallel work (2-5 optimal), 100% coverage generation
   **Avoid agents when**: Single skill sufficient (<5min), sequential dependencies

**Auto-Check:**
- [ ] P0 CRITICAL skills activated?
- [ ] Relevant P1-P3 skills suggested?
- [ ] Agent delegation justified (>5min tasks)?

---

### Phase 4: Tool Optimization (MCP-First Strategy)

**ALWAYS optimize tool usage for speed:**

1. **MCP-first priority order:**
   ```
   MCPs > Specialized tools > WebSearch
   ```

2. **MCP decision matrix:**
   - **Context7 MCP**: Django/DRF/PostgreSQL docs (3-5x faster than WebSearch)
     * Example: "How to optimize Django QuerySets?" → `Context7("/django/django", "query optimization")`
   - **db MCP**: Schema queries, migration analysis
     * Example: "What columns does User model have?" → `db("SELECT column_name FROM information_schema.columns WHERE table_name='core_user'")`
   - **github MCP**: Commit history, PR context
     * Example: "Why was this pattern used?" → `github("git log -p apps/core/services.py")`
   - **sequential-thinking MCP**: Complex reasoning (ULTRATHINK)
     * Example: "Design multi-tenant service layer" → `sequential-thinking(18 thoughts)`

3. **Parallel execution:**
   - ✅ Read 3 files in parallel (single message, 3 Read calls)
   - ✅ Grep + Context7 in parallel
   - ❌ Sequential Read → Read → Read (3x slower)

4. **Token budget monitoring:**
   - <150K (75%): ✅ Safe, proceed normally
   - 150K-175K (75-87.5%): ⚠️ Warning, consider cleanup
   - 175K-190K (87.5-95%): 🚨 Alert, cleanup needed
   - >190K (95%): 🔥 Critical, mandatory cleanup

**Auto-Check:**
- [ ] MCPs checked before traditional tools?
- [ ] Parallel execution used for independent operations?
- [ ] Token budget monitored?

---

### Phase 5: Quality Assurance (Fail-Fast Validation)

**ALWAYS validate before completion:**

1. **P0 CRITICAL gates (MUST pass - Fail immediately if violated):**
   - ⚠️ **NO manual `tenant_id` filtering**
     * ❌ FORBIDDEN: `User.objects.filter(tenant_id=company.id)`
     * ✅ CORRECT: `User.objects.filter(email=email)` (middleware adds tenant_id)
     * Reference: django-tenants TenantMainMiddleware pattern

   - ⚠️ **ALL business logic in services**
     * ❌ FORBIDDEN: Business logic in ViewSet.create()
     * ✅ CORRECT: ViewSet delegates to service.create_user()
     * Reference: `.claude/core/architecture.md`

   - ⚠️ **NO `Mock()` without `mocker` fixture**
     * ❌ FORBIDDEN: `from unittest.mock import Mock`
     * ✅ CORRECT: `def test_something(mocker): mock = mocker.Mock()`
     * Reference: `.claude/core/testing.md`

2. **P1 HIGH gates (SHOULD pass - Warning if violated):**
   - Type hints on all function parameters and return values
   - Query optimization (select_related/prefetch_related/order_by used)
   - 100% test coverage per file with AAA pattern
   - Model selection appropriate for task complexity

3. **P2 MEDIUM gates (NICE to pass - Info if violated):**
   - YOLO comments (NO docstrings in tests, minimal comments)
   - OpenAPI contract compliance
   - Parallel execution used when possible

**Auto-Check:**
- [ ] P0 gates validated? (BLOCK if failed)
- [ ] P1 gates checked? (WARN if failed)
- [ ] P2 gates evaluated? (INFO if failed)

---

## Anti-Patterns

**Common mistakes to avoid:**

### Anti-Pattern 1: Sequential Tools When Parallel Possible
Executing independent operations sequentially instead of in parallel (3-10x slower).

❌ **WRONG**:
```python
Read apps/core/views/user.py  # 2s
Read apps/core/services.py    # 2s
Read apps/core/serializers/user.py  # 2s
Total: 6s
```

✅ **CORRECT**:
```python
Single message with:
- Read apps/core/views/user.py
- Read apps/core/services.py
- Read apps/core/serializers/user.py
Total: 2s (3x faster)
```

---

### Anti-Pattern 2: WebSearch for Django/DRF Docs
Using WebSearch instead of Context7 MCP for Django/DRF documentation (5-100x slower).

❌ **WRONG**:
```
WebSearch("Django select_related documentation")  # 30s, rate-limited
```

✅ **CORRECT**:
```
Context7("/django/django", "select_related query optimization")  # 6s
```

---

### Anti-Pattern 3: Executing Without Prompt Analysis
Skipping Phase 1 (Request Analysis) for low-scoring prompts, leading to incorrect assumptions.

❌ **WRONG**:
```
User: "fix the user thing"
Assistant: [Immediately starts without clarification]
```

✅ **CORRECT**:
```
Phase 0: Score = 25/100 (vague: no scope, no file, no success criteria)
Phase 1: Apply Cognitive Verifier
Enhanced: "Fix authentication bug in apps/core/views/user.py where email validation allows duplicates"
```

---

### Anti-Pattern 4: Ignoring Token Budget Warnings
Not monitoring token usage at Phase 4, leading to emergency cleanup at 95%+.

❌ **WRONG**:
```
Context: 178K/200K tokens (89%)
Assistant: [Loads 20K token file without checking]
Result: 198K/200K - emergency cleanup needed
```

✅ **CORRECT**:
```
Context: 178K/200K tokens (89% - 🚨 ALERT)
Alternative: Use Context7 MCP (lower token cost) instead of Read
```

---

### Anti-Pattern 5: Over-Delegating to Agents
Using agents for <5min tasks when skills/commands sufficient (coordination overhead > benefit).

❌ **WRONG**:
```
User: "Check if this has tenant_id filtering"
Assistant: Launching multi-tenant-enforcer agent...  # 3min + 15K tokens
```

✅ **CORRECT**:
```
User: "Check if this has tenant_id filtering"
Phase 3: Activate multi-tenant-guardian skill (auto-check)  # Instant + 100 tokens
```

---

## Validation Checklist

**Priority-grouped validation (12 items):**

### CRITICAL (P0 - MUST pass):
- [ ] NO manual `tenant_id` filtering in queries? (django-tenants pattern)
- [ ] ALL business logic delegated to services? (NOT in views/serializers)
- [ ] NO `Mock()` imports without `mocker` fixture? (pytest-mock required)

### HIGH (P1 - SHOULD pass):
- [ ] Type hints on all function parameters and return values?
- [ ] Query optimization used? (select_related/prefetch_related/order_by)
- [ ] 100% test coverage per file with AAA pattern?
- [ ] Model selection appropriate? (Sonnet/Haiku based on complexity)
- [ ] MCP-first strategy applied? (Context7/db/github before traditional tools)

### MEDIUM (P2 - NICE to pass):
- [ ] NO docstrings in test files? (YOLO philosophy)
- [ ] Comments minimal and English only?
- [ ] OpenAPI contract compliance validated?
- [ ] Parallel execution used for independent operations?

---

## References

**Binora Backend documentation:**

| File/Resource | Purpose | Content |
|---------------|---------|---------|
| [CLAUDE.md](../../CLAUDE.md) | **Master index** | 13 skills + 10 agents + 7 commands + architecture + FORBIDDEN rules |
| [.claude/core/architecture.md](../../core/architecture.md) | Multi-tenant architecture | Transparent isolation, service layer, DI, type hints, query optimization |
| [.claude/core/forbidden.md](../../core/forbidden.md) | FORBIDDEN patterns | CRITICAL violations (tenant_id, business logic in views, Mock without mocker) |
| [.claude/core/testing.md](../../core/testing.md) | Testing patterns | AAA pattern, pytest-django, mocker.Mock(), 100% coverage, NO docstrings |
| [.claude/core/workflows.md](../../core/workflows.md) | Workflows | Feature development, bug fixing, pre-PR checklist, parallel patterns |
| [.claude/core/code-style.md](../../core/code-style.md) | Code style guide | __all__, imports, naming, YOLO comments |
| [apps/core/services.py](../../apps/core/services.py) | Service examples | AuthService with dependency injection |
| [apps/core/views/user.py](../../apps/core/views/user.py) | ViewSet examples | Service delegation pattern (line 50-68) |

**External references:**
- **django-tenants**: TenantMainMiddleware for transparent isolation
- **Django 5.0 ORM**: select_related/prefetch_related optimization
- **DRF 3.14**: ViewSet/Serializer patterns

---

## Activation Criteria

**Keywords**: ALWAYS-ACTIVE (no keywords required)

**Context Triggers**: EVERY request without exception

**Explicit Invocation**: Not required - skill auto-activates as meta-orchestrator

**Output Format**: 6-phase execution with section markers:
```
Phase 0: Pre-Analysis
Phase 1: Request Analysis
Phase 2: Workflow Planning
Phase 3: Skill Coordination
Phase 4: Tool Optimization
Phase 5: Quality Assurance
```

---

## Version History

- **5.0.0** (2025-01-13): **Complete redesign**. Added Phase 0 (Pre-Analysis), model selection matrix (Sonnet/Haiku - cost-optimized), MCP-first strategy (Context7/db/github/sequential-thinking), priority-based skills (P0/P1/P2/P3), fail-fast P0 gates, django-tenants validation, ULTRATHINK integration. Target: 3-5x speedup, 95%+ P1 compliance, <500 token overhead.
- **4.0.0** (2025-01-13): Binora Backend specialization. Adapted for Django 5.0 + DRF 3.14 + PostgreSQL multi-tenant.
- **3.0.0** (2025-10-28): Meta-skill architecture with progressive disclosure.
- **2.0.0** (2025-10-27): Added prompt patterns, context management, self-validation.
- **1.0.0** (2025-10-26): Initial meta-skill orchestrator with 5-phase workflow.

---

**Last Updated**: 2025-01-13
**Target Quality**: 95+/100
**Specialization**: Binora Backend (Django 5.0 + DRF 3.14 + PostgreSQL Multi-Tenant)
**Token Overhead**: ~500 tokens (SKILL.md only, resources/ loaded on-demand)