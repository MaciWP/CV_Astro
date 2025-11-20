# Tool Optimization - Complete Guide

**Achieve 3-5x performance improvements: parallel execution + native tools + MCP servers + structured prompts.**

**Version**: 2.0.0
**Last Updated**: 2025-01-18
**Token Size**: ~8K tokens

---

## Overview

This reference provides complete tool optimization guidance:

1. **Performance Fundamentals** - 80/20 rule, key metrics, performance equation
2. **Parallel Tool Execution** - 3-5x speedup with concurrent operations
3. **Native Tools Priority** - Read/Grep/Glob/Edit > Bash (13x faster)
4. **MCP Server Strategy** - 2-10x speedup with structured data
5. **File Operations Workflow** - Grep → Read → Edit pattern

**Use when**: Optimizing workflows for speed, need tool selection guidance, or implementing parallelization strategies.

---

## Part 1: Performance Fundamentals

### The 80/20 Rule

**80% of gains come from 20% of techniques.**

**Top 5 High-Impact Optimizations** (implement these first):

| Optimization | Speedup | Effort | ROI | Priority |
|--------------|---------|--------|-----|----------|
| **1. Parallel tool execution** | 3-5x | 5 min | Very High | 🔴 Critical |
| **2. Native tools > Bash** | 13x (file ops) | 2 min | Very High | 🔴 Critical |
| **3. Structured XML prompts** | 5x fewer iterations | 10 min | High | 🟠 High |
| **4. MCP servers for docs** | 100x (cached) | 15 min | High | 🟠 High |
| **5. Grep→Read→Edit workflow** | 6-10x tokens | 5 min | High | 🟠 High |

**Implement these 5 → 80% of total performance gain**

---

### Performance Equation

```
Total Time = Discovery + Analysis + Execution + Verification

Optimized:
- Discovery: Use Grep (not manual search) → 8x faster
- Analysis: Parallel reads (not sequential) → 5x faster
- Execution: Batch operations (not one-by-one) → 3x faster
- Verification: Targeted checks (not full re-analysis) → 4x faster

Result: 3-5x speedup across all phases
```

---

### Key Performance Metrics

| Metric | Definition | Target | Current Baseline |
|--------|-----------|--------|------------------|
| **Time to First Response** | From prompt to initial answer | <5 seconds | 3 seconds (optimal) |
| **Iterations to Success** | Number of back-and-forth cycles | 1-2 | 1.5 (optimal) |
| **Token Efficiency** | Useful tokens / Total tokens | >80% | 85% (optimal) |
| **Cache Hit Rate** | Cached content / Total content | >70% | 75% (optimal) |
| **Parallelism Factor** | Concurrent operations speedup | 3-10x | 5x (typical) |

---

## Part 2: Parallel Tool Execution

### Understanding Parallelism

Claude Code supports **true parallel execution** of independent tool calls within a single message.

**Speedup formula**: `Speedup = min(N, Parallelism_Limit)` where N = number of independent operations

**Example**:
- Sequential: Read 5 files = 3s × 5 = 15 seconds
- Parallel: Read 5 files = max(3s) = 3 seconds
- **Speedup: 5x**

---

### Parallelization Patterns

#### Pattern 1: Parallel File Reading

**When**: Need to analyze multiple files simultaneously.

❌ **Sequential (Slow)**:
```
Read('file1.ts') → wait → Read('file2.ts') → wait → Read('file3.ts')
Total: 9 seconds (3s × 3 files)
```

✅ **Parallel (Fast)**:
```
[Read('file1.ts'), Read('file2.ts'), Read('file3.ts')]
Total: 3 seconds (all execute simultaneously)
Speedup: 3x
```

---

#### Pattern 2: Glob + Parallel Read

**When**: Find files by pattern, then analyze all.

✅ **Optimized**:
```
Step 1: Glob('**/*_strategy.dart')
→ Returns: [file1.dart, file2.dart, file3.dart, file4.dart]

Step 2 (Parallel): [Read(file1), Read(file2), Read(file3), Read(file4)]
→ All files read simultaneously

Step 3: Analyze all results together

Time: 2s (Glob) + 2s (parallel Read) = 4 seconds
vs Sequential: 2s (Glob) + 12s (4 × 3s) = 14 seconds
Speedup: 3.5x
```

