## 6.1 Template Pattern

**When to Use**: Prompt lacks structure, missing key elements (task, context, output format).

**Pattern Structure**:
```xml
<task>[Specific action with measurable outcome]</task>
<context>
  <file>[Exact file path]</file>
  <constraints>[Non-negotiable requirements]</constraints>
  <dependencies>[Related components, services]</dependencies>
</context>
<expected_output>
  [Format: code/markdown/json]
  [Success criteria: specific, testable]
</expected_output>
```

**Example - BEFORE (Score: 30/100)**:
```
User: "create a provider"
```

**Example - AFTER (Score: 88/100)**:
```xml
<task>Create AsyncNotifier provider for game collection management in EasyBoard</task>
<context>
  <file>lib/providers/game_collection_provider.dart</file>
  <constraints>
    - Follow 100% constructor DI (inject DatabaseService via provider)
    - Use @riverpod code generation (Riverpod 2.4.9+)
    - Handle loading/error states with AsyncValue.guard
    - Return Result<T> for operations that can fail
  </constraints>
  <dependencies>
    - DatabaseServiceInterface (Isar operations)
    - GameCollection model (@collection)
    - LoggingService for errors
  </dependencies>
</context>
<expected_output>
  Format: Dart file with:
  1. Abstract interface (if not exists)
  2. @riverpod AsyncNotifier implementation
  3. CRUD methods (create, read, update, delete)
  4. Error handling with AsyncValue and Result<T>
  Success criteria: Compiles without errors, passes flutter analyze
</expected_output>
```

**Impact**: +58 points, adds file paths, constraints, dependencies, measurable outcomes.

---

