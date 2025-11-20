# Forbidden Patterns - Binora Backend

Critical violations that MUST be avoided.

## CRITICAL Violations

### 1. Manual tenant_id Filtering ❌

```python
# FORBIDDEN
User.objects.filter(tenant_id=company.id, email=email)
Asset.objects.filter(tenant_id=request.user.company_id)
```

**Why**: Breaks transparent isolation principle. Middleware handles all tenant filtering.

**Fix**: Remove tenant_id from queries. Middleware adds it automatically.

```python
# CORRECT
User.objects.filter(email=email)
Asset.objects.filter(status="active")
```

**Detection**: Use /check-tenant command or multi-tenant-enforcer agent.

### 2. Business Logic in Views/Serializers ❌

```python
# FORBIDDEN - in ViewSet
def create(self, request):
    user = User(
        email=request.data['email'],
        first_name=request.data['first_name']
    )
    user.set_password(generate_random_password())
    user.save()
    send_welcome_email(user)  # Business logic in view
    return Response(UserSerializer(user).data)
```

**Why**: Violates service layer pattern. Views should only handle HTTP concerns.

**Fix**: Delegate to service.

```python
# CORRECT - in ViewSet
def create(self, request):
    serializer = UserCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = self.auth_service.create_user_for_company(
        **serializer.validated_data,
        company=request.user.company
    )
    return Response(UserSerializer(user).data, status=201)
```

### 3. Mock Without mocker Fixture ❌

```python
# FORBIDDEN
from unittest.mock import Mock

def test_something():
    mock = Mock()
```

**Why**: Project uses pytest-mock. Direct Mock import breaks patterns.

**Fix**: Use mocker fixture.

```python
# CORRECT
def test_something(mocker):
    mock = mocker.Mock()
```

### 4. Non-English Comments ❌

```python
# FORBIDDEN
# Este método crea un usuario nuevo
def create_user(email: str) -> User:
    pass
```

**Why**: Project standard is English-only comments.

**Fix**: Write in English or remove (YOLO: only comment non-obvious).

```python
# CORRECT (only if genuinely non-obvious)
# Generates random password following NIST guidelines
def create_user(email: str) -> User:
    pass
```

## HIGH Priority Violations

### 5. Missing Type Hints ❌

```python
# FORBIDDEN
def create_user(email, name):
    pass
```

**Fix**: Add type hints to all parameters and return values.

```python
# CORRECT
def create_user(email: str, name: str) -> User:
    pass
```

### 6. No Query Optimization ❌

```python
# FORBIDDEN (causes N+1 queries)
users = User.objects.all()
for user in users:
    print(user.company.name)  # N+1!
```

**Fix**: Use select_related/prefetch_related.

```python
# CORRECT
users = User.objects.select_related('company').all()
for user in users:
    print(user.company.name)  # Single query
```

### 7. Missing order_by in QuerySets ❌

```python
# FORBIDDEN (non-deterministic order)
queryset = User.objects.all()
```

**Fix**: Always specify ordering.

```python
# CORRECT
queryset = User.objects.all().order_by('email')
```

## MEDIUM Priority Violations

### 8. Test Coverage <100% ❌

Target: 100% per file.

**Detection**: Run `/coverage [path]`

**Fix**: Use django-test-generator to create missing tests.

### 9. Reimplementing Django/DRF ❌

Use Django/DRF built-ins first. Only create custom when extending.

**Priority**:
1. Django built-ins
2. Existing Binora patterns
3. Custom (only when extending)

### 10. Non-AAA Test Structure ❌

```python
# FORBIDDEN
def test_user_creation():
    user = User.objects.create(email="test@test.com")
    assert user.email == "test@test.com"  # No clear AAA
```

**Fix**: Use AAA pattern.

```python
# CORRECT
def test_create_user_sets_email():
    # Arrange
    email = "test@test.com"

    # Act
    user = User.objects.create(email=email)

    # Assert
    assert user.email == email
```

## Detection Tools

- `/check-tenant` - Multi-tenant violations
- `/quick-audit` - All critical violations
- `django-codebase-auditor` - Comprehensive review
- `multi-tenant-enforcer` - Tenant isolation
- `pre-commit-guardian` - Pre-commit validation