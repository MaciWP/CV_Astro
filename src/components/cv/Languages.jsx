/**
 * Languages component with animations and multilingual support
 * File: src/components/cv/Languages.jsx
 */
import React, { useEffect, useState, useRef } from 'react';
import { getCurrentLanguageLanguages } from '../../data/languages';

const Languages = () => {
    const [languagesData, setLanguagesData] = useState([]);
    const [title, setTitle] = useState('Languages');
    const [isVisible, setIsVisible] = useState(false);
    const [animateProgress, setAnimateProgress] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        // Initial load of languages data
        setLanguagesData(getCurrentLanguageLanguages());

        // Update title based on current language
        if (typeof window !== 'undefined' && typeof window.t === 'function') {
            setTitle(window.t('languages.title') || 'Languages');
        }

        // IntersectionObserver for visibility
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Delay progress bar animation slightly for visual effect
                    setTimeout(() => setAnimateProgress(true), 150);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        // Listen for language changes
        const handleLanguageChanged = () => {
            const newLanguages = getCurrentLanguageLanguages();
            setLanguagesData(newLanguages);

            // Update title
            if (typeof window !== 'undefined' && typeof window.t === 'function') {
                setTitle(window.t('languages.title') || 'Languages');
            }
        };

        document.addEventListener('languageChanged', handleLanguageChanged);
        document.addEventListener('translationsLoaded', handleLanguageChanged);

        return () => {
            observer.disconnect();
            document.removeEventListener('languageChanged', handleLanguageChanged);
            document.removeEventListener('translationsLoaded', handleLanguageChanged);
        };
    }, []);

    return (
        <section id="languages" className="mt-16 mb-16" ref={sectionRef}>
            <div className={`flex items-center mb-6 transition-opacity duration-[400ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-language"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3" data-i18n="languages.title">{title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {languagesData.map((lang, index) => (
                    <div
                        key={index}
                        className={`group bg-light-surface dark:bg-dark-surface rounded-none p-4 border border-light-border dark:border-dark-border hover:border-brand-red/50 hover:shadow-md hover:-translate-y-0.5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{
                            transitionDelay: `${index * 80}ms`,
                            transition: 'background-color 100ms ease-out, border-color 100ms ease-out, box-shadow 150ms ease-out, opacity 200ms ease-out, transform 200ms ease-out'
                        }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-medium text-lg group-hover:text-brand-red transition-colors duration-150">{lang.language}</span>
                            <span className="px-2 py-0.5 rounded-none text-xs font-semibold bg-brand-red text-white">
                                {lang.badge}
                            </span>
                        </div>

                        <div className="mt-2 space-y-2">
                            <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">
                                {lang.level}
                            </div>

                            {/* Progress bar with smooth animation */}
                            <div className="h-1.5 bg-light-secondary dark:bg-dark-secondary rounded-none overflow-hidden">
                                <div
                                    className="h-full bg-brand-red transition-all duration-500 ease-out"
                                    style={{
                                        width: animateProgress ? `${lang.percent}%` : '0%',
                                        transitionDelay: `${index * 100 + 100}ms`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Languages;