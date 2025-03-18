import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-8 border-t border-light-border dark:border-dark-border bg-light-primary dark:bg-dark-primary transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo y copyright */}
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-brand-red rounded-none flex items-center justify-center">
                            <span className="text-white font-bold text-xs">OM</span>
                        </div>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            © {currentYear} Oriol Macias
                        </p>
                    </div>

                    {/* Navegación y botones alineados verticalmente */}
                    <div className="flex items-center gap-6">
                        <a
                            href="#top"
                            className="text-sm flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red dark:hover:text-brand-red transition-colors"
                        >
                            <i className="fas fa-arrow-up mr-2 text-xs"></i>
                            Back to top
                        </a>
                        <button
                            id="cv-download-button"
                            className="text-xs h-8 flex items-center px-3 py-1 border border-brand-red text-brand-red dark:text-brand-red hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition-colors duration-300"
                            onClick={() => {
                                window.print();
                            }}
                        >
                            <i className="fas fa-download mr-2"></i>
                            Download CV
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;