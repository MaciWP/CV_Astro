# Migration Safety Checklist

## Pre-Migration Checks

- [ ] Migrations are reversible (`python manage.py migrate <app> <previous>` works)
- [ ] Adding NOT NULL? → Nullable first, populate, then alter
- [ ] Adding indexes? → Use `atomic = False` + CONCURRENTLY
- [ ] Renaming fields? → Deploy in 2 steps (add new, remove old)
- [ ] Large table (>1M rows)? → Test migration time on staging

## Migration Testing

```bash
# Test forward migration
python manage.py migrate --plan

# Test on copy of production data
pg_dump production_db > backup.sql
createdb test_db
psql test_db < backup.sql
python manage.py migrate --database=test_db

# Measure time
time python manage.py migrate
```

## Rollback Plan

```bash
# Always test rollback
python manage.py migrate <app> <previous_migration_number>

# Should complete without errors
```

## Production Deployment

1. Backup database
2. Run migration during low traffic
3. Monitor query performance
4. Have rollback ready

**Rule**: Test migrations on staging with production-like data
