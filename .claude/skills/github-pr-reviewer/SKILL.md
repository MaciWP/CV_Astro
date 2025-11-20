# github-pr-reviewer

**Tipo**: Skill Orchestrator
**Versión**: 1.0.0
**Propósito**: Sistema completo de revisión de Pull Requests con Conventional Comments en Castellano

---

## 📋 Descripción

Skill orchestrator que coordina la revisión automática completa de Pull Requests siguiendo los estándares de Binora Backend:
- **11 criterios estrictos** de calidad de código
- **Conventional Comments** en Castellano (praise, suggestion, issue, question, thought, typo)
- **Tono cercano y amigable** sin formalismos
- **Identificación precisa** de ubicación (archivo, línea, función/variable)
- **Paralelismo óptimo** (6 agentes ejecutándose en paralelo)

---

## ⚠️ REGLA DE ORO

**🚨 ESTE SKILL SOLO REVISA, NUNCA MODIFICA CÓDIGO 🚨**

- ❌ **NO** modificar archivos de código
- ❌ **NO** hacer commits
- ❌ **NO** aplicar cambios automáticamente
- ❌ **NO** usar Write o Edit tools en código fuente
- ✅ **SÍ** leer archivos para análisis
- ✅ **SÍ** usar Grep/Bash para explorar
- ✅ **SÍ** generar comentarios de revisión
- ✅ **SÍ** proporcionar recomendaciones

**El objetivo es REVISAR y COMENTAR, no modificar. El desarrollador aplica los cambios manualmente después de la revisión.**

---

## 🎯 Cuándo Usar Este Skill

### Auto-Activación
Este skill se activa automáticamente cuando detecta:
- Usuario menciona "revisar PR" o "review PR"
- Usuario menciona "Pull Request" o "PR review"
- Usuario pide "comentarios de código"
- Usuario menciona "Conventional Comments"
- Usuario pregunta "¿está lista la PR?"

### Uso Manual
```
/skill github-pr-reviewer
```

---

## 🏗️ Arquitectura (3 Fases)

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: Extracción de Contexto (Skill Logic)               │
├─────────────────────────────────────────────────────────────┤
│ 1. Leer PR description (gh pr view)                         │
│ 2. Parsear git diff con líneas (git diff -U3)              │
│ 3. Extraer comentarios existentes (gh pr view --comments)  │
│ 4. Identificar archivos + funciones cambiadas              │
│ 5. Extraer PR metadata (autor, branch, commits)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 2: Análisis Paralelo (6 Agentes)                      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐    │
│ │ django-codebase-auditor                             │    │
│ │ → Criterios: 1,2,3,4,5,8,9,10                       │    │
│ └─────────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ multi-tenant-enforcer                               │    │
│ │ → Criterio: 6 (CRÍTICO - NO tenant_id manual)       │    │
│ └─────────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ performance-analyzer                                │    │
│ │ → Criterio: 7 (Queries optimizados)                 │    │
│ └─────────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ security-auditor                                    │    │
│ │ → Validaciones de seguridad                         │    │
│ └─────────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ contract-compliance-validator                       │    │
│ │ → Criterio: 11 (OpenAPI contract)                   │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ Tiempo estimado: 3-5 minutos (paralelo)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 3: Generación de Comentarios (1 Agente)               │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐    │
│ │ pr-comment-generator                                │    │
│ │ 1. Recibe findings de 5 agentes                     │    │
│ │ 2. Mapea a 11 criterios                             │    │
│ │ 3. Identifica ubicación precisa                     │    │
│ │ 4. Clasifica tipo de comentario                     │    │
│ │ 5. Genera Conventional Comments (Castellano)        │    │
│ │ 6. Aplica tono cercano y amigable                   │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ Tiempo estimado: 1-2 minutos                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ OUTPUT FINAL                                                │
├─────────────────────────────────────────────────────────────┤
│ 1. Checklist de 11 criterios (✅/❌)                        │
│ 2. Lista de comentarios Conventional Comments               │
│ 3. Resumen de findings por severidad                        │
│ 4. Recomendación: APROBAR / SOLICITAR CAMBIOS              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Los 11 Criterios de Revisión

