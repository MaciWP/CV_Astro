# Self-Validation & Quality Assurance

**Chain of Verification methodology + confidence scoring to prevent hallucinations.**

---

## Overview

**"Unreliable self-validation" - Top limitation in SagaLLM multi-agent research (2025)**

This reference covers:
- Chain of Verification (CoV) methodology
- Confidence scoring 0-100
- Validation gates (DI, performance, tests, security, M3)
- Hallucination prevention techniques

**Usage**: Referenced from `SKILL.md` Phase 5 (Quality Assurance) for complex/critical answers.

---

## Chain of Verification (CoV)

### Methodology

**5-Step Process**:

1. **Generate** baseline answer
2. **List** verification questions ("Is X actually Y?")
3. **Answer** verification questions with evidence
4. **Revise** baseline if contradictions found
5. **Score** confidence 0-100

### When to Use

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

### Example - Architecture Decision

```
User: "Should I use FutureBuilder or AsyncNotifier for match data?"

STEP 1: Generate Baseline
"Use FutureBuilder for loading match data from Isar."

STEP 2: List Verification Questions
Q1: Is match data immutable or mutable?
Q2: Does FutureBuilder re-run when data changes?
Q3: What does EasyBoard architecture recommend?
Q4: Are there performance implications?

STEP 3: Answer with Evidence
A1: Mutable - matches can be edited, scores updated, matches deleted
    Source: Match editing feature in requirements
A2: NO - FutureBuilder only rebuilds when Future instance changes, not data
    Source: Flutter docs + practical testing
A3: AsyncNotifier for mutable state (ref.watch reactivity)
    Source: .claude/context/architecture-patterns.md:234
A4: FutureBuilder causes stale UI, AsyncNotifier maintains reactivity
    Source: Riverpod best practices

STEP 4: Revise (Contradiction Detected)
Baseline said "FutureBuilder" but evidence shows:
- Match data IS mutable (A1)
- FutureBuilder does NOT react to changes (A2)
- EasyBoard requires AsyncNotifier (A3)

REVISED ANSWER:
"NO - Use AsyncNotifier with ref.watch(), NOT FutureBuilder. Match data is
mutable (editable scores, deletions), requiring reactive state management.
FutureBuilder only works for immutable, one-time-load data."

STEP 5: Score Confidence
Confidence: 95/100
- Verified against project architecture docs
- Consistent across multiple sources
- Aligns with Riverpod best practices
- Tested pattern in existing providers
```

### Contradiction Resolution

**When verification contradicts baseline**:

1. **Acknowledge** error: "Initial answer was incorrect..."
2. **Explain** why: "Based on verification, X is actually Y because..."
3. **Provide** corrected answer
4. **Reference** evidence: "Source: [file:line]"
5. **Learn**: Store pattern in memory (REFLECT operation)

**Example**:
```
❌ Initial: "FP16 ONNX models work with Float32List"
✅ Corrected after verification: "NO - FP16 incompatible, requires conversion"
Evidence: AI_BUGS_KNOWLEDGE.md BUG-2025102602
Learned: Always check tensor dtype compatibility
```

---

## Confidence Scoring (0-100)

### Scoring Rubric

| Score | Confidence Level | Criteria | Action |
|-------|-----------------|----------|--------|
| 90-100 | **High** | Verified against authoritative source (code, docs, knowledge base) | Proceed with answer |
| 70-89 | **Medium** | Logical reasoning + partial verification | Proceed with caveats ("likely", "typically") |
| 50-69 | **Low** | Educated guess, no verification | Provide answer + "Need verification" disclaimer |
| <50 | **Very Low** | Speculative, conflicting info | Request clarification OR provide alternatives |

### Scoring Factors

**Increase Confidence (+10-30)**:
- ✅ Quote from project files (file:line reference)
- ✅ Verified against AI_BUGS_KNOWLEDGE.md, AI_PRODUCT_DECISIONS.md
- ✅ Tested pattern (code exists in project)
- ✅ Official documentation (Context7 MCP)
- ✅ Multiple consistent sources

