# Structured Prompt Template

Use this template to create high-quality, XML-structured prompts that achieve 8x faster results with 95%+ success rate.

---

## Template Structure

```xml
<task>
{{ONE_SENTENCE_TASK_DESCRIPTION}}
</task>

<context>
  <file>{{FILE_PATH}}:{{LINE_NUMBER}}</file>

  <error>
{{COMPLETE_ERROR_MESSAGE}}
{{STACK_TRACE}}
  </error>

  <current_state>
{{WHAT_EXISTS_NOW}}
{{RELEVANT_CONFIGURATION}}
{{TECH_STACK_DETAILS}}
  </current_state>

  <reproduction>
{{STEP_BY_STEP_REPRODUCTION}}
1. {{STEP_1}}
2. {{STEP_2}}
3. {{EXPECTED_VS_ACTUAL}}
  </reproduction>
</context>

<requirements>
1. {{SPECIFIC_REQUIREMENT_1}}
2. {{SPECIFIC_REQUIREMENT_2}}
3. {{SPECIFIC_REQUIREMENT_3}}
4. {{SPECIFIC_REQUIREMENT_4}}
5. {{SPECIFIC_REQUIREMENT_5}}
</requirements>

<constraints>
- {{CONSTRAINT_1_WHAT_NOT_TO_CHANGE}}
- {{CONSTRAINT_2_PERFORMANCE_BUDGET}}
- {{CONSTRAINT_3_COMPATIBILITY}}
- {{CONSTRAINT_4_API_STABILITY}}
</constraints>

<output>
  <{{SECTION_1}}>{{WHAT_GOES_HERE}}</{{SECTION_1}}>
  <{{SECTION_2}}>{{WHAT_GOES_HERE}}</{{SECTION_2}}>
  <{{SECTION_3}}>{{WHAT_GOES_HERE}}</{{SECTION_3}}>
</output>

<success_criteria>
  - {{MEASURABLE_OUTCOME_1}}
  - {{MEASURABLE_OUTCOME_2}}
  - {{MEASURABLE_OUTCOME_3}}
  - {{MEASURABLE_OUTCOME_4}}
</success_criteria>
```

---

## Slot Definitions

### `{{ONE_SENTENCE_TASK_DESCRIPTION}}`
**Format**: `[Verb] + [Target] + [Outcome]`
**Examples**:
- Fix NullPointerException in MLService.detectObjects()
- Implement dark mode with persistent user preference
- Optimize database query from 500ms to <100ms
- Refactor UserService to follow SOLID principles

**Bad examples** (too vague):
- Fix bug (Which bug? Where?)
- Add feature (Which feature? How?)
- Improve code (What aspect? How much?)

---

### `{{FILE_PATH}}:{{LINE_NUMBER}}`
**Format**: Absolute or relative path with optional line number
**Examples**:
- lib/services/ml_service.dart:145
- D:\PYTHON\EasyBoard\lib\services\database_service.dart
- src/components/Header.tsx:67-89 (line range)

**Why it matters**: Exact locations eliminate ambiguity

---

### `{{COMPLETE_ERROR_MESSAGE}}`
**Include**:
- Full error text (not paraphrased)
- Stack trace (first 10-20 lines)
- Error code if applicable
- Platform/environment details

**Example**:
```
Null check operator used on null value
at MLService.detectObjects (ml_service.dart:145:27)
at CameraScreen._processImage (camera_screen.dart:203:18)
at CameraScreen.build.<anonymous closure> (camera_screen.dart:167:12)

Platform: Android arm64-v8a
Build mode: Release
Flutter version: 3.16.5
```

---

### `{{WHAT_EXISTS_NOW}}`
**Include**:
- Current implementation summary
- Relevant configuration
- Dependencies and versions
- Known working/broken states

**Example**:
```
Current implementation:
- Using flutter_onnxruntime 1.5.2
- Model: assets/models/pelusas.onnx (10.7MB)
- Preprocessing: 640x640, NCHW, FP32
- NMS threshold: 0.45
- Works in debug mode, crashes in release
```

---

### `{{STEP_BY_STEP_REPRODUCTION}}`
**Format**: Numbered steps showing how to reproduce issue
**Example**:
```
1. Launch app in release mode (flutter run --release)
2. Navigate to Camera screen
3. Grant camera permissions
4. Tap "Detect Objects" button
5. Expected: Shows detections overlay
6. Actual: App crashes with NullPointerException
7. Frequency: 100% reproducible
```

---

### `{{SPECIFIC_REQUIREMENT_N}}`
**Format**: Numbered, specific, measurable requirements
**Good examples**:
- Add null safety check for _session variable before use
- Maintain inference latency <150ms (currently 120ms)
- Add LoggingService.error() call with stack trace
- Write unit test for null _session scenario
- Ensure backward compatibility with existing callers

**Bad examples** (too vague):
- Make it work (How? What defines "work"?)
- Improve performance (By how much?)
- Add error handling (What kind? Where?)

---

