import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { liveArticles, categories } from "@/data";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-articles.webp";

const PER_PAGE = 12;

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = liveArticles;
    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const paged = filtered.slice(0, page * PER_PAGE);
  const hasMore = paged.length < filtered.length;

  return (
    <Layout>
      <SEOHead
        title="All Articles — Free From the System"
        description="Browse all articles on healthcare sovereignty, medical debt, health alternatives, and the math behind leaving the system."
        url="/articles"
      />

      {/* Hero */}
      <section className="page-hero min-h-[380px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">Library</p>
            <h1 className="text-white mb-4 opacity-0 animate-fade-in-up animate-delay-100">All Articles</h1>
            <p className="text-white/70 text-lg opacity-0 animate-fade-in-up animate-delay-200">
              {liveArticles.length} articles on healthcare sovereignty, medical debt freedom, and health independence.
            </p>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {/* Search + Filters */}
          <div className="flex flex-col gap-5 mb-10">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="max-w-md px-5 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-health/30 focus:border-health/50 transition-all"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedCategory("all"); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === "all"
                    ? "bg-liberty text-white shadow-sm"
                    : "bg-cream text-muted-foreground hover:bg-cream-dark"
                }`}
              >
                All ({liveArticles.length})
              </button>
              {categories.map((cat) => {
                const count = liveArticles.filter(a => a.category === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-liberty text-white shadow-sm"
                        : "bg-cream text-muted-foreground hover:bg-cream-dark"
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paged.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-12">
                  <button onClick={() => setPage(p => p + 1)} className="btn-outline">
                    Load More Articles ({filtered.length - paged.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
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
