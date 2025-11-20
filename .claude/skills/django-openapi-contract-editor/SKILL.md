---
name: openapi-contract-editor
description: Guides editing and creation of OpenAPI 3.0 contracts in binora-contract submodule with modular YAML structure, Redocly validation, and Django/DRF consistency checks. Auto-activates when editing contracts, implementing endpoints, or modifying serializers.
activation:
  keywords:
    - openapi
    - contract
    - schema
    - api spec
    - swagger
    - redocly
    - yaml
    - api documentation
    - binora-contract
    - rest api
  triggers:
    - binora-contract/
    - npm run lint
    - npm run bundle
    - openapi.yaml
    - openapi-index.yaml
    - $ref
---

# OpenAPI Contract Editor

🎯 **CRITICAL SKILL**: Enforces error-free OpenAPI 3.0 contract editing with modular YAML structure, Redocly validation, and Django/DRF consistency for binora-contract submodule.

**Version**: 1.0.0

**Auto-activates on**: openapi, contract, schema, endpoint, api spec, contrato, especificación, binora-contract, swagger, rest api, drf endpoint, redocly, yaml, api documentation

---

## Mission

Guide **error-free OpenAPI 3.0 contract editing** with **modular YAML structure**, **Redocly validation**, **Django/DRF consistency**, and **best practices enforcement** for binora-contract submodule.

---

## Core Principles

### 1. Modular Structure with $ref

**Rule**: Never create monolithic YAML files. Always use separate files with $ref for paths, schemas, and responses.

**❌ WRONG**: Single 5000-line YAML with everything inline

**✅ CORRECT**: Separate files (workflows.yaml, openapi-index.yaml, components/responses.yaml) with $ref linking

**Auto-check**:
- [ ] Each module file < 1000 lines
- [ ] Shared responses use $ref to components/responses.yaml
- [ ] Schemas use $ref for nested objects
- [ ] paths/ references registered in openapi-index.yaml

---

### 2. Django/DRF Consistency

**Rule**: OpenAPI schemas MUST match Django serializers, ViewSet actions, and model fields exactly.

**❌ WRONG**: Schema uses `uuid` field, but serializer returns `id`

**✅ CORRECT**: Schema field `id` matches serializer Meta.fields exactly

**Auto-check**:
- [ ] operationId matches ViewSet action (e.g., `workflows_list` → `WorkflowViewSet.list()`)
- [ ] Schema field names match serializer fields
- [ ] Required fields match serializer required validation
- [ ] Enum values match Django model choices
- [ ] Parameter names match ViewSet filterset_fields

**Verification Commands**:
```bash
# Check serializer fields
grep -A 20 "class WorkflowListSerializer" apps/processes/serializers/workflow.py

# Check ViewSet actions
grep -A 5 "def list\|@action" apps/processes/views/workflow.py

# Check model choices
grep -A 10 "class.*Choices" apps/processes/models/workflow.py
```

---

### 3. Redocly Validation

**Rule**: Always validate contracts with Redocly CLI before committing. Zero linting errors allowed.

**❌ WRONG - Skip Validation**:
```bash
# Edit contract and commit directly ❌
git add binora-contract/contract/workflows.yaml
git commit -m "Add workflows contract"  # NO VALIDATION!
```

**✅ CORRECT - Validate First**:
```bash
# Navigate to contract directory
cd binora-contract

# Run Redocly lint
npm run lint  # MUST pass with 0 errors

# Bundle to verify $ref resolution
npm run bundle  # MUST generate openapi.yaml successfully

# Then commit
git add contract/workflows.yaml contract/openapi-index.yaml
git commit -m "feat: add workflows contract - validated with Redocly"
```

