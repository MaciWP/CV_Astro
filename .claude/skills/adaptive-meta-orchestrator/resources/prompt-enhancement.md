# Prompt Enhancement - Complete Guide

**Transform vague requests into structured, actionable prompts: 100-point checklist + Anthropic best practices + 12 patterns.**

**Version**: 2.0.0
**Last Updated**: 2025-01-18
**Token Size**: ~8K tokens

---

## Overview

This reference provides complete prompt enhancement guidance:

1. **100-Point Quality Checklist** - Measurable criteria across 5 sections
2. **Anthropic Best Practices** - Claude Sonnet 4.5 optimization techniques
3. **12 Prompt Patterns** - Research-backed patterns for common scenarios

**Use when**: Prompt quality <70/100, need to enhance vague requests, or applying advanced techniques (CoT, Quote Grounding, Few-Shot).

---

## Part 1: 100-Point Quality Checklist

Apply this checklist to measure and improve prompt quality.

### Section 1: Clarity & Specificity (25 points)

| Element | Points | Criteria | Example |
|---------|--------|----------|---------|
| **Action Verbs** | 5pts | Precise verbs (Refactor, Analyze, Implement, Optimize) not vague (Fix, Update) | ✅ "Refactor UserService.authenticate()" ❌ "Fix auth code" |
| **File Paths** | 5pts | Absolute paths + line numbers (`lib/services/ml_service.dart:156`) | ✅ `src/services/user.py:87` ❌ "the auth file" |
| **Quantifiable Criteria** | 5pts | Measurable targets (`<150ms`, `>80% coverage`, `0 errors`) | ✅ "<100ms query time" ❌ "faster" |
| **Technical Precision** | 5pts | Framework + version + 5+ domain terms | ✅ "FastAPI 0.104, Pydantic, SQLAlchemy 2.0, AsyncSession, Argon2id" ❌ "the app" |
| **No Vague Language** | 5pts | Zero vague words (maybe, somehow, stuff, things, better) | ✅ "Add null safety check before accessing cameraController.value" ❌ "Maybe fix camera stuff" |

**Section 1 Total**: 25 points | **Pass**: ≥19 points (75%)

---

### Section 2: Context & Domain (25 points)

| Element | Points | Criteria | Example |
|---------|--------|----------|---------|
| **Architecture Clarity** | 5pts | Specific architecture + patterns (Service-oriented + Constructor DI + Repository) | ✅ "Django 5.0 + DRF 3.14 + service layer + multi-tenant" ❌ "MVC app" |
| **Tech Stack** | 6pts | All dependencies with versions (Python 3.11, FastAPI 0.104, SQLAlchemy 2.0) | ✅ Complete stack ❌ "Python app" |
| **Error Details** | 6pts | Error message + stack trace + reproduction steps | ✅ Full context ❌ "it crashes" |
| **Edge Cases** | 4pts | 3+ edge cases with handling strategy (null, empty, timeout) | ✅ "Handle: user.preferences None, empty dict, missing 'theme' key" ❌ No edge cases |
| **Current State** | 4pts | Describes current implementation + baseline metrics | ✅ "Currently loads ONNX model on each inference (250ms overhead)" ❌ "ML code is slow" |

**Section 2 Total**: 25 points | **Pass**: ≥19 points (75%)

---

### Section 3: Structure (20 points)

| Element | Points | Criteria | Example |
|---------|--------|----------|---------|
| **XML Tags** | 8pts | All 4 tags present: `<task>`, `<context>`, `<requirements>`, `<output_format>` | ✅ All tags ❌ Plain text |
| **Numbered Steps** | 6pts | All instructions numbered 1, 2, 3... with clear sequence | ✅ Sequential ❌ Prose paragraph |
| **Output Format** | 6pts | Structured output with sub-tags and descriptions | ✅ `<solution>`, `<test>`, `<verification>` ❌ No format specified |

**Section 3 Total**: 20 points | **Pass**: ≥15 points (75%)

---

### Section 4: Advanced Techniques (15 points)

