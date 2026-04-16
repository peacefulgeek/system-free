#!/usr/bin/env node
/**
 * start-with-cron.mjs — Starts the Express server AND runs the auto-publish
 * pipeline on a schedule. Code-only, no external cron service needed.
 *
 * Schedule:
 *   - Phase 1 (first ~54 days): 5 articles/day via staggered dateISO values
 *   - Phase 2 (after all 300 live): sitemap/RSS refresh weekly
 *   - Humanization refresh: every 12 hours, checks for AI-flagged patterns
 *   - Product spotlight: weekly rotation
 *
 * Usage on Render:
 *   Build command: pnpm install && pnpm build
 *   Start command: node scripts/start-with-cron.mjs
 */
import { spawn } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// ─── Auto-gen master switch ─────────────────────────────────────────────────
// Set to true to enable all automated publishing, humanization, and spotlight crons.
// Set to false to run the server only (no automated content changes).
const AUTO_GEN_ENABLED = true;

// ─── Start the Express server ───────────────────────────────────────────────
console.log("[cron] Starting Express server...");
const server = spawn("node", [join(ROOT, "dist", "index.js")], {
  stdio: "inherit",
  env: { ...process.env },
});

server.on("error", (err) => {
  console.error("[cron] Server failed to start:", err);
  process.exit(1);
});

// ─── Banned AI words list ──────────────────────────────────────────────────
const AMAZON_TAG = "spankyspinola-20";
const MIN_AMAZON_LINKS = 3;

