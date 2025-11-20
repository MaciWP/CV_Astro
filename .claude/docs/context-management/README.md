# Context Management - Overview

**Problem**: Full conversation history included (15K+ tokens per task), irrelevant messages waste tokens, no prioritization.

**Target**: Adaptive context (2-5K tokens per task, 70% reduction), >90% relevance, no critical information lost.

---

## The Problem

**Current State (Without Context Management)**:
- **15K+ tokens per task** - Full conversation history included every time
- **Low relevance** - Irrelevant messages from previous topics included
- **No prioritization** - All messages treated equally
- **Context overflow** - Long conversations get truncated, losing critical info

**Impact**:
- Higher costs (more tokens = more money)
- Slower responses (processing 15K tokens takes time)
- Potential information loss (truncation when >200K context limit)
- Diluted focus (Claude sees too much noise, not enough signal)

---

## The Solution

**Context Management System**:
1. **Adaptive Context Windows** - Simple tasks use 1K tokens, complex use 5K
2. **Relevance Filtering** - Only include messages semantically related to current task
3. **Smart Compression** - Summarize old context, keep recent messages full
4. **File References** - Include file:line references, not full file content (80% savings)
5. **Topic Segmentation** - Detect topic changes, provide cross-topic context when needed

**Result**:
- **70% token reduction** (15K → 2-5K tokens)
- **>90% relevance** (only useful messages included)
- **No information loss** (summaries preserve key decisions/code)
- **5-10x cost savings** on API calls

---

## Quick Reference

### Core Principles

1. **Adaptive Windows**: Match context size to task complexity
   - Simple (question): 1K tokens (~5 messages)
   - Standard (bug fix): 2K tokens (~10 messages)
   - Complex (feature): 5K tokens (~20 messages + summaries)

2. **Relevance Threshold**: Semantic similarity >0.40
   - Messages below threshold excluded (unless last 3 messages)
   - Exception: Recent messages always included

3. **File References Over Content**: 80% token savings
   - Include `file:line` references only
   - Exception: Files modified in last 3 messages (include last 50 lines)

4. **Context Overflow**: Summarize when >10K tokens
   - Keep recent 50% full (no summarization)
   - Summarize oldest 50% (50% reduction: 1000 → 500 tokens)

### When to Use

**Load context management documentation** when:
- Working on long conversations (>30 messages)
- Noticing slow responses (processing too much context)
- Task requires cross-topic context (referencing old topics)
- Optimizing token usage for cost savings

**Command**:
```
/load-context-management
```

---

## Success Metrics

| Metric | Baseline | Target | How to Measure |
|--------|----------|--------|----------------|
| **Avg Context Size** | 15K tokens | 2-5K tokens | Tokens per task |
| **Token Reduction** | 0% | 70% | 1 - (actual / 15K) |
| **Context Hit Rate** | N/A | >90% | Used / Included |
| **Task Success Rate** | Baseline | No degradation | Success / Total |
| **Compression Ratio** | N/A | 50% | Compressed / Original |

---

## Documentation Structure

This documentation is organized into:

1. **README.md** (this file) - Overview and quick reference
2. **token-optimization.md** - Token reduction strategies and patterns
3. **relevance-filtering.md** - Semantic filtering and relevance scoring
4. **adaptive-windows.md** - Dynamic context window sizing
5. **examples.md** - Real before/after examples with metrics

---

## How It Works (High Level)

```typescript
// Step 1: Analyze task complexity
const complexity = analyzeTask(userMessage);  // "simple" | "standard" | "complex"

// Step 2: Determine context window size
const windowSize = {
  simple: 5,    // Last 5 messages (~1K tokens)
  standard: 10, // Last 10 messages (~2K tokens)
  complex: 20   // Last 20 messages (~5K tokens)
}[complexity];

// Step 3: Filter by relevance
const conversationHistory = getFullHistory();  // All messages
const relevantMessages = await filterByRelevance(
  conversationHistory,
  userMessage,
  threshold: 0.40  // Semantic similarity
);

// Step 4: Apply window size
const contextWindow = relevantMessages.slice(-windowSize);

// Step 5: Handle overflow (if >10K tokens)
if (estimateTokens(contextWindow) > 10000) {
  const summarized = await handleOverflow(contextWindow);
  contextWindow = summarized;  // 50% reduction
}

// Step 6: Add file references (not full content)
const fileRefs = extractFileReferences(contextWindow);
const optimizedContext = replaceFilesWithReferences(contextWindow, fileRefs);

// Result: 2-5K tokens (vs 15K) with >90% relevance
```

---

## Integration with Claude Code

**Automatic Application**:
- Context management applies automatically when you load the patterns
- No need to manually invoke - it's built into the workflow
- Works seamlessly with orchestrator and other skills

**Manual Control**:
- User can request "include file X in context" explicitly
- User can force new topic with `/new-topic` command
- User can check context stats with `/context-stats` (future)

---

## Related Documentation

- **Anti-Hallucination** - Validation patterns (prevents false claims)
- **Parallelization** - Parallel tool execution (3-10x speedup)
- **Performance** - Benchmarking and optimization strategies

---

**Version**: 1.0.0
**Module**: 08-CONTEXT-MANAGEMENT
**Status**: Ready for implementation
**Estimated Impact**: 70% token reduction, 5-10x cost savings
