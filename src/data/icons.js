/**
 * Technology → Font Awesome icon mapping.
 * File: src/data/icons.js
 */

const techIcons = {
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

export const getTechIcon = (techName) => techIcons[techName] || techIcons.default;
