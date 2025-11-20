---
name: astro-component-generator
description: Generate Astro components with TypeScript frontmatter, TailwindCSS patterns, and i18n support
activation:
  keywords:
    - astro component
    - create astro
    - new component
    - generate astro
  triggers:
    - "\.astro$"
  auto_load_project: cv-astro
---

# Astro Component Generator

## What This Is

Generate production-ready Astro components with:
- TypeScript frontmatter with Props interface
- TailwindCSS `@apply` patterns
- Scoped `<style>` blocks
- i18n integration with `t()` helper
- Proper file naming (PascalCase.astro)

**For**: CV_Astro project (Astro 5.5.2 + React 18 + i18n)

---

## When to Activate

Auto-activates when keywords detected:
- "create astro component"
- "new astro component"
- "generate ProfileCard component"

Manual activation: Use `/astro-component` command

---

## Component Types

### 1. **Simple Astro Component** (Static content)

```astro
---
// src/components/ProfileCard.astro
interface Props {
  name: string;
  title: string;
  image: string;
  bio?: string;
}

const { name, title, image, bio } = Astro.props;
---

<article class="profile-card">
  <img src={image} alt={name} class="profile-image" />
  <div class="content">
    <h2>{name}</h2>
    <p class="title">{title}</p>
    {bio && <p class="bio">{bio}</p>}
  </div>
</article>

<style>
  .profile-card {
    @apply bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow;
  }

  .profile-image {
    @apply w-24 h-24 rounded-full object-cover mb-4;
  }

  .content h2 {
    @apply text-2xl font-bold text-gray-900 mb-2;
  }

  .title {
    @apply text-lg text-gray-600 mb-3;
  }

  .bio {
    @apply text-gray-700 leading-relaxed;
  }
</style>
```

---

### 2. **Astro Component with i18n**

```astro
---
// src/components/ExperienceCard.astro
import { t, changeLanguage } from 'i18next';

interface Props {
  title: string;
  company: string;
  period: string;
  description: string;
  locale?: string;
}

const { title, company, period, description, locale = 'en' } = Astro.props;
changeLanguage(locale);
---

<article class="experience-card">
  <div class="header">
    <h3>{title}</h3>
    <span class="period">{period}</span>
  </div>
  <p class="company">{company}</p>
  <p class="description">{description}</p>
  <a href="#" class="read-more">{t('common:actions.readMore')}</a>
</article>

<style>
  .experience-card {
    @apply bg-white rounded-lg shadow-md p-6 mb-4;
  }

  .header {
    @apply flex justify-between items-start mb-3;
  }

  .header h3 {
    @apply text-xl font-bold text-gray-900;
  }

  .period {
    @apply text-sm text-gray-500;
  }

  .company {
    @apply text-lg text-gray-700 mb-3;
  }

  .description {
    @apply text-gray-600 leading-relaxed mb-4;
  }

  .read-more {
    @apply text-blue-600 hover:text-blue-800 font-medium;
  }
</style>
```

---

### 3. **Layout Component**

```astro
---
// src/layouts/BaseLayout.astro
import { t, changeLanguage } from 'i18next';

interface Props {
  title: string;
  description?: string;
  lang?: 'en' | 'es' | 'fr';
}

const { title, description, lang = 'en' } = Astro.props;
changeLanguage(lang);

const siteTitle = `${title} | Oriol Macías`;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{siteTitle}</title>
    {description && <meta name="description" content={description} />}

    <!-- SEO -->
    <link rel="canonical" href={Astro.url.href} />
    <meta property="og:title" content={siteTitle} />
    {description && <meta property="og:description" content={description} />}

    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }
</style>
```

---

## Generation Workflow

### Step 1: Analyze Requirements

**Questions to ask user (if unclear)**:
- Component type? (component, layout, page)
- With i18n? (yes/no)
- Styling approach? (tailwind, scoped, none)
- Props needed? (list interfaces)

### Step 2: Generate File Path

**Pattern**: `src/components/{ComponentName}.astro`
- **Components**: `src/components/`
- **Layouts**: `src/layouts/`
- **Pages**: `src/pages/`

**Naming**: PascalCase (e.g., `ProfileCard.astro`)

### Step 3: Generate TypeScript Props

```typescript
interface Props {
  // Required props (no ?)
  title: string;
  content: string;

  // Optional props (with ?)
  className?: string;
  locale?: 'en' | 'es' | 'fr';
}
```

### Step 4: Generate Frontmatter

**Without i18n**:
```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---
```

