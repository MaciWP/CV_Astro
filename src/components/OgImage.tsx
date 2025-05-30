import React from "react";
import "../styles/og-image.css";

/**
 * OgImage component for generating dynamic Open Graph images
 * This component can be rendered to an image using tools like @vercel/og
 * For now, the static image will be used, but this provides a template for future use
 */
const OgImage = ({ name = "Oriol Macias", title = "Software Developer" }) => {
  return (
    <div className="og-container">
      {/* Red accent element - top left */}
      <div className="og-accent-top" />

      {/* Top header section */}
      <div className="og-header">
        {/* Logo */}
        <div className="og-logo">OM</div>

        {/* URLs */}
        <div className="og-urls">oriolmacias.dev | github.com/MaciWP</div>
      </div>

      {/* Main content */}
      <div className="og-main">
        <h1 className="og-name">{name}</h1>

        <h2 className="og-title">{title}</h2>

        <p className="og-description">
          Backend Developer specializing in industrial protocol integration with
          8+ years delivering high-performance applications. Expertise in
          Python, C#, .NET, Django, and data center infrastructure.
        </p>
      </div>

      {/* Red accent element - bottom right */}
      <div className="og-accent-bottom" />
    </div>
  );
};

export default OgImage;
