/**
 * Swiss Market SEO Configuration
 * @file src/config/swissMarketSEO.config.js
 * @description Central configuration for Swiss job market optimization
 * @version 2.0.0
 * @author Oriol Macias
 * 
 * IMPLEMENTATION REQUIREMENTS:
 * - Follow Swiss enterprise coding standards
 * - Include comprehensive error handling
 * - Provide fallback configurations for all scenarios
 * - Support multilingual targeting (EN/DE/FR/ES)
 * - Enable easy A/B testing for different keyword strategies
 */

/**
 * Swiss Market SEO Configuration Object
 * @description Centralized configuration for all Swiss market targeting
 * @type {Object}
 */
export const swissMarketConfig = {
  
  // Base configuration with error handling defaults
  base: {
    domain: process.env.SITE_URL || 'https://oriolmacias.dev',
    siteName: 'Oriol Macias - Backend Developer Portfolio',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'de', 'fr', 'es'],
    workPermitStatus: true, // EU work authorization available
    experienceYears: '8+',
    lastUpdated: '2025-01-01'
  },

  /**
   * Swiss City-Specific Configuration
   * @description Targeting major Swiss tech hubs with specialized messaging
   */
  cities: {
    zurich: {
      name: 'Zurich',
      germanName: 'Zürich',
      frenchName: 'Zurich',
      population: 415000,
      techFocus: ['fintech', 'banking', 'insurance', 'blockchain'],
      majorCompanies: ['Credit Suisse', 'UBS', 'Google Zurich', 'Meta', 'Microsoft'],
      universitiesPartners: ['ETH Zurich', 'University of Zurich'],
      primaryKeywords: {
        en: ['backend developer zurich', 'python developer zurich', 'fintech developer zurich'],
        de: ['backend entwickler zürich', 'python entwickler zürich', 'fintech entwickler zürich']
      },
      averageSalary: { min: 95000, max: 140000, currency: 'CHF' },
      commuteRadius: ['Winterthur', 'Baden', 'Zug']
    },
    
    basel: {
      name: 'Basel',
      germanName: 'Basel',
      frenchName: 'Bâle',
      population: 175000,
      techFocus: ['pharmaceutical', 'biotech', 'manufacturing', 'automation'],
      majorCompanies: ['Roche', 'Novartis', 'Syngenta', 'BASF'],
      universitiesPartners: ['University of Basel', 'FHNW'],
      primaryKeywords: {
        en: ['software engineer basel', 'pharmaceutical automation basel', 'industrial developer basel'],
        de: ['software entwickler basel', 'pharma automation basel', 'industrie entwickler basel']
      },
      averageSalary: { min: 90000, max: 130000, currency: 'CHF' },
      commuteRadius: ['Liestal', 'Rheinfelden', 'Lörrach']
    },
    
    geneva: {
      name: 'Geneva',
      germanName: 'Genf',
      frenchName: 'Genève',
      population: 200000,
      techFocus: ['international_orgs', 'research', 'cern', 'un_tech'],
      majorCompanies: ['CERN', 'UN', 'WHO', 'Procter & Gamble', 'Firmenich'],
      universitiesPartners: ['University of Geneva', 'CERN'],
      primaryKeywords: {
        en: ['backend developer geneva', 'multilingual developer geneva', 'international org developer'],
        fr: ['développeur backend genève', 'développeur multilingue genève', 'organisations internationales']
      },
      averageSalary: { min: 85000, max: 125000, currency: 'CHF' },
      commuteRadius: ['Lausanne', 'Annemasse', 'Nyon']
    },
    
    lausanne: {
      name: 'Lausanne',
      germanName: 'Lausanne',
      frenchName: 'Lausanne',
      population: 140000,
      techFocus: ['research', 'epfl_ecosystem', 'startups', 'academic_tech'],
      majorCompanies: ['EPFL', 'Nestlé', 'Logitech', 'Kudelski'],
      universitiesPartners: ['EPFL', 'University of Lausanne'],
      primaryKeywords: {
        en: ['developer lausanne', 'epfl collaboration', 'research developer lausanne'],
        fr: ['développeur lausanne', 'collaboration epfl', 'recherche développeur lausanne']
      },
      averageSalary: { min: 80000, max: 120000, currency: 'CHF' },
      commuteRadius: ['Montreux', 'Vevey', 'Geneva']
    }
  },

  /**
   * Keyword Strategy Configuration
   * @description Comprehensive keyword targeting with priority levels
   */
  keywords: {
    // High-volume, medium competition
    primary: {
      en: [
        'backend developer switzerland',
        'python developer zurich',
        'software engineer basel',
        'backend developer geneva',
        'django developer switzerland'
      ],
      de: [
        'backend entwickler schweiz',
        'python entwickler zürich',
        'software entwickler basel',
        'entwickler schweiz'
      ],
      fr: [
        'développeur backend suisse',
        'développeur python genève',
        'ingénieur logiciel suisse'
      ]
    },
    
    // Low-volume, low competition (long-tail)
    specialized: {
      en: [
        'industrial protocol developer switzerland',
        'snmp modbus bacnet specialist',
        'dcim integration developer',
        'python backend developer remote switzerland',
        'eu work permit developer switzerland'
      ],
      de: [
        'industrielle protokolle entwickler',
        'automation spezialist schweiz',
        'arbeitserlaubnis entwickler schweiz'
      ]
    },
    
    // Semantic/LSI keywords for natural content integration
    semantic: {
      en: [
        'swiss technology companies',
        'backend engineering jobs',
        'python programming expertise',
        'industrial automation solutions',
        'data center infrastructure management',
        'api development specialist',
        'microservices architecture',
        'agile development methodologies'
      ]
    }
  },

  /**
   * Meta Tag Templates by Page Type and Location
   * @description Pre-optimized meta tag configurations
   */
  metaTemplates: {
    homepage: {
      en: {
        zurich: {
          title: 'Oriol Macias - Senior Backend Developer Zurich | Python Expert Available',
          description: 'Senior Backend Developer seeking opportunities in Zurich. 8+ years Python, Django expertise with fintech experience. Work permit ready for immediate hire.',
          keywords: 'backend developer zurich, python developer zurich, fintech developer, work permit switzerland'
        },
        basel: {
          title: 'Oriol Macias - Software Engineer Basel | Industrial Automation Expert',
          description: 'Software Engineer specializing in Basel pharmaceutical and manufacturing sectors. Industrial protocol integration (SNMP, MODBUS, BACnet) specialist.',
          keywords: 'software engineer basel, industrial automation basel, pharmaceutical developer, snmp modbus specialist'
        },
        geneva: {
          title: 'Oriol Macias - Backend Developer Geneva | Multilingual Tech Professional',
          description: 'Multilingual Backend Developer (EN/ES/FR) seeking Geneva opportunities. International organization tech experience, CERN collaboration ready.',
          keywords: 'backend developer geneva, multilingual developer geneva, international organizations, cern collaboration'
        },
        general: {
          title: 'Oriol Macias - Senior Backend Developer Switzerland | Work Permit Ready',
          description: 'Senior Backend Developer seeking opportunities across Switzerland. 8+ years Python, Django, industrial protocols. EU work permit ready for immediate hire.',
          keywords: 'backend developer switzerland, python developer switzerland, work permit ready, industrial protocols'
        }
      },
      de: {
        zurich: {
          title: 'Oriol Macias - Senior Backend Entwickler Zürich | Python Spezialist',
          description: 'Senior Backend Entwickler sucht Stellen in Zürich. 8+ Jahre Python, Django Erfahrung mit Fintech. Arbeitserlaubnis verfügbar.',
          keywords: 'backend entwickler zürich, python entwickler zürich, fintech entwickler, arbeitserlaubnis schweiz'
        },
        general: {
          title: 'Oriol Macias - Software Entwickler Schweiz | Arbeitserlaubnis Bereit',
          description: 'Senior Software Entwickler sucht Stellen in der Schweiz. 8+ Jahre Python, Django, industrielle Protokolle. EU Arbeitserlaubnis bereit.',
          keywords: 'software entwickler schweiz, python entwickler schweiz, arbeitserlaubnis bereit, industrielle protokolle'
        }
      },
      fr: {
        geneva: {
          title: 'Oriol Macias - Développeur Backend Genève | Professionnel Multilingue',
          description: 'Développeur Backend multilingue (EN/ES/FR) cherche opportunités à Genève. Expérience organisations internationales, collaboration CERN prête.',
          keywords: 'développeur backend genève, développeur multilingue genève, organisations internationales, collaboration cern'
        },
        general: {
          title: 'Oriol Macias - Développeur Backend Suisse | Permis de Travail Prêt',
          description: 'Développeur Backend senior cherche opportunités en Suisse. 8+ ans Python, Django, protocoles industriels. Permis de travail UE prêt.',
          keywords: 'développeur backend suisse, développeur python suisse, permis travail prêt, protocoles industriels'
        }
      }
    }
  },

  /**
   * Structured Data Templates
   * @description Schema.org markup for enhanced search visibility
   */
  structuredData: {
    basePerson: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': 'https://oriolmacias.dev/#person',
      name: 'Oriol Macias',
      jobTitle: 'Senior Backend Developer',
      url: 'https://oriolmacias.dev',
      image: 'https://oriolmacias.dev/images/oriol_macias.jpg',
      sameAs: [
        'https://linkedin.com/in/oriolmaciasbadosa',
        'https://github.com/MaciWP'
      ],
      knowsAbout: [
        'Python', 'Django', 'Backend Development', 'Industrial Protocols',
        'SNMP', 'MODBUS', 'BACnet', 'DCIM', 'REST APIs', 'Microservices',
        'PostgreSQL', 'Docker', 'AWS', 'C#', '.NET'
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Bjumper',
        url: 'https://bjumper.com'
      }
    },
    
    jobSeeking: {
      '@type': 'JobPosting',
      '@context': 'https://schema.org',
      title: 'Backend Developer Position Sought',
      description: 'Senior Backend Developer with 8+ years experience seeking opportunities in Switzerland',
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Swiss Technology Companies'
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'CH',
          addressRegion: 'Switzerland'
        }
      },
      qualifications: [
        '8+ years backend development experience',
        'Python and Django expertise',
        'Industrial protocol integration',
        'EU work authorization',
        'Multilingual communication'
      ]
    }
  },

  /**
   * A/B Testing Configuration
   * @description Different keyword strategy variants for testing
   */
  abTesting: {
    variants: {
      A: {
        name: 'geographic_focus',
        description: 'Emphasize city-specific targeting',
        titlePattern: '{name} - {jobTitle} {city} | {specialization}',
        descriptionFocus: 'city_first'
      },
      B: {
        name: 'skill_focus',
        description: 'Emphasize technical skills first',
        titlePattern: '{name} - {specialization} | {jobTitle} {city}',
        descriptionFocus: 'skills_first'
      },
      C: {
        name: 'work_permit_focus',
        description: 'Emphasize work authorization prominently',
        titlePattern: '{name} - {jobTitle} Switzerland | Work Permit Ready',
        descriptionFocus: 'authorization_first'
      }
    },
    currentVariant: 'A' // Can be changed for testing different approaches
  },

  /**
   * Performance Monitoring Configuration
   * @description Track SEO performance metrics
   */
  monitoring: {
    targetKeywords: [
      'backend developer switzerland',
      'python developer zurich',
      'software engineer basel',
      'backend developer geneva'
    ],
    conversionGoals: [
      'contact_form_submit',
      'cv_download',
      'linkedin_profile_click',
      'github_profile_click'
    ],
    competitorDomains: [
      'swiss-developers.ch',
      'tech-jobs-switzerland.com',
      'backend-developers-zurich.ch'
    ]
  }
};

