import React, { useState, useEffect } from 'react';
import summaryData from '../../data/summary';

const Summary = () => {
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

        const element = document.getElementById('summary');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="summary">
            <div
                className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none shadow-sm">
                    <i className="fas fa-file-alt"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Professional Summary</h2>
            </div>

            <div
                className={`bg-light-surface dark:bg-dark-surface p-5 border border-light-border dark:border-dark-border rounded-none shadow-sm transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: '200ms' }}
            >
                <p className="text-base leading-relaxed">
                    {summaryData.text}
                </p>

                <div className="flex flex-wrap gap-4 mt-5">
                    {summaryData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center group">
                            <div className="w-9 h-9 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                                <i className={highlight.icon}></i>
                            </div>
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">
                                {highlight.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Summary;