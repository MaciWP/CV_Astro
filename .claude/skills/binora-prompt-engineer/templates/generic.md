# Generic Backend Template

Universal fallback template for backend projects without specific tech stack detection.

---

## 🎯 Purpose

This template is loaded when:
- No specific backend framework detected (Django, Flask, FastAPI)
- Generic backend project
- Unknown tech stack

**Provides**: Universal backend best practices applicable to any stack.

---

## 🔍 Universal Backend Principles

### 1. Clarity Over Brevity

**Always**:
- Specify file paths (`src/services/user_service.py:45-67`)
- Include error messages or symptoms
- State tech stack with versions (Python 3.x, framework version)
- Provide quantifiable success criteria ("<200ms", ">95% coverage")

❌ **Vague**: "Fix the API"

✅ **Clear**: "Fix 500 error in POST /api/users/ endpoint (src/routes/users.py:120) caused by missing email validation"

---

### 2. XML Structuring

**Use tags for multi-part prompts**:
- `<task>`: What needs to be done
- `<context>`: Project info, tech stack, error details
- `<instructions>`: Sequential numbered steps
- `<output_format>`: Expected deliverables

```xml
<task>Implement JWT authentication for REST API</task>

<context>
  <tech_stack>Python 3.11, Framework X, PostgreSQL 14</tech_stack>
  <requirements>
    - JWT access tokens (15min expiry)
    - Refresh tokens (7 days)
    - Protect all /api/* endpoints except /api/auth/*
  </requirements>
</context>

<instructions>
1. Install JWT library: pip install pyjwt
2. Create authentication middleware
3. Add token generation endpoint
4. Protect routes with authentication decorator
5. Write unit tests with mocking
6. Test end-to-end with curl
</instructions>

<output_format>
  <code>Authentication middleware and decorators</code>
  <tests>Unit tests with 100% coverage</tests>
  <verification>Manual testing steps</verification>
</output_format>
```

---

### 3. Context Grounding

**For files >200 lines**: Request quote extraction FIRST

```xml
<instructions>
**Step 1: EXTRACT QUOTES**
Read src/services/user_service.py and extract code blocks that:
- Handle user creation
- Validate input data
- Interact with database

Wrap each in <quote line="X-Y">{{CODE}}</quote>

**Step 2: ANALYZE QUOTES**
For each quote, identify:
- Potential bugs or issues
- Missing validations
- Performance concerns

**Step 3: PROVIDE FIXES**
Show current code → fixed code with explanations
</instructions>
```

**Why**: Reduces hallucination by 20-30% (Anthropic research)

---

### 4. Quantifiable Success Criteria

**Use metrics, not vague terms**:

❌ Vague:
- "Make it faster"
- "Improve security"
- "Better error handling"

✅ Quantifiable:
- "Reduce response time from 500ms to <100ms"
- "Hash passwords with bcrypt (cost factor 12)"
- "Return specific 400/401/403/500 status codes with error messages"

---

## 🧪 Testing Best Practices (Universal)

### Test Structure

```python
def test_create_user_with_valid_data():
    # Arrange (setup)
    user_data = {"email": "test@example.com", "name": "Test"}

    # Act (execute)
    result = create_user(user_data)

    # Assert (verify)
    assert result.email == "test@example.com"
    assert result.id is not None
```

### Mocking External Dependencies

```python
def test_user_service_sends_email(mocker):  # Or unittest.mock.patch
    # Arrange
    mock_email = mocker.Mock()
    service = UserService(email_client=mock_email)

    # Act
    service.create_user({"email": "test@example.com"})

    # Assert
    mock_email.send.assert_called_once()
```

### Coverage Target

**Aim for**: ≥95% code coverage

**Measure**: Use coverage.py or framework-specific tools
```bash
pytest --cov=src --cov-report=term-missing
```

---

## 📊 API Best Practices

### RESTful Conventions

- **GET /api/resources**: List resources
- **POST /api/resources**: Create resource
- **GET /api/resources/:id**: Retrieve resource
- **PUT/PATCH /api/resources/:id**: Update resource
- **DELETE /api/resources/:id**: Delete resource

### Status Codes

- **200 OK**: Successful GET/PUT/PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server fault

### Response Format

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}
```

**Errors**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "field": "email"
  }
}
```

---

