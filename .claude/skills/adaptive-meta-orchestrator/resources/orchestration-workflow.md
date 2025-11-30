# Orchestration Workflow - Complete Guide

**Comprehensive orchestration patterns: 60-point validation, decision trees, agent coordination.**

**Version**: 2.0.0
**Last Updated**: 2025-01-18
**Token Size**: ~8K tokens

---

## Overview

This reference provides complete orchestration guidance across four dimensions:

1. **6-Phase Workflow Details** - Complete step-by-step execution guide for each phase
2. **Validation Checklist** (60 points) - Quality gates across 5 layers
3. **Decision Trees** - Visual flowcharts for workflow decisions
4. **Agent Coordination** - Skills vs Agents, parallel execution (2-5 optimal)

**Use when**: Coordinating complex workflows requiring validation, decision-making, or multi-agent orchestration.

---

## Part 0: 6-Phase Workflow Details

**This is the core orchestration flow.** Every user request flows through these 6 phases sequentially.

### Phase 0: Pre-Analysis (Token Optimization)

**Objective**: Avoid redundant work by checking what's already available.

**Steps**:

1. **Check Session Cache**
   ```
   Question: Do we already have this information loaded?
   Action: Review conversation history for:
     - Files already read (don't re-read)
     - Context already loaded (don't reload)
     - Patterns already discussed (reference previous)
   ```

2. **Review Session State**
   ```
   Question: What context is currently in memory?
   Check:
     - Token budget used (X/200K)
     - Project context loaded (binora, other)
     - Skills already activated
     - Agents already running
   ```

3. **Verify Token Budget**
   ```
   Current budget: X/200K tokens

   Thresholds:
     <75% (150K)   → ✅ Safe: Proceed normally
     75-87.5%      → ⚠️ Warning: Avoid large files (>10K)
     87.5-95%      → 🚨 Alert: Coordinate with knowledge-preserver
     >95% (190K)   → 🔥 Critical: MANDATORY cleanup
   ```

4. **Decision Gate**
   ```
   IF content already cached:
     → Skip loading, reference previous read
     → Estimated savings: 3K-10K tokens
   ELSE:
     → Proceed to Phase 1 (Evaluation)
   ```

**Output**: Decision to skip loading (if cached) or proceed to evaluation.

---

### Phase 1: Evaluation (Request Analysis)

**Objective**: Understand user's request through keyword detection, complexity scoring, and prompt quality assessment.

**Steps**:

1. **Keyword Detection** (Weighted Scanning)
   ```
   Scan user message for keywords with priority weights:

   CRITICAL (100 weight):
     - tenant_id, deploy, production, security, secrets
     → Action: BLOCK if violations detected

   HIGH (75 weight):
     - performance, N+1, slow, optimization, refactor
     → Action: Require validation gates

   MEDIUM (50 weight):
     - test, coverage, serializer, ViewSet, query
     → Action: Standard workflow

   LOW (25 weight):
     - style, formatting, comments, docs
     → Action: Quick fix, minimal overhead
   ```

2. **Complexity Scoring (0-100)**
   ```
   Formula: File Count (0-25) + Duration (0-25) + Dependencies (0-25) + Risk (0-25)

   Factor 1: File Count
     - Keyword: "fix" → 1 file → 2.5pts
     - Keyword: "implement" → 3 files → 7pts
     - Keyword: "full stack" → 10 files → 15pts

   Factor 2: Duration
     - "fix" → 30 min → 5pts
     - "implement" → 90 min → 15pts
     - "architecture" → 240 min → 25pts

   Factor 3: Dependencies
     - None → 0pts
     - 1-2 → 5pts
     - 3-5 → 10pts
     - 6-10 → 15pts
     - 11+ → 20-25pts

   Factor 4: Risk
     - payment, security → 5pts (CRITICAL)
     - authentication → 4pts (HIGH)
     - performance → 3pts (MEDIUM)
     - ML/AI → 2pts (MEDIUM)

   Total Score:
     0-20   → Direct answer (no tools)
     21-40  → 1 skill
     41-60  → 1 agent + skills
     61-80  → 2-3 agents
     81-100 → 3+ agents (decompose required)
   ```

3. **Prompt Quality Assessment (100-point checklist)**
   ```
   5 Sections:

   1. Clarity & Specificity (25pts)
      - Action verbs (5pts): Refactor, Analyze, Implement (not "fix", "update")
      - File paths (5pts): Absolute paths with line numbers
      - Quantifiable criteria (5pts): <150ms, >80% coverage
      - Technical precision (5pts): Framework + version + domain terms
      - No vague language (5pts): Zero "maybe", "somehow", "stuff"

   2. Context & Domain (25pts)
      - Architecture clarity (5pts): Service-oriented + DI + Repository
      - Tech stack (6pts): All dependencies with versions
      - Error details (6pts): Error message + stack + reproduction
      - Edge cases (4pts): 3+ edge cases with handling
      - Current state (4pts): Baseline metrics + current implementation

   3. Structure (20pts)
      - XML tags (8pts): <task>, <context>, <requirements>, <output_format>
      - Numbered steps (6pts): Sequential 1, 2, 3...
      - Output format (6pts): Structured with sub-tags

   4. Advanced Techniques (15pts)
      - Chain of Thought (5pts): <thinking> tags for complex tasks
      - Few-Shot Examples (5pts): 3+ before/after examples
      - Quote Grounding (5pts): Explicit quotes for long files

   5. Actionability (15pts)
      - Dependencies (3pts): Packages with versions + imports
      - Commands (4pts): Complete with flags
      - Success criteria (4pts): Measurable validation
      - Test strategy (2pts): Unit tests with mocks
      - Immediately executable (2pts): No clarifying questions needed

   Score:
     95-100 → Exceptional (proceed directly)
     85-94  → Excellent (minor tweaks)
     70-84  → Good (targeted refinements)
     60-69  → Fair (requires iteration)
     <60    → Poor (apply enhancement patterns)
   ```

