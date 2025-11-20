# Token Optimization Strategies

**Goal**: Reduce token usage by 70% (15K → 2-5K tokens) without losing critical information.

---

## Strategy 1: File References Over Full Content

**Problem**: Including full file content wastes tokens

**Before** (Wasteful):
```
User: "Fix the bug in auth.ts"
Context includes:
  - Full auth.ts content (500 lines = 2K tokens)
  - Full utils.ts content (300 lines = 1.2K tokens)
  - Total: 3.2K tokens just for files
```

**After** (Optimized):
```
User: "Fix the bug in auth.ts"
Context includes:
  - auth.ts:45-50 (6 lines = 25 tokens) ← Only relevant section
  - "See auth.ts for full file" (5 tokens)
  - Total: 30 tokens (99% reduction)
```

**Implementation**:
```typescript
interface FileReference {
  path: string;
  linesAccessed: number[];      // e.g., [45, 46, 47, 48, 49, 50]
  lastModified: Date;
  wasModified: boolean;           // True if edited in last 3 messages
}

function optimizeFileContext(files: FileReference[]): ContextEntry[] {
  return files.map(file => {
    // Modified recently → include last 50 lines
    if (file.wasModified && minutesSince(file.lastModified) < 5) {
      return {
        type: 'file_content',
        path: file.path,
        content: readLastNLines(file.path, 50),  // ~200 tokens
        tokens: 200
      };
    }

    // Not modified → just reference
    return {
      type: 'file_reference',
      path: file.path,
      linesAccessed: file.linesAccessed,
      content: `See ${file.path}:${file.linesAccessed.join(',')}`,
      tokens: 20  // Minimal
    };
  });
}
```

**Savings**: 80% token reduction for file content

---

## Strategy 2: Message Compression

**Problem**: Old messages contain redundant information

**Before** (Redundant):
```
Message 1: "I'm working on the authentication feature. I need to implement JWT..."
Message 2: "Continuing with authentication, I'll add token validation..."
Message 3: "Still working on auth, now implementing refresh logic..."

Total: 150 tokens across 3 messages, all saying "working on auth"
```

**After** (Compressed):
```
Summary: "Implemented JWT authentication with token validation and refresh logic"

Total: 15 tokens (90% reduction)
```

**Implementation**:
```typescript
async function compressMessages(
  messages: Message[],
  targetReduction: number = 0.50  // 50% reduction
): Promise<string> {
  const fullText = messages.map(m => m.content).join('\n\n');
  const currentTokens = estimateTokens(fullText);
  const targetTokens = currentTokens * (1 - targetReduction);

  // Extract key information
  const keyPoints = {
    decisions: extractDecisions(messages),      // "Chose JWT over sessions"
    codeChanges: extractCodeSnippets(messages), // "Added validateToken()"
    errors: extractErrors(messages),            // "Fixed CORS issue"
    conclusions: extractConclusions(messages)   // "Auth complete, tests pass"
  };

  // Generate compact summary
  const summary = `
    Decisions: ${keyPoints.decisions.join('; ')}
    Changes: ${keyPoints.codeChanges.join('; ')}
    Errors Fixed: ${keyPoints.errors.join('; ')}
    Result: ${keyPoints.conclusions.join('; ')}
  `.trim();

  // Ensure we hit target
  const summaryTokens = estimateTokens(summary);
  if (summaryTokens > targetTokens) {
    return truncateToTokenLimit(summary, targetTokens);
  }

  return summary;
}
```

**Savings**: 50% token reduction for old messages

---

## Strategy 3: Remove Small Talk

**Problem**: Greetings and acknowledgments waste tokens

**Before** (Verbose):
```
User: "Hello! How are you today? I hope you're doing well!"
Assistant: "Hello! I'm doing great, thank you for asking! How can I help you?"
User: "Great! So, I was wondering if you could help me with..."
Assistant: "Of course! I'd be happy to help you with that..."

Total: 80 tokens of small talk (0 value)
```

