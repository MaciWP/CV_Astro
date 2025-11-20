# Error Recovery with Circuit Breaker Example

This example demonstrates how to use circuit breaker patterns to gracefully handle errors and prevent cascading failures in Claude Code workflows.

---

## Scenario: Optimizing Slow ONNX Inference

**Goal**: User requests optimization for slow ML inference, but critical information is missing.

---

## ❌ ANTI-PATTERN: Proceed Without Validation (Wasted Effort)

```
User: "My ONNX inference is slow, fix it"

Claude (Message 1): Let me read your YOLO service...
[Invokes Read(yolo_service.dart)]

Claude (Message 2): I see you're using OrtSession. Let me check ONNX Runtime docs...
[Invokes WebSearch("ONNX Runtime optimization")]

Claude (Message 3): Based on general best practices, try these optimizations:
1. Use session caching
2. Optimize tensor format
3. Enable INT8 quantization

Result after 20 minutes:
- User tries all suggestions
- Performance unchanged (still slow)
- Root cause never identified (actual issue: missing @Index on query)
- Blocker: Optimization applied to wrong layer (DB, not ML)

CIRCUIT BREAKER STATE: Should have been OPEN (missing baseline metrics)
WASTED EFFORT: 20 minutes of generic advice
ACTUAL ISSUE: Never diagnosed due to missing profiling data
```

---

## ✅ CORRECT: Circuit Breaker OPEN → Request Critical Info

```
User: "My ONNX inference is slow, fix it"

Claude:
📊 REQUEST ANALYSIS
- Prompt Quality: 35/100 (critical: no metrics, no baseline, no context)
- Circuit Breaker: OPEN (blocker detected)

🚨 QUALITY ASSURANCE - CIRCUIT BREAKER: OPEN
- Blocker: Cannot optimize without baseline performance data
- Missing Critical Information:
  1. Current inference time? (e.g., "320ms per frame")
  2. Expected inference time? (e.g., "<150ms target")
  3. Device specs? (e.g., "Pixel 7, Android 13")
  4. ONNX model? (e.g., "yolo11n.onnx, FP16, 640x640")
  5. Any profiling done? (LoggingService.performance output?)

Fallback Options:
1. [RECOMMENDED] Enable profiling and provide metrics:
   ```dart
   final start = DateTime.now();
   final result = await _session.run(inputs);
   final duration = DateTime.now().difference(start);
   LoggingService.performance('ONNX_inference', duration.inMilliseconds);
   ```
   Then share log output for targeted optimization.

2. [GENERIC] Apply standard optimization checklist:
   - ✅ Session caching (OrtSession reused, not recreated?)
   - ✅ Tensor format ([1,3,640,640] NCHW?)
   - ✅ Normalization ([0,1] range?)
   - ✅ NMS optimization (confidence threshold tuning?)

3. [ALTERNATIVE] Share yolo_service.dart code for review

Which approach do you prefer? (1-3)

---

User: "Here's the log: ONNX inference: 45ms, DB query: 280ms"

Claude:
⚠️ QUALITY ASSURANCE - CIRCUIT BREAKER: HALF-OPEN
- Status: Partial information received
- Analysis: ONNX inference is FAST (45ms, well under 150ms target)
- Root cause identified: DB query is the bottleneck (280ms, exceeds 50ms target)
- Diagnosis: Optimization needed in DATABASE layer, not ML layer

Proceeding with database optimization...
🎯 SKILL COORDINATION
- Skills to Activate: Skill(isar-database-patterns), Skill(database-query-reviewer)
- Circuit Breaker: CLOSED (blocker resolved, proceeding with correct optimization)

Result after 10 minutes:
✅ Added @Index() to GameMatch.createdAt
✅ Query time: 280ms → 12ms (23x faster)
✅ Total latency: 325ms → 57ms (5.7x faster)
✅ Root cause correctly identified and fixed

CIRCUIT BREAKER STATE: CLOSED (after requesting critical info)
TIME SAVED: 20min (avoided wrong optimization path)
ACTUAL ISSUE: Database query, fixed with @Index()
```

---

## Circuit Breaker State Transitions

### Transition 1: CLOSED → OPEN (Blocker Detected)

**Trigger**: Missing critical information (no metrics, no baseline, no context)

```
Initial Request Quality: 35/100
- Missing: Baseline metrics
- Missing: Performance expectations
- Missing: Device context

Decision: Circuit Breaker → OPEN
Action: Request critical information, provide fallbacks
```

### Transition 2: OPEN → HALF-OPEN (Partial Info Received)

**Trigger**: User provides some information (log output)

```
Received: Log output with timing breakdown
- ONNX: 45ms (FAST ✅)
- DB Query: 280ms (SLOW ❌)

Decision: Circuit Breaker → HALF-OPEN
Action: Analyze received data, identify root cause
```

### Transition 3: HALF-OPEN → CLOSED (Blocker Resolved)

**Trigger**: Root cause identified, correct optimization path determined

```
Analysis Complete:
- Root cause: Database query performance
- Correct skills: isar-database-patterns + database-query-reviewer
- Expected fix: Add @Index() annotation

Decision: Circuit Breaker → CLOSED
Action: Proceed with database optimization (correct layer)
```

