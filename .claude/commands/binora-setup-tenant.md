# Setup Tenant

Create and configure a new tenant service instance with proper database setup and verification.

## Usage

```
/setup-tenant <subdomain>
```

**Examples:**
```
/setup-tenant acme
/setup-tenant testco
/setup-tenant demo
```

## What It Does

Creates a complete tenant service instance following Binora's multi-tenant architecture.

### Steps Executed

1. **Verify subdomain availability**
   - Check Company.objects.filter(subdomain=...)
   - Ensure no conflicts

2. **Create Company record**
   - Main service database entry
   - Subdomain configuration
   - Initial settings

3. **Run migrations**
   - Execute Django migrations for tenant schema
   - Verify database structure

4. **Create superuser**
   - First admin user for tenant
   - Proper permissions setup

5. **Start tenant service**
   - Port: 8001+ (incremental)
   - ENV: TENANT=subdomain
   - Verify startup

6. **Verify isolation**
   - Test query scoping
   - Confirm middleware working

## Process

```bash
# 1. Create Company in Main service
python manage.py shell
>>> from apps.core.models import Company
>>> company = Company.objects.create(
...     subdomain="acme",
...     name="ACME Corp"
... )

# 2. Run migrations with tenant context
TENANT=acme python manage.py migrate

# 3. Create superuser for tenant
TENANT=acme python manage.py createsuperuser

# 4. Start tenant service
TENANT=acme python manage.py runserver 8001

# 5. Verify in another terminal
curl http://localhost:8001/api/users/ \
  -H "Authorization: Bearer <token>"
```

## Output Format

### Success

```
✅ TENANT SETUP COMPLETE

Subdomain: acme
Company: ACME Corp
Database: Migrated (42 migrations applied)
Superuser: admin@acme.com
Service: http://localhost:8001

Multi-tenant verification:
  ✅ Middleware active
  ✅ Query scoping confirmed
  ✅ Isolation verified

Next steps:
1. Access: http://localhost:8001/admin
2. Login: admin@acme.com / <password>
3. Configure tenant settings
```

### Fail

```
❌ TENANT SETUP FAILED

Subdomain: acme
Error: Company with subdomain 'acme' already exists

Existing company:
  Name: ACME Corp
  Created: 2025-01-10
  Status: Active

Options:
1. Use different subdomain
2. Delete existing company (if test)
3. Use existing setup
```

## Validation Checks

**Before creation**:
- [ ] Subdomain format valid (alphanumeric + hyphen)
- [ ] No existing Company with subdomain
- [ ] Main service running
- [ ] PostgreSQL accessible

**After creation**:
- [ ] Company record exists
- [ ] Migrations applied successfully
- [ ] Superuser created
- [ ] Service starts without errors
- [ ] Middleware isolates queries
- [ ] API endpoints accessible

## Subdomain Rules

**Valid**:
- `acme` ✅
- `test-company` ✅
- `demo123` ✅

**Invalid**:
- `ACME` ❌ (uppercase)
- `acme_corp` ❌ (underscore)
- `acme.com` ❌ (dot)
- `main` ❌ (reserved)
- `admin` ❌ (reserved)

## Environment Variables

```bash
# Main service (port 8000)
TENANT=  # Empty or not set

# Tenant service (port 8001+)
TENANT=acme
```

## Database Configuration

Uses same database, different isolation via middleware:

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'binora_backend',  # Same database
        # Middleware adds: WHERE tenant_id = <company_id>
    }
}
```

## Multi-Tenant Architecture

**Transparent Isolation**:
- Same codebase for Main and Tenant services
- Same database with tenant_id scoping
- Middleware handles all filtering

**See**: `.claude/core/architecture.md` for details

## Troubleshooting

**Port already in use**:
```bash
# Find process
lsof -i :8001

# Kill process
kill -9 <PID>
```

**Migration errors**:
```bash
# Check migration status
TENANT=acme python manage.py showmigrations

# Fake if needed (careful!)
TENANT=acme python manage.py migrate --fake
```

**Middleware not working**:
- Verify TENANT env variable set
- Check middleware in settings.MIDDLEWARE
- Restart service after env change

## Related

- `/check-tenant` - Verify tenant isolation
- `.claude/core/architecture.md` - Multi-tenant patterns
- `binora/middleware.py` - MultitenantMiddleware

## Time Estimate

~3-5 minutes for complete setup

## When to Use

- Setting up new client environment
- Creating test tenants
- Demos and presentations
- Development multi-tenant testing
