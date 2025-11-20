# Binora Backend - Análisis Exhaustivo

**Propósito**: Entender PROFUNDAMENTE qué es binora-backend, cómo funciona, qué necesita, y cómo debería actuar Claude Code para maximizar su efectividad.

**Fecha**: Noviembre 18, 2024
**Fuente**: `/Users/oriol/Desktop/Bjumper/REPOSITORIOS/PYTHON/binora-backend`

---

## 1️⃣ ¿QUÉ ES BINORA BACKEND?

### Resumen Ejecutivo

**Binora Backend** es un sistema backend robusto, escalable y seguro construido con:
- **Django 5.0** + **Django REST Framework 3.14** (API REST)
- **PostgreSQL** (Base de datos relacional)
- **Python 3.13** (Lenguaje)
- **Multi-tenant** con aislamiento transparente por subdominios

**Propósito**: Proporcionar una infraestructura de API escalable y segura para el proyecto Binora, que es un sistema complejo de gestión de recursos, jerarquías y procesos.

**Escala/Impacto**:
- Sistema multi-tenant que sirve a múltiples empresas (clientes) desde el mismo codebase
- API REST completa con autenticación JWT
- 100% test coverage (cobertura de pruebas obligatoria)
- Documentación OpenAPI (contract)

---

## 2️⃣ STACK TÉCNICO COMPLETO

### Frameworks & Librerías Core

```
Django 5.0.x              # Framework web
Django REST Framework     # API REST
PostgreSQL                # Base de datos
```

### Autenticación & Permisos

```
djangorestframework-simplejwt  # JWT tokens
django-guardian               # Object-level permissions (granular)
django-cors-headers          # CORS handling
```

### Utilidades & Herramientas

```
Black                    # Code formatting (auto)
flake8                   # Linting
mypy                     # Type checking
pytest                   # Testing framework
pytest-django           # Django integration para pytest
hypothesis              # Property-based testing
factory-boy             # Test fixtures
faker                   # Mock data generation
django-filter           # Query filtering
django-extensions       # Management commands extra
```

### DevOps & Deployment

```
Gunicorn                # WSGI server (production)
Uvicorn                 # ASGI server (async)
Docker                  # Containerización
docker-compose          # Multi-container orchestration
```

### Almacenamiento & Archivos

```
boto3                   # AWS SDK (S3)
django-storages         # Almacenamiento en S3
```

### Otros

```
nox                     # Automatización de tareas
pre-commit             # Git hooks para validación
```

### Versión Python

```
Python 3.13             # REQUERIDO (Docker usa 3.13)
```

---

## 3️⃣ ARQUITECTURA - MULTI-TENANT

### Concepto Fundamental: Aislamiento Transparente por Middleware

La arquitectura multi-tenant de binora funciona de manera **completamente transparente**:

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO ACCEDE POR SUBDOMAIN                                │
├─────────────────────────────────────────────────────────────┤
│ https://main.binora.es      (MAIN INSTANCE - Sin tenant)    │
│ https://acme.binora.es      (TENANT 1 - Empresa ACME)       │
│ https://globex.binora.es    (TENANT 2 - Empresa GLOBEX)     │
└─────────────────────────────────────────────────────────────┘
                            ↓
                   [Middleware]
                   Detecta subdomain
                   Inyecta tenant_id
                            ↓
        ┌───────────────────────────────────────┐
        │ MISMO CÓDIGO PARA TODOS               │
        │ (aplicación es tenant-agnostic)       │
        │                                       │
        │ User.objects.filter(email=...)        │
        │ → Middleware agrega tenant_id         │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │ DATOS AISLADOS AUTOMÁTICAMENTE        │
        │                                       │
        │ - ACME ve solo sus datos              │
        │ - GLOBEX ve solo sus datos            │
        │ - MAIN ve TODOS los datos             │
        └───────────────────────────────────────┘
```

### Instancias de Servicio

| Tipo | Puerto | TENANT | Visibilidad | Rol |
|------|--------|--------|-------------|-----|
| **MAIN** | 8000 | None | TODOS los datos | JWT generation, admin |
| **TENANT** | 8001+ | "subdomain" | Solo tenant_data | Cliente final |

### Punto Crítico: Middleware Maneja TODO

```python
# ❌ NUNCA HACER ESTO:
User.objects.filter(tenant_id=company.id, email=email)

