/**
 * Enhanced SEO Component for Swiss Tech Market Optimization
 * @file src/components/SwissMarketSEO.jsx
 * @description Comprehensive SEO optimization targeting Swiss recruiters and companies
 * @author Oriol Macias
 * @version 2.0.0
 * @requires React, astro:content
 * 
 * Key optimizations:
 * - Swiss geo-targeting with city-specific keywords
 * - Work permit status emphasis for recruiters
 * - Multilingual hreflang implementation
 * - Industrial protocol expertise highlighting
 * - Schema.org JobPosting integration
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Swiss Market SEO Component with advanced targeting capabilities
 * @description Generates optimized meta tags, structured data, and hreflang for Swiss job market
 * @param {Object} props - Component properties
 * @param {string} props.pageType - Type of page ('portfolio'|'skills'|'experience'|'contact')
 * @param {string} props.targetCity - Swiss city focus ('zurich'|'basel'|'geneva'|'lausanne'|'general')
 * @param {string} props.language - Current language ('en'|'de'|'fr'|'es')
 * @param {Array<string>} props.primarySkills - Main technical skills to emphasize
 * @param {boolean} props.workPermitReady - Work authorization status
 * @param {Object} props.customMeta - Override default meta values
 * @returns {JSX.Element} Helmet component with optimized meta tags
 * 
 * @example
 * <SwissMarketSEO 
 *   pageType="portfolio" 
 *   targetCity="zurich" 
 *   language="en"
 *   primarySkills={['Python', 'Django', 'Industrial Protocols']}
 *   workPermitReady={true}
 * />
 */
