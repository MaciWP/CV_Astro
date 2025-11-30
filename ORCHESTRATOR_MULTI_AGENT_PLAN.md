# Plan: 7 Agentes Dedicados para el Orquestador

## Problema

La skill `adaptive-meta-orchestrator` define 7 fases pero **no garantiza su ejecución**. El hook actual bloquea herramientas esperando la activación, pero el orquestador mismo no ejecuta cada fase como agente dedicado.

## Solución

Crear **7 agentes** (uno por fase) que se ejecuten en cadena obligatoria, integrando lo mejor de:

| Proyecto | Idea a Adoptar |
|----------|----------------|
| **orchestrator-alpha** | ReAct cycle, State file (.claude/state/), Reflexion, Circuit breaker (3 retries) |
| **claude_code_agent_farm** | Ejecución real via Task tool, output estructurado JSON |
| **claude-code-heavy** | Síntesis de outputs, coordinación por fases |

---

## Arquitectura

```
User Message
     ↓
┌─────────────────────────────────────────────┐
│  orchestrator-controller (nuevo)            │
│  Lee mensaje → Ejecuta 7 agentes en cascada │
│  State: .claude/state/current_task.json     │
└─────────────────────────────────────────────┘
     ↓
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
  ↓         ↓         ↓         ↓         ↓         ↓         ↓
Agent 0   Agent 1   Agent 2   Agent 3   Agent 4   Agent 5   Agent 6
```

---

## Arquitectura Multi-Agente por Fase

### Resumen de Modelos por Fase

| Fase | Agentes | Modelo | Ejecución |
|------|---------|--------|-----------|
| 0 | 1 | HAIKU | Secuencial |
| 1 | 4 | SONNET | **Paralelo** |
| 2 | 1 | HAIKU | Secuencial |
| 3 | 1 master + N dinámicos | **OPUS** | Híbrido |
| 4 | N según plan | **OPUS** | Según estrategia |
| 5 | N según validationGates | SONNET | **Paralelo** |
| 6 | 1 | HAIKU | Secuencial |

---

### Phase 0: Pre-Analysis (1 agente, HAIKU)

```yaml
agents:
  - phase-0-pre-analysis (haiku)
```

**Output**: `{ cached, budget, skip, proceed }`

---

### Phase 1: Evaluation (4 agentes en PARALELO, SONNET)

| Agente | Propósito | Model |
|--------|-----------|-------|
| `phase-1a-keyword-detector` | Detectar CRITICAL > HIGH > MEDIUM > LOW | sonnet |
| `phase-1b-complexity-scorer` | Score 0-100 (files, duration, deps, risk) | sonnet |
| `phase-1c-prompt-quality` | Score 0-100, enhance si <70% | sonnet |
| `phase-1d-confidence-assessor` | 95%+ execute, 70-94% verify, <70% ask | sonnet |

```
[Phase 1] Evaluation (4 agents parallel)
   ├── 1a: Keyword Detection...
   ├── 1b: Complexity Scoring...
   ├── 1c: Prompt Quality...
   └── 1d: Confidence Assessment...
```

**Combined Output**:
```json
{
  "keywords": [{"word": "astro", "priority": "MEDIUM"}],
  "complexity": {"total": 45, "breakdown": {...}},
  "promptQuality": {"score": 72, "enhanced": false},
  "confidence": {"level": 85, "action": "execute"}
}
```

---

### Phase 2: Context Loading (1 agente, HAIKU)

```yaml
agents:
  - phase-2-context-loader (haiku)
```

**Output**: `{ loaded, commands, skills_activated, tokens, projectContext }`

---

### Phase 3: Planning (1 master + N dinámicos, OPUS)

```yaml
master_agent:
  - phase-3-planner (opus)  # Decide qué agentes ejecutar

dynamic_agents:  # Activados según necesidad
  - task-decomposer (opus)      # Si complexity > 40
  - dependency-analyzer (opus)  # Si multiple files
  - tool-selector (opus)        # Siempre
  - strategy-determiner (opus)  # Siempre
```