/**
 * Configuration Validation Function
 * @description Validates configuration integrity with error handling
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validation result with errors array
 */
export const validateConfig = (config = swissMarketConfig) => {
  const errors = [];
  const warnings = [];

  try {
    // Validate base configuration
    if (!config.base?.domain) {
      errors.push('Missing base domain configuration');
    }

    if (!config.base?.supportedLanguages?.includes('en')) {
      errors.push('English language support is required');
    }

    // Validate city configurations
    const requiredCities = ['zurich', 'basel', 'geneva'];
    requiredCities.forEach(city => {
      if (!config.cities?.[city]) {
        errors.push(`Missing configuration for city: ${city}`);
      } else {
        if (!config.cities[city].primaryKeywords?.en?.length) {
          warnings.push(`Missing English keywords for ${city}`);
        }
      }
    });

    // Validate meta templates
    if (!config.metaTemplates?.homepage?.en?.general) {
      errors.push('Missing general English meta template');
    }

    // Validate structured data
    if (!config.structuredData?.basePerson?.name) {
      errors.push('Missing person name in structured data');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date().toISOString()
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Configuration validation failed: ${error.message}`],
      warnings: [],
      validatedAt: new Date().toISOString()
    };
  }
};

/**
 * Get Configuration Helper Function
 * @description Safely retrieves configuration with fallbacks
 * @param {string} city - Target city
 * @param {string} language - Target language
 * @param {string} pageType - Page type
 * @returns {Object} Safe configuration object
 */
export const getSwissConfig = (city = 'general', language = 'en', pageType = 'homepage') => {
  try {
    const validation = validateConfig();
    if (!validation.isValid) {
      console.warn('Configuration validation failed:', validation.errors);
    }

    const cityConfig = swissMarketConfig.cities[city] || {};
    const metaConfig = swissMarketConfig.metaTemplates[pageType]?.[language]?.[city] || 
                     swissMarketConfig.metaTemplates[pageType]?.[language]?.general ||
                     swissMarketConfig.metaTemplates[pageType]?.en?.general;

    return {
      base: swissMarketConfig.base,
      city: cityConfig,
      meta: metaConfig,
      keywords: swissMarketConfig.keywords,
      structuredData: swissMarketConfig.structuredData,
      isValid: validation.isValid,
      warnings: validation.warnings
    };

  } catch (error) {
    console.error('Error getting Swiss configuration:', error.message);
    
    // Return minimal safe configuration
    return {
      base: { domain: 'https://oriolmacias.dev', defaultLanguage: 'en' },
      city: { name: city },
      meta: {
        title: 'Oriol Macias - Backend Developer',
        description: 'Backend Developer portfolio',
        keywords: 'backend developer, software engineer'
      },
      keywords: { primary: { en: [] } },
      structuredData: {},
      isValid: false,
      warnings: ['Using fallback configuration due to errors']
    };
  }
};

/**
 * Export default configuration for easy importing
 */
export default swissMarketConfig;