const SwissMarketSEO = ({
  pageType = 'portfolio',
  targetCity = 'general',
  language = 'en',
  primarySkills = ['Python', 'Django', 'Backend Development'],
  workPermitReady = true,
  customMeta = {}
}) => {
  
  // Base configuration for error handling
  const baseConfig = {
    domain: 'https://oriolmacias.dev',
    authorName: 'Oriol Macias',
    jobTitle: 'Senior Backend Developer',
    experienceYears: '8+',
    workLocation: 'Switzerland'
  };

  /**
   * Generates city-specific SEO content with error handling
   * @param {string} city - Target Swiss city
   * @param {string} lang - Content language
   * @returns {Object} City-specific SEO metadata
   */
  const getCitySpecificContent = (city, lang) => {
    const cityContent = {
      en: {
        zurich: {
          titleSuffix: 'Zurich | Fintech & Banking Specialist',
          description: 'Senior Backend Developer seeking opportunities in Zurich. Python, Django expert with 8+ years experience. ETH collaboration ready, work permit available.',
          localKeywords: ['backend developer zurich', 'python developer zurich', 'fintech developer zurich'],
          industryFocus: 'Fintech and Banking Technology'
        },
        basel: {
          titleSuffix: 'Basel | Industrial Automation Expert',
          description: 'Backend Developer specializing in Basel pharmaceutical and manufacturing sectors. Industrial protocol integration (SNMP, MODBUS, BACnet) expert.',
          localKeywords: ['software engineer basel', 'industrial developer basel', 'pharmaceutical automation basel'],
          industryFocus: 'Pharmaceutical and Manufacturing Automation'
        },
        geneva: {
          titleSuffix: 'Geneva | Multilingual Tech Professional',
          description: 'Multilingual Backend Developer (EN/ES/FR) seeking Geneva opportunities. International organization tech experience, CERN collaboration potential.',
          localKeywords: ['backend developer geneva', 'multilingual developer geneva', 'international org developer'],
          industryFocus: 'International Organizations and CERN Technology'
        },
        lausanne: {
          titleSuffix: 'Lausanne | EPFL Tech Ecosystem',
          description: 'Backend Developer targeting Lausanne EPFL tech ecosystem. Python, Django specialist with research collaboration experience.',
          localKeywords: ['developer lausanne', 'epfl collaboration', 'tech ecosystem lausanne'],
          industryFocus: 'Research and Academic Technology'
        },
        general: {
          titleSuffix: 'Switzerland | Work Permit Ready',
          description: 'Senior Backend Developer seeking opportunities across Switzerland. 8+ years Python, Django, industrial protocols. EU work permit ready.',
          localKeywords: ['backend developer switzerland', 'python developer switzerland', 'work permit switzerland'],
          industryFocus: 'Swiss Technology Market'
        }
      },
      de: {
        zurich: {
          titleSuffix: 'Zürich | Backend Entwickler Spezialist',
          description: 'Senior Backend Entwickler sucht Stellen in Zürich. Python, Django Experte mit 8+ Jahren Erfahrung. Arbeitserlaubnis verfügbar.',
          localKeywords: ['backend entwickler zürich', 'python entwickler zürich', 'software entwickler zürich'],
          industryFocus: 'Fintech und Banking Technologie'
        },
        basel: {
          titleSuffix: 'Basel | Industrie Automation Experte',
          description: 'Backend Entwickler spezialisiert auf Basel Pharma und Industrie. Industrielle Protokolle Integration (SNMP, MODBUS, BACnet).',
          localKeywords: ['software entwickler basel', 'industrie entwickler basel', 'pharma automation basel'],
          industryFocus: 'Pharma und Industrie Automation'
        },
        general: {
          titleSuffix: 'Schweiz | Arbeitserlaubnis Bereit',
          description: 'Senior Backend Entwickler sucht Stellen in der Schweiz. 8+ Jahre Python, Django, industrielle Protokolle. EU Arbeitserlaubnis bereit.',
          localKeywords: ['backend entwickler schweiz', 'python entwickler schweiz', 'arbeitserlaubnis schweiz'],
          industryFocus: 'Schweizer Technologie Markt'
        }
      },
      fr: {
        geneva: {
          titleSuffix: 'Genève | Développeur Multilingue',
          description: 'Développeur Backend multilingue (EN/ES/FR) cherche opportunités à Genève. Expérience organisations internationales, collaboration CERN.',
          localKeywords: ['développeur backend genève', 'développeur multilingue genève', 'organisations internationales'],
          industryFocus: 'Organisations Internationales et Technologie CERN'
        },
        general: {
          titleSuffix: 'Suisse | Permis de Travail Prêt',
          description: 'Développeur Backend senior cherche opportunités en Suisse. 8+ ans Python, Django, protocoles industriels. Permis de travail UE prêt.',
          localKeywords: ['développeur backend suisse', 'développeur python suisse', 'permis travail suisse'],
          industryFocus: 'Marché Technologique Suisse'
        }
      }
    };

    try {
      return cityContent[lang]?.[city] || cityContent[lang]?.general || cityContent.en.general;
    } catch (error) {
      console.error('Error getting city content:', error.message);
      return cityContent.en.general; // Fallback to English general content
    }
  };

  /**
   * Generates structured data for Swiss job market optimization
   * @param {Object} config - Configuration object
   * @returns {Object} Schema.org structured data
   */
  const generateStructuredData = (config) => {
    try {
      const { cityContent, skills, workPermit } = config;
      
      return {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": `${baseConfig.domain}/#person`,
            "name": baseConfig.authorName,
            "url": baseConfig.domain,
            "image": `${baseConfig.domain}/images/oriol_macias.jpg`,
            "jobTitle": baseConfig.jobTitle,
            "description": cityContent.description,
            "knowsAbout": skills,
            "workLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CH",
                "addressRegion": "Switzerland"
              }
            },
            "seeks": {
              "@type": "JobPosting",
              "jobTitle": "Backend Developer",
              "description": `${baseConfig.jobTitle} with ${baseConfig.experienceYears} years experience seeking opportunities in ${cityContent.industryFocus}`,
              "qualifications": skills.join(', '),
              "workAuthorizationRequired": !workPermit,
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "CH",
                  "addressLocality": targetCity !== 'general' ? targetCity.charAt(0).toUpperCase() + targetCity.slice(1) : undefined
                }
              }
            },
            "sameAs": [
              "https://linkedin.com/in/oriolmaciasbadosa",
              "https://github.com/MaciWP"
            ]
          },
          {
            "@type": "WebPage",
            "@id": `${baseConfig.domain}/#webpage`,
            "url": baseConfig.domain,
            "name": `${baseConfig.authorName} - ${cityContent.titleSuffix}`,
            "description": cityContent.description,
            "inLanguage": language,
            "about": {
              "@id": `${baseConfig.domain}/#person`
            }
          }
        ]
      };
    } catch (error) {
      console.error('Error generating structured data:', error.message);
      // Return minimal valid structured data as fallback
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": baseConfig.authorName,
        "jobTitle": baseConfig.jobTitle,
        "url": baseConfig.domain
      };
    }
  };

  /**
   * Generates hreflang attributes for multilingual SEO
   * @returns {Array} Array of hreflang link objects
   */
  const generateHreflangLinks = () => {
    const baseUrls = {
      en: `${baseConfig.domain}/`,
      es: `${baseConfig.domain}/es/`,
      fr: `${baseConfig.domain}/fr/`,
      de: `${baseConfig.domain}/de/`
    };

    try {
      return Object.entries(baseUrls).map(([lang, url]) => ({
        rel: 'alternate',
        hrefLang: lang,
        href: url
      }));
    } catch (error) {
      console.error('Error generating hreflang links:', error.message);
      return [{ rel: 'alternate', hrefLang: 'en', href: baseConfig.domain }];
    }
  };

  // Get city-specific content with error handling
  const cityContent = getCitySpecificContent(targetCity, language);
  
  // Build final meta configuration
  const metaConfig = {
    title: customMeta.title || `${baseConfig.authorName} - ${cityContent.titleSuffix}`,
    description: customMeta.description || cityContent.description,
    keywords: [
      ...cityContent.localKeywords,
      ...primarySkills.map(skill => `${skill.toLowerCase()} developer switzerland`),
      workPermitReady ? 'work permit ready switzerland' : 'work authorization switzerland',
      'backend developer cv', 'python portfolio switzerland'
    ].join(', '),
    canonicalUrl: `${baseConfig.domain}${language !== 'en' ? `/${language}` : ''}/`,
    ogImage: `${baseConfig.domain}/images/oriol-macias-swiss-seo.jpg`
  };

  // Generate structured data
  const structuredData = generateStructuredData({
    cityContent,
    skills: primarySkills,
    workPermit: workPermitReady
  });

  // Generate hreflang links
  const hreflangLinks = generateHreflangLinks();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaConfig.title}</title>
      <meta name="description" content={metaConfig.description} />
      <meta name="keywords" content={metaConfig.keywords} />
      <link rel="canonical" href={metaConfig.canonicalUrl} />
      
      {/* Swiss Geo-targeting */}
      <meta name="geo.region" content="CH" />
      <meta name="geo.country" content="Switzerland" />
      {targetCity !== 'general' && (
        <meta name="geo.placename" content={targetCity.charAt(0).toUpperCase() + targetCity.slice(1)} />
      )}
      
      {/* Work Authorization Meta */}
      {workPermitReady && (
        <meta name="work-authorization" content="EU work permit ready" />
      )}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={metaConfig.title} />
      <meta property="og:description" content={metaConfig.description} />
      <meta property="og:url" content={metaConfig.canonicalUrl} />
      <meta property="og:image" content={metaConfig.ogImage} />
      <meta property="og:type" content="profile" />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : `${language}_CH`} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaConfig.title} />
      <meta name="twitter:description" content={metaConfig.description} />
      <meta name="twitter:image" content={metaConfig.ogImage} />
      
      {/* Hreflang Links */}
      {hreflangLinks.map((link, index) => (
        <link key={index} {...link} />
      ))}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
      
      {/* Swiss Market Specific Tags */}
      <meta name="target-market" content="Switzerland" />
      <meta name="employment-type" content="Full-time" />
      <meta name="experience-level" content="Senior" />
      <meta name="remote-work" content="Hybrid-friendly" />
    </Helmet>
  );
};

