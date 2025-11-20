---
name: config-validator
description: Validate environment variables and configuration with Pydantic, Zod. Type-safe config loading. Fail fast on missing vars. Keywords - environment variables, config validation, pydantic settings, zod config, env vars, type safe config
---

# Config Validator

## When to Use This Skill

Activate when:
- Loading environment variables from .env files
- Need type-safe configuration validation
- Want to fail fast on missing/invalid config
- Setting up application configuration
- Need default values and documentation for config

## What This Skill Does

Validates configuration with:
- Type-safe environment variable loading
- Required vs optional variables
- Default values and validation rules
- Fail-fast on startup (missing/invalid config)
- Auto-completion for config (TypeScript/Python types)
- Configuration documentation

## Supported Technologies

**Python**:
- Pydantic Settings (recommended)
- python-decouple
- environs

**Node/Bun**:
- Zod (recommended)
- @t3-oss/env-nextjs
- envalid

## Example: Pydantic Settings (Python)

```python
# config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, PostgresDsn, RedisDsn, EmailStr, validator
from typing import Optional

class Settings(BaseSettings):
    """Application configuration with validation"""

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False
    )

    # Application
    app_name: str = Field(default="My App", description="Application name")
    environment: str = Field(default="development", pattern="^(development|staging|production)$")
    debug: bool = Field(default=False, description="Enable debug mode")

    # Server
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8000, ge=1, le=65535)

    # Database
    database_url: PostgresDsn = Field(..., description="PostgreSQL connection string")
    database_pool_size: int = Field(default=10, ge=1, le=100)

    # Redis
    redis_url: RedisDsn = Field(..., description="Redis connection string")

    # Auth
    secret_key: str = Field(..., min_length=32, description="Secret key for JWT")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30, ge=1)

    # Email
    smtp_host: str = Field(...)
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_user: EmailStr = Field(...)
    smtp_password: str = Field(...)

    # External APIs
    stripe_api_key: Optional[str] = Field(default=None, description="Stripe API key (optional)")

    # Feature flags
    enable_registration: bool = Field(default=True)
    enable_email_verification: bool = Field(default=True)

    @validator('environment')
    def validate_environment(cls, v):
        """Ensure environment is valid"""
        allowed = ['development', 'staging', 'production']
        if v not in allowed:
            raise ValueError(f"environment must be one of {allowed}")
        return v

    @validator('secret_key')
    def validate_secret_key(cls, v, values):
        """Ensure secret key is strong in production"""
        if values.get('environment') == 'production' and len(v) < 32:
            raise ValueError("secret_key must be at least 32 characters in production")
        return v

# Load and validate config
try:
    settings = Settings()
except Exception as e:
    print(f"Configuration error: {e}")
    exit(1)

# Usage
print(f"Starting {settings.app_name} on {settings.host}:{settings.port}")
```

## Example: .env File

```bash
# .env
APP_NAME=MyApp
ENVIRONMENT=production
DEBUG=false

HOST=0.0.0.0
PORT=8000

DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
DATABASE_POOL_SIZE=20

REDIS_URL=redis://localhost:6379/0

SECRET_KEY=your-super-secret-key-at-least-32-characters-long
ACCESS_TOKEN_EXPIRE_MINUTES=30

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASSWORD=your-smtp-password

STRIPE_API_KEY=sk_live_...

ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true
```

## Example: Zod Config Validation (TypeScript)

```typescript
// config.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  APP_NAME: z.string().default('MyApp'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  // Database
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  DATABASE_POOL_SIZE: z.coerce.number().int().min(1).max(100).default(10),

  // Redis
  REDIS_URL: z.string().url().startsWith('redis://'),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('30m'),

  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().email(),
  SMTP_PASSWORD: z.string(),

  // External APIs
  STRIPE_API_KEY: z.string().startsWith('sk_').optional(),

  // Feature flags
  ENABLE_REGISTRATION: z.coerce.boolean().default(true),
  ENABLE_EMAIL_VERIFICATION: z.coerce.boolean().default(true),
});

// Custom refinement for production
const configSchema = envSchema.refine(
  (data) => {
    if (data.NODE_ENV === 'production') {
      return data.JWT_SECRET.length >= 64; // Stricter in production
    }
    return true;
  },
  {
    message: 'JWT_SECRET must be at least 64 characters in production',
    path: ['JWT_SECRET'],
  }
);

// Parse and validate
let config: z.infer<typeof configSchema>;

try {
  config = configSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Configuration validation failed:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export default config;

// Usage
console.log(`Starting ${config.APP_NAME} on port ${config.PORT}`);
```

