# Index Validation Checklist

## Check 1: Filtered Fields Have Indexes

```bash
# Find fields used in filters without db_index
grep -rn "objects.filter(" apps/*/views/*.py apps/*/services.py | \
grep -o "filter([^)]*" | \
grep -o "[a-z_]*=" | \
sort | uniq

# Cross-reference with models to ensure db_index=True
```

## Check 2: Ordered Fields Have Indexes

```bash
# Find order_by fields
grep -rn "order_by(" apps/ | grep -o "order_by([^)]*"

# Ensure these fields have db_index=True in models
```

## Check 3: Migration Safety

```bash
# Check for unsafe NOT NULL additions
grep -rn "AddField.*null=False" apps/*/migrations/

# Expected: 0 (all should be nullable first, then altered)
```

## Check 4: Missing Indexes on FK

```bash
# ForeignKey fields are auto-indexed, but check Meta.indexes
grep -rn "class Meta:" apps/*/models.py -A 10 | grep "indexes"

# Ensure composite indexes exist for common queries
```

**Rule**: Run checks before deploying migrations
