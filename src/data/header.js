/**
 * Header data for CV
 * Extracted from Header component for better maintainability
 * File: src/data/header.js
 */

const headerData = {
    fullName: "Oriol Macias",
    jobTitle: "Software Developer",
    summary: "Solutions-driven Backend Developer specializing in industrial protocol integration (SNMP, MODBUS, BACnet) with 8+ years of delivering high-performance applications. Known for transforming complex requirements into elegant code architecture and reducing system response times by up to 45%. Currently expanding expertise in AI and machine learning to drive next-generation automation solutions.",
    contactInfo: [
        {
            type: "email",
            label: "Email",
            value: "oriolomb@gmail.com",
            icon: "fas fa-envelope",
        },
        {
            type: "linkedin",
            label: "LinkedIn",
            value: "oriolmaciasbadosa",
            url: "https://linkedin.com/in/oriolmaciasbadosa",
            icon: "fab fa-linkedin",
        },
        {
            type: "github",
            label: "GitHub",
            value: "MaciWP",
            url: "https://github.com/MaciWP",
            icon: "fab fa-github",
        }
    ],
    photoUrl: "/images/oriol_macias.jpg",
    photoAlt: "Oriol Macias - Software Developer"
};

export default headerData;