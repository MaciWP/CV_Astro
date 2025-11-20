# Confidence Scoring and Decision Making

**Goal**: Calculate confidence (0-100%) and decide when to ask vs proceed
**Target**: <5% calibration error (confidence matches actual success rate)

---

## Confidence Formula

```
Confidence Score (0-100) =
  File Verified (+30%) +
  Function Verified (+25%) +
  Past Success (+25%) +
  Clear Requirements (+20%)
```

### Component 1: File Verified (+30%)

```typescript
if (await validateFilePath(claim.filePath)) {
  score += 30;  // File exists
} else if (fuzzyMatchFound) {
  score += 15;  // Similar file exists (partial credit)
}
```

### Component 2: Function Verified (+25%)

```typescript
if (await validateFunction(claim.functionName, claim.filePath)) {
  score += 25;  // Function exists
} else if (similarFunctionFound) {
  score += 12;  // Similar function exists (partial credit)
}
```

### Component 3: Past Success (+25%)

```typescript
const similarTasks = findSimilarTasksInHistory(claim.description);

if (similarTasks.some(task => task.success)) {
  score += 25;  // Similar task succeeded before
} else if (claim.description.length > 50) {
  score += 15;  // Detailed description (partial credit)
}
```

**Note**: Past success tracking requires persistent memory (future feature)

### Component 4: Clear Requirements (+20%)

```typescript
if (hasAcceptanceCriteria(claim)) {
  score += 20;  // Has "should", "must", "when" criteria
} else if (!isAmbiguous(claim.description)) {
  score += 15;  // Clear description even without explicit criteria
} else {
  score += 0;   // Vague/ambiguous
}
```

---

## Domain-Adaptive Thresholds

Different domains have different risk levels:

| Domain | Ask Threshold | Proceed Threshold | Rationale |
|--------|---------------|-------------------|-----------|
| **Frontend** | <65% | >85% | Lower risk (UI bugs less critical) |
| **Backend** | <70% | >90% | Medium risk (business logic) |
| **Database** | <75% | >92% | High risk (data integrity) |
| **Security** | <75% | >92% | High risk (vulnerabilities) |
| **General** | <70% | >90% | Default (medium risk) |

---

## Decision Tree

```
Calculate Confidence Score
         ↓
    Score < Ask Threshold?
         ↓
       YES → ASK USER
         ↓
        NO
         ↓
    Score ≥ Proceed Threshold?
         ↓
       YES → PROCEED CONFIDENTLY
         ↓
        NO
         ↓
    PROCEED WITH HEDGING
    ("might be in...", "checking...")
```

---

## Actions by Confidence Level

### Action 1: ASK_USER (Confidence < Ask Threshold)

**When**: Confidence too low to proceed safely

**Language**:
```typescript
// <65% (Frontend)
"I couldn't find the auth file. Where should I look?"
"Which component should I update - Dashboard or DashboardView?"

// <70% (Backend)
"I'm not sure which API endpoint handles login. Can you clarify?"
"Should I create a new service or update existing auth.ts?"

// <75% (Database/Security)
"This migration will modify the users table. Confirm the changes?"
"Which encryption algorithm should we use - AES-256 or RSA?"
```

**Examples**:
```typescript
// Score: 30 (only file verified, everything else missing)
// Domain: Backend (ask threshold: 70%)
// 30 < 70 → ASK_USER

await AskUserQuestion({
  question: 'I found the file but need more details. What should I do?',
  // ...
});
```

---

### Action 2: PROCEED_WITH_HEDGING (Ask ≤ Confidence < Proceed)

**When**: Moderate confidence - proceed but use hedging language

**Hedging patterns**:
```typescript
// 65-85% (Frontend)
"This might be in src/components/Dashboard.vue. Let me check..."
"I'll look for the form validation logic..."

// 70-90% (Backend)
"The auth logic appears to be in src/services/auth.ts. Verifying..."
"Let me confirm the API endpoint structure..."

// 75-92% (Database/Security)
"Checking if the migration is safe to run..."
"Verifying the current encryption settings..."
```

**Implementation**:
```typescript
// Score: 75 (file + function verified)
// Domain: Backend (proceed threshold: 90%)
// 70 < 75 < 90 → PROCEED_WITH_HEDGING

"Let me check if validateJWT exists in auth.ts..." // Hedging
const result = await Grep({ ... });  // Then validate
"Found it at line 45. I'll update it now."  // Confirm after validation
```

---

### Action 3: PROCEED_CONFIDENTLY (Confidence ≥ Proceed)

**When**: High confidence - state facts directly

**Language**:
```typescript
// >85% (Frontend)
"I'll update the Dashboard component at src/components/Dashboard.vue"

// >90% (Backend)
"I'll modify the validateJWT function in src/services/auth.ts (line 45)"

// >92% (Database/Security)
"I'll run the migration to add the email_verified column"
```

**Examples**:
```typescript
// Score: 95 (file + function + clear requirements)
// Domain: Backend (proceed threshold: 90%)
// 95 > 90 → PROCEED_CONFIDENTLY

"I'll update the validateJWT() function in src/services/auth.ts to use RS256 algorithm."
// No hedging, direct statement
```

---

## Additional Triggers (Beyond Confidence)

**Ask user even if confidence is high when:**

### Trigger 1: Multiple Valid Approaches

