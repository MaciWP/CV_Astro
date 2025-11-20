# Performance Optimization Checklist

Comprehensive checklist for ensuring maximum Claude Code performance (3-5x speedup, 40+ hours saved/month).

**Version**: 1.0.0
**Last Updated**: 2025-10-20
**Target Score**: 40+/50 points (80%+)

---

## How to Use This Checklist

1. **Before starting work**: Review relevant sections
2. **During work**: Apply techniques proactively
3. **After completing task**: Score yourself (0-50 points)
4. **Monthly review**: Track improvements over time

**Scoring**:
- 40-50 points (80-100%): Excellent, elite performance
- 30-39 points (60-79%): Good, room for improvement
- 20-29 points (40-59%): Needs work, review guides
- <20 points (<40%): Critical, requires training

---

## Section 1: Tool Execution Strategy (10 points)

### 1.1 Parallel Execution (3 points)

**Question**: Are tool calls executed in parallel when independent?

- [ ] **3 pts**: Always execute 3+ independent operations in parallel (single message)
- [ ] **2 pts**: Sometimes execute operations in parallel (50-75% of opportunities)
- [ ] **1 pt**: Rarely execute in parallel (<50% of opportunities)
- [ ] **0 pts**: Never use parallel execution (always sequential)

**How to check**:
- Look at last 5 multi-file operations
- Count how many used parallel execution
- Calculate percentage

**Target**: 100% of independent operations in parallel

---

### 1.2 Specialized Tools vs Bash (2 points)

**Question**: Do you use specialized tools (Read/Grep/Glob) instead of Bash for file operations?

- [ ] **2 pts**: Always use specialized tools (>90% of time)
- [ ] **1 pt**: Sometimes use specialized tools (50-90% of time)
- [ ] **0 pts**: Frequently use Bash for file operations (<50%)

**Red flags** (using Bash when specialized tool exists):
- `cat file.txt` → Should use Read
- `grep pattern file` → Should use Grep
- `find . -name "*.dart"` → Should use Glob

**Target**: >90% specialized tool usage

---

### 1.3 MCP Server Usage (3 points)

**Question**: Do you use MCP servers when available?

- [ ] **3 pts**: Consistently use all 4 MCP servers (@context7, @filesystem, @git, @jupyter)
- [ ] **2 pts**: Use 2-3 MCP servers regularly
- [ ] **1 pt**: Use 1 MCP server occasionally
- [ ] **0 pts**: Never use MCP servers

**Check**:
- Documentation lookup → @context7 used?
- Git operations → @git MCP used?
- Python testing → @jupyter used?

**Target**: All 4 MCP servers installed and used regularly

---

### 1.4 File Reading Strategy (2 points)

**Question**: Do you use offset/limit for large files (>500 lines)?

- [ ] **2 pts**: Always use offset/limit for large files (>90%)
- [ ] **1 pt**: Sometimes use offset/limit (50-90%)
- [ ] **0 pts**: Rarely use offset/limit, often read entire large files

**How to check**:
- Review last 10 Read operations
- Count files >500 lines
- Calculate % with offset/limit

**Target**: 90%+ large files read with offset/limit

---

**Section 1 Score**: _____ / 10 points

---

## Section 2: Prompt Quality (10 points)

### 2.1 Structured Prompts (4 points)

**Question**: Do you use XML-structured prompts for complex tasks?

- [ ] **4 pts**: Always use structured prompts (with `<task>`, `<context>`, `<requirements>`)
- [ ] **3 pts**: Often use structured prompts (75-90% of complex tasks)
- [ ] **2 pts**: Sometimes use structured prompts (50-75%)
- [ ] **1 pt**: Rarely use structured prompts (<50%)
- [ ] **0 pts**: Never use structured prompts (free-form only)

**Examples of complex tasks** (require structured prompts):
- Bug fixes
- Feature implementation
- Refactoring
- Code reviews

**Target**: 100% of complex tasks use structured prompts

---

### 2.2 Specificity (3 points)

**Question**: Do prompts include specific file paths, line numbers, and error messages?

- [ ] **3 pts**: Always include (file:line, complete errors, exact metrics)
- [ ] **2 pts**: Usually include (75-90% of time)
- [ ] **1 pt**: Sometimes include (50-75%)
- [ ] **0 pts**: Rarely include (<50%, vague prompts)

**Check recent prompts for**:
- [ ] File paths with line numbers (e.g., `ml_service.dart:145`)
- [ ] Complete error messages (not paraphrased)
- [ ] Quantifiable metrics (e.g., "<100ms" not "fast")
- [ ] Exact version numbers (e.g., "Riverpod 2.4.9")

