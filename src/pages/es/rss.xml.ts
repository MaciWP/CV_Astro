/**
 * Spanish blog RSS feed at /es/rss.xml.
 * @file src/pages/es/rss.xml.ts
 */
import { blogFeed } from '../../utils/blog-feed';

export const GET = () => blogFeed('es');
