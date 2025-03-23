/**
 * Common tech icons mapping for consistent usage across components
 * File: src/data/techIcons.js
 */

// Mapping of technology names to appropriate Font Awesome icons
const techIcons = {
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

/**
 * Get the appropriate icon for a technology
 * @param {string} techName - The name of the technology
 * @returns {string} - The Font Awesome icon class
 */
export const getTechIcon = (techName) => {
    return techIcons[techName] || techIcons.default;
};

export default techIcons;