import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import { liveArticles, categories } from "@/data";

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <Layout>
      <SEOHead
        title="All Articles"
        description="Browse all articles on healthcare sovereignty, medical debt, health alternatives, and the math behind leaving the system."
        url="/articles"
      />

      <section className="container py-12">
        <div className="max-w-3xl mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-4">
            All Articles
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {liveArticles.length} articles on healthcare sovereignty, medical
            debt freedom, and the alternatives the system doesn't want you to
            know about.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-sm px-4 py-2.5 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-health/30"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === "all"
                  ? "bg-liberty text-white"
                  : "bg-cream-dark text-foreground/60 hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-liberty text-white"
                    : "bg-cream-dark text-foreground/60 hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No articles found. Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
