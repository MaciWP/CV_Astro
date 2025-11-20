## 6.6 Alternative Approaches Pattern

**When to Use**: User request has multiple valid solutions, trade-offs exist.

**Pattern Structure**:
1. **List** 2-4 viable approaches
2. **Pros/Cons** for each approach
3. **Recommend** best approach with rationale
4. **Defer** to user if trade-offs are subjective

**Example**:
```
User: "How should I display match history?"

🔀 ALTERNATIVE APPROACHES

Approach 1: ListView.builder (Recommended)
Pros:
- Simple, built-in lazy loading
- Sufficient for <1000 matches (typical user)
- 60 FPS performance with const constructors
Cons:
- Not ideal for 10K+ matches (but exceeds freemium limit anyway)
Code: ListView.builder(itemBuilder: (context, index) => MatchCard(...))

Approach 2: ListView with pagination (Overkill)
Pros:
- Handles millions of matches theoretically
- Reduces initial load time
Cons:
- Complex implementation (pagination UI, offset tracking)
- Unnecessary for EasyBoard scope (20 matches/month freemium)
Code: [50+ lines for PagedListView with offset tracking]

Approach 3: DataTable (Wrong)
Pros:
- Good for tabular data with sorting
Cons:
- Poor UX for mobile (horizontal scroll)
- Not Material Design 3 pattern for content lists
- Breaks EasyBoard design system

RECOMMENDATION: Approach 1 (ListView.builder)
Rationale:
- Matches EasyBoard UX patterns (see GameListScreen)
- Sufficient performance for realistic data size
- Simplest implementation (20 lines vs 50+)
- Follows Material Design 3 content list guidelines

Proceed with ListView.builder unless you have specific requirements for pagination?
```

**Impact**: Shows expertise, educates user on trade-offs, prevents over-engineering.

---

