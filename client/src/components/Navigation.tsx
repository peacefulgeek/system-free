import { useState } from "react";
import { Link, useLocation } from "wouter";
import { categories } from "@/data";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
      <nav className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
            <circle cx="16" cy="16" r="15" fill="#1E3A5F" />
            <path
              d="M10 20 L16 8 L22 20"
              stroke="#4CAF50"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="12"
              y1="16"
              x2="20"
              y2="16"
              stroke="#4CAF50"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-serif text-xl text-liberty tracking-tight">
            Free From the System
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/start-here"
            className={`text-sm font-medium transition-colors no-underline ${
              location === "/start-here"
                ? "text-health"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Start Here
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                location.startsWith("/category")
                  ? "text-health"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Topics <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 pt-2 w-56">
                <div className="bg-card rounded-lg shadow-lg border border-border py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-cream-dark hover:text-foreground transition-colors no-underline"
                      onClick={() => setCatOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/articles"
            className={`text-sm font-medium transition-colors no-underline ${
              location === "/articles"
                ? "text-health"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            All Articles
          </Link>

          <Link
            href="/compare"
            className={`text-sm font-medium transition-colors no-underline ${
              location === "/compare"
                ? "text-health"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Calculator
          </Link>

          <Link
            href="/about"
            className={`text-sm font-medium transition-colors no-underline ${
              location === "/about"
                ? "text-health"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            About
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground/70"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-cream">
          <div className="container py-4 space-y-3">
            <Link
              href="/start-here"
              className="block text-sm font-medium text-foreground/80 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              Start Here
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="block text-sm font-medium text-foreground/60 pl-4 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/articles"
              className="block text-sm font-medium text-foreground/80 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              All Articles
            </Link>
            <Link
              href="/compare"
              className="block text-sm font-medium text-foreground/80 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              Calculator
            </Link>
            <Link
              href="/about"
              className="block text-sm font-medium text-foreground/80 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