# ✅ SIEMPRE HACER ESTO:
User.objects.filter(email=email)  # Middleware agrega tenant_id automáticamente
```

**Por qué es crítico**:
- Si agregas tenant_id manualmente, puedes romper el aislamiento
- El middleware es confiable y está probado
- Duplicar lógica = riesgo de inconsistencias

---

## 4️⃣ ESTRUCTURA DEL PROYECTO

```
binora-backend/
├── binora/                      # Configuración del proyecto
│   ├── settings.py              # Configuración Django
│   ├── urls.py                  # Rutas principales
│   ├── middleware.py            # MultitenantMiddleware (CRÍTICO)
│   ├── wsgi.py / asgi.py        # Entry points
│
├── apps/                         # Aplicaciones Django
│   ├── core/                     # Autenticación, usuarios, permisos
│   ├── assets/                   # Gestión de activos
│   ├── hierarchy/                # Estructura de datacenters
│   ├── library/                  # Gestión de documentos
│   ├── processes/                # Workflows de procesos
│   ├── frontend/                 # Utilidades frontend
│   └── namingconventions/        # Convenciones de nombres
│
├── .claude/                     # Configuración de Claude Code
│   ├── skills/                  # 11 skills especializados
│   ├── agents/                  # 10 agents especializados
│   ├── commands/                # 7 comandos especializados
│   ├── core/                    # Documentación core
│   └── [otros]
│
├── CLAUDE.md                    # Instrucciones para Claude Code
├── conftest.py                  # Configuración pytest
├── manage.py                    # Django CLI
├── noxfile.py                   # Automatización de tareas
├── docker-compose.yaml          # Composición de servicios
└── Dockerfile                   # Imagen Docker
```

### Apps Principales - Responsabilidades

| App | Responsabilidad | Modelos | Tests |
|-----|-----------------|---------|-------|
| **core** | Autenticación, usuarios, empresas, equipos, permisos, email | User, Company, Team, CompanyUser | 100% |
| **assets** | CRUD de activos (máquinas, equipos) | Asset | 100% |
| **hierarchy** | Estructura física (datacenters, rooms, rows, racks) | Datacenter, Room, Row, Rack | 100% |
| **library** | Gestión de documentos con upload | Document | 100% |
| **processes** | Workflows y procesos | Process, ProcessType | 100% |
| **frontend** | Generación de permisos desde OpenAPI | FrontendPermissions | 100% |

---

## 5️⃣ PATRÓN DE 3 CAPAS (OBLIGATORIO)

### Principio: Separación Estricta de Responsabilidades

```
┌──────────────────────────────────────────────────────────┐
│ VIEWS (HTTP ONLY)                                        │
│ - Recibe request                                         │
│ - Valida formato (serializer)                            │
│ - DELEGA a service                                       │
│ - Retorna response                                       │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│ SERVICES (ALL BUSINESS LOGIC)                            │
│ - Ejecuta lógica de negocio                              │
│ - Valida datos (no HTTP)                                 │
│ - Maneja transacciones                                   │
│ - Llamadas a externos (email, etc)                       │
│ - Usa dependency injection                               │
│ - Type hints OBLIGATORIOS                                │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│ MODELS (DATA STRUCTURES ONLY)                            │
│ - Define estructura de datos                             │
│ - Validators básicos del ORM                             │
│ - SIN lógica de negocio                                  │
└──────────────────────────────────────────────────────────┘
```

### Ejemplo Real - Crear Usuario

```python
# ❌ INCORRECTO (lógica en view)
class UserViewSet(ViewSet):
    def create(self, request):
        user = User.objects.create(**request.data)
        send_welcome_email(user)  # LÓGICA EN VIEW
        return Response(UserSerializer(user).data)

# ✅ CORRECTO (lógica en service)
class UserViewSet(ViewSet):
    def create(self, request):
        serializer = UserInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = UserService.create_user(
            email=serializer.validated_data['email'],
            name=serializer.validated_data['name']
        )
        return Response(UserOutputSerializer(user).data)

# Service layer
class UserService:
    @staticmethod
    def create_user(email: str, name: str) -> User:
        user = User.objects.create(email=email, name=name)
        EmailService.send_welcome(user)  # AQUÍ va la lógica
        return user
