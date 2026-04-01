import { Link } from "wouter";
import { categories, SITE_CONFIG } from "@/data";

export default function Footer() {
  return (
    <footer className="bg-liberty text-primary-foreground">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-health via-amber to-health" />

      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L12 7L17 17" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                </svg>
              </div>
              <span className="font-serif text-xl text-white tracking-tight">
                Free From the System
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-sm text-white/40">
              By{" "}
              <a
                href={SITE_CONFIG.authorLink}
                className="text-amber hover:text-white transition-colors no-underline"
                target="_blank"
                rel="noopener"
              >
                {SITE_CONFIG.author}
              </a>
              <br />
              <span className="text-white/30">{SITE_CONFIG.authorTitle}</span>
            </p>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-5">
              Topics
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-white/55 hover:text-white transition-colors no-underline"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/start-here", label: "Start Here" },
                { href: "/compare", label: "Cost Calculator" },
                { href: "/quizzes", label: "Quizzes" },
                { href: "/assessments", label: "Assessments" },
                { href: "/tools", label: "Tools We Recommend" },
                { href: "/articles", label: "All Articles" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Kalesh" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Amazon Associate Disclosure */}
        <div className="mt-12 pt-6 border-t border-white/8">
          <p className="text-xs text-white/25 text-center leading-relaxed">
            As an Amazon Associate I earn from qualifying purchases. This site contains affiliate links — see our{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-white/40 no-underline">
              privacy policy
            </Link>{" "}
            for details.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-4 pt-4 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} Free From the System. All rights reserved. Educational content only — not medical or financial advice.
          </p>
          <div className="flex items-center gap-5">
            <a href="/rss.xml" className="text-xs text-white/25 hover:text-white/50 transition-colors no-underline">RSS</a>
            <a href="/sitemap.xml" className="text-xs text-white/25 hover:text-white/50 transition-colors no-underline">Sitemap</a>
            <a href="/llms.txt" className="text-xs text-white/25 hover:text-white/50 transition-colors no-underline">AI</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