---

## Real-World Performance Comparison

| Approach | Circuit Breaker | Time to Fix | Correct Solution? | User Satisfaction |
|----------|-----------------|-------------|-------------------|-------------------|
| ❌ Proceed blindly | N/A (ignored) | 20+ min | No (wrong layer) | Low (frustrated) |
| ⚠️ Generic advice | N/A (ignored) | 15+ min | Sometimes (lucky) | Medium (hit-or-miss) |
| ✅ Circuit breaker OPEN | OPEN → Request info | 10 min | Yes (targeted) | High (confident) |

---

## When to Use Each Circuit Breaker State

### ✅ CLOSED (Normal Operation)

Use when:
- All validation gates pass
- Sufficient information provided
- No blockers detected
- Confidence >70%

**Output**:
```
✅ QUALITY ASSURANCE
- Circuit Breaker: CLOSED (normal operation)
- All validation gates: ✅ DI, ✅ Performance, ✅ Tests
- Proceed with task execution
```

### ⚠️ HALF-OPEN (Request Clarification)

Use when:
- Missing non-critical information
- Partial context provided
- Ambiguous requirements
- Confidence 40-70%

**Output**:
```
⚠️ QUALITY ASSURANCE
- Circuit Breaker: HALF-OPEN (missing information, requesting clarification)
- Status: Prompt quality 55/100 (missing: device specs, expected performance)
- Action: Request clarification with 2-3 specific questions
- Recovery: Proceed when user provides answers OR offer generic guidance
```

### 🚨 OPEN (Blocked)

Use when:
- Missing critical information
- Unrecoverable error
- Validation gate failure
- Confidence <40%

**Output**:
```
🚨 QUALITY ASSURANCE
- Circuit Breaker: OPEN (critical blocker detected)
- Blocker: Cannot optimize without baseline metrics
- Required: Profiling data OR code sample OR specific symptom
- Fallback: Provide 3 options (profiling, checklist, code review)
- Recovery: Requires user input (cannot proceed automatically)
```

---

## Decision Algorithm

```python
def determine_circuit_breaker_state(request):
    # Phase 1: Score prompt quality
    score = score_prompt_quality(request)

    # Check critical information
    has_baseline = check_baseline_metrics(request)
    has_context = check_device_specs(request)
    has_expectations = check_performance_targets(request)

    # Decision logic
    if score >= 70 and has_baseline and has_context:
        return "CLOSED"  # Proceed normally

    elif score >= 40 or (has_context and not has_baseline):
        return "HALF-OPEN"  # Request clarification

    else:
        return "OPEN"  # Critical blocker, surface immediately
```

---

## Checklist: Should Circuit Breaker Be OPEN?

Before proceeding with optimization/debugging, ask:

1. **Baseline Check**:
   - [ ] Do we have current performance metrics? (e.g., "280ms")
   - [ ] Do we have expected performance target? (e.g., "<50ms")
   - [ ] Can we measure improvement? (before/after comparison)

2. **Context Check**:
   - [ ] Do we know the device/environment? (Android, iOS, emulator?)
   - [ ] Do we know the data volume? (10 items, 1000 items?)
   - [ ] Do we know the user flow? (background sync, user-triggered?)

3. **Symptom Check**:
   - [ ] Is symptom specific? ("DB query slow" vs "app slow")
   - [ ] Is symptom reproducible? (always, sometimes, rarely?)
   - [ ] Is symptom quantified? (numbers provided, not just "slow")

**If 2+ answers are NO**: Circuit Breaker → OPEN (request missing information)

---

## Common Mistakes

### Mistake 1: Ignoring Missing Baseline

```
❌ BAD: "Let me optimize your code" (no idea what's currently slow)
Result: Apply 10 optimizations, can't measure which worked

✅ GOOD: "What's the current performance? Let's measure first."
Result: Targeted fix for actual bottleneck
```

### Mistake 2: Proceeding with Vague Symptoms

```
❌ BAD: User says "app is slow" → Apply random optimizations
Result: 20min wasted, no improvement

✅ GOOD: Circuit Breaker OPEN → Request specific symptom
Result: "Startup: 5s, target <2s" → Profile cold start → Fix
```

### Mistake 3: Skipping Fallback Options

```
❌ BAD: "I need profiling data to proceed" (user stuck)
Result: User frustrated, task blocked

✅ GOOD: "Prefer profiling data. Alternatively, I can review code or provide checklist."
Result: User chooses option 2 (code review), task continues
```

---

## Best Practices Summary

1. **Fail fast** when critical information missing (don't waste time)
2. **Surface blockers early** (Phase 1: Request Analysis, not Phase 5)
3. **Provide fallbacks** (never leave user stuck with single option)
4. **Quantify requirements** (specific questions, not generic "provide more info")
5. **Transition transparently** (show circuit breaker state changes to user)

---

**Last Updated**: 2025-10-28
**Performance Impact**: Saves 10-20 minutes by avoiding wrong optimization paths
**Applies To**: Any Claude Code workflow requiring baseline metrics or critical context
