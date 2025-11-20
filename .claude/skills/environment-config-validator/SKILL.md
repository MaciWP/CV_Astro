---
name: environment-config-validator
description: Validate .env files, check required variables, ensure correct types. Dotenv validation, environment checks. Keywords - env validation, dotenv, environment variables, config validation, env checker, required env vars
---

# Environment Config Validator

## When to Use This Skill

Activate when:
- Validating .env files have all required variables
- Checking environment variable types and formats
- Preventing startup with invalid configuration
- Creating .env.example templates
- CI/CD environment validation

## What This Skill Does

Validates environment config with:
- Check required variables exist
- Validate variable types (string, number, boolean, URL)
- Ensure correct formats (URLs, emails, UUIDs)
- Create .env.example from schema
- Startup validation (fail fast)

## Supported Technologies

**Node/Bun**:
- Zod (recommended - type-safe validation)
- envalid (validation library)
- dotenv (load .env files)

**Python**:
- Pydantic Settings (validation)
- python-dotenv (load .env)

## Example: Zod Environment Validation (TypeScript)

```typescript
// env.ts
import { z } from 'zod';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  DATABASE_POOL_SIZE: z.coerce.number().int().min(1).max(100).default(10),

  // Redis
  REDIS_URL: z.string().url().startsWith('redis://'),

  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('30m'),

  // External APIs
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  SENDGRID_API_KEY: z.string().startsWith('SG.').optional(),

  // Feature flags
  ENABLE_REGISTRATION: z.coerce.boolean().default(true),
  ENABLE_EMAIL_VERIFICATION: z.coerce.boolean().default(true),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

// Parse and validate
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export default env;

// Usage in app
import env from './env';

console.log(`Starting server on ${env.HOST}:${env.PORT}`);
console.log(`Environment: ${env.NODE_ENV}`);
```

## Example: Generate .env.example from Schema

```typescript
// scripts/generate-env-example.ts
import { z } from 'zod';
import fs from 'fs';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  SENDGRID_API_KEY: z.string().optional(),
});

function generateEnvExample(schema: z.ZodObject<any>) {
  const shape = schema.shape;
  const lines: string[] = [];

  lines.push('# Environment Variables');
  lines.push('# Copy this file to .env and fill in the values');
  lines.push('');

  for (const [key, zodType] of Object.entries(shape)) {
    const isOptional = zodType instanceof z.ZodOptional;
    const required = isOptional ? '(optional)' : '(required)';

    lines.push(`# ${required}`);

    // Add example value
    if (key.includes('URL')) {
      lines.push(`${key}=https://example.com`);
    } else if (key.includes('SECRET') || key.includes('KEY')) {
      lines.push(`${key}=your-secret-key-here`);
    } else if (key.includes('PORT')) {
      lines.push(`${key}=3000`);
    } else if (key === 'NODE_ENV') {
      lines.push(`${key}=development`);
    } else {
      lines.push(`${key}=`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

const envExample = generateEnvExample(envSchema);
fs.writeFileSync('.env.example', envExample);
console.log('✅ Generated .env.example');
```

## Example: Runtime Environment Checker

```typescript
// utils/checkEnv.ts
import env from '../env';

export function checkProductionEnv() {
  if (env.NODE_ENV !== 'production') {
    return;
  }

  const errors: string[] = [];

  // Check production-specific requirements
  if (env.JWT_SECRET.length < 64) {
    errors.push('JWT_SECRET must be at least 64 characters in production');
  }

  if (!env.DATABASE_URL.includes('prod')) {
    errors.push('DATABASE_URL should point to production database');
  }

  if (env.ENABLE_REGISTRATION && !env.SENDGRID_API_KEY) {
    errors.push('SENDGRID_API_KEY required when registration is enabled');
  }

  if (errors.length > 0) {
    console.error('❌ Production environment errors:');
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('✅ Production environment validated');
}

// Run on startup
checkProductionEnv();
```

## Example: Envalid Validation (Alternative)

```typescript
// env.ts (using envalid)
import { cleanEnv, str, num, url, email, bool } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'staging', 'production'] }),
  PORT: num({ default: 3000 }),
  HOST: str({ default: '0.0.0.0' }),

  DATABASE_URL: url(),
  DATABASE_POOL_SIZE: num({ default: 10 }),

  REDIS_URL: url(),

  JWT_SECRET: str({ minLength: 32 }),
  JWT_EXPIRES_IN: str({ default: '30m' }),

  STRIPE_SECRET_KEY: str(),
  SENDGRID_API_KEY: email({ optional: true }),

  ENABLE_REGISTRATION: bool({ default: true }),
  LOG_LEVEL: str({ choices: ['debug', 'info', 'warn', 'error'], default: 'info' }),
});
```

## Example: Python Pydantic Settings Validation

```python
# config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, PostgresDsn, RedisDsn, validator
from typing import Literal

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=False
    )

    # Server
    node_env: Literal['development', 'staging', 'production'] = 'development'
    port: int = Field(default=8000, ge=1, le=65535)
    host: str = '0.0.0.0'

    # Database
    database_url: PostgresDsn
    database_pool_size: int = Field(default=10, ge=1, le=100)

    # Redis
    redis_url: RedisDsn

    # Authentication
    jwt_secret: str = Field(min_length=32)
    jwt_expires_in: str = '30m'

    # External APIs
    stripe_secret_key: str = Field(pattern=r'^sk_')
    sendgrid_api_key: str | None = None

    # Feature flags
    enable_registration: bool = True
    enable_email_verification: bool = True

    @validator('jwt_secret')
    def validate_jwt_secret_in_production(cls, v, values):
        if values.get('node_env') == 'production' and len(v) < 64:
            raise ValueError('JWT_SECRET must be at least 64 characters in production')
        return v

