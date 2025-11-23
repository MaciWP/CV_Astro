/**
 * Education component with reliable scroll animations
 * File: src/components/cv/Education.jsx
 */
import React, { useEffect, useState } from 'react';
import { getCurrentLanguageEducation } from '../../data/education';
import ScrollAnimationWrapper from '../ScrollAnimationWrapper';

const Education = () => {
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
        // Initial load of translations and data
        loadTranslations();

        // Listen for language changes
        const handleLanguageChanged = () => {
            loadTranslations();
        };

        document.addEventListener('languageChanged', handleLanguageChanged);
        document.addEventListener('translationsLoaded', handleLanguageChanged);

        return () => {
            document.removeEventListener('languageChanged', handleLanguageChanged);
            document.removeEventListener('translationsLoaded', handleLanguageChanged);
        };
    }, []);

    return (
        <section id="education">
            <ScrollAnimationWrapper className="flex items-center mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-graduation-cap"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3" data-i18n="education.title">{translations.title}</h2>
            </ScrollAnimationWrapper>

            <div className="space-y-6">
                {educationItems.map((item, index) => (
                    <ScrollAnimationWrapper
                        key={index}
                        className="group bg-light-surface dark:bg-dark-surface p-5 border-l-4 border-brand-red 
                                    border-t border-r border-b border-t-light-border border-r-light-border border-b-light-border 
                                    dark:border-t-dark-border dark:border-r-dark-border dark:border-b-dark-border 
                                    rounded-none shadow-sm hover:shadow-md transition-all duration-700 transform 
                                    hover:translate-x-1 hover:border-l-8"
                        delay={`${index * 100}ms`}
                        animationClass="animate-fade-left"
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
                    </ScrollAnimationWrapper>
                ))}
            </div>
        </section>
    );
};

export default Education;