# File Path Validation Patterns

**Goal**: Prevent claiming files exist without validation
**Target**: 90% of file path hallucinations prevented, <100ms latency

---

## The Problem

**40% of hallucinations are file paths that don't exist:**

```typescript
// ❌ Common hallucinations
"I'll update src/services/auth.ts"  // File doesn't exist
"Let me modify components/Dashboard.vue"  // Wrong path
"The config is in config/database.ts"  // Never verified
```

---

## 3-Stage Validation

### Stage 1: Exact Match (10ms)

**Always try exact path first:**

```typescript
const files = await Glob({ pattern: 'src/services/auth.ts' });

if (files.length > 0) {
  // ✅ File exists, use it
  const filePath = files[0];
}
```

**When to use**: User provides specific path

---

### Stage 2: Wildcard Search (20ms)

**If exact fails, search by filename:**

```typescript
// User said: "src/services/auth.ts" but it doesn't exist
// Try finding "auth.ts" anywhere

const files = await Glob({ pattern: '**/auth.ts' });

if (files.length === 1) {
  // ✅ Found exactly one match
  await AskUserQuestion({
    question: `I couldn't find src/services/auth.ts. Did you mean ${files[0]}?`,
    options: [
      { label: 'Yes', description: `Use ${files[0]}` },
      { label: 'No', description: 'Different file' }
    ]
  });
} else if (files.length > 1) {
  // Multiple matches - ask which one
  await AskUserQuestion({
    question: `Found ${files.length} files named auth.ts. Which one?`,
    options: files.map(f => ({ label: f, description: `Use ${f}` }))
  });
}
```

**When to use**: Exact match fails, but filename might be correct

---

### Stage 3: Fuzzy Match (30ms)

**If wildcard fails, find similar paths:**

```typescript
// User said: "src/services/auth.ts"
// No exact match, no wildcard match
// Try fuzzy matching (Levenshtein distance ≤2)

// Pseudo-code (actual implementation would scan all files)
const allFiles = await Glob({ pattern: '**/*.ts' });
const similar = allFiles.filter(file =>
  levenshteinDistance('src/services/auth.ts', file) <= 2
);

if (similar.length > 0) {
  await AskUserQuestion({
    question: 'I couldn\'t find that file. Did you mean one of these?',
    options: similar.slice(0, 3).map(f => ({
      label: f,
      description: `Use ${f}`
    }))
  });
}
```

**When to use**: Last resort before giving up

**Levenshtein distance ≤2**:
- Distance 1: One character different (typo)
- Distance 2: Two characters different (minor mistake)
- Distance >2: Too different, probably not what user meant

---

## Common Patterns

### Pattern 1: User Specifies Full Path

```typescript
// User: "Update src/components/Auth/LoginForm.tsx"

// Step 1: Exact match
const files = await Glob({ pattern: 'src/components/Auth/LoginForm.tsx' });

if (files.length === 0) {
  // Step 2: Wildcard (just filename)
  const wildcard = await Glob({ pattern: '**/LoginForm.tsx' });

  if (wildcard.length === 1) {
    // Found it elsewhere
    await AskUserQuestion({
      question: `LoginForm.tsx is actually at ${wildcard[0]}. Use that?`,
      // ...
    });
  }
}
```

### Pattern 2: User Gives Partial Path

```typescript
// User: "The auth file"

// Search for likely files
const authFiles = await Glob({ pattern: '**/*auth*.{ts,js,tsx,jsx}' });

if (authFiles.length === 0) {
  await AskUserQuestion({
    question: 'I couldn\'t find any auth-related files. Where should I look?',
    // ...
  });
} else if (authFiles.length === 1) {
  // Exactly one - probably this
  "I found the auth file at " + authFiles[0]
} else {
  // Multiple - ask which one
  await AskUserQuestion({
    question: `Found ${authFiles.length} auth files. Which one?`,
    options: authFiles.map(f => ({ label: f, description: `Use ${f}` }))
  });
}
```

### Pattern 3: User Asks to Create New File

```typescript
// User: "Create a new auth service"

