# Progress Indicators - Visibility for Long Operations

**Goal**: Keep users informed during multi-step tasks and long operations.

**Target**: 100% progress visibility for tasks with 3+ steps or >5s duration

**Based on**: TodoWrite tool capabilities, UX best practices

---

## Core Principle

**Show progress in real-time so users know:**
- What you're doing RIGHT NOW
- How many steps remain
- If something is stuck or taking longer than expected

**Don't make users wonder**: "Is Claude still working? Did it freeze? How much longer?"

---

## When to Use Progress Indicators

### 1. Multi-Step Tasks (3+ steps)

**Use TodoWrite for ANY task with 3 or more distinct steps:**

```typescript
// ✅ GOOD: Multi-step task with progress tracking
User: "Add authentication to the backend"

TodoWrite({
  todos: [
    { content: "Create User model with password hashing", status: "in_progress", activeForm: "Creating User model" },
    { content: "Implement JWT token generation", status: "pending", activeForm: "Implementing JWT tokens" },
    { content: "Create login/register endpoints", status: "pending", activeForm: "Creating auth endpoints" },
    { content: "Add authentication middleware", status: "pending", activeForm: "Adding auth middleware" },
    { content: "Write tests for auth flow", status: "pending", activeForm: "Writing auth tests" }
  ]
});

// User sees:
// [●] Creating User model
// [ ] Implementing JWT tokens
// [ ] Creating auth endpoints
// [ ] Adding auth middleware
// [ ] Writing auth tests
```

**Why**: Users can track progress (step 1/5, 2/5, etc.) and know what's happening.

---

### 2. Long Operations (>5 seconds)

**For operations that take >5 seconds, inform the user:**

```typescript
// ✅ GOOD: Long build operation
"Running build process... (this may take 30-60 seconds)"
Bash({ command: 'npm run build', timeout: 120000 });

// ✅ GOOD: Background process with progress
"Running tests in background..."
const testProcess = Bash({
  command: 'npm test',
  run_in_background: true
});

// Check progress periodically
"Tests still running... (checking results)"
const output = await BashOutput({ bash_id: testProcess.id });
```

**Why**: Users know the operation is running and isn't frozen.

---

### 3. Background Processes

**Always inform users when using background Bash:**

```typescript
// ✅ GOOD: Background build with notification
"Starting build in background... (you can continue working)"
const build = Bash({
  command: 'npm run build',
  run_in_background: true
});

// Later...
"Build completed successfully in 45 seconds"
```

**Why**: Users need to know something is running in the background.

---

## When NOT to Use Progress Indicators

### Simple Tasks (<3 steps, <5s)

```typescript
// ❌ OVERKILL: Simple one-step task
User: "Read the auth.ts file"
TodoWrite({
  todos: [
    { content: "Read auth.ts", status: "in_progress", activeForm: "Reading auth.ts" }
  ]
});
// ↑ TOO MUCH - Just read the file directly

// ✅ GOOD: Direct execution
Read({ file_path: 'src/auth.ts' });
// No TodoWrite needed for single, fast operation
```

**When to skip TodoWrite**:
- Single file read/write (<5s)
- Single Grep/Glob search
- Simple Edit operation
- Quick Bash command (<5s)

---

## TodoWrite Best Practices

### 1. Use Descriptive Task Names

```typescript
// ❌ BAD: Vague task names
{ content: "Step 1", status: "in_progress", activeForm: "Working on step 1" }
{ content: "Do something", status: "pending", activeForm: "Doing something" }

// ✅ GOOD: Clear, specific task names
{ content: "Create User model with bcrypt password hashing", status: "in_progress", activeForm: "Creating User model" }
{ content: "Implement JWT token generation (access + refresh)", status: "pending", activeForm: "Implementing JWT tokens" }
```

**Why**: Users understand exactly what's happening at each step.

---

### 2. Update Status in Real-Time

```typescript
// ❌ BAD: Batch updates (user sees no progress)
// Work on all 5 tasks...
// Then update all at once:
TodoWrite({ todos: [...all tasks marked completed...] });

// ✅ GOOD: Update after each step
// Step 1
TodoWrite({ todos: [task1: completed, task2: in_progress, ...] });
// Step 2
TodoWrite({ todos: [task1: completed, task2: completed, task3: in_progress, ...] });
// Step 3
TodoWrite({ todos: [task1: completed, task2: completed, task3: completed, task4: in_progress, ...] });
```

