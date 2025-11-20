---
name: skill-creator
description: Universal skill generator using 7-step ReAct pattern with 95+/100 quality guarantee. This skill should be used when creating new skills, editing existing SKILL.md files, or updating skill descriptions and quality.
---

# Skill Creator - Django/DRF Meta-Skill

**Auto-activates on**: create skill, new skill, skill generator, add skill, generate skill, crear skill, nueva skill, generador de skills

## Mission

Generate **95+/100 quality** skills using **7-step ReAct workflow** with **Template F Django/DRF** specialization and automated quality validation.

## Workflow

1. **Requirements** (11-15 questions + concrete scenarios)
2. **Template selection** (A-F, optimized for Django/DRF)
3. **Content generation** (YAML + structure + examples)
4. **Quality scoring** (0-100 rubric, 5 categories)
5. **Gap analysis** (if score <95)
6. **Iteration** (apply improvements until ≥95)
7. **Final validation** (production-ready confirmation)

---

## Step 1: Requirements Gathering

**Interactive Q&A to extract project context and skill specifications**:

### Core Questions (Always Asked)

1. **Project Type**: Web app, backend API, mobile app, ML pipeline, other?
2. **Tech Stack**: Languages, frameworks, libraries (Django, DRF, PostgreSQL, etc.)
3. **Project Name**: Project name for specific file references
4. **Concrete Scenarios** (NEW): Show 2-3 real situations when this skill should activate
   - Example: "User says: 'I need to add CRUD endpoints for Asset model'"
   - Example: "User shows code with business logic in ViewSet"
   - Example: "Claude detects N+1 query in ORM code"
5. **Keywords**: Auto-extracted from scenarios + manual additions (domain-specific terms)
6. **Skill Purpose**: What problem does it solve? What practices does it enforce?
7. **Core Principles**: 3-5 principles to automatically enforce (with ❌/✅ examples)
8. **Anti-Patterns**: 3-5 patterns to prevent (with code examples)
9. **Example Files**: Which project files are good reference implementations?
10. **Authoritative Docs**: Project docs that define patterns (CLAUDE.md, etc.)
11. **Validation Criteria**: How to verify skill is being applied? (checklist items)

### Conditional Questions (Asked If Relevant)

12. **Extended Thinking**: Need extended thinking? (think/think hard/ultrathink) [If complex logic]
13. **Skill Dependencies**: Depends on other skills? [If mentions other skills]
14. **Multi-Tenant**: Is multi-tenant project? Isolation strategy? [If Django/backend]
15. **Quick Mode**: Skip validation for rapid prototyping? (Y/N) [If iterating]

**Output**: Requirements document with context + specifications

---

## Step 2: Template Selection

**Choose from 6 domain-specific templates**:

| Template | Domain | Tech Examples | Use When |
|----------|--------|---------------|----------|
| **A** | Frontend/UI | React, Vue, Flutter, Swift | Components, state, UI |
| **B** | Backend/API | Express, FastAPI, Spring | REST, GraphQL, auth |
| **C** | Testing/QA | Jest, pytest, JUnit | Unit, integration, E2E |
| **D** | ML/Data | PyTorch, TensorFlow, scikit-learn | Training, inference, data |
| **E** | Database | PostgreSQL, MongoDB, Redis | Schema, queries, ORM |
| **F** | Django/DRF | Django 4-5, DRF 3.14+ | Multi-tenant, services, ViewSets |

**Template F: Django/DRF Multi-Tenant** (Recommended for Binora Backend):
- Principles: Transparent middleware (NO manual tenant_id), service layer (NO business logic in views), I/O serializer separation
- Anti-Patterns: Manual tenant_id filtering, business logic in views, Mock() import, N+1 queries
- Examples: `examples/django_service_layer_skill.md`, `examples/django_multi_tenant_isolation_skill.md`

**See**: `references/template_guide.md` for complete template structures

---

## Step 3: Content Generation

**Generate skill following this structure**:

