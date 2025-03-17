import React from 'react';

const Education = () => {
  const education = [
    {
      degree: "Master of Science in Computer Science",
      institution: "ETH Zurich",
      location: "Zurich, Switzerland",
      period: "2014 - 2016",
      details: "Specialized in Web Technologies and Distributed Systems"
    },
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "University of Bern",
      location: "Bern, Switzerland",
      period: "2011 - 2014",
      details: "Graduated with honors, Minor in User Interface Design"
    }
  ];

  return (
    <section>
      <h2 className="text-xl font-bold border-b-2 border-light-accent dark:border-dark-accent high-contrast:border-black pb-2 mb-4">
        Education & Training
      </h2>
      
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex flex-col md:flex-row md:justify-between mb-2">
              <h3 className="font-bold">{edu.degree}</h3>
              <span className="text-gray-500 dark:text-gray-400">{edu.period}</span>
            </div>
            <p className="mb-1">{edu.institution}, {edu.location}</p>
            <p>{edu.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;