4. **Dependency Analysis**
   ```
   Determine execution strategy based on task dependencies:

   SEQUENTIAL (tasks have dependencies):
     Example: Plan feature → Generate service → Generate tests
     Indicator: Step N needs output from Step N-1

   PARALLEL (tasks independent):
     Example: Run 4 audits (security + performance + quality + deployment)
     Indicator: No shared state, results combined after all complete

   HYBRID (mix of dependencies):
     Example: Load context (seq) → Run 3 audits (parallel) → Aggregate (seq)
     Indicator: Some sequential steps with parallel sub-steps
   ```

5. **Confidence Assessment**
   ```
   Rate confidence for proceeding:

   95%+ (Execute directly):
     - Standard library functions
     - Files already read in this session
     - User-provided explicit paths
     - Well-known patterns

   70-94% (Hedge + Verify):
     - Project-specific code structure
     - Config files (likely location)
     - Constructed file paths
     → Use hedge language ("likely", "should")
     → Verify with Glob/Grep after claiming

   <70% (Ask for clarification):
     - Ambiguous requirements
     - Multiple valid approaches
     - Missing critical information
     → Use AskUserQuestion tool
   ```

**Output**: Execution strategy decision (sequential/parallel/hybrid), complexity score, prompt quality score, confidence level.

---

### Phase 2: Context Loading (Progressive Disclosure)

**Objective**: Load minimal necessary context (<3K tokens).

**Steps**:

1. **Detect Context Needs** (Use context-detector agent)
   ```
   Agent: context-detector
   Input: User request + keywords + complexity score
   Output: List of needed context

   Example Output:
   {
     "project_context": "binora",  // /load-project binora
     "commands": ["/load-anti-hallucination", "/django-coverage"],
     "skills": ["django-query-optimizer", "binora-multi-tenant-guardian"],
     "references": []  // Don't load yet (on-demand only)
   }
   ```

2. **Load Commands Progressively**
   ```
   Load in order of priority:

   Priority 1 (CRITICAL keywords detected):
     - /load-anti-hallucination (if files/functions mentioned)
     - /load-security (if "security", "deploy", "production")

   Priority 2 (HIGH keywords detected):
     - /load-testing-strategy (if "test", "coverage")
     - /load-refactoring-patterns (if "refactor", "improve")
     - /django-query-analysis (if "N+1", "slow query")

   Priority 3 (Project-specific):
     - /load-project binora (if "binora", "multi-tenant")
     - /load-project {name} (if project keywords in YAML)

   DO NOT LOAD:
     - References (orchestration-workflow.md, etc.) - load on-demand only
     - Examples unless complexity >80
   ```

3. **Auto-Activate Skills** (Based on YAML frontmatter)
   ```
   Match keywords against skill activation metadata:

   Example: User says "Create Django ViewSet"
     Keywords: "django", "viewset"

   Scan .claude/skills/*/SKILL.md for:
     ---
     activation:
       keywords: [django, viewset, service layer]
     ---

   Auto-activate:
     - django-architecture-enforcer (prevents business logic in views)
     - django-drf-serializer-patterns (Input/Output separation)
   ```

4. **Project Context Loading**
   ```
   IF project keywords detected (binora, specific project name):
     → Execute: /load-project {name}
     → Loads:
       - README.md (quick overview)
       - CLAUDE.md (project-specific instructions)
       - core/*.md (architecture, forbidden, testing, code-style)
     → Token cost: ~1,500 tokens
     → Time: <2 seconds
   ```

5. **Validate Context Size**
   ```
   Total context loaded: X tokens

   Target: <3K tokens (optimal)
   Warning: 3K-5K tokens (acceptable)
   Alert: >5K tokens (reduce, use references on-demand)

   IF >5K:
     → Use progressive disclosure
     → Load summaries, not full content
     → Use Context7 MCP for docs (~500 tokens vs 5K)
   ```

**Output**: Loaded context <3K tokens, skills auto-activated, project context loaded.

---

### Phase 3: Planning (Tool Selection & Strategy)

**Objective**: Select optimal tools and determine execution strategy.

**Steps**:

1. **Tool Type Selection**
   ```
   Based on complexity score and task nature:

   COMMANDS (≤30s execution):
     Complexity: Any
     Use when: Quick checks, validations, coverage reports
     Examples:
       - /validate-claim (verify file exists)
       - /django-coverage (check test coverage)
       - /binora-check-tenant (validate multi-tenant compliance)

   SKILLS (validation rules, instant):
     Complexity: Any
     Use when: Pattern enforcement during execution
     Examples:
       - django-query-optimizer (prevent N+1)
       - binora-multi-tenant-guardian (block manual tenant_id)
       - django-architecture-enforcer (business logic in services)

   AGENTS (>30s execution, complex tasks):
     Complexity: 41+
     Use when: Code generation, analysis, multi-file work
     Examples:
       - django-test-generator (create test suite)
       - security-auditor (comprehensive security scan)
       - feature-planner (design architecture)

   MCPs (structured data, caching):
     Complexity: Any
     Use when: Git operations, docs access, memory storage
     Examples:
       - mcp__git__status (3x faster than git status)
       - mcp__fetch__* (10x faster when cached)
       - mcp__memory__* (persistent cross-session)
   ```

