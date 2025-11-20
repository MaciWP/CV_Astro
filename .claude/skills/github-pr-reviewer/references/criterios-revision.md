# Los 11 Criterios de Revisión de PR

Referencia completa de los 11 criterios estrictos para revisión de código en Binora Backend.

---

## 📊 Tabla de Resumen

| # | Criterio | Severidad | Agente | Blocking |
|---|----------|-----------|--------|----------|
| 1 | Separación Input/Output serializers | issue | django-codebase-auditor | ✅ Sí |
| 2 | Lógica de negocio en servicios | issue | django-codebase-auditor | ✅ Sí |
| 3 | Type hints obligatorios | issue | django-codebase-auditor | ✅ Sí |
| 4 | Tests con patrón AAA | issue | django-codebase-auditor | ✅ Sí |
| 5 | Coverage 100% | issue | django-codebase-auditor | ✅ Sí |
| 6 | NO filtrado manual de tenant_id | issue | multi-tenant-enforcer | ✅ Sí (CRÍTICO P0) |
| 7 | Queries optimizados | suggestion | performance-analyzer | ❌ No |
| 8 | Comentarios en inglés (YOLO) | suggestion | django-codebase-auditor | ❌ No |
| 9 | Tests sin docstrings | issue | django-codebase-auditor | ✅ Sí |
| 10 | Guía de estilo del proyecto | suggestion | django-codebase-auditor | ❌ No |
| 11 | Validar contrato OpenAPI | issue | contract-compliance-validator | ✅ Sí |

---

## Criterio 1: Separación Input/Output en Serializers

### 📋 Descripción
Los serializers DRF deben separarse en Input (write operations) y Output (read operations) para mantener claridad y evitar mezclar lógica de validación con presentación.

### 🎯 Objetivo
- **Input Serializer**: Valida y procesa datos de entrada (create, update, partial_update)
- **Output Serializer**: Formatea datos de salida (list, retrieve)
- **Beneficio**: Claridad, mantenibilidad, evita campos ambiguos

### ✅ Buenas Prácticas
```python
# Input: Valida y escribe
class TeamWithPermissionsInputSerializer(serializers.HyperlinkedModelSerializer):
    datacenters = serializers.HyperlinkedRelatedField(
        many=True,
        queryset=Datacenter.objects.all(),
        write_only=True,  # Solo escritura
        required=True
    )

    def create(self, validated_data):
        # Lógica de creación
        ...

# Output: Lee y formatea
class TeamWithPermissionsOutputSerializer(serializers.HyperlinkedModelSerializer):
    datacenters = ChildBaseSerializer(many=True, read_only=True)

# ViewSet: Selecciona según acción
def get_serializer_class(self):
    if self.action in ("create", "update", "partial_update"):
        return TeamWithPermissionsInputSerializer
    return TeamWithPermissionsOutputSerializer
```

### ❌ Violaciones Comunes
```python
# ❌ Serializer único que hace todo
class TeamSerializer(serializers.HyperlinkedModelSerializer):
    datacenters = serializers.HyperlinkedRelatedField(...)  # ¿read o write?

    def create(self, validated_data):
        ...  # Mezcla validación y presentación
```

### 🔍 Cómo Detectar
- Serializer usado en create/update/patch Y list/retrieve
- Campos sin write_only o read_only claro
- Lógica de presentación mezclada con validación

### 📝 Comentario de Revisión
```markdown
issue (blocking): Veo que no hay separación Input/Output en este serializer. ¿Podrías crear TeamInputSerializer (para create/update) y TeamOutputSerializer (para list/retrieve) siguiendo el patrón de apps/core/serializers/user.py?

**Referencia**: Criterio 1 (Separación Input/Output en serializers)
```

### 📚 Referencias
- Patrón implementado: `apps/core/serializers/user.py`
- Guía: `.claude/core/architecture.md` (Service Layer)

---

## Criterio 2: Lógica de Negocio en Servicios

### 📋 Descripción
TODA la lógica de negocio debe estar en servicios (Service Layer), NO en views ni serializers. Views manejan HTTP, serializers validan datos, services implementan lógica.

