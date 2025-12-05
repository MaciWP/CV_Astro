/**
 * Unified icon system for technologies and UI
 * Replaces techIcons.js and consolidates scattered icon references from other files
 *
 * File: src/data/icons.js
 */

// Mapping of technology names to Font Awesome icons
export const techIcons = {
    // Programming languages
    'Python': 'fab fa-python',
    'JavaScript': 'fab fa-js',
    'TypeScript': 'fab fa-js',
    'Java': 'fab fa-java',
    'C#': 'fab fa-microsoft',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'XML': 'fas fa-file-code',
    'JSON': 'fas fa-file-code',

    // Frameworks and libraries
    'React': 'fab fa-react',
    'Angular': 'fab fa-angular',
    'Vue.js': 'fab fa-vuejs',
    'Node.js': 'fab fa-node-js',
    'Django': 'fas fa-cubes',
    'FastAPI': 'fas fa-bolt',
    'Flask': 'fas fa-flask',
    'Astro': 'fas fa-rocket',
    'Tailwind CSS': 'fab fa-css3-alt',
    'Bootstrap': 'fab fa-bootstrap',
    '.NET': 'fab fa-windows',
    'Express': 'fab fa-node-js',
    'Pytest': 'fas fa-vial',
    'SQLAlchemy': 'fas fa-database',
    'Alembic': 'fas fa-code-branch',
    'Celery': 'fas fa-tasks',
    'WPF': 'fas fa-desktop',
    'Pandas': 'fas fa-table',
    'NumPy': 'fas fa-calculator',
    'Kivy': 'fas fa-mobile-alt',
    'ONNX': 'fas fa-brain',
    'Black': 'fas fa-check',
    'Flake8': 'fas fa-ruler',
    'Mypy': 'fas fa-check-circle',

    // Technologies and databases
    'Docker': 'fab fa-docker',
    'Kubernetes': 'fab fa-dharmachakra',
    'AWS': 'fab fa-aws',
    'Azure': 'fab fa-microsoft',
    'Google Cloud': 'fab fa-google',
    'PostgreSQL': 'fas fa-database',
    'MySQL': 'fas fa-database',
    'MongoDB': 'fas fa-database',
    'Redis': 'fas fa-server',
    'GraphQL': 'fas fa-project-diagram',
    'REST API': 'fas fa-exchange-alt',
    'SOAP API': 'fas fa-envelope-open-text',
    'Git': 'fab fa-git-alt',
    'GitHub': 'fab fa-github',
    'GitLab': 'fab fa-gitlab',
    'CI/CD': 'fas fa-sync-alt',
    'GitHub Actions': 'fab fa-github',
    'JWT': 'fas fa-key',
    'VMware': 'fab fa-vmware',
    'Linux': 'fab fa-linux',
    'Windows': 'fab fa-windows',
    'NFC': 'fas fa-wifi',
    'S3': 'fab fa-aws',
    'PWA': 'fas fa-globe',
    'i18n': 'fas fa-language',

    // Protocols
    'SNMP': 'fas fa-network-wired',
    'Modbus': 'fas fa-plug',
    'BACnet': 'fas fa-building',
    'HTTP': 'fas fa-exchange-alt',
    'WebSockets': 'fas fa-plug',

    // Tools
    'VS Code': 'fas fa-code',
    'Visual Studio': 'fas fa-tv',
    'PyCharm': 'fas fa-edit',
    'Postman': 'fas fa-paper-plane',
    'Curl': 'fas fa-terminal',
    'npm': 'fab fa-npm',
    'yarn': 'fab fa-yarn',
    'Webpack': 'fas fa-box',
    'Babel': 'fas fa-box',
    'ESLint': 'fas fa-check-square',
    'Prettier': 'fas fa-paint-brush',
    'Cursor': 'fas fa-i-cursor',
    'Bruno': 'fas fa-cube',
    'MiBrowser': 'fas fa-search',
    'Modscan': 'fas fa-network-wired',
    'ITA': 'fas fa-server',
    'DCE': 'fas fa-cogs',
    'PowerIQ': 'fas fa-bolt',
    'iTRACS': 'fas fa-map-marked',
    'HPE IMC': 'fas fa-network-wired',
    'Gunicorn': 'fas fa-server',
    'Nginx': 'fas fa-server',

    // Default value
    'default': 'fas fa-code'
};

