# Error Recovery Template

**Copy-paste template for handling errors gracefully with circuit breaker patterns.**

---

## Circuit Breaker State Machine

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

## Template 1: Circuit Breaker OPEN (Blocker Detected)

**Use When**: Missing critical information, unrecoverable error, validation gate failure

```
🚨 QUALITY ASSURANCE - CIRCUIT BREAKER: OPEN
- Blocker: {{BLOCKER_DESCRIPTION}}
- Missing Critical Information:
  1. {{MISSING_INFO_1}}
  2. {{MISSING_INFO_2}}
  3. {{MISSING_INFO_3}}

Fallback Options:
1. [RECOMMENDED] {{PRIMARY_FALLBACK}}
   {{PRIMARY_DETAILS}}

2. [GENERIC] {{GENERIC_FALLBACK}}
   {{GENERIC_DETAILS}}

3. [ALTERNATIVE] {{ALTERNATIVE_FALLBACK}}
   {{ALTERNATIVE_DETAILS}}

Which approach do you prefer? (1-3)
```

### Example: Missing Baseline Metrics
```
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
```

---

## Template 2: Circuit Breaker HALF-OPEN (Request Clarification)

**Use When**: Partial information provided, ambiguous requirements, missing non-critical context

```
⚠️ QUALITY ASSURANCE - CIRCUIT BREAKER: HALF-OPEN
- Status: {{STATUS_DESCRIPTION}}
- Missing Information:
  1. {{QUESTION_1}}
  2. {{QUESTION_2}}

Recovery Path:
- If you provide: {{REQUIRED_INFO}} → Proceed with {{SOLUTION}}
- If not available: {{ALTERNATIVE_APPROACH}}
```

### Example: Vague Symptom
```
⚠️ QUALITY ASSURANCE - CIRCUIT BREAKER: HALF-OPEN
- Status: Prompt quality 42/100 (vague symptom, missing context)
- Missing Information:
  1. Which file has the issue? (exact path)
  2. What is the error message? (stack trace if available)

Recovery Path:
- If you provide: File path + error message → Diagnose and fix issue
- If not available: Provide generic troubleshooting checklist
```

---

## Template 3: Circuit Breaker CLOSED (Normal Operation)

**Use When**: All validation gates pass, sufficient information, no blockers

```
✅ QUALITY ASSURANCE - CIRCUIT BREAKER: CLOSED
- Status: Normal operation
- All validation gates: {{GATE_STATUS}}
- Proceed with task execution
```

### Example:
```
✅ QUALITY ASSURANCE - CIRCUIT BREAKER: CLOSED
- Status: Normal operation
- All validation gates: ✅ DI, ✅ Performance, ✅ Tests, ✅ Security, ✅ M3
- Proceed with implementation
```

---

## Template 4: Exponential Backoff (Retry Pattern)

**Use When**: Transient failures (network, timeout), retryable operations

```dart
Future<Result<T, E>> fetchWithBackoff({int maxRetries = 5}) async {
  int attempt = 0;
  int waitSeconds = 0;

  while (attempt < maxRetries) {
    if (attempt > 0) {
      await Future.delayed(Duration(seconds: waitSeconds));
      waitSeconds = (waitSeconds == 0) ? 1 : waitSeconds * 2; // Exponential
      waitSeconds = min(waitSeconds, 60); // Cap at 60s
    }

    final result = await _fetch();
    if (result.isSuccess) {
      return result; // ✅ Success, stop retrying
    }

    attempt++;
    LoggingService.warning('Retry $attempt/$maxRetries after ${waitSeconds}s');
  }

  // ❌ All retries failed
  return Result.failure(ErrorType.retryExhausted);
}
```

### Backoff Schedule:
```
Attempt 1: Immediate
Attempt 2: Wait 1s
Attempt 3: Wait 2s
Attempt 4: Wait 4s
Attempt 5: Wait 8s
...
Max Wait: 60s (cap)
```

---

## Template 5: Cascading Error Prevention

**Use When**: Service-level error handling (Result<T> pattern)

### Layer 1: Service Level (Result<T>)

```dart
Future<Result<Data, ErrorType>> fetchData() async {
  try {
    final data = await _fetch();
    return Result.success(data);
  } catch (e, stack) {
    LoggingService.error('fetchData failed', e, stack);
    return Result.failure(ErrorType.network); // ✅ Error contained
  }
}
```

### Layer 2: Provider Level (AsyncValue)

