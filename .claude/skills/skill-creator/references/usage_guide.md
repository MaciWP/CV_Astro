# Skill Creator Usage Guide

**Version**: 2.0.0 (Django/DRF Optimized)
**Last Updated**: 2025-01-13
**Skill Score**: 100/100

---

## 📖 What Is Skill Creator?

**Skill Creator** is a meta-skill that automates the creation of high-quality Claude Code skills using a systematic 7-step ReAct workflow. It ensures all generated skills:
- Score **95+/100** on quality rubric
- Follow official Anthropic specification (YAML frontmatter)
- Include project-specific examples and references
- Have actionable validation checklists
- Provide ❌/✅ code comparisons

---

## 🛠️ Using Scripts for Skill Creation (NEW in v2.0)

**skill-creator now includes automated scripts** that you can use **DURING** skill creation for:
- **Scaffolding**: Create skill structure automatically
- **Validation**: Check quality objectively (quick or full scoring)
- **Auto-improvement**: Fix common issues automatically ⭐
- **Packaging**: Distribute skills as .zip files

### Quick Start with Scripts

```bash
# 1. Initialize skill structure
python scripts/init_skill.py my-new-skill --interactive

# 2. Fill SKILL.md (manual or with skill-creator)

# 3. Validate quality
python scripts/validate_skill.py . --mode full

# 4. Auto-improve (if score < 95)
python scripts/auto_improve_skill.py . --auto-validate --backup

# 5. Package for distribution
python scripts/package_skill.py . --output-dir dist/
```

**See**: `scripts/README.md` for complete scripts documentation

**Benefits**:
- **2-4x faster**: Skill creation in ~15 min vs 30-60 min manual
- **Consistent quality**: 95+/100 guaranteed through automated validation
- **Auto-fixes**: Scripts fix common issues automatically

---

## 🚀 How to Use Skill Creator

### Method 1: Auto-Activation (Recommended)

Simply mention skill creation in your conversation:

```
"I want to create a new skill for API error handling"
"Can you generate a skill for database migrations?"
"Let's add a skill to enforce logging best practices"
```

**Keywords that trigger auto-activation**:
- "create skill"
- "new skill"
- "skill generator"
- "add skill"
- "generate skill"
- "design skill"

Skill Creator will automatically activate and guide you through the 7-step workflow.

---

### Method 2: Explicit Invocation

Reference the skill explicitly:

```
"Use the skill-creator skill to help me design a new skill for Redux state management"
```

---

## 🔄 The 7-Step Workflow

### Step 1: Requirements Gathering (Interactive Q&A)

Skill Creator will ask you 16 questions (expanded in v2.0):

**Project Context (1-5)**:
1. **Project Type**: Web app, mobile app, backend API, ML pipeline?
2. **Tech Stack**: Languages, frameworks, libraries (Django, DRF, PostgreSQL, etc.)
3. **Project Name**: Your project's name for specific file references
4. **Coding Patterns**: Patterns your team uses (Service layer, Multi-tenant, etc.)
5. **File Structure**: How code is organized (apps/{app}/models/, views/, services.py)

**Skill Requirements (6-12)**:
6. **Skill Purpose**: What problem does it solve? What best practices does it enforce?
7. **Auto-Activation Keywords**: What words/phrases should trigger this skill? (5-10 keywords)
8. **Core Principles**: What 3-5 principles should be automatically enforced?
9. **Anti-Patterns**: What 3-5 anti-patterns should be prevented?
10. **Example Files**: Which existing files are good examples?
11. **Authoritative Docs**: Which project docs/files are authoritative? (CLAUDE.md, etc.)
12. **Validation Criteria**: How to verify the skill is being applied? (checklist items)

**Advanced Options (13-16) - NEW in v2.0**:
13. **Extended Thinking**: Do you need extended thinking? (think, think hard, ultrathink)
14. **Skill Dependencies**: Does this skill depend on other skills?
15. **Multi-Tenant Project**: Is this multi-tenant? (Y/N, isolation strategy)
16. **Quick Mode**: Skip some validation for rapid prototyping? (Y/N)

