/**
 * RSS feed for one blog locale, shared by src/pages/rss.xml.ts (en) and
 * src/pages/es/rss.xml.ts. Drafts are left out through localizedPosts.
 * @file src/utils/blog-feed.ts
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { messages } from '../i18n';
import { SITE_URL } from '../data/profile';
import { blogUrl, localizedPosts, slugFromId, type FeedLocale } from './blog';

export async function blogFeed(lang: FeedLocale): Promise<Response> {
  const m = messages(lang).blog.meta;
  const posts = localizedPosts(await getCollection('blog'), lang);
  return rss({
    title: m.title,
    description: m.description,
    site: SITE_URL,
    // The site serves no trailing slash (astro.config.mjs) and 301s the slashed form.
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: blogUrl(lang, slugFromId(post.id)),
      categories: post.data.tags,
    })),
    customData: `<language>${lang}</language>`,
  });
}