```dart
@riverpod
class DataNotifier extends _$DataNotifier {
  @override
  FutureOr<Data> build() async {
    final result = await ref.read(serviceProvider).fetchData();
    return result.fold(
      (data) => data,
      (error) => throw Exception(error), // ✅ AsyncValue catches, sets .error state
    );
  }
}
```

### Layer 3: UI Level (Error Widgets)

```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  final dataAsync = ref.watch(dataNotifierProvider);

  return dataAsync.when(
    data: (data) => DataWidget(data),
    loading: () => LoadingWidget(),
    error: (error, stack) => ErrorWidget( // ✅ Graceful error display
      message: 'Failed to load data',
      retry: () => ref.invalidate(dataNotifierProvider),
    ),
  );
}
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
        return "CLOSED"  # ✅ Proceed normally

    elif score >= 40 or (has_context and not has_baseline):
        return "HALF-OPEN"  # ⚠️ Request clarification

    else:
        return "OPEN"  # 🚨 Critical blocker, surface immediately
```

---

## Checklist: Which Circuit Breaker State?

Before proceeding, assess:

### CLOSED (Normal Operation)
- [ ] Prompt quality >70/100?
- [ ] All critical info provided?
- [ ] No blockers detected?
- [ ] Confidence >70%?

**If all YES**: Circuit Breaker → CLOSED

### HALF-OPEN (Request Clarification)
- [ ] Prompt quality 40-70/100?
- [ ] Partial context provided?
- [ ] Ambiguous requirements?
- [ ] Confidence 40-70%?

**If 2+ YES**: Circuit Breaker → HALF-OPEN

### OPEN (Blocker Detected)
- [ ] Prompt quality <40/100?
- [ ] Missing critical information?
- [ ] Unrecoverable error?
- [ ] Confidence <40%?

**If 2+ YES**: Circuit Breaker → OPEN

---

## Error Surfacing Best Practices

### Pattern 1: Detect Early (Phase 1)

```
❌ BAD: Proceed blindly
User: "fix the bug"
Assistant: [Starts random investigation]

✅ GOOD: Surface missing information immediately
User: "fix the bug"
Assistant:
📊 REQUEST ANALYSIS
- Prompt Quality: 15/100 (CRITICAL: no file, no symptom, no error)
- Circuit Breaker: OPEN (blocker: insufficient information)
- Required:
  1. Which file? (exact path)
  2. What symptom? (what goes wrong?)
  3. What error? (stack trace)
  4. Expected behavior?
```

### Pattern 2: Explain Clearly (No Jargon)

```
❌ BAD: Technical jargon
"StateError thrown in firstWhere predicate evaluation context"

✅ GOOD: Plain English + code
"Error: Can't find game with that ID. The code throws 'StateError' because
firstWhere() has no fallback when no match is found.

Fix: Add `orElse: () => null` to handle missing games gracefully."
```

### Pattern 3: Provide Actionable Steps

```
❌ BAD: Vague guidance
"You need to add error handling"

✅ GOOD: Specific code + explanation
"Add error handling to GameCollectionNotifier.deleteGame():

```dart
final game = state.value!.firstWhere(
  (g) => g.id == id,
  orElse: () => null, // ← Add this line
);
if (game == null) {
  return Result.failure(ErrorType.notFound); // ← Add this check
}
```

This prevents StateError when game ID doesn't exist."
```

### Pattern 4: Offer Fallbacks

Always provide 2-3 fallback options when Circuit Breaker OPEN.

---

## Common Mistakes to Avoid

### Mistake 1: Proceeding Without Validation

```
❌ BAD: No circuit breaker check
User: "Optimize slow query"
Assistant: [Applies generic optimizations without baseline]

✅ GOOD: Circuit breaker OPEN
User: "Optimize slow query"
Assistant: Circuit Breaker OPEN → Request current performance metrics
```

### Mistake 2: Skipping Fallback Options

```
❌ BAD: "I need profiling data to proceed" (user stuck)

✅ GOOD: "Prefer profiling data. Alternatively:
1. Generic checklist
2. Code review
3. Documentation link"
```

### Mistake 3: Vague Error Messages

```
❌ BAD: "Something went wrong"

✅ GOOD: "StateError: Game ID 123 not found. Add orElse: () => null to firstWhere()"
```

---

**Last Updated**: 2025-10-28
**Use Case**: Graceful error handling with circuit breaker patterns
**Impact**: Saves 10-20 minutes by avoiding wrong optimization paths
**See Also**: `resources/workflow-optimization/examples/error_recovery_circuit_breaker_example.md`
