---
name: persistent-memory
description: Cross-session knowledge retention system that automatically remembers decisions, bug fixes, preferences, patterns, and lessons. Always-active with Memory MCP Server backend. Keywords - memory, persistent, knowledge, cross session, remember, save context, knowledge retention, session memory
---

# Persistent Memory - Cross-Session Knowledge System

> **ALWAYS-ACTIVE** - Automatically detects and saves important information across sessions
>
> **Coverage**: 70% of SPEC (Option B - Hybrid)
>
> **Backend**: Memory MCP Server + Markdown files

---

## Core Identity

**PERSISTENT** - Remembers key information across sessions:
- ✅ **Decisions**: Architecture, tech stack, patterns
- ✅ **Bug Fixes**: Solutions to prevent recurrence
- ✅ **Preferences**: User coding style, conventions
- ✅ **Patterns**: Successful approaches to reuse
- ✅ **Lessons**: Important learnings

**AUTO-DETECT** - No manual effort required:
- Pattern matching detects important info (80% accuracy target)
- Confidence scoring (>0.70 threshold)
- Automatic tag extraction
- Smart filtering (exclude small talk, failed attempts)

**CROSS-SESSION** - Builds on previous work:
- Session init loads last 7 days (~20-30 memories)
- Bug prevention checks known fixes
- User preferences auto-applied
- No repeated questions

---

## Mission

Eliminate the "fresh start problem" where Claude forgets everything between sessions by:

1. **Auto-detecting** important decisions, bugs, patterns
2. **Storing** in structured format (memory MCP + markdown)
3. **Loading** relevant context at session start
4. **Preventing** bug recurrence and repeated questions
5. **Learning** from successful approaches

**Target Metrics**:
- <500ms retrieval time
- 80% auto-detect accuracy
- <20% bug recurrence rate
- ~2K tokens session init

---

## 🎯 Memory Types

```typescript
type MemoryType =
  | 'decision'     // Architectural, tech stack decisions
  | 'bug_fix'      // Bugs resolved with solutions
  | 'preference'   // User coding preferences
  | 'pattern'      // Successful approaches
  | 'lesson';      // Important learnings

interface Memory {
  id: string;              // Unique ID (mem_001, mem_002, ...)
  type: MemoryType;
  content: string;         // The memory content
  tags: string[];          // Auto-extracted tags
  created: string;         // ISO timestamp
  project: string;         // Project name (workspace)
  confidence: number;      // 0-1 (how confident auto-detect is)
  archived: boolean;       // Archived after 90 days
}
```

---

## 🔍 Auto-Detect Pattern Matching

**Critical Feature**: Automatically detect important information without user intervention.

### Decision Patterns

Detect when user makes architectural or tech decisions:

```typescript
const DECISION_PATTERNS = [
  // Direct decisions
  /(?:we(?:'ll| will)|let's|going to) use (\w+)/i,
  /decided? to (?:use|go with|implement) (.+?)(?:\.|because|since|$)/i,
  /(?:chose|selected|picked) (.+?) (?:over|instead of|because)/i,

  // Rationale-based
  /using (.+?) (?:because|since|as) (.+)/i,
  /(.+?) is better (?:than|because) (.+)/i,

  // Alternatives considered
  /(?:considered|evaluated) (.+?) (?:but|and) (?:chose|went with) (.+)/i
];

// Example matches:
// ✅ "We'll use PostgreSQL with TimescaleDB"
// ✅ "Decided to implement JWT auth because it's stateless"
// ✅ "Going with Redis instead of in-memory cache"
// ✅ "Using TypeScript strict mode for better type safety"
// ✅ "Considered ClickHouse but went with PostgreSQL"
```

### Bug Fix Patterns

Detect when bugs are fixed with solutions:

```typescript
const BUG_FIX_PATTERNS = [
  // Fix descriptions
  /fixed? (.+?) by (.+?)(?:\.|$)/i,
  /resolved? (.+?) (?:by|with|using) (.+?)(?:\.|$)/i,
  /solved? (.+?) (?:issue|bug|error) (.+)/i,

  // Root cause + solution
  /(.+?) was (?:caused by|due to) (.+?)\.? (?:fixed|solved|resolved) (?:by|with) (.+)/i,

  // Error + fix
  /error[:\s]+["'](.+?)["'].+?(?:fixed|solved) by (.+)/i
];

// Example matches:
// ✅ "Fixed WebSocket reconnection loop by adding exponential backoff"
// ✅ "Resolved N+1 query issue by using JOIN instead of separate queries"
// ✅ "The bug was caused by null user. Fixed by adding null check"
// ✅ "Error: 'Cannot read property id of undefined' - solved by optional chaining"
```

