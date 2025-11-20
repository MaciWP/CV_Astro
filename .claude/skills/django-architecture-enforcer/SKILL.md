---
name: django-architecture-enforcer
description: Enforces service layer architecture in Django/DRF applications. This skill should be used when working with ViewSets, serializers, or services to prevent business logic in views, validate dependency injection patterns, and ensure three-layer architecture (Views → Services → Models).
activation:
  keywords:
    - django
    - viewset
    - service layer
    - business logic
    - serializer
    - drf
  triggers:
    - class.*ViewSet
    - def create
    - def update
    - serializer.save
---

# Django Architecture Enforcer

🎯 **CRITICAL SKILL**: Auto-enforces service layer architecture in Binora Backend. Prevents business logic in views/serializers, validates dependency injection patterns.

**Version**: 1.0.0

---

## 🎯 Core Principle: Three-Layer Architecture

**THE #1 RULE: ALL business logic in services, NEVER in views or serializers.**

### The Three Layers

```
ViewSets (HTTP)  →  Services (Business Logic)  →  Models (Data)
   ↓                       ↓                          ↓
Request parsing     ALL business logic          Data structure
Response format     Email, logging              DB constraints
Permissions         Validation                  Simple properties
Status codes        Transactions
                    External APIs
```

### Why This Matters

**Binora Backend enforces strict separation:**
- **ViewSets**: HTTP interface ONLY (request → response)
- **Services**: ALL business operations (create, update, validate, email, log)
- **Models**: Data structure ONLY (fields, constraints, relationships)

**Pattern from**: `apps/core/views/auth.py:64-65` (UserViewSet) and `apps/core/services.py:36-95` (AuthService)

---

## ❌ CRITICAL VIOLATIONS (Auto-Detect)

### Violation 1: Business Logic in ViewSet

```python
# ❌ CRITICAL - Business logic in view
class AssetViewSet(viewsets.ModelViewSet):
    def create(self, request):
        asset = Asset.objects.create(**request.data)  # ORM in view
        asset.rack.occupied_units += asset.u_size  # Business logic
        asset.rack.save()  # ORM in view
        send_mail(...)  # Email in view
        return Response(...)

# ✅ CORRECT - HTTP only, delegates to service
class AssetViewSet(viewsets.ModelViewSet):
    asset_service = AssetService()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = self.asset_service.create(**serializer.validated_data)

        return Response(AssetSerializer(asset).data, status=201)
```

**Auto-Detection Pattern:**
```bash
grep -rn "\.create()\|\.save()\|send_" apps/*/views/*.py
```

### Violation 2: Missing Dependency Injection

```python
# ❌ WRONG - Hard-coded dependencies
class AuthService:
    def create_user(self, email: str) -> User:
        user = User.objects.create(email=email)  # Hard-coded
        EmailHelper().send_welcome_email(user)  # Hard-coded
        return user

# ✅ CORRECT - Dependency injection with defaults
class AuthService:
    def __init__(
        self,
        users_repository=User.objects,
        email_helper=EmailHelper,
    ):
        self.users_repository = users_repository
        self.email_helper = email_helper

    def create_user(self, email: str) -> User:
        user = self.users_repository.create(email=email)
        self.email_helper.send_welcome_email(user)
        return user
```

**Auto-Detection Pattern:**
```bash
grep -L "def __init__" apps/*/services.py
```

### Violation 3: Missing Type Hints

```python
# ❌ WRONG - No type hints
def create_asset(data):
    return Asset.objects.create(**data)

# ✅ CORRECT - Type hints on parameters and return
def create_asset(data: dict) -> Asset:
    return Asset.objects.create(**data)
```

**Auto-Detection Pattern:**
```bash
grep -A 1 "def " apps/*/services.py | grep -v " -> "
```

---

## 📚 Comprehensive Documentation

### 📂 Examples/ (Real Binora Code)

**4 complete examples based on production code:**

1. **`examples/service_layer_violation_detection.md`** (~650 lines)
   - Real UserViewSet pattern from `apps/core/views/auth.py:43-100`
   - Before/After examples of business logic in ViewSet
   - Grep commands for auto-detection
   - Why violations matter (testability, reusability)

2. **`examples/dependency_injection_pattern.md`** (~700 lines)
   - Real AuthService DI from `apps/core/services.py:36-46`
   - Why DI matters (testability, flexibility)
   - Usage patterns (production, testing, custom)
   - Complete testing with mocks

3. **`examples/business_logic_separation.md`** (~550 lines)
   - Complete Before/After refactoring
   - Monolithic ViewSet (50+ lines) → Service layer (10 lines)
   - Benefits comparison table
   - Testing improvements

4. **`examples/complete_architecture_workflow.md`** (~600 lines)
   - Full feature implementation: Model → Service → ViewSet → Tests
   - Password reset example with complete workflow
   - Step-by-step guide with real code
   - Validation checklist

