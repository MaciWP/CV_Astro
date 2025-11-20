# ULTRATHINK: Sistema de Skills - Análisis Profundo & Plan de Acción

**Fecha**: 2025-11-17
**Objetivo**: Lograr **rendimiento/certeza excepcional** con Claude Code a través de un sistema de skills optimizado
**Contexto**: Skills son el **segundo pilar más importante** porque el orchestrator depende 100% de ellas

---

## 📊 PARTE 1: INVENTARIO ACTUAL (Estado Real vs Ideal)

### Skills Existentes (10 total)

| # | Skill Name | Tamaño | Estructura | YAML | Triggers | Calidad |
|---|------------|--------|------------|------|----------|---------|
| 1 | **adaptive-meta-orchestrator** | ~500KB | SKILL.md + 60+ resources | ❌ No | ❌ No | ⭐⭐⭐⭐⭐ |
| 2 | **skill-builder** | ~15KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐⭐⭐⭐ |
| 3 | **task-decomposer** | ~12KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐⭐⭐ |
| 4 | **task-router** | ~8KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐⭐⭐ |
| 5 | **code-analyzer** | ~3KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐ |
| 6 | **orchestrator-observability** | ~10KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐⭐⭐ |
| 7 | **security-auditor** | ~12KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐⭐⭐ |
| 8 | **utils-builder** | ~7KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐⭐ |
| 9 | **spec-architect-agent** | ~9KB | SKILL.md only | ✅ Sí | ❌ No | ⭐⭐⭐ |
| 10 | **persistent-memory** | ~17KB | .md (no SKILL.md) | ❌ No | ❌ No | ⭐⭐⭐ |

**Observaciones Críticas**:
- ✅ **Calidad de contenido**: Todos los skills tienen buena documentación
- ❌ **Formato inconsistente**: persistent-memory no sigue el patrón SKILL.md
- ❌ **Falta orchestrator**: Solo 1 skill tiene recursos externos (adaptive-meta-orchestrator)
- ❌ **Sin activation triggers formales**: Ningún skill tiene YAML con keywords, filePaths, techStack
- ❌ **Sin system de métricas**: No hay tracking de usage, success rate, etc.

---

## 🎯 PARTE 2: GAPS CRÍTICOS (Actual vs SPEC)

### Gap Analysis Table

| Feature | SPEC Target | Current State | Gap | Severity |
|---------|-------------|---------------|-----|----------|
| **Skill Count** | 50+ skills | 10 skills | **40 skills missing** | 🔴 Critical |
| **Activation Rate** | 95%+ | 60-80% (estimado) | **15-35% gap** | 🔴 Critical |
| **Auto-Generation** | Pattern detection → auto-generate | 0 (manual only) | **100% gap** | 🟠 High |
| **Multi-Trigger Activation** | keywords + filePaths + techStack | Solo keywords parciales | **66% gap** | 🔴 Critical |
| **Metrics Tracking** | PostgreSQL logs | No implementado | **100% gap** | 🟠 High |
| **Skill Deprecation** | Auto-deprecate <10% usage | No implementado | **100% gap** | 🟡 Medium |
| **A/B Testing** | Shadow mode | No implementado | **100% gap** | 🟡 Medium |
| **Validation System** | Quality gates 85/100 | Manual review only | **100% gap** | 🟠 High |
| **Discovery Mechanism** | Orchestrator knows all skills | No mechanism | **100% gap** | 🔴 Critical |
| **Skill Composition** | Skill chaining | No implemented | **100% gap** | 🟠 High |

**Total Coverage**: ~25% del SPEC (2.5/10 features implementadas)

---

## 🔬 PARTE 3: ANÁLISIS PROFUNDO (Problemas Raíz)

### Problema 1: Sin Sistema de Discovery

**Situación Actual**:
```typescript
// El orchestrator NO sabe qué skills existen
// No puede activarlos automáticamente
// El usuario debe invocarlos manualmente via Skill({ skill: 'name' })
```

**Impacto**:
- 🔴 **Activation rate baja**: 60-80% vs target 95%
- 🔴 **Friction alta**: Usuario debe conocer skills disponibles
- 🔴 **Subutilización**: Skills poderosos no se usan porque no se descubren

**Root Cause**:
- No existe `skills-registry.json` o similar
- No existe scan automático de `.claude/skills/`
- No existe matching algorithm (keywords → skills)

---

### Problema 2: Sin Activation Triggers Formales

**Situación Actual**:
```yaml
# skill-builder SKILL.md actual
---
name: skill-builder
description: |
  This skill should be used when creating new skills...
---
```