### 🎯 Objetivo
- **Arquitectura de 3 capas**: Views → Services → Models
- **Views**: Solo HTTP (request, response, status codes)
- **Serializers**: Solo validación de datos
- **Services**: Toda la lógica de negocio

### ✅ Buenas Prácticas
```python
# Service: Toda la lógica de negocio
class TeamService:
    @staticmethod
    def update_team_permissions(team: Team, permissions_data: dict) -> Team:
        new_permissions = FrontendPermissionsHelper.merge_permissions_to_store(
            permissions_data, team.frontend_permissions
        )
        non_frontend = team.permissions.exclude(
            pk__in=FrontendPermissions.objects.values_list("pk", flat=True)
        )
        team.permissions.set(new_permissions | non_frontend)
        return team

# Serializer: Solo validación y delegación
class TeamInputSerializer(serializers.HyperlinkedModelSerializer):
    def update(self, instance, validated_data):
        permissions_data = self.initial_data.get("permissions", {})
        return TeamService.update_team_permissions(instance, permissions_data)

# ViewSet: Solo HTTP
class TeamViewSet(viewsets.ModelViewSet):
    def update(self, request, *args, **kwargs):
        # Solo delegación al método padre, el serializer llama al service
        return super().update(request, *args, **kwargs)
```

### ❌ Violaciones Comunes
```python
# ❌ Lógica de negocio en serializer
class TeamInputSerializer(serializers.HyperlinkedModelSerializer):
    def update(self, instance, validated_data):
        # ❌ Lógica de negocio aquí
        new_permissions = FrontendPermissionsHelper.merge_permissions_to_store(...)
        non_frontend = instance.permissions.exclude(...)
        instance.permissions.set(new_permissions | non_frontend)
        # 15+ líneas de lógica...
        return instance

# ❌ Lógica de negocio en ViewSet
class TeamViewSet(viewsets.ModelViewSet):
    def create(self, request):
        # ❌ Lógica de negocio aquí
        team = Team.objects.create(name=request.data["name"])
        permissions = calculate_permissions(request.data)
        team.permissions.set(permissions)
        # ...
```

### 🔍 Cómo Detectar
- Serializer.create/update con +10 líneas
- ViewSet con lógica más allá de HTTP
- Cálculos, validaciones complejas, manipulación de múltiples modelos
- Uso de helpers/utilities desde views/serializers

### 📝 Comentario de Revisión
```markdown
issue (blocking): Veo que hay lógica de negocio en el serializer (líneas 38-48). Según nuestra arquitectura, esto debería estar en TeamService. ¿Podrías crear TeamService.update_team_permissions() y llamarlo desde aquí?

Ejemplo:
# En TeamService
@staticmethod
def update_team_permissions(team: Team, permissions_data: dict) -> Team:
    # Lógica aquí...

# En serializer
return TeamService.update_team_permissions(instance, permissions_data)

**Referencia**: Criterio 2 (Lógica de negocio en servicios)
```

### 📚 Referencias
- Ejemplo: `apps/core/services.py` → AuthService
- Guía: `.claude/core/architecture.md` (Service Layer Pattern)

---

## Criterio 3: Type Hints Obligatorios

### 📋 Descripción
Todos los parámetros de función y return values deben tener type hints. Esto mejora la legibilidad, detecta errores early, y permite type checking con mypy.

### 🎯 Objetivo
- Type hints en TODOS los parámetros
- Type hints en TODOS los return values
- Usar tipos correctos de typing module
- Pasar mypy type check

### ✅ Buenas Prácticas
```python
from typing import Any, Optional
from django.db.models import QuerySet

class TeamService:
    @staticmethod
    def update_team_permissions(
        team: Team,
        permissions_data: dict[str, Any]
    ) -> Team:
        ...

    @staticmethod
    def get_teams_by_datacenter(
        datacenter: Datacenter
    ) -> QuerySet[Team]:
        return Team.objects.filter(datacenters=datacenter)

    @staticmethod
    def find_team_by_name(name: str) -> Optional[Team]:
        try:
            return Team.objects.get(name=name)
        except Team.DoesNotExist:
            return None
```