**With i18n**:
```astro
---
import { t, changeLanguage } from 'i18next';

interface Props {
  title: string;
  locale?: string;
}

const { title, locale = 'en' } = Astro.props;
changeLanguage(locale);
---
```

### Step 5: Generate Template

**Use semantic HTML**:
```astro
<article class="component-name">
  <h2>{title}</h2>
  <p>{content}</p>
</article>
```

### Step 6: Generate Styles

**TailwindCSS with @apply**:
```astro
<style>
  .component-name {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .component-name h2 {
    @apply text-2xl font-bold text-gray-900 mb-4;
  }
</style>
```

**Scoped CSS (if custom)**:
```astro
<style>
  .component-name {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 1.5rem;
  }
</style>
```

---

## Best Practices

### ✅ DO

1. **Use TypeScript Props interface**:
   ```astro
   ---
   interface Props {
     title: string;
     count?: number;
   }
   ---
   ```

2. **Destructure props**:
   ```astro
   const { title, count = 0 } = Astro.props;
   ```

3. **Use TailwindCSS @apply for reusable patterns**:
   ```css
   .card {
     @apply bg-white rounded-lg shadow-md p-6;
   }
   ```

4. **Include i18n for user-facing text**:
   ```astro
   <button>{t('common:actions.submit')}</button>
   ```

5. **Use semantic HTML**:
   ```astro
   <article>, <section>, <nav>, <header>, <footer>
   ```

### ❌ DON'T

1. **Don't skip Props interface**:
   ```astro
   <!-- ❌ Bad -->
   const { title } = Astro.props;

   <!-- ✅ Good -->
   interface Props { title: string; }
   const { title } = Astro.props;
   ```

2. **Don't inline all TailwindCSS classes**:
   ```astro
   <!-- ❌ Bad (too many classes) -->
   <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">

   <!-- ✅ Good (use @apply in style block) -->
   <div class="card">
   <style>
     .card { @apply bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow; }
   </style>
   ```

3. **Don't hardcode text (use i18n)**:
   ```astro
   <!-- ❌ Bad -->
   <button>Submit</button>

   <!-- ✅ Good -->
   <button>{t('common:actions.submit')}</button>
   ```

4. **Don't forget locale prop for i18n components**:
   ```astro
   <!-- ✅ Good -->
   interface Props {
     locale?: 'en' | 'es' | 'fr';
   }
   ```

---

## Validation

After generation, check:

- [ ] File created in correct directory
- [ ] PascalCase naming (ComponentName.astro)
- [ ] TypeScript Props interface defined
- [ ] Props destructured
- [ ] i18n integrated (if user-facing text)
- [ ] TailwindCSS @apply used
- [ ] Scoped styles added
- [ ] Semantic HTML used
- [ ] No syntax errors

---

## Example Usage

**User Request**:
```
"Create a ProjectCard component with title, description, image, and tags"
```

**Generated Component**:
```astro
---
// src/components/ProjectCard.astro
interface Props {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

const { title, description, image, tags, link } = Astro.props;
---

<article class="project-card">
  <img src={image} alt={title} class="project-image" />
  <div class="content">
    <h3>{title}</h3>
    <p>{description}</p>
    <div class="tags">
      {tags.map(tag => (
        <span class="tag">{tag}</span>
      ))}
    </div>
    {link && (
      <a href={link} class="view-project" target="_blank" rel="noopener">
        View Project →
      </a>
    )}
  </div>
</article>

<style>
  .project-card {
    @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow;
  }

  .project-image {
    @apply w-full h-48 object-cover;
  }

  .content {
    @apply p-6;
  }

  .content h3 {
    @apply text-2xl font-bold text-gray-900 mb-3;
  }

  .content p {
    @apply text-gray-600 leading-relaxed mb-4;
  }

  .tags {
    @apply flex flex-wrap gap-2 mb-4;
  }

  .tag {
    @apply bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full;
  }

  .view-project {
    @apply inline-block text-blue-600 hover:text-blue-800 font-medium;
  }
</style>
```

---

## Quick Reference

| Pattern | Code |
|---------|------|
| **Props interface** | `interface Props { title: string; }` |
| **Destructure** | `const { title } = Astro.props;` |
| **i18n import** | `import { t, changeLanguage } from 'i18next';` |
| **Set locale** | `changeLanguage(locale);` |
| **Translation** | `{t('namespace:key')}` |
| **TailwindCSS** | `<style> .class { @apply ...;  } </style>` |
| **Optional prop** | `count?: number` |
| **Default value** | `const { count = 0 } = Astro.props;` |
