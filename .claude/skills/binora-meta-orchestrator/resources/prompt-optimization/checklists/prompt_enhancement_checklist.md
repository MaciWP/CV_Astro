# Prompt Enhancement Checklist

**Use this checklist before submitting any prompt for EasyBoard development**

---

## 🎯 Pre-Submission Checklist (30 items)

### Section 1: Clarity & Specificity (5 items)

- [ ] **Action Verb**: Does the prompt use a strong action verb?
  - ✅ Refactor, Analyze, Implement, Optimize, Diagnose
  - ❌ Fix, Look at, Try to, Make better

- [ ] **File Path**: Is the file path absolute and specific?
  - ✅ `lib/services/ml_service.dart:156`
  - ✅ `lib/screens/camera_screen.dart:234-250`
  - ❌ "ml_service.dart" or "the ML file"

- [ ] **Quantifiable Criteria**: Are targets measurable?
  - ✅ "<150ms inference", ">80% coverage", "0 flutter analyze errors"
  - ❌ "faster", "better", "more"

- [ ] **Technical Terms**: Does it use 5+ domain-specific terms?
  - ✅ Flutter, Riverpod, Isar, YOLO11, ONNX, NCHW, NMS, DI, Strategy Pattern
  - ❌ "app", "code", "function" only

- [ ] **No Vague Words**: Zero instances of vague language?
  - ❌ "maybe", "somehow", "various", "stuff", "things", "better", "improve"
  - ✅ Specific, concrete language throughout

---

### Section 2: Context & Domain (7 items)

- [ ] **EasyBoard Architecture**: Mentions service-oriented architecture?
  - ✅ Constructor DI, service layer, Strategy Pattern, Repository Pattern
  - ❌ Generic "MVC" or no pattern mentioned

- [ ] **Tech Stack with Versions**: Specifies packages and versions?
  - ✅ Flutter 3.24, Riverpod 2.4.9, Isar 3.1.0, ONNX Runtime 1.22.0
  - ❌ "Flutter" only or no versions

- [ ] **Error Details**: Includes error message + symptom + reproduction?
  - ✅ "Null check operator used on null value - cameraController.value. App crashes when tapping capture before init. Reproducible: open CameraScreen, tap immediately"
  - ❌ "There's an error" or "it crashes"

- [ ] **Edge Cases**: Lists 3+ edge cases with handling strategy?
  - ✅ Null input, empty list, database closed, session timeout, network unavailable
  - ❌ No edge cases mentioned

- [ ] **Current State**: Describes what exists now?
  - ✅ "Currently MLService loads model on each inference (250ms overhead)"
  - ❌ No baseline or current implementation described

- [ ] **EasyBoard Files Referenced**: Mentions existing files for patterns?
  - ✅ "Similar to DatabaseService constructor DI pattern"
  - ✅ "Following PelusasScoringStrategy example"
  - ❌ No reference to existing code

- [ ] **Performance Targets**: Specific to EasyBoard constraints?
  - ✅ <150ms ML inference, >80% test coverage, <100ms Isar queries
  - ❌ Generic "fast" or "high coverage"

---

### Section 3: XML Structure (4 items)

- [ ] **All XML Tags Present**: Uses 4 required tags?
  - ✅ `<task>`, `<context>`, `<instructions>`, `<output_format>`
  - ❌ Plain text or missing tags

- [ ] **Numbered Sequential Steps**: Instructions are numbered 1, 2, 3...?
  - ✅ "1. Add null check\n2. Show SnackBar\n3. Add unit test"
  - ❌ Paragraph prose or unordered bullets

- [ ] **Nested Context Tags**: Context uses sub-tags?
  - ✅ `<file>`, `<error>`, `<tech_stack>`, `<requirements>`
  - ❌ Plain text inside `<context>`

- [ ] **Structured Output Format**: Output format has sub-tags with descriptions?
  - ✅ `<fix>Complete code</fix>`, `<test>Unit test</test>`, `<verification>Steps</verification>`
  - ❌ "Give me the code" or no structure

