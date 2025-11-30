/**
 * Componente SEO mejorado con soporte para metadatos avanzados
 * File: src/components/SEO.jsx
 * 
 * Mejoras principales:
 * - Schema.org estructura mejorada para mayor visibilidad en buscadores
 * - Metadatos para redes sociales optimizados
 * - Palabras clave específicas para developer/desarrollador/CV/portfolio
 * - Soporte para indexación geográfica
 */
import React from 'react';

/**
 * Componente SEO con metadatos optimizados para mejor visibilidad en motores de búsqueda
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción de la página
 * @param {string} props.canonicalUrl - URL canónica
 * @param {string} props.ogImage - URL de la imagen para OpenGraph/Twitter
 * @param {string} props.ogType - Tipo de contenido para OpenGraph
 * @param {string} props.twitterCard - Tipo de tarjeta para Twitter
 * @param {Array<string>} props.keywords - Palabras clave adicionales para SEO
 * @param {string} props.lang - Idioma de la página
 * @param {Object} props.author - Información del autor
 * @param {Object} props.geo - Información geográfica
 */
const SEO = ({
    title = "Oriol Macias - Software Developer CV & Portfolio",
    description = "Professional portfolio for Oriol Macias, experienced developer specialized in backend development, industrial protocols integration (SNMP, MODBUS, BACnet), and data center infrastructure.",
    canonicalUrl = "https://oriolmacias.dev/",
    ogImage = "/images/oriol_macias.jpg",
    ogType = "website",
    twitterCard = "summary_large_image",
    keywords = [],
    lang = "en",
    author = {
        name: "Oriol Macias",
        role: "Software Developer",
        url: "https://oriolmacias.dev"
    },
    geo = {
        region: "ES",
        placename: "Spain"
    }
}) => {
    // Base domain para URLs absolutas
    const domain = "https://oriolmacias.dev";

    // Palabras clave por defecto combinadas con las pasadas como prop
    const defaultKeywords = [
        "Oriol Macias", "Oriol", "Macias",
        "Software Developer", "Developer", "Desarrollador", "Développeur",
        "Backend Developer", "Full Stack Developer",
        "CV", "Portfolio", "Resume", "Curriculum",
        "Python", "Django", "C#", ".NET", "SNMP", "MODBUS", "BACnet",
        "Industrial Protocols", "Data Center Infrastructure",
        "oriol dev", "macias dev", "oriol macias dev",
        "desarrollo web", "desarrollador backend", "ingeniero de software"
    ];

    // Combinar keywords por defecto con las personalizadas
    const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

    // Asegurar que ogImage sea absoluta
    const fullOgImage = ogImage.startsWith('http')
        ? ogImage
        : `${domain}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;

    return (
        <>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords.join(', ')} />

            {/* Información del autor */}
            <meta name="author" content={author.name} />

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:site_name" content="Oriol Macias - Developer Portfolio" />
            <meta property="og:locale" content={lang === 'es' ? 'es_ES' : lang === 'fr' ? 'fr_FR' : lang === 'de' ? 'de_DE' : 'en_US'} />

            {/* Twitter Card */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullOgImage} />
            <meta name="twitter:creator" content="@oriolmacias" />

            {/* Metadatos geográficos para SEO local */}
            <meta name="geo.region" content={geo.region} />
            <meta name="geo.placename" content={geo.placename} />

            {/* Especificador de idioma actual */}
            <meta name="content-language" content={lang} />
            <meta httpEquiv="content-language" content={lang} />

            {/* Links de idiomas alternativos definidos en función de la página actual */}
            <link rel="alternate" hrefLang="en" href={`${domain}/`} />
            <link rel="alternate" hrefLang="es" href={`${domain}/es/`} />
            <link rel="alternate" hrefLang="fr" href={`${domain}/fr/`} />
            <link rel="alternate" hrefLang="de" href={`${domain}/de/`} />
            <link rel="alternate" hrefLang="x-default" href={`${domain}/`} />

            {/* Meta información adicional para SEO */}
            <meta name="rating" content="General" />
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        </>
    );
};

export default SEO;