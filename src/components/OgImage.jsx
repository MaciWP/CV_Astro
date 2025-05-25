import React from "react";
import styles from "../styles/OgImage.module.css";

/**
 * OgImage component for generating dynamic Open Graph images
 * This component can be rendered to an image using tools like @vercel/og
 * For now, the static image will be used, but this provides a template for future use
 */
const OgImage = ({ name = "Oriol Macias", title = "Software Developer" }) => {
  return (
    <div className={styles.container}>
      {/* Red accent element - top left */}
      <div className={styles.topAccent} />

      {/* Top header section */}
      <div className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>OM</div>

        {/* URLs */}
        <div className={styles.urls}>oriolmacias.dev | github.com/MaciWP</div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <h1 className={styles.name}>{name}</h1>

        <h2 className={styles.title}>{title}</h2>

        <p className={styles.description}>
          Backend Developer specializing in industrial protocol integration with
          8+ years delivering high-performance applications. Expertise in
          Python, C#, .NET, Django, and data center infrastructure.
        </p>
      </div>

      {/* Red accent element - bottom right */}
      <div className={styles.bottomAccent} />
    </div>
  );
};

export default OgImage;
