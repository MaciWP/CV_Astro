# Agent System Usage Examples

**Version**: 1.0.0
**Purpose**: 7 real-world scenarios demonstrating the agent system in action

---

## Scenario 1: Multi-Aspect Code Analysis (3x Speedup)

**Goal**: Audit authentication module for security, performance, and quality issues

**User Request**: "Audit src/auth/ for all issues"

**Orchestrator Analysis**:
- Multiple domains: security, performance, quality
- Independent analyses → Parallel execution
- Expected speedup: 3x

**Implementation**:
```typescript
// Orchestrator executes 3 agents in parallel
const [security, performance, quality] = await Promise.all([
  Task({
    subagent_type: 'security-auditor',
    prompt: 'Analyze src/auth/ for vulnerabilities: SQL injection, XSS, hardcoded secrets, weak password validation',
    description: 'Security audit of authentication'
  }),  // 6s

  Task({
    subagent_type: 'performance-analyzer',
    prompt: 'Analyze src/auth/ for performance issues: N+1 queries, missing indexes, cache opportunities, sequential async operations',
    description: 'Performance analysis of authentication'
  }),  // 5s

  Task({
    subagent_type: 'code-quality',
    prompt: 'Analyze src/auth/ for quality issues: complexity >10, code smells, SOLID violations, long functions',
    description: 'Quality audit of authentication'
  })   // 4s
]);

// Aggregate results
const report = {
  security: security.findings,        // 2 critical vulnerabilities
  performance: performance.findings,  // 1 N+1 query, 1 cache miss
  quality: quality.findings,          // 1 function complexity 23
  overallRisk: 'High',
  recommendations: [
    'Fix SQL injection in login.ts (critical)',
    'Add eager loading to user query (3x speedup)',
    'Refactor processLogin() - reduce complexity from 23 to <10'
  ]
};
```

**Timing**:
- Sequential: 6s + 5s + 4s = 15s
- Parallel: max(6s, 5s, 4s) = 6s
- **Speedup**: 2.5x

**Results**:
- Found 2 critical security issues
- Found 1 N+1 query (3x speedup potential)
- Found 1 function with complexity 23

---

## Scenario 2: TDD Feature Implementation (Sequential)

**Goal**: Implement user registration following Test-Driven Development

**User Request**: "Implement user registration with tests"

**Orchestrator Analysis**:
- Dependencies: tests → implementation → verification
- Sequential execution required

**Implementation**:
```typescript
// Step 1: Generate tests (TDD - tests first)
const tests = await Task({
  subagent_type: 'testing-agent',
  prompt: `Generate tests for user registration:
    - Unit tests: email validation, password strength, duplicate email handling
    - Integration tests: API endpoint POST /api/auth/register
    - E2E test: Full registration workflow in browser
    Target: 80% coverage`,
  description: 'Generate registration tests'
});

// Result: Generated 3 test files, 24 test cases
// tests/auth/register.test.ts (8 unit tests)
// tests/auth/register.integration.test.ts (5 integration tests)
// tests/e2e/registration.spec.ts (3 E2E tests)

// Step 2: Implement backend API (tests exist, implement to pass)
const backend = await Task({
  subagent_type: 'backend-expert',
  prompt: `Implement user registration API:
    - POST /api/auth/register endpoint
    - Validate email, password strength (min 8 chars, 1 uppercase, 1 number)
    - Check for duplicate email (query users table)
    - Hash password with bcrypt (12 salt rounds)
    - Store in PostgreSQL users table
    - Return JWT token
    Tests already exist in tests/auth/register.test.ts - make them pass`,
  description: 'Implement registration API'
});

// Result: Created src/api/routes/auth.ts, src/services/authService.ts
// Implemented all requirements

// Step 3: Implement frontend form (API ready)
const frontend = await Task({
  subagent_type: 'frontend-expert',
  prompt: `Build user registration form:
    - Vue 3 component: RegistrationForm.vue
    - Fields: email, password, confirm password, name
    - Real-time validation (email format, password strength)
    - Form submission to POST /api/auth/register
    - Success: redirect to dashboard
    - Error: show user-friendly messages
    - Accessibility: WCAG AA, keyboard navigation`,
  description: 'Build registration UI'
});

// Result: Created src/components/RegistrationForm.vue
// Accessible, responsive, validated

// Step 4: Run all tests and verify
const verification = await Task({
  subagent_type: 'testing-agent',
  prompt: 'Run all registration tests (unit, integration, E2E) and report results',
  description: 'Verify registration implementation'
});

// Result: 22/24 tests passing (92%)
// 2 failing: E2E tests need browser setup
```