2. **Agent Count Decision**
   ```
   Based on complexity and scope:

   Complexity 0-40 (Simple):
     → 0 agents (direct execution or 1 skill)

   Complexity 41-60 (Standard):
     → 1 agent + supporting skills
     Example: "Generate tests" → django-test-generator + django-testing-patterns

   Complexity 61-80 (Complex):
     → 2-3 agents (OPTIMAL range)
     Example: "Implement feature" → feature-planner + service-generator + test-generator

   Complexity 81-100 (Very Complex):
     → 3-5 agents (warn if >5)
     Example: "Pre-deployment audit" → security + performance + quality + deployment

   WARN if >5 agents:
     "HIGH AGENT COUNT: X agents detected. O(n²) coordination complexity.
      Consider phasing this work (optimal: 2-5 agents)."

   BLOCK if >10 agents:
     "EXCESSIVE AGENT COUNT: X agents. Decompose into phases:
      Phase 1: [agents 1-5]
      Phase 2: [agents 6-10]"
   ```

3. **Execution Strategy Determination**
   ```
   Based on task dependencies (not complexity):

   SEQUENTIAL (dependencies exist):
     When: Step N needs output from Step N-1
     Pattern:
       Step 1: Plan architecture
       ↓ (wait for completion)
       Step 2: Generate service (uses architecture)
       ↓ (wait for completion)
       Step 3: Generate tests (uses service)

     Tool invocation: One tool per message, wait for response

   PARALLEL (independent tasks):
     When: No shared state, results combined after
     Pattern:
       Parallel: [
         Security audit,
         Performance audit,
         Quality audit,
         Deployment check
       ]

     Tool invocation: All tools in SINGLE message
     Speedup: 3-5x (4 tasks in time of 1)

   HYBRID (mixed dependencies):
     When: Some sequential with parallel sub-steps
     Pattern:
       Step 1: Load context (sequential)
       ↓
       Step 2: [Parallel audits] (parallel)
       ↓
       Step 3: Aggregate results (sequential)

     Tool invocation: Sequential steps, parallel within steps
   ```

4. **Define Validation Checkpoints**
   ```
   Quality gates to check BEFORE presenting results:

   Gate 1: Linting & Type Checking
     - ruff, black, mypy (Python)
     - eslint, prettier, tsc (TypeScript)
     → Criterion: 0 errors

   Gate 2: Tests
     - pytest (Python)
     - vitest (TypeScript)
     → Criterion: All tests pass

   Gate 3: Security
     - Secrets detection
     - SQL injection patterns
     - XSS vulnerabilities
     → Criterion: 0 CRITICAL issues

   Gate 4: Architecture Compliance
     - Service layer enforced
     - No manual tenant_id
     - Constructor DI used
     → Criterion: 0 P0 violations

   Gate 5: Performance
     - Query analysis (N+1 detection)
     - Response time targets
     → Criterion: Meets targets or warns
   ```

5. **Task Decomposition**
   ```
   Break into optimal subtask count:

   Target: 3-7 subtasks (optimal cognitive load)

   Too granular (<3 subtasks):
     Example: "Fix typo" → Just 1 task (no decomposition needed)

   Optimal (3-7 subtasks):
     Example: "Implement auth feature"
     1. Design JWT architecture (RS256, refresh tokens)
     2. Create AuthService with login/logout/refresh
     3. Create AuthSerializer (Input/Output separation)
     4. Create AuthViewSet (thin controller)
     5. Generate comprehensive test suite
     6. Run security validation
     7. Update API documentation

   Too coarse (>7 subtasks):
     Example: Breaking "Create service" into 15 micro-steps
     → Recombine into logical groups
   ```

**Output**: Tool selection (commands/skills/agents/MCPs), execution strategy (sequential/parallel/hybrid), validation checkpoints defined, task decomposition (3-7 subtasks).

---

### Phase 4: Execution (Run the Plan)

**Objective**: Execute the planned workflow with proper tracking and validation.

**Steps**:

1. **Initialize TodoWrite**
   ```
   Create todos for tasks requiring:
     - 3+ steps OR
     - >5 seconds execution time

   Rules:
     - Mark in_progress BEFORE starting (exactly ONE at a time)
     - Mark completed IMMEDIATELY after finishing (don't batch)
     - If blocked: keep in_progress, create new todo for blocker

   Example:
   [
     {"content": "Plan auth architecture", "status": "in_progress", "activeForm": "Planning architecture"},
     {"content": "Generate AuthService", "status": "pending", "activeForm": "Generating service"},
     {"content": "Generate tests", "status": "pending", "activeForm": "Generating tests"},
     {"content": "Run security validation", "status": "pending", "activeForm": "Validating security"}
   ]
   ```

