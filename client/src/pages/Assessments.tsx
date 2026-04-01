import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-assessments.webp";

export const assessments = [
  { slug: "healthcare-cost-exposure", title: "Healthcare Cost Exposure Assessment", description: "Calculate your true annual healthcare cost exposure — including hidden costs most people never count.", sections: 4, category: "The Math", icon: "📊" },
  { slug: "insurance-vs-alternatives", title: "Insurance vs. Alternatives Fit Assessment", description: "Compare your current insurance plan against DPC, health sharing, and catastrophic coverage to see which fits your life.", sections: 3, category: "The Escape", icon: "⚖️" },
  { slug: "medical-debt-risk-profile", title: "Medical Debt Risk Profile", description: "A comprehensive assessment of your vulnerability to medical debt based on your financial situation, coverage, and health factors.", sections: 5, category: "The Debt", icon: "🛡️" },
  { slug: "health-autonomy-readiness", title: "Health Autonomy Readiness Assessment", description: "Evaluate your readiness across the five pillars of health sovereignty: knowledge, financial resilience, provider relationships, self-care capacity, and community.", sections: 5, category: "The Sovereignty", icon: "👑" },
  { slug: "preventive-health-audit", title: "Preventive Health Audit", description: "Assess your current preventive health practices and identify gaps that could cost you thousands in reactive care.", sections: 4, category: "The Alternative", icon: "🌿" },
  { slug: "employer-dependency-index", title: "Employer Dependency Index", description: "Measure how tightly your healthcare is bound to your employer — and what it would take to break free.", sections: 3, category: "The Escape", icon: "🔗" },
  { slug: "functional-medicine-readiness", title: "Functional Medicine Readiness Assessment", description: "Are you ready to explore root-cause medicine? This assessment evaluates your knowledge, openness, and practical readiness.", sections: 4, category: "The Alternative", icon: "🔬" },
  { slug: "family-health-sovereignty", title: "Family Health Sovereignty Planner", description: "Assess your family's collective healthcare situation and build a sovereignty roadmap that works for everyone.", sections: 5, category: "The Sovereignty", icon: "👨‍👩‍👧‍👦" },
];

export default function Assessments() {
  return (
    <Layout>
      <SEOHead
        title="Health Sovereignty Assessments — Free From the System"
        description="8 in-depth self-assessments to evaluate your healthcare costs, insurance alternatives, medical debt risk, and health autonomy readiness."
        url="/assessments"
      />

      {/* Hero */}
      <section className="page-hero min-h-[380px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">Deep Dive</p>
            <h1 className="text-white mb-4 opacity-0 animate-fade-in-up animate-delay-100">Health Sovereignty Assessments</h1>
            <p className="text-white/70 text-lg opacity-0 animate-fade-in-up animate-delay-200">
              Longer, more detailed self-assessments that produce a personalized report you can download and reference.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {assessments.map((assessment) => (
              <Link key={assessment.slug} href={`/assessment/${assessment.slug}`} className="group block no-underline">
                <div className="rich-card p-7 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{assessment.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-health">{assessment.category}</span>
                  </div>
                  <h3 className="text-liberty text-lg mb-3 group-hover:text-health transition-colors">{assessment.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{assessment.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">{assessment.sections} sections &middot; ~8 min &middot; Downloadable report</p>
                    <span className="text-sm font-semibold text-health group-hover:translate-x-1 transition-transform">Start &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
