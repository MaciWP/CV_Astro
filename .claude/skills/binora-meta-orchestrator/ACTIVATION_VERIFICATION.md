# META-SKILL ORCHESTRATOR - Verification de Activación

**Skill**: Binora Backend Performance Orchestrator v5.0.0
**Status**: ✅ ACTIVE
**Mode**: ALWAYS-ACTIVE (se ejecuta en CADA request)

---

## ✅ Configuración Verificada

### 1. Instalación Correcta
- ✅ **Ubicación**: `.claude/skills/binora-backend-performance-orchestrator/`
- ✅ **Archivo**: `SKILL.md` presente
- ✅ **YAML**: Frontmatter válido
- ✅ **Nombre consistente**: Carpeta = `binora-backend-performance-orchestrator` = YAML `name`

### 2. Conflictos Resueltos
- ✅ **Skill anterior deshabilitado**: `_disabled_claude-code-performance-optimizer`
- ✅ **Único meta-orchestrator**: No hay otros skills ALWAYS-ACTIVE compitiendo

### 3. Configuración ALWAYS-ACTIVE
```yaml
name: binora-backend-performance-orchestrator
description: META-SKILL ORCHESTRATOR - ALWAYS-ACTIVE. Orchestrates 100% Binora Backend workflows...
keywords: [tenant_id, tenant, filter, ViewSet, service, Mock, query, ...]
version: 5.0.0
```

**Activation Criteria**:
- **Keywords**: ALWAYS-ACTIVE (no keywords required)
- **Context Triggers**: EVERY request without exception
- **Explicit Invocation**: Not required - auto-activates as meta-orchestrator

---

## 🔍 Cómo Verificar que se Está Ejecutando

### Test 1: Menciona keywords CRITICAL
Prompt de prueba:
```
"Añade un filter por tenant_id al User model"
```

**Resultado esperado:**
- Phase 0: Detecta keyword `tenant_id` → Risk CRITICAL
- Phase 0: Detecta keyword `filter` → Risk CRITICAL
- Phase 3: Activa `multi-tenant-guardian` (P0 CRITICAL)
- Phase 5: REJECT inmediatamente (P0 gate: NO manual tenant_id filtering)

---

### Test 2: Tarea compleja que requiere model selection
Prompt de prueba:
```
"Diseña una nueva arquitectura multi-tenant para el servicio de assets"
```

**Resultado esperado:**
- Phase 0: Complexity HIGH + Risk CRITICAL
- Phase 2: Model selection → **Opus 4** + Thinking (8192)
- Phase 4: MCP-first → `sequential-thinking` para ULTRATHINK
- Phase 5: Validación P0 gates

---

### Test 3: Optimización de herramientas
Prompt de prueba:
```
"Lee los archivos apps/core/views/user.py, apps/core/services.py, apps/core/serializers/user.py"
```

**Resultado esperado:**
- Phase 4: Detecta 3 Read independientes
- Sugerencia: Ejecutar en paralelo (single message, 3 Read calls)
- Tiempo: 2s vs 6s secuencial (3x faster)

---

### Test 4: MCP-first strategy
Prompt de prueba:
```
"¿Cómo optimizar QuerySets en Django?"
```

**Resultado esperado:**
- Phase 4: MCP-first strategy
- Usa `Context7("/django/django", "query optimization")` en lugar de WebSearch
- Tiempo: ~6s vs ~30s con WebSearch (5x faster)

---

## 📊 Indicadores de Activación Exitosa

Cuando el skill se ejecuta correctamente, deberías ver:

1. **Phase markers** en las respuestas:
   ```
   Phase 0: Pre-Analysis
   Phase 2: Workflow Planning
   Phase 3: Skill Coordination
   Phase 4: Tool Optimization
   Phase 5: Quality Assurance
   ```

2. **Skill activations** mencionadas:
   ```
   Phase 3: Activating multi-tenant-guardian (P0 CRITICAL)
   Phase 3: Activating django-architecture-enforcer (P0 CRITICAL)
   ```

3. **Model selection** explícita:
   ```
   Phase 2: Model selected → Sonnet 4.5 (Complexity MEDIUM, Risk HIGH)
   ```

4. **MCP usage** prioritario:
   ```
   Phase 4: Using Context7 MCP ("/django/django", "select_related")
   ```

5. **P0 gate validation** en outputs:
   ```
   Phase 5: ✅ NO manual tenant_id filtering
   Phase 5: ✅ Business logic in services
   Phase 5: ✅ Using mocker.Mock()
   ```

---

## ⚠️ Troubleshooting

### Si el skill NO se activa:

1. **Verificar que existe el archivo**:
   ```bash
   ls -la .claude/skills/binora-backend-performance-orchestrator/SKILL.md
   ```

2. **Verificar YAML válido**:
   ```bash
   head -n 10 .claude/skills/binora-backend-performance-orchestrator/SKILL.md
   ```

3. **Verificar que no hay otros orchestrators activos**:
   ```bash
   grep -r "ALWAYS-ACTIVE" .claude/skills/*/SKILL.md
   ```

4. **Reiniciar Claude Code**:
   - Claude Code detecta skills al inicio
   - Si acabas de modificar el skill, reinicia la sesión

5. **Verificar logs** (si disponibles):
   - Claude Code puede tener logs de skill activation
   - Busca mensajes de error en la consola

---

## 🎯 Expected Behavior

**En CADA request, el skill debería:**

1. **Phase 0** (Pre-Analysis): Evaluar score y detectar keywords CRITICAL
2. **Phase 1** (Request Analysis): Mejorar prompt si score <90
3. **Phase 2** (Workflow Planning): Clasificar tarea y seleccionar modelo óptimo
4. **Phase 3** (Skill Coordination): Activar skills P0 CRITICAL y sugerir P1-P3
5. **Phase 4** (Tool Optimization): Priorizar MCPs y ejecución paralela
6. **Phase 5** (Quality Assurance): Validar P0 gates con fail-fast

**Overhead esperado**: ~500 tokens para requests simples (score >90, skip Phase 1)

**Performance esperada**: 3-5x speedup vs workflow manual

---

## ✅ Confirmation

Si ves este documento, significa que el skill ha sido:
- ✅ Correctamente instalado
- ✅ Renombrado para consistencia
- ✅ Configurado como ALWAYS-ACTIVE
- ✅ Conflictos resueltos (skill anterior deshabilitado)

**El META-SKILL ORCHESTRATOR v5.0.0 está listo para ejecutarse al 100% en cada prompt.**

---

**Última actualización**: 2025-01-13
**Versión del skill**: 5.0.0
**Status**: PRODUCTION-READY ✅