2. **Pre-Execution Health Checks**
   ```
   Run BEFORE workflow execution:

   Check 1: System Health
     health = metrics.get_health_score()

     Score 80-100 → Healthy (proceed)
     Score 50-79  → Degraded (warn, proceed with caution)
     Score 0-49   → Unhealthy (ABORT, fix issues first)

     Factors:
       - Success rate <100%: up to -40pts
       - Queue depth >50: up to -30pts
       - API errors >20%: up to -20pts
       - Response time >1000ms: up to -10pts

   Check 2: Agent Count
     IF agent_count > 5:
       WARN: "High agent count (X). Consider phasing."
     IF agent_count > 10:
       BLOCK: "Excessive agent count. Decompose required."

   Check 3: Circular Dependencies
     Run DFS cycle detection on task graph
     IF circular dependency detected:
       BLOCK: "Cannot execute. Fix dependency cycle first."

   Check 4: Resource Availability
     queue_depth = metrics.get_queue_metrics(hours=1)
     IF queue_depth > 100:
       WARN: "System overloaded. Expect delays."
   ```

3. **Execute Per Strategy**
   ```
   SEQUENTIAL execution:
     for task in tasks:
       mark_in_progress(task)
       result = execute(task)
       mark_completed(task)
       wait_for_completion()

   PARALLEL execution:
     tasks_in_parallel = [task1, task2, task3, task4]
     results = execute_all_in_single_message(tasks_in_parallel)
     # All execute simultaneously, wait for all to complete
     mark_all_completed(tasks_in_parallel)

   HYBRID execution:
     # Sequential step 1
     result1 = execute(task1)
     wait_for_completion()

     # Parallel step 2
     results = execute_all([task2, task3, task4])

     # Sequential step 3
     result_final = execute(task5, uses=results)
   ```

4. **Apply Skills Validation**
   ```
   During execution, skills validate in real-time:

   Example: Writing Django ViewSet

   Skill: django-architecture-enforcer
     → Validates: Business logic in services (not views)
     → Blocks: If business logic detected in ViewSet

   Skill: binora-multi-tenant-guardian
     → Validates: NO manual tenant_id filtering
     → Blocks: If .filter(tenant_id=...) detected

   Skill: django-query-optimizer
     → Validates: select_related/prefetch_related used
     → Warns: If N+1 query detected

   IF skill BLOCKS:
     → STOP execution
     → Fix violation
     → Retry from blocked step
   ```

5. **Use Native Tools Priority**
   ```
   Tool selection hierarchy (fastest to slowest):

   1. Native tools (ALWAYS prefer):
      Read('file.ts')           13x faster than cat
      Grep('pattern', '*.ts')    8x faster than grep -r
      Glob('**/*.ts')           10x faster than find
      Edit('file', old, new)    15x faster than sed

   2. MCP tools (when beneficial):
      mcp__git__status           3x faster than git status
      mcp__fetch__*(cached)     10x faster than WebFetch
      mcp__memory__*            10x faster than file writes

   3. Bash (ONLY when necessary):
      git operations (if no MCP)
      npm/pip/cargo commands
      System operations (mkdir, cp, mv)

   NEVER use Bash for:
     - Reading files (use Read)
     - Searching code (use Grep)
     - Finding files (use Glob)
     - Editing files (use Edit)
     - Writing files (use Write)
   ```

6. **Mark Todos Completed Immediately**
   ```
   Anti-pattern (batching):
     ❌ Complete 3 tasks, then mark all 3 completed at once

   Correct pattern (immediate):
     ✅ Complete task 1 → Mark completed immediately
     ✅ Complete task 2 → Mark completed immediately
     ✅ Complete task 3 → Mark completed immediately

   Why: Provides real-time progress visibility to user
   ```

**Output**: Executed code/config/tests with real-time TodoWrite tracking, skills validation applied, native tools used.

---

### Phase 5: Validation (Quality Gates)

**Objective**: Verify quality before presenting results to user.

**Steps**:

1. **Quality Gates Execution**
   ```
   Run all quality checks in parallel:

   Gate 1: Linting
     Python: ruff check . && black --check .
     TypeScript: eslint . && prettier --check .

     Pass: 0 linting errors
     Fail: Fix errors, re-run

   Gate 2: Type Checking
     Python: mypy --strict .
     TypeScript: tsc --noEmit

     Pass: 0 type errors
     Fail: Fix errors, re-run

   Gate 3: Tests
     Python: pytest tests/ -v --cov=app --cov-report=html
     TypeScript: vitest run --coverage

     Pass: All tests pass
     Warn: Coverage <80%
     Fail: Tests failing, fix first

   IF any gate FAILS:
     → DO NOT present to user
     → Fix issues
     → Re-run gates
     → Proceed only when all pass
   ```

2. **Security Validation**
   ```
   Priority-based checks:

   CRITICAL (must pass):
     1. Secrets detection
        Pattern: OpenAI keys, GitHub tokens, AWS keys, DB passwords
        Tool: Grep for common patterns
        Action: BLOCK if detected

     2. SQL Injection
        Pattern: String concatenation in SQL queries
        Example: f"SELECT * FROM users WHERE id={user_id}"
        Action: BLOCK, use parameterized queries

     3. Manual tenant_id (Binora-specific)
        Pattern: .filter(tenant_id=...)
        Tool: binora-multi-tenant-guardian skill
        Action: BLOCK if detected

   HIGH (warn strongly):
     4. XSS vulnerabilities
        Pattern: Unescaped user input in HTML
        Action: Warn, recommend framework escaping

     5. Missing CSRF protection
        Pattern: State-changing endpoints without CSRF
        Action: Warn, add CSRF middleware

     6. Weak authentication
        Pattern: Plain text passwords, weak hashing
        Action: Warn, use Argon2id

   MEDIUM (advisory):
     7. Missing rate limiting
     8. Verbose error messages (info leak)
   ```

