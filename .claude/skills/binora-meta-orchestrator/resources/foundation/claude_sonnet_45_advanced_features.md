# Claude Sonnet 4.5 Advanced Features

**Complete reference for Memory Tool, Context Management, Extended Thinking**

**Version**: 1.0.0
**Last Updated**: 2025-10-20
**Models**: claude-sonnet-4-5-20250929, claude-opus-4-20250514

---

## 📚 Table of Contents

1. [Memory Tool (Cross-Session Learning)](#memory-tool)
2. [Context Management (200K Window)](#context-management)
3. [Extended Thinking (1024+ Tokens)](#extended-thinking)
4. [Success Criteria & Evaluations](#success-criteria)

---

## 1. Memory Tool (Cross-Session Learning)

### Overview

**Purpose**: Enable Claude to store and retrieve patterns across conversations.

**API**: `memory_20250818`

**Key Concept**: Store **patterns**, not conversation history.

### Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `view` | Read directory/file | `{"command": "view", "path": "/memories"}` |
| `create` | Create/overwrite file | `{"command": "create", "path": "/memories/patterns/di.md", "file_text": "..."}` |
| `str_replace` | Update file (most common) | `{"command": "str_replace", "path": "...", "old_str": "...", "new_str": "..."}` |
| `insert` | Insert at line number | `{"command": "insert", "path": "...", "insert_line": 2, "insert_text": "..."}` |
| `delete` | Remove file/directory | `{"command": "delete", "path": "/memories/old.txt"}` |
| `rename` | Move/rename | `{"command": "rename", "old_path": "...", "new_path": "..."}` |

### Memory Organization Pattern

```
/memories/
├── patterns/          # Recurring problem patterns
│   ├── concurrency.md
│   ├── error_handling.md
│   └── security.md
├── techniques/        # Proven solution approaches
│   └── debugging_strategies.md
├── insights/          # Domain-specific discoveries
│   └── ml_optimization.md
└── examples/          # Successful few-shot examples
    └── code_review_template.md
```

### Integration with Prompt Engineering

**Pattern**: Check memory FIRST, apply stored knowledge, update memory.

```xml
<system_prompt>
You are a {{EXPERT}} who learns over time.

## Memory Workflow
1. **Check Memory First**: View /memories/{{category}}/ before starting
2. **Apply Stored Knowledge**: Use relevant patterns from past sessions
3. **Document New Learnings**: Store reusable insights

## Memory Structure
/memories/
├── patterns/     # {{WHAT_TO_STORE_1}}
├── techniques/   # {{WHAT_TO_STORE_2}}
└── insights/     # {{WHAT_TO_STORE_3}}
</system_prompt>
```

### What Claude Actually Learns

**Semantic patterns**, not syntax:

**Example**: Race condition pattern learned in Java → Applied to Python, Go, Rust concurrency issues.

**Why Powerful**: Patterns transcend specific implementations, knowledge compounds across sessions.

---

## 2. Context Management (200K Window)

### Overview

**Purpose**: Automatic management of context window to prevent overflow.

**Beta Header**: `context-management-2025-06-27`

**Context Window**: 200K tokens (1M beta)

### How It Works

- Automatically **clears old tool results** when context grows large
- **Preserves memory files** (never cleared)
- Enables effectively **unlimited conversations**

### Configuration

```python
context_management={
    "edits": [{
        "type": "clear_tool_uses_20250919",
        "trigger": {"type": "input_tokens", "value": 10000},  # When to clear
        "keep": {"type": "tool_uses", "value": 5},              # Recent to keep
        "clear_at_least": {"type": "input_tokens", "value": 3000}  # Min savings
    }]
}
```

### Configuration Scenarios

| Scenario | Trigger | Keep | Clear At Least | Use Case |
|----------|---------|------|----------------|----------|
| **Aggressive** | 5000 | 1 | 50 | Short-lived results (file operations) |
| **Balanced** | 10000 | 5 | 3000 | Standard workflows |
| **Conservative** | 15000 | 10 | 5000 | Important results must persist |

### Key Insight

**Short-term context** (tool results) → Cleared periodically
**Long-term memory** (pattern files) → Persists forever

This allows **infinite conversations** with bounded context windows.

---

## 3. Extended Thinking (1024+ Tokens)

### Overview

**Purpose**: Enable deep reasoning through explicit step-by-step thinking BEFORE generating response.

**Minimum Budget**: 1024 tokens
**Maximum**: 32K+ tokens (use batch processing above 32K)

### When to Use Extended Thinking

✅ **Use for**:
- Complex STEM problems
- Constraint optimization
- Multi-step analysis
- Strategic planning
- Verification and error-checking

❌ **Don't use for**:
- Simple factual queries
- Tasks requiring <1024 tokens thinking
- Real-time applications (latency critical)

### Prompting Technique: General Over Prescriptive

**❌ BAD** (too prescriptive):
```
Think through this step-by-step:
1. First, identify the variables
2. Then, set up the equation
3. Next, solve for x
```

**✅ GOOD** (allows creative exploration):
```
Think thoroughly and in great detail about this problem.
Consider multiple approaches.
Show your complete reasoning.
Try different methods if your first approach doesn't work.
```

### Integration with Standard Chain of Thought

| When | Use |
|------|-----|
| **Thinking budget <1024 tokens** | Standard CoT with `<thinking>` tags |
| **Thinking budget ≥1024 tokens** | Extended Thinking |
| **Complex multi-step problems** | Extended Thinking |
| **Need explicit control over structure** | Standard CoT |

### Pattern: Verification-Enhanced Reasoning

```xml
<task>{{PROBLEM_DESCRIPTION}}</task>

<instructions>
1. Think through the problem step by step
2. Develop your solution
3. Before finishing, verify your solution by testing it with:
   {{TEST_CASES}}
4. If you find issues, revise your solution
5. Provide your final, verified answer
</instructions>
```

**Benefit**: Improved consistency, reduced errors through self-correction.

### Critical Constraints

🚫 **FORBIDDEN**:
- Passing Claude's extended thinking back in user text (degrades performance)
- Prefilling extended thinking
- Manually changing output following thinking block

✅ **ALLOWED**:
- Standard assistant response prefill (when extended thinking disabled)

### Repetition Handling

**Issue**: Claude may repeat extended thinking in output.

**Solution**: Add instruction:
```
Do not repeat your extended thinking. Only output the answer.
```

---

## 4. Success Criteria & Empirical Evaluations

### Success Criteria Framework

**CRITICAL**: Define success criteria **BEFORE** optimization begins.

#### Characteristics (SMART-like)

1. **Specific**: Exact capability required
2. **Measurable**: Quantitative metrics or consistent qualitative scales
3. **Achievable**: Based on benchmarks, aligned with model capabilities
4. **Relevant**: Aligned with application purpose

#### Example: Multidimensional Criteria

**❌ BAD**:
```
The model should classify sentiments well
```

**✅ GOOD**:
```
On held-out test set of 10,000 diverse Twitter posts:
- F1 score ≥0.85
- 99.5% of outputs non-toxic
- 90% of errors cause inconvenience not egregious error
- 95% response time <200ms
```

### Empirical Evaluation Methods

#### 1. Exact Match (Simple, Scalable)

**When**: Categorical answers (sentiment, classification, yes/no)

**Test Set Size**: 1000+ examples

```python
def evaluate_exact_match(model_output, correct_answer):
    return model_output.strip().lower() == correct_answer.lower()
```

#### 2. Cosine Similarity (Moderate, Scalable)

**When**: Consistency across paraphrased inputs

**Test Set Size**: 50+ groups with 3-5 variations each

#### 3. ROUGE-L (Moderate, Scalable)

**When**: Summarization quality

**Test Set Size**: 200+ articles with reference summaries

#### 4. LLM-Based Likert Scale (Moderate, Moderate Scale)

**When**: Subjective qualities (tone, empathy, style)

**Test Set Size**: 100+ examples

```python
def build_grader_prompt(answer, rubric):
    return f"""Grade this answer based on the rubric:
    <rubric>{rubric}</rubric>
    <answer>{answer}</answer>
    Think through your reasoning in <thinking> tags,
    then output 'correct' or 'incorrect' in <result> tags."""
```

#### 5. LLM-Based Binary Classification (Simple, High Scale)

**When**: Pass/fail for specific criteria (safety, privacy, compliance)

**Test Set Size**: 500+ examples

### Grading Hierarchy

**Priority 1**: Code-based grading (fastest, most reliable)
**Priority 2**: LLM-based grading (fast, flexible)
**Priority 3**: Human grading (slow, expensive - validation only)

### LLM Grading Best Practices

1. **Detailed Rubrics**: Explicit, measurable criteria
2. **Empirical Criteria**: Discrete outputs ("correct"/"incorrect", 1-5 scale)
3. **Encourage Reasoning**: Request `<thinking>` tags before score
4. **Separate Model**: Use different model for evaluation than testing

### Test Set Creation at Scale

**Challenge**: Writing hundreds of test cases manually is hard.

**Solution**: Use Claude to generate variations.

```
<baseline_examples>
  {{5-10 HIGH-QUALITY MANUAL EXAMPLES}}
</baseline_examples>

<task>
Generate 500 additional test cases following these patterns.
Ensure diversity: edge cases, typos, mixed sentiment, sarcasm, etc.
</task>
```

---

## 5. Integration Patterns

### Pattern 1: Memory-Enabled Prompt Engineer

```xml
<system_prompt>
You are a prompt engineering expert who learns patterns over time.

## Memory Structure
/memories/
├── patterns/
│   ├── vague_language_fixes.md      # "somehow" → specific actions
│   ├── context_missing_templates.md # Add tech stack, errors
│   └── xml_structuring_examples.md  # <task>, <context>, <output>
├── evaluations/
│   └── prompt_quality_metrics.md    # Score improvements tracked
└── insights/
    └── anthropic_2025_patterns.md   # Latest best practices

## Workflow
1. Check /memories/patterns/ for similar prompt improvements
2. Apply stored templates (vague → specific, missing context → full XML)
3. Calculate quality score (0-100)
4. Update memory with new patterns discovered
</system_prompt>
```

### Pattern 2: Extended Thinking for Complex Prompt Design

```xml
<task>Design a prompt for multi-turn code review with context awareness</task>

<instructions>
Think thoroughly about this prompt design challenge.
Consider:
- What context needs to be preserved across turns?
- How to structure memory for code patterns?
- What evaluation criteria measure success?
- How to balance verbosity vs clarity?

Explore multiple design approaches before finalizing.
</instructions>

<output_format>
<design_rationale>{{YOUR_REASONING}}</design_rationale>
<prompt_template>{{FINAL_PROMPT_WITH_XML}}</prompt_template>
<evaluation_plan>{{HOW_TO_TEST}}</evaluation_plan>
</output_format>
```

### Pattern 3: Empirical Prompt Evaluation

```python
# Define success criteria
criteria = {
    "clarity_score": {"target": "≥85/100", "weight": 0.3},
    "xml_structure": {"target": "100%", "weight": 0.2},
    "actionability": {"target": "≥90%", "weight": 0.3},
    "user_satisfaction": {"target": "≥4/5", "weight": 0.2}
}

# Test set: 200 diverse prompts (vague → enhanced)
test_cases = load_test_cases("prompt_enhancements.json")

# Evaluate enhanced prompts
results = []
for case in test_cases:
    enhanced = enhance_prompt(case["original"])
    score = calculate_quality_score(enhanced)
    results.append({
        "original_score": case["baseline_score"],
        "enhanced_score": score,
        "improvement": score - case["baseline_score"]
    })

# Metrics
avg_improvement = mean([r["improvement"] for r in results])
print(f"Average improvement: +{avg_improvement} points")
print(f"Success rate (≥85 score): {sum(1 for r in results if r['enhanced_score'] >= 85) / len(results) * 100}%")
```

---

## 6. Advanced Workflows

### Workflow: Prompt Optimization with Memory

```
Session 1:
  User: "Fix the camera crash"
  → Claude detects vague prompt (score: 28/100)
  → Enhances to detailed XML structure (score: 89/100)
  → Stores pattern in /memories/patterns/vague_to_specific.md

Session 2 (days later):
  User: "Optimize the database"
  → Claude checks /memories/patterns/vague_to_specific.md
  → Applies learned pattern IMMEDIATELY
  → Enhanced prompt (score: 87/100) in <30 seconds

Benefit: 10x faster enhancement through cross-session learning
```

### Workflow: Extended Thinking for Prompt Design

```
<problem>
Design a prompt for a multi-agent system that:
- Coordinates 3 specialist agents (code review, security, performance)
- Maintains shared context across agent responses
- Produces unified, actionable report
- Handles edge cases (empty code, multiple languages, async patterns)
</problem>

<thinking_budget>8192 tokens</thinking_budget>

<instructions>
Think deeply about this multi-agent prompt design.
Consider:
1. How to structure agent roles and specializations?
2. What shared context format enables coordination?
3. How to aggregate findings without duplication?
4. What edge cases require special handling?

Explore multiple architectures before proposing final design.
Verify design handles all requirements.
</instructions>

→ Claude produces comprehensive prompt architecture with 8K tokens of reasoning
→ Final prompt scores 96/100 on quality criteria
```

### Workflow: Empirical Evaluation Cycle

```
1. Define Success Criteria:
   - Clarity ≥85/100
   - Context completeness ≥90%
   - XML structure 100%
   - Actionability ≥90%

2. Create Test Set:
   - 200 diverse prompts (manually validated)
   - Edge cases: vague, no context, mixed languages, typos

3. Baseline Evaluation:
   - Test original prompts → Avg score: 42/100

4. Enhance Prompts:
   - Apply enhancement system to all 200

5. Re-Evaluate:
   - Test enhanced prompts → Avg score: 88/100
   - Improvement: +46 points average
   - Success rate (≥85): 82%

6. Iterate on Edge Cases:
   - Identify 36 prompts still <85
   - Analyze patterns (multilingual prompts score lower)
   - Refine enhancement for multilingual → 94% success rate

7. Deploy & Monitor:
   - Production deployment
   - Track real-world score distribution
   - Update test set with new edge cases discovered
```

---

## 7. Best Practices Summary

### Memory Tool

✅ **DO**:
- Store **patterns**, not conversation history
- Use descriptive file names (`race_condition_pattern.md` not `temp123.md`)
- Organize with clear directory structure
- Check memory BEFORE starting tasks

❌ **DON'T**:
- Store sensitive information (passwords, PII)
- Let memory grow unbounded
- Use memory for temporary state

### Context Management

✅ **DO**:
- Configure aggressive clearing for long sessions (lower trigger, keep fewer)
- Configure conservative for important details (higher trigger, keep more)
- Adjust `clear_at_least` based on tool result sizes

### Extended Thinking

✅ **DO**:
- Start with minimum budget (1024), increment as needed
- Use general instructions ("think deeply") over prescriptive steps
- Enable self-verification with test cases
- Batch process budgets >32K tokens

❌ **DON'T**:
- Pass extended thinking back in user text
- Prefill thinking
- Modify output following thinking block

### Evaluations

✅ **DO**:
- Define success criteria BEFORE optimization
- Prioritize automated grading (code-based > LLM-based > human)
- Use detailed rubrics with empirical criteria
- Test set size: 1000+ for classification, 200+ for summarization

---

## 8. References

| Resource | Topic | URL |
|----------|-------|-----|
| Anthropic Docs | Memory Tool API | docs.anthropic.com |
| Anthropic Docs | Context Management | docs.anthropic.com |
| Anthropic Docs | Extended Thinking | docs.anthropic.com/extended-thinking-tips |
| Anthropic Docs | Evaluations | docs.anthropic.com/create-strong-evaluations |
| Anthropic Docs | Success Criteria | docs.anthropic.com/define-success-criteria |

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Optimized for**: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)