**Timing**:
- Tests generation: 10s
- Backend implementation: 15s
- Frontend implementation: 12s
- Verification: 5s
- **Total**: 42s (sequential - dependencies prevent parallelization)

**Results**:
- 24 tests generated
- Full-stack implementation (backend + frontend)
- 92% tests passing (2 E2E tests need setup)
- Production-ready feature

---

## Scenario 3: Refactoring High-Complexity Function

**Goal**: Reduce complexity of `processOrder()` from 23 to <10

**User Request**: "Refactor checkout.ts - complexity is 23, make it <10"

**Orchestrator Analysis**:
- Single domain: refactoring
- Verification needed after refactoring
- Sequential: analyze → refactor → verify

**Implementation**:
```typescript
// Step 1: Analyze current complexity
const analysis = await Task({
  subagent_type: 'code-quality',
  prompt: 'Analyze src/cart/checkout.ts processOrder() function: calculate complexity, identify reasons for high complexity, suggest refactoring strategy',
  description: 'Analyze processOrder complexity'
});

// Result: Complexity 23
// Reasons: Long function (80 lines), deep nesting (5 levels), multiple responsibilities (validation, payment, shipping)
// Strategy: Extract 4 functions: validateOrder, processPayment, createShipment, sendConfirmation

// Step 2: Apply refactoring
const refactored = await Task({
  subagent_type: 'refactor-agent',
  prompt: `Refactor processOrder() in src/cart/checkout.ts:
    - Extract validateOrder() - move validation logic
    - Extract processPayment() - move payment logic
    - Extract createShipment() - move shipping logic
    - Extract sendConfirmation() - move email logic
    - Simplify main function to orchestrate 4 steps
    - Target: complexity <10
    - IMPORTANT: Run tests after refactoring to verify behavior preserved`,
  description: 'Refactor processOrder'
});

// Result: Extracted 4 functions
// processOrder() now: 20 lines, complexity 6
// Each extracted function: <25 lines, complexity <5

// Step 3: Verify tests still pass (behavior preserved)
const verification = await Task({
  subagent_type: 'testing-agent',
  prompt: 'Run tests for checkout module (tests/cart/checkout.test.ts) to verify refactoring preserved behavior',
  description: 'Verify refactoring'
});

// Result: All 18 tests passing ✅
// Behavior preserved, complexity reduced 73% (23 → 6)
```

**Timing**:
- Analysis: 5s
- Refactoring: 12s
- Verification: 3s
- **Total**: 20s

**Results**:
- Complexity reduced from 23 to 6 (73% reduction)
- 4 well-named functions extracted
- All tests passing (behavior preserved)
- More maintainable code

---

## Scenario 4: Security-Driven Refactoring

**Goal**: Find and fix security vulnerabilities

**User Request**: "Find security issues in API and fix them"

**Orchestrator Analysis**:
- Security finding + refactoring needed
- Sequential: audit → fix → verify

