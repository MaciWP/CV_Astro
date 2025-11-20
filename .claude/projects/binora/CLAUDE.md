# CLAUDE.md - Binora Backend AI Instructions

AI-optimized instructions for Claude Code working with Django 5.0 + DRF 3.14 multi-tenant backend.

---

## Quick Reference

**Project**: Django 5.0 + DRF 3.14 + PostgreSQL + Multi-tenant (subdomain-based)
**Python**: 3.13
**Testing**: pytest-django, 100% coverage target
**AI Tools**: 11 skills + 10 agents + 7 commands + Extended Thinking - Skill-First Development
**Configuration**: Extended thinking (8192 tokens), hooks (auto-format), permissions whitelist
**Philosophy**: YOLO comments - minimal or NO comments (especially in tests)

**Key Principles**:
- Trust the middleware for tenant isolation. NEVER manual tenant_id filtering.
- Skill-First: Skills auto-enforce best practices (multi-tenant, architecture, testing).
- Agents for complex workflows: Use agents for code generation and deep analysis.
- YOLO Comments: Almost NO comments. Code should be self-explanatory.
- Ask Before Guessing: If unclear, ask the user. Don't invent solutions.
- Use App Context: Don't search for info you already have access to.
- Use MCPs: Context7 for code patterns, db for schema, github for history.

---

## 🚨 Critical Rules (MUST FOLLOW)

### FORBIDDEN ❌
1. **Manual tenant_id filtering** - Middleware handles ALL isolation
   ```python
   User.objects.filter(tenant_id=company.id)  # ❌ CRITICAL VIOLATION
   ```

2. **Business logic in views/serializers** - Must be in services
   ```python
   # ❌ In ViewSet
   user.save(); send_email(user)
   ```

3. **Mock() without mocker** - Always use mocker.Mock()
   ```python
   from unittest.mock import Mock  # ❌ FORBIDDEN
   ```

4. **Comments in code** - YOLO philosophy: NO or minimal comments
   - ❌ NO comments in tests (test names should be self-explanatory)
   - ❌ NO docstrings in tests (ZERO docstrings allowed in test files)
   - ❌ NO obvious comments ("create user", "check if valid")
   - ❌ NO non-English comments
   - ✅ Only for truly non-obvious algorithms or security-critical details

5. **Inventing solutions** - Don't guess, ASK the user
   - ❌ NO assuming patterns without checking existing code
   - ❌ NO creating new patterns when Binora patterns exist
   - ✅ Read existing code, use Context7 MCP, or ASK

6. **Creating .md files** - DO NOT create documentation/report files unless explicitly requested
   - ❌ NO completion reports, summaries, or documentation files
   - ❌ NO RESTORATION_COMPLETE.md, SUMMARY.md, etc.
   - ✅ Only create .md when user explicitly asks

**See**: `.claude/core/forbidden.md` for all violations

### REQUIRED ✅
1. **Type hints** - All function parameters and return values
2. **Service layer** - ALL business logic in services, not views
3. **AAA pattern** - Tests follow Arrange-Act-Assert
4. **Coverage 100%** - Per file target
5. **Query optimization** - select_related, prefetch_related, order_by
6. **Follow style guide** - Naming conventions, file organization, patterns
7. **Use existing patterns** - Check apps/core/ for reference implementations
8. **Ask before guessing** - If unclear, ask user instead of inventing
9. **Use MCPs actively** - Context7 for patterns, db for schema, github for history
10. **No unsolicited .md files** - Only create when explicitly requested

---

## 📐 Architecture Essentials

### Multi-Tenant Pattern

**Transparent Isolation**: Middleware automatically filters by tenant_id. Application code is tenant-agnostic.

```python
# ✅ CORRECT - Middleware adds tenant_id
users = User.objects.filter(email=email)

# ❌ FORBIDDEN - Manual tenant_id
users = User.objects.filter(tenant_id=company.id, email=email)
```

**Services**:
- Main Service (port 8000, TENANT=None): Sees all data, JWT generation
- Tenant Services (port 8001+, TENANT=subdomain): Sees only tenant data

