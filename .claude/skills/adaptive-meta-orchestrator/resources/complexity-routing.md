# Complexity Routing - Complete Guide

**Complexity scoring (0-100) + keyword-based agent routing + calibration system.**

**Version**: 2.0.0
**Last Updated**: 2025-01-18
**Token Size**: ~6K tokens

---

## Overview

This reference provides complete complexity analysis and routing:

1. **4-Factor Complexity Scoring** (0-100) - File count + Duration + Dependencies + Risk
2. **Keyword-Based Routing** - 80+ keywords across agent types, confidence algorithm
3. **Memory Calibration** - Self-correcting estimates over time

**Use when**: Determining task complexity, selecting optimal agents, or calibrating estimates.

---

## Part 1: 4-Factor Complexity Scoring (0-100)

### Scoring Formula

```
Total Score (0-100) = File Count (0-25) + Duration (0-25) + Dependencies (0-25) + Risk (0-25)
```

---

### Factor 1: File Count (0-25 points)

**Keyword-Based Estimation**:

| Keyword | Estimated Files | Score |
|---------|-----------------|-------|
| 'full stack', 'complete system', 'entire application' | 10 | 15pts |
| 'from scratch', 'end-to-end' | 8 | 13pts |
| 'implement', 'create', 'build', 'develop' | 3 | 7pts |
| 'add feature', 'new module' | 4 | 9pts |
| 'modify', 'update', 'refactor', 'optimize' | 2 | 5pts |
| 'fix' | 1 | 2.5pts |

**Scoring Curve**:
```
0-2 files   → 0-5 pts   (files × 2.5)
3-5 files   → 6-10 pts  (5 + (files - 2) × 1.67)
6-10 files  → 11-15 pts (11 + (files - 5))
11-20 files → 16-20 pts (16 + (files - 10) × 0.5)
21+ files   → 21-25 pts (min(25, 21 + (files - 20) × 0.2))
```

---

### Factor 2: Duration (0-25 points)

**Keyword-Based Estimation (minutes)**:

| Keyword | Est. Duration | Score |
|---------|---------------|-------|
| 'architecture', 'redesign' | 180-240 min | 22-25pts |
| 'migration', 'complete rewrite' | 300-480 min | 25pts |
| 'implement', 'develop', 'build' | 90-120 min | 16-20pts |
| 'integrate', 'refactor' | 90 min | 15-18pts |
| 'modify', 'update' | 45-60 min | 8-12pts |
| 'fix' | 30 min | 5pts |

**Scoring Curve (hours)**:
```
0-1h   → 0-5 pts   (hours × 5)
1-4h   → 6-10 pts  (5 + (hours - 1) × 1.67)
4-8h   → 11-15 pts (11 + (hours - 4))
8-16h  → 16-20 pts (16 + (hours - 8) × 0.5)
16+h   → 21-25 pts (min(25, 21 + (hours - 16) × 0.25))
```

---

### Factor 3: Dependencies (0-25 points)

**Keyword-Based Estimation**:

| Keyword | Dependency Count | Score |
|---------|------------------|-------|
| 'microservices', 'distributed' | 4-5 | 20pts |
| 'integration', 'external api', 'third-party' | 2-3 | 10pts |
| 'database', 'sql', 'nosql' | 2 | 10pts |
| 'orm', 'framework', 'library', 'package' | 1-2 | 5-10pts |

**Scoring Thresholds**:
```
0 deps     → 0 pts
1-2 deps   → 5 pts
3-5 deps   → 10 pts
6-10 deps  → 15 pts
11-15 deps → 20 pts
16+ deps   → 25 pts
```

---

### Factor 4: Risk (0-25 points)

**Keyword-Based Risk Detection**:

| Keyword | Risk Points | Severity |
|---------|-------------|----------|
| 'payment' | 5pts | CRITICAL |
| 'security', 'encryption' | 4pts | HIGH |
| 'authentication', 'authorization', 'data migration' | 3-4pts | HIGH |
| 'performance critical', 'real-time' | 3pts | MEDIUM |
| 'machine learning', 'ai', 'algorithm' | 2-3pts | MEDIUM |
| 'scalability', 'concurrent', 'complex logic' | 2pts | MEDIUM |

