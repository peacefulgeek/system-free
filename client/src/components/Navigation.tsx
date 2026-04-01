import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { categories } from "@/data";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const linkClass = (path: string) =>
    `text-sm font-semibold tracking-wide transition-colors no-underline ${
      location === path || (path !== "/" && location.startsWith(path))
        ? "text-health"
        : "text-foreground/65 hover:text-foreground"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-background border-b border-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-[4.25rem]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-9 h-9 rounded-lg bg-liberty flex items-center justify-center group-hover:bg-health transition-colors duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L12 7L17 17" />
              <line x1="9" y1="13" x2="15" y2="13" />
            </svg>
          </div>
          <span className="font-serif text-xl text-liberty tracking-tight">
            Free From the System
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          <Link href="/start-here" className={linkClass("/start-here")}>
            Start Here
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 ${
              location.startsWith("/category") ? "text-health" : "text-foreground/65 hover:text-foreground"
            }`}>
              Topics <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64">
                <div className="bg-card rounded-xl shadow-xl border border-border/60 py-2 animate-fade-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-foreground/75 hover:bg-cream hover:text-foreground transition-colors no-underline"
                      onClick={() => setCatOpen(false)}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-health/40 flex-shrink-0" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/articles" className={linkClass("/articles")}>
            Articles
          </Link>
          <Link href="/tools" className={linkClass("/tools")}>
            Tools
          </Link>
          <Link href="/compare" className={linkClass("/compare")}>
            Calculator
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background animate-fade-in">
          <div className="container py-5 space-y-1">
            {[
              { href: "/start-here", label: "Start Here" },
              { href: "/articles", label: "All Articles" },
              { href: "/tools", label: "Tools We Recommend" },
              { href: "/assessments", label: "Assessments" },
              { href: "/quizzes", label: "Quizzes" },
              { href: "/compare", label: "Cost Calculator" },
              { href: "/about", label: "About Kalesh" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block py-3 px-3 rounded-lg text-sm font-semibold no-underline transition-colors ${
                  location === href ? "bg-health/10 text-health" : "text-foreground/70 hover:bg-cream hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border/50 mt-3">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2 px-3">Topics</p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block py-2.5 px-3 pl-6 text-sm text-foreground/60 hover:text-foreground no-underline"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
