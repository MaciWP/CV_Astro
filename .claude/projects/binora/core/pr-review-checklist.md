# PR Review Checklist - Binora Backend

Strict code review checklist based on common errors and project standards. **MUST** be applied to every code change before PR approval.

---

## 🚨 Critical Review Standards

**Review Approach**: Be **STRICT and CLEAR** about required modifications. A poor analysis could cost the job - thoroughness is mandatory.

**Evaluation Scope**: Only review changed code (not entire codebase).

**Review Depth**: Deep analysis required - check for both obvious and subtle errors.

---

## ✅ General Best Practices (7 Points)

### 1. Best Practices Compliance
**Check**:
- [ ] Uses Django/DRF built-ins instead of custom solutions
- [ ] Follows SOLID principles (especially Single Responsibility)
- [ ] Proper separation of concerns (Views/Services/Models)
- [ ] No code duplication (DRY principle)
- [ ] Proper error handling with specific exceptions
- [ ] Type hints on all functions (parameters + return values)
- [ ] Query optimization (select_related, prefetch_related, order_by)

**Common Violations**:
- Custom authentication instead of extending Django backends
- Business logic in Views/Serializers instead of Services
- Missing type hints
- N+1 queries

---

### 2. Test Style Guide Compliance
**Check**:
- [ ] File naming: `*_tests.py` (NOT `test_*.py`)
- [ ] Test naming: `test_<action>_<context>_<expected_result>`
- [ ] AAA pattern used (Arrange, Act, Assert)
- [ ] `mocker.Mock()` used (NEVER `Mock()` directly)
- [ ] Proper fixture scopes (function for mutable, session for immutable)
- [ ] Fixtures in correct location (same file, app conftest, or root conftest)
- [ ] 100% coverage target met
- [ ] No order-dependent tests
- [ ] Each test is independent

**Common Violations**:
- Comments in tests (test names should be self-explanatory)
- Using `from unittest.mock import Mock` directly
- Wrong fixture scope causing test contamination
- Complex test setup more complex than code being tested

---

### 3. YOLO Comments Policy (STRICT)
**Check**:
- [ ] **NO comments in tests** (names must be self-explanatory)
- [ ] **NO obvious comments** ("create user", "check if valid")
- [ ] **NO non-English comments**
- [ ] **NO modifications/deletions** of existing comments
- [ ] Comments only for non-obvious algorithms or security-critical details

**FORBIDDEN Examples**:
```python
# ❌ BAD - Obvious comment
def test_create_user_with_valid_data_succeeds():
    # Arrange - Create user data
    data = {"email": "test@example.com"}
    # Act - Create user
    user = User.objects.create(**data)
    # Assert - Check user exists
    assert user.email == data["email"]
```

**CORRECT Example**:
```python
# ✅ GOOD - Self-explanatory, no comments needed
def test_create_user_with_valid_data_succeeds():
    data = {"email": "test@example.com"}
    user = User.objects.create(**data)
    assert user.email == data["email"]
```

---

### 4. Preserve Existing Comments & Docstrings
**Check**:
- [ ] **NO deletions** of existing comments
- [ ] **NO modifications** of existing docstrings
- [ ] Existing documentation preserved exactly as-is

**Why**: Existing comments were added for important reasons. Never remove them.

---

### 5. No Over-Engineering
**Check**:
- [ ] Solution is simplest possible for requirements
- [ ] No unnecessary abstractions or patterns
- [ ] No premature optimization
- [ ] Uses existing patterns instead of creating new ones
- [ ] Delegates complexity to well-tested libraries when possible

**Common Over-Engineering**:
- Custom pagination when Django has built-in
- Custom authentication when Django backends are extendable
- Abstract base classes with single implementation
- Factory patterns for simple object creation

---

### 6. Project Programming Style
**Check**:
- [ ] Follows Service Layer pattern (Views → Services → Models)
- [ ] No manual tenant_id filtering (middleware handles it)
- [ ] Type hints use proper types (QuerySet, Optional, List, Dict)
- [ ] Naming conventions followed (clear, descriptive names)
- [ ] Django settings used for configuration (no hard-coded values)
- [ ] Proper use of Django/DRF features (serializers, permissions, pagination)