1. **YAML Frontmatter**: name (max 64 chars), description (max 1024 chars), keywords, tech_stacks, version
2. **Header**: Skill name + auto-activation criteria
3. **Mission**: Single sentence with **bold targets** and metrics
4. **Core Principles** (3-5): Title + Rule + ❌ WRONG vs ✅ CORRECT + Auto-check list
5. **Anti-Patterns** (3-5): Title + ❌ ANTI-PATTERN + ✅ CORRECT + Why it matters
6. **Validation Checklist** (8-15 items): Grouped by priority (Critical/High/Medium)
7. **References**: Table with file paths and purposes
8. **Activation Criteria**: Keywords + contexts + auto-suggest scenarios
9. **Progressive Structure**: examples/ + templates/ + references/ + checklists/

**Output**: Complete SKILL.md ready for scoring

**See**: `references/usage_guide.md` for detailed step-by-step guide

---

## Step 4: Quality Scoring

**Apply 0-100 rubric across 5 categories**:

| Category | Points | Key Criteria |
|----------|--------|--------------|
| Structure | 20 | YAML valid, sections present, 150-300 lines, formatted |
| Activation | 20 | 5+ keywords, clear description, concrete triggers |
| Content | 25 | 3+ examples, project-specific, quantifiable metrics |
| Actionability | 20 | 8+ checklist items, auto-checks, yes/no questions |
| Reusability | 15 | References exist, principles generalizable, templates |
| **TOTAL** | **100** | **Target: 95+ for production** |

**Score Interpretation**:
- 95-100: Production-ready ✅
- 90-94: Excellent, minor tweaks
- 85-89: Good, targeted refinements
- <85: Iteration needed

**See**: `references/scoring_rubric.md` for detailed scoring criteria

---

## Step 5: Gap Analysis

**If score <95, identify specific improvements**:

- **Structure** (-X pts): Length, formatting, hierarchy issues → Condense, reorganize
- **Activation** (-X pts): Missing keywords, unclear description → Add triggers, enhance description
- **Content** (-X pts): Insufficient examples, vague metrics → Add ❌/✅ examples, quantify targets
- **Actionability** (-X pts): Weak checklist, no auto-checks → Expand checklist, add validation
- **Reusability** (-X pts): Missing references, too project-specific → Add docs, generalize core

**Prioritize**: Highest-impact improvements first

---

## Step 6: Iteration

**Apply improvements systematically**:

- Fix structure, enhance activation, strengthen content
- Boost actionability, improve reusability
- Re-score after changes

**Loop**: Repeat Steps 4-6 until score ≥95/100

**Target**: +5-10 points per iteration

**See**: `references/anti_patterns_guide.md` for common mistakes

---

## Step 7: Final Validation

**Confirm production quality** (score ≥95/100):

✅ **Structure**: YAML valid, proper sections, formatted correctly
✅ **Activation**: Clear keywords, complete description, concrete scenarios
✅ **Content**: 3+ examples, project-specific, quantifiable metrics
✅ **Actionability**: 8+ checklist items, actionable yes/no questions
✅ **Reusability**: References exist, principles generalizable, templates provided

**Output**: Production-ready confirmation or specific remaining issues

---

## References

**Progressive disclosure** - load when needed:

| Resource | Purpose | Lines |
|----------|---------|-------|
| `references/template_guide.md` | Complete template structures A-F | 500 |
| `references/anti_patterns_guide.md` | Common mistakes to avoid | 540 |
| `references/scoring_rubric.md` | Detailed 0-100 scoring criteria | 100 |
| `references/usage_guide.md` | Step-by-step workflow walkthrough | 497 |
| `templates/*.md` | 6 Django/DRF code templates | 3000 |
| `examples/*.md` | 5 complete Django skill examples | 2750 |
| `checklists/*.md` | Expanded validation checklists | Variable |

---

## Activation

**Keywords**: create skill, new skill, skill generator, add skill, generate skill, design skill, crear skill, nueva skill, generador de skills, añadir skill, diseñar skill

**Context triggers**:
- User mentions creating/designing/adding a skill
- User wants to enforce best practices proactively
- User discusses common mistakes or anti-patterns
- After implementing feature without proper patterns

**Explicit invocation**: "Use skill-creator to help me design a [domain] skill for [purpose]"

---

**Last Updated**: 2025-01-13
**Version**: 2.0.0
**Target Score**: 95+/100 (Django/DRF optimized, quality-guaranteed)
