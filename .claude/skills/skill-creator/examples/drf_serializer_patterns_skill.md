---
name: "Django REST Framework Serializer Patterns"
description: "Enforces DRF serializer best practices with Input/Output separation, field-level validation, and proper read_only/write_only configuration. Auto-activates on: serializer, validation, DRF, input/output, field-level, read_only, write_only, nested serializer. Prevents single serializer for both I/O, business logic in serializers, missing validation, incorrect field configuration. Ensures separate Input/Output serializers, validate_<field> methods, proper read_only_fields, nested serializer optimization. Targets: 100% I/O separation, comprehensive validation, optimized nested serializers."
---

# Django REST Framework Serializer Patterns

**Auto-activates when**: Discussing DRF serializers, validation, input/output separation, field configuration, or nested serializers.

---

## 🎯 Mission

Enforce **100% Input/Output serializer separation** in Django REST Framework for clear validation, optimized queries, and maintainable API design.

---

## 📐 Core Principles

### 1. Input/Output Serializer Separation

**Rule**: NEVER use single serializer for both write (create/update) and read (list/retrieve). Always separate Input and Output serializers.

**Why it matters**: Different operations need different fields (write needs validation, read needs related data), avoids N+1 queries, clear API contracts, better security (prevent exposing sensitive fields).

❌ WRONG - Single serializer for everything
```python
# apps/core/serializers/user.py
from rest_framework import serializers
from apps.core.models import User

class UserSerializer(serializers.ModelSerializer):
    """Single serializer used for both input and output - BAD!"""

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'company', 'is_active', 'created_at']

    # Problems:
    # 1. 'id' and 'created_at' should be read-only but not marked
    # 2. 'company' causes N+1 queries on list (no select_related)
    # 3. Password validation mixed with output logic
    # 4. Can't optimize queries differently for read vs write
```

✅ CORRECT - Separate Input and Output serializers
```python
# apps/core/serializers/user.py
from rest_framework import serializers
from apps.core.models import User, Company

# Input Serializer - Validation only
class UserInputSerializer(serializers.Serializer):
    """Input serializer for creating/updating users. Validation only."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(max_length=100, required=True)
    last_name = serializers.CharField(max_length=100, required=True)

    def validate_email(self, value: str) -> str:
        """Ensure email is unique."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value.lower()

    def validate_password(self, value: str) -> str:
        """Ensure password meets complexity requirements."""
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter")
        return value

# Output Serializer - Read only with optimizations
class UserOutputSerializer(serializers.ModelSerializer):
    """Output serializer for reading users. Optimized for queries."""
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'company_name', 'is_active', 'created_at', 'updated_at']
        read_only_fields = fields  # ALL fields read-only (output only)

    # Note: ViewSet should use .select_related('company') for optimization
```

**Auto-check**:
- [ ] Separate Input and Output serializers for each model?
- [ ] Input serializer uses Serializer (not ModelSerializer) for validation control?
- [ ] Output serializer uses ModelSerializer with read_only_fields?
- [ ] Output serializer fields optimized for queries (select_related/prefetch_related)?

---

### 2. Field-Level Validation with validate_<field>

**Rule**: Use validate_<field> methods for field-specific validation. Use validate() for cross-field validation only.

**Why it matters**: Clear validation logic, better error messages, follows DRF conventions, easier testing, field-level errors instead of non_field_errors.

❌ WRONG - All validation in validate()
```python
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    serial_number = serializers.CharField(max_length=50)
    asset_type = serializers.CharField(max_length=20)

    def validate(self, data):
        # All validation in one place - hard to read, poor error messages
        if len(data['name']) < 3:
            raise serializers.ValidationError("Name too short")

        if not data['serial_number'].isalnum():
            raise serializers.ValidationError("Serial must be alphanumeric")

        if data['asset_type'] not in ['hardware', 'software', 'license']:
            raise serializers.ValidationError("Invalid asset type")

        # Cross-field validation mixed with field-level validation
        if data['asset_type'] == 'software' and 'serial_number' in data:
            raise serializers.ValidationError("Software assets don't need serial numbers")

        return data
```