### ❌ Violaciones Comunes
```python
# ❌ Sin type hints
def update_team_permissions(team, permissions_data):
    ...

# ❌ Type hints parciales
def update_team_permissions(team: Team, permissions_data):  # ❌ falta type en permissions_data
    ...

# ❌ Sin return type
def get_teams_by_datacenter(datacenter: Datacenter):  # ❌ falta -> QuerySet[Team]
    return Team.objects.filter(datacenters=datacenter)

# ❌ Return type incorrecto
def find_team_by_name(name: str) -> Team:  # ❌ debería ser Optional[Team]
    try:
        return Team.objects.get(name=name)
    except Team.DoesNotExist:
        return None  # ❌ None no es Team
```

### 🔍 Cómo Detectar
- Parámetros sin `:` type annotation
- Funciones sin `->` return annotation
- mypy errors
- IDE warnings (PyCharm, VSCode)

### 📝 Comentario de Revisión
```markdown
issue (blocking): Falta type hint en el parámetro 'permissions_data' del método update_team_permissions. Necesitamos type hints en todos los parámetros (Criterio 3).

Ejemplo:
def update_team_permissions(
    team: Team,
    permissions_data: dict[str, Any]  ← Añadir type hint
) -> Team:
    ...

**Referencia**: Criterio 3 (Type hints obligatorios)
```

### 🛠️ Herramientas
```bash
# Verificar type hints
nox -s types_check
```

### 📚 Referencias
- Guía: `.claude/core/code-style.md` (Type Hints section)
- Python typing: https://docs.python.org/3/library/typing.html

---

## Criterio 4: Tests con Patrón AAA

### 📋 Descripción
Todos los tests deben seguir el patrón AAA (Arrange-Act-Assert) con separación clara de las 3 fases mediante líneas en blanco.

### 🎯 Objetivo
- **Arrange**: Preparar datos y contexto
- **Act**: Ejecutar la acción a probar
- **Assert**: Verificar el resultado
- **Beneficio**: Legibilidad, mantenibilidad, claridad

### ✅ Buenas Prácticas
```python
def test_update_team_with_datacenters_succeeds(
    api_client_logged_with_superuser,
    team_with_datacenters,
    datacenter
):
    # Arrange
    new_datacenter_url = reverse("datacenter-detail", kwargs={"code": datacenter.code})
    payload = {
        "name": "Updated Team",
        "datacenters": [new_datacenter_url]
    }

    # Act
    response = api_client_logged_with_superuser.put(
        reverse("team-detail", kwargs={"pk": team_with_datacenters.pk}),
        data=payload,
        format="json"
    )

    # Assert
    assert response.status_code == 200
    assert response.data["name"] == "Updated Team"
    assert len(response.data["datacenters"]) == 1
```

### ❌ Violaciones Comunes
```python
# ❌ Sin separación AAA
def test_update_team_with_datacenters_succeeds(api_client, team):
    new_datacenter_url = reverse("datacenter-detail", kwargs={"code": "DC1"})
    payload = {"name": "Updated", "datacenters": [new_datacenter_url]}
    response = api_client.put(reverse("team-detail", kwargs={"pk": team.pk}), data=payload)
    assert response.status_code == 200
    assert response.data["name"] == "Updated"
    # Todo mezclado, difícil de leer

# ❌ Múltiples Acts
def test_create_and_update_team(api_client):
    # Arrange
    data = {"name": "Team"}

    # Act 1 - ❌ Múltiples actions en un test
    response1 = api_client.post(reverse("team-list"), data=data)

    # Act 2 - ❌ Debería ser test separado
    response2 = api_client.put(reverse("team-detail", kwargs={"pk": response1.data["id"]}), data={"name": "Updated"})

    # Assert
    assert response2.data["name"] == "Updated"
```

### 🔍 Cómo Detectar
- Tests sin líneas en blanco entre fases
- Múltiples "actions" (Act) en un test
- Arrange y Assert mezclados
- Test name no describe claramente qué se prueba