export default SwissMarketSEO;

/**
 * Swiss Market Content Generator Utility
 * @file src/utils/swissMarketContent.js
 * @description Utility functions for generating Swiss market-specific content
 */

/**
 * Generates Swiss market optimized content for different page types
 * @param {Object} config - Configuration object
 * @param {string} config.pageType - Type of page
 * @param {string} config.city - Target city
 * @param {string} config.language - Content language
 * @returns {Object} Generated content object
 */
export const generateSwissMarketContent = (config) => {
  try {
    const { pageType, city, language } = config;
    
    const contentTemplates = {
      hero: {
        en: {
          zurich: `Senior Backend Developer ready for Zurich's dynamic fintech ecosystem. Specialized in Python, Django, and enterprise integration solutions.`,
          basel: `Backend Developer with industrial automation expertise for Basel's pharmaceutical and manufacturing sectors. SNMP, MODBUS, BACnet specialist.`,
          geneva: `Multilingual Backend Developer (EN/ES/FR) seeking opportunities in Geneva's international technology landscape. CERN collaboration experience.`,
          general: `Senior Backend Developer seeking opportunities across Switzerland. ${config.experienceYears || '8+'} years experience with EU work permit ready.`
        }
      },
      skills: {
        en: {
          general: `Technical expertise specifically aligned with Swiss technology market demands. Proven experience in enterprise-grade solutions for Swiss companies.`
        }
      }
    };

    return contentTemplates[pageType]?.[language]?.[city] || 
           contentTemplates[pageType]?.[language]?.general ||
           'Professional portfolio optimized for Swiss technology market.';
           
  } catch (error) {
    console.error('Error generating Swiss market content:', error.message);
    return 'Professional portfolio for software development opportunities.';
  }
};

/**
 * Swiss Market Analytics Integration
 * @description Track Swiss-specific user interactions and conversions
 */
export const trackSwissMarketInteraction = (eventType, city, language) => {
  try {
    // Google Analytics 4 event tracking for Swiss market
    if (typeof gtag !== 'undefined') {
      gtag('event', 'swiss_market_interaction', {
        event_category: 'Swiss SEO',
        event_label: `${eventType}_${city}_${language}`,
        custom_parameter_1: 'swiss_job_market',
        custom_parameter_2: city
      });
    }
    
    // LinkedIn Insight Tag for Swiss professional network
    if (typeof _linkedin_partner_id !== 'undefined') {
      window.lintrk('track', { conversion_id: 'swiss_cv_view' });
    }
    
  } catch (error) {
    console.warn('Analytics tracking error:', error.message);
    // Continue without breaking functionality
  }
};