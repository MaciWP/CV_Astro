import React, { useState, useEffect } from 'react';
import Header from './Header';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div id="about" className="space-y-10">
      {/* Incluir el componente Header */}
      <Header />
      
      {/* Professional Summary */}
      <section>
        <div 
          className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
            <i className="fas fa-user-tie"></i>
          </div>
          <h2 className="text-2xl font-bold ml-3">Professional Summary</h2>
        </div>
        
        <div 
          className={`bg-light-surface dark:bg-dark-surface p-5 border border-light-border dark:border-dark-border rounded-none shadow-sm transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <p className="mb-4">
            Experienced Software Developer with a strong background in application development, 
            problem-solving, and software design. Skilled in creating efficient solutions and 
            implementing technical requirements. Currently expanding knowledge in AI through 
            specialized training programs.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center group">
              <div className="w-8 h-8 flex items-center justify-center text-brand-red border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface rounded-none mr-2 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <i className="fas fa-envelope"></i>
              </div>
              <a 
                href="mailto:email@example.com" 
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red dark:hover:text-brand-red transition-colors"
              >
                email@example.com
              </a>
            </div>
            
            <div className="flex items-center group">
              <div className="w-8 h-8 flex items-center justify-center text-brand-red border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface rounded-none mr-2 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <i className="fas fa-phone"></i>
              </div>
              <a 
                href="tel:+1234567890" 
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red dark:hover:text-brand-red transition-colors"
              >
                +1234567890
              </a>
            </div>
            
            <div className="flex items-center group">
              <div className="w-8 h-8 flex items-center justify-center text-brand-red border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface rounded-none mr-2 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <i className="fab fa-linkedin"></i>
              </div>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red dark:hover:text-brand-red transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;