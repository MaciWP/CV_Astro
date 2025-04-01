// src/components/LanguageAlternates.jsx
import React from 'react';

/**
 * LanguageAlternates component for proper hreflang implementation
 * Improves SEO by correctly signaling language alternatives to search engines
 * 
 * @param {Object} props Component properties
 * @param {string} props.currentLang Current page language code
 * @param {string} props.currentPath Current page path (without language prefix)
 */
const LanguageAlternates = ({ currentLang = 'en', currentPath = '/' }) => {
    // Website base URL
    const baseUrl = 'https://oriolmacias.dev';

    // Normalize the path (ensure it starts with /)
    const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

    // Language variants available on the site
    const languages = [
        { code: 'en', hreflang: 'en', region: 'en-US', name: 'English' },
        { code: 'es', hreflang: 'es', region: 'es-ES', name: 'Español' },
        { code: 'fr', hreflang: 'fr', region: 'fr-FR', name: 'Français' }
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

            {/* Add structured data for translation information */}
            <script type="application/ld+json">
                {JSON.stringify({
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
                })}
            </script>

            {/* Language metadata for Search Engines and browsers */}
            <meta httpEquiv="content-language" content={currentLang} />
        </>
    );
};

export default LanguageAlternates;