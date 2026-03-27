import { useParams } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory, getCategoryBySlug } from "@/data";
import NotFound from "./NotFound";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || "");
  const articles = getArticlesByCategory(slug || "");

  if (!category) return <NotFound />;

  return (
    <Layout>
      <SEOHead
        title={category.name}
        description={category.description}
        url={`/category/${category.slug}`}
      />

      <section className="container py-12">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-3">
            Topic
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-4">
            {category.name}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {category.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {articles.length} articles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
