# Parallel Execution Template

Use this template to structure parallel tool calls for 3-10x performance improvements.

---

## Template: Parallel File Reading

```
User: "Analyze {{FILE_LIST}} for {{PATTERN_OR_ISSUE}}"

Claude response (single message with parallel tool calls):

[Execute in parallel:]
- Read("{{FILE_1_PATH}}")
- Read("{{FILE_2_PATH}}")
- Read("{{FILE_3_PATH}}")
- Read("{{FILE_4_PATH}}")
- Read("{{FILE_5_PATH}}")

[All complete simultaneously, then analyze results]

Analysis:
{{CONSOLIDATED_ANALYSIS}}
```

---

## Slot Definitions

### `{{FILE_LIST}}`
**Format**: Comma-separated list of file paths
**Examples**:
- database_service.dart, ml_service.dart, user_service.dart
- lib/services/*.dart (if using Glob first)
- All service files in lib/services/

### `{{FILE_N_PATH}}`
**Format**: Absolute or relative file path
**Examples**:
- lib/services/database_service.dart
- test/services/ml_service_test.dart
- D:\PYTHON\EasyBoard\lib\models\database\board_game.dart

### `{{PATTERN_OR_ISSUE}}`
**What to look for in the files**
**Examples**:
- common dependency injection patterns
- calculateScore implementations
- error handling strategies
- uses of print() statements (for refactoring)

---

## Usage Patterns

### Pattern 1: Multi-File Analysis

```
Task: "Analyze database_service.dart, ml_service.dart, user_service.dart
       for common DI patterns"

Step 1: Identify files (already known)
Files: [database_service.dart, ml_service.dart, user_service.dart]

Step 2: Execute parallel reads (single message)
[Parallel execution:]
- Read("lib/services/database_service.dart")
- Read("lib/services/ml_service.dart")
- Read("lib/services/user_service.dart")

Step 3: Analyze all results together
Common patterns found:
1. Singleton pattern with late initialization
2. Constructor injection for dependencies
3. Result<T> error handling
[...]

Time: 3 seconds (vs 9 seconds sequential)
Speedup: 3x
```

---

### Pattern 2: Glob + Parallel Read

```
Task: "Find and analyze all *_strategy.dart files"

Step 1: Glob to find files
Glob("**/*_strategy.dart")
→ Returns:
  - lib/services/scoring/sum_scoring_strategy.dart
  - lib/services/scoring/counting_scoring_strategy.dart
  - lib/services/scoring/manual_scoring_strategy.dart
  - lib/services/scoring/pelusas_scoring_strategy.dart

Step 2: Parallel read all found files (single message)
[Parallel execution:]
- Read("lib/services/scoring/sum_scoring_strategy.dart")
- Read("lib/services/scoring/counting_scoring_strategy.dart")
- Read("lib/services/scoring/manual_scoring_strategy.dart")
- Read("lib/services/scoring/pelusas_scoring_strategy.dart")

Step 3: Analyze strategy pattern implementation
All strategies implement ScoringStrategy interface correctly ✓
[...]

Time: 4 seconds (2s Glob + 2s parallel Read)
vs Sequential: 18 seconds (2s Glob + 16s sequential reads)
Speedup: 4.5x
```

---

### Pattern 3: Parallel Grep for Multiple Patterns

```
Task: "Find all TODO, FIXME, and HACK comments in codebase"

Step 1: Parallel grep (single message)
[Parallel execution:]
- Grep("TODO", glob="**/*.dart", output_mode="content", -n=true)
- Grep("FIXME", glob="**/*.dart", output_mode="content", -n=true)
- Grep("HACK", glob="**/*.dart", output_mode="content", -n=true)

Step 2: Consolidate results
Found 23 TODOs, 5 FIXMEs, 2 HACKs

Summary by priority:
HIGH (FIXME): 5 items
MEDIUM (TODO): 23 items
LOW (HACK): 2 items
[...]

