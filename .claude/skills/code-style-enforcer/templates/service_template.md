# Service Template

**Standard service structure with type hints and DI**

---

```python
# apps/<app>/services.py

__all__ = ["<Model>Service"]

from typing import Optional
from django.db import transaction
from django.db.models import QuerySet

from apps.<app>.models import <Model>


class <Model>Service:
    """
    Service layer for <Model> business logic.

    Dependencies injected via constructor for testability.
    """

    def __init__(
        self,
        <model>_repository=<Model>.objects,
    ) -> None:
        self.<model>_repository = <model>_repository

    def get_all(self) -> QuerySet[<Model>]:
        return self.<model>_repository.all()

    def get_by_id(self, <model>_id: int) -> <Model>:
        return self.<model>_repository.get(id=<model>_id)

    @transaction.atomic
    def create(self, **data) -> <Model>:
        return self.<model>_repository.create(**data)

    @transaction.atomic
    def update(self, <model>: <Model>, **data) -> <Model>:
        for field, value in data.items():
            setattr(<model>, field, value)
        <model>.save()
        return <model>

    @transaction.atomic
    def delete(self, <model>: <Model>) -> None:
        <model>.delete()
```

---

**Checklist**:
- [ ] `__all__` declared
- [ ] Type hints on all methods
- [ ] Dependency injection
- [ ] `@transaction.atomic` on writes
- [ ] NO obvious comments

---

**Real Example**: `apps/core/services.py`
