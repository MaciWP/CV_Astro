# Universal Principles - Anthropic 2025 Best Practices

Core techniques for enhancing prompts, applicable to any tech stack.

---

## 🎯 Core Principle: Clarity Over Brevity

**Anthropic Guideline**: Explicit instructions with specific file paths produce better outputs than vague requests.

**Rule**: Be specific, detailed, and unambiguous.

❌ **WRONG - Vague (Score: 20/100)**
```
"Fix the database queries"
```
**Issues**: No file, no error, no symptom, no tech stack context.

✅ **CORRECT - Explicit (Score: 88/100)**
```xml
<task>Optimize N+1 query in UserViewSet.list() causing 2.5s response time</task>

<context>
  <file>apps/core/views/auth.py:120-145</file>
  <error>N+1 query detected: 500 users × company lookup = 501 queries</error>
  <symptom>API endpoint /api/users/ takes 2.5s (target: <200ms)</symptom>
  <tech_stack>Django 5.0, DRF 3.14, PostgreSQL 14</tech_stack>
  <current_code>
    queryset = User.objects.all()  # Missing select_related('company')
  </current_code>
</context>

<instructions>
1. Add select_related('company') to queryset
2. Verify with Django Debug Toolbar: queries reduced from 501 to 1
3. Benchmark response time with curl -w "%{time_total}\n"
4. Target: <200ms response time
</instructions>

<output_format>
  <fix>Updated queryset with optimization</fix>
  <queries_before>501 queries (2.5s)</queries_before>
  <queries_after>1 query (<200ms)</queries_after>
</output_format>
```

**Checklist**:
- [ ] Is file path absolute and specific?
- [ ] Is error message or symptom clearly described?
- [ ] Are reproduction steps included?
- [ ] Is tech stack mentioned with versions?
- [ ] Are expected outcomes defined with quantifiable targets?

---

## 🏗️ XML Structuring for Multi-Part Prompts

**Anthropic Guideline**: "Claude has been trained to recognize and respond to XML-style tags. Use these tags to separate instructions, examples, and inputs."

**Rule**: Use XML tags to clearly separate different parts of your prompt.

❌ **WRONG - Unstructured (Score: 35/100)**
```
"Add authentication to the API. It should use JWT tokens, protect endpoints, and store refresh tokens in database."
```
**Issues**: Missing requirements, file paths, architecture details, success criteria.

✅ **CORRECT - XML Structured (Score: 90/100)**
```xml
<task>Implement JWT authentication with refresh token rotation</task>

<context>
  <project>Django 5.0 + DRF 3.14 + PostgreSQL</project>
  <requirements>
    - JWT access tokens (15min expiry)
    - Refresh tokens (7 days, stored in DB)
    - Token rotation on refresh
    - Protect all /api/* endpoints except /api/auth/*
  </requirements>
  <affected_files>
    - apps/core/utils/auth/jwt_backend.py (authentication backend)
    - apps/core/views/auth.py (login, refresh endpoints)
    - apps/core/models.py (RefreshToken model)
    - binora/settings.py (JWT configuration)
  </affected_files>
  <architecture_pattern>Service layer with dependency injection</architecture_pattern>
</context>

<instructions>
1. Install djangorestframework-simplejwt: pip install djangorestframework-simplejwt
2. Create RefreshToken model in apps/core/models.py
3. Implement JWTAuthenticationBackend in apps/core/utils/auth/
4. Add TokenObtainPairView and TokenRefreshView in apps/core/views/auth.py
5. Configure JWT settings in binora/settings.py (15min access, 7 days refresh)
6. Add authentication_classes to all ViewSets
7. Test token rotation: old refresh token invalidated after use
8. Run tests: pytest apps/core/tests/auth_tests.py --cov
</instructions>

<output_format>
  <model>RefreshToken with user, token, created_at, expires_at fields</model>
  <views>TokenObtainPairView, TokenRefreshView with service delegation</views>
  <settings>JWT configuration in binora/settings.py</settings>
  <tests>100% coverage for auth flows</tests>
</output_format>
```

