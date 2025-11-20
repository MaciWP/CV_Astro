# Development Workflows - CV_Astro

## Common Development Tasks

---

## 1. Component Creation

### Creating Astro Component

**Pattern**: Static content, server-side rendering

**Steps**:
1. Create file: `src/components/ComponentName.astro`
2. Add TypeScript frontmatter
3. Implement template
4. Add scoped styles

**Example**:
```astro
---
// src/components/ExperienceCard.astro
interface Props {
  title: string;
  company: string;
  period: string;
  description: string;
}

const { title, company, period, description } = Astro.props;
---

<article class="experience-card">
  <h3>{title}</h3>
  <div class="meta">
    <span class="company">{company}</span>
    <span class="period">{period}</span>
  </div>
  <p>{description}</p>
</article>

<style>
  .experience-card {
    @apply bg-white rounded-lg shadow-md p-6 mb-4;
  }

  .meta {
    @apply flex justify-between text-sm text-gray-600 mb-3;
  }

  h3 {
    @apply text-xl font-bold text-gray-900 mb-2;
  }
</style>
```

**Usage**:
```astro
---
import ExperienceCard from '../components/ExperienceCard.astro';
---

<ExperienceCard
  title="Full Stack Developer"
  company="Company Name"
  period="2022-2024"
  description="Developed modern web applications..."
/>
```

---

### Creating React Component

**Pattern**: Interactive elements, client-side state

**Steps**:
1. Create file: `src/components/ComponentName.tsx`
2. Define TypeScript interface
3. Implement functional component
4. Export default

**Example**:
```tsx
// src/components/ContactForm.tsx
import React, { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ContactFormProps {
  locale: string;
}

const ContactForm: FC<ContactFormProps> = ({ locale }) => {
  const { t } = useTranslation(['common', 'contact']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">{t('common:labels.name')}</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">{t('common:labels.email')}</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">{t('common:labels.message')}</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>

      <button type="submit">{t('common:actions.contactMe')}</button>
    </form>
  );
};

export default ContactForm;
```

**Usage in Astro**:
```astro
---
import ContactForm from '../components/ContactForm.tsx';
---

<!-- Hydrate when visible -->
<ContactForm locale={Astro.currentLocale || 'en'} client:visible />
```

---

## 2. Adding i18n Translations

### Workflow

**Steps**:
1. Identify translation keys needed
2. Add to English (source of truth)
3. Add to Spanish
4. Add to French
5. Validate with script

**Example**:

```bash
# 1. Add to public/locales/en/contact.json
{
  "form": {
    "namePlaceholder": "Enter your name",
    "emailPlaceholder": "Enter your email",
    "messagePlaceholder": "Your message here",
    "submit": "Send Message",
    "success": "Message sent successfully!",
    "error": "Failed to send message. Please try again."
  }
}

# 2. Add to public/locales/es/contact.json
{
  "form": {
    "namePlaceholder": "Ingresa tu nombre",
    "emailPlaceholder": "Ingresa tu correo",
    "messagePlaceholder": "Tu mensaje aquí",
    "submit": "Enviar Mensaje",
    "success": "¡Mensaje enviado con éxito!",
    "error": "Error al enviar mensaje. Por favor intenta de nuevo."
  }
}

# 3. Add to public/locales/fr/contact.json
{
  "form": {
    "namePlaceholder": "Entrez votre nom",
    "emailPlaceholder": "Entrez votre email",
    "messagePlaceholder": "Votre message ici",
    "submit": "Envoyer le Message",
    "success": "Message envoyé avec succès !",
    "error": "Échec de l'envoi du message. Veuillez réessayer."
  }
}

# 4. Validate
npm run check:translations
```

---

## 3. SEO & Structured Data

### Adding Page Metadata

**Workflow**:
1. Create SEO translation keys
2. Add structured data schema
3. Include meta tags in Layout
4. Validate with Google Rich Results Test

**Example**:

```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro';
import { t, changeLanguage } from 'i18next';

const locale = Astro.currentLocale || 'en';
changeLanguage(locale);

// SEO
const title = t('seo:about.title');
const description = t('seo:about.description');
const canonical = `https://oriolmacias.dev${locale === 'en' ? '' : `/${locale}`}/about`;

// Structured Data
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Oriol Macías",
  "url": canonical,
  "jobTitle": t('seo:person.jobTitle'),
  "description": description,
  "inLanguage": locale
};
---

