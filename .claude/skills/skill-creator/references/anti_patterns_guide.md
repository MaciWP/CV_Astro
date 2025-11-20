# Skill Creator Anti-Patterns Guide

**Version**: 2.0.0
**Last Updated**: 2025-01-13

Common mistakes to avoid when creating Claude Code skills, with examples and fixes.

---

## Anti-Pattern 1: Missing YAML Frontmatter

### ❌ ANTI-PATTERN - No frontmatter

```markdown
# My Skill

**Auto-activates when**: ...

## 🎯 Mission
...
```

**Problem**: Claude requires YAML frontmatter for progressive skill loading. Without it, the skill won't be discovered or loaded correctly.

### ✅ CORRECT - With frontmatter

```markdown
---
name: "My Skill"
description: "What it does, when to use, keywords: keyword1, keyword2. Enforces X, Y, Z. Prevents A, B, C. Max 1024 chars."
---

# My Skill

**Auto-activates when**: ...
```

**Fix Checklist**:
- [ ] Frontmatter starts and ends with `---`
- [ ] `name` field present (max 64 chars)
- [ ] `description` field present (max 1024 chars)
- [ ] Description includes: what, when, keywords, enforces, prevents

---

## Anti-Pattern 2: Generic, Non-Project-Specific Skills

### ❌ ANTI-PATTERN - Too generic

```markdown
"Ensure code follows best practices"
"Write clean code"
"Test your code"
"Use dependency injection"
```

**Problem**: Too vague, applies to ANY project, no actionable guidance, Claude can't enforce automatically.

### ✅ CORRECT - Project-specific (adapts to Step 1 context)

**Example for Flutter project**:
```markdown
"Ensure {{ProjectName}} Flutter code uses constructor DI with {{ServiceInterfaces}}?"
"Follow {{ProjectStructure}}/services/*/pattern with {{ErrorHandlingPattern}} error handling"
"Test with {{MockPattern}}.createFake() from {{ProjectStructure}}/services/mocks/"
```

**Example for React project**:
```markdown
"Ensure {{ProjectName}} React components use props injection with {{ServiceTypes}}?"
"Follow {{ProjectStructure}}/services/*/pattern with {{ErrorHandlingPattern}} (try/catch or Either<>)"
"Test with {{MockPattern}} from {{ProjectStructure}}/services/__mocks__/"
```

**Example for FastAPI project**:
```markdown
"Ensure {{ProjectName}} FastAPI endpoints use dependency injection with Depends({{ServiceFactory}})"
"Follow {{ProjectStructure}}/services/*/pattern with {{ErrorHandlingPattern}} (raise HTTPException)"
"Test with {{MockPattern}} from {{ProjectStructure}}/tests/mocks/"
```

**Example for Django/DRF project**:
```markdown
"Ensure {{ProjectName}} Django ViewSets delegate to {{ServiceClass}} in apps/{{appName}}/services.py"
"Follow service layer pattern: NO business logic in views, ALL logic in services with type hints"
"Test with mocker.Mock() (NOT unittest.mock.Mock) in apps/{{appName}}/tests/"
```

**Fix Checklist**:
- [ ] References actual project files/paths
- [ ] Uses project-specific patterns
- [ ] Mentions tech stack explicitly
- [ ] Includes quantifiable targets (>80%, <100ms)
- [ ] Adapts to user's Step 1 responses

---

## Anti-Pattern 3: No Code Examples

### ❌ ANTI-PATTERN - Text only

```markdown
### Principle: Use Dependency Injection

**Rule**: Use dependency injection
**Details**: Avoid static methods
```

**Problem**: Developers learn by example, not abstract rules. No visual reference = confusion.

### ✅ CORRECT - With ❌/✅ examples

```markdown
### Principle: Use Dependency Injection

**Rule**: NEVER instantiate services directly in components.

❌ WRONG - Hard-coded dependency
```dart
class HomeScreen extends StatelessWidget {
  final AuthService authService = AuthService(); // Direct instantiation!

  @override
  Widget build(BuildContext context) {
    return Text(authService.currentUser.name);
  }
}
```

✅ CORRECT - Constructor injection
```dart
class HomeScreen extends StatelessWidget {
  final AuthService authService;

  const HomeScreen({super.key, required this.authService});

  @override
  Widget build(BuildContext context) {
    return Text(authService.currentUser.name);
  }
}
```
```

**Fix Checklist**:
- [ ] Every principle has ❌ WRONG example
- [ ] Every principle has ✅ CORRECT example
- [ ] Code examples are syntactically correct
- [ ] Examples show realistic use cases
- [ ] Examples match project tech stack

---

## Anti-Pattern 4: Vague Checklists

### ❌ ANTI-PATTERN - Vague questions

```markdown
## 🔍 Validation Checklist
- [ ] Is code good?
- [ ] Does it work?
- [ ] Is performance OK?
- [ ] Are there tests?
```

**Problem**: Can't be answered objectively, no clear pass/fail criteria.

### ✅ CORRECT - Specific, binary questions

