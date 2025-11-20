# Poneglyph ← → Binora Backend Integration Guide

**Purpose**: Specialize Poneglyph with binora-backend's 11 proven skills and 10 agents for maximum effectiveness in Django backend development.

---

## 📂 Integration Structure

```
Poneglyph/.claude/
├── skills/                    # Generic skills (40+ for all projects)
├── skills_binora/             # Binora-specific skills (11 specialized)
├── agents/                    # Generic agents (16 for all projects)
├── agents_binora/             # Binora-specific agents (10 specialized)
├── knowledge/                 # Knowledge bases
└── AI_BINORA_*                # Documentation
```

---

## 🎯 11 Binora Skills - When They Auto-Activate

### 1. **multi-tenant-guardian** 🔥 CRITICAL
**Auto-activates on**: `tenant_id`, `filter`, `company`, `subdomain`

**Enforces**:
- NEVER manual tenant_id filtering in queries
- Middleware automatically adds tenant_id - trust it
- Transparent isolation across main and tenant services
- Review all QuerySet operations for compliance

**Example trigger**:
```python
User.objects.filter(tenant_id=company.id)  # ❌ ACTIVATES SKILL
```

### 2. **django-architecture-enforcer**
**Auto-activates on**: `service`, `ViewSet`, `business logic`, `create`, `update`

**Enforces**:
- Views handle HTTP only (no business logic)
- ALL business logic in services
- Services use dependency injection
- Models are data structures only

**Example trigger**:
```python
def create(self, request):
    user.save()  # ❌ Business logic in view
    send_email(user)
```

### 3. **drf-serializer-patterns**
**Auto-activates on**: `serializer`, `validation`, `input`, `output`, `create`, `update`

**Enforces**:
- Input serializer for POST/PUT/PATCH
- Output serializer for GET
- Separate validation and representation logic
- Input serializers validate, output serializers format

### 4. **django-query-optimizer**
**Auto-activates on**: `query`, `N+1`, `select_related`, `prefetch_related`, `filter`

**Enforces**:
- Always use `select_related()` for ForeignKey
- Always use `prefetch_related()` for reverse relations
- Index on filtered fields
- Detect and fix N+1 query patterns

### 5. **django-testing-patterns**
**Auto-activates on**: `test`, `pytest`, `coverage`, `mock`, `assert`

**Enforces**:
- 100% coverage per file
- AAA (Arrange, Act, Assert) pattern
- Test naming: `test_<action>_<context>_<expected>`
- ZERO docstrings in tests
- NO manual Mock() - use mocker.Mock()

### 6. **code-style-enforcer**
**Auto-activates on**: `type hint`, `comment`, `import`, `class`, `def`

**Enforces**:
- ALL function parameters must have type hints
- ALL return types must be specified
- YOLO comments: minimal/no comments in tests
- Imports organized (stdlib, third-party, local)

### 7. **postgresql-performance**
**Auto-activates on**: `migration`, `index`, `database`, `field`, `query`

**Enforces**:
- Proper indexing on filtered/joined fields
- Migrations include index creation when needed
- Connection pooling configured
- Query analysis for optimization

### 8. **openapi-contract-validator**
**Auto-activates on**: `OpenAPI`, `contract`, `endpoint`, `schema`, `API`

**Enforces**:
- API endpoints match OpenAPI specification
- Request/response formats match contract
- Status codes correct
- Error responses documented

### 9. **github-pr-reviewer**
**Auto-activates on**: `PR`, `pull request`, `review`, `merge`

**Enforces**:
- Code quality standards
- Test coverage requirements
- Security checks
- Performance considerations

### 10. **claude-code-fast-performance-and-reliable**
**Auto-activates on**: `performance`, `optimization`, `parallel`, `MCP`

**Enforces**:
- Parallel tool execution
- MCP-first approach
- Context efficiency
- Token optimization

### 11. **prompt-engineer**
**Auto-activates on**: `prompt`, `quality`, `clarity`, `enhance`

**Enforces**:
- High-quality prompts for better results
- Clear and specific language
- Proper context provision

---

## 🤖 10 Binora Agents - How to Use

### Planning & Analysis (4)

#### **feature-planner**
**When to use**: Planning new features or complex implementations

```bash
# Example trigger in conversation
"I need to implement a user permission system that..."
# Agent auto-activates and helps plan the feature
```

#### **django-codebase-auditor**
**When to use**: Comprehensive code review and QA before deployment

**Usage**:
```
Task: django-codebase-auditor
Prompt: "Audit the users app for code quality, security, and binora patterns"
```

#### **performance-analyzer**
**When to use**: Identify and fix performance bottlenecks

**Usage**:
```
Task: performance-analyzer
Prompt: "Analyze the User.objects.all() queries in the users app"
```

#### **contract-compliance-validator**
**When to use**: Validate API endpoints against OpenAPI contract

**Usage**:
```
Task: contract-compliance-validator
Prompt: "Validate the /api/users/ endpoints against the OpenAPI spec"
```

### Code Generation (2)

#### **django-test-generator**
**When to use**: Generate comprehensive test suites with 100% coverage

**Usage**:
```
Task: django-test-generator
Prompt: "Generate tests for apps/core/services.py with 100% coverage"
```

#### **service-layer-generator**
**When to use**: Create service layer with business logic

**Usage**:
```
Task: service-layer-generator
Prompt: "Generate service layer for user creation with email validation"
```

### Validation & Security (4)

