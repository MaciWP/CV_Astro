import { useState, useEffect, useRef } from 'react';
import { getCurrentLanguageNavItems, getCurrentUITranslation } from '../data/navigation';

/**
 * Custom hook to handle Navbar logic
 * Manages state for menu, theme, scroll, and active sections
 */
export const useNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('experience');
    const [scrollY, setScrollY] = useState(0);
    const [theme, setTheme] = useState('dark');
    const [navItems, setNavItems] = useState([]);
    const [uiTexts, setUiTexts] = useState({
        downloadCV: 'Download CV',
        backToTop: 'Back to top',
        openMenu: 'Open menu',
        closeMenu: 'Close menu'
    });

    const menuButtonRef = useRef(null);
    const navbarHeight = 80; // estimated navbar height for offset

    // Close mobile menu
    const closeMenu = () => {
        setIsMenuOpen(false);
        if (menuButtonRef.current) {
            menuButtonRef.current.focus();
        }
    };

    // Toggle the mobile menu
    const toggleMobileMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Load translated navigation items and UI texts
    const loadTranslations = () => {
        const items = getCurrentLanguageNavItems();
        setNavItems(items);

        setUiTexts({
            downloadCV: getCurrentUITranslation('downloadCV'),
            backToTop: getCurrentUITranslation('backToTop'),
            openMenu: getCurrentUITranslation('openMenu'),
            closeMenu: getCurrentUITranslation('closeMenu')
        });
    };

    // Handle click on navigation item
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            setActiveSection(targetId);
            const position = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });

            window.history.pushState(null, '', `#${targetId}`);

            if (window.announceToScreenReader) {
                const sectionName = navItems.find(item => item.id === targetId)?.name || targetId;
                window.announceToScreenReader(`Navigated to ${sectionName} section`);
            }
        }
    };

    // Handle click on logo or name to scroll to top
    const handleLogoClick = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('experience'); // First nav item after removing About
        window.history.pushState(null, '', window.location.pathname);

        if (window.announceToScreenReader) {
            window.announceToScreenReader('Returned to the top of the page');
        }
    };

    // Toggle theme function - INSTANT without transitions
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Immediate change without animation
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Detect active section based on scroll position - simple and reliable
    useEffect(() => {
        if (!mounted) return;

        const sectionIds = ['experience', 'skills', 'education', 'languages', 'projects'];

        const updateActiveSection = () => {
            const scrollPosition = window.scrollY + navbarHeight + 100;

            // Find the section that's currently in view
            let currentSection = 'experience';

            for (const id of sectionIds) {
                const element = document.getElementById(id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    if (scrollPosition >= offsetTop) {
                        currentSection = id;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        // Throttle scroll updates for performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial check
        setTimeout(updateActiveSection, 150);

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [mounted]);

    // Initialize
    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(storedTheme);
        loadTranslations();

        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleLanguageChange = () => loadTranslations();
        document.addEventListener('languageChanged', handleLanguageChange);
        document.addEventListener('translationsLoaded', handleLanguageChange);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('languageChanged', handleLanguageChange);
            document.removeEventListener('translationsLoaded', handleLanguageChange);
        };
    }, []);

    return {
        isMenuOpen,
        mounted,
        activeSection,
        scrollY,
        theme,
        navItems,
        uiTexts,
        menuButtonRef,
        closeMenu,
        toggleMobileMenu,
        handleNavClick,
        handleLogoClick,
        toggleTheme
    };
};
