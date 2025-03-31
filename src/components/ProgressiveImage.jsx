// src/components/ProgressiveImage.jsx
/**
 * Progressive image component with loading states and blur-up effect
 * Improves perceived performance and user experience
 */
import React, { useState, useEffect } from 'react';

const ProgressiveImage = ({
    src,
    lowResSrc,
    alt,
    width,
    height,
    className = '',
    containerClassName = '',
    lazy = true,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(lowResSrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==');

    useEffect(() => {
        if (!src) return;

        // Load the high-res image
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
        };

        return () => {
            img.onload = null;
        };
    }, [src]);

    return (
        <div
            className={`relative overflow-hidden ${containerClassName}`}
            style={{ width, height }}
        >
            <img
                src={currentSrc}
                alt={alt}
                width={width}
                height={height}
                loading={lazy ? 'lazy' : 'eager'}
                className={`
          transition-all duration-500 ease-in
          ${isLoaded ? 'blur-0' : 'blur-sm'}
          ${className}
        `}
                onLoad={() => lowResSrc && setIsLoaded(true)}
                {...props}
            />

            {/* Overlay con efecto de pulso durante la carga */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse-subtle"></div>
            )}
        </div>
    );
};

export default ProgressiveImage;