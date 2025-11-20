## 6.4 Chain of Verification Pattern

**When to Use**: High-stakes answers (architecture decisions, bug diagnoses, performance claims).

**Pattern Structure**:
1. **Generate** baseline answer
2. **List** verification questions ("Is X actually Y?")
3. **Answer** verification questions with evidence
4. **Revise** baseline if contradictions found
5. **Score** confidence 0-100

**Example - BEFORE**:
```
User: "Can I use FutureBuilder for match data?"
Assistant: "Yes, FutureBuilder works fine for async data."
```

**Example - AFTER (Chain of Verification)**:
```
User: "Can I use FutureBuilder for match data?"
Assistant:
✅ CHAIN OF VERIFICATION

Baseline Answer:
"Yes, FutureBuilder works for async data display."

Verification Questions:
1. Is match data mutable? (Can it change after initial load?)
2. Does FutureBuilder rebuild when data changes?
3. What does EasyBoard architecture recommend?

Verification Answers:
1. YES - Match data is mutable (scores can be edited, match can be deleted)
2. NO - FutureBuilder only rebuilds when Future instance changes, NOT when data changes
3. EasyBoard requires AsyncNotifier for mutable state (see .claude/context/architecture-patterns.md:234)

Contradiction Detected:
FutureBuilder is WRONG pattern for mutable data.

Revised Answer:
"NO - use AsyncNotifier with ref.watch(), NOT FutureBuilder. Match data is mutable (editable scores), so requires reactive state management. FutureBuilder only works for immutable, one-time-load data."

Confidence: 95/100 (verified against architecture docs)
```

**Impact**: Catches errors before they reach production, prevents bad architecture decisions.

---

