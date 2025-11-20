---
name: data-validator-generator
description: |
  This skill generates type-safe data validation schemas for APIs and forms.
  Supports Python (Pydantic), TypeScript (Zod), JavaScript (Joi, Yup), Go (validator).
  Creates request/response schemas, form validation, environment variable validation, and config validation.
  Activate when user says "validate data", "create schema", "input validation", "type-safe", or building APIs/forms.
  Output: Complete validation schemas with types, error messages, examples, and tests.
---

# Data Validator Generator

> **Purpose**: Generate type-safe validation schemas with clear error messages

---

## When to Use This Skill

Activate when:
- ✅ Building API endpoints (request/response validation)
- ✅ Creating forms (frontend validation)
- ✅ Validating environment variables (.env)
- ✅ Validating configuration files (JSON, YAML)
- ✅ User says: "validate input", "create schema", "type-safe validation"
- ✅ Need to ensure data integrity and prevent invalid data

---

## What This Skill Does

**Generates validation schemas with**:
1. **Type definitions** - Typed schemas (string, number, email, etc.)
2. **Constraints** - Min/max length, regex patterns, ranges
3. **Required/optional** - Mark fields as required or optional
4. **Nested objects** - Complex nested structures
5. **Arrays** - Array validation with item schemas
6. **Custom validators** - Custom validation logic
7. **Error messages** - Clear, user-friendly error messages
8. **Transformations** - Trim, lowercase, parse dates
9. **Tests** - Unit tests for validation logic

---

## Supported Technologies

### Python
- **Pydantic** (recommended) - Type-safe, FastAPI integration
- **Marshmallow** - Serialization + validation
- **Cerberus** - Lightweight validation

### TypeScript/JavaScript
- **Zod** (recommended for TypeScript) - Type inference, composable
- **Yup** - Schema validation, React Hook Form compatible
- **Joi** - Enterprise validation (Node.js)
- **Ajv** - JSON Schema validator (fastest)

### Go
- **validator** - Struct tag validation
- **go-playground/validator** - Comprehensive validation

---

## Validation Patterns

### 1. API Request Validation (Pydantic - FastAPI)

```python
from pydantic import BaseModel, Field, validator, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class CreateUserRequest(BaseModel):
    """User creation request schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, max_length=100, description="Password (min 8 chars)")
    name: str = Field(..., min_length=2, max_length=100, description="Full name")
    age: Optional[int] = Field(None, ge=18, le=120, description="Age (18-120)")
    role: UserRole = Field(UserRole.USER, description="User role")
    tags: List[str] = Field(default_factory=list, max_items=10, description="User tags")

    # Custom validator
    @validator('password')
    def password_must_contain_uppercase(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

    @validator('email')
    def email_must_be_lowercase(cls, v):
        return v.lower()

    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123",
                "name": "John Doe",
                "age": 25,
                "role": "user",
                "tags": ["developer", "python"]
            }
        }

class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    name: str
    age: Optional[int]
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True  # For SQLAlchemy models
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Usage in FastAPI
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: CreateUserRequest):
    # Pydantic validates automatically
    # If validation fails, returns 422 with detailed errors
    return {"id": 1, **user.dict(), "created_at": datetime.now()}
```

**Validation Error Response** (automatic):
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    },
    {
      "loc": ["body", "password"],
      "msg": "Password must contain at least one uppercase letter",
      "type": "value_error"
    }
  ]
}
```

---

### 2. Frontend Form Validation (Zod - TypeScript)

```typescript
import { z } from 'zod';

// Define schema
const createUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .trim(),

  age: z.number()
    .int('Age must be an integer')
    .min(18, 'Must be 18 or older')
    .max(120, 'Invalid age')
    .optional(),

  role: z.enum(['admin', 'user', 'guest'])
    .default('user'),

  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .default([]),

  acceptTerms: z.boolean()
    .refine((val) => val === true, 'You must accept the terms'),

  birthDate: z.string()
    .datetime('Invalid date format')
    .transform((str) => new Date(str))
    .refine((date) => date < new Date(), 'Birth date must be in the past')
});

// Infer TypeScript type from schema
type CreateUserInput = z.infer<typeof createUserSchema>;

// Validate data
function validateUser(data: unknown): CreateUserInput {
  try {
    return createUserSchema.parse(data);  // Throws ZodError if invalid
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      // Format errors for UI
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new Error(JSON.stringify(formattedErrors));
    }
    throw error;
  }
}

// Safe parse (returns { success: boolean, data/error })
function safeValidateUser(data: unknown) {
  const result = createUserSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    };
  }

  return {
    success: true,
    data: result.data
  };
}