#### **multi-tenant-enforcer**
**When to use**: Deep scan for multi-tenant violations

**Usage**:
```
Task: multi-tenant-enforcer
Prompt: "Scan the entire codebase for manual tenant_id filtering violations"
```

#### **security-auditor**
**When to use**: Security vulnerability audit

**Usage**:
```
Task: security-auditor
Prompt: "Audit the authentication endpoints for security vulnerabilities"
```

#### **pre-commit-guardian**
**When to use**: Comprehensive pre-commit validation

**Usage**:
```
Task: pre-commit-guardian
Prompt: "Validate all changes before commit for style, security, and tests"
```

#### **deployment-checker**
**When to use**: Pre-deployment readiness checks

**Usage**:
```
Task: deployment-checker
Prompt: "Check if the codebase is ready for production deployment"
```

---

## 🔧 How Skills and Agents Work Together

### Workflow Example: New User Feature

1. **Planning**: Mention "new user feature" → `feature-planner` agent helps plan
2. **Implement**: As you code, skills auto-activate:
   - `django-architecture-enforcer` ensures service layer
   - `drf-serializer-patterns` guides serializer design
   - `code-style-enforcer` checks type hints
3. **Test**: `django-testing-patterns` ensures 100% coverage
4. **Validate**: Run `django-codebase-auditor` for comprehensive review
5. **Deploy**: Use `deployment-checker` before pushing

### Real-Time Enforcement

Skills work transparently:
```python
# You write this code:
class UserViewSet(ViewSet):
    def create(self, request):
        user = User.objects.create(**request.data)  # ❌ Logic in view
        send_email(user)

# Skills auto-activate and suggest:
# ❌ django-architecture-enforcer: Business logic in view - move to service
# ❌ drf-serializer-patterns: Need input serializer for validation
# ❌ code-style-enforcer: Missing type hints
# ✅ Here's how to fix it:
```

---

## 🎯 Priority Order

**When working on binora-like projects**:

1. **Skills > Agents** - Skills for real-time enforcement, agents for complex tasks
2. **Services first** - Always separate business logic from views
3. **100% coverage** - Tests must cover all code paths
4. **Type safety** - All functions need type hints
5. **Query optimization** - Always optimize database queries
6. **Multi-tenant compliance** - Never manual tenant_id

---

## 📋 Common Workflows

### New Feature Development
1. Mention feature → `feature-planner` helps design
2. Implement service → `django-architecture-enforcer` guides
3. Write serializers → `drf-serializer-patterns` ensures quality
4. Generate tests → `django-test-generator` creates 100% coverage tests
5. Review code → `django-codebase-auditor` performs comprehensive audit
6. Deploy → `deployment-checker` validates readiness

### Bug Fix
1. Identify issue → Read code
2. Fix code → Skills auto-activate
3. Run tests → Ensure coverage
4. Pre-flight → `/quick-audit` on changed files
5. Commit → `pre-commit-guardian` validates

### Performance Optimization
1. Identify bottleneck → `performance-analyzer` profiles
2. Optimize queries → `django-query-optimizer` guides
3. Test changes → Ensure tests still pass
4. Validate performance → Re-run profiler
5. Deploy → `deployment-checker` confirms readiness

---

## 🔗 Key Integration Points

### Skills Reference
- **Source**: `/Users/oriol/Desktop/Bjumper/REPOSITORIOS/PYTHON/binora-backend/.claude/skills/`
- **Copied to**: `Poneglyph/.claude/skills_binora/`
- **Auto-activate**: Trigger keywords in conversation

### Agents Reference
- **Source**: `/Users/oriol/Desktop/Bjumper/REPOSITORIOS/PYTHON/binora-backend/.claude/agents/`
- **Copied to**: `Poneglyph/.claude/agents_binora/`
- **Manual invoke**: Via Task tool

### Knowledge Base
- **Main**: `AI_BINORA_BACKEND_KNOWLEDGE.md`
- **Integration**: This file
- **Architecture**: `AI_BINORA_BACKEND_KNOWLEDGE.md` (patterns section)

---

## ⚙️ Setup Checklist

- [x] Copy binora skills to Poneglyph
- [x] Copy binora agents to Poneglyph
- [x] Create knowledge base documentation
- [x] Create integration guide (this file)
- [ ] Update Poneglyph CLAUDE.md with binora specialization
- [ ] Test skills auto-activation
- [ ] Test agents manual invocation
- [ ] Validate multi-tenant enforcement

---

## 🎓 Learning Path

1. **Understand architecture**: Read `AI_BINORA_BACKEND_KNOWLEDGE.md`
2. **Know the forbidden rules**: Multi-tenant isolation, business logic placement
3. **Learn skills**: Each skill has specific triggers and enforcements
4. **Use agents**: For complex tasks requiring deep analysis
5. **Practice**: Implement features using the workflows above
6. **Validate**: Run audits before pushing code

---

## 🚀 Expected Improvements

With binora skills and agents integrated, Poneglyph will:

- **Enforce quality**: 100% test coverage, type hints, clean architecture
- **Prevent violations**: Multi-tenant isolation, business logic in services
- **Optimize performance**: Database queries, API endpoints
- **Ensure security**: Vulnerability detection, input validation
- **Automate validation**: Pre-commit, pre-deployment checks
- **Guide development**: Agents help plan and generate code
- **Speed up workflows**: Parallel tools, MCP-first approach

---

**Integration Date**: November 18, 2024
**Source**: Binora Backend v1.0
**Status**: Complete and ready to use
