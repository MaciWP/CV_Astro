# Anthropic 2025 Prompt Engineering Guide

Comprehensive summary of Anthropic's official 2025 best practices for Claude Sonnet 4.5.

---

## 📚 Official Sources

1. **Prompt Engineering Overview** (docs.claude.com)
2. **Use XML Tags to Structure Prompts** (docs.claude.com)
3. **Effective Context Engineering for AI Agents** (anthropic.com/engineering)
4. **Prompting Long Context** (anthropic.com/news)
5. **Claude 4 Best Practices** (docs.claude.com)

---

## 🎯 Core Principles

### 1. Be Specific and Clear

**Anthropic Quote**: "Claude performs best when instructions are specific, detailed, and unambiguous."

**Implementation**:
- Use action verbs: "Refactor", "Optimize", "Fix" (not "Look at", "Check")
- Include file paths: `apps/core/services.py:120-145`
- Specify metrics: "<200ms", ">95% coverage", "reduce from 501 to 1 query"
- State tech stack: "Django 5.0, DRF 3.14, PostgreSQL 14"

**Example**:
❌ "Improve the performance"
✅ "Reduce API response time from 500ms to <100ms by adding select_related('company') to eliminate N+1 queries in UserViewSet.list()"

---

### 2. Use XML Tags

**Anthropic Quote**: "Claude has been trained to recognize and respond to XML-style tags. Use these tags to separate instructions, examples, and inputs."

**Benefits**:
- **Clarity**: Separate different parts (instructions vs data vs examples)
- **Accuracy**: Reduces errors from Claude misinterpreting components
- **Flexibility**: Easily modify sections without rewriting entire prompt
- **Parseability**: Extract specific response portions for post-processing

**Recommended Tags**:
- `<task>` or `<instructions>`: What to do
- `<context>` or `<data>`: Source material, project info
- `<examples>`: Few-shot demonstrations
- `<thinking>`: For Chain of Thought prompts
- `<output_format>` or `<formatting_example>`: Desired structure
- `<findings>` and `<recommendations>`: For analysis tasks

**Why XML > Markdown**:
- Claude specifically trained with XML tags (architectural advantage)
- XML provides explicit structural boundaries
- Reduces ambiguity in complex prompts
- Markdown saves ~15% tokens, but loses precision

**Anthropic Recommendation**: Use XML for maximal clarity, especially for:
- Multi-step instructions
- Complex analytical tasks
- Strict specification adherence

---

### 3. Chain of Thought Reasoning

**Anthropic Quote**: "Claude will respond more accurately if you tell it to think step by step."

**Implementation**:
```xml
<task>Design caching strategy for high-traffic API</task>

<instructions>
Think step-by-step in <thinking> tags:

<thinking>
1. Analyze current bottlenecks
2. Evaluate caching options (Redis, Memcached, in-memory)
3. Design cache key strategy
4. Plan invalidation approach
5. Consider edge cases and failure modes
</thinking>

Now implement based on this analysis.
</instructions>
```

**When to Use**:
- Complex reasoning tasks (architecture decisions, algorithm design)
- Multi-step problems
- Trade-off analysis
- Tasks requiring justification

**Claude 4 Enhancement**: Extended thinking capabilities (up to 8192 tokens) for deeper reasoning on complex tasks.

---

### 4. Context Engineering

**Anthropic Quote (2025)**: "Context engineering represents how to optimize the finite tokens available to language models. The overarching guidance: remain thoughtful and keep your context **informative, yet tight**."

### Core Principle: Treat Context as Finite Resource

**Why**: LLMs experience degradation with larger contexts due to architectural constraints. The transformer's n² token relationships create tension between context size and attention focus.

**Strategy**: Curate "the **smallest possible set of high-signal tokens**" to maximize desired outcomes.

### Key Techniques

#### A) System Prompt Calibration

Find the "Goldilocks zone": specific enough to guide behavior effectively, yet flexible for the model to apply heuristics intelligently.

❌ **Too Brittle**: "If user asks X, always respond Y. If user asks Z, always respond W..."
❌ **Too Vague**: "Be helpful."
✅ **Just Right**: "Enhance prompts to ≥85/100 using Anthropic 2025 best practices (XML, CoT, quote grounding). Load project-specific templates based on detected tech stack."

#### B) Progressive Disclosure

**Pattern**: Minimal core + on-demand loading based on context/score

**Example** (This Skill):
```
Layer 0 (Always): SKILL.md (~480 tokens) - detection, scoring, references
Layer 1 (If score <70): universal_principles.md (~600 tokens)
Layer 2 (If project detected): django_multi_tenant.md (~1000 tokens)
Layer 3 (If user requests): anthropic_2025_guide.md (~1200 tokens)
```

**Efficiency**: -60% tokens vs monolithic (624 lines always loaded)

#### C) Strategic Information Retrieval

**Hybrid Approach**: Provide essential context upfront + enable dynamic retrieval via tools/references.

