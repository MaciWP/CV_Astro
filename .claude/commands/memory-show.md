# /memory-show - View All Persistent Memories

Display all active memories stored in the persistent memory system.

---

## Usage

```
/memory-show
```

Shows all memories from the last 90 days, grouped by type.

---

## What This Command Does

1. Retrieves all active (non-archived) memories from memory MCP
2. Groups by type (decision, bug_fix, preference, pattern, lesson)
3. Displays in formatted, readable output
4. Shows metadata (date, tags, confidence)

---

## Example Output

```markdown
# Persistent Memory - Active Memories

## Decisions (3)

### mem_001 - Use PostgreSQL with TimescaleDB
**Date**: 2025-11-15 | **Tags**: database, architecture | **Confidence**: 0.95

Context: Need time-series storage for observability events
Decision: PostgreSQL with TimescaleDB extension
Rationale: Native JSON support, TimescaleDB optimization, already using PostgreSQL

---

### mem_002 - Implement JWT Authentication
**Date**: 2025-11-16 | **Tags**: authentication, security | **Confidence**: 0.88

Decision: Use JWT tokens for stateless authentication
Rationale: Scalable, no server-side session storage required

---

## Bug Fixes (2)

### mem_003 - WebSocket Reconnection Loop
**Date**: 2025-11-14 | **Tags**: debugging, realtime | **Confidence**: 0.92

Error: WebSocket keeps reconnecting in infinite loop
Root Cause: No exponential backoff, retries too fast
Solution: Added exponential backoff (1s, 2s, 4s, 8s, max 30s)

---

## Preferences (1)

### mem_004 - Code Style Preferences
**Date**: 2025-11-10 | **Tags**: code-style | **Confidence**: 1.0

- Indentation: 2 spaces
- Quotes: Single quotes for strings
- Naming: camelCase for variables, PascalCase for components
- Always use const over let when possible

---

## Patterns (1)

### mem_005 - Error Handling Pattern
**Date**: 2025-11-12 | **Tags**: pattern, error-handling | **Confidence**: 0.85

Pattern: try-catch with structured logging
Always log error context (user, action, timestamp)
Use error codes for client classification
```

---

## Implementation

When you execute `/memory-show`, Claude will:

1. Search memory MCP for all memories in current project
2. Filter out archived memories (>90 days old)
3. Sort by date (newest first)
4. Group by memory type
5. Format and display

---

**Command Type**: Read-only
**MCP Server**: memory
**Related**: /memory-search, /memory-save