**Same Codebase**: Main and Tenant use identical code, different TENANT env variable only.

**Details**: `.claude/core/architecture.md`

### Service Layer Pattern

**Views → Services → Models → Utils**

- **Views**: HTTP only (request, response, status). NO business logic.
- **Services**: ALL business logic. Dependency injection.
- **Models**: Data structure only. NO business logic.

**Example**: `apps/core/views/user.py:50-68` (service delegation)

**Details**: `.claude/core/architecture.md`

---

## 🧪 Testing Essentials

**File naming**: `*_tests.py` (mandatory)
**Test naming**: `test_<action>_<context>_<expected>`
**Pattern**: AAA (Arrange, Act, Assert)
**Mocking**: Always `mocker.Mock()`, NEVER `Mock()`
**Coverage**: 100% per file
**NO docstrings**: Tests must have ZERO docstrings or comments (YOLO philosophy)

**Fixture scopes**:
- Immutable data → session
- Mutable data → function
- Expensive setup → module/class

**Example tests**: `apps/core/tests/user_views_tests.py`

**Details**: `.claude/core/testing.md`

---

## 🔧 Development Commands

```bash
# Environment
python manage.py runserver

# Database
python manage.py makemigrations
python manage.py migrate

# Quality (via nox)
nox -s format              # Black formatting
nox -s lint                # flake8
nox -s types_check         # mypy
nox -s test                # pytest
nox -s test -- -k "name"   # Specific test

# Translations
nox -s messages_update     # Update translation files

# Frontend permissions
nox -s frontend_permissions_update  # Generate from OpenAPI contract

# Services
docker-compose -f docker-compose.local.yaml up -d
```

---

## 📦 Django Apps Structure

**core**: Authentication, users, companies, teams, permissions, email
**assets**: Asset management with full CRUD operations
**hierarchy**: Datacenter structure (datacenters → rooms → rows → racks)
**library**: Document management system with file uploads
**processes**: Process management workflows
**frontend**: Frontend utilities and permission generation from OpenAPI

---

## 🎯 Skills System (Auto-Activation)

**11 skills automatically enforce best practices** when keywords detected:

### Django-Specific Skills (8)

| Skill | Auto-Activates On | Critical Rules |
|-------|-------------------|----------------|
| **multi-tenant-guardian** 🔥 | tenant_id, filter, company | NEVER manual tenant_id filtering |
| **django-architecture-enforcer** | service layer, ViewSet, business logic | ALL logic in services, not views |
| **drf-serializer-patterns** | serializer, validation, input/output | Separate input/output serializers |
| **django-query-optimizer** | query, N+1, select_related | Always optimize queries |
| **django-testing-patterns** | test, pytest, AAA, coverage | 100% coverage, AAA pattern |
| **code-style-enforcer** | type hint, comment, import | Type hints required, YOLO comments |
| **postgresql-performance** | index, migration, database | Proper indexes on filtered fields |
| **openapi-contract-validator** | OpenAPI, contract, endpoint | Match contract specification |

### Generic Skills (3)

| Skill | Purpose |
|-------|---------|
| **claude-code-performance-optimizer** | Parallel tools, MCP-first, workflow optimization |
| **prompt-engineer** | Auto-score and enhance low-quality prompts |
| **skill-creator** | Generate new skills when needed |

**How Skills Work:**
- Skills auto-activate based on keywords in your conversation
- NO manual invocation needed
- Provide real-time enforcement and suggestions
- Lightweight and context-efficient

**Priority:** Skills > Agents (skills for enforcement, agents for generation)

---

## 🤖 Agent System (Manual Invocation)

**10 specialized agents** for complex workflows:

### Planning & Analysis (4)

| Agent | Use When |
|-------|----------|
| **feature-planner** | Planning new features or complex implementations |
| **django-codebase-auditor** | Comprehensive code review and quality assurance |
| **performance-analyzer** | Profiling and analyzing performance bottlenecks |
| **contract-compliance-validator** | Validating API endpoints against OpenAPI contract |

