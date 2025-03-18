import React, { useEffect, useState } from 'react';

const Projects = () => {
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
    
    const element = document.getElementById('projects');
    if (element) {
      observer.observe(element);
    }
    
    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: "Integration Platform",
      description: "Developed a comprehensive integration platform that connects various systems and applications, enabling seamless data flow and process automation.",
      technologies: ["C#", ".NET", "REST API", "SQL"]
    },
    {
      title: "Mobile Application for Data Collection",
      description: "Created an Android application for field data collection, featuring offline capabilities and synchronization with central database.",
      technologies: ["Java", "Android", "SQLite", "REST API"]
    }
  ];

  return (
    <section id="projects">
      <div 
        className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
          <i className="fas fa-project-diagram"></i>
        </div>
        <h2 className="text-2xl font-bold ml-3">Projects</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className={`group bg-light-surface dark:bg-dark-surface rounded-none overflow-hidden border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:translate-y-[-8px]`}
            style={{ transitionDelay: `${200 * index}ms` }}
          >
            {/* Red header bar */}
            <div className="h-1 bg-brand-red w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg mb-3 group-hover:text-brand-red transition-colors duration-300">{project.title}</h3>
              <p className="mb-4 text-light-text-secondary dark:text-dark-text-secondary">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-3 py-1 text-xs border border-light-border dark:border-dark-border rounded-none bg-light-secondary dark:bg-dark-secondary group-hover:border-brand-red transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;