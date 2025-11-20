# AI Binora Backend Knowledge Base

**Reference Project**: `/Users/oriol/Desktop/Bjumper/REPOSITORIOS/PYTHON/binora-backend`

This document consolidates the architecture, patterns, and best practices from the binora-backend project to specialize Poneglyph for optimal integration and knowledge transfer.

---

## 🏗️ Project Overview

### Stack
- **Framework**: Django 5.0 + Django REST Framework 3.14
- **Database**: PostgreSQL
- **Python**: 3.13
- **Architecture**: Multi-tenant (subdomain-based) with transparent middleware isolation
- **Testing**: pytest-django with 100% coverage target
- **Development**: Nox automation, pre-commit hooks, Black formatting

### Key Philosophy
- **YOLO Comments**: Minimal/no comments - code should be self-explanatory
- **Skill-First Development**: 11 specialized skills auto-enforce best practices
- **Multi-Tenant by Default**: Middleware handles ALL tenant isolation - NO manual tenant_id filtering
- **Service Layer**: ALL business logic separated into services (3-layer: View → Service → Model)
- **Type Safety**: Full type hints required on all functions

---

## 📐 Architecture Patterns

### Multi-Tenant Isolation (CRITICAL)

**Rule #1: NEVER manual tenant_id filtering**

```python
# ✅ CORRECT - Middleware adds tenant_id automatically
users = User.objects.filter(email=email)

# ❌ FORBIDDEN - Manual tenant_id is a CRITICAL VIOLATION
users = User.objects.filter(tenant_id=company.id, email=email)
```

**How It Works**:
- Middleware intercepts every QuerySet and adds `tenant_id` automatically
- Application code is tenant-agnostic (same code serves all tenants)
- Main service (port 8000, TENANT=None): Sees all data, JWT generation
- Tenant services (port 8001+, TENANT=subdomain): Sees only tenant data

**Important**: The middleware is transparent - don't fight it, trust it.

### Service Layer Pattern (3-Layer Architecture)

**Views → Services → Models**

**Views** (`apps/*/views/`):
- HTTP request/response only
- NO business logic
- Delegate to services
- Validate request format only

```python
class UserViewSet(ModelViewSet):
    def create(self, request):
        serializer = UserInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.create_user(
            email=serializer.validated_data['email'],
            name=serializer.validated_data['name']
        )
        return Response(UserOutputSerializer(user).data)
```

**Services** (`apps/*/services.py`):
- ALL business logic lives here
- Static methods or class-based with dependency injection
- Type hints required
- Handle transactions, validations, side effects (email, notifications)

```python
class UserService:
    @staticmethod
    def create_user(email: str, name: str) -> User:
        user = User.objects.create(email=email, name=name)
        EmailService.send_welcome(user)
        return user
```

**Models** (`apps/*/models/`):
- Data structure only
- NO business logic
- Clean, simple, declarative

### Serializer Pattern (Input/Output Separation)

**Two serializers per endpoint**:

```python
class UserInputSerializer(serializers.Serializer):
    """Used for POST/PUT/PATCH - validates input"""
    email = serializers.EmailField()
    name = serializers.CharField(max_length=100)

class UserOutputSerializer(serializers.ModelSerializer):
    """Used for GET - represents current state"""
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'created_at', 'updated_at']
```

---

## 🧪 Testing Standards

### Test Structure
- **File naming**: `*_tests.py` (mandatory)
- **Test naming**: `test_<action>_<context>_<expected>`
- **Pattern**: AAA (Arrange, Act, Assert)
- **Coverage**: 100% per file
- **No docstrings**: Tests must have ZERO docstrings (YOLO philosophy)

### Test Example

```python
def test_create_user_with_valid_email_succeeds(mocker):
    data = {'email': 'user@example.com', 'name': 'Test User'}

    user = UserService.create_user(**data)

    assert user.email == data['email']
    assert user.name == data['name']
```

### Fixture Scopes
- **session**: Immutable data (constants, reference data)
- **module**: Expensive setup (database seeding)
- **function**: Mutable data (test isolation required)

### Mocking Rules
- **REQUIRED**: Always use `mocker.Mock()` from pytest-mock
- **FORBIDDEN**: `from unittest.mock import Mock` is not allowed

---

## 📦 Django Apps Structure

