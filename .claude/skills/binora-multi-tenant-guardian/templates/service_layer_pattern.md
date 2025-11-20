# Service Layer Template - Multi-Tenant Safe

**Copy-paste ready service templates for Binora Backend**

---

## Basic Service Template

```python
from typing import Any, Optional

from django.db import transaction
from django.db.models import QuerySet

from apps.{app}.models import {Model}


class {Model}Service:
    """
    Service for {Model} business logic.

    ✅ Multi-tenant safe: NO company parameters
    ✅ Dependency injection: Repositories injected with defaults
    ✅ Type hints: All parameters and returns typed
    """

    def __init__(
        self,
        {model}_repository={Model}.objects,  # ✅ DI with default
    ):
        """{Model} service with dependency injection"""
        self.{model}_repository = {model}_repository

    @transaction.atomic
    def create_{model}(self, **data: Any) -> {Model}:
        """
        Create {model} instance.

        ✅ NO company parameter - middleware adds it automatically

        Args:
            **data: Validated data from serializer

        Returns:
            Created {model} instance

        Raises:
            ValidationError: If data is invalid
        """
        # Business validation
        self._validate_create_data(data)

        # Create instance
        instance = self.{model}_repository.create(**data)

        # Post-creation logic (notifications, logging, etc.)
        # ...

        return instance

    @transaction.atomic
    def update_{model}(
        self,
        instance: {Model},
        data: dict[str, Any]
    ) -> {Model}:
        """
        Update {model} instance.

        ✅ Instance already tenant-filtered by middleware

        Args:
            instance: {Model} instance to update
            data: Validated data from serializer

        Returns:
            Updated {model} instance
        """
        # Business validation
        self._validate_update_data(instance, data)

        # Only update changed fields
        cleaned_data = {
            field: value
            for field, value in data.items()
            if getattr(instance, field, None) != value
        }

        for key, value in cleaned_data.items():
            setattr(instance, key, value)

        instance.save()

        # Post-update logic
        # ...

        return instance

    @transaction.atomic
    def delete_{model}(self, instance: {Model}) -> None:
        """
        Delete {model} instance.

        ✅ Instance already tenant-filtered

        Args:
            instance: {Model} instance to delete
        """
        # Business rules check
        if not self._can_delete(instance):
            raise ValueError("Cannot delete this {model}")

        # Soft delete or hard delete
        instance.delete()

    def get_{model}s_by_status(self, status: str) -> QuerySet[{Model}]:
        """
        Get {model}s by status.

        ✅ NO company parameter - middleware filters automatically

        Args:
            status: Status to filter by

        Returns:
            Filtered queryset
        """
        return self.{model}_repository.filter(status=status)

    # Private helper methods

    def _validate_create_data(self, data: dict[str, Any]) -> None:
        """Validate data before create"""
        # Business rule validation
        pass

    def _validate_update_data(
        self,
        instance: {Model},
        data: dict[str, Any]
    ) -> None:
        """Validate data before update"""
        # Business rule validation
        pass

    def _can_delete(self, instance: {Model}) -> bool:
        """Check if instance can be deleted"""
        # Business rules
        return True
```

---

## Service with Dual-Mode Pattern (Main vs Tenant)

Use this pattern for services that need to forward operations to Main instance.

