// src/components/Focusable.jsx
/**
 * Wrapper component to improve keyboard focus handling
 * Ensures consistent focus styles and behavior
 */
import React, { useRef, useEffect } from "react";

const Focusable = ({
  children,
  as = "div",
  className = "",
  onFocus = null,
  onBlur = null,
  ...props
}) => {
  const elementRef = useRef(null);
  const Component = as;

  useEffect(() => {
    // Mejorar manejo del foco cuando cambia el contenido
    const handleKeyDown = (e) => {
      if (
        e.key === "Tab" &&
        elementRef.current &&
        document.activeElement === elementRef.current
      ) {
        // Si el elemento tiene un focus handler personalizado, ejecutarlo
        if (onFocus && typeof onFocus === "function") {
          onFocus(e);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFocus]);

  return (
    <Component
      ref={elementRef}
      className={`${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-primary`}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={props.tabIndex || 0}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Focusable;