## 🔒 Security Checklist

- [ ] Passwords hashed (bcrypt, argon2, or PBKDF2)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output escaping)
- [ ] CSRF protection (for stateful sessions)
- [ ] Input validation on all endpoints
- [ ] Rate limiting on authentication endpoints
- [ ] HTTPS enforced in production
- [ ] Secrets in environment variables (not committed)

---

## ⚡ Performance Optimization

### Database Queries

- **N+1 Prevention**: Load related data in single query
- **Indexing**: Add indexes on frequently filtered/joined columns
- **Pagination**: Limit results (default: 20-50 per page)
- **Caching**: Cache expensive computations (Redis, Memcached)

### Example (Pseudo-code)

❌ **N+1 Query**:
```python
users = db.query("SELECT * FROM users")
for user in users:
    company = db.query(f"SELECT * FROM companies WHERE id = {user.company_id}")
    # 1 + N queries
```

✅ **Optimized**:
```python
users = db.query("""
    SELECT u.*, c.name as company_name
    FROM users u
    LEFT JOIN companies c ON u.company_id = c.id
""")
# Single query
```

---

## ✅ Validation Checklist (Generic Backend)

**Clarity**:
- [ ] File paths specified
- [ ] Error messages included
- [ ] Tech stack stated
- [ ] Success criteria quantifiable

**Structure**:
- [ ] XML tags for multi-part prompts
- [ ] Sequential numbered instructions
- [ ] Output format explicitly defined

**Testing**:
- [ ] Test structure clear (Arrange-Act-Assert)
- [ ] Mocking strategy defined
- [ ] Coverage target specified (≥95%)

**Security**:
- [ ] Input validation mentioned
- [ ] Authentication/authorization considered
- [ ] Secret management addressed

**Performance**:
- [ ] Database query optimization considered
- [ ] Response time targets specified
- [ ] Caching strategy (if applicable)

---

## 📚 Commands (Generic)

**Testing**:
```bash
pytest tests/ -v                           # Run tests
pytest --cov=src --cov-report=term-missing # Coverage
pytest -k "test_user" -v                   # Specific tests
```

**Linting**:
```bash
flake8 src/                                # Python linting
pylint src/                                # Alternative linter
mypy src/                                  # Type checking
```

**Formatting**:
```bash
black src/                                 # Python formatting
isort src/                                 # Import sorting
```

---

## 📖 Example Enhanced Prompt (Generic)

**User Input**: "Fix the user creation bug"

**Score**: 18/100 (vague)

**Enhanced**:
```xml
<task>Fix 500 error in POST /api/users/ when email already exists</task>

<context>
  <file>src/routes/users.py:120-145</file>
  <error>
    IntegrityError: duplicate key value violates unique constraint "users_email_key"
    Detail: Key (email)=(test@example.com) already exists.
  </error>
  <symptom>API returns 500 instead of 400 for duplicate email</symptom>
  <tech_stack>Python 3.11, Framework X 2.0, PostgreSQL 14</tech_stack>
  <current_behavior>
    - Request: POST /api/users/ {"email": "existing@test.com"}
    - Response: 500 Internal Server Error
  </current_behavior>
  <expected_behavior>
    - Response: 400 Bad Request
    - Body: {"error": {"code": "DUPLICATE_EMAIL", "message": "Email already exists"}}
  </expected_behavior>
</context>

<instructions>
1. Add try-except block around user creation in src/routes/users.py:120
2. Catch IntegrityError for duplicate email
3. Return 400 status with clear error message
4. Write unit test: test_create_user_duplicate_email_returns_400()
5. Run tests: pytest tests/test_users.py::test_create_user_duplicate_email_returns_400 -v
6. Verify coverage: pytest --cov=src.routes.users --cov-report=term-missing
7. Manual test: curl -X POST /api/users/ -d '{"email": "duplicate@test.com"}' (twice)
</instructions>

<output_format>
  <fix>Updated route handler with error handling</fix>
  <test>Unit test verifying 400 response for duplicate email</test>
  <verification>
    - Test output showing passing
    - Coverage report showing 100%
    - curl output showing 400 response
  </verification>
</output_format>
```

**Score**: 87/100 ✅

---

**Version**: 2.0.0
**Type**: Generic Backend Fallback
**Use When**: No specific framework detected