3. **Architecture Compliance**
   ```
   Run validators in parallel:

   Validator 1: binora-multi-tenant-enforcer (if Binora)
     Check: NO manual tenant_id filtering
     Pass: All queries use transparent isolation
     Fail: Manual tenant_id detected

   Validator 2: django-codebase-auditor (if Django)
     Check: Service layer compliant
     Pass: Business logic in services, views are thin
     Fail: Business logic in views/serializers

   Validator 3: django-query-optimizer (if Django)
     Check: No N+1 queries
     Pass: select_related/prefetch_related used
     Warn: N+1 detected (recommend optimization)

   IF CRITICAL violations:
     → BLOCK deployment
     → Fix violations
     → Re-validate
   ```

4. **Performance Checks**
   ```
   Check against targets:

   Django API: <200ms p95
     Tool: /django-query-analysis
     Metric: EXPLAIN ANALYZE query plans

   WebSocket: <100ms latency
     Tool: Performance profiler
     Metric: Message round-trip time

   Frontend: <200ms render
     Tool: Lighthouse, vitest benchmarks
     Metric: Component render time

   IF targets NOT met:
     → Warn user (don't block unless explicitly requested)
     → Recommend optimizations
     → Track for future improvement
   ```

5. **Self-Validation (Confidence + Verification)**
   ```
   Assess confidence for all claims made:

   For each file/function mentioned:
     Step 1: Glob to verify file exists
     Step 2: Grep to verify function exists
     Step 3: Read to confirm implementation

   Example:
     Claim: "The authenticate() method is in UserService at line 87"

     Verify:
       1. Glob('**/user_service.py')
          → Found: app/services/user_service.py

       2. Grep('def authenticate', 'app/services/user_service.py')
          → Found at line 87

       3. Read('app/services/user_service.py', offset=85, limit=10)
          → Confirmed: Method signature matches

     Confidence: 95% (verified)

   IF confidence <70%:
     → Ask user for clarification
     → Do NOT proceed with assumptions
   ```

6. **Auto-Documentation Check**
   ```
   Verify NO unwanted docs created:

   Allowed (only if user requested):
     ✅ User: "Document this API" → Create API docs
     ✅ User: "Add JSDoc comments" → Add JSDoc
     ✅ User: "Update README" → Update README

   Forbidden (unless requested):
     ❌ Auto-create README.md
     ❌ Auto-add JSDoc to all functions
     ❌ Auto-generate API documentation
     ❌ Auto-create diagrams

   Rule: Show explanations on screen, save docs only when asked
   ```

**Output**: Pass/fail report for all quality gates, security validation results, architecture compliance status, performance check results.

---

### Phase 6: Consolidation (Learning & Improvement)

**Objective**: Learn from execution and propose improvements for future sessions.

**Steps**:

1. **Document Knowledge**
   ```
   Update AI_*.md files when applicable:

   AI_BUGS_KNOWLEDGE.md (when bug fixed):
     Format:
       BUG-YYYYMMDDNN - [Title]

       ## Root Cause
       [What caused the bug]

       ## Solution
       [How it was fixed]

       ## Prevention
       [How to prevent recurrence]

     Example:
       BUG-2025011801 - N+1 query in UserService.get_with_orders()

       Root Cause: Missing select_related() for orders relationship
       Solution: Added .select_related('orders') to queryset
       Prevention: Always use eager loading for relationships accessed in loops

   AI_PRODUCT_DECISIONS.md (when design decision made):
     Format:
       DECISION-YYYYMMDDNN - [Title]

       ## Context
       [Why decision was needed]

       ## Decision
       [What was decided]

       ## Rationale
       [Why this approach]

       ## Alternatives Considered
       [Other options and why rejected]

   AI_PROGRESS_TRACKER.md (when work completed):
     Update completion percentages and next priorities
   ```

2. **Update Memory** (Cross-Session Learning)
   ```
   Store 4 pattern types for future sessions:

   Pattern 1: Routing Patterns
     memory.store_routing_pattern(
       prompt="Create REST API for users",
       selected_agent="backend-dev",
       success=True,
       confidence=95
     )

     Future benefit: Auto-route similar requests

   Pattern 2: Complexity Calibration
     memory.store_complexity_calibration(
       prompt=prompt,
       estimated_complexity=27,
       actual_complexity=32,
       factors={'file_count': 8, 'duration': 10, 'dependencies': 5, 'risk': 4}
     )

     Future benefit: Self-correcting estimates (calibration factor)

   Pattern 3: Bottleneck Detection
     memory.store_bottleneck(
       type="sequential_reads",
       description="5 files read sequentially",
       improvement="Execute Read calls in parallel",
       estimated_savings="4x speedup",
       occurrences=12
     )

     Future benefit: Proactive optimization suggestions

   Pattern 4: Improvement Proposals
     memory.store_improvement(
       pattern="Glob('**/*.ts') used 5 times",
       proposal="Create /find-ts-files command",
       effort="5 minutes",
       impact="2x faster file discovery",
       priority="medium"
     )

     Future benefit: Automation suggestions after 3+ occurrences
   ```