| # | Criterio | Agente Responsable | Severidad |
|---|----------|-------------------|-----------|
| 1 | Separación Input/Output en serializers | django-codebase-auditor | issue (blocking) |
| 2 | Lógica de negocio en servicios (NO views/serializers) | django-codebase-auditor | issue (blocking) |
| 3 | Type hints obligatorios | django-codebase-auditor | issue (blocking) |
| 4 | Tests con patrón AAA | django-codebase-auditor | issue (blocking) |
| 5 | Coverage 100% | django-codebase-auditor | issue (blocking) |
| 6 | NO filtrado manual de tenant_id | multi-tenant-enforcer | issue (blocking) CRÍTICO |
| 7 | Queries optimizados (select_related, prefetch_related) | performance-analyzer | suggestion (non-blocking) |
| 8 | Comentarios solo en inglés (filosofía YOLO) | django-codebase-auditor | suggestion (non-blocking) |
| 9 | Tests sin docstrings ni comentarios | django-codebase-auditor | issue (blocking) |
| 10 | Seguir guía de estilo del proyecto | django-codebase-auditor | suggestion (non-blocking) |
| 11 | Validar contra contrato OpenAPI | contract-compliance-validator | issue (blocking) |

**Detalle completo**: Ver `references/criterios-revision.md`

---

## 🚀 Flujo de Ejecución

### 1. FASE 1: Extracción de Contexto (30s)

```python
# Obtener información de la PR
pr_info = subprocess.run(["gh", "pr", "view", "--json", "title,body,author,headRefName,baseRefName,number"])

# Obtener diff con contexto
diff = subprocess.run(["git", "diff", "-U3", "origin/dev...HEAD"])

# Extraer comentarios existentes
comments = subprocess.run(["gh", "pr", "view", "--comments"])

# Identificar archivos cambiados
files_changed = subprocess.run(["git", "diff", "--name-only", "origin/dev...HEAD"])

# Parsear funciones/clases modificadas
# Usar ast.parse() para Python files
```

**Output**:
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
      "lines_added": 42,
      "lines_removed": 15,
      "functions_modified": [
        "TeamWithPermissionsInputSerializer.update",
        "TeamWithPermissionsInputSerializer.create"
      ]
    }
  ],
  "diff": "...",
  "existing_comments": []
}
```

### 2. FASE 2: Análisis Paralelo (3-5 min)

Lanzar 5 agentes en paralelo usando Task tool:

```python
# Lanzar todos en paralelo (1 mensaje con 5 Task tool calls)
findings = await parallel_tasks([
    Task(subagent_type="django-codebase-auditor",
         prompt=f"Analyze PR files: {files_changed}. Check criteria: 1,2,3,4,5,8,9,10",
         context=pr_context),

    Task(subagent_type="multi-tenant-enforcer",
         prompt=f"CRITICAL: Check for manual tenant_id filtering in: {files_changed}",
         context=pr_context),

    Task(subagent_type="performance-analyzer",
         prompt=f"Analyze query performance in: {files_changed}. Check for N+1, missing select_related",
         context=pr_context),

    Task(subagent_type="security-auditor",
         prompt=f"Security audit of: {files_changed}",
         context=pr_context),

    Task(subagent_type="contract-compliance-validator",
         prompt=f"Validate OpenAPI compliance for endpoints in: {files_changed}",
         context=pr_context)
])
```

**Output**:
```json
{
  "findings": [
    {
      "agent": "django-codebase-auditor",
      "criterion": 2,
      "severity": "issue",
      "blocking": true,
      "file": "apps/core/serializers/team.py",
      "line": 42,
      "function": "TeamWithPermissionsInputSerializer.update",
      "code_snippet": "new_permissions = FrontendPermissionsHelper.merge_permissions_to_store(...)",
      "issue": "Business logic in serializer",
      "suggestion": "Move to TeamService.update_team_permissions()"
    },
    {
      "agent": "performance-analyzer",
      "criterion": 7,
      "severity": "suggestion",
      "blocking": false,
      "file": "apps/core/views/team.py",
      "line": 10,
      "function": "TeamViewSet",
      "code_snippet": "queryset = Team.objects.all().order_by('name')",
      "issue": "Could optimize with select_related",
      "suggestion": "Add .select_related('company') if needed"
    }
  ]
}
```

### 3. FASE 3: Generación de Comentarios (1-2 min)

Lanzar agente `pr-comment-generator`:

```python
comments = Task(
    subagent_type="pr-comment-generator",
    prompt=f"""
    Generate Conventional Comments in Spanish for these findings:
    {json.dumps(findings)}

    Context:
    - PR: {pr_info}
    - Diff: {diff}
    - Files: {files_changed}

    Requirements:
    - Tone: cercano, amigable, sin formalismos (como "yo")
    - Format: Conventional Comments (praise/suggestion/issue/question/thought/typo)
    - Identify: archivo:línea (función/variable)
    - Decorators: (blocking) / (non-blocking)
    """,
    context=full_context
)
```

**Output**:
```markdown
## 📝 Comentarios de Revisión

