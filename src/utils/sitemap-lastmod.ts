/**
 * Per-URL sitemap lastmod.
 * @file src/utils/sitemap-lastmod.ts
 *
 * A post's lastmod is its updatedDate, else its pubDate; a blog index takes the
 * newest post of its language or CONTENT_REVISED, whichever is later; every
 * other page takes CONTENT_REVISED. Google
 * uses lastmod only when it is accurate, so one global date for every URL told
 * it nothing had changed. astro.config.mjs cannot call getCollection, so the
 * dates come from the Markdown frontmatter.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface PostDate {
  lang: string;
  slug: string;
  /** ISO 8601 datetime. */
  date: string;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/** One scalar frontmatter field, without quotes. */
function field(frontmatter: string, name: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+?)["']?\\s*$`, 'm'));
  return match?.[1];
}

/** Published posts under `dir` (<lang>/<slug>.md) with their lastmod date. */
export function readPostDates(dir: string): PostDate[] {
  const posts: PostDate[] = [];
  for (const lang of readdirSync(dir, { withFileTypes: true })) {
    if (!lang.isDirectory()) continue;
    for (const file of readdirSync(join(dir, lang.name))) {
      if (!file.endsWith('.md')) continue;
      const source = readFileSync(join(dir, lang.name, file), 'utf8');
      const frontmatter = source.match(FRONTMATTER)?.[1] ?? '';
      if (field(frontmatter, 'draft') === 'true') continue;
      const date = field(frontmatter, 'updatedDate') ?? field(frontmatter, 'pubDate');
      if (!date) continue;
      posts.push({ lang: lang.name, slug: file.slice(0, -'.md'.length), date: new Date(date).toISOString() });
    }
  }
  return posts;
}

const BLOG_PATH = /^(?:\/(es|fr|de))?\/blog(?:\/(.+?))?\/?$/;

/**
 * lastmod for one sitemap URL. `fallback` (CONTENT_REVISED) covers every page that
 * is not a post, and is a floor for blog indexes: their title and copy change with
 * site-wide revisions too.
 */
export function lastmodFor(url: string, posts: PostDate[], fallback: string): string {
  const floor = new Date(fallback).toISOString();
  const match = new URL(url).pathname.match(BLOG_PATH);
  if (!match) return floor;
  const [, lang = 'en', slug] = match;
  const own = posts.filter((p) => p.lang === lang && (!slug || p.slug === slug)).map((p) => p.date);
  const dates = slug ? own : [...own, floor];
  return dates.sort().at(-1) ?? floor;
}
