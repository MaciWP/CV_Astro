# Performance Checklist

## Level 1: Query Count (1 min)

```python
# Add to test
from django.test.utils import override_settings
from django.db import connection

@override_settings(DEBUG=True)
def test_list_assets_query_count(api_client):
    # Arrange
    asset_factory.create_batch(10)
    
    # Act
    with connection.cursor() as cursor:
        start_queries = len(connection.queries)
        response = api_client.get('/api/assets/')
        end_queries = len(connection.queries)
    
    # Assert
    query_count = end_queries - start_queries
    assert query_count < 5, f"Too many queries: {query_count}"
```

## Level 2: Optimization (5 min)

```python
# Check queryset definition
class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related(
        'rack',
        'datacenter',
    ).prefetch_related(
        'tags',
    ).order_by('code')  # Always order_by
```

## Level 3: Profiling (10 min)

```bash
# Use django-silk for profiling
pip install django-silk

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    'silk',
]

# Visit /silk/ to see query analytics
```

**Target**: < 5 queries for list endpoints