**Risk Level Categorization**:
```
0 pts      → None
1-5 pts    → Low
6-15 pts   → Medium
16-25 pts  → High
```

---

### Complexity Categories

| Score | Category | Tool Selection | Example |
|-------|----------|----------------|---------|
| **0-25** | Low | Direct execution, 1 skill | "Fix typo in README" |
| **26-50** | Medium | 2-3 skills OR 1 agent | "Add login form with validation" |
| **51-75** | High | 3+ skills OR 2-5 agents | "Implement user authentication" |
| **76-100** | Very High | >5 agents (MUST decompose) | "Build complete e-commerce platform" |

---

### Example Scoring

#### Example 1: Simple Bug Fix
```
Prompt: "Fix the 404 error on the /api/users endpoint"

Analysis:
- File count: 1 file (fix) → 2.5 pts
- Duration: 30 min (fix) → 2.5 pts
- Dependencies: 0 (no new deps) → 0 pts
- Risk: 0 (no risk keywords) → 0 pts
Total: 5/100

Result:
{
  "score": 5,
  "category": "Low",
  "recommendation": "Single skill activation. Direct execution.",
  "reasoning": "Complexity: 5/100 (Low). 1 file, 0.5 hours, 0 dependencies, none risk."
}
```

#### Example 2: Medium Feature
```
Prompt: "Implement JWT authentication for REST API with refresh tokens"

Analysis:
- File count: 4 files (implement auth) → 8 pts
- Duration: 120 min (implement) → 10 pts
- Dependencies: 2 (jwt lib, redis) → 5 pts
- Risk: 4 (authentication: 3, security: 4, max one) → 4 pts
Total: 27/100

Result:
{
  "score": 27,
  "category": "Medium",
  "recommendation": "2-3 skills OR 1 agent recommended.",
  "reasoning": "Complexity: 27/100 (Medium). 4 files, 2.0 hours, 2 dependencies, low risk."
}
```

#### Example 3: High Complexity
```
Prompt: "Build complete microservices architecture with user/product/order services, API gateway, auth, databases"

Analysis:
- File count: 20+ files (complete system) → 21 pts
- Duration: 480 min (from scratch, architecture) → 25 pts
- Dependencies: 10+ (microservices, databases, auth) → 15 pts
- Risk: 9 (architecture: 2, auth: 3, distributed: 4) → 9 pts
Total: 70/100

Result:
{
  "score": 70,
  "category": "High",
  "recommendation": "2-5 agents recommended. Decomposition into subtasks advised.",
  "reasoning": "Complexity: 70/100 (High). 20 files, 8.0 hours, 10 dependencies, medium risk. Multi-agent coordination required."
}
```

---

## Part 2: Keyword-Based Routing

### Routing Algorithm

**3-Component Confidence Calculation**:

```
Confidence = Base Score (0-50) + Gap Bonus (0-30) + Keyword Bonus (0-20)
```

---

### Agent Types & Keywords

| Agent Type | Keywords (Score Impact) | Confidence Base |
|------------|------------------------|-----------------|
| **backend-dev** | api, endpoint, server, database, auth, rest, graphql, sql, orm | 40-50 |
| **frontend-dev** | ui, component, react, vue, css, html, responsive, animation | 40-50 |
| **qa-tester** | test, coverage, unit, integration, e2e, pytest, jest, vitest | 40-50 |
| **researcher** | analyze, research, investigate, compare, evaluate, study | 35-45 |
| **code-reviewer** | review, audit, refactor, improve, optimize, quality, patterns | 35-45 |
| **devops-engineer** | deploy, docker, kubernetes, ci/cd, pipeline, infrastructure | 40-50 |

---

### Keyword Matrix (Condensed)

**Backend Development**:
- Primary (5pts each): `api`, `endpoint`, `server`, `database`, `auth`, `rest`, `graphql`
- Secondary (3pts each): `sql`, `orm`, `cache`, `redis`, `jwt`, `session`, `middleware`
- Tertiary (1pt each): `model`, `schema`, `migration`, `query`, `transaction`

