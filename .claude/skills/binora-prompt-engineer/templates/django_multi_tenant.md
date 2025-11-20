# Django Multi-Tenant Template - Binora Backend

Tech-specific examples and patterns for Django 5.0 + DRF 3.14 multi-tenant architecture.

---

## 🔧 Tech Stack (Binora Backend)

**Framework**: Django 5.0, Django REST Framework 3.14
**Database**: PostgreSQL 14+
**Python**: 3.13
**Testing**: pytest-django, 100% coverage target
**Architecture**: Multi-tenant (subdomain-based) with transparent middleware isolation
**Patterns**: Service layer, Dependency Injection, AAA testing

---

## 🚨 CRITICAL Multi-Tenant Rules

### Rule #1: NEVER Manual tenant_id Filtering

**The #1 CRITICAL violation in Binora Backend**

❌ **FORBIDDEN - CRITICAL VIOLATION**
```python
# NEVER add tenant_id manually to queries
User.objects.filter(tenant_id=company.id, email=email)
Asset.objects.filter(tenant_id=request.user.company_id, status="active")
```

✅ **CORRECT - Trust Middleware**
```python
# Middleware adds tenant_id automatically for transparent isolation
User.objects.filter(email=email)
Asset.objects.filter(status="active")
```

**Why**: Breaks transparent isolation principle. `MultitenantMiddleware` (binora/middleware.py) handles ALL tenant filtering automatically.

**Detection**: Use `/check-tenant` command or `multi-tenant-enforcer` agent.

**Reference**: `.claude/core/forbidden.md`, `CLAUDE.md` lines 30-33

---

### Rule #2: ALL Business Logic in Services

❌ **FORBIDDEN - Logic in ViewSet**
```python
class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        user = User(
            email=request.data['email'],
            first_name=request.data['first_name']
        )
        user.set_password(generate_random_password())  # Business logic
        user.save()
        send_welcome_email(user)  # Business logic
        return Response(UserSerializer(user).data)
```

✅ **CORRECT - Delegate to Service**
```python
class UserViewSet(viewsets.ModelViewSet):
    auth_service = AuthService()  # Dependency injection

    def perform_create(self, serializer):
        # ViewSet only handles HTTP, delegates business logic
        serializer.instance = self.auth_service.create_user(
            User(**serializer.validated_data)
        )
```

**Real Example**: `apps/core/views/auth.py:64-65` (UserViewSet.perform_create)

**Service Implementation**: `apps/core/services.py:48-54` (AuthService.create_user)
```python
class AuthService:
    def __init__(
        self,
        users_repository=User.objects,
        email_helper=EmailHelper,
        validation_function=validate_password,
        # ... dependency injection
    ):
        self.users_repository = users_repository
        self.email_helper = email_helper
        # ...

    def create_user(self, user: User) -> User:
        temp_password = generate_random_password()
        user.set_password(temp_password)
        user.force_password_change = True
        user.save()
        self.email_helper.send_user_created_email(user, temp_password, timezone.now())
        return user
```

**Why**: Service layer pattern. Views = HTTP only, Services = business logic.

---

### Rule #3: mocker.Mock() NOT Mock()

❌ **FORBIDDEN - Direct Mock Import**
```python
from unittest.mock import Mock

def test_email_service():
    mock = Mock()  # FORBIDDEN
```

✅ **CORRECT - Use mocker Fixture**
```python
def test_email_service_sends_email(mocker):
    mock_helper = mocker.Mock(spec=EmailHelper)
    service = AuthService(email_helper=mock_helper)

    service.create_user(user)

    mock_helper.send_user_created_email.assert_called_once()
```

**Why**: Project uses pytest-mock. Direct Mock import breaks patterns.

**Reference**: `.claude/core/forbidden.md` lines 58-76

---

## 📁 File Structure (Binora Backend)

```
binora-backend/
├── apps/
│   ├── core/          # Authentication, users, companies, teams, permissions
│   │   ├── models.py
│   │   ├── views/
│   │   │   └── auth.py       # UserViewSet, CompanyViewSet
│   │   ├── serializers/
│   │   │   └── auth.py       # UserSerializer, CompanySerializer
│   │   ├── services.py       # AuthService (business logic)
│   │   ├── tests/
│   │   │   └── user_views_tests.py
│   │   └── utils/
│   │       └── auth/         # Authentication backends
│   ├── assets/        # Asset management
│   ├── hierarchy/     # Datacenter structure (datacenters → rooms → rows → racks)
│   ├── library/       # Document management
│   ├── processes/     # Process workflows
│   └── frontend/      # Frontend utilities, permission generation
├── binora/
│   ├── settings.py    # Django configuration
│   └── middleware.py  # MultitenantMiddleware (CRITICAL for tenant isolation)
├── CLAUDE.md          # AI instructions, architecture, forbidden patterns
└── .claude/
    └── core/
        ├── architecture.md
        └── forbidden.md
```

---

## 🎯 Example Prompts (Bilingual)

### Example 1: Fix Failing Tests