```python
from typing import Any, Optional

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.db import transaction
from rest_framework.exceptions import APIException
from urllib.parse import urljoin
import requests

from apps.{app}.models import {Model}


class {Model}Service:
    """
    ✅ Dual-mode service: Works in both Main and Tenant services

    Detects service type via settings.MAIN_INSTANCE_URL
    """

    def __init__(
        self,
        {model}_repository={Model}.objects,
    ):
        self.{model}_repository = {model}_repository

    @transaction.atomic
    def create_{model}(
        self,
        data: dict[str, Any],
        auth_token: Optional[str] = None,
    ) -> {Model}:
        """
        ✅ Dual-mode: Creates differently based on service type

        In TENANT service: Forwards to Main, syncs locally
        In MAIN service: Creates directly

        Args:
            data: Validated data
            auth_token: JWT token (required for Tenant mode)

        Returns:
            Created {model} instance
        """
        if settings.MAIN_INSTANCE_URL is not None:
            # We're in TENANT service → forward to Main
            return self._create_{model}_in_tenant(data, auth_token)
        else:
            # We're in MAIN service → create directly
            return self._create_{model}_in_main(data)

    @transaction.atomic
    def update_{model}(
        self,
        instance: {Model},
        data: dict[str, Any],
        auth_token: Optional[str] = None,
    ) -> {Model}:
        """
        ✅ Dual-mode: Updates differently based on service type
        """
        if settings.MAIN_INSTANCE_URL is not None:
            # Tenant service → forward to Main
            return self._update_{model}_in_tenant(instance, data, auth_token)
        else:
            # Main service → update directly
            return self._update_{model}_in_main(instance, data)

    # TENANT mode methods

    def _create_{model}_in_tenant(
        self,
        data: dict[str, Any],
        auth_token: Optional[str]
    ) -> {Model}:
        """
        TENANT service path: Forward to Main, sync locally
        """
        if not auth_token:
            raise PermissionDenied("Authentication required for this operation")

        # Build request to Main service
        headers = {"Authorization": f"Bearer {auth_token}"}

        # Forward to Main service
        response = self._request_main_instance(
            endpoint="/api/{models}/",
            headers=headers,
            method="POST",
            data=data
        )

        main_data = response.json()

        # Create/sync local copy
        instance, created = self.{model}_repository.get_or_create(
            id=main_data["id"],  # Use Main ID
            defaults=main_data
        )

        return instance

    def _update_{model}_in_tenant(
        self,
        instance: {Model},
        data: dict[str, Any],
        auth_token: Optional[str]
    ) -> {Model}:
        """
        TENANT service path: Forward update to Main
        """
        if not auth_token:
            raise PermissionDenied("Authentication required for this operation")

        headers = {"Authorization": f"Bearer {auth_token}"}

        # Forward to Main
        response = self._request_main_instance(
            endpoint=f"/api/{models}/{instance.id}/",
            headers=headers,
            method="PUT",
            data=data
        )

        main_data = response.json()

        # Update local copy
        for key, value in main_data.items():
            setattr(instance, key, value)

        instance.save()
        return instance

    # MAIN mode methods

    def _create_{model}_in_main(
        self,
        data: dict[str, Any]
    ) -> {Model}:
        """
        MAIN service path: Create directly
        """
        # Business validation
        self._validate_create_data(data)

        # Create instance
        instance = self.{model}_repository.create(**data)

        return instance

    def _update_{model}_in_main(
        self,
        instance: {Model},
        data: dict[str, Any]
    ) -> {Model}:
        """
        MAIN service path: Update directly
        """
        # Business validation
        self._validate_update_data(instance, data)

        # Update instance
        for key, value in data.items():
            setattr(instance, key, value)

        instance.save()
        return instance

    # Helper methods

    def _request_main_instance(
        self,
        endpoint: str,
        headers: dict[str, Any],
        method: str = "GET",
        data: Optional[dict] = None
    ):
        """
        Forward request to Main instance

        Args:
            endpoint: API endpoint (e.g., /api/users/)
            headers: Request headers (include Authorization)
            method: HTTP method
            data: Request body

        Returns:
            Response from Main instance

        Raises:
            PermissionDenied: If Main rejects auth
            APIException: If Main unavailable
        """
        try:
            response = requests.request(
                method=method,
                url=urljoin(settings.MAIN_INSTANCE_URL, endpoint),
                json=data,
                headers=headers,
                timeout=None if settings.DEBUG else 5,
            )

            if response.status_code in [200, 201]:
                return response
            elif response.status_code in [401, 403]:
                raise PermissionDenied("Authentication with main instance failed")
            else:
                raise APIException(f"Main instance error: {response.status_code}")

        except (requests.ConnectionError, requests.Timeout) as e:
            raise APIException("Main instance temporarily unavailable")

    def _validate_create_data(self, data: dict[str, Any]) -> None:
        """Validate data before create"""
        pass

    def _validate_update_data(
        self,
        instance: {Model},
        data: dict[str, Any]
    ) -> None:
        """Validate data before update"""
        pass
```

