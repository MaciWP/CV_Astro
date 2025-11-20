# Multi-Tenant Middleware Configuration Template

**Settings configuration for Binora Backend multi-tenant architecture**

---

## Overview

Binora Backend uses environment-based configuration to run as either:
- **Main Service**: `TENANT=None` - Sees all companies
- **Tenant Service**: `TENANT=subdomain` - Sees only one company

---

## Complete Settings Configuration

### settings.py - Core Configuration

```python
# binora/settings.py

import json
import os
from django.utils.translation import gettext_lazy as _


# ============================================================================
# MULTI-TENANT CONFIGURATION
# ============================================================================

# ✅ Critical settings for multi-tenant architecture
TENANT = None
MAIN_INSTANCE_URL = None
COMPANY_NAME = _("All companies")

# Load company info from environment (for Tenant services)
if os.getenv("COMPANY", None) is not None:
    company_info = json.loads(os.getenv("COMPANY", "[]"))[0].get("fields", {})

    # ✅ Set tenant subdomain
    TENANT = company_info.get("subdomain")  # e.g., "acme", "testco"

    # ✅ Set company name
    COMPANY_NAME = company_info.get("name")  # e.g., "Acme Corporation"

    # ✅ Set Main instance URL for forwarding
    MAIN_INSTANCE_URL = os.getenv("MAIN_INSTANCE_URL")  # e.g., "http://localhost:8000"

    # Add tenant-specific authentication backend
    AUTHENTICATION_BACKENDS.append("apps.core.utils.auth.backends.MainAuthenticationBackend")

    del company_info


# ============================================================================
# MIDDLEWARE CONFIGURATION
# ============================================================================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",

    # ✅ CRITICAL: Multi-tenant middleware (add if implementing tenant isolation)
    # "binora.middleware.MultitenantMiddleware",

    "apps.core.utils.auth.middleware.ForceChangePasswordMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================================
# AUTHENTICATION CONFIGURATION
# ============================================================================

AUTHENTICATION_BACKENDS = []

# Tenant services use Main authentication backend
if TENANT:
    AUTHENTICATION_BACKENDS.append("apps.core.utils.auth.backends.MainAuthenticationBackend")

# All services use Django default backend
AUTHENTICATION_BACKENDS.extend([
    "django.contrib.auth.backends.ModelBackend",
    "guardian.backends.ObjectPermissionBackend",
])


# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

# Database name can vary by tenant (optional)
DB_NAME = os.getenv("DB_NAME", "binora")

if db_host := os.getenv("DB_HOST"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "HOST": db_host,
            "PORT": int(os.getenv("DB_PORT", 5432)),
            "NAME": DB_NAME,  # Can be tenant-specific
            "USER": os.getenv("DB_USER", "postgres"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
        }
    }
else:
    # Development/testing database
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
```

---

## Environment Variables

### Main Service Configuration

```bash
# .env (Main Service - port 8000)

# Django settings
DJANGO_ENV=local
DEBUG=True
SECRET_KEY=your-secret-key

# NO tenant configuration for Main
# TENANT is None (not set)
# COMPANY is not set
# MAIN_INSTANCE_URL is None (not set)

# Database (shared across all tenants)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=binora
DB_USER=binora_user
DB_PASSWORD=binora_password

# Server
PORT=8000
ALLOWED_HOSTS=127.0.0.1,localhost,main.binora.local

# CORS (allow tenant subdomains)
CORS_ALLOWED_ORIGINS=http://localhost:3000
CORS_ALLOWED_ORIGIN_REGEXES=^https://.*\.binora\.com$

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@binora.com
```

### Tenant Service Configuration

```bash
# .env (Tenant Service - port 8001+ for "acme" company)

# Django settings
DJANGO_ENV=local
DEBUG=True
SECRET_KEY=your-secret-key

# ✅ Tenant configuration
COMPANY=[{"model": "core.company", "pk": 1, "fields": {"subdomain": "acme", "name": "Acme Corporation", "domain": "acme.binora.com"}}]
MAIN_INSTANCE_URL=http://localhost:8000

# Database (can be same DB or tenant-specific)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=binora_acme  # ✅ Optional: tenant-specific database
DB_USER=binora_user
DB_PASSWORD=binora_password

# Server
PORT=8001  # Different port per tenant
ALLOWED_HOSTS=127.0.0.1,localhost,acme.binora.local

# CORS (same as Main)
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@acme.binora.com
```

---

## Middleware Implementation (Optional)

