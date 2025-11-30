# Plan: Orquestador Multi-Agente v3.7 - Ejecución Garantizada (FINAL)

> **Changelog**:
> - v3.3: Phase 3 Decomposition, Error Recovery, Self-Improvement, KPIs
> - v3.4: Iterative Planning HITL, Memory Management (MemGPT), Langfuse Observability
> - v3.5: Self-Critique Loop, Testing para Auto-Mejora, Cost-Efficiency ROI
> - v3.6: Prompt Chain Analysis (detectar qué fase falló), Agent Communication Protocol
> - v3.7: Conflict Resolution, Graceful Degradation, User Trust Levels, Explainability (FINAL)

## Análisis del Plan Actual

El plan en `ORCHESTRATOR_MULTI_AGENT_PLAN.md` tiene:
- **Fortalezas**: 7 fases bien definidas, 18 agentes, selección de modelos (Haiku/Sonnet/Opus), ReAct pattern
- **Debilidad CRÍTICA**: No garantiza ejecución - el hook actual bloquea pero NO EJECUTA las fases

## Insights de Expertos Mundiales

### 1. Andrew Ng - 4 Agentic Design Patterns
> Fuente: [DeepLearning.AI Course](https://www.deeplearning.ai/courses/agentic-ai/)

| Pattern | Estado Actual | Mejora Necesaria |
|---------|---------------|------------------|
| **Reflection** | Parcial (Phase 5) | Ampliar a TODAS las fases |
| **Tool Use** | Sí | OK |
| **Planning** | Sí (Phase 3) | Añadir decomposition formal |
| **Multi-Agent** | Sí | OK |

**Insight clave**: "The single biggest predictor of success is evaluation-driven development" → **Añadir métricas y evals a cada fase**

### 2. Anthropic - Multi-Agent Research System
> Fuente: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

**Reglas de Escalado** (FALTABAN en el plan):
```
Simple (fact-finding):     1 agent,  3-10 tool calls
Direct comparisons:        2-4 agents, 10-15 calls each
Complex research:          10+ agents, divided responsibilities
```

**Requisitos por Subagente** (FALTABAN):
- Objetivo claro
- Formato de output esperado
- Herramientas/fuentes a usar
- Límites claros de la tarea

**Resultado**: 90.2% improvement vs single-agent

### 3. OpenAI Swarm → Agents SDK
> Fuente: [OpenAI Swarm GitHub](https://github.com/openai/swarm)

**Handoffs Pattern** (FALTABA):
```
Agent A completa → Handoff explícito → Agent B recibe contexto
                     ↓
              NO transfer implícito
              SÍ función explícita
```

### 4. Guardrails / Tripwire Mechanism
> Fuente: [OpenAI Agents SDK Guardrails](https://openai.github.io/openai-agents-python/guardrails/)

**Niveles de Enforcement** (CRÍTICO - esto falta):
```json
{
  "enforcement": "block",  // vs "suggest"
  "tripwire": true,        // halt execution if violated
  "run_in_parallel": false // guardrail completes BEFORE agent
}
```

### 5. Claude Code Skills Enforcement Problem
> Fuente: [How to Make Claude Code Skills Activate Reliably](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably)

**Problema**: Skills solo activan 50% de las veces
**Solución probada** (80-84% success):

```
"Step 1 - EVALUATE: For each skill, state YES/NO with reason
 Step 2 - ACTIVATE: Use Skill() tool NOW
 Step 3 - IMPLEMENT: Only after activation"
```

**Lenguaje agresivo ayuda**: "MANDATORY", "CRITICAL", "WORTHLESS without"

### 6. wshobson/agents - Referencia de Escala
> Fuente: [wshobson/agents](https://github.com/wshobson/agents)

- 85 agents, 15 orchestrators, 47 skills
- **Pattern**: Single responsibility + Sonnet/Haiku orchestration
- **Validación**: Nuestros 18 agentes es razonable

---

## Problemas Identificados en Plan Actual

| # | Problema | Impacto | Solución |
|---|----------|---------|----------|
| 1 | **Hook bloquea pero NO ejecuta** | Fases no se ejecutan | Cambiar a INICIAR cadena |
| 2 | **Sin enforcement levels** | Skills opcionales | Añadir `enforcement: "block"` |
| 3 | **Sin tripwire mechanism** | Errores no detienen | Añadir halt on violation |
| 4 | **Sin scaling rules** | Over/under-investment | Añadir reglas 1/2-4/10+ |
| 5 | **Sin handoffs explícitos** | Contexto perdido entre fases | Añadir handoff functions |
| 6 | **Sin forced evaluation** | 50% activation rate | Añadir 3-step eval |
| 7 | **Sin métricas por fase** | No eval-driven | Añadir evals |

---

## Plan Mejorado v3.0

### Arquitectura: Guaranteed Execution System

```
User Message
     ↓
┌─────────────────────────────────────────────────────────────┐
│  GUARDRAIL LAYER (Pre-Execution)                            │
│  ├── Input Validation                                       │
│  ├── Tripwire Check (halt if CRITICAL violation)           │
│  └── Forced Evaluation (3-step: EVALUATE → ACTIVATE → RUN) │
└─────────────────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR-CONTROLLER (Replaces blocking hook)           │
│  ├── Scaling Decision (1 / 2-4 / 10+ agents)               │
│  ├── Handoff Manager (explicit context transfer)           │
│  └── Phase Executor (GUARANTEES all 7 phases run)          │
└─────────────────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────────────────┐
│  7 PHASES (Mandatory Execution)                             │
│  Phase 0 → Handoff → Phase 1 → ... → Phase 6               │
│       ↓         ↓         ↓                                │
│  [metrics]  [metrics]  [metrics]  ← Eval-driven            │
└─────────────────────────────────────────────────────────────┘
```

### Nuevo: skill-rules.json (Enforcement)

```json
{
  "rules": [
    {
      "skillId": "phase-0-pre-analysis",
      "enforcement": "block",
      "priority": "critical",
      "tripwire": true,
      "promptTriggers": {
        "keywords": ["*"],
        "intent": ["any"]
      },
      "message": "MANDATORY: Phase 0 must execute before ANY action"
    },
    {
      "skillId": "phase-1-evaluation",
      "enforcement": "block",
      "priority": "critical",
      "dependsOn": ["phase-0-pre-analysis"],
      "tripwire": true
    }
  ],
  "globalSettings": {
    "haltOnTripwire": true,
    "requireExplicitHandoffs": true,
    "forcedEvaluation": true
  }
}
```

### Nuevo: Forced Evaluation Hook

```python
# .claude/hooks/forced-evaluation.py
"""
MANDATORY 3-STEP EVALUATION
Runs BEFORE any tool execution
"""

EVALUATION_PROMPT = """
CRITICAL: You MUST complete these 3 steps IN ORDER:

STEP 1 - EVALUATE (MANDATORY):
For EACH phase 0-6, state:
- Phase 0 (Pre-Analysis): YES/NO - Reason: ___
- Phase 1 (Evaluation): YES/NO - Reason: ___
- Phase 2 (Context): YES/NO - Reason: ___
- Phase 3 (Planning): YES/NO - Reason: ___
- Phase 4 (Execution): YES/NO - Reason: ___
- Phase 5 (Validation): YES/NO - Reason: ___
- Phase 6 (Consolidation): YES/NO - Reason: ___

STEP 2 - ACTIVATE (MANDATORY):
Use the Skill('orchestrator-controller') tool NOW.
This step is WORTHLESS if you skip it.

STEP 3 - IMPLEMENT:
Only proceed AFTER Step 1 and 2 are complete.

⚠️ VIOLATION of this sequence = BLOCKED EXECUTION
"""
```

### Nuevo: Explicit Handoff Functions

```typescript
// Handoff between phases (OpenAI Swarm pattern)
interface PhaseHandoff {
  fromPhase: number;
  toPhase: number;
  context: {
    previousOutput: JSON;
    tokensUsed: number;
    metricsCollected: PhaseMetrics;
    stateSnapshot: StateFile;
  };
  transferFunction: () => void;
}

// Example: Phase 1 → Phase 2 handoff
const handoff_1_to_2: PhaseHandoff = {
  fromPhase: 1,
  toPhase: 2,
  context: {
    previousOutput: phase1Output,
    tokensUsed: 847,
    metricsCollected: { keywords: [...], complexity: 45, confidence: 88 }
  },
  transferFunction: () => {
    // Save state
    writeStateFile(`.claude/state/phase1_complete.json`, context);
    // Initialize next phase with context
    initializePhase2(context);
  }
};
```

### Nuevo: Scaling Rules (Anthropic Pattern)

```yaml
# .claude/config/scaling-rules.yaml
scaling:
  simple:
    complexity: 0-30
    agents: 1
    toolCalls: 3-10
    example: "What is X?"

  standard:
    complexity: 31-60
    agents: 2-4
    toolCalls: 10-15 each
    example: "Compare X vs Y"

  complex:
    complexity: 61-100
    agents: 5-10+
    toolCalls: divided responsibilities
    example: "Implement full feature with tests"

subagentRequirements:
  - objective: "Clear, specific goal"
  - outputFormat: "Expected JSON/text structure"
  - tools: "List of allowed tools"
  - boundaries: "What NOT to do"
```

### Nuevo: Phase Metrics (Eval-Driven)

```json
{
  "phaseMetrics": {
    "phase0": {
      "successRate": 0.95,
      "avgDuration": "0.3s",
      "tokensUsed": 50,
      "failureReasons": []
    },
    "phase1": {
      "successRate": 0.88,
      "avgDuration": "1.2s",
      "tokensUsed": 320,
      "failureReasons": ["keyword_miss", "complexity_underestimate"]
    }
  },
  "evaluationCriteria": {
    "phase0": ["cache_hit_rate", "budget_accuracy"],
    "phase1": ["keyword_precision", "complexity_calibration", "confidence_accuracy"],
    "phase2": ["context_relevance", "token_efficiency"],
    "phase3": ["plan_completeness", "decomposition_quality"],
    "phase4": ["execution_success", "artifact_quality"],
    "phase5": ["validation_thoroughness", "false_positive_rate"],
    "phase6": ["pattern_detection_accuracy", "knowledge_persistence"]
  }
}
```

---

## Archivos a Crear/Modificar

### NUEVOS (8 archivos)

| Archivo | Propósito |
|---------|-----------|
| `.claude/config/skill-rules.json` | Enforcement levels + tripwires |
| `.claude/config/scaling-rules.yaml` | Anthropic scaling patterns |
| `.claude/hooks/forced-evaluation.py` | 3-step mandatory evaluation |
| `.claude/hooks/tripwire-handler.py` | Halt on CRITICAL violations |
| `.claude/lib/handoff-manager.ts` | Explicit phase handoffs |
| `.claude/lib/phase-metrics.ts` | Eval-driven metrics collection |
| `.claude/state/phase_metrics.json` | Metrics persistence |
| `.claude/skills/orchestrator-controller/SKILL.md` | Main controller (replaces hook) |

### MODIFICAR (3 archivos)

| Archivo | Cambio |
|---------|--------|
| `.claude/hooks/validate-orchestrator.py` | Bloqueador → Iniciador + Forced Eval |
| `.claude/settings.json` | Registrar nuevos hooks y reglas |
| `CLAUDE.md` | Actualizar con nuevo flujo |

### AGENTES (mismo que plan v2.0)

12 nuevos + 6 reutilizados = 18 total

---

## Diferencias vs Plan v2.0

| Aspecto | v2.0 | v3.0 | v3.1 (NUEVO) |
|---------|------|------|--------------|
| **Enforcement** | Ninguno | `block` + `tripwire` | ✓ Igual |
| **Activation** | Hook bloquea | Forced Evaluation | ✓ Igual |
| **Handoffs** | Implícitos | Explícitos | ✓ Igual |
| **Scaling** | Fijo | Dinámico | ✓ Igual |
| **Metrics** | Solo final | Por fase | ✓ Igual |
| **Prompt Enhancement** | - | - | **HITL con 3 variantes** |
| **State Machine** | - | - | **Checkpoints completos** |
| **Prompt Caching** | - | - | **90% cost reduction** |
| **Fases 0-2** | Paralelo | Paralelo | **Hybrid (0+1 parallel, 2 seq)** |

---

## NUEVO: Prompt Enhancement con HITL

### Flujo cuando Prompt Quality < 70%

```
User Request
     ↓
Phase 1c: prompt-quality-scorer
     ↓
Score < 70%? ──NO──→ Continuar normal
     │
    YES
     ↓
┌─────────────────────────────────────────────────────────────┐
│  prompt-enhancer-agent (SONNET)                             │
│                                                             │
│  Input: Original prompt + scoring breakdown                 │
│  Output: 3 enhanced variants con scores                     │
│                                                             │
│  Técnicas aplicadas:                                        │
│  - XML structure (Anthropic best practice)                  │
│  - Chain of Thought triggers                                │
│  - Quote grounding (citar del mensaje original)             │
│  - Specificity improvements                                 │
└─────────────────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────────────────┐
│  CHECKPOINT: Human Decision (AskUserQuestion)               │
│                                                             │
│  "⚠️ Tu prompt tiene calidad 58/100.                        │
│   Problema detectado: Falta contexto específico.            │
│                                                             │
│   Opciones mejoradas:                                       │
│                                                             │
│   [A] (Score 85/100):                                       │
│   'Crea un componente Astro <Hero> con TypeScript Props     │
│    interface, integración i18n usando t(), y estilos        │
│    TailwindCSS. Incluir responsive design para mobile.'     │
│                                                             │
│   [B] (Score 82/100): ...                                   │
│   [C] (Score 78/100): ...                                   │
│   [D] Usar original (58/100)                                │
│   [E] Escribir mi propio prompt                             │"
└─────────────────────────────────────────────────────────────┘
     ↓
Usuario selecciona opción
     ↓
RESTART desde Phase 1 con nuevo prompt
(State machine guarda que venimos de enhancement)
```

### prompt-enhancer-agent.md

```yaml
---
name: prompt-enhancer-agent
description: Generates 3 enhanced prompt variants when quality < 70%
model: sonnet
tools: [Read, AskUserQuestion]
activation:
  triggers:
    - promptQuality < 70
  priority: CRITICAL
---

## Mission
Transform low-quality prompts into high-quality variants using Anthropic best practices.

## Output Format
{
  "original": { "text": "...", "score": 58, "issues": ["vague", "no context"] },
  "variants": [
    { "text": "...", "score": 85, "improvements": ["added XML", "specificity"] },
    { "text": "...", "score": 82, "improvements": [...] },
    { "text": "...", "score": 78, "improvements": [...] }
  ],
  "recommendation": "A"
}

## Enhancement Techniques
1. **XML Structure**: Wrap context in <context>, instructions in <task>
2. **Chain of Thought**: Add "Think step by step" or "Let's approach this systematically"
3. **Quote Grounding**: Reference specific parts of user's original request
4. **Specificity**: Add concrete details (file paths, component names, patterns)
5. **Examples**: Include 1-2 examples of expected output format
```

---

## NUEVO: State Machine con Checkpoints

### Arquitectura de Estado

```
.claude/state/
├── workflow_state.json      # Estado actual del workflow
├── phase_snapshots/         # Snapshots por fase
│   ├── phase_0_complete.json
│   ├── phase_1_complete.json
│   └── ...
├── prompt_history.jsonl     # Historial de prompts (incluyendo enhancements)
└── rollback_points.json     # Puntos de rollback disponibles
```

### workflow_state.json

```json
{
  "taskId": "task_abc123",
  "originalPrompt": "Crea un componente hero",
  "currentPrompt": "Crea componente Astro <Hero>...",  // Puede ser enhanced
  "promptEnhanced": true,
  "currentPhase": 3,
  "status": "in_progress",
  "checkpoint": "planning_started",
  "canRestart": true,
  "canRollback": true,
  "rollbackTo": [0, 1, 2],
  "history": [
    {
      "phase": 0,
      "status": "complete",
      "duration": "0.3s",
      "tokens": 50,
      "snapshot": "phase_snapshots/phase_0_complete.json"
    },
    {
      "phase": 1,
      "status": "complete",
      "duration": "1.2s",
      "tokens": 320,
      "promptQuality": 58,
      "enhanced": true,
      "newPromptQuality": 85
    }
  ],
  "created": "2025-01-29T10:00:00Z",
  "updated": "2025-01-29T10:01:30Z"
}
```

### Operaciones de State Machine

```typescript
// Checkpoint: Guardar estado después de cada fase
async function checkpoint(phase: number, output: PhaseOutput) {
  const snapshot = {
    phase,
    output,
    timestamp: new Date().toISOString(),
    tokensUsed: output.tokensUsed,
    canRollbackFrom: true
  };
  await saveSnapshot(`phase_${phase}_complete.json`, snapshot);
  await updateWorkflowState({ currentPhase: phase, status: 'checkpoint' });
}

// Restart: Volver a empezar desde Phase 1 con nuevo prompt
async function restartWithNewPrompt(newPrompt: string) {
  await updateWorkflowState({
    currentPrompt: newPrompt,
    promptEnhanced: true,
    currentPhase: 1,
    status: 'restarting'
  });
  // Clear phases 1-6 snapshots
  await clearSnapshotsFrom(1);
  // Re-run from Phase 1
  return executeFromPhase(1);
}

// Rollback: Volver a una fase anterior
async function rollbackToPhase(targetPhase: number) {
  const snapshot = await loadSnapshot(`phase_${targetPhase}_complete.json`);
  await updateWorkflowState({
    currentPhase: targetPhase,
    status: 'rolled_back'
  });
  return executeFromPhase(targetPhase + 1, snapshot.output);
}

// Resume: Continuar después de interrupción
async function resumeFromLastCheckpoint() {
  const state = await loadWorkflowState();
  const lastSnapshot = await loadSnapshot(`phase_${state.currentPhase}_complete.json`);
  return executeFromPhase(state.currentPhase + 1, lastSnapshot.output);
}
```

### Comandos de Usuario para State Machine

```
/orchestrator status     → Mostrar estado actual del workflow
/orchestrator rollback 2 → Volver a Phase 2 y re-ejecutar desde ahí
/orchestrator restart    → Restart completo desde Phase 0
/orchestrator resume     → Continuar desde último checkpoint
```

---

## NUEVO: Prompt Caching de Anthropic

### Implementación

```typescript
// Cache configuration
const CACHE_CONFIG = {
  ttl: '5min',  // Default TTL (se renueva con cada uso)
  minTokens: 1024,  // Mínimo para cachear
  breakpoints: [
    { content: 'CLAUDE.md', tokens: 4000 },
    { content: 'skill_definitions', tokens: 2000 },
    { content: 'project_context', tokens: 1500 }
  ]
};

// Cached content structure
const cachedSystemPrompt = {
  type: 'text',
  text: claudeMdContent + skillDefinitions + projectContext,
  cache_control: { type: 'ephemeral' }  // 5 min TTL
};
```

### Beneficios Esperados

| Métrica | Sin Cache | Con Cache | Mejora |
|---------|-----------|-----------|--------|
| Latencia (100K tokens) | 11.5s | 2.4s | **79%** |
| Costo por request | 100% | 10% (read) | **90%** |
| ITPM usage | Cuenta | No cuenta (Claude 3.7+) | **Throughput ↑** |

### Qué Cachear

```
CACHEAR (alto reuso, >1024 tokens):
✓ CLAUDE.md (~4K tokens)
✓ adaptive-meta-orchestrator/SKILL.md (~4K tokens)
✓ Project context cv-astro (~1.5K tokens)
✓ Skill definitions (~2K tokens)

NO CACHEAR (bajo reuso, dinámico):
✗ User messages (únicos)
✗ Phase outputs (cambian)
✗ Tool results (dinámicos)
```

---

## NUEVO: Fases 0-2 Estrategia Híbrida

### Análisis de Dependencias

```
Phase 0 (Pre-Analysis)
├── Input:  User message
├── Output: { cached, budget, skip }
└── Deps:   NINGUNA ✓

Phase 1 (Evaluation)
├── Input:  User message
├── Output: { keywords, complexity, promptQuality, confidence }
└── Deps:   NINGUNA ✓

Phase 2 (Context Loading)
├── Input:  Keywords (de Phase 1), Cache status (de Phase 0)
├── Output: { loaded, commands, skills_activated }
└── Deps:   REQUIERE Phase 0 Y Phase 1 ✗
```

### Estrategia Óptima: Hybrid

```
ANTES (secuencial):
Phase 0 (0.3s) → Phase 1 (1.2s) → Phase 2 (0.8s)
Total: 2.3s

AHORA (hybrid):
┌─────────────┐  ┌─────────────┐
│  Phase 0    │  │  Phase 1    │
│   (0.3s)    │  │   (1.2s)    │
└──────┬──────┘  └──────┬──────┘
       │   PARALLEL     │
       └────────┬───────┘
                ↓ wait for both
        ┌───────────────┐
        │    Phase 2    │
        │    (0.8s)     │
        └───────────────┘

Total: 1.2s + 0.8s = 2.0s
Speedup: 13% (minor pero sin race conditions)
```

### Implementación

```typescript
// Hybrid execution for phases 0-2
async function executePhases0to2(userMessage: string) {
  // Run Phase 0 and Phase 1 in parallel
  const [phase0Result, phase1Result] = await Promise.all([
    executePhase0(userMessage),  // Pre-Analysis (haiku)
    executePhase1(userMessage)   // Evaluation (sonnet, 4 agents parallel)
  ]);

  // Phase 1c: Check prompt quality
  if (phase1Result.promptQuality.score < 70) {
    // HITL: Prompt enhancement flow
    const enhancedPrompt = await promptEnhancementHITL(
      userMessage,
      phase1Result.promptQuality
    );
    if (enhancedPrompt !== userMessage) {
      // RESTART with new prompt
      return restartWithNewPrompt(enhancedPrompt);
    }
  }

  // Phase 2 needs both results
  const phase2Result = await executePhase2({
    keywords: phase1Result.keywords,
    cacheStatus: phase0Result.cached,
    complexity: phase1Result.complexity
  });

  return { phase0Result, phase1Result, phase2Result };
}
```

---

## Resumen de Cambios v3.0 → v3.1

| Feature | Descripción | Beneficio |
|---------|-------------|-----------|
| **Prompt Enhancement HITL** | 3 variantes + user choice + restart | Calidad de prompts ↑, control usuario |
| **State Machine completa** | Checkpoints, rollback, restart, resume | Resiliencia, recuperación de errores |
| **Prompt Caching** | Cachear CLAUDE.md, skills, context | 90% menos costo, 79% menos latencia |
| **Hybrid Phases 0-2** | 0+1 parallel → 2 sequential | 13% speedup, sin race conditions |

---

## NUEVO v3.3: Phase 3 - Decomposition (NUEVA FASE)

### Justificación

> "Antes de planificar, primero descomponer. Tareas pequeñas = más fáciles de ejecutar para los agentes."

Esta fase se inserta entre Context Loading (Phase 2) y Planning (Phase 4, antes Phase 3).

**Beneficios investigados**:
- [AgentCoder](https://arxiv.org/abs/2506.02943): Separar roles en agentes especializados → **13-15% mejora en coverage**
- [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system): "Divide responsibilities clearly" → 90.2% improvement
- [CANDOR Framework](https://arxiv.org/html/2408.03095v6): Multi-agent orchestration for task generation

### Nueva Estructura de Fases (0-7)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  8 FASES (antes 7)                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 0: Pre-Analysis      → Cache check, budget, skip decisions           │
│  Phase 1: Evaluation        → Keywords, complexity, prompt quality          │
│  Phase 2: Context Loading   → Load minimal context (<3K tokens)             │
│  Phase 3: DECOMPOSITION     → 🆕 Listar + descomponer tareas               │
│  Phase 4: Planning          → Selección de herramientas, estrategia         │
│  Phase 5: Execution         → Ejecutar plan con agentes                     │
│  Phase 6: Validation        → Quality gates, security, tests                │
│  Phase 7: Consolidation     → Aprender, guardar patrones                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 3: Decomposition (2 Agentes Secuenciales)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: DECOMPOSITION                                                     │
│  Model: Sonnet (balance calidad/velocidad)                                  │
│  Agentes: 2 (secuenciales)                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Input: Context loaded + User objective + Complexity score                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Agent 3a: task-lister-agent                                        │   │
│  │  ─────────────────────────────                                      │   │
│  │  Mission: Analizar objetivo y listar ALL tareas de alto nivel       │   │
│  │                                                                     │   │
│  │  Output: {                                                          │   │
│  │    "objective": "Implement user authentication",                    │   │
│  │    "highLevelTasks": [                                              │   │
│  │      { "id": "T1", "name": "Create User model", "type": "model" },  │   │
│  │      { "id": "T2", "name": "Create auth endpoints", "type": "api" },│   │
│  │      { "id": "T3", "name": "Add JWT middleware", "type": "security"}│   │
│  │    ],                                                               │   │
│  │    "dependencies": { "T2": ["T1"], "T3": ["T1"] },                  │   │
│  │    "estimatedComplexity": 75                                        │   │
│  │  }                                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         ↓                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Agent 3b: task-decomposer-agent                                    │   │
│  │  ─────────────────────────────────                                  │   │
│  │  Mission: Descomponer cada tarea en subtareas atómicas ejecutables  │   │
│  │                                                                     │   │
│  │  Rules:                                                             │   │
│  │  - Cada subtarea debe ser ejecutable por UN agente                  │   │
│  │  - Tamaño óptimo: 3-7 subtareas por tarea principal                │   │
│  │  - Debe especificar: files, tools, validation criteria              │   │
│  │                                                                     │   │
│  │  Output: {                                                          │   │
│  │    "tasks": [                                                       │   │
│  │      {                                                              │   │
│  │        "parentId": "T1",                                            │   │
│  │        "subtasks": [                                                │   │
│  │          {                                                          │   │
│  │            "id": "T1.1",                                            │   │
│  │            "action": "Create User model with fields",               │   │
│  │            "files": ["models/user.py"],                             │   │
│  │            "tools": ["Write", "Edit"],                              │   │
│  │            "validation": "Model passes type check",                 │   │
│  │            "estimatedTokens": 200,                                  │   │
│  │            "assignedModel": "haiku"                                 │   │
│  │          },                                                         │   │
│  │          {                                                          │   │
│  │            "id": "T1.2",                                            │   │
│  │            "action": "Add migration for User table",                │   │
│  │            "files": ["migrations/001_user.py"],                     │   │
│  │            "tools": ["Bash", "Write"],                              │   │
│  │            "validation": "Migration applies successfully"           │   │
│  │          }                                                          │   │
│  │        ]                                                            │   │
│  │      }                                                              │   │
│  │    ],                                                               │   │
│  │    "executionOrder": ["T1.1", "T1.2", "T2.1", ...],                │   │
│  │    "parallelizable": [["T2.1", "T3.1"]],                           │   │
│  │    "totalSubtasks": 12                                              │   │
│  │  }                                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Output: Decomposed task list ready for Phase 4 (Planning)                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Agent Specifications

#### task-lister-agent.md

```yaml
---
name: task-lister-agent
description: Lists all high-level tasks from user objective and loaded context
model: sonnet
phase: 3a
tools: [Read, Grep, Glob]
activation:
  triggers:
    - phase3_start
  priority: CRITICAL
  enforcement: block
---

## Mission
Analyze the user's objective and loaded context to produce a comprehensive list of high-level tasks.

## Input
- User objective (original or enhanced prompt)
- Loaded context (files, dependencies, patterns)
- Complexity score from Phase 1

## Output Format
{
  "objective": "string - clear statement of what user wants",
  "highLevelTasks": [
    {
      "id": "T{n}",
      "name": "string - task name",
      "type": "model|api|ui|test|config|security|docs",
      "description": "string - what this task accomplishes",
      "affectedFiles": ["string - file paths or patterns"],
      "requiredContext": ["string - what context is needed"]
    }
  ],
  "dependencies": {
    "T2": ["T1"],  // T2 depends on T1
    "T3": ["T1", "T2"]  // T3 depends on T1 and T2
  },
  "estimatedComplexity": number  // Refined complexity after analysis
}

## Rules
1. NEVER skip this phase - even simple tasks need decomposition
2. List ALL tasks, even if they seem trivial
3. Be explicit about dependencies (don't assume)
4. Use file patterns when exact paths unknown
5. If unsure about scope → ask user via AskUserQuestion
```

#### task-decomposer-agent.md

```yaml
---
name: task-decomposer-agent
description: Decomposes high-level tasks into atomic, executable subtasks
model: sonnet
phase: 3b
tools: [Read, Grep, Glob]
activation:
  triggers:
    - phase3a_complete
  priority: CRITICAL
  enforcement: block
  dependsOn: [task-lister-agent]
---

## Mission
Transform high-level tasks into atomic subtasks that can be executed by individual agents.

## Input
- Output from task-lister-agent
- Loaded context
- Agent scaling matrix (from Phase 1)

## Output Format
{
  "decomposition": {
    "parentTask": "T1",
    "subtasks": [
      {
        "id": "T1.1",
        "action": "string - imperative verb + specific action",
        "files": ["exact/file/path.ext"],
        "tools": ["Tool1", "Tool2"],
        "validation": "string - how to verify success",
        "estimatedTokens": number,
        "assignedModel": "haiku|sonnet|opus",
        "canParallelize": boolean,
        "blockedBy": ["T0.3"]  // optional dependencies
      }
    ]
  },
  "executionPlan": {
    "sequential": ["T1.1", "T1.2"],
    "parallel": [["T2.1", "T3.1"], ["T2.2", "T3.2"]],
    "totalSubtasks": number,
    "estimatedDuration": "string",
    "estimatedTokens": number,
    "estimatedCost": number
  }
}

## Decomposition Rules

### Size Guidelines
- 3-7 subtasks per high-level task (optimal)
- <3 subtasks → task might be too granular already
- >7 subtasks → split into multiple high-level tasks

### Atomicity Criteria
Each subtask MUST:
- Be executable by ONE agent
- Have ONE clear outcome
- Be verifiable independently
- Take <1000 tokens to complete

### Model Assignment
- haiku: Simple file edits, config changes, formatting
- sonnet: Logic implementation, refactoring, testing
- opus: Architecture decisions, complex algorithms, security

### Validation Criteria Examples
- "File exists and passes lint"
- "Function returns expected type"
- "Test passes with >80% coverage"
- "No security vulnerabilities detected"
```

### Flujo Completo con Phase 3

```
User: "Implement user authentication with JWT"
     ↓
Phase 0-2: [Pre-Analysis + Evaluation + Context Loading]
     ↓
Phase 3a: task-lister-agent
     │
     │  Output:
     │  - T1: Create User model
     │  - T2: Implement register endpoint
     │  - T3: Implement login endpoint
     │  - T4: Create JWT middleware
     │  - T5: Add protected route decorator
     │  - T6: Write tests
     │  Dependencies: T2,T3,T4,T5 → T1 | T6 → ALL
     ↓
Phase 3b: task-decomposer-agent
     │
     │  Output:
     │  T1.1: Create User model file (haiku)
     │  T1.2: Add password hashing method (sonnet)
     │  T2.1: Create register view (sonnet)
     │  T2.2: Add input validation (haiku)
     │  T3.1: Create login view (sonnet)
     │  T3.2: Add token generation (sonnet)
     │  T4.1: Create JWT decode middleware (sonnet)
     │  T4.2: Add error handling (haiku)
     │  ...
     │  Total: 15 subtasks
     │  Parallel groups: [[T2.1, T3.1], [T2.2, T3.2]]
     ↓
Phase 4: Planning (receives decomposed tasks)
     ↓
Phase 5: Execution (executes subtasks per plan)
     ↓
Phase 6-7: [Validation + Consolidation]
```

### Beneficios Clave

| Aspecto | Sin Decomposition | Con Decomposition | Mejora |
|---------|-------------------|-------------------|--------|
| **Claridad** | "Implement auth" | 15 subtareas específicas | +300% |
| **Paralelización** | Manual guess | Automatic detection | +40% speedup |
| **Estimación** | Rough | Per-subtask tokens/cost | +80% accuracy |
| **Debugging** | "Something failed" | "T3.2 failed: validation" | +200% |
| **Progress** | 0% → 100% | 0% → 7% → 15% → ... | Granular |

---

## NUEVO v3.3: Error Recovery Patterns

### Circuit Breaker para Agentes

> Fuente: [Portkey - Circuit Breakers in LLM Apps](https://portkey.ai/blog/retries-fallbacks-and-circuit-breakers-in-llm-apps/)

```typescript
// Circuit breaker states
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface AgentCircuitBreaker {
  agentId: string;
  state: CircuitState;
  failureCount: number;
  failureThreshold: number;  // Default: 3
  resetTimeout: number;      // Default: 30s
  lastFailure: Date | null;

  // Adaptive thresholds (DyLAN pattern)
  adaptiveThreshold: boolean;
  successRate: number;       // Rolling 10-request window
}

// Implementation
class CircuitBreakerManager {
  private breakers: Map<string, AgentCircuitBreaker> = new Map();

  async executeWithBreaker(agentId: string, fn: () => Promise<any>) {
    const breaker = this.getOrCreate(agentId);

    switch (breaker.state) {
      case 'OPEN':
        // Check if reset timeout passed
        if (Date.now() - breaker.lastFailure > breaker.resetTimeout) {
          breaker.state = 'HALF_OPEN';
          return this.tryExecution(breaker, fn);
        }
        // Fast fail
        throw new CircuitOpenError(agentId, breaker.resetTimeout);

      case 'HALF_OPEN':
        return this.tryExecution(breaker, fn, true);

      case 'CLOSED':
        return this.tryExecution(breaker, fn);
    }
  }

  private async tryExecution(
    breaker: AgentCircuitBreaker,
    fn: () => Promise<any>,
    isProbe: boolean = false
  ) {
    try {
      const result = await fn();
      this.recordSuccess(breaker);
      return result;
    } catch (error) {
      this.recordFailure(breaker);

      if (breaker.failureCount >= breaker.failureThreshold) {
        breaker.state = 'OPEN';
        this.emit('circuit_opened', { agentId: breaker.agentId, reason: error });
      }

      throw error;
    }
  }
}
```

### Retry Strategy con Exponential Backoff

```typescript
interface RetryConfig {
  maxRetries: number;      // Default: 3
  initialDelay: number;    // Default: 1000ms
  maxDelay: number;        // Default: 30000ms
  backoffMultiplier: number; // Default: 2
  retryableErrors: string[]; // ['rate_limit', 'timeout', 'transient']
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = defaultConfig
): Promise<T> {
  let lastError: Error;
  let delay = config.initialDelay;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if retryable
      if (!isRetryable(error, config.retryableErrors)) {
        throw error;
      }

      // Check if max retries reached
      if (attempt === config.maxRetries) {
        throw new MaxRetriesExceededError(lastError, config.maxRetries);
      }

      // Log retry attempt
      console.log(`Retry ${attempt + 1}/${config.maxRetries} after ${delay}ms`);

      // Wait with exponential backoff
      await sleep(delay);
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }

  throw lastError;
}
```

### Fallback Chain para Agentes

```typescript
// If primary agent fails, try simpler alternatives
const agentFallbackChain = {
  'opus-complex-agent': ['sonnet-medium-agent', 'haiku-simple-agent'],
  'sonnet-medium-agent': ['haiku-simple-agent'],
  'haiku-simple-agent': ['direct-response']  // No agent, direct answer
};

async function executeWithFallback(
  agentId: string,
  task: Task
): Promise<AgentResult> {
  const chain = [agentId, ...(agentFallbackChain[agentId] || [])];

  for (const fallbackAgentId of chain) {
    try {
      if (fallbackAgentId === 'direct-response') {
        return { type: 'direct', result: await directResponse(task) };
      }

      return await executeAgent(fallbackAgentId, task);
    } catch (error) {
      this.emit('agent_fallback', {
        from: agentId,
        to: fallbackAgentId,
        reason: error
      });
    }
  }

  throw new AllFallbacksFailedError(agentId, chain);
}
```

---

## NUEVO v3.3: Self-Improvement Patterns

### SMART Framework Integration

> Fuente: [SMART: Self-learning Meta-strategy Agent](https://arxiv.org/abs/2410.16128)

```typescript
// Meta-strategy selection as MDP
interface MetaStrategy {
  strategyId: string;
  name: string;
  description: string;
  applicableTaskTypes: string[];
  historicalSuccessRate: number;
  avgTokensUsed: number;
  avgDuration: number;
}

class SelfImprovingOrchestrator {
  private strategies: MetaStrategy[] = [];
  private executionHistory: ExecutionRecord[] = [];

  // Learn from execution history
  async learnFromExecution(record: ExecutionRecord) {
    const strategy = this.strategies.find(s => s.strategyId === record.strategyUsed);

    if (strategy) {
      // Update success rate (exponential moving average)
      const alpha = 0.2;  // Learning rate
      strategy.historicalSuccessRate =
        alpha * (record.success ? 1 : 0) +
        (1 - alpha) * strategy.historicalSuccessRate;

      // Update token/duration estimates
      strategy.avgTokensUsed =
        alpha * record.tokensUsed +
        (1 - alpha) * strategy.avgTokensUsed;
    }

    // Store for pattern detection
    this.executionHistory.push(record);

    // Detect recurring patterns
    if (this.executionHistory.length % 10 === 0) {
      await this.detectPatterns();
    }
  }

  // Select optimal strategy for task
  selectStrategy(task: Task): MetaStrategy {
    const applicable = this.strategies.filter(
      s => s.applicableTaskTypes.includes(task.type)
    );

    // Exploration vs Exploitation (UCB1 algorithm)
    const totalExecutions = this.executionHistory.length;

    return applicable.reduce((best, strategy) => {
      const strategyExecutions = this.executionHistory.filter(
        e => e.strategyUsed === strategy.strategyId
      ).length;

      // UCB1 score: exploitation + exploration bonus
      const ucbScore = strategy.historicalSuccessRate +
        Math.sqrt(2 * Math.log(totalExecutions) / (strategyExecutions + 1));

      return ucbScore > (best.score || 0)
        ? { strategy, score: ucbScore }
        : best;
    }, { strategy: applicable[0], score: 0 }).strategy;
  }

  // Detect patterns for automation suggestions
  private async detectPatterns() {
    const patterns = analyzePatterns(this.executionHistory);

    for (const pattern of patterns) {
      if (pattern.occurrences >= 3 && pattern.confidence >= 0.75) {
        this.emit('pattern_detected', {
          pattern,
          suggestion: generateAutomationSuggestion(pattern)
        });
      }
    }
  }
}
```

### Complexity Calibration (Self-Correcting)

```typescript
// Predicted vs Actual complexity tracking
interface ComplexityCalibration {
  taskType: string;
  predictions: {
    predicted: number;
    actual: number;
    timestamp: Date;
  }[];
  calibrationFactor: number;  // Multiply predictions by this
}

class ComplexityCalibrator {
  private calibrations: Map<string, ComplexityCalibration> = new Map();

  // Apply calibration to raw complexity score
  calibrate(taskType: string, rawScore: number): number {
    const cal = this.calibrations.get(taskType);
    if (!cal) return rawScore;

    return Math.round(rawScore * cal.calibrationFactor);
  }

  // Learn from actual execution
  recordActual(taskType: string, predicted: number, actual: number) {
    let cal = this.calibrations.get(taskType);
    if (!cal) {
      cal = { taskType, predictions: [], calibrationFactor: 1.0 };
      this.calibrations.set(taskType, cal);
    }

    cal.predictions.push({ predicted, actual, timestamp: new Date() });

    // Keep last 20 predictions
    if (cal.predictions.length > 20) {
      cal.predictions = cal.predictions.slice(-20);
    }

    // Recalculate calibration factor
    const avgPredicted = average(cal.predictions.map(p => p.predicted));
    const avgActual = average(cal.predictions.map(p => p.actual));

    cal.calibrationFactor = avgActual / avgPredicted;
  }
}
```

---

## NUEVO v3.3: Orchestrator KPIs & Benchmarks

### Core KPIs

> Fuente: [Sentry - Core KPIs of LLM Performance](https://blog.sentry.io/core-kpis-llm-performance-how-to-track-metrics/)

```typescript
interface OrchestratorKPIs {
  // Latency metrics
  latency: {
    p50: number;    // 50th percentile
    p90: number;    // 90th percentile
    p95: number;    // 95th percentile
    p99: number;    // 99th percentile
    ttft: number;   // Time to first token
    totalDuration: number;
  };

  // Quality metrics
  quality: {
    taskCompletionRate: number;    // % tasks completed successfully
    firstAttemptSuccess: number;   // % success without retry
    hallucinationRate: number;     // % responses with hallucinations
    validationPassRate: number;    // % passing quality gates
  };

  // Efficiency metrics
  efficiency: {
    tokensPerTask: number;
    costPerTask: number;
    agentsPerTask: number;
    cacheHitRate: number;
    parallelizationRatio: number;  // % tasks run in parallel
  };

  // Orchestration health
  orchestration: {
    depth: number;              // Max agent nesting depth (target: 1-3)
    fanOut: number;             // Max parallel agents (target: <10)
    circuitBreakerTrips: number;
    retryRate: number;
    fallbackRate: number;
  };
}
```

### Benchmark Targets

```yaml
# .claude/config/kpi-targets.yaml
targets:
  latency:
    p50: 2000ms
    p90: 5000ms
    p95: 8000ms
    p99: 15000ms
    ttft: 500ms

  quality:
    taskCompletionRate: 95%
    firstAttemptSuccess: 80%
    hallucinationRate: <5%
    validationPassRate: 90%

  efficiency:
    tokensPerTask:
      simple: 500
      standard: 2000
      complex: 8000
    costPerTask:
      simple: $0.01
      standard: $0.05
      complex: $0.20
    cacheHitRate: 60%

  orchestration:
    maxDepth: 3
    maxFanOut: 10
    retryRate: <10%
    fallbackRate: <5%
    circuitBreakerTrips: <1/hour

alerts:
  - name: high_latency
    condition: p95 > 10000ms
    severity: warning

  - name: low_completion
    condition: taskCompletionRate < 85%
    severity: critical

  - name: high_cost
    condition: costPerTask > $0.50
    severity: warning

  - name: excessive_depth
    condition: depth > 4
    severity: warning
    message: "Investigate potential runaway loops"
```

### Real-Time Dashboard Metrics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR KPIs - Last 24 hours                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LATENCY                          │  QUALITY                                │
│  ────────────────────────────     │  ────────────────────────────           │
│  P50:  1.8s  ████████░░ ✓        │  Completion:  97%  █████████░ ✓        │
│  P90:  4.2s  ████████░░ ✓        │  1st Attempt: 82%  ████████░░ ✓        │
│  P95:  7.1s  ████████░░ ✓        │  Hallucin.:   3%  █░░░░░░░░░ ✓         │
│  P99: 12.8s  █████████░ ✓        │  Validation:  91%  █████████░ ✓        │
│  TTFT: 0.4s  ████░░░░░░ ✓        │                                         │
│                                   │                                         │
│  EFFICIENCY                       │  ORCHESTRATION HEALTH                   │
│  ────────────────────────────     │  ────────────────────────────           │
│  Tokens/task:   1,847            │  Avg Depth:    2.1  ██░░░░░░░░ ✓        │
│  Cost/task:     $0.04            │  Max Fan-out:  6    ██████░░░░ ✓        │
│  Cache hits:    67%  ██████░░░░  │  Retries:      7%   ███░░░░░░░ ✓        │
│  Parallel:      45%  ████░░░░░░  │  Fallbacks:    2%   █░░░░░░░░░ ✓        │
│                                   │  Circuit trips: 0   ░░░░░░░░░░ ✓        │
│                                                                             │
│  ALERTS                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚠ 14:32 - P95 latency spike: 9.2s (investigating)                   │   │
│  │ ℹ 12:15 - Self-improvement: Suggested new strategy for i18n tasks  │   │
│  │ ✓ 10:00 - Complexity calibration updated: +5% accuracy             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## NUEVO v3.4: Phase 4 - Iterative Planning con HITL

### Justificación

> "El primer plan rara vez es el mejor. Iterar con el usuario ANTES de ejecutar evita errores costosos."

**Fuentes**:
- [Andrew Ng](https://www.deeplearning.ai/courses/agentic-ai/): "Planning phase should be iterative"
- [MemGPT/Letta](https://www.letta.com/blog/memory-blocks): "Human-in-the-loop improves agent alignment"

### Flujo de Iterative Planning

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: PLANNING (con HITL Iterativo)                                     │
│  Model: Opus (decisiones de arquitectura)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Input: Decomposed tasks from Phase 3                                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Step 4a: Generate Initial Plan                                     │   │
│  │  ────────────────────────────────                                   │   │
│  │  • Select tools (commands/skills/agents/MCPs)                       │   │
│  │  • Determine execution strategy (sequential/parallel/hybrid)        │   │
│  │  • Estimate tokens/cost/duration                                    │   │
│  │  • Identify risks and alternatives                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         ↓                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Step 4b: CHECKPOINT - Present Plan to User                         │   │
│  │  ──────────────────────────────────────                             │   │
│  │                                                                     │   │
│  │  "📋 Plan Generado (v1):                                            │   │
│  │                                                                     │   │
│  │  ESTRATEGIA: Hybrid execution                                       │   │
│  │  AGENTES: 6 (3 parallel + 3 sequential)                             │   │
│  │  TOKENS EST.: ~3,500                                                │   │
│  │  COSTO EST.: ~$0.08                                                 │   │
│  │  DURACIÓN EST.: ~45s                                                │   │
│  │                                                                     │   │
│  │  SUBTAREAS:                                                         │   │
│  │  [1] T1.1: Create model (haiku) ─────────┐                          │   │
│  │  [2] T1.2: Add migration (haiku) ────────┤ PARALLEL                 │   │
│  │  [3] T2.1: Create endpoint (sonnet) ─────┘                          │   │
│  │  [4] T2.2: Add validation (haiku) ← depends on [3]                  │   │
│  │  [5] T3.1: Create tests (sonnet)                                    │   │
│  │  [6] T3.2: Run tests (haiku)                                        │   │
│  │                                                                     │   │
│  │  RIESGOS IDENTIFICADOS:                                             │   │
│  │  ⚠ T2.2 depends on T2.1, cannot parallelize                        │   │
│  │  ⚠ Tests might fail if model incomplete                            │   │
│  │                                                                     │   │
│  │  ALTERNATIVAS CONSIDERADAS:                                         │   │
│  │  [A] All sequential (safer, +30% slower)                            │   │
│  │  [B] Max parallel (faster, +risk)                                   │   │
│  │  [C] Current hybrid (balanced) ← RECOMMENDED"                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         ↓                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Step 4c: User Decision (AskUserQuestion)                           │   │
│  │  ───────────────────────────────────────                            │   │
│  │                                                                     │   │
│  │  Opciones:                                                          │   │
│  │  [✓] Aprobar plan y ejecutar                                        │   │
│  │  [?] Hacer preguntas sobre el plan                                  │   │
│  │  [A/B/C] Elegir alternativa diferente                               │   │
│  │  [M] Modificar: "Quiero que X sea diferente"                        │   │
│  │  [R] Regenerar plan desde cero                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         ↓                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Step 4d: Iterate if needed                                         │   │
│  │  ──────────────────────────                                         │   │
│  │                                                                     │   │
│  │  IF user chose [?] Questions:                                       │   │
│  │    → Answer questions                                               │   │
│  │    → Return to Step 4c                                              │   │
│  │                                                                     │   │
│  │  IF user chose [A/B/C] Alternative:                                 │   │
│  │    → Regenerate plan with selected strategy                         │   │
│  │    → Return to Step 4b with Plan v2                                 │   │
│  │                                                                     │   │
│  │  IF user chose [M] Modify:                                          │   │
│  │    → Apply user's modifications                                     │   │
│  │    → Return to Step 4b with Plan v(n+1)                             │   │
│  │                                                                     │   │
│  │  IF user chose [R] Regenerate:                                      │   │
│  │    → Discard plan, regenerate from scratch                          │   │
│  │    → Return to Step 4a                                              │   │
│  │                                                                     │   │
│  │  IF user chose [✓] Approve:                                         │   │
│  │    → Proceed to Phase 5 (Execution)                                 │   │
│  │    → Plan version is LOCKED                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Output: Approved execution plan (locked)                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### plan-iterator-agent.md

```yaml
---
name: plan-iterator-agent
description: Generates and iterates on execution plans based on user feedback
model: opus
phase: 4
tools: [Read, Grep, Glob, AskUserQuestion]
activation:
  triggers:
    - phase4_start
  priority: CRITICAL
  enforcement: block
---

## Mission
Generate comprehensive execution plans and iterate based on user feedback until approved.

## Output Format (Plan Presentation)
{
  "version": 1,
  "strategy": "hybrid|sequential|parallel",
  "agents": {
    "total": 6,
    "parallel": 3,
    "sequential": 3,
    "models": { "haiku": 3, "sonnet": 2, "opus": 1 }
  },
  "estimates": {
    "tokens": 3500,
    "cost": 0.08,
    "duration": "45s"
  },
  "subtasks": [
    {
      "id": "T1.1",
      "action": "Create model",
      "model": "haiku",
      "parallel_group": 1,
      "depends_on": []
    }
  ],
  "risks": [
    { "level": "medium", "description": "...", "mitigation": "..." }
  ],
  "alternatives": [
    { "id": "A", "name": "All sequential", "tradeoff": "+30% slower, -risk" },
    { "id": "B", "name": "Max parallel", "tradeoff": "-20% faster, +risk" }
  ],
  "recommendation": "C"
}

## Iteration Rules
1. ALWAYS present plan before execution
2. ALWAYS offer alternatives (minimum 2)
3. ALWAYS identify risks
4. NEVER proceed without explicit user approval
5. Track plan versions (v1, v2, v3...)
6. Maximum 5 iterations before escalating to user

## User Question Templates
- "¿Por qué elegiste {strategy} en lugar de {alternative}?"
- "¿Puedo cambiar {subtask} para usar {different_approach}?"
- "¿Qué pasa si {risk} ocurre?"
- "¿Puedes reducir el costo/tiempo?"
```

### Beneficios

| Aspecto | Sin Iterative Planning | Con Iterative Planning | Mejora |
|---------|------------------------|------------------------|--------|
| **Alineación** | Plan puede no coincidir con expectativas | Usuario valida antes de ejecutar | +80% satisfaction |
| **Riesgos** | Descubiertos durante ejecución | Identificados y mitigados antes | -60% failures |
| **Costo** | Ejecutar → Fallar → Re-ejecutar | Planificar bien → Ejecutar 1 vez | -40% tokens |
| **Control** | Usuario pasivo | Usuario activo en decisiones | +100% transparency |

---

## NUEVO v3.4: Memory Management (MemGPT Pattern)

### Arquitectura de Memoria

> Fuente: [Letta/MemGPT](https://www.letta.com/blog/memory-blocks), [Andrew Ng Course](https://www.deeplearning.ai/short-courses/llms-as-operating-systems-agent-memory/)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR MEMORY HIERARCHY                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CORE MEMORY (In-Context, ~4K tokens)                               │   │
│  │  ─────────────────────────────────────                              │   │
│  │  • Current task objective                                           │   │
│  │  • Active phase state                                               │   │
│  │  • Recent agent outputs (last 2)                                    │   │
│  │  • User preferences (learned)                                       │   │
│  │  ───────────────────────────────────────────────────────────────────│   │
│  │  ⚡ Always loaded | Updated every phase | Evicted when stale        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  WORKING MEMORY (Session Cache, ~20K tokens)                        │   │
│  │  ─────────────────────────────────────────                          │   │
│  │  • Decomposed tasks from Phase 3                                    │   │
│  │  • Execution plan from Phase 4                                      │   │
│  │  • Tool outputs (current session)                                   │   │
│  │  • Validation results                                               │   │
│  │  ───────────────────────────────────────────────────────────────────│   │
│  │  💾 TTL: Session | Compressed when >80% | Evicted on session end    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ARCHIVAL MEMORY (Persistent Storage, unlimited)                    │   │
│  │  ──────────────────────────────────────────                         │   │
│  │  • Complexity calibration history                                   │   │
│  │  • Successful patterns (for reuse)                                  │   │
│  │  • User preferences (long-term)                                     │   │
│  │  • Project knowledge graph                                          │   │
│  │  ───────────────────────────────────────────────────────────────────│   │
│  │  📚 Indexed | Searchable | Loaded on-demand via retrieval           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Memory Operations

```typescript
// Memory manager implementation
class OrchestratorMemory {
  private coreMemory: Map<string, MemoryBlock>;    // ~4K tokens
  private workingMemory: Map<string, MemoryBlock>; // ~20K tokens
  private archivalMemory: ArchivalStore;           // Unlimited

  // Memory blocks (MemGPT pattern)
  interface MemoryBlock {
    id: string;
    type: 'persona' | 'task' | 'context' | 'result';
    content: string;
    tokens: number;
    lastAccessed: Date;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }

  // Load to core memory (always in context)
  async loadToCore(block: MemoryBlock) {
    const currentTokens = this.getCoreTokenCount();
    const maxCoreTokens = 4000;

    if (currentTokens + block.tokens > maxCoreTokens) {
      // Evict lowest priority blocks
      await this.evictFromCore(block.tokens);
    }

    this.coreMemory.set(block.id, block);
  }

  // Move to working memory (session cache)
  async moveToWorking(blockId: string) {
    const block = this.coreMemory.get(blockId);
    if (block) {
      this.coreMemory.delete(blockId);
      this.workingMemory.set(blockId, block);
    }
  }

  // Archive for long-term storage
  async archive(block: MemoryBlock, tags: string[]) {
    const embedding = await generateEmbedding(block.content);
    await this.archivalMemory.store({
      ...block,
      embedding,
      tags,
      archivedAt: new Date()
    });
  }

  // Retrieve from archival (semantic search)
  async retrieve(query: string, limit: number = 5): Promise<MemoryBlock[]> {
    const queryEmbedding = await generateEmbedding(query);
    return this.archivalMemory.search(queryEmbedding, limit);
  }

  // Compress working memory when near limit
  async compressWorkingMemory() {
    const summaries = await Promise.all(
      Array.from(this.workingMemory.values())
        .filter(b => b.priority !== 'critical')
        .map(b => summarize(b.content))
    );
    // Replace full content with summaries
    summaries.forEach((summary, i) => {
      const block = Array.from(this.workingMemory.values())[i];
      block.content = summary;
      block.tokens = countTokens(summary);
    });
  }
}
```

### Memory Flow por Fase

```
Phase 0 (Pre-Analysis):
  LOAD: [cached content check]
  SAVE: cache_status → Working Memory

Phase 1 (Evaluation):
  LOAD: [user message, cached patterns]
  SAVE: keywords, complexity, confidence → Working Memory
  ARCHIVE: complexity_calibration → Archival (for learning)

Phase 2 (Context Loading):
  LOAD: [project knowledge from Archival]
  SAVE: loaded_context → Working Memory

Phase 3 (Decomposition):
  LOAD: [objective, context]
  SAVE: task_list, subtasks → Working Memory (CRITICAL priority)

Phase 4 (Planning):
  LOAD: [decomposed tasks, patterns from Archival]
  SAVE: execution_plan → Core Memory (needs to be in context)

Phase 5 (Execution):
  LOAD: [plan from Core, subtasks from Working]
  SAVE: agent_outputs → Working Memory
  COMPRESS: Previous outputs when >80% capacity

Phase 6 (Validation):
  LOAD: [results, validation criteria]
  SAVE: validation_results → Working Memory

Phase 7 (Consolidation):
  ARCHIVE: successful_patterns → Archival Memory
  ARCHIVE: learned_preferences → Archival Memory
  CLEAR: Working Memory (session end)
```

### "Lost in the Middle" Mitigation

> Problema: LLMs recall information at beginning/end better than middle.

```typescript
// Position-aware memory loading
function loadMemoryWithPositioning(blocks: MemoryBlock[]): string {
  // Sort by priority
  const sorted = blocks.sort((a, b) => priorityValue(b) - priorityValue(a));

  // Position critical info at START and END
  const critical = sorted.filter(b => b.priority === 'critical');
  const other = sorted.filter(b => b.priority !== 'critical');

  // Structure: [CRITICAL_START] [other...] [CRITICAL_END]
  return [
    '=== CRITICAL CONTEXT (START) ===',
    critical.slice(0, Math.ceil(critical.length / 2)).map(b => b.content).join('\n'),
    '=== ADDITIONAL CONTEXT ===',
    other.map(b => b.content).join('\n'),
    '=== CRITICAL CONTEXT (END) ===',
    critical.slice(Math.ceil(critical.length / 2)).map(b => b.content).join('\n')
  ].join('\n\n');
}
```

---

## NUEVO v3.4: Enhanced Observability (Langfuse Integration)

### Arquitectura

> Fuente: [Langfuse AI Agent Observability](https://langfuse.com/blog/2024-07-ai-agent-observability-with-langfuse)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LANGFUSE INTEGRATION                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TRACE (Full Workflow)                                              │   │
│  │  trace_id: orchestrator_run_abc123                                  │   │
│  │                                                                     │   │
│  │  ├─ SPAN: phase_0_pre_analysis                                      │   │
│  │  │   ├─ duration: 0.3s                                              │   │
│  │  │   ├─ tokens: { input: 50, output: 20 }                           │   │
│  │  │   └─ status: success                                             │   │
│  │  │                                                                  │   │
│  │  ├─ SPAN: phase_1_evaluation                                        │   │
│  │  │   ├─ GENERATION: keyword_detection                               │   │
│  │  │   │   ├─ model: haiku                                            │   │
│  │  │   │   ├─ prompt: "Detect keywords in: ..."                       │   │
│  │  │   │   └─ completion: { keywords: [...] }                         │   │
│  │  │   │                                                              │   │
│  │  │   ├─ GENERATION: complexity_scoring                              │   │
│  │  │   │   └─ ...                                                     │   │
│  │  │   │                                                              │   │
│  │  │   └─ GENERATION: prompt_quality                                  │   │
│  │  │       └─ score: 72/100                                           │   │
│  │  │                                                                  │   │
│  │  ├─ SPAN: phase_3_decomposition                                     │   │
│  │  │   └─ GENERATION: task_decomposer                                 │   │
│  │  │       └─ subtasks: 15                                            │   │
│  │  │                                                                  │   │
│  │  ├─ SPAN: phase_4_planning (HITL)                                   │   │
│  │  │   ├─ plan_version: 2                                             │   │
│  │  │   ├─ user_iterations: 1                                          │   │
│  │  │   └─ approved: true                                              │   │
│  │  │                                                                  │   │
│  │  └─ SPAN: phase_5_execution                                         │   │
│  │      ├─ GENERATION: agent_1 (parallel)                              │   │
│  │      ├─ GENERATION: agent_2 (parallel)                              │   │
│  │      └─ GENERATION: agent_3 (sequential)                            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  SCORES (attached to trace):                                               │
│  ├─ task_completion: 1.0                                                   │
│  ├─ first_attempt_success: 0.0 (needed retry)                              │
│  ├─ user_satisfaction: (pending feedback)                                  │
│  └─ cost_efficiency: 0.85 (under budget)                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación

```typescript
// .claude/lib/observability-langfuse.ts
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com'
});

class OrchestratorTracer {
  private trace: LangfuseTrace;

  // Start trace for entire workflow
  startWorkflow(taskId: string, userId: string) {
    this.trace = langfuse.trace({
      id: `orchestrator_${taskId}`,
      name: 'orchestrator_workflow',
      userId,
      metadata: {
        version: '3.4',
        phases: 8
      }
    });
  }

  // Track phase execution
  startPhase(phaseId: number, phaseName: string) {
    return this.trace.span({
      name: `phase_${phaseId}_${phaseName}`,
      metadata: { phaseId }
    });
  }

  // Track agent/generation
  trackGeneration(span: LangfuseSpan, params: GenerationParams) {
    return span.generation({
      name: params.agentName,
      model: params.model,
      modelParameters: {
        temperature: params.temperature,
        maxTokens: params.maxTokens
      },
      input: params.prompt,
      output: params.completion,
      usage: {
        promptTokens: params.promptTokens,
        completionTokens: params.completionTokens,
        totalTokens: params.totalTokens
      }
    });
  }

  // Track HITL interaction
  trackUserInteraction(span: LangfuseSpan, interaction: HITLInteraction) {
    span.event({
      name: 'user_interaction',
      metadata: {
        type: interaction.type,  // 'approve' | 'question' | 'modify' | 'reject'
        planVersion: interaction.planVersion,
        userChoice: interaction.choice
      }
    });
  }

  // Add scores
  scoreTrace(scores: Record<string, number>) {
    Object.entries(scores).forEach(([name, value]) => {
      this.trace.score({
        name,
        value,
        comment: `Auto-scored at workflow end`
      });
    });
  }

  // End workflow
  async endWorkflow() {
    await langfuse.flush();
  }
}
```

### Dashboard Queries (Langfuse)

```sql
-- Task completion rate by phase
SELECT
  span_name,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
  ROUND(100.0 * SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM spans
WHERE trace_name = 'orchestrator_workflow'
GROUP BY span_name
ORDER BY span_name;

-- HITL iteration frequency
SELECT
  AVG(metadata->>'plan_version') as avg_iterations,
  MAX(metadata->>'plan_version') as max_iterations
FROM spans
WHERE span_name LIKE 'phase_4%';

-- Cost by model
SELECT
  model,
  SUM(usage_prompt_tokens + usage_completion_tokens) as total_tokens,
  SUM(calculated_total_cost) as total_cost
FROM generations
WHERE trace_name = 'orchestrator_workflow'
GROUP BY model;
```

---

## NUEVO v3.5: Self-Critique Loop (Auto-Crítica Autónoma)

### Filosofía

> "La IA NO pregunta, se AUTO-EVALÚA. Detecta si va por buen camino o debe parar y reconsiderar."

**Fuentes**:
- [SELF-REFINE](https://arxiv.org/abs/2303.17651): Iterative refinement with self-feedback
- [Reflexion](https://blog.langchain.com/reflection-agents/): Reflect on past actions to improve
- [MIT Survey on Self-Correction](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177/)

### Arquitectura del Self-Critique Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SELF-CRITIQUE LOOP (Integrado en cada Fase)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  DESPUÉS de cada fase ejecutada:                                    │   │
│  │                                                                     │   │
│  │  1. AUTO-EVALUACIÓN (sin preguntar al usuario)                      │   │
│  │     ┌────────────────────────────────────────────────────────────┐  │   │
│  │     │ "¿Estoy yendo por buen camino?"                            │  │   │
│  │     │                                                            │  │   │
│  │     │ CHECKLIST INTERNO:                                         │  │   │
│  │     │ □ ¿El output cumple con el objetivo del usuario?           │  │   │
│  │     │ □ ¿Hay inconsistencias con lo que sé del proyecto?        │  │   │
│  │     │ □ ¿Este approach es similar a un error pasado archivado?   │  │   │
│  │     │ □ ¿La confianza en este paso es >70%?                      │  │   │
│  │     │ □ ¿El costo/tokens hasta ahora es razonable?               │  │   │
│  │     └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  2. DECISIÓN AUTÓNOMA                                               │   │
│  │     ┌────────────────────────────────────────────────────────────┐  │   │
│  │     │ IF all checks pass:                                        │  │   │
│  │     │   → CONTINUAR a siguiente fase                             │  │   │
│  │     │                                                            │  │   │
│  │     │ IF 1-2 checks fail:                                        │  │   │
│  │     │   → REFINAR: Re-ejecutar fase con ajustes                  │  │   │
│  │     │   → LOG: Guardar qué falló para aprender                   │  │   │
│  │     │                                                            │  │   │
│  │     │ IF 3+ checks fail:                                         │  │   │
│  │     │   → PARAR: Notificar al usuario qué está mal               │  │   │
│  │     │   → PROPONER: Alternativas basadas en errores pasados      │  │   │
│  │     └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │  3. APRENDIZAJE (Archival Memory)                                   │   │
│  │     ┌────────────────────────────────────────────────────────────┐  │   │
│  │     │ IF refinement fue exitoso:                                 │  │   │
│  │     │   → GUARDAR: "En {contexto}, {approach_A} falló porque     │  │   │
│  │     │              {razón}. {approach_B} funcionó mejor."        │  │   │
│  │     │                                                            │  │   │
│  │     │ IF usuario corrigió después:                               │  │   │
│  │     │   → DETECTAR: En qué difirió del siguiente prompt          │  │   │
│  │     │   → GUARDAR: "Usuario prefiere {X} sobre {Y} en {contexto}"│  │   │
│  │     └────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación del Self-Critique

```typescript
// Self-critique agent que se ejecuta después de cada fase
interface SelfCritiqueResult {
  phaseId: number;
  checks: {
    objectiveAlignment: { pass: boolean; confidence: number; reason: string };
    consistencyWithProject: { pass: boolean; issues: string[] };
    similarToPastError: { pass: boolean; matchedErrors: ArchivedError[] };
    confidenceLevel: { pass: boolean; score: number };
    costEfficiency: { pass: boolean; tokensUsed: number; expected: number };
  };
  decision: 'continue' | 'refine' | 'stop';
  learnings: Learning[];
}

async function selfCritique(phaseOutput: PhaseOutput): Promise<SelfCritiqueResult> {
  // 1. Cargar errores pasados similares desde Archival Memory
  const pastErrors = await memory.retrieve(
    `errors similar to: ${phaseOutput.summary}`,
    5
  );

  // 2. Auto-evaluar (NO preguntar al usuario)
  const critique = await llm.generate({
    prompt: `
      You are self-evaluating your output. DO NOT ask the user.

      <output_to_evaluate>
      ${phaseOutput.content}
      </output_to_evaluate>

      <past_errors_to_avoid>
      ${pastErrors.map(e => e.content).join('\n')}
      </past_errors_to_avoid>

      <checklist>
      1. Does this output align with user's objective? (Y/N, confidence 0-100)
      2. Any inconsistencies with project patterns? (Y/N, list issues)
      3. Is this approach similar to a past error? (Y/N, which one)
      4. Overall confidence in this step? (0-100)
      5. Token efficiency? (tokens_used vs expected)
      </checklist>

      OUTPUT JSON only. No explanations.
    `,
    model: 'haiku'  // Rápido y económico para auto-evaluación
  });

  // 3. Decidir acción
  const failedChecks = countFailedChecks(critique);
  let decision: 'continue' | 'refine' | 'stop';

  if (failedChecks === 0) {
    decision = 'continue';
  } else if (failedChecks <= 2) {
    decision = 'refine';
    // Guardar learning
    await archiveLearning({
      type: 'refinement_needed',
      context: phaseOutput.context,
      issue: critique.failedChecks,
      timestamp: new Date()
    });
  } else {
    decision = 'stop';
  }

  return { ...critique, decision };
}
```

### Detección de Mejoras entre Prompts

```typescript
// Cuando el usuario envía un nuevo prompt, detectar qué mejoró vs anterior
async function detectPromptImprovement(
  previousPrompt: string,
  newPrompt: string,
  previousOutput: string
): Promise<PromptDiff> {
  const diff = await llm.generate({
    prompt: `
      <previous_prompt>${previousPrompt}</previous_prompt>
      <previous_output>${previousOutput}</previous_output>
      <new_prompt>${newPrompt}</new_prompt>

      Analyze what the user changed/improved in their new prompt.
      This helps me learn what they prefer.

      Return JSON:
      {
        "changes": [
          { "type": "clarification|correction|expansion|style", "what": "..." }
        ],
        "userPreference": "User prefers X over Y because...",
        "shouldRemember": true/false,
        "memoryNote": "For future: when user asks about X, they prefer..."
      }
    `,
    model: 'haiku'
  });

  // Guardar preferencia si es relevante
  if (diff.shouldRemember) {
    await memory.archive({
      type: 'user_preference',
      content: diff.memoryNote,
      context: diff.changes[0].type,
      priority: 'high'
    });
  }

  return diff;
}
```

---

## NUEVO v3.5: Testing para Auto-Mejora

### Filosofía

> "Los tests NO son para validar código, son INDICADORES de qué mejorar."

### Tipos de Tests para el Orquestador

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TESTING FRAMEWORK PARA AUTO-MEJORA                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. GOLDEN TESTS (Casos conocidos)                                          │
│     ─────────────────────────────                                          │
│     • Input: "Crea componente Astro para hero"                             │
│     • Expected: Archivo .astro con Props, i18n, TailwindCSS                │
│     • Purpose: Detectar REGRESIONES                                        │
│                                                                             │
│     IF test fails:                                                          │
│       → LEARNING: "Mi output para {tipo_tarea} ha empeorado"               │
│       → ACTION: Revisar qué cambió en mi approach reciente                 │
│                                                                             │
│  2. COMPARISON TESTS (A vs B)                                               │
│     ───────────────────────────                                            │
│     • Run same task with Strategy A and Strategy B                         │
│     • Compare: tokens, time, quality score                                  │
│     • Purpose: Descubrir mejores approaches                                 │
│                                                                             │
│     IF Strategy B wins:                                                     │
│       → LEARNING: "Para {tipo_tarea}, Strategy B es 20% más eficiente"     │
│       → ACTION: Actualizar preferencia de estrategia                        │
│                                                                             │
│  3. MUTATION TESTS (Robustez)                                               │
│     ─────────────────────────                                              │
│     • Introduce pequeñas variaciones en input                              │
│     • Check: ¿Output sigue siendo correcto?                                │
│     • Purpose: Detectar fragilidad                                          │
│                                                                             │
│     IF mutation breaks output:                                              │
│       → LEARNING: "Mi approach es frágil cuando {condición}"               │
│       → ACTION: Añadir validación extra para ese caso                      │
│                                                                             │
│  4. COST-EFFICIENCY TESTS                                                   │
│     ──────────────────────────                                             │
│     • Track: tokens_used vs quality_score                                  │
│     • Purpose: ¿Estoy siendo eficiente?                                    │
│                                                                             │
│     IF cost ↑ but quality ↓:                                                │
│       → LEARNING: "Aumento de tokens no mejora resultado en {contexto}"    │
│       → ACTION: Reducir verbosidad, usar modelo más pequeño                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Test Runner con Auto-Learning

```typescript
interface TestResult {
  testId: string;
  type: 'golden' | 'comparison' | 'mutation' | 'cost_efficiency';
  passed: boolean;
  metrics: {
    tokensUsed: number;
    duration: number;
    qualityScore: number;  // 0-100 via LLM-as-judge
  };
  learning?: Learning;
}

async function runTestsForAutoImprovement(): Promise<TestSummary> {
  const results: TestResult[] = [];

  // 1. Golden Tests
  for (const golden of goldenTests) {
    const output = await orchestrator.execute(golden.input);
    const passed = await compareWithExpected(output, golden.expected);

    if (!passed) {
      const learning = await generateLearning({
        type: 'regression',
        task: golden.input,
        expected: golden.expected,
        actual: output,
        analysis: "Identificar qué cambió que causó la regresión"
      });
      await memory.archive(learning);
    }

    results.push({ testId: golden.id, type: 'golden', passed, ... });
  }

  // 2. Comparison Tests
  for (const comparison of comparisonTests) {
    const [resultA, resultB] = await Promise.all([
      orchestrator.execute(comparison.input, { strategy: 'A' }),
      orchestrator.execute(comparison.input, { strategy: 'B' })
    ]);

    const winner = compareResults(resultA, resultB);
    if (winner !== 'current_default') {
      await updateStrategyPreference(comparison.taskType, winner);
      await memory.archive({
        type: 'strategy_improvement',
        content: `For ${comparison.taskType}, ${winner} is ${winner.improvement}% better`,
        priority: 'high'
      });
    }
  }

  // 3. Generate Summary for Self-Improvement
  const summary = generateTestSummary(results);

  // Archivar insights para próxima sesión
  await memory.archive({
    type: 'test_insights',
    content: summary.keyLearnings.join('\n'),
    date: new Date()
  });

  return summary;
}
```

---

## NUEVO v3.5: Cost-Efficiency ROI Tracking

### Filosofía

> "NO es sobre límites de costo, es sobre MEDIR si el aumento de inversión mejora el resultado."

### Métricas de Eficiencia

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COST-EFFICIENCY ROI DASHBOARD                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EFFICIENCY RATIO = Quality Score / Tokens Used                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Task Type          │  Tokens  │  Quality  │  Efficiency  │ Trend   │   │
│  │─────────────────────────────────────────────────────────────────────│   │
│  │  Component creation │  1,200   │  92/100   │  0.077       │ ↑ +5%   │   │
│  │  i18n translation   │  450     │  95/100   │  0.211       │ → stable│   │
│  │  SEO optimization   │  2,100   │  88/100   │  0.042       │ ↓ -8%   │   │
│  │  Bug fix            │  800     │  97/100   │  0.121       │ ↑ +12%  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  INVESTMENT vs IMPROVEMENT                                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Quality                                                            │   │
│  │  100% ┤                                    ●●●                      │   │
│  │   95% ┤                           ●●●●●●●                           │   │
│  │   90% ┤                  ●●●●●●●●                                   │   │
│  │   85% ┤         ●●●●●●●                                             │   │
│  │   80% ┤    ●●●●                                                     │   │
│  │   75% ┤●●●                        ← Diminishing returns zone        │   │
│  │       └─────────────────────────────────────────────────────────    │   │
│  │         500   1000   1500   2000   2500   3000   Tokens             │   │
│  │                                                                     │   │
│  │  INSIGHT: Quality plateaus at ~1,500 tokens for this task type     │   │
│  │  RECOMMENDATION: Cap at 1,500 tokens, more doesn't help            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ROI PER MODEL                                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Model   │  Cost/1K  │  Avg Quality  │  ROI Index  │ Best For       │   │
│  │─────────────────────────────────────────────────────────────────────│   │
│  │  Haiku   │  $0.001   │  78/100       │  78,000     │ Simple tasks   │   │
│  │  Sonnet  │  $0.003   │  91/100       │  30,333     │ Standard tasks │   │
│  │  Opus    │  $0.015   │  97/100       │  6,467      │ Complex only   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ALERT: Opus ROI is 12x lower than Haiku. Use Opus ONLY for:              │
│  - Architecture decisions                                                   │
│  - Complex multi-file refactoring                                          │
│  - Security-critical code                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación

```typescript
interface CostEfficiencyMetrics {
  taskId: string;
  taskType: string;
  investment: {
    tokensUsed: number;
    costUSD: number;
    durationMs: number;
    modelUsed: 'haiku' | 'sonnet' | 'opus';
  };
  outcome: {
    qualityScore: number;  // 0-100 (LLM-as-judge or test pass rate)
    userSatisfaction?: number;  // If feedback received
    reworkNeeded: boolean;
  };
  efficiency: {
    qualityPerToken: number;  // quality / tokens
    qualityPerDollar: number; // quality / cost
    timeEfficiency: number;   // quality / duration
  };
  comparison: {
    vsPreviousSameType: {
      tokensDiff: number;
      qualityDiff: number;
      efficiencyImproved: boolean;
    };
    vsBaseline: {
      improvement: number;  // % improvement over baseline
    };
  };
}

class CostEfficiencyTracker {
  // Track every task execution
  async trackExecution(task: Task, result: ExecutionResult): Promise<CostEfficiencyMetrics> {
    const metrics = calculateMetrics(task, result);

    // Compare with previous same-type tasks
    const previousSameType = await this.getPreviousOfType(task.type, 10);
    const avgPrevious = calculateAverage(previousSameType);

    metrics.comparison = {
      vsPreviousSameType: {
        tokensDiff: metrics.investment.tokensUsed - avgPrevious.tokens,
        qualityDiff: metrics.outcome.qualityScore - avgPrevious.quality,
        efficiencyImproved: metrics.efficiency.qualityPerToken > avgPrevious.efficiency
      },
      vsBaseline: {
        improvement: ((metrics.efficiency.qualityPerToken / baseline.efficiency) - 1) * 100
      }
    };

    // Generate insight if efficiency changed significantly
    if (Math.abs(metrics.comparison.vsPreviousSameType.tokensDiff) > 200) {
      const insight = await this.analyzeEfficiencyChange(metrics, avgPrevious);
      await memory.archive({
        type: 'efficiency_insight',
        content: insight,
        taskType: task.type,
        timestamp: new Date()
      });
    }

    return metrics;
  }

  // Detect diminishing returns
  async detectDiminishingReturns(taskType: string): Promise<DiminishingReturnsReport> {
    const history = await this.getHistoryByType(taskType, 50);

    // Plot tokens vs quality
    const curve = fitCurve(history.map(h => [h.tokens, h.quality]));

    // Find point where quality plateaus
    const plateauPoint = findPlateau(curve);

    return {
      taskType,
      optimalTokens: plateauPoint.tokens,
      expectedQuality: plateauPoint.quality,
      recommendation: `For ${taskType}, cap at ${plateauPoint.tokens} tokens. ` +
                      `More tokens only improve quality by ${plateauPoint.marginalGain}%`,
      shouldArchive: true
    };
  }
}
```

---

## ACTUALIZADO: Phase 2 - Context Loading (con Mejoras Persistidas)

### Qué debe cargar Phase 2

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: CONTEXT LOADING (Actualizado v3.5)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MANDATORY LOADS (siempre cargar):                                          │
│  ─────────────────────────────────                                         │
│                                                                             │
│  1. ERRORES PASADOS RELEVANTES                                              │
│     Query: "errors similar to {current_task_keywords}"                      │
│     Source: Archival Memory (errors collection)                             │
│     Purpose: Evitar repetir los mismos errores                              │
│     Format:                                                                 │
│       [ERROR_001] En {contexto}, {approach} falló porque {razón}           │
│       [ERROR_002] Usuario corrigió {X} a {Y} en {situación}                │
│                                                                             │
│  2. MEJORAS APRENDIDAS                                                      │
│     Query: "improvements for {task_type}"                                   │
│     Source: Archival Memory (learnings collection)                          │
│     Purpose: Aplicar mejoras descubiertas anteriormente                     │
│     Format:                                                                 │
│       [IMPROVE_001] Para {tarea}, Strategy B es 20% más eficiente          │
│       [IMPROVE_002] En {contexto}, usar haiku en lugar de sonnet           │
│                                                                             │
│  3. PREFERENCIAS DEL USUARIO                                                │
│     Query: "user preferences for {project_name}"                            │
│     Source: Archival Memory (preferences collection)                        │
│     Purpose: Respetar lo que el usuario prefiere                            │
│     Format:                                                                 │
│       [PREF_001] Usuario prefiere código sin comentarios                   │
│       [PREF_002] Usuario quiere español en los mensajes                    │
│                                                                             │
│  4. EFFICIENCY INSIGHTS                                                     │
│     Query: "efficiency for {task_type}"                                     │
│     Source: Cost-Efficiency Tracker                                         │
│     Purpose: Saber cuántos tokens/qué modelo usar                           │
│     Format:                                                                 │
│       [EFF_001] Para componentes, óptimo: 1,200 tokens, sonnet             │
│       [EFF_002] Diminishing returns después de 1,500 tokens                 │
│                                                                             │
│  5. AUTO-NOTAS (Lo que la IA quiso recordar)                                │
│     Query: "self_notes related to {keywords}"                               │
│     Source: Archival Memory (self_notes collection)                         │
│     Purpose: Recordar cosas importantes que la IA decidió guardar           │
│     Format:                                                                 │
│       [NOTE_001] En este proyecto, los archivos de i18n están en /locales  │
│       [NOTE_002] El usuario mencionó que prefiere componentes pequeños     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación de Context Loading

```typescript
async function loadContextForPhase2(task: Task): Promise<LoadedContext> {
  const keywords = extractKeywords(task.objective);

  // Cargar en paralelo todas las fuentes de memoria
  const [errors, improvements, preferences, efficiency, selfNotes] = await Promise.all([
    // 1. Errores pasados
    memory.retrieve({
      collection: 'errors',
      query: `errors similar to: ${keywords.join(', ')}`,
      limit: 5,
      minRelevance: 0.7
    }),

    // 2. Mejoras aprendidas
    memory.retrieve({
      collection: 'learnings',
      query: `improvements for: ${task.type}`,
      limit: 5,
      minRelevance: 0.6
    }),

    // 3. Preferencias del usuario
    memory.retrieve({
      collection: 'preferences',
      query: `user preferences`,
      limit: 10,
      project: task.projectName
    }),

    // 4. Insights de eficiencia
    costTracker.getInsights(task.type),

    // 5. Auto-notas
    memory.retrieve({
      collection: 'self_notes',
      query: keywords.join(' '),
      limit: 5
    })
  ]);

  // Formatear para el contexto
  const context = formatContextForLLM({
    errors: errors.map(e => `[ERROR] ${e.content}`),
    improvements: improvements.map(i => `[IMPROVE] ${i.content}`),
    preferences: preferences.map(p => `[PREF] ${p.content}`),
    efficiency: `[EFFICIENCY] ${efficiency.summary}`,
    selfNotes: selfNotes.map(n => `[NOTE] ${n.content}`)
  });

  // Position-aware loading (critical info at START and END)
  return loadMemoryWithPositioning(context);
}
```

---

## NUEVO v3.2: Early Exit Inteligente (SIEMPRE 1+ agentes)

### Filosofía
> "SIEMPRE ejecutar al menos 1 agente. Phase 4 (Planning) decide cuántos y cómo."
> (Nota: Antes era Phase 3, renumerado a Phase 4 después de añadir Phase 3 Decomposition)

### Matriz de Selección Dinámica de Agentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT SCALING MATRIX (basada en DyLAN Framework)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Complexity  │  Files  │  Agents  │  Execution  │  Model Mix               │
│  ───────────────────────────────────────────────────────────────────────── │
│  0-30        │  0-1    │  1       │  Sequential │  100% Haiku              │
│  31-50       │  2-3    │  2-3     │  Sequential │  Haiku + Sonnet          │
│  51-70       │  4-6    │  3-5     │  Parallel   │  Sonnet majority         │
│  71-85       │  7-10   │  5-8     │  Hybrid     │  Sonnet + Opus           │
│  86-100      │  10+    │  8-15    │  Hybrid     │  Opus for critical       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Nunca 0 agentes. Mínimo SIEMPRE 1.
```

### Early Exit Points (NO skip de agentes, SÍ skip de sub-pasos)

```typescript
// Phase 0: Pre-Analysis Early Decisions
const phase0EarlyExits = {
  // Si hay cache hit con alta confianza → reduce agentes en Phase 4
  cachedWithHighConfidence: {
    skip: false,  // NUNCA skip agentes
    reduce: true, // SÍ reducir número de agentes
    agentReduction: 50,  // Usar 50% menos agentes
    reason: "Cache hit reduces exploration needed"
  },

  // Token budget crítico → usar modelos más económicos
  tokenBudgetCritical: {
    skip: false,
    modelDowngrade: true,  // Opus → Sonnet → Haiku
    reason: "Preserve budget for essential operations"
  }
};

// Phase 1: Complexity-based Agent Scaling
function calculateAgentCount(complexity: number, fileCount: number): AgentConfig {
  // SIEMPRE mínimo 1
  const baseAgents = 1;

  // Escalar basado en complexity y files
  const complexityAgents = Math.ceil(complexity / 20);  // 0-5 extra
  const fileAgents = Math.ceil(fileCount / 3);          // 0-3 extra

  const totalAgents = Math.min(
    baseAgents + complexityAgents + fileAgents,
    15  // Cap máximo
  );

  return {
    count: totalAgents,
    parallel: complexity > 50,
    models: selectModelMix(complexity)
  };
}

// Phase 3: Planning decides execution strategy
function planExecution(evaluation: Phase1Result): ExecutionPlan {
  const agents = calculateAgentCount(
    evaluation.complexity.total,
    evaluation.fileCount
  );

  return {
    agentCount: agents.count,
    parallel: agents.parallel,
    models: agents.models,
    // Planning SIEMPRE genera al menos 1 agente
    minimumAgents: 1,
    phases: {
      phase4: { agents: Math.max(1, agents.count - 2) },
      phase5: { agents: Math.max(1, Math.ceil(agents.count * 0.3)) }
    }
  };
}
```

### Ejemplos de Scaling

```
Ejemplo 1: "¿Qué es Astro?"
- Complexity: 15
- Files: 0
- Agents: 1 (mínimo)
- Execution: Sequential, Haiku only
- Phases: 0,1,2,3,4(1 agent),5(1 agent),6

Ejemplo 2: "Crea un componente Hero con i18n"
- Complexity: 45
- Files: 3
- Agents: 4
- Execution: Sequential, Haiku + Sonnet
- Phases: Full flow, Phase 4 = 2 agents parallel

Ejemplo 3: "Implementa feature de autenticación completa"
- Complexity: 85
- Files: 12
- Agents: 10
- Execution: Hybrid, Sonnet + Opus
- Phases: Full flow, Phase 4 = 7 agents hybrid
```

---

## NUEVO v3.2: Observability Dashboard

### Arquitectura (inspirada en Langfuse + Datadog)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR OBSERVABILITY DASHBOARD                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ TOKENS          │  │ LATENCY         │  │ COST            │             │
│  │ ████████░░ 8.2K │  │ ████░░░░ 2.1s   │  │ ████░░░░ $0.02  │             │
│  │ Budget: 50K     │  │ Target: <5s     │  │ Budget: $1.00   │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  PHASE BREAKDOWN                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Phase │ Status │ Duration │ Tokens │ Agents │ Model  │ Cost       │   │
│  │───────────────────────────────────────────────────────────────────│   │
│  │ 0     │ ✓      │ 0.3s     │ 50     │ 1      │ haiku  │ $0.0001   │   │
│  │ 1     │ ✓      │ 1.2s     │ 320    │ 4      │ sonnet │ $0.003    │   │
│  │ 2     │ ✓      │ 0.8s     │ 180    │ 1      │ haiku  │ $0.0002   │   │
│  │ 3     │ ▶      │ -        │ -      │ 1      │ opus   │ -         │   │
│  │ 4     │ ○      │ -        │ -      │ 3      │ opus   │ -         │   │
│  │ 5     │ ○      │ -        │ -      │ 2      │ sonnet │ -         │   │
│  │ 6     │ ○      │ -        │ -      │ 1      │ haiku  │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  AGENT TRACES                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ phase-1a-keyword-detector    [████████] 0.3s  ✓ 4 keywords         │   │
│  │ phase-1b-complexity-scorer   [██████████] 0.4s  ✓ score: 45        │   │
│  │ phase-1c-prompt-quality      [████████░░] 0.35s ⚠ score: 68 → HITL │   │
│  │ phase-1d-confidence          [██████] 0.2s  ✓ 88%                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ALERTS                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚠ Prompt quality < 70%: HITL triggered                              │   │
│  │ ℹ Cache hit: 2 files (saved 1.2K tokens)                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Métricas Capturadas

```typescript
interface ObservabilityMetrics {
  // Por fase
  phases: {
    [phaseId: number]: {
      status: 'pending' | 'running' | 'complete' | 'failed';
      startTime: Date;
      endTime?: Date;
      duration?: number;
      tokensInput: number;
      tokensOutput: number;
      cost: number;
      agents: AgentTrace[];
      errors: Error[];
    };
  };

  // Por agente
  agents: {
    [agentId: string]: {
      phase: number;
      model: 'haiku' | 'sonnet' | 'opus';
      status: 'running' | 'complete' | 'failed';
      duration: number;
      tokens: { input: number; output: number };
      cost: number;
      output: any;
      retries: number;
    };
  };

  // Totales
  totals: {
    duration: number;
    tokensTotal: number;
    costTotal: number;
    agentsExecuted: number;
    cacheHits: number;
    cacheSavings: number;  // tokens saved
    promptEnhancements: number;
    rollbacks: number;
    retries: number;
  };

  // Alertas
  alerts: {
    timestamp: Date;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    phase?: number;
    agent?: string;
  }[];
}
```

### Implementación del Dashboard

```typescript
// .claude/lib/observability.ts

class OrchestratorObservability {
  private metrics: ObservabilityMetrics;
  private startTime: Date;

  // Iniciar tracking
  startTask(taskId: string) {
    this.metrics = initializeMetrics(taskId);
    this.startTime = new Date();
    this.emit('task_started', { taskId });
  }

  // Track fase
  startPhase(phaseId: number, config: PhaseConfig) {
    this.metrics.phases[phaseId] = {
      status: 'running',
      startTime: new Date(),
      agents: [],
      ...config
    };
    this.emit('phase_started', { phaseId });
    this.renderDashboard();
  }

  // Track agente
  startAgent(agentId: string, phaseId: number, model: string) {
    this.metrics.agents[agentId] = {
      phase: phaseId,
      model,
      status: 'running',
      startTime: new Date()
    };
    this.emit('agent_started', { agentId, phaseId, model });
    this.renderDashboard();
  }

  // Completar agente
  completeAgent(agentId: string, result: AgentResult) {
    const agent = this.metrics.agents[agentId];
    agent.status = 'complete';
    agent.duration = Date.now() - agent.startTime.getTime();
    agent.tokens = result.tokens;
    agent.cost = calculateCost(result.tokens, agent.model);
    agent.output = result.output;
    this.emit('agent_completed', { agentId, result });
    this.renderDashboard();
  }

  // Alertas
  alert(level: AlertLevel, message: string, context?: any) {
    this.metrics.alerts.push({
      timestamp: new Date(),
      level,
      message,
      ...context
    });
    this.emit('alert', { level, message, context });
    this.renderDashboard();
  }

  // Render dashboard (CLI)
  renderDashboard() {
    console.clear();
    console.log(generateDashboardView(this.metrics));
  }

  // Export para análisis
  exportMetrics(): ObservabilityMetrics {
    return this.metrics;
  }

  // Guardar en archivo
  async saveToFile() {
    const path = `.claude/state/metrics_${this.metrics.taskId}.json`;
    await writeFile(path, JSON.stringify(this.metrics, null, 2));
  }
}
```

### Comandos de Observability

```
/orchestrator dashboard      → Mostrar dashboard en tiempo real
/orchestrator metrics        → Resumen de métricas de última tarea
/orchestrator metrics --all  → Histórico de todas las tareas
/orchestrator cost           → Desglose de costos por modelo/fase
/orchestrator tokens         → Análisis de consumo de tokens
/orchestrator alerts         → Ver alertas activas
```

### Archivo de Métricas Persistentes

```
.claude/state/
├── metrics/
│   ├── task_abc123.json     # Métricas por tarea
│   ├── task_def456.json
│   └── ...
├── metrics_summary.json     # Resumen agregado
└── cost_tracking.json       # Tracking de costos acumulados
```

### metrics_summary.json

```json
{
  "period": "2025-01-29",
  "tasksCompleted": 47,
  "totalTokens": 125000,
  "totalCost": 2.45,
  "avgDuration": "3.2s",
  "cacheHitRate": 0.67,
  "cacheSavings": 42000,
  "promptEnhancements": 8,
  "byModel": {
    "haiku": { "tokens": 45000, "cost": 0.15, "tasks": 89 },
    "sonnet": { "tokens": 65000, "cost": 1.30, "tasks": 52 },
    "opus": { "tokens": 15000, "cost": 1.00, "tasks": 12 }
  },
  "byPhase": {
    "0": { "avgDuration": "0.3s", "avgTokens": 50 },
    "1": { "avgDuration": "1.1s", "avgTokens": 280 },
    "2": { "avgDuration": "0.7s", "avgTokens": 150 },
    "3": { "avgDuration": "1.5s", "avgTokens": 400 },
    "4": { "avgDuration": "3.2s", "avgTokens": 800 },
    "5": { "avgDuration": "1.8s", "avgTokens": 350 },
    "6": { "avgDuration": "0.4s", "avgTokens": 80 }
  }
}
```

---

## Resumen de Cambios v3.1 → v3.2

| Feature | Descripción | Beneficio |
|---------|-------------|-----------|
| **Agent Scaling Matrix** | 1-15 agentes basado en complexity/files | Siempre 1+, escalado inteligente |
| **Early Exit Inteligente** | No skip agentes, sí reducir/optimizar | Eficiencia sin sacrificar calidad |
| **Observability Dashboard** | Métricas tiempo real, traces, costos | Debugging, optimización, control |
| **Cost Tracking** | Desglose por modelo/fase/tarea | Control de presupuesto |
| **Alert System** | Notificaciones proactivas | Detección temprana de issues |

---

## Orden de Implementación

### Fase 1: Foundation (Día 1)
1. Crear `skill-rules.json` con enforcement levels
2. Crear `forced-evaluation.py` hook
3. Crear `tripwire-handler.py` hook
4. Modificar `validate-orchestrator.py` para iniciar (no bloquear)

### Fase 2: Handoffs (Día 2)
5. Crear `handoff-manager.ts`
6. Crear `scaling-rules.yaml`
7. Implementar handoff functions para 7 fases

### Fase 3: Metrics (Día 3)
8. Crear `phase-metrics.ts`
9. Crear `phase_metrics.json` state file
10. Integrar métricas en cada fase

### Fase 4: Agents (Días 4-6)
11. Crear 12 agentes nuevos (según plan v2.0)
12. Actualizar 6 agentes existentes

### Fase 5: Controller (Día 7)
13. Crear `orchestrator-controller` skill
14. Integrar todos los componentes
15. Testing con casos simples/complejos

---

## Decisiones del Usuario

| Pregunta | Decisión |
|----------|----------|
| **Enforcement level** | **Todas block** - Las 7 fases son OBLIGATORIAS |
| **Tripwire behavior** | **Halt + retry auto** - Max 3 retries antes de preguntar |
| **Metrics persistence** | **Sí persistir** - Eval-driven development |
| **Scaling rules** | **Confirmado con modelos específicos** |

### Scaling Rules Confirmados (Claude 4.5)

```yaml
scaling:
  simple:
    complexity: 0-30
    model: haiku-4.5        # 2x faster, 3x cheaper
    agents: 1
    toolCalls: 3-10

  standard:
    complexity: 31-60
    model: sonnet-4.5       # Balance quality/cost
    agents: 2-4
    toolCalls: 10-15 each

  complex:
    complexity: 61-100
    model: opus-4.5         # Maximum quality
    agents: 5-10+
    toolCalls: divided responsibilities
```

### Recomendación: Métricas Persistentes

**Por qué SÍ persistir métricas:**

1. **Eval-driven development** (Andrew Ng): "The biggest predictor of success" - 40% speedup
2. **Memory calibration** (Anthropic): El sistema aprende qué complexity scores fueron correctos
3. **Pattern detection**: Detecta errores recurrentes para proponer mejoras
4. **Cost tracking**: Saber cuántos tokens usa cada modelo/fase

**Implementación mínima** (bajo costo):

```
.claude/state/
├── phase_metrics.json     # Métricas por fase (duración, tokens, success rate)
├── complexity_calibration.json  # Corrección de scores (predicted vs actual)
└── session_history.jsonl  # Historial (append-only, 1 línea por tarea)
```

**Overhead**: <100 tokens por tarea, <1KB por sesión

**Beneficio**: El sistema mejora con cada uso (self-correcting)

---

## Fuentes

- [Andrew Ng - Agentic AI Course](https://www.deeplearning.ai/courses/agentic-ai/)
- [Anthropic Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
- [OpenAI Swarm GitHub](https://github.com/openai/swarm)
- [OpenAI Agents SDK Guardrails](https://openai.github.io/openai-agents-python/guardrails/)
- [wshobson/agents](https://github.com/wshobson/agents)
- [How to Make Claude Code Skills Activate Reliably](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably)
- [claude-code-infrastructure-showcase](https://github.com/diet103/claude-code-infrastructure-showcase)

---

---

## Resumen de Cambios v3.2 → v3.3

| Feature | Descripción | Beneficio | Fuente |
|---------|-------------|-----------|--------|
| **Phase 3: Decomposition** | Nueva fase con 2 agentes (task-lister + task-decomposer) | +300% claridad, +40% paralelización | [AgentCoder](https://arxiv.org/abs/2506.02943) |
| **8 Fases (0-7)** | Renumeración para acomodar Decomposition | Estructura más completa | - |
| **Error Recovery** | Circuit breaker + retry + fallback chain | Resiliencia 99%+ | [Portkey](https://portkey.ai/blog/retries-fallbacks-and-circuit-breakers-in-llm-apps/) |
| **Self-Improvement** | SMART framework + UCB1 exploration | Auto-mejora continua | [SMART](https://arxiv.org/abs/2410.16128) |
| **Complexity Calibration** | Predicted vs actual tracking | +20% accuracy over time | [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) |
| **Orchestrator KPIs** | P50/P90/P95/P99, quality, efficiency | Eval-driven development | [Sentry](https://blog.sentry.io/core-kpis-llm-performance-how-to-track-metrics/) |
| **Benchmark Targets** | Latency, quality, cost thresholds | Measurable success criteria | [Confident AI](https://www.confident-ai.com/blog/llm-evaluation-metrics-everything-you-need-for-llm-evaluation) |

---

## Archivos a Crear/Modificar (Actualizado v3.3)

### NUEVOS (12 archivos, antes 8)

| Archivo | Propósito |
|---------|-----------|
| `.claude/config/skill-rules.json` | Enforcement levels + tripwires |
| `.claude/config/scaling-rules.yaml` | Anthropic scaling patterns |
| `.claude/config/kpi-targets.yaml` | **🆕** Benchmark targets + alerts |
| `.claude/hooks/forced-evaluation.py` | 3-step mandatory evaluation |
| `.claude/hooks/tripwire-handler.py` | Halt on CRITICAL violations |
| `.claude/lib/handoff-manager.ts` | Explicit phase handoffs |
| `.claude/lib/phase-metrics.ts` | Eval-driven metrics collection |
| `.claude/lib/circuit-breaker.ts` | **🆕** Agent circuit breaker |
| `.claude/lib/self-improvement.ts` | **🆕** SMART + calibration |
| `.claude/state/phase_metrics.json` | Metrics persistence |
| `.claude/agents/task-lister-agent.md` | **🆕** Phase 3a agent |
| `.claude/agents/task-decomposer-agent.md` | **🆕** Phase 3b agent |

### AGENTES (20 total, antes 18)

| Fase | Agentes | Nuevos |
|------|---------|--------|
| 1 | 4 (keyword, complexity, prompt-quality, confidence) | - |
| 3 | 2 (task-lister, task-decomposer) | **🆕 +2** |
| 4 | N (tool-selectors, strategy-planner) | - |
| 5 | N (executors per subtask) | - |
| 6 | N (validators) | - |
| 7 | 2 (pattern-detector, knowledge-consolidator) | - |

---

## Orden de Implementación (Actualizado v3.3)

### Día 1: Foundation
1. Crear `skill-rules.json` con enforcement levels
2. Crear `forced-evaluation.py` hook
3. Crear `tripwire-handler.py` hook

### Día 2: Phase 3 Decomposition
4. Crear `task-lister-agent.md`
5. Crear `task-decomposer-agent.md`
6. Integrar en orchestrator workflow

### Día 3: Handoffs & Scaling
7. Crear `handoff-manager.ts`
8. Crear `scaling-rules.yaml`
9. Implementar handoff functions para 8 fases

### Día 4: Error Recovery
10. Crear `circuit-breaker.ts`
11. Implementar retry con exponential backoff
12. Implementar fallback chain

### Día 5: Self-Improvement & KPIs
13. Crear `self-improvement.ts` (SMART + calibration)
14. Crear `kpi-targets.yaml`
15. Implementar dashboard de métricas

### Día 6-7: Agents & Integration
16. Crear/actualizar 20 agentes
17. Integrar todos los componentes
18. Testing con casos simples/complejos

---

## ACTUALIZADO v3.6: Prompt Chain Analysis (Detección de Qué Fase Falló)

### Filosofía

> "NO es solo auto-crítica. Es ANALIZAR LA CADENA DE PROMPTS para detectar qué no se resolvió y POR QUÉ FASE falló."

**El problema con Self-Critique tradicional**:
- Solo evalúa el output actual
- No analiza por qué el usuario tuvo que iterar
- No detecta qué fase fue la causa raíz del fallo

**Nuevo approach**: Cuando el usuario envía un nuevo prompt que es iteración del anterior, analizar:
1. ¿Qué no se resolvió la primera vez?
2. ¿En qué fase falló? (Context Loading, Analysis, Decomposition, Planning, Execution...)
3. ¿Cómo auto-mejorar esa fase específica?

### Arquitectura del Prompt Chain Analyzer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PROMPT CHAIN ANALYZER (Se activa cuando usuario envía prompt de iteración) │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRIGGER: Detectar que prompt N+1 es iteración de prompt N                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Indicadores de iteración:                                                  │
│  • "No, me refería a..."                                                   │
│  • "Eso no es lo que pedí..."                                              │
│  • "Falta..." / "También necesito..."                                      │
│  • Mismo tema pero con más detalles                                        │
│  • Corrección de output anterior                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ANÁLISIS DE LA CADENA                                              │   │
│  │                                                                     │   │
│  │  Prompt N: "Crea un componente Hero"                               │   │
│  │  Output N: [Componente sin i18n]                                    │   │
│  │  Prompt N+1: "No, necesito que tenga soporte i18n"                 │   │
│  │                                                                     │   │
│  │  DIAGNÓSTICO:                                                       │   │
│  │  ├── ¿Fue por mal prompt del usuario? → NO (objetivo claro)        │   │
│  │  ├── ¿Fue por falta de contexto? → POSIBLE (no cargué i18n config) │   │
│  │  ├── ¿Fue por análisis insuficiente? → SÍ (no detecté i18n keyword)│   │
│  │  ├── ¿Fue por decomposition incorrecta? → NO                        │   │
│  │  ├── ¿Fue por planning incompleto? → SÍ (no incluí task i18n)      │   │
│  │  └── ¿Fue por execution error? → NO                                 │   │
│  │                                                                     │   │
│  │  FASES QUE FALLARON:                                                │   │
│  │  • Phase 1 (Evaluation): Keyword detection no capturó "Hero" → i18n │   │
│  │  • Phase 4 (Planning): No generó subtask para internacionalización  │   │
│  │                                                                     │   │
│  │  ACCIÓN: Proponer mejora a orchestrator skill                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  AUTO-MEJORA (Solicitar al Usuario)                                 │   │
│  │                                                                     │   │
│  │  "He detectado que en este proyecto, cuando creas componentes,      │   │
│  │  siempre necesitas i18n. ¿Quieres que añada esta regla al          │   │
│  │  orchestrator para que siempre incluya i18n automáticamente?"      │   │
│  │                                                                     │   │
│  │  [Sí, añade la regla] [No, solo para este caso]                    │   │
│  │                                                                     │   │
│  │  Si usuario acepta:                                                 │   │
│  │  → Editar adaptive-meta-orchestrator/SKILL.md                       │   │
│  │  → Añadir: "IF project=CV_Astro AND task=component → include i18n" │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación del Prompt Chain Analyzer

```typescript
interface PromptChainAnalysis {
  isIteration: boolean;
  originalPrompt: string;
  iterationPrompt: string;
  originalOutput: string;

  diagnosis: {
    wasUserPromptBad: boolean;  // Si fue mal prompt del usuario → NO es culpa nuestra
    failedPhases: PhaseFailure[];
    rootCause: string;
    confidence: number;
  };

  autoImprovement?: {
    suggested: boolean;
    skillToEdit: string;
    proposedChange: string;
    userApprovalRequired: true;  // SIEMPRE pedir permiso
  };
}

interface PhaseFailure {
  phase: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  phaseName: string;
  failureType:
    | 'context_not_loaded'     // Phase 2: No cargó contexto necesario
    | 'keyword_not_detected'   // Phase 1: Keyword detection falló
    | 'complexity_misjudged'   // Phase 1: Complejidad mal evaluada
    | 'task_not_decomposed'    // Phase 3: Subtask faltante
    | 'plan_incomplete'        // Phase 4: Plan no cubrió todo
    | 'execution_error'        // Phase 5: Error en ejecución
    | 'validation_missed';     // Phase 6: Validación no detectó issue
  evidence: string;
  suggestedFix: string;
}

async function analyzePromptChain(
  previousPrompt: string,
  currentPrompt: string,
  previousOutput: string,
  previousPhaseData: PhaseData[]
): Promise<PromptChainAnalysis> {

  // 1. Detectar si es iteración
  const iterationIndicators = [
    /no,?\s*(me refería|quería|necesito)/i,
    /eso no es/i,
    /falta/i,
    /también necesito/i,
    /pero.*sin/i,
    /corrige/i,
    /mal/i
  ];

  const isIteration = iterationIndicators.some(r => r.test(currentPrompt)) ||
    await detectSemanticIteration(previousPrompt, currentPrompt);

  if (!isIteration) {
    return { isIteration: false, ...baseResult };
  }

  // 2. Analizar qué falló y en qué fase
  const analysis = await llm.generate({
    prompt: `
      <previous_prompt>${previousPrompt}</previous_prompt>
      <previous_output>${previousOutput}</previous_output>
      <new_prompt>${currentPrompt}</new_prompt>
      <phase_data>${JSON.stringify(previousPhaseData)}</phase_data>

      El usuario iteró sobre el prompt anterior. Analiza:

      1. ¿El prompt original del usuario era claro? (NO culpes al usuario si fue claro)
      2. ¿En qué FASE del orchestrator fallamos?
         - Phase 0 (Pre-Analysis): ¿Cache/budget issue?
         - Phase 1 (Evaluation): ¿Keywords no detectados? ¿Complejidad mal evaluada?
         - Phase 2 (Context Loading): ¿No se cargó contexto necesario?
         - Phase 3 (Decomposition): ¿Faltó descomponer una subtarea?
         - Phase 4 (Planning): ¿Plan incompleto?
         - Phase 5 (Execution): ¿Error de ejecución?
         - Phase 6 (Validation): ¿No detectamos el issue?

      3. ¿Qué evidencia hay de cada fallo?
      4. ¿Cómo podemos auto-mejorar el orchestrator para evitar esto?

      OUTPUT JSON:
      {
        "wasUserPromptBad": false,
        "failedPhases": [
          {
            "phase": 1,
            "phaseName": "Evaluation",
            "failureType": "keyword_not_detected",
            "evidence": "Keyword 'Hero' no fue mapeado a i18n requirement",
            "suggestedFix": "Añadir regla: CV_Astro + component → always check i18n"
          }
        ],
        "rootCause": "El detector de keywords no tiene regla para componentes en CV_Astro",
        "confidence": 85
      }
    `,
    model: 'sonnet'
  });

  // 3. Si hay fix sugerido con alta confianza, proponer al usuario
  if (analysis.confidence >= 75 && analysis.failedPhases.length > 0) {
    const proposedChange = generateSkillEdit(analysis.failedPhases);

    return {
      ...analysis,
      autoImprovement: {
        suggested: true,
        skillToEdit: 'adaptive-meta-orchestrator/SKILL.md',
        proposedChange,
        userApprovalRequired: true
      }
    };
  }

  // 4. Archivar el learning para futuro
  await memory.archive({
    type: 'phase_failure',
    content: `En ${previousPrompt.substring(0, 50)}..., fallaron phases: ${
      analysis.failedPhases.map(f => f.phaseName).join(', ')
    }. Root cause: ${analysis.rootCause}`,
    project: currentProject,
    timestamp: new Date()
  });

  return analysis;
}

// Generar el edit propuesto para el skill
function generateSkillEdit(failures: PhaseFailure[]): string {
  const rules = failures.map(f => {
    switch (f.failureType) {
      case 'keyword_not_detected':
        return `- Add keyword rule: "${f.evidence}" → ${f.suggestedFix}`;
      case 'context_not_loaded':
        return `- Add context loading rule: ${f.suggestedFix}`;
      case 'task_not_decomposed':
        return `- Add decomposition rule: ${f.suggestedFix}`;
      default:
        return `- ${f.suggestedFix}`;
    }
  });

  return `
## Auto-learned Rules (from prompt chain analysis)

${rules.join('\n')}

// Auto-generated from iteration detection
// User approved on: [DATE]
`;
}
```

### Integración con Self-Critique

El Prompt Chain Analyzer **complementa** al Self-Critique Loop:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CUÁNDO SE EJECUTA CADA UNO                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SELF-CRITIQUE (después de cada fase):                                      │
│  └── "¿Este output cumple con el objetivo?"                                │
│  └── Decisión: continue | refine | stop                                    │
│  └── Propósito: Evitar errores ANTES de terminar                           │
│                                                                             │
│  PROMPT CHAIN ANALYZER (cuando usuario envía nuevo prompt):                 │
│  └── "¿Por qué el usuario tuvo que iterar?"                                │
│  └── "¿Qué fase falló?"                                                    │
│  └── Decisión: Proponer auto-mejora al orchestrator                        │
│  └── Propósito: Aprender de errores DESPUÉS de detectarlos                 │
│                                                                             │
│  FLUJO COMBINADO:                                                           │
│                                                                             │
│  Prompt N                                                                   │
│  ├── Phase 1 → Self-Critique → OK → Continue                               │
│  ├── Phase 2 → Self-Critique → OK → Continue                               │
│  ├── Phase 3 → Self-Critique → OK → Continue                               │
│  ├── ...                                                                    │
│  └── Output N                                                               │
│                                                                             │
│  Prompt N+1 (iteración)                                                     │
│  ├── PROMPT CHAIN ANALYZER activa                                          │
│  │   ├── Detecta: "Usuario corrigió porque faltó i18n"                    │
│  │   ├── Diagnóstico: Phase 1 (keyword) + Phase 4 (planning) fallaron     │
│  │   └── Propone: "¿Añadir regla i18n automática para CV_Astro?"          │
│  └── Continuar con nuevo prompt (mejorado)                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## NUEVO v3.6: Agent Communication Protocol

### Filosofía

> "Los agentes NO son islas. Deben compartir contexto de forma estructurada entre fases y dentro de cada fase."

**Problemas sin protocolo de comunicación**:
- Agentes en paralelo no comparten descubrimientos
- Handoffs entre fases pierden información
- Contexto se duplica o se pierde
- No hay "memoria compartida" durante la ejecución

### Arquitectura del Agent Communication Protocol

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  AGENT COMMUNICATION PROTOCOL (ACP)                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  3 TIPOS DE COMUNICACIÓN:                                                   │
│                                                                             │
│  1. HANDOFF (Entre fases - Sequential)                                      │
│     ─────────────────────────────────                                      │
│     Phase N Agent → [HandoffMessage] → Phase N+1 Agent                     │
│                                                                             │
│  2. BROADCAST (Dentro de fase - Parallel agents)                            │
│     ─────────────────────────────────────────────                          │
│     Agent A ─┐                                                              │
│     Agent B ─┼→ [SharedBus] → All agents in phase                          │
│     Agent C ─┘                                                              │
│                                                                             │
│  3. QUERY (Petición específica)                                             │
│     ───────────────────────────                                            │
│     Agent X → [Query] → Agent Y → [Response]                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Handoff Protocol (Entre Fases)

```typescript
interface HandoffMessage {
  fromPhase: number;
  fromAgent: string;
  toPhase: number;
  timestamp: Date;

  // Contexto comprimido para siguiente fase
  context: {
    summary: string;              // Resumen de 1-2 líneas
    keyDecisions: string[];       // Decisiones importantes
    filesModified: string[];      // Archivos tocados
    filesRead: string[];          // Archivos leídos
    toolsUsed: string[];          // Herramientas usadas
    tokensConsumed: number;       // Tokens gastados
    confidence: number;           // Confianza en el output
  };

  // Output estructurado de la fase
  output: {
    type: 'evaluation' | 'context' | 'decomposition' | 'plan' | 'execution' | 'validation';
    data: any;                    // Datos específicos del tipo
    quality: number;              // 0-100 calidad del output
  };

  // Instrucciones para siguiente fase
  nextPhaseInstructions: {
    focus: string[];              // En qué enfocarse
    avoid: string[];              // Qué evitar
    mustInclude: string[];        // Obligatorio incluir
    suggestedAgents: string[];    // Agentes sugeridos
  };

  // Advertencias y flags
  flags: {
    needsUserInput: boolean;
    highRisk: boolean;
    uncertaintyAreas: string[];
    blockers: string[];
  };
}

// Ejemplo de Handoff: Phase 3 (Decomposition) → Phase 4 (Planning)
const decompositionToPlanning: HandoffMessage = {
  fromPhase: 3,
  fromAgent: 'task-decomposer-agent',
  toPhase: 4,
  timestamp: new Date(),

  context: {
    summary: "Descompuesto 'Crear página About' en 5 subtareas",
    keyDecisions: [
      "Usar Layout existente (no crear nuevo)",
      "i18n: 3 idiomas (en/es/fr)",
      "Sin CMS - contenido estático"
    ],
    filesModified: [],
    filesRead: ['src/layouts/Layout.astro', 'public/locales/en/common.json'],
    toolsUsed: ['Read', 'Glob', 'Grep'],
    tokensConsumed: 450,
    confidence: 88
  },

  output: {
    type: 'decomposition',
    data: {
      tasks: [
        { id: 1, name: 'Crear About.astro', priority: 'high', deps: [] },
        { id: 2, name: 'Añadir traducciones', priority: 'high', deps: [1] },
        { id: 3, name: 'Añadir SEO meta tags', priority: 'medium', deps: [1] },
        { id: 4, name: 'Añadir a navigation', priority: 'low', deps: [1] },
        { id: 5, name: 'Crear tests', priority: 'medium', deps: [1, 2, 3] }
      ],
      estimatedTotalTokens: 2500,
      suggestedExecution: 'sequential_with_parallel_validation'
    },
    quality: 90
  },

  nextPhaseInstructions: {
    focus: ['Planificar orden de ejecución', 'Asignar modelos por task'],
    avoid: ['No crear archivos adicionales innecesarios'],
    mustInclude: ['Validación de i18n', 'SEO check al final'],
    suggestedAgents: ['planning-agent', 'i18n-manager']
  },

  flags: {
    needsUserInput: false,
    highRisk: false,
    uncertaintyAreas: ['Layout podría necesitar props adicionales'],
    blockers: []
  }
};
```

### 2. Broadcast Protocol (Agentes en Paralelo)

```typescript
interface BroadcastMessage {
  fromAgent: string;
  messageType: 'discovery' | 'warning' | 'completion' | 'request';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: any;
  timestamp: Date;
}

interface SharedBus {
  phase: number;
  messages: BroadcastMessage[];
  activeAgents: string[];

  // Métodos
  broadcast(message: BroadcastMessage): void;
  subscribe(agentId: string, filter: MessageFilter): void;
  getDiscoveries(): BroadcastMessage[];
  getWarnings(): BroadcastMessage[];
}

// Ejemplo: 3 agentes analizando en paralelo en Phase 1
class Phase1SharedBus implements SharedBus {
  private messages: BroadcastMessage[] = [];
  private subscribers: Map<string, MessageFilter> = new Map();

  broadcast(message: BroadcastMessage): void {
    this.messages.push(message);

    // Notificar a otros agentes que podrían necesitar esta info
    if (message.messageType === 'discovery' && message.priority === 'high') {
      this.notifyRelevantAgents(message);
    }
  }

  // Cuando keyword-detector encuentra algo importante
  // Ejemplo: "Detecté que el usuario pidió i18n pero también mencionó 'solo inglés'"
  broadcastDiscovery(agentId: string, discovery: string): void {
    this.broadcast({
      fromAgent: agentId,
      messageType: 'discovery',
      priority: 'high',
      content: { discovery, implication: 'Contradiction detected - need clarification' },
      timestamp: new Date()
    });
  }

  // Cuando complexity-scorer termina, broadcast para que otros usen el score
  broadcastCompletion(agentId: string, result: any): void {
    this.broadcast({
      fromAgent: agentId,
      messageType: 'completion',
      priority: 'medium',
      content: result,
      timestamp: new Date()
    });
  }
}

// Uso en Phase 1 (4 agentes en paralelo)
const phase1Bus = new Phase1SharedBus();

// Agente 1: keyword-detector
keywordDetector.onDiscovery((discovery) => {
  phase1Bus.broadcastDiscovery('keyword-detector', discovery);
});

// Agente 2: complexity-scorer (puede usar discoveries del keyword-detector)
complexityScorer.onStart(() => {
  const discoveries = phase1Bus.getDiscoveries();
  // Ajustar scoring basado en discoveries
});

// Agente 3: prompt-quality (puede detectar contradicciones)
promptQuality.onContradiction((contradiction) => {
  phase1Bus.broadcast({
    fromAgent: 'prompt-quality',
    messageType: 'warning',
    priority: 'critical',  // Contradicción = parar y preguntar
    content: contradiction,
    timestamp: new Date()
  });
});

// Orchestrator escucha warnings críticos
phase1Bus.subscribe('orchestrator', { messageType: 'warning', priority: 'critical' });
```

### 3. Query Protocol (Peticiones Específicas)

```typescript
interface AgentQuery {
  fromAgent: string;
  toAgent: string;
  queryType: 'ask_for_data' | 'ask_for_validation' | 'ask_for_opinion';
  query: string;
  context?: any;
  timeout: number;  // ms
}

interface AgentResponse {
  fromAgent: string;
  toAgent: string;
  queryId: string;
  response: any;
  confidence: number;
  processingTime: number;
}

// Ejemplo: Planning agent pregunta a i18n-manager si necesita más idiomas
const query: AgentQuery = {
  fromAgent: 'planning-agent',
  toAgent: 'i18n-manager',
  queryType: 'ask_for_data',
  query: '¿Cuántos idiomas soporta actualmente el proyecto?',
  timeout: 5000
};

// i18n-manager responde
const response: AgentResponse = {
  fromAgent: 'i18n-manager',
  toAgent: 'planning-agent',
  queryId: query.id,
  response: {
    currentLanguages: ['en', 'es', 'fr'],
    localeFiles: ['public/locales/en/', 'public/locales/es/', 'public/locales/fr/'],
    missingTranslations: 12
  },
  confidence: 95,
  processingTime: 230
};
```

### 4. Context Compression/Expansion

```typescript
// Comprimir contexto para handoff (reducir tokens)
interface ContextCompressor {
  compress(fullContext: any): CompressedContext;
  expand(compressed: CompressedContext, expansionLevel: 'minimal' | 'standard' | 'full'): any;
}

interface CompressedContext {
  hash: string;                    // Para verificar integridad
  summaryTokens: number;           // Tokens del resumen
  fullTokensIfExpanded: number;    // Tokens si se expande
  compressionRatio: number;        // ratio de compresión

  summary: string;                 // Resumen textual corto
  keyPoints: string[];             // Puntos clave (bullets)
  references: {                    // Referencias a archivos/líneas para expandir
    file: string;
    lines?: [number, number];
    relevance: number;
  }[];

  expandable: {                    // Secciones que se pueden expandir on-demand
    section: string;
    preview: string;
    fullContentRef: string;
  }[];
}

// Ejemplo: Comprimir output de Phase 5 (Execution) para Phase 6 (Validation)
function compressExecutionOutput(execution: ExecutionResult): CompressedContext {
  return {
    hash: generateHash(execution),
    summaryTokens: 150,
    fullTokensIfExpanded: 2800,
    compressionRatio: 0.054,  // 94.6% compresión

    summary: `Ejecutados 5 tasks: 4 exitosos, 1 con warnings. Files: About.astro, locales/*.json`,

    keyPoints: [
      '✓ About.astro creado con Layout correcto',
      '✓ Traducciones añadidas (en/es/fr)',
      '⚠ SEO meta description excede 160 chars en ES',
      '✓ Navigation actualizado',
      '✓ Tests placeholder creados'
    ],

    references: [
      { file: 'src/pages/About.astro', relevance: 1.0 },
      { file: 'public/locales/es/common.json', lines: [45, 52], relevance: 0.8 }
    ],

    expandable: [
      {
        section: 'SEO Warning Details',
        preview: 'Meta description ES: 178 chars (max 160)',
        fullContentRef: 'execution.tasks[2].warnings[0]'
      }
    ]
  };
}

// Validation agent puede expandir si necesita más detalles
async function validateWithExpansion(compressed: CompressedContext): Promise<ValidationResult> {
  // Primero, validar con el summary
  const quickCheck = await quickValidate(compressed.summary, compressed.keyPoints);

  if (quickCheck.needsMoreDetail) {
    // Expandir solo las secciones necesarias
    for (const section of quickCheck.sectionsToExpand) {
      const expanded = await contextCompressor.expand(compressed, 'standard');
      // Re-validar con más contexto
    }
  }

  return validationResult;
}
```

### 5. Shared State Management

```typescript
interface SharedState {
  // Estado compartido durante toda la ejecución del task
  taskId: string;
  startTime: Date;

  // Acumulado de todas las fases
  context: {
    filesRead: Map<string, { content: string; readAt: Date }>;
    filesModified: Map<string, { originalContent: string; newContent: string }>;
    discoveries: Discovery[];
    decisions: Decision[];
    warnings: Warning[];
    errors: Error[];
  };

  // Métricas acumuladas
  metrics: {
    totalTokens: number;
    totalCost: number;
    totalDuration: number;
    phaseMetrics: Map<number, PhaseMetrics>;
    agentMetrics: Map<string, AgentMetrics>;
  };

  // Comunicación
  communication: {
    handoffs: HandoffMessage[];
    broadcasts: BroadcastMessage[];
    queries: { query: AgentQuery; response?: AgentResponse }[];
  };

  // Métodos
  addDiscovery(discovery: Discovery): void;
  addDecision(decision: Decision): void;
  getRelevantContext(forPhase: number): RelevantContext;
  getFileIfCached(path: string): string | null;
  recordMetric(phase: number, agent: string, metric: Metric): void;
}

// Singleton para el task actual
class TaskSharedState implements SharedState {
  private static instance: TaskSharedState;

  static getInstance(): TaskSharedState {
    if (!TaskSharedState.instance) {
      TaskSharedState.instance = new TaskSharedState();
    }
    return TaskSharedState.instance;
  }

  // Evitar re-leer archivos ya leídos
  getFileIfCached(path: string): string | null {
    const cached = this.context.filesRead.get(path);
    if (cached && this.isFresh(cached.readAt)) {
      return cached.content;
    }
    return null;
  }

  // Obtener contexto relevante para una fase específica
  getRelevantContext(forPhase: number): RelevantContext {
    // Phase 4 (Planning) necesita: discoveries, decisions, decomposition
    // Phase 5 (Execution) necesita: plan, files, tools
    // Phase 6 (Validation) necesita: execution results, warnings

    const relevanceMap = {
      4: ['discoveries', 'decisions', 'decomposition'],
      5: ['plan', 'files', 'tools'],
      6: ['executionResults', 'warnings', 'modified_files'],
      7: ['all_metrics', 'all_learnings']
    };

    return this.filterContext(relevanceMap[forPhase]);
  }
}
```

### Diagrama de Flujo de Comunicación

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FLUJO DE COMUNICACIÓN COMPLETO (Ejemplo: "Crear página About")             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PHASE 1: EVALUATION (4 agentes en paralelo)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [keyword-detector] ──broadcast──→ [SharedBus] ←──subscribe──→ [*]  │   │
│  │        │ discovery: "page creation + i18n + SEO"                    │   │
│  │        ↓                                                            │   │
│  │  [complexity-scorer] uses discovery → score: 55                     │   │
│  │        ↓                                                            │   │
│  │  [prompt-quality] ──query──→ [keyword-detector]                     │   │
│  │        │ "¿Detectaste contradicciones?"                            │   │
│  │        ↓                                                            │   │
│  │  [confidence-assessor] aggregates all → confidence: 87%            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│        │                                                                   │
│        │ HANDOFF (comprimido)                                              │
│        ↓                                                                   │
│  PHASE 2: CONTEXT LOADING                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [context-loader] receives handoff                                   │   │
│  │        │ reads: Layout.astro, locales/, navigation.js               │   │
│  │        │ caches en SharedState                                       │   │
│  │        ↓                                                            │   │
│  │  [memory-retriever] loads: past errors, preferences                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│        │                                                                   │
│        │ HANDOFF                                                           │
│        ↓                                                                   │
│  PHASE 3: DECOMPOSITION                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [task-lister] → 5 high-level tasks                                 │   │
│  │        │                                                            │   │
│  │        │ HANDOFF interno                                            │   │
│  │        ↓                                                            │   │
│  │  [task-decomposer] ──query──→ SharedState.getFileIfCached()         │   │
│  │        │ (no re-lee Layout.astro, ya está en cache)                │   │
│  │        ↓                                                            │   │
│  │  Output: 5 subtasks con deps                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│        │                                                                   │
│        │ HANDOFF (con nextPhaseInstructions)                              │
│        ↓                                                                   │
│  PHASE 4: PLANNING (con HITL si es necesario)                              │
│        │                                                                   │
│        │ HANDOFF                                                           │
│        ↓                                                                   │
│  PHASE 5: EXECUTION (múltiples agentes según plan)                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [astro-component-gen] ──broadcast──→ "About.astro created"         │   │
│  │  [i18n-manager] ←──subscribe──→ waits for component                 │   │
│  │        │ (dependency: necesita About.astro primero)                │   │
│  │        ↓                                                            │   │
│  │  [i18n-manager] ──broadcast──→ "Translations added"                 │   │
│  │  [seo-optimizer] ←──subscribe──→ proceeds after i18n               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│        │                                                                   │
│        │ HANDOFF (compressed con warnings)                                │
│        ↓                                                                   │
│  PHASE 6: VALIDATION                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [validator] expands compressed context for SEO warning             │   │
│  │        │ ──query──→ [seo-optimizer]: "¿El warning es crítico?"     │   │
│  │        ↓                                                            │   │
│  │  Result: PASS with 1 non-blocking warning                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│        │                                                                   │
│        │ HANDOFF (final summary)                                          │
│        ↓                                                                   │
│  PHASE 7: CONSOLIDATION                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [consolidator] archives: metrics, learnings, patterns              │   │
│  │  SharedState persisted to Archival Memory                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Resumen de Cambios v3.5 → v3.6

| Aspecto | v3.5 | v3.6 |
|---------|------|------|
| Self-Critique | Auto-evaluación después de cada fase | + **Prompt Chain Analysis**: Detectar qué fase falló cuando usuario itera |
| Detección de fallos | Solo en output actual | **Por fase**: Context, Analysis, Decomposition, Planning, Execution, Validation |
| Auto-mejora | Guardar learnings | + **Proponer edits al orchestrator skill** (con permiso del usuario) |
| Comunicación entre agentes | Handoffs básicos | **3 protocolos**: Handoff, Broadcast, Query |
| Agentes en paralelo | Sin comunicación | **SharedBus** para compartir discoveries en tiempo real |
| Contexto | Se pasa completo | **Compresión/Expansión** on-demand (94%+ reducción) |
| Estado compartido | Por fase | **SharedState singleton** para todo el task |

---

## NUEVO v3.7: Conflict Resolution (Resolución de Conflictos entre Agentes)

### Filosofía

> "Cuando 2+ agentes dan recomendaciones contradictorias, el orchestrator DECIDE con criterios claros, NO pregunta al usuario cada vez."

### Tipos de Conflictos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONFLICT TYPES AND RESOLUTION STRATEGIES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. MODEL SELECTION CONFLICT                                                │
│     Agent A: "Usar Haiku (simple task)"                                    │
│     Agent B: "Usar Sonnet (needs quality)"                                 │
│     ────────────────────────────────────────────────────────────────────   │
│     Resolution: HIGHER MODEL WINS (quality > speed)                        │
│     Reason: Es más seguro usar mejor modelo que arriesgarse a baja calidad │
│                                                                             │
│  2. APPROACH CONFLICT                                                       │
│     Agent A: "Crear componente nuevo"                                      │
│     Agent B: "Extender componente existente"                               │
│     ────────────────────────────────────────────────────────────────────   │
│     Resolution: MINIMUM CHANGE WINS (extend > create)                      │
│     Reason: Evitar over-engineering, preferir cambios mínimos              │
│                                                                             │
│  3. PRIORITY CONFLICT                                                       │
│     Agent A: "Fix SEO first"                                               │
│     Agent B: "Fix performance first"                                       │
│     ────────────────────────────────────────────────────────────────────   │
│     Resolution: USER OBJECTIVE ALIGNMENT WINS                              │
│     Check: ¿Qué está más alineado con lo que pidió el usuario?            │
│                                                                             │
│  4. CONFIDENCE TIE                                                          │
│     Agent A: "Confidence 80%"                                              │
│     Agent B: "Confidence 80%"                                              │
│     ────────────────────────────────────────────────────────────────────   │
│     Resolution: HITL (Human In The Loop)                                   │
│     Reason: Si hay empate técnico, escalar al usuario                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación

```typescript
interface ConflictResolution {
  conflictType: 'model' | 'approach' | 'priority' | 'tie' | 'critical';
  agentsInvolved: string[];
  recommendations: AgentRecommendation[];
  resolution: {
    strategy: 'higher_model' | 'minimum_change' | 'user_alignment' | 'hitl' | 'vote';
    winner: AgentRecommendation;
    reason: string;
    confidence: number;
  };
}

function resolveConflict(
  recommendations: AgentRecommendation[],
  userObjective: string
): ConflictResolution {
  // 1. Detect conflict type
  const conflictType = detectConflictType(recommendations);

  // 2. Apply resolution strategy
  switch (conflictType) {
    case 'model':
      // Higher model always wins
      return {
        conflictType: 'model',
        resolution: {
          strategy: 'higher_model',
          winner: recommendations.find(r => r.model === 'opus') ||
                  recommendations.find(r => r.model === 'sonnet') ||
                  recommendations[0],
          reason: 'Quality > speed: selected higher model for safety',
          confidence: 95
        }
      };

    case 'approach':
      // Minimum change wins (avoid over-engineering)
      const ranked = recommendations.sort((a, b) =>
        estimateChangeSize(a) - estimateChangeSize(b)
      );
      return {
        conflictType: 'approach',
        resolution: {
          strategy: 'minimum_change',
          winner: ranked[0],
          reason: 'Prefer minimal changes to avoid over-engineering',
          confidence: 85
        }
      };

    case 'priority':
      // User objective alignment wins
      const alignmentScores = recommendations.map(r => ({
        recommendation: r,
        alignment: calculateAlignmentWithObjective(r, userObjective)
      }));
      const bestAligned = alignmentScores.sort((a, b) =>
        b.alignment - a.alignment
      )[0];
      return {
        conflictType: 'priority',
        resolution: {
          strategy: 'user_alignment',
          winner: bestAligned.recommendation,
          reason: `Most aligned with user objective (${bestAligned.alignment}%)`,
          confidence: bestAligned.alignment
        }
      };

    case 'tie':
      // Escalate to HITL
      return {
        conflictType: 'tie',
        resolution: {
          strategy: 'hitl',
          winner: null,  // User decides
          reason: 'Technical tie - escalating to user',
          confidence: 50
        }
      };

    case 'critical':
      // Critical conflicts (security, data loss risk) ALWAYS escalate
      return {
        conflictType: 'critical',
        resolution: {
          strategy: 'hitl',
          winner: null,
          reason: 'CRITICAL: Security/data risk detected - user must decide',
          confidence: 0
        }
      };
  }
}
```

### Conflict Resolution Matrix

| Conflict Type | Auto-Resolve? | Strategy | Escalate to User? |
|---------------|---------------|----------|-------------------|
| Model Selection | ✓ Sí | Higher model wins | No |
| Approach (create vs extend) | ✓ Sí | Minimum change wins | No |
| Priority (A vs B first) | ✓ Sí | User objective alignment | Solo si empate |
| Confidence Tie | ✗ No | HITL | Sí |
| Security Risk | ✗ NUNCA | HITL obligatorio | SIEMPRE |
| Data Loss Risk | ✗ NUNCA | HITL obligatorio | SIEMPRE |

---

## NUEVO v3.7: Graceful Degradation (Degradación Elegante)

### Filosofía

> "El orchestrator NUNCA debe fallar completamente. Siempre hay un Plan B que funciona."

### Niveles de Degradación

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GRACEFUL DEGRADATION LEVELS                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LEVEL 0: NORMAL OPERATION ✅                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • All phases execute with assigned agents                                  │
│  • Full agent communication (Handoff, Broadcast, Query)                     │
│  • Full observability and metrics                                           │
│                                                                             │
│  LEVEL 1: AGENT FAILURE ⚠️                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Trigger: Un agente específico falla (timeout, error, hallucination)       │
│  Action:                                                                    │
│    1. Circuit breaker abre para ese agente                                  │
│    2. Fallback al siguiente agente en la cadena                            │
│    3. Si ningún fallback disponible → LEVEL 2                              │
│                                                                             │
│  LEVEL 2: PHASE FAILURE ⚠️⚠️                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Trigger: Una fase completa falla (todos los agentes fallaron)             │
│  Action:                                                                    │
│    1. Log detallado del error                                               │
│    2. Skip phase con output degradado (heuristics instead of LLM)          │
│    3. Continuar con siguiente fase (con flag de degradación)               │
│    4. Notificar al usuario al final                                         │
│                                                                             │
│  LEVEL 3: ORCHESTRATOR PARTIAL FAILURE ⚠️⚠️⚠️                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Trigger: Múltiples fases fallan, pero algunas funcionan                   │
│  Action:                                                                    │
│    1. Ejecutar solo las fases que funcionan                                 │
│    2. Output parcial con disclaimer claro                                   │
│    3. Ofrecer: "¿Quieres que reintente las fases fallidas?"               │
│                                                                             │
│  LEVEL 4: ORCHESTRATOR TOTAL FAILURE 🔴                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Trigger: El orchestrator mismo falla (no puede ejecutar ninguna fase)     │
│  Action:                                                                    │
│    1. BYPASS orchestrator completamente                                     │
│    2. Respuesta directa de Claude sin multi-agente                         │
│    3. Mensaje: "Sistema multi-agente no disponible. Respuesta directa:"   │
│    4. Archivar error para post-mortem                                       │
│                                                                             │
│  LEVEL 5: TOTAL SYSTEM FAILURE 🔴🔴                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Trigger: Nada funciona (API down, rate limit, etc.)                       │
│  Action:                                                                    │
│    1. Mensaje amigable de error                                             │
│    2. Sugerir: retry en X minutos, check status page, contact support      │
│    3. NO perder el contexto del usuario (cache localmente si es posible)   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación

```typescript
interface DegradationState {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  failedComponents: string[];
  workingComponents: string[];
  degradedOutput: boolean;
  userNotified: boolean;
}

class GracefulDegradation {
  private state: DegradationState = { level: 0, failedComponents: [], workingComponents: [], degradedOutput: false, userNotified: false };

  async handleFailure(failure: FailureEvent): Promise<RecoveryAction> {
    // Determine degradation level
    if (failure.type === 'agent') {
      return this.handleAgentFailure(failure);
    } else if (failure.type === 'phase') {
      return this.handlePhaseFailure(failure);
    } else if (failure.type === 'orchestrator') {
      return this.handleOrchestratorFailure(failure);
    } else {
      return this.handleTotalFailure(failure);
    }
  }

  private async handleAgentFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.state.level = Math.max(this.state.level, 1);
    this.state.failedComponents.push(failure.agentId);

    // Try fallback chain
    const fallbackChain = getFallbackChain(failure.agentId);
    for (const fallback of fallbackChain) {
      try {
        const result = await executeAgent(fallback, failure.context);
        return { action: 'fallback_success', agent: fallback, result };
      } catch (e) {
        continue;  // Try next fallback
      }
    }

    // All fallbacks failed → escalate to phase failure
    return this.handlePhaseFailure({
      ...failure,
      type: 'phase',
      reason: 'All agent fallbacks exhausted'
    });
  }

  private async handlePhaseFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.state.level = Math.max(this.state.level, 2);
    this.state.degradedOutput = true;

    // Use heuristic fallback instead of LLM
    const heuristicOutput = await executeHeuristicFallback(failure.phaseId, failure.context);

    return {
      action: 'phase_skipped_with_heuristic',
      phaseId: failure.phaseId,
      output: heuristicOutput,
      degraded: true,
      message: `Phase ${failure.phaseId} used fallback heuristics`
    };
  }

  private async handleOrchestratorFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.state.level = 4;

    // Bypass orchestrator, respond directly
    return {
      action: 'bypass_orchestrator',
      message: '⚠️ Multi-agent system unavailable. Direct response:',
      directResponse: true
    };
  }

  // Always show degradation status to user at end
  generateDegradationReport(): string {
    if (this.state.level === 0) return '';

    return `
---
⚠️ **Degradation Notice**
- Level: ${this.state.level}/5
- Failed components: ${this.state.failedComponents.join(', ')}
- Output quality: ${this.state.degradedOutput ? 'Degraded (heuristics used)' : 'Normal'}
- Recommendation: ${this.getRecommendation()}
---
    `;
  }
}
```

### Heuristic Fallbacks por Fase

| Phase | LLM-based | Heuristic Fallback |
|-------|-----------|-------------------|
| Phase 1 (Evaluation) | Keyword detection + complexity scoring | Regex patterns + file count |
| Phase 2 (Context) | Semantic search en memory | Keyword search en archivos recientes |
| Phase 3 (Decomposition) | LLM task breakdown | Split by sentence/bullet points |
| Phase 4 (Planning) | LLM plan generation | Template-based plans |
| Phase 5 (Execution) | Multi-agent execution | Single-pass direct response |
| Phase 6 (Validation) | LLM quality check | Lint + syntax check only |

---

## NUEVO v3.7: User Trust Levels (Niveles de Confianza del Usuario)

### Filosofía

> "El orchestrator adapta su autonomía según cuánto confía el usuario en él. Nuevos usuarios → más HITL. Usuarios expertos → más autonomía."

### Trust Level System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  USER TRUST LEVELS                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LEVEL 1: NEWCOMER (0-10 interactions)                                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • HITL en CADA decisión importante                                         │
│  • Explicaciones detalladas de qué hace y por qué                          │
│  • Confirmación antes de editar cualquier archivo                          │
│  • Sugerir en lugar de ejecutar automáticamente                            │
│                                                                             │
│  LEVEL 2: LEARNING (10-50 interactions)                                     │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • HITL en decisiones de riesgo medio-alto                                  │
│  • Explicaciones concisas (no detalladas)                                   │
│  • Auto-ejecutar cambios de bajo riesgo                                     │
│  • Pedir confirmación solo para archivos críticos                          │
│                                                                             │
│  LEVEL 3: COMFORTABLE (50-200 interactions)                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • HITL solo en decisiones de alto riesgo                                   │
│  • Explicaciones mínimas (solo si hay algo inusual)                        │
│  • Auto-ejecutar la mayoría de cambios                                      │
│  • Confirmación solo para cambios destructivos                             │
│                                                                             │
│  LEVEL 4: EXPERT (200+ interactions)                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • HITL solo en decisiones críticas (security, data loss)                  │
│  • Sin explicaciones a menos que el usuario pregunte                       │
│  • Auto-ejecutar casi todo                                                  │
│  • Usuario puede override cualquier decisión                               │
│                                                                             │
│  LEVEL 5: TRUSTED (Manual override by user)                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • El usuario ha dicho explícitamente "confío en ti"                       │
│  • Máxima autonomía                                                         │
│  • HITL solo para: deploy a producción, delete sin undo, security          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación

```typescript
interface UserTrustProfile {
  userId: string;
  trustLevel: 1 | 2 | 3 | 4 | 5;
  interactionCount: number;
  lastInteraction: Date;

  // Metrics that affect trust
  metrics: {
    acceptanceRate: number;      // % de sugerencias aceptadas
    rollbackRate: number;        // % de cambios que el usuario deshizo
    explicitTrustSignals: number; // Veces que dijo "confío" o similar
    explicitDistrustSignals: number; // Veces que dijo "no hagas eso"
    projectFamiliarity: Map<string, number>; // Trust por proyecto
  };

  // Preferences
  preferences: {
    alwaysAskFor: string[];      // Cosas que siempre quiere confirmar
    neverAskFor: string[];       // Cosas que nunca quiere confirmar
    verbosityLevel: 'detailed' | 'concise' | 'minimal';
  };
}

class UserTrustManager {
  async calculateTrustLevel(userId: string): Promise<number> {
    const profile = await this.getProfile(userId);

    // Base level from interaction count
    let level = 1;
    if (profile.interactionCount >= 10) level = 2;
    if (profile.interactionCount >= 50) level = 3;
    if (profile.interactionCount >= 200) level = 4;

    // Adjust based on metrics
    if (profile.metrics.rollbackRate > 0.2) level = Math.max(1, level - 1);
    if (profile.metrics.acceptanceRate > 0.9 && level < 4) level += 1;
    if (profile.metrics.explicitTrustSignals > 3) level = 5;
    if (profile.metrics.explicitDistrustSignals > 0) level = Math.max(1, level - 1);

    return level;
  }

  async shouldAskForConfirmation(
    action: ProposedAction,
    userId: string
  ): Promise<{ ask: boolean; reason?: string }> {
    const trustLevel = await this.calculateTrustLevel(userId);
    const riskLevel = assessRiskLevel(action);

    // SIEMPRE pedir confirmación para acciones críticas
    if (action.type === 'deploy_production' ||
        action.type === 'delete_without_undo' ||
        action.type === 'security_change') {
      return { ask: true, reason: 'Critical action requires confirmation' };
    }

    // Matrix: Trust Level × Risk Level
    const askMatrix = {
      // trustLevel: { low_risk, medium_risk, high_risk }
      1: { low: true, medium: true, high: true },
      2: { low: false, medium: true, high: true },
      3: { low: false, medium: false, high: true },
      4: { low: false, medium: false, high: true },
      5: { low: false, medium: false, high: true }
    };

    return { ask: askMatrix[trustLevel][riskLevel] };
  }

  // Detect trust signals in user messages
  detectTrustSignals(message: string): 'trust' | 'distrust' | null {
    const trustPatterns = [
      /confío en ti/i,
      /hazlo tú/i,
      /decide tú/i,
      /you know best/i,
      /go ahead/i
    ];

    const distrustPatterns = [
      /no hagas eso/i,
      /para/i,
      /stop/i,
      /eso no/i,
      /mal/i,
      /wrong/i
    ];

    if (trustPatterns.some(p => p.test(message))) return 'trust';
    if (distrustPatterns.some(p => p.test(message))) return 'distrust';
    return null;
  }
}
```

### Autonomy by Trust Level

| Trust Level | File Edit | Create New File | Delete File | Run Commands | Deploy |
|-------------|-----------|-----------------|-------------|--------------|--------|
| 1 (Newcomer) | Ask | Ask | Ask | Ask | Ask |
| 2 (Learning) | Auto | Ask | Ask | Ask | Ask |
| 3 (Comfortable) | Auto | Auto | Ask | Auto* | Ask |
| 4 (Expert) | Auto | Auto | Auto* | Auto | Ask |
| 5 (Trusted) | Auto | Auto | Auto | Auto | Ask* |

*Con undo disponible o reversible

---

## NUEVO v3.7: Explainability (Explicabilidad de Decisiones)

### Filosofía

> "El orchestrator debe poder explicar POR QUÉ tomó cada decisión. Esto es crucial para debugging y para que el usuario confíe."

### Tipos de Explicaciones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXPLAINABILITY LAYERS                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DECISION LOG (Siempre activo, interno)                                  │
│     ────────────────────────────────────────────────────────────────────   │
│     Cada decisión del orchestrator se loguea con:                          │
│     • Timestamp                                                             │
│     • Decision type (model selection, agent selection, conflict, etc.)     │
│     • Options considered                                                    │
│     • Option selected                                                       │
│     • Reason (1 línea)                                                     │
│     • Confidence                                                            │
│                                                                             │
│  2. USER-FACING SUMMARY (Bajo demanda)                                      │
│     ────────────────────────────────────────────────────────────────────   │
│     Cuando el usuario pregunta "¿Por qué hiciste X?":                      │
│     • Resumir las decisiones relevantes                                     │
│     • Lenguaje simple, no técnico                                           │
│     • Ofrecer "más detalles" si quiere profundizar                         │
│                                                                             │
│  3. DEBUG MODE (Activado por usuario: /debug on)                           │
│     ────────────────────────────────────────────────────────────────────   │
│     Mostrar en tiempo real:                                                 │
│     • Cada decisión mientras se toma                                        │
│     • Alternativas descartadas y por qué                                    │
│     • Métricas de confianza                                                 │
│     • Warnings y concerns                                                   │
│                                                                             │
│  4. POST-MORTEM (Después de errores)                                        │
│     ────────────────────────────────────────────────────────────────────   │
│     Cuando algo sale mal, generar automáticamente:                         │
│     • Timeline de decisiones                                                │
│     • Punto donde empezó a ir mal                                           │
│     • Qué información faltaba                                               │
│     • Qué haría diferente la próxima vez                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementación

```typescript
interface Decision {
  id: string;
  timestamp: Date;
  phase: number;
  agent?: string;
  type: 'model_selection' | 'agent_selection' | 'conflict_resolution' |
        'approach_choice' | 'risk_assessment' | 'hitl_decision';
  context: {
    userObjective: string;
    availableOptions: Option[];
    selectedOption: Option;
    rejectedOptions: { option: Option; reason: string }[];
  };
  reasoning: {
    shortReason: string;       // 1 línea
    detailedReason: string;    // Párrafo
    evidence: string[];        // Datos que soportan la decisión
    alternatives: string[];    // Qué más se consideró
    confidence: number;        // 0-100
    risks: string[];           // Riesgos conocidos
  };
}

class ExplainabilityEngine {
  private decisions: Decision[] = [];
  private debugMode: boolean = false;

  // Log every decision
  logDecision(decision: Decision): void {
    this.decisions.push(decision);

    if (this.debugMode) {
      this.emitDebugOutput(decision);
    }
  }

  // User asks "why did you do X?"
  async explainDecision(query: string): Promise<string> {
    // Find relevant decisions
    const relevant = this.findRelevantDecisions(query);

    if (relevant.length === 0) {
      return "No encontré decisiones relacionadas con eso. ¿Puedes ser más específico?";
    }

    // Generate user-friendly explanation
    const explanation = await this.generateExplanation(relevant, 'summary');

    return `
**¿Por qué hice eso?**

${explanation.summary}

${explanation.keyReasons.map(r => `• ${r}`).join('\n')}

_¿Quieres más detalles?_ Di "explica más" o "debug" para ver todo.
    `;
  }

  // Generate post-mortem after failure
  async generatePostMortem(failure: FailureEvent): Promise<PostMortem> {
    const relevantDecisions = this.decisions.filter(d =>
      d.timestamp >= failure.taskStartTime
    );

    // Find the decision that led to failure
    const faultyDecision = await this.identifyFaultyDecision(
      relevantDecisions,
      failure
    );

    return {
      title: `Post-Mortem: ${failure.summary}`,
      timeline: relevantDecisions.map(d => ({
        time: d.timestamp,
        decision: d.reasoning.shortReason,
        wasCorrect: d.id !== faultyDecision?.id
      })),
      rootCause: {
        decision: faultyDecision,
        whyWrong: await this.analyzeWhyWrong(faultyDecision, failure),
        whatWasMissing: await this.identifyMissingInfo(faultyDecision)
      },
      lessons: await this.generateLessons(faultyDecision, failure),
      prevention: await this.suggestPrevention(faultyDecision)
    };
  }

  // Debug mode output
  private emitDebugOutput(decision: Decision): void {
    console.log(`
🔍 [DEBUG] Decision made:
   Type: ${decision.type}
   Phase: ${decision.phase}
   Selected: ${decision.context.selectedOption.name}
   Rejected: ${decision.context.rejectedOptions.map(r => r.option.name).join(', ')}
   Reason: ${decision.reasoning.shortReason}
   Confidence: ${decision.reasoning.confidence}%
   Risks: ${decision.reasoning.risks.join(', ') || 'None identified'}
    `);
  }
}
```

### Explainability Commands

| Command | Description | Output |
|---------|-------------|--------|
| `¿Por qué hiciste X?` | Explicación de decisión específica | Summary + key reasons |
| `/debug on` | Activar modo debug | Real-time decision logs |
| `/debug off` | Desactivar modo debug | Normal output |
| `/explain all` | Todas las decisiones de este task | Full decision timeline |
| `/postmortem` | Después de error | Root cause + lessons |

---

## Resumen de Cambios v3.6 → v3.7 (FINAL)

| Aspecto | v3.6 | v3.7 |
|---------|------|------|
| Conflictos entre agentes | Sin manejo | **Conflict Resolution**: Auto-resolve con criterios claros |
| Fallos del sistema | Circuit breaker solo | **Graceful Degradation**: 5 niveles con heuristic fallbacks |
| Autonomía | Igual para todos | **User Trust Levels**: Adapta autonomía según experiencia |
| Transparencia | Logs internos | **Explainability**: Post-mortems, debug mode, "¿Por qué?" |

---

## Arquitectura Final v3.7

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR v3.7 - ARQUITECTURA COMPLETA                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  USER INPUT                                                          │   │
│  │  ↓                                                                   │   │
│  │  PROMPT CHAIN ANALYZER → ¿Es iteración? → Detectar fase fallida     │   │
│  │  ↓                                                                   │   │
│  │  USER TRUST MANAGER → Calcular trust level → Ajustar autonomía      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  8 PHASES (0-7)                                                      │   │
│  │  ├── Phase 0: Pre-Analysis (cache, budget)                          │   │
│  │  ├── Phase 1: Evaluation (keywords, complexity, confidence)         │   │
│  │  ├── Phase 2: Context Loading (memory, errors, preferences)         │   │
│  │  ├── Phase 3: Decomposition (task-lister, task-decomposer)          │   │
│  │  ├── Phase 4: Planning (iterative, HITL checkpoints)                │   │
│  │  ├── Phase 5: Execution (multi-agent, TodoWrite)                    │   │
│  │  ├── Phase 6: Validation (quality gates, security)                  │   │
│  │  └── Phase 7: Consolidation (learnings, patterns, metrics)          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CROSS-CUTTING CONCERNS                                              │   │
│  │  ├── Agent Communication Protocol (Handoff, Broadcast, Query)       │   │
│  │  ├── Conflict Resolution (auto-resolve con criterios)               │   │
│  │  ├── Graceful Degradation (5 niveles + heuristic fallbacks)         │   │
│  │  ├── Explainability Engine (decisions, debug, post-mortem)          │   │
│  │  ├── Self-Critique Loop (después de cada fase)                      │   │
│  │  ├── Cost-Efficiency Tracker (ROI, diminishing returns)             │   │
│  │  └── Memory Management (MemGPT: core, working, archival)            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  OBSERVABILITY                                                       │   │
│  │  ├── Langfuse Integration (traces, spans, generations)              │   │
│  │  ├── KPIs Dashboard (latency, tokens, cost, quality)                │   │
│  │  └── Metrics Archival (cross-session learning)                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  OUTPUT → User (con degradation report si aplica)                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Archivos a Crear/Modificar (Actualizado v3.7 FINAL)

### Core Files

| File | Type | Purpose |
|------|------|---------|
| `.claude/skills/adaptive-meta-orchestrator/SKILL.md` | Edit | Main orchestrator skill (actualizar con v3.7) |
| `.claude/lib/conflict-resolution.ts` | Create | Conflict Resolution engine |
| `.claude/lib/graceful-degradation.ts` | Create | Degradation levels + fallbacks |
| `.claude/lib/user-trust.ts` | Create | Trust level management |
| `.claude/lib/explainability.ts` | Create | Decision logging + explanations |
| `.claude/lib/prompt-chain-analyzer.ts` | Create | Prompt iteration detection |
| `.claude/lib/agent-communication.ts` | Create | Handoff, Broadcast, Query protocols |
| `.claude/lib/shared-state.ts` | Create | SharedState singleton |
| `.claude/lib/context-compressor.ts` | Create | Context compression/expansion |

### Agent Files

| File | Type | Purpose |
|------|------|---------|
| `.claude/agents/task-lister-agent.md` | Create | Phase 3a agent |
| `.claude/agents/task-decomposer-agent.md` | Create | Phase 3b agent |
| `.claude/agents/planning-agent.md` | Edit | Add HITL checkpoints |
| `.claude/agents/validation-agent.md` | Edit | Add expanded quality gates |

### Config Files

| File | Type | Purpose |
|------|------|---------|
| `.claude/config/skill-rules.json` | Create | Enforcement levels |
| `.claude/config/trust-profiles.json` | Create | User trust configurations |
| `.claude/config/degradation-config.yaml` | Create | Fallback configurations |
| `.claude/config/conflict-rules.yaml` | Create | Conflict resolution rules |

### Hook Files

| File | Type | Purpose |
|------|------|---------|
| `.claude/hooks/forced-evaluation.py` | Create | Tripwire enforcement |
| `.claude/hooks/trust-signal-detector.py` | Create | Detect trust/distrust |

---

*Plan v3.7 FINAL - Orchestrator Multi-Agente con Conflict Resolution, Graceful Degradation, User Trust Levels, y Explainability*
