# YOLO Comment Violations

**Rule**: Code should be self-explanatory. NO obvious comments.

---

## ❌ FORBIDDEN Comments

```python
# Create user
user = User.objects.create(email=email)

# Check if valid
if user.is_active:
    # Send email
    send_email(user)

# Return result
return user
```

## ✅ CORRECT - No Comments

```python
user = User.objects.create(email=email)

if user.is_active:
    send_email(user)

return user
```

---

## When Comments ARE Allowed

**ONLY for**:
- Complex algorithms (non-obvious)
- Security-critical code
- Workarounds for bugs

```python
# ✅ OK - Non-obvious algorithm
# Using binary search for O(log n) performance
# instead of linear search due to large dataset (10M+ records)
def find_user(users_sorted_by_id, user_id):
    # Binary search implementation
    ...
```

---

**Reference**: `CLAUDE.md` - YOLO philosophy
