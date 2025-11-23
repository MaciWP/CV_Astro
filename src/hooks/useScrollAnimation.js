import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track if an element is in the viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} { ref, isVisible }
 */
export const useScrollAnimation = (options = { threshold: 0.1, rootMargin: '0px' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Only trigger once
            }
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options.threshold, options.rootMargin]);

    return { ref, isVisible };
};
