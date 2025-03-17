import React from 'react';

const Languages = () => {
  const languages = [
    {
      language: "English",
      level: "Fluent (C2)",
    },
    {
      language: "German",
      level: "Fluent (C2)",
    },
    {
      language: "French",
      level: "Advanced (C1)",
    },
    {
      language: "Italian",
      level: "Intermediate (B1)",
    }
  ];

  return (
    <section>
      <h2 className="text-xl font-bold border-b-2 border-light-accent dark:border-dark-accent high-contrast:border-black pb-2 mb-4">
        Languages
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang, index) => (
          <div key={index} className="flex justify-between">
            <span className="font-medium">{lang.language}</span>
            <span className="text-gray-600 dark:text-gray-300">{lang.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Languages;