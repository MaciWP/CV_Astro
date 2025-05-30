import React, { useEffect, useRef } from "react";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const prefetched = new Set<string>();
let prefetchedCount = 0;
const PREFETCH_LIMIT = 2;

function prefetch(url: string) {
  if (prefetched.has(url) || prefetchedCount >= PREFETCH_LIMIT) return;
  try {
    fetch(url, { credentials: "include" }).catch(() => {});
    prefetched.add(url);
    prefetchedCount += 1;
  } catch {
    // ignore errors
  }
}

/**
 * Link component that prefetches internal pages on pointer hover
 * Limited to viewport links plus two extra to avoid bandwidth waste.
 */
const Link: React.FC<LinkProps> = ({ href = "", children, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const anchor = ref.current;
    if (!anchor || !href.startsWith("/")) return;

    const handlePointerEnter = () => prefetch(href);

    anchor.addEventListener("pointerenter", handlePointerEnter);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetch(href);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" },
    );

    observer.observe(anchor);

    return () => {
      anchor.removeEventListener("pointerenter", handlePointerEnter);
      observer.disconnect();
    };
  }, [href]);

  return (
    <a ref={ref} href={href} {...props}>
      {children}
    </a>
  );
};

export default Link;