3. **Pattern Detection** (3+ Occurrences)
   ```
   Detect recurring patterns across execution:

   Pattern: Sequential file reads
     Detected: Read files one-by-one in 3+ different tasks
     Suggestion: "Consider parallelizing file reads (3-5x speedup)"
     Timing: End of task

   Pattern: Repeated Bash for file operations
     Detected: cat/grep/find used 3+ times instead of Read/Grep/Glob
     Suggestion: "Use native tools (13x faster than Bash for file ops)"
     Timing: End of task

   Pattern: Same Glob pattern 3+ times
     Detected: Glob('**/*.ts') used 5 times
     Suggestion: "Create /find-ts-files command? (1-step vs 3-step)"
     Timing: Daily summary

   Pattern: Utils function in 3+ files
     Detected: validateEmail() duplicated in 3 files
     Suggestion: "Extract to shared utils? (DRY principle)"
     Timing: End of task

   Limits:
     - Max 2 suggestions per hour
     - Max 5 suggestions per session
     - Min 15 minutes between suggestions
   ```

4. **Performance Metrics Recording**
   ```
   Track metrics for learning:

   Metrics collected:
     - Duration: Total execution time (seconds)
     - Token usage: Total tokens consumed
     - Tool invocations: Count per tool type
       {
         "Read": 5,
         "Grep": 2,
         "Edit": 3,
         "Agents": {"django-test-generator": 1}
       }
     - Speedup achieved: Actual vs baseline
       Example: Parallel execution → 3.5x speedup
     - Success rate: Tasks completed / Tasks attempted
       Example: 19/20 = 95%

   Storage:
     memory.record_execution(
       duration=45,
       tokens=12000,
       tools={'Read': 5, 'Grep': 2, 'Edit': 3},
       speedup=3.5,
       success=True
     )

   Future use:
     - Calibrate complexity estimates
     - Identify bottlenecks
     - Optimize tool selection
     - Improve performance predictions
   ```

5. **Proactive Suggestions** (Timing-Based)
   ```
   Suggestion timing rules:

   IMMEDIATE (errors):
     Trigger: Error detected during execution
     Example: "N+1 query detected in UserService"
     Suggestion: "Add select_related() for orders relationship"
     Timing: Immediately after error

   END-OF-TASK (workflows):
     Trigger: Task completed successfully
     Example: "Parallelized 5 file reads (3.5x speedup achieved)"
     Suggestion: "Consider this pattern for future file operations"
     Timing: After task completion, before presenting results

   DAILY SUMMARY (patterns):
     Trigger: 3+ occurrences of same pattern detected
     Example: "Glob('**/*.ts') used 7 times today"
     Suggestion: "Create /find-ts-files command for efficiency?"
     Timing: End of day or session

   Acceptance tracking:
     - Record: User accepts or rejects suggestion
     - Learn: Adjust suggestion confidence for future
     - Target: 60%+ acceptance rate
   ```

**Output**: Knowledge documented in AI_*.md files, patterns stored in memory for cross-session learning, performance metrics recorded, proactive suggestions proposed (if patterns detected).

---

## Part 1: 60-Point Validation Checklist

Apply across all 6 orchestration phases to ensure quality execution.

### Layer 1: Analysis (12 points)

| Checkpoint | Points | Validation Criteria | Pass Threshold |
|------------|--------|---------------------|----------------|
| **Task Routing** | 3pts | Keywords detected → Correct agent/skill matched | Agent confidence >70% |
| **Prompt Quality** | 3pts | Score ≥70/100 (specificity, context, structure, XML tags) | Score ≥70 |
| **Context Detection** | 3pts | Loaded only necessary context, <3K tokens total | Tokens <3K |
| **Dependency Analysis** | 3pts | Execution strategy correct (sequential/parallel/hybrid) | Strategy justified |

**Total Layer 1**: 12 points
**Pass**: ≥9 points (75%)

---

### Layer 2: Planning (12 points)

| Checkpoint | Points | Validation Criteria | Pass Threshold |
|------------|--------|---------------------|----------------|
| **Complexity Scoring** | 3pts | 0-100 score accurate (file count, duration, dependencies, risk) | Score within ±10 of actual |
| **Decomposition** | 3pts | Tasks appropriately broken down (not too granular/coarse) | 3-7 subtasks optimal |
| **Agent Count** | 3pts | 2-5 agents optimal (warn if >5, block if >10) | Agent count ≤5 |
| **Validation Gates** | 3pts | Quality checkpoints defined before execution | Checkpoints documented |

**Total Layer 2**: 12 points
**Pass**: ≥9 points (75%)

---

### Layer 3: Execution (14 points)

| Checkpoint | Points | Validation Criteria | Pass Threshold |
|------------|--------|---------------------|----------------|
| **Parallel Execution** | 4pts | Independent operations in single message (3-5x speedup) | Parallelization applied |
| **Tool Selection** | 3pts | Native tools > Bash (Read/Grep/Glob/Edit preferred) | Native tools used |
| **TodoWrite Usage** | 3pts | Tasks tracked, 1 in_progress, completed immediately | TodoWrite active |
| **Health Monitoring** | 4pts | Pre-checks passed, no circular dependencies, system healthy | All checks passed |

**Total Layer 3**: 14 points
**Pass**: ≥11 points (78%)

---

### Layer 4: Validation (12 points)

