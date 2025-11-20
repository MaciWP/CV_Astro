---
name: astro-seo-validator
description: Validate SEO elements (meta tags, hreflang, canonical, sitemap) for Astro pages
activation:
  keywords:
    - seo validation
    - meta tags
    - hreflang
    - canonical url
    - sitemap
  triggers:
    - "check seo"
    - "validate seo"
  auto_load_project: cv-astro
---

# Astro SEO Validator

## What This Is

Validate SEO elements in Astro pages:
- Meta tags (title, description, OG, Twitter)
- Hreflang tags for multi-language
- Canonical URLs
- Structured data (JSON-LD)
- Sitemap generation and validation

**For**: CV_Astro project (Swiss & Spanish SEO)

---

## When to Activate

Auto-activates when keywords detected:
- "validate seo"
- "check meta tags"
- "verify hreflang"
- "sitemap validation"

Manual: `npm run check:seo`

---

## SEO Validation Checklist

### 1. Meta Tags

**Required on every page**:
```astro
<head>
  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="author" content="Oriol Macías" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={Astro.url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={Astro.url} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={image} />
</head>
```

---

### 2. Hreflang Tags

**For multi-language sites**:
```astro
<head>
  <!-- English (default) -->
  <link rel="alternate" hreflang="en" href="https://oriolmacias.dev/" />

  <!-- Spanish -->
  <link rel="alternate" hreflang="es" href="https://oriolmacias.dev/es/" />

  <!-- French -->
  <link rel="alternate" hreflang="fr" href="https://oriolmacias.dev/fr/" />

  <!-- Default fallback -->
  <link rel="alternate" hreflang="x-default" href="https://oriolmacias.dev/" />
</head>
```

---

### 3. Canonical URL

**Every page must have one**:
```astro
<head>
  <link rel="canonical" href={Astro.url.href} />
</head>
```

---

### 4. Sitemap Validation

**Check**:
- [ ] `/sitemap.xml` exists
- [ ] All pages included
- [ ] Hreflang alternates for each URL
- [ ] Valid XML syntax
- [ ] Submitted to Google Search Console

---

## Validation Script

**File**: `scripts/validate-seo.js`

```javascript
import fs from 'fs';
import { glob } from 'glob';

const REQUIRED_META_TAGS = [
  'title',
  'description',
  'og:title',
  'og:description',
  'og:image',
  'twitter:card'
];

async function validateSEO() {
  const pages = await glob('src/pages/**/*.astro');
  const errors = [];

  for (const page of pages) {
    const content = fs.readFileSync(page, 'utf-8');

    // Check meta tags
    REQUIRED_META_TAGS.forEach(tag => {
      const hasTag = tag === 'title'
        ? content.includes('<title>')
        : content.includes(`name="${tag}"`) || content.includes(`property="${tag}"`);

      if (!hasTag) {
        errors.push(`${page}: Missing ${tag}`);
      }
    });

    // Check canonical
    if (!content.includes('rel="canonical"')) {
      errors.push(`${page}: Missing canonical URL`);
    }

    // Check hreflang
    if (!content.includes('hreflang')) {
      errors.push(`${page}: Missing hreflang tags`);
    }
  }

  // Check sitemap
  if (!fs.existsSync('public/sitemap.xml')) {
    errors.push('Sitemap missing: public/sitemap.xml');
  }

  // Report
  if (errors.length > 0) {
    console.error('❌ SEO Validation Errors:\n');
    errors.forEach(err => console.error(`  ${err}`));
    process.exit(1);
  } else {
    console.log('✅ All SEO elements valid');
  }
}

validateSEO();
```

**Add to package.json**:
```json
{
  "scripts": {
    "check:seo": "node scripts/validate-seo.js"
  }
}
```

---

## Quick Reference

| Element | Required | Example |
|---------|----------|---------|
| **Title** | ✅ | `<title>{title}</title>` |
| **Description** | ✅ | `<meta name="description" content={desc} />` |
| **Canonical** | ✅ | `<link rel="canonical" href={url} />` |
| **Hreflang** | ✅ (i18n) | `<link rel="alternate" hreflang="es" />` |
| **OG Tags** | ✅ | `<meta property="og:title" />` |
| **Twitter** | ✅ | `<meta property="twitter:card" />` |
| **Sitemap** | ✅ | `/sitemap.xml` |
