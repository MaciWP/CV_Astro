// src/components/ResponsiveProfileImage.tsx
import React, { useState, useMemo } from "react";

type Props = {
  /** Ruta base de la imagen sin extensión (ej: "/images/oriol_macias") */
  src: string;
  /** Texto alternativo accesible */
  alt: string;
  /** Anchuras generadas en el _build_ (por defecto 192-1 280 px) */
  widths?: number[];
  /** Clases tailwind extra */
  className?: string;
  /** ¿Es la imagen hero/LCP? */
  priority?: boolean;
};

/**
 * <ResponsiveProfileImage/>
 *  • AVIF → WebP → JPEG con srcset y sizes
 *  • Placeholder blur de 20 × 20 px sin JS blocking
 *  • `loading` y `fetchpriority` para controlar LCP/TBT
 *  • Funciona igual en desktop y móvil (sin sniffing)
 */
const ResponsiveProfileImage: React.FC<Props> = ({
  src,
  alt,
  widths = [192, 320, 640, 960, 1280],
  className = "",
  priority = false,
}) => {
  const [loaded, setLoaded] = useState(false);

  /* Pre-computamos srcset sólo 1 vez */
  const { avif, webp, fallback, tiny } = useMemo(() => {
    const build = (ext: string) =>
      widths.map((w) => `${src}-${w}.${ext} ${w}w`).join(", ");
    return {
      avif: build("avif"),
      webp: build("webp"),
      fallback: build("jpg"),
      tiny: `${src}-tiny.jpg`, // 20 px – placeholder
    };
  }, [src, widths]);

  /** 100 vw < 768 px, 400 px resto  */
  const sizes = "(max-width: 767px) 100vw, 400px";

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: 400, height: 400 }}
    >
      {/* Blur placeholder */}
      <img
        src={tiny}
        aria-hidden
        className={`absolute inset-0 w-full h-full object-cover blur-lg scale-105 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        loading="lazy"
        decoding="async"
      />
      <picture>
        <source type="image/avif" srcSet={avif} sizes={sizes} />
        <source type="image/webp" srcSet={webp} sizes={sizes} />
        <img
          src={`${src}-640.jpg`}
          srcSet={fallback}
          sizes={sizes}
          width={400}
          height={400}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "translateZ(0)" }}
        />
      </picture>
    </div>
  );
};

export default ResponsiveProfileImage;
