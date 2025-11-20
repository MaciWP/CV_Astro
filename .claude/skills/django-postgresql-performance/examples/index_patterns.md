# Index Patterns

**Rule**: Index fields used in WHERE, ORDER BY, JOIN

## Basic Indexing

```python
from django.db import models

class Asset(models.Model):
    # ✅ Indexed - used in filters/ordering
    code = models.CharField(max_length=50, db_index=True)
    status = models.CharField(max_length=20, db_index=True)
    
    # ✅ Indexed - ForeignKey (auto-indexed)
    rack = models.ForeignKey(Rack, on_delete=models.CASCADE)
    
    # ❌ Not indexed - rarely filtered
    description = models.TextField()
```

## Composite Indexes

```python
class Meta:
    indexes = [
        # Composite index for common query
        models.Index(fields=['company', 'status', 'code']),
        
        # Partial index (PostgreSQL)
        models.Index(
            fields=['status'],
            condition=models.Q(is_active=True),
            name='active_status_idx'
        ),
    ]
```

## When to Index

- ✅ Filtered fields (`WHERE status = 'active'`)
- ✅ Ordered fields (`ORDER BY created_at`)
- ✅ Foreign keys (auto-indexed)
- ✅ Unique constraints (auto-indexed)
- ❌ Low cardinality (few unique values)
- ❌ Rarely queried fields

**Rule**: Index if used in queries > 100 times/day