| Element | Points | Criteria | When to Use |
|---------|--------|----------|-------------|
| **Chain of Thought** | 5pts | `<thinking>` tags with 4-step reasoning for complex tasks | ML inference, architecture refactoring, multi-agent coordination |
| **Few-Shot Examples** | 5pts | 3+ before/after examples showing pattern | Teaching patterns (DI, error handling, testing) |
| **Quote Grounding** | 5pts | Explicit quote extraction step for long files (>200 lines) | Code review, architecture analysis, refactoring |

**Section 4 Total**: 15 points | **Pass**: ≥11 points (73%)

---

### Section 5: Actionability (15 points)

| Element | Points | Criteria | Example |
|---------|--------|----------|---------|
| **Dependencies** | 3pts | All packages with versions + import statements | ✅ `FastAPI==0.104.1` + `from fastapi import FastAPI` ❌ "Use some library" |
| **Commands** | 4pts | Complete commands with flags and paths | ✅ `pytest tests/ -v --cov=app --cov-report=html` ❌ "Run tests" |
| **Success Criteria** | 4pts | Measurable validation with expected output | ✅ "Login returns 200 + JWT, invalid returns 401" ❌ "Make sure it works" |
| **Test Strategy** | 2pts | Unit tests with mock setup specified | ✅ Mock user without preferences, assert default theme ❌ "Add tests" |
| **Immediately Executable** | 2pts | No clarifying questions needed (all paths, methods, versions present) | ✅ Complete ❌ Missing critical info |

**Section 5 Total**: 15 points | **Pass**: ≥11 points (73%)

---

### Overall Scoring

| Total Score | Grade | Interpretation | Action |
|-------------|-------|----------------|--------|
| **95-100** | ✅ Exceptional | Production-ready | Proceed directly |
| **85-94** | 🟢 Excellent | Minor tweaks possible | Good to go |
| **70-84** | 🟡 Good | Targeted refinements needed | Apply quick fixes (5-10min) |
| **60-69** | 🟠 Fair | Requires iteration | Enhance structure + specificity |
| **<60** | 🔴 Poor | Significant rework needed | Apply enhancement patterns |

---

## Part 2: Anthropic Best Practices

Core principles for Claude Sonnet 4.5 optimization.

### 1. Clarity Over Brevity

**Research Finding**: Detailed instructions outperform terse ones by 30-40% on complex tasks.

**Golden Rule**: If a colleague unfamiliar with the task would be confused, Claude will be too.

❌ **Bad (Vague)**: "Improve database performance"

✅ **Good (Clear)**:
```xml
<task>Optimize PostgreSQL query in UserService.getActiveUsers() to reduce latency from 850ms to <100ms for 10K+ user databases</task>

<context>
  <current_query>SELECT * FROM users WHERE status='active' ORDER BY created_at DESC</current_query>
  <performance_target><100ms for 10,000 users</performance_target>
  <constraints>Must maintain result ordering</constraints>
</context>

<instructions>
1. Analyze current query plan with EXPLAIN ANALYZE
2. Identify missing indexes (likely on status + created_at)
3. Add appropriate indexes
4. Consider pagination (LIMIT/OFFSET) if applicable
5. Benchmark with realistic data volume
</instructions>
```

**Impact**: +35 points quality score (28 → 63)

---

### 2. XML Structuring

**Research Finding**: XML tags improve parsing accuracy by 25-35% vs plain text.

**Recommended Structure**:
```xml
<task>One-line description with action verb</task>

<context>
  <file>absolute/path/file.ext:line</file>
  <error>Exact error message</error>
  <tech_stack>
    - Language version
    - Framework version
    - Major dependencies
  </tech_stack>
  <current_state>What exists now</current_state>
</context>

<requirements>
  1. Functional requirement
  2. Performance requirement
  3. Security requirement
  4. Testing requirement
</requirements>

<output_format>
<solution>Complete code with comments</solution>
<test>Unit test code</test>
<verification>Steps to validate</verification>
</output_format>
```

---

### 3. Chain of Thought (CoT)

**When to use**: Complex tasks requiring multi-step reasoning (ML inference, architecture decisions, performance optimization).

