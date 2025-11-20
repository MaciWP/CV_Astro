# Legacy Code Modernization

**Goal**: Update outdated patterns to modern equivalents while preserving behavior.

**Target**: 100% legacy patterns modernized, behavior preserved

**Common Real-World Need**: Modernizing old codebases (ES5 → ES6+, class → hooks, callbacks → async/await)

---

## Common Legacy Patterns

### 1. var → const/let

#### ❌ LEGACY: var (ES5)

```javascript
var name = 'Alice';
var age = 30;

function updateAge() {
  var age = 31; // Different scope (function-scoped)
  console.log(age); // 31
}

updateAge();
console.log(age); // 30 (original age unchanged)
```

**Problems with var**:
- Function-scoped (not block-scoped)
- Can be redeclared
- Hoisted (can use before declaration)
- Confusing behavior

---

#### ✅ MODERN: const/let (ES6+)

```javascript
const name = 'Alice'; // Can't be reassigned
let age = 30;         // Can be reassigned

function updateAge() {
  let age = 31; // Block-scoped
  console.log(age); // 31
}

updateAge();
console.log(age); // 30
```

**Benefits**:
- Block-scoped (clearer)
- const prevents accidental reassignment
- No hoisting confusion
- Better with linters

---

#### Automatic Conversion

```typescript
async function modernizeVarToConstLet(file: string): Promise<ModernizationResult> {
  const code = await readFile(file);

  // Step 1: Detect all var declarations
  const varDeclarations = findAllMatches(code, /var\s+(\w+)\s*=/g);

  for (const varDecl of varDeclarations) {
    const variableName = varDecl.name;

    // Step 2: Analyze if variable is reassigned
    const isReassigned = await isVariableReassigned(code, variableName);

    // Step 3: Replace with const or let
    const replacement = isReassigned ? 'let' : 'const';
    await replaceText(file, varDecl.line, `var ${variableName}`, `${replacement} ${variableName}`);
  }

  // Step 4: Verify tests pass
  await verifyRefactoring();

  return {
    varConverted: varDeclarations.length,
    constUsed: varDeclarations.filter(v => !v.reassigned).length,
    letUsed: varDeclarations.filter(v => v.reassigned).length
  };
}
```

---

### 2. Callbacks → Promises → Async/Await

#### ❌ LEGACY: Callbacks (Pyramid of Doom)

```javascript
function fetchUserData(userId, callback) {
  db.getUser(userId, function(err, user) {
    if (err) return callback(err);

    db.getOrders(user.id, function(err, orders) {
      if (err) return callback(err);

      db.getPayments(user.id, function(err, payments) {
        if (err) return callback(err);

        callback(null, { user, orders, payments });
      });
    });
  });
}

// Usage
fetchUserData(123, function(err, data) {
  if (err) console.error(err);
  else console.log(data);
});
```

**Problems**:
- Hard to read (nested)
- Error handling duplicated
- Can't use try/catch
- Hard to debug

---

#### ✅ MODERN: Async/Await

```javascript
async function fetchUserData(userId) {
  const user = await db.getUser(userId);
  const orders = await db.getOrders(user.id);
  const payments = await db.getPayments(user.id);

  return { user, orders, payments };
}

// Usage
try {
  const data = await fetchUserData(123);
  console.log(data);
} catch (err) {
  console.error(err);
}
```

**Benefits**:
- Linear flow (easier to read)
- Single error handling (try/catch)
- Can use await
- Easier to debug

---

#### Automatic Conversion

```typescript
async function modernizeCallbacksToAsync(file: string): Promise<ModernizationResult> {
  // Step 1: Detect callback-based functions
  const callbackFunctions = await findCallbackPatterns(file);

  for (const func of callbackFunctions) {
    // Step 2: Convert to Promise-based
    const promiseVersion = convertCallbackToPromise(func);

    // Step 3: Replace function
    await replaceFunction(file, func.name, promiseVersion);

    // Step 4: Update all call sites to use await
    const callSites = await findFunctionCalls(func.name);
    for (const callSite of callSites) {
      await addAwait(callSite);
      await ensureAsyncContext(callSite);
    }
  }

  // Step 5: Verify tests pass
  await verifyRefactoring();

  return {
    functionsConverted: callbackFunctions.length,
    callSitesUpdated: callSites.length
  };
}
```

---

### 3. Function Keyword → Arrow Functions