**SPEC Requirement**:
```yaml
# SPEC espera esto:
---
name: skill-builder
version: 1.0.0
priority: high
activationTriggers:
  keywords:
    - "create skill"
    - "new agent"
    - "automate pattern"
  filePaths:
    - ".claude/skills/**"
  techStack:
    - claude-code: "*"
---
```

**Impacto**:
- 🔴 **Activation manual**: Orchestrator no puede detectar automáticamente
- 🔴 **Ambigüedad**: "This skill should be used when..." es texto libre, no programático
- 🔴 **Sin priorización**: No hay campo `priority` para resolver conflictos

**Root Cause**:
- YAML frontmatter no sigue SPEC template
- Skills creados antes del SPEC (legacy)
- Sin migration path de formato viejo → nuevo

---

### Problema 3: Sin Metrics & Observability

**Situación Actual**:
```
❌ No tracking de:
   - Cuántas veces se activó cada skill
   - Success rate de cada skill
   - Avg execution time
   - Token usage per skill
   - False positives (activó cuando no debía)
```

**SPEC Requirement**:
```sql
-- SPEC espera tabla en PostgreSQL:
CREATE TABLE skill_executions (
  id SERIAL PRIMARY KEY,
  skill_name TEXT NOT NULL,
  trigger_type TEXT, -- 'keyword', 'file_path', 'tech_stack', 'explicit'
  success BOOLEAN,
  execution_time INT, -- milliseconds
  token_usage INT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Impacto**:
- 🔴 **Sin feedback loop**: No sabemos qué skills funcionan bien/mal
- 🔴 **Sin deprecation**: No podemos detectar skills <10% usage
- 🔴 **Sin A/B testing**: No podemos comparar variants

**Root Cause**:
- No existe `orchestrator-observability` implementation real
- Skill existe (10KB de docs) pero no ejecuta el tracking
- Sin integración con PostgreSQL de Poneglyph

---

### Problema 4: Sin Auto-Generation de Skills

**Situación Actual**:
```
❌ Pattern detection: 0
❌ Auto-generated skills: 0
❌ Skill suggestions: 0
```

**SPEC Requirement** (Scenario 4):
```typescript
// Cuando pattern se repite 3+ veces:
async function suggestSkillGeneration(pattern: string): Promise<void> {
  const userConfirmed = await askUser(`
I've noticed you've done "${pattern}" 3 times.
Should I create a skill to automate this?
  `);

  if (userConfirmed) {
    await skillBuilder.generate({ pattern, examples });
  }
}
```

**Impacto**:
- 🟠 **Crecimiento lento**: 10 skills en total, lejos de target 50+
- 🟠 **Repetición manual**: Mismos patterns se ejecutan manualmente
- 🟠 **Desperdicio de oportunidades**: Patterns obvios no se capturan

**Root Cause**:
- Pattern detector no implementado
- skill-builder existe pero solo se invoca manualmente
- Sin tracking de conversational patterns

---

### Problema 5: Sin Skill Composition / Chaining

**Situación Actual**:
```typescript
// Skills NO pueden llamar a otros skills
// Cada skill es aislado
// No existe orchestración entre skills
```

**SPEC Requirement**:
```typescript
// Skills deberían poder componer workflows:
async function complexFeature() {
  const decomposed = await Skill({ skill: 'task-decomposer' });
  for (const subtask of decomposed) {
    const routed = await Skill({ skill: 'task-router' });
    await executeSubtask(routed);
  }
  await Skill({ skill: 'code-analyzer' }); // Validate
}
```

**Impacto**:
- 🟠 **Workflows rígidos**: No pueden composarse dinámicamente
- 🟠 **Orchestrator sobrecargado**: Toda lógica de composición está en 1 skill
- 🟠 **Sin reusabilidad**: No se pueden combinar skills pequeños

**Root Cause**:
- Skills no tienen acceso a Skill() tool
- Sin context passing entre skills
- Sin return values estandarizados

---

## 🧠 PARTE 4: BEST PRACTICES (CrewAI, LangGraph, AutoGen)

### CrewAI Best Practices Aplicables

**1. Role-Based Design** ✅ Ya aplicado
```
✅ Tenemos: skill-builder, task-decomposer, code-analyzer (roles específicos)
✅ Cada skill tiene expertise clara
```

**2. 80/20 Rule** ❌ Parcialmente aplicado
```
SPEC dice: "80% effort on task design, 20% on agent definition"