**Binora-Specific Patterns**:
- Services: Static methods, dependency injection, type hints
- Serializers: Input/output separation (UserInputSerializer, UserOutputSerializer)
- ViewSets: Service delegation with @action decorators
- Auth: Extend MainAuthenticationBackend/TenantScopedJWTAuthentication

---

### 7. Error-Free Code (Critical)
**Check for OBVIOUS errors**:
- [ ] No syntax errors
- [ ] No import errors
- [ ] No undefined variables
- [ ] No type mismatches
- [ ] No logic errors (wrong operators, off-by-one)
- [ ] Proper exception handling (no bare except)

**Check for SUBTLE errors**:
- [ ] Race conditions in concurrent code
- [ ] Memory leaks (unclosed files, connections)
- [ ] Timezone-aware datetime handling
- [ ] Proper transaction boundaries
- [ ] SQL injection vulnerabilities
- [ ] XSS vulnerabilities in templates
- [ ] CSRF protection on state-changing operations
- [ ] Proper validation of user input
- [ ] Edge cases handled (empty lists, None values, zero division)

---

## 🔍 Specific Error Patterns (Historical)

### Backend Code Issues

#### 1. External Libraries Usage
**Rule**: Use external libraries COMPLETELY - delegate maintenance and testing to them.

**Check**:
- [ ] Using library's built-in features instead of wrapping
- [ ] Not reimplementing library functionality
- [ ] Proper library configuration (not custom workarounds)

**Bad Example**:
```python
# ❌ Custom pagination wrapping DRF
class CustomPagination:
    def paginate(self, queryset, request):
        # Custom logic reimplementing PageNumberPagination
```

**Good Example**:
```python
# ✅ Use DRF directly
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
```

---

#### 2. Helper Classes Style
**Rule**: Create helper classes respecting project style.

**Check**:
- [ ] Helpers in proper location (`apps/<app>/utils/` or `apps/<app>/helpers/`)
- [ ] Class-based helpers with clear responsibility
- [ ] Static methods when no state needed
- [ ] Type hints throughout
- [ ] Docstrings for public methods

**Structure**:
```python
# ✅ GOOD - Proper helper class
class EmailHelper:
    """Helper for email-related operations."""

    @staticmethod
    def format_recipient_list(users: List[User]) -> List[str]:
        """Convert User objects to email list."""
        return [user.email for user in users if user.email]
```

---

#### 3. Database Constraints Definition
**Rule**: Define ONE consistent way to write constraints.

**Check**:
- [ ] Constraints defined in model Meta class
- [ ] Use CheckConstraint, UniqueConstraint (Django 2.2+)
- [ ] Clear constraint names (format: `<model>_<field>_<check>`)
- [ ] Constraints with meaningful error messages

**Standard Format**:
```python
# ✅ GOOD - Consistent constraint definition
class Asset(models.Model):
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(status__in=['active', 'inactive', 'maintenance']),
                name='asset_status_valid'
            ),
            models.UniqueConstraint(
                fields=['company', 'name'],
                name='asset_company_name_unique'
            )
        ]
```

**NOT This**:
```python
# ❌ BAD - Inconsistent styles
class Asset(models.Model):
    name = models.CharField(max_length=255, unique=True)  # ❌ unique=True
    status = models.CharField(max_length=20, validators=[...])  # ❌ validators
```

---

#### 4. Fixture Reuse Check
**Rule**: ALWAYS verify fixtures aren't already created in superior location.

**Check**:
- [ ] Searched root `conftest.py` for existing fixture
- [ ] Searched app `conftest.py` for existing fixture
- [ ] Reused existing fixture if available
- [ ] Created new fixture only if truly needed
- [ ] New fixture in appropriate location (based on usage scope)

**Verification Steps**:
1. Check root `/conftest.py` - global fixtures
2. Check `apps/<current_app>/tests/conftest.py` - app fixtures
3. Check other apps' conftest if related functionality
4. Only create if not found

**Common Duplicates**:
- `user` / `authenticated_user` / `admin_user`
- `company` / `test_company`
- `api_client` / `authenticated_client`

---

### OpenAPI Contract Issues

#### 1. Backend Return Type Validation
**Rule**: Verify backend returns objects, not strings where objects expected.

