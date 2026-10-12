<div align="center">

# Oriol Macias — CV & Portfolio

**Senior Backend Developer** · Python · Django · C# · Industrial IoT (SNMP · Modbus · BACnet)

[![Live site](https://img.shields.io/badge/live-oriolmacias.dev-D83333?style=for-the-badge)](https://oriolmacias.dev)

[![CI](https://github.com/MaciWP/CV_Astro/actions/workflows/ci.yml/badge.svg)](https://github.com/MaciWP/CV_Astro/actions/workflows/ci.yml)
![Lighthouse 100 ×5](https://img.shields.io/badge/Lighthouse-100%20×%205-success?logo=lighthouse&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)
![Netlify](https://img.shields.io/badge/deploy-Netlify-00C7B7?logo=netlify&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

</div>

A personal CV/portfolio built as a **statically generated, zero-runtime-framework** site:
pure [Astro](https://astro.build) + vanilla JS (no React shipped), 4-language i18n, and a
perfect Lighthouse profile — engineered so the codebase itself stands as a work sample.

<!--
Add a real screenshot at docs/preview.png and uncomment:
<p align="center"><img src="docs/preview.png" alt="oriolmacias.dev — light and dark themes" width="860"></p>
-->

## ✨ Highlights

- **Lighthouse 100 / 100 / 100 / 100 / 100** — Performance, Accessibility, Best Practices, SEO and PWA (mobile, throttled).
- **No UI framework at runtime** — pure Astro + a few hand-written vanilla-JS islands; the React/etc. devDeps were removed, so almost no client JS ships.
- **4-language i18n** (en · es · fr · de) resolved at build time — no client-side translation loader.
- **Inline SVG icon set** (no FontAwesome) — keeps the critical rendering path lean and CLS at 0.
- **Quality gates that actually run on every build:** WCAG colour-contrast, translation-key consistency, and JSON-LD structured-data validation against the real `dist/` output.
- **Progressive enhancement** — full content renders without JS; animations and interactivity are layered on top.
- **SEO**: ProfilePage + Person + WebSite JSON-LD, `hreflang` alternates, auto-sitemap, and market-aware metadata.
- **Security & supply chain**: CSP and security headers from one file (`public/_headers`); pnpm with an explicit build-script allowlist (esbuild/sharp vetted).
- **Installable PWA** with an offline-capable service worker, plus a print-optimised layout (one-click PDF export).

## 🧰 Tech stack

| Area | Choice |
|---|---|
| Framework | **Astro 7** (`output: 'static'`) |
| Styling | **Tailwind CSS 4** (via the Vite plugin) |
| Language | **TypeScript** + vanilla JS islands |
| Images | **sharp** — responsive AVIF/WebP/JPG profile set |
| Package manager | **pnpm 11** (Corepack) |
| Hosting / CI | **Netlify** (deploy gate) + **GitHub Actions** CI (pre-merge gate) |

## 🚀 Getting started

> Requires **Node 24+** and **pnpm 11** (bundled via Corepack).

```bash
git clone https://github.com/MaciWP/CV_Astro.git
cd CV_Astro
pnpm install
pnpm run dev        # http://localhost:4321
```

```bash
pnpm run build      # production build → dist/
pnpm run preview    # serve the production build locally
```

## 📜 Scripts

| Script | What it does |
|---|---|
| `pnpm run dev` | Start the dev server (`scripts/dev.js` → `astro dev`) |
| `pnpm run build` | Build for production (`scripts/build.js` → `astro build`; the sitemap is generated during the build) |
| `pnpm run generate-images` | Regenerate the responsive profile set from `assets/oriol_macias.jpg` (run when the photo changes, then commit) |
| `pnpm run cv:pdf` | Regenerate `public/OriolMacias_CV.pdf` from the `/cv` page with local Chrome (run locally, then commit) |
| `pnpm run preview` | Preview the production build |
| `pnpm run check` | Run all domain gates: `check:contrast` + `check:translations` + `check:structured-data` (the last reads `dist/`, so build first) |
| `pnpm run lint` | ESLint (zero errors / zero warnings) |
| `pnpm run check:types` | Type-check `.astro` and `.ts` files (`astro check`) |
| `pnpm test` | Run the Vitest unit suite (`src/utils/seo.ts` logic) |
| `pnpm run a11y:audit` | Lighthouse accessibility audit of the running dev server |
| `pnpm run clean` | Remove `dist/` and `.astro/` |

## 📂 Project structure

```
src/
├── components/
│   ├── cv/          # CV sections: ProfileHeader, Experience, Skills, …
│   └── icons/       # SvgIcons.astro — the inline SVG set
├── data/          # CV content as typed Localized<T> modules, profile.ts, home.ts
│   └── locales/     # en/es/fr/de UI strings, read through messages() in src/i18n.ts
├── layouts/         # Layout.astro (head, CSP, structured data, footer)
├── pages/           # /  ·  /es /fr /de  ·  /spain  ·  /switzerland  ·  404
├── styles/          # global.css
└── utils/           # seo.ts — market detection + JSON-LD generators
scripts/             # build · dev · check-contrast · check-translations
                     # · validate-structured-data · generate-profile-images · generate-cv-pdf
```

## ✅ Quality & verification

Correctness is enforced on every pull request and every push to `main` by **GitHub
Actions CI** (lint → type check → build → domain checks → unit tests), and each PR gets
a Netlify deploy preview with a Lighthouse run:

- `pnpm test` — Vitest unit suite for the SEO logic (market detection, path
  normalization, JSON-LD generators)
- `pnpm run check:contrast` — WCAG AA contrast on the real rendered colours
- `pnpm run check:translations` — every key present and consistent across all 4 languages
- `pnpm run check:structured-data` — validates the JSON-LD emitted into `dist/`

`astro check` (types), `eslint`, `pnpm test` and `pnpm run check` are all green on every change.

## 📄 License

MIT — see [LICENSE](LICENSE).

## 📫 Contact

**Oriol Macias** · [oriolmacias.dev](https://oriolmacias.dev) · [oriolomb@gmail.com](mailto:oriolomb@gmail.com)
· [LinkedIn](https://linkedin.com/in/oriolmaciasbadosa) · [GitHub](https://github.com/MaciWP)