# Load and validate
try:
    settings = Settings()
except Exception as e:
    print(f"❌ Environment validation failed: {e}")
    exit(1)

print(f"✅ Environment validated for {settings.node_env}")
```

## Example: CI/CD Environment Validation Script

```bash
#!/bin/bash
# scripts/validate-env.sh

echo "🔍 Validating environment variables..."

# Required variables
REQUIRED_VARS=(
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET"
  "STRIPE_SECRET_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo "❌ Missing required environment variables:"
  for var in "${MISSING_VARS[@]}"; do
    echo "  - $var"
  done
  exit 1
fi

# Validate formats
if [[ ! $DATABASE_URL =~ ^postgresql:// ]]; then
  echo "❌ DATABASE_URL must start with postgresql://"
  exit 1
fi

if [[ ! $REDIS_URL =~ ^redis:// ]]; then
  echo "❌ REDIS_URL must start with redis://"
  exit 1
fi

if [ ${#JWT_SECRET} -lt 32 ]; then
  echo "❌ JWT_SECRET must be at least 32 characters"
  exit 1
fi

echo "✅ All environment variables validated"
```

## Best Practices

1. **Fail fast** - Validate on startup, exit if invalid
2. **Clear errors** - Show which variables are missing/invalid
3. **Type validation** - Check types, not just presence
4. **Format validation** - URLs, emails, patterns
5. **Production checks** - Stricter validation in production
6. **Generate .env.example** - Auto-generate from schema
7. **Document variables** - Comment each variable in .env.example

## .env.example Template

```bash
# .env.example

# ==========================================
# Server Configuration
# ==========================================
NODE_ENV=development  # development | staging | production
PORT=3000
HOST=0.0.0.0

# ==========================================
# Database
# ==========================================
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_POOL_SIZE=10

# ==========================================
# Redis
# ==========================================
REDIS_URL=redis://localhost:6379/0

# ==========================================
# Authentication
# ==========================================
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=30m

# ==========================================
# External APIs
# ==========================================
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SendGrid (optional)
SENDGRID_API_KEY=SG....

# ==========================================
# Feature Flags
# ==========================================
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true

# ==========================================
# Logging
# ==========================================
LOG_LEVEL=info  # debug | info | warn | error
```

## Integration with Other Skills

- **config-validator** - Validate config at runtime
- **api-endpoint-builder** - Use validated env in API
- **logging-strategy** - Log validation errors

---

**Version**: 1.0.0
**Category**: Testing + DevOps
**Complexity**: Low-Medium