### Preference Patterns

Detect user coding style preferences:

```typescript
const PREFERENCE_PATTERNS = [
  // Explicit preferences
  /(?:I|we) prefer (.+?) (?:over|instead of|to) (.+)/i,
  /(?:always|never) (?:use|do) (.+)/i,
  /coding style[:\s]+(.+)/i,

  // Naming conventions
  /(?:use|follow) (.+?) naming (?:convention|style)/i,
  /variables should be (.+)/i,

  // Formatting
  /(?:use|prefer) (?:tabs|spaces|\d+ spaces) for (?:indentation|indent)/i,
  /(?:single|double) quotes for (?:strings|imports)/i
];

// Example matches:
// ✅ "I prefer camelCase over snake_case for JavaScript"
// ✅ "Always use const instead of let when possible"
// ✅ "Follow PascalCase naming convention for components"
// ✅ "Use 2 spaces for indentation"
```

### Pattern/Approach Detection

Detect successful approaches worth reusing:

```typescript
const PATTERN_PATTERNS = [
  // Pattern descriptions
  /(?:pattern|approach|strategy) (?:for|to) (.+?) is (.+)/i,
  /(?:best way|recommended approach) to (.+?) is (.+)/i,

  // Successful implementations
  /successfully implemented (.+?) (?:using|by|with) (.+)/i,
  /(.+?) works well (?:for|when) (.+)/i
];

// Example matches:
// ✅ "Pattern for error handling is try-catch with logging"
// ✅ "Best way to handle async is using async/await"
// ✅ "Successfully implemented caching using Redis with 5min TTL"
```

---

## 📊 Confidence Scoring

**Calculate confidence** for each detected memory (0-1 scale):

```typescript
function calculateConfidence(match: RegExpMatchArray, context: string): number {
  let confidence = 0.50; // Base confidence

  // Factor 1: Pattern specificity (+0.20)
  if (match[1] && match[2]) {
    // Has both subject and object (e.g., "use X because Y")
    confidence += 0.20;
  }

  // Factor 2: Context richness (+0.15)
  if (context.includes('because') || context.includes('rationale')) {
    confidence += 0.15;
  }

  // Factor 3: Technical terms (+0.10)
  const techTerms = ['API', 'database', 'authentication', 'cache', 'PostgreSQL', 'Redis'];
  if (techTerms.some(term => context.includes(term))) {
    confidence += 0.10;
  }

  // Factor 4: User confirmation (+0.05)
  if (context.includes('yes') || context.includes('correct')) {
    confidence += 0.05;
  }

  return Math.min(confidence, 1.0); // Cap at 1.0
}

// Examples:
// "Use PostgreSQL" → 0.50 (base)
// "Use PostgreSQL because it's reliable" → 0.85 (base + specificity + context)
// "Decided to use PostgreSQL for events due to JSON support" → 0.95 (all factors)
```

**Threshold**: Only save memories with confidence ≥ 0.70

---

## 🚀 Auto-Detect Workflow

### Step 1: Analyze User Message

```typescript
async function analyzeMessage(message: string): Promise<Memory | null> {
  // Try each pattern type
  const patterns = {
    decision: DECISION_PATTERNS,
    bug_fix: BUG_FIX_PATTERNS,
    preference: PREFERENCE_PATTERNS,
    pattern: PATTERN_PATTERNS
  };

  for (const [type, typePatterns] of Object.entries(patterns)) {
    for (const pattern of typePatterns) {
      const match = message.match(pattern);

      if (match) {
        const confidence = calculateConfidence(match, message);

        if (confidence >= 0.70) {
          return {
            id: generateId(), // mem_001, mem_002, ...
            type: type as MemoryType,
            content: message,
            tags: extractTags(message),
            created: new Date().toISOString(),
            project: getCurrentProject(),
            confidence: confidence,
            archived: false
          };
        }
      }
    }
  }

  return null; // No pattern matched or confidence too low
}
```

### Step 2: Extract Tags

