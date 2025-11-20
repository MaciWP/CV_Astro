# SEO Optimization - CV_Astro

## Overview

**Target Markets**:
- 🇨🇭 Switzerland (primary)
- 🇪🇸 Spain (secondary)
- 🌍 Global (tertiary)

**SEO Strategy**:
- Structured data (JSON-LD) for rich snippets
- Multi-language support (en/es/fr)
- Sitemap with all routes
- Performance optimization (Core Web Vitals)
- Accessibility-first (WCAG 2.1 AA)

---

## Configuration

### Site Configuration

**File**: `astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://oriolmacias.dev',

  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    define: {
      __SWISS_SEO_ENABLED__: process.env.SWISS_SEO_ENABLED === 'true',
      __SPANISH_SEO_ENABLED__: true,
      __SITE_URL__: JSON.stringify(process.env.SITE_URL || 'https://oriolmacias.dev')
    },
  },
});
```

### Environment Variables

**File**: `.env` (create if doesn't exist)

```bash
SITE_URL=https://oriolmacias.dev
SWISS_SEO_ENABLED=true
SPANISH_SEO_ENABLED=true
NODE_ENV=production
```

---

## Structured Data (JSON-LD)

### Person Schema (Homepage)

```astro
---
// src/pages/index.astro
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Oriol Macías",
  "url": "https://oriolmacias.dev",
  "image": "https://oriolmacias.dev/images/profile.jpg",
  "sameAs": [
    "https://linkedin.com/in/oriol-macias",
    "https://github.com/oriolmacias"
  ],
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Company Name"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Zurich",
    "addressCountry": "CH"
  },
  "knowsAbout": [
    "Web Development",
    "TypeScript",
    "React",
    "Astro",
    "Node.js"
  ],
  "knowsLanguage": [
    {
      "@type": "Language",
      "name": "English",
      "alternateName": "en"
    },
    {
      "@type": "Language",
      "name": "Spanish",
      "alternateName": "es"
    },
    {
      "@type": "Language",
      "name": "French",
      "alternateName": "fr"
    }
  ]
};
---

<head>
  <script type="application/ld+json" set:html={JSON.stringify(personSchema)} />
</head>
```

### Job Posting Schema

**Component**: `src/components/JobPostingSchema.jsx`

```jsx
// For experience/portfolio sections
export const JobPostingSchema = ({ job }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.startDate,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": job.companyWebsite
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location.city,
        "addressCountry": job.location.country
      }
    },
    "employmentType": job.employmentType, // "FULL_TIME", "PART_TIME", "CONTRACTOR"
    "skills": job.skills
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

### Portfolio Project Schema

```astro
---
const projectSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Project Name",
  "description": "Project description",
  "url": "https://project-url.com",
  "creator": {
    "@type": "Person",
    "name": "Oriol Macías"
  },
  "dateCreated": "2024-01-01",
  "keywords": ["React", "TypeScript", "Tailwind"],
  "image": "https://oriolmacias.dev/projects/screenshot.jpg"
};
---
```

### Validation

**Script**: `scripts/validate-structured-data.js`

```bash
npm run check:structured-data
```

**Checks**:
- Valid JSON-LD syntax
- Required properties present
- Schema.org vocabulary compliance
- No duplicate schemas on same page

---

## Sitemap Generation

### Configuration

**Integration**: `@astrojs/sitemap`

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://oriolmacias.dev',
  integrations: [sitemap()],
});
```

### Custom Sitemap

**File**: `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Homepage (all languages) -->
  <url>
    <loc>https://oriolmacias.dev/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://oriolmacias.dev/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://oriolmacias.dev/es/" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://oriolmacias.dev/fr/" />
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About page (all languages) -->
  <url>
    <loc>https://oriolmacias.dev/about</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://oriolmacias.dev/about" />
    <xhtml:link rel="alternate" hreflang="es" href="https://oriolmacias.dev/es/about" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://oriolmacias.dev/fr/about" />
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Add all routes... -->
</urlset>
```

### Sitemap Priority Guide