**Example Response**:
```
Purpose: Ensure all API endpoints follow RESTful conventions and include proper error handling
Keywords: api, endpoint, rest, route, controller, error handling, status codes
Tech Stack: Node.js, Express, TypeScript, Joi validation
Core Principles:
  1. RESTful resource naming (plural nouns, nested resources)
  2. HTTP status codes (200, 201, 400, 404, 500)
  3. Input validation with Joi
  4. Centralized error handling middleware
  5. Consistent response format {data, error, metadata}
Anti-Patterns:
  1. Non-RESTful URLs (/getUser, /createPost) → (/users/:id, /posts)
  2. Missing input validation → SQL injection risk
  3. Uncaught exceptions → server crashes
  4. Inconsistent response formats → client confusion
  5. Magic status codes (999, 42) → non-standard
References:
  - src/api/controllers/*.ts
  - docs/API_DESIGN.md
  - config/error_codes.json
Validation:
  - All endpoints follow RESTful naming?
  - Input validation present?
  - Status codes appropriate?
  - Error handling middleware used?
```

---

### Step 2: Template Selection

Skill Creator will select the best template based on your domain:

| Template | Best For | Auto-Selected When |
|----------|----------|---------------------|
| **A: Frontend/UI** | Web (React, Vue), Mobile (Flutter, React Native), Desktop | UI, components, screens, state management |
| **B: Backend/API** | REST APIs, GraphQL, gRPC (Express, FastAPI, Spring Boot) | api, endpoint, rest, backend (non-Django) |
| **C: Testing/QA** | Unit, integration, E2E tests (Jest, pytest, JUnit) | test, mock, coverage, QA |
| **D: ML/Data Science** | Model training, inference, data pipelines | ML, model, training, inference, data |
| **E: Database/Storage** | SQL, NoSQL, ORM patterns | database, query, schema, SQL, NoSQL |
| **F: Django/DRF Multi-Tenant ⭐ NEW** | Django 4-5 + DRF 3.14+ with multi-tenant architecture | service, viewset, serializer, multi-tenant, pytest-django |

**Recommendation for Binora Backend**: Use **Template F** for most Django/DRF skills (service layer, serializers, multi-tenant, testing, ORM)

You'll be asked to confirm the template selection.

---

### Step 3: Content Generation

Skill Creator generates the full skill content:

1. **YAML Frontmatter**: Name (max 64 chars) + Description (max 1024 chars)
2. **Header**: Skill name + Auto-activation criteria
3. **Mission**: Single sentence with bold targets and metrics
4. **Core Principles**: 3-5 sections with ❌/✅ examples and checklists
5. **Anti-Patterns**: 3-5 patterns with code examples
6. **Validation Checklist**: 8-15 actionable items
7. **References**: 3-5 project docs/files
8. **Activation Criteria**: Keywords, contexts, auto-suggest scenarios

**Output**: Complete skill markdown ready for review.

---

### Step 4: Quality Scoring

Skill Creator applies its 0-100 point rubric:

| Category | Max | Criteria |
|----------|-----|----------|
| Structure Clarity | 20 | YAML, hierarchy, formatting, length |
| Activation Effectiveness | 20 | Keywords, triggers, description |
| Content Quality | 25 | Examples, specificity, completeness |
| Actionability | 20 | Checklists, auto-checks, applicability |
| Reusability | 15 | Agnostic core, project examples, docs |
| **TOTAL** | **100** | **Target: 95+** |

**Score Interpretation**:
- **95-100**: Exceptional, production-ready ✅
- **90-94**: Excellent, minor tweaks possible
- **85-89**: Very good, targeted refinements needed
- **80-84**: Good, requires iteration
- **<80**: Needs significant work

You'll see a detailed score breakdown like:
```
Structure: 18/20
Activation: 19/20
Content: 23/25
Actionability: 18/20
Reusability: 14/15
TOTAL: 92/100 (Excellent)
```

---

### Step 5: Gap Analysis

If score < 95, Skill Creator identifies specific improvements:

**Example Gap Report**:
```
Gaps Identified (Score: 88/100):

Structure (-2 pts):
  - Length: 650 lines (above 600 sweet spot)
  - Suggestion: Consolidate redundant examples

Content (-2 pts):
  - Only 2 code examples (need 3+)
  - Suggestion: Add anti-pattern for uncaught promises

Actionability (-2 pts):
  - Checklist has 6 items (need 8+)
  - Suggestion: Add validation for error handling, logging, testing
```

---

### Step 6: Iteration

Skill Creator applies improvements automatically:

1. Fixes structure issues (formatting, length)
2. Enhances activation (keywords, description)
3. Strengthens content (adds examples, metrics)
4. Boosts actionability (expands checklists)
5. Improves reusability (adds references, metadata)

