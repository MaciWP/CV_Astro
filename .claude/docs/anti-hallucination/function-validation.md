# Function Existence Validation Patterns

**Goal**: Prevent claiming functions exist without validation
**Target**: 85% of function hallucinations prevented, <50ms latency

---

## The Problem

**25% of hallucinations are functions that don't exist:**

```typescript
// ❌ Common hallucinations
"I'll update the validateJWT() function"  // Function doesn't exist
"Let me modify the calculateTotal() method"  // Different name
"The getUserById function handles this"  // Never verified
```

---

## Function Search Strategy

### Step 1: Direct Pattern Match

**Search for function declaration patterns:**

```typescript
const hasFunction = await Grep({
  pattern: 'validateJWT',  // Function name
  path: 'src/services/auth.ts',  // File (must be validated first!)
  output_mode: 'files_with_matches'
});

if (hasFunction.length > 0) {
  // ✅ Function exists
} else {
  // ❌ Function not found
}
```

### Step 2: Get Function Details (if needed)

**Get line number and signature:**

```typescript
const details = await Grep({
  pattern: 'validateJWT',
  path: 'src/services/auth.ts',
  output_mode: 'content',
  '-n': true,  // Show line numbers
  '-A': 2      // Show 2 lines after (for signature)
});

// Result:
// 45:export function validateJWT(token: string): boolean {
// 46:  // ...
// 47:}
```

**Parse to get:**
- Line number: 45
- Signature: `export function validateJWT(token: string): boolean`

---

## Function Declaration Patterns

Functions can be declared in multiple ways. Search for ALL patterns:

### Pattern 1: Function Declaration

```typescript
// Search pattern
pattern: 'function\\s+validateJWT\\s*\\('

// Matches:
function validateJWT(token) { }
export function validateJWT(token: string) { }
async function validateJWT() { }
```

### Pattern 2: Const/Let Assignment

```typescript
// Search pattern
pattern: 'const\\s+validateJWT\\s*='

// Matches:
const validateJWT = (token) => { }
export const validateJWT = async (token: string) => { }
const validateJWT = function(token) { }
```

### Pattern 3: Export Shorthand

```typescript
// Search pattern
pattern: 'export\\s+.*validateJWT'

// Matches:
export { validateJWT }
export { validateJWT as validate }
export { validateJWT } from './jwt'
```

### Pattern 4: Class Methods

```typescript
// Search pattern
pattern: 'validateJWT\\s*\\('

// Matches (inside class):
validateJWT(token) { }  // Method
async validateJWT(token: string) { }  // Async method
validateJWT = (token) => { }  // Arrow function property
```

### Pattern 5: Object Properties

```typescript
// Search pattern
pattern: 'validateJWT\\s*:'

// Matches:
const api = {
  validateJWT: (token) => { },
  validateJWT(token) { }  // Method shorthand
}
```

---

## Complete Validation Workflow

