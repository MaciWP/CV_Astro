# Prompt Quality Scoring Guide

**For EasyBoard Development with Claude Sonnet 4.5**

---

## Overview

This guide provides a comprehensive framework for scoring prompt quality on a 0-100 scale, specifically adapted for EasyBoard (Flutter mobile app with YOLO11 ML integration).

---

## Scoring Categories (0-100 Points)

### 1. Clarity & Specificity (0-25 points)

**What it measures**: How clear and specific the prompt is.

#### Action Verbs (5 points)
- **5 pts**: Strong verbs ("Analyze", "Refactor", "Implement", "Optimize", "Diagnose")
- **3 pts**: Moderate verbs ("Create", "Update", "Add", "Remove")
- **1 pt**: Weak verbs ("Fix", "Change", "Improve", "Help")
- **0 pts**: Vague verbs ("Look at", "See if", "Try to", "Make better")

**Examples**:
- ✅ "Refactor MLService.detectObjects() to cache ONNX session" (5 pts)
- ❌ "Fix the ML code" (0 pts)

#### File Paths/Line Numbers (5 points)
- **5 pts**: Absolute path + line number (`lib/services/ml_service.dart:156`)
- **4 pts**: Absolute path + line range (`lib/services/ml_service.dart:145-180`)
- **3 pts**: Absolute path only (`lib/services/ml_service.dart`)
- **1 pt**: Relative path or partial (`ml_service.dart`)
- **0 pts**: No file path specified

**Examples**:
- ✅ `lib/screens/camera_screen.dart:234` (5 pts)
- ❌ "the camera file" (0 pts)

#### Quantifiable Criteria (5 points)
- **5 pts**: Multiple metrics with targets ("<150ms inference", ">80% coverage", "0 flutter analyze errors")
- **3 pts**: One metric with target (">80% test coverage")
- **1 pt**: Vague metric ("faster", "better quality")
- **0 pts**: No metrics

**Examples**:
- ✅ "Reduce latency from 250ms to <150ms on Pixel 6" (5 pts)
- ❌ "Make it faster" (0 pts)

#### Technical Terms (5 points)
- **5 pts**: 5+ domain terms (Flutter, Riverpod, Isar, YOLO11, ONNX, NCHW, NMS, DI)
- **3 pts**: 3-4 terms
- **1 pt**: 1-2 terms
- **0 pts**: Generic only ("app", "code", "function")

**Examples**:
- ✅ "YOLO11 nano ONNX model with NCHW tensor format and NMS IoU 0.45" (5 pts)
- ❌ "the model file" (0 pts)

#### No Vague Words (5 points)
- **5 pts**: Zero vague words
- **3 pts**: 1-2 vague words
- **1 pt**: 3-4 vague words
- **0 pts**: 5+ vague words

**Vague words**: "maybe", "somehow", "various", "stuff", "things", "probably", "kinda", "sorta", "better", "improve"

**Examples**:
- ✅ "Add null safety check before accessing cameraController.value" (5 pts)
- ❌ "Maybe somehow fix the camera stuff to make it better" (0 pts)

---

### 2. Context & Domain (0-25 points)

**What it measures**: How much EasyBoard-specific context is provided.

#### Project Context (7 points)
- **7 pts**: Mentions architecture + patterns + affected services (DI, Strategy Pattern, service-oriented)
- **5 pts**: Mentions architecture or patterns
- **3 pts**: Mentions general structure (services, screens, models)
- **0 pts**: No project context

**Examples**:
- ✅ "Following EasyBoard's service-oriented architecture with constructor DI and Strategy Pattern for scoring" (7 pts)
- ❌ "In the app" (0 pts)

#### Tech Stack (6 points)
- **6 pts**: 4+ packages with versions (Flutter 3.24, Riverpod 2.4.9, Isar 3.1.0, ONNX 1.22.0)
- **4 pts**: 2-3 packages with versions
- **2 pts**: Mentions Flutter or one package
- **0 pts**: No tech stack

