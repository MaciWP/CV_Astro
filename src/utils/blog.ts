/**
 * Blog i18n helpers.
 * @file src/utils/blog.ts
 *
 * Posts live in per-locale subdirs (src/content/blog/<lang>/<slug>.md), so each
 * collection entry id is "<lang>/<slug>". These helpers derive the locale and
 * slug and select/group posts per language. Shared by the en routes
 * (/blog) and the dynamic [lang] routes (/es|/fr|/de/blog).
 */
import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export const BLOG_LOCALES = ['en', 'es', 'fr', 'de'] as const;
export type BlogLocale = (typeof BLOG_LOCALES)[number];

/** Locale prefix of an entry id ("es/foo" → "es"). */
export function localeOf(id: string): string {
  return id.split('/')[0];
}

/** Slug without the locale prefix ("es/foo/bar" → "foo/bar"). */
export function slugFromId(id: string): string {
  return id.split('/').slice(1).join('/');
}

/** Hide drafts in production builds; keep them visible in `astro dev`. */
function isVisible(post: BlogEntry): boolean {
  return import.meta.env.PROD ? !post.data.draft : true;
}

/** Visible posts for one locale, newest first. */
export function localizedPosts(all: BlogEntry[], lang: string): BlogEntry[] {
  return all
    .filter((p) => localeOf(p.id) === lang && isVisible(p))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Locales that have a published version of this slug (drives per-post hreflang). */
export function localesForSlug(all: BlogEntry[], slug: string): string[] {
  return BLOG_LOCALES.filter((lang) =>
    all.some((p) => localeOf(p.id) === lang && slugFromId(p.id) === slug && isVisible(p)),
  );
}

/** Public URL for a post slug in a given locale (en has no prefix). */
export function blogUrl(lang: string, slug: string): string {
  return lang === 'en' ? `/blog/${slug}` : `/${lang}/blog/${slug}`;
}
