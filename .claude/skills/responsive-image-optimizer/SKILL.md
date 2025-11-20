---
name: responsive-image-optimizer
description: Generate responsive images with Sharp (WebP, multiple sizes, srcset)
activation:
  keywords:
    - responsive images
    - image optimization
    - webp
    - sharp
    - srcset
  triggers:
    - "generate-images"
  auto_load_project: cv-astro
---

# Responsive Image Optimizer

## What This Is

Generate responsive, optimized images using Sharp:
- Multiple sizes (100×100, 300×300, 600×600, 1200×1200)
- WebP conversion for modern browsers
- srcset generation
- Lazy loading attributes
- Automatic resizing and cropping

**For**: CV_Astro project (Sharp image processing)

---

## When to Activate

Auto-activates when keywords detected:
- "optimize images"
- "generate responsive images"
- "create webp versions"
- "image sizes"

Manual: `npm run generate-images`

---

## Image Generation Script

**File**: `scripts/generate-profile-images.js`

```javascript
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = 'src/assets/images';
const OUTPUT_DIR = 'public/images';

const SIZES = [
  { name: 'thumbnail', width: 100, height: 100 },
  { name: 'small', width: 300, height: 300 },
  { name: 'medium', width: 600, height: 600 },
  { name: 'large', width: 1200, height: 1200 }
];

const FORMATS = ['webp', 'jpg'];

async function generateResponsiveImages() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all source images
  const files = fs.readdirSync(INPUT_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file));

  console.log(`📸 Processing ${files.length} images...\n`);

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.parse(file).name;

    console.log(`Processing: ${file}`);

    for (const size of SIZES) {
      for (const format of FORMATS) {
        const outputName = `${baseName}-${size.name}.${format}`;
        const outputPath = path.join(OUTPUT_DIR, outputName);

        try {
          await sharp(inputPath)
            .resize(size.width, size.height, {
              fit: 'cover',
              position: 'center'
            })
            .toFormat(format, {
              quality: format === 'webp' ? 80 : 85
            })
            .toFile(outputPath);

          console.log(`  ✅ ${outputName}`);
        } catch (error) {
          console.error(`  ❌ Error generating ${outputName}:`, error.message);
        }
      }
    }

    console.log('');
  }

  console.log('✨ Image generation complete!\n');
}

generateResponsiveImages().catch(console.error);
```

---

## Responsive Image Component

### React Component

**File**: `src/components/ResponsiveProfileImage.tsx`

```tsx
import React from 'react';
import type { FC } from 'react';

interface ResponsiveProfileImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

const ResponsiveProfileImage: FC<ResponsiveProfileImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  priority = false
}) => {
  const baseName = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`
          ${baseName}-thumbnail.webp 100w,
          ${baseName}-small.webp 300w,
          ${baseName}-medium.webp 600w,
          ${baseName}-large.webp 1200w
        `}
        sizes={sizes}
      />
      <source
        type="image/jpeg"
        srcSet={`
          ${baseName}-thumbnail.jpg 100w,
          ${baseName}-small.jpg 300w,
          ${baseName}-medium.jpg 600w,
          ${baseName}-large.jpg 1200w
        `}
        sizes={sizes}
      />
      <img
        src={`${baseName}-medium.jpg`}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
};

export default ResponsiveProfileImage;
```

**Usage**:
```astro
---
import ResponsiveProfileImage from '../components/ResponsiveProfileImage.tsx';
---

<ResponsiveProfileImage
  client:load
  src="/images/profile"
  alt="Oriol Macías - Full Stack Developer"
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={true}
/>
```

---

### Astro Component

**File**: `src/components/OptimizedImage.astro`

```astro
---
interface Props {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

const { src, alt, sizes = '100vw', className = '', priority = false } = Astro.props;
const baseName = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
---

<picture>
  <source
    type="image/webp"
    srcset={`
      ${baseName}-thumbnail.webp 100w,
      ${baseName}-small.webp 300w,
      ${baseName}-medium.webp 600w,
      ${baseName}-large.webp 1200w
    `}
    sizes={sizes}
  />
  <source
    type="image/jpeg"
    srcset={`
      ${baseName}-thumbnail.jpg 100w,
      ${baseName}-small.jpg 300w,
      ${baseName}-medium.jpg 600w,
      ${baseName}-large.jpg 1200w
    `}
    sizes={sizes}
  />
  <img
    src={`${baseName}-medium.jpg`}
    alt={alt}
    class={className}
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
  />
</picture>
```

**Usage**:
```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
---

<OptimizedImage
  src="/images/profile"
  alt="Oriol Macías"
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={true}
/>
```

---

## Sizes Attribute Guide

### Common Patterns

```html
<!-- Full width on mobile, 50% on desktop -->
sizes="(max-width: 768px) 100vw, 50vw"

<!-- Full width on mobile, 33% on tablet, 25% on desktop -->
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"

<!-- Fixed widths -->
sizes="(max-width: 768px) 400px, 800px"

<!-- Sidebar image -->
sizes="(max-width: 1024px) 100vw, 300px"
```

---

## Advanced Optimization

### Background Images

**Script**: `scripts/generate-background-images.js`

