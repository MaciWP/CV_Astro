import React, { useEffect, useState } from 'react';

const Experience = () => {
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

        const element = document.getElementById('experience');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    const experiences = [
        {
            title: "Software Developer",
            company: "Schneider Electric",
            period: "Jan 2020 - Present", // Formato de fecha más específico según estándares suizos
            responsibilities: [
                "Design, development, and maintenance of integration software",
                "Requirements gathering and implementation",
                "Improved application performance by 30% through code optimization",
                "Collaborated with cross-functional teams to deliver high-quality software solutions"
            ]
        },
        {
            title: "Trainee Mentor",
            company: "Bjumper Madrid",
            period: "Mar 2019 - Dec 2020", // Fechas más específicas
            responsibilities: [
                "Mentored junior developers and trainees",
                "Developed training materials and conducted technical workshops",
                "Provided code reviews and technical guidance"
            ]
        },
        {
            title: "Android Developer",
            company: "Freelance",
            period: "Jun 2016 - Feb 2018", // Fechas más específicas
            responsibilities: [
                "Developed mobile applications for Android platform",
                "Managed database integration and API connections",
                "Implemented responsive UI designs and user-friendly interfaces"
            ]
        }
    ];

    return (
        <section id="experience" className="scroll-mt-20 mb-16">
            <div
                className={`flex items-center gap-4 mb-10 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="h-10 w-10 bg-brand-red dark:bg-brand-red rounded-none flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
            </div>

            <div className="relative pl-5 md:pl-8">
                {/* Línea de tiempo perfectamente alineada con los nodos */}
                <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 transition-colors duration-300"></div>

                {experiences.map((job, index) => (
                    <div
                        key={index}
                        className={`relative pl-8 pb-12 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:translate-x-2`}
                        style={{ transitionDelay: `${200 * index}ms` }}
                    >
                        {/* Nodo de la línea de tiempo perfectamente alineado */}
                        <div
                            className={`absolute left-0 top-4 w-4 h-4 bg-brand-red dark:bg-brand-red border-4 border-white dark:border-gray-900 shadow-sm transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                            style={{ opacity: isVisible ? (1 - (index * 0.15)) : 0 }}
                        ></div>

                        {/* Header del trabajo */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 group">
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-brand-red transition-colors duration-300">{job.title}</h3>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary transition-colors duration-300">{job.company}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary bg-light-secondary dark:bg-dark-secondary px-3 py-1 rounded-none transition-all duration-300 group-hover:bg-brand-red group-hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{job.period}</span>
                            </div>
                        </div>

                        {/* Descripción del trabajo con efecto hover */}
                        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-none border border-light-border dark:border-dark-border group hover:border-brand-red/30 dark:hover:border-brand-red/30 transition-all duration-300 hover:shadow-md">
                            <ul className="space-y-3 text-light-text dark:text-dark-text transition-colors duration-300">
                                {job.responsibilities.map((responsibility, i) => (
                                    <li key={i} className="flex items-start gap-2 group/item hover:translate-x-1 transition-all duration-300">
                                        <span className="text-brand-red dark:text-brand-red font-bold mt-1 transition-all duration-300 group-hover/item:scale-110">•</span>
                                        <span>{responsibility}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Indicador de hover al fondo del card */}
                            <div className="w-0 h-0.5 bg-brand-red mt-4 transition-all duration-300 group-hover:w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;