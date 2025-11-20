# DRF ViewSet with Service Delegation Template

**Purpose**: Generate Django REST Framework ViewSet that delegates to service layer following Binora Backend patterns.

**Usage**: Replace {{slots}} with actual values for your implementation.

---

## Template Code

```python
# apps/{{app_name}}/views/{{model_name_lower}}.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from typing import Any

from apps.{{app_name}}.models import {{ModelName}}
from apps.{{app_name}}.services import {{ServiceName}}
from apps.{{app_name}}.serializers.{{model_name_lower}} import (
    {{InputSerializer}},
    {{OutputSerializer}},
    {{UpdateSerializer}},  # Optional: if different from Input
)


class {{ModelName}}ViewSet(viewsets.ModelViewSet):
    """
    ViewSet for {{ModelName}} CRUD operations.

    All business logic delegated to {{ServiceName}}.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = {{OutputSerializer}}

    def get_queryset(self):
        """
        Optimized queryset with select_related/prefetch_related.

        Note: Middleware handles tenant filtering automatically.
        """
        return {{ModelName}}.objects.select_related(
            {{#select_related_fields}}
            '{{field_name}}',
            {{/select_related_fields}}
        ).prefetch_related(
            {{#prefetch_related_fields}}
            '{{field_name}}',
            {{/prefetch_related_fields}}
        ).order_by('{{default_ordering}}')

    def list(self, request, *args, **kwargs):
        """List all {{model_name_plural}}."""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk: int = None, *args, **kwargs):
        """Retrieve single {{model_name_lower}} by ID."""
        {{model_name_lower}} = {{ServiceName}}.get_by_id({{model_name_lower}}_id=pk)
        serializer = {{OutputSerializer}}({{model_name_lower}})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Create new {{model_name_lower}}."""
        serializer = {{InputSerializer}}(data=request.data)
        serializer.is_valid(raise_exception=True)

        {{model_name_lower}} = {{ServiceName}}.create_{{model_name_lower}}(
            **serializer.validated_data,
            created_by=request.user
        )

        output_serializer = {{OutputSerializer}}({{model_name_lower}})
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk: int = None, *args, **kwargs):
        """Update {{model_name_lower}} (full update)."""
        serializer = {{UpdateSerializer}}(data=request.data)
        serializer.is_valid(raise_exception=True)

        {{model_name_lower}} = {{ServiceName}}.update_{{model_name_lower}}(
            {{model_name_lower}}_id=pk,
            **serializer.validated_data
        )

        output_serializer = {{OutputSerializer}}({{model_name_lower}})
        return Response(output_serializer.data)

    def partial_update(self, request, pk: int = None, *args, **kwargs):
        """Partial update {{model_name_lower}} (PATCH)."""
        serializer = {{UpdateSerializer}}(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        {{model_name_lower}} = {{ServiceName}}.update_{{model_name_lower}}(
            {{model_name_lower}}_id=pk,
            **serializer.validated_data
        )

        output_serializer = {{OutputSerializer}}({{model_name_lower}})
        return Response(output_serializer.data)

    def destroy(self, request, pk: int = None, *args, **kwargs):
        """Delete {{model_name_lower}}."""
        {{ServiceName}}.delete_{{model_name_lower}}({{model_name_lower}}_id=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    {{#custom_actions}}
    @action(detail={{is_detail}}, methods=['{{http_method}}'], url_path='{{url_path}}')
    def {{action_name}}(self, request, pk: int = None):
        """{{action_description}}"""
        serializer = {{ActionInputSerializer}}(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = {{ServiceName}}.{{action_service_method}}(
            {{model_name_lower}}_id=pk,
            **serializer.validated_data
        )

        output_serializer = {{ActionOutputSerializer}}(result)
        return Response(output_serializer.data)
    {{/custom_actions}}
```

---

## Slot Definitions

| Slot | Description | Example |
|------|-------------|---------|
| `{{app_name}}` | Django app name | `assets`, `core`, `hierarchy` |
| `{{model_name_lower}}` | Model name lowercase | `asset`, `user`, `team` |
| `{{ModelName}}` | Model class name | `Asset`, `User`, `Team` |
| `{{model_name_plural}}` | Model name plural | `assets`, `users`, `teams` |
| `{{ServiceName}}` | Service class name | `AssetService`, `UserService` |
| `{{InputSerializer}}` | Input serializer class | `AssetInputSerializer` |
| `{{OutputSerializer}}` | Output serializer class | `AssetOutputSerializer` |
| `{{UpdateSerializer}}` | Update serializer class | `AssetUpdateSerializer` |
| `{{select_related_fields}}` | List of ForeignKey fields | `'company', 'created_by'` |
| `{{prefetch_related_fields}}` | List of ManyToMany fields | `'tags', 'permissions'` |
| `{{default_ordering}}` | Default order_by field | `-created_at`, `email` |
| `{{custom_actions}}` | Custom @action methods | See Custom Actions section |

