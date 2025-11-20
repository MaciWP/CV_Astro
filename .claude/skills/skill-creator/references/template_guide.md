# Skill Creator Template Guide

**Version**: 2.0.0
**Last Updated**: 2025-01-13

Complete reference for all 6 skill templates (A-F) with structure, examples, and usage guidance.

---

## Template A: Frontend/UI Development

**Best for**: Web (React, Vue, Angular), Mobile (Flutter, React Native, Swift), Desktop UI
**Applies to**: Components, screens, state management, navigation, styling, DI

### Structure

```markdown
## 🎯 Mission
[UI/UX quality targets with metrics]

Example: Ensure all UI components achieve **<200ms load time**, **>95% accessibility score**, and **100% DI compliance**.

## 📐 Core Principles

### 1. Dependency Injection
**Rule**: NEVER instantiate services directly in components.
**Why it matters**: Enables testing with mocks, follows SOLID principles, reduces coupling.

❌ WRONG - Hard-coded dependency
[bad code example with direct instantiation]

✅ CORRECT - Injected dependency
[good code example with DI]

**Auto-check**:
- [ ] Does component accept services as props/parameters?
- [ ] Are services initialized with optional injection pattern?
- [ ] Can this be tested with mock services?

### 2. State Management
**Rule**: [State management principle for React/Flutter/etc.]
**Why it matters**: [Explanation]
[examples]

### 3. Component Best Practices
**Rule**: [Component principle]
**Why it matters**: [Explanation]
[examples]

## 🚫 Anti-Patterns

### 1. Hard-Coded Services
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

### 2. Inefficient Re-renders
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

### 3. Memory Leaks
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

## 🔍 Validation Checklist
1. **DI Compliance**
   - [ ] Components accept optional services?
   - [ ] No direct instantiation?
2. **State Management**
   - [ ] Correct provider/hook type?
   - [ ] State updates immutable?
3. **Performance**
   - [ ] Memoization where needed?
   - [ ] Lazy loading implemented?
4. **Memory**
   - [ ] Cleanup in unmount/dispose?
   - [ ] No memory leaks?

## 📚 References
| File | Purpose |
|------|---------|
| Component examples | Reference implementations |
| State docs | State management patterns |
```

### Adaptation Examples

**React**:
- Components → Functional components with hooks
- State → useState, useContext, Redux
- DI → Props injection
- File structure → `src/components/`, `src/hooks/`

**Flutter**:
- Components → StatelessWidget, StatefulWidget
- State → Riverpod, Provider, BLoC
- DI → Constructor injection
- File structure → `lib/screens/`, `lib/widgets/`

**Vue**:
- Components → Single File Components (.vue)
- State → Pinia, Vuex, Composition API
- DI → provide/inject
- File structure → `src/components/`, `src/composables/`

---

## Template B: Backend/API Development

**Best for**: REST APIs, GraphQL, gRPC (Express, FastAPI, Spring Boot, Django, Go)
**Applies to**: Endpoints, auth, API design, validation, error handling

### Structure

```markdown
## 🎯 Mission
[API performance, security, reliability targets with metrics]

Example: Ensure all API endpoints achieve **<100ms response time**, **100% input validation**, and **comprehensive error handling**.

## 📐 Core Principles

### 1. Input Validation
**Rule**: ALL request data MUST be validated.
**Why it matters**: Prevents security vulnerabilities (SQL injection, XSS), ensures data integrity.

❌ WRONG - No validation
[bad code example]

✅ CORRECT - Validated with schema
[good code example]

**Auto-check**:
- [ ] Request data validated with schema (Pydantic, Joi, etc.)?
- [ ] All fields have type constraints?
- [ ] Edge cases handled (null, empty, too long)?

### 2. Error Handling
**Rule**: Use structured error responses with proper HTTP status codes.
**Why it matters**: [Explanation]
[examples]

### 3. Authentication & Authorization
**Rule**: [Auth principle]
**Why it matters**: [Explanation]
[examples]

### 4. API Versioning
**Rule**: [Versioning principle]
**Why it matters**: [Explanation]
[examples]

## 🚫 Anti-Patterns

### 1. Missing Validation
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

### 2. Generic Error Responses
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

### 3. Hardcoded Secrets
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

## 🔍 Validation Checklist
1. **Security**
   - [ ] Input validation present?
   - [ ] No hardcoded secrets?
   - [ ] HTTPS enforced?
2. **Error Handling**
   - [ ] Structured error responses?
   - [ ] Appropriate status codes?
   - [ ] No stack traces in production?
3. **Performance**
   - [ ] Response times <100ms?
   - [ ] Pagination implemented?
   - [ ] Caching strategy?

## 📚 References
| File | Purpose |
|------|---------|
| API routes | Reference implementations |
| Error handlers | Centralized error handling |
```

