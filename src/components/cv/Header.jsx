import React, { useState, useEffect } from 'react';

/**
 * Enhanced Header component with better photo integration and styling
 * This version adds a professional photo placeholder with improved styling
 */
const Header = () => {
    // We'll set initial state to false and control it more carefully
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
                        Experienced Software Developer with a strong background in application development,
                        problem-solving, and software design. Skilled in creating efficient solutions and
                        implementing technical requirements. Currently expanding knowledge in AI through
                        specialized training programs.
                    </p>

                    <div className="flex flex-wrap gap-6">
                        {/* Email */}
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
                            <div className="w-9 h-9 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <a href="mailto:oriolomb@gmail.com" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
                                oriolomb@gmail.com
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
                            <div className="w-9 h-9 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                                <i className="fas fa-phone"></i>
                            </div>
                            <a href="tel:+34689994909" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
                                +34 689 994 909
                            </a>
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
                            <div className="w-9 h-9 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                                <i className="fab fa-linkedin"></i>
                            </div>
                            <a href="https://linkedin.com/in/oriolmaciasbadosa" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red dark:hover:text-brand-red transition-colors">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                {/* Professional photo - properly sized and styled according to Swiss standards */}
                <div className="md:col-span-4 flex justify-center md:justify-end">
                    <div className="relative w-auto h-auto md:w-auto md:h-auto overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-all duration-700">
                        {/* Grey border for structure */}
                        <div className="absolute inset-0 border border-gray-200 dark:border-gray-700"></div>

                        {/* Professional photo with proper sizing and no distortion */}
                        <div className="w-full h-full bg-white dark:bg-gray-800">
                            <img
                                src="/images/oriol_macias.jpg"
                                alt="Oriol Macias"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML += '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800"><i class="fas fa-user text-4xl text-gray-400 dark:text-gray-500"></i></div>';
                                }}
                            />
                        </div>

                        {/* Red accent on the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-brand-red"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;