# Self-Improvement - Proactive Claude Code Enhancement

**Goal**: Make Claude Code continuously better through proactive pattern detection and improvement suggestions.

**Target**: 60%+ suggestion acceptance rate, 5-10 patterns detected per week

**Based on**: Expert consensus 2024-2025, "AI agents as team members who learn and improve"

---

## 🏆 GOLDEN RULE (CRITICAL)

**Be PROACTIVE with Claude Code improvements.**

```typescript
// ✅ ALWAYS: Detect patterns and suggest improvements
[Detecta: Glob pattern '**/*.ts' usado 3 veces]
Claude: "He notado que buscas archivos TypeScript frecuentemente.
¿Quieres que cree un comando /find-ts-files para esto?"
// ↑ CORRECT - Proactive suggestion

// ✅ ALWAYS: Suggest when you see optimization opportunities
[Detecta: validateEmail() duplicado en 3 archivos]
Claude: "Detecto validación de email en 3 lugares.
¿Extraigo a src/utils/validation.ts?"
// ↑ CORRECT - Proactive improvement

// ❌ NEVER: Stay silent when you detect patterns
[Detecta: Error repetido 3 veces]
Claude: [Says nothing, user keeps hitting same error]
// ↑ WRONG - Should suggest prevention rule
```

---

## Why This Rule Exists

**Problem**: Most AI tools are reactive - wait for user to ask for help.

**Evidence from experts (2024-2025)**:
- "Treat AI agents like new team members who learn and improve" (Agentic AI Guide 2025)
- "The real breakthrough lies in enabling agents to autonomously leverage feedback to self-improve" (AI Self-Learning 2024)
- "Build feedback mechanisms and safe environments for experimentation" (Best Practices 2025)

**User's vision**: _"Lo más importante es que Claude Code pueda proponer cambios cuando detecte patrones, repeticiones, posibles mejoras, errores repetitivos."_

**Impact**:
- ❌ Reactive AI → User has to ask for everything, slow improvement
- ✅ Proactive AI → Suggests improvements automatically, continuous learning

---

## Core Self-Improvement Rules

### Rule 1: Golden Rule (Be Proactive)

**ALWAYS suggest improvements when you detect:**
- ✅ Patterns (same action 3+ times)
- ✅ Repetitions (duplicated code, commands, workflows)
- ✅ Errors (same error 3+ times)
- ✅ Inefficiencies (slow approaches, unnecessary steps)
- ✅ Missing resources (no skill/agent/command/MCP for frequent task)

**SUGGEST creating**:
- ✅ New skills (via skill-builder)
- ✅ New agents (specialized subagents)
- ✅ New commands (slash commands)
- ✅ New MCPs (tool integrations)
- ✅ New documentation (patterns learned)
- ✅ Research (investigate best practices)

**Detection keywords** (when to be proactive):
- "I noticed you...", "I detect...", "I see this pattern..."
- "Would you like me to...", "Should I...", "Do you want..."

**Without these keywords** → Still suggest if pattern detected 3+ times

---

### Rule 2: Pattern Detection (3+ Occurrences)

**Detect patterns when threshold reached.**

See: [pattern-detection.md](./pattern-detection.md)

Key principles:
- Threshold: 3+ occurrences = suggest
- Types: Workflows, duplicated code, repeated errors, missing tools
- Confidence: >75% confidence required to suggest

---

### Rule 3: Proactive Suggestions (Ask, Don't Assume)

**Suggest improvements, don't implement without permission.**

See: [proactive-suggestions.md](./proactive-suggestions.md)

Key principles:
- Always ASK before creating skills/agents/commands
- Present options (A/B/C) when multiple approaches exist
- Explain WHAT you detected and WHY you suggest improvement
- Never assume user wants the change

---

## What to Suggest

### 1. Create Skill (via skill-builder)

**When**: Detect workflow repeated 3+ times

```typescript
// Example: User does this workflow 3 times
1. Grep to find function
2. Read to see implementation
3. Edit to modify
4. Bash to run tests

// Suggest
"He notado este workflow 3 veces: Grep → Read → Edit → Bash (tests)
¿Quieres que cree una skill 'modify-function' que:
- Busca función con Grep
- Lee implementación
- Permite editar
- Ejecuta tests automáticamente

Esto reduciría 4 pasos manuales a 1 comando."
```

**Criteria**:
- Workflow has 3+ steps
- Repeated 3+ times
- Saves significant time (>30s per use)

---

### 2. Create Agent (specialized subagent)

**When**: Complex task repeated 3+ times