**Flujo**:
```
[Phase 3] Planning (OPUS)
   ├── Master Planner analiza...
   ├── Decide N agentes necesarios:
   │   ├── task-decomposer (si complexity > 40)
   │   ├── dependency-analyzer (si multi-file)
   │   ├── tool-selector (siempre)
   │   └── strategy-determiner (siempre)
   └── Genera plan con lista de agentes para Phase 4
```

**Output** (define agentes para Phase 4 y 5):
```json
{
  "executionPlan": {
    "subtasks": [
      {"id": 1, "agent": "astro-component-generator", "model": "opus"},
      {"id": 2, "agent": "i18n-manager", "model": "opus"},
      {"id": 3, "agent": "seo-validator", "model": "sonnet"}
    ],
    "strategy": "hybrid",
    "dependencies": [[1], [2], [3]]
  },
  "validationPlan": {
    "gates": ["quality-validator", "security-scanner", "self-validator"]
  }
}
```

---

### Phase 4: Execution (N agentes según plan, OPUS)

**NO es 1 agente fijo** → Es la LISTA de agentes definida en Phase 3.

```yaml
coordinator:
  - phase-4-coordinator (opus)  # Coordina ejecución

dynamic_execution:  # Lista viene del plan
  - subtask_1.agent (opus)
  - subtask_2.agent (opus)
  - subtask_N.agent (opus)
```

**Flujo**:
```
[Phase 4] Execution (OPUS)
   ├── Coordinator lee executionPlan de Phase 3
   ├── Para cada subtask según strategy:
   │   ├── [4.1] astro-component-generator (opus)...
   │   ├── [4.2] i18n-manager (opus)...
   │   └── [4.N] agent_N (opus)...
   ├── State file actualizado después de cada uno
   └── Circuit breaker: 3 retries → preguntar usuario
```

**Output**:
```json
{
  "completed": [
    {"id": 1, "agent": "astro-component-generator", "status": "success"},
    {"id": 2, "agent": "i18n-manager", "status": "success"}
  ],
  "artifacts": ["src/components/Hero.astro"],
  "stateFile": ".claude/state/current_task.json"
}
```

---

### Phase 5: Validation (N agentes según validationPlan, SONNET)

**NO es 1 agente fijo** → Es la LISTA de agentes definida en Phase 3.validationPlan.

```yaml
coordinator:
  - phase-5-coordinator (sonnet)

dynamic_validators:  # Lista viene del plan
  - quality-validator (sonnet)     # lint, types
  - security-scanner (sonnet)      # secrets, XSS, SQLi
  - architecture-validator (sonnet) # patterns compliance
  - self-validator (sonnet)        # Glob→Grep→Read verification
```

**Flujo**:
```
[Phase 5] Validation (SONNET) - EN PARALELO
   ├── Coordinator lee validationPlan de Phase 3
   ├── Ejecuta validators en paralelo:
   │   ├── [5.1] quality-validator...
   │   ├── [5.2] security-scanner...
   │   ├── [5.3] architecture-validator...
   │   └── [5.4] self-validator...
   └── Consolida resultados
```

**Output**:
```json
{
  "passed": true,
  "gates": {
    "quality": {"passed": true, "agent": "quality-validator"},
    "security": {"passed": true, "agent": "security-scanner"},
    "architecture": {"passed": true, "agent": "architecture-validator"},
    "selfValidation": {"confidence": 95, "agent": "self-validator"}
  }
}
```

**Reflexion** (si falla cualquier gate):
```
Gate failed → reflexion-agent (sonnet):
  1. What went wrong?
  2. What assumption was incorrect?
  3. Suggest fix → retry Phase 4 con correcciones
```

---

### Phase 6: Consolidation (1 agente, HAIKU)

```yaml
agents:
  - phase-6-consolidation (haiku)
```

**Output**: `{ knowledge_saved, patterns_detected, metrics, suggestions }`

---

## Archivos a Crear/Reutilizar

### Lista Completa de Agentes por Fase

#### Phase 0 (1 agente NUEVO)
```
.claude/agents/
└── phase-0-pre-analysis.md    # NUEVO - cache, token budget
```