### ❌ Issues (Blocking) - 2 encontrados

**apps/core/serializers/team.py:42** (TeamWithPermissionsInputSerializer.update)
issue (blocking): Veo que hay lógica de negocio en el método update del serializer. Según nuestra arquitectura, esto debería estar en TeamService. ¿Podrías moverlo a un método TeamService.update_team_permissions()?

**apps/core/tests/team_api_tests.py:158**
issue (blocking): Falta un test para el caso cuando datacenters está vacío. ¿Puedes añadir test_update_team_with_empty_datacenters_succeeds?

### 💡 Suggestions (Non-blocking) - 1 encontrado

**apps/core/views/team.py:10** (TeamViewSet.queryset)
suggestion (non-blocking): Podrías optimizar la query añadiendo .select_related('company') si necesitas acceder a company en las respuestas, evitarías un N+1.

### ✅ Praise - 2 encontrados

**apps/core/serializers/team.py:23**
praise: Me gusta cómo has separado Input/Output serializers aquí, queda muy limpio y sigue el patrón del proyecto. 👌

**apps/core/tests/team_api_tests.py:95**
praise: Excelente cobertura de tests, has cubierto todos los casos edge: crear, actualizar, patch, y empty datacenters. Muy completo!

### ❓ Questions - 1 encontrado

**apps/core/serializers/team.py:30** (datacenters field)
question: ¿Has considerado usar source='datacenters' directamente en lugar de source='datacenters_list'? Podría simplificar el código si no hay una razón específica.

---

## ✅ Checklist de Criterios

- ❌ **Criterio 1**: Separación Input/Output serializers → OK
- ❌ **Criterio 2**: Lógica en servicios → ISSUE (blocking en L42)
- ✅ **Criterio 3**: Type hints → OK
- ❌ **Criterio 4**: Tests AAA → ISSUE (falta test)
- ✅ **Criterio 5**: Coverage 100% → OK (390/390 tests)
- ✅ **Criterio 6**: NO tenant_id manual → OK (CRÍTICO)
- ⚠️ **Criterio 7**: Queries optimizados → SUGGESTION (L10)
- ✅ **Criterio 8**: Comentarios YOLO → OK
- ✅ **Criterio 9**: Tests sin docstrings → OK
- ✅ **Criterio 10**: Guía de estilo → OK
- ✅ **Criterio 11**: OpenAPI contract → OK

---

## 📊 Resumen

- **Issues (blocking)**: 2
- **Suggestions (non-blocking)**: 1
- **Praise**: 2
- **Questions**: 1
- **Total comentarios**: 6

## 🎯 Recomendación Final

❌ **SOLICITAR CAMBIOS**

Hay 2 issues blocking que deben resolverse antes del merge:
1. Mover lógica de negocio del serializer a TeamService
2. Añadir test faltante para datacenters vacío

Una vez resueltos estos issues, la PR estará lista para aprobar.
```

---

## 🎨 Conventional Comments - Tipos

### praise (✅)
Resalta algo positivo. Intenta dejar al menos uno por PR.

**Ejemplo**:
```
praise: Me gusta cómo has implementado el patrón Input/Output aquí, muy limpio! 👌
```

### suggestion (💡)
Propone mejoras al código actual. Debe ser explícito y claro.

**Ejemplo**:
```
suggestion (non-blocking): Podrías usar .select_related('company') aquí para evitar un N+1.
```

### issue (❌)
Problemas específicos que deben resolverse. Idealmente con sugerencia de solución.

**Ejemplo**:
```
issue (blocking): Veo lógica de negocio en el serializer. ¿Podrías moverlo a TeamService?
```

### question (❓)
Cuando tienes una duda y necesitas clarificación del autor.

**Ejemplo**:
```
question: ¿Por qué usas source='datacenters_list' en lugar de source='datacenters'?
```

### thought (💭)
Ideas que surgen de la revisión. Non-blocking por naturaleza.

**Ejemplo**:
```
thought: Esto me hace pensar que podríamos tener un helper genérico para permisos.
```

### typo (✏️)
Errores tipográficos o de nomenclatura.

**Ejemplo**:
```
typo: "datacenters_list" → debería ser "datacenter_list" (singular)?
```

---

## ⚙️ Configuración

### Variables de Entorno
```bash
# GitHub CLI (requerido)
gh auth status

