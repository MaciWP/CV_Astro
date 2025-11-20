# Prompt Quality Checklist

**Use this checklist to validate prompts before submitting**

**Target Score**: ≥85/100 for production prompts

---

## ✅ Pre-Submission Checklist (40 Items)

### 1. Clarity & Specificity (10 items)

#### Action Verbs
- [ ] Does prompt use specific action verbs? (Analyze, Refactor, Implement vs Look at, Fix, Help)
- [ ] Is the action unambiguous? (One clear task, not multiple vague goals)

#### File Paths & Locations
- [ ] Are file paths absolute and specific? (lib/services/ml_service.dart:156 vs "the ML code")
- [ ] Are line numbers or ranges provided where applicable?
- [ ] Are class/method names explicitly mentioned?

#### Quantifiable Criteria
- [ ] Are performance targets quantified? (<200ms, >80% coverage, 5+ examples)
- [ ] Are success criteria measurable? (Not "better", but "reduce from X to Y")
- [ ] Are frequencies/probabilities specified? (100% reproducible, 20% random)

#### Technical Precision
- [ ] Are framework names and versions included? (Flutter 3.24, React 18.2, Node 18)
- [ ] Are library/dependency versions specified? (ONNX Runtime 1.22.0, jsonwebtoken 9.0)
- [ ] Is technical terminology domain-specific? (Not generic "database", but "PostgreSQL 15")

#### No Vague Language
- [ ] Prompt avoids "somehow", "maybe", "various", "stuff", "things"?
- [ ] No phrases like "fix it", "make better", "optimize" without context?

---

### 2. Context & Domain (10 items)

#### Project Architecture
- [ ] Is project architecture described? (Service-oriented, MVC, MVVM, Clean Architecture)
- [ ] Are relevant services/components mentioned? (MLService, UserController, AuthMiddleware)
- [ ] Are database/storage solutions specified? (Isar, PostgreSQL, Redis, LocalStorage)

#### Tech Stack
- [ ] Are all relevant frameworks listed? (Frontend, backend, mobile)
- [ ] Are state management solutions mentioned? (Riverpod, Redux, Context API)
- [ ] Are build tools/package managers specified? (npm, pub, pip, maven)

#### Error Details
- [ ] Are error messages included verbatim?
- [ ] Is stack trace provided (if available)?
- [ ] Are reproduction steps numbered and complete?

#### Edge Cases
- [ ] Are boundary conditions mentioned? (Empty inputs, null values, max limits)
- [ ] Are error scenarios considered? (Network failure, permission denied, timeout)

---

### 3. Structure (8 items)

#### XML Tags
- [ ] Does prompt use XML tags for multi-part content? (`<task>`, `<context>`, `<instructions>`)
- [ ] Are tags semantically meaningful? (Not `<section1>`, but `<requirements>`)
- [ ] Are instructions separated from data with tags?

#### Sequential Steps
- [ ] Are complex tasks broken into numbered steps?
- [ ] Are steps ordered logically? (Read → Analyze → Fix → Test)
- [ ] Are dependencies between steps clear?

#### Output Format
- [ ] Is desired output format explicitly defined?
- [ ] Are output examples provided with structure?

---

### 4. Advanced Techniques (6 items)

#### Chain of Thought
- [ ] For complex tasks, does prompt request step-by-step reasoning?
- [ ] Are `<thinking>` tags used for analysis-heavy tasks?

#### Few-Shot Examples
- [ ] Are 3-5 relevant examples provided for pattern-based tasks?
- [ ] Are examples diverse (cover edge cases)?

#### Quote Grounding
- [ ] For long documents, does prompt request quote extraction FIRST?
- [ ] Are quotes tagged with file/line references?

---

### 5. Actionability (6 items)

#### Immediate Executability
- [ ] Are all dependencies/prerequisites mentioned?
- [ ] Are required tools/commands specified?
- [ ] Is all information present? (No "fill in the blanks")

#### Tool Usage
- [ ] Are specific tools mentioned? (MCP servers, linters, test frameworks)
- [ ] Are commands provided with syntax? (`flutter pub run build_runner build`)

#### Success Criteria
- [ ] Is there a clear validation method?
- [ ] Are test scenarios provided?

---

## 📊 Scoring Guide

After completing checklist, calculate score:

### Clarity & Specificity (0-25 points)
- 10/10 items checked: 25 points
- 8-9/10: 20 points
- 6-7/10: 15 points
- 4-5/10: 10 points
- <4/10: <10 points

### Context & Domain (0-25 points)
- 10/10 items checked: 25 points
- 8-9/10: 20 points
- 6-7/10: 15 points
- 4-5/10: 10 points
- <4/10: <10 points

### Structure (0-20 points)
- 8/8 items checked: 20 points
- 6-7/8: 15 points
- 4-5/8: 10 points
- <4/8: <10 points

### Advanced Techniques (0-15 points)
- 6/6 items checked: 15 points
- 4-5/6: 10 points
- 2-3/6: 5 points
- <2/6: <5 points

### Actionability (0-15 points)
- 6/6 items checked: 15 points
- 4-5/6: 10 points
- 2-3/6: 5 points
- <2/6: <5 points

---

## 🎯 Interpretation

**95-100**: Exceptional - Production ready
**85-94**: Excellent - Minor tweaks possible
**70-84**: Good - Targeted refinements needed
**60-69**: Acceptable - Requires iteration
**<60**: Poor - Significant rework needed

---

## 🔧 Quick Fixes

### If Score <70:

**Missing Clarity** (<15/25):
→ Add file paths, line numbers, version numbers
→ Replace vague verbs with specific actions
→ Quantify all targets/criteria

**Missing Context** (<12/25):
→ Describe tech stack with versions
→ Include error messages/stack traces
→ Explain project architecture

**Poor Structure** (<12/20):
→ Add XML tags: `<task>`, `<context>`, `<instructions>`, `<output_format>`
→ Number steps for multi-step tasks
→ Define explicit output format with examples

**No Advanced Techniques** (<5/15):
→ Add "Think step-by-step" for complex reasoning
→ Include 3+ examples for pattern tasks
→ Use quote extraction for long documents

**Low Actionability** (<8/15):
→ Specify all tools/commands
→ Provide complete information (no assumptions)
→ Add validation/test criteria

---

## 📋 Print-Friendly Version

```
[ ] Action verbs specific?
[ ] File paths absolute?
[ ] Performance targets quantified?
[ ] Tech stack with versions?
[ ] Error messages included?
[ ] XML tags for structure?
[ ] Steps numbered?
[ ] Output format defined?
[ ] Chain of Thought for complexity?
[ ] 3+ examples for patterns?
[ ] Quote grounding for long docs?
[ ] All tools/commands specified?
[ ] Validation criteria clear?
```

13/13 = 100 points | 10-12 = 85-95 | 7-9 = 70-84 | <7 = <70

---

**Version**: 1.0.0
**Last Updated**: 2025-10-20
**Optimized for**: Claude Sonnet 4.5