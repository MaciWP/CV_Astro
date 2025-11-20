# Common Workflows - Binora Backend

Standard development workflows using agents and commands, optimized for parallel execution.

---

## 🎯 Core Workflow Principle

**Parallel Execution First**: Run independent tasks simultaneously for 3-5x speedup.

```
Sequential: Task 1 → Wait → Task 2 → Wait → Task 3 → Wait (slow ❌)
Parallel: Task 1 + Task 2 + Task 3 → All results at once (fast ✅)
```

**When to parallelize**: Tasks that don't depend on each other
**When NOT to parallelize**: Dependent operations (fix → test, write → read)

---

## 🚀 Quick Start Workflows

### Feature Development (Complete Cycle)

**Step 1: Plan & Research** (Parallel)
```bash
# Send all in ONE message:
/enhance-prompt "Implement asset filtering by status"
Read apps/core/views/user.py      # Reference pattern
Read apps/assets/models.py         # Check model fields
Grep "FilterSet" apps/core/ -n    # Find filter examples
```

**Step 2: Implement** (Sequential - can't parallelize coding)
- Write models, serializers, services, views
- Follow patterns from step 1

**Step 3: Validate** (Parallel)
```bash
# Send all in ONE message:
/django-codebase-auditor apps/assets/
nox -s format
nox -s lint
nox -s types_check
nox -s test -- apps/assets/ --cov
```

**Step 4: Create PR** (Parallel)
```bash
# Send all in ONE message:
/enhance-prompt "Create PR for asset filtering feature"
git diff dev --stat
git log --oneline dev..HEAD
```

**Time**: 15-20 min (vs 40-60 min sequential)
**Speedup**: 3x faster

---

### Bug Fixing Workflow

**Step 1: Diagnose** (Parallel Investigation)
```bash
# Send all in ONE message:
Read apps/<app>/<suspected_file>.py
Grep "<error_keyword>" apps/<app>/ -n
nox -s test -- apps/<app>/ -v
```

**Step 2: Fix** (Sequential)
- Apply fix following architecture patterns
- Keep business logic in services

**Step 3: Validate** (Parallel)
```bash
# Send all in ONE message:
/django-codebase-auditor apps/<app>/<fixed_file>.py
nox -s test -- apps/<app>/tests/<test_file>_tests.py
nox -s types_check
```

**Step 4: Regression Check** (Parallel)
```bash
# Send all in ONE message:
nox -s test -- apps/core/      # Related app
nox -s test -- apps/<app>/     # Fixed app
```

**Time**: 10-15 min (vs 25-35 min sequential)
**Speedup**: 2.5x faster

---

### Pre-PR Comprehensive Check

**Scenario**: Ready to create PR, need full validation.

**Parallel Workflow**:
```bash
# Send all in ONE message:
/django-codebase-auditor apps/<app>/
nox -s format
nox -s lint
nox -s types_check
nox -s test -- apps/<app>/ --cov
```

**Advanced** (audit multiple files):
```bash
# Send all in ONE message:
/django-codebase-auditor apps/core/views/user.py
/django-codebase-auditor apps/core/serializers/user.py
/django-codebase-auditor apps/core/services.py
nox -s test -- apps/core/ --cov
```

**Results** (all simultaneously):
- Audit reports for each file
- Formatted code
- Linting results
- Type check results
- Test coverage report

**Time**: 3-5 min (vs 10-15 min sequential)
**Speedup**: 3x faster

---

### Code Review Workflow

**Step 1: Identify Changes**
```bash
git diff dev --name-only
```

**Step 2: Audit All Changed Files** (Parallel)
```bash
# If 3 files changed, send all in ONE message:
/django-codebase-auditor apps/core/views/user.py
/django-codebase-auditor apps/core/serializers/user.py
/django-codebase-auditor apps/core/services.py
```

**Step 3: Validate** (Parallel)
```bash
# Send all in ONE message:
/check-tenant apps/<app>/     # Multi-tenant compliance
/coverage apps/<app>/         # Coverage check
nox -s test -- apps/<app>/
```

**Results**: Comprehensive review in minutes, not hours.

---

### Test Coverage Improvement

**Step 1: Analyze Coverage** (Parallel - Multiple Modules)
```bash
# Send all in ONE message:
nox -s test -- apps/core/tests/services_tests.py --cov
nox -s test -- apps/core/tests/serializers_tests.py --cov
nox -s test -- apps/core/tests/views_tests.py --cov
```

**Results Example**:
- services_tests.py: 85% (needs +8%)
- serializers_tests.py: 92% ✅
- views_tests.py: 78% (needs +15%)

**Step 2: Enhance Prompts** (Parallel - Multiple Targets)
```bash
# Send all in ONE message:
/enhance-prompt "Improve AuthService coverage from 85% to 100%"
/enhance-prompt "Improve UserViewSet coverage from 78% to 100%"
```

**Step 3: Implement Tests** (Based on enhanced prompts)

**Step 4: Re-validate** (Parallel)
```bash
# Send all in ONE message:
nox -s test -- apps/core/tests/services_tests.py --cov
nox -s test -- apps/core/tests/views_tests.py --cov
```

**Time**: 20-30 min (vs 60-90 min sequential)
**Speedup**: 3-4x faster

---

### Multi-App Refactoring

**Scenario**: Extract business logic from views to services across 3 apps.

**Step 1: Audit All Apps** (Parallel)
```bash
# Send all in ONE message:
/django-codebase-auditor apps/core/
/django-codebase-auditor apps/assets/
/django-codebase-auditor apps/hierarchy/
```

**Results**:
- apps/core/: 3 HIGH issues (business logic in views)
- apps/assets/: 1 CRITICAL issue (manual tenant_id)
- apps/hierarchy/: 5 MEDIUM issues (missing type hints)

**Step 2: Fix by Priority**
1. CRITICAL issues first (tenant_id)
2. HIGH issues (business logic)
3. MEDIUM issues (type hints)

**Step 3: Validate Each Fix** (Parallel when possible)
```bash
# After fixing apps/core/ and apps/hierarchy/:
nox -s test -- apps/core/
nox -s test -- apps/hierarchy/
```

---

### Bug Hunt Multi-Tenant

**Scenario**: Find all manual tenant_id filtering violations (CRITICAL).

**Step 1: Search All Apps** (Parallel)
```bash
# Send all in ONE message:
Grep "tenant_id" apps/core/ -n
Grep "tenant_id" apps/assets/ -n
Grep "tenant_id" apps/hierarchy/ -n
Grep "tenant_id" apps/library/ -n
Grep "tenant_id" apps/processes/ -n
```

**Results**: All occurrences across all apps instantly.

**Step 2: Audit Affected Files** (Parallel)
```bash
# If violations found in 2 files:
/django-codebase-auditor apps/assets/views/assets.py
/django-codebase-auditor apps/hierarchy/views/datacenter.py
```

**Step 3: Fix and Validate**
- Apply fixes (remove manual tenant_id filtering)
- Re-audit to confirm

---

## 📋 Workflow Templates

### Template 1: Daily Development Cycle

```bash
# Morning: Check project health (Parallel)
/django-codebase-auditor apps/
nox -s test -- --cov

# During development: Continuous validation (after each change)
/django-codebase-auditor apps/<app>/
nox -s types_check
nox -s test -- apps/<app>/

# End of day: Pre-commit validation (Parallel)
nox -s format
nox -s lint
nox -s types_check
nox -s test
```

---

### Template 2: Feature Branch Workflow

```bash
# 1. Start feature (Parallel planning)
/enhance-prompt "Implement {{feature}}"
Read apps/core/{{reference_file}}.py
Grep "{{pattern}}" apps/

# 2. Implement feature (Sequential - coding)
# ... write code ...

# 3. Self-review (Parallel)
/django-codebase-auditor apps/<app>/
nox -s test -- apps/<app>/ --cov
git diff dev --stat

# 4. Fix issues (Sequential)
# ... apply fixes ...

# 5. Pre-PR validation (Parallel)
nox -s format
nox -s lint
nox -s types_check
nox -s test

# 6. Create PR (Parallel)
/enhance-prompt "Create PR for {{feature}}"
git log --oneline dev..HEAD
```

---

### Template 3: Sprint Planning with Coverage Goals

```bash
# 1. Analyze current state (Parallel - all apps)
/coverage apps/core/
/coverage apps/assets/
/coverage apps/hierarchy/

# 2. Prioritize by coverage % (lowest first)
# Example results:
# - apps/hierarchy/: 72% (CRITICAL)
# - apps/assets/: 85% (needs work)
# - apps/core/: 93% (good)

# 3. Generate tests for lowest coverage (Parallel)
django-test-generator apps/hierarchy/views.py
django-test-generator apps/hierarchy/services.py

# 4. Validate improvements (Parallel)
nox -s test -- apps/hierarchy/ --cov
nox -s test -- apps/assets/ --cov
```

---

## ⚡ Parallel Execution Patterns

### Pattern 1: Multiple File Reads
✅ **Good** (all at once):
```bash
Read apps/core/views/user.py
Read apps/core/serializers/user.py
Read apps/core/services.py
# All files load simultaneously
```

❌ **Bad** (one by one):
```bash
Read apps/core/views/user.py
# wait...
Read apps/core/serializers/user.py
# wait...
```

---

### Pattern 2: Independent Validations
✅ **Good** (parallel):
```bash
nox -s format
nox -s lint
nox -s types_check
```

❌ **Bad** (sequential with &&):
```bash
nox -s format && nox -s lint && nox -s types_check
# Using && forces sequential execution
```

---

### Pattern 3: Multiple Directory Searches
✅ **Good** (search all at once):
```bash
Grep "tenant_id" apps/core/ -n
Grep "tenant_id" apps/assets/ -n
Grep "tenant_id" apps/hierarchy/ -n
# Results come simultaneously
```

❌ **Bad** (ls then manual checks):
```bash
ls apps/core/
# Then manually checking each file
```

---

### Pattern 4: Agent + Command Parallel
✅ **Good** (audit while tests run):
```bash
/django-codebase-auditor apps/core/
nox -s test -- apps/core/ --cov
# Both run simultaneously
```

---

### Pattern 5: Multiple Agents
✅ **Good** (audit multiple apps):
```bash
/django-codebase-auditor apps/core/
/django-codebase-auditor apps/assets/
/django-codebase-auditor apps/hierarchy/
# All audits run in parallel
```

---

## 🚦 When NOT to Parallelize

Some tasks MUST be sequential:

### 1. Dependent Operations
```bash
# ❌ Don't parallelize - fix must happen before validation
# Step 1: Fix code
# Step 2: nox -s test  (depends on fix)
```

### 2. Code Generation
```bash
# ❌ Don't parallelize - write must complete before read
# Step 1: Write new file
# Step 2: Read to verify (depends on write)
```

### 3. Migration Operations
```bash
# ❌ Don't parallelize - must run in order
python manage.py makemigrations
python manage.py migrate
```

### 4. Git Operations with Dependencies
```bash
# ❌ Don't parallelize - must be sequential
git add .
git commit -m "message"
git push
```

### 5. Test → Fix → Test Cycle
```bash
# ❌ Don't parallelize - must wait for test results
# Step 1: nox -s test  (identify failures)
# Step 2: Fix failing tests
# Step 3: nox -s test  (verify fixes)
```

---

## 📊 Performance Comparison

| Task | Sequential | Parallel | Speedup |
|------|-----------|----------|---------|
| Audit 3 apps | 9 min | 3 min | **3x** |
| Run format + lint + types + test | 6 min | 2 min | **3x** |
| Read 5 reference files | 2.5 min | 30 sec | **5x** |
| Search pattern across 5 apps | 5 min | 1 min | **5x** |
| Pre-PR validation (audit + test) | 12 min | 4 min | **3x** |
| Multi-app refactoring audit | 15 min | 5 min | **3x** |

**Average speedup**: 3-5x faster with parallel execution

---

## ✅ Best Practices

### DO:
1. ✅ Run independent validations in parallel (format, lint, types, test)
2. ✅ Audit multiple files/apps simultaneously
3. ✅ Read multiple reference files in one message
4. ✅ Search patterns across multiple directories in parallel
5. ✅ Use `/enhance-prompt` while reading reference code
6. ✅ Batch Grep searches across apps
7. ✅ Send all parallel tasks in ONE message
8. ✅ Think "Can these run at the same time?" before executing

### DON'T:
1. ❌ Use shell `&&` (forces sequential execution)
2. ❌ Wait for one audit before starting another
3. ❌ Read files one by one when you need multiple
4. ❌ Run tests sequentially when they're independent
5. ❌ Process multiple apps one at a time
6. ❌ Split parallel tasks into separate messages
7. ❌ Parallelize dependent operations

---

## 🎓 Progressive Learning: Mastering Parallel Execution

### Level 1: Basic Parallel (2 tasks)
```bash
nox -s format
nox -s lint
```
**Goal**: Understand that independent tasks can run together

### Level 2: Multiple Validations (4 tasks)
```bash
nox -s format
nox -s lint
nox -s types_check
nox -s test -- apps/core/
```
**Goal**: Combine all validation commands

### Level 3: Agent + Commands (Mixed)
```bash
/django-codebase-auditor apps/core/
nox -s test -- apps/core/ --cov
```
**Goal**: Mix agents with validation commands

### Level 4: Multiple Agents (Advanced)
```bash
/django-codebase-auditor apps/core/
/django-codebase-auditor apps/assets/
nox -s test
```
**Goal**: Run multiple agents simultaneously

### Level 5: Full Workflow (Expert)
```bash
/enhance-prompt "Create PR for {{feature}}"
/django-codebase-auditor apps/<app>/
nox -s format
nox -s lint
nox -s types_check
nox -s test -- --cov
git diff dev --stat
```
**Goal**: Orchestrate complete workflows with parallel execution

---

## 🔧 Refactoring Workflow

### Step 1: Identify Issues (Parallel Analysis)
```bash
/refactoring-assistant apps/<app>/
/critique-agent apps/<app>/
/performance-analyzer apps/<app>/
```

### Step 2: Extract to Services
- Move business logic from views
- Use service-layer-generator agent
- Follow apps/core/services.py pattern

### Step 3: Optimize Queries
- Use performance-optimizer agent
- Add select_related/prefetch_related
- Check for N+1 queries

### Step 4: Validate (Parallel)
```bash
/django-codebase-auditor apps/<app>/
nox -s types_check
nox -s test -- apps/<app>/ --cov
```

---

## 🚀 Deployment Workflow

### Pre-deployment Validation (Parallel)
```bash
# Send all in ONE message:
/deployment-checker
/security-auditor
/contract-compliance-validator
nox -s test -- --cov
```

### Migration Check (Sequential)
```bash
# Must be sequential:
python manage.py makemigrations --check
python manage.py migrate --plan
```

### Final Validation (Parallel)
```bash
# Send all in ONE message:
nox -s format
nox -s lint
nox -s types_check
nox -s test
```

---

## 📚 Quick Commands Reference

### Slash Commands
- `/quick-audit [path]` - Fast validation (30s)
- `/fix-tests [file]` - Debug tests (2-5 min)
- `/create-pr [branch]` - PR with validations (3-5 min)
- `/check-tenant [path]` - Multi-tenant scan (1 min)
- `/coverage [path]` - Coverage analysis (1 min)
- `/enhance-prompt "[prompt]"` - Optimize prompt (1 min)

### Nox Commands
```bash
nox -s format              # Auto-format with Black
nox -s lint                # Lint with flake8
nox -s types_check         # Type check with mypy
nox -s test                # Run full test suite
nox -s test -- -k "name"   # Run specific test
nox -s test -- --cov       # Run with coverage
```

### Git Commands (for workflows)
```bash
git diff dev --name-only   # List changed files
git diff dev --stat        # Change summary
git log --oneline dev..HEAD # Commits in branch
```

---

## 🎯 Success Metrics

You're mastering workflows when:

### Speed
- ✅ Feature implementation: 50%+ faster
- ✅ Pre-PR checks: <5 min (vs 15+ min before)
- ✅ Bug fixes: <15 min (vs 30+ min before)

### Quality
- ✅ Catch 95%+ violations before commit
- ✅ Maintain 100% test coverage
- ✅ Zero CRITICAL issues in PR

### Workflow
- ✅ Use parallel execution naturally
- ✅ Combine agents with commands effectively
- ✅ Identify independent tasks automatically

---

## 💡 Pro Tips

1. **Think Parallel First**: Always ask "Can these run simultaneously?"
2. **One Message Rule**: Send all parallel tasks in ONE message
3. **Avoid Shell Operators**: Don't use `&&` or `;` for independent tasks
4. **Monitor Performance**: Track time savings (should see 3-5x speedup)
5. **Use Templates**: Don't reinvent workflows, use templates above
6. **Progressive Learning**: Start simple (2 tasks) → build to complex (8+ tasks)
7. **Validate in Parallel**: Always run format+lint+types+test together
8. **Read References First**: Load context before implementing

---

**Related Documentation**:
- `.claude/guides/parallel-execution.md` - Deep dive into parallel patterns
- `.claude/examples/agent-workflows.md` - Detailed scenario examples
- `.claude/references/agents.md` - All 31 agents reference
- `.claude/examples/workflow-templates.md` - Additional templates

**Version**: 2.0 (Expanded with Parallel Patterns)
**Last Updated**: 2025-01-13
**Optimized for**: Claude Sonnet 4.5
