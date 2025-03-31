/**
 * Navbar component with enhanced accessibility, responsive translations, and improved layout
 * File: src/components/Navbar.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import PDFDownload from './PDFDownload';
import LanguageSelector from './LanguageSelector';
import { getCurrentLanguageNavItems, getCurrentUITranslation } from '../data/navigation';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('about');
    const [scrollY, setScrollY] = useState(0);
    const [theme, setTheme] = useState('dark');
    const [navItems, setNavItems] = useState([]);
    const [uiTexts, setUiTexts] = useState({
        downloadCV: 'Download CV',
        backToTop: 'Back to top',
        openMenu: 'Open menu',
        closeMenu: 'Close menu'
    });

    const mobileMenuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const navbarHeight = 80; // estimated navbar height for offset

    /**
     * Manage focus when mobile menu opens/closes for accessibility
     * @param {boolean} isOpen - Whether menu is open or closed
     */
    const manageMobileMenuFocus = (isOpen) => {
        setTimeout(() => {
            if (isOpen && mobileMenuRef.current) {
                // Al abrir el menú, enfocar el primer elemento
                const firstFocusableElement = mobileMenuRef.current.querySelector('a, button');
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
            } else if (menuButtonRef.current) {
                // Al cerrar el menú, devolver el foco al botón que lo abrió
                menuButtonRef.current.focus();
            }
        }, 100);
    };

    // Load translated navigation items and UI texts
    const loadTranslations = () => {
        const items = getCurrentLanguageNavItems();
        setNavItems(items);

        // Load UI texts
        setUiTexts({
            downloadCV: getCurrentUITranslation('downloadCV'),
            backToTop: getCurrentUITranslation('backToTop'),
            openMenu: getCurrentUITranslation('openMenu'),
            closeMenu: getCurrentUITranslation('closeMenu')
        });
    };

    // Initialize component and set up intersection observers
    useEffect(() => {
        setMounted(true);

        // Get stored theme or default to dark
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);

        // Initial load of translations
        loadTranslations();

        // Set up intersection observers for each section
        setupIntersectionObservers();

        // Set up scroll listener for navbar effects
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Listen for language changes
        const handleLanguageChange = () => {
            loadTranslations();
        };

        document.addEventListener('languageChanged', handleLanguageChange);
        document.addEventListener('translationsLoaded', handleLanguageChange);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('languageChanged', handleLanguageChange);
            document.removeEventListener('translationsLoaded', handleLanguageChange);
        };
    }, []);

    // Handle keyboard navigation in the mobile menu
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                manageMobileMenuFocus(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen]);

    // Setup intersection observers for all sections
    const setupIntersectionObservers = () => {
        const options = {
            root: null, // viewport
            rootMargin: `-${navbarHeight}px 0px 0px 0px`, // offset for navbar height
            threshold: 0.2 // 20% of the element must be visible
        };

        const observer = new IntersectionObserver((entries) => {
            const visibleEntries = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => {
                    const rectA = a.boundingClientRect;
                    const rectB = b.boundingClientRect;
                    return rectA.top - rectB.top;
                });

            if (visibleEntries.length > 0) {
                // Get the ID of the topmost visible section
                const sectionId = visibleEntries[0].target.id;
                setActiveSection(sectionId);
            }
        }, options);

        // Observe all sections
        if (navItems.length === 0) {
            // If navItems not loaded yet, use default section IDs
            const defaultSections = ['about', 'experience', 'skills', 'education', 'languages', 'projects'];
            defaultSections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    observer.observe(element);
                }
            });
        } else {
            navItems.forEach(item => {
                const element = document.getElementById(item.id);
                if (element) {
                    observer.observe(element);
                }
            });
        }

        // Return cleanup function
        return () => {
            const allSections = document.querySelectorAll('section[id]');
            allSections.forEach(section => {
                observer.unobserve(section);
            });
        };
    };

    // Toggle the mobile menu with focus management
    const toggleMobileMenu = () => {
        const newMenuState = !isMenuOpen;
        setIsMenuOpen(newMenuState);
        manageMobileMenuFocus(newMenuState);
    };


    // Handle click on navigation item
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Update active section immediately
            setActiveSection(targetId);

            // Calculate scroll position with navbar offset
            const position = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            // Scroll to the target element
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }

            // Update URL hash
            window.history.pushState(null, '', `#${targetId}`);
        }
    };

    // Handle click on logo or name to scroll to top
    const handleLogoClick = (e) => {
        e.preventDefault();

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Set active section to about
        setActiveSection('about');

        // Update URL hash
        window.history.pushState(null, '', '#about');
    };

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        document.documentElement.classList.add('theme-transitioning');

        requestAnimationFrame(() => {
            // Update document classes
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newTheme);

            // Save to localStorage
            localStorage.setItem('theme', newTheme);

            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 75);
        });
    };

    const isScrolled = scrollY > 50;

    // Server-side rendering placeholder
    if (!mounted) {
        return (
            <nav className="py-4 sticky top-0 z-50 bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border">
                <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
                    <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-brand-red text-white rounded-none">
                            <span className="text-lg font-bold">OM</span>
                        </div>
                        <div className="ml-3 font-medium tracking-tight theme-transition-text whitespace-nowrap">
                            Oriol Macias
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="h-8 w-48"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-24"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`py-4 sticky top-0 z-50 transition-all duration-75 theme-transition-bg
            ${isScrolled
                ? 'bg-white/95 dark:bg-dark-primary/95 shadow-md backdrop-blur-md'
                : 'bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border'
            }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
                {/* Logo section - Increased size */}
                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        {/* Logo cuadrado con márgenes equidistantes */}
                        <div className="w-12 h-12 flex items-center justify-center bg-brand-red text-white rounded-none">
                            <span className="text-lg font-bold">OM</span>
                        </div>

                        {/* Nombre en una sola línea */}
                        <div className="ml-2 font-medium tracking-tight theme-transition-text">Oriol Macias</div>

                    </div>

                    {/* Social links */}
                    <div className="hidden md:flex items-center gap-3 ml-2">

                        <a href="https://github.com/MaciWP"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-red hover:text-brand-red/80 transition-colors"
                            aria-label="GitHub Profile"
                        >
                            <i className="fab fa-github text-lg"></i>
                        </a>

                        <a href="https://linkedin.com/in/oriolmaciasbadosa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-red hover:text-brand-red/80 transition-colors"
                            aria-label="LinkedIn Profile"
                        >
                            <i className="fab fa-linkedin text-lg"></i>
                        </a>
                    </div>
                </div>

                {/* Desktop Navigation - Centered with equal widths */}
                <div className="container mx-auto px-4 w-full max-w-6xl">
                    <ul className="flex justify-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            // Use icons for certain items to save space
                            let content = item.name;
                            let icon = null;

                            // Use "↑" icon for the "About" section to save space
                            if (item.id === 'about') {
                                icon = <i className="fas fa-arrow-up text-xs mr-1"></i>;
                                // If translated name is too long, just use the icon
                                if (item.name.length > 8) {
                                    content = '';
                                }
                            }

                            return (
                                <li key={item.id} className="flex-shrink-0">

                                    <a href={item.href}
                                        className={`relative px-2 py-2 text-sm font-medium transition-colors duration-100 block text-center whitespace-nowrap ${isActive
                                            ? 'text-brand-red dark:text-brand-red'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                        onClick={(e) => handleNavClick(e, item.id)}
                                        data-section={item.id}
                                    >
                                        {icon}{content}
                                        {isActive && (
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-red dark:bg-brand-red"></span>
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Controls - More evenly spaced */}
                <div className="flex items-center gap-2">
                    {/* Language Selector */}
                    <LanguageSelector />

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-none text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        aria-label={theme === 'light' ? "Switch to dark theme" : "Switch to light theme"}
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {/* Download CV Button - Properly translated */}
                    <div className="hidden sm:block">
                        <PDFDownload label={uiTexts.downloadCV} />
                    </div>

                    {/* Mobile Menu Button - Larger */}
                    <button
                        ref={menuButtonRef}
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-none hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                        aria-label={isMenuOpen ? uiTexts.closeMenu : uiTexts.openMenu}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        id="mobile-menu-button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div
                    id="mobile-menu"
                    ref={mobileMenuRef}
                    className="md:hidden absolute left-0 right-0 px-4 pt-2 pb-4 bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border shadow-lg theme-transition-bg mobile-menu"
                    role="menu"
                    aria-labelledby="mobile-menu-button"
                >
                    <div className="flex flex-col space-y-3">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (

                                <a key={item.id}
                                    href={item.href}
                                    className={`text-sm font-medium py-2 px-3 theme-transition-text theme-transition-bg ${isActive
                                        ? 'text-brand-red dark:text-brand-red bg-gray-100 dark:bg-gray-800'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                    role="menuitem"
                                    data-section={item.id}
                                >
                                    {item.name}
                                </a>
                            );
                        })}

                        {/* Social links */}
                        <div className="flex items-center gap-4 py-2 px-3 border-t border-gray-200 dark:border-gray-700 mt-2">

                            <a href="https://github.com/MaciWP"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-red hover:text-brand-red/80 transition-colors"
                                aria-label="GitHub Profile"
                            >
                                <i className="fab fa-github text-lg"></i>
                            </a>

                            <a href="https://linkedin.com/in/oriolmaciasbadosa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-red hover:text-brand-red/80 transition-colors"
                                aria-label="LinkedIn Profile"
                            >
                                <i className="fab fa-linkedin text-lg"></i>
                            </a>
                        </div>

                        {/* Download button */}

                        <a href="#"
                            className="inline-flex items-center justify-center mt-3 px-3 py-2 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('cv-download-button')?.click();
                                setIsMenuOpen(false);
                            }}
                            role="menuitem"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>{uiTexts.downloadCV}</span>
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;