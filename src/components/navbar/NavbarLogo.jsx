/**
 * NavbarLogo component - Logo and brand text for the navigation bar
 * File: src/components/navbar/NavbarLogo.jsx
 */
import React from 'react';

const NavbarLogo = ({ onClick }) => {
    return (
        <div className="flex items-center gap-4">
            <div
                className="flex items-center cursor-pointer"
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onClick(e);
                    }
                }}
                aria-label="Go to top of page"
            >
                {/* Square logo with equal margins */}
                <div className="w-12 h-12 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <span className="text-lg font-bold">OM</span>
                </div>

                {/* Name in a single line */}
                <div className="ml-2 font-medium tracking-tight theme-transition-text">
                    Oriol Macias
                </div>
            </div>

            {/* Social links */}
            <div className="hidden md:flex items-center gap-3 ml-2">
                <a
                    href="https://github.com/MaciWP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red hover:text-brand-red/80 transition-colors"
                    aria-label="GitHub Profile"
                >
                    <i className="fab fa-github text-lg"></i>
                </a>

                <a
                    href="https://linkedin.com/in/oriolmaciasbadosa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-red hover:text-brand-red/80 transition-colors"
                    aria-label="LinkedIn Profile"
                >
                    <i className="fab fa-linkedin text-lg"></i>
                </a>
            </div>
        </div>
    );
};

export default React.memo(NavbarLogo);