// Product catalog for injecting Amazon links when articles have fewer than 3
const PRODUCT_CATALOG = [
  { asin: "1635574110", tags: ["medical billing", "hospital", "pricing", "healthcare cost", "insurance"], sentence: "One option that many people like is <a href=\"https://www.amazon.com/dp/1635574110?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">The Price We Pay</a>, which breaks down exactly how hospital pricing works" },
  { asin: "0143110853", tags: ["healthcare system", "insurance", "medical industry", "profit"], sentence: "A tool that often helps with this is <a href=\"https://www.amazon.com/dp/0143110853?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">An American Sickness</a>, which traces how every branch of medicine became a profit center" },
  { asin: "0593190009", tags: ["medical debt", "billing", "negotiate", "hospital bill", "financial"], sentence: "Something worth considering might be <a href=\"https://www.amazon.com/dp/0593190009?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Never Pay the First Bill</a>, a step-by-step playbook for fighting medical charges" },
  { asin: "0143115766", tags: ["financial freedom", "money", "budget", "independence"], sentence: "One option that many people like is <a href=\"https://www.amazon.com/dp/0143115766?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Your Money or Your Life</a>, the classic guide to financial independence" },
  { asin: "1595555277", tags: ["debt", "budget", "financial", "money", "savings"], sentence: "A tool that often helps with debt is <a href=\"https://www.amazon.com/dp/1595555277?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">The Total Money Makeover</a> by Dave Ramsey" },
  { asin: "0735213615", tags: ["habits", "behavior", "change", "routine", "health"], sentence: "Something worth considering might be <a href=\"https://www.amazon.com/dp/0735213615?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Atomic Habits</a> by James Clear, which shows how small changes compound" },
  { asin: "1501144324", tags: ["mindfulness", "meditation", "stress", "anxiety", "calm"], sentence: "You could also try <a href=\"https://www.amazon.com/dp/1501144324?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">10% Happier</a> by Dan Harris, a practical guide to meditation for skeptics" },
  { asin: "0062515675", tags: ["food", "nutrition", "diet", "eating", "health"], sentence: "For those looking at food differently, <a href=\"https://www.amazon.com/dp/0062515675?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Food Fix</a> by Mark Hyman shows how what we eat connects to the larger system" },
  { asin: "0062316117", tags: ["supplements", "natural", "alternative", "wellness", "body"], sentence: "A popular choice for understanding natural approaches is <a href=\"https://www.amazon.com/dp/0062316117?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">Sapiens</a> by Yuval Noah Harari, which puts our health choices in evolutionary context" },
  { asin: "B07PWYGRVG", tags: ["blood pressure", "monitor", "heart", "device", "health"], sentence: "One practical step is getting a <a href=\"https://www.amazon.com/dp/B07PWYGRVG?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">home blood pressure monitor</a> so you can track your own numbers" },
  { asin: "B0BQ3B3YBN", tags: ["berberine", "supplement", "blood sugar", "glucose", "metabolism"], sentence: "Something many readers have found helpful is <a href=\"https://www.amazon.com/dp/B0BQ3B3YBN?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">berberine supplements</a> for supporting healthy blood sugar levels" },
  { asin: "B0D57PP7G3", tags: ["journal", "writing", "reflection", "mindfulness", "healing"], sentence: "A tool that often helps with the inner work is a <a href=\"https://www.amazon.com/dp/B0D57PP7G3?tag=spankyspinola-20\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">wellness journal</a> for tracking what actually works for your body" },
];

const BANNED_WORDS = [
  "profound", "profoundly", "transformative", "holistic", "nuanced",
  "multifaceted", "tapestry", "landscape", "paradigm", "synergy",
  "leverage", "delve", "embark", "foster", "moreover", "furthermore",
  "comprehensive", "intricate", "pivotal", "beacon", "cornerstone",
  "underscores", "navigating", "realm", "unveil", "harness",
  "groundbreaking", "cutting-edge", "game-changer", "robust",
  "seamless", "streamline", "spearhead", "catalyst", "empower",
  "revolutionize", "elevate", "optimize", "innovative", "dynamic",
];

const REPLACEMENTS = {
  "profound": "real",
  "profoundly": "deeply",
  "transformative": "life-changing",
  "holistic": "whole-person",
  "nuanced": "layered",
  "multifaceted": "complex",
  "tapestry": "web",
  "landscape": "terrain",
  "paradigm": "framework",
  "synergy": "connection",
  "leverage": "use",
  "delve": "dig",
  "embark": "start",
  "foster": "build",
  "moreover": "And",
  "furthermore": "Also",
  "comprehensive": "thorough",
  "intricate": "detailed",
  "pivotal": "key",
  "beacon": "signal",
  "cornerstone": "foundation",
  "underscores": "highlights",
  "navigating": "working through",
  "realm": "space",
  "unveil": "reveal",
  "harness": "use",
  "groundbreaking": "new",
  "cutting-edge": "modern",
  "game-changer": "shift",
  "robust": "strong",
  "seamless": "smooth",
  "streamline": "simplify",
  "spearhead": "lead",
  "catalyst": "spark",
  "empower": "support",
  "revolutionize": "reshape",
  "elevate": "raise",
  "optimize": "improve",
  "innovative": "creative",
  "dynamic": "active",
};

// ─── Auto-publish function ──────────────────────────────────────────────────
function runAutoPublish() {
  const today = new Date().toISOString().split("T")[0];
  console.log(`\n[cron] Auto-publish check for ${today}`);

  const dataPath = join(ROOT, "client", "src", "data", "articles.json");
  if (!existsSync(dataPath)) {
    console.log("[cron] articles.json not found, skipping");
    return;
  }

  const data = JSON.parse(readFileSync(dataPath, "utf-8"));
  const articles = data.articles;
  const live = articles.filter((a) => a.dateISO.split("T")[0] <= today);
  const newToday = articles.filter((a) => a.dateISO.split("T")[0] === today);

  console.log(`[cron] Total: ${articles.length} | Live: ${live.length} | New today: ${newToday.length}`);

  if (newToday.length > 0) {
    console.log("[cron] Newly published:");
    newToday.forEach((a) => console.log(`  - ${a.title} (${a.categoryName})`));
  }

  // Regenerate sitemap.xml in dist/public
  const sitemapPath = join(ROOT, "dist", "public", "sitemap.xml");
  const staticPages = [
    ["/", "1.0", "weekly"],
    ["/articles", "0.9", "daily"],
    ["/start-here", "0.8", "monthly"],
    ["/about", "0.7", "monthly"],
    ["/compare", "0.7", "monthly"],
    ["/quizzes", "0.7", "monthly"],
    ["/assessments", "0.7", "monthly"],
    ["/tools", "0.7", "monthly"],
    ["/privacy", "0.3", "yearly"],
    ["/terms", "0.3", "yearly"],
  ];

  const categoryPages = [
    "the-escape", "the-alternative", "the-math", "the-debt", "the-sovereignty",
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const [path, priority, freq] of staticPages) {
    sitemap += `  <url><loc>https://systemfree.love${path}</loc><priority>${priority}</priority><changefreq>${freq}</changefreq></url>\n`;
  }

  for (const cat of categoryPages) {
    sitemap += `  <url><loc>https://systemfree.love/category/${cat}</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>\n`;
  }

  for (const a of live) {
    sitemap += `  <url><loc>https://systemfree.love/articles/${a.slug}</loc><priority>0.6</priority><changefreq>monthly</changefreq><lastmod>${a.dateISO}</lastmod></url>\n`;
  }

  sitemap += `</urlset>\n`;

  try {
    writeFileSync(sitemapPath, sitemap);
    console.log(`[cron] Sitemap updated: ${live.length} articles`);
  } catch (e) {
    console.log(`[cron] Sitemap write skipped (dist not found yet)`);
  }

  // Regenerate rss.xml
  const rssPath = join(ROOT, "dist", "public", "rss.xml");
  const rssArticles = live.slice(-20).reverse();
  let rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
  rss += `  <title>Free From the System</title>\n`;
  rss += `  <link>https://systemfree.love</link>\n`;
  rss += `  <description>The system is broken. Your health doesn't have to be.</description>\n`;
  rss += `  <language>en-us</language>\n`;
  rss += `  <atom:link href="https://systemfree.love/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const a of rssArticles) {
    rss += `  <item>\n`;
    rss += `    <title>${escapeXml(a.title)}</title>\n`;
    rss += `    <link>https://systemfree.love/articles/${a.slug}</link>\n`;
    rss += `    <description>${escapeXml(a.description)}</description>\n`;
    rss += `    <pubDate>${new Date(a.dateISO).toUTCString()}</pubDate>\n`;
    rss += `    <guid>https://systemfree.love/articles/${a.slug}</guid>\n`;
    rss += `  </item>\n`;
  }

  rss += `</channel>\n</rss>\n`;

  try {
    writeFileSync(rssPath, rss);
    console.log(`[cron] RSS updated: ${rssArticles.length} items`);
  } catch (e) {
    console.log(`[cron] RSS write skipped (dist not found yet)`);
  }
}

// ─── Humanization refresh ──────────────────────────────────────────────────
function runHumanizationCheck() {
  console.log(`\n[cron] Humanization check running...`);

  const dataPath = join(ROOT, "client", "src", "data", "articles.json");
  if (!existsSync(dataPath)) return;

  const data = JSON.parse(readFileSync(dataPath, "utf-8"));
  let fixes = 0;
  let linkFixes = 0;

  for (const article of data.articles) {
    let body = article.body;

    // Remove emdashes
    if (body.includes("\u2014")) {
      body = body.replace(/\u2014/g, " - ");
      fixes++;
    }

    // Replace banned AI words (case-insensitive)
    for (const word of BANNED_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      if (regex.test(body)) {
        const replacement = REPLACEMENTS[word] || word;
        body = body.replace(regex, (match) => {
          if (match[0] === match[0].toUpperCase()) {
            return replacement[0].toUpperCase() + replacement.slice(1);
          }
          return replacement;
        });
        fixes++;
      }
    }

    // ─── Enforce 3+ Amazon affiliate links per article ──────────────
    const amazonLinkCount = (body.match(/amazon\.com\/dp\//g) || []).length;
    if (amazonLinkCount < MIN_AMAZON_LINKS) {
      const needed = MIN_AMAZON_LINKS - amazonLinkCount;
      // Find existing ASINs to avoid duplicates
      const existingAsins = new Set((body.match(/amazon\.com\/dp\/([A-Z0-9]+)/g) || []).map(m => m.replace('amazon.com/dp/', '')));
      
      // Pick products not already in the article, matching article tags if possible
      const articleText = (article.title + ' ' + article.description + ' ' + article.categorySlug).toLowerCase();
      const candidates = PRODUCT_CATALOG
        .filter(p => !existingAsins.has(p.asin))
        .sort((a, b) => {
          // Score by keyword match to article content
          const scoreA = a.tags.filter(t => articleText.includes(t)).length;
          const scoreB = b.tags.filter(t => articleText.includes(t)).length;
          return scoreB - scoreA;
        });

      // Insert links into the body at paragraph boundaries
      const paragraphs = body.split('</p>');
      let inserted = 0;
      if (paragraphs.length > 4 && candidates.length >= needed) {
        // Spread links evenly through the article
        const spacing = Math.floor((paragraphs.length - 2) / (needed + 1));
        for (let i = 0; i < needed && i < candidates.length; i++) {
          const insertIdx = Math.min(2 + spacing * (i + 1), paragraphs.length - 2);
          paragraphs[insertIdx] = paragraphs[insertIdx] + '</p><p>' + candidates[i].sentence + '.</p';
          inserted++;
        }
        body = paragraphs.join('</p>');
        linkFixes += inserted;
        console.log(`[cron] Added ${inserted} Amazon links to: ${article.slug}`);
      }
    }

    // Verify all Amazon links have the correct tag
    body = body.replace(/amazon\.com\/dp\/([A-Z0-9]+)(\?tag=[a-zA-Z0-9_-]+)?/g, (match, asin, existingTag) => {
      if (existingTag !== `?tag=${AMAZON_TAG}`) {
        fixes++;
        return `amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
      }
      return match;
    });

    article.body = body;
  }

  if (fixes > 0 || linkFixes > 0) {
    writeFileSync(dataPath, JSON.stringify(data));
    console.log(`[cron] Humanization: ${fixes} word/emdash fixes, ${linkFixes} Amazon link injections`);
  } else {
    console.log(`[cron] Humanization: clean, no fixes needed`);
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ─── Product Spotlight Cron ────────────────────────────────────────────────
function productSpotlight() {
  const spotlights = [
    "Blood Pressure Monitor", "Berberine Supplement", "Meditation Cushion",
    "Functional Medicine Guide", "Water Filter", "Air Purifier",
    "Grounding Mat", "Red Light Therapy", "Vitamin D3+K2", "Omega-3",
  ];
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const current = spotlights[weekNum % spotlights.length];
  console.log(`[cron] Product Spotlight this week: ${current}`);
}

// ─── Schedule ───────────────────────────────────────────────────────────────
if (AUTO_GEN_ENABLED) {
  // Run immediately on startup (with delay for server to start)
  setTimeout(() => {
    runAutoPublish();
    runHumanizationCheck();
    productSpotlight();
  }, 5000);

  // Auto-publish: every 6 hours
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  setInterval(runAutoPublish, SIX_HOURS);

  // Humanization check: every 12 hours
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  setInterval(runHumanizationCheck, TWELVE_HOURS);

  // Product spotlight: weekly
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  setInterval(productSpotlight, ONE_WEEK);

  console.log("[cron] AUTO_GEN_ENABLED = true");
  console.log("[cron] Schedules active:");
  console.log("  - Auto-publish: every 6 hours");
  console.log("  - Humanization check: every 12 hours");
  console.log("  - Product spotlight: weekly");
  console.log("  - Phase 1: 5 articles/day (staggered dateISO)");
  console.log("  - Phase 2: After all 300 live, weekly refresh");
} else {
  console.log("[cron] AUTO_GEN_ENABLED = false — server only, no automated crons");
}

// ─── Graceful shutdown ──────────────────────────────────────────────────────
process.on("SIGTERM", () => {
  console.log("[cron] SIGTERM received, shutting down...");
  server.kill("SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[cron] SIGINT received, shutting down...");
  server.kill("SIGINT");
  process.exit(0);
});