<Layout title={title} description={description}>
  <head slot="head">
    <link rel="canonical" href={canonical} />

    <!-- Alternate languages -->
    <link rel="alternate" hreflang="en" href="https://oriolmacias.dev/about" />
    <link rel="alternate" hreflang="es" href="https://oriolmacias.dev/es/about" />
    <link rel="alternate" hreflang="fr" href="https://oriolmacias.dev/fr/about" />

    <!-- Structured Data -->
    <script type="application/ld+json" set:html={JSON.stringify(personSchema)} />
  </head>

  <!-- Page content -->
  <h1>{t('about:heading')}</h1>
  <p>{t('about:intro')}</p>
</Layout>
```

**Validation**:
```bash
# 1. Run internal validation
npm run check:structured-data

# 2. Test in Google Rich Results
# Visit: https://search.google.com/test/rich-results
# Enter: https://oriolmacias.dev/about
```

---

## 4. Performance Optimization

### Lighthouse Audit Workflow

**Steps**:
1. Run Lighthouse audit
2. Identify issues (LCP, FID, CLS)
3. Fix performance bottlenecks
4. Re-audit to confirm improvements

**Command**:
```bash
# Start preview server
npm run build
npm run preview

# Run Lighthouse (in another terminal)
npm run a11y:audit

# Opens lighthouse-report.html in browser
```

**Common fixes**:

**LCP (Largest Contentful Paint) >2.5s**:
```astro
---
// Optimize hero image
---

<!-- Preload critical image -->
<link rel="preload" href="/images/hero.webp" as="image" />

<!-- Responsive image with WebP -->
<picture>
  <source srcset="/images/hero.webp" type="image/webp" />
  <img
    src="/images/hero.jpg"
    alt="Hero"
    width="1920"
    height="1080"
    loading="eager"
    decoding="async"
  />
</picture>
```

**FID (First Input Delay) >100ms**:
```astro
---
// Use client:idle for non-critical interactivity
import AnimatedComponent from '../components/AnimatedComponent.tsx';
---

<AnimatedComponent client:idle />
```

**CLS (Cumulative Layout Shift) >0.1**:
```astro
---
// Always specify width/height
---

<img
  src="/images/profile.jpg"
  alt="Profile"
  width="800"
  height="800"
  loading="lazy"
/>

<style>
  img {
    aspect-ratio: 1 / 1; /* Prevents layout shift */
  }
</style>
```

---

## 5. Accessibility Auditing

### Color Contrast Check

**Workflow**:
1. Run contrast checker
2. Fix any failing contrasts
3. Re-check to confirm

**Command**:
```bash
npm run check:contrast
```

**Fix example**:
```css
/* ❌ Fails WCAG AA (contrast ratio 3.5:1) */
.text-gray {
  color: #999999;
  background: #ffffff;
}

/* ✅ Passes WCAG AA (contrast ratio 4.5:1) */
.text-gray {
  color: #767676;
  background: #ffffff;
}
```

### Full Accessibility Audit

**Command**:
```bash
npm run a11y:audit
```

**Common a11y fixes**:

**Missing alt text**:
```astro
<!-- ❌ Bad -->
<img src="/image.jpg" />

<!-- ✅ Good -->
<img src="/image.jpg" alt="Descriptive alt text" />
```

**Missing form labels**:
```tsx
<!-- ❌ Bad -->
<input type="text" placeholder="Name" />

<!-- ✅ Good -->
<label htmlFor="name">Name</label>
<input type="text" id="name" placeholder="Enter your name" />
```

**Missing landmark roles**:
```astro
<!-- ✅ Good semantic HTML -->
<header>
  <nav>...</nav>
</header>

<main>
  <article>...</article>
</main>

<footer>...</footer>
```

---

## 6. Build & Deployment

### Development Build

**Steps**:
1. Run font setup
2. Start dev server
3. Generate images

**Command**:
```bash
npm run dev

# Runs:
# → node scripts/font-awesome-setup.js
# → node scripts/dev.js
# → npm run generate-images
```

**Server**: `http://localhost:4321`

---

### Production Build

**Steps**:
1. Run font setup
2. Build for production (with compression)
3. Generate optimized images
4. Preview build

**Commands**:
```bash
# Build
npm run build

# Runs:
# → node scripts/font-awesome-setup.js
# → node scripts/build.js (astro build + astro-compress)
# → npm run generate-images

# Preview
npm run preview
```

**Output**: `dist/` folder

---

### Pre-Deployment Checklist

**Run all checks**:
```bash
npm run check

# Runs:
# → npm run check:contrast
# → npm run check:translations
# → npm run check:structured-data
```

