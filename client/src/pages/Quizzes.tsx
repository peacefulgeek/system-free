import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-quizzes.webp";

const quizzes = [
  { slug: "healthcare-sovereignty-readiness", title: "Healthcare Sovereignty Readiness Assessment", description: "How prepared are you to leave the traditional healthcare system? 10 questions to find out.", questions: 10, category: "The Sovereignty", icon: "👑" },
  { slug: "medical-debt-vulnerability", title: "Medical Debt Vulnerability Score", description: "Assess your risk of medical debt and learn your protection gaps.", questions: 10, category: "The Debt", icon: "⚠️" },
  { slug: "insurance-dependency", title: "Insurance Dependency Quiz", description: "How dependent are you on employer-sponsored insurance? Discover your true flexibility.", questions: 10, category: "The Escape", icon: "🔗" },
  { slug: "health-literacy", title: "Health System Literacy Test", description: "How well do you understand how the healthcare system actually works?", questions: 10, category: "The Math", icon: "📚" },
  { slug: "alternative-medicine-readiness", title: "Alternative Medicine Readiness", description: "Are you ready to explore evidence-based alternatives to conventional care?", questions: 10, category: "The Alternative", icon: "🌿" },
  { slug: "financial-health-checkup", title: "Financial Health Checkup", description: "How healthy is your relationship with healthcare spending?", questions: 10, category: "The Math", icon: "💰" },
  { slug: "dpc-readiness", title: "DPC Readiness Assessment", description: "Is Direct Primary Care right for you? Find out in 10 questions.", questions: 10, category: "The Escape", icon: "🏥" },
  { slug: "health-autonomy-score", title: "Health Autonomy Score", description: "Measure your current level of health self-determination.", questions: 10, category: "The Sovereignty", icon: "🎯" },
  { slug: "system-awareness", title: "System Awareness Quiz", description: "How clearly do you see the healthcare system's design? Test your awareness.", questions: 10, category: "The Sovereignty", icon: "👁️" },
];

export default function Quizzes() {
  return (
    <Layout>
      <SEOHead
        title="Self-Assessment Quizzes — Free From the System"
        description="9 interactive quizzes to assess your healthcare sovereignty readiness, medical debt vulnerability, and health autonomy."
        url="/quizzes"
      />

      {/* Hero */}
      <section className="page-hero min-h-[380px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">Interactive</p>
            <h1 className="text-white mb-4 opacity-0 animate-fade-in-up animate-delay-100">Self-Assessment Quizzes</h1>
            <p className="text-white/70 text-lg opacity-0 animate-fade-in-up animate-delay-200">
              Nine quizzes designed to help you understand where you stand — and where you could be. No sign-up required.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Link key={quiz.slug} href={`/quiz/${quiz.slug}`} className="group block no-underline">
                <div className="rich-card p-7 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{quiz.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-health">{quiz.category}</span>
                  </div>
                  <h3 className="text-liberty text-lg mb-3 group-hover:text-health transition-colors">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{quiz.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">{quiz.questions} questions &middot; ~3 min</p>
                    <span className="text-sm font-semibold text-health group-hover:translate-x-1 transition-transform">Take Quiz &rarr;</span>
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

export { quizzes };
