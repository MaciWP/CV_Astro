## 6.15 Flipped Interaction Pattern

**When to Use**: User needs education/guidance, not just direct answer.

**Pattern Structure**:
1. **Provide** direct answer briefly
2. **Teach** underlying concept
3. **Show** how to apply concept to other situations
4. **Invite** questions for clarification

**Example**:
```
User: "Why do I need @Index() on this field?"

💡 FLIPPED INTERACTION

Direct Answer:
Add `@Index()` to `GameMatch.createdAt` because you're filtering by date in match history queries. Without index, Isar scans all records (O(n)), with index it's O(log n).

Teaching the Concept (Why Indexes Matter):

Indexes are like book indexes - they let you jump directly to relevant pages instead of reading the entire book.

Without @Index() on GameMatch.createdAt:
1. Query: "Find matches from last 30 days"
2. Isar reads ALL matches: 1, 2, 3, ..., 1000
3. Checks each: "Is createdAt within range?" 1000 checks
4. Time: O(n) - proportional to total matches
5. Performance: 250ms for 1000 matches (FAILS <50ms target)

With @Index() on GameMatch.createdAt:
1. Query: "Find matches from last 30 days"
2. Isar uses index: Binary search finds start date
3. Reads only matches in range: Maybe 20 matches
4. Time: O(log n) for search + O(m) for reading m results
5. Performance: 12ms for 1000 total matches (PASSES <50ms target)

Applying to Other Situations:

Add @Index() when:
- ✅ Field used in .where() queries (filtering)
- ✅ Field used for sorting (.sortBy*)
- ✅ Field used in .filter() frequently
- ✅ Collection has >100 records

Do NOT add @Index() when:
- ❌ Field never used in queries (index overhead, no benefit)
- ❌ Field has very few unique values (e.g., boolean - index useless)
- ❌ Write performance is critical (indexes slow down writes slightly)

Real example from EasyBoard:
```dart
@collection
class GameMatch {
  Id id = Isar.autoIncrement;

  @Index() // ✅ YES - filtered by date in match history
  late DateTime createdAt;

  @Index() // ✅ YES - filtered by game in game detail screen
  late String gameId;

  late String playerName; // ❌ NO INDEX - only displayed, never filtered

  late bool isCompleted; // ❌ NO INDEX - boolean (only 2 values, index inefficient)
}
```

Questions?
- Want to see query performance comparison?
- Need help identifying other fields to index?
- Curious about compound indexes?
```

**Impact**: Builds user's understanding, prevents future similar questions, demonstrates expertise.

---

