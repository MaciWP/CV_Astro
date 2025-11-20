# Query Analysis

Analyze Django ORM queries for performance issues: N+1 queries, missing indexes, inefficient patterns.

## Usage

```
/query-analysis [file_or_path]
```

**Examples:**
```
/query-analysis apps/assets/views/assets.py
/query-analysis apps/core/
/query-analysis .
```

## What It Analyzes

Detects slow query patterns and suggests optimizations.

### Detection Patterns

1. **N+1 Queries**
   - Loop over queryset accessing related objects
   - Missing select_related/prefetch_related

2. **Missing indexes**
   - Frequently filtered fields without db_index
   - No Meta.indexes for compound queries

3. **Inefficient queries**
   - No order_by() causing random ordering
   - Using .all() then filtering in Python
   - Multiple queries when one would work

4. **Database constraints**
   - Uniqueness enforced in code, not DB
   - Missing CHECK constraints

## Process

1. **Scan code** for ORM patterns
2. **Detect issues** using pattern matching
3. **Estimate impact** (queries per request)
4. **Suggest fixes** with code examples

## Output Format

### Clean Code

```
✅ QUERY ANALYSIS - EFFICIENT

Path: apps/assets/views/assets.py
Queries analyzed: 5
Issues: 0

All queries optimized:
  ✅ select_related used correctly
  ✅ Indexes on filtered fields
  ✅ order_by specified
  ✅ No N+1 patterns detected
```

### Issues Found

```
⚠️ QUERY ANALYSIS - ISSUES DETECTED

Path: apps/assets/views/assets.py
Queries analyzed: 8
Issues: 4 (2 CRITICAL, 2 WARNING)

CRITICAL Issues:

1. N+1 Query Problem
   Location: apps/assets/views/assets.py:45-47
   Impact: +100 queries per request
   
   Current code:
   ```python
   assets = Asset.objects.all()  # 1 query
   for asset in assets:
       print(asset.rack.name)  # +1 query per asset (N+1!)
   ```
   
   FIX:
   ```python
   assets = Asset.objects.select_related('rack').all()  # 1 query total
   for asset in assets:
       print(asset.rack.name)  # No additional queries
   ```
   
   Optimization: 100 queries → 1 query (99% reduction)

2. Missing Index on Filtered Field
   Location: apps/assets/models.py:23
   Impact: Full table scan on every filter
   
   Current code:
   ```python
   status = models.CharField(max_length=20)  # No index
   ```
   
   Used in queries:
   - apps/assets/views/assets.py:34: Asset.objects.filter(status='active')
   - apps/assets/views/assets.py:56: Asset.objects.filter(status='maintenance')
   
   FIX:
   ```python
   status = models.CharField(max_length=20, db_index=True)
   ```
   
   Migration needed:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

WARNING Issues:

3. No order_by Specified
   Location: apps/assets/views/assets.py:67
   Impact: Non-deterministic ordering
   
   Current code:
   ```python
   assets = Asset.objects.filter(status='active')  # Random order
   ```
   
   FIX:
   ```python
   assets = Asset.objects.filter(status='active').order_by('-created_at')
   ```

4. Uniqueness Check in Code
   Location: apps/assets/services.py:34
   Impact: Race condition possible
   
   Current code:
   ```python
   if Asset.objects.filter(name=name).exists():
       raise ValidationError("Name must be unique")
   Asset.objects.create(name=name)
   ```
   
   FIX: Use database constraint
   ```python
   # In model
   class Asset(models.Model):
       name = models.CharField(max_length=200, unique=True)
   ```

Total issues: 4
Estimated performance impact: 100+ queries reduced to ~5
```

## Query Performance Metrics

After analysis, shows performance estimates:

```
Performance Impact Summary:

Current state:
  - Requests: 100/min
  - Avg queries per request: 103
  - Total queries: 10,300/min
  - DB load: HIGH

After fixes:
  - Requests: 100/min
  - Avg queries per request: 5
  - Total queries: 500/min
  - DB load: LOW

Improvement: 95% reduction in database queries
```

## Detection Details

### N+1 Pattern Recognition

```python
# DETECTED PATTERNS:

# Pattern 1: Loop with FK access
for asset in Asset.objects.all():
    asset.rack.name  # ❌ N+1

# Pattern 2: Loop with reverse FK
for rack in Rack.objects.all():
    rack.assets.count()  # ❌ N+1

# Pattern 3: Loop with M2M
for user in User.objects.all():
    user.teams.all()  # ❌ N+1
```

### Index Analysis

Checks model fields against query patterns:

```python
# Searches for:
.filter(field_name=...)
.exclude(field_name=...)
.order_by('field_name')

# Then checks model for:
field_name = models.CharField(db_index=True)  # ✅
# or
class Meta:
    indexes = [models.Index(fields=['field_name'])]  # ✅
```

## Suggested Optimizations

### 1. select_related (ForeignKey, OneToOne)

```python
# Before: N+1
assets = Asset.objects.all()
for asset in assets:
    print(asset.rack.name)  # +1 query per asset

# After: 1 query
assets = Asset.objects.select_related('rack').all()
for asset in assets:
    print(asset.rack.name)  # No additional queries

# Nested relations
assets = Asset.objects.select_related(
    'rack',
    'rack__row',
    'rack__row__room'
).all()
```

### 2. prefetch_related (ManyToMany, reverse FK)

```python
# Before: N+1
users = User.objects.all()
for user in users:
    user.teams.all()  # +1 query per user

# After: 2 queries total
users = User.objects.prefetch_related('teams').all()
for user in users:
    user.teams.all()  # No additional queries
```

### 3. Indexes

```python
# Single field index
status = models.CharField(max_length=20, db_index=True)

# Compound index
class Meta:
    indexes = [
        models.Index(fields=['rack', 'status']),
        models.Index(fields=['-created_at']),
    ]
```

### 4. Database constraints

```python
# Uniqueness
name = models.CharField(max_length=200, unique=True)

# Check constraints
class Meta:
    constraints = [
        models.CheckConstraint(
            check=models.Q(port_count__gte=0),
            name='positive_port_count'
        ),
    ]
```

## Testing Query Performance

```bash
# Enable query logging
python manage.py shell

>>> from django.db import connection
>>> from django.db import reset_queries

>>> reset_queries()
>>> assets = Asset.objects.select_related('rack').all()
>>> list(assets)  # Force evaluation
>>> print(len(connection.queries))
1  # Only 1 query!

>>> reset_queries()
>>> assets = Asset.objects.all()
>>> for asset in assets:
...     print(asset.rack.name)
>>> print(len(connection.queries))
101  # 1 + 100 queries (N+1!)
```

## Related

- `performance-analyzer` - Full agent version
- `performance-optimizer` - Auto-fix agent
- `.claude/skills/django-query-optimizer/` - Auto-detection skill
- `.claude/skills/postgresql-performance/` - Database optimization

## When to Use

- **Before optimization**: Identify bottlenecks
- **After changes**: Verify performance
- **In PR review**: Check for regressions
- **Regular audits**: Maintain performance

## Time Estimate

~1-2 minutes per file
~5-10 minutes for full app

## Exit Codes

- 0: No critical issues
- 1: Performance issues found
