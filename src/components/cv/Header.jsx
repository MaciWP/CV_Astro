import React, { useState, useEffect } from 'react';

/**
 * Componente de cabecera simplificado sin dependencias de traducción
 */
const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Efecto para animar la entrada del componente
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="about" className="pt-4 pb-8">
      {/* Grid para layout responsive */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Información personal - toma más espacio en pantallas medianas */}
        <div className="md:col-span-8 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Oriol Macias</h1>
            <h2 className="text-xl md:text-2xl text-red-600 dark:text-red-500 font-medium">
              Software Developer
            </h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg max-w-2xl">
            Experienced Software Developer with a strong background in application development, 
            problem-solving, and software design. Skilled in creating efficient solutions and 
            implementing technical requirements. Currently expanding knowledge in AI through 
            specialized training programs.
          </p>

          <div className="flex flex-wrap gap-6">
            {/* Email */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <a href="mailto:email@example.com" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">
                email@example.com
              </a>
            </div>
            
            {/* Teléfono */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <a href="tel:+1234567890" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">
                +1234567890
              </a>
            </div>
            
            {/* LinkedIn */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 dark:hover:text-red-500 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Foto de perfil - toma menos espacio en pantallas medianas */}
        <div className="md:col-span-4 flex justify-center md:justify-end">
          <div className={`relative w-40 h-40 md:w-48 md:h-48 overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
            {/* Placeholder para la imagen */}
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            {/* Borde adicional para efecto de marco */}
            <div className="absolute inset-0 border border-gray-200 dark:border-gray-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;