```
apps/
├── core/              # Authentication, users, companies, teams, permissions, email
├── assets/            # Asset management with full CRUD
├── hierarchy/         # Datacenter structure (datacenters → rooms → rows → racks)
├── library/           # Document management with file uploads
├── processes/         # Process management workflows
└── frontend/          # Frontend utilities and permission generation
```

### App Organization Pattern

Each app follows this structure:
```
app_name/
├── models.py          # Data models
├── serializers.py     # Input/Output serializers
├── services.py        # Business logic (ALL of it)
├── views.py           # HTTP handling (no logic)
├── urls.py            # URL routing
├── tests/
│   ├── models_tests.py
│   ├── services_tests.py
│   ├── views_tests.py
│   └── serializers_tests.py
└── fixtures/          # Shared test fixtures
```

---

## 🎯 Skills System (Auto-Activation)

### 11 Specialized Skills - Auto-enforce Best Practices

| Skill | Triggers On | Key Rules |
|-------|-------------|-----------|
| **multi-tenant-guardian** | tenant_id, filter, company | NEVER manual tenant_id filtering |
| **django-architecture-enforcer** | service, ViewSet, business logic | ALL logic in services |
| **drf-serializer-patterns** | serializer, validation | Input/output separation |
| **django-query-optimizer** | query, select_related | Always optimize queries |
| **django-testing-patterns** | test, pytest, coverage | 100% coverage, AAA pattern |
| **code-style-enforcer** | type hint, comment, import | Type hints required, YOLO comments |
| **postgresql-performance** | index, migration, database | Proper indexes on filtered fields |
| **openapi-contract-validator** | OpenAPI, contract, endpoint | Match specification |
| **github-pr-reviewer** | PR, pull request | Code quality standards |
| **claude-code-fast-performance** | performance, optimization | Parallel tools, MCP-first |
| **skill-creator** | Need new skill | Generate skills when needed |

**How Skills Work**:
- Auto-activate based on keywords in conversation
- Real-time enforcement and suggestions
- NO manual invocation needed
- Lightweight, context-efficient

---

## 🤖 Agents (Manual Invocation)

### 10 Specialized Agents for Complex Workflows

**Planning & Analysis** (4):
- `feature-planner`: Plan new features or complex implementations
- `django-codebase-auditor`: Comprehensive code review and QA
- `performance-analyzer`: Profile and analyze bottlenecks
- `contract-compliance-validator`: Validate against OpenAPI

**Code Generation** (2):
- `django-test-generator`: Generate test suites (100% coverage)
- `service-layer-generator`: Create service layer with DI

**Validation & Security** (4):
- `multi-tenant-enforcer`: Deep scan for multi-tenant violations
- `security-auditor`: Vulnerability audit
- `pre-commit-guardian`: Pre-commit validation
- `deployment-checker`: Pre-deployment readiness

---

## 💻 Common Commands

```bash
# Development
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

# Frontend
nox -s frontend_permissions_update  # From OpenAPI contract

# Services
docker-compose -f docker-compose.local.yaml up -d
```

---

## 🚨 CRITICAL RULES (MUST FOLLOW)

### FORBIDDEN ❌

1. **Manual tenant_id filtering**
   ```python
   User.objects.filter(tenant_id=company.id)  # ❌ CRITICAL VIOLATION
   ```

2. **Business logic in views/serializers**
   ```python
   # ❌ In ViewSet
   user.save()
   send_email(user)
   ```

3. **Mock() without mocker**
   ```python
   from unittest.mock import Mock  # ❌ FORBIDDEN
   ```

4. **Comments in tests**
   - ❌ NO comments in tests
   - ❌ NO docstrings (ZERO allowed)
   - ❌ NO obvious comments

5. **Creating .md files unsolicited**
   - ❌ NO completion reports
   - ❌ NO summaries or documentation files
   - ✅ Only when explicitly requested

### REQUIRED ✅

1. **Type hints** on all functions (parameters + return values)
2. **Service layer** - ALL business logic in services
3. **AAA pattern** - Arrange, Act, Assert in tests
4. **100% coverage** per file
5. **Query optimization** - select_related, prefetch_related
6. **Style guide** compliance (naming, organization)
7. **Existing patterns** - Reuse from apps/core/
8. **Ask before guessing** - When uncertain, ask user
9. **MCPs actively** - Use context7, db, github
10. **No unsolicited .md files** - Only when asked

---

## 🔍 Code Search Patterns

