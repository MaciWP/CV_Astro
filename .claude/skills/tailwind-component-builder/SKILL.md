---
name: tailwind-component-builder
description: Build Astro/React components with TailwindCSS patterns and utility classes
activation:
  keywords:
    - tailwind component
    - utility classes
    - tailwind patterns
    - @apply
  triggers:
    - "tailwind"
    - "@apply"
  auto_load_project: cv-astro
---

# Tailwind Component Builder

## What This Is

Build components with TailwindCSS 3.4 best practices:
- Utility-first approach
- `@apply` directive for reusable patterns
- Responsive design patterns
- Dark mode support (if needed)
- Component variants

**For**: CV_Astro project (TailwindCSS 3.4.1)

---

## When to Activate

Auto-activates when keywords detected:
- "tailwind component"
- "utility classes"
- "@apply pattern"

---

## TailwindCSS Patterns

### 1. Card Component

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  description: string;
  link?: string;
}

const { title, description, link } = Astro.props;
---

<article class="card">
  <h3 class="card-title">{title}</h3>
  <p class="card-description">{description}</p>
  {link && (
    <a href={link} class="card-link">
      Learn more →
    </a>
  )}
</article>

<style>
  .card {
    @apply bg-white rounded-lg shadow-md p-6 mb-4;
    @apply hover:shadow-xl transition-shadow duration-300;
  }

  .card-title {
    @apply text-2xl font-bold text-gray-900 mb-3;
  }

  .card-description {
    @apply text-gray-600 leading-relaxed mb-4;
  }

  .card-link {
    @apply inline-block text-blue-600 hover:text-blue-800;
    @apply font-medium transition-colors;
  }
</style>
```

---

### 2. Button Variants

```astro
---
// src/components/Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit';
}

const { variant = 'primary', size = 'md', href, type = 'button' } = Astro.props;
const Tag = href ? 'a' : 'button';
---

<Tag
  class:list={['btn', `btn-${variant}`, `btn-${size}`]}
  href={href}
  type={href ? undefined : type}
>
  <slot />
</Tag>

<style>
  .btn {
    @apply inline-flex items-center justify-center;
    @apply font-medium rounded-lg transition-all;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  /* Sizes */
  .btn-sm {
    @apply text-sm px-3 py-2;
  }

  .btn-md {
    @apply text-base px-4 py-2;
  }

  .btn-lg {
    @apply text-lg px-6 py-3;
  }

  /* Variants */
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
    @apply focus:ring-blue-500;
  }

  .btn-secondary {
    @apply bg-gray-600 text-white hover:bg-gray-700;
    @apply focus:ring-gray-500;
  }

  .btn-outline {
    @apply bg-transparent border-2 border-blue-600 text-blue-600;
    @apply hover:bg-blue-600 hover:text-white;
    @apply focus:ring-blue-500;
  }
</style>
```

**Usage**:
```astro
<Button variant="primary" size="lg">Click me</Button>
<Button variant="outline" href="/contact">Contact</Button>
```

---

### 3. Form Input

```astro
---
// src/components/FormInput.astro
interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const {
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error
} = Astro.props;
---

<div class="form-group">
  <label for={name} class="form-label">
    {label}
    {required && <span class="required">*</span>}
  </label>

  <input
    type={type}
    id={name}
    name={name}
    placeholder={placeholder}
    required={required}
    class:list={['form-input', error && 'form-input-error']}
  />

  {error && <p class="form-error">{error}</p>}
</div>

<style>
  .form-group {
    @apply mb-4;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-2;
  }

  .required {
    @apply text-red-500 ml-1;
  }

  .form-input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    @apply transition-all;
  }

  .form-input-error {
    @apply border-red-500 focus:ring-red-500;
  }

  .form-error {
    @apply text-sm text-red-600 mt-1;
  }
</style>
```

---

### 4. Grid Layout

```astro
---
// src/components/ProjectGrid.astro
---

