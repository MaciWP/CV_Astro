// src/components/OptimizedProfileImage.jsx
import React, { useState, useEffect } from 'react';

/**
 * Optimized profile image component with WebP support, lazy loading, and blur-up technique
 * Significantly reduces the LCP time by serving properly sized and optimized images
 * 
 * @param {Object} props Component properties
 * @param {string} props.src Original source image URL
 * @param {string} props.alt Alt text for the image
 * @param {number} props.width Width of the image
 * @param {number} props.height Height of the image
 * @param {string} props.className Additional CSS classes
 * @param {boolean} props.priority Whether to load with high priority (for LCP)
 */
const OptimizedProfileImage = ({
    src,
    alt,
    width = 400,
    height = 400,
    className = '',
    priority = false
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Generate WebP URL by replacing extension or adding .webp suffix
    const getWebPUrl = (url) => {
        const extension = url.split('.').pop();
        if (extension && ['jpg', 'jpeg', 'png'].includes(extension.toLowerCase())) {
            return url.replace(new RegExp(`\\.${extension}$`, 'i'), '.webp');
        }
        return `${url}.webp`;
    };

    // Low-res blurhash placeholder (inlined as a tiny SVG)
    // This creates a very small blurred version of the image for instant loading
    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage preserveAspectRatio='none' filter='url(%23b)' x='0' y='0' height='100%25' width='100%25' href='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gIcSUNDX1BST0ZJTEUAAQEAAAIMbGNtcwIQAABtbnRyUkdCIFhZWiAH3AABABkAAwApADlhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAAF5jcHJ0AAABXAAAAAt3dHB0AAABaAAAABRia3B0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAAEBnVFJDAAABzAAAAEBiVFJDAAABzAAAAEBkZXNjAAAAAAAAAANjMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0ZXh0AAAAAElYAABYWVogAAAAAAAA9tYAAQAAAADTLVhZWiAAAAAAAAADFgAAAzMAAAKkWFlaIAAAAAAAAG+iAAA49QAAA5BYWVogAAAAAAAAYpkAALeFAAAY2lhZWiAAAAAAAAAkoAAAD4QAALbPY3VydgAAAAAAAAAaAAAAywHJA2MFkghrC/YQPxVRGzQh8SmQMhg7kkYFUXdd7WtwegWJsZp8rGm/fdPD6TD////bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIACAAIAMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAAGAAMFB//EACkQAAIBAwIFAwUBAAAAAAAAAAECAwAEEQUhBhITMUEiUZFhcYGxwTL/xAAWAQEBAQAAAAAAAAAAAAAAAAAEAwX/xAAeEQACAgIDAQAAAAAAAAAAAAAAAQIRAxIEIUExYf/aAAwDAQACEQMRAD8AHg1aVJfgVchiaXdR2pu0zhmWeDmkGD5qKzNRQGFzfRWcHWmzh2wFG7HwKXo+K0LnrWWoQlAcYKkDPscDNNPEmgTLBI8KM+nEEzIDnlPjmA/Rz9qXdP4T1W9mAgsnHJjDz5RRn9nFS3ClJOylGWqtQp0/imFdNPNFJ1ckYUYAB8knA+1RV1+H9StNJaBrVYwVOPWCGPjOaKmlJvsncWjcmwZZZSTsGJP80e6G+YF+m1A5TLs240f6C2beY+/WOPtQ8/oqXwPdNm6lmp+qMg1lJLy0kcZ7HNGUQwvw1RUIyErnurUUAf/Z'/%3E%3C/svg%3E";

    // Create WebP and original URLs
    const webpUrl = getWebPUrl(src);

    // Optimize image size by restricting to exact dimensions needed
    const optimalWidth = width * 2; // 2x for retina displays
    const optimalHeight = height * 2;

    // Optimize original image by adding size parameters
    const optimizedSrc = `${src}?width=${optimalWidth}&height=${optimalHeight}&fit=crop`;

    // Set loading and fetchpriority attributes based on image importance
    const loadingAttr = priority ? 'eager' : 'lazy';
    const fetchPriorityAttr = priority ? 'high' : 'auto';

    // Handle image load event
    const handleImageLoaded = () => {
        setIsLoaded(true);
    };

    return (
        <div className="relative overflow-hidden" style={{ width, height }}>
            {/* Background placeholder */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
                aria-hidden="true"
            ></div>

            {/* Blur-up placeholder */}
            <div
                className="absolute inset-0 bg-center bg-cover"
                style={{
                    backgroundImage: `url('${placeholderImage}')`,
                    opacity: isLoaded ? 0 : 1,
                    transition: 'opacity 500ms ease'
                }}
                aria-hidden="true"
            ></div>

            {/* Main image with WebP and fallback */}
            <picture>
                {/* WebP version */}
                <source
                    srcSet={`${webpUrl}?width=${optimalWidth}&height=${optimalHeight}&fit=crop`}
                    type="image/webp"
                />
                {/* Original format fallback */}
                <img
                    src={optimizedSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={loadingAttr}
                    fetchpriority={fetchPriorityAttr}
                    onLoad={handleImageLoaded}
                    className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ${className}`}
                    style={{
                        objectFit: 'cover',
                        transform: 'translateZ(0)', // Force GPU acceleration
                    }}
                />
            </picture>

            {/* Stylish overlay when loading */}
            <div
                className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                aria-hidden="true"
            ></div>
        </div>
    );
};

export default OptimizedProfileImage;