```typescript
// User: "Add authentication"
// Multiple approaches: JWT, OAuth, Sessions

await AskUserQuestion({
  question: 'Which authentication method should we use?',
  options: [
    { label: 'JWT tokens', description: 'Stateless, good for APIs' },
    { label: 'OAuth 2.0', description: 'Third-party login' },
    { label: 'Sessions', description: 'Traditional server-side' }
  ]
});

// Even if confidence is 90%, ASK because multiple valid options exist
```

### Trigger 2: Critical Decision

```typescript
// Keywords that indicate critical decisions
const criticalKeywords = [
  'delete', 'drop', 'remove',
  'production', 'live',
  'migration', 'schema change',
  'security', 'password', 'token'
];

if (criticalKeywords.some(kw => claim.description.includes(kw))) {
  // ASK user even if confidence is 95%
  await AskUserQuestion({
    question: 'This is a critical operation. Confirm you want to proceed?',
    // ...
  });
}
```

### Trigger 3: Ambiguous Requirements

```typescript
function isAmbiguous(description: string): boolean {
  const ambiguousKeywords = [
    'optimize',   // Optimize what? Which metric?
    'fix',        // Fix what? How?
    'improve',    // Improve how?
    'better',     // Better in what way?
  ];

  // Check if description is vague
  return (
    ambiguousKeywords.some(kw => description.includes(kw)) &&
    description.length < 30 &&
    !/\d+|<|>|ms|MB|%/.test(description)  // No specific metrics
  );
}

// User: "Optimize the code"
// Even if confidence is 80%, ASK because requirements are ambiguous
```

---

## Real Examples

### Example 1: Low Confidence → ASK

```typescript
// Claim
{
  filePath: 'src/services/auth.ts',  // Not verified
  functionName: 'validateJWT',       // Not verified
  description: 'Update auth',        // Vague
  domain: 'backend'
}

// Scoring
File verified: 0       // Glob failed
Function verified: 0   // Grep failed
Past success: 0        // No history
Clear requirements: 0  // "Update auth" is vague
Total: 0%

// Decision
0% < 70% (backend ask threshold)
→ ASK_USER

await AskUserQuestion({
  question: 'I couldn\'t find src/services/auth.ts or validateJWT. Where is the auth logic?',
  // ...
});
```

### Example 2: Medium Confidence → HEDGE

```typescript
// Claim
{
  filePath: 'src/services/auth.ts',  // ✅ Verified
  functionName: 'validateJWT',       // ❌ Not found
  description: 'Update JWT validation to use RS256',
  domain: 'backend'
}

// Scoring
File verified: 30       // ✅ Glob found it
Function verified: 0    // ❌ Grep failed
Past success: 15        // Detailed description
Clear requirements: 20  // "use RS256" is specific
Total: 65%

// Decision
70% ask threshold < 75% < 90% proceed threshold
→ PROCEED_WITH_HEDGING

"Let me check if validateJWT exists in auth.ts..."
// Then Grep to verify
```

### Example 3: High Confidence → PROCEED

```typescript
// Claim
{
  filePath: 'src/services/auth.ts',  // ✅ Verified
  functionName: 'validateJWT',       // ✅ Verified
  description: 'Update validateJWT to use RS256 algorithm instead of HS256',
  requirements: ['Must support RS256', 'Backward compatible'],
  domain: 'backend'
}

// Scoring
File verified: 30       // ✅ Glob found it
Function verified: 25   // ✅ Grep found it
Past success: 15        // Detailed description
Clear requirements: 20  // Has specific requirements
Total: 90%

// Decision
90% ≥ 90% (backend proceed threshold)
→ PROCEED_CONFIDENTLY

"I'll update the validateJWT() function in src/services/auth.ts to use RS256 algorithm."
```

---

## Confidence Calibration

**Measure if confidence matches reality:**

```typescript
// After 100 tasks
const calibration = {
  claimed80percent: [task1, task2, ...],  // All tasks where I was 80% confident
  actualSuccessRate: 0.75                 // Only 75% actually succeeded
};

const calibrationError = Math.abs(0.80 - 0.75);  // 5% error
// Target: <5% calibration error
```

**If calibration is off:**
- Confidence > Actual Success: I'm overconfident → Increase ask threshold
- Confidence < Actual Success: I'm underconfident → Decrease ask threshold

---

## Tuning Thresholds

**Adjust based on measured hallucination rate:**

```typescript
// If hallucination rate is still high (>1%)
// → Increase ask thresholds (be more conservative)

const DOMAIN_THRESHOLDS = {
  frontend: { ask: 70, proceed: 90 },  // Was 65/85, now stricter
  backend: { ask: 75, proceed: 92 },   // Was 70/90
  // ...
};

// If asking too many questions (user frustrated)
// → Decrease ask thresholds (be less cautious)
```

---

## Summary

**Decision Matrix:**

| Confidence | Frontend | Backend | Database/Security | Action |
|------------|----------|---------|-------------------|--------|
| 0-64% | ASK | ASK | ASK | Ask user |
| 65-69% | HEDGE | ASK | ASK | Hedge or ask |
| 70-74% | HEDGE | HEDGE | ASK | Hedge or ask |
| 75-84% | HEDGE | HEDGE | HEDGE | Use hedging language |
| 85-89% | PROCEED | HEDGE | HEDGE | Proceed or hedge |
| 90-91% | PROCEED | PROCEED | HEDGE | Proceed or hedge |
| 92-100% | PROCEED | PROCEED | PROCEED | Proceed confidently |

---

**Next**: See [examples.md](examples.md) for real hallucination cases and prevention