```

---

## 6️⃣ TESTING - 100% COVERAGE OBLIGATORIO

### Requisitos Estrictos

| Aspecto | Requisito |
|---------|-----------|
| **Cobertura** | 100% por archivo |
| **Pattern** | AAA (Arrange, Act, Assert) |
| **Archivos** | `*_tests.py` (no test_*.py) |
| **Nombres** | `test_<action>_<context>_<expected>` |
| **Mocking** | `mocker.Mock()` (NUNCA `Mock()`) |
| **Docstrings** | CERO (código self-explanatory) |
| **Fixtures** | `conftest.py` para compartidas |

### Ejemplo de Test Correcto

```python
def test_create_user_with_valid_email_succeeds(mocker):
    # Arrange
    data = {'email': 'test@example.com', 'name': 'Test User'}
    mock_send = mocker.patch('apps.core.services.EmailService.send_welcome')

    # Act
    user = UserService.create_user(**data)

    # Assert
    assert user.email == data['email']
    assert user.name == data['name']
    mock_send.assert_called_once_with(user)
```

### Fixture Scopes

```python
@pytest.fixture(scope="session")
def reference_data():
    """Datos inmutables: reference lists, constants"""
    return {"statuses": ["active", "inactive"]}

@pytest.fixture(scope="function")
def user_data():
    """Datos mutables: requiere aislamiento"""
    return {'email': f'test_{random()}@example.com'}

@pytest.fixture(scope="module")
def expensive_setup():
    """Setup costoso: base de datos seeding"""
    return setup_complex_data()
```

---

## 7️⃣ REGLAS CRÍTICAS (FORBIDDEN & REQUIRED)

### ❌ FORBIDDEN (Violaciones Críticas)

| Regla | Violación | Consequence |
|-------|-----------|-------------|
| **Manual tenant_id** | `User.objects.filter(tenant_id=...)` | Rompe aislamiento multi-tenant |
| **Logic en views** | `user.save(); send_email()` en ViewSet | Desorden arquitectónico |
| **Mock sin mocker** | `from unittest.mock import Mock` | Incompatible con pytest |
| **Comments en tests** | `# Create user` en test | Reduce legibilidad |
| **Docstrings en tests** | `"""Test that..."""` | CERO permitidas |
| **.md sin pedir** | Crear README, SUMMARY.md unsolicited | Noise innecesario |

### ✅ REQUIRED (Obligatorios)

| Regla | Aplicación | Razón |
|-------|-----------|-------|
| **Type hints** | ALL functions | Seguridad, IDE support |
| **Service layer** | ALL business logic | Separación de concerns |
| **AAA pattern** | ALL tests | Claridad |
| **100% coverage** | Per file | Confianza en código |
| **Query optimization** | select_related, prefetch | Performance |
| **English only** | Comments, code | Internacionalización |
| **Check existing patterns** | Before creating new | DRY principle |

---

## 8️⃣ ESTILO DE PROGRAMACIÓN & CONVENCIONES

### Type Hints (Obligatorio)

```python
# ❌ SIN TYPE HINTS
def create_user(email, name):
    return User.objects.create(email=email, name=name)

# ✅ CON TYPE HINTS
def create_user(email: str, name: str) -> User:
    return User.objects.create(email=email, name=name)

# Más complejo
from typing import Optional, List, QuerySet

def filter_users(
    email: Optional[str] = None,
    active: bool = True
) -> QuerySet[User]:
    qs = User.objects.all()
    if email:
        qs = qs.filter(email=email)
    if not active:
        qs = qs.filter(is_active=False)
    return qs
```

### Imports Organization

```python
# Standard library
import json
import os
from typing import Dict, List

# Third-party
import pytest
from django.db import models
from rest_framework import serializers

# Local
from apps.core.models import User
from apps.core.services import UserService
```

### Naming Conventions

```python
# Classes: PascalCase
class UserService:
    pass

# Functions/variables: snake_case
def create_user(email: str) -> User:
    return User.objects.create(email=email)

# Constants: UPPER_CASE
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30

# Private: _leading_underscore
def _format_email(email: str) -> str:
    return email.lower().strip()

# Test names: descriptive
def test_create_user_with_valid_email_succeeds():
    pass

def test_create_user_with_invalid_email_raises_error():
    pass
```

### YOLO Comments Philosophy

