import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { quizzes } from "./Quizzes";
import NotFound from "./NotFound";

function generateQuestions(slug: string) {
  const banks: Record<string, Array<{ q: string; options: string[]; scores: number[] }>> = {
    "healthcare-sovereignty-readiness": [
      { q: "How confident are you navigating healthcare decisions without an insurance company?", options: ["Not at all", "Somewhat", "Fairly confident", "Very confident"], scores: [1, 2, 3, 4] },
      { q: "Do you know what Direct Primary Care (DPC) is?", options: ["Never heard of it", "Vaguely familiar", "I understand the basics", "I could explain it to someone"], scores: [1, 2, 3, 4] },
      { q: "Have you ever paid for a medical service out of pocket?", options: ["Never", "Once or twice", "Several times", "Regularly"], scores: [1, 2, 3, 4] },
      { q: "How dependent are you on employer-sponsored health insurance?", options: ["Completely — it's why I stay at my job", "Heavily — it's a major factor", "Somewhat — I have some flexibility", "Not at all — I have alternatives"], scores: [1, 2, 3, 4] },
      { q: "Do you have an emergency fund that could cover a $5,000 medical expense?", options: ["No", "I could cover about half", "Yes, with some strain", "Yes, comfortably"], scores: [1, 2, 3, 4] },
      { q: "How often do you research healthcare costs before receiving care?", options: ["Never", "Rarely", "Sometimes", "Always"], scores: [1, 2, 3, 4] },
      { q: "Are you familiar with health sharing ministries?", options: ["No idea what those are", "I've heard the term", "I understand how they work", "I'm a member of one"], scores: [1, 2, 3, 4] },
      { q: "How would you rate your understanding of your current health insurance policy?", options: ["I don't understand it at all", "I know the basics", "I understand most of it", "I know every detail"], scores: [1, 2, 3, 4] },
      { q: "Have you ever negotiated a medical bill?", options: ["No, I didn't know you could", "I've thought about it", "I've tried once", "I do it regularly"], scores: [1, 2, 3, 4] },
      { q: "How ready do you feel to take full ownership of your healthcare decisions?", options: ["Not ready at all", "Starting to think about it", "Making plans", "Already doing it"], scores: [1, 2, 3, 4] },
    ],
    "medical-debt-vulnerability": [
      { q: "Do you currently have any medical debt?", options: ["Yes, significant", "Yes, some", "No, but I've had it before", "Never"], scores: [4, 3, 2, 1] },
      { q: "Could you cover a $2,000 unexpected medical bill right now?", options: ["No", "With difficulty", "Yes, from savings", "Easily"], scores: [4, 3, 2, 1] },
      { q: "Do you know your rights regarding medical debt collection?", options: ["Not at all", "Vaguely", "Somewhat", "Very well"], scores: [4, 3, 2, 1] },
      { q: "Have you ever avoided medical care because of cost?", options: ["Frequently", "Sometimes", "Rarely", "Never"], scores: [4, 3, 2, 1] },
      { q: "Do you review your medical bills for errors?", options: ["Never", "Rarely", "Sometimes", "Always"], scores: [4, 3, 2, 1] },
      { q: "What's your current health insurance deductible?", options: ["Over $5,000", "$3,000-$5,000", "$1,000-$3,000", "Under $1,000"], scores: [4, 3, 2, 1] },
      { q: "Do you have a Health Savings Account (HSA)?", options: ["No, and I don't know what it is", "No, but I know about them", "Yes, but underfunded", "Yes, well-funded"], scores: [4, 3, 2, 1] },
      { q: "How many prescription medications do you take monthly?", options: ["5+", "3-4", "1-2", "None"], scores: [4, 3, 2, 1] },
      { q: "Do you know about hospital financial assistance programs?", options: ["No", "I've heard of them", "I know how to apply", "I've used them"], scores: [4, 3, 2, 1] },
      { q: "How would you rate your overall financial resilience to a medical emergency?", options: ["Very vulnerable", "Somewhat vulnerable", "Moderately prepared", "Well prepared"], scores: [4, 3, 2, 1] },
    ],
  };

  const defaultBank = [
    { q: "How well do you understand the true cost of your healthcare?", options: ["Not at all", "Somewhat", "Well", "Expertly"], scores: [1, 2, 3, 4] },
    { q: "Have you explored alternatives to traditional health insurance?", options: ["Never", "Briefly", "Seriously", "Already switched"], scores: [1, 2, 3, 4] },
    { q: "How often do you make health decisions based on your own research?", options: ["Never", "Rarely", "Often", "Always"], scores: [1, 2, 3, 4] },
    { q: "Do you feel empowered in conversations with healthcare providers?", options: ["Not at all", "Sometimes", "Usually", "Always"], scores: [1, 2, 3, 4] },
    { q: "How much of your health management is preventive vs. reactive?", options: ["All reactive", "Mostly reactive", "Mostly preventive", "All preventive"], scores: [1, 2, 3, 4] },
    { q: "Are you aware of the markup on common medical procedures?", options: ["No idea", "Vaguely", "I know some examples", "I research every procedure"], scores: [1, 2, 3, 4] },
    { q: "How comfortable are you questioning a doctor's recommendation?", options: ["Very uncomfortable", "Somewhat uncomfortable", "Comfortable", "Very comfortable"], scores: [1, 2, 3, 4] },
    { q: "Do you have a relationship with a primary care provider outside of insurance?", options: ["No", "I'm looking into it", "I'm in the process", "Yes"], scores: [1, 2, 3, 4] },
    { q: "How often do you practice preventive health habits (exercise, nutrition, sleep)?", options: ["Rarely", "Sometimes", "Often", "Daily"], scores: [1, 2, 3, 4] },
    { q: "How would you rate your overall health sovereignty?", options: ["Fully dependent on the system", "Starting to question", "Making changes", "Largely independent"], scores: [1, 2, 3, 4] },
  ];

  return banks[slug] || defaultBank;
}