### 📝 Comentario de Revisión
```markdown
issue (blocking): Este test no sigue el patrón AAA (Arrange-Act-Assert). Necesitas separar claramente las 3 fases con líneas en blanco.

Ejemplo:
def test_update_team_succeeds(...):
    # Arrange
    data = {...}

    # Act
    response = api_client.put(...)

    # Assert
    assert response.status_code == 200

**Referencia**: Criterio 4 (Tests con patrón AAA)
```

### 📚 Referencias
- Guía: `.claude/core/testing.md` (AAA Pattern)
- Ejemplos: `apps/core/tests/user_views_tests.py`

---

## Criterio 5: Coverage 100%

### 📋 Descripción
Cada archivo debe tener 100% de cobertura de tests. Todos los paths de código deben estar probados: happy paths, error cases, edge cases.

### 🎯 Objetivo
- 100% coverage por archivo
- Todos los métodos probados
- Todos los branches probados (if/else)
- Todos los edge cases cubiertos

### ✅ Buenas Prácticas
```python
# Método con múltiples paths
class TeamService:
    @staticmethod
    def update_team_permissions(team: Team, permissions_data: dict | None) -> Team:
        if permissions_data is None:
            return team  # Path 1: Sin permissions

        if not permissions_data:
            team.permissions.clear()  # Path 2: Permissions vacío
            return team

        new_permissions = FrontendPermissionsHelper.merge_permissions(...)  # Path 3: Con permissions
        team.permissions.set(new_permissions)
        return team

# Tests que cubren los 3 paths
def test_update_team_without_permissions_returns_unchanged_team():
    # Path 1
    ...

def test_update_team_with_empty_permissions_clears_all():
    # Path 2
    ...

def test_update_team_with_permissions_updates_correctly():
    # Path 3
    ...
```

### ❌ Violaciones Comunes
```python
# ❌ Solo happy path cubierto
def test_create_team_succeeds():
    # Solo prueba el caso exitoso
    ...

# ❌ Falta error case
# Missing:
# - test_create_team_with_invalid_data_fails
# - test_create_team_without_required_field_fails

# ❌ Falta edge case
# Missing:
# - test_create_team_with_empty_name_fails
# - test_create_team_with_duplicate_name_fails
```

### 🔍 Cómo Detectar
```bash
# Ejecutar coverage
nox -s test -- --cov=apps/core/serializers/team.py

# Ver líneas sin cubrir
nox -s test -- --cov=apps/core --cov-report=html
open htmlcov/index.html
```

### 📝 Comentario de Revisión
```markdown
issue (blocking): Falta cobertura de tests para el caso cuando permissions_data es None. ¿Puedes añadir test_update_team_without_permissions_returns_unchanged_team?

Para mantener 100% de coverage necesitamos cubrir todos los paths del método.

**Referencia**: Criterio 5 (Coverage 100%)
```

### 🛠️ Herramientas
```bash
# Coverage por archivo
nox -s test -- --cov=apps/core/serializers/team.py --cov-report=term-missing

# Coverage general
nox -s test -- --cov=apps/core --cov-report=html
```

### 📚 Referencias
- Guía: `.claude/core/testing.md` (Coverage section)
- Target: 100% por archivo

---

## Criterio 6: NO Filtrado Manual de tenant_id (⚠️ CRÍTICO P0)

### 📋 Descripción
**CRÍTICO**: NUNCA filtrar manualmente por tenant_id. El middleware MultitenantMiddleware añade automáticamente tenant_id a TODAS las queries. El filtrado manual viola la arquitectura multi-tenant y puede causar fugas de datos entre tenants.

### 🎯 Objetivo
- **Transparencia**: Application code es tenant-agnostic
- **Seguridad**: Evitar fugas de datos entre tenants
- **Simplicidad**: Middleware maneja todo automáticamente
- **Consistencia**: Misma query funciona en main y tenant services