### Adaptation Examples

**FastAPI**:
- Validation → Pydantic models
- Endpoints → @app.get/@app.post decorators
- DI → Depends() for services
- File structure → `app/routes/`, `app/models/`

**Express**:
- Validation → express-validator, Joi
- Endpoints → router.get/router.post
- DI → Middleware injection
- File structure → `routes/`, `controllers/`

**Django/DRF**:
- Validation → Serializers
- Endpoints → ViewSets, @action decorators
- DI → Service layer delegation
- File structure → `apps/*/views/`, `apps/*/serializers/`

---

## Template C: Testing/QA

**Best for**: Unit, integration, E2E tests (Jest, pytest, JUnit, Flutter test)
**Applies to**: Any testing framework, mocking strategies, coverage goals

### Structure

```markdown
## 🎯 Mission
[Test coverage targets, quality standards with metrics]

Example: Achieve **>80% code coverage**, **<5min test suite runtime**, and **0 flaky tests**.

## 📐 Core Principles

### 1. AAA Pattern (Arrange-Act-Assert)
**Rule**: ALL tests follow AAA structure.
**Why it matters**: Improves readability, maintainability, makes intent clear.

❌ WRONG - No structure
[bad code example]

✅ CORRECT - Clear AAA sections
[good code example]

**Auto-check**:
- [ ] Arrange section sets up test data?
- [ ] Act section performs single action?
- [ ] Assert section verifies expected outcome?

### 2. Mocking Strategy
**Rule**: [Mocking principle for framework]
**Why it matters**: [Explanation]
[examples]

### 3. Test Independence
**Rule**: [Independence principle]
**Why it matters**: [Explanation]
[examples]

## 🚫 Anti-Patterns

### 1. Flaky Tests
❌ [bad example with randomness/timing]
✅ [good example with deterministic behavior]
**Why it matters**: [Explanation]

### 2. Testing Implementation Details
❌ [bad example]
✅ [good example testing behavior]
**Why it matters**: [Explanation]

## 🔍 Validation Checklist
1. **Coverage**
   - [ ] >80% code coverage?
   - [ ] Critical paths 100% covered?
2. **Quality**
   - [ ] All tests pass?
   - [ ] No flaky tests?
   - [ ] AAA pattern followed?
3. **Performance**
   - [ ] Test suite <5min?
   - [ ] Parallel execution enabled?

## 📚 References
| File | Purpose |
|------|---------|
| Test examples | Reference test files |
| Mock utilities | Mocking helpers |
```

---

## Template D: ML/Data Science

**Best for**: Model training, inference, data pipelines (PyTorch, TensorFlow, scikit-learn)
**Applies to**: Training, inference, preprocessing, optimization, validation

### Structure

```markdown
## 🎯 Mission
[Inference latency, accuracy, model size targets]

Example: Ensure model inference **<150ms**, **>80% mAP@50 accuracy**, and **<50MB model size**.

## 📐 Core Principles

### 1. Data Preprocessing
**Rule**: Normalize inputs to [0,1] or standardize to mean=0, std=1.
**Why it matters**: Ensures training stability, faster convergence, prevents gradient explosion.

❌ WRONG - No normalization
[bad code example]

✅ CORRECT - Normalized inputs
[good code example]

**Auto-check**:
- [ ] Input data normalized/standardized?
- [ ] Preprocessing pipeline documented?
- [ ] Same preprocessing for train/inference?

### 2. Model Validation
**Rule**: [Validation principle]
**Why it matters**: [Explanation]
[examples]

### 3. Performance Optimization
**Rule**: [Optimization principle]
**Why it matters**: [Explanation]
[examples]

## 🚫 Anti-Patterns

### 1. Data Leakage
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

### 2. Wrong Tensor Format
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

## 🔍 Validation Checklist
1. **Data Quality**
   - [ ] Preprocessing correct?
   - [ ] No data leakage?
2. **Model Performance**
   - [ ] Inference time <target?
   - [ ] Accuracy >target?
3. **Production Readiness**
   - [ ] Model size acceptable?
   - [ ] Error handling present?

## 📚 References
| File | Purpose |
|------|---------|
| Training scripts | Model training code |
| Inference service | Deployment code |
```

