/**
 * SEO Utilities & Structured Data Generators
 * @file src/utils/seo.ts
 * @description Centralized logic for market detection and schema generation
 */

export interface MarketDetection {
    market: "general" | "switzerland" | "spain";
    city: string;
    title: string;
    description: string;
    keywords: string;
}

export interface PersonSchema {
    "@context": string;
    "@type": "Person";
    "@id": string;
    name: string;
    alternateName: string[];
    description: string;
    url: string;
    mainEntityOfPage: string;
    jobTitle: string;
    sameAs: string[];
    worksFor: {
        "@type": "Organization";
        name: string;
        url: string;
    };
    brand: {
        "@type": "Brand";
        name: string;
        url: string;
    };
    knowsAbout: string[];
    identifier: {
        "@type": "PropertyValue";
        name: string;
        value: string;
    };
}

/**
 * Normalizes a pathname to its canonical clean form.
 * With build.format:'file' Astro emits flat .html files and Astro.url.pathname
 * reflects them (e.g. "/es.html"); canonical/hreflang URLs must never expose
 * the .html artifact or trailing slashes (trailingSlash: 'never', root excepted).
 *
 * "/index.html" -> "/"   "/es.html" -> "/es"   "/es/" -> "/es"
 * "/switzerland/zurich.html" -> "/switzerland/zurich"   "/" -> "/"
 */
export function normalizePathname(pathname: string): string {
    let path = pathname;
    if (path.endsWith("/index.html")) {
        path = path.slice(0, -"index.html".length);
    }
    if (path.endsWith(".html")) {
        path = path.slice(0, -".html".length);
    }
    if (path.length > 1 && path.endsWith("/")) {
        path = path.slice(0, -1);
    }
    return path === "" ? "/" : path;
}

/**
 * Detects market and optimizes SEO accordingly
 */
