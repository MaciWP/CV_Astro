import React, { useState, useEffect } from 'react';
import ResponsiveImage from '../ResponsiveImage';

/**
 * Enhanced Header component with better photo sizing and improved contact section
 */
const Header = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Set a small delay to ensure DOM is ready before animation starts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="about" className="pt-4 pb-8">
            {/* Grid layout with simpler animation */}
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* Personal information - takes more space on medium screens */}
                <div className="md:col-span-8 space-y-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">Oriol Macias</h1>
                        <h2 className="text-xl md:text-2xl text-brand-red dark:text-brand-red font-medium">
                            Software Developer
                        </h2>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg max-w-2xl">
                        Solutions-driven Backend Developer specializing in industrial protocol integration (SNMP, MODBUS, BACKnet)
                        with 8+ years of delivering high-performance applications. Known for transforming complex requirements
                        into elegant code architecture and reducing system response times by up to 45%. Currently expanding expertise
                        in AI and machine learning to drive next-generation automation solutions.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2">
                        {/* Email */}
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
                            <a href="mailto:oriolomb@gmail.com" className="flex items-center gap-2 hover:text-brand-red dark:hover:text-brand-red transition-colors">
                                <div className="w-10 h-10 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <span className="text-xs block text-light-text-secondary dark:text-dark-text-secondary">Email</span>
                                    oriolomb@gmail.com
                                </div>
                            </a>
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
                            <a href="https://linkedin.com/in/oriolmaciasbadosa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-red dark:hover:text-brand-red transition-colors">
                                <div className="w-10 h-10 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                                    <i className="fab fa-linkedin"></i>
                                </div>
                                <div>
                                    <span className="text-xs block text-light-text-secondary dark:text-dark-text-secondary">LinkedIn</span>
                                    oriolmaciasbadosa
                                </div>
                            </a>
                        </div>

                        {/* GitHub */}
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
                            <a href="https://github.com/MaciWP" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-red dark:hover:text-brand-red transition-colors">
                                <div className="w-10 h-10 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                                    <i className="fab fa-github"></i>
                                </div>
                                <div>
                                    <span className="text-xs block text-light-text-secondary dark:text-dark-text-secondary">GitHub</span>
                                    MaciWP
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Professional photo - enlarged and maximized within container */}
                <div className="md:col-span-4 flex justify-center md:justify-end">
                    <div className="relative w-100 h-100 md:w-100 md:h-100 overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-all duration-700">
                        {/* Grey border for structure */}
                        <div className="absolute inset-0 border border-gray-200 dark:border-gray-700"></div>

                        {/* Professional photo with proper sizing to fill container */}
                        <div className="w-full h-full bg-white dark:bg-gray-800">
                            <ResponsiveImage
                                src="/images/oriol_macias.jpg"
                                alt="Oriol Macias - Software Developer"
                                className="w-full h-full object-cover"
                                width={400}
                                height={400}
                                loading="eager"
                                fetchpriority="high"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML += '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800"><i class="fas fa-user text-4xl text-gray-400 dark:text-gray-500"></i></div>';
                                }}
                            />
                        </div>

                        {/* Red accent on the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-red"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;