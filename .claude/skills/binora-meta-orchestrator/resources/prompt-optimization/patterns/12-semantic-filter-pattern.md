## 6.12 Semantic Filter Pattern

**When to Use**: Large result set needs filtering, user wants specific subset.

**Pattern Structure**:
1. **Understand** filter intent (semantic meaning, not just keywords)
2. **Apply** filters progressively
3. **Explain** what was filtered out and why
4. **Refine** if user wants different subset

**Example**:
```
User: "Show me all services"

Semantic Filter Applied:
Intent: User wants business logic services, not utility classes

Filter 1: File location
- Include: lib/services/**/*.dart
- Exclude: lib/utils/, lib/helpers/
Result: 18 files

Filter 2: Semantic meaning
- Include: Files with "Service" suffix
- Exclude: Abstract interfaces (*Interface.dart), base classes (*Base.dart)
Result: 12 files

Filter 3: Business logic
- Include: Services with database/ML/business operations
- Exclude: Utility services (logging, config, storage)
Result: 8 files

FILTERED RESULTS (8 services):
1. DatabaseService - Isar CRUD operations
2. GameService - Game management logic
3. MatchService - Match creation/editing
4. MLService - YOLO11 ONNX inference
5. CameraService - Image capture
6. ScoringService - Score calculation
7. FreemiumService - Premium gate logic
8. AnalyticsService - Usage tracking

Filtered out: LoggingService, ConfigService, StorageService, ValidationService (utility services)

Refine filters? (e.g., "show only ML-related services" or "include utility services")
```

**Impact**: Provides relevant results, teaches user about codebase structure.

---

