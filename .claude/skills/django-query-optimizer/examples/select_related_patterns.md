# select_related Patterns

**Use for**: ForeignKey and OneToOne relationships

## Basic Usage

```python
# Single level
Asset.objects.select_related('rack')

# Multiple fields
Asset.objects.select_related('rack', 'datacenter')

# Nested (follow ForeignKey chain)
Asset.objects.select_related(
    'rack',
    'rack__row',  # rack.row
    'rack__row__room',  # rack.row.room
)
```

## Real Binora Pattern

```python
# apps/core/views/user.py:23
queryset = User.objects.select_related(
    'company',
).prefetch_related(
    'groups',
    'companies',
).order_by('email')
```

## When to Use

- ✅ ForeignKey
- ✅ OneToOne
- ✅ Accessing related object attributes
- ❌ ManyToMany (use prefetch_related)
- ❌ Reverse ForeignKey (use prefetch_related)

**Rule**: select_related for "TO_ONE" relationships