---

## Template E: Database/Storage

**Best for**: SQL (PostgreSQL, MySQL), NoSQL (MongoDB, Redis), ORM patterns
**Applies to**: Schema design, queries, indexes, transactions, optimization

### Structure

```markdown
## 🎯 Mission
[Query performance, data integrity, scalability targets]

Example: Ensure queries execute in **<100ms for 1000+ records**, **100% ACID compliance**, and **proper indexing**.

## 📐 Core Principles

### 1. Query Optimization
**Rule**: Always use indexes on filtered/sorted fields.
**Why it matters**: Prevents full table scans, ensures <100ms query times, scalable performance.

❌ WRONG - No index, slow query
[bad code example]

✅ CORRECT - Indexed field, fast query
[good code example]

**Auto-check**:
- [ ] Filtered fields have indexes?
- [ ] N+1 queries prevented?
- [ ] Explain plan shows index usage?

### 2. Data Integrity
**Rule**: [Integrity principle]
**Why it matters**: [Explanation]
[examples]

### 3. Transaction Management
**Rule**: [Transaction principle]
**Why it matters**: [Explanation]
[examples]

## 🚫 Anti-Patterns

### 1. N+1 Queries
❌ [bad example]
✅ [good example with JOIN]
**Why it matters**: [Explanation]

### 2. Missing Indexes
❌ [bad example]
✅ [good example]
**Why it matters**: [Explanation]

## 🔍 Validation Checklist
1. **Performance**
   - [ ] Queries <100ms?
   - [ ] Indexes on filtered fields?
2. **Integrity**
   - [ ] Foreign keys defined?
   - [ ] Constraints enforced?
3. **Scalability**
   - [ ] Connection pooling?
   - [ ] Read replicas configured?

## 📚 References
| File | Purpose |
|------|---------|
| Schema definitions | Database schema |
| Query examples | Optimized queries |
```

---

## Template F: Django/DRF Multi-Tenant Backend (NEW)

**Best for**: Django 4-5 + DRF 3.14+ backends with multi-tenant architecture
**Applies to**: Models, ViewSets, Serializers, Services, Middleware, Multi-tenant patterns
**Tech Stack**: Django, DRF, PostgreSQL, Celery, Redis, pytest-django

### Structure

```markdown
## 🎯 Mission
[Multi-tenant isolation, service layer, test coverage targets]

Example: Enforce **100% transparent tenant isolation**, **100% service layer delegation**, and **>80% test coverage**.

## 📐 Core Principles

### 1. Transparent Multi-Tenant Isolation (CRITICAL)
**Rule**: NEVER manually filter by tenant_id. Middleware handles ALL tenant isolation.
**Why it matters**: Manual filtering is error-prone, creates security vulnerabilities (cross-tenant data leaks), violates transparent isolation architecture.

❌ WRONG - Manual tenant_id filtering (FORBIDDEN!)
```python
# CRITICAL VIOLATION
users = User.objects.filter(tenant_id=company.id, is_active=True)
assets = Asset.objects.filter(company=company)
```

✅ CORRECT - Middleware automatic filtering
```python
# Middleware automatically adds tenant_id to ALL queries
users = User.objects.filter(is_active=True)
assets = Asset.objects.all()
```

**Auto-check**:
- [ ] NO manual tenant_id in QuerySet filters?
- [ ] NO manual company in QuerySet filters?
- [ ] MultitenantMiddleware configured in settings?
- [ ] All models inherit TenantAwareModel?

### 2. Service Layer Delegation (CRITICAL)
**Rule**: ALL business logic in services. Views ONLY handle HTTP (request → service → response).
**Why it matters**: Separation of concerns, testability, reusability, follows SOLID principles.

❌ WRONG - Business logic in ViewSet
```python
class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        # Validation (OK)
        if not request.data.get('email'):
            return Response({'error': 'Email required'}, status=400)

        # Business logic (WRONG!)
        user = User.objects.create(**request.data)
        send_welcome_email(user)  # Business logic!
        create_preferences(user)  # Business logic!

        return Response(UserSerializer(user).data, status=201)
