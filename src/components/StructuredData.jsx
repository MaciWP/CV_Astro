/**
 * Componente StructuredData optimizado para SEO
 * File: src/components/StructuredData.jsx
 * 
 * Mejora la información estructurada para motores de búsqueda, 
 * haciendo que el CV sea más fácil de encontrar con términos clave.
 */
import React from 'react';

const StructuredData = ({
    name = "Oriol Macias",
    jobTitle = "Software Developer",
    skills = [
        "Python", "Django", "C#", ".NET",
        "SNMP", "MODBUS", "BACnet",
        "Backend Development", "API Development",
        "Industrial Protocols", "Data Center Infrastructure"
    ],
    languages = [
        { name: "Spanish", code: "es" },
        { name: "Catalan", code: "ca" },
        { name: "English", code: "en" }
    ],
    keywords = [
        "Oriol Macias", "Oriol", "Macias",
        "Software Developer", "Developer", "Desarrollador",
        "Développeur", "Backend Developer", "Full Stack",
        "CV", "Portfolio", "Resume", "oriol dev", "macias dev"
    ],
    education = [],
    experiences = []
}) => {
    // Datos estructurados de Persona con info enriquecida
    const personData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://oriolmacias.dev/#person",
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
            "name": "Bjumper",
            "url": "https://bjumper.com"
        },
        "description": "Solutions-driven Backend Developer specializing in industrial protocol integration (SNMP, MODBUS, BACKnet) with 8+ years of delivering high-performance applications.",
        "knowsAbout": skills,
        "nationality": {
            "@type": "Country",
            "name": "Spain"
        },
        "keywords": keywords.join(", ")
    };

    // Añadir idiomas a los datos estructurados
    if (languages && languages.length > 0) {
        personData.knowsLanguage = languages.map(lang => ({
            "@type": "Language",
            "name": lang.name,
            "alternateName": lang.code
        }));
    }

    // Añadir educación si está disponible
    if (education && education.length > 0) {
        personData.alumniOf = education.map(edu => ({
            "@type": "EducationalOrganization",
            "name": edu.institution,
            "description": edu.title
        }));
    }

    // Añadir experiencia laboral si está disponible
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

    // Datos estructurados de la página web
    const webPage = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://oriolmacias.dev/",
        "url": "https://oriolmacias.dev/",
        "name": "Oriol Macias - Software Developer CV & Portfolio",
        "description": "Professional CV and portfolio for Oriol Macias, a Software Developer specialized in backend development, industrial protocols integration, and data center infrastructure.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "Oriol Macias - Portfolio",
            "url": "https://oriolmacias.dev/"
        },
        "about": {
            "@id": "https://oriolmacias.dev/#person"
        },
        "inLanguage": ["en", "es", "fr"],
        "mainEntity": {
            "@id": "https://oriolmacias.dev/#person"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://oriolmacias.dev/"
                }
            ]
        }
    };

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(personData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(webPage)}
            </script>
        </>
    );
};

export default StructuredData;