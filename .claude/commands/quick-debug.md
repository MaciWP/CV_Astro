# Quick Debug Session

Fast debugging workflow for Poneglyph System issues:

**Instructions**: User provides error message or describes bug

1. **Understand the Error**:
   - Parse error message/stack trace
   - Identify error type (WebSocket, Vue, TypeScript, Bun, PostgreSQL, Redis)
   - Locate exact file and line number

2. **Context Gathering**:
   - Read surrounding code (50 lines before/after)
   - Check related components/services
   - Review recent changes (if git available)

3. **Root Cause Analysis**:
   - Identify the actual cause (not just symptoms)
   - Check for common patterns:
     - WebSocket: reconnection loops, backoff strategy, disconnect handling
     - Vue: reactivity issues, computed vs ref, lifecycle hooks
     - TypeScript: type mismatches, strict mode violations, Zod validation
     - Bun: runtime compatibility, WebSocket API differences
     - PostgreSQL: query performance, index usage, connection pooling
     - Redis: caching strategy, TTL, key expiration

4. **Solution Proposal**:
   - Provide 2-3 possible fixes
   - Explain trade-offs of each approach
   - Recommend best solution with rationale

5. **Implementation**:
   - Show exact code changes needed
   - Include before/after code snippets
   - Add logging for future debugging

6. **Verification**:
   - Suggest test cases to verify fix
   - Check if similar issues exist elsewhere
   - Recommend preventive measures

Output: Step-by-step debug report with executable fixes