**Target**: 90%+ prompts have all specificity elements

---

### 2.3 Success Criteria (2 points)

**Question**: Do prompts define measurable success criteria?

- [ ] **2 pts**: Always include verifiable success criteria
- [ ] **1 pt**: Sometimes include success criteria (50-75%)
- [ ] **0 pts**: Rarely include success criteria (<50%)

**Good success criteria examples**:
- flutter analyze reports 0 errors
- Test coverage >80%
- Inference latency <150ms
- All 23 existing tests pass

**Bad examples** (not measurable):
- "Code looks good"
- "Performance is better"
- "Works as expected"

**Target**: 100% of prompts have measurable success criteria

---

### 2.4 Context Completeness (1 point)

**Question**: Do prompts provide all necessary context upfront?

- [ ] **1 pt**: Claude can act immediately without follow-up questions (95%+ of time)
- [ ] **0 pts**: Frequently requires 2+ clarification rounds

**How to measure**:
- Average iterations to solution
- Target: 1-2 iterations (not 5+)

**Target**: 95%+ prompts are complete (1-shot success)

---

**Section 2 Score**: _____ / 10 points

---

## Section 3: Workflow Efficiency (10 points)

### 3.1 Grep→Read→Edit Pattern (4 points)

**Question**: Do you follow Grep→Read→Edit workflow for file modifications?

- [ ] **4 pts**: Always use workflow (Grep first, targeted Read, precise Edit)
- [ ] **3 pts**: Usually use workflow (75-90% of time)
- [ ] **2 pts**: Sometimes use workflow (50-75%)
- [ ] **1 pt**: Rarely use workflow (<50%)
- [ ] **0 pts**: Never use workflow (read entire files blindly)

**Workflow steps**:
1. Grep to find locations
2. Read targeted sections (offset/limit)
3. Edit precisely
4. Verify if critical

**Target**: 90%+ file modifications follow workflow

---

### 3.2 Batching Operations (3 points)

**Question**: Do you batch related operations in single session?

- [ ] **3 pts**: Always batch 3-5 related operations together
- [ ] **2 pts**: Sometimes batch operations (50-75%)
- [ ] **1 pt**: Rarely batch (<50%)
- [ ] **0 pts**: Never batch (one operation per session)

**Examples of batchable operations**:
- Multiple file refactorings
- Series of related bug fixes
- Multi-step feature implementation
- Comprehensive code review

**Target**: 75%+ related operations batched

---

### 3.3 Tool Selection Optimization (2 points)

**Question**: Do you choose optimal tools for each task?

- [ ] **2 pts**: Always use fastest tool (consider all options before choosing)
- [ ] **1 pt**: Sometimes use suboptimal tools (could be faster)
- [ ] **0 pts**: Frequently use slow tools (not considering alternatives)

**Decision checklist**:
- [ ] Need docs? → @context7 (not Google)
- [ ] Find files? → Glob (not Bash find)
- [ ] Search content? → Grep (not Read all files)
- [ ] Git operations? → @git (not Bash git)

**Target**: 90%+ tool choices optimal

---

### 3.4 Iteration Efficiency (1 point)

**Question**: How many iterations to complete typical task?

- [ ] **1 pt**: Average 1-2 iterations per task
- [ ] **0 pts**: Average 3+ iterations per task

**How to measure**:
- Track last 20 tasks
- Count back-and-forth messages
- Calculate average

**Target**: <2 iterations average

---

**Section 3 Score**: _____ / 10 points

---

## Section 4: Context & Caching (10 points)

### 4.1 Session Continuity (4 points)

**Question**: Do you keep sessions open for related work?

- [ ] **4 pts**: Always keep session open for 30-60 min work blocks
- [ ] **3 pts**: Usually keep session open (75-90% of time)
- [ ] **2 pts**: Sometimes keep session open (50-75%)
- [ ] **1 pt**: Rarely keep session open (<50%)
- [ ] **0 pts**: Close session after each question

**Red flags** (losing cache):
- Closing Claude between related questions
- Starting new session for follow-up work
- >15 min idle between questions (project cache expires)

**Target**: 90%+ related work in single session

---

### 4.2 Explicit Context References (2 points)

**Question**: Do you explicitly reference previous context?

- [ ] **2 pts**: Frequently use "as we discussed...", "based on analysis above..."
- [ ] **1 pt**: Sometimes reference context (50-75%)
- [ ] **0 pts**: Rarely reference context (<50%)

**Examples**:
- "Based on the analysis above, optimize preprocessing"
- "Using the same ml_service.dart we just reviewed"
- "As discussed in previous response, add error handling"

