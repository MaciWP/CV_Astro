# Django Model Template (Multi-Tenant Aware)

**Purpose**: Generate Django models with proper fields, indexes, multi-tenant awareness following Binora Backend patterns.

**Usage**: Replace {{slots}} with actual values for your implementation.

---

## Model Template

```python
# apps/{{app_name}}/models/{{model_name_lower}}.py
from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator
from typing import TYPE_CHECKING

{{#is_multi_tenant}}
from apps.core.models import TenantAwareModel
{{/is_multi_tenant}}
{{#related_models}}
from apps.{{related_app}}.models import {{RelatedModel}}
{{/related_models}}

if TYPE_CHECKING:
    from apps.core.models import User


class {{ModelName}}({{#is_multi_tenant}}TenantAwareModel{{/is_multi_tenant}}{{^is_multi_tenant}}models.Model{{/is_multi_tenant}}):
    """
    {{model_description}}

    {{#is_multi_tenant}}
    Multi-tenant: Automatically filtered by company via middleware.
    {{/is_multi_tenant}}
    """
    {{#fields}}
    {{field_name}} = models.{{field_type}}(
        {{#field_options}}
        {{option_name}}={{option_value}},
        {{/field_options}}
    )
    {{/fields}}

    {{#timestamp_fields}}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    {{/timestamp_fields}}

    {{#audit_fields}}
    created_by = models.ForeignKey(
        'core.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='{{model_name_lower}}_created',
    )
    updated_by = models.ForeignKey(
        'core.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='{{model_name_lower}}_updated',
    )
    {{/audit_fields}}

    class Meta:
        db_table = '{{db_table_name}}'
        verbose_name = '{{verbose_name}}'
        verbose_name_plural = '{{verbose_name_plural}}'
        ordering = ['{{default_ordering}}']
        {{#has_indexes}}
        indexes = [
            {{#indexes}}
            models.Index(fields={{fields}}, name='{{index_name}}'),
            {{/indexes}}
        ]
        {{/has_indexes}}
        {{#has_constraints}}
        constraints = [
            {{#constraints}}
            models.{{constraint_type}}({{constraint_definition}}),
            {{/constraints}}
        ]
        {{/has_constraints}}

    def __str__(self) -> str:
        """String representation of {{ModelName}}."""
        return {{str_representation}}

    {{#custom_methods}}
    def {{method_name}}(self{{#method_params}}, {{param_name}}: {{param_type}}{{/method_params}}) -> {{return_type}}:
        """
        {{method_description}}

        Args:
            {{#method_params}}
            {{param_name}}: {{param_description}}
            {{/method_params}}

        Returns:
            {{return_description}}
        """
        {{method_implementation}}
    {{/custom_methods}}
```

---

## Slot Definitions

### General Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{app_name}}` | Django app name | `assets`, `core`, `hierarchy` |
| `{{model_name_lower}}` | Model name lowercase | `asset`, `user`, `team` |
| `{{ModelName}}` | Model class name | `Asset`, `User`, `Team` |
| `{{model_description}}` | Model purpose | `Represents a physical asset in the system` |
| `{{is_multi_tenant}}` | Multi-tenant model? | `True`/`False` |
| `{{db_table_name}}` | Database table name | `assets`, `users`, `teams` |
| `{{verbose_name}}` | Human-readable name | `Asset`, `User` |
| `{{verbose_name_plural}}` | Plural name | `Assets`, `Users` |
| `{{default_ordering}}` | Default ordering | `-created_at`, `name` |
| `{{str_representation}}` | __str__ return value | `self.name`, `f"{self.name} ({self.serial_number})"` |

### Field Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{field_name}}` | Field name | `name`, `email`, `status` |
| `{{field_type}}` | Django field type | `CharField`, `EmailField`, `IntegerField` |
| `{{field_options}}` | Field options | `max_length=100`, `db_index=True`, `null=True` |

Common field types:
- `CharField` - Text with max_length
- `TextField` - Long text
- `EmailField` - Email validation
- `IntegerField` - Integer
- `DecimalField` - Decimal (max_digits, decimal_places)
- `BooleanField` - True/False
- `DateTimeField` - Datetime
- `DateField` - Date only
- `FileField` - File upload
- `ForeignKey` - Relation to another model
- `ManyToManyField` - Many-to-many relation
- `JSONField` - JSON data

### Index Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{fields}}` | Fields in index | `['company', 'status']`, `['email']` |
| `{{index_name}}` | Index name | `asset_company_status_idx`, `user_email_idx` |

**Multi-tenant index pattern**: Always include tenant_id first!
```python
indexes = [
    models.Index(fields=['tenant_id', 'status'], name='asset_tenant_status_idx'),
    models.Index(fields=['tenant_id', '-created_at'], name='asset_tenant_date_idx'),
]
```

### Constraint Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{constraint_type}}` | Constraint type | `UniqueConstraint`, `CheckConstraint` |
| `{{constraint_definition}}` | Constraint definition | See examples below |

---

## Complete Example Usage

**Input values**:
- `{{app_name}}` = `assets`
- `{{model_name_lower}}` = `asset`
- `{{ModelName}}` = `Asset`
- `{{model_description}}` = `Represents a physical asset in the system`
- `{{is_multi_tenant}}` = `True`
- `{{db_table_name}}` = `assets`
- Fields:
  - `name: CharField(max_length=100, db_index=True)`
  - `serial_number: CharField(max_length=50, unique=True)`
  - `status: CharField(max_length=20, choices=[...])`
- Indexes: `['tenant_id', 'status']`, `['tenant_id', '-created_at']`

