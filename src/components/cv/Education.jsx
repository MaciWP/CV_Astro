import React, { useEffect, useState } from 'react';

const Education = () => {
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

        const element = document.getElementById('education');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    const educationItems = [
        {
            title: "UNIR - FP Superior in Multiplatform Application Development",
            institution: "Universidad Internacional de La Rioja",
            period: "2024 - 2025",
            details: "Currently expanding knowledge in application development focusing on cross-platform solutions."
        },
        {
            title: "English Course B1-B2",
            institution: "IBOUX",
            period: "2024",
            details: "Improving English language skills for professional environments."
        },
        {
            title: "SP2 EcoStruxure IT Advanced Technical Certification",
            institution: "Schneider Electric",
            period: "2019",
            details: "Professional certification in advanced IT infrastructure management and monitoring systems."
        },
        {
            title: "Technical Degree in Multiplatform Application Development",
            institution: "IES Montilivi",
            period: "2015",
            details: "Specialized in web and mobile application development, database design, and software architecture."
        },
        {
            title: "Access Course to Higher Technical Education (CAS)",
            institution: "IES Santa Eugènia",
            period: "2013",
            details: "Preparatory course for higher technical education."
        },
        {
            title: "Microcomputer Systems and Networks",
            institution: "IES Salvador Espriu",
            period: "2012",
            details: "Medium-grade training in computer systems and networking."
        },
        {
            title: "Secondary Education (ESO)",
            institution: "IES Josep Brugulat",
            period: "2010",
            details: "Focus on technology and computer science."
        }
    ];

    return (
        <section id="education">
            <div
                className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-graduation-cap"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Education & Certifications</h2>
            </div>

            <div className="space-y-6">
                {educationItems.map((item, index) => (
                    <div
                        key={index}
                        className={`group bg-light-surface dark:bg-dark-surface p-5 border-l-4 border-brand-red border-t border-r border-b border-t-light-border border-r-light-border border-b-light-border dark:border-t-dark-border dark:border-r-dark-border dark:border-b-dark-border rounded-none shadow-sm hover:shadow-md transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-20px] opacity-0'} hover:translate-x-1 hover:border-l-8`}
                        style={{ transitionDelay: `${200 * index}ms` }}
                    >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-brand-red transition-colors duration-300">{item.title}</h3>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary italic mb-2">{item.institution}</p>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 text-xs text-light-text-secondary dark:text-dark-text-secondary bg-light-secondary dark:bg-dark-secondary rounded-none group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
                                <i className="far fa-calendar-alt mr-2"></i>
                                {item.period}
                            </div>
                        </div>
                        <p className="text-sm">{item.details}</p>

                        {/* Indicator de hover - aparece gradualmente */}
                        <div className="w-0 h-0.5 bg-brand-red mt-3 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Education;