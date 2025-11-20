---
name: "Django ORM Query Optimization"
description: "Enforces Django ORM best practices for optimal database performance: select_related for ForeignKey, prefetch_related for ManyToMany, always order_by(), database indexes on filtered fields. Auto-activates on: ORM, query, select_related, prefetch_related, N+1, index, database, optimization, queryset. Prevents N+1 queries, missing order_by(), unindexed filters, inefficient queries. Ensures select_related for joins, prefetch_related for collections, order_by() on all queries, db_index=True on filtered fields. Targets: 0 N+1 queries, <100ms query time, proper indexing."
---

# Django ORM Query Optimization

**Auto-activates when**: Discussing Django queries, ORM, database performance, N+1 queries, select_related, prefetch_related, or indexing.

---

## 🎯 Mission

Enforce **0 N+1 queries** and **<100ms query time** through proper Django ORM optimization with select_related, prefetch_related, order_by, and strategic database indexing.

---

## 📐 Core Principles

### 1. select_related for ForeignKey and OneToOne

**Rule**: ALWAYS use select_related() when accessing ForeignKey or OneToOne fields to avoid N+1 queries. Use SQL JOIN instead of multiple queries.

**Why it matters**: Prevents N+1 queries (1 query to get objects + N queries for each related object = N+1 total queries). Performance: 100 objects = 101 queries without, 1 query with select_related.

❌ WRONG - N+1 queries (100 users = 101 queries!)
```python
# apps/core/views/user.py
from rest_framework import viewsets
from apps.core.models import User
from apps.core.serializers.user import UserOutputSerializer

class UserViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # ❌ No select_related - N+1 query problem!
        return User.objects.all()

# When serializer accesses user.company.name:
# Query 1: SELECT * FROM users (gets 100 users)
# Query 2: SELECT * FROM companies WHERE id = 1 (user 1's company)
# Query 3: SELECT * FROM companies WHERE id = 2 (user 2's company)
# ...
# Query 101: SELECT * FROM companies WHERE id = 100 (user 100's company)
# TOTAL: 101 queries! SLOW!
```

✅ CORRECT - select_related eliminates N+1 (1 query!)
```python
# apps/core/views/user.py
from rest_framework import viewsets
from apps.core.models import User
from apps.core.serializers.user import UserOutputSerializer

class UserViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # ✅ select_related uses SQL JOIN - single query!
        return User.objects.select_related('company', 'created_by').all()

# Generated SQL:
# SELECT users.*, companies.*, creators.*
# FROM users
# LEFT JOIN companies ON users.company_id = companies.id
# LEFT JOIN users AS creators ON users.created_by_id = creators.id
# TOTAL: 1 query for 100 users! FAST!
```

**select_related Patterns**:
```python
# Single ForeignKey
User.objects.select_related('company')

# Multiple ForeignKeys
Asset.objects.select_related('company', 'created_by', 'assigned_to')

# Nested relationships (use double underscore)
Asset.objects.select_related('created_by__company')  # Asset → User → Company

# Chain with filters and order_by
User.objects.select_related('company').filter(is_active=True).order_by('email')
```

**Auto-check**:
- [ ] ViewSet get_queryset() uses select_related for ForeignKey fields?
- [ ] Serializer accesses related objects (user.company) with select_related?
- [ ] Nested relationships use double underscore (created_by__company)?
- [ ] No queries executed inside loops (Django Debug Toolbar)?

---

### 2. prefetch_related for ManyToMany and Reverse ForeignKey

**Rule**: ALWAYS use prefetch_related() when accessing ManyToMany or reverse ForeignKey relationships to avoid N+1 queries.

