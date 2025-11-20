# Input/Output Separation

**Rule**: Different serializers for read vs write

**Real pattern**: `apps/core/serializers/user.py`

---

## ❌ WRONG: Single Serializer

```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # Same for read and write!
```

**Problems**:
- Exposes sensitive fields on read
- Requires write-only fields on write
- Mixed concerns

---

## ✅ CORRECT: Separate Serializers

```python
class UserInputSerializer(serializers.ModelSerializer):
    """For write operations (POST, PUT, PATCH)"""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

class UserOutputSerializer(serializers.ModelSerializer):
    """For read operations (GET)"""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'created_at']
        read_only_fields = ['id', 'created_at']
```

---

## ViewSet Integration

```python
class UserViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return UserInputSerializer
        return UserOutputSerializer
```

---

**Benefits**:
- Clear separation
- Different validation for input/output
- Better security