**After** (Stripped):
```
User: "Help me with..."
Assistant: "I can help with..."

Total: 10 tokens (87% reduction)
```

**Implementation**:
```typescript
function removeSmallTalk(message: string): string {
  const smallTalkPatterns = [
    /^(Hi|Hello|Hey|Good morning|Good afternoon)!?\s*/i,
    /How are you.*?\?/i,
    /I hope you'?re doing well/i,
    /Thank you for asking/i,
    /Of course!?\s*/i,
    /I'?d be happy to help/i,
    /Sure thing!?\s*/i
  ];

  let cleaned = message;
  for (const pattern of smallTalkPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}

function cleanConversationHistory(messages: Message[]): Message[] {
  return messages.map(msg => ({
    ...msg,
    content: removeSmallTalk(msg.content)
  }));
}
```

**Savings**: 10-15% token reduction across conversation

---

## Strategy 4: Deduplicate Tool Results

**Problem**: Same tool results included multiple times

**Before** (Duplicated):
```
Message 5: Read auth.ts (2K tokens)
Message 8: Read auth.ts (2K tokens) ← Duplicate
Message 12: Read auth.ts (2K tokens) ← Duplicate

Total: 6K tokens (4K wasted)
```

**After** (Deduplicated):
```
Message 5: Read auth.ts (2K tokens)
Message 8: "See previous read of auth.ts" (8 tokens)
Message 12: "See previous read of auth.ts" (8 tokens)

Total: 2.016K tokens (67% reduction)
```

**Implementation**:
```typescript
interface ToolResultCache {
  tool: string;           // "Read"
  args: any;              // { file_path: "auth.ts" }
  result: string;         // Full result
  messageId: string;      // Where it appeared
  timestamp: Date;
}

class ToolResultDeduplicator {
  private cache = new Map<string, ToolResultCache>();

  getCacheKey(tool: string, args: any): string {
    return `${tool}:${JSON.stringify(args)}`;
  }

  deduplicate(messages: Message[]): Message[] {
    return messages.map(msg => {
      if (msg.toolResults) {
        const deduped = msg.toolResults.map(result => {
          const key = this.getCacheKey(result.tool, result.args);
          const cached = this.cache.get(key);

          // Seen before within last 10 minutes → reference
          if (cached && minutesSince(cached.timestamp) < 10) {
            return {
              tool: result.tool,
              args: result.args,
              result: `See message ${cached.messageId} for result`,
              tokens: 10
            };
          }

          // First time → cache and include
          this.cache.set(key, {
            tool: result.tool,
            args: result.args,
            result: result.result,
            messageId: msg.id,
            timestamp: new Date()
          });

          return result;
        });

        return { ...msg, toolResults: deduped };
      }

      return msg;
    });
  }
}
```

**Savings**: 30-50% reduction for tool-heavy conversations

---

## Strategy 5: Progressive Disclosure

**Problem**: Including all context upfront, even if not needed

**Before** (Everything Upfront):
```
Task: "What port does the backend use?"

Context includes:
  - Full backend code (5K tokens)
  - Database schema (2K tokens)
  - Frontend code (3K tokens)
  - Total: 10K tokens (overkill for simple question)
```

**After** (Progressive):
```
Task: "What port does the backend use?"

Context includes:
  - Last 5 messages (1K tokens)
  - "Backend runs on port 3000" found immediately
  - No need to load more context
  - Total: 1K tokens (90% reduction)
```

**Implementation**:
```typescript
async function progressiveContextLoading(
  task: string,
  fullHistory: Message[]
): Promise<Message[]> {
  // Start with minimal context
  let context = fullHistory.slice(-5);  // Last 5 messages
  let tokens = estimateTokens(context);

  // Try to answer with minimal context
  const canAnswer = await checkIfSufficient(task, context);
  if (canAnswer) {
    return context;  // Done! 1K tokens
  }

  // Need more context → expand window
  context = fullHistory.slice(-10);  // Last 10 messages
  tokens = estimateTokens(context);

  const canAnswerNow = await checkIfSufficient(task, context);
  if (canAnswerNow) {
    return context;  // Done! 2K tokens
  }

  // Still need more → add summaries of old context
  const summaries = await getSummariesOfOldContext();
  context = [...summaries, ...fullHistory.slice(-20)];

  return context;  // 5K tokens (max)
}
```

