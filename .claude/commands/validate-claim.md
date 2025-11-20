---
description: Validate a specific claim (file path, function name) before using it
---

# Validate Claim

Validate a specific file path or function name before making assertions about it.

## Usage

```
/validate-claim <file-path> [function-name] [domain]
```

### Parameters

- **file-path** (required): Path to validate (e.g., `src/services/auth.ts`)
- **function-name** (optional): Function name to validate (e.g., `validateJWT`)
- **domain** (optional): Domain for confidence thresholds (`frontend`, `backend`, `database`, `security`, `general`)

### Examples

```
/validate-claim src/services/auth.ts
/validate-claim src/services/auth.ts validateJWT
/validate-claim src/services/auth.ts validateJWT backend
```

## Validation Process

### Step 1: File Path Validation

```typescript
// Stage 1: Exact match
const files = await Glob({ pattern: filePath });

if (files.length === 0) {
  // Stage 2: Wildcard search
  const filename = filePath.split('/').pop();
  const wildcard = await Glob({ pattern: `**/${filename}` });

  if (wildcard.length > 0) {
    // Report suggestions
  } else {
    // Stage 3: Fuzzy match (distance ≤2)
    // Report similar paths
  }
}
```

### Step 2: Function Validation (if provided)

```typescript
if (functionName && files.length > 0) {
  const hasFunction = await Grep({
    pattern: functionName,
    path: files[0],
    output_mode: 'files_with_matches'
  });

  if (!hasFunction) {
    // Search for similar function names
    // Report suggestions
  }
}
```

### Step 3: Confidence Calculation

```typescript
const confidence =
  (fileVerified ? 30 : 0) +
  (functionVerified ? 25 : 0) +
  (detailed description ? 15 : 0) +
  (clear requirements ? 20 : 0);
```

### Step 4: Decision

```typescript
const threshold = {
  frontend: { ask: 65, proceed: 85 },
  backend: { ask: 70, proceed: 90 },
  database: { ask: 75, proceed: 92 },
  security: { ask: 75, proceed: 92 }
}[domain || 'general'];

if (confidence < threshold.ask) {
  action = 'ASK_USER';
} else if (confidence >= threshold.proceed) {
  action = 'PROCEED_CONFIDENTLY';
} else {
  action = 'PROCEED_WITH_HEDGING';
}
```

## Output Format

```
🔍 Claim Validation Results

📁 File: src/services/auth.ts
   Status: ✅ Found
   Path: src/services/auth.ts

🔍 Function: validateJWT
   Status: ❌ Not found
   Suggestions:
   - verifyJWT (line 12)
   - checkJWT (line 45)
   - validateToken (line 78)

📊 Confidence: 45% (LOW)
   - File verified: +30%
   - Function verified: 0%
   - Past success: 0%
   - Clear requirements: +15%

⚠️ Action: ASK_USER
   Reason: Function not found (confidence 45% < 70% threshold)

💡 Recommendation:
   Ask user: "I couldn't find validateJWT(). Did you mean one of these: verifyJWT, checkJWT, validateToken?"
```

## Real Example

**Command**:
```
/validate-claim src/components/Dashboard.vue renderChart
```

**Output**:
```
🔍 Claim Validation Results

📁 File: src/components/Dashboard.vue
   Status: ✅ Found
   Path: src/components/Dashboard.vue

🔍 Function: renderChart
   Status: ✅ Found (line 67)
   Signature: const renderChart = async (data: ChartData) => { }

📊 Confidence: 70% (MEDIUM)
   - File verified: +30%
   - Function verified: +25%
   - Past success: 0%
   - Clear requirements: +15%

✅ Action: PROCEED_WITH_HEDGING (Frontend domain: 65-85%)

💡 Recommendation:
   Use hedging language: "Let me check the renderChart function in Dashboard.vue..." then proceed
```

## When to Use

- **Before claiming** a file or function exists
- **During debugging** to verify assumptions
- **When uncertain** about file locations
- **Before refactoring** to ensure targets exist

## Integration

**In workflows:**
```typescript
// Before making changes
const validation = await validateClaim('src/auth.ts', 'validateJWT', 'backend');

if (validation.action === 'ASK_USER') {
  await AskUserQuestion({ ... });
} else if (validation.action === 'PROCEED_WITH_HEDGING') {
  "Let me verify the function exists..."
  // Then proceed
}
```

---

**Version**: 1.0.0
**Documentation**: `.claude/docs/anti-hallucination/`
**Related**: `/load-anti-hallucination`, `/docs`