---

## Service with Complex Business Logic

```python
from typing import Any, List, Optional

from django.db import transaction
from django.db.models import QuerySet, Q
from django.core.exceptions import ValidationError

from apps.{app}.models import {Model}, Related{Model}


class {Model}Service:
    """
    Service with complex business logic and multiple dependencies.

    ✅ Multi-tenant safe
    ✅ Dependency injection for all dependencies
    ✅ Comprehensive type hints
    """

    def __init__(
        self,
        {model}_repository={Model}.objects,
        related_repository=Related{Model}.objects,
        email_helper=None,  # Inject email service
        notification_service=None,  # Inject notification service
    ):
        self.{model}_repository = {model}_repository
        self.related_repository = related_repository
        self.email_helper = email_helper
        self.notification_service = notification_service

    @transaction.atomic
    def create_{model}_with_relations(
        self,
        {model}_data: dict[str, Any],
        relations: List[int],
        notify: bool = True
    ) -> {Model}:
        """
        Create {model} with related objects.

        ✅ Transaction ensures atomicity
        ✅ NO company parameter

        Args:
            {model}_data: Main object data
            relations: IDs of related objects
            notify: Whether to send notifications

        Returns:
            Created {model} with relations

        Raises:
            ValidationError: If validation fails
        """
        # Validate main data
        self._validate_create_data({model}_data)

        # Validate relations exist (middleware filters by company)
        related_objects = self.related_repository.filter(id__in=relations)
        if related_objects.count() != len(relations):
            raise ValidationError("Some related objects not found")

        # Create main instance
        instance = self.{model}_repository.create(**{model}_data)

        # Add relations
        instance.relations.set(related_objects)

        # Send notifications (if enabled)
        if notify and self.notification_service:
            self.notification_service.notify_created(instance)

        # Send email (if configured)
        if self.email_helper:
            self.email_helper.send_creation_email(instance)

        return instance

    def search_{model}s(
        self,
        query: str,
        filters: Optional[dict[str, Any]] = None
    ) -> QuerySet[{Model}]:
        """
        Search {model}s with complex filters.

        ✅ NO company filter - middleware handles it

        Args:
            query: Search query string
            filters: Additional filters

        Returns:
            Filtered queryset
        """
        # Base queryset (middleware adds company filter)
        qs = self.{model}_repository.all()

        # Search across multiple fields
        if query:
            qs = qs.filter(
                Q(name__icontains=query) |
                Q(code__icontains=query) |
                Q(description__icontains=query)
            )

        # Apply additional filters
        if filters:
            qs = qs.filter(**filters)

        return qs.distinct()

    def bulk_update_{model}s(
        self,
        instances: List[{Model}],
        data: dict[str, Any]
    ) -> List[{Model}]:
        """
        Bulk update multiple {model}s.

        ✅ Efficient bulk operations

        Args:
            instances: List of {model} instances
            data: Data to update

        Returns:
            Updated instances
        """
        # Validate all instances
        for instance in instances:
            self._validate_update_data(instance, data)

        # Update all instances
        for instance in instances:
            for key, value in data.items():
                setattr(instance, key, value)

        # Bulk update
        self.{model}_repository.bulk_update(
            instances,
            fields=list(data.keys())
        )

        return instances

    def get_aggregated_data(self) -> dict[str, Any]:
        """
        Get aggregated statistics.

        ✅ NO company filter - middleware adds automatically

        Returns:
            Dictionary with aggregated data
        """
        from django.db.models import Count, Avg

        return {
            "total": self.{model}_repository.count(),
            "by_status": self.{model}_repository.values("status").annotate(
                count=Count("id")
            ),
            "average_field": self.{model}_repository.aggregate(
                avg=Avg("field_name")
            )["avg"],
        }

    # Private validation methods

    def _validate_create_data(self, data: dict[str, Any]) -> None:
        """Complex create validation"""
        if "required_field" not in data:
            raise ValidationError("required_field is mandatory")

        # More complex validation logic
        pass

    def _validate_update_data(
        self,
        instance: {Model},
        data: dict[str, Any]
    ) -> None:
        """Complex update validation"""
        # Business rule validation
        pass
```