**Why**: Users see progress happening in real-time, not all at once at the end.

---

### 3. Mark Tasks Completed IMMEDIATELY After Finishing

```typescript
// ❌ BAD: Delay marking completed
// Complete task 1
// Complete task 2
// Complete task 3
// THEN update TodoWrite with all 3 completed

// ✅ GOOD: Mark completed immediately
// Complete task 1
TodoWrite({ todos: [task1: completed, task2: in_progress, ...] });
// Complete task 2
TodoWrite({ todos: [task1: completed, task2: completed, task3: in_progress, ...] });
// Complete task 3
TodoWrite({ todos: [task1: completed, task2: completed, task3: completed] });
```

**Why**: Users see progress as it happens, not in batches.

---

### 4. Exactly ONE Task in_progress at a Time

```typescript
// ❌ BAD: Multiple tasks in_progress
TodoWrite({
  todos: [
    { content: "Create model", status: "in_progress", activeForm: "Creating model" },
    { content: "Create endpoints", status: "in_progress", activeForm: "Creating endpoints" }, // Wrong!
    { content: "Write tests", status: "pending", activeForm: "Writing tests" }
  ]
});

// ✅ GOOD: Exactly 1 task in_progress
TodoWrite({
  todos: [
    { content: "Create model", status: "completed", activeForm: "Creating model" },
    { content: "Create endpoints", status: "in_progress", activeForm: "Creating endpoints" }, // Only this one
    { content: "Write tests", status: "pending", activeForm: "Writing tests" }
  ]
});
```

**Why**: Clarity - users know exactly what you're working on RIGHT NOW.

---

### 5. Use Both `content` and `activeForm`

```typescript
// ❌ BAD: Same text for both (redundant)
{
  content: "Creating User model",
  activeForm: "Creating User model"
}

// ✅ GOOD: content = imperative, activeForm = present continuous
{
  content: "Create User model with password hashing",     // What needs to be done
  activeForm: "Creating User model"                        // What's happening now
}

{
  content: "Run tests and verify all pass",
  activeForm: "Running tests"
}
```

**Why**: Clear distinction between the task description and current action.

---

## Real-World Examples

### Example 1: Feature Implementation

```typescript
User: "Implement user registration with email verification"

// Initial plan
TodoWrite({
  todos: [
    { content: "Create User model (email, password, verified fields)", status: "in_progress", activeForm: "Creating User model" },
    { content: "Implement password hashing with bcrypt", status: "pending", activeForm: "Implementing password hashing" },
    { content: "Create verification token system", status: "pending", activeForm: "Creating verification tokens" },
    { content: "Build /register endpoint", status: "pending", activeForm: "Building register endpoint" },
    { content: "Add email sending service", status: "pending", activeForm: "Adding email service" },
    { content: "Write integration tests", status: "pending", activeForm: "Writing tests" }
  ]
});

// After completing step 1
TodoWrite({
  todos: [
    { content: "Create User model (email, password, verified fields)", status: "completed", activeForm: "Creating User model" },
    { content: "Implement password hashing with bcrypt", status: "in_progress", activeForm: "Implementing password hashing" },
    { content: "Create verification token system", status: "pending", activeForm: "Creating verification tokens" },
    { content: "Build /register endpoint", status: "pending", activeForm: "Building register endpoint" },
    { content: "Add email sending service", status: "pending", activeForm: "Adding email service" },
    { content: "Write integration tests", status: "pending", activeForm: "Writing tests" }
  ]
});

// ... continue updating after each step
```

---

### Example 2: Bug Fix with Investigation

```typescript
User: "Fix the login timeout issue"

// Initial investigation todos
TodoWrite({
  todos: [
    { content: "Reproduce login timeout bug", status: "in_progress", activeForm: "Reproducing bug" },
    { content: "Investigate auth service logs", status: "pending", activeForm: "Investigating logs" },
    { content: "Identify root cause", status: "pending", activeForm: "Identifying root cause" },
    { content: "Implement fix", status: "pending", activeForm: "Implementing fix" },
    { content: "Verify fix resolves timeout", status: "pending", activeForm: "Verifying fix" }
  ]
});

// After finding root cause
TodoWrite({
  todos: [
    { content: "Reproduce login timeout bug", status: "completed", activeForm: "Reproducing bug" },
    { content: "Investigate auth service logs", status: "completed", activeForm: "Investigating logs" },
    { content: "Identify root cause", status: "completed", activeForm: "Identifying root cause" },
    { content: "Implement fix (increase JWT timeout from 15m to 1h)", status: "in_progress", activeForm: "Implementing fix" },
    { content: "Verify fix resolves timeout", status: "pending", activeForm: "Verifying fix" }
  ]
});
```

