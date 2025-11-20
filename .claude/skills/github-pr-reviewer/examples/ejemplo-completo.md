# Ejemplo Completo: Revisión de PR feat(teams): add datacenter access control

Este ejemplo muestra una revisión completa de PR real usando el sistema `github-pr-reviewer`.

---

## 📋 Contexto de la PR

**PR Number**: #123 (ejemplo ficticio basado en JRV-435)
**Título**: feat(teams): add datacenter access control
**Autor**: oriol
**Branch**: feature/JRV-435-ENPOINTS-PERMISSIONS-AT-DATACENTER-LEVEL
**Base Branch**: dev

**Descripción**:
```
Implementa control de acceso a datacenters a nivel de equipos (teams).

Cambios:
- Añade campo datacenters a TeamSerializer con Input/Output separation
- Actualiza ViewSet para usar InputSerializer en create/update/patch
- Añade tests para operaciones CRUD con datacenters
- Elimina test redundante

Jira: JRV-435
```

**Archivos Modificados**:
- `apps/core/serializers/team.py` (+58, -15)
- `apps/core/views/team.py` (+4, -0)
- `apps/core/tests/team_api_tests.py` (+12, -8)

---

## 🚀 Ejecución del Skill

### Comando
```bash
User: "Revisa esta PR por favor, quiero asegurarme de que cumple todos los estándares antes del merge"
```

### Detección Automática
El skill `github-pr-reviewer` se auto-activa al detectar:
- Keywords: "revisa", "PR"
- Contexto: Usuario en branch de PR
- Intent: Revisar código antes de merge

---

## ⚙️ FASE 1: Extracción de Contexto (30s)

### Comandos Ejecutados
```bash
# Obtener info de PR
gh pr view --json title,body,author,headRefName,baseRefName,number

# Obtener diff con contexto
git diff -U3 origin/dev...HEAD

# Archivos cambiados
git diff --name-only origin/dev...HEAD

# Comentarios existentes
gh pr view --comments
```

### Output de Fase 1
```json
{
  "pr_number": 123,
  "title": "feat(teams): add datacenter access control",
  "author": "oriol",
  "branch": "feature/JRV-435-ENPOINTS-PERMISSIONS-AT-DATACENTER-LEVEL",
  "base_branch": "dev",
  "files_changed": [
    {
      "path": "apps/core/serializers/team.py",
      "lines_added": 58,
      "lines_removed": 15,
      "functions_modified": [
        "TeamWithPermissionsInputSerializer",
        "TeamWithPermissionsOutputSerializer",
        "TeamWithPermissionsInputSerializer.update",
        "TeamWithPermissionsInputSerializer.create",
        "TeamWithPermissionsInputSerializer.to_representation"
      ]
    },
    {
      "path": "apps/core/views/team.py",
      "lines_added": 4,
      "lines_removed": 0,
      "functions_modified": [
        "TeamViewSet.get_serializer_class"
      ]
    },
    {
      "path": "apps/core/tests/team_api_tests.py",
      "lines_added": 12,
      "lines_removed": 8,
      "functions_modified": [
        "test_create_team_with_datacenters",
        "test_update_team_datacenters"
      ]
    }
  ],
  "diff": "...",
  "existing_comments": [
    {
      "author": "josé",
      "file": "apps/core/serializers/team.py",
      "line": 25,
      "text": "R25: Considera separar Input/Output serializers"
    }
  ]
}
```

---

## 🔍 FASE 2: Análisis Paralelo (4 min)

### Agentes Lanzados en Paralelo (5 simultáneos)

```python
# Task tool con 5 invocaciones paralelas en 1 mensaje
await parallel_tasks([
    # Agente 1
    Task(subagent_type="django-codebase-auditor",
         prompt="Analyze PR files for criteria 1,2,3,4,5,8,9,10..."),

    # Agente 2
    Task(subagent_type="multi-tenant-enforcer",
         prompt="CRITICAL: Check manual tenant_id filtering..."),

    # Agente 3
    Task(subagent_type="performance-analyzer",
         prompt="Analyze query performance, check N+1..."),

    # Agente 4
    Task(subagent_type="security-auditor",
         prompt="Security audit..."),

    # Agente 5
    Task(subagent_type="contract-compliance-validator",
         prompt="Validate OpenAPI contract compliance...")
])
```

