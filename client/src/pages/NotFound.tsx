import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { liveArticles } from "@/data";

export default function NotFound() {
  // Pick 6 articles from different categories
  const categoryOrder = ["the-escape", "the-alternative", "the-math", "the-debt", "the-sovereignty"];
  const picks: typeof liveArticles = [];
  for (const cat of categoryOrder) {
    const fromCat = liveArticles.filter((a) => a.category === cat);
    if (fromCat.length > 0 && picks.length < 6) {
      picks.push(fromCat[0]);
      if (fromCat.length > 1 && picks.length < 6) picks.push(fromCat[1]);
    }
  }
  const sixArticles = picks.slice(0, 6);

  return (
    <Layout>
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." />
      <section className="container py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
            404
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. The
            system may be broken, but your navigation doesn't have to be.
          </p>
          <p className="text-foreground/80 mb-10 max-w-lg mx-auto leading-relaxed">
            Getting lost is sometimes the first step toward finding something
            better. The healthcare system is designed to keep you inside its
            walls — but every exit leads somewhere worth exploring.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <Link
              href="/"
              className="px-6 py-3 bg-health text-white font-medium text-sm rounded-md hover:bg-health-dark transition-colors no-underline"
            >
              Go Home
            </Link>
            <Link
              href="/articles"
              className="px-6 py-3 bg-liberty text-white font-medium text-sm rounded-md hover:bg-liberty-light transition-colors no-underline"
            >
              Browse Articles
            </Link>
          </div>

          <div className="text-left border-t border-border pt-8">
            <h2 className="font-serif text-2xl text-liberty mb-6 text-center">
              Start Reading Instead
            </h2>
            <ul className="space-y-3">
              {sixArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-cream-dark/30 transition-colors no-underline group"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-health mt-1 whitespace-nowrap">
                      {a.categoryName}
                    </span>
                    <span className="text-foreground group-hover:text-liberty transition-colors">
                      {a.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
