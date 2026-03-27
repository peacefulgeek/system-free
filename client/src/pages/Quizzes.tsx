import { Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const quizzes = [
  {
    slug: "healthcare-sovereignty-readiness",
    title: "Healthcare Sovereignty Readiness Assessment",
    description: "How prepared are you to leave the traditional healthcare system? 10 questions to find out.",
    questions: 10,
    category: "The Sovereignty",
  },
  {
    slug: "medical-debt-vulnerability",
    title: "Medical Debt Vulnerability Score",
    description: "Assess your risk of medical debt and learn your protection gaps.",
    questions: 10,
    category: "The Debt",
  },
  {
    slug: "insurance-dependency",
    title: "Insurance Dependency Quiz",
    description: "How dependent are you on employer-sponsored insurance? Discover your true flexibility.",
    questions: 10,
    category: "The Escape",
  },
  {
    slug: "health-literacy",
    title: "Health System Literacy Test",
    description: "How well do you understand how the healthcare system actually works?",
    questions: 10,
    category: "The Math",
  },
  {
    slug: "alternative-medicine-readiness",
    title: "Alternative Medicine Readiness",
    description: "Are you ready to explore evidence-based alternatives to conventional care?",
    questions: 10,
    category: "The Alternative",
  },
  {
    slug: "financial-health-checkup",
    title: "Financial Health Checkup",
    description: "How healthy is your relationship with healthcare spending?",
    questions: 10,
    category: "The Math",
  },
  {
    slug: "dpc-readiness",
    title: "DPC Readiness Assessment",
    description: "Is Direct Primary Care right for you? Find out in 10 questions.",
    questions: 10,
    category: "The Escape",
  },
  {
    slug: "health-autonomy-score",
    title: "Health Autonomy Score",
    description: "Measure your current level of health self-determination.",
    questions: 10,
    category: "The Sovereignty",
  },
  {
    slug: "system-awareness",
    title: "System Awareness Quiz",
    description: "How clearly do you see the healthcare system's design? Test your awareness.",
    questions: 10,
    category: "The Sovereignty",
  },
];

export default function Quizzes() {
  return (
    <Layout>
      <SEOHead
        title="Self-Assessment Quizzes"
        description="9 interactive quizzes to assess your healthcare sovereignty readiness, medical debt vulnerability, and health autonomy."
        url="/quizzes"
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
            Interactive
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-4 leading-[1.1]">
            Self-Assessment Quizzes
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nine quizzes designed to help you understand where you stand — and
            where you could be. No sign-up required. Instant results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.slug}
              href={`/quiz/${quiz.slug}`}
              className="group block no-underline"
            >
              <div className="bg-card rounded-lg p-6 border border-border hover:border-health/30 transition-all duration-300 hover:shadow-md h-full flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest text-health mb-3">
                  {quiz.category}
                </span>
                <h3 className="font-serif text-lg text-liberty mb-2 group-hover:text-health transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {quiz.description}
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  {quiz.questions} questions &middot; ~3 min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export { quizzes };
