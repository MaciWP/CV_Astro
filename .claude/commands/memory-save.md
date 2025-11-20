# /memory-save - Manually Save Memory

Force save a specific piece of information to persistent memory.

---

## Usage

```
/memory-save <type> "<content>"
```

**Parameters**:
- `<type>`: decision | bug_fix | preference | pattern | lesson
- `<content>`: The information to remember (in quotes)

---

## Examples

### Save a Decision
```
/memory-save decision "Using Redis for session storage because it's fast and supports TTL"
```

### Save a Bug Fix
```
/memory-save bug_fix "Fixed N+1 query in user profile by adding JOIN. Was fetching posts individually."
```

### Save a Preference
```
/memory-save preference "Always use async/await over .then() chains for better readability"
```

### Save a Pattern
```
/memory-save pattern "For API error handling: try-catch with logging + return { success, error }"
```

---

## What This Command Does

1. Creates a new memory with specified type and content
2. Auto-extracts tags from content (database, authentication, etc.)
3. Sets confidence to 1.0 (user-provided = trusted)
4. Saves to memory MCP + markdown file
5. Confirms save with memory ID

---

## Example Output

```
✅ Memory saved successfully!

ID: mem_042
Type: decision
Tags: cache, session, Redis
Confidence: 1.0
Created: 2025-11-17T10:30:00Z

You can view all memories with /memory-show
```

---

## When to Use

**Use this command when**:
- Auto-detect missed something important
- You want to explicitly remember a decision
- Recording a complex bug fix for future reference
- Documenting a successful pattern

**Auto-detect handles most cases** - you rarely need this command.

---

## Implementation

When you execute `/memory-save decision "..."`:

1. Parse command arguments (type + content)
2. Validate type (must be valid MemoryType)
3. Create Memory object:
   ```typescript
   {
     id: generateId(),
     type: 'decision',
     content: "Using Redis for session storage...",
     tags: extractTags(content),  // ['cache', 'session', 'Redis']
     created: new Date().toISOString(),
     project: getCurrentProject(),
     confidence: 1.0,  // User-provided
     archived: false
   }
   ```
4. Save to memory MCP
5. Append to .claude/memory/MEMORY.md
6. Return confirmation

---

**Command Type**: Write
**MCP Server**: memory
**Related**: /memory-show, /memory-search
