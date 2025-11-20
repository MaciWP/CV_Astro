# Error Surfacing & Circuit Breakers

**Circuit breaker patterns for graceful error handling and cascading prevention.**

---

## Overview

This reference covers:
- Circuit breaker states (CLOSED/OPEN/HALF-OPEN)
- Cascading error prevention
- Exponential backoff strategies
- Error surfacing best practices

**Usage**: Referenced from `SKILL.md` Phase 5 (Quality Assurance) for error handling decisions.

---

## Circuit Breaker States

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

### State Descriptions

#### CLOSED (Normal Operation)

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

#### OPEN (Blocked)

**Status**: Critical blocker detected, requests rejected immediately.

**Behavior**:
- Fail fast (don't attempt operation)
- Surface error to user with clear message
- Provide fallback options
- Start timeout timer (attempt recovery after duration)

**Triggers**:
- Missing critical information (no file path, no error message, no baseline metrics)
- Unrecoverable error (service unavailable, invalid credentials)
- Validation gate failure (DI violation, security risk, performance blocker)

**Example**:
```
🚨 QUALITY ASSURANCE
- Circuit Breaker: OPEN (critical blocker detected)
- Blocker: Missing baseline metrics for optimization
- Reason: Cannot optimize "slow ONNX inference" without profiling data
- Fallback: Request user to enable LoggingService.performance OR provide generic checklist
- Recovery: Requires user input (cannot proceed automatically)
```

#### HALF-OPEN (Tentative Recovery)

**Status**: Testing if blocker resolved, limited requests allowed.

**Behavior**:
- Allow single test request
- If succeeds → transition to CLOSED
- If fails → transition back to OPEN
- Provide progress feedback to user

**Triggers**:
- Timeout expired after OPEN state
- User claims blocker resolved ("I added the file", "Metrics attached")
- Partial information received

**Example**:
```
⚠️ QUALITY ASSURANCE
- Circuit Breaker: HALF-OPEN (missing information, requesting clarification)
- Status: Prompt quality 42/100 (vague symptom, no context)
- Action: Request clarification with specific questions
- Recovery Path:
  1. User provides file path + error message → CLOSED
  2. User declines → Provide generic guidance (limited value)
```

---

## Cascading Error Prevention

### Problem

Single error triggers chain reaction:

```
Error in Service A
  → Dependent Service B fails
    → UI Component C crashes
      → App-wide crash
```

### Prevention Strategy

**Principle**: Isolate failures, prevent propagation.

#### Layer 1: Service Level (Result<T>)

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

**Benefit**: Error returned, not thrown. Caller decides handling strategy.

#### Layer 2: Provider Level (AsyncValue)

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

**Benefit**: AsyncValue.error state, UI shows error widget, no crash.

#### Layer 3: UI Level (Error Widgets)

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

**Benefit**: User sees error + retry option, app remains functional.

### Circuit Breaker Integration

**Service Layer**:
```dart
if (_errorCount > threshold) {
  // Circuit OPEN
  return Result.failure(ErrorType.circuitOpen);
}
```

**Provider Layer**:
```dart
if (circuitOpen) {
  // Provide cached data OR show degraded UI
  return cachedData ?? throw CircuitOpenException();
}
```

**UI Layer**:
```dart
error: (error, stack) {
  if (error is CircuitOpenException) {
    return ServiceUnavailableWidget(); // Special handling
  }
  return GenericErrorWidget();
}
```

---

## Exponential Backoff

### Problem

Retry immediately after failure → overwhelm failing service.

### Strategy

Wait progressively longer between retries:

```
Attempt 1: Immediate
Attempt 2: Wait 1s
Attempt 3: Wait 2s
Attempt 4: Wait 4s
Attempt 5: Wait 8s
...
Max Wait: 60s (cap)
```

### Implementation

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
      return result; // Success, stop retrying
    }

    attempt++;
    LoggingService.warning('Retry $attempt/$maxRetries after ${waitSeconds}s');
  }

  // All retries failed
  return Result.failure(ErrorType.retryExhausted);
}
```

### When to Use

**Apply for**:
- Network requests (API calls, remote config)
- External service dependencies (analytics, crash reporting)
- Transient failures (timeout, temporary unavailability)

**Don't apply for**:
- Logic errors (NullPointerException, IndexOutOfBounds)
- Validation errors (invalid input, schema mismatch)
- Permanent failures (404 Not Found, 403 Forbidden)

---

## Error Surfacing Best Practices

### Principle

**Surface errors early, clearly, with actionable guidance.**

### Pattern 1: Detect Early (Phase 1)

```
User: "fix the bug"

❌ BAD: Proceed blindly
Assistant: [Starts random investigation]

✅ GOOD: Surface missing information immediately
Assistant:
📊 REQUEST ANALYSIS
- Prompt Quality: 15/100 (CRITICAL: no file, no symptom, no error)
- Circuit Breaker: OPEN (blocker: insufficient information)
- Required:
  1. Which file has the bug? (exact path)
  2. What is the symptom? (what goes wrong?)
  3. What is the error message? (stack trace if available)
  4. What is expected behavior?
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

```
🚨 CIRCUIT BREAKER: OPEN
- Blocker: Cannot optimize without profiling data

Fallback Options:
1. [RECOMMENDED] Enable logging and provide metrics:
   ```dart
   LoggingService.performance('inference', duration);
   ```
   Then share output for targeted optimization.

2. [GENERIC] Apply standard optimization checklist:
   - Verify session caching (OrtSession reused?)
   - Check tensor format ([1,3,640,640] NCHW?)
   - Validate normalization ([0,1] range?)
   - Profile each stage (preprocess/inference/NMS)

3. [ALTERNATIVE] Provide code sample for review

Which approach do you prefer? (1-3)
```

---

## Integration with SKILL.md Phase 5

**Output Format**:
```
✅ QUALITY ASSURANCE
- Circuit Breaker: [CLOSED|HALF-OPEN|OPEN] - [Status message]
```

**Decision Logic**:

```
IF all validation gates pass:
  Circuit Breaker: CLOSED

ELSE IF missing non-critical info:
  Circuit Breaker: HALF-OPEN (request clarification)

ELSE IF missing critical info OR unrecoverable error:
  Circuit Breaker: OPEN (surface blocker + fallbacks)
```

---

## Best Practices

### DO ✅

- Fail fast when blocker detected (don't waste time)
- Surface errors early (Phase 1: Request Analysis)
- Provide fallback options (never leave user stuck)
- Use exponential backoff for transient failures
- Contain errors at service layer (Result<T>)

### DON'T ❌

- Proceed with missing critical information
- Throw generic errors ("Something went wrong")
- Retry immediately without backoff
- Let errors cascade across layers
- Hide errors from user (transparency builds trust)

---

**Last Updated**: 2025-10-28
**Integration**: Called from SKILL.md Phase 5 (Quality Assurance)