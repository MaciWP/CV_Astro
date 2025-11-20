# Error Messages - Clear, Actionable Communication

**Goal**: Error messages that help developers fix issues immediately without additional research.

**Target**: 4.5/5 clarity rating, <5% follow-up questions

**Based on**: CLI best practices 2024-2025, developer UX research

---

## Core Principles

### 1. Be Specific (Not Vague)

```typescript
// ❌ VAGUE (Bad)
"Build failed"
"Something went wrong"
"Error in authentication"
"Tests are failing"

// ✅ SPECIFIC (Good)
"TypeScript error in src/auth.ts:42 - Property 'email' does not exist on type 'User'"
"ESLint error in src/components/Dashboard.vue:15 - 'data' is assigned a value but never used"
"Test failed: 'should validate email format' - Expected true, got false for input 'invalid@'"
"Webpack build failed: Module not found 'axios' in src/api/client.ts:1"
```

**Pattern**: `Tool/Context - file:line - Specific error - Details`

---

### 2. Include File Path and Line Number

**Always use `file:line` format** for code-related errors:

```typescript
// ❌ BAD: No location
"Variable 'user' is undefined"

// ✅ GOOD: Clear location
"src/services/auth.ts:42 - Variable 'user' is undefined"

// ✅ EVEN BETTER: With context
"src/services/auth.ts:42 - Cannot read property 'id' of undefined - Variable 'user' might be null"
```

**Why**: Developers can jump directly to the problem location.

---

### 3. Suggest How to Fix

**Don't just report the problem - guide toward solution:**

```typescript
// ❌ BAD: Just reports
"Missing dependency 'axios'"

// ✅ GOOD: Suggests fix
"Missing dependency 'axios' - Run: npm install axios"

// ❌ BAD: Just reports
"Property 'email' does not exist on type 'User'"

// ✅ GOOD: Suggests fix
"Property 'email' does not exist on type 'User' - Add 'email: string' to User interface in src/types/user.ts:5"

// ❌ BAD: Just reports
"Test failed: Expected 200, got 404"

// ✅ GOOD: Suggests investigation
"Test failed: Expected 200, got 404 - Check if API endpoint '/api/users' exists and is running"
```

**Pattern**: `Error description - Suggested action`

---

### 4. Provide Context (What Led to Error)

```typescript
// ❌ BAD: No context
"Database query failed"

// ✅ GOOD: With context
"Database query failed while fetching user profile for userId=123 - Connection timeout after 5s"

// ❌ BAD: No context
"Validation error"

// ✅ GOOD: With context
"Validation error in POST /api/users - Field 'email' is required but was undefined in request body"
```

---

## Error Message Templates

### TypeScript Errors

```markdown
**Template**:
`{file}:{line} - TypeScript: {error} - {suggestion}`

**Example**:
"src/auth.ts:42 - TypeScript: Property 'email' does not exist on type 'User' - Add 'email: string' to User interface"
```

### Linter Errors (ESLint, etc.)

```markdown
**Template**:
`{file}:{line} - {rule}: {error} - {suggestion}`

**Example**:
"src/components/Dashboard.vue:15 - no-unused-vars: 'data' is assigned a value but never used - Remove unused variable or prefix with '_'"
```

### Test Failures

```markdown
**Template**:
`Test failed: '{test name}' in {file}:{line}
Expected: {expected}
Actual: {actual}
Suggestion: {how to fix}`

**Example**:
"Test failed: 'should validate email format' in tests/auth.test.ts:25
Expected: true
Actual: false (for input 'invalid@')
Suggestion: Check validateEmail() function - regex might not handle '@' without domain"
```

### Build Errors

```markdown
**Template**:
`{tool} build failed: {specific error} in {file}:{line}
Reason: {why}
Fix: {how}`

**Example**:
"Vite build failed: Module not found 'axios' in src/api/client.ts:1
Reason: Missing dependency
Fix: Run 'npm install axios'"
```

### Runtime Errors

```markdown
**Template**:
`Runtime error in {file}:{line} - {error type}: {message}
Context: {what was happening}
Suggestion: {how to fix}`

**Example**:
"Runtime error in src/services/auth.ts:42 - TypeError: Cannot read property 'id' of undefined
Context: Attempting to access user.id after login
Suggestion: Add null check - if (!user) throw new Error('User not found')"
```

### API/Network Errors

```markdown
**Template**:
`{method} {endpoint} failed with {status} {statusText}
Context: {what was attempted}
Response: {error details}
Suggestion: {how to fix}`

**Example**:
"POST /api/users failed with 404 Not Found
Context: Creating new user with email 'test@example.com'
Response: {"error": "Endpoint does not exist"}
Suggestion: Check API route configuration - endpoint might not be registered"
```

