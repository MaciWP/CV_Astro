/**
 * PDFDownload component - Downloads a pre-created PDF file
 * Swiss CV standards emphasize downloadable PDF versions
 * File: src/components/PDFDownload.jsx
 */
import React from 'react';

const PDFDownload = ({ label = 'Download CV', className = '' }) => {
    // Function to handle PDF download
    const handleDownload = () => {
        // URL to the pre-created PDF file in the public folder
        const pdfUrl = '/OriolMacias_CV.pdf';

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'OriolMacias_CV.pdf'; // Suggested filename for the downloaded file
        link.target = '_blank'; // Open in new tab as fallback
        link.rel = 'noopener'; // Security: prevent window.opener leaks

        // Append to document, click to trigger download, then clean up
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
        type="button"
            id="cv-download-button"
            onClick={handleDownload}
            className={`inline-flex items-center px-3 py-1.5 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
            aria-label={label}
        >
            <i className="fas fa-download mr-1.5"></i>
            <span>{label}</span>
        </button>
    );
};

export default PDFDownload;