---
name: seo-check
description: Quick SEO validation for Swiss/Spanish markets with structured data checks
---

# SEO Quick Check

Validate SEO optimization for Swiss and Spanish markets.

## Task

Activate the `seo-optimizer` agent to perform comprehensive SEO audit:

**Checks Performed**:

### 1. Structured Data (JSON-LD)
- [ ] Person schema on homepage
- [ ] JobPosting schema for experience
- [ ] CreativeWork schema for projects
- [ ] Valid Schema.org syntax
- [ ] Swiss market fields (Zurich, Canton ZH, CHF)
- [ ] Spanish market fields (Barcelona, EUR)

### 2. Meta Tags
- [ ] Title tags optimized (<60 chars)
- [ ] Meta descriptions (<160 chars)
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] Canonical URLs

### 3. Hreflang Tags
- [ ] English: `<link rel="alternate" hreflang="en" />`
- [ ] Spanish: `<link rel="alternate" hreflang="es" />`
- [ ] French: `<link rel="alternate" hreflang="fr" />`
- [ ] Default: `<link rel="alternate" hreflang="x-default" />`

### 4. Sitemap
- [ ] `public/sitemap.xml` exists
- [ ] All routes included (en/es/fr)
- [ ] Valid XML syntax
- [ ] Last modified dates

### 5. Performance SEO
- [ ] Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Lighthouse Performance score ≥90
- [ ] Mobile-friendly test

---

**Validation Script**:

Run the structured data validator:
```bash
node scripts/validate-structured-data.js
```

Test with Google Rich Results:
https://search.google.com/test/rich-results

---

**Usage**:
```
/seo-check
```

Claude will run all checks and report issues with specific fixes.
