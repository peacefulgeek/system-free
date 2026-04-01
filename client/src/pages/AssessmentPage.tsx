import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { assessments } from "./Assessments";
import NotFound from "./NotFound";

interface Question { q: string; options: string[]; scores: number[]; }
interface Section { title: string; questions: Question[]; }

function generateSections(slug: string): Section[] {
  const banks: Record<string, Section[]> = {
    "healthcare-cost-exposure": [
      { title: "Premiums & Deductibles", questions: [
        { q: "What is your monthly health insurance premium?", options: ["Over $800", "$500-$800", "$200-$500", "Under $200 or none"], scores: [1, 2, 3, 4] },
        { q: "What is your annual deductible?", options: ["Over $6,000", "$3,000-$6,000", "$1,000-$3,000", "Under $1,000"], scores: [1, 2, 3, 4] },
        { q: "How much do you spend on copays per month?", options: ["Over $200", "$100-$200", "$50-$100", "Under $50"], scores: [1, 2, 3, 4] },
      ]},
      { title: "Hidden Costs", questions: [
        { q: "How much time do you spend dealing with insurance claims per month?", options: ["Over 5 hours", "2-5 hours", "1-2 hours", "Under 1 hour"], scores: [1, 2, 3, 4] },
        { q: "Have you been surprised by a medical bill in the past year?", options: ["Multiple times", "Once or twice", "Almost", "Never"], scores: [1, 2, 3, 4] },
        { q: "Do you pay for any wellness services not covered by insurance?", options: ["Over $300/month", "$100-$300/month", "Under $100/month", "None"], scores: [1, 2, 3, 4] },
      ]},
      { title: "Opportunity Costs", questions: [
        { q: "Have you stayed at a job primarily for health insurance?", options: ["Yes, for years", "Yes, for months", "I've considered it", "No"], scores: [1, 2, 3, 4] },
        { q: "Have you delayed a career change because of insurance concerns?", options: ["Definitely", "Probably", "Maybe", "No"], scores: [1, 2, 3, 4] },
      ]},
      { title: "Future Exposure", questions: [
        { q: "How prepared are you for a major medical event financially?", options: ["Not at all", "Somewhat", "Fairly", "Very"], scores: [1, 2, 3, 4] },
        { q: "Do you have a plan for healthcare costs in retirement?", options: ["No plan", "Vague idea", "Some planning", "Detailed plan"], scores: [1, 2, 3, 4] },
      ]},
    ],
  };

  const defaultSections: Section[] = [
    { title: "Current Situation", questions: [
      { q: "How would you rate your current healthcare arrangement?", options: ["Very dissatisfied", "Somewhat dissatisfied", "Neutral", "Satisfied"], scores: [1, 2, 3, 4] },
      { q: "How much do you spend on healthcare annually (all costs)?", options: ["Over $15,000", "$8,000-$15,000", "$3,000-$8,000", "Under $3,000"], scores: [1, 2, 3, 4] },
      { q: "How often do you use your current health coverage?", options: ["Monthly+", "Quarterly", "A few times a year", "Rarely"], scores: [1, 2, 3, 4] },
    ]},
    { title: "Knowledge & Awareness", questions: [
      { q: "How well do you understand your healthcare options beyond traditional insurance?", options: ["Not at all", "Somewhat", "Well", "Expertly"], scores: [1, 2, 3, 4] },
      { q: "Can you explain the difference between DPC, health sharing, and catastrophic coverage?", options: ["No", "Vaguely", "Mostly", "Yes, in detail"], scores: [1, 2, 3, 4] },
      { q: "Do you know your rights regarding medical billing and debt?", options: ["No", "Some basics", "Fairly well", "Thoroughly"], scores: [1, 2, 3, 4] },
    ]},
    { title: "Financial Readiness", questions: [
      { q: "Could you cover a $5,000 medical expense without going into debt?", options: ["No", "With difficulty", "Yes, with some strain", "Easily"], scores: [1, 2, 3, 4] },
      { q: "Do you have a dedicated health emergency fund?", options: ["No", "Starting one", "Partially funded", "Fully funded"], scores: [1, 2, 3, 4] },
      { q: "How would you rate your overall financial health?", options: ["Struggling", "Getting by", "Stable", "Strong"], scores: [1, 2, 3, 4] },
    ]},
    { title: "Self-Care Capacity", questions: [
      { q: "How consistently do you practice preventive health habits?", options: ["Rarely", "Sometimes", "Often", "Daily"], scores: [1, 2, 3, 4] },
      { q: "Do you track any health metrics at home?", options: ["None", "Weight only", "A few metrics", "Comprehensive tracking"], scores: [1, 2, 3, 4] },
    ]},
    { title: "Community & Support", questions: [
      { q: "Do you have a community of people pursuing health sovereignty?", options: ["No", "Online only", "Small group", "Active community"], scores: [1, 2, 3, 4] },
      { q: "Do you have a trusted healthcare provider outside the insurance system?", options: ["No", "Looking", "In progress", "Yes"], scores: [1, 2, 3, 4] },
    ]},
  ];

  return banks[slug] || defaultSections;
}