---

#### Pattern 3: Parallel Grep for Multiple Patterns

**When**: Search for multiple patterns across codebase.

✅ **Optimized**:
```
[Parallel execution]:
- Grep('TODO', glob='**/*.dart', output_mode='content')
- Grep('FIXME', glob='**/*.dart', output_mode='content')
- Grep('HACK', glob='**/*.dart', output_mode='content')

Time: 5 seconds (all 3 greps parallel)
vs Sequential: 15 seconds
Speedup: 3x
```

---

### Parallelization Checklist

**Before executing, verify:**

✅ **Independence Check**:
- [ ] Do operations need results from each other?
- [ ] Can they execute in any order?
- [ ] Will results be combined after all complete?

**If all YES**: Execute in parallel

✅ **Resource Check**:
- [ ] Are operations IO-bound (file reads, network)?
- [ ] Or CPU-bound (heavy computation)?

**Note**: IO-bound operations parallelize better (5-10x speedup)

✅ **Correctness Check**:
- [ ] No race conditions?
- [ ] No shared mutable state?
- [ ] Order-independent results?

**If all YES**: Safe to parallelize

---

### Anti-Patterns to Avoid

❌ **False Sequential Dependencies**:
```
Bad: "Read database_service.dart to understand pattern,
      then read ml_service.dart to see if it follows same pattern"
[Sequential: Read A → wait → Read B]

Good: "Read database_service.dart and ml_service.dart simultaneously,
       then compare patterns"
[Parallel: Read A + Read B simultaneously → compare]
```

❌ **Over-Sequentializing**:
```
Bad:
Read file1 → wait
Read file2 → wait
Read file3 → wait
Analyze all three

Good:
Read file1, file2, file3 simultaneously → Analyze all
```

❌ **Parallelizing Dependent Operations**:
```
Bad: [Read config.yaml, Use config values] in parallel
→ WRONG: second needs first's results

Good: Read config.yaml → wait → Use config values
→ Sequential because of data dependency
```

---

## Part 3: Native Tools Priority

### Tool Performance Comparison

| Operation | ❌ Bash | ✅ Native | Speedup | Reason |
|-----------|---------|-----------|---------|--------|
| **Read file** | `cat file.ts` | `Read('file.ts')` | **13x** | Optimized I/O, no shell overhead |
| **Search code** | `grep -r "pattern"` | `Grep('pattern', glob: '*.ts')` | **8x** | Indexed search, parallel execution |
| **Find files** | `find . -name "*.ts"` | `Glob('**/*.ts')` | **10x** | Cached filesystem traversal |
| **Edit file** | `sed -i 's/old/new/'` | `Edit('file', old, new)` | **15x** | Direct file manipulation, no parsing |

**Why native tools are faster**:
1. No shell overhead
2. Optimized I/O operations
3. Built-in caching
4. Parallel execution support
5. Direct file system access

---

### Tool Selection Decision Tree

```
Need to perform operation
    ↓
Is it a file operation?
    YES → Is it reading?
        YES → Use Read (not cat/head/tail)
        NO → Is it searching?
            YES → Use Grep (not grep/rg)
            NO → Is it finding files?
                YES → Use Glob (not find/ls)
                NO → Is it editing?
                    YES → Use Edit (not sed/awk)
                    NO → Is it writing?
                        YES → Use Write (not echo/cat)
                        NO → Use Bash for terminal operations
    NO → Is it git operation?
        YES → Use mcp__git__* (faster)
        NO → Use Bash
```

---

### Native Tool Patterns

#### Pattern 1: Read with Offset/Limit

**When**: Large files (>500 lines), need specific section.

❌ **Inefficient**:
```
Read('large_file.ts')  # Reads entire 2000-line file
→ 50K tokens loaded
```

✅ **Efficient**:
```
Read('large_file.ts', offset=100, limit=50)  # Reads lines 100-150 only
→ 1.2K tokens loaded
Savings: 40x token reduction
```

---

#### Pattern 2: Grep with Output Modes

**When**: Finding files vs analyzing content.

❌ **Inefficient** (for file discovery):
```
Grep('TODO', output_mode='content')  # Returns all matching lines
→ 10K tokens of content
```

✅ **Efficient** (for file discovery):
```
Grep('TODO', output_mode='files_with_matches')  # Returns only file paths
→ 200 tokens (file paths only)
Savings: 50x token reduction
```

