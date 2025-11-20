# Feature Request Template

**Use this template for ANY feature implementation to achieve ≥85/100 prompt quality**

---

```xml
<task>Implement {{FEATURE_NAME}} with {{KEY_CHARACTERISTIC_1}} and {{KEY_CHARACTERISTIC_2}}</task>

<context>
  <framework>{{FRAMEWORK}} {{VERSION}}</framework>
  <state_management>{{STATE_LIBRARY}} ({{PATTERN}})</state_management>
  <storage>{{DATABASE/STORAGE_SOLUTION}}</storage>
  <design_system>{{UI_FRAMEWORK}} ({{DESIGN_PHILOSOPHY}})</design_system>
  <requirements>
    - {{REQUIREMENT_1}}
    - {{REQUIREMENT_2}}
    - {{REQUIREMENT_3}}
    - {{REQUIREMENT_4}}
    - {{REQUIREMENT_5}}
  </requirements>
  <affected_files>
    - {{FILE_1}} ({{PURPOSE_1}}) [{{CREATE_NEW | MODIFY}}]
    - {{FILE_2}} ({{PURPOSE_2}}) [{{CREATE_NEW | MODIFY}}]
    - {{FILE_3}} ({{PURPOSE_3}}) [{{CREATE_NEW | MODIFY}}]
  </affected_files>
  <acceptance_criteria>
    - [ ] {{CRITERION_1}}
    - [ ] {{CRITERION_2}}
    - [ ] {{CRITERION_3}}
  </acceptance_criteria>
</context>

<instructions>
1. Create {{NEW_FILE_1}}:
   ```{{LANGUAGE}}
   {{CODE_SNIPPET_OR_STRUCTURE}}
   ```

2. {{CREATE | UPDATE}} {{FILE_2}} with {{STATE_MANAGEMENT_PATTERN}}:
   ```{{LANGUAGE}}
   {{CODE_EXAMPLE}}
   ```

3. Update {{MAIN_FILE}}:
   ```{{LANGUAGE}}
   {{INTEGRATION_CODE}}
   ```

4. Add {{UI_COMPONENT}} in {{SCREEN_FILE}}:
   ```{{LANGUAGE}}
   {{UI_CODE}}
   ```

5. Run code generation (if applicable):
   ```bash
   {{BUILD_COMMAND}}
   ```

6. Test {{FEATURE_NAME}} on {{TEST_SCENARIOS}}:
   - {{SCENARIO_1}}
   - {{SCENARIO_2}}
   - {{SCENARIO_3}}

7. Verify {{QUALITY_CHECKS}}:
   - {{CHECK_1}}
   - {{CHECK_2}}

8. Run linter:
   ```bash
   {{LINT_COMMAND}}
   ```
</instructions>

<output_format>
<implementation>
  <new_files>
    <file path="{{PATH_1}}">
      ```{{LANGUAGE}}
      // Complete implementation
      {{FULL_CODE}}
      ```
    </file>
    <file path="{{PATH_2}}">
      ```{{LANGUAGE}}
      {{FULL_CODE}}
      ```
    </file>
  </new_files>

  <modified_files>
    <file path="{{PATH}}">
      ```{{LANGUAGE}}
      // Changes (show diff or new code)
      {{CODE_CHANGES}}
      ```
    </file>
  </modified_files>

  <database_changes>
    {{MIGRATIONS | SCHEMA_UPDATES | N/A}}
  </database_changes>
</implementation>

<testing_results>
  <manual_tests>
    - [{{✓ | ✗}}] {{TEST_DESCRIPTION_1}}
    - [{{✓ | ✗}}] {{TEST_DESCRIPTION_2}}
    - [{{✓ | ✗}}] {{TEST_DESCRIPTION_3}}
  </manual_tests>

  <accessibility_validation>
    - [{{✓ | ✗}}] {{ACCESSIBILITY_CHECK_1}}
    - [{{✓ | ✗}}] {{ACCESSIBILITY_CHECK_2}}
  </accessibility_validation>

  <performance_validation>
    - [{{✓ | ✗}}] {{PERFORMANCE_METRIC_1}}: {{ACTUAL}} (target: {{TARGET}})
    - [{{✓ | ✗}}] {{PERFORMANCE_METRIC_2}}: {{ACTUAL}} (target: {{TARGET}})
  </performance_validation>

  <code_quality>
    - [{{✓ | ✗}}] {{LINTER}}: {{ERRORS}} errors, {{WARNINGS}} warnings
    - [{{✓ | ✗}}] {{PERFORMANCE_CHECK}}: {{RESULT}}
  </code_quality>
</testing_results>

<documentation>
  <user_facing>
    {{HOW_TO_USE_NEW_FEATURE}}
  </user_facing>
  <developer_notes>
    {{IMPLEMENTATION_NOTES}}
    {{KNOWN_LIMITATIONS}}
  </developer_notes>
</documentation>
</output_format>
```

