# Authentication & Authorization Validation

Ensuring endpoints enforce authentication as per contract

## Contract Authentication Specification

```yaml
# binora-contract/openapi.yaml
/api/users/:
  get:
    summary: List users
    security:
      - bearerAuth: []  # Requires authentication
    responses:
      200:
        description: Success
      401:
        description: Unauthorized

/api/auth/login/:
  post:
    summary: Login
    security: []  # NO authentication required
    responses:
      200:
        description: Success
```

## Implementation Validation

### ✅ CORRECT: Protected Endpoint

```python
# apps/core/views/user.py
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # ✅ Contract requires bearerAuth
    
    def list(self, request):
        # User must be authenticated
        users = User.objects.all()
        return Response(UserOutputSerializer(users, many=True).data)
```

### ✅ CORRECT: Public Endpoint

```python
# apps/core/views/auth.py
from rest_framework.permissions import AllowAny

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # ✅ Contract has security: []
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        # No authentication required
        return Response({"token": "..."})
```

### ❌ VIOLATION: Missing Authentication

```python
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # ❌ Contract requires bearerAuth
```

### ❌ VIOLATION: Unauthorized Response Not Handled

```python
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    # ✅ Authentication enforced
    # ❌ But contract expects 401 response documented
    # DRF handles this automatically, but should be in OpenAPI spec
```

## Authorization (Permissions)

```yaml
# Contract with role-based access
/api/users/{id}/:
  delete:
    security:
      - bearerAuth: []
    description: Only superusers can delete
    responses:
      204:
        description: Deleted
      403:
        description: Forbidden
```

```python
# ✅ CORRECT Implementation
from rest_framework.permissions import IsAdminUser

class UserViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action == 'destroy':
            return [IsAuthenticated(), IsAdminUser()]  # ✅ Only superusers
        return [IsAuthenticated()]
    
    def destroy(self, request, pk=None):
        # Returns 204 on success, 403 if not admin (handled by DRF)
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  # ✅ 204 per contract
```

## Common Patterns

**Authentication Required:**
```python
permission_classes = [IsAuthenticated]
```

**Public Endpoint:**
```python
permission_classes = [AllowAny]
```

**Role-Based:**
```python
permission_classes = [IsAuthenticated, IsAdminUser]
```

**Custom Permission:**
```python
from apps.core.permissions import IsSuperuserOrOwner
permission_classes = [IsAuthenticated, IsSuperuserOrOwner]
```

**Reference**: apps/core/views/user.py:23, apps/core/views/auth.py:36