| Checkpoint | Points | Validation Criteria | Pass Threshold |
|------------|--------|---------------------|----------------|
| **Auto-Documentation** | 3pts | No unwanted docs (README, JSDoc) unless requested | Zero unwanted docs |
| **Quality Gates** | 3pts | Linting, tests, type checks passed | All checks passed |
| **Security Checks** | 3pts | No secrets, SQL injection, XSS vulnerabilities | Zero security issues |
| **Self-Validation** | 3pts | Confidence assessed, claims verified (Glob→Grep→Read) | Confidence >70% |

**Total Layer 4**: 12 points
**Pass**: ≥9 points (75%)

---

### Layer 5: Learning (10 points)

| Checkpoint | Points | Validation Criteria | Pass Threshold |
|------------|--------|---------------------|----------------|
| **Memory Tool Usage** | 3pts | Patterns stored for cross-session learning | Memory API called |
| **Pattern Detection** | 3pts | Recurring patterns identified (3+ occurrences) | Patterns documented |
| **Proactive Suggestions** | 2pts | Improvements proposed (timing: errors=immediate, workflows=end) | Suggestions made |
| **Metrics Tracking** | 2pts | Performance metrics recorded (duration, tokens, tools, speedup) | Metrics logged |

**Total Layer 5**: 10 points
**Pass**: ≥7 points (70%)

---

### Overall Scoring

| Total Score | Grade | Interpretation |
|-------------|-------|----------------|
| **54-60pts** | ✅ Excellent | Production-ready orchestration |
| **48-53pts** | 🟢 Good | Minor improvements possible |
| **42-47pts** | 🟡 Fair | Targeted refinements needed |
| **36-41pts** | 🟠 Poor | Significant rework required |
| **<36pts** | 🔴 Critical | Major issues, re-plan workflow |

---

## Part 2: Decision Trees

Visual flowcharts for orchestration decisions.

### Master Orchestration Flow

```
User Request
    ↓
[Pre-Analysis: Cache Check]
    ↓
[Phase 1: Evaluation]
├─ Keyword Detection (CRITICAL/HIGH/MEDIUM/LOW)
├─ Complexity Scoring (0-100)
├─ Prompt Quality Assessment (0-100)
└─ Dependency Analysis (Sequential/Parallel/Hybrid)
    ↓
[Phase 2: Context Loading]
├─ Load only necessary context (<3K tokens)
├─ Auto-activate matching skills
└─ Enhance prompt if quality <70%
    ↓
[Phase 3: Planning]
├─ Select tools (Commands/Skills/Agents/MCPs)
├─ Determine execution strategy
└─ Plan validation checkpoints
    ↓
[Phase 4: Execution]
├─ TodoWrite tracking
├─ Execute per strategy
├─ Apply skills validation
└─ Monitor health
    ↓
[Phase 5: Validation]
├─ Quality checks (linting, tests, types)
├─ Security checks (secrets, SQL injection, XSS)
├─ Architecture compliance
└─ Performance checks
    ↓
[Phase 6: Consolidation]
├─ Document knowledge (AI_*.md)
├─ Update memory (cross-session)
├─ Detect patterns (3+ occurrences)
└─ Propose improvements
    ↓
Result Delivered
```

---

### Tool Selection Decision Tree

```
Analyze Task
    ↓
Is it a quick check (<30s)?
    YES → Use COMMAND (/validate-claim, /django-coverage)
    NO → Continue
    ↓
Is it pattern enforcement/validation?
    YES → Use SKILL (django-query-optimizer, multi-tenant-guardian)
    NO → Continue
    ↓
Is it complex analysis or code generation (>30s)?
    YES → Use AGENT (django-test-generator, security-auditor)
    NO → Continue
    ↓
Is it structured data or benefits from caching?
    YES → Use MCP (mcp__git__status, mcp__memory__store)
    NO → Use direct tool (Read/Grep/Glob/Edit)
```

---

### Execution Strategy Decision Tree

```
Analyze Task Dependencies
    ↓
Do subtasks have dependencies?
    YES → Are dependencies LINEAR?
        YES → SEQUENTIAL execution
        NO → Complex dependencies
            ↓
            Can be phased?
                YES → HYBRID (sequential phases, parallel within)
                NO → Re-decompose task
    NO → Are subtasks INDEPENDENT?
        YES → How many subtasks?
            1-2 → SEQUENTIAL (overhead not worth parallelization)
            3-5 → PARALLEL execution (optimal)
            6-10 → PARALLEL with load balancing
            >10 → WARN: Consider phasing or agent count reduction
        NO → Error: Cannot determine dependencies
```

---

### Agent Count Decision Tree

```
Count Required Agents
    ↓
How many agents needed?
    0-1 → Use skills or direct execution
    2-5 → ✅ OPTIMAL: Proceed with parallel execution
    6-10 → ⚠️ WARNING: High coordination overhead
        ↓
        Can be phased into <5 agents per phase?
            YES → Proceed with phasing
            NO → Ask user to split task
    >10 → 🚨 CRITICAL: Complexity explosion
        ↓
        BLOCK execution
        Suggest phasing or task decomposition
```

---

## Part 3: Agent Coordination

### Skills vs Agents Decision Matrix

| Factor | Use **Skills** | Use **Agents** |
|--------|----------------|----------------|
| **Duration** | <5 minutes | >5 minutes |
| **Complexity** | Single domain, real-time guidance | Multi-step workflows, analysis |
| **Execution** | Instant validation/enforcement | Asynchronous subtasks |
| **Parallelization** | Not applicable | Can run 2-5 agents in parallel |
| **Use Cases** | Architecture review, query optimization, security audit | Documentation, refactoring, batch operations |