---

#### Pattern 3: Glob with Targeted Patterns

**When**: Finding specific file types/locations.

❌ **Inefficient**:
```
Bash('find . -name "*.ts" | grep service')
→ Shell overhead + text processing
```

✅ **Efficient**:
```
Glob('**/*service*.ts')  # Direct pattern matching
→ No shell overhead, 10x faster
```

---

## Part 4: MCP Server Strategy

### MCP Performance Benefits

| MCP Server | Operation | Native Time | MCP Time | Speedup | Benefit |
|------------|-----------|-------------|----------|---------|---------|
| `mcp__git__*` | Git status | 100ms | 30ms | **3x** | Structured data |
| `mcp__fetch__*` | Docs (cached) | 3s | 300ms | **10x** | Cached, LLM-optimized |
| `mcp__fetch__*` | Docs (first) | 3s | 2-4s | ~1x | First-time similar |
| `mcp__memory__*` | Pattern storage | 200ms | 20ms | **10x** | Direct API |
| `mcp__context7__*` | File operations | Variable | 2x | **2x** | Structured, cached |

**Key advantage**: Structured data + caching (not just raw speed)

---

### When to Use MCPs

| Scenario | Use MCP | Why |
|----------|---------|-----|
| **Git operations** | `mcp__git__status` | 3x faster, structured output |
| **Documentation access** | `mcp__fetch__*` | 10x faster when cached, LLM-optimized summaries |
| **Cross-session learning** | `mcp__memory__*` | 10x faster, persistent storage |
| **File operations** | `mcp__context7__*` | 2x faster, caching benefits |

❌ **Don't use MCP when**: Native tools suffice (Read, Grep, Glob, Edit already optimal)

---

## Part 5: File Operations Workflow

### Grep → Read → Edit Pattern

**The golden workflow for file modifications.**

#### Step 1: Grep (Discovery)

**Goal**: Find files matching criteria.

```
Grep('pattern', glob='**/*.ts', output_mode='files_with_matches')
→ Returns: [file1.ts, file2.ts, file3.ts]
```

---

#### Step 2: Read (Analysis)

**Goal**: Analyze relevant files (parallel).

```
[Parallel execution]:
- Read('file1.ts')
- Read('file2.ts')
- Read('file3.ts')

→ All files read simultaneously
```

---

#### Step 3: Edit (Modification)

**Goal**: Apply changes (sequential - file writes must be sequential).

```
Edit('file1.ts', old='old_pattern', new='new_pattern')
Edit('file2.ts', old='old_pattern', new='new_pattern')
Edit('file3.ts', old='old_pattern', new='new_pattern')
```

---

### Complete Example

**Task**: "Replace all print() with LoggingService.debug() in 5 services"

✅ **Optimized Workflow**:
```
Step 1: Grep to find files (1 second)
Grep('print\\(', glob='lib/services/*.dart', output_mode='files')
→ Found: [database_service.dart, ml_service.dart, user_service.dart,
         freemium_service.dart, history_service.dart]

Step 2: Parallel read relevant sections (3 seconds)
[Parallel execution]:
- Read('lib/services/database_service.dart')
- Read('lib/services/ml_service.dart')
- Read('lib/services/user_service.dart')
- Read('lib/services/freemium_service.dart')
- Read('lib/services/history_service.dart')

Step 3: Sequential edits (10 seconds)
Edit('database_service.dart', old="print('...')", new="LoggingService.debug('DatabaseService', ...)")
Edit('ml_service.dart', old="print('...')", new="LoggingService.debug('MLService', ...)")
[3 more edits...]

Total: 1s + 3s + 10s = 14 seconds
vs Sequential: 1s + 15s (reads) + 10s (edits) = 26 seconds
Speedup: 1.9x
```

---

## Part 6: Advanced Optimization Techniques

### 1. Session Continuity (3x Speedup via Caching)

**Technique**: Keep context open, reference previous reads.

❌ **Inefficient**:
```
Message 1: Read('config.yaml')
Message 2: Read('config.yaml') again  # Wasteful re-read
```

✅ **Efficient**:
```
Message 1: Read('config.yaml')
Message 2: "Based on config.yaml read earlier..."  # No re-read
```

