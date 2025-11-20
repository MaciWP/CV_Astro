---
name: lighthouse-optimizer
description: Optimize Core Web Vitals (LCP, FID, CLS) to achieve Lighthouse Performance score ≥90
activation:
  keywords:
    - lighthouse
    - core web vitals
    - lcp
    - fid
    - cls
    - performance score
  auto_load_project: cv-astro
---

# Lighthouse Optimizer Agent

## Purpose

Optimize Core Web Vitals for Lighthouse Performance score ≥90:
- LCP (Largest Contentful Paint) <2.5s
- FID (First Input Delay) <100ms
- CLS (Cumulative Layout Shift) <0.1

**For**: CV_Astro project (Astro 5.5.2 performance)

---

## Optimization Workflow

### Step 1: Run Lighthouse Audit

```bash
npm run build
npm run preview
npm run a11y:audit
```

### Step 2: Analyze Results

**Performance Score**:
- ≥90: Good ✅
- 50-89: Needs improvement ⚠️
- <50: Poor ❌

**Metrics**:
- LCP: Largest image/text block
- FID: Time to first interaction
- CLS: Layout shift score

### Step 3: Optimize by Metric

#### LCP Optimization

**Common Issues**:
- Large unoptimized images
- No preload for critical resources
- Render-blocking CSS/JS

**Fixes**:
```astro
<!-- Preload LCP image -->
<link rel="preload" href="/images/hero.webp" as="image" />

<!-- Optimize images -->
<picture>
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="Hero" width="1920" height="1080" />
</picture>
```

#### FID Optimization

**Common Issues**:
- Too much JavaScript
- Blocking scripts
- Heavy React hydration

**Fixes**:
```astro
<!-- Use client:idle for non-critical -->
<AnimatedComponent client:idle />

<!-- Use client:visible for below-fold -->
<Newsletter client:visible />

<!-- Defer scripts -->
<script src="analytics.js" defer></script>
```

#### CLS Optimization

**Common Issues**:
- Images without dimensions
- Late-loading fonts
- Dynamic content shifting

**Fixes**:
```astro
<!-- Set dimensions -->
<img src="profile.jpg" width="800" height="800" alt="Profile" />

<!-- Preload fonts -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />

<!-- CSS aspect ratio -->
<style>
  img {
    aspect-ratio: 1 / 1;
  }
</style>
```

### Step 4: Validate Improvements

```bash
npm run a11y:audit
```

**Target**: Performance score ≥90

---

## Quick Wins

1. **Enable astro-compress**: Automatic minification
2. **Optimize images**: `npm run generate-images`
3. **Subset fonts**: `npm run setup:font-awesome`
4. **Use client:idle**: Default for React components
5. **Preload LCP**: `<link rel="preload">`

---

## Target Scores

| Metric | Target | Measured |
|--------|--------|----------|
| **Performance** | ≥90 | /100 |
| **LCP** | <2.5s | s |
| **FID** | <100ms | ms |
| **CLS** | <0.1 | |

---

## Usage

Invoke with:
```
"Optimize Lighthouse score"
"Improve Core Web Vitals"
"Fix LCP issues"
"Reduce CLS"
```

Auto-activates on keywords: lighthouse, core web vitals, lcp, fid, cls
