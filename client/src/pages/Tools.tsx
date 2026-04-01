import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { ExternalLink } from "lucide-react";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-tools.webp";
const AMAZON_TAG = "spankyspinola-20";

interface Product {
  name: string;
  asin?: string;
  url?: string;
  description: string;
  internalLink?: { text: string; href: string };
}

interface ToolCategory {
  title: string;
  icon: string;
  products: Product[];
}

const toolCategories: ToolCategory[] = [
  {
    title: "Books on Healthcare Sovereignty & Medical Freedom",
    icon: "📚",
    products: [
      { name: "The Price We Pay by Marty Makary, M.D.", asin: "1635574110", description: "The single best book on how the American healthcare system extracts wealth from patients. Dr. Makary exposes hidden pricing, unnecessary procedures, and the financial architecture that keeps you trapped. If you read one book from this list, make it this one.", internalLink: { text: "our guide to understanding medical billing", href: "/articles/understanding-medical-billing-how-to-read-and-challenge-your-hospital-bill" } },
      { name: "An American Sickness by Elisabeth Rosenthal", asin: "0143110853", description: "A former New York Times journalist traces how every branch of American medicine became a profit center. The chapter on insurance alone will change how you think about your premiums forever." },
      { name: "Direct Primary Care: The Cure for Our Broken Healthcare System", asin: "1732403805", description: "The definitive guide to understanding DPC — what it is, how it works, and why it may be the most important healthcare innovation in a generation.", internalLink: { text: "our breakdown of Direct Primary Care", href: "/articles/direct-primary-care-what-it-is-how-it-works-and-who-its-for" } },
      { name: "Being Mortal by Atul Gawande", asin: "1250076226", description: "A profound examination of how modern medicine fails us at the end of life — and what genuine care looks like when the system stops pretending it has all the answers." },
      { name: "The Healing Self by Deepak Chopra & Rudolph Tanzi", asin: "0451495527", description: "Chopra and Tanzi bridge the gap between conventional medicine and the body's innate healing intelligence. A practical guide to the kind of health sovereignty that starts from within." },
    ],
  },
  {
    title: "Books on Medical Debt & Financial Freedom",
    icon: "💰",
    products: [
      { name: "Never Pay the First Bill by Marshall Allen", asin: "0593190009", description: "A step-by-step playbook for fighting back against medical bills. Allen, a ProPublica journalist, shows you exactly how to challenge charges, negotiate, and protect your finances.", internalLink: { text: "our article on negotiating medical debt", href: "/articles/how-to-negotiate-medical-debt-a-step-by-step-guide" } },
      { name: "The Great American Healthcare Scam by J. Edward Briggs", asin: "1642937851", description: "Briggs pulls back the curtain on the financial machinery behind American healthcare. If you have ever wondered why a bag of saline costs three hundred dollars, this book has the answer." },
      { name: "Cured by Jeffrey Rediger, M.D.", asin: "1250193192", description: "A Harvard-trained psychiatrist examines cases of radical remission and what they reveal about the body's capacity to heal when given the right conditions." },
      { name: "Your Money or Your Life by Vicki Robin", asin: "0143115766", description: "The classic guide to financial independence that reframes money as life energy. Essential context for understanding why healthcare costs are not just a medical problem — they are a freedom problem." },
    ],
  },
  {
    title: "Health Tracking & Wellness Devices",
    icon: "⌚",
    products: [
      { name: "Withings Body+ Smart Scale", asin: "B071XW4C5Q", description: "Tracks weight, body composition, BMI, and syncs with your phone. When you leave the system, you become your own health monitor." },
      { name: "Omron Platinum Blood Pressure Monitor", asin: "B07L1CDQF4", description: "Clinical-grade accuracy at home. Knowing your own numbers — without a copay — is the first step toward health sovereignty." },
      { name: "Oura Ring Generation 3", url: "https://ouraring.com", description: "The most sophisticated personal health tracker available. Sleep quality, heart rate variability, body temperature trends — the data your doctor charges you to collect." },
      { name: "Keto-Mojo GK+ Blood Glucose & Ketone Meter", asin: "B09JYVQKZN", description: "If you are exploring metabolic health outside the traditional system, this meter gives you lab-quality glucose and ketone readings at home." },
      { name: "Pulse Oximeter — Zacurate Pro Series 500DL", asin: "B00B8NKZ1E", description: "A five-second reading that tells you what an ER visit would charge hundreds for. Every household pursuing health independence should have one." },
    ],
  },
  {
    title: "Journals, Workbooks & Mindfulness Tools",
    icon: "🧘",
    products: [
      { name: "The Daily Stoic Journal by Ryan Holiday", asin: "0525534393", description: "A structured daily practice for building the mental clarity that health sovereignty demands. The system profits from your confusion — this journal is the antidote." },
      { name: "Insight Timer (App)", url: "https://insighttimer.com", description: "The world's largest free meditation library. Over 150,000 guided meditations, many focused on health anxiety, chronic pain, and inner work." },
      { name: "The Bullet Journal Method by Ryder Carroll", asin: "0525533338", description: "A system for tracking your health decisions, costs, and progress outside the medical system. Analog, private, and entirely under your control." },
      { name: "Headspace (App)", url: "https://www.headspace.com", description: "Guided meditation and mindfulness exercises designed for people who think they cannot meditate." },
      { name: "Five Minute Journal", asin: "0991846206", description: "The simplest daily gratitude practice available. Five minutes in the morning, five at night. The research on gratitude and health outcomes is overwhelming." },
    ],
  },
  {
    title: "Supplements & Nutrition Essentials",
    icon: "🌿",
    products: [
      { name: "Nordic Naturals Ultimate Omega Fish Oil", asin: "B002CQU564", description: "Third-party tested, pharmaceutical-grade omega-3s. The single most evidence-backed supplement for inflammation, heart health, and cognitive function." },
      { name: "Thorne Research Vitamin D/K2 Liquid", asin: "B0797BHKR3", description: "Most Americans are vitamin D deficient, and the system would rather sell you a prescription than a twenty-dollar bottle. Thorne is the gold standard." },
      { name: "Garden of Life Dr. Formulated Probiotics", asin: "B010OSFLT0", description: "Gut health is the foundation of immune function. Shelf-stable, clinically studied strains, no refrigeration required." },
      { name: "Natural Vitality Calm Magnesium Supplement", asin: "B000OQ2DL4", description: "Magnesium deficiency is epidemic and underdiagnosed. This powder addresses sleep, muscle tension, and stress." },
      { name: "Organifi Green Juice Powder", asin: "B01DDJLKBO", description: "Eleven superfoods in one scoop. A practical daily insurance policy for the nutrients your diet might be missing." },
    ],
  },
  {
    title: "Courses, Communities & Digital Resources",
    icon: "🖥️",
    products: [
      { name: "Wim Hof Method Fundamentals Course", url: "https://www.wimhofmethod.com/fundamentals-video-course", description: "Cold exposure and breathwork as health tools — backed by peer-reviewed research and practiced by millions." },
      { name: "GoodRx (App)", url: "https://www.goodrx.com", description: "Free prescription price comparison that routinely saves 50-80% on medication costs. Non-negotiable if you are paying cash for prescriptions." },
      { name: "CrowdHealth", url: "https://www.crowdhealth.com", description: "A modern health cost sharing community that operates without the religious requirements of traditional health shares.", internalLink: { text: "our comparison of health sharing options", href: "/articles/health-share-ministries-explained-what-they-are-and-how-they-work" } },
      { name: "Mark's Daily Apple (Website)", url: "https://www.marksdailyapple.com", description: "Mark Sisson's comprehensive resource on primal health, nutrition, and fitness." },
      { name: "Yoga with Adriene (YouTube)", url: "https://www.youtube.com/@yogawithadriene", description: "Free, high-quality yoga instruction for every level. Movement is medicine." },
    ],
  },
];

