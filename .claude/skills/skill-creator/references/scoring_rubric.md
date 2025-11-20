# Skill Quality Scoring Rubric (0-100)

**Version**: 2.0.0
**Last Updated**: 2025-01-13
**Purpose**: Detailed scoring criteria for skill-creator Step 4 (Quality Scoring)

---

## Overview

This rubric provides objective, measurable criteria for evaluating skill quality across 5 categories totaling 100 points. **Target score: 95+ for production use**.

---

## Category 1: Structure (20 points)

### YAML Frontmatter (5 points)

| Points | Criteria |
|--------|----------|
| 5 | Valid YAML, all required fields (name, description), proper formatting |
| 4 | Valid YAML, missing optional fields (keywords, tech_stacks, version) |
| 3 | Valid YAML, only basic fields (name, description), no enhancements |
| 2 | Invalid YAML but parseable, missing critical fields |
| 0 | No YAML frontmatter or completely invalid |

**Required fields**: `name`, `description`
**Enhanced fields**: `keywords`, `tech_stacks`, `version`

### Section Completeness (5 points)

| Points | Criteria |
|--------|----------|
| 5 | All required sections present and properly structured |
| 4 | All required sections present, minor structure issues |
| 3 | Missing 1 optional section (e.g., References) |
| 2 | Missing 2+ optional sections |
| 0 | Missing critical sections (Mission, Core Principles, Anti-Patterns) |

**Required sections**: Header, Mission, Core Principles, Anti-Patterns, Validation Checklist, Activation
**Optional sections**: References, Examples, Templates

### Length Optimization (5 points)

| Points | Criteria |
|--------|----------|
| 5 | 150-250 lines (optimal for context efficiency) |
| 4 | 100-150 or 250-300 lines (acceptable) |
| 3 | 300-400 lines (too long, move content to references/) |
| 2 | 400-500 lines (excessive, significant refactoring needed) |
| 0 | >500 lines or <100 lines |

**Rationale**: Progressive disclosure - keep SKILL.md compact, detailed content in references/

### Formatting Quality (5 points)

| Points | Criteria |
|--------|----------|
| 5 | Consistent headers, proper markdown, code blocks formatted, tables aligned |
| 4 | Minor formatting inconsistencies (e.g., inconsistent header levels) |
| 3 | Multiple formatting issues but readable |
| 2 | Poor formatting, hard to scan |
| 0 | Unformatted or broken markdown |

---

## Category 2: Activation (20 points)

### Keyword Coverage (7 points)

| Points | Criteria |
|--------|----------|
| 7 | 7+ specific, domain-relevant keywords in description + keywords field |
| 6 | 5-6 keywords, all relevant |
| 5 | 5+ keywords but some generic ("code", "quality") |
| 3 | 3-4 keywords, mostly generic |
| 0 | <3 keywords or none |

**Good keywords**: domain-specific terms (ViewSet, pytest-django, multi-tenant)
**Bad keywords**: generic terms (code, quality, best practice)

### Concrete Triggers (7 points)

| Points | Criteria |
|--------|----------|
| 7 | 3+ concrete scenarios showing real activation contexts |
| 6 | 2 concrete scenarios with examples |
| 5 | Abstract trigger descriptions without examples |
| 3 | Vague trigger criteria |
| 0 | No activation criteria defined |

**Example**: ✅ "User says: 'I need CRUD endpoints for Asset model'" vs ❌ "When user needs API help"

### Description Quality (6 points)

| Points | Criteria |
|--------|----------|
| 6 | <1024 chars, clear purpose, activation keywords, enforces/prevents list |
| 5 | <1024 chars, clear purpose, missing some details |
| 4 | Clear purpose but >1024 chars or missing key details |
| 2 | Vague purpose or >1500 chars |
| 0 | No description or >2000 chars |

---

## Category 3: Content Quality (25 points)

### Code Examples (8 points)

| Points | Criteria |
|--------|----------|
| 8 | 5+ ❌/✅ code pairs, project-specific, realistic |
| 7 | 3-4 ❌/✅ pairs, project-specific |
| 6 | 3 ❌/✅ pairs, somewhat generic |
| 4 | 1-2 ❌/✅ pairs |
| 0 | No code examples or no ❌/✅ comparisons |

**Quality check**: Examples use actual project patterns, not placeholder/generic code

### Project Specificity (6 points)

| Points | Criteria |
|--------|----------|
| 6 | References real project files, uses actual class/function names, cites docs |
| 5 | References project structure, uses realistic examples |
| 4 | Generic examples adapted with {{project_name}} slots |
| 2 | Completely generic examples |
| 0 | No project context |

**Example**: ✅ "apps/core/services.py:45 - AuthService.create_user()" vs ❌ "service layer"

### Quantifiable Metrics (6 points)

| Points | Criteria |
|--------|----------|
| 6 | All targets quantified (%, ms, lines, count) with specific thresholds |
| 5 | Most targets quantified, some vague |
| 4 | Some targets quantified |
| 2 | Vague targets ("improve performance", "better quality") |
| 0 | No metrics |

**Example**: ✅ "Query latency <100ms" vs ❌ "Fast queries"

### Completeness (5 points)