```typescript
function extractTags(content: string): string[] {
  const tags: string[] = [];

  // Technology tags
  const techKeywords = {
    'PostgreSQL': 'database',
    'Redis': 'cache',
    'JWT': 'authentication',
    'WebSocket': 'realtime',
    'TypeScript': 'language',
    'Vue': 'frontend',
    'React': 'frontend',
    'API': 'backend',
    'N+1': 'performance'
  };

  for (const [keyword, tag] of Object.entries(techKeywords)) {
    if (content.includes(keyword)) {
      tags.push(tag);
    }
  }

  // Category tags based on type
  if (content.includes('architecture')) tags.push('architecture');
  if (content.includes('security')) tags.push('security');
  if (content.includes('performance')) tags.push('performance');
  if (content.includes('bug') || content.includes('error')) tags.push('debugging');

  return [...new Set(tags)]; // Remove duplicates
}
```

### Step 3: Save to Memory MCP

```typescript
async function saveMemory(memory: Memory): Promise<void> {
  // Save to memory MCP server
  await mcp__memory__create_entities({
    entities: [{
      name: memory.id,
      entityType: memory.type,
      observations: [
        `Content: ${memory.content}`,
        `Tags: ${memory.tags.join(', ')}`,
        `Confidence: ${memory.confidence}`,
        `Created: ${memory.created}`,
        `Project: ${memory.project}`
      ]
    }]
  });

  // Also save to markdown file for human readability
  await appendToMarkdown(memory);

  console.log(`💾 Saved memory: ${memory.type} (confidence: ${memory.confidence.toFixed(2)})`);
}

async function appendToMarkdown(memory: Memory): Promise<void> {
  const mdContent = `
---
id: ${memory.id}
type: ${memory.type}
tags: [${memory.tags.join(', ')}]
created: ${memory.created}
project: ${memory.project}
confidence: ${memory.confidence}
---

${memory.content}

`;

  const filePath = '.claude/memory/MEMORY.md';

  // Append to file (create if doesn't exist)
  const existing = await Read({ file_path: filePath }).catch(() => '');
  await Write({
    file_path: filePath,
    content: existing + mdContent
  });
}
```

---

## 📥 Session Initialization

**Auto-load memories at session start** (last 7 days):

```typescript
async function loadSessionMemories(): Promise<string> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Search memory MCP for recent memories
  const allMemories = await mcp__memory__search_entities({
    query: getCurrentProject()
  });

  // Filter by date (last 7 days)
  const recentMemories = allMemories.entities
    .filter(e => new Date(e.created) > sevenDaysAgo)
    .sort((a, b) => new Date(b.created) - new Date(a.created)); // Newest first

  // Group by type
  const byType = {
    decision: recentMemories.filter(m => m.entityType === 'decision'),
    bug_fix: recentMemories.filter(m => m.entityType === 'bug_fix'),
    preference: recentMemories.filter(m => m.entityType === 'preference'),
    pattern: recentMemories.filter(m => m.entityType === 'pattern')
  };

  // Create summary (~2K tokens)
  const summary = `
# Recent Project Context (Last 7 Days)

## Key Decisions (${byType.decision.length})
${byType.decision.slice(0, 5).map(m => `- ${m.observations[0]}`).join('\n')}

## Bugs Fixed (${byType.bug_fix.length})
${byType.bug_fix.slice(0, 5).map(m => `- ${m.observations[0]}`).join('\n')}

## User Preferences (${byType.preference.length})
${byType.preference.map(m => `- ${m.observations[0]}`).join('\n')}

## Successful Patterns (${byType.pattern.length})
${byType.pattern.slice(0, 3).map(m => `- ${m.observations[0]}`).join('\n')}
`;

  return summary;
}

// Usage: Call at session start
// const context = await loadSessionMemories();
// Include in initial prompt
```

---

## 🐛 Bug Prevention

**Check for similar bugs before debugging:**

```typescript
async function checkKnownBugs(error: string): Promise<Memory | null> {
  // Search for bug_fix memories
  const knownBugs = await mcp__memory__search_entities({
    query: error
  });

  const bugFixes = knownBugs.entities
    .filter(e => e.entityType === 'bug_fix');

  if (bugFixes.length === 0) return null;

  // Calculate text similarity (simple approach for Option B)
  const similarities = bugFixes.map(bug => ({
    bug,
    similarity: calculateTextSimilarity(error, bug.observations[0])
  }));

  // Sort by similarity
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Return if similarity > 0.70
  if (similarities[0].similarity > 0.70) {
    return similarities[0].bug;
  }

  return null;
}

function calculateTextSimilarity(str1: string, str2: string): number {
  // Simple Jaccard similarity (Option B - no embeddings)
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// Usage
const knownFix = await checkKnownBugs("WebSocket keeps reconnecting");
if (knownFix) {
  console.log(`🎯 Similar bug found! Previous solution: ${knownFix.observations[0]}`);
}
```