function getResultText(score: number, maxScore: number) {
  const pct = score / maxScore;
  if (pct >= 0.8) return { level: "High Sovereignty", color: "text-health", bg: "bg-health/10", description: "You're well on your way to healthcare independence. You understand the system's flaws and have already begun building alternatives. Keep going — and share what you've learned." };
  if (pct >= 0.6) return { level: "Growing Awareness", color: "text-liberty", bg: "bg-liberty/10", description: "You're asking the right questions and starting to see the system for what it is. The next step is action — explore DPC, run the numbers, and start building your exit strategy." };
  if (pct >= 0.4) return { level: "Early Awakening", color: "text-amber-600", bg: "bg-amber/10", description: "Something brought you here, and that matters. You're beginning to question the system. Start with the basics — read about the real costs, understand your options, and take one step this week." };
  return { level: "System Dependent", color: "text-red-500", bg: "bg-red-50", description: "You're still deeply embedded in the traditional system. That's okay — awareness is the first step. Start with our 'Start Here' page and begin understanding what you're actually paying for." };
}

export default function QuizPage() {
  const { slug } = useParams<{ slug: string }>();
  const quiz = quizzes.find((q) => q.slug === slug);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = useMemo(() => generateQuestions(slug || ""), [slug]);

  if (!quiz) return <NotFound />;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 4;
  const result = getResultText(totalScore, maxScore);

  const restart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResults(false);
  };

  return (
    <Layout>
      <SEOHead title={`${quiz.title} — Free From the System`} description={quiz.description} url={`/quiz/${quiz.slug}`} />

      <section className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {!showResults ? (
              <>
                {/* Quiz Header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-health">{quiz.category}</span>
                  <span className="text-xs text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-cream-dark rounded-full mb-10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-health to-health-dark rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                </div>

                <h1 className="text-liberty text-2xl md:text-3xl leading-snug mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {questions[currentQ].q}
                </h1>

                <div className="space-y-3">
                  {questions[currentQ].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(questions[currentQ].scores[i])}
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
                {/* Results */}
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-health mb-4">Your Results</p>
                <h1 className="text-liberty text-3xl md:text-4xl leading-snug mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {quiz.title}
                </h1>

                <div className="rich-card p-8 mb-8">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                    <p className="text-5xl font-bold text-liberty" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                      {totalScore}<span className="text-2xl text-muted-foreground">/{maxScore}</span>
                    </p>
                  </div>

                  <div className="w-full h-3 bg-cream-dark rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-health to-health-dark rounded-full transition-all duration-700" style={{ width: `${(totalScore / maxScore) * 100}%` }} />
                  </div>

                  <div className={`${result.bg} rounded-xl p-6 mb-4`}>
                    <h2 className={`text-2xl ${result.color} mb-3`} style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{result.level}</h2>
                    <p className="text-muted-foreground leading-relaxed">{result.description}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      const text = [
                        `Free From the System — Quiz Results`,
                        `Quiz: ${quiz.title}`,
                        `Date: ${new Date().toLocaleDateString()}`,
                        ``, `Score: ${totalScore}/${maxScore}`, `Level: ${result.level}`, ``,
                        result.description, ``, `Your Answers:`,
                        ...questions.map((q: any, i: number) => `${i+1}. ${q.q} — ${q.options[q.scores.indexOf(answers[i])]} (${answers[i]}/${4})`),
                        ``, `Learn more at systemfree.love`,
                      ].join('\n');
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = `${quiz.slug}-results.txt`; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-6 py-3.5 bg-health text-white font-semibold text-sm rounded-lg hover:bg-health-dark transition-colors shadow-md"
                  >
                    Download Results
                  </button>
                  <button onClick={restart} className="px-6 py-3.5 bg-liberty text-white font-semibold text-sm rounded-lg hover:bg-liberty-light transition-colors shadow-md">
                    Retake Quiz
                  </button>
                  <Link href="/quizzes" className="px-6 py-3.5 bg-cream-dark text-foreground font-semibold text-sm rounded-lg hover:bg-border transition-colors text-center no-underline">
                    More Quizzes
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
