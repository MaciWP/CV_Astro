import React from 'react';

/**
 * Componente simplificado para descargar CV
 * Esta versión no depende de html2pdf.js
 */
const PDFDownload = () => {
  // Función para preparar la impresión del navegador
  const handlePrint = () => {
    // Opcionalmente, agregar una clase para optimizar impresión
    const content = document.getElementById('cv-content');
    if (content) {
      content.classList.add('print-mode');
    }
    
    // Usar la función nativa de impresión del navegador
    window.print();
    
    // Restaurar después de imprimir
    setTimeout(() => {
      if (content) {
        content.classList.remove('print-mode');
      }
    }, 500);
  };

  return (
    <button
      id="cv-download-button"
      onClick={handlePrint}
      className="hidden md:inline-flex items-center px-3 py-1.5 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors"
      aria-label="Print CV"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      <span>Print CV</span>
    </button>
  );
};

export default PDFDownload;