---

### Section 4: Advanced Techniques (3 items)

- [ ] **Chain of Thought**: For complex tasks (ML, architecture, strategies)?
  - ✅ `<thinking>1. Analyze components\n2. Design mapping\n3. Edge cases\n4. Implementation</thinking>`
  - ❌ Direct request without reasoning steps
  - **When to use**: ML inference, scoring strategies, architecture refactoring, multi-step features

- [ ] **Few-Shot Examples**: Includes 3+ ❌/✅ comparisons?
  - ✅ Three or more before/after code examples showing anti-pattern vs correct pattern
  - ❌ No examples or only 1-2 examples
  - **When to use**: Teaching patterns (DI, error handling, testing), preventing anti-patterns

- [ ] **Quote Grounding**: For long files (>200 lines), extracts quotes first?
  - ✅ "Step 1: Extract all service instantiation quotes with `<quote line='X-Y'>`. Step 2: Analyze each quote"
  - ❌ Direct analysis without quote extraction
  - **When to use**: Code review, architecture analysis, refactoring large files

---

### Section 5: Actionability (6 items)

- [ ] **All Dependencies Specified**: Packages, versions, imports clear?
  - ✅ "shared_preferences 2.2.2, import 'package:flutter/material.dart' for ThemeMode"
  - ❌ "Use some storage library"

- [ ] **Commands with Flags**: Full commands, not just tool names?
  - ✅ `cd board_game_scorer && flutter pub run build_runner build --delete-conflicting-outputs`
  - ❌ "Run build runner"

- [ ] **Success Criteria**: Clear validation with expected output?
  - ✅ "flutter analyze: 0 errors, flutter test: 12/12 passed, coverage >80%"
  - ❌ "Make sure it works"

- [ ] **Test Strategy**: Unit tests with MockServices specified?
  - ✅ "Create MockCameraService with isInitialized = false, verify graceful handling"
  - ❌ "Add tests" without specifics

- [ ] **Manual Verification Steps**: Step-by-step manual testing?
  - ✅ "1. Open CameraScreen\n2. Tap capture immediately\n3. Verify SnackBar\n4. Verify no crash"
  - ❌ "Test it manually"

- [ ] **Immediately Executable**: Can developer start without clarifying questions?
  - ✅ All file paths, methods, line numbers, commands, dependencies present
  - ❌ Missing critical info (which file? which method? which package?)

---

### Section 6: EasyBoard Specificity (5 items) - CRITICAL

- [ ] **Zero Generic Placeholders**: No {{YOUR_PROJECT}}, {{YOUR_FRAMEWORK}}?
  - ✅ "EasyBoard", "lib/services/ml_service.dart", "Riverpod 2.4.9"
  - ❌ "{{YOUR_APP}}", "{{SERVICE_FILE}}", "{{STATE_LIBRARY}}"

- [ ] **EasyBoard-Specific Examples**: All examples use real EasyBoard code?
  - ✅ "MLService.detectObjects()", "CameraScreen.takePicture()", "PelusasScoringStrategy"
  - ❌ Generic "Service.method()" or invented code

- [ ] **EasyBoard Patterns Referenced**: Mentions project-specific patterns?
  - ✅ Constructor DI (service ?? RealService()), Result<T> error handling, LoggingService.data()
  - ❌ Generic patterns without EasyBoard adaptation

- [ ] **EasyBoard Docs Referenced**: Links to CLAUDE.md, SPRINTS_KNOWLEDGE_BASE.md?
  - ✅ "See SPRINTS_KNOWLEDGE_BASE.md DI anti-patterns section"
  - ✅ "Reference CLAUDE.md Architecture section"
  - ❌ No doc references

- [ ] **EasyBoard Constraints Applied**: Uses project-specific targets?
  - ✅ <150ms ML inference (ONNX Runtime), <100ms Isar queries, >80% coverage
  - ❌ Generic "fast" or made-up targets

