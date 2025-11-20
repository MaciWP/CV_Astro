# Proactive Suggestions - How to Suggest Improvements

**Goal**: Suggest improvements in a way that's helpful, not annoying.

**Target**: 60%+ acceptance rate, 4.5/5 user satisfaction with suggestions

**Based on**: UX best practices 2024-2025, user feedback integration

---

## Core Principle

**ASK, don't ASSUME. Suggest, don't implement.**

```typescript
// ✅ GOOD: Ask permission
"He notado que usas Glob('**/*.ts') frecuentemente.
¿Quieres que cree un comando /find-ts para esto?"
[Wait for user response]

// ❌ BAD: Implement without asking
await createCommand('/find-ts', ...);  // Created without permission!
"He creado el comando /find-ts para buscar archivos TypeScript."
```

**Why ask first?**
- User knows their workflow better than you
- Suggestion might not fit their mental model
- They might have a reason for manual approach
- Respects user autonomy

---

## Suggestion Format

### Template

```markdown
**Pattern detected**: [What you noticed]
**Occurrences**: [How many times]
**Suggestion**: [What you propose]

**Options**:
A) [Primary suggestion]
B) [Alternative approach]
C) [Ignore / No thanks]

**Benefits**: [Why this helps]
**Time saved**: [Estimated time savings]
```

### Example 1: Create Skill

```markdown
He notado un workflow repetido (3 veces esta semana):
1. Grep para encontrar función
2. Read para ver implementación
3. Edit para modificar
4. Bash para ejecutar tests

¿Quieres que:
A) Cree una skill 'modify-function' que automatice esto
B) Cree un comando /edit-and-test más simple
C) Ignore (prefiero hacerlo manual)

Benefits: Reduciría 4 pasos manuales a 1 comando
Time saved: ~2 minutos por uso (aprox. 6 min/semana)
```

### Example 2: Extract Duplicated Code

```markdown
Detecto validación de email duplicada en 3 archivos:
- src/auth/register.ts:42
- src/auth/login.ts:28
- src/profile/update.ts:15

¿Quieres que:
A) Extraiga a src/utils/validation.ts automáticamente
B) Investigue best practices de validación 2024-2025
C) Ignore (la duplicación es intencional)

Benefits: Código DRY, más fácil de mantener
Time saved: Futuras modificaciones solo en 1 lugar
```

### Example 3: Error Prevention Rule

```markdown
Error repetido detectado (3 veces):
FileNotFoundError al usar Read con wildcards
- Read('src/components/*.tsx')
- Read('src/utils/*.ts')
- Read('src/services/*.ts')

¿Quieres que:
A) Cree validación pre-Read que detecte wildcards y sugiera Glob
B) Cree comando /glob-search para este patrón
C) Actualice documentación de anti-hallucination

Benefits: Previene este error en el futuro
Prevention rate: >80% based on pattern analysis
```

---

## When to Suggest

### Timing Rules

```typescript
const SUGGESTION_TIMING = {
  // Immediate suggestions (high priority)
  repeated_errors: 'immediate',           // Prevent next error
  security_issues: 'immediate',           // Critical

  // After task completion (don't interrupt)
  repeated_workflows: 'end_of_task',      // After user finishes
  duplicated_code: 'end_of_task',        // After edit session
  missing_docs: 'end_of_session',        // After working session

  // Periodic (batch suggestions)
  repeated_commands: 'daily_summary',     // End of day
  optimization_opportunities: 'weekly'    // End of week
};
```