**Examples**:
- ✅ "Flutter 3.24, camera 0.11.0, Riverpod 2.4.9" (6 pts)
- ❌ "the app" (0 pts)

#### Error Details (6 points)
- **6 pts**: Stack trace + error message + symptom + reproduction steps
- **4 pts**: Error message + symptom + reproduction steps
- **2 pts**: Error message or symptom only
- **0 pts**: No error details

**Examples**:
- ✅ "Null check operator used on null value - cameraController.value. App crashes when tapping capture before init. Reproducible: open CameraScreen, tap capture immediately" (6 pts)
- ❌ "There's an error" (0 pts)

#### Edge Cases (6 points)
- **6 pts**: 3+ edge cases with handling strategy (null, empty list, database closed, no network)
- **4 pts**: 2 edge cases
- **2 pts**: 1 edge case
- **0 pts**: No edge cases

**Examples**:
- ✅ "Handle null input, empty detection list, model not loaded, session timeout" (6 pts)
- ❌ No edge cases mentioned (0 pts)

---

### 3. Structure (0-20 points)

**What it measures**: How well the prompt is structured with XML tags.

#### XML Tags (7 points)
- **7 pts**: Uses all tags: `<task>`, `<context>`, `<instructions>`, `<output_format>` with proper nesting
- **5 pts**: Uses 3 tags
- **3 pts**: Uses 1-2 tags
- **0 pts**: Plain text, no XML

**Examples**:
```xml
✅ (7 pts)
<task>Fix NullPointerException</task>
<context>
  <file>lib/services/ml_service.dart:156</file>
  <error>Null check on _session</error>
</context>
<instructions>
1. Add null check
2. Handle error
</instructions>
<output_format>
<fix>Complete code</fix>
</output_format>

❌ (0 pts)
"Fix the null pointer error in ML service"
```

#### Sequential Steps (7 points)
- **7 pts**: Numbered steps (1, 2, 3...) with clear order and dependencies
- **5 pts**: Numbered steps but order unclear
- **3 pts**: Bullet points (unordered)
- **0 pts**: Prose paragraph

**Examples**:
- ✅ "1. Add null check\n2. Show SnackBar\n3. Add unit test\n4. Verify with flutter test" (7 pts)
- ❌ "Add a check and test it" (0 pts)

#### Output Format (6 points)
- **6 pts**: Explicit structure with sub-tags and examples (`<fix>`, `<test>`, `<verification>`)
- **4 pts**: Explicit structure but no examples
- **2 pts**: Mentioned but not structured
- **0 pts**: No output format specified

**Examples**:
```xml
✅ (6 pts)
<output_format>
<fix>Complete Dart code with null check</fix>
<test>Unit test with MockCameraService</test>
<verification>flutter analyze output</verification>
</output_format>

❌ (0 pts)
"Give me the fix"
```

---

### 4. Advanced Techniques (0-15 points)

**What it measures**: Use of Anthropic 2025 best practices.

#### Chain of Thought (5 points)
- **5 pts**: `<thinking>` tags with 4+ reasoning steps for complex tasks (ML, architecture, strategies)
- **3 pts**: "Think step-by-step" instruction
- **1 pt**: "Consider" or "analyze" mention
- **0 pts**: No CoT

**Examples**:
```xml
✅ (5 pts)
<thinking>
1. Analyze scoring components: routes, destinations, bonuses
2. Design Detection mapping: labels to point values
3. Edge cases: no routes, incomplete destinations
4. Implementation: extend ScoringStrategy, override calculateScore()
</thinking>

❌ (0 pts)
"Create a scoring strategy"
```

#### Few-Shot Examples (5 points)
- **5 pts**: 3+ ❌/✅ comparison examples
- **3 pts**: 1-2 examples
- **1 pt**: Mentioned "like X" but no actual example
- **0 pts**: No examples

**Examples**:
- ✅ "❌ const service = new Service();\n✅ final service = widget.service ?? Service();" (5 pts for 3+ pairs)
- ❌ "Use DI" (0 pts)

