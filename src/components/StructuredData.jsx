import React from 'react';

/**
 * StructuredData component that provides JSON-LD for rich search results
 * This helps search engines better understand the content of the website
 */
const StructuredData = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Oriol Macias",
        "url": "https://oriolmacias.dev",
        "image": "https://oriolmacias.dev/images/oriol_macias.jpg",
        "sameAs": [
            "https://linkedin.com/in/oriolmaciasbadosa",
            "https://github.com/MaciWP"
        ],
        "jobTitle": "Software Developer",
        "worksFor": {
            "@type": "Organization",
            "name": "Bjumper"
        },
        "description": "Solutions-driven Backend Developer specializing in industrial protocol integration (SNMP, MODBUS, BACKnet) with 8+ years of delivering high-performance applications.",
        "knowsLanguage": [
            {
                "@type": "Language",
                "name": "Spanish",
                "alternateName": "es"
            },
            {
                "@type": "Language",
                "name": "Catalan",
                "alternateName": "ca"
            },
            {
                "@type": "Language",
                "name": "English",
                "alternateName": "en"
            }
        ],
        "knowsAbout": [
            "Python",
            "Django",
            "C#",
            ".NET",
            "PostgreSQL",
            "REST APIs",
            "SNMP",
            "MODBUS",
            "BACnet",
            "Data Center Infrastructure",
            "Software Development",
            "Backend Development",
            "Web Development"
        ],
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://oriolmacias.dev/"
        },
        "alumniOf": [
            {
                "@type": "EducationalOrganization",
                "name": "Universidad Internacional de La Rioja",
                "sameAs": "https://www.unir.net/"
            },
            {
                "@type": "EducationalOrganization",
                "name": "IES Montilivi",
                "sameAs": "https://institutmontilivi.cat/"
            }
        ],
        "keywords": [
            "Oriol",
            "Macias",
            "Oriol Macias",
            "Developer",
            "Software Developer",
            "Backend Developer",
            "oriol dev",
            "macias dev",
            "oriol macias dev",
            "desarrollador",
            "programador",
            "desarrollo"
        ]
    };

    return (
        <script type="application/ld+json">
            {JSON.stringify(structuredData)}
        </script>
    );
};

export default StructuredData;