**Implementation**:
```typescript
// Step 1: Security audit
const audit = await Task({
  subagent_type: 'security-auditor',
  prompt: 'Full security audit of src/api/: SQL injection, XSS, hardcoded secrets, weak authentication, missing authorization checks',
  description: 'Security audit'
});

// Result: Found 3 critical vulnerabilities
// 1. SQL injection in users.ts:67 (query concatenation)
// 2. Hardcoded JWT secret in auth.ts:12
// 3. Missing authorization check in admin.ts:45

// Step 2: Apply fixes
const fixes = await Task({
  subagent_type: 'refactor-agent',
  prompt: `Fix 3 security vulnerabilities:
    1. src/api/users.ts:67 - Replace query concatenation with parameterized query ($1, $2)
    2. src/auth/jwt.ts:12 - Move JWT secret to environment variable (process.env.JWT_SECRET)
    3. src/api/admin.ts:45 - Add authorization middleware (verifyAdmin) before route handler
    Include code examples for each fix`,
  description: 'Fix security issues'
});

// Result: All 3 vulnerabilities fixed
// 1. Query now uses prepared statements
// 2. JWT secret loaded from .env (throw error if missing)
// 3. Admin routes protected with middleware

// Step 3: Re-audit to verify fixes
const reaudit = await Task({
  subagent_type: 'security-auditor',
  prompt: 'Re-audit src/api/ to verify 3 vulnerabilities were fixed correctly',
  description: 'Verify fixes'
});

// Result: All 3 vulnerabilities resolved ✅
// No new issues introduced

// Step 4: Run tests
const tests = await Task({
  subagent_type: 'testing-agent',
  prompt: 'Run API tests to verify security fixes did not break functionality',
  description: 'Verify functionality'
});

// Result: All 35 API tests passing ✅
```

**Timing**:
- Audit: 8s
- Fixes: 10s
- Re-audit: 5s
- Tests: 4s
- **Total**: 27s

**Results**:
- 3 critical vulnerabilities fixed
- No functionality broken
- All tests passing
- Production-ready secure code

---

## Scenario 5: Performance Optimization Workflow

**Goal**: Optimize slow API endpoint from 5s to <500ms

**User Request**: "The /api/users endpoint takes 5 seconds. Optimize it"

**Orchestrator Analysis**:
- Performance analysis + optimization needed
- Sequential: analyze → optimize → verify

**Implementation**:
```typescript
// Step 1: Analyze bottleneck
const analysis = await Task({
  subagent_type: 'performance-analyzer',
  prompt: 'Analyze /api/users endpoint (src/api/users.ts): identify bottlenecks, measure query time, check for N+1 queries, missing indexes, cache opportunities',
  description: 'Performance analysis'
});

// Result: Found N+1 query
// Main query: SELECT * FROM users (100ms)
// Loop: 100 queries to get posts for each user (4.9s total)
// Total: 5s

// Step 2: Apply optimization
const optimization = await Task({
  subagent_type: 'backend-expert',
  prompt: `Optimize /api/users endpoint:
    - Replace N+1 query with single JOIN query
    - Use json_agg to aggregate posts per user
    - Add Redis caching (5min TTL)
    - Add database index on posts.user_id if missing
    Expected improvement: 5s → <500ms`,
  description: 'Optimize endpoint'
});

// Result:
// 1. Replaced loop with JOIN + json_agg (100 queries → 1 query)
// 2. Added Redis caching (key: "users:all", TTL: 300s)
// 3. Added index: CREATE INDEX idx_posts_user_id ON posts(user_id)

// Step 3: Measure improvement
const measurement = await Task({
  subagent_type: 'performance-analyzer',
  prompt: 'Measure /api/users endpoint after optimization: query time, total response time, verify <500ms target',
  description: 'Measure improvement'
});

// Result:
// Cold cache: 180ms (JOIN query)
// Warm cache: 50ms (Redis hit)
// Improvement: 5000ms → 180ms = 27x faster (cold), 100x faster (warm)

// Step 4: Verify functionality
const verification = await Task({
  subagent_type: 'testing-agent',
  prompt: 'Run integration tests for /api/users to verify optimization preserved correct data structure',
  description: 'Verify functionality'
});

// Result: All 5 tests passing ✅
// Data structure unchanged, functionality preserved
```

**Timing**:
- Analysis: 6s
- Optimization: 12s
- Measurement: 5s
- Verification: 3s
- **Total**: 26s

**Results**:
- 27x faster (5s → 180ms cold cache)
- 100x faster with warm cache (50ms)
- All tests passing
- Production-ready optimization

---

## Scenario 6: Full Project Audit (Maximum Parallelization)