**Target**: 75%+ follow-up prompts reference previous context

---

### 4.3 Work Organization (2 points)

**Question**: Do you organize work in focused sprints?

- [ ] **2 pts**: Work in 15-30 min focused blocks (preserves project cache)
- [ ] **1 pt**: Sometimes work in blocks (50-75%)
- [ ] **0 pts**: Fragmented work (switch contexts frequently)

**How to organize**:
- Group related tasks together
- Complete one subsystem before switching
- Minimize project switching within 15 min

**Target**: 75%+ work time in focused blocks

---

### 4.4 MCP Cache Utilization (2 points)

**Question**: Do you leverage MCP global cache?

- [ ] **2 pts**: Consistently use @context7 for documentation (100x faster)
- [ ] **1 pt**: Sometimes use @context7 (50-75%)
- [ ] **0 pts**: Rarely use @context7 (still Googling manually)

**Check**:
- Last 10 documentation lookups
- How many used @context7?
- Calculate percentage

**Target**: 90%+ documentation lookups via @context7

---

**Section 4 Score**: _____ / 10 points

---

## Section 5: Advanced Techniques (10 points)

### 5.1 Mixed Parallel + Sequential Workflows (3 points)

**Question**: Do you optimize multi-stage workflows?

- [ ] **3 pts**: Consistently parallelize within stages, sequential between stages
- [ ] **2 pts**: Sometimes optimize multi-stage (50-75%)
- [ ] **1 pt**: Rarely optimize multi-stage (<50%)
- [ ] **0 pts**: Never optimize (all sequential)

**Example optimal workflow**:
```
Stage 1: Parallel discovery
[Parallel: Glob pattern1, Glob pattern2]

↓ Wait for results

Stage 2: Parallel read (depends on Stage 1)
[Parallel: Read files from Stage 1]

↓ Wait for results

Stage 3: Sequential edit (depends on Stage 2)
[Sequential: Edit each file]
```

**Target**: 75%+ multi-stage workflows optimized

---

### 5.2 Conditional Operations (2 points)

**Question**: Do you avoid unnecessary operations based on analysis?

- [ ] **2 pts**: Frequently skip unnecessary work based on prior analysis
- [ ] **1 pt**: Sometimes skip unnecessary work (50-75%)
- [ ] **0 pts**: Rarely optimize (do all operations regardless)

**Examples**:
- Grep shows 0 matches → Skip read/edit
- Analysis shows no issues → Skip modification
- Tests already passing → Skip test writing

**Target**: 75%+ workflows skip unnecessary operations

---

### 5.3 Prompt Templates (2 points)

**Question**: Do you use reusable prompt templates?

- [ ] **2 pts**: Have and use 3+ prompt templates for common tasks
- [ ] **1 pt**: Have 1-2 templates, use occasionally
- [ ] **0 pts**: No templates, write from scratch each time

**Common templates**:
- Bug fix structured prompt
- Feature implementation prompt
- Code review prompt
- Refactoring prompt

**Target**: 3+ templates created and used regularly

---

### 5.4 Performance Measurement (2 points)

**Question**: Do you track performance improvements?

- [ ] **2 pts**: Regularly measure time savings, speedup factors
- [ ] **1 pt**: Occasionally measure (once a month)
- [ ] **0 pts**: Never measure (no tracking)

**What to track**:
- Average time per bug fix (before/after optimization)
- Average iterations per task
- Monthly hours saved
- Cache hit rate estimate

**Target**: Monthly performance review

---

### 5.5 Continuous Learning (1 point)

**Question**: Do you review and learn from each session?

- [ ] **1 pt**: Regularly review what worked/didn't work, update templates
- [ ] **0 pts**: No review (repeat same patterns)

**Review questions**:
- What took longer than expected? Why?
- Which tools could have been better?
- Were prompts clear enough?
- How can next session be faster?

**Target**: Weekly session review

---

**Section 5 Score**: _____ / 10 points

---

## Overall Score Summary

| Section | Points | Max | Percentage |
|---------|--------|-----|-----------|
| 1. Tool Execution Strategy | _____ | 10 | _____% |
| 2. Prompt Quality | _____ | 10 | _____% |
| 3. Workflow Efficiency | _____ | 10 | _____% |
| 4. Context & Caching | _____ | 10 | _____% |
| 5. Advanced Techniques | _____ | 10 | _____% |
| **TOTAL** | **_____** | **50** | **_____%** |

---

## Performance Level Interpretation

### 40-50 points (80-100%): Elite Engineer 🏆

**Characteristics**:
- Consistently achieves 3-5x speedup
- 1-2 iterations per task
- 95%+ first-time success rate
- Saves 40+ hours/month