**Decrease Confidence (-10-30)**:
- ❌ Assumption without verification
- ❌ Conflicting information from sources
- ❌ Relying on memory without checking
- ❌ Complex reasoning without evidence
- ❌ Outdated information (Flutter 2.x patterns for 3.24+ project)

### Example - Confidence Progression

```
User: "What's the maximum Isar collection size?"

BASELINE (No verification):
"Isar can handle millions of records."
Confidence: 40/100 (speculative, no evidence)

AFTER Context7 MCP Check:
"Isar documentation states no hard limit, constrained by device storage."
Confidence: 75/100 (official docs, but no project-specific data)

AFTER Project Context Check:
"EasyBoard freemium limit: 20 matches/month. At this rate, max ~2400 matches
over 10 years. Well within Isar's millions-of-records capability. Performance
target <50ms queries maintained up to ~10K records in testing."
Confidence: 95/100 (verified against project constraints + testing data)
```

---

## Validation Gates

### 5 Critical Gates

**ALWAYS check in Phase 5 (Quality Assurance):**

#### Gate 1: Constructor Dependency Injection

**Check**:
- [ ] All services implement abstract interfaces?
- [ ] All screens accept services via constructor?
- [ ] Zero `new Service()` direct instantiation?
- [ ] Services registered in providers?

**Violation Example**:
```dart
// ❌ VIOLATION
class GameScreen extends StatelessWidget {
  final _service = DatabaseService(); // Direct instantiation
}
```

**Corrected**:
```dart
// ✅ PASS
class GameScreen extends StatelessWidget {
  final DatabaseServiceInterface _service;
  const GameScreen({required DatabaseServiceInterface service}) : _service = service;
}
```

**Source**: `.claude/context/critical-context.md` - 100% Constructor DI

#### Gate 2: Performance Targets

**Check**:
- [ ] ML inference <150ms? (YOLO11 ONNX Runtime)
- [ ] Database queries <50ms complex, <10ms simple?
- [ ] UI maintains 60 FPS? (<16ms/frame)

**Violation Example**:
```dart
// ❌ VIOLATION - No @Index() on filtered field
@collection
class GameMatch {
  late DateTime createdAt; // Unindexed, query >250ms for 1000 records
}

final matches = await isar.gameMatches
  .filter()
  .createdAtBetween(start, end) // O(n) scan without index
  .findAll();
```

**Corrected**:
```dart
// ✅ PASS - @Index() added
@collection
class GameMatch {
  @Index() // Query <15ms for 1000 records
  late DateTime createdAt;
}
```

**Source**: `.claude/context/critical-context.md` - Performance Targets

#### Gate 3: Test Coverage

**Check**:
- [ ] Overall coverage >80%?
- [ ] AAA pattern (Arrange, Act, Assert) used?
- [ ] MockServices for testing screens?
- [ ] Edge cases covered?

**Violation Example**:
```dart
// ❌ VIOLATION - No tests
// lib/services/scoring_service.dart implemented
// test/services/scoring_service_test.dart MISSING
```

**Corrected**:
```dart
// ✅ PASS - Tests exist
// test/services/scoring_service_test.dart
void main() {
  group('ScoringService', () {
    test('calculateScore returns correct total', () {
      // Arrange
      final service = ScoringService();
      final scores = [10, 20, 30];

      // Act
      final result = service.calculateScore(scores);

      // Assert
      expect(result, 60);
    });
  });
}
```

**Source**: `.claude/context/critical-context.md` - >80% Test Coverage

#### Gate 4: Security

**Check**:
- [ ] No hardcoded secrets? (API keys, tokens)
- [ ] Input validation on user data?
- [ ] Secure storage for sensitive data?
- [ ] No SQL injection patterns? (N/A for Isar, but check string concatenation)

**Violation Example**:
```dart
// ❌ VIOLATION - Hardcoded API key
class AnalyticsService {
  final apiKey = 'sk_live_abc123xyz'; // Exposed in code
}
```

**Corrected**:
```dart
// ✅ PASS - Injected from environment
class AnalyticsService {
  final String _apiKey;
  AnalyticsService({required String apiKey}) : _apiKey = apiKey;
}
// Provider loads from .env (not committed to git)
```

