import React from 'react';

const PDFDownload = () => {
  const handleDownload = () => {
    alert('PDF download functionality will be implemented here');
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Download PDF"
    >
      Download PDF
    </button>
  );
};

export default PDFDownload;