### ✅ Buenas Prácticas
```python
# ✅ CORRECTO: Confiar en el middleware
users = User.objects.filter(email=email)

# ✅ CORRECTO: El middleware añade tenant_id automáticamente
teams = Team.objects.filter(name=team_name)

# ✅ CORRECTO: Funciona tanto en main service como tenant service
datacenters = Datacenter.objects.all()  # Middleware filtra según contexto
```

### ❌ Violaciones CRÍTICAS
```python
# ❌ CRÍTICO: Filtrado manual de tenant_id
users = User.objects.filter(tenant_id=company.id, email=email)

# ❌ CRÍTICO: Pasar tenant_id manualmente
teams = Team.objects.filter(tenant_id=request.user.company.id)

# ❌ CRÍTICO: Acceder a tenant_id en queries
if obj.tenant_id == user.company.id:
    ...

# ❌ CRÍTICO: Comparar tenant_id manualmente
queryset = Model.objects.filter(tenant_id=self.request.user.company.id)
```

### 🔍 Cómo Detectar
- Buscar `tenant_id` en queries
- Buscar `.filter(tenant_id=`
- Buscar `company.id` en filtros de ORM
- Tool: `multi-tenant-enforcer` agent

### 📝 Comentario de Revisión
```markdown
issue (blocking): ⚠️ CRÍTICO: Veo filtrado manual de tenant_id en la línea 42:

User.objects.filter(tenant_id=company.id, email=email)

Esto NUNCA debe hacerse. El middleware MultitenantMiddleware filtra automáticamente por tenant en TODAS las queries. Elimina el filtro manual:

❌ INCORRECTO:
User.objects.filter(tenant_id=company.id, email=email)

✅ CORRECTO:
User.objects.filter(email=email)

El middleware añade tenant_id automáticamente. El filtrado manual puede:
1. Causar fugas de datos entre tenants (seguridad crítica)
2. Romper la arquitectura multi-tenant
3. Causar queries incorrectas en servicios tenant

Este es nuestro criterio MÁS CRÍTICO (P0). La violación es un blocker absoluto.

**Referencia**: Criterio 6 (NO filtrado manual de tenant_id) - CRÍTICO P0
```

### 🛠️ Herramientas
```bash
# Escanear violaciones
/check-tenant apps/core/

# Agent scan
multi-tenant-enforcer agent
```

### 📚 Referencias
- Guía: `.claude/core/architecture.md` (Multi-Tenant Pattern)
- Middleware: `binora/middleware.py` → MultitenantMiddleware

---

## Criterio 7: Queries Optimizados

### 📋 Descripción
Todas las queries deben estar optimizadas para evitar N+1 problems y queries innecesarias. Usar select_related, prefetch_related, y evitar .all() cuando no es necesario.

### 🎯 Objetivo
- Evitar N+1 queries
- Usar select_related para ForeignKey/OneToOne
- Usar prefetch_related para ManyToMany/reverse ForeignKey
- Evitar .all() innecesario
- Siempre usar order_by() para evitar random ordering

### ✅ Buenas Prácticas
```python
# ✅ select_related para ForeignKey
teams = Team.objects.select_related('company').all()
# 1 query en lugar de N+1

# ✅ prefetch_related para ManyToMany
teams = Team.objects.prefetch_related('permissions').all()
# 2 queries en lugar de N+1

# ✅ Evitar .all() innecesario
data["datacenters"] = ChildBaseSerializer(instance.datacenters, many=True).data
# instance.datacenters ya es queryset, no necesita .all()

# ✅ order_by obligatorio
teams = Team.objects.all().order_by('name')
# Evita random ordering
```

### ❌ Violaciones Comunes
```python
# ❌ N+1 query
teams = Team.objects.all()
for team in teams:
    print(team.company.name)  # Query por cada team!

# ❌ .all() innecesario
data["datacenters"] = ChildBaseSerializer(instance.datacenters.all(), many=True).data
# instance.datacenters ya es queryset

# ❌ Sin order_by
teams = Team.objects.all()  # Orden aleatorio, puede cambiar entre queries
```

### 🔍 Cómo Detectar
- Loop sobre queryset accediendo a relaciones
- .all() en relaciones ya filtradas
- Queryset sin order_by()
- Tool: `performance-analyzer` agent
- Django Debug Toolbar en desarrollo

