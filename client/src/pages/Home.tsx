import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { liveArticles, categories, SITE_CONFIG } from "@/data";

export default function Home() {
  const featured = liveArticles[0];
  const recent = liveArticles.slice(1, 7);
  const byCategory = categories.map((cat) => ({
    ...cat,
    articles: liveArticles
      .filter((a) => a.category === cat.slug)
      .slice(0, 3),
  }));

  return (
    <Layout>
      <SEOHead />

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark" />
        <div className="container relative">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
              Healthcare Sovereignty
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-liberty mb-6 leading-[1.05]">
              The system is broken.
              <br />
              <span className="text-health italic">
                Your health doesn't have to be.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Evidence-based strategies for healthcare independence, medical debt
              freedom, and the kind of health sovereignty that comes from
              understanding the system well enough to leave it behind.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/start-here"
                className="inline-flex items-center px-6 py-3 bg-health text-white font-medium text-sm rounded-md hover:bg-health-dark transition-colors no-underline"
              >
                Start Here
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 bg-liberty text-white font-medium text-sm rounded-md hover:bg-liberty-light transition-colors no-underline"
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-liberty">Featured</h2>
          </div>
          <ArticleCard article={featured} featured />
        </section>
      )}

      {/* Recent Articles */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl text-liberty">Recent</h2>
          <Link
            href="/articles"
            className="text-sm font-medium text-health hover:text-health-dark transition-colors no-underline"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Category Sections */}
      {byCategory.map(
        (cat) =>
          cat.articles.length > 0 && (
            <section key={cat.slug} className="container py-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif text-2xl text-liberty">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cat.description}
                  </p>
                </div>
                <Link
                  href={`/category/${cat.slug}`}
                  className="text-sm font-medium text-health hover:text-health-dark transition-colors no-underline whitespace-nowrap"
                >
                  See all &rarr;
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {cat.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )
      )}

      {/* Newsletter */}
      <Newsletter />

      {/* About Kalesh */}
      <section className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
            About the Author
          </p>
          <h2 className="font-serif text-3xl text-liberty mb-4">
            {SITE_CONFIG.author}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {SITE_CONFIG.authorTitle}. Writing at the intersection of
            consciousness, healthcare sovereignty, and the kind of clarity that
            only comes from questioning everything the system taught you to
            accept.
          </p>
          <a
            href={SITE_CONFIG.authorLink}
            className="inline-flex items-center text-sm font-medium text-health hover:text-health-dark transition-colors"
            target="_blank"
            rel="noopener"
          >
            Visit kalesh.love &rarr;
          </a>
        </div>
      </section>
    </Layout>
  );
}