**Recommended tags**:
- `<task>`: What needs to be done (1 sentence)
- `<context>`: Project info, requirements, affected files, architecture
- `<instructions>`: Sequential numbered steps
- `<output_format>`: Expected deliverables with structure
- `<examples>`: Few-shot examples (if applicable)
- `<thinking>`: For Chain of Thought prompts (complex tasks)

**Checklist**:
- [ ] Does prompt use `<task>`, `<context>`, `<instructions>`, `<output_format>` tags?
- [ ] Are file paths specified with project structure?
- [ ] Is code/data inside appropriate tags (not mixed with instructions)?
- [ ] Is output format explicitly structured with sub-tags?
- [ ] Is architecture mentioned?

---

## 🔗 Context Grounding (Reduces Hallucination 20-30%)

**Anthropic Guideline**: "For long context retrieval, place documents/code BEFORE the query, and extract relevant quotes first."

**Rule**: Place context FIRST, query LAST. For long files, extract quotes before analyzing.

❌ **WRONG - No Context Grounding (Score: 30/100)**
```
"Find all dependency injection violations in the service layer"
```
**Issues**: No file references, risk of hallucinating code that doesn't exist.

✅ **CORRECT - Quote Grounding (Score: 87/100)**
```xml
<task>Identify dependency injection violations in AuthService</task>

<context>
  <file>apps/core/services.py</file>
  <di_pattern>Constructor injection with optional parameters (service ?? RealService())</di_pattern>
  <reference_files>
    apps/core/services.py (AuthService - good DI example)
    CLAUDE.md (DI anti-patterns section)
  </reference_files>
  <violations_to_find>
    - Static service methods
    - Direct service instantiation (new EmailHelper() without DI)
    - Global service singletons
    - Services not passed as constructor params
  </violations_to_find>
</context>

<instructions>
**Step 1: EXTRACT QUOTES**
First, read apps/core/services.py and extract ALL code blocks that:
- Define service classes and constructors
- Instantiate services or dependencies
- Use static methods for business logic
- Access global state

Wrap each quote in <quote line="X-Y">{{CODE}}</quote> tags.

**Step 2: ANALYZE QUOTES**
For each extracted quote, analyze:
- Is this a DI violation according to project patterns?
- What pattern should be used instead? (compare to AuthService)
- Impact on testability? (can we inject mocks?)
- Reference CLAUDE.md anti-patterns

**Step 3: PROVIDE FIXES**
For each violation, show:
- Current code (from quote with line numbers)
- Fixed code (with constructor DI)
- Explanation referencing project architecture
- Unit test demonstrating testability
</instructions>

<output_format>
<extracted_quotes>
  <quote line="X-Y" file="apps/core/services.py" violation="yes/no">
    {{EXACT_CODE_FROM_FILE}}
  </quote>
</extracted_quotes>
<violations>
  <violation>
    <location>apps/core/services.py:X-Y</location>
    <current>{{QUOTED_CODE}}</current>
    <issue>{{WHAT'S_WRONG}} (violates project DI pattern)</issue>
    <fix>{{CORRECTED_CODE_WITH_DI}}</fix>
    <reference>Similar to AuthService constructor pattern</reference>
  </violation>
</violations>
<testability_impact>
  Before: Cannot inject mocks for testing
  After: Full testability with constructor injection
</testability_impact>
</output_format>
```

**Checklist**:
- [ ] For files >200 lines, does prompt request quote extraction FIRST?
- [ ] Are quotes wrapped in tags with file paths and line numbers?
- [ ] Is analysis done ON THE QUOTES (not imagined code)?
- [ ] Are recommendations grounded in extracted quotes?
- [ ] Are comparisons made to existing project patterns?

---

## 🧠 Chain of Thought for Complex Tasks

**Anthropic Guideline**: "Claude will respond more accurately if you tell it to think step by step."