### Findings por Agente

#### 1. django-codebase-auditor (Criterios 1,2,3,4,5,8,9,10)

```json
{
  "findings": [
    {
      "criterion": 1,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/serializers/team.py",
      "line": 21,
      "function": "TeamWithPermissionsInputSerializer",
      "code_snippet": "class TeamWithPermissionsInputSerializer(serializers.HyperlinkedModelSerializer):",
      "issue": null,
      "suggestion": "Good Input/Output separation pattern implemented"
    },
    {
      "criterion": 2,
      "severity": "issue",
      "blocking": true,
      "file": "apps/core/serializers/team.py",
      "line": 38,
      "function": "TeamWithPermissionsInputSerializer.update",
      "code_snippet": "new_permissions = FrontendPermissionsHelper.merge_permissions_to_store(permissions_data, instance.frontend_permissions)",
      "issue": "Business logic in serializer update method",
      "suggestion": "Move to TeamService.update_team_permissions()"
    },
    {
      "criterion": 3,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/serializers/team.py",
      "line": 29,
      "function": "TeamWithPermissionsInputSerializer.update",
      "code_snippet": "def update(self, instance, validated_data):",
      "issue": null,
      "suggestion": "All type hints present"
    },
    {
      "criterion": 4,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/tests/team_api_tests.py",
      "line": 158,
      "function": "test_update_team_datacenters",
      "code_snippet": "def test_update_team_datacenters(api_client_logged_with_superuser, team_with_datacenters):",
      "issue": null,
      "suggestion": "Tests follow AAA pattern correctly"
    },
    {
      "criterion": 5,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/tests/team_api_tests.py",
      "line": 1,
      "function": null,
      "code_snippet": null,
      "issue": null,
      "suggestion": "Coverage at 100% (390/390 tests passing)"
    },
    {
      "criterion": 9,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/tests/team_api_tests.py",
      "line": 158,
      "function": "test_update_team_datacenters",
      "code_snippet": "def test_update_team_datacenters(...):",
      "issue": null,
      "suggestion": "Tests have no docstrings/comments (YOLO philosophy)"
    }
  ]
}
```

#### 2. multi-tenant-enforcer (Criterio 6)

```json
{
  "findings": [
    {
      "criterion": 6,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/serializers/team.py",
      "line": 1,
      "function": null,
      "code_snippet": null,
      "issue": null,
      "suggestion": "No manual tenant_id filtering detected. Middleware isolation working correctly. CRITICAL check PASSED."
    }
  ]
}
```

#### 3. performance-analyzer (Criterio 7)

```json
{
  "findings": [
    {
      "criterion": 7,
      "severity": "suggestion",
      "blocking": false,
      "file": "apps/core/views/team.py",
      "line": 10,
      "function": "TeamViewSet",
      "code_snippet": "queryset = Team.objects.all().order_by('name')",
      "issue": "Could optimize with select_related if company is accessed",
      "suggestion": "Consider adding .select_related('company') if company fields are used in responses"
    },
    {
      "criterion": 7,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/serializers/team.py",
      "line": 35,
      "function": "TeamWithPermissionsInputSerializer.to_representation",
      "code_snippet": "data['datacenters'] = ChildBaseSerializer(instance.datacenters, many=True, context=self.context).data",
      "issue": null,
      "suggestion": "Good: Using instance.datacenters instead of instance.datacenters.all() - avoids unnecessary query"
    }
  ]
}
```

#### 4. security-auditor

```json
{
  "findings": [
    {
      "criterion": null,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/serializers/team.py",
      "line": 27,
      "function": "TeamWithPermissionsInputSerializer.datacenters",
      "code_snippet": "write_only=True",
      "issue": null,
      "suggestion": "Good: write_only=True prevents exposing internal field structure in responses"
    }
  ]
}
```

#### 5. contract-compliance-validator (Criterio 11)

```json
{
  "findings": [
    {
      "criterion": 11,
      "severity": "praise",
      "blocking": false,
      "file": "apps/core/serializers/team.py",
      "line": 35,
      "function": "TeamWithPermissionsInputSerializer.to_representation",
      "code_snippet": "return data",
      "issue": null,
      "suggestion": "Response schema matches OpenAPI contract for /teams/ endpoints"
    }
  ]
}
```

