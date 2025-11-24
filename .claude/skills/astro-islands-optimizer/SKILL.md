---
name: astro-islands-optimizer
description: Analyzes and optimizes Astro islands architecture for minimal client-side JavaScript, ensuring components use correct hydration directives based on interactivity requirements.
version: 1.0.0
tags: [astro, performance, react, islands]
---

# Astro Islands Architecture Optimizer

## Analysis Phase

### Step 1: Component Interactivity Audit
Scan all `.astro` and `.tsx` components to identify:
```bash
# Find all client: directives
rg "client:(load|idle|visible|media|only)" -g "*.astro" --json
```

**Classification Matrix**:
| Component | Current Directive | Recommended | Justification |
|-----------|-------------------|-------------|---------------|
| ThemeToggle | client:load | client:idle | Not critical for FCP |
| CookieBanner | client:load | client:idle | Can defer |
| ContactForm | client:load | client:visible | Below fold |

### Step 2: Bundle Impact Analysis
```bash
# Build and analyze
npm run build
# Check output for JavaScript bundle sizes
ls -lh dist/_astro/*.js
```

**Target**: < 50KB initial JavaScript bundle

### Step 3: Optimization Implementation

#### Pattern: Static-First with Progressive Enhancement
```astro
---
// Header.astro - BEFORE
import Navigation from '@components/Navigation.tsx';
---
<Navigation client:load /> <!-- ❌ Hydrates immediately -->

// AFTER
<Navigation client:idle /> <!-- ✅ Hydrates when idle -->
```

#### Pattern: Lazy Components
```astro
---
// Below-fold heavy component
import SkillsChart from '@components/SkillsChart.tsx';
---
<SkillsChart client:visible /> <!-- ✅ Only when visible -->
```

## Verification
- [ ] `npm run build` completes successfully
- [ ] Main bundle < 50KB (check dist folder)
- [ ] Lighthouse Performance score >= 95
- [ ] No hydration errors in browser console
