# Serializer Validation Checklist

**Quick validation for serializer compliance**

---

## Check 1: Input/Output Separation

```bash
# Find serializers without Input/Output separation
grep -rn "class.*Serializer" apps/*/serializers/*.py | grep -v "Input\|Output"

# Expected: Few (should have Input/Output suffix)
```

**Fix**: Create separate Input and Output serializers

---

## Check 2: Business Logic in Serializers

```bash
# Find business logic (ORM operations, email sending)
grep -rn "\.create()\|\.save()\|send_" apps/*/serializers/*.py

# Expected: 0 results
```

**Fix**: Move to service layer

---

## Check 3: write_only / read_only

```python
# ✅ CORRECT
class UserInputSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Input only

class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ['id', 'created_at']  # Output only
```

---

## Check 4: Validation Methods

```python
# ✅ CORRECT - Validation only
def validate_email(self, value):
    if User.objects.filter(email=value).exists():
        raise ValidationError("Email exists")
    return value

# ❌ WRONG - Business logic
def validate_email(self, value):
    User.objects.create(email=value)  # NO!
    return value
```

---

**Tool**: Run checks before PR