**Auto-check**:
- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run bundle` generates openapi.yaml successfully
- [ ] No unresolved $ref references
- [ ] YAML syntax is valid
- [ ] OpenAPI 3.0.3 specification compliance

**Redocly Rules** (from redocly.yaml):
- ✅ `no-invalid-media-type-examples: error`
- ⚠️ `no-empty-servers: off` (allowed)
- ⚠️ `info-license: off` (not required)
- ⚠️ `no-path-trailing-slash: off` (trailing slashes allowed)

---

### 4. Complete Endpoint Documentation

**Rule**: Every endpoint MUST include operationId, summary, parameters, requestBody (if applicable), all responses (200, 400, 401, 403, 404, 500), tags, and security.

**❌ WRONG - Incomplete**:
```yaml
/workflows/:
  get:
    # Missing operationId, tags, security
    responses:
      '200':
        description: OK  # ❌ Too vague
```

**✅ CORRECT - Complete**:
```yaml
/workflows/:
  get:
    operationId: workflows_list  # ✅ Matches ViewSet action
    summary: List workflows with filters and pagination  # ✅ Descriptive
    parameters:
      - name: page
        in: query
        required: false
        description: A page number within the paginated result set
        schema:
          type: integer
      - name: group
        in: query
        required: false
        description: Filter by process type group
        schema:
          type: string
          enum: [mac, maintenance]
    tags:
      - workflows  # ✅ Organized
    security:
      - jwtAuth: []  # ✅ Authentication required
    responses:
      '200':
        description: Workflows list
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaginatedWorkflowList'
            examples:
              workflowsPage:
                summary: Sample workflows list page
                value:
                  total: 2
                  limit: 10
                  current_page: 1
                  pages: 1
                  results: [...]
      '400':
        $ref: './components/responses.yaml#/responses/BadRequest'
      '401':
        $ref: './components/responses.yaml#/responses/Unauthorized'
      '403':
        $ref: './components/responses.yaml#/responses/Forbidden'
      '500':
        $ref: './components/responses.yaml#/responses/InternalServerError'
```

**Auto-check**:
- [ ] operationId present and unique
- [ ] summary describes what endpoint does
- [ ] All query/path/body parameters documented
- [ ] Responses for 200, 400, 401, 403, 500 (404 if detail endpoint)
- [ ] tags assigned for organization
- [ ] security: jwtAuth specified
- [ ] examples provided for 200 responses

---

### 5. Schema Reusability

**Rule**: Define schemas once in components/schemas and reuse with $ref. Avoid inline schema definitions.

**❌ WRONG**: Inline schemas duplicated across endpoints

**✅ CORRECT**: Define once in components/schemas, reference with $ref everywhere, use allOf for extension

**Auto-check**:
- [ ] Schemas defined in components/schemas section
- [ ] Paths reference schemas with $ref
- [ ] Use allOf for schema extension/composition
- [ ] Nested objects use $ref (not inline)
- [ ] No duplicate schema definitions

---

## Anti-Patterns

### 1. Manual Tenant_id in OpenAPI Parameters

**❌ ANTI-PATTERN**:
```yaml
/workflows/:
  get:
    parameters:
      - name: tenant_id  # ❌ FORBIDDEN - Middleware handles this
        in: query
        schema:
          type: string
```

**✅ CORRECT**:
```yaml
/workflows/:
  get:
    parameters:
      # NO tenant_id - middleware adds automatically
      - name: group
        in: query
        schema:
          type: string
    security:
      - jwtAuth: []  # ✅ JWT contains tenant context
```

**Why it matters**: Multi-tenant middleware automatically filters by tenant. Manual tenant_id parameters violate transparent isolation principle and could allow cross-tenant data access.

---

### 2. Ignoring Redocly Lint Errors

**❌ ANTI-PATTERN**:
```bash
# See errors but ignore them
npm run lint
# validating /Users/oriol/.../openapi-index.yaml...
# [1] workflows.yaml:45:7 at #/paths/~1workflows~1/get/responses/200/content/application~1json/schema
# $ref must resolve to a valid schema

# Commit anyway ❌
git commit -m "Add workflows contract"
```

**✅ CORRECT**:
```bash
npm run lint
# Fix ALL errors before committing
# [1] workflows.yaml:45:7 - Fixed $ref path

