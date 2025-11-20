# Poneglyph ← Binora Backend Integration - Complete Index

**Date**: November 18, 2024
**Source**: `/Users/oriol/Desktop/Bjumper/REPOSITORIOS/PYTHON/binora-backend`
**Status**: ✅ Integration Complete

---

## 📂 What Has Been Copied

### 1. **Skills** (11 specialized)
```
.claude/skills_binora/
├── multi-tenant-guardian/
├── django-architecture-enforcer/
├── drf-serializer-patterns/
├── django-query-optimizer/
├── django-testing-patterns/
├── code-style-enforcer/
├── postgresql-performance/
├── openapi-contract-validator/
├── github-pr-reviewer/
├── claude-code-fast-performance-and-reliable/
└── prompt-engineer/
```

### 2. **Agents** (10 specialized)
```
.claude/agents_binora/
├── feature-planner.md
├── django-codebase-auditor.md
├── performance-analyzer.md
├── contract-compliance-validator.md
├── django-test-generator.md
├── service-layer-generator.md
├── multi-tenant-enforcer.md
├── security-auditor.md
├── pre-commit-guardian.md
└── deployment-checker.md
```

### 3. **Commands** (7 specialized)
```
.claude/commands_binora/
├── check-contract.md
├── check-tenant.md
├── coverage.md
├── create-pr.md
├── query-analysis.md
├── quick-audit.md
└── setup-tenant.md
```

### 4. **Core Documentation**
```
.claude/core_binora/
├── architecture.md          # Multi-tenant implementation details
├── testing.md               # Testing framework and patterns
├── forbidden.md             # All forbidden practices
├── workflows.md             # Common development workflows
└── [other guides]
```

### 5. **CLAUDE.md - Binora Specialized**
```
CLAUDE_BINORA_BACKEND.md    # Complete binora-backend instructions (673 lines)
```

---

## 🎯 How to Use the Integration

### Skills (Auto-Activate)
These skills automatically activate when their keywords are detected:

```python
# Write this code:
User.objects.filter(tenant_id=company.id)
# ❌ Skill activates: multi-tenant-guardian
# "NEVER manual tenant_id filtering"

# Or write this:
def create(self, request):
    user = User.objects.create(**data)
# ❌ Skill activates: django-architecture-enforcer
# "Move business logic to services"
```

### Agents (Manual Invocation)
Use these for complex tasks:

```bash
# Planning a new feature
Task: feature-planner
Prompt: "Plan a new user permission system..."

# Generating comprehensive tests
Task: django-test-generator
Prompt: "Generate tests for apps/core/services.py..."

# Deep multi-tenant scan
Task: multi-tenant-enforcer
Prompt: "Scan codebase for tenant_id violations..."
```

### Commands (Slash Commands)
```bash
/quick-audit [path]           # Fast CRITICAL check (30s)
/check-tenant [path]          # Multi-tenant scan (1 min)
/check-contract [app]         # OpenAPI validation (1-2 min)
/query-analysis [path]        # Database optimization (1-2 min)
/coverage [path]              # Coverage analysis (1 min)
/create-pr [branch]           # PR with validations (3-5 min)
```

### Core Documentation
Read these for detailed understanding:

- **architecture.md** - Multi-tenant patterns, service layer, middleware
- **testing.md** - Test fixtures, mocking patterns, 100% coverage
- **forbidden.md** - Critical rules that must be followed
- **workflows.md** - Feature development, bug fixing, pre-PR checklists

---

## 📋 Quick Reference

### CRITICAL Rules (From binora-backend)

```python
# ❌ FORBIDDEN
User.objects.filter(tenant_id=company.id)  # Manual tenant filtering
user.save(); send_email(user)             # Logic in view
from unittest.mock import Mock             # Use mocker.Mock()
"""Docstring in test"""                   # NO docstrings in tests

# ✅ REQUIRED
@staticmethod
def create_user(email: str) -> User:      # Type hints required
    return UserService.create(email)      # Logic in service
```

### Architecture Layers

```
View (HTTP only) → Service (ALL logic) → Model (Data structure)
```

### Test Pattern (AAA)

```python
def test_create_user_with_valid_email_succeeds(mocker):
    # Arrange
    data = {'email': 'user@example.com'}

    # Act
    user = UserService.create_user(**data)

    # Assert
    assert user.email == data['email']
```

---

## 📂 File Organization in Poneglyph

