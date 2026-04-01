import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Newsletter from "@/components/Newsletter";
import { SITE_CONFIG } from "@/data";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-about.webp";

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Free From the System",
    url: `${SITE_CONFIG.url}/about`,
    author: {
      "@type": "Person",
      name: "Kalesh",
      url: "https://kalesh.love",
      jobTitle: "Consciousness Teacher & Writer",
    },
  };

  return (
    <Layout>
      <SEOHead
        title="About — Free From the System"
        description="About Free From the System and its author Kalesh — Consciousness Teacher & Writer. Why this site exists and what it stands for."
        url="/about"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="page-hero min-h-[480px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">About</p>
            <h1 className="text-white mb-6 opacity-0 animate-fade-in-up animate-delay-100">Why This Site Exists</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl opacity-0 animate-fade-in-up animate-delay-200">
              The system is broken. Your health doesn't have to be.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-[720px] mx-auto article-prose">
            <p>
              The American healthcare system is the most expensive in the world.
              It is also, by nearly every meaningful measure, one of the least
              effective among developed nations. This is not a political
              statement. It is a mathematical one.
            </p>
            <p>
              Americans spend over $4.3 trillion annually on healthcare — more
              than the GDP of most countries — and yet rank last among
              high-income nations in health outcomes, equity, and access. Two
              thirds of all bankruptcies in the United States are linked to
              medical bills. The average family premium now exceeds $23,000 per
              year.
            </p>
            <p>
              These are not problems that can be solved by voting harder or
              hoping the system reforms itself. The system is working exactly as
              designed. It was designed to extract wealth, not to produce health.
            </p>
            <p>
              <strong>Free From the System</strong> exists because there is
              another way. Not a theoretical one. A practical, evidence-based,
              already-working one. Direct Primary Care. Health sharing
              ministries. Catastrophic coverage. Cash-pay surgery centers.
              Functional medicine. Contemplative health practices. These
              alternatives are not fringe — they are the future that the
              insurance-pharmaceutical complex is fighting to suppress.
            </p>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="section-sage py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-shrink-0">
                <img
                  src="https://system-free.b-cdn.net/images/kalesh-author.webp"
                  alt="Kalesh — Consciousness Teacher & Writer"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">The Author</p>
                <h2 className="text-liberty mb-1">Kalesh</h2>
                <p className="text-health font-semibold mb-4">Consciousness Teacher & Writer</p>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    This site is written by{" "}
                    <a href="https://kalesh.love" target="_blank" rel="noopener" className="text-health hover:text-health-dark underline underline-offset-2">
                      Kalesh
                    </a>, a consciousness teacher and writer who works at the intersection of awareness, healthcare sovereignty, and the kind of clarity that only comes from questioning everything the system taught you to accept.
                  </p>
                  <p>
                    The mind is not the enemy — but it is often the mechanism through which the system maintains its grip. Most of what passes for healing in the modern world is just symptom management with better marketing. Kalesh writes to help people see through the conditioning — not just in healthcare, but in the deeper patterns of thought and identity that keep us dependent on systems that were never designed to serve us.
                  </p>
                  <p>
                    The work here draws on researchers and thinkers who have done the difficult work of exposing the system's failures: Dave Chase on healthcare's cost crisis, Marty Makary on medical transparency, Elisabeth Rosenthal on the business of medicine, Eric Topol on patient empowerment, and contemplative voices like J. Krishnamurti, Alan Watts, and Tara Brach on the deeper dimensions of health and awareness.
                  </p>
                </div>
                <a
                  href="https://kalesh.love"
                  target="_blank"
                  rel="noopener"
                  className="btn-primary inline-flex mt-6"
                >
                  Visit kalesh.love
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What This Is Not */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-[720px] mx-auto article-prose">
            <h2>What This Site Is Not</h2>
            <p>
              This is not medical advice. This is not financial advice. This is
              not a replacement for professional care when professional care is
              what you need.
            </p>
            <p>
              This is a resource for people who are ready to think clearly about
              a system that profits from their confusion. It is a collection of
              evidence, strategies, and perspectives designed to help you make
              informed decisions about your health and your money.
            </p>
            <blockquote>
              The system is broken. Your health doesn't have to be.
            </blockquote>
          </div>
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
