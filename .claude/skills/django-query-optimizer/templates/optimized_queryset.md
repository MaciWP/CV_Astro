# Optimized QuerySet Template

**Template for ViewSet queryset with full optimization**

```python
# apps/<app>/views/<model>.py

from rest_framework import viewsets
from apps.<app>.models import <Model>
from apps.<app>.serializers import <Model>Serializer


class <Model>ViewSet(viewsets.ModelViewSet):
    """
    ViewSet for <Model> with optimized queryset.

    Query optimization:
    - select_related: ForeignKey/OneToOne relationships
    - prefetch_related: ManyToMany/Reverse FK
    - order_by: Consistent ordering
    """

    queryset = <Model>.objects.select_related(
        # ForeignKey fields
        'foreign_key_field',
        'another_fk_field',
        
        # Nested ForeignKey (follow chain)
        'foreign_key_field__nested_fk',
    ).prefetch_related(
        # ManyToMany fields
        'many_to_many_field',
        
        # Reverse ForeignKey
        'reverse_fk_related_name',
    ).order_by(
        # Consistent ordering (required!)
        'name',  # or 'code', 'created_at', etc.
    )

    serializer_class = <Model>Serializer
```

**Checklist**:
- [ ] select_related for ForeignKey
- [ ] prefetch_related for ManyToMany
- [ ] order_by specified
- [ ] Test query count < 5

**Real Example**: `apps/core/views/user.py:23`
