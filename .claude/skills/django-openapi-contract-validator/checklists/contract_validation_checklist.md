# Contract Validation Checklist

Quick validation before committing API changes

## Level 1: Quick Check (30 seconds)

```bash
# Check contract exists
ls binora-contract/openapi.yaml

# Validate YAML syntax
python -c "import yaml; yaml.safe_load(open('binora-contract/openapi.yaml'))"

# Check recent changes
git diff binora-contract/openapi.yaml
```

## Level 2: Endpoint Validation (2 minutes)

```bash
# List all endpoints in contract
grep -E "^\s{2}/api" binora-contract/openapi.yaml

# Check ViewSet routing
grep -r "router.register" apps/*/urls.py
```

### Manual Checks

- [ ] All contract endpoints have corresponding ViewSets
- [ ] All ViewSets have corresponding contract endpoints
- [ ] URL paths match exactly (`/api/users/` vs `/api/users`)
- [ ] HTTP methods match (GET, POST, PUT, PATCH, DELETE)

## Level 3: Schema Validation (5 minutes)

```python
# Check schema compliance
from apps.core.serializers.user import UserInputSerializer, UserOutputSerializer
import yaml

with open('binora-contract/openapi.yaml') as f:
    spec = yaml.safe_load(f)

# UserInput schema
input_schema = spec['components']['schemas']['UserInput']
input_fields = set(input_schema['properties'].keys())
serializer_fields = set(UserInputSerializer().fields.keys())

print(f"Contract fields: {input_fields}")
print(f"Serializer fields: {serializer_fields}")
print(f"Missing in serializer: {input_fields - serializer_fields}")
print(f"Extra in serializer: {serializer_fields - input_fields}")
```

### Manual Schema Checks

- [ ] Field names match exactly
- [ ] Field types match (string, integer, boolean, etc.)
- [ ] Required fields enforced
- [ ] Nullable fields configured (`allow_null=True`)
- [ ] Format constraints applied (email, date-time, etc.)

## Level 4: Status Code Validation (3 minutes)

```bash
# Find all Response() calls
grep -rn "Response(" apps/*/views/*.py | grep status

# Find all status codes used
grep -rn "HTTP_[0-9]" apps/*/views/*.py
```

### Manual Status Code Checks

- [ ] Success responses match contract (200, 201, 204)
- [ ] Error responses match contract (400, 401, 403, 404, 500)
- [ ] NO custom status codes without contract update
- [ ] Validation errors return 400
- [ ] Authentication errors return 401
- [ ] Permission errors return 403

## Level 5: Authentication Validation (2 minutes)

```bash
# Check permission classes
grep -rn "permission_classes" apps/*/views/*.py
```

### Manual Authentication Checks

- [ ] Endpoints with `security: []` use `AllowAny`
- [ ] Endpoints with `bearerAuth` use `IsAuthenticated`
- [ ] Role-based endpoints use appropriate permissions
- [ ] Public endpoints explicitly set `AllowAny`

## Level 6: Full Validation (Use Agent)

```bash
# Run contract compliance validator agent
/check-contract [app_name]
```

Agent validates:
- Endpoint existence and routing
- Request/response schema compliance
- Status code correctness
- Authentication requirements
- Parameter definitions

## Common Issues

**Schema Mismatch**:
```python
# ❌ Contract has 'email', serializer has 'user_email'
fields = ['user_email']  # Wrong

# ✅ Match exactly
fields = ['email']  # Correct
```

**Wrong Status Code**:
```python
# ❌ Contract says 201 for POST
return Response(data, status=200)

# ✅ Match contract
return Response(data, status=201)
```

**Missing Authentication**:
```python
# ❌ Contract requires bearerAuth
permission_classes = [AllowAny]

# ✅ Enforce auth
permission_classes = [IsAuthenticated]
```

## Pre-Commit Checklist

Before committing API changes:

- [ ] Contract updated if adding/modifying endpoints
- [ ] Serializers match contract schemas
- [ ] Status codes match contract
- [ ] Authentication enforced per contract
- [ ] Tests validate contract compliance
- [ ] `/check-contract` passes for affected app

**Reference**: Use `/check-contract [app]` command
