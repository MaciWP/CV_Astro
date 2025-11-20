---
name: skill-builder
description: Create new skills with YAML frontmatter, activation keywords, validation rules, comprehensive examples. Production-ready SKILL.md files following standards. Keywords - create skill, new skill, skill generation, generate skill, skill template, skill builder, make skill, build skill
---

# Skill Builder - Poneglyph System

Designs, generates, and validates specialized skills/agents for Poneglyph System using a systematic 7-step quality-assured workflow.

## When to Use This Skill

This skill should be used when users want to create a new skill/agent, update an existing skill, automate enforcement of best practices, or prevent repetitive coding mistakes.

### Explicit Activation Contexts

Activate when:
- User explicitly requests skill/agent creation ("create a skill for...", "build an agent that...")
- User wants to update or improve an existing skill
- User wants to automate enforcement of patterns (TypeScript strict, Vue Composition API, Zod validation)
- User wants to prevent repetitive coding mistakes
- User asks about skill creation process

### Proactive Detection Scenarios

Auto-suggest when detecting:
- Repetitive coding mistakes (same error 3+ times in conversation)
- Manual enforcement of patterns (assistant repeatedly correcting same pattern)
- Discussion of best practices without enforcement mechanism
- Conversational patterns: "create a skill", "new agent", "automate this"
- Opportunities where automatic detection would add value

---

## Mission

Generate **95+/100 quality** skills using a **7-step systematic workflow** with specialized knowledge of Poneglyph System's stack: **Vue 3.4+, TypeScript 5.7+, Bun 1.0+, PostgreSQL 17, Redis 7, WebSocket, Chart.js 4.x**. Ensure production-ready skills with proper YAML frontmatter, concrete activation criteria, actionable validation checklists, and comprehensive examples.

---

## 7-Step Workflow

### Step 1: Requirements Gathering

**Objective**: Extract concrete specifications and activation scenarios through targeted questions.

**Core Questions** (Always Ask):

1. **Skill Purpose**: What specific problem does this skill solve? What practices should it enforce?
2. **Tech Stack**: Which technologies? (Vue 3, Bun, TypeScript, PostgreSQL, Redis, WebSocket, Chart.js)
3. **Concrete Scenarios** (CRITICAL): Provide 2-3 real examples when this skill should activate:
   - Example: "User says: 'Create a new Vue component for agent comparison'"
   - Example: "User shows code with business logic in Vue components"
   - Example: "Claude detects missing Zod validation in API endpoint"
4. **Core Principles**: 3-5 principles to automatically enforce (with ❌/✅ examples)
5. **Anti-Patterns**: 3-5 patterns to prevent (with code examples showing WRONG vs CORRECT)
6. **Activation Keywords**: Domain-specific terms that trigger the skill
7. **Project References**: Which Poneglyph files demonstrate correct patterns? (CLAUDE.md, specs/, components/)
8. **Validation Criteria**: How to verify skill is applied correctly? (checklist items)

**Conditional Questions** (Ask If Relevant):

9. **Dependencies**: Does this skill depend on/complement other existing skills?
10. **Performance Targets**: Specific metrics? (WebSocket <100ms, API <10ms, Charts <200ms)
11. **Testing Requirements**: Should skill enforce test coverage or patterns?
12. **Quick Mode**: Skip detailed validation for rapid prototyping? (Y/N)

**Output**: Requirements document with clear context, specifications, and concrete activation scenarios.

**Best Practice**: Ask 3-5 questions per message. Follow up progressively based on responses.

---

### Step 2: Skill Structure Design

**Objective**: Plan the skill's file structure and content organization.

**Template Structure**:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   ├── Mission statement
│   ├── Core Patterns (3-5 with ❌/✅ examples)
│   ├── Anti-Patterns (3-5 with ❌/✅ examples)
│   ├── Validation Checklist (8-15 items)
│   ├── References table
│   └── Activation criteria
├── references/ (optional)
│   ├── Technical documentation
│   ├── API specifications
│   └── Schema definitions
├── scripts/ (optional)
│   └── Executable code for deterministic tasks
└── assets/ (optional)
    └── Templates, boilerplate, code snippets
