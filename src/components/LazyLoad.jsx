// src/components/LazyLoad.jsx
import React, { useState, useEffect, Suspense } from 'react';

/**
 * LazyLoad component for deferred loading of non-critical content
 * Only loads component when it's about to enter the viewport
 * 
 * @param {Object} props Component properties
 * @param {React.LazyExoticComponent} props.component The lazy-loaded component
 * @param {number} props.threshold Viewport intersection threshold (0-1)
 * @param {string} props.rootMargin Root margin for Intersection Observer
 * @param {React.ReactNode} props.fallback Content to show while loading
 * @param {boolean} props.bypass Whether to bypass lazy loading (for critical content)
 */
const LazyLoad = ({
    component: Component,
    threshold = 0.1,
    rootMargin = '100px 0px',
    fallback = null,
    bypass = false,
    ...props
}) => {
    const [shouldLoad, setShouldLoad] = useState(bypass);
    const [containerRef, setContainerRef] = useState(null);

    useEffect(() => {
        // If bypass is true, load immediately without observer
        if (bypass) {
            setShouldLoad(true);
            return;
        }

        // Skip for SSR or if no ref
        if (typeof window === 'undefined' || !containerRef) {
            return;
        }

        // Create an IntersectionObserver
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        // Start observing
        observer.observe(containerRef);

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, [containerRef, threshold, rootMargin, bypass]);

    // Default fallback while loading
    const defaultFallback = (
        <div className="h-32 w-full animate-pulse bg-light-secondary dark:bg-dark-secondary rounded-none"></div>
    );

    return (
        <div ref={setContainerRef}>
            {shouldLoad ? (
                <Suspense fallback={fallback || defaultFallback}>
                    <Component {...props} />
                </Suspense>
            ) : (
                fallback || defaultFallback
            )}
        </div>
    );
};

export default LazyLoad;