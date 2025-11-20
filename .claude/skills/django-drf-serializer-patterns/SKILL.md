---
name: drf-serializer-patterns
description: Enforces DRF serializer best practices including Input/Output separation and validation-only logic. This skill should be used when working with Django REST Framework serializers to ensure proper patterns, prevent business logic in serializers, and validate FormSerializer composition.
activation:
  keywords:
    - drf
    - serializer
    - validation
    - input output
    - django rest framework
    - rest_framework
    - modelserializer
  triggers:
    - class.*Serializer
    - def validate_
    - serializer.is_valid
    - serializers.ModelSerializer
    - serializers.Serializer
---

# DRF Serializer Patterns

🎨 **CRITICAL SKILL**: Enforces DRF serializer patterns in Binora Backend. Input/Output separation, validation ONLY, NO business logic.

**Version**: 1.0.0

---

## 🎯 Core Rules

**#1 RULE: Separate Input and Output serializers. NO business logic in serializers.**

**Pattern from**: `apps/core/serializers/user.py`

---

## ✅ REQUIRED Patterns

### 1. Input/Output Separation

```python
# ✅ CORRECT
class UserInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name']

class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'created_at']
        read_only_fields = ['id', 'created_at']
```

### 2. Validation ONLY

```python
# ✅ CORRECT - Validation only
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email exists")
        return value

# ❌ WRONG - Business logic
def validate_email(self, value):
    user = User.objects.create(email=value)  # NO!
    send_email(user)  # NO!
    return value
```

---

## 📚 Documentation (11 files, ~4,200 lines)

---

**Last Updated**: 2025-01-23
**Quality Score**: 95/100