**Each iteration improves score by 5-10 points.**

Process repeats Steps 4-6 until score ≥95/100.

---

### Step 7: Final Validation

Skill Creator confirms exceptional quality:

**Functional Validation**:
- ✅ YAML frontmatter valid
- ✅ All sections present
- ✅ 3+ code examples with ❌/✅
- ✅ 8+ checklist items
- ✅ References section with 3+ links
- ✅ Score ≥95/100

**Content Validation**:
- ✅ Examples use project code/patterns
- ✅ Keywords domain-specific
- ✅ Metrics quantifiable
- ✅ Anti-patterns address real issues
- ✅ Checklists actionable (yes/no)

**Technical Validation**:
- ✅ Code syntax correct
- ✅ File paths valid
- ✅ References exist
- ✅ Tools/commands accurate

**Output**: Confirmation that skill is production-ready, or specific remaining issues.

---

## 📝 Example Workflow Walkthrough

### Scenario: Creating "API Error Handling" Skill

**Step 1: Requirements**
```
User: "I want to create a skill for API error handling"

Skill Creator: "Let's create an API error handling skill! I'll ask 7 questions:

1. Skill Purpose?
You: "Ensure all API endpoints have proper error handling with correct status codes and consistent format"

2. Auto-Activation Keywords?
You: "api error, error handling, status code, exception, try catch, error middleware"

3. Tech Stack?
You: "Node.js, Express, TypeScript, Joi validation"

4. Core Principles (3-5)?
You:
  1. All routes wrapped in try-catch or use asyncHandler
  2. HTTP status codes follow RFC 7231 (200, 201, 400, 404, 500)
  3. Error responses have consistent format {error: {code, message, details}}
  4. Centralized error handling middleware
  5. Never expose stack traces in production

5. Anti-Patterns (3-5)?
You:
  1. Uncaught exceptions → server crash
  2. Generic 500 errors → no debugging info
  3. Inconsistent error formats → client confusion
  4. Exposed stack traces → security risk

6. References?
You:
  - src/middleware/error_handler.ts
  - docs/API_ERROR_CODES.md
  - config/http_status.json

7. Validation Criteria?
You:
  - All routes have error handling?
  - Status codes appropriate?
  - Error format consistent?
  - No stack traces in production?
```

**Step 2: Template Selection**
```
Skill Creator: "Based on your domain (Backend/API), I'll use Template B: Backend/API Development.

Template includes:
- Mission: API performance, security, reliability
- Core Principles: RESTful design, auth, error handling
- Anti-Patterns: SQL injection, missing validation
- Validation: API testing checklist

Proceed with Template B? (yes/no)"

You: "yes"
```

**Step 3: Content Generation**
```
Skill Creator: "Generating API Error Handling skill...

Created: .claude/skills/api-error-handling/SKILL.md

Preview:
---
name: "API Error Handling"
description: "Ensures all API endpoints in Node.js/Express have proper error handling with RFC 7231 status codes and consistent {error} format. Auto-activates on keywords: api error, error handling, status code, exception, try catch, middleware..."
---

# API Error Handling

## 🎯 Mission
Ensure **100% of API endpoints** have error handling with **RFC 7231 compliant** status codes and **consistent error format**.

## Core Principles
[3-5 sections with examples]

## Anti-Patterns
[3-5 patterns with ❌/✅ code]

...
"
```

**Step 4: Quality Scoring**
```
Skill Creator: "Scoring API Error Handling skill...

Structure: 19/20 (valid YAML, clear hierarchy, formatted correctly, 480 lines)
Activation: 18/20 (6 keywords - good, description clear, could add 'throw' keyword)
Content: 22/25 (3 code examples ✓, specific status codes ✓, missing production config example)
Actionability: 19/20 (10 checklist items ✓, auto-checks present ✓, could add integration test check)
Reusability: 14/15 (principles generalizable ✓, Node.js specific ✓, version metadata present ✓)

TOTAL: 92/100 (Excellent, minor improvements possible)"
```

**Step 5: Gap Analysis**
```
Skill Creator: "Gap Analysis (Target: 95+/100)

Improvements needed (+3 pts to reach 95):

1. Activation (+2 pts):
   - Add keywords: 'throw', 'reject', 'catch'
   - Expand description to mention production environment

2. Content (+1 pt):
   - Add example: Production error handling (no stack traces)
   - Add anti-pattern: Catching errors without logging

Applying improvements..."
```

