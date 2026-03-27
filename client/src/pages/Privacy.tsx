import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

export default function Privacy() {
  return (
    <Layout>
      <SEOHead
        title="Privacy Policy"
        description="Privacy policy for Free From the System. How we handle your data, cookies, and personal information."
        url="/privacy"
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-[720px] mx-auto article-prose">
          <h1 className="font-serif text-4xl text-liberty mb-8">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: March 27, 2026
          </p>

          <h2>Information We Collect</h2>
          <p>
            Free From the System ("we," "us," or "our") collects minimal
            information. We use privacy-respecting analytics to understand how
            visitors use the site. We do not collect personally identifiable
            information unless you voluntarily provide it (e.g., through a
            newsletter signup form).
          </p>

          <h2>Analytics</h2>
          <p>
            We use privacy-focused analytics that do not use cookies for
            tracking, do not collect personal data, and comply with GDPR, CCPA,
            and PECR. We track page views and referral sources in aggregate only.
          </p>

          <h2>Cookies</h2>
          <p>
            We use minimal cookies for essential site functionality (e.g.,
            remembering your cookie consent preference). We do not use
            advertising cookies or third-party tracking cookies.
          </p>

          <h2>Newsletter</h2>
          <p>
            If you subscribe to our newsletter, we collect your email address
            solely for the purpose of sending you content updates. You can
            unsubscribe at any time. We do not sell, share, or rent your email
            address.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our articles may contain links to external websites. We are not
            responsible for the privacy practices of those sites. We encourage
            you to review their privacy policies.
          </p>

          <h2>Data Retention</h2>
          <p>
            Analytics data is retained in aggregate form. Newsletter subscriber
            data is retained until you unsubscribe. We do not maintain user
            profiles or behavioral data.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete any personal data
            we hold about you. Contact us through{" "}
            <a href="https://kalesh.love" target="_blank" rel="noopener">
              kalesh.love
            </a>{" "}
            to exercise these rights.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated revision date.
          </p>
        </div>
      </section>
    </Layout>
  );
}
