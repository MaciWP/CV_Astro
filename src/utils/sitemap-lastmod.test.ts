import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { lastmodFor, readPostDates, type PostDate } from "./sitemap-lastmod";

const SITE = "https://oriolmacias.dev";
const FALLBACK = "2026-10-26T00:00:00Z";
const posts: PostDate[] = [
    { lang: "en", slug: "old-post", date: "2026-06-18T00:00:00.000Z" },
    { lang: "en", slug: "new-post", date: "2026-10-26T00:00:00.000Z" },
    { lang: "es", slug: "old-post", date: "2026-06-20T00:00:00.000Z" },
];

describe("lastmodFor", () => {
    it("gives a post its own date, by language", () => {
        expect(lastmodFor(`${SITE}/blog/old-post`, posts, FALLBACK)).toBe("2026-06-18T00:00:00.000Z");
        expect(lastmodFor(`${SITE}/es/blog/old-post`, posts, FALLBACK)).toBe("2026-06-20T00:00:00.000Z");
    });

    it("gives a blog index the newest post of its language", () => {
        expect(lastmodFor(`${SITE}/blog`, posts, "2026-06-15T00:00:00Z")).toBe("2026-10-26T00:00:00.000Z");
        expect(lastmodFor(`${SITE}/es/blog/`, posts, "2026-06-15T00:00:00Z")).toBe("2026-06-20T00:00:00.000Z");
    });

    it("never dates a blog index before the site-wide revision", () => {
        expect(lastmodFor(`${SITE}/es/blog`, posts, FALLBACK)).toBe("2026-10-26T00:00:00.000Z");
        expect(lastmodFor(`${SITE}/fr/blog`, posts, FALLBACK)).toBe("2026-10-26T00:00:00.000Z");
    });

    it("keeps a post's own date even when the site-wide revision is newer", () => {
        expect(lastmodFor(`${SITE}/es/blog/old-post`, posts, FALLBACK)).toBe("2026-06-20T00:00:00.000Z");
    });

    it("falls back for other pages and for unknown posts", () => {
        expect(lastmodFor(`${SITE}/`, posts, FALLBACK)).toBe("2026-10-26T00:00:00.000Z");
        expect(lastmodFor(`${SITE}/es`, posts, "2026-06-15T00:00:00Z")).toBe("2026-06-15T00:00:00.000Z");
        expect(lastmodFor(`${SITE}/blog/missing`, posts, "2026-06-15T00:00:00Z")).toBe("2026-06-15T00:00:00.000Z");
    });

    it("does not treat a page that only starts with /blog as the blog", () => {
        expect(lastmodFor(`${SITE}/blogroll`, posts, "2026-06-15T00:00:00Z")).toBe("2026-06-15T00:00:00.000Z");
    });
});

describe("readPostDates", () => {
    const dir = mkdtempSync(join(tmpdir(), "blog-"));
    afterAll(() => rmSync(dir, { recursive: true, force: true }));
    const post = (lang: string, slug: string, frontmatter: string) => {
        mkdirSync(join(dir, lang), { recursive: true });
        writeFileSync(join(dir, lang, `${slug}.md`), `---\ntitle: "x"\n${frontmatter}\n---\n\nBody\n`);
    };
    post("en", "plain", "pubDate: 2026-10-13");
    post("en", "updated", "pubDate: 2026-06-18\nupdatedDate: \"2026-09-01\"");
    post("es", "draft", "pubDate: 2026-11-09\ndraft: true");
    post("es", "published", "pubDate: 2026-10-26\ndraft: false");

    it("reads pubDate, prefers updatedDate and skips drafts", () => {
        const byKey = Object.fromEntries(readPostDates(dir).map((p) => [`${p.lang}/${p.slug}`, p.date]));
        expect(byKey).toEqual({
            "en/plain": "2026-10-13T00:00:00.000Z",
            "en/updated": "2026-09-01T00:00:00.000Z",
            "es/published": "2026-10-26T00:00:00.000Z",
        });
    });
});
