// path: src/components/StructuredData.jsx
/**
 * StructuredData component (fixed & safe)
 * - No marketing claims; aligns with current profile.
 * - Normalizes protocol names (SNMP, Modbus, BACnet).
 * - Uses JSON.stringify with escaping to avoid parse errors in Search Console.
 */

import React from 'react';

/** Safely serialize JSON-LD for <script type="application/ld+json"> */
function toSafeJsonLd(data) {
  const json = JSON.stringify(data ?? {}, null, 2);
  // Escape closing </script to avoid early termination in HTML parsing
  return json.replace(/<\/script/gi, '<\\/script');
}

const StructuredData = ({
  name = 'Oriol Macias',
  jobTitle = 'Backend Developer',
  skills = [
    'Python',
    'Django',
    'C#',
    '.NET',
    'SNMP',
    'Modbus',
    'BACnet',
    'Backend Development',
    'API Development',
    'Industrial Protocols',
    'Data Center Infrastructure',
  ],
  languages = [
    { name: 'Spanish', code: 'es' },
    { name: 'Catalan', code: 'ca' },
    { name: 'English', code: 'en' },
  ],
  keywords = [
    'Oriol Macias',
    'Oriol',
    'Macias',
    'Software Developer',
    'Developer',
    'Desarrollador',
    'Développeur',
    'Backend Developer',
    'CV',
    'Portfolio',
    'Resume',
    'oriol dev',
    'macias dev',
  ],
  // Para evitar errores de esquema, education/experiences son opcionales y se incluyen solo si tienen forma válida.
  education = [],
  experiences = [],
  // Permite sobreescribir dominios/URLs en build si hiciera falta
  siteUrl = 'https://oriolmacias.dev',
  imageUrl = 'https://oriolmacias.dev/images/oriol_macias.jpg',
}) => {
  const personId = `${siteUrl}/#person`;

  // --- Person JSON-LD (perfil real, sin claims de más) ---
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name,
    url: siteUrl,
    image: imageUrl,
    sameAs: [
      'https://linkedin.com/in/oriolmaciasbadosa',
      'https://github.com/MaciWP',
    ],
    jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: 'Bjumper Technology',
      url: 'https://bjumper.com',
    },
    description:
      'Backend developer specialized in Python/Django and REST APIs with experience integrating industrial protocols (SNMP, Modbus, BACnet).',
    knowsAbout: skills,
    nationality: {
      '@type': 'Country',
      name: 'Spain',
    },
    keywords: keywords.join(', '),
    email: 'mailto:oriolomb@gmail.com',
  };

  // Idiomas (BCP47 codes en alternateName)
  if (Array.isArray(languages) && languages.length > 0) {
    personData.knowsLanguage = languages.map((lang) => ({
      '@type': 'Language',
      name: lang.name,
      alternateName: lang.code,
    }));
  }

  // Educación (solo si vienen campos seguros)
  if (Array.isArray(education) && education.length > 0) {
    personData.alumniOf = education
      .filter((e) => e?.institution)
      .map((edu) => ({
        '@type': 'EducationalOrganization',
        name: edu.institution,
        description: edu.title || undefined,
      }));
  }

  // Experiencia (usar Occupation de forma conservadora)
  if (Array.isArray(experiences) && experiences.length > 0) {
    personData.hasOccupation = experiences
      .filter((x) => x?.title && x?.company)
      .map((exp) => ({
        '@type': 'Occupation',
        name: exp.title,
        occupationLocation: {
          '@type': 'Organization',
          name: exp.company,
        },
        description: exp.description || undefined,
        startDate: exp.startDate || undefined,
        endDate: exp.endDate || undefined, // sin "Present" para evitar strings no-ISO
      }));
  }

  // --- WebPage JSON-LD ---
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name: 'Oriol Macias – Backend Developer CV & Portfolio',
    description:
      'Professional CV and portfolio for Oriol Macias, Backend Developer specialized in Python/Django, REST APIs, and industrial protocols integration (SNMP, Modbus, BACnet).',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Oriol Macias – Portfolio',
      url: siteUrl,
    },
    about: { '@id': personId },
    inLanguage: ['en', 'es', 'fr', 'de'],
    mainEntity: { '@id': personId },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(webPage) }}
      />
    </>
  );
};

export default StructuredData;