function amazonLink(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Healthcare Sovereignty Tools & Resources We Recommend",
  description: "Curated list of the best books, tools, apps, and resources for healthcare sovereignty and medical freedom.",
  itemListElement: toolCategories.flatMap((cat, ci) =>
    cat.products.map((p, pi) => ({
      "@type": "ListItem",
      position: ci * 10 + pi + 1,
      name: p.name,
      url: p.asin ? amazonLink(p.asin) : p.url,
    }))
  ),
};

export default function Tools() {
  return (
    <Layout>
      <SEOHead
        title="Best Healthcare Sovereignty Tools & Resources We Recommend"
        description="Curated list of the best books, tools, apps, and resources for healthcare sovereignty and medical freedom. Personally vetted recommendations from Kalesh."
        url="/tools"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Hero */}
      <section className="page-hero min-h-[380px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">Curated</p>
            <h1 className="text-white mb-4 opacity-0 animate-fade-in-up animate-delay-100">Tools We Recommend</h1>
            <p className="text-white/70 text-lg opacity-0 animate-fade-in-up animate-delay-200">
              Every recommendation here has been chosen because it serves the work this site is about.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-[900px] mx-auto">
            {/* Affiliate Disclosure */}
            <div className="bg-amber/10 border border-amber/30 rounded-xl px-6 py-4 mb-12 text-sm text-foreground/70">
              <strong className="text-foreground">Disclosure:</strong> This page contains affiliate links. We may earn a small commission if you make a purchase — at no extra cost to you.
            </div>

            <div className="text-lg text-muted-foreground leading-relaxed mb-14 max-w-2xl">
              <p>Nothing here is filler. If it is on this page, it is because I have read it, used it, or vetted it thoroughly enough to put my name behind it.</p>
            </div>

            {toolCategories.map((cat) => (
              <div key={cat.title} className="mb-16">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-liberty text-2xl">{cat.title}</h2>
                </div>
                <div className="space-y-5">
                  {cat.products.map((product) => {
                    const href = product.asin ? amazonLink(product.asin) : product.url || "#";
                    const isAmazon = !!product.asin;

                    return (
                      <div key={product.name} className="rich-card p-6 group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-liberty text-lg mb-2">
                              <a href={href} target="_blank" rel={isAmazon ? "noopener" : "noopener nofollow"} className="hover:text-health transition-colors no-underline">
                                {product.name}
                                <ExternalLink className="inline-block w-3.5 h-3.5 ml-2 opacity-30" />
                              </a>
                              {isAmazon && <span className="text-xs text-muted-foreground ml-2">(paid link)</span>}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-[15px]">
                              {product.description}
                              {product.internalLink && (
                                <>{" "}See also: <a href={product.internalLink.href} className="text-health underline underline-offset-2 hover:text-health-dark">{product.internalLink.text}</a>.</>
                              )}
                            </p>
                          </div>
                        </div>
                        <a href={href} target="_blank" rel={isAmazon ? "noopener" : "noopener nofollow"} className="inline-block mt-4 text-sm font-semibold text-health hover:underline no-underline">
                          {isAmazon ? "View on Amazon" : "Visit Website"} &rarr;
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
