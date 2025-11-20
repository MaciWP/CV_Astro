# Tenant-Agnostic ViewSet Template

**Copy-paste ready boilerplate for Binora Backend ViewSets**

---

## Basic ViewSet Template

```python
from typing import Any

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.{app}.models import {Model}
from apps.{app}.serializers.{model} import {Model}CreateSerializer, {Model}UpdateSerializer
from apps.{app}.serializers.{model} import {Model}Serializer
from apps.{app}.services import {Model}Service
from apps.frontend.permissions import FrontendPermissions


class {Model}ViewSet(viewsets.ModelViewSet):
    """
    ViewSet for {Model} management.

    ✅ Tenant-agnostic: Middleware handles company filtering automatically
    ✅ Service delegation: Business logic in {Model}Service
    ✅ Query optimization: select_related, prefetch_related, order_by
    """

    # ✅ Optimized queryset - NO manual tenant filtering
    queryset = {Model}.objects.select_related(
        # Add related models for ForeignKey
        'related_model',
    ).prefetch_related(
        # Add related models for ManyToMany or reverse ForeignKey
        'many_to_many_field',
    ).order_by('created_at')  # ✅ ALWAYS order_by

    serializer_class = {Model}Serializer
    permission_classes = [IsAuthenticated]

    # Service instance for business logic
    service = {Model}Service()

    # Frontend permissions mapping
    frontend_permissions = {
        "list": [FrontendPermissions.{APP}__{MODEL}S.READ],
        "retrieve": [FrontendPermissions.{APP}__{MODEL}S.READ],
        "create": [FrontendPermissions.{APP}__{MODEL}S.WRITE],
        "update": [FrontendPermissions.{APP}__{MODEL}S.WRITE],
        "partial_update": [FrontendPermissions.{APP}__{MODEL}S.WRITE],
        "destroy": [FrontendPermissions.{APP}__{MODEL}S.DELETE],
    }

    def get_serializer_class(self):
        """
        Return different serializers for different actions
        """
        return {
            "create": {Model}CreateSerializer,
            "update": {Model}UpdateSerializer,
            "partial_update": {Model}UpdateSerializer,
        }.get(self.action, {Model}Serializer)

    def create(self, request, *args: Any, **kwargs: Any) -> Response:
        """
        ✅ HTTP layer only - delegates to service
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # ✅ Delegate to service for business logic
        instance = self.service.create_{model}(
            **serializer.validated_data
        )

        # Return with output serializer
        output_serializer = {Model}Serializer(instance, context={"request": request})
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args: Any, **kwargs: Any) -> Response:
        """
        ✅ HTTP layer only - delegates to service
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()  # ✅ Middleware ensures tenant filtering

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        # ✅ Delegate to service
        updated_instance = self.service.update_{model}(
            instance=instance,
            data=serializer.validated_data
        )

        output_serializer = {Model}Serializer(updated_instance, context={"request": request})
        return Response(output_serializer.data)

    def partial_update(self, request, *args: Any, **kwargs: Any) -> Response:
        """
        PATCH method - delegates to update with partial=True
        """
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    @action(methods=["POST"], detail=True, url_path="custom-action")
    def custom_action(self, request, pk=None, **kwargs: Any) -> Response:
        """
        ✅ Custom action template
        """
        instance = self.get_object()  # ✅ Tenant-filtered automatically

        # ✅ Delegate to service
        result = self.service.perform_custom_action(instance)

        return Response({"status": "success", "result": result})
```

---

## Minimal ViewSet (No Custom Methods)

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.{app}.models import {Model}
from apps.{app}.serializers.{model} import {Model}Serializer


class {Model}ViewSet(viewsets.ModelViewSet):
    """
    ✅ Minimal tenant-agnostic ViewSet

    Uses DRF defaults - suitable for simple CRUD
    """
    queryset = {Model}.objects.select_related().order_by('name')
    serializer_class = {Model}Serializer
    permission_classes = [IsAuthenticated]
```

---

## Read-Only ViewSet

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.{app}.models import {Model}
from apps.{app}.serializers.{model} import {Model}Serializer


class {Model}ViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ✅ Read-only ViewSet (list + retrieve only)
    """
    queryset = {Model}.objects.select_related().prefetch_related().order_by('name')
    serializer_class = {Model}Serializer
    permission_classes = [IsAuthenticated]
```

