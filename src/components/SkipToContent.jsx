// src/components/SkipToContent.jsx
/**
 * Skip to content link - Provides keyboard accessibility for screen reader users
 * Allows keyboard users to bypass navigation menus
 */
import React, { useState } from 'react';

const SkipToContent = () => {
    const [isFocused, setIsFocused] = useState(false);

    return (

        <a href="#cv-content"
            className={`
        fixed top-3 left-3 z-50 transform transition-transform duration-200
        bg-brand-red text-white px-4 py-2 text-sm font-medium rounded-none
        focus:outline-none focus:ring-2 focus:ring-white
        ${isFocused ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}
      `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            Skip to main content
        </a >
    );
};

export default SkipToContent;