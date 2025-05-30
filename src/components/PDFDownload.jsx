/**
 * PDFDownload component - Downloads a pre-created PDF file
 * Swiss CV standards emphasize downloadable PDF versions
 * File: src/components/PDFDownload.jsx
 */
import React from "react";
import Icon from "./common/Icon";

const PDFDownload = ({ label = "Download CV", className = "" }) => {
  // Function to handle PDF download
  const handleDownload = () => {
    // URL to the pre-created PDF file in the public folder
    const pdfUrl = "/OriolMacias_CV.pdf";

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "OriolMacias_CV.pdf"; // Suggested filename for the downloaded file
    link.target = "_blank"; // Open in new tab as fallback

    // Append to document, click to trigger download, then clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      id="pdf-download-button"
      onClick={handleDownload}
      className={`inline-flex items-center px-3 py-1.5 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
      aria-label={label}
    >
      <Icon name="download" className="mr-1.5" />
      <span>{label}</span>
    </button>
  );
};

export default PDFDownload;
