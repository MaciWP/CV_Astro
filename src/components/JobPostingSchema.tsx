/**
 * JobPosting Schema Component
 * @file src/components/JobPostingSchema.jsx
 * @description Generates compliant JobPosting structured data for Google Search Console
 * @author Oriol Macias Dev
 * @version 1.0.0
 * 
 * FIXES APPLIED:
 * ✅ All required fields included (title, description, datePosted, hiringOrganization)
 * ✅ Non-critical fields added (addressLocality, postalCode, employmentType, validThrough, baseSalary)
 * ✅ Market-specific optimizations for Switzerland and Spain
 * ✅ City-specific salary ranges and postal codes
 * ✅ Multilingual support
 */

import React from 'react';

/**
 * JobPosting Schema Component Props
 * @interface JobPostingSchemaProps
 */
interface JobPostingSchemaProps {
    market?: 'switzerland' | 'spain' | 'general';
    city?: string;
    language?: 'en' | 'es' | 'fr';
}

/**
 * Market-specific job data configuration
 */
const marketConfigs = {
    switzerland: {
        en: {
            title: "Senior Backend Developer - Switzerland",
            description: "Experienced Backend Developer with 8+ years in industrial protocol integration (SNMP, MODBUS, BACnet) seeking opportunities in Switzerland. Expertise in Python, Django, C#, .NET, and data center infrastructure. EU work permit ready.",
            hiringOrg: "Swiss Technology Companies",
            currency: "CHF",
            salaryRange: { min: 90000, max: 130000 },
            postalCode: "8000-9000",
            qualifications: [
                "8+ years backend development experience",
                "Python and Django expertise",
                "Industrial protocols knowledge (SNMP, MODBUS, BACnet)",
                "EU work authorization",
                "Multilingual (English, Spanish, French)"
            ],
            responsibilities: [
                "Design and develop backend systems",
                "Industrial protocol integration",
                "Data center infrastructure management",
                "API development and maintenance",
                "Database optimization"
            ]
        },
        fr: {
            title: "Développeur Backend Senior - Suisse",
            description: "Développeur Backend expérimenté avec 8+ ans d'intégration de protocoles industriels (SNMP, MODBUS, BACnet) cherchant des opportunités en Suisse. Expertise en Python, Django, C#, .NET et infrastructure de centres de données. Permis de travail UE prêt.",
            hiringOrg: "Entreprises Technologiques Suisses",
            currency: "CHF",
            salaryRange: { min: 90000, max: 130000 },
            postalCode: "8000-9000",
            qualifications: [
                "8+ ans d'expérience développement backend",
                "Expertise Python et Django",
                "Connaissance protocoles industriels (SNMP, MODBUS, BACnet)",
                "Autorisation travail UE",
                "Multilingue (Anglais, Espagnol, Français)"
            ],
            responsibilities: [
                "Concevoir et développer systèmes backend",
                "Intégration protocoles industriels",
                "Gestion infrastructure centres de données",
                "Développement et maintenance APIs",
                "Optimisation bases de données"
            ]
        }
    },
    spain: {
        es: {
            title: "Desarrollador Backend Senior - España",
            description: "Desarrollador Backend experimentado con 8+ años en integración de protocolos industriales (SNMP, MODBUS, BACnet) buscando oportunidades en España. Experiencia en Python, Django, C#, .NET e infraestructura de centros de datos.",
            hiringOrg: "Empresas Tecnológicas España",
            currency: "EUR",
            salaryRange: { min: 45000, max: 65000 },
            postalCode: "28000-28999",
            qualifications: [
                "8+ años experiencia desarrollo backend",
                "Experiencia en Python y Django",
                "Conocimiento protocolos industriales (SNMP, MODBUS, BACnet)",
                "Autorización trabajo UE",
                "Multilingüe (Inglés, Español, Francés)"
            ],
            responsibilities: [
                "Diseñar y desarrollar sistemas backend",
                "Integración protocolos industriales",
                "Gestión infraestructura centros de datos",
                "Desarrollo y mantenimiento APIs",
                "Optimización bases de datos"
            ]
        },
        en: {
            title: "Senior Backend Developer - Spain",
            description: "Experienced Backend Developer with 8+ years in industrial protocol integration (SNMP, MODBUS, BACnet) seeking opportunities in Spain. Expertise in Python, Django, C#, .NET, and data center infrastructure.",
            hiringOrg: "Spanish Technology Companies",
            currency: "EUR",
            salaryRange: { min: 45000, max: 65000 },
            postalCode: "28000-28999",
            qualifications: [
                "8+ years backend development experience",
                "Python and Django expertise",
                "Industrial protocols knowledge (SNMP, MODBUS, BACnet)",
                "EU work authorization",
                "Multilingual (English, Spanish, French)"
            ],
            responsibilities: [
                "Design and develop backend systems",
                "Industrial protocol integration",
                "Data center infrastructure management",
                "API development and maintenance",
                "Database optimization"
            ]
        }
    }
};

/**
 * City-specific configurations for Switzerland
 */
