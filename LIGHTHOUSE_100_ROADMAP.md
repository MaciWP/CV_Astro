# 🎯 ROADMAP COMPLETO: LIGHTHOUSE 100/100/100/100/100

**Proyecto:** oriolmacias.dev
**Objetivo:** Alcanzar puntuación perfecta en todas las categorías de Lighthouse
**Fecha:** 2024-11-25
**Tiempo Estimado Total:** 21 días (3 semanas)

---

## 📊 ESTADO ACTUAL vs OBJETIVO

```
┌─────────────────────────────────────────────────────────────────┐
│ CATEGORÍA        │ ACTUAL │ OBJETIVO │ REALISTA     │ ESFUERZO │
├─────────────────────────────────────────────────────────────────┤
│ Performance      │   60   │   100    │   98-100 ✅  │ 5 días   │
│ SEO              │   80   │   100    │   100 ✅     │ 2 días   │
│ Accessibility    │   85   │   100    │   98-100 ✅  │ 5 días   │
│ Best Practices   │   90   │   100    │   100 ✅     │ 2 días   │
│ PWA              │    0   │   100    │   100 ✅     │ 3 días   │
└─────────────────────────────────────────────────────────────────┘

TOTAL: 315/500 → 496-500/500 (99.2-100%)
```

---

## 🔴 ERRORES CRÍTICOS ACTUALES (P0)

**DEBE ARREGLARSE PRIMERO - BLOQUEA TODO LO DEMÁS**

### Estado del Proyecto:
- **Git:** Commit 8d1e02b (reverted, trabajo perdido)
- **Server:** Running con errores (archivos missing)
- **Skills/Education:** HTML ✓ renders, Visualmente ✗ broken
- **Animations:** No funcionan en ninguna sección
- **Archivos Perdidos:** Skills.astro, Education.astro, es/index.astro, fr/index.astro

### Errores a Arreglar:
| Error | Impacto | Tiempo |
|-------|---------|--------|
| Skills/Education no visibles | 🔴 CRÍTICO | 2-3h |
| Recrear Skills.astro | 🔴 CRÍTICO | 1h |
| Recrear Education.astro | 🔴 CRÍTICO | 1h |
| CSS animation duplicates | 🔴 CRÍTICO | 30min |
| animations.js not executing | 🔴 CRÍTICO | 30min |
| Server errors (missing files) | 🔴 ALTO | 1h |

**Total Fase 0:** 5-6 horas → **2 días** (con testing exhaustivo)

---

## 📅 PLAN DE EJECUCIÓN (21 DÍAS)

### **FASE 0: ARREGLAR LO ROTO (Días 1-2)** ⚠️ BLOQUEANTE

**Objetivo:** Volver a estado funcional sin bugs visuales

#### Día 1
- [ ] Recrear `src/components/cv/Skills.astro`
  - [ ] Importar datos de skills desde translations
  - [ ] Implementar categorías (Languages, Frameworks, Databases, DevOps, Protocols)
  - [ ] Añadir clases de animación correctas
  - [ ] Test visual en browser

- [ ] Recrear `src/components/cv/Education.astro`
  - [ ] Importar datos de education desde translations
  - [ ] Implementar timeline con fechas
  - [ ] Añadir clases de animación correctas
  - [ ] Test visual en browser

- [ ] Arreglar `src/pages/es/index.astro`
  - [ ] Unificar imports a componentes .astro (no .jsx)
  - [ ] Verificar ErrorBoundary wrappers
  - [ ] Test en browser

- [ ] Arreglar `src/pages/fr/index.astro`
  - [ ] Unificar imports a componentes .astro (no .jsx)
  - [ ] Verificar ErrorBoundary wrappers
  - [ ] Test en browser

#### Día 2
- [ ] Fix CSS animations (`src/styles/global.css`)
  - [ ] Eliminar duplicates (lines 235-258)
  - [ ] Mantener solo definiciones con `.is-visible` trigger
  - [ ] Verificar initial state `opacity: 0`

- [ ] Verificar `animations.js` carga correctamente
  - [ ] Confirmar script tag en Layout.astro
  - [ ] Test IntersectionObserver en DevTools
  - [ ] Verificar `.is-visible` se añade a elementos

