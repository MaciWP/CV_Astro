---
name: lighthouse-performance-optimizer
description: Optimize Core Web Vitals (LCP, FID, CLS) for Lighthouse performance score
activation:
  keywords:
    - lighthouse
    - core web vitals
    - lcp
    - fid
    - cls
    - performance
  triggers:
    - "lighthouse score"
    - "web vitals"
  auto_load_project: cv-astro
---

# Lighthouse Performance Optimizer

## What This Is

Optimize Core Web Vitals for Lighthouse score ≥90:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- Overall Performance score ≥90

**For**: CV_Astro project (Astro 5.5.2 performance optimization)

---

## When to Activate

Auto-activates when keywords detected:
- "lighthouse optimization"
- "improve core web vitals"
- "lcp too slow"
- "performance score"

Manual: `npm run a11y:audit`

---

## Core Web Vitals

### 1. LCP (Largest Contentful Paint)

**Target**: <2.5s

**Common issues**:
- Large images not optimized
- No preload for critical resources
- Render-blocking resources

**Fixes**:

**Preload critical images**:
```astro
<head>
  <link rel="preload" href="/images/hero-desktop.webp" as="image" />
</head>
```

**Optimize images**:
```bash
npm run generate-images
```

**Use WebP format**:
```astro
<picture>
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="Hero" />
</picture>
```

**Lazy load below-fold images**:
```astro
<img src="..." loading="lazy" />
```

---

### 2. FID (First Input Delay)

**Target**: <100ms

**Common issues**:
- Too much JavaScript on initial load
- Blocking scripts
- Heavy React hydration

**Fixes**:

**Use client:idle for non-critical components**:
```astro
<AnimatedComponent client:idle />
```

**Use client:visible for below-fold**:
```astro
<Newsletter client:visible />
```

**Defer non-critical scripts**:
```html
<script src="analytics.js" defer></script>
```

---

### 3. CLS (Cumulative Layout Shift)

**Target**: <0.1

**Common issues**:
- Images without dimensions
- Fonts loading late (FOIT/FOUT)
- Ads/embeds shifting layout

**Fixes**:

**Set image dimensions**:
```astro
<img
  src="profile.jpg"
  alt="Profile"
  width="800"
  height="800"
  loading="lazy"
/>

<style>
  img {
    aspect-ratio: 1 / 1; /* Prevents shift */
  }
</style>
```

**Preload fonts**:
```astro
<head>
  <link
    rel="preload"
    href="/fonts/inter.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>
```

**Font display strategy**:
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap; /* Prevents invisible text */
}
```

**Reserve space for dynamic content**:
```css
.skeleton {
  min-height: 200px; /* Reserve space */
}
```

---

## Lighthouse Audit Script

**Run audit**:
```bash
npm run build
npm run preview

# In another terminal
npm run a11y:audit
```

**package.json**:
```json
{
  "scripts": {
    "a11y:audit": "lighthouse http://localhost:4321 --output-path=./lighthouse-report.html --view"
  }
}
```

---

## Performance Checklist

### ✅ Images

- [ ] All images optimized (WebP)
- [ ] Multiple sizes generated (srcset)
- [ ] LCP image preloaded
- [ ] Below-fold images lazy loaded
- [ ] Dimensions specified (width/height)

### ✅ JavaScript

- [ ] Critical components use client:load
- [ ] Non-critical use client:idle
- [ ] Below-fold use client:visible
- [ ] Bundle size minimized
- [ ] No blocking scripts

### ✅ Fonts

- [ ] Fonts preloaded
- [ ] font-display: swap
- [ ] Subsetting applied
- [ ] WOFF2 format used

### ✅ CSS

- [ ] Critical CSS inlined
- [ ] Non-critical CSS deferred
- [ ] Unused CSS removed
- [ ] astro-compress enabled

### ✅ Other

- [ ] HTTPS enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] CDN configured
- [ ] Caching headers set

---

## Quick Wins

**1. Enable astro-compress**:
```javascript
// astro.config.mjs
import compress from 'astro-compress';

export default defineConfig({
  integrations: [compress()]
});
```

**2. Optimize Font Awesome**:
```bash
npm run setup:font-awesome
```

**3. Generate responsive images**:
```bash
npm run generate-images
```

**4. Use client:idle by default**:
```astro
<ReactComponent client:idle />
```

**5. Preload LCP image**:
```astro
<link rel="preload" href="/images/hero.webp" as="image" />
```

---

## Target Scores

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| **Performance** | ≥90 | 50-89 | <50 |
| **LCP** | <2.5s | 2.5-4s | >4s |
| **FID** | <100ms | 100-300ms | >300ms |
| **CLS** | <0.1 | 0.1-0.25 | >0.25 |

---

## Quick Reference

| Optimization | Command | Impact |
|--------------|---------|--------|
| **Image optimization** | `npm run generate-images` | 🔥🔥🔥 |
| **Font subsetting** | `npm run setup:font-awesome` | 🔥🔥 |
| **Compression** | Enable astro-compress | 🔥🔥 |
| **Client directives** | Use client:idle | 🔥🔥 |
| **Preload LCP** | `<link rel="preload">` | 🔥🔥🔥 |
