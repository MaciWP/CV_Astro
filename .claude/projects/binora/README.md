# Binora Backend - Project Context

**Purpose**: Project-specific knowledge, rules, and patterns for binora-backend multi-tenant Django application.

**When to use**: Activate this context when working with binora-backend or implementing similar multi-tenant Django patterns.

---

## Directory Structure

```
.claude/projects/binora/
├── README.md                    # This file
├── CLAUDE.md                    # Original CLAUDE.md from binora-backend
├── core/                        # Rules and patterns from binora-backend
│   ├── architecture.md          # Multi-tenant architecture, service layer pattern
│   ├── forbidden.md             # CRITICAL violations to avoid
│   ├── testing.md               # Testing patterns (100% coverage, AAA, fixtures)
│   ├── code-style.md            # Code style guide (YOLO comments, __all__, etc.)
│   ├── pr-review-checklist.md  # Strict PR review standards
│   └── workflows.md             # Common development workflows
└── knowledge/                   # Generated analysis and integration docs
    ├── ANALYSIS.md              # Exhaustive analysis of binora-backend (12K words)
    ├── KNOWLEDGE.md             # Knowledge base (architecture, patterns, examples)
    ├── INTEGRATION.md           # How to use binora skills/agents in Poneglyph
    ├── INDEX.md                 # Index of binora integration
    └── CLAUDE_BINORA_ORIGINAL.md # Historical reference (original CLAUDE.md copy)
```

---

## How to Use This Context

### When Working on Binora-Backend

**Read FIRST** (in order):
1. `CLAUDE.md` - Original binora-backend instructions
2. `core/architecture.md` - Understand multi-tenant pattern
3. `core/forbidden.md` - CRITICAL violations to avoid

**Reference as needed**:
- `core/testing.md` - When writing tests
- `core/code-style.md` - When formatting code
- `core/pr-review-checklist.md` - Before creating PR
- `core/workflows.md` - For common tasks (feature dev, bug fixes)

### When Implementing Similar Patterns

**Consult**:
- `knowledge/ANALYSIS.md` - Deep understanding of binora architecture
- `knowledge/KNOWLEDGE.md` - Reusable patterns and examples
- `core/architecture.md` - Service layer pattern, dependency injection

---

## Critical Rules from Binora

### 🚨 NEVER Manual tenant_id Filtering

```python
# ❌ FORBIDDEN
User.objects.filter(tenant_id=company.id, email=email)

# ✅ CORRECT
User.objects.filter(email=email)  # Middleware adds tenant_id automatically
```

### 🎯 Service Layer Mandatory

```python
# ❌ FORBIDDEN - Business logic in view
def create(self, request):
    user = User.objects.create(...)
    send_email(user)  # ❌

# ✅ CORRECT - Delegate to service
def create(self, request):
    user = UserService.create_user(...)  # ✅
```

### ✅ 100% Test Coverage Required

Not "good enough" - **MANDATORY 100%**.

### 🔧 Type Hints Required

All functions MUST have type hints on parameters and return values.

### 💬 YOLO Comments

Only comment non-obvious code. Self-explanatory code needs NO comments.

---

## Available Tools

**Skills** (in `.claude/skills/`):
- `django-architecture-enforcer` - Enforce 3-layer pattern
- `django-query-optimizer` - Detect N+1 queries
- `django-testing-patterns` - Generate tests with 100% coverage
- `binora-multi-tenant-guardian` - Validate tenant isolation
- `binora-prompt-engineer` - Optimize prompts for binora

**Agents** (in `.claude/agents/`):
- `django-codebase-auditor` - Comprehensive code review
- `django-test-generator` - Generate tests from specs
- `binora-multi-tenant-enforcer` - Enforce tenant isolation
- `binora-pre-commit-guardian` - Pre-commit validation

**Commands** (in `.claude/commands/`):
- `/django-quick-audit` - Fast architecture check
- `/binora-check-tenant` - Validate tenant isolation
- `/django-coverage` - Check test coverage
- `/binora-setup-tenant` - Setup new tenant

---

## Integration with Poneglyph

This project context integrates with Poneglyph's specialization system:

**Universal** → **Django** → **Binora**

- Universal skills work everywhere
- Django skills auto-activate on "Django", "ViewSet", "serializer" keywords
- Binora skills auto-activate on "binora", "multi-tenant", "tenant_id" keywords

See: `knowledge/INTEGRATION.md` for detailed integration guide.

---

**Status**: Active and ready to use
**Version**: 1.0
**Last Updated**: 2024-11-18
**Project**: binora-backend (https://github.com/[org]/binora-backend)