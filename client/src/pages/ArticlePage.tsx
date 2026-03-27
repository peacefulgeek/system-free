import { useParams } from "wouter";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { getArticleBySlug, getRelatedArticles, SITE_CONFIG } from "@/data";
import NotFound from "./NotFound";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || "");

  if (!article) return <NotFound />;

  const related = getRelatedArticles(article, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: article.heroImage,
    datePublished: article.dateISO,
    dateModified: article.dateISO,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.authorLink,
      jobTitle: SITE_CONFIG.authorTitle,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/articles/${article.slug}`,
    },
    wordCount: article.body.split(/\s+/).length,
    articleSection: article.categoryName,
  };

  return (
    <Layout>
      <SEOHead
        title={article.title}
        description={article.metaDescription}
        url={`/articles/${article.slug}`}
        image={article.ogImage}
        type="article"
        publishedTime={article.dateISO}
        author={SITE_CONFIG.author}
        jsonLd={jsonLd}
      />

      <article>
        {/* Hero Image */}
        <div className="w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-liberty/5">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Header */}
        <div className="container">
          <div className="max-w-[720px] mx-auto py-10">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/category/${article.category}`}
                className="text-xs font-semibold uppercase tracking-widest text-health hover:text-health-dark transition-colors no-underline"
              >
                {article.categoryName}
              </Link>
              <span className="text-xs text-muted-foreground">
                {article.dateHuman}
              </span>
              <span className="text-xs text-muted-foreground">
                {article.readingTime} min read
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-liberty leading-[1.1] mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {article.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-liberty flex items-center justify-center text-white font-serif text-lg">
                K
              </div>
              <div>
                <a
                  href={SITE_CONFIG.authorLink}
                  className="text-sm font-medium text-foreground hover:text-health transition-colors no-underline"
                  target="_blank"
                  rel="noopener"
                >
                  {SITE_CONFIG.author}
                </a>
                <p className="text-xs text-muted-foreground">
                  {SITE_CONFIG.authorTitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="container">
          <div
            className="max-w-[720px] mx-auto article-prose pb-12"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>

        {/* Author Box */}
        <div className="container">
          <div className="max-w-[720px] mx-auto py-8 border-t border-border">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-liberty flex items-center justify-center text-white font-serif text-2xl flex-shrink-0">
                K
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-health mb-1">
                  Written by
                </p>
                <a
                  href={SITE_CONFIG.authorLink}
                  className="font-serif text-xl text-liberty hover:text-health transition-colors no-underline"
                  target="_blank"
                  rel="noopener"
                >
                  {SITE_CONFIG.author}
                </a>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {SITE_CONFIG.authorTitle}. Exploring the intersection of
                  consciousness, healthcare sovereignty, and the clarity that
                  comes from questioning what the system taught you to accept.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="container py-12">
          <h2 className="font-serif text-2xl text-liberty mb-8">
            Keep Reading
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </Layout>
  );
}