**Check**:
- [ ] Response examples match actual backend types
- [ ] Objects returned as objects (not string representations)
- [ ] Arrays returned as arrays (not comma-separated strings)
- [ ] Proper nested object structure

**Bad Example**:
```yaml
# ❌ Backend returns object, contract says string
team:
  type: string
  example: "/api/teams/1/"
```

**Good Example**:
```yaml
# ✅ Correct - backend returns object
team:
  type: object
  properties:
    id:
      type: integer
    name:
      type: string
    url:
      type: string
```

---

#### 2. Redundant `type: object` with `allOf`
**Rule**: Don't use `type: object` when using `allOf`.

**Check**:
- [ ] No `type: object` alongside `allOf`
- [ ] `allOf` used correctly for composition

**Bad Example**:
```yaml
# ❌ Redundant type: object
UserOutput:
  type: object  # ❌ REMOVE THIS
  allOf:
    - $ref: '#/components/schemas/UserBase'
```

**Good Example**:
```yaml
# ✅ Correct - no redundant type
UserOutput:
  allOf:
    - $ref: '#/components/schemas/UserBase'
    - type: object
      properties:
        created_at:
          type: string
```

---

#### 3. Required Fields Location with `allOf`
**Rule**: Place `required` in correct location (parent level, not inside `allOf` child).

**Check**:
- [ ] `required` at schema root level (outside `allOf`)
- [ ] NOT inside individual `allOf` items

**Bad Example**:
```yaml
# ❌ Wrong - required inside allOf child
UserInput:
  allOf:
    - $ref: '#/components/schemas/UserBase'
    - type: object
      required:  # ❌ WRONG LOCATION
        - email
```

**Good Example**:
```yaml
# ✅ Correct - required at root level
UserInput:
  required:  # ✅ CORRECT LOCATION
    - email
    - password
  allOf:
    - $ref: '#/components/schemas/UserBase'
    - type: object
      properties:
        password:
          type: string
```

---

#### 4. Example Consistency
**Rule**: Verify consistency in examples (URLs, field names, formatting).

**Check**:
- [ ] URL protocol consistent (http vs https)
- [ ] URL paths consistent (singular vs plural)
- [ ] Field naming consistent across schemas
- [ ] Date/time format consistent
- [ ] ID formats consistent (integer vs string)

**Inconsistencies to Check**:
```yaml
# ❌ Inconsistent URLs
example: "http://api.example.com/room/1/"   # http, singular
example: "https://api.example.com/rooms/2/" # https, plural

# ✅ Consistent URLs
example: "https://api.example.com/rooms/1/"
example: "https://api.example.com/rooms/2/"
```

---

#### 5. PUT Method Required Logic
**Rule**: Verify PUT required fields match backend logic.

**Check**:
- [ ] Optional fields in model are optional in PUT
- [ ] PUT doesn't require ALL fields if partial update allowed
- [ ] Consistent with backend implementation

**Bad Example**:
```yaml
# ❌ Phone is optional in model but PUT requires everything
UserPut:
  required:
    - email
    - first_name
    - last_name
    - phone  # ❌ Should be optional
```

**Good Example**:
```yaml
# ✅ Optional fields match model
UserPut:
  required:
    - email
    - first_name
    - last_name
  properties:
    phone:
      type: string
      nullable: true  # ✅ Optional matches model
```

---

#### 6. Schema Reuse (DRY Principle)
**Rule**: Reuse pagination/common schemas - avoid duplication.

**Check**:
- [ ] Pagination schema defined once and referenced
- [ ] Common response structures reused
- [ ] No duplicated schema definitions

**Bad Example**:
```yaml
# ❌ Pagination duplicated in every list endpoint
UserListResponse:
  properties:
    count:
      type: integer
    next:
      type: string
    previous:
      type: string
    results:
      type: array

AssetListResponse:  # ❌ DUPLICATED
  properties:
    count:
      type: integer
    next:
      type: string
    # ... same structure repeated
```

**Good Example**:
```yaml
# ✅ Pagination schema reused
PaginatedResponse:
  type: object
  properties:
    count:
      type: integer
    next:
      type: string
    previous:
      type: string
    results:
      type: array

UserListResponse:
  allOf:
    - $ref: '#/components/schemas/PaginatedResponse'
    - type: object
      properties:
        results:
          type: array
          items:
            $ref: '#/components/schemas/UserOutput'
```