```typescript
async function validateFunction(fnName: string, filePath: string) {
  // Pattern list (ordered by likelihood)
  const patterns = [
    `function\\s+${fnName}\\s*\\(`,     // function validateJWT()
    `const\\s+${fnName}\\s*=`,          // const validateJWT =
    `export\\s+.*${fnName}`,             // export { validateJWT }
    `${fnName}\\s*\\(`,                 // validateJWT() (class method)
    `${fnName}\\s*:`,                   // validateJWT: () =>
  ];

  // Try each pattern
  for (const pattern of patterns) {
    const result = await Grep({
      pattern,
      path: filePath,
      output_mode: 'files_with_matches'
    });

    if (result.length > 0) {
      return { found: true, pattern };
    }
  }

  // Not found - search for similar
  return { found: false };
}
```

---

## Fuzzy Matching for Functions

**If function not found, search for similar names:**

```typescript
// User asked for: validateJWT
// Function not found

// Step 1: Get all function names from file
const allFunctions = await Grep({
  pattern: '^\\s*(function|const|export)\\s+(\\w+)',
  path: 'src/services/auth.ts',
  output_mode: 'content'
});

// Result might be:
// function verifyJWT() { }
// const checkJWT = () => { }
// export function validateToken() { }

// Step 2: Extract function names
const functionNames = allFunctions.map(line => {
  const match = line.match(/(function|const|export)\s+(\w+)/);
  return match ? match[2] : null;
}).filter(Boolean);

// functionNames: ['verifyJWT', 'checkJWT', 'validateToken']

// Step 3: Find similar (Levenshtein distance)
const similar = functionNames.filter(name =>
  levenshteinDistance('validateJWT', name) <= 3  // Max distance 3 for functions
);

// similar: ['verifyJWT']  (distance = 3: validate → verify)

// Step 4: Ask user
await AskUserQuestion({
  question: 'I couldn\'t find validateJWT(). Did you mean one of these?',
  options: similar.map(fn => ({
    label: fn,
    description: `Use ${fn} instead`
  })).concat([{
    label: 'Create new function',
    description: 'Create validateJWT() from scratch'
  }])
});
```

---

## Language-Specific Patterns

### TypeScript/JavaScript

```typescript
// Function patterns
'function\\s+' + fnName
'const\\s+' + fnName + '\\s*='
'export\\s+(async\\s+)?function\\s+' + fnName
fnName + '\\s*\\(.*\\)\\s*{'
```

### Python

```python
# Function patterns (for Python projects)
'def\\s+' + fnName
'async\\s+def\\s+' + fnName
'@.*\\s+def\\s+' + fnName  # Decorated functions
```

### Go

```go
// Function patterns (for Go projects)
'func\\s+' + fnName
'func\\s+\\(.*\\)\\s+' + fnName  // Method
```

---

## Common Scenarios

### Scenario 1: Function Doesn't Exist

```typescript
// User: "Update the validateJWT function in auth.ts"

// ❌ WRONG
"I'll update the validateJWT() function..."

// ✅ CORRECT
const hasFunction = await Grep({
  pattern: 'validateJWT',
  path: 'src/services/auth.ts',
  output_mode: 'files_with_matches'
});

if (!hasFunction) {
  // Search for similar
  const allFunctions = await Grep({
    pattern: '^\\s*(function|const|export)\\s+(\\w+)',
    path: 'src/services/auth.ts',
    output_mode: 'content'
  });

  // Extract and show similar functions
  await AskUserQuestion({
    question: 'I couldn\'t find validateJWT(). Which function should I use?',
    // ... show similar function names
  });
}
```

### Scenario 2: Multiple Functions with Similar Names

```typescript
// File has:
// - validateJWT()
// - validateJWTToken()
// - validateRefreshToken()

// User: "Update the validate function"

const validateFunctions = await Grep({
  pattern: 'validate.*\\(',
  path: 'src/services/auth.ts',
  output_mode: 'content',
  '-n': true
});

// Show all matches to user
await AskUserQuestion({
  question: 'Found multiple validate functions. Which one?',
  options: extractFunctionNames(validateFunctions).map(fn => ({
    label: fn,
    description: `Update ${fn}`
  }))
});
```

### Scenario 3: Function in Different File

```typescript
// User: "Update validateJWT in auth.ts"
// Function is actually in jwt-utils.ts

const inAuth = await Grep({
  pattern: 'validateJWT',
  path: 'src/services/auth.ts',
  output_mode: 'files_with_matches'
});

if (!inAuth) {
  // Search across all files
  const anywhereFiles = await Grep({
    pattern: 'validateJWT',
    path: 'src',  // Search whole src directory
    output_mode: 'files_with_matches'
  });

  if (anywhereFiles.length > 0) {
    await AskUserQuestion({
      question: `validateJWT is not in auth.ts. I found it in ${anywhereFiles[0]}. Use that?`,
      // ...
    });
  }
}
```

---

## Grep Patterns Reference

### Basic Function Search

```typescript
// Any mention of function name
Grep({ pattern: 'validateJWT', ... })

// Function declaration only
Grep({ pattern: 'function\\s+validateJWT', ... })

// Exported functions only
Grep({ pattern: 'export.*validateJWT', ... })

// With context (see surrounding code)
Grep({
  pattern: 'validateJWT',
  '-C': 5,  // 5 lines before and after
  output_mode: 'content'
})
```

### Extract All Functions

```typescript
// TypeScript/JavaScript
Grep({
  pattern: '^\\s*(export\\s+)?(async\\s+)?(function|const)\\s+(\\w+)',
  output_mode: 'content'
})

// Python
Grep({
  pattern: '^\\s*def\\s+(\\w+)',
  output_mode: 'content'
})

// Go
Grep({
  pattern: '^func\\s+(\\w+)',
  output_mode: 'content'
})
```

---

## Validation Checklist

Before claiming a function exists:

- [ ] **File validated first** (function validation requires valid file)
- [ ] **Run Grep** with function name
- [ ] **Try multiple patterns** (function, const, export, method)
- [ ] **If not found**, search for similar names
- [ ] **If still not found**, ask user to clarify
- [ ] **Get line number** when found (for reference)
- [ ] **Never assume** - always validate

---

## Performance

| Operation | Target | Typical |
|-----------|--------|---------|
| Simple Grep (function name) | 20ms | 10-30ms |
| Multi-pattern search (5 patterns) | 50ms | 30-60ms |
| Fuzzy match (get all functions) | 100ms | 80-150ms |
| **Total (worst case)** | **<150ms** | **~100ms** |

---

## Integration with File Validation

**ALWAYS validate file before validating function:**

```typescript
// Step 1: Validate file
const files = await Glob({ pattern: filePath });
if (files.length === 0) {
  // File doesn't exist - stop here
  return;
}

// Step 2: Validate function (only if file exists)
const hasFunction = await Grep({
  pattern: functionName,
  path: files[0],  // Use validated file path
  output_mode: 'files_with_matches'
});
```

---

**Next**: See [confidence-scoring.md](confidence-scoring.md) for confidence calculation
