# FormSerializer Composition

**Real pattern**: Binora uses FormSerializer for Django forms

---

## Pattern: Composing FormSerializer

```python
from rest_framework.serializers import Serializer
from django import forms


class UserForm(forms.Form):
    email = forms.EmailField()
    first_name = forms.CharField()


class UserInputSerializer(Serializer):
    """Composes Django form for validation"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.form = UserForm()

    def validate(self, attrs):
        form = UserForm(data=attrs)
        if not form.is_valid():
            raise serializers.ValidationError(form.errors)
        return form.cleaned_data
```

---

## Benefits

- Reuse Django form validation
- Consistent validation between API and forms
- DRY principle

---

**Real Usage**: `apps/core/serializers/` for form composition
