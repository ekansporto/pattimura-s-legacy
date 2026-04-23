import { Link, useLocation } from "@tanstack/react-router";

export function SiteHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-gradient-maroon flex items-center justify-center shadow-glow">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-beige" fill="currentColor">
              <path d="M12 2 9 9H2l5.5 4L5 21l7-4 7 4-2.5-8L22 9h-7z" />
            </svg>
          </span>
          <span className="font-serif-display text-lg tracking-wider text-beige group-hover:text-gold transition-colors">
            PAHLAWAN MALUKU
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm flex-wrap justify-end">
          {[
            { to: "/", label: "Beranda" },
            { to: "/pattimura", label: "Pattimura" },
            { to: "/martha", label: "Martha" },
            { to: "/kuis", label: "Pertempuran" },
          ].map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 sm:px-4 py-2 rounded-full transition-all font-medium text-xs sm:text-sm ${
                  active
                    ? "bg-gradient-maroon text-beige shadow-glow"
                    : "text-muted-foreground hover:text-beige hover:bg-card"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}