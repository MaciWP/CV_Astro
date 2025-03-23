import React, { useEffect, useState } from 'react';
import languagesData from '../../data/languages';

/**
 * Languages component with animations similar to Experience
 * (Removed percentages and adjusted animation speed)
 */
const Languages = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progressAnimation, setProgressAnimation] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);

                    // Start progress bar animations with natural staggering
                    languagesData.forEach((lang, index) => {
                        setTimeout(() => {
                            setProgressAnimation(prev => ({
                                ...prev,
                                [lang.language]: true
                            }));
                        }, 500 + (index * 250)); // Slower, similar to Experience
                    });

                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('languages');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="languages" className="mb-16">
            <div
                className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-language"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Languages</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {languagesData.map((lang, index) => (
                    <div
                        key={index}
                        className={`group bg-light-surface dark:bg-dark-surface rounded-none p-4 border border-light-border dark:border-dark-border transition-all duration-700 transform hover:-translate-y-1 hover:shadow-md ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${300 * index}ms` }} // Slower, similar to Experience
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-medium text-lg">{lang.language}</span>
                            <span className="px-2 py-0.5 rounded-none text-xs font-semibold bg-brand-red text-white">
                                {lang.badge}
                            </span>
                        </div>

                        <div className="mt-2 space-y-2">
                            <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">
                                {lang.level}
                            </div>

                            {/* Progress bar with slower animation */}
                            <div className="h-1.5 bg-light-secondary dark:bg-dark-secondary rounded-none overflow-hidden">
                                <div
                                    className="h-full bg-brand-red"
                                    style={{
                                        width: progressAnimation[lang.language] ? `${lang.percent}%` : '0%',
                                        transition: 'width 1200ms cubic-bezier(0.25, 1, 0.5, 1)', // Slower animation
                                        transitionDelay: progressAnimation[lang.language] ? '100ms' : '0ms'
                                    }}
                                ></div>
                            </div>

                            {/* Removed percentage indicator */}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Languages;