/**
 * I18nLoader Component - SSG Optimized Version
 * Translations are inlined at build time, no runtime fetch needed
 * File: src/components/I18nLoader.jsx
 */
import React, { useState, useEffect } from 'react';

const I18nLoader = ({ children, fallback = null }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check if translations are already inlined (SSG)
        const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';

        if (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) {
            // Translations already available from SSG inline script
            setIsLoaded(true);
            return;
        }

        // Fallback: wait for translationsLoaded event (should fire immediately from inline script)
        const handleLoaded = () => setIsLoaded(true);
        document.addEventListener('translationsLoaded', handleLoaded);

        // Safety timeout - if translations don't load in 100ms, show content anyway
        const timeout = setTimeout(() => setIsLoaded(true), 100);

        return () => {
            document.removeEventListener('translationsLoaded', handleLoaded);
            clearTimeout(timeout);
        };
    }, []);

    // SSG: translations are inline, so this should resolve almost instantly
    if (!isLoaded) {
        return fallback || null; // Don't show loading spinner for SSG
    }

    return <>{children}</>;
};

export default I18nLoader;