// React Hook Form integration
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema)
  });

  const onSubmit = (data: CreateUserInput) => {
    console.log('Valid data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Create User</button>
    </form>
  );
}
```

---

### 3. Environment Variable Validation (Zod)

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().min(1).max(65535)).default('3000'),
  HOST: z.string().default('localhost'),

  // Database
  DATABASE_URL: z.string().url('Invalid database URL'),
  DB_POOL_SIZE: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('10'),

  // Redis
  REDIS_URL: z.string().url('Invalid Redis URL'),
  REDIS_TTL: z.string().transform(Number).pipe(z.number().int().min(0)).default('3600'),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // External APIs
  API_KEY: z.string().min(1, 'API key is required'),
  API_URL: z.string().url('Invalid API URL'),

  // Feature flags
  ENABLE_CACHING: z.string().transform(val => val === 'true').default('true'),
  ENABLE_LOGGING: z.string().transform(val => val === 'true').default('true')
});

// Validate environment variables at startup
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

// Export validated env
export const env = validateEnv();

// Usage
console.log(`Server running on port ${env.PORT}`);
console.log(`Database: ${env.DATABASE_URL}`);
```

---

### 4. Nested Object Validation (Pydantic)

```python
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class Address(BaseModel):
    street: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2, max_length=2)
    zip_code: str = Field(..., regex=r'^\d{5}(-\d{4})?$')
    country: str = Field(default="USA")

class PaymentMethod(BaseModel):
    type: str = Field(..., regex=r'^(credit_card|debit_card|paypal|stripe)$')
    last_four: str = Field(..., regex=r'^\d{4}$')
    expires_at: datetime

class OrderItem(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., ge=1, le=100)
    price: float = Field(..., gt=0)

    @validator('price')
    def price_must_have_two_decimals(cls, v):
        return round(v, 2)

class CreateOrderRequest(BaseModel):
    user_id: int = Field(..., gt=0)
    items: List[OrderItem] = Field(..., min_items=1, max_items=50)
    shipping_address: Address
    billing_address: Optional[Address] = None
    payment_method: PaymentMethod
    discount_code: Optional[str] = Field(None, max_length=20)
    notes: Optional[str] = Field(None, max_length=500)

    @validator('billing_address', always=True)
    def set_billing_address(cls, v, values):
        # Default billing to shipping if not provided
        return v or values.get('shipping_address')

    @validator('items')
    def calculate_total(cls, items):
        total = sum(item.quantity * item.price for item in items)
        if total > 10000:
            raise ValueError('Order total exceeds maximum allowed ($10,000)')
        return items

    class Config:
        schema_extra = {
            "example": {
                "user_id": 123,
                "items": [
                    {"product_id": 1, "quantity": 2, "price": 29.99},
                    {"product_id": 2, "quantity": 1, "price": 49.99}
                ],
                "shipping_address": {
                    "street": "123 Main St",
                    "city": "New York",
                    "state": "NY",
                    "zip_code": "10001"
                },
                "payment_method": {
                    "type": "credit_card",
                    "last_four": "1234",
                    "expires_at": "2025-12-31T23:59:59Z"
                }
            }
        }
```

---

## Best Practices

1. **Use Type-Safe Libraries**
   - Python: Pydantic (auto type coercion)
   - TypeScript: Zod (type inference)
   - Avoid runtime type checking when compile-time is available

2. **Clear Error Messages**
   - Be specific: "Email is invalid" > "Validation failed"
   - Include field name: "password: Must be at least 8 characters"
   - Provide examples: "Date must be in format YYYY-MM-DD"

3. **Validate Early**
   - API: Validate at endpoint entry (before business logic)
   - Frontend: Validate on blur + on submit
   - Config: Validate at app startup (fail fast)

4. **Transform Data**
   - Trim whitespace: `email.trim()`
   - Normalize: `email.toLowerCase()`
   - Parse: Convert strings to numbers/dates

5. **Reuse Schemas**
   - DRY: Define once, use for request + response
   - Compose: Build complex schemas from simple ones
   - Extend: Use inheritance/composition

---

## Common Validation Rules

```typescript
// String validations
z.string()
  .min(3)                    // Minimum length
  .max(100)                  // Maximum length
  .email()                   // Email format
  .url()                     // URL format
  .uuid()                    // UUID format
  .regex(/^[A-Z]/)           // Regex pattern
  .startsWith('http')        // Prefix
  .endsWith('.com')          // Suffix
  .trim()                    // Remove whitespace
  .toLowerCase()             // Transform to lowercase

// Number validations
z.number()
  .int()                     // Integer only
  .positive()                // > 0
  .negative()                // < 0
  .min(18)                   // Minimum value
  .max(100)                  // Maximum value
  .multipleOf(5)             // Divisible by 5

// Date validations
z.date()
  .min(new Date('2020-01-01'))  // After date
  .max(new Date())               // Before date

// Array validations
z.array(z.string())
  .min(1)                    // At least 1 item
  .max(10)                   // At most 10 items
  .nonempty()                // Not empty

// Object validations
z.object({ ... })
  .strict()                  // No extra keys
  .partial()                 // All keys optional
  .required()                // All keys required

// Custom validation
z.string().refine(
  (val) => val.includes('@'),
  { message: 'Must contain @' }
)
```

---

## Integration with Other Skills

- **api-endpoint-builder** - Validate API requests/responses
- **form-builder-with-validation** - Validate form inputs
- **auth-flow-builder** - Validate credentials
- **orm-query-builder** - Validate database models

---

**Skill Version**: 1.0.0
**Technologies**: Python (Pydantic), TypeScript (Zod), JavaScript (Yup, Joi)
**Output**: Type-safe validation schemas with error messages and tests