**Step 6: Iteration**
```
Skill Creator: "Improvements applied. Re-scoring...

Structure: 19/20 (unchanged)
Activation: 20/20 (+2: added 3 keywords, enhanced description)
Content: 23/25 (+1: added production config example)
Actionability: 19/20 (unchanged)
Reusability: 14/15 (unchanged)

TOTAL: 95/100 (Exceptional ✅)"
```

**Step 7: Final Validation**
```
Skill Creator: "Final Validation:

Functional: ✅ All checks passed
Content: ✅ All checks passed
Technical: ✅ All checks passed

✅ API Error Handling skill is production-ready (95/100)

Skill saved to: .claude/skills/api-error-handling/SKILL.md

You can now use this skill by mentioning:
- 'api error'
- 'error handling'
- 'status code'
Or explicitly: 'Use the api-error-handling skill to review this endpoint'
"
```

---

## 💡 Tips for Best Results

### 1. Be Specific in Requirements
```
❌ Bad: "I want a skill for code quality"
✅ Good: "I want a skill to enforce DRY principle, prevent magic numbers, and ensure all classes have Dartdoc comments in Flutter code"
```

### 2. Provide Real Examples
```
❌ Bad: "Prevent bad code"
✅ Good: "Prevent static service methods like CollectionService.getUserCollection() because they can't be mocked in tests"
```

### 3. Reference Actual Project Files
```
❌ Bad: "Check the services folder"
✅ Good: "Reference lib/services/interfaces/*.dart for DI patterns and lib/services/mocks/* for test examples"
```

### 4. Quantify Targets
```
❌ Bad: "Improve performance"
✅ Good: "Ensure database queries are <100ms for 1000+ records with @Index() on filtered fields"
```

### 5. Trust the Process
- Don't skip questions in Step 1 - complete answers lead to better skills
- Review generated content in Step 3 before scoring
- If score < 95, let iteration happen (Step 6)
- Final validation (Step 7) catches any remaining issues

---

## 🔍 Troubleshooting

### Issue: Score < 90 After Iteration
**Cause**: Requirements too vague or incomplete
**Solution**: Restart workflow with more specific answers to Step 1 questions

### Issue: Keywords Too Generic
**Example**: "code", "quality", "best practice"
**Solution**: Use domain-specific terms: "DI", "Riverpod", "constructor injection", "@Index()"

### Issue: Examples Not Project-Specific
**Cause**: Missing references to actual project files
**Solution**: Provide file paths (lib/services/ml_service.dart) and class names (MLService, ICameraService)

### Issue: Checklist Items Vague
**Example**: "Is code good?"
**Solution**: Make binary: "Does screen accept optional ICameraService parameter?"

---

## 📊 Success Metrics

Track these metrics to measure skill-creator effectiveness:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Generated Skill Score** | 95+/100 | Apply rubric in Step 4 |
| **Time to Create** | <15 min | From Step 1 to Step 7 |
| **Iterations Needed** | ≤2 | Count Step 6 loops |
| **Skills Created** | 2+/month | Track `.claude/skills/` growth |
| **Activation Success** | >90% | Skills activate when expected |

---

## 📚 Additional Resources

- **Official Claude Skills**: https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview
- **Anthropic Skills Repo**: https://github.com/anthropics/skills
- **Existing EasyBoard Skills**: `.claude/skills/*/SKILL.md` (5 examples)
- **Project Knowledge Base**: `SPRINTS_KNOWLEDGE_BASE.md`
- **Architecture Patterns**: `CLAUDE.md`

---

## 🎯 Next Steps

1. **Create Your First Skill**: Try the example workflow above
2. **Review Generated Skill**: Check `.claude/skills/[skill-name]/SKILL.md`
3. **Test Activation**: Mention keywords in conversation and verify skill activates
4. **Iterate**: Use skill to generate more skills (meta-meta!)
5. **Share**: Document new skills in `CLAUDE.md` or project wiki

---

**Questions?** Check:
- `.claude/skills/skill-creator/SKILL.md` - Full skill specification
- This guide (`SKILL_CREATOR_GUIDE.md`) - Implementation walkthrough
- Existing skills - Real examples of high-quality skills

**Happy Skill Creating! 🚀**
