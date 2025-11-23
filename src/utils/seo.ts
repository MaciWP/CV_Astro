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
                    "Oriol Macias Dev - Software Developer Portfolio | oriolmacias.dev";
                enhancedDescription =
                    "Oriol Macias Dev: Professional Software Developer specializing in Python, Django, and industrial protocols. Visit oriolmacias.dev for portfolio and contact.";
                enhancedKeywords =
                    "oriol macias dev, oriol dev, macias dev, oriolmacias.dev, oriol software developer, oriol backend developer, oriol macias portfolio";
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
                            "Software Engineer specializing in Basel pharmaceutical sector. Industrial protocols (SNMP, MODBUS, BACnet) expert.",
                        keywords:
                            "software engineer basel, industrial automation basel, pharmaceutical developer basel",
                    },
                    geneva: {
                        title:
                            "Oriol Macias - Backend Developer Geneva | Multilingual Professional",
                        description:
                            "Multilingual Backend Developer (EN/ES/FR) seeking Geneva opportunities. International organizations experience.",
                        keywords:
                            "backend developer geneva, multilingual developer geneva, international organizations",
                    },
                    geneve: {
                        title:
                            "Oriol Macias - Backend Developer Geneva | Multilingual Professional",
                        description:
                            "Multilingual Backend Developer (EN/ES/FR) seeking Geneva opportunities. International organizations experience.",
                        keywords:
                            "backend developer geneva, multilingual developer geneva, international organizations",
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
                    "Oriol Macias - Développeur Backend Suisse | Python Expert";
                enhancedDescription =
                    "Développeur Backend senior avec 8+ ans d'expérience. Python, Django, protocoles industriels. Disponible Suisse.";
                enhancedKeywords =
                    "développeur backend suisse, python développeur genève, ingénieur logiciel suisse";
            } else if (language === "de") {
                enhancedTitle =
                    "Oriol Macias - Backend Entwickler Schweiz | Python Experte";
                enhancedDescription =
                    "Senior Backend Entwickler mit 8+ Jahren Erfahrung. Python, Django, industrielle Protokolle. Verfügbar Schweiz.";
                enhancedKeywords =
                    "backend entwickler schweiz, python entwickler zürich, software ingenieur schweiz";
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
                "Oriol Macias - Desarrollador Backend España | Senior Python";
            enhancedDescription =
                "Desarrollador Backend senior con 8+ años experiencia. Python, Django, protocolos industriales. Disponible España.";
            enhancedKeywords =
                "desarrollador backend españa, python desarrollador madrid, ingeniero software españa";
        }
        // Homepage brand optimization
        else if (currentUrl.pathname === "/") {
            enhancedTitle =
                "Oriol Macias Dev - Software Developer Portfolio | oriolmacias.dev";
            enhancedDescription =
                "Oriol Macias Dev: Professional Software Developer specializing in Python, Django, and industrial protocols. Visit oriolmacias.dev for portfolio and contact.";
            enhancedKeywords =
                "oriol macias dev, oriol dev, macias dev, oriolmacias.dev, oriol software developer, oriol backend developer, oriol macias portfolio";
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
            "MODBUS",
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
export function toSafeJsonLd(data: any): string {
    const json = JSON.stringify(data ?? {}, null, 2);
    // Escape closing </script to avoid early termination in HTML parsing
    return json.replace(/<\/script/gi, '<\\/script');
}
