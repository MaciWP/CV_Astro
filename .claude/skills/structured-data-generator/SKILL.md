---
name: structured-data-generator
description: Generate Schema.org JSON-LD for Swiss/Spanish SEO (Person, JobPosting, CreativeWork, Organization)
activation:
  keywords:
    - structured data
    - json-ld
    - schema.org
    - seo schema
    - rich snippets
  triggers:
    - "@type"
    - "@context"
  auto_load_project: cv-astro
---

# Structured Data Generator

## What This Is

Generate SEO-optimized JSON-LD schemas for CV_Astro:
- **Person** schema (homepage)
- **JobPosting** schema (experience section)
- **CreativeWork** schema (projects)
- **Organization** schema (companies)
- Swiss & Spanish market optimization

**For**: CV_Astro project (SEO for Switzerland 🇨🇭 + Spain 🇪🇸)

---

## When to Activate

Auto-activates when keywords detected:
- "add structured data"
- "generate json-ld"
- "schema.org person"
- "job posting schema"

---

## Supported Schemas

### 1. Person Schema (Homepage)

**Use**: Main profile page, about page

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Oriol Macías",
  "url": "https://oriolmacias.dev",
  "image": "https://oriolmacias.dev/images/profile.jpg",
  "sameAs": [
    "https://linkedin.com/in/oriol-macias",
    "https://github.com/oriolmacias",
    "https://twitter.com/oriolmacias"
  ],
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Company Name",
    "url": "https://company.com"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Zurich",
    "addressRegion": "ZH",
    "addressCountry": "CH"
  },
  "knowsAbout": [
    "Web Development",
    "TypeScript",
    "React",
    "Astro",
    "Node.js",
    "Python"
  ],
  "knowsLanguage": [
    {
      "@type": "Language",
      "name": "English",
      "alternateName": "en"
    },
    {
      "@type": "Language",
      "name": "Spanish",
      "alternateName": "es"
    },
    {
      "@type": "Language",
      "name": "French",
      "alternateName": "fr"
    }
  ],
  "email": "oriol@example.com",
  "telephone": "+41-XX-XXX-XXXX"
}
```

**Astro Integration**:
```astro
---
// src/pages/index.astro
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  // ... complete schema
};
---

<head>
  <script type="application/ld+json" set:html={JSON.stringify(personSchema)} />
</head>
```

---

### 2. JobPosting Schema (Experience)

**Use**: Work experience, job history

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Senior Full Stack Developer",
  "description": "Led development of modern web applications using React, TypeScript, and Node.js",
  "datePosted": "2022-01-15",
  "validThrough": "2024-12-31",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Tech Company AG",
    "sameAs": "https://techcompany.com",
    "logo": "https://techcompany.com/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Zurich",
      "addressRegion": "ZH",
      "addressCountry": "CH"
    }
  },
  "employmentType": "FULL_TIME",
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "CHF",
    "value": {
      "@type": "QuantitativeValue",
      "value": 120000,
      "unitText": "YEAR"
    }
  },
  "skills": [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Docker"
  ],
  "responsibilities": [
    "Design and implement scalable web applications",
    "Lead technical architecture decisions",
    "Mentor junior developers"
  ]
}
```

**React Component**:
```tsx
// src/components/JobPostingSchema.tsx
import React from 'react';
import type { FC } from 'react';

interface Job {
  title: string;
  company: string;
  companyUrl: string;
  location: { city: string; country: string; canton?: string };
  startDate: string;
  endDate?: string;
  description: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
  skills: string[];
}

interface JobPostingSchemaProps {
  job: Job;
}

export const JobPostingSchema: FC<JobPostingSchemaProps> = ({ job }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.startDate,
    "validThrough": job.endDate || new Date().toISOString().split('T')[0],
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": job.companyUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location.city,
        "addressRegion": job.location.canton,
        "addressCountry": job.location.country
      }
    },
    "employmentType": job.employmentType,
    "skills": job.skills
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

---

### 3. CreativeWork Schema (Projects)

**Use**: Portfolio projects, side projects

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "E-Commerce Platform",
  "description": "Modern e-commerce platform built with React, Next.js, and Stripe",
  "url": "https://project-url.com",
  "image": "https://oriolmacias.dev/projects/ecommerce-screenshot.jpg",
  "creator": {
    "@type": "Person",
    "name": "Oriol Macías",
    "url": "https://oriolmacias.dev"
  },
  "dateCreated": "2024-01-01",
  "datePublished": "2024-06-15",
  "keywords": [
    "React",
    "Next.js",
    "TypeScript",
    "Stripe",
    "E-Commerce"
  ],
  "inLanguage": "en",
  "about": {
    "@type": "Thing",
    "name": "Web Development"
  },
  "programmingLanguage": [
    "TypeScript",
    "JavaScript"
  ],
  "runtimePlatform": "Node.js",
  "version": "1.0.0"
}
```

**Astro Integration**:
```astro
---
// src/pages/projects/[slug].astro
const project = {
  name: "Project Name",
  description: "Project description",
  // ... project data
};

const projectSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  // ... complete schema
};
---

<head>
  <script type="application/ld+json" set:html={JSON.stringify(projectSchema)} />
</head>
```

---

### 4. Organization Schema (Companies)

