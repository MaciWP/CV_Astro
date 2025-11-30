# Explainability - Orchestrator v3.7

> Reference: `.claude/config/orchestrator-settings.json` → `features.explainability`
> State: `.claude/state/decisions.jsonl`

## Purpose

Enable users to understand WHY the orchestrator made specific decisions. Provides transparency and builds trust.

---

## Decision Logging

All orchestrator decisions are logged to `.claude/state/decisions.jsonl`:

### Log Entry Schema

```json
{
  "timestamp": "2025-01-29T10:30:00Z",
  "taskId": "task_abc123",
  "phase": 3,
  "type": "tool_selection",
  "decision": "Selected backend-expert over frontend-expert",
  "reasoning": [
    "Keywords detected: 'api', 'endpoint', 'database'",
    "Complexity score: 65 (high)",
    "Task type: backend (95% confidence)"
  ],
  "alternatives": [
    {"option": "frontend-expert", "score": 0.15, "reason": "No frontend keywords"},
    {"option": "full-stack", "score": 0.45, "reason": "Partial match"}
  ],
  "confidence": 0.92,
  "outcome": null
}
```

### Decision Types

```yaml
types:
  - tool_selection: Which agent/skill was chosen
  - complexity_scoring: How complexity was calculated
  - strategy_selection: Sequential vs parallel
  - conflict_resolution: How conflicts were resolved
  - degradation: Why orchestration level changed
  - trust_adjustment: Why trust level changed
  - skip_phase: Why a phase was skipped
  - user_escalation: Why user was asked
```

---

## Explainability Queries

Users can ask about decisions:

### Query: "¿Por qué elegiste X?"

```yaml
trigger_patterns:
  - "¿Por qué (elegiste|usaste|hiciste) X?"
  - "Why did you (choose|use|do) X?"
  - "Explain your decision about X"
  - "/explain X"

response_format:
  title: "📋 Explicación de decisión"
  sections:
    - what: "Qué hice"
    - why: "Por qué lo hice"
    - alternatives: "Otras opciones consideradas"
    - confidence: "Nivel de confianza"
```

### Example Interaction

```
User: "¿Por qué usaste backend-expert en vez de full-stack?"

Orchestrator:
📋 Explicación de decisión

**Qué hice**: Seleccioné `backend-expert` para manejar tu solicitud de "crear endpoint API".

**Por qué**:
1. Detecté keywords de backend: "api", "endpoint", "database" (3 matches)
2. No detecté keywords de frontend (0 matches)
3. El score de backend-expert fue 0.92 vs 0.45 de full-stack

**Otras opciones**:
- `full-stack`: Score 0.45 - No era necesario para tarea solo-backend
- `frontend-expert`: Score 0.15 - No relevante para esta tarea

**Confianza**: 92% en esta decisión
```

---

## Post-Mortem on Errors

When errors occur, automatic post-mortem:

### Trigger

```yaml
triggers:
  - Task failed to complete
  - User indicated error: "no", "mal", "wrong"
  - Rollback requested
  - Iteration detected (user correcting)
```

### Post-Mortem Structure

```json
{
  "timestamp": "2025-01-29T10:35:00Z",
  "taskId": "task_abc123",
  "type": "post_mortem",
  "error": {
    "type": "incorrect_output",
    "userFeedback": "No, me refería a otro archivo"
  },
  "analysis": {
    "phasesFailed": [1],
    "rootCause": "Keyword detection missed context",
    "factors": [
      "User message was ambiguous",
      "Similar file names in project",
      "Confidence was 68% (below 70% threshold)"
    ]
  },
  "prevention": {
    "shouldHaveAsked": true,
    "question": "¿Te refieres a src/utils/api.ts o src/api/routes.ts?",
    "learnings": [
      "When multiple files match, ask user",
      "68% confidence should trigger clarification"
    ]
  },
  "actionTaken": "Added pattern to question-generator triggers"
}
```

---

## Agent: explainability-engine

Dedicated agent for explanations:

```yaml
invocation: Task(subagent_type: 'explainability-engine')
input: Query about decision + decisions log
output: User-friendly explanation

responsibilities:
  - Parse decisions.jsonl for relevant entries
  - Generate human-readable explanations
  - Suggest improvements based on patterns
  - Create post-mortems on errors
```

---

## Transparency Levels

Adapt verbosity based on user trust level:

| Trust | Transparency | Example |
|-------|--------------|---------|
| 1-2 | High | Full explanation before each action |
| 3 | Medium | Brief summary, details on request |
| 4 | Low | Minimal, only on errors |
| 5 | Silent | Log only, no proactive explanation |

---

## Explanation Templates

### Tool Selection

```markdown
**Seleccioné {tool}** porque:
- Keywords detectados: {keywords}
- Score: {score}% (umbral: 70%)
- Alternativas: {alternatives}
```

### Complexity Scoring

```markdown
**Complejidad calculada: {score}/100**
- Archivos afectados: {files} (+{file_score})
- Duración estimada: {duration} (+{duration_score})
- Dependencias: {deps} (+{dep_score})
- Riesgo: {risk} (+{risk_score})
```

### Strategy Selection

```markdown
**Estrategia: {strategy}**
- Dependencias entre tareas: {has_deps}
- Tareas parallelizables: {parallel_count}
- Speedup estimado: {speedup}x
```

---

## Learning from Explanations

When users ask "why" and then correct:

```yaml
learning_flow:
  1. User asks: "¿Por qué hiciste X?"
  2. System explains reasoning
  3. User corrects: "No, debiste hacer Y porque Z"
  4. System logs correction
  5. System updates patterns for future

example:
  user_question: "¿Por qué usaste haiku?"
  system_explanation: "Complejidad 35 < 40 umbral para sonnet"
  user_correction: "Esto era complejo, debiste usar sonnet"
  learning:
    - "Adjust complexity for 'multiple files' keyword"
    - "This task type should +10 to complexity"
```

---

## Privacy

Explanation logs are:
- Stored locally only (`.claude/state/`)
- Never sent to external services
- Can be cleared with `/explain clear`
- Auto-pruned after 30 days

---

## Configuration

In `.claude/config/orchestrator-settings.json`:

```json
{
  "explainability": {
    "enabled": true,
    "logDecisions": true,
    "postMortemOnError": true,
    "retentionDays": 30,
    "verbosityByTrustLevel": true
  }
}
```

---

## Commands

```
/explain [decision]  → Explain specific decision
/explain last        → Explain most recent decision
/explain errors      → Show recent error post-mortems
/explain clear       → Clear explanation logs
```

---

*Part of Orchestrator v3.7 - Explainability Module*