**Frontend Development**:
- Primary (5pts): `ui`, `component`, `react`, `vue`, `angular`, `css`, `html`
- Secondary (3pts): `responsive`, `animation`, `state`, `props`, `hooks`, `router`
- Tertiary (1pt): `style`, `layout`, `form`, `button`, `modal`, `dropdown`

**QA/Testing**:
- Primary (5pts): `test`, `coverage`, `unit`, `integration`, `e2e`, `pytest`, `jest`
- Secondary (3pts): `mock`, `stub`, `fixture`, `assertion`, `spec`, `suite`
- Tertiary (1pt): `tdd`, `bdd`, `regression`, `smoke`, `sanity`

---

### Confidence Scoring Components

#### 1. Base Score (0-50 points)

Keyword match count × 5 (capped at 50)

```
Example: "Create REST API endpoint with JWT auth"
Keywords matched: rest (5), api (5), endpoint (5), jwt (3), auth (5)
Total: 23 pts → Base Score: 50 (capped)
```

---

#### 2. Gap Bonus (0-30 points)

Difference between top match and second-best match.

```
Formula: min(30, (top_score - second_best_score) × 3)

Example:
- backend-dev: 50 pts
- devops-engineer: 10 pts
Gap: (50 - 10) × 3 = 120 → Gap Bonus: 30 (capped)
```

---

#### 3. Keyword Bonus (0-20 points)

Rare/specialized keyword matches.

```
Rare keywords (10pts each, max 20):
- 'grpc', 'protobuf', 'graphql', 'websocket', 'sse', 'oauth2'
- 'kubernetes', 'terraform', 'ansible', 'jenkins'
- 'ml', 'ai', 'neural', 'onnx', 'tensorflow'
```

---

### Routing Example

```
Prompt: "Create FastAPI REST endpoint with JWT authentication"

Keyword Analysis:
- backend-dev: rest (5), api (5), endpoint (5), fastapi (5), jwt (3), auth (5) = 28 pts
- frontend-dev: 0 pts
- qa-tester: 0 pts
- devops-engineer: api (1) = 1 pt

Confidence Calculation:
- Base Score: 28 × 1.5 = 42 pts (capped at 50)
- Gap Bonus: (42 - 1) × 3 = 120 → 30 pts (capped)
- Keyword Bonus: 0 (no rare keywords)
Total Confidence: 42 + 30 + 0 = 72/100

Recommendation:
{
  "recommended_agent": "backend-dev",
  "confidence": 72,
  "reasoning": "High backend keyword density + clear gap vs other agents"
}
```

---

## Part 3: Memory Calibration

### Self-Correcting Estimates

After task completion, store actual vs estimated complexity:

```python
memory.store_complexity_calibration(
    prompt=prompt,
    estimated_complexity=27,
    actual_complexity=32,  # Based on actual: 5 files, 2.5 hours
    factors={'file_count': 8, 'duration': 10, 'dependencies': 5, 'risk': 4}
)
```

---

### Calibration Factor

After 10+ samples, calculate calibration factor:

```python
calibration_factor = memory.get_complexity_calibration_factor()
# Returns: 0.9 (we over-estimate by ~10%)

adjusted_score = complexity['score'] * calibration_factor
# 27 × 0.9 = 24.3 → More accurate estimate
```

**Benefits**:
- Self-correcting estimates over time
- Project-specific calibration (Flutter vs Python vs Node.js)
- Personalized to coding speed

---

## Quick Reference

**When to load this reference**:
- Need to score task complexity (0-100)
- Selecting optimal agent for task
- Understanding complexity factors
- Calibrating estimates over time
- Need keyword-based routing logic

**Integration with SKILL.md**:
- SKILL.md provides compact complexity scoring (table format)
- This reference provides full 4-factor algorithm + keyword matrix + calibration
- Load this when implementing complexity analysis or agent routing

---

**Last Updated**: 2025-01-18
**Source Documents**: scoring-algorithm.md (298 lines), routing-algorithm.md (~600 lines)
**Consolidated Size**: ~900 lines → ~6K tokens
**Optimization**: Unified scoring system, condensed keyword matrix, added calibration system