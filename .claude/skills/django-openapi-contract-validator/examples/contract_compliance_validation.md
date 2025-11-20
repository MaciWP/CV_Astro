# Contract Compliance Validation

Real example: UserViewSet matching OpenAPI contract

## Contract Specification

```yaml
# binora-contract/openapi.yaml
/api/users/:
  get:
    summary: List users
    responses:
      200:
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/UserOutput'
  post:
    summary: Create user
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UserInput'
    responses:
      201:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserOutput'
```

## Implementation Validation

### ✅ CORRECT Implementation

```python
# apps/core/views/user.py
class UserViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserInputSerializer  # Matches UserInput schema
        return UserOutputSerializer  # Matches UserOutput schema
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        output_serializer = UserOutputSerializer(user)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)  # ✅ 201
```

**Why correct:**
- POST returns 201 (contract specifies 201)
- Uses UserInputSerializer for input (matches UserInput schema)
- Uses UserOutputSerializer for output (matches UserOutput schema)
- Response structure matches contract

### ❌ VIOLATION: Wrong Status Code

```python
def create(self, request, *args, **kwargs):
    # ... validation ...
    return Response(output_serializer.data, status=status.HTTP_200_OK)  # ❌ Contract says 201
```

### ❌ VIOLATION: Schema Mismatch

```python
def create(self, request, *args, **kwargs):
    # Returns User model directly instead of UserOutputSerializer
    return Response(UserSerializer(user).data, status=201)  # ❌ Not UserOutput schema
```

## Validation Checklist

- [ ] Status codes match contract exactly
- [ ] Input serializer matches request schema
- [ ] Output serializer matches response schema  
- [ ] Required fields enforced
- [ ] Field types match (string, integer, boolean, etc.)

**Reference**: apps/core/views/user.py:23