**User Input (Spanish)**: "Arregla los tests de usuarios"

**Score**: 22/100 (no files, no context, vague)

**Enhanced (Spanish with XML)**:
```xml
<tarea>Corregir 3 tests fallidos en UserViewSet.create()</tarea>

<contexto>
  <archivo>apps/core/tests/user_views_tests.py</archivo>
  <tests_fallidos>
    - test_create_user_with_invalid_email (línea 45)
    - test_create_user_without_company (línea 67)
    - test_create_user_duplicate_email (línea 89)
  </tests_fallidos>
  <tech_stack>Django 5.0, DRF 3.14, pytest-django 4.5</tech_stack>
  <error>AssertionError: Expected 400, got 500 for invalid email</error>
  <patrón>AAA (Arrange-Act-Assert), mocker.Mock() not Mock()</patrón>
  <prohibido>NEVER manual tenant_id filtering</prohibido>
</contexto>

<instrucciones>
1. Ejecutar: pytest apps/core/tests/user_views_tests.py::test_create_user_with_invalid_email -v
2. Identificar causa raíz: error de validación no capturado en serializer
3. Actualizar UserInputSerializer para validar formato de email
4. Re-ejecutar los 3 tests: pytest apps/core/tests/user_views_tests.py -k "test_create_user" -v
5. Verificar coverage mantenido: pytest --cov=apps.core.views apps/core/tests/ --cov-report=term-missing
6. Target: 100% coverage, todos los tests verdes
</instrucciones>

<formato_salida>
  <fix>Cambios en UserInputSerializer con validación de email</fix>
  <tests>Output de pytest mostrando 3/3 pasando</tests>
  <coverage>Reporte de coverage mostrando 100%</coverage>
</formato_salida>
```

**Score**: 88/100 ✅

---

### Example 2: Optimize Database Query

**User Input (English)**: "Optimize the user list endpoint"

**Score**: 30/100 (no file, no metrics, vague)

**Enhanced (English with XML)**:
```xml
<task>Optimize N+1 query in UserViewSet.list() causing 2.5s response time</task>

<context>
  <file>apps/core/views/auth.py:48</file>
  <current_code>
    queryset = User.objects.order_by("email")  # Missing select_related
  </current_code>
  <performance_issue>
    - Current: 501 queries (1 initial + 500 for companies)
    - Response time: 2.5s for 500 users
    - Target: <200ms
  </performance_issue>
  <tech_stack>Django 5.0, DRF 3.14, PostgreSQL 14</tech_stack>
  <forbidden>NEVER add .filter(tenant_id=X) - middleware handles isolation</forbidden>
</context>

<instructions>
1. Add select_related('company') to queryset in apps/core/views/auth.py:48
2. Verify with Django Debug Toolbar: queries reduce from 501 to 1
3. Benchmark response time: curl -w "%{time_total}\n" http://localhost:8000/api/users/
4. Run tests to ensure no regressions: pytest apps/core/tests/user_views_tests.py -v
5. Verify coverage maintained: pytest --cov=apps.core.views --cov-report=term-missing
6. Target: <200ms response time, 100% coverage
</instructions>

<output_format>
  <optimized_query>
    queryset = User.objects.select_related('company').order_by("email")
  </optimized_query>
  <queries_before>501 queries (2.5s)</queries_before>
  <queries_after>1 query (<200ms)</queries_after>
  <tests>All tests passing, 100% coverage</tests>
</output_format>
```

**Score**: 90/100 ✅

---

### Example 3: Implement Service Layer

**User Input (Spanish)**: "Necesito crear un servicio para gestionar assets"

**Score**: 35/100 (no pattern, no file structure, vague)

