# Skill Quality Checklist

**Purpose**: Comprehensive 50-point checklist for validating Claude Code skill quality before deployment.

**Target Score**: 95+/100 in quality rubric, ≥48/50 checklist items passing.

**Usage**: Run this checklist in **Step 7: Final Validation** of skill creation workflow.

---

## A. Structure Clarity (10 items)

### YAML Frontmatter
- [ ] **A1**: YAML frontmatter present with `---` delimiters
- [ ] **A2**: `name:` field present and ≤64 characters
- [ ] **A3**: `description:` field present and ≤1024 characters
- [ ] **A4**: Description front-loads activation keywords (first 100 chars)
- [ ] **A5**: Description includes tech stack support (if generic)

### File Organization
- [ ] **A6**: SKILL.md is 250-350 lines (concise, not 600+)
- [ ] **A7**: Content logically organized (Mission → Principles → Anti-Patterns → Checklist → References)
- [ ] **A8**: Markdown formatting consistent (## for main sections, ### for subsections)
- [ ] **A9**: Progressive loading: SKILL.md references external files in examples/, templates/, references/
- [ ] **A10**: No walls of text (paragraphs <5 lines, use bullet points)

---

## B. Activation Patterns (8 items)

### Keyword Optimization
- [ ] **B1**: 5-10 activation keywords listed in `description:` field
- [ ] **B2**: Keywords specific to domain (not generic: "code", "quality")
- [ ] **B3**: Keywords cover variations (e.g., "DI", "dependency injection", "injectable")
- [ ] **B4**: "Auto-activates when" section present after title

### Trigger Scenarios
- [ ] **B5**: 3-5 trigger scenarios documented ("User creates X", "User mentions Y")
- [ ] **B6**: Triggers specific to project patterns (from Step 1 context)
- [ ] **B7**: Triggers proactive (auto-suggest BEFORE user asks)
- [ ] **B8**: Keyword strategy tested (simulated conversation triggers skill)

---

## C. Content Quality (12 items)

### Code Examples
- [ ] **C1**: ≥3 code examples with ❌/✅ comparison
- [ ] **C2**: Code examples use actual project patterns (from Step 1)
- [ ] **C3**: Code examples syntactically correct (can compile/run)
- [ ] **C4**: Examples adapted to user's tech stack (React/Flutter/FastAPI/etc.)
- [ ] **C5**: Examples show realistic scenarios (not toy code)

### Specificity
- [ ] **C6**: File paths reference actual project structure (lib/, src/, app/)
- [ ] **C7**: Quantifiable metrics (>80%, <100ms, 3+ examples)
- [ ] **C8**: No vague language ("somehow", "maybe", "generally")
- [ ] **C9**: Technical terms precise (Riverpod vs "state management library")

### Completeness
- [ ] **C10**: All core principles have ❌/✅ examples
- [ ] **C11**: Anti-patterns section present with 3-5 patterns
- [ ] **C12**: References section links to 3+ authoritative docs/files

---

## D. Actionability (10 items)

### Checklists
- [ ] **D1**: Proactive validation checklist present
- [ ] **D2**: Checklist has ≥8 items grouped by priority (Critical/High/Medium)
- [ ] **D3**: Checklist items are yes/no questions (objective)
- [ ] **D4**: Auto-check sections embedded in principles (not just at end)

### Clarity
- [ ] **D5**: Each principle has clear "Rule:" statement
- [ ] **D6**: "Auto-check:" sections actionable ("Does X use Y?" not "Is X good?")
- [ ] **D7**: No ambiguous questions ("Is code clean?" → "Does screen accept IService parameter?")

### Practical Application
- [ ] **D8**: Skill can be applied WITHOUT reading external docs
- [ ] **D9**: Examples copy-paste ready (complete, not fragments)
- [ ] **D10**: Validation criteria measurable (can objectively verify)

---

## E. Reusability (5 items)

### Documentation
- [ ] **E1**: References section present with ≥3 links
- [ ] **E2**: References link to actual project files (not generic URLs)
- [ ] **E3**: Version and "Last Updated" metadata at bottom

### Agnostic Core
- [ ] **E4**: Core principles tech-agnostic (apply to multiple frameworks)
- [ ] **E5**: Examples show project-specific implementation (from Step 1)

---

## F. Genericidad (Tech-Agnostic) (8 items)

### No Hardcoding
- [ ] **F1**: No hardcoded project names in SKILL.md ("EasyBoard", "MyApp")
- [ ] **F2**: Uses "your project", "the application", "your tech stack"
- [ ] **F3**: File paths use {{ProjectStructure}} or generic (lib/, src/)

### Tech Stack Adaptation
- [ ] **F4**: Examples adapted to Step 1 responses (React vs Flutter vs FastAPI)
- [ ] **F5**: Templates use {{slots}} for variables
- [ ] **F6**: Anti-Pattern #2 shows multi-tech examples (React, Flutter, FastAPI)
- [ ] **F7**: YAML description mentions "Works for [TechStack1], [TechStack2]"

### Universal Language
- [ ] **F8**: Language tech-agnostic ("your state management library" vs "Redux")

---

## G. Structure Completeness (Progressive Loading) (7 items)

### Folder Existence
- [ ] **G1**: `examples/` folder exists in skill directory
- [ ] **G2**: `templates/` folder exists
- [ ] **G3**: `references/` folder exists
- [ ] **G4**: `checklists/` folder exists

### Folder Content
- [ ] **G5**: `examples/` has 5-10 complete code files (.md, .dart, .ts, .py)
- [ ] **G6**: `templates/` has 3-5 templates with {{slot}} placeholders
- [ ] **G7**: `references/` has 2-4 detailed guides (≥20 pages each, .md)
- [ ] **G8**: `checklists/` has 1-3 expanded checklists (≥30 items each, .md)

### Progressive Loading Integration
- [ ] **G9**: SKILL.md references external files ("See examples/X.md for...")
- [ ] **G10**: SKILL.md concise because details moved to references/

---

## Scoring

**Calculation**:
- Total items: 60
- Passing threshold: ≥48/60 (80%)
- Target: ≥57/60 (95%)

**Quality Rubric Mapping**:

| Checklist Section | Maps to Rubric Category | Points |
|-------------------|-------------------------|--------|
| A. Structure Clarity (10 items) | Structure Clarity (15 pts) | 15 |
| B. Activation Patterns (8 items) | Activation Patterns (20 pts) | 20 |
| C. Content Quality (12 items) | Content Quality (20 pts) | 20 |
| D. Actionability (10 items) | Actionability (15 pts) | 15 |
| E. Reusability (5 items) | Reusability (15 pts) | 15 |
| F. Genericidad (8 items) | Genericidad (10 pts) | 10 |
| G. Structure Completeness (7 items) | Structure Completeness (5 pts) | 5 |
| **TOTAL** | **100 points** | **100** |

---

## Usage Instructions

### When to Use
- Run in **Step 7: Final Validation** before marking skill complete
- Run after each iteration in **Step 6** to track improvement
- Run before deploying skill to production

### How to Use
1. Open skill folder and SKILL.md
2. Go through checklist A→B→C→D→E→F→G sequentially
3. Mark each item [ ] or [x]
4. Calculate score: (checked items / 60) × 100
5. If <80%, iterate with Step 6 improvements
6. If ≥95%, skill ready for deployment

### Common Failure Points
- **F1-F3**: Forgetting to remove hardcoded project names (10% fail here)
- **G5-G8**: Missing folder structure or insufficient files (15% fail here)
- **C4**: Examples not adapted to user's tech stack (20% fail here)
- **D3**: Vague checklist items instead of yes/no (25% fail here)

---

## Example Checklist Run

**Skill**: flutter-di-architecture (Flutter DI enforcement)

**Results**:
- A: 10/10 ✅ (YAML correct, 280 lines, organized)
- B: 8/8 ✅ (Keywords: DI, dependency injection, service, constructor)
- C: 11/12 ⚠️ (Missing quantifiable metric for DI compliance)
- D: 10/10 ✅ (8-item checklist, yes/no questions)
- E: 5/5 ✅ (References lib/services/interfaces/)
- F: 7/8 ⚠️ (Hardcoded "EasyBoard" in one example)
- G: 6/7 ⚠️ (examples/ has only 3 files, need 5-10)

**Score**: 57/60 = 95% ✅ **PASS** (meets target)

**Action**: Fix C12 (add metric), F1 (remove "EasyBoard"), G5 (add 2 more examples)

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Checklist Items**: 60 (10+8+12+10+5+8+7)