**Goal**: Comprehensive analysis of entire codebase

**User Request**: "Run full audit - security, performance, quality, coverage"

**Orchestrator Analysis**:
- Multiple independent analyses
- Maximum parallelization (4 agents)
- Expected speedup: 4x

**Implementation**:
```typescript
// Execute 4 agents in parallel
const [security, performance, quality, testing] = await Promise.all([
  Task({
    subagent_type: 'security-auditor',
    prompt: 'Full security audit of entire codebase: XSS, SQL injection, secrets, authentication issues, authorization gaps',
    description: 'Full security audit'
  }),  // 30s

  Task({
    subagent_type: 'performance-analyzer',
    prompt: 'Full performance audit: N+1 queries, memory leaks, missing indexes, cache opportunities, bundle size',
    description: 'Full performance audit'
  }),  // 25s

  Task({
    subagent_type: 'code-quality',
    prompt: 'Full quality audit: complexity >10, code smells, SOLID violations, duplication >5%, long functions',
    description: 'Full quality audit'
  }),  // 20s

  Task({
    subagent_type: 'testing-agent',
    prompt: 'Analyze test coverage: current coverage %, identify uncovered files, suggest tests to reach 80%',
    description: 'Coverage analysis'
  })   // 15s
]);

// Aggregate comprehensive report
const report = {
  security: {
    critical: security.findings.filter(f => f.severity === 'Critical').length,
    high: security.findings.filter(f => f.severity === 'High').length,
    total: security.findings.length
  },
  performance: {
    highImpact: performance.findings.filter(f => f.impact === 'High').length,
    avgImpact: performance.findings.reduce((sum, f) => sum + f.expectedImprovement, 0) / performance.findings.length,
    total: performance.findings.length
  },
  quality: {
    highSeverity: quality.findings.filter(f => f.severity === 'High').length,
    avgComplexity: quality.metrics.avgComplexity,
    duplicationRate: quality.metrics.duplicationRate,
    total: quality.findings.length
  },
  testing: {
    currentCoverage: testing.coverageBefore,
    targetCoverage: 80,
    testsNeeded: testing.testsNeeded
  },
  overallScore: calculateOverallScore([security, performance, quality, testing]),
  recommendations: [
    `Fix ${security.findings.filter(f => f.severity === 'Critical').length} critical security issues`,
    `Optimize ${performance.findings.filter(f => f.impact === 'High').length} high-impact performance bottlenecks`,
    `Refactor ${quality.findings.filter(f => f.severity === 'High').length} high-complexity functions`,
    `Add ${testing.testsNeeded} tests to reach 80% coverage`
  ]
};
```

**Timing**:
- Sequential: 30s + 25s + 20s + 15s = 90s
- Parallel: max(30s, 25s, 20s, 15s) = 30s
- **Speedup**: 3x

**Results**:
- Security: 5 critical, 8 high, 12 total vulnerabilities
- Performance: 3 high-impact bottlenecks, avg 15x improvement potential
- Quality: 8 high-severity issues, avg complexity 7.8, duplication 6%
- Testing: 72% coverage, need 15 tests to reach 80%
- Comprehensive action plan

---

## Scenario 7: Feature Development (Multi-Agent Collaboration)

**Goal**: Implement complete "User Profile" feature

**User Request**: "Implement user profile feature: view, edit, avatar upload"

**Orchestrator Analysis**:
- Complex feature, multiple agents needed
- Mixed parallel and sequential execution

