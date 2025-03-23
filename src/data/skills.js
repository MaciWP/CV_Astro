/**
 * Skills data for CV
 * Extracted from Skills component for better maintainability
 * File: src/data/skills.js
 */

// Mapping of technology names to appropriate Font Awesome icons
export const techIcons = {
    'Astro': 'fas fa-rocket',
    'React': 'fab fa-react',
    'Tailwind CSS': 'fab fa-css3-alt',
    'Python': 'fab fa-python',
    'Django': 'fas fa-cubes',
    'FastAPI': 'fas fa-bolt',
    'PostgreSQL': 'fas fa-database',
    'REST API': 'fas fa-exchange-alt',
    'Celery': 'fas fa-tasks',
    'Redis': 'fas fa-server',
    'SNMP': 'fas fa-network-wired',
    'Kivy': 'fas fa-mobile-alt',
    'ONNX': 'fas fa-brain',
    'NumPy': 'fas fa-calculator',
    'PWA': 'fas fa-globe',
    'i18n': 'fas fa-language',
    'C#': 'fab fa-microsoft',
    '.NET': 'fab fa-windows',
    'Docker': 'fab fa-docker',
    'AWS': 'fab fa-aws',
    'GitHub Actions': 'fab fa-github',
    'WPF': 'fas fa-desktop',
    'Windows Services': 'fab fa-windows',
    'XML': 'fas fa-file-code',
    'JSON': 'fas fa-file-code',
    'NFC': 'fas fa-wifi',
    'JWT': 'fas fa-key',
    'S3': 'fab fa-aws',
    'SQLAlchemy': 'fas fa-database',
    'Alembic': 'fas fa-code-branch',
    'PyVmomi': 'fab fa-vmware',
    // Default icon for any unlisted technology
    'default': 'fas fa-code'
};

const skillsData = {
    // Programming Languages
    languages: [
        { name: "C#", icon: "fab fa-microsoft" },
        { name: "Python", icon: "fab fa-python" },
        { name: "Java", icon: "fab fa-java" },
        { name: ".NET", icon: "fab fa-windows" },
        { name: "JavaScript", icon: "fab fa-js" },
        { name: "HTML", icon: "fab fa-html5" },
        { name: "XML", icon: "fas fa-file-code" },
        { name: "JSON", icon: "fas fa-file-code" },
    ],

    // Libraries and Frameworks
    libraries: [
        { name: "Django", icon: "fas fa-cubes" },
        { name: "FastAPI", icon: "fas fa-bolt" },
        { name: "Flask", icon: "fas fa-flask" },
        { name: "React", icon: "fab fa-react" },
        { name: "Astro", icon: "fas fa-rocket" },
        { name: "Tailwind CSS", icon: "fab fa-css3-alt" },
        { name: "Pytest", icon: "fas fa-vial" },
        { name: "SQLAlchemy", icon: "fas fa-database" },
        { name: "Alembic", icon: "fas fa-code-branch" },
        { name: "Celery", icon: "fas fa-tasks" },
        { name: "WPF", icon: "fas fa-desktop" },
        { name: "Pandas", icon: "fas fa-table" },
        { name: "Kivy", icon: "fas fa-mobile-alt" },
        { name: "Black", icon: "fas fa-check" },
        { name: "Flake8", icon: "fas fa-ruler" },
        { name: "Mypy", icon: "fas fa-check-circle" },
    ],

    // Technologies and Databases
    technologies: [
        { name: "Docker", icon: "fab fa-docker" },
        { name: "GitHub", icon: "fab fa-github" },
        { name: "AWS", icon: "fab fa-aws" },
        { name: "PostgreSQL", icon: "fas fa-database" },
        { name: "MySQL", icon: "fas fa-database" },
        { name: "Redis", icon: "fas fa-server" },
        { name: "Git", icon: "fab fa-git-alt" },
        { name: "CI/CD", icon: "fas fa-sync-alt" },
        { name: "GitHub Actions", icon: "fab fa-github" },
        { name: "REST API", icon: "fas fa-exchange-alt" },
        { name: "SOAP API", icon: "fas fa-envelope-open-text" },
        { name: "JWT", icon: "fas fa-key" },
        { name: "VMware", icon: "fab fa-vmware" },
        { name: "NFC", icon: "fas fa-wifi" },
    ],

    // Tools and Applications
    tools: [
        { name: "PyCharm", icon: "fas fa-edit" },
        { name: "Visual Studio", icon: "fas fa-tv" },
        { name: "VS Code", icon: "fas fa-code" },
        { name: "Cursor", icon: "fas fa-i-cursor" },
        { name: "Postman", icon: "fas fa-paper-plane" },
        { name: "Bruno", icon: "fas fa-cube" },
        { name: "MiBrowser", icon: "fas fa-search" },
        { name: "Modscan", icon: "fas fa-network-wired" },
        { name: "ITA", icon: "fas fa-server" },
        { name: "DCE", icon: "fas fa-cogs" },
        { name: "PowerIQ", icon: "fas fa-bolt" },
        { name: "iTRACS", icon: "fas fa-map-marked" },
        { name: "HPE IMC", icon: "fas fa-network-wired" },
        { name: "Gunicorn", icon: "fas fa-server" },
        { name: "Nginx", icon: "fas fa-server" },
    ],

    // Protocols
    protocols: [
        { name: "SNMP", icon: "fas fa-exchange-alt" },
        { name: "MODBUS", icon: "fas fa-plug" },
        { name: "BACnet", icon: "fas fa-building" },
    ],
};

export default skillsData;