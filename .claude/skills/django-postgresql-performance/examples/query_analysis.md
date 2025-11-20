# Query Analysis

**Tool**: EXPLAIN ANALYZE for query performance

## Basic EXPLAIN

```sql
-- In PostgreSQL shell
EXPLAIN ANALYZE SELECT * FROM assets_asset WHERE status = 'active' ORDER BY code;
```

**Look for**:
- Seq Scan (bad) → Index Scan (good)
- High cost numbers
- Long execution time

## Django Query Analysis

```python
# In Django shell
from django.db import connection
from apps.assets.models import Asset

# Get SQL
print(Asset.objects.filter(status='active').query)

# Run with EXPLAIN
with connection.cursor() as cursor:
    cursor.execute("""
        EXPLAIN ANALYZE
        SELECT * FROM assets_asset
        WHERE status = 'active'
        ORDER BY code
    """)
    print(cursor.fetchall())
```

## Optimization Targets

- **Seq Scan** → Add index
- **Nested Loop** with many rows → Consider JOIN optimization
- **Sort** → Add index on ORDER BY field

**Tool**: `django-debug-toolbar` shows queries in development