const swissCityConfigs = {
    zurich: { min: 100000, max: 140000, postal: "8000-8099", canton: "Zürich" },
    basel: { min: 95000, max: 135000, postal: "4000-4099", canton: "Basel-Stadt" },
    geneva: { min: 98000, max: 138000, postal: "1200-1299", canton: "Genève" },
    geneve: { min: 98000, max: 138000, postal: "1200-1299", canton: "Genève" },
    lausanne: { min: 90000, max: 125000, postal: "1000-1099", canton: "Vaud" },
    bern: { min: 88000, max: 120000, postal: "3000-3099", canton: "Bern" }
};

/**
 * City-specific configurations for Spain
 */
const spanishCityConfigs = {
    madrid: { min: 48000, max: 68000, postal: "28000-28999", region: "Madrid" },
    barcelona: { min: 45000, max: 65000, postal: "08000-08999", region: "Cataluña" },
    valencia: { min: 40000, max: 58000, postal: "46000-46999", region: "Valencia" },
    sevilla: { min: 38000, max: 55000, postal: "41000-41999", region: "Andalucía" },
    bilbao: { min: 42000, max: 62000, postal: "48000-48999", region: "País Vasco" }
};

/**
 * Generate JobPosting structured data
 * @param {JobPostingSchemaProps} props - Component props
 * @returns {JSX.Element} Script tag with JSON-LD structured data
 */
const JobPostingSchema: React.FC<JobPostingSchemaProps> = ({
    market = 'general',
    city = 'general',
    language = 'en'
}) => {
    // Don't render if no market specified
    if (market === 'general') {
        return null;
    }

    // Get market configuration
    const marketConfig = marketConfigs[market];
    if (!marketConfig) {
        return null;
    }

    // Get language configuration with fallback
    const langConfig = marketConfig[language] || marketConfig.en || marketConfig.es;
    if (!langConfig) {
        return null;
    }

    // Generate dates
    const currentDate = new Date();
    const validThroughDate = new Date();
    validThroughDate.setMonth(validThroughDate.getMonth() + 6);

    // Base job posting structure
    let jobPosting = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: langConfig.title,
        description: langConfig.description,
        datePosted: currentDate.toISOString().split('T')[0],
        validThrough: validThroughDate.toISOString().split('T')[0],
        employmentType: "FULL_TIME",
        hiringOrganization: {
            "@type": "Organization",
            name: langConfig.hiringOrg,
            url: "https://oriolmacias.dev",
            logo: "https://oriolmacias.dev/images/oriol_macias.jpg"
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressCountry: market === 'switzerland' ? 'CH' : 'ES',
                addressRegion: market === 'switzerland' ? 'Zürich' : 'Madrid',  // Canton for CH, Autonomous Community for ES
                addressLocality: market === 'switzerland' ? 'Zürich' : 'Madrid',  // Default to main economic centers
                postalCode: langConfig.postalCode
            }
        },
        baseSalary: {
            "@type": "MonetaryAmount",
            currency: langConfig.currency,
            value: {
                "@type": "QuantitativeValue",
                minValue: langConfig.salaryRange.min,
                maxValue: langConfig.salaryRange.max,
                unitText: "YEAR"
            }
        },
        qualifications: langConfig.qualifications,
        responsibilities: langConfig.responsibilities,
        skills: [
            "Python", "Django", "C#", ".NET", "PostgreSQL",
            "Docker", "AWS", "SNMP", "MODBUS", "BACnet"
        ],
        jobBenefits: market === 'switzerland' ? [
            "Competitive Swiss salary",
            "Work permit sponsorship",
            "Health insurance",
            "Professional development opportunities"
        ] : [
            "Competitive salary",
            "Health insurance",
            "Professional development opportunities",
            "Flexible working arrangements"
        ]
    };

    // Apply city-specific adjustments
    if (city !== 'general') {
        const cityName = city.charAt(0).toUpperCase() + city.slice(1);
        jobPosting.jobLocation.address.addressLocality = cityName;

        if (market === 'switzerland') {
            jobPosting.title = `Senior Backend Developer - ${cityName}, Switzerland`;
            const cityConfig = swissCityConfigs[city as keyof typeof swissCityConfigs];
            if (cityConfig) {
                jobPosting.baseSalary.value.minValue = cityConfig.min;
                jobPosting.baseSalary.value.maxValue = cityConfig.max;
                jobPosting.jobLocation.address.postalCode = cityConfig.postal;
                jobPosting.jobLocation.address.addressRegion = cityConfig.canton;  // Set canton name
            }
        } else if (market === 'spain') {
            jobPosting.title = language === 'es'
                ? `Desarrollador Backend Senior - ${cityName}, España`
                : `Senior Backend Developer - ${cityName}, Spain`;
            const cityConfig = spanishCityConfigs[city as keyof typeof spanishCityConfigs];
            if (cityConfig) {
                jobPosting.baseSalary.value.minValue = cityConfig.min;
                jobPosting.baseSalary.value.maxValue = cityConfig.max;
                jobPosting.jobLocation.address.postalCode = cityConfig.postal;
                jobPosting.jobLocation.address.addressRegion = cityConfig.region;  // Set autonomous community name
            }
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jobPosting, null, 2)
            }}
        />
    );
};

export default JobPostingSchema;