```
Poneglyph/
├── .claude/
│   ├── skills/              # Generic skills (40+)
│   ├── skills_binora/       # Binora skills (11) ⭐ NEW
│   ├── agents/              # Generic agents (16)
│   ├── agents_binora/       # Binora agents (10) ⭐ NEW
│   ├── commands/            # Generic commands
│   ├── commands_binora/     # Binora commands (7) ⭐ NEW
│   ├── core/                # Generic docs
│   ├── core_binora/         # Binora docs ⭐ NEW
│   ├── docs/                # Documentation
│   └── knowledge/           # Knowledge bases
├── CLAUDE.md                # Generic instructions
├── CLAUDE_BINORA_BACKEND.md # Binora instructions ⭐ NEW
├── AI_BINORA_BACKEND_KNOWLEDGE.md      # Knowledge base ⭐ NEW
├── AI_BINORA_INTEGRATION.md            # Integration guide ⭐ NEW
└── BINORA_INTEGRATION_INDEX.md         # This file
```

---

## 🚀 Next Steps

### 1. **Read the Documentation**
```
1. CLAUDE_BINORA_BACKEND.md      (overview of binora patterns)
2. AI_BINORA_BACKEND_KNOWLEDGE.md (architecture & patterns)
3. AI_BINORA_INTEGRATION.md       (how to use skills/agents)
4. .claude/core_binora/           (detailed guides)
```

### 2. **Understand the Pattern**
- View → Service → Model separation
- Middleware-based multi-tenant isolation
- Input/output serializer separation
- 100% test coverage with AAA pattern

### 3. **Use in Development**
- Skills auto-activate for real-time enforcement
- Agents help with complex tasks (planning, generation, validation)
- Commands provide quick checks (`/quick-audit`, `/check-tenant`)
- Always refer to `apps/core/` in binora-backend as reference

### 4. **Reference the Source**
Original binora-backend location:
```
/Users/oriol/Desktop/Bjumper/REPOSITORIOS/PYTHON/binora-backend
```

Key reference files:
- `apps/core/services.py` - Service patterns
- `apps/core/views/` - ViewSet patterns
- `apps/core/serializers/` - Serializer patterns
- `apps/core/tests/` - Test patterns
- `binora/settings.py` - Configuration
- `conftest.py` - Test configuration

---

## 📊 What This Enables

| Feature | Before | After |
|---------|--------|-------|
| Multi-tenant validation | Manual | Automatic (skill) |
| Service layer generation | Manual | Automatic (agent) |
| Test generation | Manual | 100% coverage (agent) |
| Query optimization | Manual | Real-time hints (skill) |
| Architecture enforcement | Manual | Real-time validation (skill) |
| Pre-PR validation | Manual | Automated (command) |
| Code review | Manual | Automated (agent) |
| Performance profiling | Manual | Automated (agent) |

---

## ✅ Integration Checklist

- [x] Copy 11 specialized skills
- [x] Copy 10 specialized agents
- [x] Copy 7 specialized commands
- [x] Copy core documentation (architecture, testing, etc.)
- [x] Copy CLAUDE.md (673 lines of binora specialization)
- [x] Create knowledge base documentation
- [x] Create integration guide
- [x] Create this index

**Status**: Ready to use ✅

---

## 📞 Getting Help

**If you need to**:
- **Understand architecture**: Read `CLAUDE_BINORA_BACKEND.md`
- **Learn patterns**: Check `AI_BINORA_BACKEND_KNOWLEDGE.md`
- **Use skills/agents**: See `AI_BINORA_INTEGRATION.md`
- **Reference examples**: Look in `/binora-backend/apps/core/`
- **Deep dive**: Check `.claude/core_binora/` documentation

---

## 🎓 Key Concepts

### Multi-Tenant Isolation
- Middleware automatically adds `tenant_id` to all queries
- Application code is tenant-agnostic
- NEVER manually filter by `tenant_id`

### Service Layer (3-Layer)
- **Views**: HTTP only, no logic
- **Services**: ALL business logic here
- **Models**: Data structures only

### Testing (100% Coverage)
- AAA pattern (Arrange, Act, Assert)
- `mocker.Mock()` not `Mock()`
- ZERO docstrings in tests
- Test names must be descriptive

### Code Quality
- ALL functions need type hints
- YOLO comments (minimal/no comments)
- 100% test coverage per file
- Query optimization mandatory

---

**Integration Complete**: November 18, 2024
**Purpose**: Specialize Poneglyph with binora-backend's proven patterns and tools
**Status**: ✅ Ready for use
**Version**: 1.0