### Resumen de Findings
- **Total findings**: 11
- **Issues (blocking)**: 1
- **Suggestions (non-blocking)**: 1
- **Praise**: 9

---

## 💬 FASE 3: Generación de Comentarios (1 min)

### Agente Invocado
```python
Task(
    subagent_type="pr-comment-generator",
    prompt="""
    Generate Conventional Comments in Spanish for these findings.

    Input:
    - 11 findings from 5 agents
    - PR context (JRV-435)
    - Diff with 3 files

    Requirements:
    - Tone: cercano, amigable, sin formalismos
    - At least 1 praise
    - Identify: archivo:línea (función)
    - (blocking) / (non-blocking) decorators
    """
)
```

### Output Generado

```markdown
## 📝 Comentarios de Revisión

### ❌ Issues (Blocking) - 1 encontrado

**apps/core/serializers/team.py:38** (TeamWithPermissionsInputSerializer.update)
issue (blocking): Veo que hay lógica de negocio en el método update del serializer (merge de permissions con FrontendPermissionsHelper). Según nuestra arquitectura, esto debería estar en un servicio. ¿Podrías crear un método TeamService.update_team_permissions(team, permissions_data) y llamarlo desde aquí? Puedes ver un ejemplo similar en apps/core/services.py → AuthService.

**Referencia**: Criterio 2 (Lógica de negocio en servicios)

---

### 💡 Suggestions (Non-blocking) - 1 encontrado

**apps/core/views/team.py:10** (TeamViewSet.queryset)
suggestion (non-blocking): Podrías optimizar la query añadiendo .select_related('company') si necesitas acceder a company en las respuestas del serializer, evitarías un N+1 potencial. Si no usas company, déjalo como está.

**Referencia**: Criterio 7 (Queries optimizados)

---

### ✅ Praise - 9 encontrados

**apps/core/serializers/team.py:21** (TeamWithPermissionsInputSerializer)
praise: Me gusta mucho cómo has implementado la separación Input/Output de serializers aquí! Queda muy limpio y sigue perfectamente el patrón del proyecto. 👌

**apps/core/serializers/team.py:29** (update method)
praise: Excelente uso de type hints en todos los parámetros y return values. El código es muy claro y auto-documentado.

**apps/core/serializers/team.py:35** (to_representation)
praise: Buena decisión usar instance.datacenters en lugar de instance.datacenters.all() - evitas una query innecesaria! Estos detalles de performance se notan.

**apps/core/serializers/team.py:27** (datacenters field)
praise: Perfecto uso de write_only=True aquí. Evita exponer la estructura interna del campo en las responses, buena práctica de seguridad.

**apps/core/tests/team_api_tests.py:158** (test_update_team_datacenters)
praise: Los tests siguen el patrón AAA perfectamente (Arrange-Act-Assert). Muy fácil de leer y entender qué estás probando.

**apps/core/tests/team_api_tests.py** (general)
praise: Coverage al 100% con 390/390 tests pasando! Excelente trabajo manteniendo la calidad y cobertura completa.

**apps/core/tests/team_api_tests.py:158** (test_update_team_datacenters)
praise: Me gusta que los tests no tengan docstrings ni comentarios innecesarios. Sigues bien la filosofía YOLO del proyecto - el código de test es auto-explicativo.

**apps/core/serializers/team.py** (general - multi-tenant)
praise: ⭐ CRÍTICO PASSED: No veo filtrado manual de tenant_id en ningún lado. El middleware está manejando la isolación correctamente. Esto es MUY importante!

**apps/core/serializers/team.py:35** (response schema)
praise: El response schema coincide perfectamente con el contrato OpenAPI para /teams/. Buena consistencia con la especificación!

---

## ✅ Checklist de Criterios

- ✅ **Criterio 1**: Separación Input/Output serializers → OK
- ❌ **Criterio 2**: Lógica en servicios → ISSUE (blocking en L38)
- ✅ **Criterio 3**: Type hints → OK
- ✅ **Criterio 4**: Tests AAA → OK
- ✅ **Criterio 5**: Coverage 100% → OK (390/390 tests)
- ✅ **Criterio 6**: NO tenant_id manual → OK (⭐ CRÍTICO PASSED)
- ⚠️ **Criterio 7**: Queries optimizados → SUGGESTION (L10 - opcional)
- ✅ **Criterio 8**: Comentarios YOLO → OK
- ✅ **Criterio 9**: Tests sin docstrings → OK
- ✅ **Criterio 10**: Guía de estilo → OK
- ✅ **Criterio 11**: OpenAPI contract → OK

---

## 📊 Resumen

- **Issues (blocking)**: 1
- **Suggestions (non-blocking)**: 1
- **Praise**: 9
- **Questions**: 0
- **Thoughts**: 0
- **Total comentarios**: 11

---

## 🎯 Recomendación Final

❌ **SOLICITAR CAMBIOS**

Hay 1 issue blocking que debe resolverse antes del merge:

1. **Mover lógica de negocio a servicio** (apps/core/serializers/team.py:38)
   - Crear TeamService.update_team_permissions(team, permissions_data)
   - Llamar desde serializer en lugar de tener la lógica inline
   - Ver apps/core/services.py → AuthService como referencia

Una vez resuelto este issue, la PR estará lista para aprobar! 🚀

**Nota positiva**: Has hecho un trabajo excelente con la separación Input/Output, coverage, tests AAA, y especialmente con la isolación multi-tenant (criterio CRÍTICO). Solo necesitas mover esa lógica de negocio y estarás listo!
```

