import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { liveArticles, categories, SITE_CONFIG } from "@/data";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-home.webp";

const featured = liveArticles.slice(0, 6);
const latest = liveArticles.slice(0, 3);

export default function Home() {
  return (
    <Layout>
      <SEOHead
        title="Free From the System — Healthcare Sovereignty Starts Here"
        description={SITE_CONFIG.description}
        url="/"
      />

      {/* ─── Hero ─────────────────────────────────── */}
      <section className="page-hero min-h-[560px] md:min-h-[640px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">
              Healthcare Sovereignty
            </p>
            <h1 className="text-white mb-6 opacity-0 animate-fade-in-up animate-delay-100" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.25rem)', lineHeight: 1.08 }}>
              The system is broken.{" "}
              <span className="text-health" style={{ fontStyle: 'italic' }}>
                Your health doesn't have to be.
              </span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl opacity-0 animate-fade-in-up animate-delay-200">
              Evidence-based strategies for healthcare independence, medical debt freedom, and the kind of health sovereignty that comes from understanding the system well enough to leave it behind.
            </p>
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up animate-delay-300">
              <Link href="/start-here" className="btn-primary">
                Start Your Journey
              </Link>
              <Link href="/articles" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50">
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Articles ────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">Latest Thinking</p>
              <h2 className="text-liberty">Featured Articles</h2>
            </div>
            <Link href="/articles" className="text-health font-semibold text-sm mt-4 md:mt-0 hover:underline no-underline">
              View all articles &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category Showcase ────────────────────── */}
      <section className="section-sage py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">Explore by Topic</p>
            <h2 className="text-liberty mb-4">Five Paths to Freedom</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Each category represents a different dimension of healthcare sovereignty. Start wherever resonates most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const catArticles = liveArticles.filter(a => a.category === cat.slug);
              const catImage = catArticles[0]?.heroImage;
              const icons = ["🚪", "🌿", "📊", "⛓️", "👑"];
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`rich-card group no-underline ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  <div className="overflow-hidden">
                    {catImage && (
                      <img
                        src={catImage}
                        alt={cat.name}
                        loading="lazy"
                        className={`w-full object-cover ${i === 0 ? 'h-52' : 'h-40'}`}
                        style={{ aspectRatio: 'auto' }}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-2xl mb-2 block">{icons[i]}</span>
                    <h3 className="text-liberty text-xl mb-2 group-hover:text-health transition-colors">{cat.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{cat.description}</p>
                    <p className="text-xs text-health font-semibold mt-3">{catArticles.length} articles</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Why This Exists ──────────────────────── */}
      <section className="section-deep py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-amber mb-4">The Mission</p>
            <h2 className="text-white mb-8" style={{ fontStyle: 'italic' }}>
              "The mind is not the enemy. The system that profits from your confusion is."
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Free From the System exists because healthcare should not require financial ruin. We publish evidence-based research on alternatives to traditional insurance, strategies for eliminating medical debt, and practical paths to health sovereignty — written by someone who has walked this path.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about" className="btn-primary">
                Meet Kalesh
              </Link>
              <Link href="/compare" className="btn-outline !border-white/20 !text-white hover:!bg-white/10 hover:!border-white/40">
                Cost Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Latest + Quick Links ─────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Latest articles */}
            <div className="lg:col-span-2">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">Just Published</p>
              <h2 className="text-liberty mb-8">Latest Articles</h2>
              <div className="space-y-6">
                {latest.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="flex gap-5 group no-underline"
                  >
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-28 h-28 md:w-36 md:h-28 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col justify-center">
                      <span className="badge-category mb-2 w-fit">{article.categoryName}</span>
                      <h3 className="text-liberty text-lg leading-snug group-hover:text-health transition-colors mb-1">{article.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{article.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick links */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-liberty text-lg mb-4">Quick Start</h3>
                <div className="space-y-3">
                  {[
                    { href: "/start-here", label: "Start Here Guide", icon: "📖" },
                    { href: "/compare", label: "Cost Calculator", icon: "🧮" },
                    { href: "/quizzes", label: "Take a Quiz", icon: "✅" },
                    { href: "/assessments", label: "Self-Assessment", icon: "📋" },
                    { href: "/tools", label: "Recommended Tools", icon: "🛠️" },
                  ].map(({ href, label, icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-dark transition-colors no-underline text-foreground"
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="font-medium text-sm">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-liberty rounded-xl p-6 text-white">
                <h3 className="text-white text-lg mb-4">By the Numbers</h3>
                <div className="space-y-4">
                  {[
                    { num: `${liveArticles.length}+`, label: "Articles Published" },
                    { num: "5", label: "Topic Categories" },
                    { num: "9", label: "Interactive Quizzes" },
                    { num: "8", label: "Self-Assessments" },
                  ].map(({ num, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-2xl font-serif text-amber">{num}</span>
                      <span className="text-white/70 text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ───────────────────────────── */}
      <section className="section-warm py-20 md:py-28">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </Layout>
  );
}
