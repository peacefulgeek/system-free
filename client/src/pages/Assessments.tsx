import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

export const assessments = [
  {
    slug: "healthcare-cost-exposure",
    title: "Healthcare Cost Exposure Assessment",
    description:
      "Calculate your true annual healthcare cost exposure — including hidden costs most people never count.",
    sections: 4,
    category: "The Math",
  },
  {
    slug: "insurance-vs-alternatives",
    title: "Insurance vs. Alternatives Fit Assessment",
    description:
      "Compare your current insurance plan against DPC, health sharing, and catastrophic coverage to see which fits your life.",
    sections: 3,
    category: "The Escape",
  },
  {
    slug: "medical-debt-risk-profile",
    title: "Medical Debt Risk Profile",
    description:
      "A comprehensive assessment of your vulnerability to medical debt based on your financial situation, coverage, and health factors.",
    sections: 5,
    category: "The Debt",
  },
  {
    slug: "health-autonomy-readiness",
    title: "Health Autonomy Readiness Assessment",
    description:
      "Evaluate your readiness across the five pillars of health sovereignty: knowledge, financial resilience, provider relationships, self-care capacity, and community.",
    sections: 5,
    category: "The Sovereignty",
  },
  {
    slug: "preventive-health-audit",
    title: "Preventive Health Audit",
    description:
      "Assess your current preventive health practices and identify gaps that could cost you thousands in reactive care.",
    sections: 4,
    category: "The Alternative",
  },
  {
    slug: "employer-dependency-index",
    title: "Employer Dependency Index",
    description:
      "Measure how tightly your healthcare is bound to your employer — and what it would take to break free.",
    sections: 3,
    category: "The Escape",
  },
  {
    slug: "functional-medicine-readiness",
    title: "Functional Medicine Readiness Assessment",
    description:
      "Are you ready to explore root-cause medicine? This assessment evaluates your knowledge, openness, and practical readiness.",
    sections: 4,
    category: "The Alternative",
  },
  {
    slug: "family-health-sovereignty",
    title: "Family Health Sovereignty Planner",
    description:
      "Assess your family's collective healthcare situation and build a sovereignty roadmap that works for everyone.",
    sections: 5,
    category: "The Sovereignty",
  },
];

export default function Assessments() {
  return (
    <Layout>
      <SEOHead
        title="Health Sovereignty Assessments"
        description="8 in-depth self-assessments to evaluate your healthcare costs, insurance alternatives, medical debt risk, and health autonomy readiness."
        url="/assessments"
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
            Deep Dive
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-4 leading-[1.1]">
            Health Sovereignty Assessments
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            These are longer, more detailed self-assessments designed to give you
            a comprehensive picture of where you stand. Each one produces a
            personalized report you can download and reference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {assessments.map((assessment) => (
            <Link
              key={assessment.slug}
              href={`/assessment/${assessment.slug}`}
              className="group block no-underline"
            >
              <div className="bg-card rounded-lg p-6 border border-border hover:border-health/30 transition-all duration-300 hover:shadow-md h-full flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest text-health mb-3">
                  {assessment.category}
                </span>
                <h3 className="font-serif text-lg text-liberty mb-2 group-hover:text-health transition-colors">
                  {assessment.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {assessment.description}
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  {assessment.sections} sections &middot; ~8 min &middot;
                  Downloadable report
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