**Rule**: Use `<thinking>` tags for reasoning-heavy tasks (algorithms, architecture decisions, complex logic).

❌ **WRONG - No Reasoning (Score: 40/100)**
```
"Design a caching strategy for the API"
```
**Issues**: No requirements, no constraints, no analysis of tradeoffs.

✅ **CORRECT - With Chain of Thought (Score: 89/100)**
```xml
<task>Design Redis caching strategy for high-traffic read endpoints</task>

<context>
  <current_state>
    - /api/users/ endpoint: 500ms avg response time
    - Database queries: 95% reads, 5% writes
    - Traffic: 10,000 requests/hour peak
    - No caching currently
  </current_state>
  <requirements>
    - Target: <100ms response time for cached data
    - Cache invalidation on writes
    - Multi-tenant aware (cache keys include tenant_id)
    - Redis available (redis-py installed)
  </requirements>
  <tech_stack>Django 5.0, DRF 3.14, Redis 7, PostgreSQL 14</tech_stack>
</context>

<instructions>
Think step-by-step in <thinking> tags:

<thinking>
1. Analyze caching opportunities:
   - Read-heavy endpoints: /api/users/, /api/assets/, /api/hierarchy/
   - Low-change frequency: User profiles, company data, datacenter structure
   - High-change frequency: Assets (avoid caching or short TTL)

2. Design cache key strategy:
   - Include tenant_id: cache_key = f"tenant:{tenant_id}:users:list"
   - Include query params: cache_key += f":page:{page}:limit:{limit}"
   - Version cache: cache_key += ":v1" (for schema changes)

3. Cache invalidation strategy:
   - Write operations: Invalidate related cache keys
   - Signals: Use Django signals (post_save, post_delete) to trigger invalidation
   - Pattern matching: KEYS tenant:*:users:* for bulk invalidation
   - TTL fallback: 300s (5min) for automatic expiration

4. Multi-tenant considerations:
   - Cache keys MUST include tenant_id (middleware provides request.user.company_id)
   - Middleware integration: Check cache before database query
   - Security: Ensure cache keys prevent cross-tenant data leakage

5. Implementation approach:
   - Create CacheService in apps/core/services.py
   - Decorator: @cache_response(ttl=300, key_prefix="users")
   - Apply to ViewSet.list() methods
   - Tests: Mock Redis, verify cache hit/miss/invalidation
</thinking>

Now implement the caching strategy following this analysis.
</instructions>

<output_format>
<service>apps/core/services/cache_service.py - CacheService class</service>
<decorator>@cache_response decorator with TTL and key generation</decorator>
<integration>ViewSet changes to use caching</integration>
<invalidation>Signal handlers for cache invalidation</invalidation>
<tests>Unit tests with MockRedis, integration tests</tests>
<benchmarks>Before/after response time comparison</benchmarks>
</output_format>
```

**Checklist**:
- [ ] Does task require multi-step reasoning? (architecture, algorithms, tradeoffs)
- [ ] Are `<thinking>` tags present for analysis?
- [ ] Are project patterns referenced?
- [ ] Are edge cases considered in thinking section?
- [ ] Does thinking reference existing code examples?

---

## 🎨 Few-Shot Examples (Learning by Example)

**Anthropic Guideline**: "Showing Claude a clear input-output example makes a significant difference, especially for nuanced or stylistic tasks."

**Rule**: Provide 2-4 examples of desired input/output pattern.

✅ **CORRECT - Few-Shot Pattern**
```xml
<task>Write tests following project AAA pattern</task>

<examples>
<example1>
❌ WRONG - No AAA structure:
```python
def test_user_creation():
    user = User.objects.create(email="test@test.com")
    assert user.email == "test@test.com"
```

✅ CORRECT - AAA pattern:
```python
def test_create_user_sets_email_correctly():
    # Arrange
    email = "test@test.com"

    # Act
    user = User.objects.create(email=email)

    # Assert
    assert user.email == email
```
</example1>

<example2>
❌ WRONG - Mock() without mocker:
```python
from unittest.mock import Mock

