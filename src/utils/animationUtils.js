/**
 * Animation utilities to maintain consistency across the application
 * src/utils/animationUtils.js
 */

// Optimized timing functions for different animation types
export const timingFunctions = {
    // For smooth entries/exits
    smooth: 'cubic-bezier(0.33, 1, 0.68, 1)',

    // For natural bounce movements (incoming elements)
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

    // For more pronounced elastic effects
    elastic: 'cubic-bezier(0.22, 1.75, 0.46, 0.92)',

    // For quick accelerations
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',

    // For smooth decelerations
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
};

// Standard durations for different animation types
export const durations = {
    // Ultra-fast transitions (UI state changes)
    ultrafast: 100,

    // Fast transitions (hover, focus)
    fast: 150,

    // Standard transitions (most cases)
    standard: 250,

    // Slower transitions (main entrances, emphasis)
    emphasis: 400,

    // Long transitions (complex animations)
    complex: 600,
};

/**
 * Calculates a staggered animation delay with natural variability
 * 
 * @param {number} index - Element index in the sequence
 * @param {number} baseDelay - Base delay time (ms)
 * @param {boolean} randomize - Whether to add random variability
 * @returns {number} Calculated delay in ms
 */
export const getStaggerDelay = (index, baseDelay = 20, randomize = true) => {
    // Slight random variation for more natural effect
    const variation = randomize ? (Math.random() * 10 - 5) : 0;
    return baseDelay * index + variation;
};

/**
 * Different entrance options for elements
 */
export const entrances = {
    // From below (common entrance)
    fadeUp: (delay = 0, duration = durations.standard) => ({
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: duration / 1000, // convert to seconds
                delay: delay / 1000,
                ease: timingFunctions.smooth
            }
        }
    }),

    // From the left
    fadeLeft: (delay = 0, duration = durations.standard) => ({
        initial: { opacity: 0, x: -30 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: duration / 1000,
                delay: delay / 1000,
                ease: timingFunctions.smooth
            }
        }
    }),

    // From the right
    fadeRight: (delay = 0, duration = durations.standard) => ({
        initial: { opacity: 0, x: 30 },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: duration / 1000,
                delay: delay / 1000,
                ease: timingFunctions.smooth
            }
        }
    }),

    // Fade in place (no movement)
    fadeIn: (delay = 0, duration = durations.standard) => ({
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: duration / 1000,
                delay: delay / 1000,
                ease: 'easeOut'
            }
        }
    }),

    // Scale from center
    scale: (delay = 0, duration = durations.standard) => ({
        initial: { opacity: 0, scale: 0.9 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: duration / 1000,
                delay: delay / 1000,
                ease: timingFunctions.bounce
            }
        }
    }),
};

/**
 * Get inline CSS style for a basic entrance transition
 * Useful when not using an animation library
 */
export const getEntranceStyle = (isVisible, index, type = 'fadeUp', baseDelay = 50) => {
    const delay = getStaggerDelay(index, baseDelay);

    // Default values
    let transform = isVisible ? 'none' : 'translateY(20px)';
    let opacity = isVisible ? 1 : 0;
    let duration = '350ms';
    let timing = timingFunctions.smooth;

    // Adjust based on animation type
    switch (type) {
        case 'fadeLeft':
            transform = isVisible ? 'none' : 'translateX(-30px)';
            timing = timingFunctions.bounce;
            break;
        case 'fadeRight':
            transform = isVisible ? 'none' : 'translateX(30px)';
            timing = timingFunctions.bounce;
            break;
        case 'scale':
            transform = isVisible ? 'none' : 'scale(0.95)';
            timing = timingFunctions.bounce;
            duration = '400ms';
            break;
        // Default case is fadeUp (already set)
    }

    return {
        transform,
        opacity,
        transition: `transform ${duration} ${timing}, opacity ${duration} ease-out`,
        transitionDelay: `${delay}ms`,
    };
};