### 📝 Comentario de Revisión
```markdown
suggestion (non-blocking): Podrías optimizar esta query añadiendo .select_related('company') si necesitas acceder a company en las respuestas, evitarías un N+1.

Ejemplo:
queryset = Team.objects.select_related('company').all().order_by('name')

**Referencia**: Criterio 7 (Queries optimizados)
```

### 🛠️ Herramientas
```bash
# Analizar performance
/query-analysis apps/core/views/

# Agent analysis
performance-analyzer agent
```

### 📚 Referencias
- Guía: `.claude/core/architecture.md` (Query Optimization)
- Django docs: https://docs.djangoproject.com/en/5.0/ref/models/querysets/#select-related

---

## Criterio 8: Comentarios en Inglés (Filosofía YOLO)

### 📋 Descripción
**Filosofía YOLO**: Código auto-explicativo sin comentarios. Si necesitas comentario, debe ser en inglés. Preferir código claro sobre comentarios.

### 🎯 Objetivo
- Código auto-explicativo (nombres claros, funciones pequeñas)
- Solo comentar lo genuinamente no-obvio
- Comentarios en inglés únicamente
- NO comentarios obvios

### ✅ Buenas Prácticas
```python
# ✅ Código auto-explicativo (sin comentarios)
def update_team_permissions(team: Team, permissions_data: dict) -> Team:
    new_permissions = FrontendPermissionsHelper.merge_permissions_to_store(
        permissions_data, team.frontend_permissions
    )
    team.permissions.set(new_permissions)
    return team

# ✅ Comentario solo si genuinamente no-obvio (en inglés)
def calculate_discount(price: Decimal) -> Decimal:
    # Complex business rule: 10% discount for orders over 1000, but only on Tuesdays
    if is_tuesday() and price > 1000:
        return price * Decimal("0.9")
    return price
```

### ❌ Violaciones Comunes
```python
# ❌ Comentarios obvios
def create_user(email: str) -> User:
    # Create user  ← Obvio
    user = User.objects.create(email=email)
    # Return user  ← Obvio
    return user

# ❌ Comentarios en español
def update_team(team: Team) -> Team:
    # Actualizar el equipo  ← Debe ser en inglés
    team.save()
    return team

# ❌ Comentarios innecesarios
validated_data = serializer.validated_data  # Get validated data  ← Obvio
```

### 🔍 Cómo Detectar
- Comentarios en español
- Comentarios que describen lo obvio
- Código complejo que necesita comentario → refactorizar

### 📝 Comentario de Revisión
```markdown
suggestion (non-blocking): Veo un comentario en español aquí: "# Validar que el usuario tenga permisos". Según nuestra guía de estilo, comentarios en inglés (o mejor aún, elimínalo si el código es auto-explicativo - filosofía YOLO).

Código auto-explicativo:
def validate_user_has_permissions(user: User) -> bool:
    return user.has_perm("teams.change_team")

**Referencia**: Criterio 8 (Comentarios en inglés - filosofía YOLO)
```

### 📚 Referencias
- Guía: `.claude/core/code-style.md` (YOLO Comments)
- Filosofía: Código claro > Comentarios

---

## Criterio 9: Tests sin Docstrings ni Comentarios

### 📋 Descripción
Los tests NO deben tener docstrings ni comentarios. El nombre del test debe ser suficientemente descriptivo. Filosofía YOLO aplicada estrictamente en tests.

### 🎯 Objetivo
- Nombre de test auto-explicativo
- Sin docstrings en tests
- Sin comentarios en tests (ni siquiera AAA labels opcionales)
- Código de test claro por sí mismo

### ✅ Buenas Prácticas
```python
# ✅ Test auto-explicativo sin docstrings ni comentarios
def test_update_team_with_valid_datacenters_succeeds(
    api_client_logged_with_superuser,
    team_with_datacenters,
    datacenter
):
    new_datacenter_url = reverse("datacenter-detail", kwargs={"code": datacenter.code})
    payload = {"name": "Updated", "datacenters": [new_datacenter_url]}

    response = api_client_logged_with_superuser.put(
        reverse("team-detail", kwargs={"pk": team_with_datacenters.pk}),
        data=payload,
        format="json"
    )

    assert response.status_code == 200
    assert response.data["name"] == "Updated"
```

