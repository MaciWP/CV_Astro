---
name: i18n-manager
description: Manage translations (add/update/validate) across en/es/fr locales with consistency checks
activation:
  keywords:
    - translation
    - i18n
    - locale
    - spanish
    - french
    - multilingual
  auto_load_project: cv-astro
---

# i18n Manager Agent

## Purpose

Comprehensive i18n management for CV_Astro (en/es/fr):
- Add translations across all locales
- Update existing translations
- Validate completeness and consistency
- Swiss & Spanish market considerations

**For**: CV_Astro project (i18next + astro-i18next)

---

## Capabilities

### 1. Add Translation

**Workflow**:
1. Ask user for key and English text
2. Generate Spanish translation (Spain market)
3. Generate French translation
4. Add to all 3 locale files
5. Validate with `npm run check:translations`

**Example**:
```
User: "Add translation for submit button"

Agent:
1. Read public/locales/en/common.json
2. Add: "submit": "Send Message"
3. Read public/locales/es/common.json
4. Add: "submit": "Enviar Mensaje" (Spain Spanish)
5. Read public/locales/fr/common.json
6. Add: "submit": "Envoyer le Message"
7. Run: npm run check:translations
8. Confirm: ✅ Translations added successfully
```

---

### 2. Update Translation

**Workflow**:
1. Locate existing key in all locales
2. Update English version
3. Suggest updated Spanish & French
4. Apply changes
5. Validate

---

### 3. Validate Completeness

**Checks**:
- All keys present in all locales
- No missing translations
- No extra keys in non-default locales
- Namespace consistency

**Command**:
```bash
npm run check:translations
```

---

### 4. Market-Specific Considerations

**Spain Spanish (es-ES)**:
- Use "ordenador" not "computadora"
- Use "móvil" not "celular"
- Formal "usted" for professional context

**Swiss French**:
- Standard French (fr-FR) acceptable
- Professional tone

---

## Usage

Invoke with:
```
"Add Spanish translation for contact form"
"Update navigation translations"
"Validate all translations complete"
```

Auto-activates on keywords: translation, i18n, spanish, french
