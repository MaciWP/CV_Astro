# Index Migration Template

**Template for adding indexes safely**

```python
# apps/<app>/migrations/00XX_add_indexes.py

from django.db import migrations, models


class Migration(migrations.Migration):
    # Required for CONCURRENTLY (non-blocking)
    atomic = False

    dependencies = [
        ('<app>', 'previous_migration'),
    ]

    operations = [
        # Single field index
        migrations.AddIndex(
            model_name='<model>',
            index=models.Index(
                fields=['field_name'],
                name='<model>_field_idx',
            ),
        ),

        # Composite index
        migrations.AddIndex(
            model_name='<model>',
            index=models.Index(
                fields=['field1', 'field2', 'field3'],
                name='<model>_composite_idx',
            ),
        ),

        # Partial index (PostgreSQL only)
        migrations.AddIndex(
            model_name='<model>',
            index=models.Index(
                fields=['status'],
                condition=models.Q(is_active=True),
                name='<model>_active_status_idx',
            ),
        ),

        # GIN index for full-text search
        migrations.AddIndex(
            model_name='<model>',
            index=models.indexes.GinIndex(
                fields=['search_vector'],
                name='<model>_search_idx',
            ),
        ),
    ]
```

**Checklist**:
- [ ] `atomic = False` for CONCURRENTLY
- [ ] Index name follows convention
- [ ] Tested on staging
- [ ] Rollback plan ready
