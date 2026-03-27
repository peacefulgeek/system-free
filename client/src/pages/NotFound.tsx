import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  return (
    <Layout>
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." />
      <section className="container py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
          404
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. The
          system may be broken, but your navigation doesn't have to be.
        </p>
        <div className="flex justify-center gap-4">
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
      </section>
    </Layout>
  );
}