**Savings**: 70-90% reduction for simple tasks

---

## Strategy 6: Smart Truncation

**Problem**: Long code snippets waste tokens

**Before** (Full Code):
```typescript
// 500-line file included in context (2K tokens)
function auth() {
  // ... 500 lines ...
}
```

**After** (Truncated):
```typescript
// auth.ts (truncated, see full file for details)
function auth() {
  // ... [450 lines omitted] ...
  return jwt.sign(payload, secret);  // Line 495 (relevant section)
}
```

**Implementation**:
```typescript
function truncateCode(
  code: string,
  relevantLines: number[],  // e.g., [495]
  contextLines: number = 5   // Show ±5 lines around relevant
): string {
  const lines = code.split('\n');

  if (lines.length <= 20) {
    return code;  // Small enough, don't truncate
  }

  // Extract relevant sections with context
  const sections = relevantLines.map(lineNum => {
    const start = Math.max(0, lineNum - contextLines);
    const end = Math.min(lines.length, lineNum + contextLines);

    return {
      start,
      end,
      content: lines.slice(start, end).join('\n')
    };
  });

  // Add truncation markers
  const truncated = sections.map(section =>
    `// Lines ${section.start}-${section.end}\n${section.content}`
  ).join('\n\n// ... [content omitted] ...\n\n');

  return truncated;
}
```

**Savings**: 80-90% reduction for large files

---

## Combined Impact

**Example: Complex Task (Feature Implementation)**

| Strategy | Before | After | Reduction |
|----------|--------|-------|-----------|
| File References | 5K tokens | 1K tokens | 80% |
| Message Compression | 4K tokens | 2K tokens | 50% |
| Remove Small Talk | 1K tokens | 0.15K tokens | 85% |
| Deduplicate Tools | 3K tokens | 1K tokens | 67% |
| Progressive Disclosure | 2K tokens | 0.5K tokens | 75% |
| **Total** | **15K tokens** | **4.65K tokens** | **69%** |

**Result**: ✅ 69% reduction (meets 70% target)

---

## Monitoring Token Usage

```typescript
interface TokenMetrics {
  task: string;
  contextTokens: number;
  responseTokens: number;
  totalTokens: number;
  reduction: number;        // % vs baseline (15K)
  cost: number;             // Estimated API cost
}

function trackTokenUsage(task: string, context: Message[]): TokenMetrics {
  const contextTokens = estimateTokens(context);
  const baseline = 15000;
  const reduction = 1 - (contextTokens / baseline);

  return {
    task,
    contextTokens,
    responseTokens: 0,  // Filled after response
    totalTokens: contextTokens,
    reduction,
    cost: contextTokens * 0.000003  // $3 per 1M tokens (example)
  };
}

// Export to PostgreSQL for tracking
await db.query(`
  INSERT INTO token_metrics (task, context_tokens, reduction, cost, timestamp)
  VALUES ($1, $2, $3, $4, NOW())
`, [metrics.task, metrics.contextTokens, metrics.reduction, metrics.cost]);
```

---

## Best Practices

1. **Always Use File References** - Never include full file content unless modified in last 3 messages
2. **Compress Old Messages** - Summarize anything older than 20 messages or 30 minutes
3. **Remove Noise** - Strip small talk, deduplicate tool results
4. **Progressive Loading** - Start with minimal context, expand only if needed
5. **Truncate Wisely** - Show only relevant sections of large files
6. **Monitor Metrics** - Track token usage to ensure 70% reduction target

---

**Version**: 1.0.0
**Target**: 70% token reduction (15K → 2-5K tokens)
**Status**: Ready for implementation