```python
# ❌ COMENTARIOS OBVIOS (NO permitidos)
def test_user_creation():
    # Create user data
    data = {'email': 'test@example.com'}
    # Create user
    user = User.objects.create(**data)
    # Assert user exists
    assert user.pk is not None

# ✅ SELF-EXPLANATORY (Code speaks for itself)
def test_user_creation():
    data = {'email': 'test@example.com'}
    user = User.objects.create(**data)
    assert user.pk is not None

# ✅ COMMENT SOLO SI NO-OBVIOUS
def _validate_password_strength(password: str) -> bool:
    # NIST guidelines: min 8 chars, entropy check required
    # See: https://pages.nist.gov/800-63-3/sp800-63b.html
    return len(password) >= 8 and entropy_check(password)
```

---

## 9️⃣ CONFIGURACIÓN DE CLAUDE CODE EN BINORA

### 11 Skills (Auto-Activation)

| Skill | Triggers | Enforces |
|-------|----------|----------|
| `multi-tenant-guardian` | tenant_id, filter, company | NEVER manual tenant_id |
| `django-architecture-enforcer` | service, ViewSet | Logic in services |
| `drf-serializer-patterns` | serializer, validation | Input/output separation |
| `django-query-optimizer` | query, select_related | Query optimization |
| `django-testing-patterns` | test, pytest, coverage | 100% coverage, AAA |
| `code-style-enforcer` | type hint, comment | Type hints, YOLO |
| `postgresql-performance` | index, migration | Proper indexing |
| `openapi-contract-validator` | OpenAPI, endpoint | Contract compliance |
| `github-pr-reviewer` | PR, pull request | PR standards |
| `claude-code-performance-optimizer` | performance, parallel | Optimization |
| `prompt-engineer` | prompt quality | Prompt enhancement |

### 10 Agents (Manual Invocation)

| Agent | Use | Result |
|-------|-----|--------|
| `feature-planner` | Plan new features | Plan + architecture |
| `django-test-generator` | Generate tests | 100% coverage tests |
| `service-layer-generator` | Generate services | Business logic layer |
| `django-codebase-auditor` | Review code | Quality report |
| `performance-analyzer` | Profile performance | Bottleneck analysis |
| `contract-compliance-validator` | Validate API | OpenAPI compliance |
| `multi-tenant-enforcer` | Scan violations | Tenant violation report |
| `security-auditor` | Security check | Vulnerability report |
| `pre-commit-guardian` | Pre-commit validation | Validation report |
| `deployment-checker` | Pre-deployment check | Readiness report |

### 7 Commands (Slash Commands)

```bash
/quick-audit [path]         # Fast check (30s)
/check-tenant [path]        # Multi-tenant scan (1 min)
/check-contract [app]       # OpenAPI validation (1-2 min)
/query-analysis [path]      # Query optimization (1-2 min)
/coverage [path]            # Coverage analysis (1 min)
/setup-tenant <subdomain>   # Create tenant (3-5 min)
/create-pr [branch]         # PR creation (3-5 min)
```

### Extended Thinking Configuration

```json
{
  "MAX_THINKING_TOKENS": 8192,
  "AUTO_ENABLE_FOR_COMPLEXITY": "high"
}
```

**Beneficios**:
- 40% mejor razonamiento
- Mejor para problemas complejos
- Automático para tareas complejas

### Hooks Configuration

```json
{
  "PostToolUse": "Auto-format with black after file edit",
  "PreToolUse": "Can block sensitive file modifications"
}
```

**Beneficios**:
- Zero manual formatting
- 3-5x faster workflow
- Automatic validation

---

## 🔟 FLUJOS DE TRABAJO TÍPICOS

### Feature Development (Nuevo Feature)

```
1. Plan:       feature-planner agent
2. Model:      Create models + migrations
3. Service:    Implement business logic
4. Serializer: Input/output serializers
5. ViewSet:    HTTP handling (delegate to service)
6. Tests:      django-test-generator (100% coverage)
7. Review:     django-codebase-auditor
8. Validate:   /quick-audit + pre-commit-guardian
9. Deploy:     deployment-checker
10. PR:        /create-pr
```

### Bug Fixing (Arreglar Bug)

```
1. Locate:     Read code + stack trace (bottom-up)
2. Diagnose:   Identify root cause
3. Fix:        Apply fix to service/model
4. Test:       Run tests (must still pass)
5. Validate:   /quick-audit on changed files
6. Commit:     pre-commit hooks verify
7. PR:         Create PR with fix
```

### Query Optimization

```
1. Identify:   performance-analyzer detects N+1
2. Profile:    /query-analysis on app
3. Optimize:   Add select_related/prefetch_related
4. Validate:   Re-run tests (coverage still 100%)
5. Benchmark:  Compare before/after
```

