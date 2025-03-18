import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollY, setScrollY] = useState(0);

  // Solo intentar acceder al contexto después de montarse en el cliente
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Optional: update active section based on scroll position
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

  // Navegación
  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' }
  ];

  // Render un placeholder en el servidor, luego actualizar en el cliente
  let theme = 'light';
  let toggleTheme = () => {
    console.log('Theme toggle not yet available');
  };

  // Solo accede al contexto si estamos montados en el cliente
  if (mounted) {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  }

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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-none hover:bg-light-secondary dark:hover:bg-dark-secondary focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <i className="fas fa-sun text-dark-text"></i>
            ) : (
              <i className="fas fa-moon text-light-text"></i>
            )}
          </button>

          {/* Download CV Button */}
          <a
            href="#"
            className="hidden md:inline-flex items-center px-3 py-1.5 text-sm text-white bg-brand-red rounded-none hover:bg-opacity-90 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
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