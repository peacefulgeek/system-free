import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { liveArticles } from "@/data";

export default function NotFound() {
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
      <SEOHead title="Page Not Found — Free From the System" description="The page you're looking for doesn't exist." />

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-health/10 flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl font-bold text-health">404</span>
            </div>
            <h1 className="text-liberty mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Page Not Found</h1>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              The page you are looking for does not exist or has been moved.
            </p>
            <p className="text-foreground/70 mb-10 max-w-lg mx-auto leading-relaxed text-lg" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Getting lost is sometimes the first step toward finding something better. The healthcare system is designed to keep you inside its walls — but every exit leads somewhere worth exploring.
            </p>

            <div className="flex justify-center gap-4 mb-14">
              <Link href="/" className="px-7 py-3.5 bg-health text-white font-semibold text-sm rounded-lg hover:bg-health-dark transition-colors no-underline shadow-md">
                Go Home
              </Link>
              <Link href="/articles" className="px-7 py-3.5 bg-liberty text-white font-semibold text-sm rounded-lg hover:bg-liberty-light transition-colors no-underline shadow-md">
                Browse Articles
              </Link>
            </div>

            <div className="text-left border-t border-border/50 pt-10">
              <h2 className="text-liberty text-2xl mb-6 text-center" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Start Reading Instead</h2>
              <div className="space-y-2">
                {sixArticles.map((a) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} className="flex items-start gap-3 p-4 rounded-xl hover:bg-cream-dark/50 transition-colors no-underline group">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-health mt-1 whitespace-nowrap">{a.categoryName}</span>
                    <span className="text-foreground group-hover:text-liberty transition-colors">{a.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