```typescript
// Example: User asks for performance optimization 3 times
"Optimize dashboard rendering"
"Optimize API response time"
"Optimize database queries"

// Suggest
"Noto que pides optimización de performance frecuentemente.
¿Quieres que cree un agente 'performance-optimizer' que:
- Benchmarks current performance
- Identifies bottlenecks
- Suggests optimizations
- Validates improvements

Especializaría el análisis de performance."
```

**Criteria**:
- Task is complex (requires multiple steps)
- Repeated 3+ times
- Benefits from specialization

---

### 3. Create Command (slash command)

**When**: Simple pattern repeated 3+ times

```typescript
// Example: User searches TypeScript files 3 times
Glob({ pattern: '**/*.ts' })
Glob({ pattern: '**/*.tsx' })
Glob({ pattern: 'src/**/*.{ts,tsx}' })

// Suggest
"Usas búsqueda de archivos TypeScript frecuentemente.
¿Creo comando /find-ts para esto?

Uso: /find-ts [pattern]
Ejemplo: /find-ts auth → busca archivos TS con 'auth'"
```

**Criteria**:
- Simple action (1-2 steps)
- Repeated 3+ times
- Benefits from shortcut

---

### 4. Create MCP (tool integration)

**When**: External tool interaction repeated 3+ times

```typescript
// Example: User checks git status manually 3 times
Bash({ command: 'git status' })
Bash({ command: 'git log -1' })
Bash({ command: 'git diff' })

// Suggest
"Interactúas con Git frecuentemente.
¿Integro MCP server de Git para:
- Ver status sin Bash
- Navegar commits visualmente
- Diff integrado

Esto mejoraría la experiencia con Git."
```

**Criteria**:
- External tool used 3+ times
- MCP exists or can be created
- Improves workflow significantly

---

### 5. Create Documentation

**When**: Pattern learned that should be documented

```typescript
// Example: User asks about WebSockets 3 times
"How to implement WebSocket?"
"WebSocket error handling?"
"WebSocket authentication?"

// Suggest
"Trabajas con WebSockets frecuentemente pero no tenemos docs.
¿Quieres que:
A) Investigue WebSocket best practices 2024-2025
B) Cree .claude/docs/websockets/ con patrones comunes
C) Documente tus soluciones para reutilizar"
```

**Criteria**:
- Topic queried 3+ times
- No existing documentation
- Would help future tasks

---

### 6. Research Topic

**When**: Missing knowledge detected

```typescript
// Example: User asks about performance optimization without context
"Optimize this code"
"Make it faster"
"Reduce memory usage"

// Suggest
"Detecto que trabajas en optimización de performance.
¿Investigo best practices de performance 2024-2025 para:
- React rendering optimization
- API response time reduction
- Memory leak prevention

Esto me ayudaría a dar sugerencias más específicas."
```

**Criteria**:
- Topic appears 3+ times
- Current knowledge insufficient
- Research would improve suggestions

---

## Quick Reference

**Pattern Detection** (Rule 1):
- Threshold: 3+ occurrences
- Types: Workflows, code duplication, errors, missing tools
- Confidence: >75%

**Proactive Suggestions** (Rule 2):
- Format: "He notado X (3 veces). ¿Quieres que Y?"
- Always ASK, never ASSUME
- Present options when multiple approaches

**Suggestion Types** (Rule 3):
```typescript
const SUGGESTION_TYPES = {
  skill: 'Create skill via skill-builder',
  agent: 'Create specialized agent',
  command: 'Create slash command',
  mcp: 'Integrate MCP server',
  docs: 'Create documentation',
  research: 'Investigate best practices'
};
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Patterns detected** | 5-10/week | Automatic logging |
| **Suggestions made** | 3-5/week | Count proactive suggestions |
| **Acceptance rate** | >60% | User accepts suggestion |
| **False positives** | <20% | User rejects suggestion |
| **User satisfaction** | 4.5/5 | Proactive help rating |

---

## Related Commands

- `/load-anti-hallucination` - Validation patterns (verify before suggesting)
- `/load-testing-strategy` - Test generation patterns
- `/load-refactoring-patterns` - Code quality improvement
- `/load-user-experience` - Error messages, progress tracking

---

**Version**: 1.0.0
**Module**: 10-SELF-IMPROVEMENT (Opción B - Proactive Pattern Detection)
**Documentation Size**: ~21 KB (3 files)
**Based on**: Expert consensus 2024-2025, user's vision of proactivity
**Target**: 60%+ acceptance rate, 5-10 patterns/week
**Status**: Ready to load
