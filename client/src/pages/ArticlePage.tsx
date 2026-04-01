import { useParams } from "wouter";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { getArticleBySlug, getRelatedArticles, SITE_CONFIG } from "@/data";
import NotFound from "./NotFound";
import { Heart, ExternalLink, Clock, Calendar } from "lucide-react";

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

  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <article>
        {/* Full-bleed Hero with overlay */}
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container">
              <div className="max-w-[720px]">
                <Link
                  href={`/category/${article.category}`}
                  className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-amber mb-3 no-underline hover:text-white transition-colors"
                >
                  {article.categoryName}
                </Link>
                <h1 className="text-white text-2xl md:text-4xl lg:text-5xl leading-[1.1] mb-3" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {article.title}
                </h1>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {article.dateHuman}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Sidebar */}
        <div className="container py-10 md:py-14">
          <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row gap-12">
            {/* Article Body */}
            <div className="flex-1 min-w-0">
              {/* Description */}
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 pb-8 border-b border-border/50" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                {article.description}
              </p>

              {/* Affiliate Disclosure */}
              {hasAffiliateLink && (
                <div className="bg-amber/10 border border-amber/30 rounded-xl px-5 py-3.5 mb-8 text-sm text-foreground/70">
                  <strong className="text-foreground">Disclosure:</strong> This article contains affiliate links. We may earn a small commission at no extra cost to you.
                </div>
              )}

              <div className="article-prose pb-8" dangerouslySetInnerHTML={{ __html: article.body }} />

              {/* Health Disclaimer Card */}
              <div className="bg-gradient-to-br from-cream-dark to-cream border border-border/50 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-health/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-health" />
                  </div>
                  <div>
                    <h4 className="text-base text-liberty mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Health Information Disclaimer</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      This article is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider before making changes to your health regimen. Your health decisions should be made in partnership with professionals who understand your individual circumstances.
                    </p>
                  </div>
                </div>
              </div>

              {/* Author Box */}
              <div className="py-8 border-t border-border/50">
                <div className="flex items-start gap-5">
                  <img src={AUTHOR_PHOTO} alt="Kalesh" className="w-16 h-16 rounded-full object-cover flex-shrink-0 ring-2 ring-health/20" loading="lazy" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-health mb-1">Written by</p>
                    <a href={SITE_CONFIG.authorLink} className="text-xl text-liberty hover:text-health transition-colors no-underline" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }} target="_blank" rel="noopener">
                      {SITE_CONFIG.author}
                    </a>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {SITE_CONFIG.authorTitle}. Exploring the intersection of consciousness, healthcare sovereignty, and the clarity that comes from questioning what the system taught you to accept.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-[280px] flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Author Card */}
                <div className="rich-card p-6 text-center">
                  <img src={AUTHOR_PHOTO} alt="Kalesh" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-2 ring-health/20" loading="lazy" />
                  <h3 className="text-lg text-liberty mb-1" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Kalesh</h3>
                  <p className="text-xs text-muted-foreground mb-3">Consciousness Teacher & Writer</p>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-5">
                    Guiding seekers toward clarity, sovereignty, and the kind of health freedom that begins with awareness.
                  </p>
                  <a href="https://kalesh.love" target="_blank" rel="noopener" className="block w-full bg-health text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-health-dark transition-colors no-underline mb-2">
                    Visit kalesh.love
                  </a>
                </div>

                {/* Tools Card */}
                <div className="rich-card p-5">
                  <h4 className="text-base text-liberty mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Recommended Tools</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-3">
                    Curated books, devices, and resources for your health sovereignty journey.
                  </p>
                  <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm font-semibold text-health hover:text-health-dark transition-colors no-underline">
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
        <section className="py-12 md:py-16 bg-cream-dark">
          <div className="container">
            <h2 className="text-liberty text-2xl mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Keep Reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </Layout>
  );
}
