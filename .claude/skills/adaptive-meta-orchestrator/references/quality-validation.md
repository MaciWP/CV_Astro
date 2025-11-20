# Quality Validation - Complete Guide

**Circuit breakers + Chain of Verification + health monitoring + metrics integration.**

**Version**: 2.0.0
**Last Updated**: 2025-01-18
**Token Size**: ~6K tokens

---

## Overview

This reference provides complete quality validation and error handling:

1. **Circuit Breaker Patterns** - CLOSED/OPEN/HALF-OPEN states, cascading error prevention
2. **Chain of Verification (CoV)** - 5-step methodology, confidence scoring (0-100)
3. **Health Monitoring** - Pre-execution checks, bottleneck detection, metrics
4. **Validation Gates** - Linting, tests, security, architecture compliance

**Use when**: Implementing error recovery, validating complex answers, or monitoring execution health.

---

## Part 1: Circuit Breaker Patterns

### State Machine

```
         Success Count > Threshold
    ┌──────────────────────────────────┐
    │                                  │
    ▼                                  │
[CLOSED] ──Error Count > Threshold──> [OPEN]
    │                                   │
    │                                   │ Timeout Expires
    │                                   │
    │                                   ▼
    └─────── Success ──────────── [HALF-OPEN]
                                        │
                                        │ Error
                                        │
                                        └──────> [OPEN]
```

---

### State: CLOSED (Normal Operation)

**Status**: All systems operational, requests pass through.

**Behavior**:
- Execute operations normally
- Track error rate
- If errors exceed threshold → transition to OPEN

**Example**:
```
✅ QUALITY ASSURANCE
- Circuit Breaker: CLOSED (normal operation)
- All validation gates pass
- Proceed with task execution
```

---

### State: OPEN (Blocked)

**Status**: Critical blocker detected, requests rejected immediately.

