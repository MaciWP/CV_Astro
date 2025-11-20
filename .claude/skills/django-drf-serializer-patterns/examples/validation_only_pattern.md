# Validation ONLY Pattern

**Rule**: Serializers validate data, NOT execute business logic

---

## ❌ WRONG: Business Logic in Serializer

```python
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        # ❌ Creating objects
        user = User.objects.create(email=value)

        # ❌ Sending emails
        send_welcome_email(user)

        # ❌ Logging
        log_creation(user)

        return value
```

---

## ✅ CORRECT: Validation Only

```python
class UserInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)

    def validate_email(self, value):
        # ✅ Input validation only
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")

        if not value.endswith('@example.com'):
            raise serializers.ValidationError("Must use company email")

        return value.lower()

    def validate_password(self, value):
        # ✅ Password strength validation
        if not any(c.isupper() for c in value):
            raise serializers.ValidationError("Must contain uppercase")

        return value
```

**Business logic goes in service**:

```python
# apps/core/services.py
class UserService:
    @transaction.atomic
    def create(self, email: str, password: str) -> User:
        user = User.objects.create(email=email, password=make_password(password))
        send_welcome_email(user)
        log_creation(user)
        return user
```

---

**Rule**: Serializers validate, Services execute