## Example: T3 Env (Next.js/TypeScript)

```typescript
// env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables (never exposed to client)
   */
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
    NODE_ENV: z.enum(["development", "staging", "production"]),
  },

  /**
   * Client-side environment variables (exposed to browser)
   * Must be prefixed with NEXT_PUBLIC_
   */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default("MyApp"),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  },

  /**
   * Manual destructuring for Next.js
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },

  /**
   * Skip validation during build (optional)
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

// Usage
console.log(env.DATABASE_URL); // ✅ Type-safe
console.log(env.NEXT_PUBLIC_APP_NAME); // ✅ Type-safe
// console.log(env.SOME_RANDOM_VAR); // ❌ TypeScript error
```

## Example: Config with Nested Objects (Python)

```python
# config/settings.py
from pydantic import BaseModel
from pydantic_settings import BaseSettings

class DatabaseConfig(BaseModel):
    url: str
    pool_size: int = 10
    echo: bool = False

class RedisConfig(BaseModel):
    url: str
    max_connections: int = 50

class EmailConfig(BaseModel):
    smtp_host: str
    smtp_port: int = 587
    smtp_user: str
    smtp_password: str
    from_email: str = "noreply@example.com"

class Settings(BaseSettings):
    app_name: str = "MyApp"
    debug: bool = False

    database: DatabaseConfig
    redis: RedisConfig
    email: EmailConfig

    model_config = SettingsConfigDict(env_nested_delimiter='__')

# .env file
# DATABASE__URL=postgresql://...
# DATABASE__POOL_SIZE=20
# REDIS__URL=redis://...
# EMAIL__SMTP_HOST=smtp.gmail.com

settings = Settings()
print(settings.database.url)
print(settings.redis.max_connections)
```

## Best Practices

1. **Fail fast on startup** - Validate config immediately, exit if invalid
2. **Use type-safe schemas** - Pydantic (Python), Zod (TypeScript)
3. **Required vs optional** - Make critical vars required, provide defaults for others
4. **Validate values** - Not just types (min/max, patterns, URLs)
5. **Document variables** - Add descriptions for each var
6. **Never commit .env** - Add to .gitignore, use .env.example
7. **Different configs per environment** - .env.development, .env.production
8. **Load early** - Before app initialization

## Example: .env.example (Template)

```bash
# .env.example
# Copy to .env and fill in values

# Application
APP_NAME=MyApp
ENVIRONMENT=development  # development | staging | production
DEBUG=true

# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Redis (required)
REDIS_URL=redis://localhost:6379/0

# Auth (required)
SECRET_KEY=generate-a-secure-random-key-at-least-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (required)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# External APIs (optional)
STRIPE_API_KEY=sk_test_...

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true
```

## Common Validation Patterns

```python
# URL validation
database_url: PostgresDsn  # Must be valid PostgreSQL URL

# Email validation
smtp_user: EmailStr  # Must be valid email

# Integer with range
port: int = Field(ge=1, le=65535)  # Between 1-65535

# String with pattern
environment: str = Field(pattern="^(dev|staging|prod)$")

# String with min length
secret_key: str = Field(min_length=32)

# Optional with default
debug: bool = Field(default=False)

# Custom validator
@validator('api_key')
def validate_api_key(cls, v):
    if not v.startswith('sk_'):
        raise ValueError('API key must start with sk_')
    return v
```

## Integration with Other Skills

- **api-endpoint-builder** - Load API configuration
- **auth-flow-builder** - Validate JWT secret and expiration
- **database-query-optimizer** - Load database connection config
- **cache-strategy-builder** - Load Redis configuration

---

**Version**: 1.0.0
**Category**: Backend Extended
**Complexity**: Low-Medium