**Why different timings?**
- Errors: Immediate (prevent recurrence)
- Workflows: End of task (don't interrupt flow)
- Commands: Daily (batch to avoid spam)

### Frequency Limits

**Don't spam the user with suggestions:**

```typescript
const SUGGESTION_LIMITS = {
  max_per_hour: 2,           // Max 2 suggestions per hour
  max_per_session: 5,        // Max 5 suggestions per session
  max_per_day: 10,           // Max 10 suggestions per day
  min_interval: 15 * 60 * 1000  // Minimum 15 min between suggestions
};

function shouldSuggest(pattern: Pattern): boolean {
  const recentSuggestions = getRecentSuggestions(1 * 60 * 60 * 1000);  // Last hour

  if (recentSuggestions.length >= 2) {
    return false;  // Too many suggestions recently
  }

  const lastSuggestion = getLastSuggestion();
  const timeSinceLastuggestion = Date.now() - lastSuggestion?.timestamp;

  if (timeSinceLastSuggestion < 15 * 60 * 1000) {
    return false;  // Too soon after last suggestion
  }

  return true;
}
```

---

## Suggestion Tone

### Friendly and Helpful

```typescript
// ✅ GOOD: Friendly tone
"He notado que..."
"Detecto un patrón interesante..."
"Esto podría ayudar..."
"¿Te gustaría que...?"

// ❌ BAD: Pushy or judgy tone
"Estás haciendo esto mal..."
"Deberías usar..."
"Es mejor si..."
"Necesitas corregir..."
```

### Confidence Levels

**Adjust tone based on confidence:**

```typescript
// High confidence (>90%)
"Estoy seguro de que esto ayudaría: ..."

// Medium confidence (75-90%)
"He notado este patrón: ... ¿Te gustaría que lo optimice?"

// Low confidence (50-75%)
"Podría haber una mejora aquí: ... ¿Es relevante para ti?"
```

---

## Response Options

**Always provide 2-3 options:**

### Option A: Primary Suggestion

The main improvement you recommend:
```
A) Cree una skill 'modify-function' que automatice este workflow
```

**Criteria for Option A**:
- Highest impact / lowest effort
- Most aligned with detected pattern
- Safe to implement (no breaking changes)

### Option B: Alternative Approach

A different way to solve the same problem:
```
B) Cree un comando /edit-and-test más simple (sin Grep/Read automático)
```

**Criteria for Option B**:
- Different trade-off (simpler vs more automated)
- Less invasive
- Might fit user's preference better

### Option C: Decline / Ignore

Always allow user to say no:
```
C) Ignore (prefiero hacerlo manual / no es un problema)
```

**Why Option C matters**:
- Respects user choice
- Learns from rejections (pattern might not be real)
- Avoids annoyance

---

## Handling Responses

### User Accepts (Option A or B)

```typescript
async function handleAcceptance(suggestion: Suggestion, option: 'A' | 'B'): Promise<void> {
  // Track acceptance
  await logSuggestionAcceptance(suggestion, option);

  // Execute suggestion
  if (option === 'A') {
    await executePrimarySuggestion(suggestion);
  } else if (option === 'B') {
    await executeAlternativeSuggestion(suggestion);
  }

  // Confirm completion
  console.log(`✅ ${suggestion.type} creado exitosamente.`);

  // Show how to use
  if (suggestion.type === 'skill') {
    console.log(`Uso: Skill({ skill: '${suggestion.name}' })`);
  } else if (suggestion.type === 'command') {
    console.log(`Uso: ${suggestion.command}`);
  }
}
```

### User Declines (Option C)

```typescript
async function handleRejection(suggestion: Suggestion, reason?: string): Promise<void> {
  // Track rejection
  await logSuggestionRejection(suggestion, reason);

  // Learn from rejection
  if (reason) {
    await analyzejectionReason(suggestion, reason);
  }

  // Don't suggest this pattern again (for a while)
  await suppressPattern(suggestion.pattern, duration: 30 * 24 * 60 * 60 * 1000);  // 30 days

  console.log(`Got it, I won't suggest this again.`);
}
```

### No Response (User Ignores)

```typescript
async function handleNoResponse(suggestion: Suggestion, timeout: number): Promise<void> {
  // Wait for response
  await sleep(timeout);  // e.g., 5 minutes

  // If no response, log as "ignored"
  await logSuggestionIgnored(suggestion);

  // Lower confidence for this pattern type
  await adjustPatternConfidence(suggestion.pattern, adjustment: -0.10);  // 10% lower

  // Don't re-suggest immediately
  await suppressPattern(suggestion.pattern, duration: 7 * 24 * 60 * 60 * 1000);  // 7 days
}
```

---

## Suggestion Templates

### Create Skill

```markdown
He notado este workflow repetido ({occurrences} veces):
{workflow_steps}