If implementing transparent tenant filtering, create middleware:

### binora/middleware.py

```python
# binora/middleware.py (OPTIONAL - for transparent filtering)

from contextlib import contextmanager
from django.conf import settings
from apps.core.models import Company


class MultitenantMiddleware:
    """
    ✅ Middleware for transparent multi-tenant isolation

    Automatically filters ALL database queries by company
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get company from settings
        if settings.TENANT:
            try:
                company = Company.objects.get(subdomain=settings.TENANT)
                request.tenant = company

                # Activate tenant context for all queries
                with tenant_context(company):
                    response = self.get_response(request)

                return response

            except Company.DoesNotExist:
                # Tenant company not found
                from django.http import HttpResponseNotFound
                return HttpResponseNotFound("Tenant not found")

        else:
            # Main service - no tenant filtering
            response = self.get_response(request)
            return response


@contextmanager
def tenant_context(company):
    """
    Context manager for tenant-scoped queries

    Usage:
        with tenant_context(company):
            users = User.objects.all()  # Filtered by company
    """
    # Implementation would use Django database router
    # or query filtering at ORM level
    # This is a placeholder for the concept

    # Set thread-local tenant
    _set_current_tenant(company)

    try:
        yield
    finally:
        # Clear thread-local tenant
        _set_current_tenant(None)


def _set_current_tenant(company):
    """Set current tenant in thread-local storage"""
    import threading
    _thread_local = threading.local()
    _thread_local.tenant = company


def get_current_tenant():
    """Get current tenant from thread-local storage"""
    import threading
    _thread_local = threading.local()
    return getattr(_thread_local, 'tenant', None)
```

---

## Docker Compose Configuration

### docker-compose.local.yaml

```yaml
version: '3.8'

services:
  # PostgreSQL database (shared)
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: binora
      POSTGRES_USER: binora_user
      POSTGRES_PASSWORD: binora_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Main Service (port 8000)
  main:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    ports:
      - "8000:8000"
    environment:
      # ✅ Main service configuration
      DJANGO_ENV: local
      DEBUG: 'True'
      DB_HOST: db
      DB_NAME: binora
      DB_USER: binora_user
      DB_PASSWORD: binora_password
      # NO TENANT or COMPANY set
    depends_on:
      - db
    volumes:
      - .:/app

  # Tenant Service - Acme (port 8001)
  tenant_acme:
    build: .
    command: python manage.py runserver 0.0.0.0:8001
    ports:
      - "8001:8001"
    environment:
      # ✅ Tenant service configuration
      DJANGO_ENV: local
      DEBUG: 'True'
      DB_HOST: db
      DB_NAME: binora  # Same DB, filtered by company
      DB_USER: binora_user
      DB_PASSWORD: binora_password
      # ✅ Tenant settings
      COMPANY: '[{"model": "core.company", "pk": 1, "fields": {"subdomain": "acme", "name": "Acme Corporation", "domain": "acme.binora.com"}}]'
      MAIN_INSTANCE_URL: 'http://main:8000'
    depends_on:
      - db
      - main
    volumes:
      - .:/app

  # Tenant Service - TestCo (port 8002)
  tenant_testco:
    build: .
    command: python manage.py runserver 0.0.0.0:8002
    ports:
      - "8002:8002"
    environment:
      DJANGO_ENV: local
      DEBUG: 'True'
      DB_HOST: db
      DB_NAME: binora
      DB_USER: binora_user
      DB_PASSWORD: binora_password
      # ✅ Different tenant
      COMPANY: '[{"model": "core.company", "pk": 2, "fields": {"subdomain": "testco", "name": "TestCo Inc", "domain": "testco.binora.com"}}]'
      MAIN_INSTANCE_URL: 'http://main:8000'
    depends_on:
      - db
      - main
    volumes:
      - .:/app

volumes:
  postgres_data:
```

---

## Test Settings Configuration

### settings_test.py

```python
# binora/settings_test.py

from .settings import *

# ✅ Test configuration
DEBUG = True
SECRET_KEY = "test-secret-key"

# Use in-memory SQLite for tests
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# ✅ Default to Main service mode for tests
TENANT = None
MAIN_INSTANCE_URL = None

# Fast password hashing for tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()
```

---

## Runtime Detection

### Check Service Type at Runtime

