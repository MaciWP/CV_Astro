---
description: Load developer UX patterns for clear communication and respectful boundaries
---

# Load User Experience Patterns

Load comprehensive UX documentation for excellent developer interaction.

## Usage

```
/load-user-experience
```

---

## What This Command Does

Loads **developer UX patterns** into context:

1. **README.md** (4.5 KB) - Overview, Golden Rule (no auto-documentation), core rules
2. **error-messages.md** (9.2 KB) - Clear, actionable error patterns (file:line + fix)
3. **progress-indicators.md** (11.8 KB) - TodoWrite best practices, when to show progress

**Total**: ~25 KB of UX patterns and communication guidelines

---

## When to Use

Load UX patterns when:

### Communication Issues
- Error messages are vague ("build failed" vs specific errors)
- User doesn't know what's happening (no progress indicators)
- File/function claims without validation (anti-hallucination)

### Documentation Tasks
- User asks about documentation policy
- Clarifying when to create docs (explicit request only)
- Understanding show vs save distinction

### Multi-Step Tasks
- Tasks with 3+ steps need TodoWrite
- Long operations (>5s) need progress visibility
- Background processes need notification

---

## What You'll Learn

### 1. Golden Rule (CRITICAL)

**NEVER auto-generate documentation unless user EXPLICITLY asks.**

```typescript
// ❌ NEVER: Auto-save documentation
User: "I added a new function"
Claude: "I'll update the README.md..."  // WRONG - not requested

// ✅ ALWAYS: Show on screen, don't save
User: "I added a new function"
Claude: "Function added successfully. [Shows details on screen]"  // OK - just showing

// ✅ ALWAYS: Only save when explicit
User: "Document this function in README"
Claude: "I'll update README.md..."  // OK - explicitly requested
```

**Distinction**:
- ✅ Show results on screen (explanations, analysis, summaries)
- ❌ Save to files (README.md, comments, .md) unless explicit

**Code documentation follows project conventions** (YOLO = minimal docs).

---

### 2. Clear, Actionable Error Messages

**Always include location and suggested fix:**

```typescript
// ❌ BAD: Vague
"Build failed"

// ✅ GOOD: Specific + actionable
"src/auth.ts:42 - Property 'email' does not exist on type 'User' - Add 'email: string' to User interface"
```

**Format**: `file:line - Error - Suggested fix`

**Tools**: Use Glob (validate file exists) + Grep (validate function exists) BEFORE claiming.

---

### 3. Progress Indicators

**Use TodoWrite for tasks with 3+ steps:**

```typescript
TodoWrite({
  todos: [
    { content: "Create User model", status: "in_progress", activeForm: "Creating User model" },
    { content: "Create auth endpoints", status: "pending", activeForm: "Creating auth endpoints" },
    { content: "Write tests", status: "pending", activeForm: "Writing tests" }
  ]
});
```

**Best practices**:
- Mark completed IMMEDIATELY (not batched)
- Exactly 1 task in_progress at a time
- Update in real-time as you work

---

## Execute Reads

This command will load all UX documentation:

```typescript
// 1. Read overview + Golden Rule
await Read({ file_path: '.claude/docs/user-experience/README.md' });

// 2. Read error message patterns
await Read({ file_path: '.claude/docs/user-experience/error-messages.md' });

// 3. Read progress indicator patterns
await Read({ file_path: '.claude/docs/user-experience/progress-indicators.md' });
```

---

## Success Metrics (Expert Standards)

| Metric | Threshold | Source |
|--------|-----------|--------|
| **Auto-documentation rate** | 0% | Never save docs without request |
| **Error message clarity** | 4.5/5 | User can fix without asking |
| **Progress visibility** | 100% | All 3+ step tasks tracked |
| **User satisfaction** | 4.5/5 | Overall UX rating |

---

## Quick Start

**After loading, follow this workflow:**

1. **Golden Rule (Documentation)**:
   - ✅ Show results on screen (explanations, analysis)
   - ❌ Save to files (README, comments) unless explicit
   - Follow project conventions (YOLO = minimal docs)

2. **Error Messages**:
   - Always include file:line
   - Always suggest fix
   - Validate with Glob/Grep first (anti-hallucination)

3. **Progress Indicators**:
   - Use TodoWrite for 3+ steps
   - Update in real-time (not batched)
   - Mark completed immediately

4. **Integration**:
   - Module 03 (Anti-Hallucination): Validate before claiming
   - Module 17 (Refactoring): Show progress when refactoring
   - Module 18 (Testing): Show progress when generating tests

---

## Related Commands

- `/load-anti-hallucination` - Validation patterns (verify files/functions exist)
- `/load-context-management` - Token optimization (file:line references)
- `/load-testing-strategy` - Test generation patterns
- `/load-refactoring-patterns` - Code quality improvement

---

**Version**: 1.0.0
**Module**: 14-USER-EXPERIENCE (Opción B - Core Recommendations)
**Documentation Size**: ~25 KB (3 files)
**Based on**: Expert consensus 2024-2025, real user feedback, CLI best practices
**Target**: 4.5/5 satisfaction, 0% unwanted documentation
**Status**: Ready to load