❌ Actual: Skills tienen definición larga pero tareas vagas
✅ Debería: Skills cortos con ejemplos de tasks detallados

Ejemplo:
  Actual: "This skill should be used when creating new skills..."
  Mejor: "ACTIVATE when: User says 'create skill for X' OR detects pattern repetition 3+ times"
```

**3. Controlled Delegation** ❌ No implementado
```
SPEC dice: "Agents only delegate to specified subordinates"

❌ Actual: orchestrator puede llamar a cualquier skill, skills no pueden delegar
✅ Debería: Skills específicos (como adaptive-meta-orchestrator) pueden delegar a sub-skills

Ejemplo:
  adaptive-meta-orchestrator → [task-decomposer, task-router, code-analyzer]
  skill-builder → NO puede delegar (worker puro)
```

---

### LangGraph Best Practices Aplicables

**4. Type Safety** ❌ No implementado
```
SPEC dice: "Enforce data consistency with typed schemas"

❌ Actual: Skills retornan texto libre, sin schema
✅ Debería: Skills retornan JSON con schema validado

Ejemplo:
  interface TaskDecompositionResult {
    subtasks: Subtask[];
    dependencies: Dependency[];
    estimatedDuration: number; // minutes
  }
```

**5. Conditional Routing** ✅ Parcialmente aplicado
```
✅ Actual: orchestrator decide qué skill activar based on context
❌ Falta: Skills NO pueden decidir next skill
```

**6. Error Isolation** ❌ No implementado
```
SPEC dice (Q14): "Fallback cascade: Retry 2x → direct execution → ask user"

❌ Actual: Si skill falla, todo falla
✅ Debería: Skill failure NO rompe workflow

Ejemplo:
  try {
    await Skill({ skill: 'security-auditor' });
  } catch (error) {
    // Continuar con otros skills, registrar error
    await logSkillFailure('security-auditor', error);
  }
```

---

### AutoGen Best Practices Aplicables

**7. Conversational Patterns** ✅ Ya aplicado
```
✅ Actual: Skills reciben user message + context
✅ Skills retornan results al orchestrator
```

**8. Quality Validation (Peer Review)** ❌ Parcialmente aplicado
```
SPEC dice: "Agents validate each other's work"

❌ Actual: code-analyzer existe pero no se usa automáticamente
✅ Debería: Después de skill-builder, auto-run code-analyzer

Ejemplo:
  const newSkill = await Skill({ skill: 'skill-builder', ... });
  const validation = await Skill({ skill: 'code-analyzer', target: newSkill });
  if (validation.score < 85) {
    await askUser('Generated skill scored ${score}/100. Approve?');
  }
```

**9. Failure Handling** ❌ No implementado
```
SPEC dice (Q14): "Mechanisms for loops, hallucinations, failures"

❌ Actual: Sin timeout, sin retry, sin circuit breaker
✅ Debería: Timeout per skill (SPEC: 5000ms target)

Ejemplo:
  const timeout = skill.timeout || 5000; // milliseconds
  const result = await Promise.race([
    executeSkill(skill),
    sleep(timeout).then(() => throw new TimeoutError())
  ]);
```

**10. Trustworthiness Tracking** ❌ No implementado
```
SPEC dice (Scenario 6): "Track effectiveness metrics"

❌ Actual: No tracking
✅ Debería: Trust score per skill (0-1)

Formula:
  trust_score = (
    success_rate * 0.50 +
    (1 - false_positive_rate) * 0.30 +
    (avg_time < 5000ms ? 1 : 0.5) * 0.20
  )
```

---

## 🎯 PARTE 5: DISEÑO DE MEJORAS (Priorizado)

### Mejora 1: Skills Discovery & Registry System (🔴 Critical - 1 semana)

**Objetivo**: Orchestrator puede descubrir y activar skills automáticamente

**Implementación**:

```typescript
// 1. Crear skills-registry.json (auto-generated)
interface SkillRegistry {
  skills: SkillMetadata[];
  lastUpdated: string;
}

interface SkillMetadata {
  name: string;
  path: string; // .claude/skills/skill-builder/SKILL.md
  version: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  activationTriggers: {
    keywords: string[];
    filePaths: string[]; // glob patterns
    techStack: Record<string, string>; // { vue: "^3.0.0" }
  };
  capabilities: string[]; // ["skill-creation", "validation", "pattern-enforcement"]
  dependencies: string[]; // Other skills needed
}

