## 6.3 Quote Grounding Pattern

**When to Use**: Answering questions about code, documentation, or project-specific details.

**Pattern Structure**:
1. **Quote** exact text from authoritative source
2. **Cite** source (file path + line number)
3. **Interpret** quote in context of request
4. **Apply** to user's situation

**Example - BEFORE**:
```
User: "What's the freemium limit?"
Assistant: "I think it's around 20 matches."
```

**Example - AFTER (Quote Grounding)**:
```
User: "What's the freemium limit?"
Assistant:
📚 QUOTE GROUNDING

Source: CLAUDE.md:201
> **Free**: 20 matches/month, 3 games → **IMPORTANT**: ALWAYS check `FreemiumService.canSaveMatch()`

Interpretation:
- Freemium users limited to 20 matches total per month
- Maximum 3 different games can be tracked
- CRITICAL: All match save operations MUST call FreemiumService.canSaveMatch() before proceeding

Application to your code:
Before saving match in NewMatchScreen.onSave():
```dart
final canSave = await ref.read(freemiumServiceProvider).canSaveMatch();
if (!canSave) {
  // Show paywall
  context.push('/paywall');
  return;
}
// Proceed with save
```

**Impact**: Eliminates hallucinations, grounds answers in project facts.

---

