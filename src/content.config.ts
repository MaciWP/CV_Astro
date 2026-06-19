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
 *   1. Create src/content/blog/<lang>/<kebab-slug>.md (Markdown only — `.mdx`
 *      is NOT enabled and adding @astrojs/mdx is out of policy). <lang> is one
 *      of en/es/fr/de; the entry id is "<lang>/<kebab-slug>" and the URL is
 *      /blog/<kebab-slug> for en or /<lang>/blog/<kebab-slug> otherwise.
 *   2. Add the frontmatter block (see the schema below). `draft: true` keeps a
 *      post out of production builds (and the sitemap); it stays visible in
 *      `pnpm run dev`. Flip to `draft: false` to publish.
 *   3. Code fences are highlighted by Astro's built-in Shiki (no dependency).
 *   4. Images: inline Markdown images MUST carry alt text — `![meaningful alt](/path)`.
 *      For a header image set `heroImage` (a path under public/) + `heroImageAlt`.
 *   5. Run `pnpm run build` — the new page and its sitemap entry are automatic.
 *
 * LANGUAGE POLICY
 *   Blog posts are multilingual: one Markdown file per locale under
 *   src/content/blog/<lang>/ (en/es/fr/de). Routes derive lang + slug from the
 *   entry id ("<lang>/<slug>"). A post MAY be en-only — just place it only in
 *   blog/en/; it then shows only in /blog and emits hreflang for en alone (no
 *   404s). This is SEPARATE from the CV i18n (src/data/locales); the blog is
 *   NOT wired into `check:translations`.
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
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
  }).refine((data) => !data.heroImage || !!data.heroImageAlt, {
    // Enforce alt text on content-bearing hero images at build time (WCAG 1.1.1).
    message: 'heroImageAlt is required when heroImage is set',
    path: ['heroImageAlt'],
  }),
});

export const collections = { blog };
