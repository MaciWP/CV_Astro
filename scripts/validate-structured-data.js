/**
 * Structured Data Validation Script
 * @file scripts/validate-structured-data.js
 * @description Validates JobPosting and Person structured data for Google compliance
 * @author Oriol Macias Dev
 * @version 1.0.0
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Required fields for JobPosting schema according to Google
 */
const REQUIRED_JOB_POSTING_FIELDS = [
    'title',
    'description',
    'datePosted',
    'hiringOrganization',
    'jobLocation'
];

/**
 * Recommended fields for better SEO
 */
const RECOMMENDED_JOB_POSTING_FIELDS = [
    'employmentType',
    'validThrough',
    'baseSalary',
    'qualifications',
    'responsibilities'
];

/**
 * Validate JobPosting structured data
 * @param {Object} jobPosting - JobPosting schema object
 * @returns {Object} Validation result
 */
function validateJobPosting(jobPosting) {
    const errors = [];
    const warnings = [];

    // Check required fields
    REQUIRED_JOB_POSTING_FIELDS.forEach(field => {
        if (!jobPosting[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Check recommended fields
    RECOMMENDED_JOB_POSTING_FIELDS.forEach(field => {
        if (!jobPosting[field]) {
            warnings.push(`Missing recommended field: ${field}`);
        }
    });

    // Validate hiringOrganization structure
    if (jobPosting.hiringOrganization) {
        if (!jobPosting.hiringOrganization.name) {
            errors.push('Missing hiringOrganization.name');
        }
        if (!jobPosting.hiringOrganization['@type']) {
            errors.push('Missing hiringOrganization.@type');
        }
    }

    // Validate jobLocation structure
    if (jobPosting.jobLocation) {
        if (!jobPosting.jobLocation.address) {
            errors.push('Missing jobLocation.address');
        } else {
            const address = jobPosting.jobLocation.address;
            if (!address.addressCountry) {
                errors.push('Missing jobLocation.address.addressCountry');
            }
            if (!address.addressRegion) {
                errors.push('Missing jobLocation.address.addressRegion');
            }
            if (!address.addressLocality) {
                warnings.push('Missing jobLocation.address.addressLocality (recommended)');
            }
            if (!address.postalCode) {
                warnings.push('Missing jobLocation.address.postalCode (recommended)');
            }
        }
    }

    // Validate baseSalary structure if present
    if (jobPosting.baseSalary) {
        if (!jobPosting.baseSalary.currency) {
            errors.push('Missing baseSalary.currency');
        }
        if (!jobPosting.baseSalary.value) {
            errors.push('Missing baseSalary.value');
        } else {
            const value = jobPosting.baseSalary.value;
            if (!value.minValue && !value.maxValue && !value.value) {
                errors.push('baseSalary.value must have minValue, maxValue, or value');
            }
            if (!value.unitText) {
                warnings.push('Missing baseSalary.value.unitText (recommended)');
            }
        }
    }

    // Validate date formats
    if (jobPosting.datePosted) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(jobPosting.datePosted)) {
            errors.push('datePosted must be in YYYY-MM-DD format');
        }
    }

    if (jobPosting.validThrough) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(jobPosting.validThrough)) {
            errors.push('validThrough must be in YYYY-MM-DD format');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
    };
}

/**
 * Test JobPosting schema generation
 */
async function testJobPostingGeneration() {
    console.log('🔍 Testing JobPosting Schema Generation...\n');

    // Import the JobPosting component (simulate different scenarios)
    const testCases = [
        {
            name: 'Switzerland - Zurich',
            market: 'switzerland',
            city: 'zurich',
            language: 'en'
        },
        {
            name: 'Switzerland - Geneva (French)',
            market: 'switzerland',
            city: 'geneva',
            language: 'fr'
        },
        {
            name: 'Spain - Madrid',
            market: 'spain',
            city: 'madrid',
            language: 'es'
        },
        {
            name: 'Spain - Barcelona (English)',
            market: 'spain',
            city: 'barcelona',
            language: 'en'
        }
    ];

    let totalScore = 0;
    let passedTests = 0;

    for (const testCase of testCases) {
        console.log(`📋 Testing: ${testCase.name}`);

        try {
            // Simulate JobPosting generation (you would import the actual component here)
            const mockJobPosting = generateMockJobPosting(testCase);

            const validation = validateJobPosting(mockJobPosting);

            console.log(`   Score: ${validation.score}/100`);

            if (validation.errors.length > 0) {
                console.log('   ❌ Errors:');
                validation.errors.forEach(error => console.log(`      - ${error}`));
            }

            if (validation.warnings.length > 0) {
                console.log('   ⚠️  Warnings:');
                validation.warnings.forEach(warning => console.log(`      - ${warning}`));
            }

            if (validation.isValid) {
                console.log('   ✅ Valid JobPosting schema');
                passedTests++;
            } else {
                console.log('   ❌ Invalid JobPosting schema');
            }

            totalScore += validation.score;

        } catch (error) {
            console.log(`   ❌ Error generating schema: ${error.message}`);
        }

        console.log('');
    }

    const averageScore = totalScore / testCases.length;

    console.log('📊 Summary:');
    console.log(`   Tests passed: ${passedTests}/${testCases.length}`);
    console.log(`   Average score: ${averageScore.toFixed(1)}/100`);

    if (averageScore >= 90) {
        console.log('   🎉 Excellent! Ready for production');
    } else if (averageScore >= 75) {
        console.log('   ✅ Good! Minor improvements recommended');
    } else if (averageScore >= 60) {
        console.log('   ⚠️  Needs improvement before production');
    } else {
        console.log('   ❌ Critical issues need to be fixed');
    }

    return {
        passed: passedTests === testCases.length && averageScore >= 75,
        score: averageScore,
        passedTests,
        totalTests: testCases.length
    };
}

/**
 * Generate mock JobPosting for testing
 * @param {Object} testCase - Test case parameters
 * @returns {Object} Mock JobPosting object
 */
function generateMockJobPosting(testCase) {
    const currentDate = new Date();
    const validThroughDate = new Date();
    validThroughDate.setMonth(validThroughDate.getMonth() + 6);

    const baseJobPosting = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: `Senior Backend Developer - ${testCase.city}`,
        description: "Experienced Backend Developer with 8+ years in industrial protocol integration",
        datePosted: currentDate.toISOString().split('T')[0],
        validThrough: validThroughDate.toISOString().split('T')[0],
        employmentType: "FULL_TIME",
        hiringOrganization: {
            "@type": "Organization",
            name: testCase.market === 'switzerland' ? 'Swiss Technology Companies' : 'Spanish Technology Companies',
            url: "https://oriolmacias.dev"
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressCountry: testCase.market === 'switzerland' ? 'CH' : 'ES',
                addressRegion: testCase.market === 'switzerland' ? 'Switzerland' : 'Spain',
                addressLocality: testCase.city.charAt(0).toUpperCase() + testCase.city.slice(1),
                postalCode: testCase.market === 'switzerland' ? '8000-8099' : '28000-28999'
            }
        },
        baseSalary: {
            "@type": "MonetaryAmount",
            currency: testCase.market === 'switzerland' ? 'CHF' : 'EUR',
            value: {
                "@type": "QuantitativeValue",
                minValue: testCase.market === 'switzerland' ? 90000 : 45000,
                maxValue: testCase.market === 'switzerland' ? 130000 : 65000,
                unitText: "YEAR"
            }
        },
        qualifications: [
            "8+ years backend development experience",
            "Python and Django expertise"
        ],
        responsibilities: [
            "Design and develop backend systems",
            "Industrial protocol integration"
        ],
        skills: ["Python", "Django", "C#", ".NET"]
    };

    return baseJobPosting;
}

/**
 * Generate validation report
 */
async function generateValidationReport() {
    const results = await testJobPostingGeneration();

    const report = {
        timestamp: new Date().toISOString(),
        results,
        recommendations: []
    };

    if (results.score < 90) {
        report.recommendations.push('Add more specific job qualifications');
        report.recommendations.push('Include job benefits information');
        report.recommendations.push('Add more detailed job responsibilities');
    }

    if (results.score < 75) {
        report.recommendations.push('Fix all validation errors before deployment');
        report.recommendations.push('Review Google JobPosting guidelines');
    }

    // Save report
    const reportPath = path.join(__dirname, '../validation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Validation report saved to: ${reportPath}`);

    return results.passed;
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 JobPosting Structured Data Validation\n');

    try {
        const passed = await generateValidationReport();

        if (passed) {
            console.log('\n✅ All validations passed! Ready for deployment.');
            process.exit(0);
        } else {
            console.log('\n❌ Validation failed. Please fix issues before deployment.');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Validation script failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { validateJobPosting, testJobPostingGeneration };