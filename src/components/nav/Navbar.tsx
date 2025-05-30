/**
 * Navbar component with enhanced accessibility and responsive design
 * File: src/components/nav/Navbar.tsx
 */
import React, { useState, useEffect, useRef } from "react";
import PDFDownload from "../PDFDownload";
import LanguageSelector from "../LanguageSelector";
import {
  getCurrentLanguageNavItems,
  getCurrentUITranslation,
} from "../../data/navigation";

// Import subcomponents
import NavbarLogo from "../navbar/NavbarLogo";
import NavbarLinks from "../navbar/NavbarLinks";
import ThemeToggle from "../navbar/ThemeToggle";
import MobileMenu from "../navbar/MobileMenu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [navItems, setNavItems] = useState<
    Array<{ id: string; name: string; href: string }>
  >([]);
  const [uiTexts, setUiTexts] = useState({
    downloadCV: "Download CV",
    backToTop: "Back to top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  });

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const navbarHeight = 80; // estimated navbar height for offset

  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
    if (menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  };

  // Load translated navigation items and UI texts
  const loadTranslations = () => {
    const items = getCurrentLanguageNavItems();
    setNavItems(items);

    // Load UI texts
    setUiTexts({
      downloadCV: getCurrentUITranslation("downloadCV"),
      backToTop: getCurrentUITranslation("backToTop"),
      openMenu: getCurrentUITranslation("openMenu"),
      closeMenu: getCurrentUITranslation("closeMenu"),
    });
  };

  // Initialize component and set up intersection observers
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight}px`,
      );
    };

    setVh();
    window.addEventListener("resize", setVh);

    setMounted(true);

    // Get stored theme or default to dark
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);

    // Initial load of translations
    loadTranslations();

    // Set up intersection observers for each section
    setupIntersectionObservers();

    // Set up scroll listener for navbar effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Listen for language changes
    const handleLanguageChange = () => {
      loadTranslations();
    };

    document.addEventListener("languageChanged", handleLanguageChange);
    document.addEventListener("translationsLoaded", handleLanguageChange);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("languageChanged", handleLanguageChange);
      document.removeEventListener("translationsLoaded", handleLanguageChange);
    };
  }, []);

  // Setup intersection observers for all sections
  const setupIntersectionObservers = () => {
    const options = {
      root: null, // viewport
      rootMargin: `-${navbarHeight}px 0px 0px 0px`, // offset for navbar height
      threshold: 0.2, // 20% of the element must be visible
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
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
      const defaultSections = [
        "about",
        "experience",
        "skills",
        "education",
        "languages",
        "projects",
      ];
      defaultSections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    } else {
      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });
    }

    // Return cleanup function
    return () => {
      const allSections = document.querySelectorAll("section[id]");
      allSections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  };

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle click on navigation item
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Update active section immediately
      setActiveSection(targetId);

      // Calculate scroll position with navbar offset
      const position =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;

      // Scroll to the target element
      window.scrollTo({
        top: position,
        behavior: "smooth",
      });

      // Update URL hash
      window.history.pushState(null, "", `#${targetId}`);

      // Announce to screen readers
      if (window.announceToScreenReader) {
        const sectionName =
          navItems.find((item) => item.id === targetId)?.name || targetId;
        window.announceToScreenReader(`Navigated to ${sectionName} section`);
      }
    }
  };

  // Handle click on logo or name to scroll to top
  const handleLogoClick = (e) => {
    e.preventDefault();

    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Set active section to about
    setActiveSection("about");

    // Update URL hash
    window.history.pushState(null, "", "#about");

    // Announce to screen readers
    if (window.announceToScreenReader) {
      window.announceToScreenReader("Returned to the top of the page");
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    document.documentElement.classList.add("theme-transitioning");

    requestAnimationFrame(() => {
      // Update document classes
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);

      // Save to localStorage
      localStorage.setItem("theme", newTheme);

      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 75);
    });
  };

  const isScrolled = scrollY > 50;

  // Server-side rendering placeholder
  if (!mounted) {
    return (
      <nav
        suppressHydrationWarning
        className="py-4 sticky top-0 z-50 bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border"
      >
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
    <nav
      suppressHydrationWarning
      className={`py-4 sticky top-0 z-50 transition-all duration-75 theme-transition-bg
        ${
          isScrolled
            ? "bg-white/95 dark:bg-dark-primary/95 shadow-md backdrop-blur-md"
            : "bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border"
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
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
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
