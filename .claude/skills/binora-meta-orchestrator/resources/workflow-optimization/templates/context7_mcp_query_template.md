# Context7 MCP Query Template

**Copy-paste template for fetching official library documentation with Context7 MCP.**

---

## Basic 2-Step Query

```typescript
// Step 1: Resolve library ID
mcp__context7__resolve-library-id("{{LIBRARY_NAME}}")
// Returns: /org/project or /org/project/version

// Step 2: Get targeted documentation
mcp__context7__get-library-docs(
  "{{LIBRARY_ID}}",        // From Step 1 (e.g., "/riverpod/riverpod")
  "{{TOPIC}}",             // Specific feature/API (e.g., "AsyncNotifier @riverpod")
  {{TOKENS}}               // 3000-7000 tokens (3K=basic, 5K=comprehensive, 7K=deep dive)
)
```

---

## Common Library IDs (EasyBoard Stack)

| Library | Library ID | Common Topics |
|---------|------------|---------------|
| **Flutter** | `/websites/docs_flutter_io` | Material Design 3, colorScheme, Theme.of(context), widgets, performance |
| **Riverpod** | `/rrousselGit/riverpod` | AsyncNotifier, @riverpod, FutureOr, ref.watch, ref.read, ProviderScope |
| **Isar** | `/isar/isar` (resolve first) | @Index, @collection, .where vs .filter, writeTxn, migrations |
| **go_router** | `/flutter/packages/go_router` | GoRoute, context.go, context.push, deep linking, path parameters |
| **ONNX Runtime** | `/microsoft/onnxruntime` | Mobile optimization, INT8 quantization, OrtSession, inference |
| **Dart** | `/dart-lang/site-www` | async/await, null safety, language features |

**Note**: Always resolve library ID first (don't guess) to ensure correct path.

---

## Example 1: Flutter Material Design 3 Colors

```typescript
// Step 1: Resolve
mcp__context7__resolve-library-id("flutter")
→ Returns: /websites/docs_flutter_io

// Step 2: Query
mcp__context7__get-library-docs(
  "/websites/docs_flutter_io",
  "Material Design 3 colorScheme Theme context primary secondary",
  5000
)

// Expected: Official Flutter docs on Theme.of(context).colorScheme usage
```

---

## Example 2: Riverpod AsyncNotifier Pattern

```typescript
// Step 1: Resolve
mcp__context7__resolve-library-id("riverpod")
→ Returns: /rrousselGit/riverpod

// Step 2: Query
mcp__context7__get-library-docs(
  "/rrousselGit/riverpod",
  "AsyncNotifier @riverpod code generation FutureOr build method",
  5000
)

// Expected: Riverpod 2.4.9+ AsyncNotifier pattern with @riverpod annotation
```

---

## Example 3: Isar Query Optimization

```typescript
// Step 1: Resolve (Isar may need resolution)
mcp__context7__resolve-library-id("isar database")
→ Returns: /isar/isar

// Step 2: Query
mcp__context7__get-library-docs(
  "/isar/isar",
  "@Index query optimization .where .filter performance compound index",
  7000  // More tokens for comprehensive query guide
)

// Expected: Isar 3.1.0+ query optimization with @Index best practices
```

---

## Example 4: ONNX Runtime Mobile Optimization

```typescript
// Step 1: Resolve
mcp__context7__resolve-library-id("onnx runtime")
→ Returns: /microsoft/onnxruntime

// Step 2: Query
mcp__context7__get-library-docs(
  "/microsoft/onnxruntime",
  "mobile optimization INT8 quantization Flutter Android inference performance",
  7000
)

// Expected: ONNX Runtime mobile-specific optimization guide
```

---

## Example 5: go_router Navigation & Deep Linking

```typescript
// Step 1: Resolve
mcp__context7__resolve-library-id("go_router flutter")
→ Returns: /flutter/packages/go_router

// Step 2: Query
mcp__context7__get-library-docs(
  "/flutter/packages/go_router",
  "GoRoute builder pathParameters deep linking 14.0",
  5000
)

// Expected: go_router 14.0+ navigation with deep linking setup
```

---

## Token Budget Guidelines

| Tokens | Use Case | What You Get |
|--------|----------|--------------|
| **3000** | Quick answer | Basic example, key API reference |
| **5000** | Standard (recommended) | Comprehensive pattern with examples |
| **7000** | Deep dive | Complete API reference, multiple examples, edge cases |

**Rule of Thumb**: Start with 5000. Adjust up (7000) for complex topics, down (3000) for simple lookups.

---

## Topic Specificity Tips

### ❌ Too Vague (returns 1000+ results)
```typescript
"riverpod"  // Too broad
"flutter widgets"  // Too general
"isar"  // No specific feature
```

### ✅ Specific (targeted results)
```typescript
"AsyncNotifier @riverpod FutureOr build"  // Exact pattern
"Material Design 3 colorScheme Theme"  // Specific feature
"@Index compound query optimization"  // Targeted optimization
```

**Pattern**: Include specific API names, version numbers, exact feature names.

---

## Common Mistakes to Avoid

### Mistake 1: Skipping Library ID Resolution

```typescript
❌ BAD: mcp__context7__get-library-docs("/flutter", ...)
Result: Wrong path, query fails

✅ GOOD:
1. mcp__context7__resolve-library-id("flutter")
2. Use returned ID: /websites/docs_flutter_io
```

### Mistake 2: Generic Topics

```typescript
❌ BAD: "providers" (too vague)
✅ GOOD: "AsyncNotifier @riverpod code generation pattern"
```

### Mistake 3: Wrong Token Budget

```typescript
❌ BAD: 500 tokens (truncated, incomplete)
⚠️ OK: 3000 tokens (basic, may miss details)
✅ GOOD: 5000 tokens (comprehensive)
🔍 DEEP: 7000 tokens (complete reference)
```

---

## Workflow Integration

**When to Use Context7 MCP** (Phase 4: Tool Optimization):

1. **ALWAYS prefer** Context7 MCP over WebSearch for official docs
2. **Combine with other tools**:
   - Context7 (get pattern) → Grep (find existing usage) → Read (review implementation) → Edit (apply pattern)
3. **Parallel execution**:
   - Context7 + Grep + Read in single message (3x faster)

**Performance**:
- Context7: 2-3s
- WebSearch: 10-15s (5-7x slower)
- Speedup: **5-100x** (100x for documentation vs manual search)

---

## Checklist: Ready to Query?

Before querying Context7 MCP, verify:

- [ ] Library name known? (Flutter, Riverpod, Isar, etc.)
- [ ] Specific topic identified? (Not just "providers", but "AsyncNotifier @riverpod")
- [ ] Token budget chosen? (3K=quick, 5K=standard, 7K=deep)
- [ ] Resolve library ID first? (Don't guess paths)

**If all YES**: Proceed with query using template above.

---

**Last Updated**: 2025-10-28
**Use Case**: Fetch official library documentation for EasyBoard tech stack
**Average Speedup**: 5-100x faster than WebSearch or manual docs browsing