function getAssessmentResult(score: number, maxScore: number) {
  const pct = score / maxScore;
  if (pct >= 0.8) return { level: "Strong Position", color: "text-health", bg: "bg-health/10", description: "Your assessment reveals a strong foundation for healthcare sovereignty. You have the knowledge, financial resilience, and practical infrastructure to operate largely outside the traditional system. Focus on optimizing and helping others.", recommendations: ["Consider mentoring others on their sovereignty journey", "Review your plan annually to adapt to life changes", "Explore advanced strategies like medical tourism and concierge medicine"] };
  if (pct >= 0.6) return { level: "Building Momentum", color: "text-liberty", bg: "bg-liberty/10", description: "You are making real progress toward healthcare independence. Key foundations are in place, but there are specific areas that need attention before you can fully step outside the system.", recommendations: ["Shore up your emergency fund to cover at least one major medical event", "Research DPC providers in your area and schedule a consultation", "Start tracking your total healthcare costs to identify savings opportunities"] };
  if (pct >= 0.4) return { level: "Early Stage", color: "text-amber-600", bg: "bg-amber/10", description: "You are in the early stages of healthcare sovereignty. The awareness is there, but the practical infrastructure needs significant development. This is a normal starting point — most people begin here.", recommendations: ["Read our Start Here guide for a structured introduction", "Calculate your true annual healthcare costs using our calculator", "Begin building a health emergency fund, even with small contributions"] };
  return { level: "Assessment Needed", color: "text-red-500", bg: "bg-red-50", description: "Your assessment reveals significant dependency on the traditional healthcare system. This is not a judgment — it is a starting point. The fact that you took this assessment means you are already thinking differently.", recommendations: ["Start with our Start Here page for foundational knowledge", "Understand your current insurance policy completely before exploring alternatives", "Begin an emergency fund specifically for healthcare costs"] };
}

