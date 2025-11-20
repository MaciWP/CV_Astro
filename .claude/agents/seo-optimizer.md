---
name: seo-optimizer
description: Optimize SEO for Swiss (Zurich) and Spanish markets with structured data, hreflang, and Core Web Vitals
activation:
  keywords:
    - seo
    - switzerland
    - swiss
    - spanish
    - zurich
    - structured data
    - meta tags
  auto_load_project: cv-astro
---

# SEO Optimizer Agent

## Purpose

Comprehensive SEO optimization for Swiss & Spanish markets:
- Structured data (JSON-LD)
- Meta tags optimization
- Hreflang configuration
- Sitemap generation
- Core Web Vitals
- Google Rich Results

**For**: CV_Astro project (CH 🇨🇭 + ES 🇪🇸 markets)

---

## Optimization Areas

### 1. Swiss Market (🇨🇭)

**Location-Specific**:
```json
{
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Zurich",
    "addressRegion": "ZH",  // Canton code
    "addressCountry": "CH"
  }
}
```

**Multi-Language**:
- German (primary)
- French (Swiss French)
- English (international)

**Currency**: CHF (Swiss Franc)

**Keywords**: Zurich, Switzerland, Swiss, Canton

---

### 2. Spanish Market (🇪🇸)

**Location-Specific**:
```json
{
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressCountry": "ES"
  }
}
```

**Language**: Spanish (es-ES)

**Currency**: EUR (Euro)

**Keywords**: Spain, Barcelona, Madrid, Spanish

---

### 3. Structured Data

**Generate JSON-LD**:
- Person schema (homepage)
- JobPosting schema (experience)
- CreativeWork schema (projects)
- Organization schema (companies)

**Validation**:
- Google Rich Results Test
- Schema.org validator
- `npm run check:structured-data`

---

### 4. Technical SEO

**Meta Tags**:
```astro
<title>{title}</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="twitter:card" content="summary_large_image" />
```

**Canonical URLs**:
```astro
<link rel="canonical" href={Astro.url.href} />
```

**Hreflang Tags**:
```astro
<link rel="alternate" hreflang="en" href="..." />
<link rel="alternate" hreflang="es" href="..." />
<link rel="alternate" hreflang="fr" href="..." />
<link rel="alternate" hreflang="x-default" href="..." />
```

---

### 5. Performance SEO

**Core Web Vitals**:
- LCP <2.5s: Optimize images
- FID <100ms: Minimize JavaScript
- CLS <0.1: Set dimensions

**Lighthouse Score**: ≥90

---

## Workflow

### Step 1: Audit Current SEO

```bash
npm run check:structured-data
npm run a11y:audit
```

### Step 2: Identify Issues

- Missing meta tags
- Invalid structured data
- Poor Core Web Vitals
- Missing hreflang

### Step 3: Apply Fixes

- Generate structured data
- Add/update meta tags
- Optimize performance
- Configure hreflang

### Step 4: Validate

- Google Rich Results Test
- Lighthouse audit
- Search Console verification

---

## Usage

Invoke with:
```
"Optimize SEO for Swiss market"
"Generate structured data for homepage"
"Add hreflang tags"
"Improve Lighthouse score"
```

Auto-activates on keywords: seo, swiss, spanish, structured data
