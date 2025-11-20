# N+1 Query Detection

**Problem**: Multiple queries instead of one

## Example N+1

```python
# ❌ WRONG - N+1 queries
assets = Asset.objects.all()  # 1 query
for asset in assets:  # 100 assets
    print(asset.rack.name)  # 100 queries! (N+1)
# Total: 101 queries
```

## Fix with select_related

```python
# ✅ CORRECT - 1 query
assets = Asset.objects.select_related('rack')
for asset in assets:
    print(asset.rack.name)  # 0 queries (already loaded)
# Total: 1 query
```

## Detection

```bash
# Enable query logging in settings_test.py
LOGGING = {
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
        },
    },
}

# Run test and count queries
pytest apps/assets/tests/test_views.py -s | grep "SELECT" | wc -l
```

**Rule**: If queries > 5 for simple list, you have N+1
