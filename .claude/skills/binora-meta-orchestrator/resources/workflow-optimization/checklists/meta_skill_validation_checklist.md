# Meta-Skill Validation Checklist

**Quality assurance checklist for claude-code-performance-optimizer 5-phase workflow.**

---

## Critical (Must Pass Every Request)

**ALWAYS execute these 5 phases in order:**

- [ ] **Phase 1 executed**: Prompt quality scored 0-100?
- [ ] **Phase 2 executed**: Task type classified (bug/feature/refactor/question)?
- [ ] **Phase 3 executed**: Relevant skills suggested?
- [ ] **Phase 4 executed**: Token budget checked (<75% safe, >75% alert)?
- [ ] **Phase 5 executed**: Quality gates validated?

**If ANY critical item is NO**: Meta-skill orchestration is incomplete. Review SKILL.md 5-Phase Orchestration Workflow.

---

## High Priority

**Apply these optimizations when applicable:**

- [ ] **Prompt enhanced** if score <70?
- [ ] **Parallel tool execution** used when possible?
- [ ] **Context7 MCP** preferred over WebSearch for official docs?
- [ ] **Self-validation** applied for complex/critical answers?
- [ ] **Circuit breaker state** determined (CLOSED/HALF-OPEN/OPEN)?

**If 2+ items are NO**: Workflow optimization opportunities missed. Review Phase 4 (Tool Optimization).

---

## Best Practices

**Additional quality checks:**

- [ ] **Confidence scored** 0-100 for answers?
- [ ] **Time savings** calculated and reported?
- [ ] **References** to detailed patterns provided (resources/*.md)?
- [ ] **Agent delegation** evaluated (complexity threshold)?
- [ ] **Knowledge base** checked (AI_BUGS_KNOWLEDGE.md, AI_PRODUCT_DECISIONS.md)?

**If 3+ items are NO**: Quality assurance could be improved. Review Phase 5 (Quality Assurance).

---

## Usage

**When to Use This Checklist:**

1. **After completing any request** - Self-assess 5-phase execution
2. **When confidence <70%** - Identify what was missed
3. **During debugging** - Trace which phase failed
4. **For training** - Learn meta-skill orchestration pattern

**How to Score:**

- **Critical: 5/5** = Excellent (meta-skill working correctly)
- **Critical: 3-4/5** = Good (minor gaps, review SKILL.md)
- **Critical: 0-2/5** = Poor (meta-skill not executing, troubleshoot)

**Combined Score Formula:**
```
Total Score = (Critical × 3) + (High Priority × 2) + (Best Practices × 1)
Perfect Score = (5 × 3) + (5 × 2) + (5 × 1) = 30 points

Excellent: 25-30 points
Good: 20-24 points
Fair: 15-19 points
Poor: <15 points
```

---

**Last Updated**: 2025-10-28
**Referenced From**: claude-code-performance-optimizer/SKILL.md
**Purpose**: Quality assurance for 5-phase meta-skill orchestration
