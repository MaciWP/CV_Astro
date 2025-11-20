# Input Serializer Template

**Template for write operations**

---

```python
# apps/<app>/serializers/<model>_input.py

from rest_framework import serializers
from apps.<app>.models import <Model>


class <Model>InputSerializer(serializers.ModelSerializer):
    """
    Input serializer for <Model> write operations.

    Used for: POST, PUT, PATCH
    """

    # Override fields if needed
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )

    class Meta:
        model = <Model>
        fields = [
            'field1',
            'field2',
            'field3',
        ]

    def validate_field1(self, value: str) -> str:
        """Validate field1"""
        if <Model>.objects.filter(field1=value).exists():
            raise serializers.ValidationError("Already exists")
        return value

    def validate(self, attrs: dict) -> dict:
        """Cross-field validation"""
        if attrs.get('field1') == attrs.get('field2'):
            raise serializers.ValidationError("Fields cannot be same")
        return attrs
```

---

**Key Points**:
- `write_only` for sensitive fields
- Field-level validation
- Cross-field validation
- NO business logic