export function detectMarketAndOptimizeSEO(
    currentUrl: URL,
    language: string,
    defaultTitle: string,
    defaultDescription: string
): MarketDetection {
    let detectedMarket: "general" | "switzerland" | "spain" = "switzerland"; // Default to Swiss market
    let detectedCity = "general";
    let enhancedTitle = defaultTitle;
    let enhancedDescription = defaultDescription;
    let enhancedKeywords =
        "oriol macias, software developer, backend developer, cv, portfolio";

    try {
        const pathSegments = currentUrl.pathname.split("/").filter(Boolean);

        // Swiss cities detection with enhanced targeting
        const swissCities = [
            "zurich",
            "basel",
            "geneva",
            "geneve",
            "lausanne",
            "bern",
        ];
        const detectedSwissCity = pathSegments.find((segment) =>
            swissCities.includes(segment.toLowerCase())
        );

        if (detectedSwissCity || pathSegments.includes("switzerland")) {
            detectedMarket = "switzerland";
            detectedCity = detectedSwissCity || "general";

            // Brand optimization for homepage
            if (currentUrl.pathname === "/") {
                enhancedTitle =
                    "Oriol Macias - Senior Backend Developer | Switzerland-Ready";
                enhancedDescription =
                    "Senior Backend Developer: Python, Django, C#, industrial protocols (SNMP, Modbus, BACnet). 8+ years' experience. EU citizen, Swiss B-Permit eligible.";
                enhancedKeywords =
                    "oriol macias dev, oriol dev, macias dev, oriolmacias.dev, oriol software developer, backend developer switzerland, python developer switzerland, oriol macias portfolio";
            }
            // Swiss city-specific optimization
            else {
                const cityOptimizations: Record<string, { title: string; description: string; keywords: string }> = {
                    zurich: {
                        title:
                            "Oriol Macias - Senior Backend Developer Zurich | Python Expert",
                        description:
                            "Senior Backend Developer seeking opportunities in Zurich. 8+ years Python, Django expertise. Work permit ready for Swiss companies.",
                        keywords:
                            "backend developer zurich, python developer zurich, software engineer zurich, work permit switzerland",
                    },
                    basel: {
                        title:
                            "Oriol Macias - Software Engineer Basel | Industrial Automation",
                        description:
                            "Software Engineer specializing in Basel pharmaceutical sector. Industrial protocols (SNMP, Modbus, BACnet) expert.",
                        keywords:
                            "software engineer basel, industrial automation basel, pharmaceutical developer basel",
                    },
                    geneva: {
                        title:
                            "Oriol Macias - Backend Developer Geneva | International Orgs",
                        description:
                            "Backend Developer for Geneva's international organizations. English working proficiency; Spanish and Catalan native. SNMP/Modbus/BACnet integration expert.",
                        keywords:
                            "backend developer geneva, python developer geneva, international organizations geneva",
                    },
                    geneve: {
                        title:
                            "Oriol Macias - Backend Developer Geneva | International Orgs",
                        description:
                            "Backend Developer for Geneva's international organizations. English working proficiency; Spanish and Catalan native. SNMP/Modbus/BACnet integration expert.",
                        keywords:
                            "backend developer geneva, python developer geneva, international organizations geneva",
                    },
                };

                const cityConfig = cityOptimizations[detectedCity];
                if (cityConfig) {
                    enhancedTitle = cityConfig.title;
                    enhancedDescription = cityConfig.description;
                    enhancedKeywords = cityConfig.keywords;
                } else {
                    enhancedTitle =
                        "Oriol Macias - Backend Developer Switzerland | Work Permit Ready";
                    enhancedDescription =
                        "Senior Backend Developer seeking opportunities across Switzerland. 8+ years experience, EU work permit ready.";
                    enhancedKeywords =
                        "backend developer switzerland, python developer switzerland, work permit ready";
                }
            }
        }
        // Swiss languages detection (French, German) - Target Swiss market
        else if (language === "fr" || language === "de") {
            detectedMarket = "switzerland";

            if (language === "fr") {
                enhancedTitle =
                    "Oriol Macias - Développeur Python Suisse | Backend Senior";
                enhancedDescription =
                    "Développeur Python senior (Django, C#, SNMP/Modbus/BACnet), 8+ ans d'expérience. Citoyen UE, permis B immédiat – Genève, Lausanne, Zurich, Bâle.";
                enhancedKeywords =
                    "développeur python suisse, développeur backend suisse, développeur suisse, python développeur genève, ingénieur logiciel suisse, permis b suisse";
            } else if (language === "de") {
                enhancedTitle =
                    "Oriol Macias - Python Entwickler Schweiz | Senior Backend";
                enhancedDescription =
                    "Python Entwickler mit 8+ Jahren Erfahrung: Django, C#, SNMP/Modbus/BACnet. EU-Bürger, B-Bewilligung sofort – Zürich, Basel, Genf, Lausanne.";
                enhancedKeywords =
                    "python entwickler schweiz, backend entwickler schweiz, python entwickler zürich, software ingenieur schweiz, b-bewilligung";
            }
        }
        // Spanish market detection
        else if (
            pathSegments.includes("espana") ||
            pathSegments.includes("spain") ||
            language === "es"
        ) {
            detectedMarket = "spain";
            enhancedTitle =
                "Oriol Macias - Desarrollador Backend Senior | España y Suiza";
            enhancedDescription =
                "Desarrollador backend senior: Python, Django, C#, SNMP/Modbus/BACnet. 8+ años de experiencia. Disponible en Madrid, Barcelona y Suiza.";
            enhancedKeywords =
                "desarrollador backend españa, python desarrollador madrid, ingeniero software españa, desarrollador backend suiza";
        }
        // Homepage brand optimization
        else if (currentUrl.pathname === "/") {
            enhancedTitle =
                "Oriol Macias - Senior Backend Developer | Switzerland-Ready";
            enhancedDescription =
                "Senior Backend Developer: Python, Django, C#, industrial protocols (SNMP, Modbus, BACnet). 8+ years' experience. EU citizen, Swiss B-Permit eligible.";
            enhancedKeywords =
                "oriol macias dev, oriol dev, macias dev, oriolmacias.dev, oriol software developer, backend developer switzerland, python developer switzerland, oriol macias portfolio";
        }
    } catch (error) {
        console.warn("Market detection error:", error);
        // Fallback to safe defaults
    }

    return {
        market: detectedMarket,
        city: detectedCity,
        title: enhancedTitle,
        description: enhancedDescription,
        keywords: enhancedKeywords,
    };
}

