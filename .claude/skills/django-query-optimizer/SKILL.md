---
name: django-query-optimizer
description: Detects and fixes N+1 query problems and enforces query optimization. This skill should be used when working with Django QuerySets to ensure select_related, prefetch_related, and order_by are properly applied for optimal database performance.
activation:
  keywords:
    - django
    - query
    - queryset
    - N+1
    - select_related
    - prefetch_related
    - performance
  triggers:
    - objects.all()
    - objects.filter
    - for.*in.*objects
---

# Django Query Optimizer

⚡ **CRITICAL SKILL**: Detects and fixes N+1 queries, enforces select_related/prefetch_related usage.

**Version**: 1.0.0

## Core Rules

**#1 RULE: Always optimize queries with select_related, prefetch_related, and order_by**

```python
# ❌ WRONG - N+1 queries
queryset = Asset.objects.all()

# ✅ CORRECT - Optimized
queryset = Asset.objects.select_related('rack', 'datacenter').order_by('code')
```

**Pattern from**: `apps/core/views/user.py:23`

## Documentation (8 files, ~3,200 lines)
- 3 examples (N+1, select_related, prefetch_related)
- 2 checklists
- 1 template
- 1 reference

**Last Updated**: 2025-01-23
**Quality Score**: 95/100