### Code Generation (2)

| Agent | Use When |
|-------|----------|
| **django-test-generator** | Generating comprehensive test suites (100% coverage) |
| **service-layer-generator** | Creating service layer with business logic |

### Validation & Security (4)

| Agent | Use When |
|-------|----------|
| **multi-tenant-enforcer** | Deep scan for multi-tenant violations across codebase |
| **security-auditor** | Security vulnerability audit and recommendations |
| **pre-commit-guardian** | Comprehensive pre-commit validation pipeline |
| **deployment-checker** | Pre-deployment validation and readiness checks |

**How to Use:**
- Agents require manual invocation (not auto-activated)
- Use for complex, multi-step workflows
- Agents have isolated context for focused work

**When to Use:** Agents for generation/deep analysis, Skills for real-time enforcement

---

## 💻 Slash Commands

**7 commands** for common workflows:

| Command | Purpose | Time |
|---------|---------|------|
| /quick-audit [path] | Fast CRITICAL check | 30s |
| /check-tenant [path] | Multi-tenant scan | 1 min |
| /check-contract [app] | Validate OpenAPI compliance | 1-2 min |
| /query-analysis [path] | Database query performance | 1-2 min |
| /coverage [path] | Coverage analysis | 1 min |
| /setup-tenant <subdomain> | Create tenant service | 3-5 min |
| /create-pr [branch] | PR with validations | 3-5 min |

**Full reference**: `.claude/references/commands.md`

---

## 🔗 MCP Servers

**4 MCPs** available:

| MCP | Status | Purpose |
|-----|--------|---------|
| sequential-thinking | ✅ | Complex reasoning |
| context7 | ✅ | Semantic code search |
| db (PostgreSQL) | ✅ | Database queries |
| github | ⚠️ Needs Setup | PR/commit analysis |

**Setup GitHub MCP**:
1. Token: https://github.com/settings/tokens/new (scopes: repo, read:org)
2. Add to `~/.claude.json`:
   ```json
   {
     "mcpServers": {
       "github": {
         "env": {
           "GITHUB_TOKEN": "ghp_YOUR_TOKEN"
         }
       }
     }
   }
   ```

**Full reference**: `.claude/references/mcps.md`

---

## ⚙️ Configuration

**settings.local.json** enables advanced Claude Code features:

### Extended Thinking (Claude Sonnet 4.5)
- **MAX_THINKING_TOKENS**: 8192 tokens for complex reasoning
- Improves problem-solving, coding, and multi-step analysis
- Auto-enabled for complex tasks

### Hooks (Automation)
- **PostToolUse**: Auto-format Python files with black after editing
- **PreToolUse**: Can block sensitive file modifications
- Runs automatically during AI workflow

### Permissions Whitelist
- Pre-approved commands (pytest, nox, docker, git, etc.)
- Avoids repetitive permission prompts
- Speeds up development workflow

### Benefits
- **40% better reasoning** (extended thinking)
- **Zero manual formatting** (PostToolUse hooks)
- **3-5x faster workflow** (permissions whitelist)

**See**: `.claude/guides/settings-configuration.md` for complete configuration guide

---

## 📋 Common Workflows

### Feature Development
1. Plan: `feature-planner`
2. Generate: model/service/serializer/viewset generators
3. Test: `django-test-generator`
4. Review: `django-codebase-auditor`
5. Validate: `pre-commit-guardian`

### Bug Fixing
1. Diagnose: Read code + `/fix-tests`
2. Fix: Apply changes
3. Test: Run tests
4. Validate: `/quick-audit`

### Pre-PR Checklist
1. `/quick-audit` on changed files
2. `nox -s format`
3. `nox -s lint`
4. `nox -s types_check`
5. `nox -s test --cov`

Or use: `/create-pr` for automated validation + PR generation

**Details**: `.claude/core/workflows.md`

---

## 🎯 Implementation Guidelines

