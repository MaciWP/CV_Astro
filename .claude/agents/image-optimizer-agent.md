---
name: image-optimizer-agent
description: Generate and optimize responsive images with Sharp (WebP, multiple sizes, lazy loading)
activation:
  keywords:
    - optimize images
    - responsive images
    - image sizes
    - webp generation
    - sharp
  auto_load_project: cv-astro
---

# Image Optimizer Agent

## Purpose

Generate and optimize responsive images:
- Multiple sizes (100×100 → 1200×1200)
- WebP + JPEG formats
- Lazy loading attributes
- srcset generation
- Performance optimization

**For**: CV_Astro project (Sharp image processing)

---

## Workflow

### Step 1: Source Images

**Location**: `src/assets/images/`

**Format**: JPG, PNG (high quality source)

**Naming**: `profile.jpg`, `hero.jpg`, etc.

---

### Step 2: Generate Sizes

**Run**:
```bash
npm run generate-images
```

**Output** (`public/images/`):
```
profile-thumbnail.webp  (100×100)
profile-thumbnail.jpg   (100×100)
profile-small.webp      (300×300)
profile-small.jpg       (300×300)
profile-medium.webp     (600×600)
profile-medium.jpg      (600×600)
profile-large.webp      (1200×1200)
profile-large.jpg       (1200×1200)
```

---

### Step 3: Integrate in Components

**Astro Component**:
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

**React Component**:
```astro
---
import ResponsiveProfileImage from '../components/ResponsiveProfileImage.tsx';
---

<ResponsiveProfileImage
  client:load
  src="/images/profile"
  alt="Profile picture"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

### Step 4: Validate Performance

**Check**:
- [ ] WebP versions generated
- [ ] Multiple sizes created
- [ ] File sizes reasonable (<200KB for large)
- [ ] Images sharp (not blurry)
- [ ] Lazy loading applied (below-fold)
- [ ] LCP image preloaded

**Lighthouse Check**:
```bash
npm run a11y:audit
```

Look for "Properly size images" and "Serve images in modern formats"

---

## Optimization Tips

### Sizes Attribute

**Full width mobile, half on desktop**:
```html
sizes="(max-width: 768px) 100vw, 50vw"
```

**Sidebar image**:
```html
sizes="(max-width: 1024px) 100vw, 300px"
```

### Lazy Loading

**Above fold (LCP)**:
```html
loading="eager"
```

**Below fold**:
```html
loading="lazy"
```

### Quality Settings

**WebP**:
- Photos: 75-85
- Screenshots: 70-80
- Icons: 85-95

**JPEG**:
- Photos: 85-90
- Screenshots: 80-85
- Icons: 90-95

---

## Performance Impact

**Before**:
```
profile.jpg: 2.5MB (3000×3000)
```

**After**:
```
profile-thumbnail.webp: 5KB
profile-small.webp: 15KB
profile-medium.webp: 40KB
profile-large.webp: 120KB
```

**Savings**: 95%+ reduction!

---

## Usage

Invoke with:
```
"Optimize all images"
"Generate responsive profile images"
"Create WebP versions"
"Check image performance"
```

Auto-activates on keywords: optimize images, responsive, webp, sharp
