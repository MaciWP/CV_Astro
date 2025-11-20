---
name: "Django Service Layer Architecture"
description: "Enforces service layer patterns in Django/DRF projects with ALL business logic in services, NOT views. Auto-activates on: service, business logic, viewset, delegation, static method. Prevents logic in views/serializers, static methods with state, god classes. Ensures testability with dependency injection, type hints, single responsibility. Validates service methods have type hints, ViewSets delegate (max 10 lines/method), services are stateless. Targets: 100% service delegation, 0 business logic in views, stateless services."
---

# Django Service Layer Architecture

**Auto-activates when**: Discussing services, business logic, ViewSets, delegation, or code organization in Django/DRF projects.

---

## 🎯 Mission

Enforce **100% service layer delegation** in Django/DRF for testability, reusability, and clean architecture following SOLID principles.

---

## 📐 Core Principles

### 1. Service Layer for ALL Business Logic

**Rule**: ALL business logic in services. Views ONLY handle HTTP (request → service → response).

**Why it matters**: Single Responsibility Principle, testable in isolation, reusable across views, maintainable code.

❌ WRONG - Business logic in ViewSet
```python
# apps/core/views/user.py
from rest_framework import viewsets
from rest_framework.response import Response
from apps.core.models import User
from apps.core.serializers.user import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        # Validation (this is OK in views)
        if not request.data.get('email'):
            return Response({'error': 'Email required'}, status=400)

        # Business logic (WRONG! Should be in service)
        user = User.objects.create(
            email=request.data['email'],
            password=make_password(request.data['password'])
        )

        # More business logic (WRONG!)
        send_welcome_email(user)  # Email logic
        create_default_preferences(user)  # Preference logic
        log_user_creation(user)  # Audit logic
        cache.set(f'user_{user.id}', user)  # Cache logic

        return Response(UserSerializer(user).data, status=201)
```

✅ CORRECT - Delegate to service
```python
# apps/core/views/user.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.core.services import UserService
from apps.core.serializers.user import UserInputSerializer, UserOutputSerializer

class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        # Validation with serializer
        serializer = UserInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Delegate ALL business logic to service (single line!)
        user = UserService.create_user_with_onboarding(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        # Return response (HTTP only)
        return Response(UserOutputSerializer(user).data, status=status.HTTP_201_CREATED)

# apps/core/services.py
from typing import Optional
from django.contrib.auth.hashers import make_password
from apps.core.models import User
from apps.core.services import EmailService, PreferenceService, AuditService

class UserService:
    """Service layer for User business logic."""

    @staticmethod
    def create_user_with_onboarding(email: str, password: str) -> User:
        """
        Create user with full onboarding flow.

        Args:
            email: User email address
            password: Plain text password (will be hashed)

        Returns:
            Created User instance
        """
        # Create user
        user = User.objects.create(
            email=email,
            password=make_password(password)
        )

        # Onboarding steps (all business logic)
        EmailService.send_welcome_email(user)
        PreferenceService.create_defaults(user)
        AuditService.log_user_creation(user)

        return user
```

**Auto-check**:
- [ ] ViewSet methods <10 lines each?
- [ ] All business logic in Service class?
- [ ] Service methods have type hints (params + return)?

---

### 2. Static Service Methods (Stateless)

**Rule**: Services use @staticmethod, NO instance state (__init__, instance variables).

**Why it matters**: Stateless = no side effects, easier testing, no initialization needed, thread-safe.

❌ WRONG - Stateful service
```python
class UserService:
    def __init__(self):
        self.cache = {}  # State! BAD!
        self.logger = Logger()  # State! BAD!

    def get_user(self, user_id):
        # Uses instance state
        if user_id in self.cache:
            return self.cache[user_id]

        user = User.objects.get(id=user_id)
        self.cache[user_id] = user  # Mutates state!
        return user
```

✅ CORRECT - Stateless static methods
```python
class UserService:
    """All methods are stateless @staticmethod."""

    @staticmethod
    def get_user_by_id(user_id: int) -> User:
        """Get user by ID with optimized query."""
        return User.objects.select_related('company').get(id=user_id)

    @staticmethod
    def get_user_by_email(email: str) -> Optional[User]:
        """Get user by email address."""
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None

    @staticmethod
    def create_user(email: str, password: str) -> User:
        """Create new user with hashed password."""
        return User.objects.create(
            email=email,
            password=make_password(password)
        )
```

**Auto-check**:
- [ ] All service methods are @staticmethod?
- [ ] No __init__ or instance variables?
- [ ] Type hints on all method signatures?

---

### 3. Service Composition (Single Responsibility)

**Rule**: Services call other services, each service has single responsibility. NO god classes.

**Why it matters**: Avoids god classes (1000+ lines), reusable components, clear dependencies, testable units.

