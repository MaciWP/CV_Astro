/**
 * Componente de imagen responsiva mejorado con tolerancia a fallos
 * File: src/components/ResponsiveImage.jsx
 *
 * Mejoras:
 * - Verifica la existencia de imágenes optimizadas antes de usarlas
 * - Fallback a imagen original si las variantes no existen
 * - Mejor manejo de errores de carga
 */
import React, { useState, useEffect } from "react";

/**
 * Componente de imagen responsiva con tolerancia a fallos
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - Ruta a la imagen original
 * @param {string} props.alt - Texto alternativo para la imagen
 * @param {number} props.width - Ancho deseado (o máximo) de la imagen
 * @param {number} props.height - Alto deseado (o máximo) de la imagen
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.lazy - Usar lazy loading (default: true)
 * @param {boolean} props.useOptimized - Intentar usar imágenes optimizadas si existen (default: true)
 * @param {string} props.sizes - Atributo sizes para srcset
 * @param {string} props.objectFit - Valor para la propiedad object-fit
 */
const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  lazy = true,
  useOptimized = true,
  sizes = "100vw",
  objectFit = "cover",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [srcSet, setSrcSet] = useState("");

  // Usar la imagen original como fuente principal
  const imageSrc = src || "";

  useEffect(() => {
    if (!src || !useOptimized) return;

    // Solo intentar generar srcSet si tenemos una imagen original
    const extension = src.substring(src.lastIndexOf(".")).toLowerCase();
    const basePath = src.substring(0, src.lastIndexOf("."));

    // Verificar si la imagen es parte del directorio images/ y podría tener versiones optimizadas
    if (src.startsWith("/images/")) {
      // En lugar de generar SrcSet inmediatamente, primero verificamos si las imágenes existen
      const checkImageExists = async (url) => {
        try {
          const response = await fetch(url, { method: "HEAD" });
          return response.ok;
        } catch (error) {
          return false;
        }
      };

      // Función para generar srcSet después de verificar imágenes
      const buildSrcSet = async () => {
        let newSrcSet = `${src} ${width || 800}w`;

        // Verificar si existen versiones optimizadas
        const smallUrl = `${basePath}-sm${extension}`;
        const mediumUrl = `${basePath}-md${extension}`;
        const largeUrl = `${basePath}-lg${extension}`;

        const [smallExists, mediumExists, largeExists] = await Promise.all([
          checkImageExists(smallUrl),
          checkImageExists(mediumUrl),
          checkImageExists(largeUrl),
        ]);

        // Solo añadir versiones que existen
        if (smallExists) newSrcSet += `, ${smallUrl} 400w`;
        if (mediumExists) newSrcSet += `, ${mediumUrl} 800w`;
        if (largeExists) newSrcSet += `, ${largeUrl} 1200w`;

        setSrcSet(newSrcSet);
      };

      buildSrcSet();
    }
  }, [src, width, useOptimized]);

  // Manejar carga exitosa de imagen
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  // Manejar error de carga de imagen
  const handleImageError = () => {
    setImgError(true);
    console.warn(`Error loading image: ${src}`);

    // Si hay error con srcSet, intentar solo con la imagen original
    if (srcSet) {
      setSrcSet("");
    }
  };

  // Placeholder durante la carga
  const renderPlaceholder = () => (
    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
  );

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
        aspectRatio: width && height ? `${width} / ${height}` : "auto",
      }}
    >
      {/* Placeholder durante la carga */}
      {!isLoaded && renderPlaceholder()}

      {/* Imagen principal */}
      <img
        src={imageSrc}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        onLoad={handleImageLoaded}
        onError={handleImageError}
        className={`w-full h-full transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ objectFit }}
        {...props}
      />

      {/* Fallback si hay error */}
      {imgError && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-xl text-gray-400 dark:text-gray-500 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">{alt || "Image"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
