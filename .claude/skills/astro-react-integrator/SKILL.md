---
name: astro-react-integrator
description: Integrate React components in Astro with optimal client directives (load/idle/visible/media/only)
activation:
  keywords:
    - react component
    - client directive
    - hydration
    - client:load
    - client:idle
    - client:visible
  triggers:
    - "client:"
  auto_load_project: cv-astro
---

# Astro React Integrator

## What This Is

Integrate React components in Astro with **optimal client directives** for maximum performance:
- Choose correct directive (load/idle/visible/media/only)
- TypeScript Props interface
- i18n integration with `useTranslation`
- Performance optimization (lazy loading)

**For**: CV_Astro project (Astro 5.5.2 + React 18)

---

## When to Activate

Auto-activates when keywords detected:
- "react component in astro"
- "client:load", "client:idle", "client:visible"
- "hydration"
- "interactive component"

---

## Client Directives Decision Tree

```
┌─────────────────────────────────────────────────┐
│ Is interaction CRITICAL for page load?         │
│ (e.g., ContactForm, Navigation)                │
└────────────┬────────────────────────────────────┘
             │
         YES │ NO
             ▼                    ▼
      client:load         Is below the fold?
     (Hydrate now)               │
                          YES │ NO
                              ▼                    ▼
                       client:visible      Is interaction
                      (When in view)       immediate?
                                                  │
                                           YES │ NO
                                               ▼                    ▼
                                        client:idle          client:media
                                       (When idle)         (Media query)
```

---

## Client Directives Guide

### 1. **`client:load`** - Critical Interactivity

**When**: User needs it immediately on page load

**Use Cases**:
- Contact forms
- Navigation menus (mobile)
- Critical user inputs
- Authentication forms

**Example**:
```astro
---
// src/pages/contact.astro
import ContactForm from '../components/ContactForm.tsx';
---

<ContactForm client:load locale={Astro.currentLocale || 'en'} />
```

**Trade-off**: ⚠️ Increases initial JS bundle, blocks rendering

---

### 2. **`client:idle`** - Defer Non-Critical

**When**: Interaction not needed immediately, can wait for browser idle

**Use Cases**:
- Animations
- Scroll effects
- Non-critical modals
- Tooltips
- Analytics

**Example**:
```astro
---
import ScrollAnimation from '../components/ScrollAnimation.tsx';
---

<ScrollAnimation client:idle />
```

**Trade-off**: ✅ Best for non-critical features (loads when CPU idle)

---

### 3. **`client:visible`** - Lazy Load Below Fold

**When**: Component below the fold, only hydrate when scrolled into view

**Use Cases**:
- Newsletter signup (footer)
- Image galleries (below fold)
- Comment sections
- Related content

**Example**:
```astro
---
import NewsletterSignup from '../components/NewsletterSignup.tsx';
---

<NewsletterSignup client:visible />
```

**Trade-off**: ✅ Excellent for below-fold content (IntersectionObserver)

---

### 4. **`client:media`** - Responsive Hydration

**When**: Only needed on specific viewport sizes

**Use Cases**:
- Mobile-only navigation
- Desktop-only sidebars
- Responsive features

**Example**:
```astro
---
import MobileMenu from '../components/MobileMenu.tsx';
---

<MobileMenu client:media="(max-width: 768px)" />
```

**Trade-off**: ✅ Only loads JS when media query matches

---

### 5. **`client:only`** - Skip SSR

**When**: Component has SSR issues (window, document dependencies)

**Use Cases**:
- Third-party widgets
- Browser-only libraries
- Components with `window` dependencies

**Example**:
```astro
---
import BrowserOnlyWidget from '../components/BrowserOnlyWidget.tsx';
---

<BrowserOnlyWidget client:only="react" />
```

**Trade-off**: ⚠️ No SSR, flash of unstyled content possible

---

## React Component Patterns

### 1. **Simple React Component** (No i18n)

```tsx
// src/components/Counter.tsx
import React, { useState } from 'react';
import type { FC } from 'react';

interface CounterProps {
  initialCount?: number;
}

const Counter: FC<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="counter">
      <p className="count">{count}</p>
      <button onClick={() => setCount(count + 1)} className="btn">
        Increment
      </button>
    </div>
  );
};

export default Counter;
```

**Usage in Astro**:
```astro
---
import Counter from '../components/Counter.tsx';
---

<!-- Non-critical, load when idle -->
<Counter client:idle initialCount={10} />
```

---

### 2. **React Component with i18n**

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
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
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
          placeholder={t('contact:form.namePlaceholder')}
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
          placeholder={t('contact:form.emailPlaceholder')}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">{t('common:labels.message')}</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={t('contact:form.messagePlaceholder')}
          rows={5}
          required
        />
      </div>

      <button type="submit" disabled={status === 'sending'} className="submit-btn">
        {status === 'sending' ? t('contact:form.sending') : t('common:actions.contactMe')}
      </button>

      {status === 'success' && (
        <p className="success-message">{t('contact:form.success')}</p>
      )}

      {status === 'error' && (
        <p className="error-message">{t('contact:form.error')}</p>
      )}
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

