import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { ExternalLink } from "lucide-react";

const AMAZON_TAG = "spankyspinola-20";

interface Product {
  name: string;
  asin?: string;
  url?: string;
  description: string;
  internalLink?: { text: string; href: string };
}

interface Category {
  title: string;
  products: Product[];
}

const categories: Category[] = [
  {
    title: "Books on Healthcare Sovereignty & Medical Freedom",
    products: [
      {
        name: "The Price We Pay by Marty Makary, M.D.",
        asin: "1635574110",
        description:
          "The single best book on how the American healthcare system extracts wealth from patients. Dr. Makary exposes hidden pricing, unnecessary procedures, and the financial architecture that keeps you trapped. If you read one book from this list, make it this one.",
        internalLink: {
          text: "our guide to understanding medical billing",
          href: "/articles/understanding-medical-billing-how-to-read-and-challenge-your-hospital-bill",
        },
      },
      {
        name: "An American Sickness by Elisabeth Rosenthal",
        asin: "0143110853",
        description:
          "A former New York Times journalist traces how every branch of American medicine became a profit center. The chapter on insurance alone will change how you think about your premiums forever.",
      },
      {
        name: "Direct Primary Care: The Cure for Our Broken Healthcare System",
        asin: "1732403805",
        description:
          "The definitive guide to understanding DPC — what it is, how it works, and why it may be the most important healthcare innovation in a generation. Essential reading if you are considering leaving traditional insurance.",
        internalLink: {
          text: "our breakdown of Direct Primary Care",
          href: "/articles/direct-primary-care-what-it-is-how-it-works-and-who-its-for",
        },
      },
      {
        name: "Being Mortal by Atul Gawande",
        asin: "1250076226",
        description:
          "A profound examination of how modern medicine fails us at the end of life — and what genuine care looks like when the system stops pretending it has all the answers.",
      },
      {
        name: "The Healing Self by Deepak Chopra & Rudolph Tanzi",
        asin: "0451495527",
        description:
          "Chopra and Tanzi bridge the gap between conventional medicine and the body's innate healing intelligence. A practical guide to the kind of health sovereignty that starts from within.",
      },
    ],
  },
  {
    title: "Books on Medical Debt & Financial Freedom",
    products: [
      {
        name: "Never Pay the First Bill by Marshall Allen",
        asin: "0593190009",
        description:
          "A step-by-step playbook for fighting back against medical bills. Allen, a ProPublica journalist, shows you exactly how to challenge charges, negotiate, and protect your finances from a system designed to overcharge you.",
        internalLink: {
          text: "our article on negotiating medical debt",
          href: "/articles/how-to-negotiate-medical-debt-a-step-by-step-guide",
        },
      },
      {
        name: "The Great American Healthcare Scam by J. Edward Briggs",
        asin: "1642937851",
        description:
          "Briggs pulls back the curtain on the financial machinery behind American healthcare. If you have ever wondered why a bag of saline costs three hundred dollars, this book has the answer.",
      },
      {
        name: "Cured: Strengthen Your Immune System and Heal Your Life by Jeffrey Rediger, M.D.",
        asin: "1250193192",
        description:
          "A Harvard-trained psychiatrist examines cases of radical remission and what they reveal about the body's capacity to heal when given the right conditions. The system does not want you to read this book.",
      },
      {
        name: "Your Money or Your Life by Vicki Robin",
        asin: "0143115766",
        description:
          "The classic guide to financial independence that reframes money as life energy. Essential context for understanding why healthcare costs are not just a medical problem — they are a freedom problem.",
      },
    ],
  },
  {
    title: "Health Tracking & Wellness Devices",
    products: [
      {
        name: "Withings Body+ Smart Scale",
        asin: "B071XW4C5Q",
        description:
          "Tracks weight, body composition, BMI, and syncs with your phone. When you leave the system, you become your own health monitor. This is the tool that makes that practical.",
      },
      {
        name: "Omron Platinum Blood Pressure Monitor",
        asin: "B07L1CDQF4",
        description:
          "Clinical-grade accuracy at home. Knowing your own numbers — without a copay — is the first step toward health sovereignty. The Omron Platinum is the gold standard for home monitoring.",
      },
      {
        name: "Oura Ring Generation 3",
        url: "https://ouraring.com",
        description:
          "The most sophisticated personal health tracker available. Sleep quality, heart rate variability, body temperature trends — the data your doctor charges you to collect, available on your finger every morning.",
      },
      {
        name: "Keto-Mojo GK+ Blood Glucose & Ketone Meter",
        asin: "B09JYVQKZN",
        description:
          "If you are exploring metabolic health outside the traditional system, this meter gives you lab-quality glucose and ketone readings at home for a fraction of the cost.",
      },
      {
        name: "Pulse Oximeter — Zacurate Pro Series 500DL",
        asin: "B00B8NKZ1E",
        description:
          "A five-second reading that tells you what an ER visit would charge hundreds for. Every household pursuing health independence should have one.",
      },
    ],
  },
  {
    title: "Journals, Workbooks & Mindfulness Tools",
    products: [
      {
        name: "The Daily Stoic Journal by Ryan Holiday",
        asin: "0525534393",
        description:
          "A structured daily practice for building the mental clarity that health sovereignty demands. The system profits from your confusion — this journal is the antidote.",
      },
      {
        name: "Insight Timer (App)",
        url: "https://insighttimer.com",
        description:
          "The world's largest free meditation library. Over 150,000 guided meditations, many focused on health anxiety, chronic pain, and the kind of inner work that no prescription can replace.",
      },
      {
        name: "The Bullet Journal Method by Ryder Carroll",
        asin: "0525533338",
        description:
          "A system for tracking your health decisions, costs, and progress outside the medical system. Analog, private, and entirely under your control.",
      },
      {
        name: "Headspace (App)",
        url: "https://www.headspace.com",
        description:
          "Guided meditation and mindfulness exercises designed for people who think they cannot meditate. Particularly useful for managing the anxiety that comes with stepping outside the healthcare system.",
      },
      {
        name: "Five Minute Journal",
        asin: "0991846206",
        description:
          "The simplest daily gratitude practice available. Five minutes in the morning, five at night. The research on gratitude and health outcomes is overwhelming — this is the easiest way to start.",
      },
    ],
  },
  {
    title: "Supplements & Nutrition Essentials",
    products: [
      {
        name: "Nordic Naturals Ultimate Omega Fish Oil",
        asin: "B002CQU564",
        description:
          "Third-party tested, pharmaceutical-grade omega-3s. The single most evidence-backed supplement for inflammation, heart health, and cognitive function. This is the brand functional medicine practitioners actually recommend.",
      },
      {
        name: "Thorne Research Vitamin D/K2 Liquid",
        asin: "B0797BHKR3",
        description:
          "Most Americans are vitamin D deficient, and the system would rather sell you a prescription than a twenty-dollar bottle. Thorne is the gold standard in supplement quality.",
      },
      {
        name: "Garden of Life Dr. Formulated Probiotics",
        asin: "B010OSFLT0",
        description:
          "Gut health is the foundation of immune function, and this is the probiotic that actually delivers what it promises. Shelf-stable, clinically studied strains, no refrigeration required.",
      },
      {
        name: "Natural Vitality Calm Magnesium Supplement",
        asin: "B000OQ2DL4",
        description:
          "Magnesium deficiency is epidemic and underdiagnosed. This powder dissolves in water and addresses sleep, muscle tension, and stress — three things the system would rather medicate.",
      },
      {
        name: "Organifi Green Juice Powder",
        asin: "B01DDJLKBO",
        description:
          "Eleven superfoods in one scoop. Not a replacement for real vegetables, but a practical daily insurance policy for the nutrients your diet might be missing.",
      },
    ],
  },
  {
    title: "Courses, Communities & Digital Resources",
    products: [
      {
        name: "Wim Hof Method Fundamentals Course",
        url: "https://www.wimhofmethod.com/fundamentals-video-course",
        description:
          "Cold exposure and breathwork as health tools — backed by peer-reviewed research and practiced by millions. The Wim Hof Method is the most accessible entry point to understanding what your body can do without pharmaceutical intervention.",
      },
      {
        name: "GoodRx (App)",
        url: "https://www.goodrx.com",
        description:
          "Free prescription price comparison that routinely saves 50-80% on medication costs. If you are paying cash for prescriptions outside the insurance system, this app is non-negotiable.",
      },
      {
        name: "CrowdHealth",
        url: "https://www.crowdhealth.com",
        description:
          "A modern health cost sharing community that operates without the religious requirements of traditional health shares. Worth investigating if you are exploring alternatives to traditional insurance.",
        internalLink: {
          text: "our comparison of health sharing options",
          href: "/articles/health-share-ministries-explained-what-they-are-and-how-they-work",
        },
      },
      {
        name: "Mark's Daily Apple (Website)",
        url: "https://www.marksdailyapple.com",
        description:
          "Mark Sisson's comprehensive resource on primal health, nutrition, and fitness. One of the longest-running and most trusted independent health websites on the internet.",
      },
      {
        name: "Yoga with Adriene (YouTube)",
        url: "https://www.youtube.com/@yogawithadriene",
        description:
          "Free, high-quality yoga instruction for every level. Movement is medicine, and Adriene makes it accessible to anyone with an internet connection and a floor.",
      },
    ],
  },
];