**Behavior**:
- Fail fast (don't attempt operation)
- Surface error to user with clear message
- Provide fallback options
- Start timeout timer (attempt recovery after duration)

**Triggers**:
- Missing critical information (no file path, no error message)
- Unrecoverable error (service unavailable, invalid credentials)
- Validation gate failure (security risk, performance blocker)

**Example**:
```
🚨 QUALITY ASSURANCE
- Circuit Breaker: OPEN (critical blocker detected)
- Blocker: Missing baseline metrics for optimization
- Reason: Cannot optimize "slow ONNX inference" without profiling data
- Fallback: Request user to enable LoggingService.performance
```

---

### State: HALF-OPEN (Recovery Attempt)

**Status**: Testing if blocker resolved, limited requests allowed.

**Behavior**:
- Allow 1-3 test requests
- If success → transition to CLOSED
- If error → transition back to OPEN

**Example**:
```
⚠️ QUALITY ASSURANCE
- Circuit Breaker: HALF-OPEN (recovery attempt)
- Test Request: Attempt to load missing file after user confirmation
- Result: Success → Transition to CLOSED
```

---

### Exponential Backoff Strategy

**Pattern**: Increase retry delay exponentially to avoid overwhelming system.

```
Retry 1: Wait 1 second
Retry 2: Wait 2 seconds
Retry 3: Wait 4 seconds
Retry 4: Wait 8 seconds
Max Retries: 3-5
```

**When to Apply**:
- Transient failures (network timeout, temporary file lock)
- External service rate limits
- Resource contention

**When NOT to Apply**:
- Permanent failures (file not found, syntax error)
- Validation errors (schema mismatch, type error)
- User input errors (invalid credentials, missing required field)

---

## Part 2: Chain of Verification (CoV)

### Methodology

**"Unreliable self-validation" - Top limitation in multi-agent research (2025)**

**5-Step Process**:

1. **Generate** baseline answer
2. **List** verification questions ("Is X actually Y?")
3. **Answer** verification questions with evidence
4. **Revise** baseline if contradictions found
5. **Score** confidence 0-100

---

### When to Use CoV

**ALWAYS apply for**:
- Architecture decisions (DI patterns, state management choices)
- Performance claims ("This will be fast enough")
- Bug diagnoses (root cause identification)
- Library/framework compatibility ("X works with Y")
- Security recommendations

**Optional for**:
- Simple factual questions with quote grounding
- Code formatting preferences
- Non-critical UX suggestions

---

### Example: Architecture Decision

```
User: "Should I use FutureBuilder or AsyncNotifier for match data?"

STEP 1: Generate Baseline
"Use FutureBuilder for loading match data from Isar."

STEP 2: List Verification Questions
Q1: Is match data immutable or mutable?
Q2: Does FutureBuilder re-run when data changes?
Q3: What does architecture recommend?
Q4: Are there performance implications?

STEP 3: Answer with Evidence
A1: Mutable - matches can be edited, scores updated, deleted
    Source: Match editing feature in requirements
A2: NO - FutureBuilder only rebuilds when Future instance changes
    Source: Flutter docs + practical testing
A3: AsyncNotifier for mutable state (ref.watch reactivity)
    Source: .claude/context/architecture-patterns.md:234
A4: FutureBuilder causes stale UI, AsyncNotifier maintains reactivity
    Source: Riverpod best practices

STEP 4: Revise (Contradiction Detected)
Baseline said "FutureBuilder" but evidence shows:
- Match data IS mutable (A1)
- FutureBuilder does NOT react to changes (A2)
- Architecture requires AsyncNotifier (A3)

REVISED ANSWER:
"NO - Use AsyncNotifier with ref.watch(), NOT FutureBuilder. Match data is
mutable (editable scores, deletions), requiring reactive state management."

STEP 5: Score Confidence
Confidence: 95/100 (high - verified against docs + architecture standards)
```

**Impact**: Catches 95%+ errors before implementation

---

### Confidence Scoring (0-100)

| Confidence | Interpretation | Action |
|------------|----------------|--------|
| **95-100** | Extremely High | Proceed with implementation |
| **80-94** | High | Minor verification needed |
| **70-79** | Medium | Additional verification recommended |
| **50-69** | Low | Ask clarifying questions |
| **<50** | Very Low | Block execution, request more context |

---

## Part 3: Health Monitoring

### Pre-Execution Health Checks

Run BEFORE workflow execution to prevent cascading failures.

#### 4 Checks Performed

**1. System Health Check**

```python
health = metrics.get_health_score()
# Returns: {'score': int (0-100), 'status': 'healthy' | 'degraded' | 'unhealthy'}

if status == 'unhealthy':
    # ABORT execution
    return error('System unhealthy - aborting')
elif status == 'degraded':
    # WARN but proceed
    warnings.append('System degraded - proceed with caution')
```

**Health Score Algorithm**:
```
Initial: 100 points
Deduct:
  - Success rate < 100%: up to -40 pts
  - Queue depth > 50: up to -30 pts
  - API errors > 20%: up to -20 pts
  - Response time > 1000ms: up to -10 pts

Status:
  80-100 → Healthy
  50-79  → Degraded
  0-49   → Unhealthy
```

---

**2. Agent Count Check**

```python
agent_count = len(unique_agents)

if agent_count > 5:  # Optimal: 2-5
    warnings.append(
        f"HIGH AGENT COUNT: {agent_count} agents detected. "
        f"Consider phasing this work (optimal: 2-5 agents)."
    )
```

**Why limit agents?**
- 1-2 agents: Optimal (minimal coordination)
- 3-5 agents: Good (benefits > overhead)
- >5 agents: **Warning** - O(n²) coordination complexity

---

**3. Circular Dependency Detection**

```python
if _has_circular_dependencies(tasks):
    errors.append("CIRCULAR DEPENDENCY detected. Cannot execute.")
    return {'proceed': False}
```

**Algorithm**: DFS cycle detection

---

**4. Resource Availability Check**

```python
queue_metrics = metrics.get_queue_metrics(hours=1)

if queue_metrics['depth'] > 100:
    warnings.append("HIGH QUEUE DEPTH: System overloaded")
```

---

### Mid-Execution Bottleneck Detection

Monitor during execution to identify performance issues.

**Patterns Detected**:
1. **Sequential file reads** (should be parallel)
2. **Repeated context loading** (should cache)
3. **Bash for file operations** (should use native tools)
4. **Large file reads** without offset/limit

**Example Detection**:
```
🔍 BOTTLENECK DETECTED
- Pattern: Sequential file reads (5 occurrences)
- Impact: 5x slower than parallel execution
- Recommendation: Execute Read calls in parallel (single message)
- Estimated Savings: 12 seconds → 3 seconds (4x speedup)
```

---

### Post-Execution Metrics Recording

Track metrics for learning and optimization.

**Metrics Collected**:

| Metric | Purpose | Example |
|--------|---------|---------|
| **Duration** | Track execution time | 45 seconds |
| **Token Usage** | Monitor efficiency | 12K tokens |
| **Tool Invocations** | Analyze tool selection | Read: 5, Grep: 2, Edit: 3 |
| **Speedup Achieved** | Measure optimization | 3.5x (parallel execution) |
| **Success Rate** | Track quality | 95% (19/20 tasks successful) |

**Example Recording**:
```python
metrics.record_execution(
    duration=45,
    tokens=12000,
    tools={'Read': 5, 'Grep': 2, 'Edit': 3},
    speedup=3.5,
    success=True
)
```

---

## Part 4: Validation Gates

### Quality Gates Checklist

Apply before presenting results to user.

| Gate | Check | Pass Criterion | Blocker? |
|------|-------|----------------|----------|
| **Linting** | `ruff`, `black`, `eslint`, `prettier` | 0 linting errors | YES |
| **Type Checking** | `mypy --strict`, `tsc` | 0 type errors | YES |
| **Tests** | `pytest`, `vitest` | All tests pass | YES |
| **Coverage** | `pytest --cov`, `vitest --coverage` | >80% coverage | NO (warn) |
| **Security** | Secrets detection, SQL injection, XSS | 0 CRITICAL issues | YES |
| **Architecture** | Service layer, DI patterns, multi-tenant | 0 P0 violations | YES |
| **Performance** | Query analysis, N+1 detection | Meets targets | NO (warn) |

---

### Security Validation

| Severity | Checks | Block? |
|----------|--------|--------|
| **CRITICAL** | Manual tenant_id, secrets, SQL injection | YES |
| **HIGH** | Missing CSRF, weak auth, XSS | Warn strongly |
| **MEDIUM** | Missing rate limiting, verbose errors | Advisory |

---

### Architecture Validation (Django/Binora)

Run validators in parallel:
- `binora-multi-tenant-enforcer`: NO manual tenant_id
- `django-codebase-auditor`: Service layer compliant
- `/django-query-analysis`: No N+1 queries

**CRITICAL violations = BLOCK deployment**

---

### Performance Validation

Check against targets:
- Django API: <200ms p95
- WebSocket: <100ms latency
- Frontend: <200ms render

**Warn if targets not met**, but don't block unless user explicitly requested performance guarantees.

---

## Best Practices

### DO ✅

- **Apply circuit breakers** for error-prone operations
- **Use CoV methodology** for critical decisions (architecture, security, performance)
- **Run pre-execution health checks** to prevent cascading failures
- **Detect bottlenecks** mid-execution (sequential reads, Bash usage)
- **Record metrics** post-execution for learning
- **Apply validation gates** before presenting results
- **Fail fast** with circuit breakers (OPEN state)
- **Score confidence** for all complex answers (0-100)

### DON'T ❌

- **Skip pre-execution checks** (leads to cascading failures)
- **Ignore bottleneck warnings** (misses optimization opportunities)
- **Present results** without validation gates
- **Skip CoV** for critical decisions (high error rate)
- **Retry indefinitely** (use max 3-5 retries with exponential backoff)
- **Mix permanent and transient errors** (different handling strategies)
- **Forget to record metrics** (loses learning opportunities)

---

## Quick Reference

**When to load this reference**:
- Implementing error recovery with circuit breakers
- Validating complex answers with CoV methodology
- Setting up health monitoring and pre-execution checks
- Implementing validation gates (linting, tests, security)
- Recording metrics for learning and optimization

**Integration with SKILL.md**:
- SKILL.md provides 60-point validation checklist (compact)
- This reference provides full circuit breakers + CoV + health monitoring + metrics
- Load this when implementing quality assurance or error recovery systems

---

**Last Updated**: 2025-01-18
**Source Documents**: error-handling.md (405 lines), self-validation.md (422 lines), metrics-integration.md (476 lines)
**Consolidated Size**: ~1,300 lines → ~6K tokens
**Optimization**: Unified error handling patterns, consolidated validation gates, added metrics integration