| Page Type | Priority | Change Frequency |
|-----------|----------|------------------|
| Homepage | 1.0 | weekly |
| About | 0.8 | monthly |
| Experience | 0.7 | monthly |
| Projects | 0.9 | weekly |
| Contact | 0.6 | yearly |
| Blog posts | 0.8 | never |

---

## Meta Tags

### Essential Meta Tags

```astro
---
import { t, changeLanguage } from 'i18next';

const locale = Astro.currentLocale || 'en';
changeLanguage(locale);

const title = t('seo:page.title');
const description = t('seo:page.description');
const image = `https://oriolmacias.dev/images/og-${locale}.jpg`;
---

<head>
  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <meta name="author" content="Oriol Macías" />
  <meta name="robots" content="index, follow" />
  <meta name="language" content={locale} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={Astro.url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:locale" content={locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : 'fr_FR'} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={Astro.url} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={image} />

  <!-- Alternate Languages -->
  <link rel="alternate" hreflang="en" href="https://oriolmacias.dev/" />
  <link rel="alternate" hreflang="es" href="https://oriolmacias.dev/es/" />
  <link rel="alternate" hreflang="fr" href="https://oriolmacias.dev/fr/" />
  <link rel="alternate" hreflang="x-default" href="https://oriolmacias.dev/" />

  <!-- Canonical -->
  <link rel="canonical" href={Astro.url.href} />
</head>
```

---

## Swiss Market Optimization

### Switzerland-Specific Considerations

**Languages**: German (62%), French (23%), Italian (8%), Romansh (0.5%)

**Current support**: French (fr) - covers Swiss French market

**SEO Signals**:
```astro
---
const swissOptimization = {
  address: {
    "@type": "PostalAddress",
    "addressLocality": "Zurich", // or Geneva, Basel
    "addressRegion": "ZH", // Canton code
    "addressCountry": "CH"
  },
  areaServed: {
    "@type": "Country",
    "name": "Switzerland"
  },
  currency: "CHF",
  priceRange: "CHF"
};
---
```

### Swiss German Support (Future)

**If targeting Swiss German market**:
```javascript
// astro.config.mjs
i18n: {
  locales: ["en", "es", "fr", "de"],
  // de = Standard German, also understood in Switzerland
}
```

**Note**: Swiss German (Schwyzerdütsch) is spoken dialect, Standard German (Hochdeutsch) is written.

---

## Spanish Market Optimization

### Spain-Specific SEO

**Language**: Spanish (es-ES)

**SEO Signals**:
```astro
---
const spanishOptimization = {
  address: {
    "@type": "PostalAddress",
    "addressCountry": "ES"
  },
  areaServed: [
    {
      "@type": "Country",
      "name": "Spain"
    },
    {
      "@type": "Country",
      "name": "Switzerland"
    }
  ]
};
---
```

### Spanish Market Keywords

**Tech industry common terms**:
- "Desarrollador Full Stack"
- "Ingeniero de Software"
- "Programador Web"
- "Desarrollador Frontend/Backend"

**Translation file**: `public/locales/es/seo.json`

---

## Performance Optimization (SEO Impact)

### Core Web Vitals

**Target metrics**:
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

**Tools**:
```bash
# Lighthouse audit
npm run a11y:audit

# Analyze bundle
npm run analyze
```

### Image Optimization

**Responsive images**:
```astro
---
import ResponsiveProfileImage from '../components/ResponsiveProfileImage.tsx';
---

<ResponsiveProfileImage
  src="/images/profile.jpg"
  alt="Oriol Macías - Full Stack Developer"
  width={800}
  height={800}
  loading="lazy"
  decoding="async"
/>
```

**Generate WebP versions**:
```bash
npm run generate-images
```

### Font Loading

**Font Awesome optimization**:
```bash
npm run setup:font-awesome
# → Loads only used icons
# → Generates subset fonts
```

**Font display strategy**:
```css
@font-face {
  font-family: 'FontAwesome';
  font-display: swap; /* Prevents invisible text */
  src: url('/fonts/fontawesome.woff2') format('woff2');
}
```

---

## Headers Configuration

**File**: `public/_headers`

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

# Cache static assets
/images/*
  Cache-Control: public, max-age=31536000, immutable

/styles/*
  Cache-Control: public, max-age=31536000, immutable

# Don't cache HTML
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

---

## SEO Checklist

### Pre-Launch

- [ ] Sitemap generated and submitted to Google/Bing
- [ ] Structured data validated (no errors in Rich Results Test)
- [ ] All pages have unique title/description
- [ ] Canonical URLs set correctly
- [ ] Hreflang tags for all language versions
- [ ] Robots.txt configured
- [ ] 404 page exists
- [ ] HTTPS enforced
- [ ] Performance: LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Mobile-friendly (responsive design)
- [ ] Accessibility: WCAG 2.1 AA compliant

### Post-Launch

- [ ] Google Search Console verified
- [ ] Google Analytics configured
- [ ] Bing Webmaster Tools verified
- [ ] Schema.org markup in Google Rich Results
- [ ] Sitemap indexed
- [ ] Core Web Vitals passing
- [ ] Backlinks from LinkedIn, GitHub
- [ ] Social media Open Graph working

---

## Testing SEO

### Structured Data Testing

**Google Rich Results Test**:
```
https://search.google.com/test/rich-results
```

**Schema Markup Validator**:
```
https://validator.schema.org/
```

**Internal validation**:
```bash
npm run check:structured-data
```

### Performance Testing

**Lighthouse CI**:
```bash
npm run a11y:audit
# → Generates lighthouse-report.html
```

**PageSpeed Insights**:
```
https://pagespeed.web.dev/
```

### Accessibility Testing

**Color contrast**:
```bash
npm run check:contrast
```

**Automated a11y**:
```bash
npm run a11y
```

---

## Common SEO Issues

### ❌ Issue: Duplicate Content

**Symptom**: Same content on multiple URLs

**Fix**:
```astro
<!-- Add canonical tag -->
<link rel="canonical" href="https://oriolmacias.dev/about" />
```

### ❌ Issue: Missing Hreflang

**Symptom**: Wrong language version shown in search results

**Fix**:
```astro
<link rel="alternate" hreflang="en" href="https://oriolmacias.dev/" />
<link rel="alternate" hreflang="es" href="https://oriolmacias.dev/es/" />
<link rel="alternate" hreflang="fr" href="https://oriolmacias.dev/fr/" />
<link rel="alternate" hreflang="x-default" href="https://oriolmacias.dev/" />
```

### ❌ Issue: Slow LCP

**Symptom**: Largest Contentful Paint >2.5s

**Fix**:
1. Optimize images: `npm run generate-images`
2. Preload critical resources:
   ```html
   <link rel="preload" href="/images/hero.webp" as="image" />
   ```
3. Use `astro-compress` for minification

### ❌ Issue: Invalid Structured Data

**Symptom**: Errors in Google Rich Results Test

**Fix**:
```bash
npm run check:structured-data
# → Fix reported errors in components
```

---

## Quick Reference

| Task | Command/Tool |
|------|--------------|
| Validate structured data | `npm run check:structured-data` |
| Test rich results | [Google Rich Results Test](https://search.google.com/test/rich-results) |
| Check performance | `npm run a11y:audit` |
| Verify sitemap | `https://oriolmacias.dev/sitemap.xml` |
| Test mobile-friendly | [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) |
| Analyze Core Web Vitals | [PageSpeed Insights](https://pagespeed.web.dev/) |

---

## SEO Resources

**Switzerland SEO**:
- [Swiss Search Engine Market Share](https://gs.statcounter.com/search-engine-market-share/all/switzerland)
- Google.ch (Switzerland)
- Bing.ch

**Spain SEO**:
- [Spanish Search Engine Market Share](https://gs.statcounter.com/search-engine-market-share/all/spain)
- Google.es (Spain)

**Tools**:
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Schema.org](https://schema.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