<div class="project-grid">
  <slot />
</div>

<style>
  .project-grid {
    @apply grid gap-6;
    @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
  }
</style>
```

---

### 5. Responsive Navigation

```astro
---
// src/components/Navigation.astro
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' }
];
---

<nav class="navigation">
  <div class="nav-container">
    <a href="/" class="nav-logo">Oriol Macías</a>

    <ul class="nav-menu">
      {navItems.map(item => (
        <li class="nav-item">
          <a href={item.href} class="nav-link">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<style>
  .navigation {
    @apply bg-white shadow-sm;
  }

  .nav-container {
    @apply max-w-7xl mx-auto px-4 py-4;
    @apply flex items-center justify-between;
  }

  .nav-logo {
    @apply text-2xl font-bold text-gray-900;
    @apply hover:text-blue-600 transition-colors;
  }

  .nav-menu {
    @apply hidden md:flex items-center space-x-8;
  }

  .nav-link {
    @apply text-gray-600 hover:text-blue-600;
    @apply font-medium transition-colors;
  }
</style>
```

---

## Responsive Patterns

### Mobile-First Approach

```css
/* Default (mobile) */
.container {
  @apply px-4 py-6;
}

/* Tablet */
@screen sm {
  .container {
    @apply px-6 py-8;
  }
}

/* Desktop */
@screen lg {
  .container {
    @apply px-8 py-12 max-w-7xl mx-auto;
  }
}
```

### Breakpoint Utilities

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">Desktop only</div>

<!-- Show on mobile, hide on desktop -->
<div class="block lg:hidden">Mobile only</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <!-- Content -->
</div>
```

---

## Common Patterns

### Container

```css
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Section Spacing

```css
.section {
  @apply py-12 sm:py-16 lg:py-20;
}
```

### Heading Hierarchy

```css
.heading-1 {
  @apply text-4xl sm:text-5xl lg:text-6xl font-bold;
}

.heading-2 {
  @apply text-3xl sm:text-4xl lg:text-5xl font-bold;
}

.heading-3 {
  @apply text-2xl sm:text-3xl lg:text-4xl font-semibold;
}
```

### Text Colors

```css
.text-primary {
  @apply text-gray-900;
}

.text-secondary {
  @apply text-gray-600;
}

.text-muted {
  @apply text-gray-500;
}

.text-accent {
  @apply text-blue-600;
}
```

---

## Best Practices

### ✅ DO

1. **Use @apply for reusable patterns**:
   ```css
   .btn {
     @apply px-4 py-2 rounded-lg font-medium transition-colors;
   }
   ```

2. **Mobile-first responsive design**:
   ```html
   <div class="text-sm sm:text-base lg:text-lg">
   ```

3. **Semantic class names**:
   ```css
   .card-title { /* Not .text-2xl-bold */ }
   ```

4. **Group related utilities**:
   ```html
   <div class="flex items-center justify-between">
   ```

### ❌ DON'T

1. **Don't inline all classes**:
   ```html
   <!-- ❌ Bad -->
   <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-xl transition-shadow duration-300 text-gray-900">

   <!-- ✅ Good -->
   <div class="card">
   <style>
     .card { @apply bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-xl transition-shadow; }
   </style>
   ```

2. **Don't create too many custom classes**:
   - Use @apply sparingly
   - Utility classes in HTML are OK for simple cases

3. **Don't forget responsive modifiers**:
   ```html
   <!-- ❌ Bad -->
   <div class="grid-cols-3">

   <!-- ✅ Good -->
   <div class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
   ```

---

## Quick Reference

| Pattern | Classes |
|---------|---------|
| **Container** | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| **Card** | `bg-white rounded-lg shadow-md p-6` |
| **Button** | `px-4 py-2 rounded-lg font-medium transition-colors` |
| **Grid** | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| **Flex** | `flex items-center justify-between` |
| **Text** | `text-gray-900 text-lg leading-relaxed` |

**Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
