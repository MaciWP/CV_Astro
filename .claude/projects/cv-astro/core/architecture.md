# CV_Astro Architecture Patterns

## Astro Component Guidelines

### File Naming
- Astro components: `PascalCase.astro`
- React components: `PascalCase.tsx` or `PascalCase.jsx`
- Layouts: `Layout.astro`
- Pages: `kebab-case.astro` or `[param].astro` for dynamic routes

### Component Structure

**Astro Component Pattern**:
```astro
---
// TypeScript in frontmatter
import type { Props } from './types';
import ReactComponent from './ReactComponent';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div class="container">
  <h1>{title}</h1>
  {description && <p>{description}</p>}
  <ReactComponent client:load />
</div>

<style>
  .container {
    /* Scoped styles */
  }
</style>
```

**React Component Pattern**:
```tsx
// src/components/ComponentName.tsx
import React from 'react';
import type { FC } from 'react';

interface ComponentNameProps {
  title: string;
  onAction?: () => void;
}

export const ComponentName: FC<ComponentNameProps> = ({ title, onAction }) => {
  return (
    <div className="component-wrapper">
      <h2>{title}</h2>
    </div>
  );
};

export default ComponentName;
```

---

## React Integration

### Client Directives

Choose the appropriate directive:

- `client:load` - Hydrate immediately (critical interactivity)
- `client:idle` - Hydrate when browser idle (non-critical)
- `client:visible` - Hydrate when in viewport (below-fold content)
- `client:media` - Hydrate based on media query (responsive behavior)
- `client:only` - Skip SSR, render only on client (problematic components)

**Example**:
```astro
---
import InteractiveForm from '../components/ContactForm.tsx';
import ScrollAnimation from '../components/ScrollAnimation.tsx';
---

<!-- Critical: Load immediately -->
<InteractiveForm client:load />

<!-- Non-critical: Load when idle -->
<ScrollAnimation client:idle />

<!-- Below fold: Load when visible -->
<NewsletterSignup client:visible />
```

---

## TypeScript Conventions

### Type Definitions

**Props interfaces**:
```typescript
// src/types/components.ts
export interface ProfileImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export interface LayoutProps {
  title: string;
  description?: string;
  lang?: 'en' | 'es' | 'fr';
}
```

**Import types**:
```astro
---
import type { ProfileImageProps } from '../types/components';
---
```

### Strict Mode

Project uses `astro/tsconfigs/strict`:
- All files must be typed
- No implicit `any`
- Strict null checks enabled
- Force consistent casing in filenames

---

## Styling with TailwindCSS

### Configuration

**File**: `tailwind.config.js` (if exists, otherwise defaults)

**Custom classes**: Prefer `@apply` in component styles over inline utilities for complex patterns

**Example**:
```astro
---
// Component logic
---

<div class="card">
  <h2 class="card-title">{title}</h2>
  <p class="card-description">{description}</p>
</div>

<style>
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .card-title {
    @apply text-2xl font-bold text-gray-900 mb-4;
  }

  .card-description {
    @apply text-gray-600 leading-relaxed;
  }
</style>
```

---

## Performance Best Practices

### Image Optimization

**Use Sharp for image generation**:
```javascript
// scripts/generate-profile-images.js pattern
import sharp from 'sharp';

await sharp(inputPath)
  .resize(width, height, { fit: 'cover' })
  .webp({ quality: 80 })
  .toFile(outputPath);
```

**Responsive Images Pattern**:
```astro
---
import ResponsiveProfileImage from '../components/ResponsiveProfileImage.tsx';
---

<ResponsiveProfileImage
  src="/images/profile.jpg"
  alt="Profile picture"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Font Optimization

**Font Awesome setup** (scripts/font-awesome-setup.js):
- Only load icons actually used
- Generate optimized CSS
- Subset fonts for languages

### Compression

**astro-compress** automatically:
- Minifies HTML/CSS/JS
- Compresses SVGs
- Optimizes images

**Build command**:
```bash
npm run build
# → Runs font-awesome-setup → astro build → generate-images
```

---

## Component Patterns

### Layout Pattern

```astro
---
// src/layouts/Layout.astro
import type { LayoutProps } from '../types/components';

interface Props extends LayoutProps {}

const { title, description, lang = 'en' } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Responsive Component Pattern

```tsx
// src/components/ResponsiveProfileImage.tsx
import React from 'react';
import type { FC } from 'react';

interface ResponsiveProfileImageProps {
  src: string;
  alt: string;
  sizes?: string;
}

const ResponsiveProfileImage: FC<ResponsiveProfileImageProps> = ({
  src,
  alt,
  sizes = '100vw'
}) => {
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading="lazy"
      decoding="async"
    />
  );
};

export default ResponsiveProfileImage;
```

---

## Build & Development

### Development Server

```bash
npm run dev
# → font-awesome-setup → dev script → generate-images
# → Starts on http://localhost:4321
```

### Production Build

```bash
npm run build
# → font-awesome-setup → build script → generate-images
# → Output: dist/
```

### Preview Production

```bash
npm run preview
# → Serves dist/ folder
```

---

## Testing

### Component Testing

```typescript
// Component.test.tsx pattern
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders title correctly', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Available Test Commands

```bash
npm run check:contrast      # Color contrast validation
npm run check:translations  # i18n completeness
npm run check:structured-data  # JSON-LD validation
npm run a11y:audit         # Lighthouse accessibility audit
```

---

## File Organization

### Component Location

- **Astro pages**: `src/pages/` (automatic routing)
- **Layouts**: `src/layouts/`
- **React components**: `src/components/`
- **Utilities**: `src/utils/`
- **Contexts**: `src/contexts/` (React context providers)
- **Types**: `src/types/` or inline in components
- **Styles**: `src/styles/` (global) or `<style>` blocks (scoped)

### Public Assets

- **Static files**: `public/`
- **Generated styles**: `public/styles/`
- **Fonts**: `public/styles/fonts/`
- **Translations**: `public/locales/{lang}/`

---

## Excluded Files

**tsconfig.json** excludes:
```json
{
  "exclude": [
    "dist",
    "node_modules",
    "src/components/ContactForm.jsx",
    "src/components/Icon.jsx",
    "src/components/Icons.jsx",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

**Note**: ContactForm, Icon, Icons are legacy JSX files excluded from TypeScript checking.

---

## Anti-Patterns to Avoid

❌ **Don't**: Mix Astro and React state management
✅ **Do**: Use Astro for static content, React for interactive islands

❌ **Don't**: Hydrate everything with `client:load`
✅ **Do**: Choose appropriate directive based on interactivity need

❌ **Don't**: Import entire icon libraries
✅ **Do**: Use font-awesome-setup.js to load only used icons

❌ **Don't**: Inline all styles
✅ **Do**: Use scoped `<style>` blocks in Astro components

❌ **Don't**: Skip responsive image generation
✅ **Do**: Run `npm run generate-images` before deploy
