# PostgreSQL Performance Guide

## 1. Indexing Strategy

**When to index**:
- WHERE clauses
- ORDER BY fields
- JOIN conditions
- Foreign keys (auto-indexed)

**When NOT to index**:
- Low cardinality (<10 unique values)
- Rarely queried
- Write-heavy tables (indexes slow writes)

## 2. Index Types

**B-tree** (default): Most common, ORDER BY support
**GIN**: Full-text search, array fields
**GiST**: Geometric data, full-text
**Hash**: Equality only (=), fast

```python
# B-tree (default)
db_index=True

# GIN for full-text
from django.contrib.postgres.indexes import GinIndex

class Meta:
    indexes = [
        GinIndex(fields=['search_vector']),
    ]
```

## 3. Query Optimization

- Use `select_related` for ForeignKey
- Use `prefetch_related` for ManyToMany
- Avoid `.count()` on large tables (use estimates)
- Use `only()` / `defer()` for large models

## 4. Migration Safety

- Add nullable fields, populate, then make NOT NULL
- Create indexes CONCURRENTLY (`atomic = False`)
- Test on production-like data
- Have rollback plan

## 5. Monitoring

```bash
# Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

# Missing indexes
SELECT schemaname, tablename, attname
FROM pg_stats
WHERE correlation < 0.1
ORDER BY n_distinct DESC;
```

**Tools**: pg_stat_statements, django-debug-toolbar, New Relic
