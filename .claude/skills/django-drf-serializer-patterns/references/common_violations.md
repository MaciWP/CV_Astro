# Common Serializer Violations

**Anti-patterns and fixes**

---

## Violation 1: Business Logic in Serializer

```python
# ❌ WRONG
def validate_email(self, value):
    user = User.objects.create(email=value)  # Business logic!
    send_email(user)  # Business logic!
    return value

# ✅ CORRECT
def validate_email(self, value):
    if User.objects.filter(email=value).exists():
        raise ValidationError("Email exists")
    return value
```

---

## Violation 2: No Input/Output Separation

```python
# ❌ WRONG
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'

# ✅ CORRECT
class UserInputSerializer:
    pass

class UserOutputSerializer:
    pass
```

---

## Violation 3: Sensitive Fields Exposed

```python
# ❌ WRONG
class UserSerializer:
    class Meta:
        fields = '__all__'  # Includes password!

# ✅ CORRECT
class UserOutputSerializer:
    class Meta:
        fields = ['id', 'email', 'first_name']  # No password
```

---

**Detection**: Grep for `.create()`, `.save()` in serializers