- [ ] Testing exhaustivo en browser
  - [ ] Chrome DevTools abierto
  - [ ] Verificar cada sección se vuelve visible al scroll
  - [ ] Test en EN, ES, FR
  - [ ] Verificar theme toggle (light/dark)
  - [ ] Verificar image filter en modo claro

- [ ] **SOLO SI TODO FUNCIONA:** Git commit + push
  - [ ] Mensaje: "fix(animations): restore Skills and Education visibility"
  - [ ] **NO HACER PUSH SI NO FUNCIONA**

**Resultado Esperado:** Web funcionando como antes del regression ✅

---

### **FASE 1: PERFORMANCE 100% (Días 3-7)**

**Objetivo:** LCP <1.2s, TBT <150ms, FCP <0.9s, CLS ≤0.1

#### Día 3: Image Optimization
- [ ] Instalar Sharp CLI: `npm install -g sharp-cli`
- [ ] Crear script `scripts/optimize-images.sh`
  ```bash
  #!/bin/bash
  # Convertir a AVIF (320, 640, 1024, 1280, 1536)
  for img in src/images/*.{jpg,png}; do
    sharp -i "$img" -o "public/images/$(basename $img .jpg)-320.avif" resize 320 --format avif --quality 75
    sharp -i "$img" -o "public/images/$(basename $img .jpg)-640.avif" resize 640 --format avif --quality 75
    sharp -i "$img" -o "public/images/$(basename $img .jpg)-1024.avif" resize 1024 --format avif --quality 75
  done

  # WebP fallback (mismos tamaños)
  for img in src/images/*.{jpg,png}; do
    sharp -i "$img" -o "public/images/$(basename $img .jpg)-320.webp" resize 320 --format webp --quality 80
    sharp -i "$img" -o "public/images/$(basename $img .jpg)-640.webp" resize 640 --format webp --quality 80
    sharp -i "$img" -o "public/images/$(basename $img .jpg)-1024.webp" resize 1024 --format webp --quality 80
  done
  ```
- [ ] Ejecutar script: `bash scripts/optimize-images.sh`
- [ ] Actualizar `ProfileHeader.astro` con `<picture>` responsive
  ```html
  <picture>
    <source type="image/avif" srcset="/images/oriol-320.avif 320w, /images/oriol-640.avif 640w, /images/oriol-1024.avif 1024w" sizes="(max-width: 768px) 100vw, 640px">
    <source type="image/webp" srcset="/images/oriol-320.webp 320w, /images/oriol-640.webp 640w, /images/oriol-1024.webp 1024w" sizes="(max-width: 768px) 100vw, 640px">
    <img src="/images/oriol-640.jpg" alt="Oriol Macias" width="640" height="800" loading="eager" fetchpriority="high">
  </picture>
  ```
- [ ] Test Lighthouse: LCP debe bajar a ~2s

#### Día 4: Critical CSS
- [ ] Instalar critical: `npm install critical --save-dev`
- [ ] Crear script `scripts/extract-critical.js`
  ```javascript
  import { generate } from 'critical';

  generate({
    base: 'dist/',
    src: 'index.html',
    target: { css: 'critical.css' },
    inline: false,
    extract: true,
    width: 1440,
    height: 900
  });
  ```
- [ ] Ejecutar: `node scripts/extract-critical.js`
- [ ] Inline critical CSS en `Layout.astro`
  ```astro
  <head>
    <style set:html={criticalCSS}></style>
    <link rel="preload" href="/styles/main.css" as="style" onload="this.rel='stylesheet'">
  </head>
  ```
- [ ] Test Lighthouse: FCP debe bajar a ~1.2s

#### Día 5: Code Splitting
- [ ] Actualizar `astro.config.mjs`
  ```javascript
  export default defineConfig({
    vite: {
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              if (id.includes('react')) return 'react-vendor';
              if (id.includes('i18next')) return 'i18n';
              if (id.includes('node_modules')) return 'vendor';
            }
          }
        }
      }
    }
  });
  ```
- [ ] Cambiar client directives a `client:visible` para componentes no-críticos
  ```astro
  <ProfileHeader client:load />  <!-- CRÍTICO -->
  <Experience client:visible />   <!-- NO CRÍTICO -->
  <Skills client:visible />
  <Languages client:visible />
  ```
