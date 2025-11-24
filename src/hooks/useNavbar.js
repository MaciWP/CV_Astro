import { useState, useEffect, useRef } from 'react';
import { getCurrentLanguageNavItems, getCurrentUITranslation } from '../data/navigation';

/**
 * Custom hook to handle Navbar logic
 * Manages state for menu, theme, scroll, and active sections
 */
export const useNavbar = () => {
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
        setActiveSection('about');
        window.history.pushState(null, '', '#about');

        if (window.announceToScreenReader) {
            window.announceToScreenReader('Returned to the top of the page');
        }
    };

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.add('theme-transitioning');

        requestAnimationFrame(() => {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);

            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 75);
        });
    };

    // Setup intersection observers
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: `-${navbarHeight}px 0px 0px 0px`,
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            const visibleEntries = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (visibleEntries.length > 0) {
                setActiveSection(visibleEntries[0].target.id);
            }
        }, options);

        const observeElements = () => {
            const itemsToObserve = navItems.length > 0 ? navItems : [
                { id: 'about' }, { id: 'experience' }, { id: 'skills' },
                { id: 'education' }, { id: 'languages' }, { id: 'projects' }
            ];

            itemsToObserve.forEach(item => {
                const element = document.getElementById(item.id);
                if (element) observer.observe(element);
            });
        };

        observeElements();

        return () => {
            const allSections = document.querySelectorAll('section[id]');
            allSections.forEach(section => observer.unobserve(section));
        };
    }, [navItems]);

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
