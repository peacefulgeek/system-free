import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Newsletter from "@/components/Newsletter";
import { SITE_CONFIG } from "@/data";

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
        title="About"
        description="About Free From the System and its author Kalesh — Consciousness Teacher & Writer. Why this site exists and what it stands for."
        url="/about"
        jsonLd={jsonLd}
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-[720px] mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
            About
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-8 leading-[1.1]">
            Why This Site Exists
          </h1>

          <div className="article-prose">
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

            <h2>About Kalesh</h2>
            <p>
              This site is written by{" "}
              <a
                href="https://kalesh.love"
                target="_blank"
                rel="noopener"
              >
                Kalesh
              </a>
              , a consciousness teacher and writer who works at the intersection
              of awareness, healthcare sovereignty, and the kind of clarity that
              only comes from questioning everything the system taught you to
              accept.
            </p>
            <p>
              The mind is not the enemy — but it is often the mechanism through
              which the system maintains its grip. Most of what passes for
              healing in the modern world is just symptom management with better
              marketing. Kalesh writes to help people see through the
              conditioning — not just in healthcare, but in the deeper patterns
              of thought and identity that keep us dependent on systems that were
              never designed to serve us.
            </p>
            <p>
              The work here draws on researchers and thinkers who have done the
              difficult work of exposing the system's failures: Dave Chase on
              healthcare's cost crisis, Marty Makary on medical transparency,
              Elisabeth Rosenthal on the business of medicine, Eric Topol on
              patient empowerment, and contemplative voices like Krishnamurti,
              Alan Watts, and Tara Brach on the deeper dimensions of health and
              awareness.
            </p>

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
            <p>
              The system is broken. Your health doesn't have to be.
            </p>

            <h2>Contact</h2>
            <p>
              For questions, collaboration, or just to say hello:{" "}
              <a
                href="https://kalesh.love"
                target="_blank"
                rel="noopener"
              >
                kalesh.love
              </a>
            </p>
          </div>
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