#### ❌ LEGACY: function keyword

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(function(n) {
  return n * 2;
});

const evens = numbers.filter(function(n) {
  return n % 2 === 0;
});
```

---

#### ✅ MODERN: Arrow functions

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);

const evens = numbers.filter(n => n % 2 === 0);
```

**Benefits**:
- Shorter syntax
- Implicit return (for single expressions)
- Lexical `this` binding

---

### 4. React: Class Components → Functional + Hooks

#### ❌ LEGACY: Class Component

```javascript
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => this.setState({ data, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
      <div>
        {data.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  }
}
```

---

#### ✅ MODERN: Functional Component + Hooks

```javascript
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty deps = run once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default Dashboard;
```

**Benefits**:
- Less boilerplate
- Easier to understand
- Better composition
- Hooks are more powerful than lifecycle methods

---

### 5. require() → import/export (ES Modules)

#### ❌ LEGACY: CommonJS (require)

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };

// app.js
const math = require('./math');
const fs = require('fs');

console.log(math.add(2, 3));
```

---

#### ✅ MODERN: ES Modules (import/export)

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// app.js
import { add, subtract } from './math.js';
import fs from 'fs';

console.log(add(2, 3));
```

**Benefits**:
- Static analysis (tree-shaking)
- Clearer syntax
- Standard (not Node-specific)
- Better tooling support

---

### 6. .then() Chains → Async/Await

#### ❌ LEGACY: Promise chains

```javascript
function getUserProfile(userId) {
  return fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(user => {
      return fetch(`/api/orders?userId=${user.id}`)
        .then(res => res.json())
        .then(orders => {
          return { user, orders };
        });
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
}
```

---

#### ✅ MODERN: Async/await

```javascript
async function getUserProfile(userId) {
  try {
    const userRes = await fetch(`/api/users/${userId}`);
    const user = await userRes.json();

    const ordersRes = await fetch(`/api/orders?userId=${user.id}`);
    const orders = await ordersRes.json();

    return { user, orders };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
```

**Benefits**:
- Linear flow
- Single try/catch
- Easier to read
- Easier to debug

---

## Modernization Strategy

### 1. Prioritize by Impact

```typescript
const MODERNIZATION_PRIORITY = [
  { pattern: 'callbacks-to-async', impact: 'high', effort: 'medium' },
  { pattern: 'var-to-const-let', impact: 'medium', effort: 'low' },
  { pattern: 'class-to-hooks', impact: 'high', effort: 'high' },
  { pattern: 'function-to-arrow', impact: 'low', effort: 'low' },
  { pattern: 'require-to-import', impact: 'medium', effort: 'low' }
];
```

---

### 2. Verify Each Change

```typescript
async function modernizeWithVerification(
  file: string,
  pattern: ModernizationPattern
): Promise<boolean> {
  // Step 1: Run tests before
  const testsBefore = await runTests();

  // Step 2: Apply modernization
  await applyModernization(file, pattern);

  // Step 3: Run tests after
  const testsAfter = await runTests();

  // Step 4: Verify
  if (testsAfter.passed !== testsBefore.passed) {
    await rollback();
    console.error(`Modernization broke tests - rolled back`);
    return false;
  }

  return true;
}
```

---

### 3. Modernize Incrementally

```typescript
// DON'T modernize entire codebase at once (risky)
// DO modernize file by file, pattern by pattern

// Good approach:
async function modernizeProject() {
  const files = await getJavaScriptFiles();

  for (const file of files) {
    console.log(`Modernizing ${file}...`);

    // Apply patterns in priority order
    for (const pattern of MODERNIZATION_PRIORITY) {
      const success = await modernizeWithVerification(file, pattern);
      if (!success) {
        console.warn(`Skipped ${pattern.name} for ${file}`);
      }
    }
  }
}
```

---

## Quick Reference

**Priority Order** (impact vs effort):
1. callbacks → async/await (high impact, medium effort)
2. class components → hooks (high impact, high effort)
3. require → import (medium impact, low effort)
4. var → const/let (medium impact, low effort)
5. function → arrow (low impact, low effort)

**Safety**:
- Always run tests before/after
- Modernize one pattern at a time
- Commit after each successful modernization
- Rollback if tests fail

---

**Version**: 1.0.0
**Target**: 100% legacy patterns modernized
**Priority**: Impact-driven (high impact first)