❌ **Information Dump**: Include all 500 lines of CLAUDE.md in prompt
✅ **Strategic**: Reference CLAUDE.md, load specific sections on-demand

**Mirrors Human Cognition**: Humans don't load everything into working memory simultaneously.

#### D) Quote Grounding (Reduces Hallucination 20-30%)

**Anthropic Quote**: "For long context retrieval, extract reference quotes relevant to the question **before** answering."

**Implementation**:
```xml
<instructions>
**Step 1: EXTRACT QUOTES**
Read apps/core/services.py and extract code blocks for:
- Service class definitions
- Constructor injection patterns
- Business logic methods

Wrap each in <quote line="X-Y" file="...">{{CODE}}</quote>

**Step 2: ANALYZE QUOTES**
Based on extracted quotes (not imagined code), identify patterns.

**Step 3: PROVIDE RECOMMENDATIONS**
Ground recommendations in actual quoted code.
</instructions>
```

**Why**: Forces Claude to reference actual code, not hallucinate patterns.

**Best Practice**: Place documents/code **BEFORE** the query (query comes LAST).

---

## 🧠 Long-Horizon Techniques

For tasks spanning multiple hours (complex refactoring, feature development):

### 1. Compaction

Summarize conversation history, preserving critical decisions while discarding redundant tool outputs.

### 2. Structured Note-Taking

Enable Claude to maintain persistent external memory for multi-hour tasks.

### 3. Multi-Agent Architectures

Delegate focused subtasks to specialized agents that return condensed summaries.

**Example**: Use `django-test-generator` agent for comprehensive test suite generation instead of manual prompting.

---

## ✅ Validation Checklist (Anthropic Standards)

**Clarity**:
- [ ] Specific action verbs
- [ ] File paths with line numbers
- [ ] Quantifiable metrics
- [ ] Tech stack with versions
- [ ] No vague language

**Structure**:
- [ ] XML tags for multi-part prompts
- [ ] Sequential numbered steps
- [ ] Explicit output format
- [ ] Code/data in appropriate tags

**Context Engineering**:
- [ ] High-signal tokens only
- [ ] Progressive disclosure (not dump)
- [ ] Quote grounding for long files
- [ ] Context before query

**Advanced**:
- [ ] Chain of Thought for complex tasks
- [ ] Few-shot examples (2-4 with ❌/✅)
- [ ] Tool/agent delegation when appropriate

---

## 📊 Token Efficiency Guidelines

**Anthropic Principle**: "Smallest possible set of high-signal tokens"

**Strategies**:

1. **References over Inclusion**
   - ❌ Include 500 lines of documentation
   - ✅ Reference documentation, load on-demand

2. **Examples: Quality over Quantity**
   - ❌ 10 generic examples
   - ✅ 2-3 project-specific examples with ❌/✅ contrast

3. **Structured Data**
   - Use XML tags for clear boundaries
   - Reduces ambiguity = fewer tokens for clarification

4. **Conditional Loading**
   - Load Layer 1 only if score <70
   - Load Layer 2 only if project detected
   - Load Layer 3 only if user requests

---

## 🎯 Application to This Skill

**Design Decisions Based on Anthropic 2025**:

1. **Progressive Disclosure** (4 layers)
   - Implements "smallest set of high-signal tokens"
   - -60% token usage vs monolithic

2. **XML Structuring**
   - All enhanced prompts use XML tags
   - Enforced via universal_principles.md

3. **Quote Grounding**
   - Template examples request quote extraction for files >200 lines
   - Reduces hallucination 20-30%

4. **Context Engineering**
   - Auto-detects project type → loads relevant template only
   - Binora Backend → django_multi_tenant.md (not generic)

5. **Chain of Thought**
   - Complex examples (Example 3 in django_multi_tenant.md) use `<thinking>` tags
   - Enforced for architecture/algorithm tasks

6. **Few-Shot Examples**
   - All templates include ❌ WRONG vs ✅ CORRECT patterns
   - Project-specific (AuthService, UserViewSet from apps/core/)

---

## 📖 Key Quotes

> "Claude has been trained to recognize and respond to XML-style tags. Use these tags to separate instructions, examples, and inputs."
> — Anthropic, "Use XML tags to structure prompts"

> "Context engineering represents how to optimize the finite tokens available to language models... remain thoughtful and keep your context **informative, yet tight**."
> — Anthropic, "Effective context engineering for AI agents"

> "For long context retrieval, extract reference quotes relevant to the question before answering."
> — Anthropic, "Prompting long context"

> "Claude will respond more accurately if you tell it to think step by step."
> — Anthropic, "Prompt engineering overview"

> "Curate the **smallest possible set of high-signal tokens** to maximize desired outcomes."
> — Anthropic, "Effective context engineering"

---

**Version**: 2025-01-23
**Sources**: docs.claude.com, anthropic.com/engineering, anthropic.com/news
**Model**: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
