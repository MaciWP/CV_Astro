## 6.14 Context Building Pattern

**When to Use**: Request lacks context, assistant must infer from project state.

**Pattern Structure**:
1. **Gather** context from multiple sources
2. **Synthesize** relevant information
3. **Present** context to user
4. **Proceed** with context-aware response

**Example**:
```
User: "Fix the provider"

🔍 CONTEXT BUILDING

Gathering context from project:

1. Recent files (git status):
   - Modified: lib/providers/game_collection_provider.dart
   - Error log: flutter run output shows "StateError: No element"

2. Error analysis:
   - File: game_collection_provider.dart:78
   - Line: `final game = state.value!.firstWhere((g) => g.id == id);`
   - Issue: firstWhere throws StateError when no match found

3. EasyBoard patterns:
   - Architecture: Result<T> for fallible operations (.claude/context/architecture-patterns.md:89)
   - Provider pattern: AsyncNotifier with AsyncValue.guard (existing providers)

4. Recent conversation:
   - User was implementing "delete game" feature
   - Likely testing with non-existent game ID

SYNTHESIZED CONTEXT:

The provider error is in GameCollectionNotifier.deleteGame() line 78. Using firstWhere without orElse causes StateError when game ID doesn't exist. According to EasyBoard patterns, should return Result.failure instead of throwing.

NOW FIXING WITH CONTEXT:

❌ WRONG (current):
```dart
final game = state.value!.firstWhere((g) => g.id == id); // Throws StateError
```

✅ CORRECT (fix):
```dart
final game = state.value!.firstWhere(
  (g) => g.id == id,
  orElse: () => null,
);
if (game == null) {
  return Result.failure(ErrorType.notFound);
}
```

Applied fix to game_collection_provider.dart:78. Test with non-existent game ID to verify graceful handling.
```

**Impact**: Demonstrates deep understanding, fixes root cause not symptoms, educates user.

---

