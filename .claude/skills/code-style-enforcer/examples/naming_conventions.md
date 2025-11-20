# Naming Conventions

**Rule**: Follow Django/Python conventions strictly

---

## Variables

```python
# ✅ CORRECT - snake_case
user_email = "test@example.com"
is_active = True
max_retries = 3

# ❌ WRONG - camelCase
userEmail = "test@example.com"
isActive = True
```

---

## Functions

```python
# ✅ CORRECT - snake_case, verb_noun
def create_user(email: str) -> User:
    pass

def get_active_users() -> QuerySet[User]:
    pass

def send_welcome_email(user: User) -> None:
    pass

# ❌ WRONG
def CreateUser():  # PascalCase
def getusers():  # No separation
```

---

## Classes

```python
# ✅ CORRECT - PascalCase
class UserService:
    pass

class AssetViewSet(viewsets.ModelViewSet):
    pass

# ❌ WRONG
class user_service:  # snake_case
class assetVS:  # Abbreviation
```

---

## Constants

```python
# ✅ CORRECT - UPPER_CASE
MAX_UPLOAD_SIZE = 1024 * 1024 * 10
DEFAULT_TIMEOUT = 30
API_VERSION = "v1"

# ❌ WRONG
maxUploadSize = 1024  # camelCase
max_upload_size = 1024  # snake_case
```

---

## Private Methods

```python
class UserService:
    def create_user(self, email: str) -> User:  # Public
        self._validate_email(email)  # Private
        return self._create_user_record(email)  # Private

    def _validate_email(self, email: str) -> None:  # Private
        pass

    def _create_user_record(self, email: str) -> User:  # Private
        pass
```

**Rule**: Prefix private with `_`

---

**Reference**: PEP 8 + Django conventions
