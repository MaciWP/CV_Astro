import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Wrapper component to handle scroll animations reliably
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.className - Additional classes
 * @param {string} props.animationClass - Animation class (e.g., 'animate-on-scroll')
 * @param {string} props.delay - Transition delay (e.g., '100ms')
 */
const ScrollAnimationWrapper = ({
    children,
    className = '',
    animationClass = 'animate-on-scroll',
    delay = '0ms'
}) => {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`${className} ${animationClass} ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: delay }}
        >
            {children}
        </div>
    );
};

export default ScrollAnimationWrapper;
