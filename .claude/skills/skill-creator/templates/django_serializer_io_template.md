# Django REST Framework Input/Output Serializer Template

**Purpose**: Generate DRF serializers with Input/Output separation following Binora Backend patterns.

**Usage**: Replace {{slots}} with actual values for your implementation.

---

## Input Serializer Template

```python
# apps/{{app_name}}/serializers/{{model_name_lower}}.py
from rest_framework import serializers
from typing import Any, Dict

from apps.{{app_name}}.models import {{ModelName}}
{{#related_models}}
from apps.{{related_app}}.models import {{RelatedModel}}
{{/related_models}}


class {{InputSerializer}}(serializers.Serializer):
    """
    Input serializer for creating/updating {{ModelName}}.

    Validation only, NO create/update methods (handled by service layer).
    """
    {{#input_fields}}
    {{field_name}} = serializers.{{field_type}}(
        {{#field_options}}
        {{option_name}}={{option_value}},
        {{/field_options}}
    )
    {{/input_fields}}

    {{#validate_fields}}
    def validate_{{field_name}}(self, value: {{field_type_hint}}) -> {{field_type_hint}}:
        """
        {{validation_description}}

        Args:
            value: {{field_description}}

        Returns:
            Validated and potentially transformed value

        Raises:
            serializers.ValidationError: If validation fails
        """
        {{#validation_conditions}}
        if {{condition}}:
            raise serializers.ValidationError("{{error_message}}")
        {{/validation_conditions}}

        {{#transformations}}
        # {{transformation_description}}
        value = {{transformation_code}}
        {{/transformations}}

        return value
    {{/validate_fields}}

    {{#has_cross_field_validation}}
    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Cross-field validation (relationships between fields).

        Args:
            data: All validated field data

        Returns:
            Validated data

        Raises:
            serializers.ValidationError: If cross-field validation fails
        """
        {{#cross_field_validations}}
        # {{validation_description}}
        if {{condition}}:
            raise serializers.ValidationError({
                '{{field_name}}': "{{error_message}}"
            })
        {{/cross_field_validations}}

        return data
    {{/has_cross_field_validation}}
```

---

## Output Serializer Template

```python
class {{OutputSerializer}}(serializers.ModelSerializer):
    """
    Output serializer for reading {{ModelName}}.

    Optimized for queries with related data.
    """
    {{#custom_output_fields}}
    {{field_name}} = serializers.{{field_type}}(
        source='{{source_path}}',
        read_only=True
    )
    {{/custom_output_fields}}

    {{#nested_serializers}}
    {{field_name}} = {{NestedSerializer}}(read_only=True)
    {{/nested_serializers}}

    class Meta:
        model = {{ModelName}}
        fields = [
            {{#output_fields}}
            '{{field_name}}',
            {{/output_fields}}
        ]
        read_only_fields = fields  # ALL fields read-only for output
```

---

## Update Serializer Template (Optional)

```python
class {{UpdateSerializer}}(serializers.Serializer):
    """
    Update serializer for {{ModelName}} (optional partial updates).

    Similar to Input but all fields optional.
    """
    {{#update_fields}}
    {{field_name}} = serializers.{{field_type}}(
        required=False,  # All fields optional for partial updates
        {{#field_options}}
        {{option_name}}={{option_value}},
        {{/field_options}}
    )
    {{/update_fields}}

    # Reuse validate_<field> methods from InputSerializer if needed
    {{#validate_fields}}
    def validate_{{field_name}}(self, value: {{field_type_hint}}) -> {{field_type_hint}}:
        """{{validation_description}}"""
        # Same validation as InputSerializer
        {{validation_code}}
        return value
    {{/validate_fields}}
```

---

## Slot Definitions

### General Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{app_name}}` | Django app name | `assets`, `core` |
| `{{model_name_lower}}` | Model name lowercase | `asset`, `user` |
| `{{ModelName}}` | Model class name | `Asset`, `User` |
| `{{InputSerializer}}` | Input serializer name | `AssetInputSerializer` |
| `{{OutputSerializer}}` | Output serializer name | `AssetOutputSerializer` |
| `{{UpdateSerializer}}` | Update serializer name | `AssetUpdateSerializer` |

### Input Field Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{field_name}}` | Field name | `email`, `name`, `status` |
| `{{field_type}}` | Serializer field type | `EmailField`, `CharField`, `IntegerField` |
| `{{field_options}}` | Field options | `required=True`, `max_length=100`, `write_only=True` |

Common field types:
- `CharField` - Text fields
- `EmailField` - Email validation
- `IntegerField` - Integer numbers
- `DecimalField` - Decimal numbers
- `BooleanField` - True/False
- `DateTimeField` - Datetime
- `ChoiceField` - Enumeration
- `FileField` - File uploads
- `PrimaryKeyRelatedField` - ForeignKey (ID)
- `SlugRelatedField` - ForeignKey (slug)

### Validation Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{field_name}}` | Field being validated | `email`, `serial_number` |
| `{{field_type_hint}}` | Type hint for value | `str`, `int`, `bool` |
| `{{validation_description}}` | What is validated | `Ensure email is unique` |
| `{{field_description}}` | Field description | `User email address` |
| `{{condition}}` | Validation condition | `User.objects.filter(email=value).exists()` |
| `{{error_message}}` | Error message | `Email already exists` |

### Transformation Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{transformation_description}}` | What transformation does | `Normalize to lowercase` |
| `{{transformation_code}}` | Transformation code | `value.lower().strip()` |