---

## Minimal Service (Read-Only)

For simple read operations with no complex business logic:

```python
from django.db.models import QuerySet

from apps.{app}.models import {Model}


class {Model}Service:
    """
    ✅ Minimal read-only service

    For simple cases with no complex business logic
    """

    @staticmethod
    def get_active_{model}s() -> QuerySet[{Model}]:
        """
        Get active {model}s.

        ✅ NO company filter - middleware handles it
        """
        return {Model}.objects.filter(is_active=True)

    @staticmethod
    def get_{model}_by_code(code: str) -> {Model}:
        """
        Get {model} by code.

        ✅ Middleware ensures tenant filtering
        """
        return {Model}.objects.get(code=code)

    @staticmethod
    def search_{model}s(query: str) -> QuerySet[{Model}]:
        """
        Search {model}s.

        ✅ NO company parameter
        """
        return {Model}.objects.filter(name__icontains=query)
```

---

## Usage Examples

### In ViewSet

```python
# apps/{app}/views/{model}.py

from apps.{app}.services import {Model}Service


class {Model}ViewSet(viewsets.ModelViewSet):
    service = {Model}Service()  # ✅ Instantiate with defaults

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # ✅ Delegate to service
        instance = self.service.create_{model}(**serializer.validated_data)

        output_serializer = {Model}OutputSerializer(instance)
        return Response(output_serializer.data, status=201)
```

### In Tests

```python
# apps/{app}/tests/service_tests.py

import pytest
from apps.{app}.services import {Model}Service


@pytest.mark.django_db
class Test{Model}Service:

    def test_create_{model}_with_mocked_repository(self, mocker):
        """Test service with mocked repository"""
        # ✅ Mock repository
        mock_repo = mocker.Mock()
        mock_repo.create.return_value = mocker.Mock(id=1, name="Test")

        # ✅ Inject mock via DI
        service = {Model}Service({model}_repository=mock_repo)

        data = {"name": "Test"}
        result = service.create_{model}(**data)

        # Verify repository called correctly
        mock_repo.create.assert_called_once_with(**data)
        assert result.name == "Test"
```

---

## Checklist for New Service

- [ ] **NO company parameters** in any method
- [ ] **Dependency injection** with defaults in __init__
- [ ] **Type hints** on all parameters and returns
- [ ] **@transaction.atomic** for data modifications
- [ ] **Business logic only** - no HTTP concerns
- [ ] **Private methods** for validation (_validate_*)
- [ ] **Dual-mode check** (if forwards to Main)
- [ ] **Comprehensive docstrings** with Args/Returns/Raises

---

## Anti-Patterns (Don't Do This)

### ❌ Company Parameter

```python
# ❌ WRONG
def create_resource(self, data: dict, company: Company):
    # Manual company handling violates transparent isolation
```

### ❌ No Dependency Injection

```python
# ❌ WRONG
class Service:
    def __init__(self):
        self.repository = Model.objects  # Hard-coded, can't test
```

### ❌ HTTP Concerns in Service

```python
# ❌ WRONG
def create_resource(self, request):
    data = request.data  # HTTP concerns in service
    return Response(...)  # Service should return domain objects
```

### ❌ No Type Hints

```python
# ❌ WRONG
def update_resource(self, instance, data):  # No type hints
    pass
```

---

**Use these templates** for all new services in Binora Backend!

**Last Updated**: 2025-01-23
**Based on**: apps/core/services.py (AuthService real implementation)