// Even for new files, verify directory exists
const parentDir = 'src/services';
const parentExists = await Glob({ pattern: parentDir });

if (parentExists.length === 0) {
  await AskUserQuestion({
    question: `Directory ${parentDir} doesn\'t exist. Where should I create the auth service?`,
    options: [
      { label: 'Create src/services/', description: 'Create directory and file' },
      { label: 'Different location', description: 'Specify where to create' }
    ]
  });
}
```

---

## Glob Patterns Reference

### Basic Patterns

```typescript
// Exact file
Glob({ pattern: 'src/auth.ts' })

// Any extension
Glob({ pattern: 'src/auth.*' })

// Specific extensions
Glob({ pattern: 'src/auth.{ts,js,tsx,jsx}' })

// Anywhere in tree
Glob({ pattern: '**/auth.ts' })

// In specific directory tree
Glob({ pattern: 'src/**/auth.ts' })

// Multiple directories
Glob({ pattern: '{src,lib}/**/auth.ts' })

// Exclude patterns (advanced)
Glob({ pattern: 'src/**/!(*.test).ts' })  // Exclude test files
```

### Common Searches

```typescript
// All TypeScript files (excluding tests)
Glob({ pattern: 'src/**/!(*.test).ts' })

// All component files
Glob({ pattern: 'src/components/**/*.{tsx,vue,jsx}' })

// All service files
Glob({ pattern: 'src/services/**/*.ts' })

// Config files
Glob({ pattern: '**/config*.{ts,js,json}' })
```

---

## Validation Checklist

Before claiming a file exists:

- [ ] **Run Glob** with exact path first
- [ ] **If fails**, try wildcard search
- [ ] **If multiple matches**, ask user which one
- [ ] **If no matches**, try fuzzy search (distance ≤2)
- [ ] **If still no matches**, ask user to provide path
- [ ] **Never assume** - always validate

---

## Real Examples

### Example 1: File Doesn't Exist

```typescript
// User: "Update the auth config in config/auth.ts"

// ❌ WRONG
"I'll update config/auth.ts..."  // Never checked!

// ✅ CORRECT
const files = await Glob({ pattern: 'config/auth.ts' });
if (files.length === 0) {
  const wildcard = await Glob({ pattern: '**/auth*.{ts,js}' });

  if (wildcard.length > 0) {
    await AskUserQuestion({
      question: 'I couldn\'t find config/auth.ts. Did you mean one of these?',
      options: wildcard.map(f => ({ label: f, description: f }))
    });
  } else {
    await AskUserQuestion({
      question: 'I couldn\'t find any auth config. Should I create it?',
      // ...
    });
  }
}
```

### Example 2: Multiple Matches

```typescript
// User: "Update the database config"

const dbConfigs = await Glob({ pattern: '**/*database*.{ts,js,json}' });

// Found: config/database.ts, src/config/db.ts, prisma/database.json

await AskUserQuestion({
  question: `Found ${dbConfigs.length} database config files. Which one?`,
  options: dbConfigs.map(f => ({
    label: f,
    description: `Update ${f}`
  }))
});
```

---

## Latency Targets

| Stage | Target | Typical |
|-------|--------|---------|
| Stage 1 (Exact) | 10ms | 5-15ms |
| Stage 2 (Wildcard) | 20ms | 15-30ms |
| Stage 3 (Fuzzy) | 30ms | 30-50ms |
| **Total** | **<100ms** | **~60ms** |

---

## Cache Strategy

**Cache validated paths for 5 minutes:**

```typescript
// First validation
const files = await Glob({ pattern: 'src/auth.ts' });  // 10ms
// Cache: 'src/auth.ts' → true

// Within 5 minutes, same path
const cachedResult = cache.get('src/auth.ts');  // <1ms
// Skip Glob, use cached result
```

**Invalidate on file write/edit:**
- When you Edit or Write a file, invalidate its cache entry
- Ensures cache is never stale

---

**Next**: See [function-validation.md](function-validation.md) for function existence patterns
