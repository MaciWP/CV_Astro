import React, { useEffect, useState } from 'react';

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('programming');
  
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
    
    observer.observe(document.getElementById('skills'));
    
    return () => observer.disconnect();
  }, []);

  // All skill categories
  const skillCategories = {
    programming: [
      { name: "C#", percent: 95 },
      { name: "Java", percent: 85 },
      { name: "Android", percent: 75 },
      { name: "Json", percent: 90 },
      { name: ".NET", percent: 90 },
      { name: "XML", percent: 80 },
      { name: "SQL", percent: 85 },
      { name: "ODF", percent: 70 }
    ],
    tools: [
      "Visual Studio",
      "REST",
      "SOAP",
      ".NET 4.8",
      "WPF",
      "Postman",
      "SoapUI",
      "MySQL",
      "Postgres",
      "Beaver",
      "MVware",
      "Oracle Express"
    ],
    methodologies: [
      { name: "Agile/Scrum", percent: 95 },
      { name: "Test-Driven Development", percent: 85 },
      { name: "CI/CD", percent: 75 },
      { name: "DevOps", percent: 70 }
    ]
  };

  // Function to render skill progress bar
  const SkillBar = ({ name, percent, index }) => (
    <div 
      className={`mb-4 transition-all duration-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-20px] opacity-0'}`}
      style={{ transitionDelay: `${100 * index}ms` }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{percent}%</span>
      </div>
      <div className="h-2 bg-light-secondary dark:bg-dark-surface rounded-none overflow-hidden">
        <div 
          className={`h-full bg-brand-red transition-all duration-1000 ease-out ${isVisible ? '' : 'w-0'}`}
          style={{ width: isVisible ? `${percent}%` : '0%', transitionDelay: `${150 * index}ms` }}
        ></div>
      </div>
    </div>
  );

  // Function to render skill pill
  const SkillPill = ({ name, index }) => (
    <div 
      className={`bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border px-4 py-2 rounded-none inline-flex items-center justify-center text-sm transition-all duration-500 transform hover:translate-y-[-4px] hover:border-brand-red ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={{ transitionDelay: `${50 * index}ms` }}
    >
      {name}
    </div>
  );

  return (
    <section id="skills">
      <div 
        className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
          <i className="fas fa-code"></i>
        </div>
        <h2 className="text-2xl font-bold ml-3">Technical Skills</h2>
      </div>
      
      <div 
        className={`bg-light-surface dark:bg-dark-surface p-6 border border-light-border dark:border-dark-border rounded-none shadow-sm transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        style={{ transitionDelay: '200ms' }}
      >
        {/* Tabs navigation */}
        <div className="flex border-b border-light-border dark:border-dark-border mb-6">
          {Object.keys(skillCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 text-center focus:outline-none transition-colors ${
                activeTab === category 
                  ? 'text-brand-red border-b-2 border-brand-red' 
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Programming Skills Tab */}
        {activeTab === 'programming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {skillCategories.programming.map((skill, index) => (
              <SkillBar key={skill.name} name={skill.name} percent={skill.percent} index={index} />
            ))}
          </div>
        )}
        
        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="flex flex-wrap gap-3">
            {skillCategories.tools.map((tool, index) => (
              <SkillPill key={tool} name={tool} index={index} />
            ))}
          </div>
        )}
        
        {/* Methodologies Tab */}
        {activeTab === 'methodologies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {skillCategories.methodologies.map((method, index) => (
              <SkillBar key={method.name} name={method.name} percent={method.percent} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;