function amazonLink(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

// Build ItemList schema
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Healthcare Sovereignty Tools & Resources We Recommend",
  description:
    "Curated list of the best books, tools, apps, and resources for healthcare sovereignty and medical freedom. Personally vetted recommendations from Kalesh.",
  numberOfItems: categories.reduce((sum, c) => sum + c.products.length, 0),
  itemListElement: categories.flatMap((cat, ci) =>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-[900px] mx-auto">
          {/* Affiliate Disclosure */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-10 text-sm text-amber-900">
            This page contains affiliate links. We may earn a small commission
            if you make a purchase — at no extra cost to you.
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-6">
            Tools We Recommend
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed mb-4">
            These are the tools, books, and resources I actually trust. Every
            recommendation here has been chosen because it serves the work this
            site is about — helping you understand the healthcare system well
            enough to make your own decisions about whether to stay in it.
          </p>
          <p className="text-base text-foreground/60 leading-relaxed mb-12">
            Nothing here is filler. If it is on this page, it is because I have
            read it, used it, or vetted it thoroughly enough to put my name
            behind it.
          </p>

          {categories.map((cat) => (
            <div key={cat.title} className="mb-16">
              <h2 className="font-serif text-2xl text-liberty mb-8 pb-3 border-b border-border">
                {cat.title}
              </h2>
              <div className="space-y-6">
                {cat.products.map((product) => {
                  const href = product.asin
                    ? amazonLink(product.asin)
                    : product.url || "#";
                  const isAmazon = !!product.asin;

                  return (
                    <div
                      key={product.name}
                      className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-serif text-lg text-liberty mb-2">
                        <a
                          href={href}
                          target="_blank"
                          rel={isAmazon ? "noopener" : "noopener nofollow"}
                          className="hover:text-health transition-colors no-underline"
                        >
                          {product.name}
                          <ExternalLink className="inline-block w-4 h-4 ml-2 opacity-40" />
                        </a>
                        {isAmazon && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (paid link)
                          </span>
                        )}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed text-[15px]">
                        {product.description}
                        {product.internalLink && (
                          <>
                            {" "}
                            We wrote about this in{" "}
                            <a
                              href={product.internalLink.href}
                              className="text-health underline underline-offset-2"
                            >
                              {product.internalLink.text}
                            </a>
                            .
                          </>
                        )}
                      </p>
                      <a
                        href={href}
                        target="_blank"
                        rel={isAmazon ? "noopener" : "noopener nofollow"}
                        className="inline-block mt-3 text-sm font-medium text-health hover:text-liberty transition-colors no-underline"
                      >
                        {isAmazon ? "View on Amazon" : "Visit Website"} →
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
