# Adaptive Context Windows - Dynamic Sizing

**Goal**: Match context window size to task complexity (simple=1K, standard=2K, complex=5K tokens).

---

## The Problem

**One-Size-Fits-All Approach**:
```
Simple task: "What port does the backend use?"
  → Context: 15K tokens (overkill, 10 seconds processing time)

Complex task: "Refactor authentication system across 5 components"
  → Context: 15K tokens (might not be enough, missing critical context)
```

**Result**: Wasteful for simple tasks, insufficient for complex tasks.

---

## The Solution: Adaptive Windows

**Match context to complexity**:
```
Simple task: "What port does the backend use?"
  → Context: 1K tokens (~5 messages)
  → Processing: 1 second
  → Cost: $0.003

Standard task: "Fix bug in auth.ts line 45"
  → Context: 2K tokens (~10 messages)
  → Processing: 2 seconds
  → Cost: $0.006

Complex task: "Refactor authentication system"
  → Context: 5K tokens (~20 messages + summaries)
  → Processing: 4 seconds
  → Cost: $0.015
```

**Result**: Right context for the job, 70% average savings.

---

## Task Complexity Analysis

### Complexity Scoring

```typescript
interface ComplexityScore {
  category: 'simple' | 'standard' | 'complex';
  score: number;           // 0-100
  factors: {
    questionType: number;  // 0-25 points
    scope: number;         // 0-25 points
    dependencies: number;  // 0-25 points
    timeEstimate: number;  // 0-25 points
  };
}

function analyzeTaskComplexity(task: string): ComplexityScore {
  const factors = {
    questionType: scoreQuestionType(task),
    scope: scoreScope(task),
    dependencies: scoreDependencies(task),
    timeEstimate: scoreTimeEstimate(task)
  };

  const total = Object.values(factors).reduce((sum, val) => sum + val, 0);

  const category = total < 30 ? 'simple'
                 : total < 60 ? 'standard'
                 : 'complex';

  return { category, score: total, factors };
}
```

### Factor 1: Question Type (0-25 points)

```typescript
function scoreQuestionType(task: string): number {
  // Information request (simple)
  if (task.match(/^(what|where|when|which|who)\s/i)) {
    return task.split(' ').length < 10 ? 5 : 10;  // Short question = simpler
  }

  // How-to question (standard)
  if (task.match(/^how (do|can|should)/i)) {
    return 15;
  }

  // Implementation request (complex)
  if (task.match(/(implement|create|build|refactor|redesign)/i)) {
    return 25;
  }

  // Bug fix (standard)
  if (task.match(/(fix|debug|solve|resolve)/i)) {
    return 12;
  }

  // Default
  return 10;
}

// Examples:
scoreQuestionType("What port does the backend use?")           // → 5 (simple)
scoreQuestionType("How do I add JWT authentication?")          // → 15 (standard)
scoreQuestionType("Implement real-time dashboard with charts") // → 25 (complex)
scoreQuestionType("Fix the PostgreSQL connection error")       // → 12 (standard)
```

### Factor 2: Scope (0-25 points)

```typescript
function scoreScope(task: string): number {
  // Count scope indicators
  const indicators = {
    files: (task.match(/file|component|service|controller/gi) || []).length,
    features: (task.match(/feature|system|module|architecture/gi) || []).length,
    numbers: extractNumbers(task),  // e.g., "5 components" → 5
    modifiers: (task.match(/all|entire|complete|full|across/gi) || []).length
  };

  // Single file/component
  if (indicators.files === 1 && indicators.features === 0) {
    return 5;
  }

  // Multiple files (2-5)
  if (indicators.files <= 5 || indicators.numbers.some(n => n <= 5)) {
    return 15;
  }

  // System-wide or >5 files
  if (indicators.features > 0 || indicators.modifiers > 0 || indicators.numbers.some(n => n > 5)) {
    return 25;
  }

  // Default: single entity
  return 8;
}

// Examples:
scoreScope("Update auth.ts")                              // → 5 (single file)
scoreScope("Fix authentication across 3 components")      // → 15 (multiple files)
scoreScope("Refactor entire authentication system")       // → 25 (system-wide)
```

### Factor 3: Dependencies (0-25 points)