---

## Real-World Examples

### Example 1: File Not Found

```typescript
// ❌ BAD
"I'll update the auth logic"
// (Then Edit fails because file doesn't exist)

// ✅ GOOD
"I searched for auth files but couldn't find any. Should I create:
- src/services/auth.ts (recommended)
- src/auth/index.ts
- Other location (please specify)"
```

**Pattern**: Use `Glob` to validate file exists BEFORE claiming you'll edit it (Module 03: ANTI-HALLUCINATION).

---

### Example 2: Function Not Found

```typescript
// ❌ BAD
"I'll update the validateEmail() function"
// (Function doesn't exist)

// ✅ GOOD
"I searched for validateEmail() but couldn't find it. I found these similar functions:
- isValidEmail() in src/utils/validation.ts:15
- checkEmail() in src/services/auth.ts:42
Which one should I update, or should I create validateEmail()?"
```

**Pattern**: Use `Grep` to validate function exists BEFORE claiming you'll update it.

---

### Example 3: Build Failure

```typescript
// ❌ BAD
"Build failed - there are errors in your code"

// ✅ GOOD
"Build failed with 3 TypeScript errors:

1. src/auth.ts:42 - Property 'email' does not exist on type 'User'
   Fix: Add 'email: string' to User interface

2. src/components/Dashboard.vue:15 - 'data' is assigned a value but never used
   Fix: Remove unused variable or use it in template

3. src/api/client.ts:1 - Module not found: 'axios'
   Fix: Run 'npm install axios'

Would you like me to fix these errors?"
```

**Pattern**: List all errors with specific locations and suggested fixes.

---

### Example 4: Test Failure

```typescript
// ❌ BAD
"Tests are failing"

// ✅ GOOD
"2 tests failed:

1. 'should validate email format' in tests/auth.test.ts:25
   Expected: true for 'valid@example.com'
   Actual: false
   Issue: validateEmail() regex might be too strict

2. 'should return 200 for valid login' in tests/api.test.ts:42
   Expected: 200
   Actual: 404
   Issue: POST /api/login endpoint might not be registered

Would you like me to investigate these failures?"
```

**Pattern**: Show test name, location, expected vs actual, and suggested cause.

---

## Integration with Anti-Hallucination (Module 03)

**Before reporting file/function errors, VALIDATE with tools:**

```typescript
// Step 1: User asks to update file
async function handleFileUpdate(filePath: string) {
  // Step 2: Validate file exists with Glob
  const files = await Glob({ pattern: `**/${filePath}` });

  if (files.length === 0) {
    // Step 3: Report clear error with suggestion
    console.log(
      `File not found: ${filePath}\n` +
      `Searched in: **/${filePath}\n` +
      `Suggestion: Check file path or create new file?`
    );
    return;
  }

  if (files.length > 1) {
    // Step 4: Multiple matches - ask user
    console.log(
      `Found ${files.length} files matching '${filePath}':\n` +
      files.map((f, i) => `${i+1}. ${f}`).join('\n') +
      `\nWhich file should I update?`
    );
    return;
  }

  // Step 5: Exactly 1 match - proceed
  const targetFile = files[0];
  console.log(`Updating ${targetFile}...`);
  // ... proceed with edit
}
```

**This prevents vague errors like "file not found" - instead you get specific, actionable messages.**

---

## Success Criteria

| Metric | Target | Example |
|--------|--------|---------|
| **Specificity** | 100% | Always include file:line for code errors |
| **Actionability** | 90% | Suggest fix for 90% of errors |
| **Clarity** | 4.5/5 | User can fix without asking for clarification |
| **Follow-up questions** | <5% | Error message answers user's questions |

---

## Quick Reference

**Error Message Format**:
```
{context} - {file}:{line} - {specific error} - {suggested fix}
```

**Examples**:
- TypeScript: `src/auth.ts:42 - Property 'email' missing - Add to User interface`
- Linter: `src/App.vue:15 - Unused variable 'data' - Remove or use it`
- Test: `tests/auth.test.ts:25 - Expected true, got false - Check regex`
- Build: `Vite build failed - Module 'axios' not found - Run npm install axios`

**Key Principles**:
1. Be specific (not vague)
2. Include location (file:line)
3. Suggest fix (not just report)
4. Provide context (what led to error)

---

**Version**: 1.0.0
**Based on**: CLI best practices 2024-2025, developer UX research
**Target**: 4.5/5 clarity, <5% follow-up questions