```python
# In service or middleware

from django.conf import settings


def is_main_service() -> bool:
    """Check if running as Main service"""
    return settings.MAIN_INSTANCE_URL is None and settings.TENANT is None


def is_tenant_service() -> bool:
    """Check if running as Tenant service"""
    return settings.MAIN_INSTANCE_URL is not None and settings.TENANT is not None


def get_current_tenant() -> str | None:
    """Get current tenant subdomain"""
    return settings.TENANT


# Usage in services
if is_main_service():
    # Create user directly in Main
    user = User.objects.create(**data)
else:
    # Forward to Main instance
    response = requests.post(
        urljoin(settings.MAIN_INSTANCE_URL, "/api/users/"),
        json=data,
        headers={"Authorization": f"Bearer {auth_token}"}
    )
```

---

## Validation Checklist

### Main Service Setup

- [ ] **TENANT is None** (not set in environment)
- [ ] **MAIN_INSTANCE_URL is None** (not set)
- [ ] **Database** configured (shared across tenants)
- [ ] **Port** 8000 (or production port)
- [ ] **ALLOWED_HOSTS** includes main domain
- [ ] **CORS** configured to allow tenant subdomains

### Tenant Service Setup

- [ ] **COMPANY environment variable** set with JSON
- [ ] **TENANT extracted** from COMPANY JSON
- [ ] **MAIN_INSTANCE_URL set** to Main service URL
- [ ] **Database** configured (shared or tenant-specific)
- [ ] **Port** unique per tenant (8001, 8002, etc.)
- [ ] **ALLOWED_HOSTS** includes tenant subdomain
- [ ] **MainAuthenticationBackend** added for Tenant mode

### Test Configuration

- [ ] **settings_test.py** exists
- [ ] **TENANT=None** by default (Main mode)
- [ ] **In-memory database** for speed
- [ ] **Fast password hashers** configured
- [ ] **Migrations disabled** (optional)

---

## Common Configuration Issues

### Issue 1: COMPANY JSON Format

```bash
# ❌ WRONG - Invalid JSON
COMPANY={"subdomain": "acme"}

# ❌ WRONG - Missing fields
COMPANY=[{"fields": {"subdomain": "acme"}}]

# ✅ CORRECT - Full format
COMPANY=[{"model": "core.company", "pk": 1, "fields": {"subdomain": "acme", "name": "Acme Corp", "domain": "acme.binora.com"}}]
```

### Issue 2: MAIN_INSTANCE_URL in Main Service

```bash
# ❌ WRONG - Main service has MAIN_INSTANCE_URL set
# .env (Main)
MAIN_INSTANCE_URL=http://localhost:8000  # ❌ Should not be set

# ✅ CORRECT - Main service has no MAIN_INSTANCE_URL
# .env (Main)
# MAIN_INSTANCE_URL is not set
```

### Issue 3: Missing Tenant Context in Tests

```python
# ❌ WRONG - Test without tenant context
def test_create_user():
    user = User.objects.create(email="test@example.com")
    # Company not set!

# ✅ CORRECT - Use tenant_id fixture
def test_create_user(tenant_id):
    user = User.objects.create(email="test@example.com")
    # Company added by fixture
```

---

## Quick Start Commands

### Start Main Service

```bash
# Development
export DJANGO_SETTINGS_MODULE=binora.settings
python manage.py runserver 8000

# Docker
docker-compose up main
```

### Start Tenant Service

```bash
# Set tenant environment
export COMPANY='[{"model": "core.company", "pk": 1, "fields": {"subdomain": "acme", "name": "Acme Corp", "domain": "acme.binora.com"}}]'
export MAIN_INSTANCE_URL=http://localhost:8000

# Run server
python manage.py runserver 8001

# Docker
docker-compose up tenant_acme
```

### Run Tests

```bash
# Use test settings
export DJANGO_SETTINGS_MODULE=binora.settings_test
pytest

# Or via nox
nox -s test
```

---

## Security Considerations

### 1. Tenant Isolation

- ✅ Middleware MUST filter ALL queries by company
- ✅ NEVER trust client-provided company ID
- ✅ Use settings.TENANT as source of truth

### 2. Main Instance Communication

- ✅ ALWAYS require JWT authentication
- ✅ Validate token scope matches tenant
- ✅ Use HTTPS in production

### 3. Environment Variables

- ✅ NEVER commit .env files to git
- ✅ Use different SECRET_KEY per environment
- ✅ Rotate secrets regularly

---

**Use this configuration** for all Binora Backend deployments!

**Last Updated**: 2025-01-23
**Based on**: Real Binora settings.py (lines 41-52, 120-131)