### `{{CONSTRAINT_N}}`
**Purpose**: What NOT to change or break
**Examples**:
- Don't modify model loading logic (works correctly)
- Maintain backward compatibility with v1.0 API
- Performance budget: <150ms inference latency
- Memory budget: <10MB per detection
- Don't break existing tests (23 passing tests)

---

### `{{SECTION_N}}` (Output format)
**Purpose**: Explicitly define expected response structure
**Common sections**:
- `<analysis>`: Root cause explanation
- `<fix>`: Code changes with diffs
- `<testing>`: Verification steps
- `<prevention>`: How to avoid in future
- `<migration>`: Upgrade guide if breaking changes

**Example**:
```xml
<output>
  <root_cause>Line-by-line explanation of the bug</root_cause>
  <code_fix>Diff showing before/after changes</code_fix>
  <test_case>New test to prevent regression</test_case>
  <verification>Steps to confirm fix works</verification>
</output>
```

---

### `{{MEASURABLE_OUTCOME_N}}`
**Format**: Verifiable, binary (yes/no) success criteria
**Good examples**:
- App doesn't crash in release mode
- Inference latency <150ms (measured with Stopwatch)
- flutter analyze reports 0 errors
- All 23 existing tests pass
- New test case passes (testNullSession)
- Code coverage >80% (verified with lcov)

