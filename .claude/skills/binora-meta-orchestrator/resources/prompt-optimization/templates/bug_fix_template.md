# Bug Fix Template

**Use this template for ANY bug report to achieve ≥85/100 prompt quality**

---

```xml
<task>Fix {{SYMPTOM}} in {{COMPONENT_NAME}}.{{METHOD_NAME}}() when {{TRIGGER_CONDITION}}</task>

<context>
  <file>{{FILE_PATH}}:{{LINE_NUMBER}}</file>
  <error>
    ```
    {{ERROR_MESSAGE}}
    {{STACK_TRACE}}
    ```
  </error>
  <symptom>{{OBSERVABLE_BEHAVIOR}}</symptom>
  <tech_stack>{{FRAMEWORK}} {{VERSION}}, {{LIBRARIES}}</tech_stack>
  <when_occurs>{{FREQUENCY}} - {{REPRODUCIBILITY}}</when_occurs>
  <reproduction_steps>
    1. {{STEP_1}}
    2. {{STEP_2}}
    3. {{STEP_3}}
    4. {{EXPECTED_VS_ACTUAL}}
  </reproduction_steps>
  <environment>
    <os>{{OS}} {{VERSION}}</os>
    <device>{{DEVICE_NAME}}</device>
    <conditions>{{SPECIAL_CONDITIONS}}</conditions>
  </environment>
</context>

<instructions>
1. Read {{FILE_PATH}}:{{LINE_RANGE}} ({{METHOD_NAME}} method)
2. Identify root cause:
   - {{POTENTIAL_CAUSE_1}}?
   - {{POTENTIAL_CAUSE_2}}?
   - {{POTENTIAL_CAUSE_3}}?
3. Implement fix with defensive programming:
   - {{FIX_APPROACH_1}}
   - {{FIX_APPROACH_2}}
   - Add error handling: try-catch with logging
4. Test fix:
   - {{TEST_SCENARIO_1}}
   - {{TEST_SCENARIO_2}}
   - Verify no regression
5. Add logging:
   - {{LOGGING_FRAMEWORK}}.error('{{COMPONENT}}', '{{ERROR_CONTEXT}}', exception)
</instructions>

<output_format>
<root_cause>
  <location>{{FILE}}:{{LINES}}</location>
  <issue>{{PRECISE_TECHNICAL_EXPLANATION}}</issue>
  <why_it_happens>{{UNDERLYING_REASON}}</why_it_happens>
</root_cause>

<fix>
  <file>{{FILE_PATH}}</file>
  <changes>
    ```{{LANGUAGE}}
    // ❌ BEFORE (buggy code)
    {{ORIGINAL_CODE}}

    // ✅ AFTER (fixed code)
    {{FIXED_CODE_WITH_COMMENTS}}
    ```
  </changes>
  <explanation>{{WHY_THIS_FIXES_IT}}</explanation>
  <edge_cases_addressed>
    - {{EDGE_CASE_1}}
    - {{EDGE_CASE_2}}
  </edge_cases_addressed>
</fix>

<test_results>
  <test name="{{TEST_NAME_1}}">
    {{PASS/FAIL}} - {{DESCRIPTION}}
  </test>
  <test name="{{TEST_NAME_2}}">
    {{PASS/FAIL}} - {{DESCRIPTION}}
  </test>
  <regression_tests>
    {{LIST_OF_EXISTING_FUNCTIONALITY_VERIFIED}}
  </regression_tests>
</test_results>

<verification>
  - [ ] Bug no longer reproducible
  - [ ] Error logging added
  - [ ] Edge cases handled
  - [ ] No performance regression
  - [ ] Code linter passes
</verification>
</output_format>
```

---

## 📝 Slot Descriptions

### Required Slots
- `{{SYMPTOM}}`: Observable problem (NullPointerException, crash, incorrect value)
- `{{COMPONENT_NAME}}`: Class/module name (MLService, UserController, AuthMiddleware)
- `{{METHOD_NAME}}`: Function name (detectObjects, login, validateToken)
- `{{TRIGGER_CONDITION}}`: What causes the bug (model file missing, invalid input, race condition)
- `{{FILE_PATH}}`: Absolute path to file (lib/services/ml_service.dart, src/auth/middleware.js)
- `{{LINE_NUMBER}}`: Specific line or range (156, 45-67)
- `{{ERROR_MESSAGE}}`: Exact error text from logs
- `{{STACK_TRACE}}`: Full stack trace (if available)

### Context Slots
- `{{OBSERVABLE_BEHAVIOR}}`: What user sees (App crashes, Login fails, Data corrupted)
- `{{FRAMEWORK}}`: Main framework (Flutter, React, Express, Django)
- `{{VERSION}}`: Framework version (3.24.0, 18.2.0, 4.18.0)
- `{{LIBRARIES}}`: Relevant dependencies (ONNX Runtime 1.22.0, jsonwebtoken 9.0)
- `{{FREQUENCY}}`: How often (100% reproducible, 20% random, once per session)
- `{{REPRODUCIBILITY}}`: Ease of reproduction (Always, Sometimes, Intermittent)

### Instruction Slots
- `{{LINE_RANGE}}`: Lines to analyze (150-170, entire function)
- `{{POTENTIAL_CAUSE_N}}`: Hypotheses to investigate
- `{{FIX_APPROACH_N}}`: Proposed solutions
- `{{TEST_SCENARIO_N}}`: Verification steps

### Output Slots
- `{{LANGUAGE}}`: Code language for syntax highlighting (dart, javascript, python)
- `{{ORIGINAL_CODE}}`: Buggy code snippet
- `{{FIXED_CODE_WITH_COMMENTS}}`: Corrected code with inline explanations

---

## ✅ Example Usage

**Filled Template** (Flutter Bug):
```xml
<task>Fix NullPointerException in MLService.detectObjects() when ONNX model fails to load</task>

<context>
  <file>lib/services/ml_service.dart:156</file>
  <error>
    ```
    Null check operator used on null value
    at MLService.detectObjects (ml_service.dart:156)
    ```
  </error>
  <symptom>App crashes when switching games if ONNX model file is missing</symptom>
  <tech_stack>Flutter 3.24.0, ONNX Runtime 1.22.0, YOLO11 nano</tech_stack>
  <when_occurs>100% reproducible when model file deleted, 20% random on game switch</when_occurs>
  <reproduction_steps>
    1. Delete assets/models/pelusas.onnx
    2. Navigate to GamesScreen
    3. Select Pelusas game
    4. Tap "New Match"
    5. Expected: Graceful error. Actual: App crashes.
  </reproduction_steps>
  <environment>
    <os>Android 12</os>
    <device>Pixel 6</device>
    <conditions>Debug and release builds affected</conditions>
  </environment>
</context>
<!-- Instructions and output follow template structure -->
```

---

## 🎯 Scoring Impact

Using this template typically achieves:
- Clarity: 23-25/25
- Context: 23-25/25
- Structure: 18-20/20
- Techniques: 8-12/15 (add CoT for +3-7)
- Actionability: 14-15/15

**Expected Score**: 86-97/100 (Excellent to Exceptional)