### Priority Order
When implementing, follow this order:
1. **Django/DRF built-ins** - Use framework features first
2. **Binora patterns** - Reuse existing patterns from apps/core/
3. **Custom only if extending** - Create new patterns only when necessary

### Code Quality Standards

**Business Logic Separation**:
- ❌ NO business logic in Views (HTTP only) or Serializers (validation only)
- ✅ ALL business logic in Services with dependency injection

**Type Hints**:
- ✅ All function parameters and return values must have type hints
- ✅ Use proper types from typing module (QuerySet, Optional, List, Dict, etc.)

**Error Handling**:
- ✅ Use specific exceptions with meaningful messages
- ❌ Never catch generic Exception without re-raising
- ✅ Provide recovery strategies or actionable error info

**Configuration**:
- ✅ Use Django settings for ALL configuration
- ❌ NO hard-coded values in code (URLs, credentials, limits)
- ✅ Environment-specific values in appropriate settings files

### Comments Policy (STRICT)

**YOLO Philosophy** - Code should be self-explanatory:

- ❌ **NO comments in tests** - Test names must be descriptive enough
- ❌ **NO docstrings in tests** - ZERO docstrings allowed in test files
- ❌ **NO obvious comments** - "Create user", "Check if valid", etc.
- ❌ **NO non-English comments** - English ONLY (if you must comment)
- ❌ **NEVER modify/delete existing comments** - Preserve what's there
- ✅ **Only add comments for**:
  - Non-obvious algorithms with complexity
  - Security-critical implementation details
  - Complex business logic that can't be simplified

**Example of BAD commenting**:
```python
# ❌ DON'T DO THIS
def test_create_user_with_valid_data_succeeds():
    """Test that creating a user with valid data succeeds."""  # NO DOCSTRINGS!
    # Arrange - Create user data
    data = {"email": "test@example.com"}
    # Act - Create user
    user = User.objects.create(**data)
    # Assert - Check user exists
    assert user.email == data["email"]
```

**Example of GOOD test (no comments/docstrings)**:
```python
# ✅ DO THIS - Self-explanatory
def test_create_user_with_valid_data_succeeds():
    data = {"email": "test@example.com"}
    user = User.objects.create(**data)
    assert user.email == data["email"]
```

---

## 🔍 Context Integration

### Search Before Implementation

