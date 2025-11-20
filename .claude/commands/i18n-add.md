---
name: i18n-add
description: Add translation key across all locales (en/es/fr) with context-aware suggestions
---

# i18n Translation Adder

Add a new translation key to all locales with proper context.

## Task

Activate the `i18n-manager` agent to add a translation:

**Translation Key**: {Ask user for key (e.g., "hero.title")}

**English Translation**: {Ask user for English text}

**Context**: {Ask user for context - where will this be used?}

The agent will:
1. Add key to `public/locales/en/common.json`
2. Generate Spanish translation (es-ES for Spain market)
3. Generate French translation (Swiss French considerations)
4. Validate JSON syntax
5. Check for duplicate keys
6. Update all locale files atomically

---

**Spanish Considerations**:
- Spain Spanish (es-ES) vocabulary: "ordenador" not "computadora"
- Formal "usted" vs informal "tú" based on context
- Professional tone for CV content

**French Considerations**:
- Swiss French preferences
- Professional terminology
- Accent handling (é, è, ê, etc.)

---

**Usage**:
```
/i18n-add
```

Claude will prompt for key, English text, and context, then update all locale files.
