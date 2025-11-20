# Output Serializer Template

**Template for read operations**

---

```python
# apps/<app>/serializers/<model>_output.py

from rest_framework import serializers
from apps.<app>.models import <Model>


class <Model>OutputSerializer(serializers.ModelSerializer):
    """
    Output serializer for <Model> read operations.

    Used for: GET (list, retrieve)
    """

    # Nested serializers
    related_model = RelatedModelSerializer(read_only=True)

    # Computed fields
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = <Model>
        fields = [
            'id',
            'field1',
            'field2',
            'related_model',
            'full_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_full_name(self, obj: <Model>) -> str:
        """Compute full_name from first_name and last_name"""
        return f"{obj.first_name} {obj.last_name}"
```

---

**Key Points**:
- `read_only_fields` explicit
- Nested serializers for related objects
- `SerializerMethodField` for computed fields
- NO write logic
