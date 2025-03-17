import React from 'react';

const Experience = () => {
  const experiences = [
    {
      title: "Senior Frontend Developer",
      company: "Tech Solutions AG",
      location: "Zurich, Switzerland",
      period: "January 2020 - Present",
      responsibilities: [
        "Lead a team of 5 developers in creating responsive web applications using React and TypeScript",
        "Improved application performance by 40% through code optimization and implementing lazy loading",
        "Developed and maintained the company's component library used across multiple projects",
        "Collaborated with UX designers to implement WCAG 2.1 AA compliant interfaces"
      ]
    },
    {
      title: "Frontend Developer",
      company: "Digital Innovations GmbH",
      location: "Bern, Switzerland",
      period: "March 2017 - December 2019",
      responsibilities: [
        "Built and maintained multiple client-facing web applications using Angular",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Mentored junior developers and conducted code reviews",
        "Participated in agile development processes, including daily stand-ups and sprint planning"
      ]
    }
  ];

  return (
    <section>
      <h2 className="text-xl font-bold border-b-2 border-light-accent dark:border-dark-accent high-contrast:border-black pb-2 mb-4">
        Work Experience
      </h2>
      
      <div className="space-y-6">
        {experiences.map((job, index) => (
          <div key={index} className="mb-4">
            <div className="flex flex-col md:flex-row md:justify-between mb-2">
              <h3 className="font-bold">{job.title}</h3>
              <span className="text-gray-500 dark:text-gray-400">{job.period}</span>
            </div>
            <p className="mb-2">{job.company}, {job.location}</p>
            <ul className="list-disc pl-5 space-y-1">
              {job.responsibilities.map((responsibility, i) => (
                <li key={i}>{responsibility}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;