### Output Field Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{field_name}}` | Output field name | `company_name`, `created_by_email` |
| `{{field_type}}` | Serializer field type | `CharField`, `IntegerField` |
| `{{source_path}}` | Source path (dot notation) | `company.name`, `created_by.email` |
| `{{NestedSerializer}}` | Nested serializer class | `CompanyOutputSerializer` |

---

## Complete Example Usage

**Input values**:
- `{{app_name}}` = `assets`
- `{{model_name_lower}}` = `asset`
- `{{ModelName}}` = `Asset`
- `{{InputSerializer}}` = `AssetInputSerializer`
- `{{OutputSerializer}}` = `AssetOutputSerializer`
- Input fields:
  - `name: CharField(max_length=100, required=True)`
  - `serial_number: CharField(max_length=50, required=True)`
  - `status: ChoiceField(choices=['active', 'inactive'])`
- Validation: `serial_number` uniqueness
- Output fields: `id`, `name`, `serial_number`, `status`, `company_name`, `created_at`

**Generated code**:
```python
# apps/assets/serializers/asset.py
from rest_framework import serializers
from typing import Any, Dict

from apps.assets.models import Asset
from apps.core.models import Company, User


class AssetInputSerializer(serializers.Serializer):
    """
    Input serializer for creating/updating Asset.

    Validation only, NO create/update methods (handled by service layer).
    """
    name = serializers.CharField(
        max_length=100,
        required=True,
    )
    serial_number = serializers.CharField(
        max_length=50,
        required=True,
    )
    status = serializers.ChoiceField(
        choices=['active', 'inactive'],
        required=True,
    )

    def validate_name(self, value: str) -> str:
        """
        Ensure name is at least 3 characters.

        Args:
            value: Asset name

        Returns:
            Validated and trimmed name

        Raises:
            serializers.ValidationError: If name too short
        """
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters")

        # Normalize whitespace
        value = value.strip()

        return value

    def validate_serial_number(self, value: str) -> str:
        """
        Ensure serial number is unique and alphanumeric.

        Args:
            value: Asset serial number

        Returns:
            Validated and normalized serial number

        Raises:
            serializers.ValidationError: If validation fails
        """
        if not value.isalnum():
            raise serializers.ValidationError("Serial number must be alphanumeric")

        if Asset.objects.filter(serial_number=value).exists():
            raise serializers.ValidationError("Serial number already exists")

        # Normalize to uppercase
        value = value.upper()

        return value


class AssetOutputSerializer(serializers.ModelSerializer):
    """
    Output serializer for reading Asset.

    Optimized for queries with related data.
    """
    company_name = serializers.CharField(
        source='company.name',
        read_only=True
    )
    created_by_email = serializers.EmailField(
        source='created_by.email',
        read_only=True
    )

    class Meta:
        model = Asset
        fields = [
            'id',
            'name',
            'serial_number',
            'status',
            'company_name',
            'created_by_email',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields  # ALL fields read-only for output


class AssetUpdateSerializer(serializers.Serializer):
    """
    Update serializer for Asset (optional partial updates).

    Similar to Input but all fields optional.
    """
    name = serializers.CharField(
        required=False,
        max_length=100,
    )
    serial_number = serializers.CharField(
        required=False,
        max_length=50,
    )
    status = serializers.ChoiceField(
        required=False,
        choices=['active', 'inactive'],
    )

    def validate_name(self, value: str) -> str:
        """Ensure name is at least 3 characters."""
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters")
        return value.strip()

    def validate_serial_number(self, value: str) -> str:
        """Ensure serial number is alphanumeric."""
        if not value.isalnum():
            raise serializers.ValidationError("Serial number must be alphanumeric")
        return value.upper()
```

---

## Common Validation Patterns

### Email Uniqueness
```python
def validate_email(self, value: str) -> str:
    """Ensure email is unique."""
    if User.objects.filter(email=value).exists():
        raise serializers.ValidationError("Email already exists")
    return value.lower()
```

### Password Complexity
```python
def validate_password(self, value: str) -> str:
    """Ensure password meets complexity requirements."""
    if len(value) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters")
    if not any(char.isdigit() for char in value):
        raise serializers.ValidationError("Password must contain at least one digit")
    if not any(char.isupper() for char in value):
        raise serializers.ValidationError("Password must contain uppercase letter")
    return value
```

### File Extension Validation
```python
def validate_document(self, value) -> Any:
    """Ensure file has allowed extension."""
    allowed_extensions = ['.pdf', '.doc', '.docx']
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in allowed_extensions:
        raise serializers.ValidationError(f"File type not allowed. Allowed: {allowed_extensions}")
    return value
```

### Cross-Field Validation
```python
def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate start_date before end_date."""
    if data.get('start_date') and data.get('end_date'):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError({
                'end_date': "End date must be after start date"
            })
    return data
```

---

## Validation Checklist

After generating code from this template, verify:

- [ ] Input serializer uses Serializer (not ModelSerializer)?
- [ ] Output serializer uses ModelSerializer with read_only_fields=fields?
- [ ] NO create/update methods in serializers (handled by service)?
- [ ] Field-level validation uses validate_<field> methods?
- [ ] Cross-field validation in validate() method only?
- [ ] Type hints on all validate_<field> methods?
- [ ] Sensitive fields (password) have write_only=True?
- [ ] Output serializer has NO sensitive fields?
- [ ] Custom output fields use source= parameter?
- [ ] Nested serializers marked read_only=True?

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Pattern**: Input/Output separation, field-level validation, NO business logic in serializers