**Generated code**:
```python
# apps/assets/models/asset.py
from django.db import models
from django.core.validators import MinLengthValidator
from typing import TYPE_CHECKING

from apps.core.models import TenantAwareModel
from apps.core.models import Company

if TYPE_CHECKING:
    from apps.core.models import User


class Asset(TenantAwareModel):
    """
    Represents a physical asset in the system.

    Multi-tenant: Automatically filtered by company via middleware.
    """
    name = models.CharField(
        max_length=100,
        db_index=True,
        validators=[MinLengthValidator(3)],
    )
    serial_number = models.CharField(
        max_length=50,
        unique=True,
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('maintenance', 'Maintenance'),
        ],
        default='active',
        db_index=True,
    )
    description = models.TextField(
        blank=True,
        default='',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        'core.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='asset_created',
    )
    updated_by = models.ForeignKey(
        'core.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='asset_updated',
    )

    class Meta:
        db_table = 'assets'
        verbose_name = 'Asset'
        verbose_name_plural = 'Assets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['tenant_id', 'status'], name='asset_tenant_status_idx'),
            models.Index(fields=['tenant_id', '-created_at'], name='asset_tenant_date_idx'),
            models.Index(fields=['serial_number'], name='asset_serial_idx'),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['tenant_id', 'serial_number'],
                name='asset_unique_serial_per_tenant'
            ),
        ]

    def __str__(self) -> str:
        """String representation of Asset."""
        return f"{self.name} ({self.serial_number})"

    def is_available(self) -> bool:
        """
        Check if asset is available for assignment.

        Returns:
            True if asset status is 'active', False otherwise
        """
        return self.status == 'active'
```

---

## Common Field Patterns

### CharField with Validation
```python
name = models.CharField(
    max_length=100,
    db_index=True,
    validators=[MinLengthValidator(3)],
)
```

### Email Field
```python
email = models.EmailField(
    max_length=254,
    unique=True,
    db_index=True,
)
```

### Choice Field
```python
status = models.CharField(
    max_length=20,
    choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ],
    default='active',
    db_index=True,
)
```

### Decimal Field (Currency)
```python
price = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=0.00,
)
```

### ForeignKey
```python
company = models.ForeignKey(
    'core.Company',
    on_delete=models.CASCADE,
    related_name='assets',
)
```

### ForeignKey with Null
```python
assigned_to = models.ForeignKey(
    'core.User',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='assigned_assets',
)
```

### ManyToMany Field
```python
tags = models.ManyToManyField(
    'core.Tag',
    related_name='assets',
    blank=True,
)
```

### File Field
```python
document = models.FileField(
    upload_to='assets/documents/%Y/%m/',
    null=True,
    blank=True,
)
```

### JSON Field
```python
metadata = models.JSONField(
    default=dict,
    blank=True,
)
```

---

## Common Index Patterns

### Single Field Index
```python
indexes = [
    models.Index(fields=['email'], name='user_email_idx'),
]
```

### Compound Index (Multi-tenant)
```python
indexes = [
    models.Index(fields=['tenant_id', 'status'], name='asset_tenant_status_idx'),
    models.Index(fields=['tenant_id', '-created_at'], name='asset_tenant_date_idx'),
]
```

### Partial Index (PostgreSQL)
```python
indexes = [
    models.Index(
        fields=['email'],
        name='user_active_email_idx',
        condition=models.Q(is_active=True),
    ),
]
```

---

## Common Constraint Patterns

### Unique Constraint
```python
constraints = [
    models.UniqueConstraint(
        fields=['email'],
        name='user_unique_email'
    ),
]
```

### Unique Constraint (Multi-tenant)
```python
constraints = [
    models.UniqueConstraint(
        fields=['tenant_id', 'serial_number'],
        name='asset_unique_serial_per_tenant'
    ),
]
```

### Check Constraint
```python
constraints = [
    models.CheckConstraint(
        check=models.Q(price__gte=0),
        name='asset_price_non_negative'
    ),
]
```

### Conditional Unique Constraint
```python
constraints = [
    models.UniqueConstraint(
        fields=['email'],
        condition=models.Q(is_active=True),
        name='user_unique_active_email'
    ),
]
```

---

## Common Custom Methods

### Boolean Check Method
```python
def is_available(self) -> bool:
    """Check if asset is available."""
    return self.status == 'active' and self.assigned_to is None
```

### Property Method
```python
@property
def full_name(self) -> str:
    """Get full name combining first and last name."""
    return f"{self.first_name} {self.last_name}"
```

### Calculation Method
```python
def calculate_total_price(self) -> Decimal:
    """Calculate total price including tax."""
    return self.price * Decimal('1.21')  # 21% tax
```

---

## Validation Checklist

After generating model from this template, verify:

- [ ] Multi-tenant models inherit from TenantAwareModel?
- [ ] NO manual tenant_id field (TenantAwareModel provides it)?
- [ ] Frequently filtered fields have db_index=True?
- [ ] Compound indexes include tenant_id first (if multi-tenant)?
- [ ] Unique constraints include tenant_id (if multi-tenant)?
- [ ] ForeignKey has proper on_delete behavior?
- [ ] ForeignKey has related_name for reverse access?
- [ ] CharField has max_length?
- [ ] DecimalField has max_digits and decimal_places?
- [ ] FileField has upload_to?
- [ ] Timestamp fields (created_at, updated_at) present?
- [ ] Audit fields (created_by, updated_by) present if needed?
- [ ] __str__ method returns meaningful string?
- [ ] Meta.ordering set for consistent queries?
- [ ] Type hints on custom methods?

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Pattern**: Multi-tenant aware, proper indexes, type hints, audit fields