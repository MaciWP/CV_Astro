# Refactoring to Input/Output Checklist

**How to refactor single serializer to Input/Output pattern**

---

## Step 1: Analyze Current Serializer

Identify:
- Fields used for input (POST, PUT)
- Fields used for output (GET)
- Sensitive fields (password, tokens)
- Read-only fields (id, created_at)

---

## Step 2: Create InputSerializer

```python
class UserInputSerializer(serializers.ModelSerializer):
    """Fields for write operations"""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name']  # Only writable
```

---

## Step 3: Create OutputSerializer

```python
class UserOutputSerializer(serializers.ModelSerializer):
    """Fields for read operations"""

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'created_at']  # Including read-only
        read_only_fields = ['id', 'created_at']
```

---

## Step 4: Update ViewSet

```python
class UserViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserInputSerializer
        return UserOutputSerializer
```

---

## Step 5: Test

Verify:
- POST uses InputSerializer
- GET uses OutputSerializer
- Sensitive fields not exposed
- Validation works

---

**Time**: 15-30 minutes per serializer