#### Phase 1 (4 agentes - 1 existente + 3 NUEVOS)
```
.claude/agents/
├── phase-1a-keyword-detector.md    # NUEVO
├── phase-1b-complexity-scorer.md   # REUTILIZAR complexity-analyzer.md
├── phase-1c-prompt-quality.md      # NUEVO
└── phase-1d-confidence-assessor.md # NUEVO
```

#### Phase 2 (1 agente existente)
```
.claude/agents/
└── phase-2-context-loader.md  # REUTILIZAR context-detector.md
```

#### Phase 3 (1 master + 4 dinámicos - 1 existente + 4 NUEVOS)
```
.claude/agents/
├── phase-3-planner.md          # NUEVO - master OPUS
├── phase-3-task-decomposer.md  # REUTILIZAR task-decomposer.md
├── phase-3-dependency-analyzer.md  # NUEVO
├── phase-3-tool-selector.md    # NUEVO
└── phase-3-strategy-determiner.md  # NUEVO
```

#### Phase 4 (1 coordinator + dinámicos)
```
.claude/agents/
└── phase-4-coordinator.md      # NUEVO - coordina ejecución OPUS
    # + N agentes dinámicos según plan (ya existentes o creados)
```

#### Phase 5 (1 coordinator + 4 validators)
```
.claude/agents/
├── phase-5-coordinator.md      # NUEVO
├── phase-5-quality-validator.md    # REUTILIZAR quality-validator.md
├── phase-5-security-scanner.md     # REUTILIZAR security-scanner.md
├── phase-5-architecture-validator.md  # NUEVO
├── phase-5-self-validator.md   # NUEVO
└── phase-5-reflexion.md        # NUEVO - para cuando falla
```

#### Phase 6 (1 agente existente)
```
.claude/agents/
└── phase-6-consolidation.md   # REUTILIZAR pattern-learner.md
```

### Resumen de Agentes

| Tipo | Cantidad | Detalle |
|------|----------|---------|
| **NUEVOS** | 12 | phase-0, phase-1a/1c/1d, phase-3-master/dependency/tool/strategy, phase-4-coord, phase-5-coord/arch/self/reflexion |
| **REUTILIZAR** | 6 | complexity-analyzer, context-detector, task-decomposer, quality-validator, security-scanner, pattern-learner |
| **TOTAL** | 18 | Agentes para orquestación completa |

### Controlador (1 nuevo)
```
.claude/skills/orchestrator-controller/SKILL.md
```
Este skill reemplaza al hook actual. En lugar de bloquear, ejecuta la cadena de agentes.

### State files (estructura)
```
.claude/state/
├── current_task.json      # Tarea activa (de orchestrator-alpha)
├── session_cache.json     # Cache de archivos leídos
├── memory_cache.json      # Patrones aprendidos
└── task_history.jsonl     # Historial de tareas
```

### Hook modificado
```
.claude/hooks/validate-orchestrator.py  # Cambiar de bloqueador a iniciador
```

---

## Flujo de Ejecución (Configuración Usuario)

**Decisiones del Usuario:**
- Fases 0-2: **PARALELO** (2x mas rapido)
- Logging: **PROGRESO** (mostrar fase actual)
- On Failure: **PREGUNTAR** (pausar y pedir decision)

```
1. Hook detecta mensaje → Invoca orchestrator-controller

2. FASE PARALELA (0-2):
   ┌─────────────────────────────────────────────┐
   │ [Fase 0/7] Pre-Analysis...                  │
   │ [Fase 1/7] Evaluation...                    │  ← EN PARALELO
   │ [Fase 2/7] Context Loading...               │
   └─────────────────────────────────────────────┘

3. FASE SECUENCIAL (3-6):
   [Fase 3/7] Planning...
   [Fase 4/7] Execution...
   [Fase 5/7] Validation...
   [Fase 6/7] Consolidation...

4. Si falla despues de 3 retries:
   ⚠️ "Phase X failed after 3 attempts. Options:"
   - [Retry] Intentar de nuevo
   - [Skip] Saltar esta fase
   - [Abort] Cancelar todo

5. Al completar:
   ✅ "Task completed in 12s"
   📊 Metrics: tokens, tools, speedup
   💡 Suggestions: patterns detected
```