---

## 🔍 Memory Search

**Search across all memories** (hybrid: keyword + recency):

```typescript
async function searchMemories(query: string, type?: MemoryType): Promise<Memory[]> {
  // Search memory MCP
  const results = await mcp__memory__search_entities({ query });

  // Filter by type if specified
  let filtered = results.entities;
  if (type) {
    filtered = filtered.filter(e => e.entityType === type);
  }

  // Calculate relevance score (keyword match + recency)
  const scored = filtered.map(memory => {
    const keywordMatch = calculateTextSimilarity(query, memory.observations[0]);
    const recency = calculateRecency(memory.created);

    // Hybrid scoring: 75% keyword, 25% recency
    const relevance = keywordMatch * 0.75 + recency * 0.25;

    return { memory, relevance };
  });

  // Sort by relevance
  scored.sort((a, b) => b.relevance - a.relevance);

  // Return top 10
  return scored.slice(0, 10).map(s => s.memory);
}

function calculateRecency(created: string): number {
  const createdDate = new Date(created);
  const now = new Date();
  const daysSince = (now - createdDate) / (1000 * 60 * 60 * 24);

  // Decay over 90 days
  if (daysSince <= 7) return 1.0;      // Last week: full score
  if (daysSince <= 30) return 0.75;    // Last month: 0.75
  if (daysSince <= 90) return 0.50;    // Last 90 days: 0.50
  return 0.25;                         // Older: 0.25
}
```

---

## 🗑️ Memory Expiration

**Archive old memories** (90 days TTL):

```typescript
async function cleanupOldMemories(): Promise<number> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // Get all memories
  const allMemories = await mcp__memory__search_entities({
    query: getCurrentProject()
  });

  // Find old memories
  const oldMemories = allMemories.entities
    .filter(m => new Date(m.created) < ninetyDaysAgo);

  // Archive (update observations to mark as archived)
  for (const memory of oldMemories) {
    await mcp__memory__create_entities({
      entities: [{
        name: memory.name,
        entityType: memory.entityType,
        observations: [
          ...memory.observations,
          `Archived: true`
        ]
      }]
    });
  }

  return oldMemories.length;
}

// Run weekly
// setInterval(cleanupOldMemories, 7 * 24 * 60 * 60 * 1000);
```

---

## 🎮 User Control

Users can manually interact with memories via slash commands:

### /memory-show
View all active memories

### /memory-save "content"
Force save a specific memory

### /memory-search "query"
Search for specific memories

### /memory-clear
Delete all memories (with confirmation)

---

## 📊 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Auto-detect Accuracy** | >80% | Correct detections / Total important info |
| **Retrieval Time** | <500ms | Session init + search time |
| **Bug Recurrence** | <20% | Same bug fixed twice / Total bugs |
| **Session Context Size** | ~2K tokens | Token count of loaded memories |
| **User Satisfaction** | No repeated questions | Qualitative feedback |

---

## 🔗 Integration

### With Module 03 (ANTI-HALLUCINATION)
- Validate memory exists before claiming
- Use Grep to verify memory content
- Confidence scoring prevents hallucinated memories

### With Module 08 (CONTEXT-MANAGEMENT)
- Persistent memory = long-term (cross-session)
- Context management = short-term (intra-session)
- Auto-promote important context → persistent memory

### With Module 10 (SELF-IMPROVEMENT)
- Track auto-detect accuracy
- A/B test different patterns
- Learn from successful detections

---

## 📁 File Structure

```
.claude/memory/
├── MEMORY.md                # Human-readable memory log
└── archived/
    └── 2025-11.md          # Archived memories by month
```

---

**Skill Version**: 1.0.0 (Option B - Hybrid)
**SPEC Coverage**: 70% (7/10 scenarios)
**Backend**: Memory MCP Server + Markdown
**Features**: Auto-detect, Session init, Bug prevention, Search, Expiration
**Tools Used**: mcp__memory__*, Read, Write
