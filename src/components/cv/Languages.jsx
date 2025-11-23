/**
 * Languages component with animations and multilingual support
 * File: src/components/cv/Languages.jsx
 */
import React, { useEffect, useState } from 'react';
import { getCurrentLanguageLanguages } from '../../data/languages';
import ScrollAnimationWrapper from '../ScrollAnimationWrapper';

const Languages = () => {
    const [languagesData, setLanguagesData] = useState([]);
    const [title, setTitle] = useState('Languages');

    useEffect(() => {
        // Initial load of languages data
        setLanguagesData(getCurrentLanguageLanguages());

        // Update title based on current language
        if (typeof window !== 'undefined' && typeof window.t === 'function') {
            setTitle(window.t('languages.title') || 'Languages');
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
            document.removeEventListener('languageChanged', handleLanguageChanged);
            document.removeEventListener('translationsLoaded', handleLanguageChanged);
        };
    }, []);

    return (
        <section id="languages" className="mb-16">
            <ScrollAnimationWrapper className="flex items-center mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-language"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3" data-i18n="languages.title">{title}</h2>
            </ScrollAnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {languagesData.map((lang, index) => (
                    <ScrollAnimationWrapper
                        key={index}
                        className="group bg-light-surface dark:bg-dark-surface rounded-none p-4 border border-light-border dark:border-dark-border transition-all duration-700 transform hover:-translate-y-1 hover:shadow-md"
                        delay={`${index * 100}ms`}
                        animationClass="animate-scale"
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

                            {/* Progress bar with CSS animation */}
                            <div className="h-1.5 bg-light-secondary dark:bg-dark-secondary rounded-none overflow-hidden">
                                <ScrollAnimationWrapper
                                    className="h-full bg-brand-red"
                                    animationClass="animate-width"
                                    style={{
                                        width: `${lang.percent}%`,
                                        '--target-width': `${lang.percent}%`
                                    }}
                                >
                                    <div style={{ width: '100%', height: '100%' }}></div>
                                </ScrollAnimationWrapper>
                            </div>
                        </div>
                    </ScrollAnimationWrapper>
                ))}
            </div>
        </section>
    );
};

export default Languages;