#### Quote Grounding (5 points)
- **5 pts**: "First extract quotes, then analyze" with `<quote>` tags for long files (>200 lines)
- **3 pts**: "Extract relevant code" instruction
- **0 pts**: Direct analysis without quote extraction

**Examples**:
- ✅ "Step 1: Extract all service instantiation quotes from ml_service.dart with `<quote line='X-Y'>`. Step 2: Analyze each quote for DI violations." (5 pts)
- ❌ "Find all DI violations in MLService" (0 pts)

---

### 5. Actionability (0-15 points)

**What it measures**: Can the prompt be executed immediately without clarifying questions?

#### Immediately Executable (5 points)
- **5 pts**: All dependencies, file paths, commands, context present
- **3 pts**: Most info present, 1-2 minor missing details
- **1 pt**: Major missing info (which file? which method?)
- **0 pts**: Cannot start without questions

**Examples**:
- ✅ "In lib/services/ml_service.dart:156, add: if (_session == null) throw ModelNotLoadedException();" (5 pts)
- ❌ "Fix the error" (0 pts)

#### Tool Usage (5 points)
- **5 pts**: Specific commands with flags (flutter test test/services/ml_service_test.dart --coverage)
- **3 pts**: Commands but no flags (flutter test)
- **1 pt**: Mentioned tool but no command
- **0 pts**: No tools mentioned

**Examples**:
- ✅ "cd board_game_scorer && flutter pub run build_runner build --delete-conflicting-outputs" (5 pts)
- ❌ "Run the tests" (0 pts)

#### Success Criteria (5 points)
- **5 pts**: Clear validation method with expected output (flutter analyze: 0 errors, test coverage >80%)
- **3 pts**: Validation method but vague (tests pass)
- **1 pt**: Mentioned verification but no method
- **0 pts**: No success criteria

**Examples**:
- ✅ "Verify: flutter analyze reports 0 errors, flutter test shows 12/12 passed, coverage >80%" (5 pts)
- ❌ "Make sure it works" (0 pts)

---

## Total Score Interpretation

### 95-100: Exceptional
- **Characteristics**: Complete EasyBoard context, XML structured, all 5 criteria met, 3+ examples, specific commands
- **Example**: "Implement dark mode" enhanced prompt (92/100 example)

### 85-94: Excellent
- **Characteristics**: Strong EasyBoard context, XML structured, most criteria met, actionable
- **Example**: "Fix camera crash" enhanced prompt (88/100 example)

### 70-84: Good
- **Characteristics**: Some EasyBoard context, partial XML, actionable but missing details
- **Needs**: Add file paths, tech stack, edge cases

### 50-69: Fair
- **Characteristics**: Minimal context, no XML, vague verbs
- **Needs**: Major enhancement with all 5 principles

### < 50: Poor
- **Characteristics**: Vague, no context, no structure
- **Action**: Requires complete rewrite using templates

---

## Quick Scoring Checklist

**Before submitting a prompt, check:**

### Clarity (25 pts)
- [ ] Strong action verb? (Refactor, Analyze, Implement)
- [ ] File path with line number? (`lib/services/ml_service.dart:156`)
- [ ] Quantifiable target? (<150ms, >80%, 0 errors)
- [ ] 5+ technical terms? (Flutter, Riverpod, Isar, YOLO11, ONNX)
- [ ] Zero vague words? (no "maybe", "somehow", "better")

### Context (25 pts)
- [ ] EasyBoard architecture mentioned? (DI, service-oriented, Strategy Pattern)
- [ ] Tech stack with versions? (Flutter 3.24, Riverpod 2.4.9, Isar 3.1.0)
- [ ] Error details? (message + symptom + reproduction)
- [ ] 3+ edge cases? (null, empty, error scenarios)