```

✅ CORRECT - Service delegation
```python
class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        serializer = UserInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Delegate to service (single line)
        user = UserService.create_user_with_onboarding(**serializer.validated_data)

        return Response(UserOutputSerializer(user).data, status=201)

# apps/core/services.py
class UserService:
    @staticmethod
    def create_user_with_onboarding(email: str, password: str) -> User:
        user = User.objects.create(email=email, password=make_password(password))
        EmailService.send_welcome_email(user)
        PreferenceService.create_defaults(user)
        return user
```

**Auto-check**:
- [ ] ViewSet methods <10 lines each?
- [ ] ALL business logic in Service class?
- [ ] Service methods have type hints (params + return)?
- [ ] Services use @staticmethod (stateless)?

### 3. Input/Output Serializer Separation
**Rule**: Separate serializers for input validation (Create/Update) and output (Read).
**Why it matters**: Different validation rules, security (don't expose computed fields on input), clear separation of concerns.

❌ WRONG - Single serializer
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # Exposes password hash on read!
```

✅ CORRECT - Separated serializers
```python
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

class UserOutputSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name')
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'created_at']
        read_only_fields = ['id', 'created_at']
```

**Auto-check**:
- [ ] Separate Input/Output serializers?
- [ ] InputSerializer validates only writable fields?
- [ ] OutputSerializer includes computed fields?
- [ ] No sensitive fields in output (password, tokens)?

### 4. pytest-django with AAA Pattern
**Rule**: Tests follow Arrange-Act-Assert, use mocker.Mock() (NOT Mock()), target 100% coverage.
**Why it matters**: Readable tests, proper mocking, comprehensive validation.

❌ WRONG - No structure, Mock() import
```python
from unittest.mock import Mock  # FORBIDDEN in pytest-django!

def test_create_user():
    data = {"email": "test@example.com"}
    response = client.post("/users/", data)
    assert response.status_code == 201  # What are we testing?
```

✅ CORRECT - AAA pattern, mocker fixture
```python
def test_create_user_with_valid_data_succeeds(client, mocker):
    # Arrange
    mock_service = mocker.Mock()
    mock_service.create_user.return_value = User(id=1, email="test@example.com")
    mocker.patch('apps.core.views.user.UserService', mock_service)

    # Act
    response = client.post("/users/", {"email": "test@example.com", "password": "securepass"})

    # Assert
    assert response.status_code == 201
    assert response.json()['email'] == "test@example.com"
    mock_service.create_user.assert_called_once()
```

**Auto-check**:
- [ ] Test uses mocker.Mock() (not Mock())?
- [ ] AAA pattern clearly separated?
- [ ] Descriptive test name (test_<action>_<context>_<expected>)?
- [ ] Coverage >80% for new code?

### 5. Query Optimization with ORM
**Rule**: Always use select_related/prefetch_related, add database indexes, use order_by().
**Why it matters**: N+1 query prevention, performance (<100ms target), predictable ordering.

❌ WRONG - N+1 queries
```python
users = User.objects.all()  # No select_related
for user in users:
    print(user.company.name)  # N+1! One query per user
```

✅ CORRECT - Optimized query
```python
users = User.objects.select_related('company').order_by('created_at')
for user in users:
    print(user.company.name)  # Single JOIN query
```

**Auto-check**:
- [ ] ForeignKey queries use select_related()?
- [ ] ManyToMany queries use prefetch_related()?
- [ ] Filtered fields have database @Index()?
- [ ] QuerySets have explicit order_by()?

## 🚫 Anti-Patterns to PREVENT

### 1. Manual Tenant Filtering (CRITICAL)
❌ ANTI-PATTERN - Manual tenant_id in queries
```python
def get_company_users(company_id):
    return User.objects.filter(tenant_id=company_id)  # FORBIDDEN!
```

✅ CORRECT - Trust middleware
```python
def get_company_users():
    return User.objects.all()  # Middleware filters automatically
```

**Why it matters**: Breaks transparent isolation, security risk (one missed filter = data leak), violates architecture.

