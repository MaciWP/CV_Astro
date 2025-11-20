---
name: pwa-auditor
description: Comprehensive PWA compliance audit (manifest, service worker, offline, icons)
activation:
  keywords:
    - pwa audit
    - pwa compliance
    - service worker
    - manifest validation
    - offline test
  auto_load_project: cv-astro
---

# PWA Auditor Agent

## Purpose

Comprehensive PWA compliance audit:
- Manifest.json validation
- Service worker checks
- Offline functionality testing
- Icon compliance
- HTTPS enforcement
- Lighthouse PWA score ≥90

**For**: CV_Astro project (@vite-pwa/astro)

---

## Audit Checklist

### 1. Manifest.json

**Required Fields**:
- [ ] name
- [ ] short_name
- [ ] description
- [ ] theme_color
- [ ] background_color
- [ ] display (standalone/minimal-ui)
- [ ] start_url
- [ ] icons (192×192, 512×512)

**Optional but Recommended**:
- [ ] screenshots
- [ ] categories
- [ ] lang
- [ ] dir

**Validation**:
```bash
# Check manifest exists
curl http://localhost:4321/manifest.json

# Validate structure
node scripts/validate-pwa.js
```

---

### 2. Service Worker

**Checks**:
- [ ] Service worker registered
- [ ] Caching strategies configured
- [ ] Offline fallback page
- [ ] Update notification

**DevTools Check**:
1. Open DevTools → Application
2. Service Workers tab
3. Verify "Activated and running"

---

### 3. Icons

**Required Sizes**:
- [ ] 192×192 (any purpose)
- [ ] 512×512 (any purpose)
- [ ] 512×512 (maskable purpose)
- [ ] 180×180 (Apple touch icon)
- [ ] 32×32 (Favicon)

**Generate**:
```bash
node scripts/generate-pwa-icons.js
```

---

### 4. Offline Functionality

**Test**:
1. Build and preview: `npm run build && npm run preview`
2. Visit site in browser
3. Open DevTools → Network
4. Check "Offline" mode
5. Navigate to pages
6. Verify offline fallback page shows

**Offline Page**:
- [ ] `/offline` route exists
- [ ] i18n support (en/es/fr)
- [ ] Retry button functional

---

### 5. HTTPS

**Production Only**:
- [ ] HTTPS enforced
- [ ] Mixed content warnings: 0
- [ ] Certificate valid

---

### 6. Lighthouse PWA Audit

**Run**:
```bash
npm run build
npm run preview
lighthouse http://localhost:4321 --only-categories=pwa --view
```

**Target Score**: ≥90/100

**Common Issues**:
- Missing manifest fields
- Icons wrong size
- No offline support
- Service worker not registered
- HTTP (not HTTPS)

---

## Validation Script

**File**: `scripts/validate-pwa.js`

```javascript
import fs from 'fs';

const errors = [];

// Check manifest
if (!fs.existsSync('public/manifest.json')) {
  errors.push('❌ manifest.json missing');
} else {
  const manifest = JSON.parse(fs.readFileSync('public/manifest.json'));

  const required = ['name', 'short_name', 'theme_color', 'background_color', 'display', 'start_url', 'icons'];
  required.forEach(field => {
    if (!manifest[field]) {
      errors.push(`❌ manifest.${field} missing`);
    }
  });
}

// Check icons
const iconSizes = ['192x192', '512x512'];
iconSizes.forEach(size => {
  if (!fs.existsSync(`public/pwa-${size}.png`)) {
    errors.push(`❌ Icon missing: pwa-${size}.png`);
  }
});

// Check offline page
if (!fs.existsSync('src/pages/offline.astro')) {
  errors.push('❌ Offline page missing: src/pages/offline.astro');
}

// Report
if (errors.length > 0) {
  console.error('PWA Validation Errors:\n');
  errors.forEach(err => console.error(`  ${err}`));
  process.exit(1);
} else {
  console.log('✅ PWA compliance validated');
}
```

**Run**:
```bash
npm run validate:pwa
```

---

## Quick Fixes

**1. Missing manifest fields**:
```javascript
// astro.config.mjs
VitePWA({
  manifest: {
    name: 'Full name here',
    short_name: 'Short name',
    // ... add missing fields
  }
})
```

**2. Missing icons**:
```bash
node scripts/generate-pwa-icons.js
```

**3. No offline page**:
```astro
// src/pages/offline.astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Offline">
  <h1>You're offline</h1>
  <button onclick="window.location.reload()">Retry</button>
</Layout>
```

**4. Service worker not registered**:
```javascript
// astro.config.mjs
VitePWA({
  registerType: 'autoUpdate'
})
```

---

## Usage

Invoke with:
```
"Audit PWA compliance"
"Check PWA manifest valid"
"Test offline functionality"
"Validate PWA icons"
```

Auto-activates on keywords: pwa audit, manifest, service worker, offline
