// src/components/SecurityHeaders.jsx
import React from 'react';

/**
 * Component that adds enhanced security headers to the page
 * Improves Best Practices score by implementing CSP and other security measures
 */
const SecurityHeaders = () => {
    // Strict Content Security Policy
    const cspDirectives = [
        // Default to self - only allow resources from same origin
        "default-src 'self'",

        // Styles - allow inline for Astro components that generate inline styles
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",

        // Scripts - only allow from same origin and inline for Astro
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",

        // Images - allow from same origin and data: for optimized images
        "img-src 'self' data:",

        // Fonts - allow from same origin and CDN
        "font-src 'self' https://cdnjs.cloudflare.com",

        // Connect - only allow API connections to same origin
        "connect-src 'self'",

        // Manifest - web app manifest
        "manifest-src 'self'",

        // Object/embed - none needed
        "object-src 'none'",

        // Block plugins
        "plugin-types 'none'",

        // Allow iframes only from same origin
        "frame-src 'self'",

        // Child - inherit parent CSP
        "child-src 'self'",

        // Worker - only allow from same origin
        "worker-src 'self'",

        // Media sources - audio/video
        "media-src 'self'",

        // Form action - only allow forms to submit to same origin
        "form-action 'self'",

        // Base URI - restrict base tag to same origin
        "base-uri 'self'",

        // Block embedding this site in frames (prevents clickjacking)
        "frame-ancestors 'self'",

        // Report CSP violations (for monitoring)
        "report-uri https://oriolmacias.dev/api/csp-report"
    ];

    // HSTS Policy - force HTTPS for 1 year
    const hstsPolicy = "max-age=31536000; includeSubDomains; preload";

    // Permissions Policy to restrict sensitive features
    const permissionsPolicy = [
        "geolocation=()",
        "microphone=()",
        "camera=()",
        "payment=()",
        "usb=()",
        "battery=()",
        "midi=()",
        "screen-wake-lock=()",
        "sync-xhr=(self)",
        "interest-cohort=()"
    ].join(', ');

    return (
        <>
            {/* CSP Header - Implemented as meta tag for static sites without server control */}
            <meta httpEquiv="Content-Security-Policy" content={cspDirectives.join('; ')} />

            {/* HSTS Header */}
            <meta httpEquiv="Strict-Transport-Security" content={hstsPolicy} />

            {/* X-Frame-Options prevents your site from being embedded in iframes on other sites */}
            <meta httpEquiv="X-Frame-Options" content="DENY" />

            {/* X-Content-Type-Options prevents MIME type sniffing */}
            <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

            {/* Referrer-Policy controls how much referrer information is sent */}
            <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

            {/* Permissions-Policy (formerly Feature-Policy) limits browser features */}
            <meta httpEquiv="Permissions-Policy" content={permissionsPolicy} />

            {/* X-XSS-Protection is mostly redundant with CSP, but kept for older browsers */}
            <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

            {/* Cross-Origin-Embedder-Policy (COEP) */}
            <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />

            {/* Cross-Origin-Opener-Policy (COOP) */}
            <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />

            {/* Cross-Origin-Resource-Policy (CORP) */}
            <meta httpEquiv="Cross-Origin-Resource-Policy" content="same-origin" />
        </>
    );
};

export default SecurityHeaders;