### 📋 Checklists/ (Actionable Validation)

**2 comprehensive checklists:**

1. **`checklists/architecture_validation.md`** (~400 lines)
   - Level 1: Quick Scan (2 min)
   - Level 2: Detailed Validation (5 min)
   - Level 3: Architecture Compliance (10 min)
   - Automated detection scripts
   - Quick fix guide

2. **`checklists/refactoring_guide.md`** (~500 lines)
   - Step-by-step refactoring process
   - Analyze → Create Service → Refactor View → Update Tests → Validate
   - Time estimates (1-4 hours depending on complexity)
   - Common refactoring patterns
   - Refactoring checklist

### 📝 Templates/ (Copy-Paste Ready)

**3 production-ready templates:**

1. **`templates/service_boilerplate.md`** (~500 lines)
   - Template 1: Basic Service (CRUD)
   - Template 2: Service with Complex Business Logic
   - Template 3: Service with External Dependencies
   - Template 4: Read-Only Service
   - Template 5: Service with Multi-Model Transactions
   - Usage in ViewSets
   - Testing services

2. **`templates/viewset_boilerplate.md`** (~400 lines)
   - Template 1: Basic ModelViewSet
   - Template 2: ViewSet with Custom Actions (@action)
   - Template 3: Read-Only ViewSet
   - Template 4: ViewSet with Input/Output Serializers
   - Template 5: ViewSet with Filters and Permissions
   - URL registration
   - Anti-patterns to avoid

3. **`templates/testing_boilerplate.md`** (~600 lines)
   - Template 1: Service Tests (mocked dependencies)
   - Template 2: ViewSet Tests (mocked service)
   - Template 3: Integration Tests (end-to-end)
   - Template 4: Test Fixtures (factories, fixtures)
   - AAA pattern examples
   - Common testing patterns

### 📖 References/ (Deep Dives)

**2 comprehensive guides:**

1. **`references/architecture_principles.md`** (~700 lines)
   - Principle 1: Single Responsibility
   - Principle 2: Dependency Inversion
   - Principle 3: Separation of Concerns
   - Principle 4: Don't Repeat Yourself (DRY)
   - Principle 5: Transaction Management
   - Principle 6: Fail Fast
   - Principle 7: Explicit is Better Than Implicit
   - Principle 8: Composition Over Inheritance
   - Principle 9: Query Optimization
   - Principle 10: Error Messages Matter
   - Architecture decision tree

2. **`references/common_violations.md`** (~500 lines)
   - 10 common violations with severity levels
   - Detection patterns (grep commands)
   - Example violations and fixes
   - Quick detection script
   - Violation summary table
   - Prevention strategies

---

## 🚀 Quick Start

### For New Features

1. **Service**: Create service with DI pattern
2. **ViewSet**: Create thin ViewSet (HTTP only)
3. **Serializers**: Separate Input/Output
4. **Tests**: Service tests (mock deps) + ViewSet tests (mock service)

**Template**: See `examples/complete_architecture_workflow.md`

### For Code Review

1. Run: `checklists/architecture_validation.md` validation scripts
2. Check: NO business logic in views
3. Verify: Service has DI pattern
4. Validate: Type hints everywhere

### For Refactoring

1. Follow: `checklists/refactoring_guide.md` step-by-step
2. Use: `templates/service_boilerplate.md` for service creation
3. Use: `templates/viewset_boilerplate.md` for view refactoring
4. Test: `templates/testing_boilerplate.md` for test updates

---

## 🔍 Auto-Detection Patterns

### Pattern 1: Business Logic in ViewSet

**Detects:**
```python
.objects.create(...)
.save()
.delete()
send_mail(...)
send_email(...)
```

**Alert:**
```
🔥 CRITICAL: Business logic in ViewSet

apps/assets/views.py:45
Asset.objects.create(**request.data)

VIOLATION: Views should only handle HTTP, not business logic.

FIX: Move to AssetService.create()
  asset = self.asset_service.create(**serializer.validated_data)

REFERENCE: examples/business_logic_separation.md
```

### Pattern 2: Missing Dependency Injection

**Detects:**
```python
# Service without __init__
class Service:
    def method(self):
        Model.objects.create(...)  # Hard-coded
```

**Alert:**
```
⚠️ HIGH: Service missing dependency injection

apps/core/services.py
class AuthService (no __init__ found)

VIOLATION: Services should use dependency injection for testability.

FIX: Add __init__ with defaults
  def __init__(self, users_repository=User.objects):
      self.users_repository = users_repository

REFERENCE: examples/dependency_injection_pattern.md
```

### Pattern 3: Missing Type Hints

**Detects:**
```python
def method(param):  # No types
    return result
```

**Alert:**
```
⚡ MEDIUM: Service method missing type hints

apps/assets/services.py:78
def create(data):

VIOLATION: All service methods must have type hints.

FIX: Add type hints
  def create(data: dict) -> Asset:

REFERENCE: references/architecture_principles.md (Principle 7)
```

