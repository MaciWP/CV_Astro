# Real Binora Serializers

**Real patterns from**: `apps/core/serializers/user.py`

---

## Example 1: User Serializers

```python
# apps/core/serializers/user.py

class UserInputSerializer(serializers.ModelSerializer):
    """Input serializer for user creation/update"""

    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'is_active',
        ]


class UserOutputSerializer(serializers.ModelSerializer):
    """Output serializer for user retrieval"""

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

---

## Example 2: Nested Serializers

```python
class AssetOutputSerializer(serializers.ModelSerializer):
    rack = RackSerializer(read_only=True)  # Nested
    datacenter = DatacenterSerializer(read_only=True)  # Nested

    class Meta:
        model = Asset
        fields = ['id', 'code', 'name', 'rack', 'datacenter']
```

---

**Key Points**:
- Clear Input/Output separation
- Nested serializers in Output only
- `read_only_fields` explicit
