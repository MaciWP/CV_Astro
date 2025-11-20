# Django Service Layer Template

**Purpose**: Generate Django service classes with business logic following Binora Backend patterns (stateless, static methods, type hints, dependency injection).

**Usage**: Replace {{slots}} with actual values for your implementation.

---

## Template Code

```python
# apps/{{app_name}}/services.py
from typing import Optional, List, Dict, Any
from django.db.models import QuerySet
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError

from apps.{{app_name}}.models import {{ModelName}}
{{#related_models}}
from apps.{{related_app}}.models import {{RelatedModel}}
{{/related_models}}
{{#related_services}}
from apps.{{related_app}}.services import {{RelatedService}}
{{/related_services}}


class {{ServiceName}}:
    """
    Service layer for {{ModelName}} business logic.

    All methods are stateless @staticmethod for dependency injection.
    """

    @staticmethod
    def get_by_id({{model_name_lower}}_id: int) -> {{ModelName}}:
        """
        Get {{model_name_lower}} by ID with optimized query.

        Args:
            {{model_name_lower}}_id: Primary key of {{model_name_lower}}

        Returns:
            {{ModelName}} instance

        Raises:
            {{ModelName}}.DoesNotExist: If {{model_name_lower}} not found
        """
        return {{ModelName}}.objects.select_related(
            {{#select_related_fields}}
            '{{field_name}}',
            {{/select_related_fields}}
        ).get(id={{model_name_lower}}_id)

    @staticmethod
    def get_all(
        {{#filter_params}}
        {{param_name}}: Optional[{{param_type}}] = None,
        {{/filter_params}}
    ) -> QuerySet[{{ModelName}}]:
        """
        Get all {{model_name_plural}} with optional filters.

        Args:
            {{#filter_params}}
            {{param_name}}: Filter by {{param_description}}
            {{/filter_params}}

        Returns:
            QuerySet of {{ModelName}} instances
        """
        queryset = {{ModelName}}.objects.select_related(
            {{#select_related_fields}}
            '{{field_name}}',
            {{/select_related_fields}}
        ).prefetch_related(
            {{#prefetch_related_fields}}
            '{{field_name}}',
            {{/prefetch_related_fields}}
        )

        {{#filter_params}}
        if {{param_name}} is not None:
            queryset = queryset.filter({{filter_field}}={{param_name}})
        {{/filter_params}}

        return queryset.order_by('{{default_ordering}}')

    @staticmethod
    def create_{{model_name_lower}}(
        {{#create_params}}
        {{param_name}}: {{param_type}},
        {{/create_params}}
        created_by: 'User',
    ) -> {{ModelName}}:
        """
        Create new {{model_name_lower}} with business logic.

        Args:
            {{#create_params}}
            {{param_name}}: {{param_description}}
            {{/create_params}}
            created_by: User creating the {{model_name_lower}}

        Returns:
            Created {{ModelName}} instance

        Raises:
            ValidationError: If validation fails
        """
        {{#validations}}
        # Validation: {{validation_description}}
        if {{validation_condition}}:
            raise ValidationError("{{validation_error_message}}")
        {{/validations}}

        # Create {{model_name_lower}}
        {{model_name_lower}} = {{ModelName}}.objects.create(
            {{#create_fields}}
            {{field_name}}={{field_value}},
            {{/create_fields}}
            created_by=created_by,
        )

        {{#post_create_actions}}
        # {{action_description}}
        {{RelatedService}}.{{action_method}}({{model_name_lower}})
        {{/post_create_actions}}

        return {{model_name_lower}}

    @staticmethod
    def update_{{model_name_lower}}(
        {{model_name_lower}}_id: int,
        {{#update_params}}
        {{param_name}}: Optional[{{param_type}}] = None,
        {{/update_params}}
    ) -> {{ModelName}}:
        """
        Update {{model_name_lower}} with business logic.

        Args:
            {{model_name_lower}}_id: ID of {{model_name_lower}} to update
            {{#update_params}}
            {{param_name}}: {{param_description}} (optional)
            {{/update_params}}

        Returns:
            Updated {{ModelName}} instance

        Raises:
            {{ModelName}}.DoesNotExist: If {{model_name_lower}} not found
            ValidationError: If validation fails
        """
        {{model_name_lower}} = {{ServiceName}}.get_by_id({{model_name_lower}}_id)

        {{#update_params}}
        if {{param_name}} is not None:
            {{#has_validation}}
            # Validation for {{param_name}}
            if {{validation_condition}}:
                raise ValidationError("{{validation_error_message}}")
            {{/has_validation}}
            {{model_name_lower}}.{{field_name}} = {{param_name}}
        {{/update_params}}

        {{model_name_lower}}.save()

        {{#post_update_actions}}
        # {{action_description}}
        {{RelatedService}}.{{action_method}}({{model_name_lower}})
        {{/post_update_actions}}

        return {{model_name_lower}}

    @staticmethod
    def delete_{{model_name_lower}}({{model_name_lower}}_id: int) -> None:
        """
        Delete {{model_name_lower}} with business logic.

        Args:
            {{model_name_lower}}_id: ID of {{model_name_lower}} to delete

        Raises:
            {{ModelName}}.DoesNotExist: If {{model_name_lower}} not found
        """
        {{model_name_lower}} = {{ServiceName}}.get_by_id({{model_name_lower}}_id)

        {{#pre_delete_actions}}
        # {{action_description}}
        {{RelatedService}}.{{action_method}}({{model_name_lower}})
        {{/pre_delete_actions}}

        {{model_name_lower}}.delete()

    {{#custom_methods}}
    @staticmethod
    def {{method_name}}(
        {{#method_params}}
        {{param_name}}: {{param_type}},
        {{/method_params}}
    ) -> {{return_type}}:
        """
        {{method_description}}

        Args:
            {{#method_params}}
            {{param_name}}: {{param_description}}
            {{/method_params}}

        Returns:
            {{return_description}}

        Raises:
            {{#raises}}
            {{exception_type}}: {{exception_description}}
            {{/raises}}
        """
        {{method_implementation}}
    {{/custom_methods}}
```

