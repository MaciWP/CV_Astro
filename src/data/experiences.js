/**
 * Work experience data
 * Extracted from Experience component for better maintainability
 */
const experiences = [
    {
        id: "bjumper",
        title: "Senior Backend Developer",
        company: "Bjumper",
        companyUrl: "https://www.bjumper.com/",
        period: "2018 - Present",
        keyResponsibilities: [
            "Design, development, and maintenance of integration solutions between industrial protocols (SNMP, MODBUS, BACnet, etc.) or external applications (PowerIQ, HPE IMC, Invision, VMware, etc.) and DCIM platforms (iTRACS, ITA, DCE, etc.)",
            "Development of scalable, agnostic microservices for data extraction, transformation, and loading (ETL) using REST APIs",
            "Participated in 8+ operational projects using agile methodologies (Kanban, Scrum)",
            "Used C#, Python, JavaScript, .NET (Framework & Core), Django, and Django REST Framework",
            "Worked with PostgreSQL, Docker, GitHub, AWS for database and DevOps operations"
        ],
        extraResponsibilities: [
        ],
        achievements: [
            "Independently developed an SNMP monitoring tool with an autodiscovery method that reduced discovery time by 80%",
            "Created an application to generate DDF configuration files using MIBs and SNMP walks, reducing development time by 90%",
            "Led the development of several core systems used by major enterprise clients"
        ]
    },
    {
        id: "busmatick",
        title: "Junior Developer (Android/C#)",
        company: "Busmatick",
        companyUrl: "https://www.busmatick.com/",
        period: "2018",
        keyResponsibilities: [
            "Developed mobile applications for Android and desktop applications for Windows focused on public transport card management",
            "Built a SOAP API to manage the backend for both applications",
            "Implemented NFC technology for MIFARE Classic 1K card operations"
        ],
        extraResponsibilities: [],
        achievements: [
            "Successfully implemented the complete RDR application for public transport cards",
            "Created a secure system for handling encrypted sensitive card operations",
            "Developed Bluetooth printing functionality for transaction receipts"
        ]
    },
    {
        id: "seres",
        title: "Support Technician",
        company: "SERES",
        companyUrl: "https://www.groupseres.com/",
        period: "2017",
        keyResponsibilities: [
            "Provided bilingual customer support for electronic invoicing in EDI, XML, and proprietary formats",
            "Assisted clients in troubleshooting invoicing and data exchange issues",
            "Developed small internal applications to streamline invoice processing workflows"
        ],
        extraResponsibilities: [],
        achievements: [
            "Helped improve overall client satisfaction with faster and more accurate issue resolution"
        ]
    },
    {
        id: "educand",
        title: "IT Technician",
        company: "Educand SCCL",
        companyUrl: "https://iesnx.xtec.cat/",
        period: "2015 - 2017",
        keyResponsibilities: [
            "Installed, configured, and maintained computer equipment and network infrastructure",
            "Mentored an intern and guided practical IT training"
        ],
        extraResponsibilities: [],
        achievements: [
            "Increased operational efficiency by implementing structured maintenance schedules"
        ]
    },
    {
        id: "saltcity",
        title: "Development Intern",
        company: "Salt City Council",
        companyUrl: "https://www.viladesalt.cat/",
        period: "2014 - 2015",
        keyResponsibilities: [
            "Developed a database management application for the local police using WPF and C#"
        ],
        extraResponsibilities: [],
        achievements: [
            "Successfully delivered a comprehensive database management system for the local police department",
            "Completed tasks as part of a Superior Degree professional internship program"
        ]
    }
];

export default experiences;