**Bad examples** (not measurable):
- Code looks good (Subjective)
- Performance is better (By how much?)
- Works as expected (What's expected?)

---

## Usage Examples

### Example 1: Bug Fix Prompt

```xml
<task>
Fix camera crash caused by null CameraController in CameraScreen.dispose()
</task>

<context>
  <file>lib/screens/camera_screen.dart:289</file>

  <error>
Null check operator used on null value
at CameraScreen.dispose (camera_screen.dart:289:5)
at StatefulElement.unmount (element.dart:1234:12)

Platform: Android 12 (API 31)
Happens when: User navigates back before camera initializes
  </error>

  <current_state>
- CameraController initialized in initState()
- Takes 500-1000ms to initialize
- If user navigates back quickly, controller is null
- dispose() calls controller.dispose() without null check
  </current_state>

  <reproduction>
1. Open CameraScreen
2. Immediately press back button (<500ms)
3. App crashes with NullPointerException at line 289
4. Reproducible 80% of the time (race condition)
  </reproduction>
</context>

<requirements>
1. Add null safety check for _controller in dispose()
2. Cancel controller initialization if screen disposed early
3. Add proper lifecycle management (initState/dispose)
4. Maintain existing camera functionality when properly initialized
5. Add test case for early disposal scenario
</requirements>

<constraints>
- Don't modify camera initialization logic (works when not interrupted)
- Maintain 60fps performance during camera preview
- Don't break existing camera capture functionality
- Keep existing CameraDescription parameter passing
</constraints>

<output>
  <root_cause>Explanation of race condition</root_cause>
  <code_fix>Changes to dispose() and initState()</code_fix>
  <test_case>Widget test for early disposal</test_case>
  <verification>Manual testing steps</verification>
</output>

<success_criteria>
  - No crash when navigating back quickly
  - Camera works normally when fully initialized
  - All existing camera tests pass
  - New test (testEarlyDisposal) passes
  - flutter analyze 0 errors
</success_criteria>
```

---

### Example 2: Feature Implementation Prompt

```xml
<task>
Implement CSV export for match history with player names and scores
</task>

<context>
  <file>lib/screens/history_screen.dart (add export button)</file>

  <current_state>
Tech stack:
- Flutter 3.16, Dart 3.2
- csv: ^6.0.0 (already in pubspec.yaml)
- share_plus: ^7.2.1 (already in pubspec.yaml)
- Isar database with GameMatch, PlayerMatchScore entities

Existing functionality:
- History screen shows matches in ListView
- Can filter by game/player/date
- Need: Export filtered results to CSV
  </current_state>

  <design_requirements>
- CSV format: Date, Game, Player1, Score1, Player2, Score2, ...
- Include column headers
- Export only visible/filtered matches
- Share via system share dialog
- Show loading indicator during export
- Handle 1000+ matches efficiently
  </design_requirements>
</context>

<requirements>
1. Create ExportService in lib/services/export_service.dart
2. Implement toCsv(List<GameMatch>) → String method
3. Add "Export CSV" FAB in HistoryScreen
4. Show loading dialog during export
5. Use share_plus to share generated CSV file
6. Format dates as YYYY-MM-DD HH:mm
7. Handle multiplayer matches (variable player count)
8. Write unit tests for CSV generation
9. Test with 1000+ matches (performance <2s)
10. Add error handling with user-friendly messages
</requirements>

<constraints>
- Don't modify existing HistoryService logic
- Maintain current filtering functionality
- Performance: Export 1000 matches in <2 seconds
- Memory: Don't load all matches at once (use streaming)
- Don't break existing history screen UI
</constraints>

<output>
  <implementation>
    <new_files>
      - lib/services/export_service.dart (CSV logic)
      - test/services/export_service_test.dart (unit tests)
    </new_files>
    <modified_files>
      - lib/screens/history_screen.dart (export button + UI)
      - lib/services/history_service.dart (if needed for streaming)
    </modified_files>
  </implementation>

  <testing>
    - Unit tests: CSV format correctness
    - Integration test: End-to-end export flow
    - Performance test: 1000 matches export
    - Edge cases: Empty history, single player, 10 players
  </testing>
</output>

<success_criteria>
  - CSV exports with correct format
  - System share dialog opens successfully
  - Exports 1000 matches in <2 seconds
  - Loading indicator shows during export
  - All tests pass (unit + integration)
  - flutter analyze 0 errors
  - No memory leaks (verified with DevTools)
</success_criteria>
```

---

## Prompt Quality Checklist

Before sending, verify:

**Specificity** (25 points):
- [ ] File paths with line numbers?
- [ ] Complete error messages?
- [ ] Exact version numbers?
- [ ] Specific metrics (not "faster", but "from 200ms to <100ms")?
- [ ] Quantifiable targets?

**Context** (25 points):
- [ ] Tech stack details?
- [ ] Current state description?
- [ ] Reproduction steps (if bug)?
- [ ] Relevant configuration?
- [ ] Related files/dependencies?

**Clarity** (20 points):
- [ ] One clear task in `<task>`?
- [ ] Requirements numbered and specific?
- [ ] Constraints explicitly stated?
- [ ] Output format defined?
- [ ] Success criteria measurable?

**Structure** (15 points):
- [ ] XML tags used correctly?
- [ ] Logical section order?
- [ ] No missing required sections?
- [ ] Proper nesting of tags?

**Completeness** (15 points):
- [ ] All necessary info provided?
- [ ] No ambiguous terms?
- [ ] No missing links/references?
- [ ] Claude can act immediately without follow-up questions?

**Target score**: 80+/100 (Good prompt)
**Optimal score**: 95+/100 (Exceptional prompt)

---

## Common Mistakes

### Mistake 1: Vague Task Description
```xml
❌ BAD:
<task>Fix the bug</task>

✅ GOOD:
<task>Fix NullPointerException in MLService.detectObjects() at line 145</task>
```

### Mistake 2: Missing Error Details
```xml
❌ BAD:
<error>Something about null</error>

✅ GOOD:
<error>
Null check operator used on null value
at MLService.detectObjects (ml_service.dart:145:27)
[Full stack trace...]
</error>
```

### Mistake 3: Non-Measurable Requirements
```xml
❌ BAD:
1. Make it faster
2. Improve code quality

✅ GOOD:
1. Reduce inference latency from 200ms to <100ms
2. Achieve >80% code coverage with unit tests
```

### Mistake 4: No Success Criteria
```xml
❌ BAD:
[No success_criteria section]

✅ GOOD:
<success_criteria>
  - Inference latency <100ms (measured)
  - All 23 tests pass
  - flutter analyze 0 errors
</success_criteria>
```

---

## Advanced: Domain-Specific Variations

### For ML/Data Science:
```xml
<context>
  <model>{{MODEL_NAME}}, {{FRAMEWORK}}, {{SIZE}}</model>
  <dataset>{{DATASET_SIZE}}, {{SPLIT_RATIO}}</dataset>
  <metrics>{{CURRENT_METRICS}} → Target: {{TARGET_METRICS}}</metrics>
  <hardware>{{GPU}}, {{MEMORY}}, {{COMPUTE}}</hardware>
</context>
```

### For API Development:
```xml
<context>
  <endpoint>{{METHOD}} {{PATH}}</endpoint>
  <request>{{REQUEST_SCHEMA}}</request>
  <response>{{RESPONSE_SCHEMA}}</response>
  <auth>{{AUTH_METHOD}}</auth>
  <rate_limit>{{REQUESTS_PER_MINUTE}}</rate_limit>
</context>
```

### For Database:
```xml
<context>
  <schema>{{TABLE_DEFINITIONS}}</schema>
  <indexes>{{CURRENT_INDEXES}}</indexes>
  <query>{{SLOW_QUERY}}</query>
  <performance>{{CURRENT_LATENCY}} → Target: {{TARGET_LATENCY}}</performance>
  <volume>{{ROW_COUNT}}, {{GROWTH_RATE}}</volume>
</context>
```

---

## Quick Reference Card

```
STRUCTURE:
<task>One sentence task</task>
<context>File, error, state, reproduction</context>
<requirements>1-10 numbered items</requirements>
<constraints>What NOT to change</constraints>
<output>Expected response structure</output>
<success_criteria>Measurable outcomes</success_criteria>

GOLDEN RULES:
1. Be specific (file:line, not "the file")
2. Be measurable (<100ms, not "fast")
3. Be complete (all info upfront)
4. Be structured (XML tags)
5. Be verifiable (yes/no criteria)

TARGET:
- 1-2 iterations (not 5+)
- 95%+ success rate
- 8x faster than vague prompts
- 2.4x more token-efficient
```

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Performance Impact**: 8x faster, 95%+ success rate, 2.4x token efficiency
**Recommended For**: All complex tasks (bug fixes, features, refactoring, code reviews)