# Tool Usage Patterns Guide

Deep dive into Claude Code tool selection, usage patterns, and optimization strategies for maximum performance.

**Version**: 1.0.0
**Last Updated**: 2025-10-20
**Target Audience**: Intermediate to advanced Claude Code users
**Reading Time**: 40 minutes

---

## Table of Contents

1. [Tool Taxonomy](#tool-taxonomy)
2. [Read Tool Patterns](#read-tool-patterns)
3. [Grep Tool Patterns](#grep-tool-patterns)
4. [Glob Tool Patterns](#glob-tool-patterns)
5. [Edit Tool Patterns](#edit-tool-patterns)
6. [Bash Tool Patterns](#bash-tool-patterns)
7. [MCP Tool Patterns](#mcp-tool-patterns)
8. [Tool Combination Strategies](#tool-combination-strategies)
9. [Performance Optimization](#performance-optimization)
10. [Decision Trees](#decision-trees)

---

## Tool Taxonomy

### Core File Tools

| Tool | Purpose | Speed | Best For |
|------|---------|-------|----------|
| **Read** | Load file content | Fast (1-3s) | Known file, targeted reading |
| **Write** | Create/overwrite file | Fast (1-2s) | New files, complete rewrites |
| **Edit** | Modify existing content | Fast (1-3s) | Precise changes, find-replace |
| **Grep** | Search content patterns | Very Fast (1-2s) | Finding locations, pattern matching |
| **Glob** | Find files by pattern | Very Fast (1s) | File discovery, directory scanning |
| **Bash** | Execute shell commands | Variable | Complex operations, builds, tests |

### MCP Servers (External Specialists)

| MCP Server | Domain | Speed | Best For |
|-----------|--------|-------|----------|
| **Context7** | Documentation | Instant (3s) | Library docs, API references |
| **Filesystem** | File operations | Fast (1-2s) | Advanced file operations |
| **Git** | Version control | Fast (3-5s) | Commit history, semantic git |
| **Jupyter** | Python execution | Fast (10s) | Interactive Python, ML testing |

---

## Read Tool Patterns

### Pattern 1: Full File Read

**Use case**: Small files (<200 lines), complete context needed

**Syntax**:
```dart
Read("path/to/file.ext")
```

**Performance**:
- Time: 2-3 seconds
- Tokens: ~50 tokens per 100 lines
- Efficiency: 100% (all content needed)

**When to use**:
✅ Configuration files (YAML, JSON)
✅ Small utility files
✅ README files
✅ Files <200 lines

**When NOT to use**:
❌ Large files (>500 lines)
❌ Generated files (database.g.dart)
❌ When searching for specific section

**Example**:
```
Task: Read app configuration

Read("lib/config/app_config.dart")  # 150 lines total
→ Returns: Complete file content

Time: 2 seconds
Tokens used: 75 tokens
Efficiency: 100% (all content useful)
```

---

### Pattern 2: Partial File Read (offset/limit)

**Use case**: Large files, targeted section known

**Syntax**:
```dart
Read("path/to/file.ext", offset=100, limit=50)
// Reads lines 100-150
```

**Parameters**:
- **offset**: Starting line number (0-indexed)
- **limit**: Number of lines to read

**Performance**:
- Time: 1-2 seconds (faster than full read)
- Tokens: Only requested section
- Efficiency: 80-95% (minimal wasted content)

**When to use**:
✅ Large files (>500 lines)
✅ Generated files
✅ Known target section (from Grep)
✅ Function/class-specific analysis

**When NOT to use**:
❌ Unknown file structure
❌ Need multiple scattered sections
❌ File <200 lines (full read faster)

**Example**:
```
Task: Analyze calculateScore method at line 145

Grep("calculateScore", glob="strategy.dart", -n=true)
→ Found at line 145

Read("lib/services/scoring/strategy.dart", offset=140, limit=30)
→ Returns: Lines 140-170 (function context)

Time: 1.5 seconds
Tokens used: 15 tokens (vs 750 for full 1500-line file)
Efficiency: 98% (only relevant content)
Token savings: 98% (735 tokens saved)
```

---

### Pattern 3: Parallel Multi-File Read

**Use case**: Analyzing multiple related files

**Syntax**:
```dart
[Execute in single message:]
- Read("file1.dart")
- Read("file2.dart")
- Read("file3.dart")
```

**Performance**:
- Time: max(read_times) ≈ 3 seconds (not sum)
- Tokens: Sum of all file sizes
- Efficiency: Depends on files

**Speedup calculation**:
```
Sequential: n × read_time
Parallel: max(read_time)

Example:
3 files × 3 seconds = 9 seconds (sequential)
max(3, 3, 3) = 3 seconds (parallel)
Speedup: 3x
```

**When to use**:
✅ Independent file analysis
✅ Comparing multiple files
✅ Cross-file pattern detection
✅ Multi-file refactoring

**When NOT to use**:
❌ Files have dependencies (read sequentially)
❌ Need output of first read before second
❌ Modifying same file multiple times

**Example**:
```
Task: Compare DI patterns across services

[Execute simultaneously:]
- Read("lib/services/database_service.dart")
- Read("lib/services/ml_service.dart")
- Read("lib/services/user_service.dart")

Time: 3 seconds (all parallel)
vs Sequential: 9 seconds
Speedup: 3x

Analysis: Compare constructor patterns, identify common/different approaches
```

---

### Pattern 4: Read + Verify (After Edit)

**Use case**: Confirm edits applied correctly

**Syntax**:
```dart
// After edit
Read("file.dart", offset=target_line-5, limit=20)
```

**Performance**:
- Time: 2 seconds
- Tokens: ~10 tokens (small section)
- Reliability: High (visual confirmation)

**When to use**:
✅ Critical code changes
✅ Complex edit operations
✅ Multiple replacements in file
✅ Production deployments

**When NOT to use**:
❌ Simple, low-risk edits
❌ Time-sensitive operations
❌ Covered by automated tests

**Example**:
```
Task: Add logging, verify success

Step 1: Edit
Edit("ml_service.dart",
  old_string="return detections;",
  new_string="LoggingService.debug('ML', 'Detections', detections.length);\nreturn detections;")

Step 2: Verify
Read("ml_service.dart", offset=143, limit=10)
→ Returns: Lines 143-153 showing new logging line

Verification: ✓ Logging added correctly
Time: 2 seconds extra (worth it for critical code)
```

---

### Read Tool Best Practices

#### 1. Always Calculate offset/limit from Grep Results

**Pattern**:
```
Step 1: Grep with line numbers
Grep("function_name", -n=true)
→ Found at line 145

Step 2: Read with context
Read(file, offset=145-10, limit=50)
// Reads lines 135-185 (10 lines before, 40 after)
```

#### 2. Use Appropriate Limits

**Function**: limit=30-50
**Class**: limit=100-200
**Module**: limit=200-500
**Full file**: No limit (if <200 lines)

#### 3. Parallel Reads for Independent Files

**Always prefer**:
```
[Single message:]
- Read(file1)
- Read(file2)
- Read(file3)
```

**Over**:
```
[Message 1:] Read(file1)
[Message 2:] Read(file2)
[Message 3:] Read(file3)
```

---

## Grep Tool Patterns

### Pattern 1: Find Files Containing Pattern

**Use case**: Locate which files have specific code

**Syntax**:
```dart
Grep("pattern", output_mode="files")
```

**Output**: List of file paths

**Performance**:
- Time: 1-2 seconds
- Tokens: Minimal (<1 token per file)
- Efficiency: 100% (just file names)

**When to use**:
✅ Finding locations before Read
✅ Discovering which files to modify
✅ Counting files with pattern
✅ Initial exploration

**Example**:
```
Task: Find all files using calculateScore

Grep("calculateScore", glob="**/*.dart", output_mode="files")
→ Returns:
  - lib/services/scoring/sum_scoring_strategy.dart
  - lib/services/scoring/pelusas_scoring_strategy.dart

Time: 2 seconds
Tokens: <2 tokens (just filenames)

Next step: Read these specific files
```

---

### Pattern 2: Preview Matching Lines (with Context)

**Use case**: See actual code before deciding to read full file

**Syntax**:
```dart
Grep("pattern", output_mode="content", -A=5, -B=5, -n=true)
```

**Parameters**:
- **-A**: Lines after match
- **-B**: Lines before match
- **-C**: Lines before AND after (shorthand)
- **-n**: Include line numbers

**Output**: Matching lines with context

**Performance**:
- Time: 2-3 seconds
- Tokens: Moderate (depends on matches)
- Efficiency: 90% (only relevant sections)

**When to use**:
✅ Need to see code before full read
✅ Verifying pattern matches expected usage
✅ Quick code inspection
✅ Deciding whether to read full file

**Example**:
```
Task: Preview all TODO comments with context

Grep("TODO", output_mode="content", -A=2, -B=1, -n=true)
→ Returns:
file1.dart:45
44: // Function implementation
45: // TODO: Add error handling
46: return result;
47:

file2.dart:89
88: }
89: // TODO: Optimize this loop
90: for (var item in items) {

Time: 2 seconds
Tokens: ~20 tokens (just matching sections)
Decision: Can prioritize TODOs without reading full files
```

---

### Pattern 3: Count Pattern Occurrences

**Use case**: Statistics, understanding code coverage

**Syntax**:
```dart
Grep("pattern", output_mode="count")
```

**Output**: Number of matches per file

**Performance**:
- Time: 1-2 seconds
- Tokens: Minimal (<1 token per file)
- Efficiency: 100% (just numbers)

**When to use**:
✅ Measuring pattern usage
✅ Refactoring statistics
✅ Code quality metrics
✅ Before/after comparisons

**Example**:
```
Task: Count how many print() statements to refactor

Grep("print\\(", glob="lib/**/*.dart", output_mode="count")
→ Returns:
  database_service.dart: 5
  ml_service.dart: 12
  user_service.dart: 3
  Total: 20 occurrences

Time: 2 seconds
Tokens: <5 tokens
Planning: Need to refactor 20 print() statements across 3 files
```

---

### Pattern 4: Filtered Search (Glob + Type)

**Use case**: Search specific file types or directories

**Syntax**:
```dart
// Glob filtering
Grep("pattern", glob="lib/services/*.dart")

// Type filtering
Grep("pattern", type="dart", output_mode="files")
```

**Performance**:
- Time: 1-2 seconds (faster than searching all files)
- Tokens: Minimal
- Efficiency: 100% (only relevant files)

**When to use**:
✅ Large codebases
✅ Specific subsystem analysis
✅ Avoiding false positives from tests/generated files
✅ Directory-specific searches

**Example**:
```
Task: Find print() only in services (not tests, not generated)

Grep("print\\(", glob="lib/services/*.dart", output_mode="files")
→ Returns: Only service files (excludes tests, generated)

Time: 1 second
vs Unfiltered search: 5 seconds (searches all 500+ files)
Speedup: 5x
```

---

### Pattern 5: Case-Insensitive Search

**Use case**: Finding variables/functions with unknown case

**Syntax**:
```dart
Grep("Pattern", -i=true, output_mode="files")
```

**Performance**:
- Time: 1-2 seconds
- Tokens: Same as case-sensitive
- Matches: More permissive

**When to use**:
✅ Variable name refactoring (unknown case)
✅ Finding typos/inconsistencies
✅ Language-agnostic searches
✅ User input searches

**Example**:
```
Task: Find all uses of calculateScore (any case)

Grep("calculateScore", -i=true, output_mode="files")
→ Finds:
  - calculateScore
  - CalculateScore
  - CALCULATE_SCORE
  - calculateSCORE

Time: 2 seconds
Catches: Inconsistencies in naming
```

---

### Pattern 6: Regex Pattern Matching

**Use case**: Complex pattern searches

**Syntax**:
```dart
// Escape special characters
Grep("print\\(", ...)  // Match literal print(

// Wildcards
Grep("class.*Service", ...)  // Match class followed by Service

// Word boundaries
Grep("\\bscope\\b", ...)  // Match "scope" as whole word
```

**Common patterns**:
- `\\(` - Literal parenthesis
- `.*` - Any characters
- `\\b` - Word boundary
- `[0-9]+` - Numbers
- `\\s` - Whitespace

**When to use**:
✅ Function call patterns
✅ Class name patterns
✅ Complex code structures
✅ Language-specific syntax

**Example**:
```
Task: Find all async functions

Grep("async.*\\{", output_mode="content", -A=2, -n=true)
→ Finds:
  line 45: async calculateScore() {
  line 89: async loadData() {
  line 156: async fetchUser() {

Time: 2 seconds
Matches: All async function definitions
```

---

### Grep Tool Best Practices

#### 1. Always Start with output_mode="files"

**Workflow**:
```
Step 1: Find files
Grep("pattern", output_mode="files")

Step 2: Preview if needed
Grep("pattern", glob="found_file.dart", output_mode="content", -n=true)

Step 3: Read targeted sections
Read(file, offset, limit)
```

#### 2. Use head_limit for Large Results

**Syntax**:
```dart
Grep("pattern", output_mode="files", head_limit=10)
// Returns only first 10 files
```

**When to use**:
✅ Exploratory searches
✅ Sampling code patterns
✅ Preventing token overflow

#### 3. Combine with Glob for Precision

**Always prefer**:
```
Grep("pattern", glob="lib/services/*.dart")  # Specific
```

**Over**:
```
Grep("pattern")  # Searches everything, slower
```

---

## Glob Tool Patterns

### Pattern 1: Find All Files by Extension

**Use case**: List all files of specific type

**Syntax**:
```dart
Glob("**/*.ext")
```

**Common patterns**:
- `**/*.dart` - All Dart files recursively
- `**/*.json` - All JSON files
- `**/*.{dart,yaml}` - Multiple extensions
- `lib/**/*.dart` - Dart files in lib/ only

**Performance**:
- Time: 1-2 seconds
- Tokens: Minimal (<1 token per file)
- Efficiency: 100% (just file paths)

**When to use**:
✅ Project exploration
✅ File counting
✅ Batch operations planning
✅ Before Grep (know search space)

**Example**:
```
Task: Count all Dart files in project

Glob("**/*.dart")
→ Returns: 127 Dart files

Time: 1 second
Tokens: <10 tokens
Insight: Project has 127 files to search
```

---

### Pattern 2: Find Files by Name Pattern

**Use case**: Locate specific file types by naming convention

**Syntax**:
```dart
Glob("**/*_service.dart")   # All service files
Glob("**/*_test.dart")      # All test files
Glob("**/mock_*.dart")      # All mock files
```

**Performance**:
- Time: 1 second
- Tokens: Minimal
- Efficiency: 100%

**When to use**:
✅ Finding files by convention
✅ Architecture-specific files
✅ Generated file discovery
✅ Pattern-based operations

**Example**:
```
Task: Find all scoring strategy implementations

Glob("**/*_scoring_strategy.dart")
→ Returns:
  - lib/services/scoring/sum_scoring_strategy.dart
  - lib/services/scoring/counting_scoring_strategy.dart
  - lib/services/scoring/manual_scoring_strategy.dart
  - lib/services/scoring/pelusas_scoring_strategy.dart

Time: 1 second
Count: 4 strategies
Next: Read all 4 in parallel for comparison
```

---

### Pattern 3: Directory-Specific Search

**Use case**: Limit search to specific directories

**Syntax**:
```dart
Glob("lib/services/*.dart")      # Services only (not nested)
Glob("lib/services/**/*.dart")   # Services recursive
Glob("test/**/*_test.dart")      # All tests recursive
```

**Pattern syntax**:
- `*` - Single directory level
- `**` - Recursive (all nested levels)
- `lib/services/*.dart` - Direct children only
- `lib/services/**/*.dart` - All descendants

**When to use**:
✅ Subsystem analysis
✅ Directory-specific operations
✅ Avoiding irrelevant files
✅ Performance optimization

**Example**:
```
Task: List all widgets (not screens, not models)

Glob("lib/widgets/**/*.dart")
→ Returns: Only files in lib/widgets/ hierarchy

Time: 1 second
vs Glob("**/*.dart"): 2 seconds (searches entire project)
Speedup: 2x
Precision: 100% (only relevant files)
```

---

### Pattern 4: Multiple Extensions

**Use case**: Find files of different types

**Syntax**:
```dart
Glob("**/*.{dart,yaml,json}")
```

**Performance**:
- Time: 1-2 seconds
- Tokens: Minimal
- Efficiency: 100%

**When to use**:
✅ Configuration files (YAML + JSON)
✅ Code + config analysis
✅ Multi-format projects

**Example**:
```
Task: Find all configuration files

Glob("**/*.{yaml,json,xml}")
→ Returns:
  - pubspec.yaml
  - analysis_options.yaml
  - app_config.json
  - AndroidManifest.xml

Time: 1 second
Count: 4 config files
Next: Read all for configuration audit
```

---

### Glob Tool Best Practices

#### 1. Use Glob Before Grep

**Optimal workflow**:
```
Step 1: Glob to understand search space
Glob("**/*_service.dart")
→ Returns: 8 service files

Step 2: Grep within those files
Grep("pattern", glob="**/*_service.dart")

Result: Faster, more targeted search
```

#### 2. Use Specific Patterns

**Always prefer specific**:
```
Glob("lib/services/*_service.dart")  # Specific
```

**Over generic**:
```
Glob("**/*.dart")  # Searches everything
```

#### 3. Combine with Parallel Read

**Pattern**:
```
Step 1: Glob
Glob("**/*_strategy.dart")
→ Returns: 4 files

Step 2: Parallel read
[Execute simultaneously:]
- Read(strategy1.dart)
- Read(strategy2.dart)
- Read(strategy3.dart)
- Read(strategy4.dart)

Time: Glob (1s) + Parallel Read (3s) = 4s total
vs Sequential: 1s + (4 × 3s) = 13s
Speedup: 3.25x
```

---

## Edit Tool Patterns

### Pattern 1: Simple Find-Replace

**Use case**: Replace single occurrence

**Syntax**:
```dart
Edit(
  file_path: "path/to/file.ext",
  old_string: "exact_match",
  new_string: "replacement"
)
```

**Requirements**:
- old_string must be UNIQUE in file
- Preserve exact indentation
- Include enough context

**When to use**:
✅ Single function edit
✅ Unique code section
✅ Precise changes

**Example**:
```
Task: Add logging to calculateScore

Edit(
  file_path: "lib/services/scoring/sum_strategy.dart",
  old_string: "  int calculateScore(List<Detection> detections) {\n    return detections.length;",
  new_string: "  int calculateScore(List<Detection> detections) {\n    LoggingService.debug('SumStrategy', 'Calculating', detections.length);\n    return detections.length;"
)

Time: 2 seconds
Result: ✓ Logging added
```

---

### Pattern 2: Replace All Occurrences

**Use case**: Find-replace across entire file

**Syntax**:
```dart
Edit(
  file_path: "path/to/file.ext",
  old_string: "pattern",
  new_string: "replacement",
  replace_all: true
)
```

**When to use**:
✅ Variable renaming
✅ Import path updates
✅ Simple refactoring
✅ String literal changes

**Example**:
```
Task: Rename variable across file

Edit(
  file_path: "lib/services/ml_service.dart",
  old_string: "_detectionModel",
  new_string: "_onnxModel",
  replace_all: true
)

Result: All 15 occurrences renamed
Time: 2 seconds
```

---

### Pattern 3: Multi-File Sequential Edits

**Use case**: Apply same pattern to multiple files

**Syntax**:
```dart
[Execute sequentially:]
- Edit(file1, old, new)
- Edit(file2, old, new)
- Edit(file3, old, new)
```

**Important**: Must be sequential (not parallel) to avoid conflicts

**When to use**:
✅ Cross-file refactoring
✅ Consistent pattern application
✅ Bulk updates

**Example**:
```
Task: Add logging to all strategies

[Sequential execution:]
Edit("sum_strategy.dart", old="return total;", new="LoggingService.debug('Sum', total); return total;")
Edit("counting_strategy.dart", old="return count;", new="LoggingService.debug('Count', count); return count;")
Edit("manual_strategy.dart", old="return score;", new="LoggingService.debug('Manual', score); return score;")

Time: 6 seconds (3 × 2s)
Result: All 3 files updated consistently
```

---

### Edit Tool Best Practices

#### 1. Always Read Before Edit

**Verification workflow**:
```
Step 1: Read section
Read(file, offset, limit)

Step 2: Identify exact old_string
[Copy exact text from Read output]

Step 3: Edit
Edit(file, old_string="[exact match]", new_string="[modified]")

Result: Higher success rate, fewer errors
```

#### 2. Include Sufficient Context

**Bad** (ambiguous):
```
old_string: "return value;"
```

**Good** (unique):
```
old_string: "  int calculateScore() {\n    return value;\n  }"
```

#### 3. Preserve Indentation

**Extract from Read output**:
```
Read output shows:
  45:   int calculateScore() {
  46:     return total;
  47:   }

Edit old_string must match EXACTLY:
"  int calculateScore() {\n    return total;\n  }"
[Note: 2 spaces for method, 4 for body]
```

---

## Bash Tool Patterns

### When to Use Bash

**Prefer specialized tools first**:
- File operations → Read/Write/Edit/Glob/Grep
- Documentation → @context7 MCP
- Git operations → @git MCP
- Python testing → @jupyter MCP

**Use Bash for**:
✅ Build commands (flutter build, npm run)
✅ Test execution (flutter test, pytest)
✅ Package management (flutter pub get, npm install)
✅ System commands not covered by other tools
✅ Complex multi-step shell operations

### Bash Best Practices

#### 1. Always Provide Absolute Paths

**Good**:
```bash
cd "D:\PYTHON\EasyBoard\board_game_scorer" && flutter test
```

**Bad** (may fail):
```bash
cd board_game_scorer && flutter test
```

#### 2. Quote Paths with Spaces

**Good**:
```bash
cd "D:\Users\My Name\Project" && flutter run
```

**Bad** (will fail):
```bash
cd D:\Users\My Name\Project && flutter run
```

#### 3. Chain with && for Dependencies

**Good** (sequential):
```bash
flutter clean && flutter pub get && flutter run
```

**Bad** (may proceed after failure):
```bash
flutter clean; flutter pub get; flutter run
```

---

## MCP Tool Patterns

### Context7 Patterns

**Best for**:
- Library documentation
- API references
- Version-specific docs
- Best practices lookup

**Usage**:
```
@context7: "Riverpod 2.4.9 AsyncNotifier pattern"
@context7: "Flutter 3.16 MaterialDesign3 dark theme"
@context7: "ONNX Runtime 1.22 mobile optimization"
```

**Performance**: 3 seconds (100x faster than manual search)

---

### Git MCP Patterns

**Best for**:
- Commit history analysis
- Semantic git operations
- File change tracking
- Author/blame analysis

**Usage**:
```
@git: "Last 5 commits"
@git: "Find all commits touching ml_service.dart"
@git: "Who last modified this function?"
```

**Performance**: 3-5 seconds (4x faster than manual git commands)

---

### Jupyter MCP Patterns

**Best for**:
- Interactive Python execution
- ML model testing
- Data analysis
- Quick experiments

**Usage**:
```
@jupyter: "Test ONNX model with [1,3,640,640] input"
@jupyter: "import numpy as np; print(np.random.randn(2,2))"
@jupyter: "Calculate model size in MB"
```

**Performance**: 10 seconds per iteration (20x faster than creating .py files)

---

## Tool Combination Strategies

### Strategy 1: Grep → Read → Edit

**Best for**: Targeted code modifications

```
Step 1: Grep (find locations)
Grep("pattern", output_mode="files")

Step 2: Read (load targeted sections)
Read(found_files, offset, limit)

Step 3: Edit (make changes)
Edit(files, old_string, new_string)

Speedup: 6-10x vs naive approach
```

---

### Strategy 2: Glob → Parallel Read → Analyze

**Best for**: Multi-file analysis

```
Step 1: Glob (discover files)
Glob("**/*_pattern.ext")

Step 2: Parallel Read (load all)
[Execute simultaneously:]
- Read(file1)
- Read(file2)
- Read(file3)

Step 3: Analyze patterns
[Claude compares all files]

Speedup: 3-5x vs sequential
```

---

### Strategy 3: Context7 → Read → Implement

**Best for**: Following best practices

```
Step 1: Context7 (get official pattern)
@context7: "Library XYZ best practice"

Step 2: Read (current implementation)
Read(target_file)

Step 3: Implement (apply pattern)
Edit(target_file, ...)

Benefit: Guaranteed best practices, 100x faster research
```

---

## Performance Optimization

### Tool Selection Flowchart

```
Need documentation?
→ @context7 MCP (instant)

Need to find files?
→ Glob (1s)

Need to search content?
→ Grep (1-2s)

Need to read file?
→ Known section? Read(offset, limit)
→ Small file? Read(full)
→ Multiple files? Parallel Read

Need to modify file?
→ Edit (2s)

Need to run command?
→ Specialized tool exists? Use it
→ No alternative? Bash
```

### Performance Metrics by Tool

| Tool | Avg Time | Token Efficiency | Best Case Speedup |
|------|---------|-----------------|------------------|
| Grep | 1-2s | 95% | 10x vs full Read |
| Glob | 1s | 99% | 10x vs Bash find |
| Read (partial) | 1-2s | 90% | 50x vs full Read |
| Read (parallel) | 3s | 80% | Nx (N=files) |
| Edit | 2s | 100% | N/A |
| @context7 | 3s | 100% | 100x vs Google |
| @git | 3-5s | 95% | 4x vs Bash git |

---

## Decision Trees

### File Operation Decision Tree

```
┌─ What do you need to do? ─┐
│
├─ Find files by name pattern
│  → Glob("**/*pattern*")
│
├─ Search for code pattern
│  → Grep("pattern", output_mode="files")
│
├─ Read file content
│  ├─ Small file (<200 lines)
│  │  → Read("file")
│  ├─ Large file, known section
│  │  → Read("file", offset, limit)
│  └─ Multiple files
│     → [Parallel Read calls]
│
├─ Modify file
│  ├─ Single change
│  │  → Edit(file, old, new)
│  └─ Multiple occurrences
│     → Edit(file, old, new, replace_all=true)
│
└─ Complex operation
   → Check for MCP server
   → Else use Bash
```

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Total Pages**: 20+
**Reading Time**: 40 minutes
**Performance Target**: 5-10x speedup through optimal tool selection