---

#### 7. Redundant Descriptions with `allOf`
**Rule**: Avoid redundant descriptions in nested schemas with `allOf`.

**Check**:
- [ ] Descriptions in parent schema, not duplicated in children
- [ ] `allOf` children add new info, not repeat parent info

**Bad Example**:
```yaml
# ❌ Redundant descriptions
UserBase:
  description: "Base user information"
  properties:
    email:
      type: string
      description: "User email address"

UserOutput:
  allOf:
    - $ref: '#/components/schemas/UserBase'
    - type: object
      description: "Base user information"  # ❌ REDUNDANT
```

**Good Example**:
```yaml
# ✅ No redundancy
UserBase:
  description: "Base user information"
  properties:
    email:
      type: string

UserOutput:
  allOf:
    - $ref: '#/components/schemas/UserBase'
    - type: object
      description: "User output with additional computed fields"  # ✅ New info
```

---

#### 8. Backend Field Type Verification
**Rule**: Verify backend accepts declared types (URLs vs IDs, etc.).

**Check**:
- [ ] Field type matches backend expectation
- [ ] URL fields are strings (not objects) if backend expects URLs
- [ ] ID fields are correct type (integer, UUID, etc.)
- [ ] Relationships correctly represented

**Common Issue**:
```yaml
# ❓ Does backend accept URL string or only ID?
team:
  type: string
  format: uri
  example: "/api/teams/1/"
```

**Verification**:
1. Check backend serializer: Does it use `HyperlinkedRelatedField` or `PrimaryKeyRelatedField`?
2. Test actual API: Send request and verify accepted format
3. Match contract to actual backend behavior

**Correct Representations**:
```yaml
# ✅ If backend uses HyperlinkedRelatedField
team:
  type: string
  format: uri

# ✅ If backend uses PrimaryKeyRelatedField
team:
  type: integer

# ✅ If backend uses nested serializer
team:
  $ref: '#/components/schemas/TeamSummary'
```

---

## 🎯 Review Process

### Step 1: Quick Scan
- Read all changed files
- Identify scope of changes
- Check for obvious errors

### Step 2: Deep Analysis
- Apply all 7 general best practices checks
- Apply all specific error pattern checks
- Verify against historical errors
- Check OpenAPI contract consistency (if applicable)

### Step 3: Report
**For each violation found, report**:
1. **Location**: File:line
2. **Issue**: What's wrong (be specific)
3. **Impact**: Why it matters (critical/high/medium)
4. **Fix**: Exact solution required

**Format**:
```
❌ CRITICAL: apps/core/views/user.py:45
Issue: Manual tenant_id filtering
Code: User.objects.filter(tenant_id=company.id)
Fix: Remove tenant_id filter - middleware handles isolation
Reason: Violates multi-tenant architecture, bypasses security
```

### Step 4: Approve or Block
- **BLOCK if**: Any CRITICAL issues found
- **REQUEST CHANGES if**: HIGH issues found
- **APPROVE if**: Only MEDIUM/LOW issues (document for later)

---

## 📝 Review Template

```markdown
## Code Review - [PR Title]

### Summary
[Brief description of changes]

### Review Checklist
- [ ] Best practices compliance
- [ ] Test style guide compliance
- [ ] YOLO comments policy
- [ ] No deleted comments/docstrings
- [ ] No over-engineering
- [ ] Project style compliance
- [ ] Error-free code
- [ ] Historical error patterns checked

### Issues Found

#### Critical (Block PR) 🚫
[List critical issues - PR cannot be merged]

#### High (Request Changes) ⚠️
[List high-priority issues - must be fixed]

#### Medium (Document) 📝
[List medium issues - fix in follow-up]

#### Low (Note) 💡
[List suggestions - optional improvements]

### Approval Decision
- [ ] ✅ APPROVED - Ready to merge
- [ ] 🔄 CHANGES REQUESTED - See issues above
- [ ] 🚫 BLOCKED - Critical issues must be resolved
```

---

**Version**: 1.0
**Last Updated**: 2025-01-13
**Based On**: Real project errors and patterns (Oct 2024 - Jan 2025)