| Points | Criteria |
|--------|----------|
| 5 | Covers all aspects of domain, addresses edge cases, comprehensive |
| 4 | Covers main aspects, missing edge cases |
| 3 | Covers basics only |
| 2 | Incomplete, major gaps |
| 0 | Minimal content |

---

## Category 4: Actionability (20 points)

### Checklist Quality (6 points)

| Points | Criteria |
|--------|----------|
| 6 | 10+ items, yes/no questions, grouped by priority, specific |
| 5 | 8-9 items, mostly yes/no, grouped |
| 4 | 8+ items but vague or not yes/no |
| 3 | 5-7 items |
| 0 | <5 items or no checklist |

**Good**: ✅ "Does ViewSet delegate ALL business logic to service?"
**Bad**: ❌ "Is code quality good?"

### Auto-Checks (5 points)

| Points | Criteria |
|--------|----------|
| 5 | 5+ automated validation suggestions (grep, pytest, custom scripts) |
| 4 | 3-4 auto-check suggestions |
| 3 | 1-2 auto-check suggestions |
| 0 | No automation suggestions |

**Example**: "grep -r 'tenant_id=' apps/ → Should return 0 results"

### Applicability (4 points)

| Points | Criteria |
|--------|----------|
| 4 | All items actionable immediately, no subjective judgments |
| 3 | Most items actionable, some subjective |
| 2 | Many items require interpretation |
| 0 | Items not actionable |

---

## Category 5: Reusability (15 points)

### Generalizable Principles (5 points)

| Points | Criteria |
|--------|----------|
| 5 | Core principles work across projects with minimal changes |
| 4 | Principles mostly generalizable, some project-specific |
| 3 | Mix of general and project-specific |
| 2 | Heavily project-specific |
| 0 | Not reusable |

**Test**: Could another Django/DRF project use this skill with <10% changes?

### Project Examples (5 points)

| Points | Criteria |
|--------|----------|
| 5 | Real file references, actual code snippets from project |
| 4 | References to project files, generic code |
| 3 | Generic examples with project context |
| 2 | Minimal project context |
| 0 | No project examples |

### Documentation Links (5 points)

| Points | Criteria |
|--------|----------|
| 5 | 5+ links to project docs, official docs, authoritative sources |
| 4 | 3-4 relevant links |
| 3 | 1-2 links |
| 0 | No documentation links |

**Include**: Project CLAUDE.md, official framework docs, architecture guides

---

## Scoring Interpretation

### 95-100 Points: Exceptional ✅
**Production-ready**. Deploy immediately. Skill demonstrates:
- Complete coverage of domain
- Project-specific examples and references
- Quantifiable, measurable targets
- Actionable validation checklists
- Generalizable core with project customization

**Next steps**: Use in production, monitor effectiveness, iterate based on usage

### 90-94 Points: Excellent
**Near production-ready**. Minor improvements recommended:
- Add 1-2 more code examples
- Enhance 2-3 checklist items
- Add missing documentation links
- Quantify remaining vague targets

**Estimated effort**: 15-30 min iteration

### 85-89 Points: Very Good
**Targeted refinements needed**:
- Increase code examples to 5+
- Make all metrics quantifiable
- Expand checklist to 10+ items
- Add project-specific references
- Improve keyword specificity

**Estimated effort**: 1-2 hours iteration

### 80-84 Points: Good
**Significant iteration needed**:
- Content gaps in 2+ categories
- Examples too generic
- Checklist insufficient
- Missing automation suggestions
- Weak project integration

**Estimated effort**: 2-4 hours iteration

### Below 80 Points: Needs Work
**Major refactoring required**:
- Return to Step 1 (Requirements Gathering)
- Consider different template selection
- Insufficient domain understanding
- Incomplete content generation

**Estimated effort**: Restart workflow or 4+ hours refactoring

---

## Common Deductions

### Structure Category (-X points)
- Missing YAML frontmatter: -5
- No keywords field: -2
- Length >400 lines: -3
- Broken markdown: -5

### Activation Category (-X points)
- <5 keywords: -7
- No concrete scenarios: -7
- Description >1024 chars: -3

### Content Category (-X points)
- <3 code examples: -8
- No project references: -6
- Vague metrics: -6

### Actionability Category (-X points)
- <8 checklist items: -6
- No auto-checks: -5
- Vague questions: -4

### Reusability Category (-X points)
- Overly project-specific: -5
- No real file references: -5
- No documentation links: -5

---

## Quality Assurance Checklist

Before finalizing score, verify:

- [ ] All 5 categories scored independently
- [ ] Deductions justified with specific examples
- [ ] Suggestions provided for each deduction
- [ ] Total adds up to 100
- [ ] Score interpretation correct (95+, 90-94, etc.)
- [ ] Gap analysis identifies specific improvements if <95

---

**Pro Tip**: Use this rubric during Step 4 (Quality Scoring) to objectively evaluate generated skills. For scores <95, use gap analysis in Step 5 to identify specific improvements, then iterate in Step 6.

---

**Version History**:
- v2.0.0 (2025-01-13): Django/DRF optimization, added concrete scenarios, bilingual keywords
- v1.0.0 (2025-01-10): Initial rubric for EasyBoard Flutter adaptation