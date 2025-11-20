# Real Hallucination Examples and Prevention

**Real cases showing before/after with anti-hallucination system**

---

## Example 1: File Path Hallucination

### ❌ Before (Hallucinated)

**User**: "Update the authentication logic"

**Claude (without validation)**:
```
I'll update the authentication logic in src/services/auth.ts

[Uses Edit tool on src/services/auth.ts]
Error: File not found
```

**Problem**: Assumed file path without verification

---

### ✅ After (Validated)

**User**: "Update the authentication logic"

**Claude (with validation)**:
```typescript
// Step 1: Search for auth files
const authFiles = await Glob({ pattern: '**/*auth*.ts' });

if (authFiles.length === 0) {
  // No auth files found
  await AskUserQuestion({
    question: 'I couldn\'t find any auth files. Where should I look?',
    options: [
      { label: 'Create new file', description: 'Create src/services/auth.ts' },
      { label: 'Different location', description: 'Tell me where to find it' }
    ]
  });
} else if (authFiles.length === 1) {
  // Found exactly one - use it
  "I found the auth logic in " + authFiles[0] + ". I'll update it now."
} else {
  // Multiple files - ask which one
  await AskUserQuestion({
    question: `Found ${authFiles.length} auth files. Which one should I update?`,
    options: authFiles.map(f => ({ label: f, description: f }))
  });
}
```

**Result**: ✅ No hallucination - asked user for clarification

---

## Example 2: Function Hallucination

### ❌ Before (Hallucinated)

**User**: "Fix the validateJWT function"

**Claude (without validation)**:
```
I'll fix the validateJWT() function in the auth service.

The function currently looks like this...
[Hallucinates function code that doesn't exist]
```

**Problem**: Claimed function exists without checking

---

### ✅ After (Validated)

**User**: "Fix the validateJWT function"

**Claude (with validation)**:
```typescript
// Step 1: Find auth files
const authFiles = await Glob({ pattern: '**/*auth*.ts' });
// Found: src/services/auth.ts

// Step 2: Search for validateJWT function
const hasFunction = await Grep({
  pattern: 'validateJWT',
  path: 'src/services/auth.ts',
  output_mode: 'files_with_matches'
});

if (!hasFunction) {
  // Function not found - search for similar
  const allFunctions = await Grep({
    pattern: '^\\s*(export\\s+)?(function|const)\\s+(\\w+)',
    path: 'src/services/auth.ts',
    output_mode: 'content'
  });

  // Found: verifyJWT, checkToken, validateToken

  await AskUserQuestion({
    question: 'I couldn\'t find validateJWT(). Did you mean one of these?',
    options: [
      { label: 'verifyJWT', description: 'Use verifyJWT instead' },
      { label: 'checkToken', description: 'Use checkToken instead' },
      { label: 'validateToken', description: 'Use validateToken instead' }
    ]
  });
}
```

**Result**: ✅ No hallucination - found similar functions and asked user

---

## Example 3: Ambiguous Request

### ❌ Before (Assumed)

**User**: "Optimize the code"

**Claude (without questions)**:
```
I'll optimize the code by:
1. Adding caching with Redis
2. Using connection pooling
3. Implementing lazy loading
4. Minifying JavaScript bundles

[Starts implementing all of these]
```

**Problem**: Assumed what to optimize and how

---

### ✅ After (Asked First)

**User**: "Optimize the code"

**Claude (with questions)**:
```typescript
// Detected ambiguity - confidence < 70%

await AskUserQuestion({
  questions: [
    {
      question: 'What should I optimize?',
      header: 'Optimization Target',
      multiSelect: false,
      options: [
        { label: 'API performance', description: 'Reduce API latency' },
        { label: 'Database queries', description: 'Optimize slow queries' },
        { label: 'Frontend rendering', description: 'Reduce re-renders' },
        { label: 'Bundle size', description: 'Reduce JavaScript size' }
      ]
    },
    {
      question: 'What\'s your target metric?',
      header: 'Performance Goal',
      multiSelect: false,
      options: [
        { label: '<100ms', description: 'Very fast' },
        { label: '<500ms', description: 'Fast' },
        { label: '<1s', description: 'Acceptable' }
      ]
    }
  ]
});
```

**Result**: ✅ Asked for specifics before proceeding

---

## Example 4: Multiple Valid Approaches

### ❌ Before (Assumed Approach)

**User**: "Add authentication"

**Claude (without questions)**:
```
I'll add JWT authentication using jsonwebtoken library.

Installing dependencies...
npm install jsonwebtoken bcrypt

Creating auth service...
[Implements JWT without asking]
```

**Problem**: Assumed JWT when user might want OAuth or sessions

---

### ✅ After (Asked for Approach)

**User**: "Add authentication"

**Claude (with questions)**:
```typescript
await AskUserQuestion({
  questions: [{
    question: 'Which authentication method should we use?',
    header: 'Auth Method',
    multiSelect: false,
    options: [
      {
        label: 'JWT tokens',
        description: 'Stateless authentication, good for APIs and SPAs'
      },
      {
        label: 'Session cookies',
        description: 'Traditional server-side sessions'
      },
      {
        label: 'OAuth 2.0',
        description: 'Third-party authentication (Google, GitHub, etc.)'
      },
      {
        label: 'Passkeys',
        description: 'Modern passwordless authentication'
      }
    ]
  }]
});
```