**Source**: `Skill(security-auditor)` patterns

#### Gate 5: Material Design 3

**Check**:
- [ ] Theme.of(context).colorScheme.* used? (No hardcoded colors)
- [ ] No custom color definitions? (Use M3 system colors)
- [ ] Semantic color names? (primary/error, not blue/red)

**Violation Example**:
```dart
// ❌ VIOLATION - Hardcoded color
Container(
  color: Colors.blue, // Breaks dark mode, not semantic
)
```

**Corrected**:
```dart
// ✅ PASS - Theme system color
Container(
  color: Theme.of(context).colorScheme.primary, // Works in dark mode, semantic
)
```

**Source**: `.claude/context/critical-context.md` - Material Design 3 Only

---

## Hallucination Prevention

### Common Hallucination Patterns

**Pattern 1: Invented API Methods**

❌ **Hallucination**:
```dart
isar.gameMatches.whereBetween('createdAt', start, end) // whereBetween doesn't exist
```

**Prevention**: Quote Grounding Pattern (6.3) + Context7 MCP for Isar docs

✅ **Correct (Verified)**:
```dart
isar.gameMatches
  .filter()
  .createdAtBetween(start, end) // Real Isar API
  .findAll()
```

**Pattern 2: Outdated Patterns**

❌ **Hallucination** (Flutter 2.x pattern):
```dart
@override
Widget build(BuildContext context) {
  return Consumer(builder: (context, ref, child) { // Old pattern
```

**Prevention**: Check project Flutter version (3.24+) + Context7 MCP for current docs

✅ **Correct (Flutter 3.24+)**:
```dart
@override
Widget build(BuildContext context, WidgetRef ref) { // Modern pattern
```

**Pattern 3: Assumed Compatibility**

❌ **Hallucination**:
"FP16 ONNX models work with Flutter's Float32List." (Assumed, not verified)

**Prevention**: Chain of Verification (check AI_BUGS_KNOWLEDGE.md)

✅ **Correct (Verified)**:
"NO - FP16 incompatible with Float32List. Requires conversion via convert_fp16_to_fp32_io.py (BUG-2025102602)."

### Prevention Checklist

Before providing answer:
- [ ] Verified against project files? (Quote Grounding)
- [ ] Checked knowledge bases? (AI_BUGS_KNOWLEDGE.md, AI_PRODUCT_DECISIONS.md)
- [ ] Used Context7 MCP for library docs? (Official sources)
- [ ] Applied Chain of Verification? (For critical answers)
- [ ] Confidence scored? (0-100 scale)

---

## Integration with SKILL.md Phase 5

**Output Format**:
```
✅ QUALITY ASSURANCE

Validation Gates:
- ✅ Constructor DI: All services injectable
- ✅ Performance: <150ms ML, <50ms DB, 60 FPS UI
- ⚠️ Tests: 68% coverage (target >80%, pending X, Y, Z tests)
- ✅ Security: No hardcoded secrets, input validation present
- ✅ Material Design 3: Theme.of(context) used, no custom colors

Self-Validation (Chain of Verification):
- Baseline: "Use AsyncNotifier for match data"
- Verified: .claude/context/architecture-patterns.md:234 confirms pattern
- Contradictions: None
- Confidence: 95/100 (verified against project docs)

Circuit Breaker: CLOSED (all critical gates pass, warnings acceptable)
```

---

## Best Practices

### DO ✅

- Apply Chain of Verification for high-stakes answers
- Check AI_BUGS_KNOWLEDGE.md before diagnosing bugs
- Score confidence 0-100 for all answers
- Surface low-confidence (<70) with disclaimers
- Run all 5 validation gates in Phase 5

### DON'T ❌

- Provide answers without verification (hallucination risk)
- Ignore contradictions in verification step
- Skip confidence scoring (unclear reliability)
- Assume compatibility (check documentation)
- Trust memory over project files (verify)

---

**Last Updated**: 2025-10-28
**Research**: "Unreliable self-validation" - SagaLLM Top Limitation (2025)
**Integration**: Called from SKILL.md Phase 5 (Quality Assurance)