✅ CORRECT - Field-level with validate_<field>
```python
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    serial_number = serializers.CharField(max_length=50, required=False)
    asset_type = serializers.ChoiceField(choices=['hardware', 'software', 'license'])

    def validate_name(self, value: str) -> str:
        """Ensure name is at least 3 characters."""
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters")
        return value.strip()

    def validate_serial_number(self, value: str) -> str:
        """Ensure serial number is alphanumeric."""
        if value and not value.isalnum():
            raise serializers.ValidationError("Serial number must be alphanumeric")
        return value.upper()

    def validate_asset_type(self, value: str) -> str:
        """Validate asset type is supported."""
        # Choice field already validates, this is for additional logic
        return value

    def validate(self, data: dict) -> dict:
        """Cross-field validation only."""
        # Only validate relationships between fields
        if data['asset_type'] == 'software' and data.get('serial_number'):
            raise serializers.ValidationError({
                'serial_number': "Software assets should not have serial numbers"
            })
        return data
```

**Auto-check**:
- [ ] Field-level validation uses validate_<field> methods?
- [ ] validate() method only for cross-field validation?
- [ ] Validation errors return field-specific errors (not non_field_errors)?
- [ ] Type hints on all validate_<field> methods?

---

### 3. Proper read_only_fields and write_only Configuration

**Rule**: Use read_only_fields for auto-generated fields. Use write_only=True for sensitive fields (passwords). Never expose sensitive data in output.

**Why it matters**: Security (prevent password leaks), data integrity (prevent id/timestamp modification), clear API contracts.

❌ WRONG - Missing field configuration
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'created_at', 'updated_at']

    # Problems:
    # 1. 'password' will be returned in responses (SECURITY ISSUE!)
    # 2. 'id', 'created_at', 'updated_at' can be modified by client
    # 3. No write_only or read_only configuration
```

✅ CORRECT - Proper field configuration
```python
# Input Serializer
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)  # NEVER in output
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)

# Output Serializer
class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'created_at', 'updated_at']
        read_only_fields = fields  # ALL fields read-only in output serializer

    # Note: 'password' is NEVER in output fields
```

**Auto-check**:
- [ ] Sensitive fields (password, tokens) have write_only=True?
- [ ] Auto-generated fields (id, created_at, updated_at) in read_only_fields?
- [ ] Output serializers have ALL fields in read_only_fields?
- [ ] NO sensitive fields in Output serializer fields?

---

### 4. Nested Serializer Optimization

**Rule**: Use nested serializers for Output only (read). For Input, use PrimaryKeyRelatedField or SlugRelatedField. Optimize nested serializers with select_related/prefetch_related.

**Why it matters**: Prevents N+1 queries, avoids deep nesting complexity, clear Input contracts (IDs not objects), optimized database queries.

❌ WRONG - Nested serializers everywhere, no optimization
```python
# Input with nested serializer (complex, error-prone)
class AssetInputSerializer(serializers.ModelSerializer):
    company = CompanySerializer()  # Nested! How to create/update?
    created_by = UserSerializer()  # Nested! Complex validation!

    class Meta:
        model = Asset
        fields = ['name', 'company', 'created_by']

    def create(self, validated_data):
        # Complex logic to handle nested data
        company_data = validated_data.pop('company')
        created_by_data = validated_data.pop('created_by')
        # ... lots of code to handle nesting
        return Asset.objects.create(**validated_data)

# Output without optimization (N+1 queries!)
class AssetOutputSerializer(serializers.ModelSerializer):
    company = CompanySerializer()  # N+1 query on each asset!
    created_by = UserSerializer()  # N+1 query on each asset!

    class Meta:
        model = Asset
        fields = ['id', 'name', 'company', 'created_by']
