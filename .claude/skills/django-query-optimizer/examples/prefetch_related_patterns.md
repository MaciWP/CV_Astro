# prefetch_related Patterns

**Use for**: ManyToMany and reverse ForeignKey

## Basic Usage

```python
# ManyToMany
User.objects.prefetch_related('groups')

# Reverse ForeignKey
Company.objects.prefetch_related('users')  # users = reverse FK

# Multiple
Asset.objects.prefetch_related('tags', 'documents')
```

## Combined with select_related

```python
# ✅ CORRECT - Both
Asset.objects.select_related(  # ForeignKey
    'rack',
    'datacenter',
).prefetch_related(  # ManyToMany
    'tags',
    'documents',
).order_by('code')
```

## Prefetch Objects

```python
from django.db.models import Prefetch

# With filtering
Asset.objects.prefetch_related(
    Prefetch(
        'documents',
        queryset=Document.objects.filter(is_active=True)
    )
)
```

**Rule**: prefetch_related for "TO_MANY" relationships