Time: 5 seconds (all 3 greps parallel)
vs Sequential: 15 seconds
Speedup: 3x
```

---

### Pattern 4: Cross-File Refactoring

```
Task: "Replace all print() with LoggingService.debug() in 5 services"

Step 1: Grep to find files with print()
Grep("print\\(", glob="lib/services/*.dart", output_mode="files")
→ Found in:
  - database_service.dart
  - ml_service.dart
  - user_service.dart
  - freemium_service.dart
  - history_service.dart

Step 2: Parallel read relevant sections (single message)
[Parallel execution:]
- Read("lib/services/database_service.dart")
- Read("lib/services/ml_service.dart")
- Read("lib/services/user_service.dart")
- Read("lib/services/freemium_service.dart")
- Read("lib/services/history_service.dart")

Step 3: Sequential edits (must be sequential - file writes)
Edit("database_service.dart", old="print('...')", new="LoggingService.debug('DatabaseService', ...)")
Edit("ml_service.dart", ...)
[3 more edits...]

Time: 3s (parallel read) + 10s (5 edits) = 13s
vs All Sequential: 15s (reads) + 10s (edits) = 25s
Speedup: 1.9x
```

---

## Decision Tree: Can I Parallelize?

```
┌─ Do operations have data dependencies? ─┐
│                                          │
│  NO (independent)                       YES (dependent)
│  ↓                                       ↓
│  ✅ PARALLELIZE                         ❌ SEQUENTIAL REQUIRED
│
│  Examples:                               Examples:
│  - Read multiple unrelated files        - Read then analyze then edit
│  - Grep different patterns              - Glob then read found files
│  - Search multiple directories          - Load model then run inference
│                                          - Parse config then use values
```

---

## Parallelization Checklist

**Before executing tool calls, verify:**

### Independence Check
- [ ] Do operations need results from each other?
- [ ] Can they execute in any order?
- [ ] Will results be combined after all complete?

**If all YES**: Execute in parallel

### Resource Check
- [ ] Are operations IO-bound (file reads, network)?
- [ ] Or CPU-bound (heavy computation)?

**Note**: IO-bound operations parallelize better (5-10x speedup)

### Correctness Check
- [ ] No race conditions?
- [ ] No shared mutable state?
- [ ] Order-independent results?

**If all YES**: Safe to parallelize

---

## Common Parallel Patterns

### Pattern: Parallel Read + Consolidated Analysis

```markdown
**Task**: {{ANALYSIS_TASK}}

**Step 1: Parallel read** (single message)
[Execute simultaneously:]
- Read({{FILE_1}})
- Read({{FILE_2}})
- Read({{FILE_3}})

**Step 2: Analyze** (after all reads complete)
{{ANALYSIS_RESULTS}}

Common patterns:
1. {{PATTERN_1}}
2. {{PATTERN_2}}

Differences:
- {{FILE_1}}: {{DIFFERENCE_1}}
- {{FILE_2}}: {{DIFFERENCE_2}}
```

---

### Pattern: Parallel Grep + Targeted Read

```markdown
**Task**: {{SEARCH_AND_ANALYZE}}

**Step 1: Parallel search** (single message)
[Execute simultaneously:]
- Grep({{PATTERN_1}}, output_mode="files")
- Grep({{PATTERN_2}}, output_mode="files")

**Step 2: Parallel read** (single message, based on Step 1 results)
[Execute simultaneously:]
- Read({{FOUND_FILE_1}}, offset={{LINE}}, limit={{COUNT}})
- Read({{FOUND_FILE_2}}, offset={{LINE}}, limit={{COUNT}})

**Step 3: Comparative analysis**
{{COMPARISON_RESULTS}}
```

---

### Pattern: Parallel Multi-Stage (Parallel within stages, sequential between)

```markdown
**Task**: {{MULTI_STAGE_TASK}}

**Stage 1: Discovery** (parallel within stage)
[Execute simultaneously:]
- Glob({{PATTERN_1}})
- Glob({{PATTERN_2}})

