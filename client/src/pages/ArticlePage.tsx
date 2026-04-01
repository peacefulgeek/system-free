import { useParams } from "wouter";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { getArticleBySlug, getRelatedArticles, SITE_CONFIG } from "@/data";
import NotFound from "./NotFound";
import { Heart, ExternalLink } from "lucide-react";

const AUTHOR_PHOTO = "https://system-free.b-cdn.net/images/kalesh-author-thumb.webp";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || "");

  if (!article) return <NotFound />;

  const related = getRelatedArticles(article, 3);
  const hasAffiliateLink = article.hasAffiliateLink || false;

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

  // FAQ schema if article has FAQs
  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article>
        {/* Hero Image */}
        <div className="w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-liberty/5">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
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
          </div>
        </div>

        {/* Main Content Area with Sidebar */}
        <div className="container">
          <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row gap-10">
            {/* Article Body */}
            <div className="flex-1 min-w-0">
              {/* Affiliate Disclosure Box (only for articles with Amazon links) */}
              {hasAffiliateLink && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-8 text-sm text-amber-900">
                  This article contains affiliate links. We may earn a small
                  commission at no extra cost to you.
                </div>
              )}

              <div
                className="article-prose pb-8"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />

              {/* Health Disclaimer Card */}
              <div className="bg-cream-dark border border-border rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-health flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-base text-liberty mb-2">
                      Health Information Disclaimer
                    </h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      This article is for educational purposes only and does not
                      constitute medical advice. The information presented here
                      reflects research and personal perspective — it is not a
                      substitute for professional medical consultation. Always
                      consult a qualified healthcare provider before making
                      changes to your health regimen or discontinuing any
                      treatment. Your health decisions should be made in
                      partnership with professionals who understand your
                      individual circumstances.
                    </p>
                  </div>
                </div>
              </div>

              {/* Author Box */}
              <div className="py-8 border-t border-border">
                <div className="flex items-start gap-4">
                  <img
                    src={AUTHOR_PHOTO}
                    alt="Kalesh"
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
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

            {/* Sidebar — Kalesh Bio */}
            <aside className="lg:w-[280px] flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Author Card */}
                <div className="bg-white border border-border rounded-xl p-6 text-center">
                  <img
                    src={AUTHOR_PHOTO}
                    alt="Kalesh"
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                    loading="lazy"
                  />
                  <h3 className="font-serif text-lg text-liberty mb-1">
                    Kalesh
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Consciousness Teacher & Writer
                  </p>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-4">
                    Guiding seekers toward clarity, sovereignty, and the kind of
                    health freedom that begins with awareness.
                  </p>
                  <a
                    href="https://kalesh.love"
                    target="_blank"
                    rel="noopener"
                    className="block w-full bg-health text-white text-sm font-medium py-2.5 rounded-lg hover:bg-health-dark transition-colors no-underline mb-2"
                  >
                    Visit Kalesh's Website
                  </a>
                  <a
                    href="https://kalesh.love"
                    target="_blank"
                    rel="noopener"
                    className="block w-full border border-liberty text-liberty text-sm font-medium py-2.5 rounded-lg hover:bg-liberty hover:text-white transition-colors no-underline"
                  >
                    Book a Session
                  </a>
                </div>

                {/* Tools Recommendation */}
                <div className="bg-cream-dark border border-border rounded-xl p-5">
                  <h4 className="font-serif text-base text-liberty mb-2">
                    Recommended Tools
                  </h4>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-3">
                    Curated books, devices, and resources for your health
                    sovereignty journey.
                  </p>
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-health hover:text-health-dark transition-colors no-underline"
                  >
                    Browse Tools <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
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