---

## Ejemplo Completo

**User**: "Crea un componente Astro para el hero con i18n"

### Phase 0 Output:
```json
{"cached": [], "budget": "safe", "tokenUsage": 23, "proceed": true}
```

### Phase 1 Output:
```json
{"keywords": [{"word": "astro", "priority": "MEDIUM"}, {"word": "i18n", "priority": "MEDIUM"}], "complexity": {"total": 42}, "confidence": 88}
```

### Phase 2 Output:
```json
{"loaded": ["astro-component-generator"], "skills_activated": ["astro-component-generator"], "tokens": 1847}
```

### Phase 3 Output:
```json
{"strategy": "sequential", "subtasks": [{"id": 1, "description": "Generate Hero.astro"}, {"id": 2, "description": "Add translations"}]}
```

### Phase 4 Output:
```json
{"completed": [{"id": 1, "status": "success"}, {"id": 2, "status": "success"}], "artifacts": ["src/components/Hero.astro"]}
```

### Phase 5 Output:
```json
{"passed": true, "gates": {"lint": {"passed": true}}}
```

### Phase 6 Output:
```json
{"patterns_detected": [{"pattern": "astro+i18n", "occurrences": 3}], "metrics": {"duration": "8s"}}
```

---

## Orden de Implementación

1. **Crear state structure**: `.claude/state/` con archivos JSON
2. **Crear agentes 0-2** (haiku, rápidos): pre-analysis, evaluation, context-loader
3. **Crear agentes 3-5** (sonnet, complejos): planning, execution, validation
4. **Crear agente 6** (haiku, consolidation)
5. **Crear orchestrator-controller** skill
6. **Modificar hook** para iniciar cadena en lugar de bloquear
7. **Testing** con casos simples y complejos

---

## Archivos Críticos a Modificar

| Archivo | Acción |
|---------|--------|
| `.claude/hooks/validate-orchestrator.py` | Cambiar de bloqueador a iniciador de cadena |
| `.claude/settings.json` | Registrar 7 nuevos agentes |
| `.claude/skills/adaptive-meta-orchestrator/SKILL.md` | Referenciar a orchestrator-controller |

## Ideas de orchestrator-alpha Integradas

1. **ReAct Pattern**: Thought → Action → Observation en cada agente
2. **State File**: `.claude/state/current_task.json` para tracking
3. **Circuit Breaker**: Max 3 retries, luego BLOCKED
4. **Reflexion**: Auto-crítica cuando validation falla
5. **Plan-and-Solve**: Planificación explícita en Phase 3
6. **Tool Hierarchy**: Native > MCP > Agent > Bash

---

## Ideas Adicionales de Investigación Web (2025)

### De Anthropic Multi-Agent Research System
> Fuente: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

1. **Detailed Task Descriptions**: Cada subagente necesita:
   - Objetivo claro
   - Formato de output esperado
   - Herramientas/fuentes a usar
   - Límites claros de la tarea

2. **Paralelización Doble**:
   - Lead agent → 3-5 subagentes en paralelo
   - Cada subagente → 3+ tools en paralelo
   - **Resultado**: 90% reducción de tiempo en queries complejas

3. **State Management**: Orchestrator mantiene plan global + estado compacto, no todos los detalles

