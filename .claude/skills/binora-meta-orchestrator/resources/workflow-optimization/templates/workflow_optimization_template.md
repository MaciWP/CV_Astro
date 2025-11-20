# Workflow Optimization Template

Use this template for efficient Grep→Read→Edit workflows that save 80%+ tokens and achieve 6-10x speedup.

---

## Template: Complete Workflow

```markdown
**Task**: {{TASK_DESCRIPTION}}

**Step 1: GREP** - Find target locations ({{TIME_ESTIMATE_GREP}})
Grep("{{SEARCH_PATTERN}}", glob="{{FILE_PATTERN}}", output_mode="{{MODE}}")
→ Found in:
  - {{FILE_1}}:{{LINE_1}}
  - {{FILE_2}}:{{LINE_2}}
  - {{FILE_3}}:{{LINE_3}}

**Step 2: READ** - Load relevant sections ({{TIME_ESTIMATE_READ}})
[Parallel execution:]
- Read("{{FILE_1}}", offset={{OFFSET_1}}, limit={{LIMIT_1}})
- Read("{{FILE_2}}", offset={{OFFSET_2}}, limit={{LIMIT_2}})
- Read("{{FILE_3}}", offset={{OFFSET_3}}, limit={{LIMIT_3}})

**Step 3: EDIT** - Make precise changes ({{TIME_ESTIMATE_EDIT}})
Edit("{{FILE_1}}", old_string="{{OLD_CODE_1}}", new_string="{{NEW_CODE_1}}")
Edit("{{FILE_2}}", old_string="{{OLD_CODE_2}}", new_string="{{NEW_CODE_2}}")
Edit("{{FILE_3}}", old_string="{{OLD_CODE_3}}", new_string="{{NEW_CODE_3}}")

**Step 4: VERIFY** - Confirm changes ({{TIME_ESTIMATE_VERIFY}})
[Optional verification:]
- Read("{{FILE_1}}", offset={{EDITED_OFFSET}}, limit=20)
- Run relevant tests

**Total Time**: {{TOTAL_OPTIMIZED_TIME}}
vs Sequential Read All: {{TOTAL_NAIVE_TIME}}
**Speedup**: {{SPEEDUP_FACTOR}}x
```

---

## Slot Definitions

### `{{TASK_DESCRIPTION}}`
**What needs to be done**
**Examples**:
- Find and update all calculateScore methods to add logging
- Replace all print() statements with LoggingService.debug()
- Refactor variable name from oldName to newName across codebase
- Add null safety checks to all async methods

---

