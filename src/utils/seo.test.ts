import { describe, it, expect } from "vitest";
import {
    normalizePathname,
    detectMarketAndOptimizeSEO,
    generatePersonStructuredData,
    generateProfilePageStructuredData,
    generateWebSiteStructuredData,
    CONTENT_REVISED,
    serializeJsonLd,
} from "./seo";

const at = (path: string, language = "en") =>
    detectMarketAndOptimizeSEO(
        new URL(`https://oriolmacias.dev${path}`),
        language,
        "Default Title",
        "Default Description",
    );

describe("normalizePathname", () => {
    it("collapses the home build artifact to '/'", () => {
        expect(normalizePathname("/index.html")).toBe("/");
        expect(normalizePathname("/")).toBe("/");
    });

    it("strips the .html artifact from flat pages", () => {
        expect(normalizePathname("/es.html")).toBe("/es");
        expect(normalizePathname("/switzerland/zurich.html")).toBe(
            "/switzerland/zurich",
        );
    });

    it("drops a trailing slash except on root", () => {
        expect(normalizePathname("/es/")).toBe("/es");
        expect(normalizePathname("/spain/")).toBe("/spain");
    });

    it("never returns an empty string", () => {
        expect(normalizePathname("")).toBe("/");
    });
});

describe("detectMarketAndOptimizeSEO", () => {
    it("optimizes the English homepage (not the passed default)", () => {
        const r = at("/index.html", "en");
        expect(r.market).toBe("switzerland");
        expect(r.city).toBe("general");
        expect(r.title).toContain("Senior Backend Developer");
        expect(r.title).not.toBe("Default Title");
    });

    it("treats fr/de as the Swiss market", () => {
        expect(at("/fr", "fr").market).toBe("switzerland");
        expect(at("/fr", "fr").title).toContain("Suisse");
        expect(at("/de", "de").title).toContain("Schweiz");
    });

    it("detects a Swiss city from the path", () => {
        const r = at("/switzerland/zurich", "en");
        expect(r.market).toBe("switzerland");
        expect(r.city).toBe("zurich");
        expect(r.title).toContain("Zurich");
    });

    it("shares Geneva's optimization with the French 'geneve' spelling", () => {
        expect(at("/switzerland/geneve", "en").title).toContain("Geneva");
    });

    it("prioritizes the /spain path over the lang==='es' branch", () => {
        // Regression guard: /spain renders with lang='es'; it must NOT collapse
        // into the generic Spanish-home metadata (would duplicate-content /es).
        const spain = at("/spain", "es");
        const esHome = at("/es", "es");
        expect(spain.market).toBe("spain");
        expect(spain.title).toContain("España");
        expect(spain.title).not.toBe(esHome.title);
    });

    it("optimizes the Spanish-language home", () => {
        const r = at("/es", "es");
        expect(r.market).toBe("spain");
        expect(r.title).toContain("España");
    });

    it.each([
        ["/es/blog", "es"],
        ["/es/blog/some-post", "es"],
        ["/fr/blog/some-post.html", "fr"],
        ["/de/blog", "de"],
        ["/blog/some-post", "en"],
        ["/404", "en"],
    ])("keeps the page's own metadata on non-home page %s", (path, lang) => {
        // Regression guard: the language-home branches used to fire on every
        // page in that language, so localized blog posts got the home title.
        const r = at(path, lang);
        expect(r.title).toBe("Default Title");
        expect(r.description).toBe("Default Description");
    });

    it("emits no geo market on pages outside the homes and hubs", () => {
        // A Swiss default leaked geo.region and work-permit metas into /blog and /404.
        expect(at("/blog", "en").market).toBe("general");
        expect(at("/404", "en").market).toBe("general");
        expect(at("/de/blog", "de").market).toBe("general");
    });

    it("falls back to the generic Swiss copy for a city without its own config", () => {
        const r = at("/switzerland/bern", "en");
        expect(r.market).toBe("switzerland");
        expect(r.city).toBe("bern");
    });
});

describe("structured data generators", () => {
    it("emits a valid Person with the standardized job title", () => {
        const person = generatePersonStructuredData();
        expect(person["@type"]).toBe("Person");
        expect(person.jobTitle).toBe("Senior Backend Developer");
        expect(person.sameAs).toContain("https://github.com/MaciWP");
        expect(person.sameAs).toContain(
            "https://linkedin.com/in/oriolmaciasbadosa",
        );
    });

    it("wraps the Person as ProfilePage.mainEntity without a nested @context", () => {
        const page = generateProfilePageStructuredData();
        expect(page["@type"]).toBe("ProfilePage");
        expect(page.dateModified).toBe(CONTENT_REVISED);
        expect(page.mainEntity["@type"]).toBe("Person");
        // Only the top-level node may carry @context.
        expect("@context" in page.mainEntity).toBe(false);
    });

    it("declares all four languages on the WebSite node", () => {
        const site = generateWebSiteStructuredData();
        expect(site["@type"]).toBe("WebSite");
        expect(site.inLanguage).toEqual(["en", "es", "fr", "de"]);
    });
});

describe("serializeJsonLd", () => {
    it("escapes < so a value cannot close the script element", () => {
        const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
        expect(out).not.toContain("<");
        expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
    });

    it("indents only when asked", () => {
        expect(serializeJsonLd({ a: 1 })).toBe('{"a":1}');
        expect(serializeJsonLd({ a: 1 }, true)).toBe('{\n  "a": 1\n}');
    });
});
