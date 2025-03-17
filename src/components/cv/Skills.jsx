import React from 'react';

const Skills = () => {
  const skillCategories = [
    {
      category: "Programming Languages",
      skills: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3/SCSS", "Python", "PHP"]
    },
    {
      category: "Frameworks & Libraries",
      skills: ["React", "Angular", "Vue.js", "Express.js", "Next.js", "Tailwind CSS", "Bootstrap"]
    },
    {
      category: "Tools & Platforms",
      skills: ["Git", "Docker", "AWS", "Firebase", "Netlify", "Webpack", "Jest", "Cypress"]
    },
    {
      category: "Methodologies",
      skills: ["Agile/Scrum", "Test-Driven Development", "CI/CD", "Responsive Design", "Accessibility (WCAG)"]
    }
  ];

  return (
    <section>
      <h2 className="text-xl font-bold border-b-2 border-light-accent dark:border-dark-accent high-contrast:border-black pb-2 mb-4">
        Technical Skills
      </h2>
      
      <div className="space-y-4">
        {skillCategories.map((category, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-semibold mb-2">{category.category}:</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, i) => (
                <span 
                  key={i} 
                  className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;