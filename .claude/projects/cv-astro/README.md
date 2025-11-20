# CV_Astro Project Context

**Project**: Oriol Macías Portfolio Website
**Type**: Personal CV/Portfolio with Swiss & Spanish SEO optimization
**Version**: 0.1.0

---

## Quick Overview

**Stack**:
- **Framework**: Astro 5.5.2 (Static Site Generation)
- **UI Library**: React 18.2.0 + TypeScript
- **Styling**: TailwindCSS 3.4.1
- **i18n**: i18next + astro-i18next (en/es/fr)
- **PWA**: @vite-pwa/astro
- **Build**: Vite + astro-compress
- **Testing**: @testing-library/react + jest-dom

**Key Features**:
- Multi-language support (English, Spanish, French)
- Swiss & Spanish market SEO optimization
- Progressive Web App capabilities
- Accessibility-first design (a11y audits)
- Performance-optimized (Lighthouse audits)
- Structured data (JSON-LD) for SEO
- Responsive images generation
- Font Awesome icon optimization

---

## Project Structure

```
CV_Astro/
├── src/
│   ├── pages/           # Astro pages (routing)
│   ├── layouts/         # Layout components
│   ├── components/      # React/Astro components
│   ├── utils/           # Utility functions
│   ├── contexts/        # React contexts
│   ├── styles/          # Global styles
│   └── assets/          # Static assets
├── public/              # Public static files
│   ├── styles/          # Generated CSS
│   └── locales/         # i18n translation files
├── scripts/             # Build/dev scripts
│   ├── font-awesome-setup.js
│   ├── generate-profile-images.js
│   ├── check-contrast.js
│   ├── check-translations.js
│   └── validate-structured-data.js
└── astro.config.mjs     # Astro configuration
```

---

## Loading This Context

**Command**: `/load-project cv-astro`

**Auto-loads**:
1. README.md (this file)
2. core/architecture.md - Astro patterns, component guidelines
3. core/i18n.md - Translation management workflows
4. core/seo.md - Swiss/Spanish SEO best practices
5. core/workflows.md - Common development tasks

**Total**: ~2,000 tokens, <2 seconds to load

---

## Quick Commands

After loading this context, you can use:

- Component generation: "Create responsive profile component"
- i18n workflow: "Add French translation for contact section"
- SEO optimization: "Update structured data for job posting"
- Performance: "Optimize Core Web Vitals"

---

## Development Workflows

**See**: `core/workflows.md` for detailed workflows including:
- Component creation (Astro + React)
- Translation management (en/es/fr)
- SEO validation (structured data, sitemap)
- Performance optimization (Lighthouse, bundle analysis)
- Accessibility auditing (contrast, a11y)

---

## Best Practices

**See**: `core/architecture.md` for:
- Astro component patterns
- React integration guidelines
- TypeScript conventions
- Styling with TailwindCSS

**See**: `core/i18n.md` for:
- Translation key naming
- Locale file structure
- Language detection

**See**: `core/seo.md` for:
- Swiss market optimization
- Spanish market support
- Structured data patterns
- Sitemap generation
