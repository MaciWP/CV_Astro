// src/components/StructuredData.jsx (mejorado)
/**
 * Enhanced structured data component with better SEO coverage
 * Helps search engines better understand the CV content
 */
import React from 'react';

const StructuredData = ({
    name = "Oriol Macias",
    jobTitle = "Software Developer",
    skills = [],
    languages = [],
    education = [],
    experiences = []
}) => {
    // Basic person data
    const personData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "url": "https://oriolmacias.dev",
        "image": "https://oriolmacias.dev/images/oriol_macias.jpg",
        "sameAs": [
            "https://linkedin.com/in/oriolmaciasbadosa",
            "https://github.com/MaciWP"
        ],
        "jobTitle": jobTitle,
        "worksFor": {
            "@type": "Organization",
            "name": "Bjumper"
        },
        "description": "Solutions-driven Backend Developer specializing in industrial protocol integration (SNMP, MODBUS, BACKnet) with 8+ years of delivering high-performance applications."
    };

    // Add skills if provided
    if (skills && skills.length > 0) {
        personData.knowsAbout = skills;
    }

    // Add languages if provided
    if (languages && languages.length > 0) {
        personData.knowsLanguage = languages.map(lang => ({
            "@type": "Language",
            "name": lang.name,
            "alternateName": lang.code
        }));
    }

    // Add education if provided
    if (education && education.length > 0) {
        personData.alumniOf = education.map(edu => ({
            "@type": "EducationalOrganization",
            "name": edu.institution,
            "description": edu.title
        }));
    }

    // Add work experience if provided
    if (experiences && experiences.length > 0) {
        personData.hasOccupation = experiences.map(exp => ({
            "@type": "Occupation",
            "name": exp.title,
            "occupationLocation": {
                "@type": "Organization",
                "name": exp.company
            },
            "description": exp.description,
            "startDate": exp.startDate,
            "endDate": exp.endDate || "Present"
        }));
    }

    // Add webpage as the main entity
    personData.mainEntityOfPage = {
        "@type": "WebPage",
        "@id": "https://oriolmacias.dev/"
    };

    return (
        <script type="application/ld+json">
            {JSON.stringify(personData)}
        </script>
    );
};

export default StructuredData;