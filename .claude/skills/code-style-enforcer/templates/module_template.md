# Module Template

**Standard module structure for Binora Backend**

---

```python
# apps/<app>/<module>.py

"""
<Module> - <Brief description>

<Detailed description if needed>
"""

__all__ = ["Class1", "Class2", "function1"]

# Standard library
import os
from typing import Optional, List

# Third-party
from django.db import transaction
from django.db.models import QuerySet

# Local
from apps.core.models import User
from apps.core.utils import helpers


class Class1:
    """<Brief class description>"""

    def __init__(self, param: str) -> None:
        self.param = param

    def method(self, arg: int) -> str:
        """<Brief method description>"""
        return str(arg)


def function1(param: str) -> Optional[str]:
    """<Brief function description>"""
    if param:
        return param.upper()
    return None
```

---

**Key Points**:
- `__all__` at top
- Imports in 3 groups
- Type hints everywhere
- Brief docstrings for public API
- NO obvious comments

---

**Pattern from**: Real Binora modules