- [ ] Test Lighthouse: TBT debe bajar a <200ms

#### Día 6: Preloads y Font Optimization
- [ ] Añadir preloads en `Layout.astro`
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/images/oriol-640.avif" as="image" type="image/avif" fetchpriority="high">
  ```
- [ ] Font face con `font-display: swap`
  ```css
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter-Variable.woff2') format('woff2');
    font-display: swap;
  }
  ```

#### Día 7: CLS Fixes
- [ ] Añadir aspect-ratio a todas las imágenes
  ```css
  .hero-image { aspect-ratio: 640 / 800; }
  .card-image { aspect-ratio: 16 / 9; }
  ```
- [ ] Dimensiones explícitas en HTML
  ```html
  <img src="..." width="640" height="800" style="aspect-ratio: 640/800;">
  ```
- [ ] Reserved space para contenido dinámico
  ```css
  .loading-skeleton { min-height: 200px; }
  ```
- [ ] Test Lighthouse Final: **Performance 95-100** ✅

**Resultado Esperado:** 60 → **98-100/100** ✅

---

### **FASE 2: SEO 100% (Días 8-9)**

**Objetivo:** Meta tags completos, Schema perfecto, Hreflang, Sitemap

#### Día 8: Meta Tags y Schema
- [ ] Completar meta tags en `Layout.astro`
  ```html
  <!-- Primary -->
  <title>{title}</title>
  <meta name="description" content={description}>
  <meta name="author" content="Oriol Macias">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href={canonicalUrl}>

  <!-- Open Graph -->
  <meta property="og:type" content="profile">
  <meta property="og:url" content={canonicalUrl}>
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content="/images/og-oriol-macias.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content="/images/og-oriol-macias.jpg">
  ```

- [ ] Crear Schema markup completo (`SchemaMarkup.astro`)
  ```json
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "Oriol Macias",
        "jobTitle": "Senior Backend Developer",
        "description": "Solutions-driven Backend Developer with 8+ years...",
        "url": "https://oriolmacias.dev",
        "image": "https://oriolmacias.dev/images/oriol-macias.avif",
        "email": "contact@oriolmacias.dev",
        "sameAs": [
          "https://github.com/MaciWP",
          "https://linkedin.com/in/oriolmacias"
        ],
        "knowsAbout": ["Python", "Django", "FastAPI", "SNMP", "MODBUS"],
        "knowsLanguage": [
          {"@type": "Language", "name": "Spanish"},
          {"@type": "Language", "name": "English"},
          {"@type": "Language", "name": "Catalan"}
        ]
      },
      {
        "@type": "WebSite",
        "url": "https://oriolmacias.dev",
        "name": "Oriol Macias Portfolio",
        "inLanguage": ["en", "es", "fr"]
      },
      {
        "@type": "ProfilePage",
        "url": "https://oriolmacias.dev",
        "about": {"@id": "https://oriolmacias.dev/#person"}
      }
    ]
  }
  ```
- [ ] Validar Schema en https://validator.schema.org/
- [ ] Debe tener **0 errores, 0 warnings**

#### Día 9: Hreflang, Sitemap, robots.txt
- [ ] Implementar Hreflang (`Hreflang.astro`)
  ```html
  <link rel="alternate" hreflang="en" href="https://oriolmacias.dev/">
  <link rel="alternate" hreflang="es" href="https://oriolmacias.dev/es/">
  <link rel="alternate" hreflang="fr" href="https://oriolmacias.dev/fr/">
  <link rel="alternate" hreflang="x-default" href="https://oriolmacias.dev/">
  ```

- [ ] Verificar Sitemap (`astro.config.mjs`)
  ```javascript
  import sitemap from '@astrojs/sitemap';

  export default defineConfig({
    site: 'https://oriolmacias.dev',
    integrations: [
      sitemap({
        i18n: {
          defaultLocale: 'en',
          locales: { en: 'en-US', es: 'es-ES', fr: 'fr-FR' }
        },
        changefreq: 'weekly',
        priority: 0.7
      })
    ]
  });
  ```

- [ ] Crear `public/robots.txt`
  ```txt
  User-agent: *
  Allow: /
  Disallow: /api/

  Sitemap: https://oriolmacias.dev/sitemap-index.xml
  ```

- [ ] Auditar alt text en todas las imágenes
  ```bash
  grep -r "img" src/ --include="*.astro" | grep -v "alt="
  # Si devuelve resultados, añadir alt text
  ```

- [ ] Test Lighthouse Final: **SEO 100** ✅

**Resultado Esperado:** 80 → **100/100** ✅

---

### **FASE 3: ACCESSIBILITY 100% (Días 10-14)**

**Objetivo:** WCAG 2.1 AA compliant, keyboard navigation, screen reader compatible

#### Día 10: Contrast Audit
- [ ] Crear script `scripts/contrast-audit.js`
  ```javascript
  // Script que verifica contrast ratio ≥4.5:1
  // Escanea archivos CSS buscando pares color/background
  // Calcula luminance y ratio
  // Falla si ratio <4.5:1
  ```
- [ ] Ejecutar: `node scripts/contrast-audit.js`
- [ ] Arreglar fallos de contraste
  ```css
  /* ❌ FALLA - Contrast 2.8:1 */
  .text-muted { color: #9CA3AF; }

  /* ✅ PASA - Contrast 4.6:1 */
  .text-muted { color: #6B7280; }
  ```
- [ ] Re-ejecutar hasta 0 errores

#### Día 11: Focus Management
- [ ] Implementar skip link (`SkipLink.astro`)
  ```html
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <style>
    .skip-link {
      position: absolute;
      top: -100px;
      left: 0;
    }
    .skip-link:focus { top: 0; }
  </style>
  ```

- [ ] Custom focus styles (`global.css`)
  ```css
  :focus-visible {
    outline: 3px solid #1D4ED8;
    outline-offset: 2px;
  }
  ```

- [ ] Añadir `id="main-content"` al contenido principal
  ```astro
  <main id="main-content">
    <!-- contenido -->
  </main>
  ```

#### Día 12: ARIA Roles
- [ ] Auditar secciones
  ```astro
  <section
    id="skills"
    aria-labelledby="skills-heading"
    role="region"
  >
    <h2 id="skills-heading">Technical Skills</h2>
    <!-- ... -->
  </section>
  ```

- [ ] Progress bars accesibles
  ```jsx
  <div
    role="progressbar"
    aria-valuenow={level}
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label={`${skill}: ${level}%`}
  >
    <span className="sr-only">{skill}: {level}%</span>
  </div>
  ```

- [ ] Listas con roles correctos
  ```astro
  <div role="list">
    <div role="listitem">...</div>
  </div>
  ```

#### Día 13: Keyboard Navigation
- [ ] Test navegación por Tab
  - [ ] Orden lógico top-to-bottom
  - [ ] Todos los elementos interactivos alcanzables
  - [ ] Focus visible en cada elemento

- [ ] Implementar trap focus en modals (si aplica)
  ```javascript
  // scripts/keyboard-nav.js
  // Trap focus dentro de modal
  // Escape cierra modal
  // Arrow keys para navegación custom
  ```

- [ ] Test shortcuts
  - [ ] Enter activa links
  - [ ] Space activa botones
  - [ ] Escape cierra modals

#### Día 14: Screen Reader Testing
- [ ] Instalar NVDA (Windows) o VoiceOver (Mac)
- [ ] Test checklist:
  - [ ] Skip link se anuncia
  - [ ] Headings se leen en orden (H1→H2→H3)
  - [ ] Links tienen texto descriptivo
  - [ ] Botones anuncian propósito
  - [ ] Imágenes tienen alt descriptivo
  - [ ] Listas se anuncian "List with X items"
  - [ ] Forms tienen labels
  - [ ] Landmarks presentes (nav, main, footer)

- [ ] Arreglar issues encontrados
- [ ] Re-test hasta perfecto
- [ ] Test Lighthouse Final: **Accessibility 98-100** ✅

**Resultado Esperado:** 85 → **98-100/100** ✅

---

### **FASE 4: BEST PRACTICES 100% (Días 15-16)**

**Objetivo:** Security headers, dependency audit, console clean

#### Día 15: Security Headers
- [ ] Configurar `netlify.toml`
  ```toml
  [[headers]]
    for = "/*"
    [headers.values]
      X-Frame-Options = "DENY"
      X-Content-Type-Options = "nosniff"
      X-XSS-Protection = "1; mode=block"
      Referrer-Policy = "strict-origin-when-cross-origin"
      Strict-Transport-Security = "max-age=31536000; includeSubDomains"

      Content-Security-Policy = """
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https:;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self';
        frame-ancestors 'none';
      """

      Permissions-Policy = """
        geolocation=(),
        microphone=(),
        camera=()
      """
  ```

- [ ] Test headers en https://securityheaders.com/
- [ ] Debe dar A+ rating

#### Día 16: Audits y Cleanup
- [ ] Dependency audit
  ```bash
  npm audit
  npm audit fix
  npm outdated
  ```
  - [ ] Actualizar dependencias vulnerables
  - [ ] Re-test que todo funciona

- [ ] Console errors check
  ```javascript
  // scripts/check-console-errors.js (Playwright)
  // Abre página, captura console.error()
  // Falla si hay errores
  ```
  - [ ] Ejecutar: `node scripts/check-console-errors.js`
  - [ ] Arreglar todos los errores

- [ ] Aspect ratio en todas las imágenes
  ```css
  img { aspect-ratio: attr(width) / attr(height); }
  ```

- [ ] Buscar APIs deprecated
  ```bash
  grep -r "document.write" src/
  grep -r "keyCode" src/
  grep -r "\-webkit\-" src/styles/
  ```
  - [ ] Reemplazar por APIs modernas

- [ ] Test Lighthouse Final: **Best Practices 100** ✅

**Resultado Esperado:** 90 → **100/100** ✅

---

### **FASE 5: PWA 100% (Días 17-19)**

**Objetivo:** Service Worker funcional, manifest completo, funciona offline

#### Día 17: Manifest.json
- [ ] Crear `public/manifest.json`
  ```json
  {
    "name": "Oriol Macias - Senior Backend Developer",
    "short_name": "Oriol Macias",
    "description": "Professional portfolio",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FAFAFA",
    "theme_color": "#0A0A0A",
    "orientation": "portrait-primary",
    "icons": [
      {"src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png"},
      {"src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png"}
    ]
  }
  ```

- [ ] Generar iconos PWA
  ```bash
  # scripts/generate-icons.sh
  npm install -g sharp-cli

  # Tamaños: 72, 96, 128, 144, 152, 192, 384, 512
  for size in 72 96 128 144 152 192 384 512; do
    sharp -i src/images/logo.png -o public/icons/icon-${size}x${size}.png resize ${size} ${size}
  done
  ```

- [ ] Añadir manifest al HTML
  ```html
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0A0A0A">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  ```

#### Día 18: Service Worker
- [ ] Crear `public/sw.js`
  ```javascript
  const CACHE_NAME = 'oriol-portfolio-v1';
  const PRECACHE = ['/', '/offline.html', '/styles/critical.css'];

  // Install: Precache
  self.addEventListener('install', e => {
    e.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
    );
  });

  // Activate: Clean old caches
  self.addEventListener('activate', e => {
    e.waitUntil(
      caches.keys().then(names =>
        Promise.all(
          names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
        )
      )
    );
  });

  // Fetch: Network First
  self.addEventListener('fetch', e => {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  });
  ```

- [ ] Registrar Service Worker (`scripts/register-sw.js`)
  ```javascript
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', reg.scope);
    });
  }
  ```

- [ ] Añadir script a Layout
  ```html
  <script src="/scripts/register-sw.js"></script>
  ```

#### Día 19: Offline Page y Testing
- [ ] Crear `public/offline.html`
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Offline</title>
    <style>
      body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      h1 { font-size: 3rem; }
    </style>
  </head>
  <body>
    <div>
      <h1>You're Offline</h1>
      <p>Check your connection and try again.</p>
      <button onclick="location.reload()">Retry</button>
    </div>
  </body>
  </html>
  ```

- [ ] Test PWA
  - [ ] Chrome DevTools → Application → Service Workers
  - [ ] Verificar SW activo
  - [ ] Offline mode: Network tab → Offline
  - [ ] Recargar, debe mostrar offline.html
  - [ ] Online mode: debe funcionar normal

- [ ] Test installability
  - [ ] Chrome debe mostrar botón "Install"
  - [ ] Instalar en escritorio
  - [ ] Abrir como app standalone
  - [ ] Verificar funciona sin browser chrome

- [ ] Test Lighthouse Final: **PWA 100** ✅

**Resultado Esperado:** 0 → **100/100** ✅

---

### **FASE 6: TESTING & LAUNCH (Días 20-21)**

**Objetivo:** Lighthouse 100 en todas, deploy production

#### Día 20: Testing Exhaustivo
- [ ] Lighthouse CI (todas las páginas)
  ```bash
  # EN
  lighthouse https://oriolmacias.dev --view

  # ES
  lighthouse https://oriolmacias.dev/es --view

  # FR
  lighthouse https://oriolmacias.dev/fr --view
  ```
  - [ ] Todas deben tener 95-100 en cada categoría

- [ ] Cross-browser testing
  - [ ] Chrome (Desktop + Mobile)
  - [ ] Firefox (Desktop)
  - [ ] Safari (Desktop + iOS)
  - [ ] Edge (Desktop)

- [ ] Mobile testing real
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] Test touch targets ≥44px
  - [ ] Test responsive breakpoints

- [ ] Performance testing
  - [ ] WebPageTest: https://www.webpagetest.org/
  - [ ] GTmetrix: https://gtmetrix.com/
  - [ ] PageSpeed Insights: https://pagespeed.web.dev/

#### Día 21: Deploy Production
- [ ] Final checks
  - [ ] Todos los tests pasan ✅
  - [ ] No console errors ✅
  - [ ] No broken links ✅
  - [ ] Todas las imágenes cargan ✅
  - [ ] Todos los idiomas funcionan ✅

- [ ] Build production
  ```bash
  npm run build
  ```
  - [ ] Verificar output en `dist/`
  - [ ] Check tamaños de bundles
  - [ ] Verificar compression

- [ ] Deploy a Netlify/Vercel
  ```bash
  # Netlify
  netlify deploy --prod

  # O Vercel
  vercel --prod
  ```

- [ ] Post-deploy verification
  - [ ] Test live URL
  - [ ] Run Lighthouse en production
  - [ ] Verificar Service Worker activo
  - [ ] Test PWA installability
  - [ ] Verificar analytics funcionan

- [ ] 🚀 **LAUNCH!**

**Resultado Final:** **496-500/500 (99.2-100%)** 🎉

---

## 📊 MÉTRICAS FINALES ESPERADAS

```
┌─────────────────────────────────────────────────────────────────┐
│                     LIGHTHOUSE SCORECARD                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Performance       ━━━━━━━━━━━━━━━━━━━  98-100  ✅              │
│  SEO               ━━━━━━━━━━━━━━━━━━━  100     ✅              │
│  Accessibility     ━━━━━━━━━━━━━━━━━━━  98-100  ✅              │
│  Best Practices    ━━━━━━━━━━━━━━━━━━━  100     ✅              │
│  PWA               ━━━━━━━━━━━━━━━━━━━  100     ✅              │
│                                                                  │
│  TOTAL             ━━━━━━━━━━━━━━━━━━━  496-500 (99.2-100%)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Core Web Vitals:
├─ LCP: 5.2s → 0.9-1.2s  ✅ (4x mejora)
├─ FCP: 2.8s → 0.7-0.9s  ✅ (3x mejora)
├─ TBT: ?    → <100ms    ✅
├─ CLS: ?    → 0         ✅
└─ TTI: ?    → <2.5s     ✅
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Performance (98-100/100)
- [ ] LCP ≤1.2s
- [ ] FCP ≤0.9s
- [ ] TBT ≤150ms
- [ ] CLS ≤0.1
- [ ] Speed Index ≤1.3s
- [ ] Imágenes en AVIF con fallback WebP
- [ ] Responsive srcset implementado
- [ ] Critical CSS inline (<14KB)
- [ ] Code splitting por rutas
- [ ] Preload de recursos críticos
- [ ] Font-display: swap
- [ ] Compresión Brotli/gzip activa

### SEO (100/100)
- [ ] Meta tags completos (title, description, author)
- [ ] Open Graph completo
- [ ] Twitter Cards completo
- [ ] Canonical URL en todas las páginas
- [ ] Hreflang para EN/ES/FR
- [ ] robots.txt válido
- [ ] Sitemap XML generado
- [ ] Schema markup Person sin errores
- [ ] Schema markup WebSite sin errores
- [ ] Schema markup ProfilePage sin errores
- [ ] Alt text en todas las imágenes
- [ ] Heading hierarchy correcta (H1→H2→H3)
- [ ] URLs semánticas

### Accessibility (98-100/100)
- [ ] Contrast ratio ≥4.5:1 en todo el texto
- [ ] Focus visible en todos los elementos interactivos
- [ ] Skip to content link funcional
- [ ] Navegación completa por teclado
- [ ] ARIA roles correctos
- [ ] Labels en todos los inputs
- [ ] Alt text descriptivo en imágenes
- [ ] Screen reader compatible (NVDA/VoiceOver)
- [ ] Tap targets ≥44px
- [ ] Lang attribute presente
- [ ] HTML semántico
- [ ] No errores de accesibilidad

### Best Practices (100/100)
- [ ] HTTPS habilitado
- [ ] Security headers configurados (CSP, HSTS, etc.)
- [ ] No mixed content
- [ ] No console errors
- [ ] No vulnerabilidades en dependencies
- [ ] Aspect-ratio en todas las imágenes
- [ ] No deprecated APIs
- [ ] No document.write()
- [ ] Valid HTML

### PWA (100/100)
- [ ] Service Worker registrado
- [ ] Manifest.json completo
- [ ] Iconos 192x192 y 512x512
- [ ] Funciona offline
- [ ] Offline page funcional
- [ ] HTTPS redirect configurado
- [ ] Viewport meta tag correcto
- [ ] Theme color definido
- [ ] Display: standalone
- [ ] Installable en dispositivos

---

## 🔧 SCRIPTS ÚTILES

### Performance Testing
```bash
# Lighthouse CI
npm run lighthouse

# WebPageTest
npm run webpagetest

# Bundle analyzer
npm run analyze
```

### Audits
```bash
# Contrast check
node scripts/contrast-audit.js

# Console errors
node scripts/check-console-errors.js

# Dependency security
npm audit

# Image optimization
bash scripts/optimize-images.sh

# Icon generation
bash scripts/generate-icons.sh
```

### Development
```bash
# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Type check
npm run check
```

---

## 📚 RECURSOS ÚTILES

### Testing Tools
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

### Validation Tools
- **Schema Validator**: https://validator.schema.org/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **HTML Validator**: https://validator.w3.org/
- **Security Headers**: https://securityheaders.com/

### Documentation
- **Web.dev**: https://web.dev/
- **Core Web Vitals**: https://web.dev/vitals/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **PWA Checklist**: https://web.dev/pwa-checklist/

---

## ⚠️ ADVERTENCIAS IMPORTANTES

### Lo que NO garantizo:
1. ❌ Lighthouse 100% perfecto sin fluctuaciones (puede variar ±2 puntos)
2. ❌ LCP <1.2s sin CDN premium (1.8-2.2s es realista sin CDN)
3. ❌ PWA offline completo sin testing exhaustivo
4. ❌ Zero console warnings (solo errors críticos)

### Lo que SÍ garantizo:
1. ✅ Performance 95-100 con AVIF + Critical CSS
2. ✅ SEO 100 con Schema validado
3. ✅ Accessibility 95-100 con WCAG 2.1 AA
4. ✅ Best Practices 100 con security headers
5. ✅ PWA 100 con Service Worker funcional
6. ✅ Testing exhaustivo en browser ANTES de commits

---

## 🚀 PRÓXIMOS PASOS

**INMEDIATO:**
1. Arreglar errores actuales (FASE 0)
2. Test exhaustivo en browser
3. Solo commit cuando funcione

**CORTO PLAZO (1 semana):**
1. Performance optimization (FASE 1)
2. SEO perfecto (FASE 2)

**MEDIO PLAZO (2-3 semanas):**
1. Accessibility 100% (FASE 3)
2. Best Practices 100% (FASE 4)
3. PWA implementation (FASE 5)

**LAUNCH:**
1. Testing final (FASE 6)
2. Deploy production
3. Celebration! 🎉

---

**Última actualización:** 2024-11-25
**Versión:** 1.0
**Estado:** 📋 Planificado (pendiente FASE 0)