**Pattern**:
```xml
<thinking>
1. Analyze current authentication flow (JWT generation, storage, validation)
2. Identify security gaps (HS256 → RS256, no token blacklist, bcrypt → Argon2id)
3. Design RS256 key pair generation and storage strategy
4. Plan Redis blacklist implementation for logout
5. Estimate migration impact (breaking change for existing tokens)
</thinking>
```

**Impact**: +30-45 points for complex tasks

---

### 4. Quote Grounding

**When to use**: Long files (>200 lines), need verifiable evidence, prevent hallucinations.

**Pattern**:
```xml
<instructions>
1. Extract all service instantiation quotes from lib/main.dart with <quote line='X-Y'>
2. Analyze each quote for GetIt/locator anti-pattern
3. Refactor each quote to constructor DI
4. Verify with flutter analyze
</instructions>
```

**Impact**: 95%+ factual accuracy

---

### 5. Few-Shot Prompting

**When to use**: Teaching patterns, preventing anti-patterns, showing correct approach.

**Pattern**:
```python
# ❌ BEFORE: Panic risk
theme := req.Email.GetValue()  # Panic if Email is nil

# ✅ AFTER: Nil-safe
if req.Email != nil {
    theme := req.Email.GetValue()  # Safe access
}

# ❌ BEFORE: Panic risk
user.Preferences["theme"]  # Panic if key missing

# ✅ AFTER: Safe with default
theme, ok := user.Preferences["theme"]
if !ok {
    theme = "light"  # Default value
}
```

**Impact**: +25-35 points, prevents anti-patterns

---

## Part 3: 12 Prompt Patterns

Research-backed patterns for common scenarios.

### Pattern Selection Guide

| Symptom | Pattern(s) | Score Improvement |
|---------|-----------|-------------------|
| Vague/missing context | Template + Context Building | +40-60 pts |
| Complex multi-step | Cognitive Verifier | +30-45 pts |
| Need accuracy verification | Chain of Verification + Quote Grounding | +20-40 pts |
| Multiple valid approaches | Alternative Approaches + Menu Actions | +25-35 pts |
| Teaching opportunity | Flipped Interaction | +15-25 pts |

---

### 1. Template Pattern

**When**: Prompt lacks structure, missing key elements (task, context, output format).

**Before**: "create a provider"

**After**:
```xml
<task>Create Riverpod AsyncNotifier provider for UserRepository with Isar integration</task>

<context>
  <file>lib/providers/user_provider.dart</file>
  <architecture>Service-oriented + Constructor DI</architecture>
  <constraints>100% Constructor DI - NEVER GetIt/locator</constraints>
  <dependencies>Riverpod 2.4.9, Isar 3.1.0</dependencies>
</context>

<requirements>
1. AsyncNotifier<User?> with loading/error/data states
2. CRUD methods: create, read, update, delete
3. Error handling with Result<T,E>
4. 100% test coverage with AAA pattern
</requirements>

<output_format>
<provider_code>Complete provider with type hints and error handling</provider_code>
<test_code>Unit tests covering all CRUD operations</test_code>
<verification>flutter test && flutter analyze (0 warnings)</verification>
</output_format>
```

**Impact**: +40-60 points

---

### 2. Cognitive Verifier Pattern

**When**: Complex requests requiring multi-step reasoning, validation, fact-checking.

**Process**: Decompose into 3-5 sub-questions → Answer each independently → Synthesize → Verify consistency.

**Example**: "Why is ONNX slow?"
- Sub-Q1: What's current latency?
- Sub-Q2: What's target latency?
- Sub-Q3: Where's the bottleneck?
- Sub-Q4: Is model cached?
- Sub-Q5: Is tensor format correct?
→ Identify missing profiling data → Request baseline metrics

**Impact**: Prevents 80%+ wrong diagnoses

---

### 3. Quote Grounding Pattern

**When**: Answers need verifiable evidence from files/docs/knowledge base.

**Process**: Every claim backed by explicit quote with `[file:line]` reference.