---

## Slot Definitions

| Slot | Description | Example |
|------|-------------|---------|
| `{{app_name}}` | Django app name | `assets`, `core`, `hierarchy` |
| `{{model_name_lower}}` | Model name lowercase | `asset`, `user`, `team` |
| `{{model_name_plural}}` | Model name plural | `assets`, `users`, `teams` |
| `{{ModelName}}` | Model class name | `Asset`, `User`, `Team` |
| `{{ServiceName}}` | Service class name | `AssetService`, `UserService` |
| `{{select_related_fields}}` | ForeignKey fields to optimize | `'company', 'created_by'` |
| `{{prefetch_related_fields}}` | ManyToMany fields to optimize | `'tags', 'permissions'` |
| `{{default_ordering}}` | Default order_by field | `-created_at`, `name` |

---

## Related Models/Services Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{related_app}}` | Related app name | `core`, `hierarchy` |
| `{{RelatedModel}}` | Related model class | `User`, `Company` |
| `{{RelatedService}}` | Related service class | `EmailService`, `AuditService` |

---

## Filter Parameters Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{param_name}}` | Parameter name | `is_active`, `status` |
| `{{param_type}}` | Parameter type | `bool`, `str` |
| `{{param_description}}` | Parameter description | `Active status filter` |
| `{{filter_field}}` | Model field to filter | `is_active`, `status` |

---

## Create/Update Parameters Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{param_name}}` | Parameter name | `name`, `email` |
| `{{param_type}}` | Parameter type hint | `str`, `int`, `bool` |
| `{{param_description}}` | Parameter description | `Asset name`, `User email` |
| `{{field_name}}` | Model field name | `name`, `email` |
| `{{field_value}}` | Value to assign | `{{param_name}}`, `make_password(password)` |

---

## Validation Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{validation_description}}` | What is being validated | `Email uniqueness` |
| `{{validation_condition}}` | Condition to check | `User.objects.filter(email=email).exists()` |
| `{{validation_error_message}}` | Error message | `Email already exists` |

---

## Action Slots (Post-Create/Update, Pre-Delete)

| Slot | Description | Example |
|------|-------------|---------|
| `{{action_description}}` | What action does | `Send welcome email` |
| `{{RelatedService}}` | Service to call | `EmailService` |
| `{{action_method}}` | Method to call | `send_welcome_email` |

---

## Custom Method Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{method_name}}` | Custom method name | `assign_to_user`, `activate` |
| `{{method_description}}` | Method purpose | `Assign asset to user` |
| `{{method_params}}` | Method parameters | See method_params section |
| `{{return_type}}` | Return type hint | `Asset`, `None`, `QuerySet[Asset]` |
| `{{return_description}}` | What is returned | `Updated asset instance` |
| `{{method_implementation}}` | Method body code | Actual implementation |

---

## Complete Example Usage

**Input values**:
- `{{app_name}}` = `assets`
- `{{model_name_lower}}` = `asset`
- `{{model_name_plural}}` = `assets`
- `{{ModelName}}` = `Asset`
- `{{ServiceName}}` = `AssetService`
- `{{select_related_fields}}` = `'company', 'created_by'`
- `{{prefetch_related_fields}}` = `'tags'`
- `{{default_ordering}}` = `-created_at`
- Filter param: `status: Optional[str] = None` (filter by `status` field)
- Create params: `name: str`, `serial_number: str`

