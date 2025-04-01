/**
 * Education component with animations similar to Experience
 * File: src/components/cv/Education.jsx
 */
import React, { useEffect, useState } from 'react';
import { getCurrentLanguageEducation } from '../../data/education';

const Education = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedItems, setAnimatedItems] = useState([]);
    const [educationItems, setEducationItems] = useState([]);
    const [translations, setTranslations] = useState({
        title: 'Education & Certifications',
        institution: 'Institution',
        period: 'Period',
        details: 'Details'
    });

    // Function to safely get translations
    const getTranslation = (key, defaultValue) => {
        if (typeof window !== 'undefined' && typeof window.t === 'function') {
            return window.t(key) || defaultValue;
        }
        return defaultValue;
    };

    // Load translations
    const loadTranslations = () => {
        setTranslations({
            title: getTranslation('education.title', 'Education & Certifications'),
            institution: getTranslation('education.institution', 'Institution'),
            period: getTranslation('education.period', 'Period'),
            details: getTranslation('education.details', 'Details')
        });

        // Also load education items in current language
        const items = getCurrentLanguageEducation();
        setEducationItems(items);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);

                    // Load education items in current language
                    const items = getCurrentLanguageEducation();
                    setEducationItems(items);

                    // Start staggered animation sequence for education items
                    items.forEach((_, index) => {
                        setTimeout(() => {
                            setAnimatedItems(prev => [...prev, index]);
                        }, 500 + (index * 200)); // Slower animation similar to Experience
                    });

                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('education');
        if (element) {
            observer.observe(element);
        }

        // Initial load of translations and data
        loadTranslations();

        // Listen for language changes
        const handleLanguageChanged = () => {
            loadTranslations();
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
        <section id="education">
            <div
                className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-graduation-cap"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3" data-i18n="education.title">{translations.title}</h2>
            </div>

            <div className="space-y-6">
                {educationItems.map((item, index) => {
                    const isItemAnimated = animatedItems.includes(index);

                    return (
                        <div
                            key={index}
                            className={`group bg-light-surface dark:bg-dark-surface p-5 border-l-4 border-brand-red 
                                     border-t border-r border-b border-t-light-border border-r-light-border border-b-light-border 
                                     dark:border-t-dark-border dark:border-r-dark-border dark:border-b-dark-border 
                                     rounded-none shadow-sm hover:shadow-md transition-all duration-700 transform 
                                     ${isItemAnimated ? 'translate-x-0 opacity-100' : 'translate-x-[-20px] opacity-0'} 
                                     hover:translate-x-1 hover:border-l-8`}
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-brand-red transition-colors duration-300">{item.title}</h3>
                                    <p className="text-light-text-secondary dark:text-dark-text-secondary italic mb-2">{item.institution}</p>
                                </div>
                                <div className="inline-flex items-center px-3 py-1 text-xs text-light-text-secondary dark:text-dark-text-secondary bg-light-secondary dark:bg-dark-secondary rounded-none group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
                                    <i className="fas fa-calendar-alt mr-2" aria-hidden="true"></i>
                                    {item.period}
                                </div>
                            </div>
                            <p className="text-sm">{item.details}</p>

                            {/* Indicator line with smoother animation */}
                            <div className="w-0 h-0.5 bg-brand-red mt-3 transition-all duration-300 group-hover:w-full"></div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Education;