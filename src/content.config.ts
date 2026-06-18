/**
 * Content Collections config — the blog collection.
 * @file src/content.config.ts
 *
 * Astro 6 Content Layer API: the `glob` loader reads Markdown from
 * src/content/blog and validates frontmatter against the Zod schema below.
 * `z` is re-exported by Astro (astro/zod) — NO `zod` dependency is added.
 * This file lives at src/content.config.ts (the canonical Astro 5/6 location),
 * NOT the legacy src/content/config.ts.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A POST
 *   1. Create src/content/blog/<kebab-slug>.md (Markdown only — `.mdx` is NOT
 *      enabled and adding @astrojs/mdx is out of policy). The filename (minus
 *      .md) becomes the URL slug: /blog/<kebab-slug>.
 *   2. Add the frontmatter block (see the schema below). `draft: true` keeps a
 *      post out of production builds (and the sitemap); it stays visible in
 *      `pnpm run dev`. Flip to `draft: false` to publish.
 *   3. Code fences are highlighted by Astro's built-in Shiki (no dependency).
 *   4. Images: inline Markdown images MUST carry alt text — `![meaningful alt](/path)`.
 *      For a header image set `heroImage` (a path under public/) + `heroImageAlt`.
 *   5. Run `pnpm run build` — the new page and its sitemap entry are automatic.
 *
 * LANGUAGE POLICY
 *   Blog posts are ENGLISH-ONLY by design. The 4-language CV i18n
 *   (src/data/locales/*, the near-duplicate index pages) is deliberately NOT
 *   extended to the blog: per-post translation into en/es/fr/de is
 *   unsustainable and the technical audience reads English. Do not wire blog
 *   content into `check:translations`.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Optional header image. Path under public/ (e.g. /images/blog/foo.svg).
    // heroImageAlt is REQUIRED-in-spirit when heroImage is set (accessibility).
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
