/**
 * NavbarLinks component - Navigation links for the navbar
 * File: src/components/navbar/NavbarLinks.jsx
 */
import React from "react";

const NavbarLinks = ({ navItems, activeSection, handleNavClick }) => {
  return (
    <div className="container mx-auto px-4 w-full max-w-6xl">
      <ul className="flex justify-center space-x-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          let content = item.name;
          let icon = null;

          // Use "↑" icon for the "About" section to save space
          if (item.id === "about") {
            icon = (
              <svg className="icon text-xs mr-1" aria-hidden="true">
                <use href="#icon-arrow-up"></use>
              </svg>
            );
            // If translated name is too long, just use the icon
            if (item.name.length > 8) {
              content = "";
            }
          }

          return (
            <li key={item.id} className="flex-shrink-0">
              <a
                href={item.href}
                className={`relative px-2 py-2 text-sm font-medium transition-colors duration-100 block text-center whitespace-nowrap ${
                  isActive
                    ? "text-brand-red dark:text-brand-red"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
                onClick={(e) => handleNavClick(e, item.id)}
                data-section={item.id}
                aria-current={isActive ? "page" : undefined}
              >
                {icon}
                {content}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-red dark:bg-brand-red"
                    aria-hidden="true"
                  ></span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default React.memo(NavbarLinks);
