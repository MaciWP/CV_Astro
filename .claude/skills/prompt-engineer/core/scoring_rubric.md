# Scoring Rubric (0-100 Points)

Detailed criteria for evaluating prompt quality.

---

## 1. Clarity & Specificity (0-25 points)

### Action Verbs (5 pts)
- **5 pts**: Specific action verbs ("Refactor", "Optimize", "Implement", "Fix", "Add")
- **3 pts**: Generic verbs ("Update", "Change", "Modify")
- **1 pt**: Vague verbs ("Look at", "Check", "See if")
- **0 pts**: No clear action ("The code", "About the tests")

### File Paths/Lines (5 pts)
- **5 pts**: Absolute paths with line numbers (`apps/core/services.py:120-145`)
- **4 pts**: Absolute paths without lines (`apps/core/services.py`)
- **2 pts**: Partial paths (`services.py`, `core/services`)
- **0 pts**: No file paths

### Quantifiable Criteria (5 pts)
- **5 pts**: Specific metrics ("<200ms", ">95% coverage", "reduce from 501 to 1 query")
- **3 pts**: Directional targets ("faster", "better coverage", "fewer queries")
- **1 pt**: Vague goals ("improve", "optimize")
- **0 pts**: No success criteria

### Technical Terms (5 pts)
- **5 pts**: Specific tech stack with versions ("Django 5.0", "DRF 3.14", "PostgreSQL 14")
- **3 pts**: Tech stack without versions ("Django", "DRF", "PostgreSQL")
- **1 pt**: Generic terms ("database", "API", "framework")
- **0 pts**: No technical context

### No Vague Words (5 pts)
- **5 pts**: Zero vague words
- **3 pts**: 1-2 vague words ("maybe", "somehow")
- **1 pt**: 3-4 vague words
- **0 pts**: 5+ vague words or critical vagueness ("fix it", "make better")

**Vague words list**: somehow, maybe, various, some, a few, stuff, things, better, improve, optimize (without metrics), fix (without specifics)

---

## 2. Context & Domain (0-25 points)

### Project Architecture (7 pts)
- **7 pts**: Architecture explicitly stated ("Multi-tenant middleware", "Service layer pattern", "MVT Django")
- **4 pts**: Architecture implied ("services/", "ViewSet", "middleware")
- **1 pt**: Generic structure mentioned ("backend", "API")
- **0 pts**: No architecture context

### Tech Stack (6 pts)
- **6 pts**: Complete stack with versions (Django 5.0, DRF 3.14, PostgreSQL 14, pytest-django)
- **4 pts**: Main stack with versions (Django 5.0, DRF 3.14)
- **2 pts**: Main stack without versions (Django, DRF)
- **0 pts**: No tech stack mentioned

### Error Details (6 pts)
- **6 pts**: Error message + symptom + reproduction ("N+1 query: 501 queries, endpoint takes 2.5s, reproduce with curl /api/users/")
- **4 pts**: Error message + symptom ("N+1 query: endpoint takes 2.5s")
- **2 pts**: Error message only ("N+1 query detected")
- **0 pts**: No error details

### Edge Cases (6 pts)
- **6 pts**: 3+ edge cases mentioned ("null handling", "empty list", "duplicate entries", "boundary conditions")
- **4 pts**: 2 edge cases
- **2 pts**: 1 edge case
- **0 pts**: No edge cases

---

## 3. Structure (0-20 points)

### XML Tags (7 pts)
- **7 pts**: All tags present: `<task>`, `<context>`, `<instructions>`, `<output_format>`
- **5 pts**: 3/4 tags present
- **3 pts**: 2/4 tags present
- **1 pt**: 1/4 tags present
- **0 pts**: No XML tags (plain text)

### Sequential Steps (7 pts)
- **7 pts**: Numbered sequential steps (1, 2, 3...) with clear dependencies
- **5 pts**: Numbered steps without dependencies
- **3 pts**: Bulleted list
- **1 pt**: Paragraph format
- **0 pts**: No steps/structure

### Output Format (6 pts)
- **6 pts**: Explicit structure with sub-tags/examples (`<fix>...</fix>`, `<tests>...</tests>`)
- **4 pts**: Structure described in text ("Provide: fix, tests, verification")
- **2 pts**: Vague output ("Show me the result")
- **0 pts**: No output format specified

---

## 4. Advanced Techniques (0-15 points)

### Chain of Thought (5 pts)
- **5 pts**: `<thinking>` tags with multi-step reasoning for complex task
- **3 pts**: "Think step-by-step" instruction without tags
- **0 pts**: No CoT for complex task (appropriate for simple tasks)