---

### Example 3: Refactoring

```typescript
User: "Refactor the checkout process to reduce complexity"

TodoWrite({
  todos: [
    { content: "Analyze current checkout complexity (CC, length)", status: "in_progress", activeForm: "Analyzing complexity" },
    { content: "Identify code smells (long method, duplication)", status: "pending", activeForm: "Identifying code smells" },
    { content: "Extract validation logic to separate function", status: "pending", activeForm: "Extracting validation" },
    { content: "Extract payment processing to separate function", status: "pending", activeForm: "Extracting payment logic" },
    { content: "Run tests to verify behavior preserved", status: "pending", activeForm: "Running tests" }
  ]
});

// ... update after each step
```

---

## Integration with Other Modules

### Module 17: REFACTORING-PATTERNS

**Always show progress when refactoring:**

```typescript
// Safe refactoring workflow
TodoWrite({
  todos: [
    { content: "Run tests BEFORE refactoring", status: "in_progress", activeForm: "Running tests" },
    { content: "Extract method from long function", status: "pending", activeForm: "Extracting method" },
    { content: "Run tests AFTER refactoring", status: "pending", activeForm: "Running tests" },
    { content: "Verify tests pass (behavior preserved)", status: "pending", activeForm: "Verifying behavior" }
  ]
});
```

---

### Module 18: TESTING-STRATEGY

**Show progress when generating tests:**

```typescript
TodoWrite({
  todos: [
    { content: "Analyze function signature and behavior", status: "in_progress", activeForm: "Analyzing function" },
    { content: "Generate Given-When-Then test cases", status: "pending", activeForm: "Generating test cases" },
    { content: "Convert test cases to test code", status: "pending", activeForm: "Writing test code" },
    { content: "Run tests and verify >90% pass", status: "pending", activeForm: "Running tests" }
  ]
});
```

---

### Module 11: PARALLELIZATION

**Show when running parallel operations:**

```typescript
// Parallel build, test, lint
TodoWrite({
  todos: [
    { content: "Run build, test, and lint in parallel", status: "in_progress", activeForm: "Running parallel tasks" },
    { content: "Verify all tasks completed successfully", status: "pending", activeForm: "Verifying results" }
  ]
});

// Start parallel tasks
const build = Bash({ command: 'npm run build', run_in_background: true });
const test = Bash({ command: 'npm test', run_in_background: true });
const lint = Bash({ command: 'npm run lint', run_in_background: true });

"Running 3 tasks in parallel (build, test, lint)... estimated 2-3 minutes"

// Check results
const results = await Promise.all([...]);

TodoWrite({
  todos: [
    { content: "Run build, test, and lint in parallel", status: "completed", activeForm: "Running parallel tasks" },
    { content: "Verify all tasks completed successfully", status: "completed", activeForm: "Verifying results" }
  ]
});
```

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Multi-step tasks tracked** | 100% | All tasks with 3+ steps use TodoWrite |
| **Real-time updates** | 100% | Mark completed immediately, not batched |
| **Long operations notified** | 100% | All >5s operations inform user |
| **Background processes visible** | 100% | All background Bash notify user |

---

## Quick Reference

**When to use TodoWrite**:
- ✅ Tasks with 3+ steps
- ✅ Long operations (>5s)
- ✅ Background processes
- ❌ Simple tasks (<3 steps, <5s)

**Best Practices**:
1. Descriptive task names (not "Step 1")
2. Update status in real-time (not batched)
3. Mark completed IMMEDIATELY
4. Exactly 1 task in_progress at a time
5. Use both content (imperative) and activeForm (present continuous)

**Format**:
```typescript
{
  content: "Create User model with password hashing",  // What to do
  status: "in_progress",                              // Current state
  activeForm: "Creating User model"                    // What's happening
}
```

---

**Version**: 1.0.0
**Based on**: TodoWrite tool capabilities, UX best practices
**Target**: 100% visibility for multi-step tasks