**Enhanced (Spanish with XML)**:
```xml
<tarea>Implementar AssetService con lógica de negocio para creación y asignación de assets</tarea>

<contexto>
  <proyecto>Binora Backend - Django 5.0 + DRF 3.14 multi-tenant</proyecto>
  <requisitos>
    - Crear asset con validación de unicidad (serial_number único por tenant)
    - Asignar asset a datacenter/rack con validación de capacidad
    - Enviar email de notificación al administrador
    - Audit logging de operaciones
  </requisitos>
  <archivos_afectados>
    - apps/assets/services.py (nuevo archivo)
    - apps/assets/views/assets.py (delegar a service)
    - apps/assets/models.py (Asset model existente)
    - apps/assets/tests/asset_service_tests.py (nuevo archivo)
  </archivos_afectados>
  <patrón>Service layer con dependency injection (AuthService en apps/core/services.py:32-54)</patrón>
  <prohibido>CRITICAL: NEVER manual tenant_id filtering - middleware maneja aislamiento</prohibido>
</contexto>

<instrucciones>
Pensar paso a paso en tags <pensamiento>:

<pensamiento>
1. Analizar AuthService pattern:
   - Constructor con DI: __init__(users_repository=User.objects, email_helper=EmailHelper, ...)
   - Type hints en todos los métodos: def create_user(self, user: User) -> User
   - Sin estado, solo métodos de lógica de negocio
   - Delega a repositories/helpers inyectados

2. Diseñar AssetService:
   - Inyectar: assets_repository=Asset.objects, email_helper=EmailHelper
   - Métodos:
     * create_asset(asset_data: dict) -> Asset
     * assign_asset_to_location(asset: Asset, location: Rack) -> Asset
     * validate_serial_uniqueness(serial: str) -> bool
   - NO añadir tenant_id manualmente (middleware lo maneja)

3. ViewSet delegation:
   - apps/assets/views/assets.py:
     * asset_service = AssetService()  # Inyección simple
     * perform_create(serializer): asset_service.create_asset(serializer.validated_data)
   - Similar a UserViewSet.perform_create (apps/core/views/auth.py:64-65)

4. Testing strategy:
   - Mock dependencies: mocker.Mock(spec=EmailHelper)
   - Test service isolation: AssetService(assets_repository=mock, email_helper=mock)
   - AAA pattern: Arrange (data), Act (service.create_asset), Assert (mock.assert_called)
   - NO usar from unittest.mock import Mock (FORBIDDEN)
</pensamiento>

Ahora implementar el servicio siguiendo este análisis y el patrón de AuthService.
</instrucciones>

<formato_salida>
  <servicio>apps/assets/services.py - Clase AssetService completa</servicio>
  <viewset>apps/assets/views/assets.py - Cambios para delegar a service</viewset>
  <tests>apps/assets/tests/asset_service_tests.py - Tests con 100% coverage</tests>
  <ejemplos>
    <creacion>Ejemplo de uso: asset_service.create_asset(data)</creacion>
    <asignacion>Ejemplo de uso: asset_service.assign_asset_to_location(asset, rack)</asignacion>
  </ejemplos>
</formato_salida>
```

**Score**: 92/100 ✅

---

## 🧪 Testing Patterns (Binora)

### AAA Pattern (Mandatory)

```python
def test_create_user_sets_email_correctly():
    # Arrange
    email = "test@example.com"
    user_data = {"email": email, "first_name": "Test"}

    # Act
    user = User.objects.create(**user_data)

    # Assert
    assert user.email == email
```

### Mocker Fixture (Mandatory)

```python
def test_create_user_sends_email(mocker):
    # Arrange
    mock_helper = mocker.Mock(spec=EmailHelper)
    service = AuthService(email_helper=mock_helper)
    user = User(email="test@example.com")

    # Act
    service.create_user(user)

    # Assert
    mock_helper.send_user_created_email.assert_called_once()
```

### Multi-Tenant Testing

```python
def test_user_list_filters_by_tenant_automatically(auth_client, user):
    # Arrange
    # Middleware handles tenant filtering - no manual tenant_id

    # Act
    response = auth_client.get('/api/users/')

    # Assert
    assert response.status_code == 200
    # Only current tenant's users returned (middleware isolated)
    assert len(response.data) == 1
```

**Reference**: `apps/core/tests/` for complete examples

---

## ✅ Validation Checklist (Django Multi-Tenant)

**CRITICAL (Must Check)**:
- [ ] NO manual tenant_id filtering anywhere
- [ ] ALL business logic in services (not views/serializers)
- [ ] Uses mocker.Mock() (NOT from unittest.mock import Mock)
- [ ] Type hints on all function parameters and returns
- [ ] Queryset has order_by() to avoid non-deterministic ordering

**HIGH Priority**:
- [ ] Service layer uses dependency injection pattern
- [ ] ViewSets delegate to services via perform_create/perform_update
- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Tests use mocker fixture for mocking
- [ ] Coverage 100% per file (verify with pytest --cov)

**MEDIUM Priority**:
- [ ] Query optimization: select_related() for ForeignKey, prefetch_related() for M2M
- [ ] No N+1 queries (verify with Django Debug Toolbar)
- [ ] English-only comments (or no comments - YOLO philosophy)
- [ ] Follow naming conventions from apps/core/ examples

**Commands**:
- Lint: `nox -s lint`
- Type check: `nox -s types_check`
- Tests: `nox -s test` or `pytest apps/core/tests/ -v`
- Coverage: `pytest --cov=apps.core apps/core/tests/ --cov-report=term-missing`
- Format: `nox -s format` (auto-runs via hooks)
- Multi-tenant check: `/check-tenant apps/core/views/`

---

## 📚 References

**Architecture**: `CLAUDE.md` lines 79-99 (Multi-Tenant Pattern)
**Forbidden Patterns**: `.claude/core/forbidden.md`
**Service Example**: `apps/core/services.py:32-54` (AuthService)
**ViewSet Example**: `apps/core/views/auth.py:43-100` (UserViewSet)
**Testing Example**: `apps/core/tests/` (all test files)

---

**Version**: 2.0.0 (Binora Backend-specific)
**Tech Stack**: Django 5.0, DRF 3.14, PostgreSQL 14, Python 3.13
**CRITICAL**: Multi-tenant middleware isolation - NEVER manual tenant_id
