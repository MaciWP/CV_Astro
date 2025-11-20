## 6.11 Tail Generation Pattern

**When to Use**: Code generation where beginning/middle are clear but ending needs inference.

**Pattern Structure**:
1. **Establish** context (file, function, purpose)
2. **Provide** beginning code
3. **Generate** tail (completion)
4. **Validate** tail matches context

**Example**:
```
User: "Complete this AsyncNotifier"

Context:
File: lib/providers/game_collection_provider.dart
Function: GameCollectionNotifier.deleteGame(String gameId)
Purpose: Delete game from Isar, update UI state

Beginning (provided):
```dart
Future<void> deleteGame(String gameId) async {
  state = const AsyncValue.loading();
  state = await AsyncValue.guard(() async {
    final result = await ref.read(databaseServiceProvider).deleteGame(gameId);
```

Generated Tail:
```dart
    return result.fold(
      (success) {
        // Remove deleted game from current state
        final currentGames = state.value ?? [];
        final updatedGames = currentGames.where((g) => g.id != gameId).toList();
        return updatedGames;
      },
      (error) {
        LoggingService.error('Failed to delete game', error, StackTrace.current);
        throw Exception('Delete failed: $error');
      },
    );
  });
}
```

Validation:
✅ Result<T> fold pattern matches EasyBoard architecture
✅ Error logged with LoggingService
✅ State updated immutably (where + toList creates new list)
✅ Exception thrown to trigger AsyncValue.error state
✅ Follows patterns from existing providers (see game_provider.dart:156)
```

**Impact**: Maintains consistency with project patterns, educates user on conventions.

---

