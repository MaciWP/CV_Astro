import React from 'react';
// Temporarily comment out i18n
// import { useTranslation } from 'react-i18next';

const Header = () => {
  // const { t } = useTranslation();

  return (
    <section className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Profile Photo - Using a placeholder since the actual image isn't available yet */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-light-accent dark:border-dark-accent high-contrast:border-black bg-gray-200">
        {/* Placeholder for the profile image */}
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Photo
        </div>
      </div>
      
      {/* Personal Information */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">John Doe</h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">Senior Web Developer</h2>
        
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Address:</span> 123 Main Street, Zurich, 8000, Switzerland
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +41 123 456 7890
          </p>
          <p>
            <span className="font-semibold">Email:</span> john.doe@example.com
          </p>
          <p>
            <span className="font-semibold">Nationality:</span> Swiss
          </p>
        </div>
      </div>
    </section>
  );
};

export default Header;