import React from 'react';

/**
 * Enhanced SEO component with improved metadata for better search engine visibility
 * @param {Object} props - Component properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type
 * @param {string} props.twitterCard - Twitter card type
 */
const SEO = ({
    title = "Oriol Macias - Software Developer CV & Portfolio",
    description = "Portfolio and CV for Oriol Macias, experienced Software Developer specialized in backend development, industrial protocols integration (SNMP, MODBUS, BACnet), and data center infrastructure.",
    canonicalUrl = "https://oriolmacias.dev/",
    ogImage = "/images/oriol_macias.jpg",
    ogType = "website",
    twitterCard = "summary_large_image"
}) => {
    // Base domain for absolute URLs
    const domain = "https://oriolmacias.dev";

    // If ogImage doesn't start with http, make it absolute
    if (ogImage && !ogImage.startsWith('http')) {
        ogImage = `${domain}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
    }

    return (
        <>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Oriol Macias - Developer" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Enhanced SEO meta tags */}
            <meta name="author" content="Oriol Macias" />
            <meta name="keywords" content="Oriol Macias, Oriol, Macias, Software Developer, Backend Developer, CV, Portfolio, Python, Django, C#, .NET, SNMP, MODBUS, BACnet, Data Center Infrastructure, Web Developer, Developer, Software Engineer, Programming, Coding, oriol dev, macias dev, oriol macias dev, desarrollo, desarrollador, programador" />

            {/* Geo tags for local SEO */}
            <meta name="geo.region" content="ES" />
            <meta name="geo.placename" content="Spain" />

            {/* Language alternates for multilingual support */}
            <link rel="alternate" hrefLang="en" href="https://oriolmacias.dev/" />
            <link rel="alternate" hrefLang="es" href="https://oriolmacias.dev/es/" />
            <link rel="alternate" hrefLang="fr" href="https://oriolmacias.dev/fr/" />
            <link rel="alternate" hrefLang="x-default" href="https://oriolmacias.dev/" />
        </>
    );
};

export default SEO;