**Implementation**:
```typescript
// Phase 1: Generate tests (TDD)
const tests = await Task({
  subagent_type: 'testing-agent',
  prompt: 'Generate tests for user profile feature: view profile, edit profile, upload avatar. Unit + integration + E2E tests',
  description: 'Generate profile tests'
});

// Phase 2: Parallel implementation (backend + frontend)
const [backend, frontend] = await Promise.all([
  Task({
    subagent_type: 'backend-expert',
    prompt: `Implement user profile API:
      - GET /api/users/:id/profile (view profile)
      - PATCH /api/users/:id/profile (edit profile)
      - POST /api/users/:id/avatar (upload avatar)
      Use PostgreSQL for data, Redis for caching, JWT for auth`,
    description: 'Implement profile API'
  }),  // 20s

  Task({
    subagent_type: 'frontend-expert',
    prompt: `Build user profile components:
      - ProfileView.vue (display profile)
      - ProfileEdit.vue (edit form)
      - AvatarUpload.vue (image upload)
      Vue 3, Pinia for state, accessible, responsive`,
    description: 'Build profile UI'
  })   // 18s
]);

// Phase 3: Parallel audits (security + performance + quality)
const [security, performance, quality] = await Promise.all([
  Task({
    subagent_type: 'security-auditor',
    prompt: 'Audit profile feature: authorization (users can only edit own profile), file upload security (avatar), input validation',
    description: 'Security audit profile'
  }),  // 8s

  Task({
    subagent_type: 'performance-analyzer',
    prompt: 'Audit profile feature: cache profile data, optimize avatar uploads (resize, compress), query performance',
    description: 'Performance audit profile'
  }),  // 7s

  Task({
    subagent_type: 'code-quality',
    prompt: 'Audit profile feature: code quality, complexity, duplication, naming conventions',
    description: 'Quality audit profile'
  })   // 6s
]);

// Phase 4: Apply improvements based on audits
const improvements = await Task({
  subagent_type: 'refactor-agent',
  prompt: `Apply improvements to profile feature based on audits:
    - Security: ${security.recommendations.join(', ')}
    - Performance: ${performance.recommendations.join(', ')}
    - Quality: ${quality.recommendations.join(', ')}`,
  description: 'Apply improvements'
});

// Phase 5: Final verification
const verification = await Task({
  subagent_type: 'testing-agent',
  prompt: 'Run all profile tests, verify 80% coverage, check all tests passing',
  description: 'Verify profile feature'
});

// Final report
const featureReport = {
  backend: { endpoint: backend.endpoints.length, status: 'complete' },
  frontend: { components: frontend.components.length, status: 'complete' },
  security: { issues: security.findings.length, status: security.findings.length === 0 ? 'secure' : 'needs fixes' },
  performance: { improvements: performance.findings.length, status: 'optimized' },
  quality: { issues: quality.findings.length, status: 'high quality' },
  tests: { passing: verification.testsPassing, coverage: verification.coverage }
};
```

**Timing**:
- Phase 1 (tests): 12s
- Phase 2 (parallel backend + frontend): max(20s, 18s) = 20s
- Phase 3 (parallel audits): max(8s, 7s, 6s) = 8s
- Phase 4 (improvements): 10s
- Phase 5 (verification): 5s
- **Total**: 55s

**Results**:
- Complete feature (3 API endpoints, 3 components)
- Security audited and secure
- Performance optimized
- High code quality
- 85% test coverage
- Production-ready in <1 minute

---

## Success Metrics Summary

| Scenario | Time (Sequential) | Time (Parallel) | Speedup | Agents Used |
|----------|-------------------|-----------------|---------|-------------|
| 1. Multi-aspect audit | 15s | 6s | 2.5x | 3 parallel |
| 2. TDD feature | 42s | 42s | 1x | 4 sequential (dependencies) |
| 3. Refactoring | 20s | 20s | 1x | 3 sequential (verification) |
| 4. Security fixes | 27s | 27s | 1x | 4 sequential (fix → verify) |
| 5. Performance opt | 26s | 26s | 1x | 4 sequential (measure → optimize) |
| 6. Full audit | 90s | 30s | 3x | 4 parallel |
| 7. Feature dev | 75s | 55s | 1.4x | 7 mixed (parallel + sequential) |

**Average speedup**: 1.8x (some tasks parallelizable, some sequential)

**Key insights**:
- Maximum speedup: 3x (4 parallel agents in scenario 6)
- Dependencies limit parallelization (scenarios 2-5)
- Mixed workflows (scenario 7) achieve partial parallelization

---

**Version**: 1.0.0
**Scenarios**: 7 complete real-world examples
**Status**: Production-ready patterns
