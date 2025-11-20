# Backend API Endpoint Template (Universal)

**Use this template for**: FastAPI (Python), Express (TypeScript/Node.js), Spring Boot (Java), ASP.NET Core (C#), Django (Python)

**Instructions**: Replace all `{{SlotName}}` placeholders with actual values from your project context.

---

## FastAPI (Python) Example

```python
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from {{projectStructure}}.services.{{serviceModule}} import {{ServiceClass}}
from {{projectStructure}}.dependencies import get_{{serviceName}}
from {{projectStructure}}.models import {{EntityModel}}

router = APIRouter(prefix="/{{resourcePlural}}", tags=["{{TagName}}"])


# Request/Response Models
class {{EntityName}}Create(BaseModel):
    """Request model for creating {{entityDescription}}."""
    {{fieldName1}}: {{fieldType1}} = Field(..., {{fieldValidation1}})
    {{fieldName2}}: {{fieldType2}} = Field(..., {{fieldValidation2}})
    {{fieldName3}}: Optional[{{fieldType3}}] = Field(None, {{fieldValidation3}})

    class Config:
        json_schema_extra = {
            "example": {
                "{{fieldName1}}": "{{exampleValue1}}",
                "{{fieldName2}}": {{exampleValue2}},
                "{{fieldName3}}": {{exampleValue3}},
            }
        }


class {{EntityName}}Response(BaseModel):
    """Response model for {{entityDescription}}."""
    id: {{IdType}}
    {{fieldName1}}: {{fieldType1}}
    {{fieldName2}}: {{fieldType2}}
    {{fieldName3}}: Optional[{{fieldType3}}]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True  # For ORM models


# Endpoints
@router.post(
    "",
    response_model={{EntityName}}Response,
    status_code=status.HTTP_201_CREATED,
    summary="{{CreateSummary}}",
    description="{{CreateDescription}}"
)
async def create_{{resourceSingular}}(
    {{paramName}}: {{EntityName}}Create,
    {{serviceName}}: {{ServiceClass}} = Depends(get_{{serviceName}}),
) -> {{EntityName}}Response:
    """
    {{CreateDocstring}}

    Args:
        {{paramName}}: {{paramDescription}}
        {{serviceName}}: {{serviceDescription}} (injected)

    Returns:
        Created {{entityDescription}} with ID

    Raises:
        HTTPException: 409 if {{conflictCondition}}
        HTTPException: 400 if {{validationCondition}}
    """
    try:
        {{entityVar}} = await {{serviceName}}.create_{{resourceSingular}}({{paramName}})
        return {{entityVar}}
    except {{ConflictException}} as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": {
                    "code": "{{CONFLICT_ERROR_CODE}}",
                    "message": str(e),
                    "details": {"{{detailKey}}": {{detailValue}}}
                }
            }
        )
    except {{ValidationException}} as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": "{{VALIDATION_ERROR_CODE}}",
                    "message": str(e)
                }
            }
        )


@router.get(
    "",
    response_model=List[{{EntityName}}Response],
    summary="{{ListSummary}}",
    description="{{ListDescription}}"
)
async def list_{{resourcePlural}}(
    skip: int = 0,
    limit: int = 100,
    {{filterParam1}}: Optional[{{filterType1}}] = None,
    {{serviceName}}: {{ServiceClass}} = Depends(get_{{serviceName}}),
) -> List[{{EntityName}}Response]:
    """
    {{ListDocstring}}

    Args:
        skip: Number of records to skip (pagination)
        limit: Maximum number of records to return
        {{filterParam1}}: {{filterDescription1}}
        {{serviceName}}: {{serviceDescription}} (injected)

    Returns:
        List of {{entityDescription}} matching filters
    """
    {{entitiesVar}} = await {{serviceName}}.list_{{resourcePlural}}(
        skip=skip,
        limit=limit,
        {{filterParam1}}={{filterParam1}},
    )
    return {{entitiesVar}}


@router.get(
    "/{{{resourceId}}}",
    response_model={{EntityName}}Response,
    summary="{{GetSummary}}",
    description="{{GetDescription}}"
)
async def get_{{resourceSingular}}(
    {{resourceId}}: {{IdType}},
    {{serviceName}}: {{ServiceClass}} = Depends(get_{{serviceName}}),
) -> {{EntityName}}Response:
    """
    {{GetDocstring}}

    Args:
        {{resourceId}}: {{idDescription}}
        {{serviceName}}: {{serviceDescription}} (injected)

    Returns:
        {{EntityDescription}} with specified ID

    Raises:
        HTTPException: 404 if {{resourceSingular}} not found
    """
    {{entityVar}} = await {{serviceName}}.get_{{resourceSingular}}({{resourceId}})
    if not {{entityVar}}:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": {
                    "code": "{{NOT_FOUND_ERROR_CODE}}",
                    "message": "{{EntityName}} {{resourceId}} not found",
                    "details": {"{{resourceId}}": {{resourceId}}}
                }
            }
        )
    return {{entityVar}}


@router.put(
    "/{{{resourceId}}}",
    response_model={{EntityName}}Response,
    summary="{{UpdateSummary}}"
)
async def update_{{resourceSingular}}(
    {{resourceId}}: {{IdType}},
    {{paramName}}: {{EntityName}}Create,
    {{serviceName}}: {{ServiceClass}} = Depends(get_{{serviceName}}),
) -> {{EntityName}}Response:
    """{{UpdateDocstring}}"""
    {{entityVar}} = await {{serviceName}}.update_{{resourceSingular}}({{resourceId}}, {{paramName}})
    if not {{entityVar}}:
        raise HTTPException(status_code=404, detail="{{EntityName}} not found")
    return {{entityVar}}


@router.delete(
    "/{{{resourceId}}}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="{{DeleteSummary}}"
)
async def delete_{{resourceSingular}}(
    {{resourceId}}: {{IdType}},
    {{serviceName}}: {{ServiceClass}} = Depends(get_{{serviceName}}),
):
    """{{DeleteDocstring}}"""
    success = await {{serviceName}}.delete_{{resourceSingular}}({{resourceId}})
    if not success:
        raise HTTPException(status_code=404, detail="{{EntityName}} not found")
```

---

## Express (TypeScript) Example

```typescript
import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { {{ServiceClass}} } from '@/services/{{serviceModule}}';
import { {{EntityModel}} } from '@/models/{{modelModule}}';
import { asyncHandler } from '@/middleware/asyncHandler';

const router = Router();

// POST /{{resourcePlural}} - Create
router.post(
  '/{{resourcePlural}}',
  [
    body('{{fieldName1}}').{{validation1}}.{{validation2}},
    body('{{fieldName2}}').{{validation3}},
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: errors.array(),
        },
      });
    }

    const {{serviceName}} = new {{ServiceClass}}();
    const {{entityVar}} = await {{serviceName}}.create(req.body);

    res.status(201).json({{entityVar}});
  })
);

// GET /{{resourcePlural}} - List
router.get(
  '/{{resourcePlural}}',
  [
    query('skip').optional().isInt({ min: 0 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 100;

    const {{serviceName}} = new {{ServiceClass}}();
    const {{entitiesVar}} = await {{serviceName}}.list({ skip, limit });

    res.json({{entitiesVar}});
  })
);

// GET /{{resourcePlural}}/:id - Get by ID
router.get(
  '/{{resourcePlural}}/:{{resourceId}}',
  [param('{{resourceId}}').isInt()],
  asyncHandler(async (req: Request, res: Response) => {
    const {{serviceName}} = new {{ServiceClass}}();
    const {{entityVar}} = await {{serviceName}}.getById(parseInt(req.params.{{resourceId}}));

    if (!{{entityVar}}) {
      return res.status(404).json({
        error: {
          code: '{{NOT_FOUND_ERROR_CODE}}',
          message: `{{EntityName}} ${req.params.{{resourceId}}} not found`,
        },
      });
    }

    res.json({{entityVar}});
  })
);

// PUT /{{resourcePlural}}/:id - Update
router.put(
  '/{{resourcePlural}}/:{{resourceId}}',
  [
    param('{{resourceId}}').isInt(),
    body('{{fieldName1}}').optional().{{validation1}},
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const {{serviceName}} = new {{ServiceClass}}();
    const {{entityVar}} = await {{serviceName}}.update(
      parseInt(req.params.{{resourceId}}),
      req.body
    );

    if (!{{entityVar}}) {
      return res.status(404).json({
        error: { code: '{{NOT_FOUND_ERROR_CODE}}', message: 'Not found' },
      });
    }

    res.json({{entityVar}});
  })
);

// DELETE /{{resourcePlural}}/:id
router.delete(
  '/{{resourcePlural}}/:{{resourceId}}',
  [param('{{resourceId}}').isInt()],
  asyncHandler(async (req: Request, res: Response) => {
    const {{serviceName}} = new {{ServiceClass}}();
    const success = await {{serviceName}}.delete(parseInt(req.params.{{resourceId}}));

    if (!success) {
      return res.status(404).json({
        error: { code: '{{NOT_FOUND_ERROR_CODE}}', message: 'Not found' },
      });
    }

    res.status(204).send();
  })
);

export default router;
```

---

## Slot Reference

| Slot | Purpose | Example Values |
|------|---------|----------------|
| `{{resourcePlural}}` | Resource name (plural, lowercase) | `users`, `products`, `orders`, `posts` |
| `{{resourceSingular}}` | Resource name (singular, lowercase) | `user`, `product`, `order`, `post` |
| `{{resourceId}}` | ID parameter name | `userId`, `productId`, `id` |
| `{{EntityName}}` | Entity class name (PascalCase) | `User`, `Product`, `Order`, `Post` |
| `{{entityDescription}}` | What the entity represents | `user account`, `product item`, `order record` |
| `{{ServiceClass}}` | Service class name | `UserService`, `ProductRepository`, `OrderManager` |
| `{{serviceName}}` | Service variable name | `userService`, `productRepo`, `orderManager` |
| `{{fieldName1}}`, `{{fieldName2}}` | Entity field names | `name`, `email`, `price`, `quantity`, `status` |
| `{{fieldType1}}`, `{{fieldType2}}` | Field types | `str`, `int`, `float`, `bool`, `datetime`, `UUID` |
| `{{fieldValidation1}}` | Field validation rules | `min_length=2, max_length=50`, `ge=0`, `regex="..."` |
| `{{exampleValue1}}` | Example field value | `"John Doe"`, `25`, `19.99`, `"active"` |
| `{{IdType}}` | ID type | `int`, `str`, `UUID`, `ObjectId` |
| `{{TagName}}` | OpenAPI tag | `Users`, `Products`, `Authentication` |
| `{{ConflictException}}` | Conflict exception class | `EmailExistsError`, `DuplicateKeyError`, `IntegrityError` |
| `{{ValidationException}}` | Validation exception class | `ValidationError`, `ValueError`, `InvalidDataError` |
| `{{NOT_FOUND_ERROR_CODE}}` | Error code for 404 | `USER_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `RESOURCE_NOT_FOUND` |
| `{{CONFLICT_ERROR_CODE}}` | Error code for 409 | `EMAIL_EXISTS`, `DUPLICATE_NAME`, `ALREADY_EXISTS` |

---

## Usage Instructions

1. **Identify tech stack** from Step 1 (FastAPI, Express, Spring Boot, etc.)
2. **Choose appropriate template section**
3. **Replace ALL {{slots}}** with project-specific values
4. **Add validation** appropriate for your framework
5. **Test endpoints** with Postman/curl
6. **Validate** OpenAPI docs generation

---

## Best Practices

- **CRUD consistency**: Use POST/GET/PUT/DELETE for create/read/update/delete
- **Status codes**: 201 (created), 200 (OK), 204 (deleted), 404 (not found)
- **Pagination**: Always paginate list endpoints (skip/limit or page/per_page)
- **Filtering**: Add query params for common filters
- **Validation**: Use Pydantic/express-validator/class-validator
- **Dependency injection**: Inject services, don't instantiate in routes
- **Error handling**: Structured errors with code, message, details
- **Documentation**: OpenAPI/Swagger docs auto-generated

---

**Last Updated**: 2025-10-20
**Compatible With**: FastAPI 0.100+, Express 4.18+, Spring Boot 3+, Django 4+, ASP.NET Core 7+