---

## 📝 Slot Descriptions

### Required Slots
- `{{FEATURE_NAME}}`: Descriptive name (Dark Mode, Player Statistics Dashboard, JWT Authentication)
- `{{KEY_CHARACTERISTIC_N}}`: Defining features (persistent preference, real-time updates, WCAG AA compliance)
- `{{FRAMEWORK}}`: Main framework (Flutter, React, Express, Django, FastAPI)
- `{{VERSION}}`: Framework version
- `{{STATE_LIBRARY}}`: State management (Riverpod, Redux, Vuex, Context API, Pinia)
- `{{PATTERN}}`: State pattern (Provider, Hooks, Composition API, Notifier)

### Context Slots
- `{{DATABASE/STORAGE_SOLUTION}}`: Where data lives (Isar, PostgreSQL, MongoDB, LocalStorage, SharedPreferences)
- `{{UI_FRAMEWORK}}`: UI library (Material Design 3, Ant Design, Tailwind CSS, Bootstrap)
- `{{DESIGN_PHILOSOPHY}}`: Design principles (Mobile-first, Accessibility-first, Performance-first)
- `{{REQUIREMENT_N}}`: Specific requirements (numbered list)
- `{{FILE_N}}`: Affected files with purpose
- `{{PURPOSE_N}}`: Why file is affected
- `{{CRITERION_N}}`: Acceptance criteria (testable conditions)

### Instruction Slots
- `{{NEW_FILE_N}}`: Files to create
- `{{CODE_SNIPPET_OR_STRUCTURE}}`: Skeleton or pseudocode
- `{{STATE_MANAGEMENT_PATTERN}}`: Specific pattern (Provider, HOC, Mixin)
- `{{CODE_EXAMPLE}}`: Working code snippet
- `{{INTEGRATION_CODE}}`: How pieces connect
- `{{UI_CODE}}`: Visual component code
- `{{BUILD_COMMAND}}`: Build system command (flutter pub run build_runner, npm run build)
- `{{LINT_COMMAND}}`: Linter command (flutter analyze, npm run lint, pylint)

### Output Slots
- `{{LANGUAGE}}`: Syntax highlighting (dart, javascript, typescript, python, jsx, tsx)
- `{{FULL_CODE}}`: Complete file implementation
- `{{CODE_CHANGES}}`: Diff or modified sections
- `{{MIGRATIONS}}`: Database migration scripts
- `{{TEST_DESCRIPTION_N}}`: What was tested
- `{{ACCESSIBILITY_CHECK_N}}`: WCAG, semantic HTML, ARIA labels
- `{{PERFORMANCE_METRIC_N}}`: Load time, bundle size, FPS, latency
- `{{ACTUAL}}`: Measured value
- `{{TARGET}}`: Target value

---

## ✅ Example Usage

**Filled Template** (React Feature):
```xml
<task>Implement Dark Mode toggle with persistent localStorage and smooth transitions</task>

<context>
  <framework>React 18.2.0</framework>
  <state_management>Context API (useContext + useReducer)</state_management>
  <storage>LocalStorage (for theme persistence)</storage>
  <design_system>Tailwind CSS 3.3 (dark: variant for dark mode)</design_system>
  <requirements>
    - Toggle in Settings page (Switch component)
    - Persist choice across sessions
    - Smooth color transitions (transition-colors duration-300)
    - Support system preference detection (prefers-color-scheme)
    - Update all components automatically
  </requirements>
  <affected_files>
    - src/contexts/ThemeContext.tsx (theme state management) [CREATE NEW]
    - src/App.tsx (provider integration) [MODIFY]
    - src/pages/Settings.tsx (toggle UI) [MODIFY]
    - tailwind.config.js (dark mode config) [MODIFY]
  </affected_files>
  <acceptance_criteria>
    - [ ] Toggle changes theme instantly
    - [ ] Theme persists after page reload
    - [ ] System preference detected on first visit
    - [ ] All pages render correctly in both modes
  </acceptance_criteria>
</context>
<!-- Instructions follow template structure -->
```

---

## 🎯 Scoring Impact

Using this template typically achieves:
- Clarity: 24-25/25
- Context: 24-25/25
- Structure: 19-20/20
- Techniques: 9-13/15 (add examples for +4)
- Actionability: 15/15

**Expected Score**: 91-98/100 (Excellent to Exceptional)
