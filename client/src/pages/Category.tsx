import { useParams } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { getArticlesByCategory, getCategoryBySlug } from "@/data";
import NotFound from "./NotFound";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || "");
  const articles = getArticlesByCategory(slug || "");

  if (!category) return <NotFound />;

  const heroImage = articles[0]?.heroImage;

  return (
    <Layout>
      <SEOHead
        title={`${category.name} — Free From the System`}
        description={category.description}
        url={`/category/${category.slug}`}
      />

      {/* Hero */}
      <section className="page-hero min-h-[360px]">
        {heroImage && <img src={heroImage} alt="" className="hero-bg" loading="eager" />}
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">Topic</p>
            <h1 className="text-white mb-4 opacity-0 animate-fade-in-up animate-delay-100">{category.name}</h1>
            <p className="text-white/70 text-lg opacity-0 animate-fade-in-up animate-delay-200">
              {category.description}
            </p>
            <p className="text-white/50 text-sm mt-3 opacity-0 animate-fade-in-up animate-delay-300">
              {articles.length} articles
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {articles.length > 0 && (
            <div className="mb-12">
              <ArticleCard article={articles[0]} featured />
            </div>
          )}
          {articles.length > 1 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
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