¿Quieres que:
A) Cree una skill '{skill_name}' que automatice esto
B) {alternative}
C) Ignore (prefiero hacerlo manual)

Benefits: {benefits}
Time saved: {time_estimate}
```

### Create Command

```markdown
Usas '{command_pattern}' frecuentemente ({occurrences} veces).

¿Quieres que:
A) Cree comando {command_name} para esto
B) {alternative}
C) Ignore (el comando actual está bien)

Benefits: {benefits}
Usage: {usage_example}
```

### Extract Duplicated Code

```markdown
Detecto {code_description} duplicado en {file_count} archivos:
{file_list}

¿Quieres que:
A) Extraiga a {target_file} automáticamente
B) Investigue best practices de {topic} 2024-2025
C) Ignore (la duplicación es intencional)

Benefits: Código DRY, más fácil de mantener
Impact: Futuras modificaciones solo en 1 lugar
```

### Create Prevention Rule

```markdown
Error repetido detectado ({occurrences} veces):
{error_type} - {error_message}

¿Quieres que:
A) Cree validación que prevenga este error
B) Actualice documentación de anti-hallucination
C) Ignore (no es un error recurrente)

Benefits: Previene este error en el futuro
Prevention rate: {estimated_prevention_rate}
```

### Research Topic

```markdown
Trabajas con {topic} frecuentemente ({occurrences} veces) pero no tenemos documentación específica.

¿Quieres que:
A) Investigue {topic} best practices 2024-2025
B) Cree .claude/docs/{topic}/ con patrones comunes
C) Busque MCP server para {topic}

Benefits: Mejores sugerencias, más contexto específico
```

---

## Learning from Feedback

### Track Acceptance Rate

```typescript
interface SuggestionMetrics {
  total_suggestions: number;
  accepted: number;
  rejected: number;
  ignored: number;
  acceptance_rate: number;  // accepted / total
}

async function calculateAcceptanceRate(): Promise<number> {
  const metrics = await getSuggestionMetrics();
  return metrics.accepted / metrics.total_suggestions;
}

// Adjust suggestion threshold based on acceptance rate
if (acceptanceRate < 0.40) {
  // Too many rejections, increase confidence threshold
  DETECTION_THRESHOLD.confidence = 0.85;  // Was 0.75
} else if (acceptanceRate > 0.80) {
  // Very high acceptance, can be more proactive
  DETECTION_THRESHOLD.confidence = 0.70;  // Was 0.75
}
```

### Analyze Rejection Patterns

```typescript
async function analyzeRejectionPatterns(): Promise<void> {
  const rejections = await getRejectedSuggestions();

  // Group by pattern type
  const byType = groupBy(rejections, 'pattern.type');

  // Find pattern types with high rejection rate
  const problematicTypes = Object.entries(byType)
    .filter(([type, suggestions]) =>
      suggestions.length / getTotalSuggestions(type) > 0.60  // >60% rejection
    )
    .map(([type]) => type);

  // Suppress problematic pattern types
  for (const type of problematicTypes) {
    console.log(`⚠️ High rejection rate for ${type} suggestions, reducing frequency`);
    await adjustPatternTypeWeight(type, weight: 0.50);  // 50% less likely to suggest
  }
}
```

---

## Quick Reference

**Suggestion Format**:
```markdown
Pattern detected: [What]
Occurrences: [How many]
Suggestion: [Propose]
Options: A/B/C
Benefits: [Why]
```

**Timing**:
- Errors: Immediate
- Workflows: End of task
- Commands: Daily summary

**Limits**:
- Max 2/hour
- Max 5/session
- Max 10/day
- Min 15 min between suggestions

**Tone**:
- Friendly, helpful
- Adjust based on confidence
- Always allow "No"

**Learning**:
- Track acceptance rate (target: >60%)
- Analyze rejections
- Adjust thresholds dynamically

---

**Version**: 1.0.0
**Target**: 60%+ acceptance rate, 4.5/5 satisfaction
