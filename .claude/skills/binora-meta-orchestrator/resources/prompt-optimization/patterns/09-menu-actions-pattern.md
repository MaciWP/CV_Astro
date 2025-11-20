## 6.9 Menu Actions Pattern

**When to Use**: Presenting multiple options to user, next action unclear.

**Pattern Structure**:
1. **Present** 3-5 options as numbered menu
2. **Describe** each option briefly
3. **Indicate** recommended option (if applicable)
4. **Wait** for user selection

**Example**:
```
🎯 NEXT ACTIONS

You have several options to proceed:

1. **Implement Dark Mode** (Recommended - high user value)
   - Phase-based implementation outlined above
   - Estimated time: ~80min
   - Skills: flutter-architecture, accessibility, testing

2. **Optimize Database Queries** (High impact if performance issues exist)
   - Add missing @Index() to Isar collections
   - Target: <50ms complex queries, <10ms simple queries
   - Requires: Performance profiling data first

3. **Increase Test Coverage** (Current: 68%, Target: >80%)
   - Generate tests for untested screens
   - Focus: Match creation flow, Freemium logic
   - Prevents regressions

4. **Refactor ML Service** (Low priority unless bugs exist)
   - Extract preprocessing to separate class
   - Add unit tests for tensor operations
   - Improves maintainability

5. **Ask Different Question** (If above don't match your goal)

Which option would you like to pursue? (1-5)
```

**Impact**: Empowers user choice, surfaces priorities, prevents stalling.

---