---

## 1️⃣1️⃣ NECESIDADES ESPECÍFICAS DE BINORA

### Lo que hace ESPECIAL a Binora

1. **Multi-tenant transparency**: NUNCA agregar tenant_id manualmente
2. **100% coverage mandatory**: No "bueno suficiente"
3. **YOLO comments**: Self-explanatory code
4. **Type safety**: TODAS las functions
5. **Service layer strict**: CERO logic en views
6. **AAA tests**: Structured, clear, maintainable

### Lo que NO puede violar

- ❌ Manual tenant_id filtering (ROMPE aislamiento)
- ❌ Business logic en views (ARQUITECTURA)
- ❌ < 100% coverage (CONFIANZA)
- ❌ Sin type hints (SEGURIDAD)
- ❌ Copy-paste code (MANTENIBILIDAD)

### Lo que debe preservar

- ✅ Multi-tenant pattern
- ✅ Service layer architecture
- ✅ Testing framework (pytest)
- ✅ OpenAPI contract integration
- ✅ Permission system (django-guardian)
- ✅ JWT authentication

---

## 1️⃣2️⃣ CÓMO DEBERÍA ACTUAR CLAUDE CODE EN BINORA

### Rol Fundamental

Claude Code debería ser un **experto Django backend especializado en multi-tenant** que:

1. **Enforces**: Las 11 skills auto-activan y guían
2. **Generates**: Agents crean código binora-compliant
3. **Validates**: Commands verifican calidad
4. **Questions**: Pregunta antes de asumir
5. **Reuses**: Busca patterns en apps/core/
6. **Optimizes**: Paralleliza, usa MCPs, ahorra tokens

### Comportamiento Esperado

```
Usuario: "Crear endpoint de usuarios"
         ↓
    [Skills auto-activate]
         ↓
Claude: "Planearé usando feature-planner..."
        "1. Model + migrations"
        "2. Service layer (con DI)"
        "3. Input/Output serializers"
        "4. ViewSet (delegación)"
        "5. Tests (100% coverage)"
         ↓
    [Genera código]
         ↓
Claude: "Validando con multi-tenant-guardian..."
        "Verificando architecture..."
        "Ejecutando /quick-audit..."
         ↓
    [Código validado]
         ↓
Claude: "Ready! Ejecutar: nox -s test para validar cobertura"
```

---

## 1️⃣3️⃣ SÍNTESIS: QUÉ NECESITA PONEGLYPH

Para reemplazar/mejorar Poneglyph y hacerlo especializado en Binora, Poneglyph necesita:

### 1. Entendimiento Profundo
- ✅ Multi-tenant architecture y middleware
- ✅ 3-layer pattern (View → Service → Model)
- ✅ 100% test coverage requirement
- ✅ YOLO comments philosophy
- ✅ Type hints obligatorio

### 2. Configuración Claude Code
- ✅ 11 skills de binora
- ✅ 10 agents de binora
- ✅ 7 comandos de binora
- ✅ Extended thinking para complejidad
- ✅ Hooks para auto-formatting

### 3. Acceso a Patrones
- ✅ Referencia a apps/core/ para ejemplos
- ✅ Archivos de configuración (settings, conftest)
- ✅ Estructura de fixtures
- ✅ MCPs para búsqueda semántica

### 4. Capacidad de Validación
- ✅ Detectar violaciones (tenant_id manual)
- ✅ Verificar cobertura
- ✅ Validar estructura (3-layer)
- ✅ Type hint checking

### 5. Autonomía Inteligente
- ✅ Usar agents para generación
- ✅ Confiar en skills para enforcement
- ✅ Preguntar cuando sea ambiguo (<70% confidence)
- ✅ Reuser patterns, NO inventar

---

## SIGUIENTE PASO

Con este análisis exhaustivo completado, el próximo paso es:

**CREAR UN PLAN DE ADAPTACIÓN INTELIGENTE**

Que defina:
1. ¿Qué trae de binora? (skills, agents, conocimiento)
2. ¿Qué adaptar? (configuración, patrones)
3. ¿Qué mejorar? (performance, nuevas capacidades)
4. ¿Qué no duplicar? (mantener lo valioso de Poneglyph)

---

**Estado**: Análisis EXHAUSTIVO Completado ✅
**Próximo**: Plan de Adaptación Inteligente
**Objetivo Final**: Poneglyph especializado en Binora Backend (mejor programador, más rápido, más efectivo)