### 2. Business Logic in Views/Serializers
❌ ANTI-PATTERN - ViewSet with business logic
```python
class UserViewSet(viewsets.ModelViewSet):
    def perform_create(self, serializer):
        user = serializer.save()
        user.send_welcome_email()  # Business logic!
        cache.set(f'user_{user.id}', user)  # Business logic!
```

✅ CORRECT - Delegate to service
```python
class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        serializer = UserInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.create_user_with_welcome(serializer.validated_data)
        return Response(UserOutputSerializer(user).data, status=201)
```

**Why it matters**: Violates SRP, untestable, non-reusable.

### 3. unittest.mock.Mock() Import
❌ ANTI-PATTERN - Direct Mock import
```python
from unittest.mock import Mock  # FORBIDDEN in pytest-django!
```

✅ CORRECT - Use mocker fixture
```python
def test_something(mocker):
    mock_service = mocker.Mock()  # Use pytest-mock's mocker
```

**Why it matters**: mocker fixture is pytest-django standard, better cleanup.

### 4. N+1 Queries
❌ ANTI-PATTERN - Missing select_related
```python
users = User.objects.all()
for user in users:
    print(user.company.name)  # N queries!
```

✅ CORRECT - Optimized with select_related
```python
users = User.objects.select_related('company')
for user in users:
    print(user.company.name)  # 1 query!
```

**Why it matters**: Performance, database load, slow response times.

### 5. Single Serializer for Read/Write
❌ ANTI-PATTERN - One serializer for everything
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # Security risk!
```

✅ CORRECT - Separated Input/Output
```python
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)

class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']
```

**Why it matters**: Security, validation clarity, separation of concerns.

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] NO manual tenant_id filtering in queries?
- [ ] All business logic in Service layer (not ViewSet)?
- [ ] Separate Input/Output serializers?
- [ ] Tests use mocker.Mock() (not Mock())?
- [ ] 100% test coverage for new code?

### High Priority
- [ ] ViewSet methods delegate to services?
- [ ] Service methods have type hints?
- [ ] Queries use select_related/prefetch_related?
- [ ] Database indexes on filtered fields?
- [ ] Tests follow AAA pattern?

### Medium Priority
- [ ] Serializer field validation (EmailField, URLField)?
- [ ] Permission classes configured?
- [ ] API versioning if needed?
- [ ] Celery tasks for async operations?
- [ ] Logging configured properly?

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Multi-tenant architecture, YOLO comments, service layer |
| `.claude/core/architecture.md` | Service layer pattern, transparent isolation |
| `.claude/core/testing.md` | pytest-django, AAA, mocker.Mock() |
| `apps/core/views/user.py:50-68` | Example ViewSet with service delegation |
| `apps/core/services.py` | Service layer pattern with type hints |
| `apps/core/serializers/user.py` | Input/Output serializer separation |
| `apps/core/tests/user_views_tests.py` | AAA pattern test examples |

## 🎯 Activation Criteria

**Keywords**: "django", "drf", "viewset", "serializer", "model", "service", "multi-tenant", "tenant_id", "middleware", "pytest-django"

**Auto-suggest when**:
- User creates Django model/ViewSet/Serializer
- User mentions multi-tenant architecture
- User implements business logic
- User writes tests
- User discusses database queries
```

---

## Usage Tips

### Selecting the Right Template

1. **Identify primary domain**: Backend, Frontend, Testing, ML, Database
2. **Check tech stack**: Django/DRF → Template F, React → Template A, etc.
3. **Consider secondary concerns**: Backend + Database → Template F + sections from E
4. **Use Quick Mode**: If rapid prototyping, skip some validation steps
5. **Skill dependencies**: Template F may depend on Template C (testing) and E (database)

### Adapting Templates to Your Project

1. **Replace placeholders**: Use actual project paths, class names, patterns
2. **Add project-specific examples**: Reference real files from your codebase
3. **Customize validation**: Add project-specific checklist items
4. **Link to docs**: Reference your CLAUDE.md, ARCHITECTURE.md, etc.
5. **Iterate**: First version rarely perfect, use Gap Analysis to improve

---

**Last Updated**: 2025-01-13
**Version**: 2.0.0
**Templates**: 6 (A-F)
