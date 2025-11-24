/**
 * Structured Data Component
 * @file src/components/StructuredData.jsx
 * @description Generates Person and WebPage structured data
 */

import React from 'react';
import { toSafeJsonLd } from '../utils/seo';

const StructuredData = () => {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Oriol Macias",
    "url": "https://oriolmacias.dev",
    "image": "https://oriolmacias.dev/images/oriol_macias.jpg",
    "sameAs": [
      "https://github.com/MaciWP",
      "https://linkedin.com/in/oriolmaciasbadosa"
    ],
    "jobTitle": "Software Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Bjumper"
    },
    "description": "Software Developer specializing in industrial protocol integration (SNMP, MODBUS, BACnet) and backend development.",
    "knowsAbout": [
      "Python",
      "Django",
      "Industrial Protocols",
      "Data Center Infrastructure",
      "React",
      "Astro"
    ]
  };

  const webPageData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Oriol Macias - Software Developer Portfolio",
    "description": "Portfolio and CV of Oriol Macias, a Software Developer specializing in backend development and industrial automation.",
    "url": "https://oriolmacias.dev"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(webPageData) }}
      />
    </>
  );
};

export default StructuredData;