### Structure (20 pts)
- [ ] XML tags? (`<task>`, `<context>`, `<instructions>`, `<output_format>`)
- [ ] Numbered sequential steps? (1, 2, 3...)
- [ ] Explicit output format with sub-tags?

### Techniques (15 pts)
- [ ] Chain of Thought for complex tasks? (`<thinking>` tags)
- [ ] 3+ ❌/✅ examples?
- [ ] Quote extraction for long files? (>200 lines)

### Actionability (15 pts)
- [ ] All info present? (no missing dependencies)
- [ ] Specific commands with flags? (flutter pub run build_runner...)
- [ ] Clear success criteria? (flutter analyze: 0 errors)

**Target**: 85+ points (70+ minimum for auto-pass)

---

## Common Scoring Mistakes

### Mistake 1: Generic Placeholders
```
❌ "Add {{YOUR_FEATURE}} to {{YOUR_APP}}"
Score: -10 points (not EasyBoard-specific)

✅ "Add dark mode to EasyBoard's SettingsScreen using Riverpod ThemeModeNotifier"
Score: Full points
```

### Mistake 2: Missing Tech Stack
```
❌ "Optimize the database query"
Score: -6 points (no Isar version, no performance target)

✅ "Optimize Isar 3.1.0 query in history_service.dart:45-67 from 850ms to <100ms using @Index()"
Score: Full points
```

### Mistake 3: No XML Structure
```
❌ Plain paragraph: "Fix the bug in MLService by adding null checks and error handling, then test it"
Score: -7 points (no XML tags)

✅ <task>Fix NullPointerException</task>
<context>...</context>
<instructions>1. Add null check\n2. Add error handling</instructions>
<output_format>...</output_format>
Score: Full points
```

### Mistake 4: Vague Success Criteria
```
❌ "Make sure it works"
Score: -5 points (no validation method)

✅ "Verify: flutter analyze (0 errors), flutter test (all pass), manual test (no crash when tapping capture before init)"
Score: Full points
```

---

## Automated Scoring Formula

```python
def score_prompt(prompt: str) -> int:
    clarity = (
        action_verb_score(prompt) +          # 5 pts
        file_path_score(prompt) +            # 5 pts
        quantifiable_criteria_score(prompt) + # 5 pts
        technical_terms_score(prompt) +      # 5 pts
        vague_words_penalty(prompt)          # 5 pts
    )  # Max 25

    context = (
        project_context_score(prompt) +      # 7 pts
        tech_stack_score(prompt) +           # 6 pts
        error_details_score(prompt) +        # 6 pts
        edge_cases_score(prompt)             # 6 pts
    )  # Max 25

    structure = (
        xml_tags_score(prompt) +             # 7 pts
        sequential_steps_score(prompt) +     # 7 pts
        output_format_score(prompt)          # 6 pts
    )  # Max 20

    techniques = (
        chain_of_thought_score(prompt) +     # 5 pts
        few_shot_examples_score(prompt) +    # 5 pts
        quote_grounding_score(prompt)        # 5 pts
    )  # Max 15

    actionability = (
        immediately_executable_score(prompt) + # 5 pts
        tool_usage_score(prompt) +           # 5 pts
        success_criteria_score(prompt)       # 5 pts
    )  # Max 15

    return clarity + context + structure + techniques + actionability  # Max 100
```

---

## EasyBoard-Specific Scoring Bonuses

### Bonus Points (Max +5 beyond 100)
- **+2**: References SPRINTS_KNOWLEDGE_BASE.md or CLAUDE.md
- **+1**: Mentions existing EasyBoard pattern (DatabaseService, PelusasScoringStrategy)
- **+1**: Includes LoggingService usage
- **+1**: Follows constructor DI pattern

**Note**: Bonuses can push score to 105/100 for exceptional prompts, but 100 is the reported max.

---

**Last Updated**: 2025-10-21
**Version**: 1.0.0
**For**: EasyBoard (Flutter 3.24, Riverpod 2.4.9, Isar 3.1.0, YOLO11, ONNX Runtime 1.22.0)
