# Relevance Filtering - Semantic Context Selection

**Goal**: Include only messages semantically related to current task (>90% relevance), exclude irrelevant topics.

---

## The Problem

**Without Relevance Filtering**:
```
Conversation history (30 messages):
  - Messages 1-10: Discussing Vue components
  - Messages 11-20: Implementing PostgreSQL queries
  - Messages 21-30: Fixing WebSocket connection issues

User asks: "Optimize the PostgreSQL query performance"

Context includes: ALL 30 messages (15K tokens)
  - But only messages 11-20 are relevant!
  - Messages about Vue and WebSocket are noise (10K wasted tokens)
```

**With Relevance Filtering**:
```
User asks: "Optimize the PostgreSQL query performance"

Semantic analysis:
  - Messages 1-10 (Vue): similarity 0.15 → EXCLUDE
  - Messages 11-20 (PostgreSQL): similarity 0.85 → INCLUDE
  - Messages 21-30 (WebSocket): similarity 0.20 → EXCLUDE

Context includes: Only messages 11-20 (3K tokens)
Result: 80% token reduction, 100% relevance
```

---

## Relevance Scoring Formula

```typescript
function calculateRelevanceScore(
  message: Message,
  currentTask: string
): number {
  // Component scores (0-1 range)
  const semanticSimilarity = cosineSimilarity(
    getEmbedding(message.content),
    getEmbedding(currentTask)
  );  // 0.0 - 1.0

  const recencyScore = calculateRecency(message.timestamp);  // 0.0 - 1.0

  const keywordMatch = calculateKeywordOverlap(
    message.content,
    currentTask
  );  // 0.0 - 1.0

  // Weighted combination
  const relevance = (
    semanticSimilarity * 0.50 +  // Semantic match (most important)
    recencyScore * 0.30 +         // Recent = relevant
    keywordMatch * 0.20           // Explicit keyword mentions
  );

  return relevance;  // 0.0 - 1.0
}
```

**Example**:
```typescript
Message: "Implemented PostgreSQL index on events.type column"
Task: "Optimize PostgreSQL query performance"

Scores:
  - Semantic similarity: 0.75 (both about PostgreSQL optimization)
  - Recency: 0.80 (sent 5 minutes ago)
  - Keyword match: 0.90 ("PostgreSQL" appears in both)

Relevance = 0.75 * 0.50 + 0.80 * 0.30 + 0.90 * 0.20
          = 0.375 + 0.240 + 0.180
          = 0.795 (79.5% relevance → INCLUDE)
```

---

## Relevance Thresholds

**Decision Logic**:
```typescript
const RELEVANCE_THRESHOLD = 0.40;  // 40% minimum relevance

function shouldIncludeMessage(
  message: Message,
  task: string,
  conversationHistory: Message[]
): boolean {
  // Exception 1: Always include last 3 messages (too recent to exclude)
  const recentMessageIds = conversationHistory.slice(-3).map(m => m.id);
  if (recentMessageIds.includes(message.id)) {
    return true;  // ✅ Recent message
  }

  // Exception 2: Always include error messages (debugging context)
  if (message.content.match(/error|exception|failed|crash/i)) {
    return true;  // ✅ Error message
  }

  // Exception 3: Always include code changes (implementation context)
  if (message.toolResults?.some(t => t.tool === 'Edit' || t.tool === 'Write')) {
    return true;  // ✅ Code modification
  }

  // Standard relevance check
  const relevance = calculateRelevanceScore(message, task);
  return relevance >= RELEVANCE_THRESHOLD;  // ✅ Semantically relevant
}
```

---

## Semantic Similarity Calculation

**Option 1: Simple Keyword Overlap** (Fast, no API calls)
```typescript
function cosineSimilarityKeywords(text1: string, text2: string): number {
  const words1 = tokenize(text1.toLowerCase());
  const words2 = tokenize(text2.toLowerCase());

  // Build vocabulary
  const vocab = new Set([...words1, ...words2]);

  // Create vectors
  const vector1 = Array.from(vocab).map(word =>
    words1.filter(w => w === word).length
  );
  const vector2 = Array.from(vocab).map(word =>
    words2.filter(w => w === word).length
  );

  // Cosine similarity
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitude1 * magnitude2);
}
```

