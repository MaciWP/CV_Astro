import { useState } from "react";

interface Props {
  extra: string[];
  showMore: string;
  showLess: string;
}

const ExperienceExtras = ({ extra, showMore, showLess }: Props) => {
  const [open, setOpen] = useState(false);
  if (!extra || extra.length === 0) return null;
  return (
    <>
      {open && (
        <ul className="space-y-3 text-light-text dark:text-dark-text transition-colors duration-150 mb-3 animate-fade-in">
          {extra.map((responsibility, i) => (
            <li
              key={i}
              className="flex items-start gap-2 group/item hover:translate-x-1 transition-all duration-150"
            >
              <span className="w-1.5 h-1.5 bg-brand-red flex-shrink-0 mt-2 transition-all duration-150 group-hover/item:scale-125"></span>
              <span>{responsibility}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="text-xs inline-flex items-center gap-1 text-brand-red hover:text-brand-red/80 mb-5 focus:outline-none focus:underline"
        aria-expanded={open}
      >
        <i className={`fas fa-chevron-${open ? "up" : "down"} text-xs`}></i>
        {open ? showLess : showMore}
      </button>
    </>
  );
};

export default ExperienceExtras;