```markdown
## 🔍 Validation Checklist

**Critical (Must Fix)**:
- [ ] Does screen accept optional ICameraService parameter?
- [ ] Are services initialized with `widget.service ?? RealService()` pattern?
- [ ] Can this screen be tested with MockCameraService?
- [ ] Is flutter analyze reporting 0 errors?

**High Priority**:
- [ ] Does screen have <300 lines?
- [ ] Are StatefulWidget dispose() methods implemented?
- [ ] Is screen load time <200ms?

**Medium Priority**:
- [ ] Are all strings internationalized (AppLocalizations)?
- [ ] Is accessibility score >95%?
```

**Fix Checklist**:
- [ ] Each question has yes/no answer
- [ ] Questions reference specific metrics (numbers, files, patterns)
- [ ] Questions grouped by priority (Critical, High, Medium)
- [ ] 8-15 total checklist items
- [ ] Questions are actionable (can be fixed if no)

---

## Anti-Pattern 5: No Validation Criteria

### ❌ ANTI-PATTERN - No checklist

```markdown
## 📐 Core Principles

### 1. Use DI
[principle details]

### 2. State Management
[principle details]

### 3. Testing
[principle details]

## 📚 References
[references]

---

[End of skill, no validation section]
```

**Problem**: Without validation, skills can't be applied proactively. Claude can't auto-check compliance.

### ✅ CORRECT - With comprehensive validation

```markdown
## 📐 Core Principles

### 1. Use DI
[principle details]

### 2. State Management
[principle details]

### 3. Testing
[principle details]

## 🔍 Proactive Validation Checklist

**Before proposing code, validate**:

### Critical (Must Fix)
- [ ] All screens use constructor DI (no direct instantiation)?
- [ ] Services injected with optional pattern?
- [ ] MockServices available for testing?

### High Priority
- [ ] State management correct (Riverpod providers)?
- [ ] Tests follow AAA pattern?
- [ ] Coverage >80%?

### Medium Priority
- [ ] Performance optimizations applied?
- [ ] Accessibility considered?
- [ ] Documentation complete?

## 📚 References
[references]
```

**Fix Checklist**:
- [ ] Validation checklist present
- [ ] 8-15 checklist items minimum
- [ ] Items grouped by priority
- [ ] Questions binary (yes/no)
- [ ] "Auto-check before proposing code" in principles

---

## Anti-Pattern 6: Hardcoded Project Names

### ❌ ANTI-PATTERN - Hardcoded references

```markdown
"Ensure EasyBoard Flutter code uses Riverpod providers"
"Follow lib/services/*/pattern"
"Reference SPRINTS_KNOWLEDGE_BASE.md for patterns"
"Test with MockServices from lib/services/mocks/"
```

**Problem**: Not reusable, assumes specific project structure, breaks genericidad.

### ✅ CORRECT - Parametrized references

```markdown
"Ensure {{ProjectName}} {{TechStack}} code uses {{StateManagement}} providers"
"Follow {{ProjectStructure}}/services/*/pattern"
"Reference project docs (CLAUDE.md, ARCHITECTURE.md) for patterns"
"Test with {{MockPattern}} from {{ProjectStructure}}/services/mocks/"
```

**Fix Checklist**:
- [ ] No hardcoded project names (EasyBoard, MyApp, etc.)
- [ ] File paths use {{ProjectStructure}} placeholder
- [ ] Tech stack uses {{TechStack}} placeholder
- [ ] Patterns use {{PatternName}} placeholders
- [ ] References "project docs" instead of specific filenames

---

## Anti-Pattern 7: Missing "Why It Matters"

### ❌ ANTI-PATTERN - No explanation

```markdown
### 1. Use Dependency Injection
**Rule**: NEVER instantiate services directly in widgets.

❌ WRONG: [code]
✅ CORRECT: [code]

**Auto-check**:
- [ ] Check 1
- [ ] Check 2
```

**Problem**: Developers don't understand WHY the principle matters, less likely to follow.

### ✅ CORRECT - With "Why it matters"

```markdown
### 1. Use Dependency Injection
**Rule**: NEVER instantiate services directly in widgets.
**Why it matters**: Enables testing with mocks, follows SOLID principles, reduces coupling, makes code maintainable.

❌ WRONG: [code]
✅ CORRECT: [code]

**Auto-check**:
- [ ] Check 1
- [ ] Check 2
```

**Fix Checklist**:
- [ ] Every Core Principle has "Why it matters"
- [ ] Every Anti-Pattern has "Why it matters"
- [ ] Explanations are concise (1-2 sentences)
- [ ] Benefits clearly stated
- [ ] Consequences of not following explained

---

## Anti-Pattern 8: SKILL.md Too Long (>600 lines)

### ❌ ANTI-PATTERN - Everything in SKILL.md

```markdown
---
name: "My Skill"
---

# My Skill

## 🔄 Workflow
[100 lines]

## 📐 Core Principles
[200 lines with 10 principles]

## 🚫 Anti-Patterns
[150 lines with 10 anti-patterns]

## 📚 Complete Template Details
[300 lines with full template]

## 🔍 Validation Checklist
[100 lines with 50 items]

---
[Total: 850 lines]
```