### ❌ Violaciones Comunes
```python
# ❌ Test con docstring
def test_update_team_succeeds():
    """Test that updating a team with datacenters succeeds."""  # ❌ NO docstrings
    ...

# ❌ Test con comentarios AAA (aunque sean útiles)
def test_update_team_succeeds():
    # Arrange  ← ❌ NO comentarios, ni siquiera AAA labels
    data = {...}

    # Act  ← ❌ NO comentarios
    response = api_client.put(...)

    # Assert  ← ❌ NO comentarios
    assert response.status_code == 200

# ❌ Test con comentarios explicativos
def test_update_team_succeeds():
    # Create payload with new datacenter  ← ❌ NO comentarios
    payload = {...}
    ...
```

### 🔍 Cómo Detectar
- Buscar `"""` o `'''` en archivos de test
- Buscar `#` en test functions
- Grep: `grep -n '"""' apps/*/tests/*_tests.py`

### 📝 Comentario de Revisión
```markdown
issue (blocking): Este test tiene docstrings/comentarios. Según nuestra filosofía YOLO, los tests deben ser auto-explicativos sin docstrings ni comentarios. Elimínalos.

El nombre del test debe ser suficientemente descriptivo:
- ✅ test_update_team_with_valid_datacenters_succeeds
- ❌ def test_update(): \"\"\"Test update team\"\"\"

**Referencia**: Criterio 9 (Tests sin docstrings ni comentarios)
```

### 📚 Referencias
- Guía: `.claude/core/testing.md` (YOLO in Tests)
- Ejemplos: `apps/core/tests/user_views_tests.py` (sin docstrings)

---

## Criterio 10: Seguir Guía de Estilo del Proyecto

### 📋 Descripción
Seguir la guía de estilo de Binora Backend: naming conventions, __all__ exports, import organization, file structure.

### 🎯 Objetivo
- __all__ en módulos públicos
- Imports organizados (Django, third-party, local)
- Naming conventions (PascalCase, snake_case)
- File naming (_tests.py, no test_.py)

### ✅ Buenas Prácticas
```python
# ✅ __all__ definido
__all__ = [
    "TeamSerializer",
    "TeamInputSerializer",
    "TeamOutputSerializer",
]

# ✅ Imports organizados
# Django imports
from django.db import models

# Third-party imports
from rest_framework import serializers

# Local imports
from apps.core.models import Team

# ✅ Naming conventions
class TeamInputSerializer(serializers.HyperlinkedModelSerializer):  # PascalCase
    def update_team_permissions(self, team: Team) -> Team:  # snake_case
        ...
```

### ❌ Violaciones Comunes
```python
# ❌ Sin __all__
# Archivo sin __all__ definido

# ❌ Imports desordenados
from apps.core.models import Team  # Local
from django.db import models  # Django (debería estar antes)
from rest_framework import serializers  # Third-party

# ❌ Naming incorrecto
class team_serializer(serializers.Serializer):  # ❌ Debe ser PascalCase
    def UpdateTeam(self, team):  # ❌ Debe ser snake_case
        ...
```

### 🔍 Cómo Detectar
- Verificar __all__ presence
- Verificar import order
- Verificar naming conventions
- Tool: `django-codebase-auditor` agent

### 📝 Comentario de Revisión
```markdown
suggestion (non-blocking): Veo que falta el __all__ en este módulo. Según nuestra guía de estilo, todos los módulos públicos deben tener __all__ definido para exportar explícitamente las clases/funciones públicas.

Ejemplo:
__all__ = [
    "TeamInputSerializer",
    "TeamOutputSerializer",
]

**Referencia**: Criterio 10 (Guía de estilo del proyecto)
```

### 📚 Referencias
- Guía completa: `.claude/core/code-style.md`
- PEP 8: https://peps.python.org/pep-0008/

