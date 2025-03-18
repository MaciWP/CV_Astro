import React, { useEffect, useState } from 'react';

const Languages = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
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

    const languages = [
        {
            language: "Spanish",
            level: "Native",
            badge: "NATIVE",
            percent: 100
        },
        {
            language: "Catalan",
            level: "Native",
            badge: "NATIVE",
            percent: 100
        },
        {
            language: "English",
            level: "Intermediate",
            badge: "B1",
            percent: 60
        }
    ];

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
                {languages.map((lang, index) => (
                    <div
                        key={index}
                        className={`group bg-light-surface dark:bg-dark-surface rounded-none p-4 border border-light-border dark:border-dark-border transition-all duration-500 transform hover:-translate-y-1 hover:shadow-md ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${200 * index}ms` }}
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
                            <div className="h-1.5 bg-light-secondary dark:bg-dark-secondary rounded-none overflow-hidden">
                                <div
                                    className={`h-full bg-brand-red transition-all duration-1000 ease-out ${isVisible ? '' : 'w-0'}`}
                                    style={{
                                        width: isVisible ? `${lang.percent}%` : '0%',
                                        transitionDelay: `${300 * index}ms`
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Eliminamos la línea que aparecía en el hover */}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Languages;