**Decision Algorithm**:
```
IF task_duration < 5min AND single_domain:
  → USE SKILL (real-time guidance)

ELSE IF task_duration > 5min AND multi_step:
  IF subtasks_independent AND count(subtasks) <= 5:
    → USE AGENTS (parallel execution)
  ELSE IF subtasks_sequential OR count(subtasks) > 5:
    → USE SKILL + Manual breakdown

ELSE:
  → USE SKILL (default to simpler approach)
```

---

### Parallel Orchestration (2-5 Agents Optimal)

**Research Finding**: 2-5 agents optimal, >5 agents = exponential complexity increase (O(n²) coordination).

#### Why Limit to 5 Agents?

| Agent Count | Communication Channels | Coordination Overhead | Speedup |
|-------------|------------------------|----------------------|---------|
| 1-2 | 1 | Minimal | Linear |
| 3-5 | 3-10 | Acceptable | 3-5x optimal |
| 6-10 | 15-45 | High | Diminishing returns |
| >10 | 55+ | Exponential | Negative (slower than sequential) |

**Formula**: Communication channels = n(n-1)/2

---

### Parallel Execution Strategy

**Pattern**: Launch agents concurrently → Collect results → Synthesize.

**Example**:
```
User: "Document current sprint: features, bugs, progress"

Agent Coordination:
- Complexity: High (3 independent subtasks)
- Strategy: Parallel delegation

Launch in parallel:
1. @progress-tracker: "Generate sprint summary"
2. @decision-documenter: "List completed features"
3. @bug-documenter: "List fixed bugs"

[All 3 run simultaneously, ~3min each]

Synthesis:
- Collect results from 3 agents
- Cross-reference feature IDs
- Generate unified report
- Total time: ~4min (vs 12min sequential)
```

---

### Workload Distribution

**Goal**: Distribute work evenly to minimize total time.

#### Unbalanced (Inefficient)
```
Agent 1: 10 files (30min) ← Bottleneck
Agent 2: 2 files (6min)
Agent 3: 1 file (3min)
Total: 30min (bottlenecked by Agent 1)
```

#### Balanced (Efficient)
```
Agent 1: 5 files (15min)
Agent 2: 4 files (12min)
Agent 3: 4 files (12min)
Total: 15min (50% faster)
```

**Load Balancing Algorithm**:
1. Estimate duration per subtask
2. Sort subtasks by duration (descending)
3. Assign longest tasks first to balance load
4. Max 5 agents (split into phases if needed)

---

### Dependency Management

**Problem**: Some tasks depend on others completing first.

**Solution**: Dependency graph + sequential execution for dependent tasks.

**Example**:
```
User: "Refactor CameraService to use constructor DI, then update screens"

Dependency Graph:
  Task 1: Refactor CameraService (add interface, constructor DI)
    ↓ (Task 2 depends on new CameraServiceInterface)
  Task 2: Update screens (inject CameraServiceInterface)

Execution:
1. Task 1: Complete CameraService refactor (~10min)
2. Validate: CameraServiceInterface exists, tests pass
3. Task 2: Update 3 screens with batch operation (~5min)

Total: ~15min sequential (cannot parallelize due to dependency)
```

---

### Complexity Thresholds

| Complexity | Agent Count | Action | Example |
|------------|-------------|--------|---------|
| **Low (0-25)** | 0 agents, 1 skill | Direct implementation | "Add logging to function" |
| **Medium (26-50)** | 0-1 agents, 2-3 skills | Skill-guided implementation | "Create Isar provider" |
| **High (51-75)** | 2-5 agents | Parallel orchestration | "Implement dark mode" |
| **Very High (76-100)** | Warn user, phase work | Break into phases (max 5 agents/phase) | "Refactor entire architecture" |

---

## Best Practices

### DO ✅

- Use skills for <5min tasks (real-time guidance)
- Use 2-5 agents for parallel work (optimal range)
- Balance workload across agents (minimize bottlenecks)
- Check dependencies before parallel launch
- Phase complex tasks (avoid >5 agents)
- Apply 60-point validation checklist
- Use decision trees for uncertain decisions

### DON'T ❌

- Delegate simple tasks to agents (overhead > benefit)
- Launch >5 agents simultaneously (coordination explosion)
- Parallelize dependent tasks (will fail)
- Ignore complexity warnings (leads to failures)
- Use agents for real-time guidance (skills better)
- Skip validation checkpoints
- Ignore dependency analysis

---

## Quick Reference

**When to load this reference**:
- Need validation checklist for quality assurance
- Uncertain about tool selection (command vs skill vs agent vs MCP)
- Planning parallel execution (>2 agents)
- Complex workflow requiring decision trees
- Agent coordination strategies needed

**Integration with SKILL.md**:
- SKILL.md provides compact checklist (60 points in table)
- This reference provides full context + decision trees + coordination patterns
- Load this when complexity >60 or multi-agent orchestration required

---

**Last Updated**: 2025-01-18
**Source Documents**: ORCHESTRATOR_WORKFLOW_CHECKLIST_UNIVERSAL.md (544 lines), decision-trees.md (526 lines), agent-coordination.md (337 lines)
**Consolidated Size**: ~1,200 lines → ~8K tokens
**Optimization**: Eliminated duplication, unified structure, added visual decision trees