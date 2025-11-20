# Pattern Detection - What to Detect and When

**Goal**: Automatically detect opportunities for Claude Code improvement.

**Target**: 5-10 patterns detected per week, >75% confidence, <20% false positives

**Based on**: Expert consensus 2024-2025, frequency analysis, pattern mining

---

## Core Principle

**Detect patterns that indicate improvement opportunities.**

```typescript
// Pattern detection threshold
const DETECTION_THRESHOLD = {
  occurrences: 3,      // 3+ times = suggest
  confidence: 0.75,    // 75%+ confidence required
  timeWindow: 7 * 24 * 60 * 60 * 1000  // 7 days
};

if (pattern.occurrences >= 3 && pattern.confidence > 0.75) {
  suggestImprovement(pattern);
}
```

**Why 3 occurrences?**
- 1 time = Coincidence
- 2 times = Maybe a pattern
- 3 times = Definite pattern, worth suggesting

---

## Pattern Types

### 1. Repeated Workflows (Create Skill)

**Detect**: Same sequence of tool calls 3+ times

```typescript
// Example: User does this 3 times
[
  Grep({ pattern: 'function calculateTax' }),
  Read({ file_path: 'src/services/tax.ts' }),
  Edit({ file_path: 'src/services/tax.ts', ... }),
  Bash({ command: 'npm test src/services/tax.test.ts' })
]

// Pattern detected
{
  type: 'repeated_workflow',
  occurrences: 3,
  confidence: 0.95,  // Very similar each time
  workflow: ['Grep', 'Read', 'Edit', 'Bash'],
  suggestion: 'create_skill_modify_function'
}
```

**Detection algorithm**:
```typescript
function detectRepeatedWorkflow(history: ToolCall[]): Pattern | null {
  // Extract sequences of 3+ tool calls
  const sequences = extractSequences(history, minLength: 3);

  // Group similar sequences
  const grouped = groupSimilar(sequences, similarity: 0.80);

  // Find sequences that appear 3+ times
  const repeated = grouped.filter(g => g.count >= 3);

  if (repeated.length > 0) {
    return {
      type: 'repeated_workflow',
      occurrences: repeated[0].count,
      confidence: repeated[0].similarity,
      workflow: repeated[0].sequence,
      suggestion: generateSkillSuggestion(repeated[0])
    };
  }

  return null;
}
```

