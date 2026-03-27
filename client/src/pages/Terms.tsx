import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

export default function Terms() {
  return (
    <Layout>
      <SEOHead
        title="Terms of Use"
        description="Terms of use for Free From the System. Educational content disclaimer, copyright, and usage terms."
        url="/terms"
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-[720px] mx-auto article-prose">
          <h1 className="font-serif text-4xl text-liberty mb-8">
            Terms of Use
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: March 27, 2026
          </p>

          <h2>Educational Content Only</h2>
          <p>
            All content on Free From the System is provided for educational and
            informational purposes only. Nothing on this site constitutes
            medical advice, financial advice, legal advice, or professional
            consultation of any kind. Always consult qualified professionals
            before making healthcare or financial decisions.
          </p>

          <h2>No Guarantees</h2>
          <p>
            While we strive for accuracy, we make no warranties or guarantees
            about the completeness, reliability, or accuracy of the information
            presented. Healthcare costs, regulations, and options vary by
            location and change over time. Verify all information independently.
          </p>

          <h2>Copyright</h2>
          <p>
            All original content on this site is copyright &copy;{" "}
            {new Date().getFullYear()} Free From the System. You may share
            excerpts with attribution and a link back to the original article.
            Reproduction of full articles without permission is prohibited.
          </p>

          <h2>External Links</h2>
          <p>
            This site contains links to external resources. We are not
            responsible for the content, accuracy, or practices of linked sites.
            Inclusion of a link does not imply endorsement.
          </p>

          <h2>Interactive Tools</h2>
          <p>
            The calculators, quizzes, and other interactive tools on this site
            provide estimates based on national averages and general assumptions.
            They are not substitutes for professional financial or medical
            analysis. Use them as starting points for your own research.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Free From the System and its author shall not be liable for any
            damages arising from the use of this site or reliance on its
            content. Use this site at your own risk.
          </p>

          <h2>Changes</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of the site constitutes acceptance of any changes.
          </p>
        </div>
      </section>
    </Layout>
  );
}