// 2. Scan automático de .claude/skills/
async function buildSkillsRegistry(): Promise<SkillRegistry> {
  const skillPaths = await Glob({ pattern: '.claude/skills/**/SKILL.md' });

  const skills = await Promise.all(
    skillPaths.map(async (path) => {
      const content = await Read({ file_path: path });
      const yaml = parseYAMLFrontmatter(content);
      return {
        name: yaml.name,
        path,
        version: yaml.version || '1.0.0',
        priority: yaml.priority || 'medium',
        activationTriggers: yaml.activationTriggers || { keywords: [], filePaths: [], techStack: {} },
        capabilities: yaml.capabilities || [],
        dependencies: yaml.dependencies || []
      };
    })
  );

  return {
    skills,
    lastUpdated: new Date().toISOString()
  };
}

// 3. Activation matching algorithm
async function findMatchingSkills(context: {
  userMessage: string;
  currentFile?: string;
  techStack: Record<string, string>;
}): Promise<SkillMetadata[]> {
  const registry = await loadSkillsRegistry(); // Cached
  const matches: SkillMatch[] = [];

  for (const skill of registry.skills) {
    let score = 0;

    // Match keywords
    const keywords = skill.activationTriggers.keywords;
    const matchedKeywords = keywords.filter(kw =>
      context.userMessage.toLowerCase().includes(kw.toLowerCase())
    );
    score += matchedKeywords.length * 10;

    // Match file paths
    if (context.currentFile) {
      const pathPatterns = skill.activationTriggers.filePaths;
      if (pathPatterns.some(pattern => minimatch(context.currentFile, pattern))) {
        score += 20;
      }
    }

    // Match tech stack
    const techStack = skill.activationTriggers.techStack;
    const techMatches = Object.entries(techStack).filter(([tech, version]) =>
      context.techStack[tech] && semver.satisfies(context.techStack[tech], version)
    );
    score += techMatches.length * 15;

    if (score > 0) {
      matches.push({ skill, score, triggerType: 'auto' });
    }
  }

  // Sort by score DESC, then by priority
  matches.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    const priorityWeight = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityWeight[a.skill.priority] - priorityWeight[b.skill.priority];
  });

  return matches.slice(0, 3).map(m => m.skill); // Top 3
}
```

**Archivos a crear**:
- `.claude/skills/skills-registry.json` (auto-generated)
- `.claude/skills/registry-builder.ts` (script)
- `.claude/docs/skills-system/discovery.md` (documentation)

**Success Criteria**:
- ✅ Orchestrator puede escanear `.claude/skills/` y generar registry
- ✅ Matching algorithm retorna top 3 skills para cualquier context
- ✅ Registry se actualiza automáticamente cuando se crea/modifica skill

---

### Mejora 2: Standardized Activation Triggers (🔴 Critical - 3 días)

**Objetivo**: Todos los skills tienen YAML frontmatter consistente con triggers

**Implementación**:

```yaml
# Template estándar para TODOS los skills
---
name: skill-name-kebab-case
version: 1.0.0
priority: high  # critical | high | medium | low
activationTriggers:
  keywords:
    - "create skill"
    - "new agent"
    - "automate pattern"
  filePaths:
    - ".claude/skills/**/*.md"
    - ".claude/agents/**/*.md"
  techStack:
    claude-code: "*"
    # vue: "^3.0.0"  # Si es skill específico de Vue
capabilities:
  - skill-creation
  - validation
  - pattern-enforcement
