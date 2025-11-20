# Check Contract

Validate Django REST Framework endpoints match OpenAPI specification in binora-contract submodule.

## Usage

```
/check-contract [app]
```

**Examples:**
```
/check-contract assets
/check-contract core
/check-contract .
```

## What It Checks

Verifies implementation matches `binora-contract/openapi.yaml` specification.

### Validation Rules

1. **Endpoint exists in contract**
   - All @action decorators have OpenAPI definition
   - URL patterns match specification

2. **Request schema matches**
   - Input serializer fields match contract
   - Required fields validated
   - Data types correct

3. **Response schema matches**
   - Output serializer fields match contract
   - No extra fields returned
   - Proper nested structures

4. **Status codes match**
   - 200, 201, 204, 400, 404 as specified
   - Error responses documented

5. **Authentication/permissions**
   - Security schemes implemented
   - Permission classes match contract

## Process

1. **Load contract**
   ```bash
   cat binora-contract/openapi.yaml
   ```

2. **Scan implementation**
   - Parse ViewSets in app/views/
   - Extract serializers from app/serializers/
   - Check status codes in responses

3. **Compare schemas**
   - Match endpoint paths
   - Validate request/response fields
   - Check data types

4. **Report violations**

## Output Format

### Pass

```
✅ CONTRACT COMPLIANCE - PASS

App: assets
Endpoints checked: 8
Violations: 0

All endpoints match OpenAPI specification.
Contract version: 1.2.0
Last updated: 2025-01-10
```

### Fail

```
❌ CONTRACT COMPLIANCE - FAIL

App: assets
Endpoints checked: 8
Violations: 3

VIOLATIONS:

1. POST /api/assets/ - Response schema mismatch
   Location: apps/assets/serializers/asset.py:45
   
   Contract expects:
     {
       "id": int,
       "name": string,
       "asset_type": string,
       "status": string
     }
   
   Serializer returns:
     {
       "id": int,
       "name": string,
       "asset_type": string,
       "status": string,
       "internal_notes": string  ❌ NOT IN CONTRACT
     }
   
   FIX: Remove 'internal_notes' from AssetOutputSerializer
   OR: Add to contract if intentional

2. GET /api/assets/{id}/history/ - Endpoint not in contract
   Location: apps/assets/views/assets.py:78
   
   @action(detail=True, methods=['get'])
   def history(self, request, pk=None):  ❌ NOT IN CONTRACT
   
   FIX: Add endpoint to binora-contract/openapi.yaml first
   OR: Remove if not needed

3. POST /api/assets/ - Wrong status code
   Location: apps/assets/views/assets.py:45
   
   Contract specifies: 201 Created
   View returns: 200 OK  ❌ MISMATCH
   
   FIX: Change to status.HTTP_201_CREATED

Total violations: 3
Contract version: 1.2.0
```

## Contract Structure

```yaml
# binora-contract/openapi.yaml

/api/assets/:
  get:
    summary: List assets
    responses:
      200:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Asset'
  
  post:
    summary: Create asset
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AssetInput'
    responses:
      201:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Asset'

components:
  schemas:
    Asset:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        asset_type:
          type: string
        status:
          type: string
```

## Common Violations

### 1. Extra fields in response

```python
# ❌ VIOLATION
class AssetOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['id', 'name', 'internal_id']  # internal_id not in contract

# ✅ FIX
class AssetOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['id', 'name']  # Match contract exactly
```

### 2. Missing required field

```python
# ❌ VIOLATION
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    # Missing 'asset_type' required by contract

# ✅ FIX
class AssetInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    asset_type = serializers.CharField(required=True)
```

### 3. Wrong data type

```python
# ❌ VIOLATION - Contract says integer
rack_id = serializers.CharField()

# ✅ FIX
rack_id = serializers.IntegerField()
```

### 4. Endpoint not in contract

```python
# ❌ VIOLATION
@action(detail=True, methods=['post'])
def mark_favorite(self, request, pk=None):
    # /api/assets/{id}/mark_favorite/ NOT in contract
    pass

# ✅ FIX: Add to contract first, then implement
```

## Contract Update Process

**When contract changes**:

1. Update `binora-contract/openapi.yaml`
2. Regenerate frontend permissions:
   ```bash
   nox -s frontend_permissions_update
   ```
3. Update serializers to match
4. Run `/check-contract` to verify
5. Update tests

## Related Tools

- `contract-compliance-validator` - Full agent version
- `/quick-audit` - Includes basic contract check
- `openapi-contract-validator` - Skill (auto-activates)
- `.claude/skills/openapi-contract-validator/` - Detailed rules

## When to Use

- **Before PR**: Ensure compliance
- **After contract update**: Verify implementation
- **During API development**: Continuous validation
- **Frontend integration**: Avoid breaking changes

## Contract Location

```
binora-backend/
├── binora-contract/
│   ├── openapi.yaml       ← Source of truth
│   └── README.md
└── apps/
    └── */
        ├── views/         ← Implementation
        └── serializers/   ← Schemas
```

## Time Estimate

~1-2 minutes per app

## Exit Codes

- 0: Pass (compliant)
- 1: Fail (violations found)
