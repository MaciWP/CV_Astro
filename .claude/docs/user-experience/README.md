# User Experience - Developer Interaction Patterns

**Goal**: Excellent developer experience through clear communication and respectful boundaries.

**Target**: 4.5/5 user satisfaction, zero unwanted documentation

**Based on**: Expert consensus 2024-2025, CLI best practices, real user feedback

---

## 🏆 GOLDEN RULE (CRITICAL)

**NEVER auto-generate documentation unless the user EXPLICITLY asks for it.**

```typescript
// ❌ NEVER DO THIS (Proactive documentation)
User: "I added a new function validateUser()"
Claude: "Great! I'll update the README.md to document this..."
// ↑ WRONG - User didn't ask for README update

// ❌ NEVER DO THIS (Auto-commenting)
User: "Create a function to calculate tax"
Claude: [Creates function with extensive JSDoc comments]
/**
 * Calculates tax based on subtotal
 * @param {number} subtotal - The subtotal amount
 * @returns {number} The calculated tax amount
 * @example
 * const tax = calculateTax(100); // Returns 8
 */
// ↑ WRONG - User didn't ask for comments

// ✅ DO THIS (Only when explicitly requested)
User: "Create a function to calculate tax and document it with JSDoc"
Claude: [Creates function WITH JSDoc comments]
// ↑ CORRECT - User explicitly asked for documentation

// ✅ DO THIS (Never assume)
User: "I added a new feature"
Claude: "Feature implemented. Would you like me to update the README?"
// ↑ CORRECT - ASK, don't assume
```

---

## Why This Rule Exists

**Problem**: AI tools in 2024 have a strong tendency to over-document everything.

**Evidence from experts**:
- "Too much information can dilute key points" (Developer UX research 2024)
- "Unnecessary comments describing obvious method signatures" (Clean Code patterns)
- "Using generative AI for public-facing documentation isn't recommended" (AI tooling research)

**User feedback**:
- "La IA suele querer documentar todo y es contraproducente" (AI usually wants to document everything and it's counterproductive)
- Over-documentation creates noise, not clarity
- Developers know when they need docs - let them ask

**Impact**:
- ❌ Auto-documentation → Annoyance, distraction, maintenance burden
- ✅ On-demand documentation → Helpful, targeted, actually used

---

## Core UX Rules

### Rule 1: Golden Rule (No Auto-Documentation)

**NEVER create these without explicit user request**:
- ❌ README.md files
- ❌ API documentation
- ❌ Code comments (JSDoc, Python docstrings, etc.)
- ❌ Architecture diagrams
- ❌ Usage examples
- ❌ Changelog entries
- ❌ Contributing guides

**ONLY create documentation when user says**:
- ✅ "Document this function"
- ✅ "Add JSDoc comments"
- ✅ "Update the README"
- ✅ "Write API docs"
- ✅ "Create usage examples"

**Detection keywords** (explicit request):
- "document", "add comments", "write docs", "update README", "create examples"

**Without these keywords** → Don't document (even if you think it would help)

---

### Rule 2: Clear, Actionable Error Messages

**Provide specific, actionable error messages with context.**

See: [error-messages.md](./error-messages.md)

Key principles:
- Include file path and line number (file:line format)
- Explain what's wrong specifically
- Suggest how to fix it
- Avoid vague messages like "build failed" or "something went wrong"

---

### Rule 3: Progress Indicators for Long Operations

**Show progress during operations that take >5 seconds.**

See: [progress-indicators.md](./progress-indicators.md)

Key principles:
- Use TodoWrite for multi-step tasks
- Update status in real-time (mark as in_progress, completed)
- Show current step and total steps when possible
- Inform user when background operations are running

---

## Quick Reference

**Documentation** (Rule 1 - Golden Rule):
- Default: NO documentation
- Exception: User explicitly asks
- When unsure: ASK ("Would you like me to document this?")

**Error Messages** (Rule 2):
- Format: `file:line - Specific error - How to fix`
- Example: `src/auth.ts:42 - Property 'email' does not exist on type 'User' - Add 'email: string' to User interface`

**Progress** (Rule 3):
- Use TodoWrite for tasks with 3+ steps
- Mark as in_progress, completed in real-time
- Never batch completions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Auto-documentation rate** | 0% | Never create docs without request |
| **Error message clarity** | 4.5/5 | User can fix without asking |
| **Progress visibility** | 100% | All multi-step tasks tracked |
| **User satisfaction** | 4.5/5 | Overall UX rating |

---

## Related Commands

- `/load-anti-hallucination` - Validation patterns (avoid claiming non-existent files/functions)
- `/load-context-management` - Token optimization (file:line references, not full content)
- `/load-testing-strategy` - Test generation patterns
- `/load-refactoring-patterns` - Code quality improvement

---

**Version**: 1.0.0
**Module**: 14-USER-EXPERIENCE (Opción B - Core Recommendations)
**Documentation Size**: ~25 KB (3 files)
**Based on**: Expert consensus 2024-2025, real user feedback, CLI best practices
**Target**: 4.5/5 satisfaction, 0% unwanted documentation
**Status**: Ready to load