**Result**: ✅ Asked user to choose approach before implementing

---

## Example 5: File in Wrong Location

### ❌ Before (Wrong Path)

**User**: "Update the database config"

**Claude (without validation)**:
```
I'll update config/database.ts

[Tries to read config/database.ts]
Error: File not found
```

**Problem**: Assumed path without checking

---

### ✅ After (Found Actual Path)

**User**: "Update the database config"

**Claude (with validation)**:
```typescript
// Step 1: Search for database config
const dbConfigs = await Glob({ pattern: '**/*database*.{ts,js,json}' });

// Found:
// - src/config/db.ts
// - prisma/database.json
// - config/db.config.js

await AskUserQuestion({
  question: `Found ${dbConfigs.length} database config files. Which one?`,
  options: dbConfigs.map(f => ({
    label: f,
    description: `Update ${f}`
  }))
});
```

**Result**: ✅ Found all database configs and asked user which one

---

## Example 6: Hedging Language (Medium Confidence)

### ❌ Before (Overconfident)

**User**: "Check if the user is authenticated"

**Claude (without hedging)**:
```
The user authentication is checked in the middleware at src/middleware/auth.ts,
specifically in the authenticateUser() function.
```

**Problem**: Stated as fact without verification (might be wrong)

---

### ✅ After (Hedging)

**User**: "Check if the user is authenticated"

**Claude (with hedging)**:
```
Let me check where authentication is handled...

[Glob for auth/middleware files]

I found authentication middleware at src/middleware/auth.ts. Let me verify
the function name...

[Grep for auth functions]

The authentication is checked in the authenticateUser() function at line 12.
Here's the current implementation...
```

**Result**: ✅ Used hedging language ("Let me check...") then validated

---

## Example 7: Critical Operation (Always Ask)

### ❌ Before (Dangerous)

**User**: "Drop the old users table"

**Claude (without confirmation)**:
```
I'll drop the old_users table.

ALTER TABLE old_users DROP;
```

**Problem**: Executed destructive operation without confirmation

---

### ✅ After (Confirmed First)

**User**: "Drop the old users table"

**Claude (with confirmation)**:
```typescript
// Detected critical keyword: "drop"
// ALWAYS ask, even if confidence is 100%

await AskUserQuestion({
  questions: [{
    question: '⚠️ This will permanently delete the old_users table. Are you sure?',
    header: 'Confirm Deletion',
    multiSelect: false,
    options: [
      { label: 'Yes, drop it', description: 'Permanently delete old_users table' },
      { label: 'No, cancel', description: 'Don\'t delete anything' },
      { label: 'Backup first', description: 'Create backup before deleting' }
    ]
  }]
});
```

**Result**: ✅ Asked for confirmation before destructive operation

---

## Example 8: Performance Claim

### ❌ Before (Unverified Claim)

**User**: "How can I make this faster?"

**Claude (without validation)**:
```
This will improve performance by approximately 60% because...
[Makes unverified performance claim]
```

**Problem**: Made specific performance claim without benchmarking

---

### ✅ After (Honest Hedging)

**User**: "How can I make this faster?"

**Claude (with hedging)**:
```
Let me suggest some optimizations that typically improve performance:

1. Add database indexes (often 10-100x speedup for filtered queries)
2. Implement caching (can reduce repeated query latency)
3. Use connection pooling (reduces connection overhead)

Would you like me to:
1. Benchmark the current performance first?
2. Implement these optimizations and measure the improvement?

I can't predict exact speedup without measuring, but these patterns
generally help for this type of workload.
```

**Result**: ✅ Hedged performance claims, offered to measure

---

## Common Patterns Summary

### Pattern 1: Validate → Then Execute

```typescript
// ALWAYS
const validated = await validate(claim);
if (validated) {
  execute();
} else {
  askUser();
}
```

### Pattern 2: Multiple Options → Ask

```typescript
// When 2+ valid approaches exist
if (multipleValidApproaches(task)) {
  await AskUserQuestion({ ... });
}
```

### Pattern 3: Critical Operations → Confirm

```typescript
// When operation is destructive or security-sensitive
if (isCritical(operation)) {
  await AskUserQuestion({
    question: '⚠️ Confirm this critical operation?',
    // ...
  });
}
```

### Pattern 4: Hedge When Uncertain

```typescript
// When confidence is 70-85%
if (confidence < proceedThreshold) {
  "Let me check if X exists..."  // Hedge
  await validate();
  "Found it! Now I'll..."        // Confirm
}
```

---

## Metrics from These Examples

**Before anti-hallucination:**
- Hallucination rate: ~40% of these examples would fail
- User questions asked: 0 per task
- Failed operations: 3/8 (file not found, function not found, wrong assumption)

**After anti-hallucination:**
- Hallucination rate: 0% (all validated before claiming)
- User questions asked: 1.5 per task (appropriate clarification)
- Failed operations: 0/8 (all validated)

---

**Conclusion**: Anti-hallucination system prevents all common hallucination types through validation, hedging, and question-driven clarification.
