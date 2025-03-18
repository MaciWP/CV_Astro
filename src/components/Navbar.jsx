import React, { useState, useEffect, useRef } from 'react';
import PDFDownload from './PDFDownload';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('about');
    const [scrollY, setScrollY] = useState(0);
    const [theme, setTheme] = useState('dark');
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const languageDropdownRef = useRef(null);

    // Elements de navegación with correct order (Education before Languages)
    const navItems = [
        { name: 'About', href: '#about', id: 'about' },
        { name: 'Experience', href: '#experience', id: 'experience' },
        { name: 'Skills', href: '#skills', id: 'skills' },
        { name: 'Education', href: '#education', id: 'education' },
        { name: 'Languages', href: '#languages', id: 'languages' },
        { name: 'Projects', href: '#projects', id: 'projects' }
    ];

    // Close language dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setIsLanguageOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [languageDropdownRef]);

    // Initialize component
    useEffect(() => {
        setMounted(true);

        // Get stored theme or default to dark
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);

        // Initial detection of active section
        updateActiveSection();

        // Set up scroll listener with debouncing
        const handleScroll = () => {
            setScrollY(window.scrollY);

            // Use requestAnimationFrame for better performance
            window.requestAnimationFrame(updateActiveSection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Also update active section on page load and resize
        window.addEventListener('load', updateActiveSection);
        window.addEventListener('resize', updateActiveSection);

        // Cleanup listeners
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('load', updateActiveSection);
            window.removeEventListener('resize', updateActiveSection);
        };
    }, []);

    // Added: Handle click on navigation item
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Update active section immediately
            setActiveSection(targetId);

            // Scroll to the target element
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu if open
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }

            // Update URL hash
            window.history.pushState(null, '', `#${targetId}`);
        }
    };

    // Improved section detection
    const updateActiveSection = () => {
        // Get all section elements with their positions
        const sections = navItems
            .map(item => {
                const element = document.getElementById(item.id);
                if (!element) return null;

                // Get the position of the section
                const rect = element.getBoundingClientRect();
                return {
                    id: item.id,
                    top: rect.top + window.scrollY,
                    bottom: rect.bottom + window.scrollY,
                    height: rect.height
                };
            })
            .filter(section => section !== null);

        if (sections.length === 0) return;

        // Current scroll position with offset for navbar
        const scrollPosition = window.scrollY + 100;

        // Find the section that's currently in view
        let currentSection = sections[0].id; // Default to first section

        // Loop through sections from top to bottom
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const nextSection = sections[i + 1];

            // If we're at the top of the section or between this section and the next
            if (
                scrollPosition >= section.top &&
                (nextSection === undefined || scrollPosition < nextSection.top)
            ) {
                currentSection = section.id;
                break;
            }
        }

        // Only update state if the active section has changed
        if (activeSection !== currentSection) {
            setActiveSection(currentSection);
        }
    };

    // Toggle theme function - faster transition
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Add transitioning class for smoother transitions
        document.documentElement.classList.add('theme-transitioning');

        // Update document classes
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);

        // Save to localStorage
        localStorage.setItem('theme', newTheme);

        // Remove transitioning class after animation completes - faster now
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 150); // Faster transition
    };

    // Determine if navbar should be elevated based on scroll position
    const isScrolled = scrollY > 50;

    // Server-side rendering placeholder
    if (!mounted) {
        return (
            <nav className="py-4 sticky top-0 z-50 bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border">
                <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
                    <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-brand-red text-white font-bold rounded-none">
                            OM
                        </div>
                        <div className="ml-2 font-medium tracking-tight">Oriol Macias</div>
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
        <nav className={`py-4 sticky top-0 z-50 transition-all duration-150 theme-transition-bg
      ${isScrolled
                ? 'bg-white/95 dark:bg-dark-primary/95 shadow-md backdrop-blur-md'
                : 'bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border'
            }`}>
            <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
                {/* Logo and social links */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-brand-red text-white font-bold rounded-none">
                            OM
                        </div>
                        <div className="ml-2 font-medium tracking-tight theme-transition-text">Oriol Macias</div>
                    </div>

                    {/* Social links (GitHub, LinkedIn) with brand-red color */}
                    <div className="hidden md:flex items-center gap-3 ml-4">
                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-red hover:text-brand-red/80 transition-colors"
                            aria-label="GitHub Profile"
                        >
                            <i className="fab fa-github text-lg"></i>
                        </a>
                        <a
                            href="https://linkedin.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-red hover:text-brand-red/80 transition-colors"
                            aria-label="LinkedIn Profile"
                        >
                            <i className="fab fa-linkedin text-lg"></i>
                        </a>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex">
                    <ul className="flex space-x-6">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={`relative text-sm font-medium transition-colors duration-150 ${isActive
                                            ? 'text-brand-red dark:text-brand-red'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                        onClick={(e) => handleNavClick(e, item.id)}
                                    >
                                        {item.name}

                                        {isActive && (
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-red dark:bg-brand-red"></span>
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-3">
                    {/* Language Selector */}
                    <div className="relative" ref={languageDropdownRef}>
                        <button
                            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                            className="flex items-center gap-1 p-2 rounded-none text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 theme-transition-text"
                            aria-expanded={isLanguageOpen}
                            aria-haspopup="true"
                        >
                            <span className="font-medium text-xs">EN</span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-150 ${isLanguageOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Language Dropdown */}
                        {isLanguageOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-none shadow-lg z-10">
                                <div className="py-1">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 theme-transition-text theme-transition-bg">
                                        English
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 theme-transition-text theme-transition-bg">
                                        Español
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 theme-transition-text theme-transition-bg">
                                        Français
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 theme-transition-text theme-transition-bg">
                                        Deutsch
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-none text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        aria-label="Toggle theme"
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

                    {/* Download CV Button */}
                    <PDFDownload />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-none hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden absolute left-0 right-0 px-4 pt-2 pb-4 bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border shadow-lg theme-transition-bg">
                    <div className="flex flex-col space-y-3">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium py-2 px-3 theme-transition-text theme-transition-bg ${isActive
                                        ? 'text-brand-red dark:text-brand-red bg-gray-100 dark:bg-gray-800'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                >
                                    {item.name}
                                </a>
                            );
                        })}

                        {/* Social links in mobile menu with brand-red color */}
                        <div className="flex items-center gap-4 py-2 px-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-red hover:text-brand-red/80 transition-colors"
                            >
                                <i className="fab fa-github text-lg"></i>
                            </a>
                            <a
                                href="https://linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-red hover:text-brand-red/80 transition-colors"
                            >
                                <i className="fab fa-linkedin text-lg"></i>
                            </a>
                        </div>

                        <a
                            href="#"
                            className="inline-flex items-center justify-center mt-3 px-3 py-2 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('cv-download-button')?.click();
                                setIsMenuOpen(false);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download CV</span>
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;