npm run lint  # 0 errors ✅
npm run bundle  # Success ✅
git commit -m "feat: add workflows contract - Redocly validated"
```

**Why it matters**: Unresolved $ref breaks API documentation generation (Swagger UI, Redoc) and CI/CD pipelines.

---

### 3. Missing HTTP Status Codes

**❌ ANTI-PATTERN**:
```yaml
/workflows/:
  post:
    responses:
      '201':
        description: Created  # ❌ Missing 400, 401, 403, 500
```

**✅ CORRECT**:
```yaml
/workflows/:
  post:
    responses:
      '201':
        description: Workflow created successfully
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorkflowDetail'
      '400':  # ✅ Validation errors
        $ref: './components/responses.yaml#/responses/BadRequest'
      '401':  # ✅ Unauthenticated
        $ref: './components/responses.yaml#/responses/Unauthorized'
      '403':  # ✅ Unauthorized
        $ref: './components/responses.yaml#/responses/Forbidden'
      '500':  # ✅ Server error
        $ref: './components/responses.yaml#/responses/InternalServerError'
```

**Why it matters**: Frontend developers need to know all possible status codes to handle errors correctly. Missing status codes cause unhandled exceptions.

---

### 4. Inconsistent Field Naming

**❌ ANTI-PATTERN**:
```yaml
# OpenAPI uses snake_case
WorkflowListItem:
  properties:
    workflow_name:  # ❌ Serializer uses 'name'
      type: string

# Serializer uses different name
class WorkflowListSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name']  # ❌ Mismatch!
```

**✅ CORRECT**:
```yaml
# OpenAPI matches serializer exactly
WorkflowListItem:
  properties:
    name:  # ✅ Matches serializer
      type: string
      maxLength: 200

# Serializer
class WorkflowListSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name']  # ✅ Match!
```

**Why it matters**: Field name mismatches break frontend integration and cause validation errors.

---

### 5. No Examples in 200 Responses

**❌ ANTI-PATTERN**:
```yaml
/workflows/:
  get:
    responses:
      '200':
        description: Workflows list
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaginatedWorkflowList'
            # ❌ No example - developers don't know what data looks like
```

**✅ CORRECT**:
```yaml
/workflows/:
  get:
    responses:
      '200':
        description: Workflows list
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaginatedWorkflowList'
            examples:  # ✅ Real example data
              workflowsPage:
                summary: Sample workflows list page
                value:
                  total: 2
                  limit: 10
                  current_page: 1
                  pages: 1
                  next: null
                  previous: null
                  results:
                    - id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
                      url: "https://api.example.org/workflows/3fa85f64-5717-4562-b3fc-2c963f66afa6/"
                      name: "Asset Registration Standard Workflow"
                      is_published: true
                      is_predefined: true
