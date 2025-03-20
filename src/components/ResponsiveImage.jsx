import React from 'react';

/**
 * ResponsiveImage component for optimized image delivery
 * Simplified version that works with existing images
 * 
 * @param {Object} props - Component properties
 * @param {string} props.src - Source path to the image
 * @param {string} props.alt - Alt text for the image
 * @param {number} props.width - Width of the image (optional)
 * @param {number} props.height - Height of the image (optional)
 * @param {string} props.className - Additional CSS classes (optional)
 * @param {boolean} props.lazy - Whether to use lazy loading (default: true)
 */
const ResponsiveImage = ({
    src,
    alt,
    width,
    height,
    className = '',
    lazy = true,
    ...props
}) => {
    // Return the standard image tag with appropriate loading strategy
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            loading={lazy ? 'lazy' : 'eager'}
            {...props}
        />
    );
};

export default ResponsiveImage;