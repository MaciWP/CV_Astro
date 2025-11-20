# DRF Serializer Complete Guide

**All serializer patterns for Binora Backend**

---

## 1. Input/Output Separation

**Always separate read and write serializers**

```python
class ModelInputSerializer:  # Write
    pass

class ModelOutputSerializer:  # Read
    pass
```

**Benefits**:
- Different validation
- Security (no sensitive fields in output)
- Clarity

---

## 2. Validation Layers

**Field-level**:
```python
def validate_email(self, value):
    # Validate single field
    return value
```

**Object-level**:
```python
def validate(self, attrs):
    # Cross-field validation
    return attrs
```

**Business rules → Service layer**

---

## 3. Serializer Fields

**write_only**: Input only (password, tokens)
**read_only**: Output only (id, timestamps)

```python
password = serializers.CharField(write_only=True)

class Meta:
    read_only_fields = ['id', 'created_at']
```

---

## 4. Nested Serializers

**Output only**:
```python
class AssetOutputSerializer(serializers.ModelSerializer):
    rack = RackSerializer(read_only=True)
```

**Input uses IDs**:
```python
class AssetInputSerializer(serializers.ModelSerializer):
    rack_id = serializers.IntegerField()
```

---

## 5. Computed Fields

**SerializerMethodField**:
```python
full_name = serializers.SerializerMethodField()

def get_full_name(self, obj):
    return f"{obj.first_name} {obj.last_name}"
```

---

**Reference**: DRF docs + Binora patterns