**Why it matters**: Like select_related but for ManyToMany (can't use JOIN). Performance: 100 teams with members = 101 queries without, 2 queries with prefetch_related.

❌ WRONG - N+1 queries for ManyToMany
```python
# apps/core/views/team.py
from rest_framework import viewsets
from apps.core.models import Team

class TeamViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # ❌ No prefetch_related - N+1 query problem!
        return Team.objects.all()

# When serializer accesses team.members.all():
# Query 1: SELECT * FROM teams (gets 100 teams)
# Query 2: SELECT * FROM users WHERE id IN (SELECT user_id FROM team_members WHERE team_id = 1)
# Query 3: SELECT * FROM users WHERE id IN (SELECT user_id FROM team_members WHERE team_id = 2)
# ...
# Query 101: SELECT * FROM users WHERE id IN (SELECT user_id FROM team_members WHERE team_id = 100)
# TOTAL: 101 queries! SLOW!
```

✅ CORRECT - prefetch_related eliminates N+1 (2 queries!)
```python
# apps/core/views/team.py
from rest_framework import viewsets
from apps.core.models import Team

class TeamViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # ✅ prefetch_related - 2 queries total!
        return Team.objects.prefetch_related('members').all()

# Generated SQL:
# Query 1: SELECT * FROM teams (100 teams)
# Query 2: SELECT * FROM users WHERE id IN (SELECT user_id FROM team_members WHERE team_id IN (1,2,...,100))
# TOTAL: 2 queries for 100 teams! FAST!
```

**prefetch_related Patterns**:
```python
# ManyToMany field
Team.objects.prefetch_related('members')

# Reverse ForeignKey (user.asset_set)
User.objects.prefetch_related('asset_set')

# Multiple relationships
Team.objects.prefetch_related('members', 'permissions')

# Nested prefetch with select_related
Team.objects.prefetch_related(
    Prefetch('members', queryset=User.objects.select_related('company'))
)

# Combining select_related and prefetch_related
Asset.objects.select_related('company', 'created_by').prefetch_related('tags')
```

**select_related vs prefetch_related Decision Tree**:
```
What relationship type?
├── ForeignKey or OneToOne?
│   └── Use select_related() (SQL JOIN)
└── ManyToMany or Reverse ForeignKey?
    └── Use prefetch_related() (separate queries)
```

**Auto-check**:
- [ ] ViewSet uses prefetch_related for ManyToMany fields?
- [ ] Reverse ForeignKey access (user.asset_set) uses prefetch_related?
- [ ] Complex prefetches use Prefetch() object with custom queryset?
- [ ] Combining select_related + prefetch_related when needed?

---

### 3. Always Use order_by() - MANDATORY

**Rule**: ALWAYS add order_by() to QuerySets. Never rely on database default ordering (undefined/random order).

**Why it matters**: Database default order is undefined, causes flaky tests, inconsistent pagination, poor UX (order changes on refresh), prevents query optimization.

❌ WRONG - No order_by (random/undefined order)
```python
# apps/core/views/user.py
class UserViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # ❌ No order_by - results in random order!
        return User.objects.select_related('company').all()

# Problems:
# 1. Order changes between requests (confusing UX)
# 2. Pagination breaks (page 2 might have items from page 1)
# 3. Tests become flaky (order-dependent assertions fail randomly)
# 4. Can't optimize with database indexes
```

✅ CORRECT - Explicit order_by
```python
# apps/core/views/user.py
class UserViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        # ✅ Explicit order_by for consistent results
        return User.objects.select_related('company').order_by('email')

    def list(self, request):
        # ✅ Can also order by multiple fields
        queryset = User.objects.select_related('company').order_by('-created_at', 'email')
        # Order by created_at DESC, then email ASC
        return Response(...)
```

**order_by Patterns**:
```python
# Single field ascending
User.objects.order_by('email')

# Single field descending (use minus prefix)
User.objects.order_by('-created_at')

# Multiple fields
User.objects.order_by('-created_at', 'email')  # created_at DESC, email ASC

# Related field (double underscore)
Asset.objects.order_by('company__name')

# Clear existing ordering (use sparingly)
User.objects.order_by()  # Clears Meta.ordering

# Case-insensitive ordering
from django.db.models.functions import Lower
User.objects.order_by(Lower('email'))
```

**Auto-check**:
- [ ] ALL QuerySets in ViewSets have order_by()?
- [ ] Pagination views use consistent order_by()?
- [ ] Tests don't rely on implicit ordering?
- [ ] order_by fields match database indexes for performance?

---

### 4. Database Indexes on Filtered Fields

**Rule**: Add db_index=True or indexes=[...] to fields frequently used in filter(), exclude(), order_by(), or WHERE clauses.

**Why it matters**: Indexes provide O(log n) lookup vs O(n) full table scan. Performance: 1M rows = 1ms indexed lookup vs 1000ms full scan (1000x faster).

❌ WRONG - No indexes on filtered fields
```python
# apps/core/models/user.py
from django.db import models

class User(models.Model):
    email = models.EmailField(max_length=254)  # ❌ No index, but filtered often!
    is_active = models.BooleanField(default=True)  # ❌ No index, filtered often!
    created_at = models.DateTimeField(auto_now_add=True)  # ❌ No index, sorted often!

    class Meta:
        db_table = 'users'

# Query: User.objects.filter(email="test@example.com", is_active=True).order_by('-created_at')
# Database performs FULL TABLE SCAN (slow for large tables!)
```

✅ CORRECT - Indexes on filtered/sorted fields
```python
# apps/core/models/user.py
from django.db import models

class User(models.Model):
    email = models.EmailField(max_length=254, db_index=True)  # ✅ Indexed (filtered often)
    is_active = models.BooleanField(default=True, db_index=True)  # ✅ Indexed
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)  # ✅ Indexed

    class Meta:
        db_table = 'users'
        indexes = [
            # ✅ Compound index for common query pattern
            models.Index(fields=['is_active', '-created_at'], name='user_active_created_idx'),
            # ✅ Compound index for email + active filter
            models.Index(fields=['email', 'is_active'], name='user_email_active_idx'),
        ]

# Query now uses indexes: 1000x faster on large tables!
```

**Indexing Patterns**:
```python
# Single field index (simple)
email = models.EmailField(db_index=True)

# Compound index (multiple fields, order matters)
class Meta:
    indexes = [
        models.Index(fields=['company', 'is_active'], name='asset_company_active_idx'),
        models.Index(fields=['company', '-created_at'], name='asset_company_date_idx'),
    ]

# Unique constraint (automatically creates index)
email = models.EmailField(unique=True)  # Creates unique index

# Multi-tenant compound indexes (tenant_id first!)
class Meta:
    indexes = [
        models.Index(fields=['tenant_id', 'status'], name='asset_tenant_status_idx'),
        models.Index(fields=['tenant_id', '-created_at'], name='asset_tenant_date_idx'),
    ]
```

**Index Decision Criteria**:
```
Should field be indexed?
├── Used in filter()/exclude()? → YES (db_index=True)
├── Used in order_by()? → YES (db_index=True)
├── ForeignKey? → Automatic index, no action needed
├── Unique constraint? → Automatic index, no action needed
├── Rarely queried? → NO (indexes slow down writes)
└── Low cardinality (few unique values)? → Consider compound index
```

**Auto-check**:
- [ ] Filtered fields have db_index=True?
- [ ] order_by fields have indexes?
- [ ] Compound indexes for common query patterns (filter + order_by)?
- [ ] Multi-tenant models have tenant_id as first field in compound indexes?
- [ ] Migrations created for index changes (makemigrations)?

---

### 5. Avoiding N+1 Queries - Patterns and Tools

**Rule**: Use Django Debug Toolbar or logging to detect N+1 queries. Apply select_related/prefetch_related proactively.

**Why it matters**: N+1 queries are the #1 Django performance issue. 100 objects with N+1 = 101 queries (unacceptable). Should be 1-2 queries.

❌ WRONG - Classic N+1 query pattern
```python
# View
def asset_list(request):
    assets = Asset.objects.all()  # Query 1: Get all assets
    return render(request, 'assets.html', {'assets': assets})

# Template (assets.html)
{% for asset in assets %}
    {{ asset.name }}
    {{ asset.company.name }}  <!-- Query 2, 3, 4, ... N+1: Get each company -->
    Created by: {{ asset.created_by.email }}  <!-- Query N+2, N+3, ... 2N+1: Get each user -->
{% endfor %}

# Total Queries: 1 + N (companies) + N (users) = 2N + 1
# For 100 assets: 201 queries! DISASTER!
```

✅ CORRECT - Optimized with select_related
```python
# View
def asset_list(request):
    # ✅ Prefetch all related data in single query
    assets = Asset.objects.select_related('company', 'created_by').all()
    return render(request, 'assets.html', {'assets': assets})

# Template (assets.html)
{% for asset in assets %}
    {{ asset.name }}
    {{ asset.company.name }}  <!-- No additional query! -->
    Created by: {{ asset.created_by.email }}  <!-- No additional query! -->
{% endfor %}

# Total Queries: 1 (with JOINs)
# For 100 assets: 1 query! FAST!
```

**N+1 Detection with Django Debug Toolbar**:
```python
# settings.py (development only)
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']

# Install: pip install django-debug-toolbar
# Access: http://localhost:8000/your-page → Click "SQL" panel → See query count

# Red flag: "Similar queries" section shows same query repeated N times = N+1!
```

**N+1 Patterns to Watch For**:
```python
# ❌ Loop accessing ForeignKey
for asset in Asset.objects.all():
    print(asset.company.name)  # N+1 query!

# ✅ Use select_related
for asset in Asset.objects.select_related('company').all():
    print(asset.company.name)  # No extra queries

# ❌ Loop accessing ManyToMany
for team in Team.objects.all():
    print(team.members.count())  # N+1 query!

# ✅ Use prefetch_related
for team in Team.objects.prefetch_related('members').all():
    print(team.members.count())  # No extra queries

# ❌ Serializer accessing related objects without optimization
class AssetSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name')  # N+1 if not optimized!

# ✅ ViewSet must use select_related
class AssetViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Asset.objects.select_related('company')  # Optimized
```

**Auto-check**:
- [ ] Django Debug Toolbar installed in development?
- [ ] Query count ≤ 10 for list views (check toolbar)?
- [ ] No "Similar queries" warnings in debug toolbar?
- [ ] All loops accessing ForeignKey use select_related?
- [ ] All loops accessing ManyToMany use prefetch_related?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Queries Inside Loops (N+1 Pattern)

❌ ANTI-PATTERN
```python
for user in User.objects.all():  # Query 1
    print(user.company.name)  # Query 2, 3, 4, ... N+1
```

✅ CORRECT
```python
for user in User.objects.select_related('company').all():  # 1 query
    print(user.company.name)  # No additional queries
```

**Why it matters**: Classic N+1 performance killer. 1000 users = 1001 queries without optimization.

---

### 2. Missing order_by()

❌ ANTI-PATTERN
```python
User.objects.filter(is_active=True)  # Random order!
```

✅ CORRECT
```python
User.objects.filter(is_active=True).order_by('email')  # Consistent order
```

**Why it matters**: Undefined order causes flaky tests, poor UX, pagination issues.

---

### 3. No Indexes on Filtered Fields

❌ ANTI-PATTERN
```python
class Asset(models.Model):
    status = models.CharField(max_length=20)  # No index!

# Query: Asset.objects.filter(status='active')  # Full table scan!
```

✅ CORRECT
```python
class Asset(models.Model):
    status = models.CharField(max_length=20, db_index=True)  # Indexed!

    class Meta:
        indexes = [
            models.Index(fields=['status', '-created_at'], name='asset_status_date_idx'),
        ]
```

**Why it matters**: Full table scans on large tables = slow queries (seconds instead of milliseconds).

---

### 4. Using all() Before select_related/prefetch_related

❌ ANTI-PATTERN
```python
assets = Asset.objects.all().select_related('company')  # Works but unclear
```

✅ CORRECT
```python
assets = Asset.objects.select_related('company').all()  # Clear intent
```

**Why it matters**: Order matters for readability. Optimizations (select_related) before materialization (all()).

---

### 5. Accessing Related Objects Without Optimization in Serializers

❌ ANTI-PATTERN
```python
# Serializer
class AssetOutputSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name')  # Assumes optimization!

# ViewSet - NO optimization
class AssetViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Asset.objects.all()  # N+1 query when company_name accessed!
```

✅ CORRECT
```python
# Serializer (same)
class AssetOutputSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name')

# ViewSet - Optimized
class AssetViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Asset.objects.select_related('company').order_by('-created_at')  # Optimized!
```

**Why it matters**: Serializer and ViewSet must work together. Serializer assumes optimization, ViewSet must provide it.

---

## 🔍 Proactive Validation Checklist

### Critical (Must Fix)
- [ ] ALL ViewSets use select_related for ForeignKey fields in serializers?
- [ ] ALL ViewSets use prefetch_related for ManyToMany fields in serializers?
- [ ] ALL QuerySets have order_by()?
- [ ] NO queries inside loops (for loop accessing related objects)?
- [ ] Django Debug Toolbar shows <10 queries for list views?

### High Priority
- [ ] Filtered fields have db_index=True?
- [ ] Compound indexes for common filter + order_by patterns?
- [ ] Multi-tenant indexes have tenant_id as first field?
- [ ] Nested relationships use double underscore (created_by__company)?
- [ ] Complex prefetches use Prefetch() object?

### Medium Priority
- [ ] order_by fields match database indexes?
- [ ] Indexes documented in model Meta.indexes?
- [ ] Migrations created for index changes?
- [ ] Query performance tested (Django Debug Toolbar)?
- [ ] Database query count logged in tests?

---

## 📚 Reference Documents

| File | Purpose |
|------|---------|
| `apps/core/views/user.py` | UserViewSet with select_related optimization |
| `apps/assets/views.py` | AssetViewSet with select_related + prefetch_related |
| `apps/core/models/user.py` | User model with proper indexes |
| `apps/assets/models.py` | Asset model with compound indexes |
| `CLAUDE.md` | Performance optimization guidelines |
| `.claude/core/architecture.md` | Query optimization patterns |

---

## 🎯 Activation Criteria

**Keywords**: "ORM", "query", "select_related", "prefetch_related", "N+1", "index", "database", "optimization", "queryset", "slow query", "performance"

**Auto-suggest when**:
- User creates ViewSet with related fields in serializer
- User accesses ForeignKey in loop
- User creates model with filtered fields
- User mentions slow queries or performance
- User implements pagination
- User discusses database optimization
- Django Debug Toolbar shows many queries

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Performance Targets**: 0 N+1 queries, <100ms query time, proper indexing on all filtered fields