**ALWAYS check these locations FIRST** (don't reinvent):
- `apps/core/utils/auth/` → Authentication backends
- `apps/core/serializers/` → Serializer patterns
- `apps/core/services.py` → Service implementations
- `apps/core/views/` → ViewSet patterns
- `apps/core/tests/` → Test fixtures and mocks
- `binora/settings.py` → Configuration patterns
- `conftest.py` → Shared fixtures

**Use Context7 MCP to find**:
```
"Find all ViewSets that delegate to services"
"Locate all services using dependency injection"
"Show me test fixtures for User model"
"Find authentication backend implementations"
```

---

## 📋 Common Workflows

### Feature Development
1. Plan: Use `feature-planner` agent
2. Generate: Model/service/serializer/viewset
3. Test: `django-test-generator` agent
4. Review: `django-codebase-auditor` agent
5. Validate: `pre-commit-guardian` agent

### Bug Fixing
1. Diagnose: Read code + locate error
2. Fix: Apply changes
3. Test: Run tests
4. Validate: `/quick-audit` command

### Pre-PR Checklist
1. `/quick-audit` on changed files
2. `nox -s format`
3. `nox -s lint`
4. `nox -s types_check`
5. `nox -s test --cov`

Or use `/create-pr` for automated validation + PR generation

---

## 🔗 Key Files Reference

| Path | Purpose |
|------|---------|
| `binora/settings.py` | Django configuration |
| `apps/core/models/` | Core data models |
| `apps/core/services.py` | Core service layer patterns |
| `apps/core/views/` | ViewSet patterns |
| `apps/core/serializers/` | Serializer patterns |
| `apps/core/tests/` | Test fixture patterns |
| `conftest.py` | Pytest configuration |
| `.pre-commit-config.yaml` | Pre-commit hooks |
| `noxfile.py` | Nox automation |
| `pytest.ini` | Pytest configuration |

---

## 🔐 Security & Performance

### Database Optimization
- Always use `select_related()` for foreign keys
- Always use `prefetch_related()` for reverse relations
- Index filtered fields
- Avoid N+1 queries

### Type Safety
- Every function parameter must have type hint
- Return types required
- Use proper types: `QuerySet[Model]`, `Optional[str]`, etc.

### Configuration Management
- All configuration in Django settings
- NO hard-coded values
- Environment variables for sensitive data
- Use `os.getenv()` with defaults

---

## 📊 Code Quality Standards

### Cyclomatic Complexity
- **OK**: CC ≤ 10
- **Refactor**: CC 10-15
- **Critical**: CC > 15

### Method Length
- **OK**: < 50 lines
- **Refactor**: 50-100 lines
- **Critical**: > 100 lines

### Duplication
- **OK**: < 5%
- **Refactor**: 5-10%
- **Critical**: > 10%

---

## 📝 Implementation Order

When implementing features, follow this priority:

1. **Django/DRF built-ins** - Use framework features first
2. **Binora patterns** - Reuse from apps/core/
3. **Custom only if extending** - New patterns only when necessary

---

## 🎯 Specialization Goals

This knowledge base enables Poneglyph to:

1. **Understand binora-backend architecture** - Multi-tenant patterns, service layer, testing
2. **Enforce best practices** - Via skills and agents
3. **Generate binora-compliant code** - Services, serializers, tests
4. **Validate implementations** - Against binora standards
5. **Optimize queries and performance** - Database and API optimization
6. **Ensure security** - Multi-tenant isolation, input validation
7. **Maintain consistency** - Code style, patterns, documentation

---

## 🔄 Version Control

- **Git**: https://github.com/TechBjumper/binora-backend.git
- **Submodules**: binora-contract (TypeScript API contract)
- **Strategy**: Feature branches, PR reviews, automated tests

---

## 📚 Related Documentation

- `.claude/core/architecture.md` - Detailed multi-tenant implementation
- `.claude/core/testing.md` - Testing framework and patterns
- `.claude/core/forbidden.md` - All forbidden practices
- `.claude/guides/settings-configuration.md` - Claude Code configuration
- `.claude/references/commands.md` - All slash commands
- `.claude/references/mcps.md` - MCP server setup

---

**Last Updated**: November 18, 2024
**Source**: `/Users/oriol/Desktop/Bjumper/REPOSITORIOS/PYTHON/binora-backend`
**Purpose**: Specialize Poneglyph for binora-backend development