**Generated code**:
```python
# apps/assets/services.py
from typing import Optional, List, Dict, Any
from django.db.models import QuerySet
from django.core.exceptions import ValidationError

from apps.assets.models import Asset
from apps.core.models import User, Company
from apps.core.services import EmailService, AuditService


class AssetService:
    """
    Service layer for Asset business logic.

    All methods are stateless @staticmethod for dependency injection.
    """

    @staticmethod
    def get_by_id(asset_id: int) -> Asset:
        """
        Get asset by ID with optimized query.

        Args:
            asset_id: Primary key of asset

        Returns:
            Asset instance

        Raises:
            Asset.DoesNotExist: If asset not found
        """
        return Asset.objects.select_related(
            'company', 'created_by'
        ).get(id=asset_id)

    @staticmethod
    def get_all(
        status: Optional[str] = None,
    ) -> QuerySet[Asset]:
        """
        Get all assets with optional filters.

        Args:
            status: Filter by asset status

        Returns:
            QuerySet of Asset instances
        """
        queryset = Asset.objects.select_related(
            'company', 'created_by'
        ).prefetch_related(
            'tags'
        )

        if status is not None:
            queryset = queryset.filter(status=status)

        return queryset.order_by('-created_at')

    @staticmethod
    def create_asset(
        name: str,
        serial_number: str,
        created_by: User,
    ) -> Asset:
        """
        Create new asset with business logic.

        Args:
            name: Asset name
            serial_number: Asset serial number
            created_by: User creating the asset

        Returns:
            Created Asset instance

        Raises:
            ValidationError: If validation fails
        """
        # Validation: Serial number uniqueness
        if Asset.objects.filter(serial_number=serial_number).exists():
            raise ValidationError("Serial number already exists")

        # Create asset
        asset = Asset.objects.create(
            name=name,
            serial_number=serial_number,
            created_by=created_by,
        )

        # Send notification
        EmailService.send_asset_created_notification(asset)

        return asset

    @staticmethod
    def update_asset(
        asset_id: int,
        name: Optional[str] = None,
        serial_number: Optional[str] = None,
    ) -> Asset:
        """
        Update asset with business logic.

        Args:
            asset_id: ID of asset to update
            name: Asset name (optional)
            serial_number: Asset serial number (optional)

        Returns:
            Updated Asset instance

        Raises:
            Asset.DoesNotExist: If asset not found
            ValidationError: If validation fails
        """
        asset = AssetService.get_by_id(asset_id)

        if name is not None:
            asset.name = name

        if serial_number is not None:
            # Validation for serial_number
            if Asset.objects.filter(serial_number=serial_number).exclude(id=asset_id).exists():
                raise ValidationError("Serial number already exists")
            asset.serial_number = serial_number

        asset.save()

        # Log update
        AuditService.log_asset_update(asset)

        return asset

    @staticmethod
    def delete_asset(asset_id: int) -> None:
        """
        Delete asset with business logic.

        Args:
            asset_id: ID of asset to delete

        Raises:
            Asset.DoesNotExist: If asset not found
        """
        asset = AssetService.get_by_id(asset_id)

        # Archive before delete
        AuditService.archive_asset(asset)

        asset.delete()

    @staticmethod
    def assign_to_user(
        asset_id: int,
        user_id: int,
    ) -> Asset:
        """
        Assign asset to user.

        Args:
            asset_id: ID of asset to assign
            user_id: ID of user to assign to

        Returns:
            Updated asset with assignment

        Raises:
            Asset.DoesNotExist: If asset not found
            User.DoesNotExist: If user not found
        """
        asset = AssetService.get_by_id(asset_id)
        user = User.objects.get(id=user_id)

        asset.assigned_to = user
        asset.save()

        EmailService.send_asset_assignment_notification(asset, user)

        return asset
```

---

## Validation Checklist

After generating code from this template, verify:

- [ ] All methods are @staticmethod?
- [ ] All methods have type hints (parameters + return)?
- [ ] All methods have docstrings (Args, Returns, Raises)?
- [ ] NO instance variables (__init__ or self.* )?
- [ ] Service methods delegate to other services (EmailService, AuditService)?
- [ ] get_by_id() uses select_related for ForeignKey?
- [ ] get_all() uses select_related + prefetch_related + order_by()?
- [ ] Validations raise ValidationError with clear messages?
- [ ] create/update methods accept created_by/updated_by from request.user?

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Pattern**: Stateless services, static methods, type hints, dependency injection