```

**Why it matters**: Examples help developers understand response structure and speed up frontend integration.

---

## Validation Checklist

### Critical (MUST Fix Before Commit)

- [ ] **Redocly Lint**: `cd binora-contract && npm run lint` passes with 0 errors
- [ ] **Redocly Bundle**: `npm run bundle` generates openapi.yaml successfully
- [ ] **YAML Syntax**: All YAML files have valid syntax (no tabs, correct indentation)
- [ ] **$ref Resolution**: All $ref paths resolve correctly (no broken references)
- [ ] **Index Registration**: New paths registered in openapi-index.yaml with correct JSONPointer encoding (~1 for /)
- [ ] **No Tenant_id**: No manual tenant_id parameters in any endpoint
- [ ] **operationId Unique**: All operationId values are unique across the contract

### High Priority (Should Fix)

- [ ] **Django Consistency**: Field names match serializer fields exactly
- [ ] **Model Choices Match**: Enum values match Django model choices
- [ ] **Parameters Match Filters**: Query parameters match ViewSet filterset_fields
- [ ] **Required Fields**: Required schema fields match serializer required validation
- [ ] **HTTP Status Codes**: All endpoints have 200, 400, 401, 403, 500 (404 for detail endpoints)
- [ ] **Security Scheme**: All endpoints have `security: - jwtAuth: []`
- [ ] **Tags Assigned**: All endpoints have tags for organization

### Medium Priority (Nice to Have)

- [ ] **Examples Provided**: 200 responses include realistic examples
- [ ] **Descriptions Complete**: Summary and description fields are descriptive (not just "OK")
- [ ] **Schema Reuse**: Schemas use $ref instead of inline definitions
- [ ] **allOf for Extension**: Use allOf to extend base schemas (e.g., Detail extends ListItem)
- [ ] **maxLength Constraints**: String fields have maxLength matching model constraints
- [ ] **Format Specified**: Use format (uuid, date-time, email, uri) where applicable

---

## References

| File | Purpose | Lines |
|------|---------|-------|
| `binora-contract/contract/openapi-index.yaml` | Central index with all path references | 85 |
| `binora-contract/contract/assets.yaml` | Reference example (complete endpoint documentation) | 600 |
| `binora-contract/contract/hierarchy.yaml` | Reference example (nested schemas) | 800 |
| `binora-contract/contract/components/responses.yaml` | Reusable error responses | 70 |
| `binora-contract/package.json` | npm scripts (lint, bundle) | 10 |
| `binora-contract/redocly.yaml` | Redocly configuration and rules | 14 |
| `WORKFLOW_CONTRACT_IMPLEMENTATION_PLAN.md` | Complete workflow example (workflows contract) | 1652 |
| `apps/processes/serializers/workflow.py` | Serializer reference (field names, required fields) | Variable |
| `apps/processes/views/workflow.py` | ViewSet reference (operationId, actions, filters) | Variable |
| `apps/processes/models/workflow.py` | Model reference (choices, constraints) | Variable |

---

## Activation Criteria

**Keywords**: OpenAPI, contract, schema, endpoint, API spec, contrato, especificación, binora-contract, swagger, REST API, DRF endpoint, redocly, YAML, API documentation, OpenAPI 3.0

**Context triggers**:
- User mentions editing or creating OpenAPI contract
- User edits YAML files in binora-contract/ directory
- User implements new ViewSet or @action decorator in Django/DRF
- User modifies serializers and needs to update contract
- User asks about API documentation or contract validation
- User runs npm run lint or npm run bundle in binora-contract/

**Explicit invocation**: "Use openapi-contract-editor skill to guide me through updating the workflows contract"

---

## Workflow Integration

### Scenario 1: Adding New Endpoint

**User**: "I need to add a new endpoint POST /workflows/clone/"

**Skill Response**:
1. **Check Existing Implementation**:
   ```bash
   # Check if ViewSet action exists
   grep -A 10 "def clone\|@action.*clone" apps/processes/views/workflow.py
   ```

2. **Create OpenAPI Path**:
   - Open `binora-contract/contract/workflows.yaml`
   - Add path definition with complete documentation (operationId, summary, parameters, requestBody, responses, tags, security)

3. **Define Schemas**:
   - Create WorkflowCloneInput schema in components/schemas
   - Ensure response schema matches WorkflowDetail

4. **Register in Index**:
   - Add to `binora-contract/contract/openapi-index.yaml`:
     ```yaml
     /workflows/clone/:
       $ref: './workflows.yaml#/paths/~1workflows~1clone~1'
     ```

5. **Validate**:
   ```bash
   cd binora-contract
   npm run lint  # MUST pass
   npm run bundle  # MUST succeed
   ```

6. **Verify Consistency**:
   - Check WorkflowCloneInputSerializer fields match schema
   - Check operationId `workflow_clone` matches ViewSet action

---

### Scenario 2: Modifying Request/Response Schema

**User**: "I added a new field `priority` to Workflow model"

**Skill Response**:
1. **Check Serializer**:
   ```bash
   grep -A 20 "class WorkflowListSerializer\|class WorkflowDetailSerializer" apps/processes/serializers/workflow.py
   ```

2. **Update Schema**:
   - Open `binora-contract/contract/workflows.yaml`
   - Add `priority` field to WorkflowListItem and/or WorkflowDetail schema
   - Specify type, description, constraints (enum, minimum, maximum)

3. **Update Examples**:
   - Add `priority` to examples in 200 responses

4. **Validate**:
   ```bash
   cd binora-contract
   npm run lint
   npm run bundle
   ```

5. **Verify Model Constraints**:
   ```bash
   grep -A 5 "priority" apps/processes/models/workflow.py
   ```
   - Match field type, choices, max_length, default value

---

### Scenario 3: Adding Query Parameters

**User**: "I added filterset_fields = ['is_published', 'is_predefined'] to WorkflowViewSet"

**Skill Response**:
1. **Check ViewSet Filters**:
   ```bash
   grep -A 5 "filterset_fields\|filter_backends" apps/processes/views/workflow.py
   ```

2. **Add Parameters**:
   - Open `binora-contract/contract/workflows.yaml`
   - Add query parameters to GET /workflows/:
     ```yaml
     parameters:
       - name: is_published
         in: query
         required: false
         description: Filter by publication status
         schema:
           type: boolean
       - name: is_predefined
         in: query
         required: false
         description: Filter by predefined status
         schema:
           type: boolean
     ```

3. **Validate**:
   ```bash
   cd binora-contract
   npm run lint
   ```

---

### Scenario 4: Updating HTTP Status Codes

**User**: "I added validation that returns 409 Conflict if workflow name already exists"

**Skill Response**:
1. **Add 409 Response**:
   - Open `binora-contract/contract/workflows.yaml`
   - Add to POST /workflows/ responses:
     ```yaml
     '409':
       $ref: './components/responses.yaml#/responses/Conflict'
     ```

2. **Verify Conflict Response Exists**:
   - Check `binora-contract/contract/components/responses.yaml`
   - If missing, add Conflict response definition

3. **Update Examples** (Optional):
   - Add example for 409 response showing error format

4. **Validate**:
   ```bash
   cd binora-contract
   npm run lint
   ```

---

## Tools Integration

### Context7 MCP for Pattern Search

**Use Context7 to find OpenAPI patterns**:

```bash
# Find pagination schema patterns
@context7 openapi pagination schema examples

