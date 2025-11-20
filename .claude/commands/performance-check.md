---
name: performance-check
description: Quick Core Web Vitals and Lighthouse performance audit
---

# Performance Quick Check

Run Lighthouse audit and Core Web Vitals validation.

## Task

Activate the `lighthouse-optimizer` agent to perform performance audit.

**Prerequisites**:
```bash
npm run build
npm run preview
```

**Lighthouse Audit**:
```bash
npm run a11y:audit
```

Or manually:
```bash
lighthouse http://localhost:4321 --view
```

---

## Core Web Vitals Targets

| Metric | Target | Good | Needs Improvement | Poor |
|--------|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | <2.5s | <2.5s | 2.5-4.0s | >4.0s |
| **FID** (First Input Delay) | <100ms | <100ms | 100-300ms | >300ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | <0.1 | 0.1-0.25 | >0.25 |
| **Performance Score** | ≥90 | ≥90 | 50-89 | <50 |

---

## Quick Fixes by Metric

### LCP Issues
- **Problem**: Large unoptimized images
- **Fix**: `npm run generate-images` (Sharp optimization)

- **Problem**: No preload for critical resources
- **Fix**: Add `<link rel="preload" href="/images/hero.webp" as="image" />`

- **Problem**: Render-blocking CSS/JS
- **Fix**: Use client:idle for non-critical React components

### FID Issues
- **Problem**: Too much JavaScript
- **Fix**: Minimize `client:load`, use `client:idle`

- **Problem**: Heavy React hydration
- **Fix**: Convert static components to Astro

### CLS Issues
- **Problem**: Images without dimensions
- **Fix**: Add `width` and `height` attributes

- **Problem**: Late-loading fonts
- **Fix**: Preload fonts: `<link rel="preload" href="/fonts/inter.woff2" as="font" />`

- **Problem**: Dynamic content shifting
- **Fix**: Use CSS aspect-ratio or min-height

---

## Automated Checks

**Build and Audit**:
```bash
npm run build && npm run preview
npm run a11y:audit
```

**Image Optimization**:
```bash
npm run generate-images
```

**Font Subsetting** (if Font Awesome used):
```bash
npm run setup:font-awesome
```

**astro-compress** (should be auto-enabled in production build):
Check `astro.config.mjs` for `astro-compress` in `integrations`

---

## Expected Results

**Good Performance**:
- Performance score: 90-100
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1
- All images optimized (WebP generated)
- Critical resources preloaded
- Minimal render-blocking resources

**If score <90**: The `lighthouse-optimizer` agent will provide specific fixes with file paths and line numbers.

---

**Usage**:
```
/performance-check
```

Claude will build, run Lighthouse, analyze results, and provide actionable fixes.