```

✅ CORRECT - IDs for Input, optimized nesting for Output
```python
# Input - Simple IDs or slugs
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    company_id = serializers.IntegerField()  # Simple ID
    # created_by set automatically from request.user, not in input

    def validate_company_id(self, value: int) -> int:
        """Ensure company exists."""
        if not Company.objects.filter(id=value).exists():
            raise serializers.ValidationError("Company does not exist")
        return value

# Output - Nested with optimization hint
class AssetOutputSerializer(serializers.ModelSerializer):
    company = CompanyOutputSerializer(read_only=True)  # Nested for output
    created_by = UserOutputSerializer(read_only=True)

    class Meta:
        model = Asset
        fields = ['id', 'name', 'serial_number', 'company', 'created_by', 'created_at', 'updated_at']
        read_only_fields = fields

    # Note: ViewSet MUST use:
    # queryset = Asset.objects.select_related('company', 'created_by')
```

**Auto-check**:
- [ ] Input serializers use IDs/slugs for relationships (not nested serializers)?
- [ ] Output serializers use nested serializers for related data?
- [ ] ViewSet queries use select_related/prefetch_related for nested serializers?
- [ ] Nested serializers marked read_only=True?

---

### 5. FormSerializer Composition for Django Forms

**Rule**: When working with Django forms (non-DRF views), compose serializer from form using FormSerializer pattern. Don't duplicate validation logic.

**Why it matters**: DRY (Don't Repeat Yourself), consistent validation between DRF and Django views, easier maintenance.

❌ WRONG - Duplicate validation logic
```python
# Django Form
class UserForm(forms.Form):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=100)

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already exists")
        return email

# DRF Serializer - Duplicates validation!
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=100)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():  # DUPLICATE!
            raise serializers.ValidationError("Email already exists")
        return value
```

✅ CORRECT - Compose from form (Binora pattern)
```python
# Django Form (single source of truth)
class UserForm(forms.Form):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=100)

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already exists")
        return email

# DRF Serializer - Composes from form
class UserInputSerializer(serializers.Serializer):
    """Wraps UserForm for DRF validation."""
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=100)

    def validate(self, data: dict) -> dict:
        """Delegate validation to Django form."""
        form = UserForm(data=data)
        if not form.is_valid():
            raise serializers.ValidationError(form.errors)
        return form.cleaned_data
```

**Auto-check**:
- [ ] Validation logic in Django Form (single source of truth)?
- [ ] DRF serializer delegates to form for validation?
- [ ] NO duplicate validation between form and serializer?
- [ ] FormSerializer pattern used when both DRF and Django views exist?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Single Serializer for Input and Output

❌ ANTI-PATTERN
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # Everything! Password exposed, no optimization!
```

✅ CORRECT
```python
class UserInputSerializer(serializers.Serializer):  # Validation only
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class UserOutputSerializer(serializers.ModelSerializer):  # Read only
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']
        read_only_fields = fields
```

**Why it matters**: One serializer can't optimize for both operations. Input needs validation, output needs related data and query optimization.

---

### 2. Business Logic in Serializers

❌ ANTI-PATTERN
```python
class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        send_welcome_email(user)  # Business logic! Belongs in service!
        create_default_preferences(user)  # Business logic!
        return user
```

✅ CORRECT
```python
class UserInputSerializer(serializers.Serializer):
    # Validation only, NO create/update methods
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# In ViewSet
def create(self, request):
    serializer = UserInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = UserService.create_user_with_onboarding(**serializer.validated_data)
    return Response(UserOutputSerializer(user).data, status=201)
```

**Why it matters**: Serializers are for validation/transformation only. Business logic belongs in services for testability and reusability.

---

### 3. Missing Field-Level Validation

