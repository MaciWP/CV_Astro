# Schema Validation Patterns

Ensuring DRF serializers match OpenAPI schemas

## Contract Schema Definition

```yaml
# binora-contract/openapi.yaml
components:
  schemas:
    UserInput:
      type: object
      required:
        - email
        - first_name
      properties:
        email:
          type: string
          format: email
        first_name:
          type: string
        last_name:
          type: string
        phone:
          type: string
          nullable: true
```

## Matching Serializer

### ✅ CORRECT Implementation

```python
# apps/core/serializers/user.py
class UserInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone']  # ✅ Exact match
        extra_kwargs = {
            'email': {'required': True},  # ✅ Contract says required
            'first_name': {'required': True},  # ✅ Contract says required
            'last_name': {'required': False},  # ✅ Optional in contract
            'phone': {'required': False, 'allow_null': True},  # ✅ Nullable in contract
        }
```

**Validation:**
- Fields match schema exactly: email, first_name, last_name, phone
- Required fields enforced: email, first_name
- Optional fields allowed: last_name, phone
- Nullable fields configured: phone

### ❌ VIOLATION: Missing Required Field

```python
class UserInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']  # ❌ Missing phone from schema
```

### ❌ VIOLATION: Extra Field Not in Contract

```python
class UserInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone', 'role']  # ❌ role not in contract
```

### ❌ VIOLATION: Wrong Required Constraint

```python
class UserInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone']
        extra_kwargs = {
            'email': {'required': False},  # ❌ Contract says required
        }
```

## Type Validation

```yaml
# Contract
properties:
  age:
    type: integer
  is_active:
    type: boolean
  created_at:
    type: string
    format: date-time
```

```python
# ✅ CORRECT Serializer
class UserOutputSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField()  # ✅ integer in contract
    is_active = serializers.BooleanField()  # ✅ boolean in contract
    created_at = serializers.DateTimeField()  # ✅ date-time in contract
```

## Validation Script

```python
# Check schema match
from apps.core.serializers.user import UserInputSerializer
import yaml

with open('binora-contract/openapi.yaml') as f:
    spec = yaml.safe_load(f)

schema = spec['components']['schemas']['UserInput']
contract_fields = set(schema['properties'].keys())
serializer_fields = set(UserInputSerializer().fields.keys())

assert contract_fields == serializer_fields, f"Mismatch: {contract_fields ^ serializer_fields}"
```

**Reference**: apps/core/serializers/user.py