/**
 * Generates Schema.org Person structured data
 */
export function generatePersonStructuredData(): PersonSchema {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://oriolmacias.dev/#oriol-macias-dev",
        name: "Oriol Macias",
        alternateName: ["Oriol Dev", "Macias Dev", "Oriol Macias Dev"],
        description: "Software Developer known professionally as Oriol Macias Dev",
        url: "https://oriolmacias.dev",
        mainEntityOfPage: "https://oriolmacias.dev",
        jobTitle: "Software Developer",
        sameAs: [
            "https://linkedin.com/in/oriolmaciasbadosa",
            "https://github.com/MaciWP",
        ],
        worksFor: {
            "@type": "Organization",
            name: "Bjumper",
            url: "https://bjumper.com",
        },
        brand: {
            "@type": "Brand",
            name: "Oriol Macias Dev",
            url: "https://oriolmacias.dev",
        },
        knowsAbout: [
            "Software Development",
            "Python",
            "Django",
            "Backend Development",
            "Industrial Protocols",
            "SNMP",
            "Modbus",
            "BACnet",
            "Data Center Infrastructure",
        ],
        identifier: {
            "@type": "PropertyValue",
            name: "Website",
            value: "oriolmacias.dev",
        },
    };
}

/**
 * Safely serializes data to JSON-LD string, preventing script injection and syntax errors
 * @param data The data object to serialize
 */
/**
 * Generates ProfilePage structured data wrapping the Person entity.
 * The correct schema for a personal CV/profile page (Google profile-page
 * guidance: ProfilePage with the Person inline as mainEntity). Replaces the
 * former JobPosting markup, which Google reserves for employers publishing
 * actual job openings (misrepresentation policy -> manual action risk).
 */
/**
 * Last material content revision, as a full ISO 8601 datetime.
 * Stable on purpose: build-time `new Date()` churned dateModified on every
 * deploy (no real change) and emitted a date-only value that Google's
 * ProfilePage validator rejected ("fecha y hora no válida"). Bump this by hand
 * when the CV content changes meaningfully.
 */
export const CONTENT_REVISED = "2026-06-15T00:00:00Z";

export function generateProfilePageStructuredData(): Record<string, any> {
    const person: Record<string, any> = { ...generatePersonStructuredData() };
    delete person["@context"];
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": "https://oriolmacias.dev/#profilepage",
        url: "https://oriolmacias.dev/",
        dateModified: CONTENT_REVISED,
        mainEntity: person,
    };
}

export function toSafeJsonLd(data: any): string {
    const json = JSON.stringify(data ?? {}, null, 2);
    // Escape closing </script to avoid early termination in HTML parsing
    return json.replace(/<\/script/gi, '<\\/script');
}

/**
 * WebSite Schema interface
 */
export interface WebSiteSchema {
    "@context": string;
    "@type": "WebSite";
    "@id": string;
    url: string;
    name: string;
    description: string;
    publisher: { "@id": string };
    inLanguage: string[];
}

/**
 * Generates Schema.org WebSite structured data
 * Improves site indexation and Google Knowledge Panel
 */
export function generateWebSiteStructuredData(): WebSiteSchema {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://oriolmacias.dev/#website",
        url: "https://oriolmacias.dev",
        name: "Oriol Macias - Backend Developer Portfolio",
        description: "Professional CV and portfolio for Oriol Macias, Backend Developer specialized in industrial protocols and Python/Django",
        publisher: {
            "@id": "https://oriolmacias.dev/#oriol-macias-dev"
        },
        inLanguage: ["en", "es", "fr", "de"]
    };
}