def test_email_service():
    mock = Mock()
```

✅ CORRECT - Use mocker fixture:
```python
def test_email_service_sends_email(mocker):
    mock_helper = mocker.Mock(spec=EmailHelper)
    service = AuthService(email_helper=mock_helper)

    service.create_user(user)

    mock_helper.send_user_created_email.assert_called_once()
```
</example2>

<example3>
❌ WRONG - Manual tenant_id filtering:
```python
def test_user_list():
    company = CompanyFactory()
    users = User.objects.filter(tenant_id=company.id)  # FORBIDDEN
```

✅ CORRECT - Trust middleware:
```python
def test_user_list_filters_by_tenant(auth_client, user):
    # Arrange
    # (Middleware handles tenant filtering automatically)

    # Act
    response = auth_client.get('/api/users/')

    # Assert
    assert response.status_code == 200
    assert len(response.data) == 1  # Only current tenant's users
```
</example3>
</examples>

Now write tests for UserViewSet.create() following these patterns.
```

**Checklist**:
- [ ] Are 2+ examples provided?
- [ ] Do examples show ❌ WRONG vs ✅ CORRECT pattern?
- [ ] Are examples from the actual project (not generic)?
- [ ] Do examples demonstrate project-specific anti-patterns to avoid?

---

## 📏 Quantifiable Success Criteria

**Anthropic Guideline**: Use measurable metrics, not subjective terms like "better" or "improved".

❌ **WRONG - Vague**
```
"Improve the performance"
```

✅ **CORRECT - Quantifiable**
```
"Reduce response time from 500ms to <100ms (80% improvement) by adding select_related('company') to avoid N+1 queries. Verify with Django Debug Toolbar: queries should drop from 501 to 1."
```

**Metrics to use**:
- Performance: "< 200ms", "reduce from 2.5s to <500ms"
- Coverage: "100% coverage", "increase from 75% to 95%"
- Queries: "reduce from 501 to 1 query", "N+1 eliminated"
- Errors: "0 errors", "reduce error rate from 5% to <0.1%"
- Code quality: "0 linting errors", "mypy passes with no issues"

**Checklist**:
- [ ] Are targets quantifiable? (numbers, percentages, metrics)
- [ ] Is current state described? (Before: X, After: Y)
- [ ] Are validation methods specified? (how to measure success)
- [ ] Are thresholds explicit? (<100ms, >95%, 0 errors)

---

## ✅ Validation Checklist

Apply to ALL enhanced prompts:

**Clarity & Specificity**:
- [ ] File paths are absolute and specific
- [ ] Error messages or symptoms are clearly described
- [ ] Reproduction steps are included
- [ ] Tech stack is mentioned with versions
- [ ] Success criteria are quantifiable

**Context & Domain**:
- [ ] Project architecture is referenced
- [ ] Existing project files are referenced
- [ ] Edge cases are considered
- [ ] Current state is described (Before: ..., After: ...)

**XML Structure**:
- [ ] Uses `<task>`, `<context>`, `<instructions>`, `<output_format>` tags
- [ ] Instructions are numbered and sequential
- [ ] Code/data is inside appropriate tags
- [ ] Output format is explicitly structured

**Advanced Techniques**:
- [ ] For complex tasks: `<thinking>` tags used
- [ ] 2+ ❌/✅ examples shown (if applicable)
- [ ] For long files (>200 lines): quote extraction requested FIRST

**Actionability**:
- [ ] All dependencies are specified (package versions, imports)
- [ ] Validation steps are included (pytest, coverage, linting)
- [ ] Commands are complete and copy-pasteable
- [ ] Can be executed immediately without additional questions

---

**Anthropic Sources**:
- "Prompt engineering overview" (docs.claude.com)
- "Use XML tags to structure prompts" (docs.claude.com)
- "Effective context engineering for AI agents" (anthropic.com/engineering)
- "Prompting long context" (anthropic.com/news)

**Next**: See project-specific templates for tech-stack examples.