**Problem**: Violates progressive disclosure, loads all content into context, wastes tokens, slow loading.

### ✅ CORRECT - Progressive loading with references

```markdown
---
name: "My Skill"
---

# My Skill

## 🔄 Workflow
[Brief overview, 20 lines]
**See**: `references/workflow_guide.md` for complete details

## 📐 Core Principles
[Top 3 principles with examples, 60 lines]
**See**: `references/principles_guide.md` for all 10 principles

## 🚫 Anti-Patterns
[Top 2 anti-patterns, 30 lines]
**See**: `references/anti_patterns_guide.md` for all 10 anti-patterns

## 📚 Template Details
[Brief structure, 20 lines]
**See**: `references/template_guide.md` for complete template

## 🔍 Validation Checklist
[Critical items only, 8-15 items, 30 lines]
**See**: `checklists/complete_checklist.md` for all 50 items

---
[Total: 250 lines]
```

**Fix Checklist**:
- [ ] SKILL.md is 250-300 lines maximum
- [ ] Detailed content moved to references/
- [ ] Complete checklists moved to checklists/
- [ ] SKILL.md references external files
- [ ] "See: path/to/file.md" links present

---

## Anti-Pattern 9: No Folder Structure

### ❌ ANTI-PATTERN - Only SKILL.md

```
.claude/skills/my-skill/
└── SKILL.md
```

**Problem**: All content in one file, no progressive loading, no reusable templates, no expanded checklists.

### ✅ CORRECT - Complete folder structure

```
.claude/skills/my-skill/
├── SKILL.md (250 lines)
├── examples/
│   ├── example1.py (complete working code)
│   ├── example2.py (complete working code)
│   └── example3.py (complete working code)
├── templates/
│   ├── template1.py (with {{slots}})
│   └── template2.py (with {{slots}})
├── references/
│   ├── principles_guide.md (detailed explanation)
│   └── workflow_guide.md (step-by-step)
└── checklists/
    └── validation_checklist.md (expanded 30-50 items)
```

**Fix Checklist**:
- [ ] examples/ folder exists (5-10 files)
- [ ] templates/ folder exists (3-5 files)
- [ ] references/ folder exists (2-4 files)
- [ ] checklists/ folder exists (1-3 files)
- [ ] Each folder has minimum file count
- [ ] SKILL.md references these folders

---

## Anti-Pattern 10: Mixing Tech Stacks in Examples

### ❌ ANTI-PATTERN - Inconsistent examples

```markdown
## Core Principles

### 1. Dependency Injection
**Example for React**:
[React code]

### 2. State Management
**Example for Flutter**:
[Flutter code]

### 3. Testing
**Example for Django**:
[Django code]
```

**Problem**: Confusing, not project-specific, user has to mentally translate to their stack.

### ✅ CORRECT - Consistent tech stack (from Step 1)

**If user chose Django in Step 1**:
```markdown
## Core Principles

### 1. Service Layer Delegation
**Example for Django/DRF**:
[Django ViewSet code]

### 2. Input/Output Serializers
**Example for Django/DRF**:
[Django Serializer code]

### 3. Testing with pytest-django
**Example for Django/DRF**:
[pytest-django code]
```

**If user chose React in Step 1**:
```markdown
## Core Principles

### 1. Component Composition
**Example for React/TypeScript**:
[React component code]

### 2. State Management with Hooks
**Example for React/TypeScript**:
[useState/useContext code]

### 3. Testing with Jest
**Example for React/TypeScript**:
[Jest test code]
```

**Fix Checklist**:
- [ ] All examples use same tech stack
- [ ] Tech stack matches Step 1 response
- [ ] No mixing React + Flutter + Django in same skill
- [ ] File paths match tech stack conventions
- [ ] Imports/syntax match tech stack

---

## Summary: Top 10 Anti-Patterns to Avoid

1. ❌ **Missing YAML frontmatter** → ✅ Add frontmatter with name + description
2. ❌ **Generic skills** → ✅ Make project-specific with {{placeholders}}
3. ❌ **No code examples** → ✅ Include ❌/✅ code comparisons
4. ❌ **Vague checklists** → ✅ Binary yes/no questions with metrics
5. ❌ **No validation criteria** → ✅ Add 8-15 item checklist
6. ❌ **Hardcoded project names** → ✅ Use {{ProjectName}}, {{ProjectStructure}}
7. ❌ **Missing "Why it matters"** → ✅ Add explanation to each principle
8. ❌ **SKILL.md too long** → ✅ Reduce to 250-300 lines, use references/
9. ❌ **No folder structure** → ✅ Create examples/, templates/, references/, checklists/
10. ❌ **Mixed tech stacks** → ✅ Use consistent stack from Step 1

---

**Last Updated**: 2025-01-13
**Version**: 2.0.0
**Anti-Patterns**: 10 documented