**Next steps**:
- Mentor others on optimization techniques
- Create custom templates for team
- Contribute to optimization guides

---

### 30-39 points (60-79%): Good Performance ✅

**Characteristics**:
- Achieves 2-3x speedup
- 2-3 iterations per task
- 80%+ first-time success rate
- Saves 20-30 hours/month

**Areas to improve**:
- Review sections with <7/10 points
- Focus on one weak area per week
- Practice parallel execution more
- Use structured prompts consistently

---

### 20-29 points (40-59%): Needs Improvement ⚠️

**Characteristics**:
- Achieves <2x speedup
- 3-5 iterations per task
- 60%+ first-time success rate
- Saves 10-20 hours/month

**Action plan**:
1. Read CLAUDE_CODE_OPTIMIZATION_GUIDE.md (45 min)
2. Set up all 4 MCP servers (15 min)
3. Practice parallel execution (1 hour)
4. Create 3 structured prompt templates (30 min)
5. Re-take this checklist in 1 week

---

### <20 points (<40%): Critical - Requires Training 🚨

**Characteristics**:
- No noticeable speedup
- 5+ iterations per task
- <60% first-time success rate
- Minimal time savings

**Urgent action plan**:
1. **Day 1**: Read PERFORMANCE_GUIDE.md (30 min)
2. **Day 1**: Install all MCP servers (15 min)
3. **Day 2**: Practice parallel tool calls (examples folder)
4. **Day 3**: Create first structured prompt template
5. **Day 4**: Practice Grep→Read→Edit workflow
6. **Day 5**: Review and re-take checklist

**Target**: Reach 30+ points within 1 week

---

## Quick Wins (Implement Today)

### 5-Minute Wins

1. **Install MCP servers** (Context7, Git)
   - Immediate 100x speedup for documentation
   - 4x speedup for git operations

2. **Use offset/limit on next large file read**
   - Read("large_file.dart", offset=100, limit=50)
   - Immediate 20-50x token savings

3. **Execute next 2+ Read calls in parallel**
   - Single message: Read(file1), Read(file2), Read(file3)
   - Immediate 3x speedup

---

### 15-Minute Wins

4. **Create first structured prompt template**
   - Copy template from templates/structured_prompt_template.md
   - Fill in for your most common task type
   - Use on next complex task

5. **Practice Grep→Read→Edit workflow**
   - Follow examples/grep_read_edit_workflow_example.md
   - Apply to next file modification task
   - Measure time savings

---

### 30-Minute Wins

6. **Create 3 prompt templates**
   - Bug fix template
   - Feature implementation template
   - Code review template
   - Save 5-10 min per use

7. **Review last 5 sessions for optimization opportunities**
   - Identify where sequential could be parallel
   - Find where full reads could be offset/limit
   - Note where MCP servers could help

---

## Monthly Review Template

**Date**: _________
**Overall Score**: _____ / 50 points (_____%)
**Change from last month**: +_____ points

### Wins This Month
1. _________________________________
2. _________________________________
3. _________________________________

### Challenges
1. _________________________________
2. _________________________________

### Next Month Goals
1. _________________________________
2. _________________________________
3. _________________________________

### Estimated Hours Saved This Month
- Bug fixes: _____ hours
- Features: _____ hours
- Refactoring: _____ hours
- Code review: _____ hours
**Total: _____ hours** (Target: 40+ hours)

---

## Action Plan Generator

Based on your score, here's your personalized action plan:

### If Score < 30 (Critical)
**Week 1 Focus**: Fundamentals
- Day 1-2: Read optimization guides
- Day 3-4: Set up MCP servers
- Day 5-7: Practice parallel execution

**Week 2 Focus**: Structured prompts
- Day 1-3: Create prompt templates
- Day 4-7: Use templates on all tasks

**Week 3 Focus**: Workflows
- Practice Grep→Read→Edit daily
- Measure time savings
- Aim for 30+ score

---

### If Score 30-39 (Good)
**Week 1 Focus**: Advanced techniques
- Master mixed parallel+sequential workflows
- Optimize cache utilization
- Target 40+ score

**Week 2 Focus**: Consistency
- Use structured prompts 100% of time
- Batch all related operations
- Track performance metrics

---

### If Score 40+ (Elite)
**Ongoing**:
- Maintain high standards
- Mentor team members
- Contribute to optimization guides
- Explore cutting-edge techniques

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Total Items**: 50 (5 sections × 10 points each)
**Recommended Frequency**: Monthly review, weekly spot checks
**Target Score**: 40+ points (80%+) for elite performance