**Use**: Company profiles, employers

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tech Company AG",
  "url": "https://techcompany.com",
  "logo": "https://techcompany.com/logo.png",
  "description": "Leading technology company in Switzerland",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Zurich",
    "addressRegion": "ZH",
    "postalCode": "8001",
    "addressCountry": "CH"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+41-XX-XXX-XXXX",
    "contactType": "customer service",
    "areaServed": "CH",
    "availableLanguage": ["English", "German", "French"]
  },
  "sameAs": [
    "https://linkedin.com/company/techcompany",
    "https://twitter.com/techcompany"
  ]
}
```

---

## Swiss Market Optimization

### Address with Canton

```json
{
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Zurich",
    "addressRegion": "ZH",  // ← Canton code (ZH, GE, BS, etc.)
    "postalCode": "8001",
    "addressCountry": "CH"
  }
}
```

**Swiss Cantons**:
- ZH: Zurich
- GE: Geneva
- BS: Basel-Stadt
- BE: Bern
- VD: Vaud

### Multi-Language Support

```json
{
  "inLanguage": ["en", "de", "fr", "it"],
  "knowsLanguage": [
    { "@type": "Language", "name": "German", "alternateName": "de" },
    { "@type": "Language", "name": "French", "alternateName": "fr" },
    { "@type": "Language", "name": "English", "alternateName": "en" }
  ]
}
```

### Currency

```json
{
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "CHF",  // ← Swiss Franc
    "value": {
      "@type": "QuantitativeValue",
      "value": 120000,
      "unitText": "YEAR"
    }
  }
}
```

---

## Spanish Market Optimization

### Spain-Specific Address

```json
{
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressRegion": "Catalonia",
    "postalCode": "08001",
    "addressCountry": "ES"  // ← Spain
  }
}
```

### Language

```json
{
  "inLanguage": "es",
  "knowsLanguage": [
    { "@type": "Language", "name": "Spanish", "alternateName": "es" },
    { "@type": "Language", "name": "Catalan", "alternateName": "ca" }
  ]
}
```

### Currency

```json
{
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "EUR",  // ← Euro
    "value": {
      "@type": "QuantitativeValue",
      "value": 50000,
      "unitText": "YEAR"
    }
  }
}
```

---

## Generation Workflow

### Step 1: Identify Schema Type

**Questions**:
- Homepage/About? → **Person**
- Work experience? → **JobPosting**
- Project portfolio? → **CreativeWork**
- Company profile? → **Organization**

### Step 2: Collect Required Fields

**Person Schema**:
- name, url, image, jobTitle, address, skills, languages

**JobPosting Schema**:
- title, company, location, startDate, employmentType, skills

**CreativeWork Schema**:
- name, description, url, image, dateCreated, keywords

### Step 3: Generate JSON-LD

**Use template from above**, fill with actual data

### Step 4: Validate

**Tools**:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- Internal: `npm run check:structured-data`

### Step 5: Integrate in Astro

```astro
<head>
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
</head>
```

---

## Validation Script

**File**: `scripts/validate-structured-data.js`

```javascript
import fs from 'fs';
import { glob } from 'glob';

async function validateStructuredData() {
  const files = await glob('src/pages/**/*.astro');
  const errors = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check for JSON-LD
    const jsonLdMatch = content.match(/<script type="application\/ld\+json".*?>(.*?)<\/script>/gs);

    if (jsonLdMatch) {
      jsonLdMatch.forEach((match, index) => {
        try {
          // Extract JSON content
          const jsonContent = match.match(/set:html={JSON\.stringify\((.*?)\)}/)?.[1];
          if (!jsonContent) {
            const directJson = match.match(/<script.*?>(.*?)<\/script>/s)?.[1];
            if (directJson) {
              JSON.parse(directJson);
            }
          }
        } catch (e) {
          errors.push(`${file}: Invalid JSON-LD at position ${index + 1}`);
        }
      });
    }
  }

  if (errors.length > 0) {
    console.error('❌ Structured Data Validation Errors:');
    errors.forEach(err => console.error(`  ${err}`));
    process.exit(1);
  } else {
    console.log('✅ All structured data valid');
  }
}

validateStructuredData();
```

**Run**:
```bash
npm run check:structured-data
```

---

## Best Practices

### ✅ DO

1. **Include all required fields**:
   ```json
   {
     "@context": "https://schema.org",  // ← Required
     "@type": "Person",                 // ← Required
     "name": "Oriol Macías"             // ← Required
   }
   ```

2. **Use Swiss Canton codes**:
   ```json
   { "addressRegion": "ZH" }  // Not "Zurich"
   ```

3. **Validate before deploying**:
   ```bash
   npm run check:structured-data
   ```

4. **Use locale-specific data**:
   ```astro
   ---
   const locale = Astro.currentLocale || 'en';
   const jobTitle = locale === 'es' ? 'Desarrollador Full Stack' : 'Full Stack Developer';
   ---
   ```

### ❌ DON'T

1. **Don't skip @context**:
   ```json
   // ❌ Bad
   { "@type": "Person", "name": "..." }

   // ✅ Good
   { "@context": "https://schema.org", "@type": "Person", "name": "..." }
   ```

2. **Don't use invalid JSON**:
   ```json
   // ❌ Bad (trailing comma)
   { "name": "...", }

   // ✅ Good
   { "name": "..." }
   ```

3. **Don't forget validation**:
   Always test with Google Rich Results Test

---

## Quick Reference

| Schema Type | Use Case | Required Fields |
|-------------|----------|-----------------|
| **Person** | Homepage, About | @context, @type, name |
| **JobPosting** | Work experience | title, hiringOrganization, jobLocation |
| **CreativeWork** | Projects | name, creator |
| **Organization** | Companies | name, url |

**Swiss Optimization**: Canton code (ZH), CHF currency, multi-language
**Spanish Optimization**: ES country code, EUR currency, Spanish language