**Confidence calculation**:
- Exact same sequence: 100% confidence
- Same tools, different order: 70% confidence
- Same tools, different parameters: 60% confidence
- Different tools, similar intent: 50% confidence (don't suggest)

---

### 2. Duplicated Code (Create Utility/Command)

**Detect**: Same code pattern in 3+ files

```typescript
// Example: Email validation in 3 files
File 1: src/auth/register.ts:42
  if (!user.email || !isValidEmail(user.email)) throw new Error('Invalid email');

File 2: src/auth/login.ts:28
  if (!user.email || !isValidEmail(user.email)) throw new Error('Invalid email');

File 3: src/profile/update.ts:15
  if (!user.email || !isValidEmail(user.email)) throw new Error('Invalid email');

// Pattern detected
{
  type: 'duplicated_code',
  occurrences: 3,
  confidence: 0.92,  // 92% similar
  code: 'email validation pattern',
  locations: [
    'src/auth/register.ts:42',
    'src/auth/login.ts:28',
    'src/profile/update.ts:15'
  ],
  suggestion: 'extract_to_utils'
}
```

**Detection algorithm**:
```typescript
function detectDuplicatedCode(files: EditedFile[]): Pattern | null {
  // Extract code blocks from recent edits
  const codeBlocks = files.flatMap(f => extractCodeBlocks(f));

  // Calculate similarity between all pairs
  const similar = [];
  for (let i = 0; i < codeBlocks.length; i++) {
    for (let j = i + 1; j < codeBlocks.length; j++) {
      const sim = calculateSimilarity(codeBlocks[i], codeBlocks[j]);
      if (sim > 0.85) {
        similar.push({ block1: i, block2: j, similarity: sim });
      }
    }
  }

  // Group similar blocks
  const groups = groupBySimil(similar);

  // Find groups with 3+ blocks
  const duplicated = groups.filter(g => g.blocks.length >= 3);

  if (duplicated.length > 0) {
    return {
      type: 'duplicated_code',
      occurrences: duplicated[0].blocks.length,
      confidence: duplicated[0].avgSimilarity,
      locations: duplicated[0].blocks.map(b => b.location),
      suggestion: 'extract_to_utils'
    };
  }

  return null;
}
```

**Similarity calculation** (AST-based, not string matching):
- Identical AST structure: 100% similarity
- Same structure, different variable names: 90% similarity
- Same logic, different implementation: 70% similarity
- Different logic: <50% similarity (don't suggest)

---

### 3. Repeated Errors (Create Prevention Rule)

**Detect**: Same error 3+ times

```typescript
// Example: FileNotFoundError with Read tool (3 times)
Error 1: FileNotFoundError: src/components/*.tsx
  Tool: Read
  Context: User tried Read with wildcard

Error 2: FileNotFoundError: src/utils/*.ts
  Tool: Read
  Context: User tried Read with wildcard

Error 3: FileNotFoundError: src/services/*.ts
  Tool: Read
  Context: User tried Read with wildcard

// Pattern detected
{
  type: 'repeated_error',
  occurrences: 3,
  confidence: 1.00,  // Exact same error type
  error: 'FileNotFoundError',
  tool: 'Read',
  rootCause: 'using_wildcards_with_read',
  suggestion: 'create_validation_rule'
}
```

**Detection algorithm**:
```typescript
function detectRepeatedError(errorHistory: ExecutionError[]): Pattern | null {
  // Group errors by type and context
  const grouped = groupErrors(errorHistory, {
    byType: true,
    byTool: true,
    byMessage: true  // Similar error message
  });

  // Find errors that occur 3+ times
  const repeated = grouped.filter(g => g.errors.length >= 3);

  if (repeated.length > 0) {
    const pattern = repeated[0];
    return {
      type: 'repeated_error',
      occurrences: pattern.errors.length,
      confidence: 1.00,  // Errors are very concrete
      error: pattern.errorType,
      tool: pattern.tool,
      rootCause: analyzeRootCause(pattern.errors),
      suggestion: createPreventionRule(pattern)
    };
  }

  return null;
}
```

**Root cause analysis**:
```typescript
function analyzeRootCause(errors: ExecutionError[]): RootCause {
  // Common patterns in errors
  const hasWildcards = errors.every(e =>
    e.context.file_path?.includes('*') ||
    e.context.file_path?.includes('**')
  );

  if (hasWildcards && errors[0].tool === 'Read') {
    return {
      cause: 'using_wildcards_with_read',
      fix: 'Use Glob instead of Read for wildcard patterns',
      prevention: 'Create pre-Read validation that detects wildcards'
    };
  }

  // Other root causes...
  return analyzeGenerically(errors);
}
```

---

### 4. Repeated Commands (Create Slash Command)

**Detect**: Same Bash command 3+ times

```typescript
// Example: Git status check (3 times)
Bash({ command: 'git status' })
Bash({ command: 'git status' })
Bash({ command: 'git status --short' })

// Pattern detected
{
  type: 'repeated_command',
  occurrences: 3,
  confidence: 0.90,  // Similar commands
  command: 'git status',
  suggestion: 'create_slash_command'
}
```

**Detection algorithm**:
```typescript
function detectRepeatedCommand(bashHistory: BashCall[]): Pattern | null {
  // Extract commands
  const commands = bashHistory.map(b => b.command);

  // Normalize (remove flags, group by base command)
  const normalized = commands.map(c => normalizeCommand(c));

  // Count occurrences
  const counts = countOccurrences(normalized);

  // Find commands used 3+ times
  const repeated = Object.entries(counts)
    .filter(([cmd, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);  // Sort by frequency

  if (repeated.length > 0) {
    const [command, count] = repeated[0];
    return {
      type: 'repeated_command',
      occurrences: count,
      confidence: 0.90,
      command,
      suggestion: {
        type: 'create_slash_command',
        commandName: generateCommandName(command),
        implementation: generateCommandImpl(command)
      }
    };
  }

  return null;
}

function normalizeCommand(cmd: string): string {
  // git status --short → git status
  // npm test src/auth → npm test
  // grep -r "pattern" . → grep
  const parts = cmd.split(' ');
  return parts[0] + (parts[1] && !parts[1].startsWith('-') ? ` ${parts[1]}` : '');
}
```

---

### 5. Repeated Glob Patterns (Create Command/Skill)

**Detect**: Same Glob pattern 3+ times

```typescript
// Example: Find TypeScript files (3 times)
Glob({ pattern: '**/*.ts' })
Glob({ pattern: '**/*.tsx' })
Glob({ pattern: 'src/**/*.{ts,tsx}' })

// Pattern detected
{
  type: 'repeated_glob_pattern',
  occurrences: 3,
  confidence: 0.85,  // Similar patterns
  pattern: '**/*.{ts,tsx}',
  suggestion: 'create_find_command'
}
```

**Detection algorithm**:
```typescript
function detectRepeatedGlobPattern(globHistory: GlobCall[]): Pattern | null {
  // Extract patterns
  const patterns = globHistory.map(g => g.pattern);

  // Normalize patterns
  const normalized = patterns.map(p => normalizeGlobPattern(p));

  // Group similar patterns
  const grouped = groupSimilarPatterns(normalized, similarity: 0.80);

  // Find patterns used 3+ times
  const repeated = grouped.filter(g => g.count >= 3);

  if (repeated.length > 0) {
    return {
      type: 'repeated_glob_pattern',
      occurrences: repeated[0].count,
      confidence: repeated[0].similarity,
      pattern: repeated[0].normalizedPattern,
      suggestion: {
        type: 'create_find_command',
        name: generateCommandName(repeated[0].pattern),
        description: `Find files matching ${repeated[0].pattern}`
      }
    };
  }

  return null;
}

function normalizeGlobPattern(pattern: string): string {
  // **/*.ts + **/*.tsx → **/*.{ts,tsx}
  // src/**/*.ts + lib/**/*.ts → **/*.ts (common suffix)
  // Generalize to most common pattern
  return generalizePattern(pattern);
}
```

---

### 6. Missing Documentation (Create Docs/Research)

**Detect**: Same question/topic 3+ times

```typescript
// Example: User asks about WebSockets 3 times
AskUserQuestion: "How to implement WebSocket?"
AskUserQuestion: "WebSocket error handling?"
AskUserQuestion: "WebSocket authentication?"

// Pattern detected
{
  type: 'missing_documentation',
  occurrences: 3,
  confidence: 0.80,  // Topic similarity
  topic: 'WebSockets',
  suggestion: 'create_documentation_or_research'
}
```

**Detection algorithm**:
```typescript
function detectMissingDocumentation(questionHistory: UserQuestion[]): Pattern | null {
  // Extract topics from questions
  const topics = questionHistory.map(q => extractTopics(q.question));

  // Group by similarity (semantic similarity via embeddings)
  const grouped = groupBySemanticSimilarity(topics, similarity: 0.75);

  // Find topics queried 3+ times
  const repeated = grouped.filter(g => g.count >= 3);

  if (repeated.length > 0) {
    // Check if documentation exists
    const topic = repeated[0].topic;
    const hassDocs = await checkDocumentation(topic);

    if (!hasDocs) {
      return {
        type: 'missing_documentation',
        occurrences: repeated[0].count,
        confidence: repeated[0].similarity,
        topic,
        suggestion: {
          type: 'create_documentation',
          options: [
            'Research best practices 2024-2025',
            'Create .claude/docs/ documentation',
            'Find relevant MCP server'
          ]
        }
      };
    }
  }

  return null;
}
```

---

## Detection Frequency

**How often to check for patterns:**

```typescript
const DETECTION_SCHEDULE = {
  // Real-time detection (immediate)
  repeated_errors: 'immediate',      // Detect on each error
  repeated_commands: 'immediate',    // Detect on each Bash call

  // Periodic detection (every N operations)
  repeated_workflows: 'every_10_operations',   // Check after 10 tool calls
  duplicated_code: 'every_5_edits',           // Check after 5 Edit calls
  repeated_glob: 'every_5_globs',             // Check after 5 Glob calls

  // Session-based detection (end of session)
  missing_documentation: 'end_of_session'     // Check when task completes
};
```

**Why different frequencies?**
- Errors: Immediate (prevent next error)
- Commands: Immediate (suggest command shortcut quickly)
- Workflows: Every 10 ops (balance detection vs performance)
- Docs: End of session (avoid interrupting flow)

---

## Confidence Scoring

**How to calculate confidence:**

```typescript
function calculateConfidence(pattern: DetectedPattern): number {
  // Base confidence from occurrence count
  let confidence = Math.min(pattern.occurrences / 10, 0.70);  // Max 70% from count

  // Add similarity boost
  if (pattern.similarity) {
    confidence += pattern.similarity * 0.30;  // Max 30% from similarity
  }

  // Penalties
  if (pattern.timeSpan > 30 * 24 * 60 * 60 * 1000) {
    confidence *= 0.80;  // 20% penalty if spread over >30 days
  }

  if (pattern.hasVariations) {
    confidence *= 0.90;  // 10% penalty if variations exist
  }

  return Math.max(0, Math.min(1, confidence));
}
```

**Confidence thresholds**:
- <50%: Don't suggest (too uncertain)
- 50-75%: Log for review, don't suggest yet
- 75-90%: Suggest with "I noticed..." (medium confidence)
- >90%: Suggest with "I'm confident..." (high confidence)

---

## Quick Reference

**Pattern Types**:
1. Repeated workflows → Create skill
2. Duplicated code → Extract to utils
3. Repeated errors → Create prevention rule
4. Repeated commands → Create slash command
5. Repeated Glob patterns → Create find command
6. Missing documentation → Create docs or research

**Detection Threshold**:
- Occurrences: 3+
- Confidence: >75%
- Time window: 7 days

**Detection Frequency**:
- Errors/commands: Immediate
- Workflows/Glob: Every 5-10 operations
- Documentation: End of session

---

**Version**: 1.0.0
**Target**: 5-10 patterns detected per week
**False positive rate**: <20%
