import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Newsletter from "@/components/Newsletter";
import { categories, liveArticles, SITE_CONFIG } from "@/data";

export default function StartHere() {
  // Pick one representative article per category
  const picks = categories.map((cat) => {
    const arts = liveArticles.filter((a) => a.category === cat.slug);
    return { category: cat, article: arts[0] };
  });

  return (
    <Layout>
      <SEOHead
        title="Start Here"
        description="New to Free From the System? Start here. A guided introduction to healthcare sovereignty, the five pillars, and your path to freedom."
        url="/start-here"
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
            Welcome
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-6 leading-[1.1]">
            Start Here
          </h1>
          <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
            <p>
              Something brought you here. Maybe it was a medical bill that made
              no sense. Maybe it was the realization that the system designed to
              keep you healthy is the same system keeping you broke. Maybe it was
              just a quiet knowing that there has to be another way.
            </p>
            <p>
              There is. And you're in the right place.
            </p>
            <p>
              <strong className="text-foreground">Free From the System</strong>{" "}
              is a resource for people who are ready to take their health — and
              their financial sovereignty — back from a system that was never
              designed to serve them. Written by{" "}
              <a
                href={SITE_CONFIG.authorLink}
                className="text-health hover:text-health-dark underline underline-offset-2"
                target="_blank"
                rel="noopener"
              >
                {SITE_CONFIG.author}
              </a>
              , this site covers everything from the math behind healthcare costs
              to the alternatives the industry doesn't want you to know about.
            </p>
          </div>
        </div>
      </section>

      {/* The Five Pillars */}
      <section className="bg-cream-dark py-16">
        <div className="container">
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif text-3xl text-liberty mb-4">
              The Five Pillars
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Everything on this site is organized around five pillars. Each one
              addresses a different dimension of healthcare sovereignty. Start
              with whichever speaks to where you are right now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {picks.map(({ category, article }) => (
              <div
                key={category.slug}
                className="bg-card rounded-lg p-6 border border-border"
              >
                <h3 className="font-serif text-xl text-liberty mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {category.description}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {category.articleCount} articles
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm font-medium text-health hover:text-health-dark transition-colors no-underline"
                  >
                    Browse all &rarr;
                  </Link>
                  {article && (
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
                    >
                      Start with: {article.title}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reading Paths */}
      <section className="container py-16">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl text-liberty mb-6">
            Suggested Reading Paths
          </h2>
          <div className="space-y-8">
            <div className="border-l-3 border-health pl-6">
              <h3 className="font-serif text-xl text-liberty mb-2">
                "I'm drowning in medical debt"
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Start with The Debt pillar. Learn your rights, negotiation
                strategies, and the path to financial recovery. Then move to The
                Math to understand why the numbers never made sense.
              </p>
              <Link
                href="/category/the-debt"
                className="text-sm font-medium text-health hover:text-health-dark transition-colors no-underline"
              >
                Start this path &rarr;
              </Link>
            </div>

            <div className="border-l-3 border-health pl-6">
              <h3 className="font-serif text-xl text-liberty mb-2">
                "I want to leave employer insurance"
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                The Escape pillar is your roadmap. DPC, health shares,
                catastrophic plans, and the transition strategy. Pair it with The
                Math to run the numbers for your situation.
              </p>
              <Link
                href="/category/the-escape"
                className="text-sm font-medium text-health hover:text-health-dark transition-colors no-underline"
              >
                Start this path &rarr;
              </Link>
            </div>

            <div className="border-l-3 border-health pl-6">
              <h3 className="font-serif text-xl text-liberty mb-2">
                "I want to take control of my health"
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Begin with The Sovereignty pillar for the philosophy and the five
                pillars framework. Then explore The Alternative for evidence-based
                approaches the mainstream system ignores.
              </p>
              <Link
                href="/category/the-sovereignty"
                className="text-sm font-medium text-health hover:text-health-dark transition-colors no-underline"
              >
                Start this path &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="bg-liberty py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl text-white mb-4">
              Interactive Tools
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-8">
              Beyond the articles, we've built tools to help you make informed
              decisions about your healthcare future.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/compare"
                className="block p-6 bg-white/10 rounded-lg border border-white/10 hover:bg-white/15 transition-colors no-underline"
              >
                <h3 className="font-serif text-xl text-white mb-2">
                  Cost Calculator
                </h3>
                <p className="text-sm text-white/60">
                  Compare traditional insurance vs. DPC + catastrophic. See the
                  real numbers for your situation.
                </p>
              </Link>
              <Link
                href="/quizzes"
                className="block p-6 bg-white/10 rounded-lg border border-white/10 hover:bg-white/15 transition-colors no-underline"
              >
                <h3 className="font-serif text-xl text-white mb-2">
                  Self-Assessment Quizzes
                </h3>
                <p className="text-sm text-white/60">
                  9 quizzes to help you understand your readiness for healthcare
                  sovereignty.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