### De wshobson/agents (Referencia de Escala)
> Fuente: [wshobson/agents](https://github.com/wshobson/agents)

- 85 agentes especializados
- 15 workflow orchestrators
- 47 skills
- 44 tools
- **Validación**: Nuestros 18 agentes es un tamaño razonable para empezar

### De Swarms Framework
> Fuente: [Swarms Documentation](https://docs.swarms.world)

1. **MixtureOfAgents Pattern**:
   ```
   Task → [Expert 1, Expert 2, Expert 3] (paralelo)
        → Aggregator Agent (síntesis)
        → Final Output
   ```

2. **Token Cost Reality**:
   - Agentes usan ~4x más tokens que chat
   - Multi-agent usa ~15x más tokens que chat
   - **Conclusión**: Reservar multi-agent para tareas de alto valor

3. **Supervisor → Agents → Summarizer**: Patrón probado en producción

### De Andrew Ng (Reflection Pattern)
> Fuente: [Agentic Design Patterns Part 2](https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-2-reflection/)

1. **Self-Refine Loop**:
   ```
   Generate → Critique → Improve → Repeat
   ```

2. **Papers de Referencia**:
   - "Self-Refine: Iterative Refinement with Self-Feedback" (Madaan 2023)
   - "Reflexion: Language Agents with Verbal Reinforcement Learning" (Shinn 2023)
   - "CRITIC: LLMs Can Self-Correct with Tool-Interactive Critiquing" (Gou 2024)

3. **Aplicación a Phase 5**: Implementar loop automático de self-critique

### De Claude Code Best Practices (Anthropic)
> Fuente: [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

1. **Research-First**: Investigar y planificar ANTES de codificar
2. **Strong Subagent Use**: Para problemas complejos, usar subagentes para verificar detalles
3. **Early Verification**: Subagentes verifican detalles temprano en la conversación

---

## Optimizaciones Finales Recomendadas

### 1. Economía de Tokens
Dado que multi-agent = 15x más tokens:
- Fases 0, 2, 6 → HAIKU (económico, tareas simples)
- Fase 1 → SONNET (4 agentes paralelos, evaluación)
- Fases 3, 4 → OPUS (máxima calidad para planning/execution)
- Fase 5 → SONNET (validation paralela)

### 2. Paralelización Agresiva
```
ACTUAL:
  Phase 0 → Phase 1 → Phase 2 → Phase 3 → ...

OPTIMIZADO:
  [Phase 0 + Phase 1 + Phase 2] (paralelo) → Phase 3 → ...

  Dentro de Phase 1:
    [1a + 1b + 1c + 1d] (paralelo)

  Dentro de Phase 5:
    [5.1 + 5.2 + 5.3 + 5.4] (paralelo)
```

### 3. Early Exit Conditions
```python
# En Phase 0
if cached_result and confidence > 95:
    return cached_result  # Skip phases 1-5

# En Phase 1
if complexity < 20:
    skip_to_phase_4()  # Direct execution for trivial tasks

# En Phase 3
if single_file_change:
    skip_task_decomposer()  # No need for decomposition
```

### 4. Self-Validation Loop (Phase 5)
```
┌─────────────────────────────────────┐
│ Execute Phase 4                      │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│ Phase 5: Validate (parallel)         │
│ ├── quality-validator                │
│ ├── security-scanner                 │
│ ├── architecture-validator           │
│ └── self-validator (Glob→Grep→Read) │
└─────────────────┬───────────────────┘
                  ↓
           ┌──────┴──────┐
           │ All passed? │
           └──────┬──────┘
                  │
        ┌────────┴────────┐
        │                 │
       YES               NO
        │                 │
        ↓                 ↓
   Phase 6        reflexion-agent
                         │
                         ↓
                  Fix suggestions
                         │
                         ↓
                  Retry Phase 4
                  (max 3 times)
```

---

## Resumen Final

| Componente | Cantidad | Modelo | Estrategia |
|------------|----------|--------|------------|
| Agentes nuevos | 12 | Mixed | Crear desde cero |
| Agentes reutilizados | 6 | Mixed | Adaptar existentes |
| Skills | 1 | - | orchestrator-controller |
| State files | 4 | - | JSON tracking |
| Hooks | 1 | - | Modificar existente |

**Token Efficiency Target**:
- Simple tasks: ~500 tokens (haiku fast-path)
- Medium tasks: ~2,000 tokens (standard flow)
- Complex tasks: ~8,000 tokens (full multi-agent)

**Performance Target**:
- 90% reducción tiempo vs secuencial
- 3-5x speedup con paralelización
- <5s para tareas simples

---

*Plan actualizado: 2025-01-29*
*Versión: 2.0 (con investigación web)*