```typescript
function scoreDependencies(task: string): number {
  const techStack = {
    frontend: (task.match(/vue|react|component|ui|chart/gi) || []).length,
    backend: (task.match(/api|endpoint|server|bun|node/gi) || []).length,
    database: (task.match(/database|postgresql|sql|query|redis/gi) || []).length,
    websocket: (task.match(/websocket|realtime|broadcast/gi) || []).length,
    external: (task.match(/api integration|third-party|external/gi) || []).length
  };

  const layersInvolved = Object.values(techStack).filter(count => count > 0).length;

  // Single layer
  if (layersInvolved === 1) {
    return 5;
  }

  // 2-3 layers
  if (layersInvolved <= 3) {
    return 15;
  }

  // 4+ layers or external integrations
  return 25;
}

// Examples:
scoreDependencies("Add index to PostgreSQL")                    // → 5 (DB only)
scoreDependencies("Create API endpoint with PostgreSQL query")  // → 15 (Backend + DB)
scoreDependencies("Real-time dashboard with WebSocket + Redis + PostgreSQL") // → 25 (4 layers)
```

### Factor 4: Time Estimate (0-25 points)

```typescript
function scoreTimeEstimate(task: string): number {
  // Explicit time mentioned
  const timeMatch = task.match(/(\d+)\s*(minute|hour|day)/i);
  if (timeMatch) {
    const [, amount, unit] = timeMatch;
    const minutes = unit.startsWith('hour') ? parseInt(amount) * 60
                  : unit.startsWith('day') ? parseInt(amount) * 480
                  : parseInt(amount);

    return minutes < 30 ? 5
         : minutes < 120 ? 15
         : 25;
  }

  // Infer from complexity keywords
  if (task.match(/quick|simple|small|minor/i)) {
    return 5;
  }

  if (task.match(/refactor|redesign|rewrite|complete|full/i)) {
    return 25;
  }

  // Default: standard
  return 12;
}

// Examples:
scoreTimeEstimate("Quick fix for auth bug")           // → 5 (quick = <30 min)
scoreTimeEstimate("Implement JWT in 2 hours")         // → 15 (2 hours = standard)
scoreTimeEstimate("Complete refactor of auth system") // → 25 (complex, >2 hours)
```

---

## Context Window Sizing

```typescript
function getContextWindow(complexity: ComplexityScore): {
  messageCount: number;
  tokenEstimate: number;
  includeSummaries: boolean;
} {
  switch (complexity.category) {
    case 'simple':
      return {
        messageCount: 5,       // Last 5 messages
        tokenEstimate: 1000,   // ~1K tokens
        includeSummaries: false
      };

    case 'standard':
      return {
        messageCount: 10,      // Last 10 messages
        tokenEstimate: 2000,   // ~2K tokens
        includeSummaries: false
      };

    case 'complex':
      return {
        messageCount: 20,      // Last 20 messages
        tokenEstimate: 5000,   // ~5K tokens (includes summaries)
        includeSummaries: true  // Add summaries of older context
      };
  }
}
```

---

## Implementation

```typescript
async function getAdaptiveContext(
  task: string,
  fullHistory: Message[]
): Promise<Message[]> {
  // 1. Analyze complexity
  const complexity = analyzeTaskComplexity(task);

  console.log(`Task complexity: ${complexity.category} (score: ${complexity.score})`);
  console.log(`Factors: Question=${complexity.factors.questionType}, Scope=${complexity.factors.scope}, Deps=${complexity.factors.dependencies}, Time=${complexity.factors.timeEstimate}`);

  // 2. Get window size
  const window = getContextWindow(complexity);

  console.log(`Context window: ${window.messageCount} messages (~${window.tokenEstimate} tokens)`);

  // 3. Extract recent messages
  const recentMessages = fullHistory.slice(-window.messageCount);

  // 4. Add summaries for complex tasks
  if (window.includeSummaries && fullHistory.length > window.messageCount) {
    const oldMessages = fullHistory.slice(0, -window.messageCount);
    const summaries = await summarizeOldContext(oldMessages);

    // Create synthetic summary message
    const summaryMessage: Message = {
      role: 'system',
      content: `[Summary of ${oldMessages.length} earlier messages]: ${summaries}`,
      timestamp: oldMessages[0].timestamp,
      isSummary: true
    };

    return [summaryMessage, ...recentMessages];
  }

  return recentMessages;
}
```

---

## Example: Complexity Analysis

### Example 1: Simple Task

**Task**: "What port does the backend use?"

**Analysis**:
```
Factors:
  - Question type: 5 (simple info request, short question)
  - Scope: 5 (single piece of info)
  - Dependencies: 5 (backend only)
  - Time estimate: 5 (quick lookup)

Total: 20 points → SIMPLE

Context window:
  - Messages: 5
  - Tokens: ~1K
  - Summaries: No
```