❌ WRONG - God service (handles everything)
```python
class UserService:
    @staticmethod
    def create_user_complete(data):
        # User creation
        user = User.objects.create(**data)

        # Email logic (should be EmailService)
        send_mail(
            subject='Welcome',
            message='Welcome to our platform',
            from_email='noreply@example.com',
            recipient_list=[user.email],
        )

        # Preference logic (should be PreferenceService)
        Preference.objects.create(
            user=user,
            theme='light',
            language='en',
            notifications_enabled=True
        )

        # Audit logic (should be AuditService)
        AuditLog.objects.create(
            action='user_created',
            user=user,
            ip_address='...',
            timestamp=timezone.now()
        )

        # Cache logic (should be CacheService)
        cache.set(f'user_{user.id}', user, timeout=3600)

        return user
```

✅ CORRECT - Composed services (each with single responsibility)
```python
# apps/core/services.py
class UserService:
    """User-specific business logic only."""

    @staticmethod
    def create_user_with_onboarding(email: str, password: str) -> User:
        """Create user with full onboarding (composes other services)."""
        # Create user (UserService responsibility)
        user = UserService._create_user(email, password)

        # Delegate to other services (composition)
        EmailService.send_welcome_email(user)
        PreferenceService.create_defaults(user)
        AuditService.log_user_creation(user)

        return user

    @staticmethod
    def _create_user(email: str, password: str) -> User:
        """Internal method for user creation only."""
        return User.objects.create(
            email=email,
            password=make_password(password)
        )

# Separate service for email
class EmailService:
    """Email-specific business logic only."""

    @staticmethod
    def send_welcome_email(user: User) -> None:
        """Send welcome email to new user."""
        send_mail(
            subject='Welcome',
            message=f'Welcome {user.email}!',
            from_email='noreply@example.com',
            recipient_list=[user.email],
        )

# Separate service for preferences
class PreferenceService:
    """Preference-specific business logic only."""

    @staticmethod
    def create_defaults(user: User) -> Preference:
        """Create default preferences for user."""
        return Preference.objects.create(
            user=user,
            theme='light',
            language='en',
            notifications_enabled=True
        )
```

**Auto-check**:
- [ ] Service methods <20 lines each?
- [ ] Calls to other services for different concerns (EmailService, PreferenceService)?
- [ ] Each service has single responsibility?
- [ ] Private methods for internal logic (_method_name)?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Business Logic in Serializers

❌ ANTI-PATTERN
```python
class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        send_welcome_email(user)  # Business logic in serializer! BAD!
        return user
```

✅ CORRECT - Serializers validate only
```python
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    # Only validation, NO business logic
```

**Why it matters**: Serializers are for validation/transformation, not business logic. Violates SRP.

---

### 2. Long ViewSet Methods (>10 lines)

❌ ANTI-PATTERN
```python
class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        # 50 lines of business logic here...
        # Creating user, sending emails, creating preferences
        # Updating cache, logging events, etc.
        return Response(...)
```

✅ CORRECT - Max 10 lines, delegate to service
```python
class UserViewSet(viewsets.ModelViewSet):
    def create(self, request):
        serializer = UserInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.create_user_with_onboarding(**serializer.validated_data)
        return Response(UserOutputSerializer(user).data, status=201)
```

**Why it matters**: Long methods indicate business logic in views. Hard to test, not reusable.

---

### 3. Services with State

❌ ANTI-PATTERN
```python
class UserService:
    def __init__(self):
        self.users = []  # State!

    def add_user(self, user):
        self.users.append(user)  # Mutates state!
```

✅ CORRECT - Stateless
```python
class UserService:
    @staticmethod
    def create_user(email: str) -> User:
        return User.objects.create(email=email)
```

**Why it matters**: Stateful services cause concurrency issues, harder to test, not thread-safe.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] ALL ViewSet methods <10 lines (only HTTP handling)?
- [ ] ALL business logic in Service classes (not views/serializers)?
- [ ] ALL service methods are @staticmethod?
- [ ] ALL service methods have type hints (params + return)?

### High Priority
- [ ] Services have single responsibility (not god classes)?
- [ ] Service files <300 lines each?
- [ ] Services call other services for different concerns?
- [ ] Private methods use underscore prefix (_method_name)?

### Medium Priority
- [ ] Service methods have docstrings?
- [ ] Complex logic has comments explaining "why"?
- [ ] Services organized by domain (apps/*/services.py)?
- [ ] Import order: Django → DRF → Project → Models

---

## 📚 Reference Documents

| File | Purpose |
|------|---------|
| `apps/core/services.py` | AuthService example with static methods |
| `apps/core/views/user.py:50-68` | UserViewSet service delegation example |
| `CLAUDE.md` | Service layer pattern principles |
| `.claude/core/architecture.md` | Detailed service layer architecture |

---

## 🎯 Activation Criteria

**Keywords**: "service", "business logic", "viewset", "delegation", "static method", "god class", "single responsibility"

**Auto-suggest when**:
- User creates new Django ViewSet
- User adds business logic to view
- User implements complex workflow
- User discusses code organization
- User mentions "where should this logic go?"

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**DI Compliance Target**: 100% (0 business logic in views, all in services)