# Git (requerido)
git --version
```

### Prerequisitos
- `gh` CLI instalado y autenticado
- `git` configurado
- Estar en la rama de la PR a revisar
- Base branch debe existir (típicamente `dev`)

---

## 📚 Archivos de Referencia

```
.claude/skills/github-pr-reviewer/
├── SKILL.md                           [Este archivo]
├── examples/
│   └── ejemplo-completo.md            Ejemplo real completo
├── templates/
│   └── conventional-comments.md       Plantillas de comentarios
└── references/
    └── criterios-revision.md          11 criterios explicados
```

---

## 🎯 Uso del Skill

### Caso 1: Revisar PR actual
```bash
# Estar en la rama de la PR
git checkout feature/JRV-435

# Invocar skill
User: "Revisa esta PR por favor"
Assistant: [Auto-activa github-pr-reviewer]
```

### Caso 2: Revisar PR específica
```bash
User: "Revisa la PR #123"
Assistant: [Auto-activa github-pr-reviewer con PR number]
```

### Caso 3: Re-revisar después de cambios
```bash
User: "He aplicado los cambios, revisa otra vez"
Assistant: [Re-ejecuta github-pr-reviewer]
```

---

## 📈 Métricas de Performance

| Métrica | Valor Esperado |
|---------|---------------|
| Tiempo total | 4-6 minutos |
| Fase 1 (Context) | 30 segundos |
| Fase 2 (Analysis) | 3-5 minutos (paralelo) |
| Fase 3 (Comments) | 1-2 minutos |
| Agentes ejecutados | 6 (5 análisis + 1 generador) |
| Paralelismo | 5 agentes en paralelo |
| Certeza | 95%+ |
| Hallucinations | Mínimas (agentes probados) |

---

## 🔍 Troubleshooting

### Error: "gh: command not found"
**Solución**: Instalar GitHub CLI
```bash
brew install gh
gh auth login
```

### Error: "Not in a git repository"
**Solución**: Verificar que estás en el directorio del proyecto
```bash
cd /path/to/binora-backend
git status
```

### Error: "No PR found"
**Solución**: Asegurar que estás en una rama con PR abierta
```bash
gh pr list
git checkout <branch-with-pr>
```

### Comentarios duplicados
**Solución**: El skill verifica comentarios existentes y evita duplicados automáticamente

---

## 🎓 Buenas Prácticas

### Para quien revisa:
1. ✅ Asignarse como Reviewer en GitHub
2. ✅ Leer atentamente la descripción de la PR
3. ✅ Ejecutar código en local antes de revisar
4. ✅ Crear todos los comentarios y publicarlos a la vez
5. ✅ Usar Conventional Comments con decoradores
6. ✅ Aprobar la PR una vez resueltos los comentarios

### Para quien abre la PR:
1. ✅ Reaccionar con 👍 a comentarios aceptados
2. ✅ Contestar SIEMPRE a los comentarios
3. ✅ Marcar como resueltos después del cambio
4. ✅ Solicitar re-revisión después de aplicar cambios

---

## 📝 Notas

- El skill detecta automáticamente el base branch (típicamente `dev`)
- Los comentarios se generan en Castellano con tono cercano
- Al menos 1 comentario `praise` por PR (buena práctica)
- Issues blocking deben resolverse antes del merge
- Suggestions non-blocking son opcionales pero recomendadas

---

## 🔄 Versioning

**v1.0.0** (2025-01-13)
- Initial release
- 11 criterios de revisión
- 6 agentes (1 nuevo + 5 existentes)
- Conventional Comments en Castellano
- Tono cercano y amigable

---

## 📞 Soporte

Para issues o mejoras:
- Ver ejemplos: `examples/ejemplo-completo.md`
- Ver criterios: `references/criterios-revision.md`
- Ver templates: `templates/conventional-comments.md`