```javascript
import sharp from 'sharp';

const BACKGROUND_SIZES = [
  { name: 'mobile', width: 768 },
  { name: 'tablet', width: 1024 },
  { name: 'desktop', width: 1920 },
  { name: 'large', width: 2560 }
];

async function generateBackgrounds() {
  for (const size of BACKGROUND_SIZES) {
    await sharp('src/assets/hero-background.jpg')
      .resize(size.width, null, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(`public/images/hero-${size.name}.webp`);

    console.log(`✅ Generated hero-${size.name}.webp`);
  }
}

generateBackgrounds();
```

**Usage**:
```css
.hero {
  background-image: url('/images/hero-mobile.webp');
}

@media (min-width: 768px) {
  .hero {
    background-image: url('/images/hero-tablet.webp');
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('/images/hero-desktop.webp');
  }
}

@media (min-width: 1920px) {
  .hero {
    background-image: url('/images/hero-large.webp');
  }
}
```

---

### Blur Placeholder

```javascript
async function generateWithPlaceholder(inputPath, baseName) {
  // Generate tiny blur placeholder (20px)
  await sharp(inputPath)
    .resize(20, 20, { fit: 'cover' })
    .blur(10)
    .toFormat('webp', { quality: 20 })
    .toFile(`public/images/${baseName}-placeholder.webp`);

  // Generate full sizes...
}
```

**React Component with Blur**:
```tsx
const [loaded, setLoaded] = useState(false);

<picture>
  <img
    src={`${baseName}-placeholder.webp`}
    alt={alt}
    className={`blur-placeholder ${loaded ? 'hidden' : ''}`}
  />
  <img
    src={`${baseName}-medium.webp`}
    alt={alt}
    onLoad={() => setLoaded(true)}
    className={loaded ? 'loaded' : 'loading'}
  />
</picture>
```

---

## Image Quality Guidelines

### JPEG Quality

```javascript
{
  quality: 85,  // Default
  mozjpeg: true  // Better compression
}
```

**Use cases**:
- Photos, portraits: 85-90
- Screenshots: 80-85
- Icons, graphics: 90-95

### WebP Quality

```javascript
{
  quality: 80,  // Default
  effort: 6  // Compression effort (0-6, higher = better but slower)
}
```

**Use cases**:
- Photos: 75-85
- Screenshots: 70-80
- Icons: 85-95

---

## Package.json Scripts

```json
{
  "scripts": {
    "generate-images": "node scripts/generate-profile-images.js",
    "dev": "npm run generate-images && astro dev",
    "build": "npm run generate-images && astro build"
  }
}
```

---

## Performance Impact

### Before Optimization

```
profile.jpg: 2.5MB (3000×3000)
hero.jpg: 5MB (4000×2000)
```

**Total**: 7.5MB

### After Optimization

```
profile-thumbnail.webp: 5KB (100×100)
profile-small.webp: 15KB (300×300)
profile-medium.webp: 40KB (600×600)
profile-large.webp: 120KB (1200×1200)

hero-mobile.webp: 80KB (768px wide)
hero-desktop.webp: 250KB (1920px wide)
```

**Total**: ~510KB (93% reduction!)

---

## Best Practices

### ✅ DO

1. **Always generate multiple sizes**:
   ```javascript
   SIZES = [100, 300, 600, 1200]
   ```

2. **Use WebP with JPEG fallback**:
   ```html
   <source type="image/webp" srcset="..." />
   <source type="image/jpeg" srcset="..." />
   ```

3. **Set appropriate sizes attribute**:
   ```html
   sizes="(max-width: 768px) 100vw, 50vw"
   ```

4. **Lazy load below-fold images**:
   ```html
   loading="lazy"
   ```

5. **Use eager loading for LCP images**:
   ```html
   loading="eager"
   ```

### ❌ DON'T

1. **Don't serve full-size images to mobile**:
   ```html
   <!-- ❌ Bad -->
   <img src="hero-4000px.jpg" />

   <!-- ✅ Good -->
   <img srcset="..." sizes="..." />
   ```

2. **Don't skip WebP format**:
   ```html
   <!-- ❌ Bad -->
   <img src="image.jpg" />

   <!-- ✅ Good -->
   <picture>
     <source type="image/webp" srcset="image.webp" />
     <img src="image.jpg" />
   </picture>
   ```

3. **Don't lazy load above-fold images**:
   ```html
   <!-- ❌ Bad (LCP image) -->
   <img src="hero.jpg" loading="lazy" />

   <!-- ✅ Good -->
   <img src="hero.jpg" loading="eager" />
   ```

---

## Validation

After generation, check:

- [ ] Multiple sizes generated (100, 300, 600, 1200)
- [ ] WebP versions created
- [ ] File sizes reasonable (<200KB for 1200px)
- [ ] Images sharp (not blurry)
- [ ] Aspect ratios correct
- [ ] No console errors in browser

---

## Quick Reference

| Size | Dimensions | Use Case |
|------|------------|----------|
| **Thumbnail** | 100×100 | List items, avatars |
| **Small** | 300×300 | Mobile, cards |
| **Medium** | 600×600 | Tablet, default |
| **Large** | 1200×1200 | Desktop, retina |

**Format**: WebP (primary) + JPEG (fallback)
**Quality**: WebP 80, JPEG 85
**Lazy Load**: Below-fold only
