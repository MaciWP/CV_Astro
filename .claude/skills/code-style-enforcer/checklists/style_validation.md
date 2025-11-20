# Style Validation Checklist

**Quick validation for code style compliance**

---

## Check 1: Comments

```bash
# Find obvious comments (should be minimal)
grep -rn "# Create\|# Return\|# Check" apps/*/services.py apps/*/views/*.py

# Expected: Few or none
```

**Fix**: Remove obvious comments, make code self-explanatory

---

## Check 2: Type Hints

```bash
# Find functions without type hints
grep -A 1 "def " apps/*/services.py | grep -v " -> "

# Expected: 0 (all functions have type hints)
```

**Fix**: Add type hints to all parameters and returns

---

## Check 3: __all__

```bash
# Find service files without __all__
grep -L "__all__" apps/*/services.py

# Expected: 0 (all service files have __all__)
```

**Fix**: Add `__all__ = ["ClassName"]` at top of file

---

## Check 4: Import Organization

```bash
# Check with isort (dry-run)
isort --check-only apps/

# Expected: No changes needed
```

**Fix**: Run `isort apps/` to auto-fix

---

## Check 5: Naming Conventions

```bash
# Find camelCase variables (should be snake_case)
grep -rn "[a-z][A-Z]" apps/ | grep -v "class " | head -20

# Manual review needed
```

---

**Tool**: Run all checks before commit
