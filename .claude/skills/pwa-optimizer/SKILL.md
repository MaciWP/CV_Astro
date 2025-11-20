---
name: pwa-optimizer
description: Optimize @vite-pwa/astro configuration for PWA compliance and offline functionality
activation:
  keywords:
    - pwa
    - progressive web app
    - service worker
    - manifest.json
    - offline
  triggers:
    - "vite-pwa"
    - "workbox"
  auto_load_project: cv-astro
---

# PWA Optimizer

## What This Is

Optimize Progressive Web App (PWA) configuration for CV_Astro using @vite-pwa/astro:
- manifest.json generation
- Service worker configuration
- Offline fallback pages
- Icon generation (512x512, 192x192, etc.)
- Cache strategy optimization

**For**: CV_Astro project (@vite-pwa/astro)

---

## When to Activate

Auto-activates when keywords detected:
- "pwa configuration"
- "service worker"
- "offline support"
- "manifest.json"

---

## PWA Configuration

### Astro Integration

**File**: `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import { VitePWA } from '@vite-pwa/astro';

export default defineConfig({
  integrations: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Oriol Macías - Portfolio',
        short_name: 'Oriol M.',
        description: 'Full Stack Developer specialized in modern web technologies',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['business', 'productivity'],
        lang: 'en',
        dir: 'ltr'
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,jpg,jpeg,webp,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
});
```

---

## Manifest.json

### Essential Fields

```json
{
  "name": "Oriol Macías - Full Stack Developer Portfolio",
  "short_name": "Oriol M.",
  "description": "Professional portfolio showcasing web development projects",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ],
  "categories": ["business", "productivity", "utilities"],
  "lang": "en",
  "dir": "ltr",
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

---

## Icon Generation

### Required Sizes

| Icon | Size | Purpose |
|------|------|---------|
| `pwa-192x192.png` | 192×192 | Android Chrome |
| `pwa-512x512.png` | 512×512 | Splash screen |
| `apple-touch-icon.png` | 180×180 | iOS |
| `favicon.ico` | 32×32 | Browser tab |
| `masked-icon.svg` | Vector | Safari pinned tab |

### Generation Script

**File**: `scripts/generate-pwa-icons.js`

```javascript
import sharp from 'sharp';
import fs from 'fs';

const sizes = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32x32.png', size: 32 }
];

const source = 'src/assets/icon-source.png';

async function generateIcons() {
  for (const { name, size } of sizes) {
    await sharp(source)
      .resize(size, size, { fit: 'cover' })
      .toFile(`public/${name}`);
    console.log(`✅ Generated ${name}`);
  }
}

generateIcons();
```

**Run**:
```bash
node scripts/generate-pwa-icons.js
```

---

## Service Worker Strategies

### 1. CacheFirst (Static Assets)

**Use**: Fonts, images, CSS, JS
**Behavior**: Check cache first, fallback to network

```javascript
{
  urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
  handler: 'CacheFirst',
  options: {
    cacheName: 'images-cache',
    expiration: {
      maxEntries: 60,
      maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
    }
  }
}
```

### 2. NetworkFirst (Dynamic Content)

**Use**: HTML pages, API responses
**Behavior**: Try network first, fallback to cache

```javascript
{
  urlPattern: /^https:\/\/api\.example\.com\/.*/i,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24 // 1 day
    }
  }
}
```

### 3. StaleWhileRevalidate (Balance)

**Use**: Non-critical resources
**Behavior**: Return cache, update in background

```javascript
{
  urlPattern: /\.(?:css|js)$/,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'static-resources',
    expiration: {
      maxEntries: 60,
      maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
    }
  }
}
```

---

## Offline Fallback

### Offline Page

**File**: `src/pages/offline.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import { t, changeLanguage } from 'i18next';

const locale = Astro.currentLocale || 'en';
changeLanguage(locale);
---

<Layout title={t('offline:title')} description={t('offline:description')}>
  <div class="offline-container">
    <h1>{t('offline:heading')}</h1>
    <p>{t('offline:message')}</p>

    <button onclick="window.location.reload()" class="retry-btn">
      {t('offline:retry')}
    </button>
  </div>
</Layout>

<style>
  .offline-container {
    @apply flex flex-col items-center justify-center min-h-screen p-6 text-center;
  }

  h1 {
    @apply text-4xl font-bold text-gray-900 mb-4;
  }

  p {
    @apply text-xl text-gray-600 mb-8;
  }

  .retry-btn {
    @apply bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors;
  }
</style>
```

### Workbox Configuration

```javascript
workbox: {
  navigationPreload: true,
  offlineFallback: {
    html: '/offline',
  },
  navigateFallback: '/offline',
  navigateFallbackDenylist: [/^\/api\//]
}
```

---

## i18n Support in PWA

### Locale-Specific Manifests

```javascript
// astro.config.mjs
const getManifest = (locale) => ({
  name: locale === 'es'
    ? 'Oriol Macías - Portafolio'
    : 'Oriol Macías - Portfolio',
  short_name: 'Oriol M.',
  description: locale === 'es'
    ? 'Portafolio profesional de desarrollo web'
    : 'Professional web development portfolio',
  lang: locale,
  dir: 'ltr'
});
```

---

## Testing PWA

### Chrome DevTools

1. **Open DevTools** → Application tab
2. **Manifest**: Check all fields valid
3. **Service Workers**: Verify registered
4. **Storage**: Check cache entries
5. **Offline**: Toggle offline mode, test

### Lighthouse PWA Audit

```bash
npm run build
npm run preview

# In another terminal
lighthouse http://localhost:4321 --only-categories=pwa --view
```

**Score Target**: ≥90/100

---

## PWA Checklist

### ✅ Required

- [ ] manifest.json with all required fields
- [ ] Icons (192×192, 512×512)
- [ ] Service worker registered
- [ ] HTTPS enabled (production)
- [ ] theme_color and background_color set
- [ ] display: standalone or minimal-ui
- [ ] start_url configured
- [ ] Offline fallback page

### ✅ Recommended

- [ ] Apple touch icon (180×180)
- [ ] Maskable icon (512×512)
- [ ] Screenshots for app stores
- [ ] Cache strategies optimized
- [ ] Offline page with i18n
- [ ] Update notification UI

### ✅ Optional

- [ ] Push notifications
- [ ] Background sync
- [ ] Periodic background sync
- [ ] File handling
- [ ] Share target

---

## Deployment

### Headers Configuration

**File**: `public/_headers`

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Content-Type: application/javascript
  Cache-Control: public, max-age=0, must-revalidate

/offline
  Cache-Control: public, max-age=0, must-revalidate
```

---

## Quick Reference

| Feature | Implementation | Priority |
|---------|----------------|----------|
| **Manifest** | VitePWA config | CRITICAL |
| **Icons** | 192×192, 512×512 | CRITICAL |
| **Service Worker** | Auto-generated | CRITICAL |
| **Offline page** | `/offline` route | HIGH |
| **Cache strategies** | Workbox config | HIGH |
| **Update UI** | Toast notification | MEDIUM |

**Target**: Lighthouse PWA score ≥90/100
