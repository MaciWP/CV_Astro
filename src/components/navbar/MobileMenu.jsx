/**
 * MobileMenu component - Mobile navigation menu
 * File: src/components/navbar/MobileMenu.jsx
 */
import React, { useEffect, useRef } from 'react';

const MobileMenu = ({
    isOpen,
    navItems,
    activeSection,
    handleNavClick,
    uiTexts,
    closeMenu
}) => {
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeMenu]);

    // Handle keyboard navigation in menu
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            } else if (e.key === 'Tab') {
                // Get all focusable elements in the menu
                const focusableElements = menuRef.current?.querySelectorAll(
                    'a[href], button, [tabindex]:not([tabindex="-1"])'
                );

                // If Shift+Tab on first element or Tab on last element, trap focus
                if (focusableElements?.length) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeMenu]);

    // Focus first element when menu opens
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const firstFocusableElement = menuRef.current.querySelector(
                'a[href], button, [tabindex]:not([tabindex="-1"])'
            );
            firstFocusableElement?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            id="mobile-menu"
            ref={menuRef}
            className="md:hidden absolute left-0 right-0 px-4 pt-2 pb-4 bg-white dark:bg-dark-primary border-b border-gray-200 dark:border-dark-border shadow-lg theme-transition-bg mobile-menu animate-fade-in"
            role="menu"
            aria-labelledby="mobile-menu-button"
        >
            <div className="flex flex-col space-y-3">
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <a
                            key={item.id}
                            href={item.href}
                            className={`text-sm font-medium py-2 px-3 theme-transition-text theme-transition-bg ${isActive
                                    ? 'text-brand-red dark:text-brand-red bg-gray-100 dark:bg-gray-800'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            onClick={(e) => {
                                handleNavClick(e, item.id);
                                closeMenu();
                            }}
                            role="menuitem"
                            data-section={item.id}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {item.name}
                        </a>
                    );
                })}

                {/* Social links */}
                <div className="flex items-center gap-4 py-2 px-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <a
                        href="https://github.com/MaciWP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-red hover:text-brand-red/80 transition-colors"
                        aria-label="GitHub Profile"
                        role="menuitem"
                    >
                        <i className="fab fa-github text-lg"></i>
                    </a>

                    <a
                        href="https://linkedin.com/in/oriolmaciasbadosa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-red hover:text-brand-red/80 transition-colors"
                        aria-label="LinkedIn Profile"
                        role="menuitem"
                    >
                        <i className="fab fa-linkedin text-lg"></i>
                    </a>
                </div>

                {/* Download button */}
                <a
                    href="#"
                    className="inline-flex items-center justify-center mt-3 px-3 py-2 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('cv-download-button')?.click();
                        closeMenu();
                    }}
                    role="menuitem"
                >
                    <i className="fas fa-download mr-1.5"></i>
                    <span>{uiTexts.downloadCV}</span>
                </a>
            </div>
        </div>
    );
};

export default React.memo(MobileMenu);