---

## 📊 Métricas de la Revisión

| Métrica | Valor |
|---------|-------|
| **Tiempo total** | 5 minutos 30 segundos |
| Fase 1 (Context) | 30 segundos |
| Fase 2 (Analysis) | 4 minutos (paralelo) |
| Fase 3 (Comments) | 1 minuto |
| **Agentes ejecutados** | 6 (5 análisis + 1 generador) |
| **Comentarios generados** | 11 |
| **Praise** | 9 (82%) |
| **Issues blocking** | 1 (9%) |
| **Suggestions** | 1 (9%) |
| **Criterios evaluados** | 11/11 (100%) |
| **Recomendación** | SOLICITAR CAMBIOS |

---

## 🔄 Flujo Post-Revisión

### 1. Usuario aplica cambios
```bash
# El usuario crea TeamService y mueve la lógica
# Usuario comenta en GitHub con 👍 en el issue
# Usuario marca como resuelto
```

### 2. Usuario solicita re-revisión
```bash
User: "He aplicado los cambios, revisa otra vez por favor"
```

### 3. Skill re-ejecuta análisis
```bash
# Detecta que hay cambios nuevos
# Re-ejecuta FASE 2 solo en archivos modificados
# Verifica que el issue está resuelto
```

### 4. Nueva recomendación
```markdown
## 🎯 Recomendación Final

✅ **APROBAR**

El issue blocking ha sido resuelto correctamente!

- ✅ Lógica de negocio movida a TeamService.update_team_permissions()
- ✅ Serializer ahora solo valida y delega al servicio
- ✅ Todos los criterios blocking cumplidos

La PR está lista para merge! 🚀 Excelente trabajo! 🎉
```

---

## 💡 Lecciones Aprendidas

### Lo que funcionó bien:
1. ✅ **Separación Input/Output**: Patrón implementado correctamente
2. ✅ **Tests completos**: AAA pattern, 100% coverage, sin docstrings
3. ✅ **Multi-tenant**: No manual tenant_id filtering (CRÍTICO)
4. ✅ **Type hints**: Todos los parámetros tipados
5. ✅ **Performance**: Evitó .all() innecesario en datacenters

### Lo que mejorar:
1. ❌ **Lógica de negocio**: Debe estar en servicios, no serializers
2. ⚠️ **Query optimization**: Considerar select_related si es necesario

### Impacto del sistema de revisión:
- 🎯 **Detectó issue crítico de arquitectura** antes del merge
- 📚 **Educativo**: Explicó el "por qué" y referenció ejemplos
- 🤝 **Constructivo**: 9 praise vs 1 issue (ratio positivo 9:1)
- ⚡ **Rápido**: 5.5 minutos para revisión completa y profunda

---

## 📚 Referencias

- **Skill**: `.claude/skills/github-pr-reviewer/SKILL.md`
- **Agente**: `.claude/agents/pr-comment-generator/AGENT.md`
- **Criterios**: `.claude/skills/github-pr-reviewer/references/criterios-revision.md`
- **Templates**: `.claude/skills/github-pr-reviewer/templates/conventional-comments.md`