# Astro Project Template

## Project Detection

**Detected when**: `astro.config.mjs` or `astro.config.ts` exists

## Tech Stack Context

```yaml
framework: Astro 5.x
rendering: SSG (Static Site Generation)
islands: React 18 (client:load, client:idle, client:visible)
styling: TailwindCSS
i18n: i18next with public/locales/{lang}/*.json
```

## Enhancement Patterns

### Component Creation

**Vague**: "create a hero component"

**Enhanced**:
```xml
<task>Create HeroSection.astro component</task>
<context>
  <location>src/components/HeroSection.astro</location>
  <stack>Astro 5.5, TypeScript frontmatter, TailwindCSS</stack>
  <pattern>Astro component with Props interface</pattern>
</context>
<requirements>
  - TypeScript Props interface in frontmatter
  - TailwindCSS for styling (no external CSS)
  - i18n support via t() helper from src/utils/i18n.js
  - Responsive design (mobile-first)
  - Semantic HTML5 structure
</requirements>
<output_format>
---
interface Props {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const { title, subtitle, backgroundImage } = Astro.props;
import { t } from '../utils/i18n';
---

<section class="...">
  <!-- Component markup -->
</section>
</output_format>
```

### Page Creation

**Vague**: "add a new page"

**Enhanced**:
```xml
<task>Create new page at src/pages/{route}.astro</task>
<context>
  <routing>File-based routing in src/pages/</routing>
  <layout>Use Layout.astro from src/layouts/</layout>
  <seo>Include SEO component with meta tags</seo>
</context>
<requirements>
  - Import and use Layout.astro
  - Add SEO component with title, description, canonical
  - Follow existing page patterns in src/pages/
  - Support i18n if multilingual site
</requirements>
<validation>
  - Page renders at expected URL
  - SEO meta tags present
  - No console errors
  - Lighthouse score >= 90
</validation>
```

### React Island Integration

**Vague**: "add interactivity to the form"

**Enhanced**:
```xml
<task>Convert static form to React island with client:visible</task>
<context>
  <file>src/components/ContactForm.tsx</file>
  <hydration>client:visible (hydrate when visible in viewport)</hydration>
  <pattern>React functional component with hooks</pattern>
</context>
<requirements>
  - Create .tsx file for React component
  - Use client:visible for performance (lazy hydration)
  - TypeScript Props interface
  - Handle form state with useState
  - Form validation before submit
</requirements>
<usage_in_astro>
---
import ContactForm from '../components/ContactForm';
---
<ContactForm client:visible />
</usage_in_astro>
<hydration_options>
  - client:load: Immediate (SSR + hydration)
  - client:idle: When browser idle
  - client:visible: When in viewport (recommended for below-fold)
  - client:media="(query)": When media query matches
  - client:only="react": No SSR, client-only
</hydration_options>
```

### i18n Translation

**Vague**: "translate the component"

**Enhanced**:
```xml
<task>Add i18n translations for component text</task>
<context>
  <locales>public/locales/{en,es,fr}/common.json</locales>
  <helper>t() from src/utils/i18n.js</helper>
  <pattern>JSON key-value with nested namespaces</pattern>
</context>
<steps>
1. Add translation keys to public/locales/en/common.json
2. Add Spanish translations to public/locales/es/common.json
3. Add French translations to public/locales/fr/common.json
4. Import t() helper in component
5. Replace hardcoded text with t('key')
</steps>
<example>
// Before
<h1>Welcome</h1>

// After
import { t } from '../utils/i18n';
<h1>{t('hero.welcome')}</h1>
</example>
<validation>
  - All 3 locale files updated
  - No missing translation keys
  - Component renders in all languages
</validation>
```

### SEO Optimization

**Vague**: "improve SEO"

**Enhanced**:
```xml
<task>Optimize SEO for page/component</task>
<context>
  <seo_component>src/components/SEO.jsx</seo_component>
  <targets>Swiss (Zurich) and Spanish markets</targets>
  <requirements>hreflang, structured data, canonical URLs</requirements>
</context>
<checklist>
  - Meta title (50-60 chars)
  - Meta description (150-160 chars)
  - Canonical URL (absolute, correct language)
  - hreflang tags for all language versions
  - Open Graph tags (og:title, og:description, og:image)
  - Structured data (JSON-LD) for page type
  - Sitemap inclusion
</checklist>
<structured_data_example>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "...",
  "jobTitle": "...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Zurich",
    "addressCountry": "CH"
  }
}
</script>
</structured_data_example>
```

### Performance Optimization

**Vague**: "make it faster"

**Enhanced**:
```xml
<task>Optimize Lighthouse performance score</task>
<context>
  <current_score>Run: npx lighthouse {url} --output=json</current_score>
  <targets>LCP < 2.5s, FID < 100ms, CLS < 0.1</targets>
</context>
<optimization_areas>
  1. Images:
     - Use Astro Image component
     - WebP format with fallback
     - Responsive sizes
     - Lazy loading for below-fold
  2. CSS:
     - TailwindCSS purge enabled
     - No render-blocking CSS
     - Critical CSS inlined
  3. JavaScript:
     - Minimal client-side JS
     - Use client:visible for lazy hydration
     - No unnecessary React islands
  4. Fonts:
     - Preload critical fonts
     - Font-display: swap
     - Self-host if possible
</optimization_areas>
<validation>
  - Run: npm run build && npx lighthouse dist/index.html
  - Target: Performance >= 90
</validation>
```

## Forbidden Patterns

```yaml
never_do:
  - Import React components without client:* directive
  - Use external CSS files (use TailwindCSS)
  - Fetch data in components (fetch in page frontmatter)
  - Create .jsx files (use .tsx for type safety)
  - Skip SEO component on pages
  - Hardcode text without i18n
```

## File Structure Reference

```
src/
├── components/
│   ├── *.astro        # Static components (default)
│   └── *.tsx          # React islands (need client:*)
├── layouts/
│   └── Layout.astro   # Main layout with SEO
├── pages/
│   ├── index.astro    # Homepage
│   └── [lang]/        # i18n routes
├── data/
│   └── *.js           # Static data files
└── utils/
    ├── i18n.js        # Translation helper
    └── seo.ts         # SEO utilities
public/
└── locales/
    ├── en/common.json
    ├── es/common.json
    └── fr/common.json
```

---

*Template for Astro projects - prompt-engineer skill*
