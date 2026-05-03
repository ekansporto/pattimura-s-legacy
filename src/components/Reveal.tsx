import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
};

export function Reveal({ children, direction = "up", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    setVisible(false);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    // Safety: ensure content becomes visible even if observer never fires
    const fallback = setTimeout(() => setVisible(true), 1500 + delay);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, [delay]);

  const dirClass =
    direction === "left" ? "reveal reveal-left" : direction === "right" ? "reveal reveal-right" : "reveal";

  return (
    <div ref={ref} className={`${dirClass} ${visible ? "in-view" : ""} ${className}`}>
      {children}
    </div>
  );
}