dependencies: []  # [skill-builder, code-analyzer]
timeout: 5000  # milliseconds (SPEC target: <5000ms)
model: sonnet  # sonnet | opus | haiku (default: sonnet)
---
```

**Migration Plan** (10 skills):
1. **skill-builder**: Agregar triggers (keywords: create skill, new agent)
2. **task-decomposer**: Agregar triggers (keywords: decompose, complex task, multi-step)
3. **task-router**: Agregar triggers (keywords: route task, assign agent, delegate)
4. **code-analyzer**: Agregar triggers (keywords: analyze code, review, audit)
5. **orchestrator-observability**: Agregar triggers (keywords: metrics, monitoring, performance)
6. **security-auditor**: Agregar triggers (keywords: security, vulnerabilities, XSS, SQL injection)
7. **utils-builder**: Agregar triggers (keywords: utility function, helper, reusable)
8. **spec-architect-agent**: Agregar triggers (keywords: write spec, specification, requirements)
9. **persistent-memory**: MIGRAR a formato SKILL.md con triggers
10. **adaptive-meta-orchestrator**: Actualizar triggers (keywords: orchestrate, coordinate, workflow)

**Script de migración**:
```typescript
async function migrateSkillToNewFormat(skillPath: string): Promise<void> {
  const content = await Read({ file_path: skillPath });
  const yaml = parseYAMLFrontmatter(content);

  // Add missing fields
  if (!yaml.activationTriggers) {
    yaml.activationTriggers = {
      keywords: inferKeywords(content),
      filePaths: [],
      techStack: {}
    };
  }

  if (!yaml.priority) {
    yaml.priority = 'medium';
  }

  if (!yaml.timeout) {
    yaml.timeout = 5000;
  }

  // Rewrite file with updated YAML
  const newContent = stringifyWithYAML(yaml, content);
  await Write({ file_path: skillPath, content: newContent });
}
```

---

### Mejora 3: Metrics & Observability System (🟠 High - 1 semana)

**Objetivo**: Track activation rate, success rate, performance per skill

**Implementación**:

```typescript
// 1. PostgreSQL schema (Poneglyph ya tiene PostgreSQL)
CREATE TABLE IF NOT EXISTS skill_executions (
  id SERIAL PRIMARY KEY,
  skill_name TEXT NOT NULL,
  trigger_type TEXT, -- 'keyword', 'file_path', 'tech_stack', 'explicit'
  success BOOLEAN NOT NULL,
  execution_time_ms INT,
  token_usage INT,
  error_message TEXT,
  context JSONB, -- { userMessage, currentFile, techStack }
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_skill_name ON skill_executions(skill_name);
CREATE INDEX idx_timestamp ON skill_executions(timestamp);
CREATE INDEX idx_success ON skill_executions(success);

// 2. Logging wrapper
async function executeSkillWithLogging(
  skill: SkillMetadata,
  context: SkillContext
): Promise<SkillResult> {
  const startTime = Date.now();
  let success = false;
  let error = null;

  try {
    const result = await Skill({ skill: skill.name, ...context });
    success = true;
    return result;
  } catch (e) {
    error = e.message;
    throw e;
  } finally {
    const executionTime = Date.now() - startTime;

    await db.query(`
      INSERT INTO skill_executions
        (skill_name, trigger_type, success, execution_time_ms, token_usage, error_message, context)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      skill.name,
      context.triggerType || 'explicit',
      success,
      executionTime,
      context.tokenUsage || null,
      error,
      JSON.stringify({ userMessage: context.userMessage, currentFile: context.currentFile })
    ]);
  }
}

// 3. Metrics dashboard query
async function getSkillMetrics(skillName: string, period: 'week' | 'month'): Promise<SkillMetrics> {
  const interval = period === 'week' ? '7 days' : '30 days';

  const metrics = await db.query(`
    SELECT
      skill_name,
      COUNT(*) as total_executions,
      SUM(CASE WHEN success THEN 1 ELSE 0 END) as successes,
      AVG(execution_time_ms) as avg_time_ms,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY execution_time_ms) as p95_time_ms,
      AVG(token_usage) as avg_tokens,
      SUM(token_usage) as total_tokens
    FROM skill_executions
    WHERE skill_name = $1
    AND timestamp > NOW() - INTERVAL '${interval}'
    GROUP BY skill_name
  `, [skillName]);

  return {
    skillName,
    period,
    totalExecutions: metrics.total_executions,
    successRate: metrics.successes / metrics.total_executions,
    avgExecutionTime: metrics.avg_time_ms,
    p95ExecutionTime: metrics.p95_time_ms,
    avgTokenUsage: metrics.avg_tokens,
    totalTokenUsage: metrics.total_tokens
  };
}

// 4. Weekly report (auto-generated)
async function generateWeeklySkillsReport(): Promise<void> {
  const skills = await loadSkillsRegistry();

  const report = await Promise.all(
    skills.skills.map(async (skill) => {
      const metrics = await getSkillMetrics(skill.name, 'week');
      return { skill: skill.name, ...metrics };
    })
  );

  // Sort by activation count DESC
  report.sort((a, b) => b.totalExecutions - a.totalExecutions);

  console.log('Weekly Skills Report:');
  console.table(report);

  // Alert if any skill has <90% success rate
  const failing = report.filter(r => r.successRate < 0.90);
  if (failing.length > 0) {
    console.warn(`⚠️  ${failing.length} skills below 90% success rate:`, failing);
  }
}
```

**Comandos a crear**:
- `/skills-metrics` - Ver métricas de todos los skills
- `/skills-metrics skill-builder` - Ver métricas de un skill específico
- `/skills-report week` - Reporte semanal

---

### Mejora 4: Pattern Detection & Auto-Generation (🟠 High - 1 semana)

**Objetivo**: Detectar patterns repetidos y sugerir auto-generación de skills

**Implementación**:

```typescript
// 1. Pattern tracker (in-memory cache + PostgreSQL)
class PatternDetector {
  private patterns = new Map<string, PatternOccurrence[]>();

  async trackConversation(userMessage: string, assistantResponse: string): Promise<void> {
    // Extract patterns (simplified - real implementation uses NLP)
    const normalized = this.normalizePattern(userMessage + ' ' + assistantResponse);

    const hash = this.hashPattern(normalized);
    const occurrences = this.patterns.get(hash) || [];
    occurrences.push({
      pattern: normalized,
      timestamp: new Date(),
      userMessage,
      assistantResponse
    });

    this.patterns.set(hash, occurrences);

    // Check if pattern repeats 3+ times
    if (occurrences.length >= 3) {
      await this.suggestSkillGeneration(normalized, occurrences);
    }
  }

  private normalizePattern(text: string): string {
    // Remove specific names/values, keep structure
    return text
      .toLowerCase()
      .replace(/\b[A-Z][a-z]+\b/g, 'NAME') // Replace proper nouns
      .replace(/\b\d+\b/g, 'NUM') // Replace numbers
      .replace(/["']([^"']+)["']/g, 'STRING'); // Replace string literals
  }

  async suggestSkillGeneration(
    pattern: string,
    occurrences: PatternOccurrence[]
  ): Promise<void> {
    const examples = occurrences.map(o => ({
      userMessage: o.userMessage,
      assistantResponse: o.assistantResponse
    }));

    const confirmed = await AskUserQuestion({
      questions: [{
        question: `I've detected you've done this ${occurrences.length} times:\n"${pattern}"\n\nShould I create a skill to automate it?`,
        header: 'Auto-Generate Skill',
        multiSelect: false,
        options: [
          { label: 'Yes, create skill', description: 'Auto-generate skill from pattern' },
          { label: 'No, ignore', description: 'Not worth automating' },
          { label: 'Remind me later', description: 'Ask again after 5 more occurrences' }
        ]
      }]
    });

    if (confirmed === 'Yes, create skill') {
      await this.generateSkillFromPattern(pattern, examples);
    }
  }

  async generateSkillFromPattern(
    pattern: string,
    examples: Array<{ userMessage: string; assistantResponse: string }>
  ): Promise<void> {
    // Use skill-builder to generate
    const prompt = `
Generate a skill for this pattern (detected ${examples.length} times):

Pattern: "${pattern}"

Examples:
${examples.map((ex, i) => `
Example ${i + 1}:
User: ${ex.userMessage}
Assistant: ${ex.assistantResponse}
`).join('\n')}

Create a skill that automates this pattern.
`;

    await Skill({
      skill: 'skill-builder',
      prompt
    });
  }
}

// 2. Hook into adaptive-meta-orchestrator
// After each task execution:
await patternDetector.trackConversation(userMessage, assistantResponse);
```

**Success Criteria**:
- ✅ Detecta patterns después de 3 ocurrencias
- ✅ Normaliza patterns (ignora nombres/valores específicos)
- ✅ Sugiere auto-generación al usuario
- ✅ Usa skill-builder para generar el skill

---

### Mejora 5: Skill Validation & Quality Gates (🟡 Medium - 3 días)

**Objetivo**: Validar automáticamente skills generados (score ≥85/100)

**Implementación**:

```typescript
interface SkillValidationResult {
  score: number; // 0-100
  issues: ValidationIssue[];
  passed: boolean; // score >= 85
}

interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  line?: number;
}

async function validateSkill(skillPath: string): Promise<SkillValidationResult> {
  const content = await Read({ file_path: skillPath });
  const issues: ValidationIssue[] = [];
  let score = 100;

  // 1. YAML Validation (25 points)
  try {
    const yaml = parseYAMLFrontmatter(content);

    if (!yaml.name) {
      issues.push({ severity: 'error', category: 'yaml', message: 'Missing name field' });
      score -= 10;
    }

    if (!yaml.activationTriggers) {
      issues.push({ severity: 'error', category: 'yaml', message: 'Missing activationTriggers' });
      score -= 10;
    }

    if (!yaml.version) {
      issues.push({ severity: 'warning', category: 'yaml', message: 'Missing version field' });
      score -= 5;
    }
  } catch (error) {
    issues.push({ severity: 'error', category: 'yaml', message: 'Invalid YAML frontmatter' });
    score -= 25;
  }

  // 2. Content Validation (25 points)
  const sections = {
    mission: /## Mission/i,
    patterns: /## (Core )?Patterns/i,
    antiPatterns: /## Anti-Patterns/i,
    validation: /## Validation/i,
    references: /## References/i
  };

  for (const [section, pattern] of Object.entries(sections)) {
    if (!pattern.test(content)) {
      issues.push({ severity: 'warning', category: 'content', message: `Missing ${section} section` });
      score -= 5;
    }
  }

  // 3. Examples Validation (25 points)
  const wrongExamples = (content.match(/❌/g) || []).length;
  const correctExamples = (content.match(/✅/g) || []).length;

  if (wrongExamples === 0 || correctExamples === 0) {
    issues.push({ severity: 'warning', category: 'examples', message: 'Missing ❌/✅ examples' });
    score -= 15;
  } else if (wrongExamples < correctExamples) {
    issues.push({ severity: 'info', category: 'examples', message: 'Good balance of ❌/✅ examples' });
  }

  // 4. Size Validation (25 points)
  const tokenCount = estimateTokens(content);

  if (tokenCount < 500) {
    issues.push({ severity: 'warning', category: 'size', message: 'Skill too short (<500 tokens)' });
    score -= 10;
  } else if (tokenCount > 2000) {
    issues.push({ severity: 'warning', category: 'size', message: 'Skill too long (>2000 tokens), consider splitting' });
    score -= 10;
  }

  return {
    score: Math.max(score, 0),
    issues,
    passed: score >= 85
  };
}
```

**Comandos a crear**:
- `/validate-skill skill-builder` - Valida un skill específico
- `/validate-all-skills` - Valida todos los skills

---

## 📋 PARTE 6: PLAN DE IMPLEMENTACIÓN (Priorizado)

### Fase 1: Foundation (Semana 1) 🔴 CRÍTICO

**Objetivo**: Resolver gaps críticos que bloquean todo lo demás

| Task | Prioridad | Tiempo | Output |
|------|-----------|--------|--------|
| **1.1** Crear skills-registry.json | 🔴 Critical | 2 días | Registry JSON + builder script |
| **1.2** Implementar discovery algorithm | 🔴 Critical | 2 días | Matching function (keywords + filePaths + techStack) |
| **1.3** Migrar 10 skills a nuevo formato YAML | 🔴 Critical | 1 día | Todos los skills con activationTriggers |
| **1.4** Actualizar orchestrator con discovery | 🔴 Critical | 2 días | Auto-activation funcionando |

**Success Criteria**:
- ✅ Orchestrator puede descubrir skills automáticamente
- ✅ Activation rate aumenta de 60-80% → 85%+
- ✅ Top 3 skills se activan correctamente para cada context

---

### Fase 2: Observability (Semana 2) 🟠 HIGH

**Objetivo**: Tracking de métricas para feedback loop

| Task | Prioridad | Tiempo | Output |
|------|-----------|--------|--------|
| **2.1** Crear tabla skill_executions en PostgreSQL | 🟠 High | 1 día | Schema + migrations |
| **2.2** Implementar logging wrapper | 🟠 High | 1 día | executeSkillWithLogging() |
| **2.3** Crear queries de métricas | 🟠 High | 1 día | getSkillMetrics(), weekly report |
| **2.4** Crear comandos /skills-metrics | 🟠 High | 1 día | 3 comandos (/skills-metrics, /skills-report, etc.) |

**Success Criteria**:
- ✅ Métricas se guardan automáticamente
- ✅ Weekly report se genera los lunes
- ✅ Alerts si skill <90% success rate

---

### Fase 3: Auto-Generation (Semana 3) 🟠 HIGH

**Objetivo**: Auto-generar skills desde patterns

| Task | Prioridad | Tiempo | Output |
|------|-----------|--------|--------|
| **3.1** Implementar PatternDetector class | 🟠 High | 2 días | Pattern tracking + normalization |
| **3.2** Integrar con orchestrator | 🟠 High | 1 día | Hook después de cada task |
| **3.3** Crear skill generation flow | 🟠 High | 2 días | Pattern → skill-builder → validation |
| **3.4** Testing con 3 patterns reales | 🟠 High | 1 día | 3 skills auto-generated |

**Success Criteria**:
- ✅ Detecta patterns después de 3 ocurrencias
- ✅ Genera skills con score ≥85/100
- ✅ Usuario aprueba antes de deployment

---

### Fase 4: Quality & Polish (Semana 4) 🟡 MEDIUM

**Objetivo**: Validation, deprecation, A/B testing

| Task | Prioridad | Tiempo | Output |
|------|-----------|--------|--------|
| **4.1** Implementar validateSkill() | 🟡 Medium | 2 días | Validation function + comandos |
| **4.2** Implementar skill deprecation | 🟡 Medium | 1 día | Auto-detect <10% usage, move to deprecated/ |
| **4.3** A/B testing (opcional) | 🟡 Low | 2 días | Shadow mode + metrics comparison |
| **4.4** Documentation updates | 🟡 Medium | 1 día | README + best practices |

**Success Criteria**:
- ✅ Skill validation automática
- ✅ Deprecation de skills <10% usage
- ✅ A/B testing funcional (opcional)

---

## 🎯 PARTE 7: SUCCESS METRICS (KPIs)

### Métricas de Sistema (SPEC Targets)

| Metric | Baseline | Target (Mes 1) | Target (Mes 3) | How to Measure |
|--------|----------|----------------|----------------|----------------|
| **Skill Count** | 10 | 15 | 30 | COUNT(*) from skills-registry.json |
| **Activation Rate** | 60-80% | 85%+ | 95%+ | (activations / should_activate) × 100 |
| **Success Rate** | ~70% | 90%+ | 95%+ | (successes / activations) × 100 |
| **Avg Execution Time** | N/A | <5000ms | <3000ms | AVG(execution_time_ms) |
| **Auto-Generated Skills** | 0 | 3 | 10+ | COUNT(*) WHERE auto_generated = true |
| **False Positive Rate** | N/A | <10% | <5% | (wrong_activations / total_activations) × 100 |

### Métricas de Calidad

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Skill Validation Score** | ≥85/100 | validateSkill() score |
| **Documentation Completeness** | 100% | All skills have Mission + Patterns + Anti-Patterns |
| **YAML Compliance** | 100% | All skills have activationTriggers |
| **Deprecation Rate** | <10%/month | COUNT(*) deprecated / total skills |

### Métricas de Usuario

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **User Satisfaction** | 4.5+/5 | Optional thumbs up/down después de skill execution |
| **Friction Reduction** | -50% | Tiempo de usuario preguntando "qué skill usar?" |
| **Discovery Success** | 90%+ | Usuario encuentra skill correcto en top 3 matches |

---

## 🚀 PARTE 8: PRÓXIMOS PASOS INMEDIATOS

### Esta Semana (Semana 1)

**Lunes-Martes**:
1. ✅ Crear `skills-registry.json` template
2. ✅ Implementar `buildSkillsRegistry()` function
3. ✅ Testear con 10 skills existentes

**Miércoles-Jueves**:
4. ✅ Implementar `findMatchingSkills()` algorithm
5. ✅ Migrar skill-builder, task-decomposer, code-analyzer a nuevo formato YAML

**Viernes**:
6. ✅ Integrar discovery con adaptive-meta-orchestrator
7. ✅ Testear end-to-end: user message → skill auto-activation

**Weekend Review**:
8. ✅ Medir activation rate (target: 85%+)
9. ✅ Documentar resultados

---

## 📚 ANEXO: Referencias

### SPEC References
- `.claude/specs-driven/02-SKILLS-SYSTEM/SPEC.md` - 535 líneas de spec completo
- Scenarios: 1 (keyword), 2 (file path), 3 (conflict), 4 (auto-gen), 5 (error), 6 (metrics), 7 (deprecation)
- Decisions: 17 key decisions (Q1-Q17)

### Best Practices References
- **CrewAI** (2024): Role-based design, 80/20 rule, hierarchical process
- **LangGraph** (2025): Type safety, conditional routing, error isolation
- **AutoGen** (2024-2025): Conversational patterns, peer review, failure handling, trustworthiness

### Current Skills (10)
1. adaptive-meta-orchestrator (~500KB)
2. skill-builder (~15KB)
3. task-decomposer (~12KB)
4. task-router (~8KB)
5. code-analyzer (~3KB)
6. orchestrator-observability (~10KB)
7. security-auditor (~12KB)
8. utils-builder (~7KB)
9. spec-architect-agent (~9KB)
10. persistent-memory (~17KB)

---

**Version**: 1.0.0
**Date**: 2025-11-17
**Status**: Ready for Implementation
**Priority**: 🔴 CRITICAL - Sistema de skills es segundo pilar más importante

---

**¿Empezamos con Fase 1 (Foundation)?**
