import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll effects and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['about', 'experience', 'skills', 'education', 'projects'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' }
  ];

  const isScrolled = scrollY > 50;

  return (
    <nav className={`py-4 sticky top-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-light-primary/90 dark:bg-dark-primary/90 shadow-md backdrop-blur-md' 
        : 'bg-light-primary dark:bg-dark-primary border-b border-light-border dark:border-dark-border'
      }`}>
      <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center bg-brand-red text-white font-bold rounded-none">
            OM
          </div>
          <div className="ml-2 font-bold">Oriol Macias</div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`relative text-light-text dark:text-dark-text hover:text-brand-red dark:hover:text-brand-red transition-colors text-sm
                ${activeSection === item.href.substring(1) ? 'text-brand-red dark:text-brand-red' : ''}
              `}
            >
              {item.name}
              {activeSection === item.href.substring(1) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-red dark:bg-brand-red"></span>
              )}
            </a>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Download CV Button */}
          <a
            href="#"
            className="hidden md:inline-flex items-center px-3 py-1.5 text-sm text-white bg-brand-red rounded-none hover:bg-opacity-90 transition-all duration-300 hover:-translate-y-0.5"
          >
            <i className="fas fa-download mr-1.5"></i>
            <span>Download CV</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-none hover:bg-light-secondary dark:hover:bg-dark-secondary focus:outline-none transition-colors"
            aria-label="Open menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 px-4 pt-2 pb-4 bg-light-primary dark:bg-dark-primary border-b border-light-border dark:border-dark-border">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-light-text dark:text-dark-text hover:text-brand-red dark:hover:text-brand-red transition-colors py-1
                  ${activeSection === item.href.substring(1) ? 'text-brand-red dark:text-brand-red' : ''}
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#"
              className="inline-flex items-center justify-center px-3 py-1.5 text-sm text-white bg-brand-red rounded-none hover:bg-opacity-90 transition-colors"
            >
              <i className="fas fa-download mr-1.5"></i>
              <span>Download CV</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;