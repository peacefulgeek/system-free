import articlesJson from "./articles.json";

export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  metaDescription: string;
  category: string;
  categoryName: string;
  dateISO: string;
  dateHuman: string;
  readingTime: number;
  body: string;
  heroImage: string;
  ogImage: string;
  faqCount: number;
  openerType: string;
  conclusionType: string;
  backlinkType: string;
  linkType?: string;
  hasAffiliateLink?: boolean;
  faqs?: { q: string; a: string }[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  articleCount: number;
}

const allArticles: Article[] = (articlesJson as { articles: Article[] }).articles;

// Only show articles with publish date <= today
const today = new Date().toISOString().split("T")[0];
export const liveArticles = allArticles.filter((a) => a.dateISO <= today);
export const allArticlesData = allArticles;

export const categories: Category[] = [
  {
    slug: "the-escape",
    name: "The Escape",
    description:
      "Practical strategies for leaving the traditional healthcare system — insurance alternatives, DPC, and the transition roadmap.",
    articleCount: allArticles.filter((a) => a.category === "the-escape").length,
  },
  {
    slug: "the-alternative",
    name: "The Alternative",
    description:
      "Evidence-based integrative and alternative health approaches — from functional medicine to contemplative practices.",
    articleCount: allArticles.filter((a) => a.category === "the-alternative").length,
  },
  {
    slug: "the-math",
    name: "The Math",
    description:
      "The real numbers behind healthcare costs — comparisons, projections, and the financial case for alternatives.",
    articleCount: allArticles.filter((a) => a.category === "the-math").length,
  },
  {
    slug: "the-debt",
    name: "The Debt",
    description:
      "Medical debt survival — your rights, negotiation strategies, and the path to financial recovery.",
    articleCount: allArticles.filter((a) => a.category === "the-debt").length,
  },
  {
    slug: "the-sovereignty",
    name: "The Sovereignty",
    description:
      "Health autonomy as a practice — the philosophy, the five pillars, and the community dimension.",
    articleCount: allArticles.filter((a) => a.category === "the-sovereignty").length,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return liveArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return liveArticles.filter((a) => a.category === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getRelatedArticles(article: Article, count = 3): Article[] {
  const sameCategory = liveArticles.filter(
    (a) => a.category === article.category && a.id !== article.id
  );
  const otherCategory = liveArticles.filter(
    (a) => a.category !== article.category
  );
  const related = [...sameCategory.slice(0, 2), ...otherCategory.slice(0, 1)];
  return related.slice(0, count);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return liveArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.categoryName.toLowerCase().includes(q)
  );
}

export const SITE_CONFIG = {
  name: "Free From the System",
  tagline: "The system is broken. Your health doesn't have to be.",
  url: "https://systemfree.love",
  author: "Kalesh",
  authorTitle: "Consciousness Teacher & Writer",
  authorLink: "https://kalesh.love",
  description:
    "Evidence-based strategies for healthcare independence, medical debt freedom, and health sovereignty.",
};