**Option 2: Embedding-Based** (Accurate, requires API)
```typescript
// Use OpenAI embeddings (or similar)
async function cosineSimilarityEmbeddings(
  text1: string,
  text2: string
): Promise<number> {
  const [embedding1, embedding2] = await Promise.all([
    getEmbedding(text1),  // Call to embedding API
    getEmbedding(text2)
  ]);

  return cosineSimilarity(embedding1, embedding2);
}

// Cache embeddings to avoid repeated API calls
const embeddingCache = new Map<string, number[]>();

async function getEmbedding(text: string): Promise<number[]> {
  const cacheKey = hashText(text);
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }

  const embedding = await callEmbeddingAPI(text);
  embeddingCache.set(cacheKey, embedding);
  return embedding;
}
```

**Recommendation**: Start with Option 1 (keyword-based), upgrade to Option 2 if accuracy insufficient.

---

## Recency Score Calculation

```typescript
function calculateRecency(messageTimestamp: Date): number {
  const minutesAgo = (Date.now() - messageTimestamp.getTime()) / 1000 / 60;

  // Exponential decay (recent = more relevant)
  // Messages from last 5 minutes: 1.0 (100% relevance)
  // Messages from 30 minutes ago: 0.5 (50% relevance)
  // Messages from 2 hours ago: 0.1 (10% relevance)

  const decayRate = 0.05;  // Tunable
  const recency = Math.exp(-decayRate * minutesAgo);

  return Math.max(0, Math.min(1, recency));  // Clamp to [0, 1]
}

// Example values
calculateRecency(5 minutes ago)   // → 0.78
calculateRecency(30 minutes ago)  // → 0.22
calculateRecency(2 hours ago)     // → 0.006
```

---

## Keyword Match Calculation

```typescript
function calculateKeywordOverlap(message: string, task: string): number {
  // Extract important keywords (nouns, verbs, tech terms)
  const messageKeywords = extractKeywords(message);
  const taskKeywords = extractKeywords(task);

  // Calculate Jaccard similarity (intersection / union)
  const intersection = messageKeywords.filter(kw =>
    taskKeywords.includes(kw)
  ).length;

  const union = new Set([...messageKeywords, ...taskKeywords]).size;

  return intersection / union;
}

function extractKeywords(text: string): string[] {
  // Remove stopwords
  const stopwords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'for', 'on', 'with']);

  const words = text.toLowerCase().split(/\W+/)
    .filter(word => word.length > 2)
    .filter(word => !stopwords.has(word));

  // Boost technical terms
  const techTerms = ['api', 'database', 'query', 'index', 'cache', 'redis', 'postgresql', 'vue', 'websocket', 'bun', 'typescript'];

  const boosted = words.flatMap(word =>
    techTerms.includes(word) ? [word, word] : [word]  // Duplicate tech terms
  );

  return [...new Set(boosted)];  // Unique
}
```

---

## Filtering Implementation

```typescript
async function filterByRelevance(
  conversationHistory: Message[],
  currentTask: string,
  threshold: number = 0.40
): Promise<Message[]> {
  const filtered: Array<{ message: Message, score: number, reason: string }> = [];

  for (const message of conversationHistory) {
    // Check if should include
    if (shouldIncludeMessage(message, currentTask, conversationHistory)) {
      const score = calculateRelevanceScore(message, currentTask);

      // Determine reason
      const isRecent = conversationHistory.slice(-3).map(m => m.id).includes(message.id);
      const hasError = message.content.match(/error|exception/i);
      const hasCode = message.toolResults?.some(t => t.tool === 'Edit' || t.tool === 'Write');

      const reason = isRecent ? 'recent'
                   : hasError ? 'error'
                   : hasCode ? 'code_change'
                   : 'relevant';

      filtered.push({ message, score, reason });
    }
  }

  // Sort by score descending (most relevant first)
  filtered.sort((a, b) => b.score - a.score);

  // Log filtering results (for metrics)
  console.log(`Filtered ${conversationHistory.length} → ${filtered.length} messages`);
  console.log(`Relevance rate: ${(filtered.length / conversationHistory.length * 100).toFixed(1)}%`);

  return filtered.map(f => f.message);
}
```