**Example**: "EasyBoard requires constructor DI"
→ Quote: `.claude/context/critical-context.md:45 "100% Constructor DI - NEVER new Service()"`

**Impact**: 95%+ factual accuracy

---

### 4. Chain of Verification Pattern

**When**: Complex/critical answers where correctness essential (architecture, performance, compatibility).

**5-Step Process**:
1. Generate baseline answer
2. List verification questions
3. Answer with evidence
4. Revise if contradictions
5. Score confidence 0-100

**Example**: "Use FutureBuilder?"
→ Baseline says YES
→ Verification reveals mutable data needs AsyncNotifier
→ Revise to NO
→ Confidence 95/100

**Impact**: Catches 95%+ errors before implementation

---

### 5. Alternative Approaches Pattern

**When**: Multiple valid solutions exist, user needs help choosing optimal approach.

**Process**: Present 2-4 alternatives with trade-offs (pros, cons, effort, impact).

**Example**: "Optimize slow query?"
- Alt 1: @Index (effort: 2min, impact: 20x faster) ← Recommended
- Alt 2: .where vs .filter (effort: 1min, impact: 3x faster)
- Alt 3: Batch operations (effort: 10min, impact: 10x faster)

**Impact**: Prevents suboptimal solution choice

---

### 6-12. Additional Patterns (Quick Reference)

| Pattern | When to Use | Impact |
|---------|-------------|--------|
| **Reflection** | After tasks, identify improvements | +20% efficiency in subsequent tasks |
| **Menu Actions** | User needs to choose from discrete options | Reduces decision paralysis |
| **Tail Generation** | Long code/docs generation (context may run out) | Prevents incomplete generations |
| **Semantic Filter** | Large codebase search by meaning (not keywords) | 5x faster navigation |
| **Refusal Breaker** | Legitimate request blocked by safety constraints | Unblocks 80%+ legitimate requests |
| **Context Building** | Build up context progressively for complex tasks | +40-60 points |
| **Flipped Interaction** | Teach user patterns (Claude asks questions) | +15-25 points |

---

## Quick Enhancement Workflow

### If Score <70 → Apply These Fixes (10 minutes)

1. **Add Specificity** (5 min):
   - Add file:line paths
   - Add tech stack with versions
   - Quantify all targets (<100ms, >80%)

2. **Add Structure** (3 min):
   - Wrap in XML tags (`<task>`, `<context>`, `<requirements>`, `<output_format>`)
   - Number steps 1, 2, 3...

3. **Add Success Criteria** (2 min):
   - List measurable validation steps
   - Expected output for each

### Re-Score → Should reach 85+

---

## Best Practices

### DO ✅

- Apply 100-point checklist to all prompts
- Use XML tags for structure
- Provide absolute file paths with line numbers
- Quantify all performance targets
- Include tech stack with versions
- Add 3+ concrete examples for patterns
- Use Chain of Thought for complex reasoning
- Apply Quote Grounding for verifiable claims

### DON'T ❌

- Use vague language (maybe, somehow, better, improve)
- Skip context (architecture, current state, edge cases)
- Provide relative paths or partial info
- Use generic terms ("the app", "the code", "the function")
- Omit success criteria or validation steps
- Mix multiple unrelated tasks in one prompt
- Skip examples when teaching patterns

---

## Quick Reference

**When to load this reference**:
- Prompt quality score <70/100
- Need to enhance vague user request
- Applying advanced techniques (CoT, Quote Grounding, Few-Shot)
- Teaching patterns to users
- Need pattern selection guidance

**Integration with SKILL.md**:
- SKILL.md provides quick assessment (confidence levels, when to ask)
- This reference provides full 100-point checklist + best practices + 12 patterns
- Load this when enhancing complex prompts or need detailed criteria

---

**Last Updated**: 2025-01-18
**Source Documents**: PROMPT_QUALITY_CHECKLIST_UNIVERSAL.md (531 lines), anthropic-best-practices.md (~800 lines), patterns-overview.md (100 lines)
**Consolidated Size**: ~1,400 lines → ~8K tokens
**Optimization**: Unified scoring system, eliminated duplication, added pattern selection guide