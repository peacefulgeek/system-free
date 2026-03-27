import { Link } from "wouter";
import { categories, SITE_CONFIG } from "@/data";

export default function Footer() {
  return (
    <footer className="bg-liberty text-primary-foreground mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl text-white mb-3">
              Free From the System
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-sm text-white/40 mt-4">
              By{" "}
              <a
                href={SITE_CONFIG.authorLink}
                className="text-health underline underline-offset-2 hover:text-white transition-colors"
                target="_blank"
                rel="noopener"
              >
                {SITE_CONFIG.author}
              </a>
              <br />
              {SITE_CONFIG.authorTitle}
            </p>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Topics
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/start-here"
                  className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                >
                  Start Here
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                >
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/quizzes"
                  className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                >
                  All Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/60 hover:text-white transition-colors no-underline"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Free From the System. All rights
            reserved. Educational content only — not medical or financial advice.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/rss.xml"
              className="text-xs text-white/30 hover:text-white/60 transition-colors no-underline"
            >
              RSS
            </a>
            <a
              href="/sitemap.xml"
              className="text-xs text-white/30 hover:text-white/60 transition-colors no-underline"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
