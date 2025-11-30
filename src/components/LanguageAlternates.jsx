/**
 * Componente de alternativas de idioma mejorado para SEO
 * Implementa correctamente hreflang para Google
 * File: src/components/LanguageAlternates.jsx
 */
import React from 'react';

const LanguageAlternates = ({ currentLang = 'en', currentPath = '/' }) => {
    // Website base URL
    const baseUrl = 'https://oriolmacias.dev';

    // Normalize the path (ensure it starts with /)
    const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

    // Language variants available on the site
    const languages = [
        { code: 'en', hreflang: 'en', region: 'en-US', name: 'English' },
        { code: 'es', hreflang: 'es', region: 'es-ES', name: 'Español' },
        { code: 'fr', hreflang: 'fr', region: 'fr-CH', name: 'Français' },
        { code: 'de', hreflang: 'de', region: 'de-CH', name: 'Deutsch' }
    ];

    // Generate URLs for each language
    const languageUrls = languages.map(lang => {
        // For the default language (English), don't include a language prefix
        let url = lang.code === 'en'
            ? `${baseUrl}${normalizedPath === '/' ? '' : normalizedPath}`
            : `${baseUrl}/${lang.code}${normalizedPath === '/' ? '' : normalizedPath}`;

        // Remove trailing slash, except for the homepage
        if (url !== baseUrl && url.endsWith('/')) {
            url = url.slice(0, -1);
        }

        return {
            ...lang,
            url
        };
    });

    // Generate JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": languageUrls.find(lang => lang.code === currentLang)?.url,
        "inLanguage": currentLang,
        "potentialAction": {
            "@type": "ReadAction",
            "target": languageUrls.map(lang => ({
                "@type": "EntryPoint",
                "urlTemplate": lang.url,
                "inLanguage": lang.code
            }))
        }
    };

    return (
        <>
            {/* Standard hreflang tags */}
            {languageUrls.map(lang => (
                <link
                    key={lang.code}
                    rel="alternate"
                    hrefLang={lang.hreflang}
                    href={lang.url}
                />
            ))}

            {/* Region-specific hreflang tags for better targeting */}
            {languageUrls.map(lang => (
                <link
                    key={`${lang.code}-region`}
                    rel="alternate"
                    hrefLang={lang.region}
                    href={lang.url}
                />
            ))}

            {/* x-default hreflang for language negotiation */}
            <link
                rel="alternate"
                hrefLang="x-default"
                href={languageUrls.find(lang => lang.code === 'en')?.url || baseUrl}
            />

            {/* Add structured data for translation information - Fixed hydration */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Language metadata for Search Engines and browsers */}
            <meta httpEquiv="content-language" content={currentLang} />
        </>
    );
};

export default LanguageAlternates;