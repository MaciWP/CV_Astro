---
name: i18n-validate
description: Validate translation consistency across en/es/fr locales
---

# i18n Translation Validator

Validate translation files for completeness and consistency.

## Task

Run translation validation checks across all locales.

**Validation Steps**:

### 1. Check Translation Files Exist
```bash
ls public/locales/en/common.json
ls public/locales/es/common.json
ls public/locales/fr/common.json
```

### 2. Validate JSON Syntax
```bash
node -e "JSON.parse(require('fs').readFileSync('public/locales/en/common.json'))"
node -e "JSON.parse(require('fs').readFileSync('public/locales/es/common.json'))"
node -e "JSON.parse(require('fs').readFileSync('public/locales/fr/common.json'))"
```

### 3. Check Key Consistency
- [ ] All keys present in English exist in Spanish
- [ ] All keys present in English exist in French
- [ ] No orphaned keys (exist in es/fr but not en)
- [ ] Nested structure matches across locales

### 4. Check Translation Quality
- [ ] No empty strings
- [ ] No untranslated keys (same as English)
- [ ] Proper placeholder syntax (`{{variable}}`)
- [ ] HTML entity encoding correct

### 5. Context Validation
- [ ] Professional tone maintained
- [ ] Technical terms translated correctly
- [ ] Cultural adaptations (Spain Spanish vs Latin American)
- [ ] Swiss French considerations

---

**Automated Check**:

If `scripts/check-translations.js` exists:
```bash
npm run check:translations
```

Otherwise, activate `i18n-manager` agent to perform manual validation.

---

**Common Issues**:

1. **Missing Keys**: Key exists in `en` but not in `es` or `fr`
2. **Empty Translations**: Key exists but value is empty string
3. **Copy-Paste Errors**: Spanish/French translation is identical to English
4. **JSON Syntax**: Trailing commas, missing quotes, invalid escaping
5. **Placeholder Mismatch**: `{{name}}` in English but `{{nombre}}` in Spanish

---

**Usage**:
```
/i18n-validate
```

Claude will run all validation checks and report any issues with specific line numbers and fixes.
