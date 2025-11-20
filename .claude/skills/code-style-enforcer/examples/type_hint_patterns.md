# Type Hint Patterns

**Rule**: ALL function parameters and returns must have type hints

**Pattern from**: Real Binora code

---

## Basic Types

```python
from typing import Optional, List, Dict

def get_user(user_id: int) -> User:
    return User.objects.get(id=user_id)

def create_users(emails: List[str]) -> List[User]:
    return [User.objects.create(email=e) for e in emails]

def get_config() -> Dict[str, str]:
    return {"key": "value"}

def find_user(email: str) -> Optional[User]:
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None
```

---

## Django Types

```python
from django.db.models import QuerySet

def get_active_users() -> QuerySet[User]:
    return User.objects.filter(is_active=True)

def get_user_or_none(user_id: int) -> Optional[User]:
    return User.objects.filter(id=user_id).first()
```

---

## Service Patterns

```python
from typing import Any, Dict

class UserService:
    def __init__(
        self,
        users_repository=User.objects,
        email_helper=EmailHelper,
    ) -> None:  # __init__ returns None
        self.users_repository = users_repository
        self.email_helper = email_helper

    def create(self, **data: Any) -> User:
        return self.users_repository.create(**data)
```

---

**Rule**: If mypy complains, fix it. NO `# type: ignore`