<!-- Critical form, load immediately -->
<ContactForm client:load locale={Astro.currentLocale || 'en'} />
```

---

### 3. **React Component with State Management**

```tsx
// src/components/LanguageSwitcher.tsx
import React from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  currentLocale: string;
}

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);

    // Navigate to new locale URL
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(es|fr)/, '');
    const newPath = langCode === 'en'
      ? pathWithoutLocale || '/'
      : `/${langCode}${pathWithoutLocale}`;

    window.location.href = newPath;
  };

  return (
    <div className="language-switcher">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`lang-btn ${currentLocale === lang.code ? 'active' : ''}`}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="flag">{lang.flag}</span>
          <span className="label">{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
```

**Usage in Astro**:
```astro
---
import LanguageSwitcher from '../components/LanguageSwitcher.tsx';
---

<!-- Critical navigation, load immediately -->
<LanguageSwitcher client:load currentLocale={Astro.currentLocale || 'en'} />
```

---

## Integration Workflow

### Step 1: Analyze Interactivity Need

**Questions**:
1. Is interaction critical for page load? → `client:load`
2. Is component below the fold? → `client:visible`
3. Can interaction wait? → `client:idle`
4. Only for specific viewport? → `client:media`
5. Has SSR issues? → `client:only`

### Step 2: Create React Component

**Pattern**: `src/components/{ComponentName}.tsx`

**TypeScript interface**:
```tsx
interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  locale?: string; // If using i18n
}
```

### Step 3: Add i18n (if user-facing)

**Import**:
```tsx
import { useTranslation } from 'react-i18next';
```

**Usage**:
```tsx
const { t } = useTranslation(['common', 'namespace']);
```

**Translations**:
```tsx
<button>{t('common:actions.submit')}</button>
```

### Step 4: Integrate in Astro Page

```astro
---
import ComponentName from '../components/ComponentName.tsx';
---

<ComponentName
  client:idle  // Choose appropriate directive
  requiredProp="value"
  locale={Astro.currentLocale || 'en'}
/>
```

---

## Performance Optimization

### Measure Impact

**Before optimization**:
```bash
npm run build
# Check bundle size in dist/_astro/
```

**After choosing correct directive**:
- `client:load` → Largest bundle
- `client:idle` → Medium bundle (deferred)
- `client:visible` → Smallest bundle (lazy)

### Best Practices

1. **Default to `client:idle`** unless:
   - Critical for UX → `client:load`
   - Below fold → `client:visible`
   - Viewport-specific → `client:media`

2. **Minimize `client:load` usage**:
   - Only for forms, navigation, auth
   - Everything else → `client:idle` or `client:visible`

3. **Split large components**:
   ```astro
   <!-- ❌ Bad: Load everything at once -->
   <LargeComponent client:load />

   <!-- ✅ Good: Split and lazy load -->
   <CriticalPart client:load />
   <NonCriticalPart client:idle />
   ```

4. **Use `client:visible` for below-fold**:
   ```astro
   <Header client:load />          <!-- Above fold -->
   <Newsletter client:visible />   <!-- Below fold -->
   <Footer client:visible />       <!-- Below fold -->
   ```

---

## Common Patterns

### Pattern 1: Form (Critical)

```astro
---
import ContactForm from '../components/ContactForm.tsx';
---

<ContactForm
  client:load  // Critical: User needs immediately
  locale={Astro.currentLocale || 'en'}
/>
```

---

### Pattern 2: Animation (Non-Critical)

```astro
---
import ScrollReveal from '../components/ScrollReveal.tsx';
---

<ScrollReveal
  client:idle  // Non-critical: Can wait
/>
```

---

### Pattern 3: Below Fold (Lazy)

```astro
---
import Newsletter from '../components/Newsletter.tsx';
---

<Newsletter
  client:visible  // Below fold: Load when scrolled
  locale={Astro.currentLocale || 'en'}
/>
```

---

### Pattern 4: Mobile-Only (Responsive)

```astro
---
import MobileMenu from '../components/MobileMenu.tsx';
---

<MobileMenu
  client:media="(max-width: 768px)"  // Mobile only
/>
```

---

## Validation

After integration, check:

- [ ] Correct directive chosen (load/idle/visible/media/only)
- [ ] TypeScript Props interface defined
- [ ] i18n integrated (if user-facing text)
- [ ] Locale prop passed (if i18n)
- [ ] Component exported as default
- [ ] No console errors in browser
- [ ] Performance: Check bundle size
- [ ] Accessibility: Test keyboard navigation

---

## Quick Reference

| Directive | When | Example |
|-----------|------|---------|
| `client:load` | Critical, immediate | Contact form, navigation |
| `client:idle` | Non-critical, can wait | Animations, tooltips |
| `client:visible` | Below fold, lazy | Newsletter, footer widgets |
| `client:media` | Viewport-specific | Mobile menu, responsive |
| `client:only` | SSR issues | Browser-only libraries |

**Default recommendation**: Start with `client:idle`, optimize to `client:visible` or `client:load` as needed.