export default function AssessmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const assessment = assessments.find((a) => a.slug === slug);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const sections = useMemo(() => generateSections(slug || ""), [slug]);

  if (!assessment) return <NotFound />;

  const allQuestions = sections.flatMap((s) => s.questions);
  const totalQuestions = allQuestions.length;
  const globalIndex = sections.slice(0, currentSection).reduce((sum, s) => sum + s.questions.length, 0) + currentQ;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    const currentSectionQuestions = sections[currentSection].questions;
    if (currentQ < currentSectionQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQ(0);
    } else {
      setShowResults(true);
    }
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = totalQuestions * 4;
  const result = getAssessmentResult(totalScore, maxScore);

  const restart = () => { setCurrentSection(0); setCurrentQ(0); setAnswers([]); setShowResults(false); };

  const downloadResults = () => {
    const lines = [`Free From the System — Assessment Report`, `Assessment: ${assessment.title}`, `Date: ${new Date().toLocaleDateString()}`, ``, `Overall Score: ${totalScore}/${maxScore} (${Math.round((totalScore / maxScore) * 100)}%)`, `Level: ${result.level}`, ``, `Summary:`, result.description, ``, `Recommendations:`, ...result.recommendations.map((r, i) => `${i + 1}. ${r}`), ``, `Detailed Responses:`];
    let qIndex = 0;
    for (const section of sections) {
      lines.push(``, `--- ${section.title} ---`);
      for (const q of section.questions) {
        const answerScore = answers[qIndex];
        const answerIndex = q.scores.indexOf(answerScore);
        const answerText = answerIndex >= 0 ? q.options[answerIndex] : "N/A";
        lines.push(`  ${q.q}`, `  Answer: ${answerText} (${answerScore}/4)`);
        qIndex++;
      }
    }
    lines.push(``, `Learn more at systemfree.love`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${assessment.slug}-report.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <SEOHead title={`${assessment.title} — Free From the System`} description={assessment.description} url={`/assessment/${assessment.slug}`} />

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {!showResults ? (
              <>
                {/* Section & Progress */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-health">{sections[currentSection].title}</span>
                  <span className="text-xs text-muted-foreground">Section {currentSection + 1} of {sections.length}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Question {globalIndex + 1} of {totalQuestions}</p>

                {/* Progress bar */}
                <div className="w-full h-2 bg-cream-dark rounded-full mb-10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-health to-health-dark rounded-full transition-all duration-500 ease-out" style={{ width: `${((globalIndex + 1) / totalQuestions) * 100}%` }} />
                </div>

                {/* Section progress dots */}
                <div className="flex gap-2 mb-8">
                  {sections.map((s, i) => (
                    <div key={s.title} className={`h-1.5 flex-1 rounded-full transition-colors ${i < currentSection ? 'bg-health' : i === currentSection ? 'bg-health/50' : 'bg-cream-dark'}`} />
                  ))}
                </div>

                <h1 className="text-liberty text-2xl md:text-3xl leading-snug mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {sections[currentSection].questions[currentQ].q}
                </h1>

                <div className="space-y-3">
                  {sections[currentSection].questions[currentQ].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(sections[currentSection].questions[currentQ].scores[i])}
                      className="w-full text-left p-5 rounded-xl border-2 border-border/50 bg-card hover:border-health/40 hover:bg-health/5 transition-all duration-200 text-[15px] font-medium group"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full border-2 border-border/50 group-hover:border-health group-hover:bg-health group-hover:text-white flex items-center justify-center text-xs font-bold text-muted-foreground transition-all">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-health mb-4">Your Assessment Report</p>
                <h1 className="text-liberty text-3xl md:text-4xl leading-snug mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {assessment.title}
                </h1>

                <div className="rich-card p-8 mb-8">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                    <p className="text-5xl font-bold text-liberty" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                      {totalScore}<span className="text-2xl text-muted-foreground">/{maxScore}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{Math.round((totalScore / maxScore) * 100)}%</p>
                  </div>

                  <div className="w-full h-3 bg-cream-dark rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-health to-health-dark rounded-full transition-all duration-700" style={{ width: `${(totalScore / maxScore) * 100}%` }} />
                  </div>

                  <div className={`${result.bg} rounded-xl p-6 mb-6`}>
                    <h2 className={`text-2xl ${result.color} mb-3`} style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{result.level}</h2>
                    <p className="text-muted-foreground leading-relaxed">{result.description}</p>
                  </div>

                  <h3 className="text-lg text-liberty mb-3" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                        <span className="w-6 h-6 rounded-full bg-health/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-health">{i + 1}</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section Breakdown */}
                <div className="space-y-3 mb-8">
                  <h3 className="text-lg text-liberty" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Section Breakdown</h3>
                  {(() => {
                    let idx = 0;
                    return sections.map((section) => {
                      const sectionAnswers = answers.slice(idx, idx + section.questions.length);
                      const sectionScore = sectionAnswers.reduce((a, b) => a + b, 0);
                      const sectionMax = section.questions.length * 4;
                      idx += section.questions.length;
                      return (
                        <div key={section.title} className="rich-card p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">{section.title}</span>
                            <span className="text-sm text-muted-foreground">{sectionScore}/{sectionMax}</span>
                          </div>
                          <div className="w-full h-2 bg-cream-dark rounded-full overflow-hidden">
                            <div className="h-full bg-health rounded-full" style={{ width: `${(sectionScore / sectionMax) * 100}%` }} />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={downloadResults} className="px-6 py-3.5 bg-health text-white font-semibold text-sm rounded-lg hover:bg-health-dark transition-colors shadow-md">
                    Download Report
                  </button>
                  <button onClick={restart} className="px-6 py-3.5 bg-liberty text-white font-semibold text-sm rounded-lg hover:bg-liberty-light transition-colors shadow-md">
                    Retake Assessment
                  </button>
                  <Link href="/assessments" className="px-6 py-3.5 bg-cream-dark text-foreground font-semibold text-sm rounded-lg hover:bg-border transition-colors text-center no-underline">
                    More Assessments
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