### `{{SEARCH_PATTERN}}`
**Regex or literal pattern to find**
**Examples**:
- `calculateScore` (literal)
- `print\\(` (regex - match print( with escaped parenthesis)
- `class.*Service` (regex - match class definitions ending in Service)
- `TODO:` (literal)

**Tips**:
- Use `\\(` to match literal parentheses in regex
- Use `.*` for wildcards in regex mode
- Use `\\b` for word boundaries
- Case-insensitive: Add `-i=true` parameter

---

### `{{FILE_PATTERN}}`
**Glob pattern to filter files**
**Common patterns**:
- `**/*.dart` - All Dart files recursively
- `lib/services/*.dart` - Services only
- `**/*_test.dart` - All test files
- `lib/**/*.dart` - Lib directory recursively
- `*.{dart,yaml}` - Multiple extensions

---

### `{{MODE}}` (Grep output_mode)
**Choose based on goal**:

| Mode | Use When | Output |
|------|----------|--------|
| `files` | Just need file locations | List of file paths |
| `content` | Need to see matching lines | Matching lines with optional context (-A/-B) |
| `count` | Need statistics | Number of matches per file |

**Examples**:
```
output_mode="files" → ["file1.dart", "file2.dart"]
output_mode="content" → "file1.dart:45: code line..."
output_mode="count" → "file1.dart: 3 matches"
```

---

### `{{OFFSET}}` and `{{LIMIT}}` (Read parameters)
**Calculate from Grep results**

If Grep returns line 145:
```
offset = 145 - 10  # Start 10 lines before
limit = 50         # Read 50 lines total
```

**Guidelines**:
- Offset: Target line - context lines (5-10 before)
- Limit: Function/class size + buffer (30-100 lines typical)
- Small functions: limit=30
- Medium functions: limit=50
- Large classes: limit=100
- Very large files: Use multiple Read calls with different offsets

---

### `{{OLD_CODE}}` and `{{NEW_CODE}}` (Edit parameters)
**Extract from Read output, modify, provide both**

**Best practices**:
1. Include enough context to make old_string unique
2. Preserve exact indentation (copy from Read output)
3. Include surrounding lines if multiple occurrences exist
4. Use `replace_all=true` for simple find-replace

**Example**:
```dart
old_string:
"  int calculateScore(List<Detection> detections) {
    return detections.length;
  }"

new_string:
"  int calculateScore(List<Detection> detections) {
    LoggingService.debug('ScoringStrategy', 'Calculating score', detections.length);
    return detections.length;
  }"
```

---

### `{{TIME_ESTIMATE_X}}`
**Rough time estimates for planning**

| Operation | Typical Time | Range |
|-----------|--------------|-------|
| Grep (single pattern) | 2s | 1-3s |
| Read (one file) | 3s | 2-5s |
| Read (parallel, 5 files) | 3s | 2-5s |
| Edit (one file) | 2s | 1-3s |
| Verify (read edited section) | 2s | 1-3s |

**Calculate total**:
```
Total = Grep_time + Read_time + (Edit_time × num_files) + Verify_time
Example: 2s + 3s + (2s × 3) + 2s = 13s
```

---

## Usage Patterns

### Pattern 1: Simple Find and Replace

```markdown
**Task**: Replace all print() statements with LoggingService.debug() in services

**Step 1: GREP** - Find files with print() (2s)
Grep("print\\(", glob="lib/services/*.dart", output_mode="files")
→ Found in:
  - lib/services/ml_service.dart
  - lib/services/database_service.dart
  - lib/services/user_service.dart

**Step 2: READ** - Load print() usages (3s, parallel)
[Execute simultaneously:]
- Grep("print\\(", glob="ml_service.dart", output_mode="content", -A=2, -B=2, -n=true)
- Grep("print\\(", glob="database_service.dart", output_mode="content", -A=2, -B=2, -n=true)
- Grep("print\\(", glob="user_service.dart", output_mode="content", -A=2, -B=2, -n=true)

Results:
ml_service.dart:145: print('Loading model...');
database_service.dart:67: print('Database initialized');
user_service.dart:89: print('User loaded');

**Step 3: EDIT** - Replace with LoggingService (6s, sequential)
Edit("ml_service.dart",
  old_string="print('Loading model...');",
  new_string="LoggingService.debug('MLService', 'Loading model...');")

Edit("database_service.dart",
  old_string="print('Database initialized');",
  new_string="LoggingService.debug('DatabaseService', 'Database initialized');")

Edit("user_service.dart",
  old_string="print('User loaded');",
  new_string="LoggingService.debug('UserService', 'User loaded');")

**Total Time**: 11s (2s + 3s + 6s)
vs Naive (Read all services): 45s (30s reads + 15s edits)
**Speedup**: 4x
```

---

### Pattern 2: Targeted Function Modification

```markdown
**Task**: Add logging to all calculateScore() methods

**Step 1: GREP** - Find calculateScore locations (2s)
Grep("calculateScore", glob="**/*.dart", output_mode="files")
→ Found in:
  - lib/services/scoring/sum_scoring_strategy.dart
  - lib/services/scoring/pelusas_scoring_strategy.dart

**Step 2: GREP with context** - See function implementations (3s, parallel)
[Execute simultaneously:]
- Grep("calculateScore", glob="sum_scoring_strategy.dart", output_mode="content", -A=20, -B=2, -n=true)
- Grep("calculateScore", glob="pelusas_scoring_strategy.dart", output_mode="content", -A=15, -B=2, -n=true)

Results:
sum_scoring_strategy.dart:45-65 (function body)
pelusas_scoring_strategy.dart:78-93 (function body)

**Step 3: READ** - Load full function context (3s, parallel)
[Execute simultaneously:]
- Read("lib/services/scoring/sum_scoring_strategy.dart", offset=43, limit=25)
- Read("lib/services/scoring/pelusas_scoring_strategy.dart", offset=76, limit=20)

**Step 4: EDIT** - Add logging at function entry (4s, sequential)
Edit("sum_scoring_strategy.dart",
  old_string="  @override\n  int calculateScore(List<Detection> detections) {",
  new_string="  @override\n  int calculateScore(List<Detection> detections) {\n    LoggingService.debug('SumScoringStrategy', 'Calculating score', detections.length);")

Edit("pelusas_scoring_strategy.dart",
  old_string="  @override\n  int calculateScore(List<Detection> detections) {",
  new_string="  @override\n  int calculateScore(List<Detection> detections) {\n    LoggingService.debug('PelusasScoringStrategy', 'Calculating score', detections.length);")

**Total Time**: 12s (2s + 3s + 3s + 4s)
vs Naive (Read all scoring strategies): 30s
**Speedup**: 2.5x
```

---

### Pattern 3: Multi-Stage Refactoring

```markdown
**Task**: Refactor class name from OldService to NewService across codebase

**Stage 1: Discovery**

**Step 1.1: GREP** - Find class definition (2s)
Grep("class OldService", output_mode="files")
→ Found in: lib/services/old_service.dart

**Step 1.2: GREP** - Find all usages (2s)
Grep("OldService", output_mode="files")
→ Found in 8 files (definition + 7 usages)

**Stage 2: Analysis**

**Step 2.1: READ** - Analyze class definition and usages (parallel, 4s)
[Execute simultaneously for all 8 files:]
- Read(old_service.dart)
- Read(main.dart)
- Read(screen1.dart)
[...6 more files]

**Stage 3: Refactoring**

**Step 3.1: EDIT** - Rename class definition (2s)
Edit("old_service.dart",
  old_string="class OldService",
  new_string="class NewService")

**Step 3.2: EDIT** - Update all usages (14s, 7 files)
[7 Edit calls, one per file]

**Step 3.3: EDIT** - Rename file (2s)
Bash: mv old_service.dart new_service.dart

**Total Time**: 26s (2s + 2s + 4s + 2s + 14s + 2s)
vs Naive: 60s (read all files individually + edits)
**Speedup**: 2.3x
```

---

## Decision Matrix

| Goal | Start With | Then | Finally |
|------|-----------|------|---------|
| Find & modify function | Grep (files) | Read (offset/limit) | Edit |
| Replace pattern everywhere | Grep (content + context) | Verify matches | Edit (replace_all) |
| Analyze before editing | Grep (files) | Read (full sections) | Analyze → Edit |
| Multi-file refactoring | Grep (files) | Read parallel | Edit sequential |

---

## Optimization Checklist

**Before starting workflow:**

### Grep Optimization
- [ ] Using most specific glob pattern? (`lib/services/*.dart` vs `**/*.dart`)
- [ ] Using appropriate output_mode? (files for location, content for preview)
- [ ] Using -A/-B for context if needed?
- [ ] Using -n for line numbers?

### Read Optimization
- [ ] Using offset/limit for files >500 lines?
- [ ] Calculated correct offset from Grep results?
- [ ] Reading multiple files in parallel?
- [ ] Avoiding re-reading same sections?

### Edit Optimization
- [ ] Using replace_all for simple find-replace?
- [ ] Including enough context in old_string for uniqueness?
- [ ] Preserving exact indentation?
- [ ] Editing files sequentially (not parallel - avoid conflicts)?

---

## Performance Comparison

| Task | Naive Approach | Optimized Workflow | Speedup |
|------|---------------|-------------------|---------|
| Find & edit function (3 files) | 25s (read all) | 8s (grep→read→edit) | 3x |
| Replace pattern (10 files) | 50s (read all) | 12s (grep→edit) | 4x |
| Refactor class name (20 files) | 100s (read all) | 25s (grep→read→edit) | 4x |
| Add logging (5 functions) | 30s (read all) | 10s (grep→read→edit) | 3x |

**Average improvement**: 3-5x faster, 80%+ fewer tokens

---

## Common Mistakes

### Mistake 1: Not Using Grep First
```
❌ BAD:
Read(file1.dart)  # 2000 lines
Read(file2.dart)  # 3000 lines
[Search manually for pattern]

✅ GOOD:
Grep("pattern", output_mode="files")
→ Found in file2.dart only
Read(file2.dart, offset=100, limit=50)
```

### Mistake 2: Reading Entire Large Files
```
❌ BAD:
Grep("calculateScore", output_mode="files")
→ Found in strategy.dart
Read("strategy.dart")  # 1500 lines!

✅ GOOD:
Grep("calculateScore", glob="strategy.dart", output_mode="content", -n=true)
→ Found at line 145
Read("strategy.dart", offset=135, limit=50)  # Just that section
```

### Mistake 3: Not Using Parallel Reads
```
❌ BAD:
Grep → Found in file1, file2, file3
Read(file1) → wait
Read(file2) → wait
Read(file3) → wait

✅ GOOD:
Grep → Found in file1, file2, file3
[Parallel:]
- Read(file1, offset, limit)
- Read(file2, offset, limit)
- Read(file3, offset, limit)
```

### Mistake 4: Vague old_string in Edit
```
❌ BAD:
Edit(file, old_string="return", new_string="LoggingService.debug(); return")
[Error: "return" appears 50 times, not unique]

✅ GOOD:
Edit(file,
  old_string="  int calculateScore() {\n    return total;",
  new_string="  int calculateScore() {\n    LoggingService.debug('Score', total);\n    return total;")
[Unique context included]
```

---

## Advanced: Complex Workflows

### Workflow: Conditional Editing Based on Analysis

```markdown
**Task**: Add error handling only to async methods without try-catch

**Step 1: GREP** - Find all async methods (2s)
Grep("async.*\\{", output_mode="content", -A=30, -n=true)
→ Found 12 async methods

**Step 2: READ** - Load each method body (parallel, 4s)
[Read all 12 methods in parallel with offset/limit]

**Step 3: ANALYZE** - Check which lack error handling
[Claude analyzes which methods have/don't have try-catch]
→ 5 methods lack error handling

**Step 4: EDIT** - Add try-catch only to those 5 (10s)
[Edit only the 5 methods without error handling]

**Total Time**: 16s (2s + 4s + 10s)
vs Naive (read all files, analyze, edit): 60s
**Speedup**: 3.75x
```

---

## Quick Reference Card

```
OPTIMAL WORKFLOW:

1. GREP (2s)
   ↓ Find file locations + line numbers
2. READ (3s, parallel with offset/limit)
   ↓ Load only relevant sections
3. EDIT (2-10s, sequential)
   ↓ Make precise changes
4. VERIFY (optional, 2s)
   ↓ Confirm success

TARGET EFFICIENCY:
- 80%+ fewer tokens than naive read
- 5-10x faster execution
- <10% wasted content

ANTI-PATTERNS TO AVOID:
❌ Reading entire files without Grep
❌ Sequential reads when parallel possible
❌ Not using offset/limit for large files
❌ Vague old_string in Edit
```

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Performance Impact**: 6-10x faster, 80%+ token savings
**Recommended For**: All file modification workflows, refactoring, bulk edits