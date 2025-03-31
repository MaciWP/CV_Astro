// src/components/I18nErrorBoundary.jsx
/**
 * Specialized Error Boundary for i18n-related components
 * Provides specific fallback mechanisms for language-related errors
 */
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const I18nErrorBoundary = ({ children, language = 'en', ...props }) => {
    // Function to handle i18n-specific reset logic
    const handleReset = () => {
        // Force reload translations for current language
        if (window.i18n && typeof window.i18n.init === 'function') {
            window.i18n.init(language);
            document.dispatchEvent(new CustomEvent('translationsLoaded'));
        }

        // If there's a built-in reset function in props, call it as well
        if (props.onReset && typeof props.onReset === 'function') {
            props.onReset();
        }
    };

    return (
        <ErrorBoundary
            fallbackTitle={props.fallbackTitle || "Language Support Error"}
            fallbackMessage={
                props.fallbackMessage ||
                `There was a problem loading content in ${language.toUpperCase()}. 
         The content will be displayed in English.`
            }
            showReset={true}
            resetButtonText="Reload translations"
            onReset={handleReset}
            {...props}
        >
            {children}
        </ErrorBoundary>
    );
};

export default I18nErrorBoundary;