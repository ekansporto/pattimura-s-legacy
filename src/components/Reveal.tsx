import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
};

export function Reveal({ children, direction = "up", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const dirClass =
    direction === "left" ? "reveal reveal-left" : direction === "right" ? "reveal reveal-right" : "reveal";

  return (
    <div ref={ref} className={`${dirClass} ${visible ? "in-view" : ""} ${className}`}>
      {children}
    </div>
  );
}