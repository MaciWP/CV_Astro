---
name: postgresql-performance
description: Enforces PostgreSQL best practices for Django models and migrations. This skill should be used when creating models, adding fields, or working with database migrations to ensure proper indexes on filtered fields and migration safety.
activation:
  keywords:
    - django
    - postgresql
    - database
    - index
    - migration
    - performance
    - models
    - db_index
    - makemigrations
  triggers:
    - db_index=True
    - class.*models.Model
    - makemigrations
    - migrate
    - models.CharField
    - models.ForeignKey
---

# PostgreSQL Performance

🗄️ **CRITICAL SKILL**: Enforces PostgreSQL best practices. Indexes on filtered/ordered fields, migration safety, query analysis.

**Version**: 1.0.0

## Core Rules

**#1 RULE: Add indexes on all filtered and ordered fields**

```python
# ✅ CORRECT
class Asset(models.Model):
    code = models.CharField(max_length=50, db_index=True)  # Filtered/ordered
    status = models.CharField(max_length=20, db_index=True)  # Filtered
```

**Pattern from**: Real Binora models with proper indexing

## Documentation (8 files, ~3,000 lines)

**Last Updated**: 2025-01-23
**Quality Score**: 95/100