---

## ViewSet with Filtering

```python
from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.{app}.models import {Model}
from apps.{app}.serializers.{model} import {Model}Serializer


class {Model}Filter(filters.FilterSet):
    """
    ✅ FilterSet for query parameters
    NO company filtering - middleware handles it
    """
    status = filters.ChoiceFilter(choices={Model}.STATUS_CHOICES)
    created_after = filters.DateFilter(field_name='created_at', lookup_expr='gte')

    class Meta:
        model = {Model}
        fields = ['status', 'created_after']


class {Model}ViewSet(viewsets.ModelViewSet):
    """
    ✅ ViewSet with filtering support
    """
    queryset = {Model}.objects.select_related().order_by('-created_at')
    serializer_class = {Model}Serializer
    permission_classes = [IsAuthenticated]
    filterset_class = {Model}Filter
```

---

## Usage Examples

### Create ViewSet for Asset Management

```python
# apps/assets/views/asset.py

from typing import Any

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.assets.models import Asset
from apps.assets.serializers.asset import AssetCreateSerializer, AssetSerializer
from apps.assets.services import AssetService
from apps.frontend.permissions import FrontendPermissions


class AssetViewSet(viewsets.ModelViewSet):
    """
    ✅ Real example: Asset management ViewSet
    """
    queryset = Asset.objects.select_related(
        'rack',  # FK optimization
        'rack__row',  # Nested FK
    ).prefetch_related(
        'tags',  # M2M
    ).order_by('name')

    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]
    service = AssetService()

    frontend_permissions = {
        "list": [FrontendPermissions.ASSETS__ASSETS.READ],
        "create": [FrontendPermissions.ASSETS__ASSETS.WRITE],
        # ...
    }

    def get_serializer_class(self):
        return {
            "create": AssetCreateSerializer,
        }.get(self.action, AssetSerializer)

    def create(self, request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        asset = self.service.create_asset(**serializer.validated_data)

        output_serializer = AssetSerializer(asset, context={"request": request})
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
```

---

## Common Patterns

### Pattern 1: Optimized Queryset

```python
# ✅ ALWAYS optimize queries
queryset = Model.objects.select_related(
    'foreign_key_1',
    'foreign_key_2__nested',
).prefetch_related(
    'many_to_many',
    'reverse_foreign_key_set',
).order_by('field_name')
```

### Pattern 2: Service Delegation

```python
# ✅ Views handle HTTP, services handle business logic
def create(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Delegate to service
    instance = self.service.create_resource(**serializer.validated_data)

    return Response(self.get_serializer(instance).data, status=201)
```

### Pattern 3: Serializer Dispatch

```python
# ✅ Different serializers for different actions
def get_serializer_class(self):
    return {
        "create": ResourceCreateSerializer,
        "update": ResourceUpdateSerializer,
        "partial_update": ResourceUpdateSerializer,
    }.get(self.action, ResourceSerializer)
```

---

## Anti-Patterns (Don't Do This)

### ❌ Manual Tenant Filtering

```python
# ❌ WRONG - Manual company filtering
class BadViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Model.objects.filter(company=self.request.user.company)
        # Violates transparent isolation!
```

### ❌ Business Logic in View

```python
# ❌ WRONG - Business logic should be in service
def create(self, request):
    data = request.data
    instance = Model.objects.create(**data)  # ❌
    send_notification(instance)  # ❌
    log_action(instance)  # ❌
    return Response(...)
```

### ❌ No Query Optimization

```python
# ❌ WRONG - Missing optimization
queryset = Model.objects.all()  # No select_related, no order_by!
```

---

## Checklist for New ViewSet

- [ ] Extends `viewsets.ModelViewSet` or `viewsets.ReadOnlyModelViewSet`
- [ ] **NO manual tenant filtering** (no `.filter(company=...)`)
- [ ] Query optimization present (select_related, prefetch_related, order_by)
- [ ] Service instance created for business logic
- [ ] `get_serializer_class()` returns different serializers for actions
- [ ] create/update methods delegate to service
- [ ] Type hints on custom methods
- [ ] Frontend permissions mapped
- [ ] Permission classes defined

---

**Use this template** for all new ViewSets in Binora Backend!

**Last Updated**: 2025-01-23
**Based on**: apps/core/views/user.py (UserViewSet pattern)