**ALWAYS check these locations FIRST** (don't reinvent):
- `apps/core/utils/auth/` → Authentication backends and services
- `apps/core/serializers/` → Serializer patterns and validation
- `apps/core/services.py` → Service layer implementations with DI
- `apps/core/views/` → ViewSet patterns with service delegation
- `apps/core/tests/` → Test fixtures, mocks, and testing patterns
- `binora/settings.py` → Configuration patterns and Django settings
- `conftest.py` (root + app-level) → Shared fixtures

**Use Context7 MCP to find**:
```
Find all ViewSets that delegate to services
Locate all services using dependency injection
Show me test fixtures for User model
Find authentication backend implementations
```

### Reuse These Patterns

**Services** - Dependency injection style:
- See: `apps/core/services.py` - AuthService pattern
- Pattern: Static methods, type hints, no state

**Serializers** - Input/output separation:
- See: `apps/core/serializers/user.py` - UserInputSerializer/UserOutputSerializer
- Pattern: FormSerializer composition for Django forms

**ViewSets** - Service delegation:
- See: `apps/core/views/user.py:50-68` - UserViewSet
- Pattern: @action decorators, no business logic, delegates to services

**Auth** - Extend existing backends:
- See: `apps/core/utils/auth/` - MainAuthenticationBackend
- Pattern: TenantScopedJWTAuthentication for tenant services

---

## 🔒 Security Guidelines

**Validation**: Use Django validators at serializer level, not in views
**JWT Tokens**: Always verify scope for tenant services (TenantScopedJWTAuthentication)
**Data Isolation**: Trust middleware for tenant filtering, NEVER manual tenant_id
**Passwords**: Use Django built-in utilities only (make_password, check_password)
**Permissions**: Use DRF permission classes, not manual checks in views

---

## ⚡ Performance Optimization

**Database Queries**:
- Use `select_related()` for ForeignKey/OneToOne
- Use `prefetch_related()` for ManyToMany/reverse ForeignKey
- Always use `order_by()` to avoid random ordering
- Add database indexes for frequently filtered fields

**Pagination**: Use Django/DRF built-in pagination classes
**Caching**: Use tenant-aware cache keys when needed (include tenant_id)
**Bulk Operations**: Use `bulk_create()`/`bulk_update()` for large datasets

---

## ⚠️ Important Notes

- **Format before commit**: `nox -s format` runs automatically via hooks
- **Type check new code**: `nox -s types_check` before PR
- **Update translations**: After adding translatable strings
- **Regenerate permissions**: After OpenAPI contract changes
- **Reuse test fixtures**: Check conftest.py files first
- **Business logic location**: Services ONLY, never views/serializers
- **Ask before guessing**: If pattern unclear, ask user

---

## 📚 Documentation Structure

```
CLAUDE.md                    [This file - Core index]

.claude/
├── core/                    [Critical non-obvious info]
│   ├── architecture.md      Multi-tenant patterns (200 lines)
│   ├── code-style.md        Code style guide (__all__, imports, naming) (350 lines)
│   ├── testing.md           Test patterns (150 lines)
│   ├── workflows.md         Complete workflows + parallel patterns (664 lines)
│   ├── forbidden.md         Anti-patterns (50 lines)
│   └── pr-review-checklist.md  Strict PR review standards (500 lines)
│
├── references/              [Quick lookup]
│   ├── agents.md            10 agents reference
│   ├── commands.md          6 commands index
│   ├── mcps.md              4 MCPs + setup
│   └── metrics.md           Performance benchmarks
│
├── examples/                [Real-world scenarios]
│   ├── agent-workflows.md   5 complete scenarios with timing (883 lines)
│   ├── success-stories.md   Real success stories (400 lines)
│   └── [more examples]
│
├── guides/                  [In-depth guides]
│   ├── parallel-execution.md  Parallel patterns + optimization (600 lines)
│   ├── troubleshooting.md     Common issues + solutions (400 lines)
│   └── [more guides]
│
├── commands/                [6 slash commands]
│   ├── quick-audit.md       (50 lines)
│   ├── fix-tests.md         (50 lines)
│   ├── create-pr.md         (100 lines)
│   ├── check-tenant.md      (50 lines)
│   ├── coverage.md          (50 lines)
│   └── enhance-prompt.md    (150 lines)
│
├── agents/                  [10 agent implementations]
│   └── *.md                 (detailed specifications)
└── skills/                  [11 skill implementations]
    └── */SKILL.md           (auto-activation rules)
```

**Total**: ~4550 lines (organized + complete + AI-optimized)

**Key Additions in v2.0**:
- Parallel execution patterns (3-5x speedup)
- 5 complete workflow scenarios
- Performance metrics and benchmarks
- Troubleshooting guide
- Success stories from real usage

---

## 🎯 Decision Tree

**Enforcement (Auto-Activated Skills)**:
- Multi-tenant rules → `multi-tenant-guardian` skill (auto-activates)
- Architecture violations → `django-architecture-enforcer` skill
- Query optimization → `django-query-optimizer` skill
- Testing patterns → `django-testing-patterns` skill
- Code style → `code-style-enforcer` skill
- Serializer patterns → `drf-serializer-patterns` skill

**Complex Workflows (Manual Agents)**:
- Plan feature → `feature-planner` agent
- Generate tests → `django-test-generator` agent
- Generate services → `service-layer-generator` agent
- Review code → `django-codebase-auditor` agent
- Check contract → `contract-compliance-validator` agent
- Pre-deployment → `deployment-checker` agent

**Quick Commands**:
- Quick audit → `/quick-audit`
- Fix tests → `/fix-tests`
- Create PR → `/create-pr`
- Check tenant → `/check-tenant`
- Coverage → `/coverage`

**Working on (Skills Auto-Enforce)**:
- Views/ViewSets? → Skills enforce: delegate to services, NO business logic
- Services? → Skills enforce: type hints, dependency injection
- Models? → Skills enforce: proper indexes, constraints
- Tests? → Skills enforce: AAA pattern, `mocker.Mock()`, 100% coverage
- Queries? → Skills enforce: select_related, prefetch_related, NO tenant_id

---

## ⚡ Quick Tips

1. **Skills auto-enforce**: Skills detect violations automatically, no manual invocation.
2. **Trust middleware**: Never add tenant_id to queries manually (skill will catch).
3. **Services first**: ALL business logic goes in services, not views (skill enforces).
4. **Test everything**: 100% coverage is mandatory (skill validates).
5. **Type all functions**: Parameters and return values need type hints (skill checks).
6. **Agents for generation**: Use agents for code generation and deep analysis.
7. **Commands for speed**: Faster than agents for simple one-off tasks.
8. **YOLO comments**: Only comment genuinely non-obvious code (skill enforces).

---

## 🔍 Finding Information

### Core Concepts
**Architecture questions** → `.claude/core/architecture.md`
**Code style (__all__, imports, naming)** → `.claude/core/code-style.md`
**Testing questions** → `.claude/core/testing.md`
**Workflow questions** → `.claude/core/workflows.md`
**"What's forbidden?"** → `.claude/core/forbidden.md`
**"PR review standards?"** → `.claude/core/pr-review-checklist.md`

### Quick Reference
**"Which agent?"** → `.claude/references/agents.md`
**"Which command?"** → `.claude/references/commands.md`
**"How to use MCPs?"** → `.claude/references/mcps.md`
**"Performance metrics?"** → `.claude/references/metrics.md`

### Learning Resources
**"How to use agents?"** → `.claude/examples/agent-workflows.md` (5 complete scenarios)
**"Parallel execution?"** → `.claude/guides/parallel-execution.md` (3-5x speedup)
**"Something not working?"** → `.claude/guides/troubleshooting.md`
**"Real-world results?"** → `.claude/examples/success-stories.md`

**💡 Pro Tip**: Start with `.claude/examples/agent-workflows.md` to see complete end-to-end examples with timing and results.

---

## 📦 Key Files Reference

**Authentication**:
- MainAuthenticationBackend: `apps/core/utils/auth/`
- TenantScopedJWTAuthentication: `apps/core/utils/auth/`
- Settings: `binora/settings.py`

**Examples**:
- ViewSet: `apps/core/views/user.py`
- Service: `apps/core/services.py` (AuthService)
- Serializer: `apps/core/serializers/user.py`
- Tests: `apps/core/tests/user_views_tests.py`

**Middleware**:
- Multi-tenant: `binora/middleware.py` (MultitenantMiddleware)

**Apps Structure**:
- `apps/core` - Auth, users, companies, teams
- `apps/assets` - Asset management
- `apps/hierarchy` - Datacenter structure
- `apps/library` - Document management
- `apps/processes` - Process management
- `apps/frontend` - Frontend utilities

---

## ✅ Validation Checklist

Before committing:
- [ ] NO manual tenant_id filtering
- [ ] Business logic in services only
- [ ] Type hints on all functions
- [ ] Tests 100% coverage per file
- [ ] AAA pattern in tests
- [ ] `mocker.Mock()` not `Mock()`
- [ ] Query optimization (select_related, order_by)
- [ ] English comments only (or no comments - YOLO)
- [ ] Validated: `/quick-audit` passes

Before PR:
- [ ] Apply `.claude/core/pr-review-checklist.md` standards
- [ ] `/create-pr` validation passes
- [ ] All tests green
- [ ] Coverage 100%
- [ ] No CRITICAL issues

---

**Version**: 2.0 (AI-Optimized)
**Last Updated**: 2025-01-13
**Philosophy**: Minimal documentation for AI, maximum clarity, YOLO approach
