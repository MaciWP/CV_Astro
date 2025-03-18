import React, { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Use useCallback for event handlers
  const handleContactHover = useCallback((e) => {
    // Add some animation or effect when hovering contact items
    e.currentTarget.classList.add('scale-105');
    
    // Remove the class after transition completes
    setTimeout(() => {
      e.currentTarget.classList.remove('scale-105');
    }, 300);
  }, []);
  
  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);
  
  const contactInfo = [
    { icon: 'fa-envelope', text: 'email@example.com', link: 'mailto:email@example.com' },
    { icon: 'fa-phone', text: '+1234567890', link: 'tel:+1234567890' },
    { icon: 'fa-linkedin', text: 'LinkedIn', link: 'https://linkedin.com/' }
  ];

  return (
    <div id="about" className="flex flex-col md:flex-row items-center md:items-start gap-8" ref={ref}>
      {/* Profile Photo with animation */}
      <div 
        className={`w-40 h-40 overflow-hidden bg-light-secondary dark:bg-dark-secondary rounded-none border-4 border-white dark:border-gray-800 shadow-xl transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover-glow`}
        style={{ transitionDelay: '100ms' }}
      >
        <img 
          src="/images/profile-photo.jpg" 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="%23f3f4f6"/><text x="75" y="75" font-family="Arial" font-size="18" text-anchor="middle" dominant-baseline="middle" fill="%236b7280">Photo</text></svg>';
          }}
        />
      </div>
      
      {/* Profile Content with animations */}
      <div className="flex-1 text-center md:text-left space-y-6">
        <div 
          className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-1 text-gradient-brand">Oriol Macias</h1>
          <h2 className="text-xl text-brand-red mb-4">Software Developer</h2>
        </div>
        
        <p 
          className={`mb-6 max-w-2xl transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '300ms' }}
        >
          Experienced Software Developer with a strong background in application development, 
          problem-solving, and software design. Skilled in creating efficient solutions and 
          implementing technical requirements. Currently expanding knowledge in AI through 
          specialized training programs.
        </p>
        
        <div 
          className={`flex flex-wrap gap-4 justify-center md:justify-start transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '400ms' }}
        >
          {contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="flex items-center group transition-all duration-300 hover:translate-x-1"
              onMouseEnter={handleContactHover}
            >
              <div className="w-8 h-8 flex items-center justify-center text-brand-red border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface rounded-none mr-2 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                <i className={`fas ${info.icon}`}></i>
              </div>
              {info.link ? (
                <a 
                  href={info.link} 
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red dark:hover:text-brand-red transition-colors"
                >
                  {info.text}
                </a>
              ) : (
                <span className="text-light-text-secondary dark:text-dark-text-secondary">{info.text}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Hero);