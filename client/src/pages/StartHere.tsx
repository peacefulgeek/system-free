import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Newsletter from "@/components/Newsletter";
import { categories, liveArticles, SITE_CONFIG } from "@/data";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-start-here.webp";

export default function StartHere() {
  const picks = categories.map((cat) => {
    const arts = liveArticles.filter((a) => a.category === cat.slug);
    return { category: cat, article: arts[0] };
  });

  const icons = ["🚪", "🌿", "📊", "⛓️", "👑"];

  return (
    <Layout>
      <SEOHead
        title="Start Here — Your Path to Healthcare Sovereignty"
        description="New to Free From the System? Start here. A guided introduction to healthcare sovereignty, the five pillars, and your path to freedom."
        url="/start-here"
      />

      {/* Hero */}
      <section className="page-hero min-h-[480px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">Welcome</p>
            <h1 className="text-white mb-6 opacity-0 animate-fade-in-up animate-delay-100">Start Here</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl opacity-0 animate-fade-in-up animate-delay-200">
              Something brought you here. Maybe it was a medical bill that made no sense. Maybe it was the quiet knowing that there has to be another way. There is.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed space-y-5">
            <p>
              <strong className="text-foreground">Free From the System</strong> is a resource for people who are ready to take their health — and their financial sovereignty — back from a system that was never designed to serve them.
            </p>
            <p>
              Written by{" "}
              <a href={SITE_CONFIG.authorLink} className="text-health hover:text-health-dark underline underline-offset-2" target="_blank" rel="noopener">
                {SITE_CONFIG.author}
              </a>, this site covers everything from the math behind healthcare costs to the alternatives the industry doesn't want you to know about.
            </p>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="section-sage py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">The Framework</p>
            <h2 className="text-liberty mb-4">Five Pillars of Freedom</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything on this site is organized around five pillars. Each one addresses a different dimension of healthcare sovereignty.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {picks.map(({ category, article }, i) => (
              <div key={category.slug} className={`rich-card p-7 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <span className="text-3xl mb-3 block">{icons[i]}</span>
                <h3 className="text-liberty text-xl mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{category.description}</p>
                <p className="text-xs text-muted-foreground mb-4">{category.articleCount} articles</p>
                <div className="flex flex-col gap-2">
                  <Link href={`/category/${category.slug}`} className="text-sm font-semibold text-health hover:underline no-underline">
                    Browse all &rarr;
                  </Link>
                  {article && (
                    <Link href={`/articles/${article.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">
                      Start with: <em>{article.title}</em>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reading Paths */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">Guided Paths</p>
            <h2 className="text-liberty mb-10">Where Are You Right Now?</h2>
            <div className="space-y-10">
              {[
                {
                  q: "I'm drowning in medical debt",
                  a: "Start with The Debt pillar. Learn your rights, negotiation strategies, and the path to financial recovery. Then move to The Math to understand why the numbers never made sense.",
                  link: "/category/medical-debt-elimination",
                  label: "Start this path",
                },
                {
                  q: "I want to leave employer insurance",
                  a: "The Escape pillar is your roadmap. DPC, health shares, catastrophic plans, and the transition strategy. Pair it with The Math to run the numbers for your situation.",
                  link: "/category/escaping-traditional-healthcare",
                  label: "Start this path",
                },
                {
                  q: "I want to take control of my health",
                  a: "Begin with The Sovereignty pillar for the philosophy and the five pillars framework. Then explore The Alternative for evidence-based approaches the mainstream system ignores.",
                  link: "/category/health-sovereignty",
                  label: "Start this path",
                },
              ].map(({ q, a, link, label }) => (
                <div key={q} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-1 rounded-full bg-health/20 group-hover:bg-health transition-colors" />
                  <div>
                    <h3 className="text-liberty text-xl mb-2 font-serif" style={{ fontStyle: 'italic' }}>"{q}"</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">{a}</p>
                    <Link href={link} className="text-sm font-semibold text-health hover:underline no-underline">
                      {label} &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="section-deep py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-amber mb-3">Beyond Reading</p>
            <h2 className="text-white mb-4">Interactive Tools</h2>
            <p className="text-white/60 leading-relaxed mb-10 max-w-xl mx-auto">
              Beyond the articles, we've built tools to help you make informed decisions about your healthcare future.
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { href: "/compare", icon: "🧮", title: "Cost Calculator", desc: "Compare traditional insurance vs. DPC + catastrophic." },
                { href: "/quizzes", icon: "✅", title: "Quizzes", desc: "9 quizzes to assess your readiness for healthcare sovereignty." },
                { href: "/assessments", icon: "📋", title: "Assessments", desc: "8 in-depth self-assessments with downloadable results." },
              ].map(({ href, icon, title, desc }) => (
                <Link key={href} href={href} className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all no-underline group">
                  <span className="text-3xl mb-3 block">{icon}</span>
                  <h3 className="text-white text-lg mb-2 group-hover:text-amber transition-colors">{title}</h3>
                  <p className="text-sm text-white/50">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-warm py-20 md:py-28">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </Layout>
  );
}
