# Complete Query Optimization Guide

## 1. Relationship Types

**ForeignKey/OneToOne** → `select_related`
**ManyToMany** → `prefetch_related`
**Reverse ForeignKey** → `prefetch_related`

## 2. Optimization Patterns

```python
# Pattern 1: Simple select_related
Asset.objects.select_related('rack')

# Pattern 2: Nested select_related
Asset.objects.select_related('rack__row__room')

# Pattern 3: prefetch_related
User.objects.prefetch_related('groups')

# Pattern 4: Combined
Asset.objects.select_related('rack').prefetch_related('tags').order_by('code')
```

## 3. order_by Rules

**Always specify order_by** to avoid:
- Random ordering
- Inconsistent results
- Performance issues

```python
# ✅ CORRECT
queryset = Model.objects.order_by('name')
queryset = Model.objects.order_by('-created_at')  # Descending
queryset = Model.objects.order_by('field1', 'field2')  # Multiple
```

## 4. Query Count Targets

- Simple list: 1-3 queries
- List with relations: 2-5 queries
- Detail with nested: 3-7 queries

**If more**: You have N+1 problem

## 5. Tools

- Django Debug Toolbar
- django-silk
- `connection.queries` in tests
- `LOGGING` for SQL queries

---

**Reference**: Django QuerySet optimization docs