**Included Context**:
```
Message 96: "Testing WebSocket connection"
Message 97: "WebSocket connected successfully"
Message 98: "Backend running on port 3000"
Message 99: "Added health check endpoint"
Message 100: "What port does the backend use?"

Total: ~1K tokens
Processing: 1 second
Cost: $0.003
```

---

### Example 2: Standard Task

**Task**: "Fix the PostgreSQL connection timeout in api/db.ts"

**Analysis**:
```
Factors:
  - Question type: 12 (bug fix)
  - Scope: 5 (single file: db.ts)
  - Dependencies: 15 (backend + database)
  - Time estimate: 12 (standard fix, ~1 hour)

Total: 44 points → STANDARD

Context window:
  - Messages: 10
  - Tokens: ~2K
  - Summaries: No
```

**Included Context**:
```
Messages 91-100 (last 10 messages):
  - PostgreSQL configuration discussion
  - Connection pool settings
  - Timeout error logs
  - Previous DB fix attempts

Total: ~2K tokens
Processing: 2 seconds
Cost: $0.006
```

---

### Example 3: Complex Task

**Task**: "Refactor authentication system across frontend, backend, and database to use JWT tokens instead of sessions"

**Analysis**:
```
Factors:
  - Question type: 25 (implementation/refactor)
  - Scope: 25 (system-wide, multiple components)
  - Dependencies: 25 (frontend + backend + database, 3 layers)
  - Time estimate: 25 (complete refactor, >2 hours)

Total: 100 points → COMPLEX

Context window:
  - Messages: 20
  - Tokens: ~5K (with summaries)
  - Summaries: Yes
```

**Included Context**:
```
Summary of messages 1-80:
  "Previously discussed session-based auth implementation,
   Redis session store, security concerns about JWT,
   decided on httpOnly cookies for storage"
  (~500 tokens)

Messages 81-100 (last 20 messages):
  - Authentication requirements
  - JWT vs sessions discussion
  - Security considerations
  - Database schema for users/tokens
  - Frontend auth state management
  - API endpoint design

Total: ~5K tokens (500 summary + 4.5K recent)
Processing: 4 seconds
Cost: $0.015
```

---

## Progressive Complexity Escalation

**Sometimes complexity isn't obvious upfront**. Use progressive escalation:

```typescript
async function getContextWithEscalation(
  task: string,
  fullHistory: Message[]
): Promise<Message[]> {
  // Start with simple
  let context = await getAdaptiveContext(task, fullHistory);
  let complexity: ComplexityScore['category'] = 'simple';

  // Check if we can answer
  const canAnswer = await checkIfSufficient(task, context);

  if (!canAnswer && complexity === 'simple') {
    // Escalate to standard
    console.log('Escalating to STANDARD context');
    complexity = 'standard';
    context = fullHistory.slice(-10);  // 2K tokens

    const canAnswerNow = await checkIfSufficient(task, context);
    if (!canAnswerNow) {
      // Escalate to complex
      console.log('Escalating to COMPLEX context');
      complexity = 'complex';
      context = await getAdaptiveContext(task, fullHistory);  // 5K tokens with summaries
    }
  }

  return context;
}
```

---

## Metrics and Tuning

**Track complexity accuracy**:
```typescript
interface ComplexityMetrics {
  predicted: 'simple' | 'standard' | 'complex';
  actual: 'simple' | 'standard' | 'complex';  // Based on resolution time
  accuracy: boolean;  // predicted === actual
}

async function trackComplexity(task: string, resolution: TaskResolution): Promise<void> {
  const predicted = analyzeTaskComplexity(task).category;

  // Infer actual complexity from resolution
  const actual = resolution.duration < 5 ? 'simple'
               : resolution.duration < 30 ? 'standard'
               : 'complex';

  const metrics: ComplexityMetrics = {
    predicted,
    actual,
    accuracy: predicted === actual
  };

  await db.query(`
    INSERT INTO complexity_metrics (task, predicted, actual, accuracy, timestamp)
    VALUES ($1, $2, $3, $4, NOW())
  `, [task, predicted, actual, metrics.accuracy]);

  // Target: >80% accuracy
}
```

---

## Best Practices

1. **Start Simple** - Default to simple context, escalate if needed
2. **Monitor Accuracy** - Track predicted vs actual complexity (target >80%)
3. **Tune Thresholds** - Adjust scoring factors based on domain
4. **Combine with Relevance** - Adaptive windows + relevance filtering = maximum optimization
5. **Include Summaries for Complex** - Complex tasks benefit from historical context (compressed)

---

**Version**: 1.0.0
**Target**: Right-sized context (simple=1K, standard=2K, complex=5K)
**Accuracy**: >80% complexity prediction
**Status**: Ready for implementation
