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
    
    observer.observe(document.getElementById('experience'));
    
    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      title: "Software Developer",
      company: "Schneider Electric",
      period: "2020 - Present",
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
      period: "2019 - 2020",
      responsibilities: [
        "Mentored junior developers and trainees",
        "Developed training materials and conducted technical workshops",
        "Provided code reviews and technical guidance"
      ]
    },
    {
      title: "Android Developer",
      company: "Freelance",
      period: "2016 - 2018",
      responsibilities: [
        "Developed mobile applications for Android platform",
        "Managed database integration and API connections",
        "Implemented responsive UI designs and user-friendly interfaces"
      ]
    }
  ];

  return (
    <section id="experience">
      <div 
        className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
          <i className="fas fa-briefcase"></i>
        </div>
        <h2 className="text-2xl font-bold ml-3">Work Experience</h2>
      </div>
      
      <div className="space-y-8">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-light-border dark:bg-dark-border"></div>
          
          {experiences.map((job, index) => (
            <div 
              key={index} 
              className={`relative pl-12 pb-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${200 * index}ms` }}
            >
              {/* Timeline node */}
              <div className="absolute left-0 top-2 w-8 h-8 flex items-center justify-center rounded-none border-2 border-white dark:border-gray-800 bg-brand-red text-white">
                <i className="fas fa-circle text-xs"></i>
              </div>
              
              {/* Job header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                <div>
                  <h3 className="font-bold text-xl">{job.title}</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{job.company}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 text-xs text-light-text-secondary dark:text-dark-text-secondary bg-light-surface dark:bg-dark-surface rounded-none border border-light-border dark:border-dark-border">
                  <i className="far fa-calendar-alt mr-2"></i>
                  {job.period}
                </span>
              </div>
              
              {/* Job description */}
              <div className="bg-light-surface dark:bg-dark-surface p-5 border border-light-border dark:border-dark-border rounded-none shadow-sm hover:shadow-md transition-shadow duration-300">
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-brand-red mr-2 font-bold">•</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;