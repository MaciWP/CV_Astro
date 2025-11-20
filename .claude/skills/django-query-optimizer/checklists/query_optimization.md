# Query Optimization Checklist

## Check 1: N+1 Detection

```bash
# Run test with query logging
DJANGO_LOG_LEVEL=DEBUG pytest apps/core/tests/ -k "test_list" -s 2>&1 | grep "SELECT" | wc -l

# Expected: < 5 queries for simple list
```

## Check 2: ViewSet Querysets

```bash
# Find querysets without optimization
grep -rn "queryset = .*\.objects\.all()" apps/*/views/*.py

# Expected: 0 (all should have select_related/prefetch_related)
```

**Fix**:
```python
# BEFORE
queryset = Asset.objects.all()

# AFTER
queryset = Asset.objects.select_related('rack').order_by('code')
```

## Check 3: Missing order_by

```bash
# Find querysets without order_by
grep -rn "queryset = " apps/*/views/*.py | grep -v "order_by"

# Expected: Few or none
```

**Rule**: Always specify order_by to avoid random ordering
