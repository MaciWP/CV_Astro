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
      title: "SP2 EcoStruxure IT Advanced Technical Certification",
      institution: "Schneider Electric",
      period: "2019",
      details: "Professional certification in advanced IT infrastructure management and monitoring systems."
    },
    {
      title: "Technical Degree in Software Development",
      institution: "IES Montilivi",
      period: "2016 - 2018",
      details: "Specialized in web and mobile application development, database design, and software architecture."
    },
    {
      title: "Secondary Education",
      institution: "IES Salvador Espriu",
      period: "2014 - 2016",
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
            className={`bg-light-surface dark:bg-dark-surface p-5 border-l-4 border-brand-red border-t border-r border-b border-light-border dark:border-dark-border rounded-none shadow-sm hover:shadow-md transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-20px] opacity-0'}`}
            style={{ transitionDelay: `${200 * index}ms` }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary italic mb-2">{item.institution}</p>
              </div>
              <div className="inline-flex items-center px-3 py-1 text-xs text-light-text-secondary dark:text-dark-text-secondary bg-light-secondary dark:bg-dark-secondary rounded-none">
                <i className="far fa-calendar-alt mr-2"></i>
                {item.period}
              </div>
            </div>
            <p className="text-sm">{item.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;