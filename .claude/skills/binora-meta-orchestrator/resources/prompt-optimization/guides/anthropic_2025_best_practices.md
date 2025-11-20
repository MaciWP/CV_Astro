# Anthropic 2025 Prompt Engineering Best Practices

**Comprehensive guide to Claude Sonnet 4.5 prompt optimization**

**Version**: 1.0.0
**Last Updated**: 2025-10-20
**Claude Models**: Sonnet 4.5, Haiku 4.5
**Context Window**: 200K tokens (1M beta)

---

## 📚 Table of Contents

1. [Core Principles](#core-principles)
2. [XML Structuring](#xml-structuring)
3. [Chain of Thought](#chain-of-thought)
4. [Long Context Optimization](#long-context-optimization)
5. [Quote Grounding](#quote-grounding)
6. [Few-Shot Prompting](#few-shot-prompting)
7. [Response Prefilling](#response-prefilling)
8. [Extended Thinking](#extended-thinking)
9. [Common Pitfalls](#common-pitfalls)
10. [Model-Specific Tips](#model-specific-tips)

---

## 1. Core Principles

### 1.1 Clarity Over Brevity

**Research Finding**: Detailed instructions outperform terse ones by 30-40% on complex tasks.

**Golden Rule**: If a colleague unfamiliar with the task would be confused, Claude will be too.

#### Bad Example (Vague)
```
"Improve the database performance"
```

#### Good Example (Clear)
```xml
<task>Optimize PostgreSQL query in UserService.getActiveUsers() to reduce latency from 850ms to <100ms for 10K+ user databases</task>

<context>
  <current_query>SELECT * FROM users WHERE status='active' ORDER BY created_at DESC</current_query>
  <performance_target><100ms for 10,000 users</performance_target>
  <constraints>Must maintain result ordering</constraints>
</context>

<instructions>
1. Analyze current query plan with EXPLAIN ANALYZE
2. Identify missing indexes (likely on status + created_at)
3. Add appropriate indexes
4. Consider pagination (LIMIT/OFFSET) if applicable
5. Benchmark with realistic data volume
</instructions>
```

**Impact**: +35 points quality score (28 → 63)

---

### 1.2 Contextual Grounding

**Research Finding**: Providing project context, motivation, and audience improves output relevance by 25-35%.

**Key Elements**:
- **What**: What are you building/fixing?
- **Why**: Why does this matter?
- **Who**: Who will use this? (end users, developers, system)
- **How**: How does it fit in the architecture?

#### Example: Adding Context
```xml
<context>
  <project>Healthcare appointment scheduling SaaS</project>
  <motivation>
    Patients report frustration with "Your session has expired" errors when filling long forms.
    This causes 15% drop-off rate (2,500 lost appointments/month = $125K revenue loss).
  </motivation>
  <audience>End users (patients aged 45-75, not tech-savvy)</audience>
  <architecture>
    React 18 SPA, JWT tokens (30-min expiry), Redux state management.
    Backend: Node.js/Express with PostgreSQL.
  </architecture>
</context>

<task>Implement session auto-renewal to prevent timeouts during form completion</task>
```

**Impact**: Claude now understands:
- **Business context** (revenue loss)
- **User empathy** (elderly patients)
- **Technical constraints** (JWT expiry, React/Redux)
- **Success criteria** (reduce drop-off rate)

---

## 2. XML Structuring

**Official Guidance**: XML tags help Claude parse complex prompts with multiple components.

### 2.1 When to Use XML

**Use XML if prompt contains ≥2 of**:
- Instructions + data
- Multiple examples
- Complex output format
- Nested information (code + explanation + tests)

### 2.2 Effective Tag Naming

**Principle**: Tag names should be semantically meaningful.

**Good Tags**:
- `<task>`, `<instructions>`, `<context>`, `<code>`, `<output_format>`
- `<example>`, `<thinking>`, `<answer>`, `<requirements>`

**Bad Tags** (too generic):
- `<section1>`, `<data>`, `<stuff>`, `<content>`

**Research Note**: There are NO canonical "best" XML tags Claude is specially trained on. Use what makes sense for your domain.

### 2.3 Nested Structures

**Pattern**: Hierarchical organization for complex information.

```xml
<context>
  <project>
    <name>EasyBoard</name>
    <type>Flutter mobile app</type>
  </project>
  <architecture>
    <frontend>Flutter 3.24, Riverpod 2.4.9</frontend>
    <database>Isar 3.1.0 (NoSQL)</database>
    <ml>ONNX Runtime 1.22.0, YOLO11</ml>
  </architecture>
  <error>
    <message>Null pointer exception</message>
    <file>lib/services/ml_service.dart</file>
    <line>156</line>
    <stack_trace>
      at MLService.detectObjects (ml_service.dart:156)
      at ActiveMatchScreen.onCapture (active_match_screen.dart:89)
    </stack_trace>
  </error>
</context>
```

**Benefit**: Claude can easily locate specific information ("What's the ML framework?" → ONNX Runtime 1.22.0).

---

## 3. Chain of Thought

**Research Finding**: Explicit reasoning steps improve accuracy on complex tasks by 20-40%.

### 3.1 When to Use CoT

**Recommended for**:
- Multi-step reasoning (math, logic puzzles)
- Complex decision-making (architecture choices, trade-offs)
- Debugging (diagnostic workflows)
- Planning (project roadmaps, feature design)

**NOT needed for**:
- Simple factual questions ("What is the capital of France?")
- Single-step tasks ("Format this JSON")
- Straightforward code generation ("Write a hello world function")

### 3.2 CoT Patterns

#### Pattern 1: "Think step-by-step"
```
Analyze the security vulnerabilities in this authentication code.
Think step-by-step about each potential attack vector.
```

#### Pattern 2: Structured `<thinking>` tags
```xml
<instructions>
Analyze the trade-offs between MongoDB and PostgreSQL for this use case.

<thinking>
Consider:
1. Data model fit (structured vs documents)
2. Query patterns (joins vs embedded data)
3. Scale requirements (horizontal vs vertical)
4. Team expertise (SQL vs NoSQL)
5. Operational complexity (backups, monitoring)
</thinking>

Recommend the best choice in <answer> tags.
</instructions>
```

#### Pattern 3: Guided reasoning steps
```xml
<task>Design a caching strategy for API responses</task>

<thinking_steps>
1. Identify cacheable endpoints:
   - Which endpoints are read-heavy?
   - Which have stable data (low mutation rate)?

2. Choose cache layer:
   - In-memory (Redis, Memcached)?
   - CDN (CloudFlare, Fastly)?
   - Application-level (LRU cache)?

3. Define TTL strategy:
   - Static content: 1 day+
   - User-specific: 5-15 minutes
   - Real-time: no cache

4. Handle invalidation:
   - Time-based expiry
   - Event-driven (on data mutation)
   - Manual purge endpoints

5. Measure effectiveness:
   - Cache hit ratio target (>80%)
   - Latency improvement (>50% reduction)
</thinking_steps>

Propose a complete caching architecture in <answer> tags.
```

### 3.3 Extended Thinking (1024+ Tokens)

**New in Sonnet 4.5**: Extended thinking for complex problems.

**When to Use**:
- STEM problems (math, physics, engineering)
- Constraint optimization (scheduling, resource allocation)
- Multi-step proofs
- Exploratory problem-solving (Claude tries multiple approaches)

**Best Practice**: Start GENERAL, refine iteratively.

```
❌ BAD (too prescriptive):
"Think through this step-by-step:
 1. First, identify the variables
 2. Then, set up the equation
 3. Finally, solve for x"

✅ GOOD (allows exploration):
"Think thoroughly and in great detail about this problem.
 Consider multiple approaches.
 Show your complete reasoning.
 Try different methods if your first approach doesn't work."
```

**Trade-off**: Extended thinking increases latency (1024+ tokens of reasoning before answer).

---

## 4. Long Context Optimization

**Context Window**: 200K tokens (1M beta with header)

### 4.1 Document Positioning

**Research Finding (Chroma, 2025)**: Placing documents FIRST and query LAST improves quality by 30%.

```xml
<!-- ✅ CORRECT: Documents TOP, Query END -->
<documents>
  <document index="1">
    <source>user_service.py</source>
    <content>
      [5000 lines of code]
    </content>
  </document>

  <document index="2">
    <source>auth_middleware.py</source>
    <content>
      [3000 lines of code]
    </content>
  </document>
</documents>

<!-- Query at the END -->
<task>Find all dependency injection violations in these services</task>
```

**Principle**: Documents are CONTEXT, query is ACTION. Context first, action last.

---

### 4.2 Quote Grounding

**Research Finding**: Extracting quotes before analysis reduces hallucination by 20-30%.

**Bad Pattern** (Direct analysis - risk of fabrication):
```
"Analyze this 10,000-line codebase and identify all security vulnerabilities."
```

**Good Pattern** (Quote grounding):
```xml
<task>Security audit of authentication system</task>

<instructions>
**Step 1: EXTRACT QUOTES**
Read the codebase and extract ALL code blocks related to:
- Password handling
- JWT token generation/validation
- Session management
- Input validation

Wrap each quote in <quote file="..." line="X-Y">{{CODE}}</quote> tags.

**Step 2: ANALYZE QUOTES**
For each extracted quote, analyze against OWASP Top 10:
- SQL Injection
- Broken Authentication
- Sensitive Data Exposure
- etc.

**Step 3: PROVIDE RECOMMENDATIONS**
Based on the quoted code (NOT imagined code), recommend fixes.
</instructions>
```

**Impact**: Claude quotes actual code, not fabricated examples. Accuracy improves 20-30%.

---

### 4.3 Context Rot Mitigation

**Research Finding (Chroma, 2025)**: Distractors (topically similar but irrelevant content) hurt performance MORE than completely irrelevant content.

**Strategies**:
1. **High query-content semantic similarity**: Use matching terminology in query and documents.
2. **Minimize distractors**: Remove related-but-irrelevant sections.
3. **Use quote grounding**: Forces Claude to cite specific passages.

#### Example: Semantic Similarity

```xml
<!-- ❌ BAD: Low similarity -->
<documents>
  [Code about "user authentication with JWT tokens"]
</documents>

<task>Find login bugs</task>  <!-- Vague, different terms -->

<!-- ✅ GOOD: High similarity -->
<documents>
  [Code about "user authentication with JWT tokens"]
</documents>

<task>Identify JWT token validation vulnerabilities in user authentication flow</task>
<!-- Uses same terms: JWT, authentication, user -->
```

---

## 5. Few-Shot Prompting

**Guidance**: 3-5 diverse, relevant examples improve performance, especially for complex tasks.

### 5.1 Example Structure

```xml
<examples>
  <example>
    <input>{{EXAMPLE_INPUT_1}}</input>
    <output>{{DESIRED_OUTPUT_1}}</output>
  </example>

  <example>
    <input>{{EXAMPLE_INPUT_2}}</input>
    <output>{{DESIRED_OUTPUT_2}}</output>
  </example>

  <example>
    <input>{{EXAMPLE_INPUT_3}}</input>
    <output>{{DESIRED_OUTPUT_3}}</output>
  </example>
</examples>

<task>Now process this new input following the pattern above: {{NEW_INPUT}}</task>
```

### 5.2 Example Quality Criteria

**Effective examples**:
- **Relevant**: Directly applicable to the task
- **Diverse**: Cover edge cases, not just happy path
- **Clear**: Properly formatted, easy to understand

**Meta-tip**: Ask Claude to evaluate your examples!

```
"Review these 3 examples for relevance, diversity, and clarity.
 Suggest improvements or additional examples."
```

---

## 6. Response Prefilling

**Purpose**: Guide Claude's output format by providing initial text.

### 6.1 When to Use Prefilling

- **Skip preambles**: Start directly with output (no "Here's the code...")
- **Enforce JSON**: Prefill with `{` to force JSON output
- **Maintain roleplay**: Prefill `[Character Name]` to keep character
- **Boost performance**: A few prefilled sentences can improve quality significantly

### 6.2 Example: JSON Mode

**Without prefilling** (Claude adds preamble):
```
User: "Extract user data as JSON"

Claude: "Here's the JSON representation of the user data:
{
  "name": "Alice",
  "age": 30
}"
```

**With prefilling** (direct JSON):
```
User: "Extract user data as JSON"