# Find $ref usage patterns
@context7 openapi $ref components schemas

# Find authentication patterns
@context7 openapi security jwt authentication

# Find parameter definitions
@context7 openapi query parameters filters
```

### Validation Commands

```bash
# Navigate to contract directory
cd binora-contract

# Redocly lint (validate syntax + OpenAPI spec)
npm run lint

# Redocly bundle (generate consolidated openapi.yaml)
npm run bundle

# Check generated bundle
ls -lh openapi.yaml

# Optionally: Open in Swagger UI for visual testing
# (requires local Swagger UI setup or use editor.swagger.io)
```

### Django Consistency Checks

```bash
# Check serializer fields
grep -A 20 "class.*Serializer" apps/processes/serializers/workflow.py

# Check ViewSet actions and filters
grep -A 10 "class.*ViewSet\|def.*\|@action" apps/processes/views/workflow.py

# Check model choices
grep -A 10 "class.*Choices" apps/processes/models/workflow.py

# Check model constraints
grep -A 5 "max_length=\|choices=\|default=" apps/processes/models/workflow.py
```

---

## Quick Tips

1. **Always start with Redocly validation**: Run `npm run lint` before and after editing
2. **Use $ref everywhere**: Avoid inline schemas, reuse with $ref
3. **Match serializer fields exactly**: Check serializer Meta.fields before defining schema
4. **Include all HTTP status codes**: 200, 400, 401, 403, 500 (+ 404 for detail endpoints)
5. **Provide realistic examples**: Help frontend developers understand response structure
6. **Validate Django consistency**: operationId matches ViewSet actions, enum matches model choices
7. **Use Context7 MCP**: Search for OpenAPI patterns instead of guessing
8. **NO manual tenant_id**: Multi-tenant middleware handles isolation automatically
9. **Encode paths correctly in openapi-index.yaml**: Use ~1 for / (e.g., ~1workflows~1 for /workflows/)
10. **Test bundle generation**: `npm run bundle` should generate openapi.yaml successfully

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
**Validation**: Redocly CLI + Django/DRF consistency + OpenAPI 3.0.3 compliance