// Icons for UI sections
export const sectionIcons = {
    'about': 'fas fa-user',
    'experience': 'fas fa-briefcase',
    'skills': 'fas fa-code',
    'education': 'fas fa-graduation-cap',
    'languages': 'fas fa-language',
    'projects': 'fas fa-project-diagram',
    'contact': 'fas fa-envelope',
    'resume': 'fas fa-file-alt',
    'portfolio': 'fas fa-th',
    'blog': 'fas fa-pen',
    'home': 'fas fa-home',
    'default': 'fas fa-star'
};

// Icons for social networks
export const socialIcons = {
    'github': 'fab fa-github',
    'linkedin': 'fab fa-linkedin',
    'twitter': 'fab fa-twitter',
    'facebook': 'fab fa-facebook',
    'instagram': 'fab fa-instagram',
    'youtube': 'fab fa-youtube',
    'twitch': 'fab fa-twitch',
    'discord': 'fab fa-discord',
    'telegram': 'fab fa-telegram',
    'medium': 'fab fa-medium',
    'dev': 'fab fa-dev',
    'stackoverflow': 'fab fa-stack-overflow',
    'email': 'fas fa-envelope',
    'phone': 'fas fa-phone',
    'whatsapp': 'fab fa-whatsapp',
    'skype': 'fab fa-skype',
    'default': 'fas fa-link'
};

// Icons for UI/UX
export const uiIcons = {
    'download': 'fas fa-download',
    'upload': 'fas fa-upload',
    'search': 'fas fa-search',
    'filter': 'fas fa-filter',
    'sort': 'fas fa-sort',
    'edit': 'fas fa-edit',
    'delete': 'fas fa-trash',
    'add': 'fas fa-plus',
    'remove': 'fas fa-minus',
    'close': 'fas fa-times',
    'check': 'fas fa-check',
    'settings': 'fas fa-cog',
    'menu': 'fas fa-bars',
    'user': 'fas fa-user',
    'lock': 'fas fa-lock',
    'unlock': 'fas fa-unlock',
    'calendar': 'fas fa-calendar-alt',
    'clock': 'fas fa-clock',
    'info': 'fas fa-info-circle',
    'warning': 'fas fa-exclamation-triangle',
    'error': 'fas fa-exclamation-circle',
    'success': 'fas fa-check-circle',
    'question': 'fas fa-question-circle',
    'help': 'fas fa-question-circle',
    'refresh': 'fas fa-sync',
    'link': 'fas fa-link',
    'external-link': 'fas fa-external-link-alt',
    'copy': 'fas fa-copy',
    'paste': 'fas fa-paste',
    'print': 'fas fa-print',
    'save': 'fas fa-save',
    'share': 'fas fa-share-alt',
    'arrow-up': 'fas fa-arrow-up',
    'arrow-down': 'fas fa-arrow-down',
    'arrow-left': 'fas fa-arrow-left',
    'arrow-right': 'fas fa-arrow-right',
    'chevron-up': 'fas fa-chevron-up',
    'chevron-down': 'fas fa-chevron-down',
    'chevron-left': 'fas fa-chevron-left',
    'chevron-right': 'fas fa-chevron-right',
    'sun': 'fas fa-sun',
    'moon': 'fas fa-moon',
    'theme': 'fas fa-adjust',
    'default': 'fas fa-circle'
};

/**
 * Get the icon for a specific technology
 * @param {string} techName - Technology name
 * @returns {string} - Font Awesome icon class
 */
export const getTechIcon = (techName) => {
    return techIcons[techName] || techIcons.default;
};

/**
 * Get the icon for a specific section
 * @param {string} sectionName - Section name
 * @returns {string} - Font Awesome icon class
 */
export const getSectionIcon = (sectionName) => {
    return sectionIcons[sectionName] || sectionIcons.default;
};

/**
 * Get the icon for a specific social network
 * @param {string} socialName - Social network name
 * @returns {string} - Font Awesome icon class
 */
export const getSocialIcon = (socialName) => {
    return socialIcons[socialName] || socialIcons.default;
};

/**
 * Get the icon for a specific UI element
 * @param {string} uiElement - UI element name
 * @returns {string} - Font Awesome icon class
 */
export const getUIIcon = (uiElement) => {
    return uiIcons[uiElement] || uiIcons.default;
};

// Default export for compatibility with existing code
export default {
    techIcons,
    sectionIcons,
    socialIcons,
    uiIcons,
    getTechIcon,
    getSectionIcon,
    getSocialIcon,
    getUIIcon
};