**Savings**: 50% token reduction, 3x faster

---

### 2. Progressive Disclosure (20-50x Token Reduction)

**Technique**: Load summaries first, details on-demand.

❌ **Inefficient**:
```
Read entire 5000-line file → 125K tokens
```

✅ **Efficient**:
```
Step 1: Read file structure (classes, functions) → 2K tokens
Step 2: User asks about specific function
Step 3: Read(file, offset=X, limit=Y) → 1K tokens
Total: 3K tokens
Savings: 40x token reduction
```

---

### 3. Structured Prompts (5x Fewer Iterations)

**Technique**: Use XML tags for clarity.

❌ **Inefficient** (Vague):
```
"Fix the slow query"
→ 5 back-and-forth iterations to clarify
Total time: 15 minutes
```

✅ **Efficient** (Structured):
```xml
<task>Optimize PostgreSQL query in UserService.getActiveUsers()</task>
<target><100ms for 10K users</target>
<constraints>Maintain result ordering</constraints>
```
→ 1 iteration, direct implementation
Total time: 3 minutes
**Speedup: 5x**

---

## Quick Reference

### Performance Optimization Checklist

✅ **Before execution**:
- [ ] Can operations be parallelized? (Check dependencies)
- [ ] Using native tools instead of Bash? (Read/Grep/Glob/Edit)
- [ ] Prompt structured with XML tags?
- [ ] Using MCPs where beneficial? (Git, docs, memory)
- [ ] Following Grep→Read→Edit pattern?
- [ ] Using offset/limit for large files?
- [ ] Output mode optimized? (files_with_matches vs content)

✅ **During execution**:
- [ ] TodoWrite tracking active?
- [ ] Parallel execution applied where possible?
- [ ] No re-reading already-loaded files?

✅ **After execution**:
- [ ] Measure speedup achieved
- [ ] Record metrics for learning
- [ ] Propose optimization improvements

---

### Common Anti-Patterns

| Anti-Pattern | Why Bad | Fix |
|--------------|---------|-----|
| **Sequential file reads** | 5x slower | Parallelize: `[Read(f1), Read(f2), Read(f3)]` |
| **Using Bash for file ops** | 13x slower | Use Read/Grep/Glob/Edit |
| **Reading entire large files** | 40x more tokens | Use offset/limit |
| **output_mode='content' for discovery** | 50x more tokens | Use output_mode='files_with_matches' |
| **Re-reading cached files** | 3x slower | Reference previous reads |
| **Vague prompts** | 5x more iterations | Use XML structure |
| **Not using MCPs** | 10x slower (for docs) | Use mcp__fetch__* for docs |

---

## Best Practices

### DO ✅

- Parallelize all independent operations (3-5x speedup)
- Use native tools over Bash (13x faster for file ops)
- Apply Grep→Read→Edit pattern for file modifications
- Use XML tags for structured prompts (5x fewer iterations)
- Use offset/limit for large files (40x token savings)
- Use output_mode='files_with_matches' for discovery (50x token savings)
- Reference previous reads to avoid re-loading (3x faster)
- Use MCPs for git/docs/memory operations (2-10x faster)
- Track operations with TodoWrite
- Measure and record speedups achieved

### DON'T ❌

- Read files sequentially when they're independent
- Use Bash for file operations (cat, grep, find, sed)
- Read entire large files when excerpts suffice
- Use output_mode='content' when you only need file paths
- Re-read files already in context
- Skip XML structure in prompts
- Ignore parallelization opportunities
- Forget to measure performance improvements

---

## Quick Reference

**When to load this reference**:
- Optimizing workflow performance
- Need tool selection guidance (native vs Bash vs MCP)
- Implementing parallelization strategies
- Reducing token usage
- Improving response time

**Integration with SKILL.md**:
- SKILL.md provides native tools priority table
- This reference provides complete optimization guide + patterns + workflows
- Load this when implementing performance improvements or optimizing complex workflows

---

**Last Updated**: 2025-01-18
**Source Documents**: claude_code_optimization_guide.md (1,283 lines), tool_usage_patterns_guide.md (1,200 lines)
**Consolidated Size**: ~2,483 lines → ~1,000 lines → ~8K tokens
**Optimization**: Focused on 80/20 rule, eliminated duplication, added decision trees and checklists