**Manual checks**:
- [ ] All translations complete
- [ ] Color contrast passes WCAG AA
- [ ] Structured data valid
- [ ] Sitemap includes all routes
- [ ] Images optimized (WebP generated)
- [ ] Font Awesome subset created
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Lighthouse score >90

---

## 7. Image Generation

### Responsive Profile Images

**Workflow**:
1. Place source image in `public/images/`
2. Run generation script
3. Use ResponsiveProfileImage component

**Command**:
```bash
npm run generate-images
```

**Script**: `scripts/generate-profile-images.js`

**Generated sizes**:
- 100x100 (thumbnail)
- 300x300 (small)
- 600x600 (medium)
- 1200x1200 (large)
- WebP versions of all

**Usage**:
```astro
---
import ResponsiveProfileImage from '../components/ResponsiveProfileImage.tsx';
---

<ResponsiveProfileImage
  src="/images/profile.jpg"
  alt="Oriol Macías - Full Stack Developer"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## 8. Font Awesome Optimization

### Setup Workflow

**Purpose**: Only load icons actually used in project

**Command**:
```bash
npm run setup:font-awesome
```

**Script**: `scripts/font-awesome-setup.js`

**Process**:
1. Scans all source files for icon usage
2. Generates subset CSS with only used icons
3. Creates optimized font files
4. Outputs to `public/styles/font-awesome-optimized.css`

**Usage in components**:
```astro
---
// Automatically included in Layout
---

<i class="fa fa-github"></i>
<i class="fa fa-linkedin"></i>
<i class="fa fa-envelope"></i>
```

---

## 9. Testing Workflow

### Manual Testing Checklist

**Multi-language**:
- [ ] Visit `http://localhost:4321/` (en)
- [ ] Visit `http://localhost:4321/es/` (es)
- [ ] Visit `http://localhost:4321/fr/` (fr)
- [ ] Test language switcher
- [ ] Verify all text translates

**Responsive**:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large desktop (1920px)

**Performance**:
- [ ] Run Lighthouse audit
- [ ] Check LCP <2.5s
- [ ] Check FID <100ms
- [ ] Check CLS <0.1

**Accessibility**:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes
- [ ] Forms have labels
- [ ] Images have alt text

---

### Automated Testing

**Run all checks**:
```bash
npm run check
```

**Individual checks**:
```bash
npm run check:contrast          # Color contrast
npm run check:translations      # i18n completeness
npm run check:structured-data   # JSON-LD validation
```

---

## 10. Debugging Common Issues

### Dev Server Won't Start

**Issue**: Port 4321 already in use

**Fix**:
```bash
# Kill process on port 4321
# Windows:
netstat -ano | findstr :4321
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4321 | xargs kill -9
```

---

### Build Fails

**Issue**: Astro config error

**Check**:
```bash
# Validate astro.config.mjs syntax
node astro.config.mjs
```

**Common errors**:
- Missing `site` property
- Invalid `i18n` configuration
- Integration conflicts

---

### Translation Not Loading

**Issue**: Shows `[missing "en.key" translation]`

**Debug steps**:
```bash
# 1. Check key exists in all locales
npm run check:translations

# 2. Verify locale is set
console.log(Astro.currentLocale); // Should be 'en', 'es', or 'fr'

# 3. Verify changeLanguage called
changeLanguage(Astro.currentLocale || 'en');

# 4. Check namespace loaded
// In React: useTranslation(['common', 'namespace'])
// In Astro: t('namespace:key')
```

---

### Images Not Optimizing

**Issue**: WebP versions not generated

**Fix**:
```bash
# Ensure Sharp is installed
npm install sharp

# Run image generation
npm run generate-images

# Check output in public/images/
```

---

## Quick Command Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Preview production | `npm run preview` |
| Generate images | `npm run generate-images` |
| Setup Font Awesome | `npm run setup:font-awesome` |
| Check contrast | `npm run check:contrast` |
| Check translations | `npm run check:translations` |
| Validate structured data | `npm run check:structured-data` |
| Run all checks | `npm run check` |
| Lighthouse audit | `npm run a11y:audit` |
| Clean build | `npm run clean` |
| Lint code | `npm run lint` |

---

## Workflow Shortcuts

**New feature workflow**:
```bash
# 1. Create components
# 2. Add translations
npm run check:translations

# 3. Add structured data
npm run check:structured-data

# 4. Test locally
npm run dev

# 5. Build & validate
npm run build
npm run check
npm run preview

# 6. Deploy
```

**Quick fix workflow**:
```bash
# 1. Make changes
# 2. Test in dev
npm run dev

# 3. Verify no regressions
npm run check
```