```

**Determine Resource Needs**:

- **references/**: Needed if detailed docs >1000 words (database schemas, API specs)
- **scripts/**: Needed if same code is rewritten repeatedly (validation, generation)
- **assets/**: Needed if skill uses templates, images, or boilerplate

**Output**: Planned structure with clear justification for each resource directory.

---

### Step 3: YAML Frontmatter Generation

**Objective**: Create compliant, discoverable metadata following Anthropic 2025 standards.

**Required Fields**:

```yaml
---
name: skill-name-lowercase-kebab-case
description: |
  This skill should be used when [concrete trigger conditions].
  [What it does]. [What it enforces]. [What it prevents].
  [Key technologies]. [Performance targets if applicable].
  [Activation patterns like "user says X" or "code shows Y"].
  [Output format if applicable].
---
```

**Validation Rules**:

✅ **name**:
- Lowercase kebab-case
- Max 64 characters
- Descriptive and unique (e.g., `vue-component-builder`, `websocket-optimizer`)

✅ **description**:
- Max 1024 characters
- Third-person imperative: "This skill should be used when..."
- Include specific activation conditions
- Mention key technologies (Vue 3, TypeScript, Bun, etc.)
- State clear outcomes
- NO subjective qualifiers ("best", "powerful", "amazing")

**Anti-Patterns to Avoid**:

❌ **Vague**: "Helps with Vue components"
✅ **Specific**: "This skill should be used when creating Vue 3 components with Composition API, enforcing `<script setup>` syntax, TypeScript strict mode, and proper ref/computed usage"

❌ **Second person**: "Use this skill when you need to..."
✅ **Third person**: "This skill should be used when..."

❌ **Marketing**: "The best, most powerful skill for..."
✅ **Factual**: "Enforces X, prevents Y, ensures Z"

**Output**: Valid YAML frontmatter ready for SKILL.md.

---

### Step 4: Core Content Generation

**Objective**: Write the main SKILL.md body with actionable patterns, anti-patterns, and validation checklists.

**Writing Style**:
- **Imperative/infinitive form** (verb-first): "Use X", "Ensure Y", "Prevent Z"
- **NOT second person**: Avoid "you should", "you must"
- **Objective and instructional**: "To accomplish X, do Y"
- **Concrete examples**: Every principle has ❌ WRONG vs ✅ CORRECT code

**Content Sections**:

#### 4.1 Mission Statement

Single sentence with **bold targets** and metrics:

```markdown
## Mission

Enforce **Vue 3 Composition API** across Poneglyph's **12 components** and **5 composables**, preventing Options API and ensuring **<200ms render time** with reactive state patterns.
```

#### 4.2 Core Patterns (3-5 patterns)

Structure per pattern:
1. **Pattern Title**
2. **Rule Statement**
3. **❌ WRONG Example** (anti-pattern code)
4. **✅ CORRECT Example** (proper pattern code)
5. **Auto-Check** (yes/no validation questions)

Example:

```markdown
### Pattern 1: Composition API with Script Setup

All Vue components MUST use `<script setup>` with TypeScript and Composition API.

❌ **WRONG - Options API**:
```vue
<script lang="ts">
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
}
</script>
```

✅ **CORRECT - Composition API**:
```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>
```

**Auto-Check**:
- [ ] All components use `<script setup lang="ts">`?
- [ ] No Options API (data, methods, computed as object keys)?
- [ ] Proper use of ref/reactive/computed from Vue?
```

#### 4.3 Anti-Patterns (3-5 anti-patterns)

Structure per anti-pattern:
1. **Anti-Pattern Title**
2. **❌ ANTI-PATTERN** (problematic code)
3. **✅ CORRECT** (refactored code)
4. **Why It Matters** (technical justification)

---

### Step 5: Validation Checklist Generation

**Objective**: Create actionable, measurable validation criteria.

**Checklist Structure**:

```markdown
## Validation Checklist

