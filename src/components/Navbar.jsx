/**
 * Navbar component with enhanced accessibility and responsive design
 * File: src/components/Navbar.jsx
 */
import React from 'react';
import PDFDownload from './PDFDownload';
import LanguageSelector from './LanguageSelector';
import { useNavbar } from '../hooks/useNavbar';

// Import subcomponents
import NavbarLogo from './navbar/NavbarLogo';
import NavbarLinks from './navbar/NavbarLinks';
import ThemeToggle from './navbar/ThemeToggle';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
    const {
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
    } = useNavbar();

    const isScrolled = scrollY > 50;

    // Server-side rendering placeholder - matches hydrated nav exactly to prevent flash
    if (!mounted) {
        return (
            <nav
                className="py-4 sticky top-0 z-50 bg-white/50 dark:bg-dark-primary/50 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border"
                role="navigation"
                aria-label="Main Navigation"
            >
                <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
                    <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center bg-brand-red text-white rounded-none">
                            <span className="text-lg font-bold">OM</span>
                        </div>
                        <div className="ml-3 font-medium tracking-tight whitespace-nowrap">
                            Oriol Macias
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="h-8 w-[430px]" aria-hidden="true"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8" aria-hidden="true"></div>
                        <div className="h-8 w-8" aria-hidden="true"></div>
                        <div className="hidden sm:block h-8 w-24" aria-hidden="true"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav
            className={`py-4 sticky top-0 z-50 transition-all duration-75 theme-transition-bg
        ${isScrolled
                    ? 'bg-white/80 dark:bg-dark-primary/80 shadow-lg backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-border/50'
                    : 'bg-white/50 dark:bg-dark-primary/50 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border'
                }`}
            role="navigation"
            aria-label="Main Navigation"
        >
            <div className="container mx-auto px-4 flex justify-between items-center max-w-5xl">
                {/* Logo section */}
                <NavbarLogo onClick={handleLogoClick} />

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <NavbarLinks
                        navItems={navItems}
                        activeSection={activeSection}
                        handleNavClick={handleNavClick}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Language Selector */}
                    <LanguageSelector />

                    {/* Theme Toggle */}
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

                    {/* Download CV Button */}
                    <div className="hidden sm:block">
                        <PDFDownload label={uiTexts.downloadCV} />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        ref={menuButtonRef}
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-none hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                        aria-label={isMenuOpen ? uiTexts.closeMenu : uiTexts.openMenu}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        id="mobile-menu-button"
                        aria-haspopup="menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileMenu
                isOpen={isMenuOpen}
                navItems={navItems}
                activeSection={activeSection}
                handleNavClick={handleNavClick}
                uiTexts={uiTexts}
                closeMenu={closeMenu}
            />
        </nav>
    );
};

export default Navbar;