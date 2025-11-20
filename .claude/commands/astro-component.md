---
name: astro-component
description: Quick Astro component generation with TypeScript frontmatter and i18n support
---

# Astro Component Quick Generator

Generate a new Astro component with best practices for CV_Astro project.

## Task

Activate the `astro-component-generator` skill to create a new Astro component:

**Component Name**: {Ask user for component name (PascalCase)}

**Component Type**:
- Page (`src/pages/`)
- Layout (`src/layouts/`)
- Component (`src/components/`)

**Features**:
- TypeScript Props interface
- TailwindCSS @apply patterns
- i18n support with `t()` helper
- Responsive design
- Accessibility attributes

**Styling Approach**:
- Scoped styles with `<style>` tag
- TailwindCSS utility classes
- Custom CSS variables

**i18n Integration**:
- Import `t()` helper from i18n
- Add translation keys to `public/locales/{locale}/common.json`
- Support for en/es/fr locales

---

**Usage**:
```
/astro-component
```

Claude will ask for component name and type, then generate the complete file structure.