---

## Custom Action Slots

| Slot | Description | Example |
|------|-------------|---------|
| `{{is_detail}}` | Detail route (True/False) | `True` (requires pk), `False` (list) |
| `{{http_method}}` | HTTP method | `post`, `get`, `put`, `patch` |
| `{{url_path}}` | Custom URL path | `assign`, `activate`, `bulk-delete` |
| `{{action_name}}` | Action method name | `assign_to_user`, `activate`, `bulk_delete` |
| `{{action_description}}` | Action docstring | `Assign asset to user` |
| `{{ActionInputSerializer}}` | Input serializer for action | `AssetAssignInputSerializer` |
| `{{ActionOutputSerializer}}` | Output serializer for action | `AssetOutputSerializer` |
| `{{action_service_method}}` | Service method to call | `assign_asset_to_user` |

---

## Complete Example Usage

**Input values**:
- `{{app_name}}` = `assets`
- `{{model_name_lower}}` = `asset`
- `{{ModelName}}` = `Asset`
- `{{model_name_plural}}` = `assets`
- `{{ServiceName}}` = `AssetService`
- `{{InputSerializer}}` = `AssetInputSerializer`
- `{{OutputSerializer}}` = `AssetOutputSerializer`
- `{{UpdateSerializer}}` = `AssetUpdateSerializer`
- `{{select_related_fields}}` = `'company', 'created_by'`
- `{{prefetch_related_fields}}` = `'tags'`
- `{{default_ordering}}` = `-created_at`

**Generated code**:
```python
# apps/assets/views/asset.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from typing import Any

from apps.assets.models import Asset
from apps.assets.services import AssetService
from apps.assets.serializers.asset import (
    AssetInputSerializer,
    AssetOutputSerializer,
    AssetUpdateSerializer,
)


class AssetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Asset CRUD operations.

    All business logic delegated to AssetService.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AssetOutputSerializer

    def get_queryset(self):
        """
        Optimized queryset with select_related/prefetch_related.

        Note: Middleware handles tenant filtering automatically.
        """
        return Asset.objects.select_related(
            'company', 'created_by'
        ).prefetch_related(
            'tags'
        ).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        """List all assets."""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk: int = None, *args, **kwargs):
        """Retrieve single asset by ID."""
        asset = AssetService.get_by_id(asset_id=pk)
        serializer = AssetOutputSerializer(asset)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Create new asset."""
        serializer = AssetInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = AssetService.create_asset(
            **serializer.validated_data,
            created_by=request.user
        )

        output_serializer = AssetOutputSerializer(asset)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk: int = None, *args, **kwargs):
        """Update asset (full update)."""
        serializer = AssetUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = AssetService.update_asset(
            asset_id=pk,
            **serializer.validated_data
        )

        output_serializer = AssetOutputSerializer(asset)
        return Response(output_serializer.data)

    def partial_update(self, request, pk: int = None, *args, **kwargs):
        """Partial update asset (PATCH)."""
        serializer = AssetUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        asset = AssetService.update_asset(
            asset_id=pk,
            **serializer.validated_data
        )

        output_serializer = AssetOutputSerializer(asset)
        return Response(output_serializer.data)

    def destroy(self, request, pk: int = None, *args, **kwargs):
        """Delete asset."""
        AssetService.delete_asset(asset_id=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], url_path='assign')
    def assign_to_user(self, request, pk: int = None):
        """Assign asset to user."""
        serializer = AssetAssignInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = AssetService.assign_asset_to_user(
            asset_id=pk,
            **serializer.validated_data
        )

        output_serializer = AssetOutputSerializer(result)
        return Response(output_serializer.data)
```

---

## Validation Checklist

After generating code from this template, verify:

- [ ] All imports correct for app structure?
- [ ] Service methods exist in {{ServiceName}}?
- [ ] Input/Output serializers defined?
- [ ] get_queryset() has select_related/prefetch_related for all related fields in serializers?
- [ ] order_by() present?
- [ ] Type hints on all method parameters?
- [ ] NO business logic in ViewSet (all delegated to service)?
- [ ] created_by passed from request.user?
- [ ] Custom actions have proper decorators?

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Pattern**: Service delegation, Input/Output separation, optimized queries