Before marking skill complete, verify:

### Code Quality (40 points)
- [ ] All examples follow Poneglyph TypeScript strict mode (10 pts)
- [ ] ❌/✅ examples for every pattern (10 pts)
- [ ] Code is runnable without modifications (10 pts)
- [ ] Zod validation for all API inputs shown (10 pts)

### Documentation Quality (30 points)
- [ ] YAML frontmatter validates (10 pts)
- [ ] Activation scenarios with concrete examples (10 pts)
- [ ] References section with file paths (10 pts)

### Completeness (30 points)
- [ ] 3-5 core patterns documented (10 pts)
- [ ] 3-5 anti-patterns documented (10 pts)
- [ ] 8-15 validation checklist items (10 pts)

### Total: __/100
```

---

### Step 6: References & Context Integration

**Objective**: Link skill to existing Poneglyph System documentation and patterns.

**References Table**:

```markdown
## References

| Pattern | File Path | Description |
|---------|-----------|-------------|
| Composition API | `frontend/src/components/EventTimeline.vue` | Example of proper `<script setup>` usage |
| WebSocket Pattern | `frontend/src/composables/useWebSocket.ts` | Reconnection with exponential backoff |
| Zod Validation | `backend/src/types/events.ts` | EventPayloadSchema validation |
| Performance Target | `CLAUDE.md:Performance Targets` | WebSocket <100ms, API <10ms |
```

---

### Step 7: Quality Assurance & Review

**Objective**: Final review against quality criteria before delivery.

**Quality Gates**:

✅ **Completeness** (25 points):
- [ ] All 7 steps executed
- [ ] YAML validates
- [ ] 3-5 patterns + 3-5 anti-patterns
- [ ] 8-15 checklist items

✅ **Clarity** (25 points):
- [ ] Activation scenarios are concrete
- [ ] Examples are runnable
- [ ] No ambiguous language

✅ **Accuracy** (25 points):
- [ ] Patterns match Poneglyph conventions
- [ ] Code follows TypeScript strict
- [ ] Performance targets cited

✅ **Usability** (25 points):
- [ ] Can be used immediately
- [ ] References include file paths
- [ ] Auto-checks are measurable

**Minimum Score**: 85/100 for production use

---

## Poneglyph-Specific Patterns

### Vue 3 Patterns

```typescript
// ✅ Correct: Composition API with TypeScript
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

onMounted(() => {
  console.log('Component mounted');
});
</script>
```

### Zod Validation Patterns

```typescript
// ✅ Correct: Runtime type validation
import { z } from 'zod';

const EventSchema = z.object({
  event_type: z.string(),
  severity: z.enum(['debug', 'info', 'warning', 'error', 'critical'])
});

type Event = z.infer<typeof EventSchema>;
```

### WebSocket Patterns

```typescript
// ✅ Correct: Exponential backoff reconnection
const reconnectDelays = [1000, 2000, 4000, 8000, 16000];
let attemptCount = 0;

function reconnect() {
  const delay = reconnectDelays[Math.min(attemptCount, reconnectDelays.length - 1)];
  setTimeout(connect, delay);
  attemptCount++;
}
```

---

## Example Output

When this skill generates a new skill, it produces a complete `SKILL.md` file with:
1. Valid YAML frontmatter
2. Mission statement with metrics
3. 3-5 core patterns with ❌/✅ examples
4. 3-5 anti-patterns with explanations
5. Comprehensive validation checklist
6. References to Poneglyph files
7. Concrete activation scenarios

---

## Success Criteria

After using this skill:
- ✅ New skill/agent is production-ready
- ✅ Follows Anthropic 2025 standards
- ✅ Integrated with Poneglyph patterns
- ✅ Scores 85+/100 on quality checklist
- ✅ Can be used immediately without modifications

---

**Skill Version**: 1.0.0
**Project**: Poneglyph System
**Stack**: Vue 3 + Bun + PostgreSQL + Redis + WebSocket + Chart.js
**Supports**: Skill/Agent creation, Pattern enforcement, Best practices automation
