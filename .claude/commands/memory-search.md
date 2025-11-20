# /memory-search - Search Persistent Memories

Search for specific memories using keyword matching.

---

## Usage

```
/memory-search "<query>"
```

**Optional**: Filter by type
```
/memory-search "<query>" --type=<type>
```

---

## Examples

### Search All Memories
```
/memory-search "authentication"
```
Returns all memories mentioning authentication.

### Search Specific Type
```
/memory-search "WebSocket" --type=bug_fix
```
Returns only bug fixes related to WebSocket.

### Search by Technology
```
/memory-search "PostgreSQL"
```
Returns decisions, patterns, bugs related to PostgreSQL.

---

## What This Command Does

1. Searches memory MCP using query string
2. Optionally filters by memory type
3. Ranks by relevance (keyword match + recency)
4. Returns top 10 matches
5. Displays with context and metadata

---

## Example Output

```markdown
# Search Results for "authentication"

Found 5 memories (showing top 5):

---

## 1. Decision: Implement JWT Authentication (95% relevance)
**ID**: mem_002 | **Date**: 2025-11-16 | **Tags**: authentication, security

Decision: Use JWT tokens for stateless authentication
Rationale: Scalable, no server-side session storage required
Alternatives: Session-based (rejected - requires state)

---

## 2. Bug Fix: JWT Token Expiration (87% relevance)
**ID**: mem_018 | **Date**: 2025-11-15 | **Tags**: authentication, debugging

Error: Users logged out unexpectedly
Root Cause: JWT expiration set to 5 min (too short)
Solution: Increased to 1 hour + refresh token implementation

---

## 3. Pattern: Authentication Middleware (82% relevance)
**ID**: mem_012 | **Date**: 2025-11-10 | **Tags**: pattern, authentication

Pattern: Verify JWT in middleware before route handlers
Code: `app.use(verifyJWT)` on protected routes
Error handling: Return 401 with { error: 'Unauthorized' }

---

## 4. Preference: Password Hashing (76% relevance)
**ID**: mem_007 | **Date**: 2025-11-05 | **Tags**: security, authentication

Always use bcrypt with salt rounds ≥ 12
Never store passwords in plain text
Use argon2 for higher security requirements

---

## 5. Lesson: OAuth Integration (71% relevance)
**ID**: mem_024 | **Date**: 2025-11-01 | **Tags**: authentication, oauth

OAuth2 flow requires PKCE for security
Store state parameter to prevent CSRF
Handle token refresh before expiration

---

No more results. Try a different query or broaden your search.
```

---

## Relevance Scoring

Memories are ranked by **hybrid score**:

```
relevance = keyword_match * 0.75 + recency * 0.25
```

**Keyword Match** (0-1):
- Exact word matches in content
- Tag matches (weighted higher)
- Jaccard similarity

**Recency** (0-1):
- Last 7 days: 1.0
- Last 30 days: 0.75
- Last 90 days: 0.50
- Older: 0.25

---

## When to Use

**Use this command when**:
- "How did we fix that bug last month?"
- "What was the decision about caching?"
- "Show me all PostgreSQL-related memories"
- "Find patterns we used for error handling"

---

## Implementation

When you execute `/memory-search "auth"`:

1. Search memory MCP with query
2. Filter by type if `--type` specified
3. Calculate relevance score for each result:
   ```typescript
   const keywordMatch = calculateTextSimilarity(query, memory.content);
   const recency = calculateRecency(memory.created);
   const relevance = keywordMatch * 0.75 + recency * 0.25;
   ```
4. Sort by relevance (descending)
5. Return top 10
6. Format and display

---

**Command Type**: Read-only
**MCP Server**: memory
**Search Method**: Hybrid (keyword + recency)
**Max Results**: 10
**Related**: /memory-show, /memory-save
