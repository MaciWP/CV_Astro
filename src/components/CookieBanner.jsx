import React, { useState, useEffect } from "react";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("pixel_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("pixel_consent", "granted");
    setVisible(false);
    document.dispatchEvent(new CustomEvent("pixel-consent-granted"));
  };

  if (!visible) return <div aria-hidden className="h-14" />;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between text-sm z-50">
      <span className="mb-2 sm:mb-0">
        This site uses cookies to improve your experience.
      </span>
      <button
        onClick={accept}
        className="px-3 py-1 bg-brand-red text-white rounded-none"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieBanner;