❌ ANTI-PATTERN
```python
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    serial_number = serializers.CharField()

    # No validate_<field> methods, all in validate()
    def validate(self, data):
        # Giant method with all validation mixed together
        if len(data['name']) < 3:
            raise serializers.ValidationError("Name too short")
        if not data['serial_number'].isalnum():
            raise serializers.ValidationError("Serial invalid")
        # ... 50 more lines
        return data
```

✅ CORRECT
```python
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    serial_number = serializers.CharField()

    def validate_name(self, value: str) -> str:
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters")
        return value.strip()

    def validate_serial_number(self, value: str) -> str:
        if not value.isalnum():
            raise serializers.ValidationError("Serial number must be alphanumeric")
        return value.upper()

    def validate(self, data: dict) -> dict:
        # Only cross-field validation
        return data
```

**Why it matters**: Field-level methods provide better error messages, easier testing, clearer code organization.

---

### 4. Exposing Sensitive Fields

❌ ANTI-PATTERN
```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name']  # password exposed!
```

✅ CORRECT
```python
class UserInputSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=8, write_only=True)  # NEVER in output

class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']  # NO password
        read_only_fields = fields
```

**Why it matters**: Security vulnerability. Password hashes or sensitive data must NEVER be exposed in API responses.

---

### 5. Nested Serializers in Input

❌ ANTI-PATTERN
```python
class AssetInputSerializer(serializers.ModelSerializer):
    company = CompanySerializer()  # Nested! Complex validation!

    class Meta:
        model = Asset
        fields = ['name', 'company']

    def create(self, validated_data):
        # Complex logic to handle nested company creation/update
        company_data = validated_data.pop('company')
        company, _ = Company.objects.get_or_create(**company_data)
        return Asset.objects.create(company=company, **validated_data)
```

✅ CORRECT
```python
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    company_id = serializers.IntegerField()  # Simple ID

    def validate_company_id(self, value: int) -> int:
        if not Company.objects.filter(id=value).exists():
            raise serializers.ValidationError("Company does not exist")
        return value
```

**Why it matters**: Input should accept IDs, not nested objects. Simpler, clearer API contracts, easier validation.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] Separate Input and Output serializers for each model?
- [ ] Input serializers use Serializer (not ModelSerializer)?
- [ ] Output serializers have ALL fields in read_only_fields?
- [ ] NO sensitive fields (password, tokens) in Output serializer?
- [ ] NO business logic in serializers (create/update methods)?

### High Priority
- [ ] Field-level validation uses validate_<field> methods?
- [ ] Input serializers use IDs for relationships (not nested serializers)?
- [ ] Output serializers optimize nested data (select_related hints)?
- [ ] All validate_<field> methods have type hints?
- [ ] write_only=True on sensitive fields?

### Medium Priority
- [ ] FormSerializer pattern used when Django forms exist?
- [ ] ChoiceField used instead of validate() for enums?
- [ ] Validation errors return field-specific errors?
- [ ] Consistent naming (UserInputSerializer, UserOutputSerializer)?
- [ ] Serializers documented with docstrings?

---

## 📚 Reference Documents

| File | Purpose |
|------|---------|
| `apps/core/serializers/user.py` | UserInputSerializer/UserOutputSerializer pattern |
| `apps/core/serializers/__init__.py` | FormSerializer composition examples |
| `apps/assets/serializers.py` | Asset I/O serializer separation |
| `CLAUDE.md` | Serializer patterns and guidelines |
| `.claude/core/architecture.md` | Service layer + serializer delegation |

---

## 🎯 Activation Criteria

**Keywords**: "serializer", "validation", "DRF", "input/output", "field-level", "read_only", "write_only", "nested serializer", "ModelSerializer"

**Auto-suggest when**:
- User creates DRF serializer
- User implements validation logic
- User discusses API input/output
- User mentions nested serializers or relationships
- User works on Django forms with DRF endpoints
- User adds sensitive fields (password, tokens)

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**I/O Separation Target**: 100% (0 single serializers for both I/O, all validations in Input, all reads in Output)