---

## Example: Multi-Topic Conversation

**Conversation History**:
```
1-5: User implements Vue dashboard component
6-10: User fixes PostgreSQL query performance
11-15: User debugs WebSocket connection issues
16-20: User optimizes Redis caching
21-25: User returns to PostgreSQL to add indexes
```

**Current Task**: "Add composite index on events (workspace_id, timestamp)"

**Relevance Analysis**:
```typescript
Messages 1-5 (Vue dashboard):
  - Semantic similarity: 0.10 (different topic)
  - Recency: 0.05 (1 hour ago)
  - Keyword match: 0.0 (no shared keywords)
  - Score: 0.10 * 0.50 + 0.05 * 0.30 + 0.0 * 0.20 = 0.065 → EXCLUDE

Messages 6-10 (PostgreSQL query):
  - Semantic similarity: 0.80 (same topic: PostgreSQL)
  - Recency: 0.15 (45 min ago)
  - Keyword match: 0.70 (PostgreSQL, query, events)
  - Score: 0.80 * 0.50 + 0.15 * 0.30 + 0.70 * 0.20 = 0.585 → INCLUDE

Messages 11-15 (WebSocket):
  - Semantic similarity: 0.05 (different topic)
  - Recency: 0.25 (30 min ago)
  - Keyword match: 0.0 (no shared keywords)
  - Score: 0.05 * 0.50 + 0.25 * 0.30 + 0.0 * 0.20 = 0.100 → EXCLUDE

Messages 16-20 (Redis caching):
  - Semantic similarity: 0.15 (different topic)
  - Recency: 0.40 (20 min ago)
  - Keyword match: 0.10 (events)
  - Score: 0.15 * 0.50 + 0.40 * 0.30 + 0.10 * 0.20 = 0.215 → EXCLUDE

Messages 21-25 (PostgreSQL indexes):
  - Semantic similarity: 0.95 (exact match: PostgreSQL indexes)
  - Recency: 0.90 (5 min ago)
  - Keyword match: 0.95 (PostgreSQL, index, events, workspace_id, timestamp)
  - Score: 0.95 * 0.50 + 0.90 * 0.30 + 0.95 * 0.20 = 0.925 → INCLUDE

Result: Include messages 6-10, 21-25 (10 messages)
Excluded: Messages 1-5, 11-20 (15 messages)
Reduction: 60% messages excluded
```

---

## Context Hit Rate Measurement

**Track how much included context is actually used**:
```typescript
interface ContextUsage {
  messagesIncluded: number;
  messagesReferenced: number;  // How many were actually used in response
  hitRate: number;              // Referenced / Included
}

function measureContextHitRate(
  includedMessages: Message[],
  response: string
): ContextUsage {
  // Check which messages were referenced in response
  const referenced = includedMessages.filter(msg => {
    // Did response reference this message's content?
    const keywords = extractKeywords(msg.content);
    return keywords.some(kw => response.toLowerCase().includes(kw));
  });

  return {
    messagesIncluded: includedMessages.length,
    messagesReferenced: referenced.length,
    hitRate: referenced.length / includedMessages.length
  };
}

// Target: >90% hit rate (most included messages should be used)
```

---

## Best Practices

1. **Always Apply Relevance Filtering** - Never include full conversation history
2. **Tune Threshold Based on Domain** - Database/security tasks may need higher threshold (0.50)
3. **Preserve Recent Context** - Last 3 messages always included (even if low relevance)
4. **Cache Embeddings** - Avoid repeated API calls for same messages
5. **Monitor Hit Rate** - Ensure included messages are actually used (target >90%)
6. **Combine with Token Optimization** - Relevance filtering + file references = maximum savings

---

**Version**: 1.0.0
**Target**: >90% context hit rate (messages used / messages included)
**Threshold**: 0.40 relevance score (tunable)
**Status**: Ready for implementation