### Few-Shot Examples (5 pts)
- **5 pts**: 3+ examples with ❌ WRONG vs ✅ CORRECT pattern
- **4 pts**: 2 examples with ❌/✅ pattern
- **2 pts**: 1 example or examples without ❌/✅ contrast
- **0 pts**: No examples (appropriate if not needed)

### Quote Grounding (5 pts)
- **5 pts**: Requests quote extraction FIRST for files >200 lines, with line numbers
- **3 pts**: Mentions specific file to read before analyzing
- **1 pt**: Generic "read the file"
- **0 pts**: No quote grounding for long files (or N/A for short files)

---

## 5. Actionability (0-15 points)

### Immediately Executable (5 pts)
- **5 pts**: All info present, no additional questions needed
- **3 pts**: 90% complete, 1 clarification needed
- **1 pt**: Multiple pieces missing
- **0 pts**: Cannot execute without significant clarification

### Tool Usage (5 pts)
- **5 pts**: Specific commands with flags (`pytest --cov=apps.core apps/core/tests/ -v`)
- **3 pts**: Commands without flags (`pytest`)
- **1 pt**: Tool mentioned without command ("run tests")
- **0 pts**: No tools/commands specified

### Success Criteria (5 pts)
- **5 pts**: Clear validation method with expected output ("Coverage report shows 100%", "Response time <200ms")
- **3 pts**: Validation method without expected output ("Check coverage", "Test performance")
- **1 pt**: Vague validation ("Make sure it works")
- **0 pts**: No validation specified

---

## Score Interpretation

| Range | Quality | Action |
|-------|---------|--------|
| **95-100** | Excellent | No enhancement needed, perfect prompt |
| **85-94** | Good | Minor tweaks, meets target |
| **70-84** | Acceptable | Some enhancement beneficial |
| **50-69** | Poor | **Enhancement required** |
| **0-49** | Critical | **Major enhancement required** |

**Auto-Activate Threshold**: <70/100

**Target After Enhancement**: ≥85/100

---

## Example Scoring

### Example 1: "Fix the tests"

- **Clarity (5/25)**: "Fix" (1), no file (0), no criteria (0), no tech (0), vague (1)
- **Context (0/25)**: No architecture, no stack, no errors, no edge cases
- **Structure (3/20)**: No XML (0), no steps (1), vague output (2)
- **Techniques (0/15)**: No CoT, no examples, no quotes
- **Actionability (1/15)**: Not executable (0), vague "tests" (1), no validation (0)

**Total: 9/100** → CRITICAL, needs major enhancement

### Example 2: Enhanced Version

```xml
<task>Fix 3 failing unit tests in UserViewSet create() action</task>

<context>
  <file>apps/core/tests/user_views_tests.py</file>
  <failing_tests>
    - test_create_user_with_invalid_email (line 45)
    - test_create_user_without_company (line 67)
    - test_create_user_duplicate_email (line 89)
  </failing_tests>
  <tech_stack>Django 5.0, DRF 3.14, pytest-django 4.5</tech_stack>
  <error>AssertionError: Expected 400, got 500 for invalid email</error>
</context>

<instructions>
1. Run: pytest apps/core/tests/user_views_tests.py::test_create_user_with_invalid_email -v
2. Identify root cause: validation error not caught in serializer
3. Update UserInputSerializer to validate email format
4. Re-run all 3 tests: pytest apps/core/tests/user_views_tests.py -k "test_create_user" -v
5. Verify coverage maintained: pytest --cov=apps.core.views apps/core/tests/ --cov-report=term-missing
6. Target: 100% coverage, all tests green
</instructions>

<output_format>
  <fix>UserInputSerializer changes with email validation</fix>
  <tests>Pytest output showing 3/3 passing</tests>
  <coverage>Coverage report showing 100%</coverage>
</output_format>
```

- **Clarity (23/25)**: "Fix" (4), file+lines (5), "100% coverage" (5), Django 5.0 (5), clear (4)
- **Context (22/25)**: DRF pattern (7), full stack (6), error+symptom (6), edge cases implied (3)
- **Structure (19/20)**: All XML tags (7), numbered steps (7), explicit output (5)
- **Techniques (5/15)**: No CoT needed (0), no examples needed (0), file specified (5)
- **Actionability (15/15)**: Executable (5), specific commands (5), clear validation (5)

**Total: 84/100** → Acceptable (target ≥85, very close)

### Example 3: Perfect Score

Would include: CoT for complex reasoning, few-shot examples, quote grounding for long files, all other criteria met.

**Total: 95-100/100** → Excellent

---

## Category Weights

Total points must equal 100:
- Clarity & Specificity: 25%
- Context & Domain: 25%
- Structure: 20%
- Advanced Techniques: 15%
- Actionability: 15%

These weights reflect Anthropic's emphasis on clarity, context, and structure as foundations for effective prompts.