---

## 🎯 Scoring Quick Reference

| Section | Max Points | Target |
|---------|------------|--------|
| Clarity & Specificity | 25 | 20+ |
| Context & Domain | 25 | 20+ |
| XML Structure | 20 | 16+ |
| Advanced Techniques | 15 | 10+ |
| Actionability | 15 | 12+ |
| **TOTAL** | **100** | **85+** |

**Auto-pass threshold**: 70+ points
**Target for quality**: 85+ points
**Exceptional**: 95+ points

---

## 🚫 Common Failures (Auto-Reject)

### Immediate Red Flags (Score < 30)

1. **No file path** - "Fix the camera code" → Rejected
2. **No error details** - "There's a bug" → Rejected
3. **Vague verb** - "Look at the ML service" → Rejected
4. **No tech stack** - "Optimize the query" → Rejected
5. **Generic placeholders** - "Add {{FEATURE}} to {{APP}}" → Rejected

---

## ✅ Before/After Example

### ❌ BEFORE (Score: 22/100)
```
"Fix the camera crash"
```

**Issues**:
- No file path (0/5)
- No error message (0/6)
- Vague verb "fix" (1/5)
- No tech stack (0/6)
- No structure (0/20)
- No examples (0/5)
- Vague success criteria (0/5)

### ✅ AFTER (Score: 88/100)
```xml
<task>Fix NullPointerException in CameraScreen.takePicture() when cameraController is not initialized</task>

<context>
  <file>lib/screens/camera_screen.dart:234</file>
  <error>Null check operator used on null value - cameraController.value</error>
  <symptom>App crashes when user taps capture button before camera initializes</symptom>
  <tech_stack>Flutter 3.24, camera 0.11.0, Riverpod 2.4.9</tech_stack>
  <when_occurs>Reproducible: tap capture immediately after opening CameraScreen</when_occurs>
</context>

<instructions>
1. Add null safety check: if (!cameraController.value.isInitialized) return;
2. Show SnackBar with "Camera initializing..." message
3. Disable capture button until isInitialized == true
4. Add unit test: MockCameraService with isInitialized = false
5. Verify with flutter test test/screens/camera_screen_test.dart
</instructions>

<output_format>
<fix>Complete code with null check and UI feedback</fix>
<test>Unit test verifying graceful handling</test>
<verification>flutter analyze (0 errors), manual test (no crash)</verification>
</output_format>
```

**Improvements**:
- File path: lib/screens/camera_screen.dart:234 (5/5)
- Error message: Full exception (6/6)
- Action verb: "Fix" → specific error type (4/5)
- Tech stack: 3 packages with versions (6/6)
- XML structure: All tags (20/20)
- Success criteria: flutter analyze, flutter test, manual (5/5)
- **Total improvement**: +66 points

---

## 🔄 Enhancement Workflow

### Step 1: Run Checklist (5 min)
- Check all 30 items above
- Calculate estimated score

### Step 2: If Score < 70 → Enhance
- Add missing file paths
- Add tech stack with versions
- Add XML structure
- Add success criteria
- Add EasyBoard-specific context

### Step 3: Re-Check (2 min)
- Verify all 30 items pass
- Target: 85+ points

### Step 4: Submit
- Submit enhanced prompt
- Expect high-quality, EasyBoard-specific response

---

## 📚 Resources

| Resource | When to Use |
|----------|-------------|
| `examples/fix_null_pointer_camera_example.md` | Bug fixes (null safety, errors) |
| `examples/feature_dark_mode_example.md` | Feature implementation (dark mode, premium, export) |
| `templates/bug_fix_template.xml` | Template for bug fix prompts |
| `templates/feature_implementation_template.xml` | Template for feature prompts |
| `references/prompt_quality_scoring_guide.md` | Detailed scoring breakdown |

---

**Last Updated**: 2025-10-21
**Version**: 1.0.0
**Target Completion Time**: 5-7 minutes per prompt enhancement