---

## Criterio 11: Validar Contra Contrato OpenAPI

### 📋 Descripción
Los endpoints deben coincidir exactamente con el contrato OpenAPI definido en binora-contract submodule: request schemas, response schemas, status codes, authentication.

### 🎯 Objetivo
- Request schema coincide con contrato
- Response schema coincide con contrato
- Status codes correctos
- Authentication según contrato

### ✅ Buenas Prácticas
```yaml
# Contrato OpenAPI: binora-contract/paths/teams.yaml
/teams/:
  get:
    responses:
      200:
        content:
          application/json:
            schema:
              type: object
              properties:
                url:
                  type: string
                name:
                  type: string
                datacenters:
                  type: array
                  items:
                    type: object
                    properties:
                      code:
                        type: string
                      name:
                        type: string
```

```python
# Serializer que coincide con contrato
class TeamOutputSerializer(serializers.HyperlinkedModelSerializer):
    datacenters = ChildBaseSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ("url", "name", "datacenters")  # Coincide con contrato
```

### ❌ Violaciones Comunes
```python
# ❌ Response schema no coincide
class TeamOutputSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        fields = ("url", "team_name", "datacenters")  # ❌ "team_name" no está en contrato, debería ser "name"

# ❌ Campo faltante
class TeamOutputSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        fields = ("url", "name")  # ❌ Falta "datacenters" que está en contrato

# ❌ Status code incorrecto
return Response(data, status=201)  # ❌ Contrato espera 200
```

### 🔍 Cómo Detectar
- Comparar serializer fields con contrato
- Verificar status codes en ViewSet
- Tool: `contract-compliance-validator` agent
- Manual: revisar binora-contract/paths/

### 📝 Comentario de Revisión
```markdown
issue (blocking): Este endpoint no coincide con el contrato OpenAPI. El response schema espera:

{
  "url": "string",
  "name": "string",
  "datacenters": [...]
}

Pero estás devolviendo "team_name" en lugar de "name". ¿Puedes alinearlo con binora-contract/paths/teams.yaml?

**Referencia**: Criterio 11 (Validar contra contrato OpenAPI)
```

### 🛠️ Herramientas
```bash
# Validar contrato
/check-contract core

# Agent validation
contract-compliance-validator agent
```

### 📚 Referencias
- Contrato: `binora-contract/` submodule
- Guía: `.claude/core/workflows.md` (Contract Validation)

---

## 📊 Matriz de Prioridad

### Blocking (Debe resolverse antes de merge)
1. ✅ **Criterio 6**: NO tenant_id manual (⚠️ CRÍTICO P0)
2. ✅ **Criterio 2**: Lógica en servicios
3. ✅ **Criterio 1**: Input/Output separation
4. ✅ **Criterio 3**: Type hints
5. ✅ **Criterio 4**: Tests AAA
6. ✅ **Criterio 5**: Coverage 100%
7. ✅ **Criterio 9**: Tests sin docstrings
8. ✅ **Criterio 11**: OpenAPI contract

### Non-blocking (Recomendado pero no blocker)
9. ⚠️ **Criterio 7**: Query optimization
10. ⚠️ **Criterio 8**: Comentarios inglés/YOLO
11. ⚠️ **Criterio 10**: Guía de estilo

---

## 🎯 Decisión de Aprobar o Solicitar Cambios

### Aprobar si:
- ✅ Todos los criterios blocking cumplidos (1,2,3,4,5,6,9,11)
- ⚠️ Criterios non-blocking pueden tener suggestions (7,8,10)

### Solicitar Cambios si:
- ❌ Cualquier criterio blocking violado
- ❌ Especialmente criterio 6 (tenant_id manual) - CRÍTICO P0

---

## 📚 Referencias Completas

- **Arquitectura**: `.claude/core/architecture.md`
- **Testing**: `.claude/core/testing.md`
- **Code Style**: `.claude/core/code-style.md`
- **Workflows**: `.claude/core/workflows.md`
- **PR Checklist**: `.claude/core/pr-review-checklist.md`