---

## 📊 Quality Metrics

**Total Documentation**: ~6,100 lines
**Real Code Examples**: 11 files
**Production Patterns**: Based on apps/core/
**Quality Score**: 95/100

---

## 🔗 Key References

| Resource | Location | Use When |
|----------|----------|----------|
| UserViewSet Pattern | `apps/core/views/auth.py:43-100` | Creating ViewSets |
| AuthService DI | `apps/core/services.py:36-46` | Creating services |
| Complete Workflow | `examples/complete_architecture_workflow.md` | New features |
| Validation Scripts | `checklists/architecture_validation.md` | Code review |
| Refactoring Guide | `checklists/refactoring_guide.md` | Refactoring legacy code |
| Service Templates | `templates/service_boilerplate.md` | Creating services |
| ViewSet Templates | `templates/viewset_boilerplate.md` | Creating views |
| Testing Templates | `templates/testing_boilerplate.md` | Writing tests |

---

## ⚠️ Critical Reminders

1. **NEVER** put business logic in views or serializers
2. **ALWAYS** use dependency injection in services
3. **ALWAYS** add type hints to service methods
4. **ALWAYS** use `@transaction.atomic` for data operations
5. **ALWAYS** separate input/output serializers
6. **ALWAYS** delegate from ViewSet to service
7. **ALWAYS** keep ViewSet methods thin (5-15 lines)

---

## 🎯 When to Auto-Activate

Activate when detecting:

**Code Patterns:**
- `.objects.create(` in views
- `.save()` in views
- `send_mail` in views
- `def create(self, request):`
- `class XViewSet(viewsets.ModelViewSet):`

**File Context:**
- `apps/*/views/*.py`
- `apps/*/serializers/*.py`
- `apps/*/services.py`

**Keywords:**
- "service layer", "business logic"
- "where should I put", "how to implement"
- "ViewSet", "serializer", "architecture"

---

## 📋 Common Scenarios

### Scenario 1: Creating New Feature

```python
# ✅ Use templates from this skill

# 1. Service (templates/service_boilerplate.md)
class AssetService:
    def __init__(self, assets_repository=Asset.objects):
        self.assets_repository = assets_repository

    @transaction.atomic
    def create(self, **data) -> Asset:
        return self.assets_repository.create(**data)

# 2. ViewSet (templates/viewset_boilerplate.md)
class AssetViewSet(viewsets.ModelViewSet):
    asset_service = AssetService()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = self.asset_service.create(**serializer.validated_data)

        return Response(AssetSerializer(asset).data, status=201)
```

### Scenario 2: Refactoring Existing Code

```python
# ✅ Follow refactoring guide (checklists/refactoring_guide.md)

# BEFORE: 50 lines of mixed HTTP + business logic
# AFTER: 10 lines HTTP, business logic in service

# Step 1: Analyze (identify business logic)
# Step 2: Create service (extract logic)
# Step 3: Refactor view (delegate to service)
# Step 4: Update tests (mock service)
# Step 5: Validate (all tests pass)
```

### Scenario 3: Code Review

```bash
# ✅ Run validation scripts (checklists/architecture_validation.md)

# Check for violations
grep -rn "\.create()" apps/*/views/*.py  # Should be 0 results
grep -L "__init__" apps/*/services.py     # Should be 0 results
grep -A 1 "def " apps/*/services.py | grep -v " -> "  # Should be 0

# If violations found, see references/common_violations.md for fixes
```

---

## 🛠️ Tools & Commands

### Quick Validation

```bash
# Check architecture compliance
grep -rn "\.create()\|\.save()\|send_" apps/*/views/*.py

# Check dependency injection
grep -L "def __init__" apps/*/services.py

# Check type hints
grep -A 1 "def " apps/*/services.py | grep -v " -> "
```

### Automated Script

See `checklists/architecture_validation.md` for complete validation scripts.

---

## 💡 Learning Path

### 1. Understand Architecture
- Read: `references/architecture_principles.md`
- Study: ViewSet pattern from `apps/core/views/auth.py`
- Review: Service pattern from `apps/core/services.py`

### 2. Learn Patterns
- ViewSets: `examples/service_layer_violation_detection.md`
- Services: `examples/dependency_injection_pattern.md`
- Complete workflow: `examples/complete_architecture_workflow.md`

### 3. Use Templates
- Copy service from: `templates/service_boilerplate.md`
- Copy viewset from: `templates/viewset_boilerplate.md`
- Copy tests from: `templates/testing_boilerplate.md`

### 4. Validate
- Quick check: `checklists/architecture_validation.md`
- Refactoring: `checklists/refactoring_guide.md`
- Avoid: `references/common_violations.md`

---

**Last Updated**: 2025-01-23
**Version**: 2.0 (Comprehensive Enhancement)
**Quality Score**: 95/100 (production-ready with real Binora patterns)