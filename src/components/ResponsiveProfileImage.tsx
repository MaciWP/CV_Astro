import React, { useState } from 'react';

interface ResponsiveProfileImageProps {
  alt: string;
  src: string;
  srcSet: string;
  sizes: string;
  fallback: string;
  tiny: string;
  priority?: boolean;
}

export default function ResponsiveProfileImage({
  alt,
  src,
  srcSet,
  sizes,
  fallback,
  tiny,
  priority = false
}: ResponsiveProfileImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-full">
      {/* Blur placeholder */}
      <img
        src={tiny}
        aria-hidden
        className={`absolute inset-0 w-full h-full object-cover blur-lg scale-105 transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        decoding="async"
        width={400}
        height={400}
      />

      {/* Main responsive image */}
      <picture>
        <source srcSet={srcSet} sizes={sizes} type="image/avif" />
        <img
          src={`${src}-640.jpg`}
          srcSet={fallback}
          sizes={sizes}
          width={400}
          height={400}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      </picture>
    </div>
  );
}