**Stage 2: Analysis** (parallel within stage, sequential after Stage 1)
[Execute simultaneously using Stage 1 results:]
- Read({{FOUND_FILES_FROM_PATTERN_1}})
- Read({{FOUND_FILES_FROM_PATTERN_2}})

**Stage 3: Synthesis** (sequential after Stage 2)
[Analyze all results together]
{{FINAL_ANALYSIS}}
```

---

## Performance Metrics

| Operations | Sequential Time | Parallel Time | Speedup |
|-----------|----------------|---------------|---------|
| 2 files | 6s | 3s | 2x |
| 3 files | 9s | 3s | 3x |
| 5 files | 15s | 3s | 5x |
| 10 files | 30s | 4s | 7.5x |
| 20 files | 60s | 5s | 12x |

**Note**: Speedup saturates around 8-10x due to practical parallelism limits.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: False Sequential Dependencies

```
❌ BAD (thinking there's a dependency):
"Read database_service.dart to understand pattern,
 then read ml_service.dart to see if it follows same pattern"

[Sequential: Read A → wait → Read B]

✅ GOOD (recognize independence):
"Read database_service.dart and ml_service.dart simultaneously,
 then compare patterns"

[Parallel: Read A + Read B simultaneously → compare]
```

### Anti-Pattern 2: Over-Sequentializing

```
❌ BAD:
Read file1 → wait
Read file2 → wait
Read file3 → wait
Analyze all three

✅ GOOD:
Read file1, file2, file3 simultaneously → Analyze all
```

### Anti-Pattern 3: Parallelizing Dependent Operations

```
❌ BAD (has dependencies):
Read config.yaml
Use config values in next operation
[Both in parallel - WRONG, second needs first's results]

✅ GOOD (respect dependencies):
Read config.yaml → wait → Use config values
[Sequential because of data dependency]
```

---

## Advanced: Mixed Parallel + Sequential

### Template: Hybrid Execution

```
**Stage 1**: Parallel discovery
[Parallel:]
- Glob({{PATTERN_1}})
- Glob({{PATTERN_2}})

↓ (wait for results)

**Stage 2**: Parallel read (depends on Stage 1)
[Parallel using Stage 1 results:]
- Read({{FILES_FROM_PATTERN_1}})
- Read({{FILES_FROM_PATTERN_2}})

↓ (wait for results)

**Stage 3**: Sequential analysis + edit (depends on Stage 2)
[Sequential because edits must not conflict:]
- Analyze all files
- Edit({{FILE_1}})
- Edit({{FILE_2}})
- Edit({{FILE_3}})
```

---

## Quick Reference

```
PARALLEL TEMPLATE:

Task: {{TASK_DESCRIPTION}}

Step 1: {{STAGE_NAME}} (parallel)
[Execute simultaneously:]
- {{TOOL_CALL_1}}
- {{TOOL_CALL_2}}
- {{TOOL_CALL_3}}
[...up to 10 operations]

Step 2: {{ANALYSIS}} (after Step 1 completes)
{{CONSOLIDATED_RESULTS}}

TIME SAVINGS:
Sequential: {{N}} × {{TIME_PER_OP}} = {{TOTAL_SEQUENTIAL}}
Parallel: max({{TIME_PER_OP}}) = {{TOTAL_PARALLEL}}
Speedup: {{N}}x
```

---

## Validation Questions

**Before sending parallel tool calls:**

1. **Can these execute simultaneously?**
   - [ ] No data dependencies?
   - [ ] No shared state?
   - [ ] Order-independent?

2. **Am I sending them in one message?**
   - [ ] All tool calls in single Claude response?
   - [ ] Not waiting for first to complete?

3. **Will results be combined after?**
   - [ ] Analysis happens after all complete?
   - [ ] No intermediate dependencies?

**If all checked**: ✅ Ready for parallel execution

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Performance Impact**: 3-10x speedup for multi-file operations
**Recommended For**: Any task involving 2+ independent operations