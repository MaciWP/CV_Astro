/**
 * English blog RSS feed at /rss.xml.
 * @file src/pages/rss.xml.ts
 */
import { blogFeed } from '../utils/blog-feed';

export const GET = () => blogFeed('en');
