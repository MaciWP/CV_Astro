# Multi-Tenant Architecture - Binora Backend

Core principle: Transparent tenant isolation via middleware. Application code is tenant-agnostic.

## Service Architecture

### Main Service (Port 8000)
- TENANT=None
- Sees ALL data across tenants
- Used for: JWT generation, admin operations
- Authentication: MainAuthenticationBackend
- Location: `apps/core/utils/auth/`

### Tenant Services (Port 8001+)
- TENANT=subdomain (e.g., "company1")
- Sees ONLY tenant data
- Used for: Normal API operations
- Authentication: TenantScopedJWTAuthentication
- Location: `apps/core/utils/auth/`

### CRITICAL: Same Codebase
Main and Tenant services use IDENTICAL code. Only difference: TENANT environment variable.

Tests run against Main service because it's the same code with different configuration.

## Data Isolation

### Middleware Handles Filtering ✅
```python
# Application code - tenant-agnostic
users = User.objects.filter(email=email)
# Middleware automatically adds: .filter(tenant_id=current_tenant)
```

**Why**: MultitenantMiddleware provides transparent isolation.

### Manual Filtering FORBIDDEN ❌
```python
# NEVER do this
users = User.objects.filter(tenant_id=company.id, email=email)
```

**Why**: Violates transparent isolation principle. This is a CRITICAL violation.

### Middleware Location
`binora/middleware.py` - MultitenantMiddleware

## Service Layer Pattern

**Views → Services → Models → Utils**

### Views (HTTP only)
- Request parsing
- Response formatting
- Status codes
- Authentication/permissions
- **NO business logic**

Example: `apps/core/views/user.py:50-68` (service delegation)

### Services (ALL business logic)
- User creation with password generation
- Email sending
- Complex calculations
- Multi-model operations
- Dependency injection pattern

Example: `apps/core/services.py` (AuthService)

Pattern:
```python
class UserService:
    def __init__(self, repository=User.objects):
        self.repository = repository

    def create_user(self, email: str, name: str) -> User:
        # Business logic here
        pass
```

### Models (Data structure)
- Field definitions
- Relationships (ForeignKey, ManyToMany)
- Validators
- Meta (ordering, indexes)
- **NO business logic**

### Utils (Shared helpers)
- Authentication backends
- Utility functions
- Mixins

## Key Patterns

### 1. Dependency Injection
Services receive dependencies via `__init__`:
```python
class AuthService:
    def __init__(
        self,
        user_repository=User.objects,
        email_service=None
    ):
        self.user_repository = user_repository
        self.email_service = email_service
```

### 2. Type Hints Everywhere
```python
def create_user_for_company(
    self,
    email: str,
    first_name: str,
    company: Company
) -> User:
    pass
```

### 3. Query Optimization
```python
queryset = User.objects.select_related(
    "company"
).prefetch_related(
    "companies",
    "groups"
).order_by("email")
```

## Reference Files

**Authentication:**
- `apps/core/utils/auth/` - Backends
- `binora/settings.py` - AUTH configuration

**Examples:**
- ViewSet: `apps/core/views/user.py`
- Service: `apps/core/services.py`
- Serializer: `apps/core/serializers/user.py`

**Middleware:**
- `binora/middleware.py` - MultitenantMiddleware