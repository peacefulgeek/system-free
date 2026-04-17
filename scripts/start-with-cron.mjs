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
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// ─── Auto-gen master switch ─────────────────────────────────────────────────
// Reads from env on Render; defaults to true for backward compat.
const AUTO_GEN_ENABLED = (process.env.AUTO_GEN_ENABLED ?? "true") === "true";

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
  // Classic AI tells
  "delve", "tapestry", "paradigm", "synergy", "leverage", "unlock", "empower",
  "utilize", "pivotal", "embark", "underscore", "paramount", "seamlessly",
  "robust", "beacon", "foster", "elevate", "curate", "curated", "bespoke",
  "resonate", "harness", "intricate", "plethora", "myriad", "comprehensive",
  // Marketing fluff
  "transformative", "groundbreaking", "innovative", "cutting-edge", "revolutionary",
  "state-of-the-art", "ever-evolving", "game-changing", "next-level", "world-class",
  "unparalleled", "unprecedented", "remarkable", "extraordinary", "exceptional",
  // Abstract filler
  "profound", "profoundly", "holistic", "nuanced", "multifaceted", "stakeholders",
  "ecosystem", "landscape", "realm", "sphere", "domain",
  // AI hedging
  "arguably", "notably", "crucially", "importantly", "essentially",
  "fundamentally", "inherently", "intrinsically", "substantively",
  // Bullshit verbs
  "streamline", "optimize", "facilitate", "amplify", "catalyze",
  "propel", "spearhead", "orchestrate", "navigate", "traverse",
  // AI-favorite connectors
  "furthermore", "moreover", "additionally", "consequently", "subsequently",
  "thereby", "thusly", "wherein", "whereby",
  // Original extras
  "cornerstone", "underscores", "navigating", "unveil",
  "game-changer", "seamless", "catalyst", "revolutionize", "dynamic",
];

const REPLACEMENTS = {
  // Classic AI tells
  "delve": "dig", "tapestry": "web", "paradigm": "framework", "synergy": "connection",
  "leverage": "use", "unlock": "open", "empower": "support", "utilize": "use",
  "pivotal": "key", "embark": "start", "underscore": "highlight", "paramount": "critical",
  "seamlessly": "smoothly", "robust": "strong", "beacon": "signal", "foster": "build",
  "elevate": "raise", "curate": "pick", "curated": "picked", "bespoke": "custom",
  "resonate": "connect", "harness": "use", "intricate": "detailed", "plethora": "many",
  "myriad": "many", "comprehensive": "thorough",
  // Marketing fluff
  "transformative": "life-changing", "groundbreaking": "new", "innovative": "creative",
  "cutting-edge": "modern", "revolutionary": "new", "state-of-the-art": "modern",
  "ever-evolving": "changing", "game-changing": "big", "next-level": "better",
  "world-class": "top", "unparalleled": "rare", "unprecedented": "unusual",
  "remarkable": "notable", "extraordinary": "unusual", "exceptional": "strong",
  // Abstract filler
  "profound": "real", "profoundly": "deeply", "holistic": "whole-person",
  "nuanced": "layered", "multifaceted": "complex", "stakeholders": "people involved",
  "ecosystem": "system", "landscape": "terrain", "realm": "space",
  "sphere": "area", "domain": "field",
  // AI hedging
  "arguably": "possibly", "notably": "especially", "crucially": "critically",
  "importantly": "critically", "essentially": "basically", "fundamentally": "at its core",
  "inherently": "naturally", "intrinsically": "naturally", "substantively": "meaningfully",
  // Bullshit verbs
  "streamline": "simplify", "optimize": "improve", "facilitate": "help",
  "amplify": "increase", "catalyze": "trigger", "propel": "push",
  "spearhead": "lead", "orchestrate": "organize", "navigate": "work through",
  "traverse": "cross",
  // AI-favorite connectors
  "furthermore": "Also", "moreover": "And", "additionally": "Also",
  "consequently": "So", "subsequently": "Then", "thereby": "so",
  "thusly": "so", "wherein": "where", "whereby": "where",
  // Original extras
  "cornerstone": "foundation", "underscores": "highlights", "navigating": "working through",
  "unveil": "reveal", "game-changer": "shift", "seamless": "smooth",
  "catalyst": "spark", "revolutionize": "reshape", "dynamic": "active",
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

// ─── Product Freshness Checker ────────────────────────────────────────────
// Checks every ASIN in articles against Amazon. If a product page returns
// 404 or "Page not found", it auto-swaps the dead ASIN with a working
// alternative from the catalog. Runs weekly. Pure in-code, no external deps.

// Backup ASINs — verified working, grouped by topic for smart replacement
const BACKUP_ASINS = [
  { asin: "1635574110", name: "The Price We Pay", tags: ["medical", "billing", "hospital", "cost"] },
  { asin: "0143110853", name: "An American Sickness", tags: ["healthcare", "insurance", "system"] },
  { asin: "0593190009", name: "Never Pay the First Bill", tags: ["debt", "billing", "negotiate"] },
  { asin: "0143115766", name: "Your Money or Your Life", tags: ["financial", "money", "budget"] },
  { asin: "1595555277", name: "Total Money Makeover", tags: ["debt", "budget", "financial"] },
  { asin: "0735213615", name: "Atomic Habits", tags: ["habits", "change", "routine"] },
  { asin: "1501144324", name: "10% Happier", tags: ["mindfulness", "meditation", "stress"] },
  { asin: "0062515675", name: "Food Fix", tags: ["food", "nutrition", "diet"] },
  { asin: "0062316117", name: "Sapiens", tags: ["health", "evolution", "body"] },
  { asin: "B07PWYGRVG", name: "Blood Pressure Monitor", tags: ["blood pressure", "heart", "device"] },
  { asin: "B0BQ3B3YBN", name: "Berberine Supplement", tags: ["supplement", "blood sugar", "metabolism"] },
  { asin: "B0D57PP7G3", name: "Wellness Journal", tags: ["journal", "writing", "reflection"] },
  { asin: "0399590528", name: "Breath by James Nestor", tags: ["breathing", "health", "body"] },
  { asin: "0062457713", name: "The Wahls Protocol", tags: ["autoimmune", "diet", "healing"] },
  { asin: "0316387800", name: "Why We Sleep", tags: ["sleep", "health", "brain"] },
  { asin: "0544609719", name: "Being Mortal", tags: ["aging", "end of life", "medical"] },
  { asin: "0062656244", name: "How Not to Die", tags: ["nutrition", "disease", "prevention"] },
  { asin: "1250127572", name: "Genius Foods", tags: ["brain", "nutrition", "cognitive"] },
  { asin: "0062349481", name: "The Body Keeps the Score", tags: ["trauma", "healing", "mental health"] },
  { asin: "0307352153", name: "Born to Run", tags: ["exercise", "running", "fitness"] },
];

async function checkAsinFreshness(asin) {
  try {
    const url = `https://www.amazon.com/dp/${asin}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    // 404 = dead product. 503 = Amazon anti-bot (product likely fine).
    // 200/301/302 = alive.
    if (res.status === 404) return "dead";
    if (res.status === 503) return "blocked"; // anti-bot, assume alive
    return "alive";
  } catch (e) {
    return "error"; // network timeout, assume alive
  }
}

async function runProductFreshnessCheck() {
  console.log(`\n[cron] Product freshness check starting...`);

  const dataPath = join(ROOT, "client", "src", "data", "articles.json");
  if (!existsSync(dataPath)) return;

  const data = JSON.parse(readFileSync(dataPath, "utf-8"));
  const articles = data.articles;

  // Collect all unique ASINs from articles
  const asinSet = new Set();
  for (const art of articles) {
    const matches = art.body.match(/amazon\.com\/dp\/([A-Z0-9]{10})/g) || [];
    for (const m of matches) {
      asinSet.add(m.replace("amazon.com/dp/", ""));
    }
  }

  const allAsins = [...asinSet];
  console.log(`[cron] Checking ${allAsins.length} unique ASINs...`);

  // Check each ASIN with a small delay to avoid rate limiting
  const deadAsins = [];
  for (let i = 0; i < allAsins.length; i++) {
    const asin = allAsins[i];
    const status = await checkAsinFreshness(asin);
    if (status === "dead") {
      deadAsins.push(asin);
      console.log(`[cron] DEAD ASIN: ${asin}`);
    }
    // Small delay between checks to be respectful
    if (i < allAsins.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  if (deadAsins.length === 0) {
    console.log(`[cron] All ${allAsins.length} ASINs are alive. No replacements needed.`);
    return;
  }

  console.log(`[cron] Found ${deadAsins.length} dead ASINs. Replacing...`);

  // For each dead ASIN, find a backup that isn't already used
  const usedAsins = new Set(allAsins);
  let totalSwaps = 0;

  for (const deadAsin of deadAsins) {
    // Find a backup ASIN not already in use
    const backup = BACKUP_ASINS.find(b => !usedAsins.has(b.asin));
    if (!backup) {
      console.log(`[cron] No backup available for ${deadAsin}, skipping`);
      continue;
    }

    // Replace in all articles
    let swapCount = 0;
    for (const art of articles) {
      if (art.body.includes(deadAsin)) {
        art.body = art.body.split(deadAsin).join(backup.asin);
        swapCount++;
      }
    }

    usedAsins.add(backup.asin);
    totalSwaps += swapCount;
    console.log(`[cron] Replaced ${deadAsin} -> ${backup.asin} (${backup.name}) in ${swapCount} articles`);
  }

  if (totalSwaps > 0) {
    writeFileSync(dataPath, JSON.stringify(data));
    console.log(`[cron] Product freshness: ${totalSwaps} total ASIN swaps across articles`);
  }
}

// ─── Product Metadata Refresh ─────────────────────────────────────────────
// Fetches actual product titles, prices, and availability from Amazon.
// Updates product-cache.json so the frontend can display current data.
// Runs weekly. Processes ASINs in batches with delays to avoid rate limiting.

const PRODUCT_CACHE_PATH = join(ROOT, "client", "src", "data", "product-cache.json");

// Rotating User-Agent strings to reduce detection
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Fetch product metadata from a single Amazon product page.
 * Extracts title, price, and availability using HTML parsing.
 * Returns null if the fetch fails or gets blocked.
 */
async function fetchProductMeta(asin) {
  try {
    const url = `https://www.amazon.com/dp/${asin}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": randomUA(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (res.status === 404) {
      return { title: null, price: null, availability: "unavailable", status: "dead" };
    }
    if (res.status === 503) {
      return null; // anti-bot block, skip this ASIN
    }

    const html = await res.text();

    // Extract title from <span id="productTitle">
    let title = null;
    const titleMatch = html.match(/id=["']productTitle["'][^>]*>([^<]+)/);
    if (titleMatch) {
      title = titleMatch[1].trim()
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }

    // Extract price — try priceAmount JSON first, then dollar regex
    let price = null;
    const priceAmountMatch = html.match(/"priceAmount":"?(\d+\.?\d*)/);
    if (priceAmountMatch) {
      price = "$" + parseFloat(priceAmountMatch[1]).toFixed(2);
    } else {
      const dollarMatch = html.match(/\$(\d+\.\d{2})/);
      if (dollarMatch) {
        price = "$" + dollarMatch[1];
      }
    }

    // Extract availability
    let availability = "unknown";
    const availDiv = html.match(/id="availability"[\s\S]{0,500}/);
    if (availDiv) {
      const availText = availDiv[0];
      if (availText.includes("In Stock") || availText.includes("in stock")) {
        availability = "in-stock";
      } else if (availText.includes("Currently unavailable") || availText.includes("currently unavailable")) {
        availability = "unavailable";
      }
    }
    // Fallback: check for Add to Cart button
    if (availability === "unknown") {
      if (html.includes("add-to-cart-button") || html.includes("Add to Cart")) {
        availability = "in-stock";
      }
    }

    return { title, price, availability, status: "ok" };
  } catch (e) {
    return null; // network error, skip
  }
}

/**
 * Collect all unique ASINs from articles.json, product-catalog.ts references,
 * and the Tools page hardcoded ASINs.
 */
function collectAllAsins() {
  const asinSet = new Set();

  // From articles.json
  const dataPath = join(ROOT, "client", "src", "data", "articles.json");
  if (existsSync(dataPath)) {
    const data = JSON.parse(readFileSync(dataPath, "utf-8"));
    for (const art of data.articles) {
      const matches = art.body.match(/amazon\.com\/dp\/([A-Z0-9]{10})/g) || [];
      for (const m of matches) {
        asinSet.add(m.replace("amazon.com/dp/", ""));
      }
    }
  }

  // From product-catalog.ts (read as text, extract ASINs)
  const catalogPath = join(ROOT, "client", "src", "data", "product-catalog.ts");
  if (existsSync(catalogPath)) {
    const catalogText = readFileSync(catalogPath, "utf-8");
    const catalogMatches = catalogText.match(/asin:\s*"([A-Z0-9]{10})"/g) || [];
    for (const m of catalogMatches) {
      const asin = m.match(/"([A-Z0-9]{10})"/)[1];
      asinSet.add(asin);
    }
  }

  // From Tools.tsx (read as text, extract ASINs)
  const toolsPath = join(ROOT, "client", "src", "pages", "Tools.tsx");
  if (existsSync(toolsPath)) {
    const toolsText = readFileSync(toolsPath, "utf-8");
    const toolsMatches = toolsText.match(/asin:\s*"([A-Z0-9]{10})"/g) || [];
    for (const m of toolsMatches) {
      const asin = m.match(/"([A-Z0-9]{10})"/)[1];
      asinSet.add(asin);
    }
  }

  // From backup ASINs
  for (const b of BACKUP_ASINS) {
    asinSet.add(b.asin);
  }

  return [...asinSet];
}

/**
 * Main product metadata refresh function.
 * Fetches metadata for all ASINs, updates product-cache.json.
 * Processes in batches of 5 with 3-5 second delays between requests.
 */
async function runProductMetaRefresh() {
  console.log(`\n[cron] Product metadata refresh starting...`);

  // Load existing cache
  let cache = { lastFullRefresh: null, products: {} };
  if (existsSync(PRODUCT_CACHE_PATH)) {
    try {
      cache = JSON.parse(readFileSync(PRODUCT_CACHE_PATH, "utf-8"));
    } catch (e) {
      console.log("[cron] Cache file corrupt, starting fresh");
    }
  }

  const allAsins = collectAllAsins();
  console.log(`[cron] Found ${allAsins.length} unique ASINs to refresh`);

  let updated = 0;
  let failed = 0;
  let priceChanges = 0;
  let titleChanges = 0;
  let availChanges = 0;

  // Process ASINs with delays to avoid rate limiting
  for (let i = 0; i < allAsins.length; i++) {
    const asin = allAsins[i];
    const meta = await fetchProductMeta(asin);

    if (meta === null) {
      failed++;
      // Keep existing cache entry if we have one
      if (i % 20 === 0) {
        console.log(`[cron] Progress: ${i + 1}/${allAsins.length} (${updated} updated, ${failed} skipped)`);
      }
    } else {
      const existing = cache.products[asin];

      // Track changes
      if (existing) {
        if (meta.price && existing.price && meta.price !== existing.price) {
          priceChanges++;
          console.log(`[cron] Price change ${asin}: ${existing.price} -> ${meta.price}`);
        }
        if (meta.title && existing.title && meta.title !== existing.title) {
          titleChanges++;
        }
        if (meta.availability !== existing.availability) {
          availChanges++;
          console.log(`[cron] Availability change ${asin}: ${existing.availability} -> ${meta.availability}`);
        }
      }

      // Update cache entry
      cache.products[asin] = {
        title: meta.title || (existing ? existing.title : null),
        price: meta.price || (existing ? existing.price : null),
        availability: meta.availability || "unknown",
        lastChecked: new Date().toISOString(),
      };
      updated++;
    }

    // Random delay between 2-5 seconds to avoid rate limiting
    if (i < allAsins.length - 1) {
      const delay = 2000 + Math.random() * 3000;
      await new Promise(r => setTimeout(r, delay));
    }
  }

  // Update refresh timestamp
  cache.lastFullRefresh = new Date().toISOString();

  // Write updated cache
  writeFileSync(PRODUCT_CACHE_PATH, JSON.stringify(cache, null, 2));

  console.log(`[cron] Product metadata refresh complete:`);
  console.log(`  - Total ASINs: ${allAsins.length}`);
  console.log(`  - Updated: ${updated}`);
  console.log(`  - Failed/skipped: ${failed}`);
  console.log(`  - Price changes: ${priceChanges}`);
  console.log(`  - Title changes: ${titleChanges}`);
  console.log(`  - Availability changes: ${availChanges}`);
  console.log(`  - Cache size: ${Object.keys(cache.products).length} products`);
}

// ─── Schedule (node-cron) ──────────────────────────────────────────────────
// All crons use node-cron expressions instead of setTimeout/setInterval.
// This avoids the ~24.8-day overflow bug and survives Render restarts.
if (AUTO_GEN_ENABLED) {
  // Run once on startup (after server has time to bind)
  setTimeout(() => {
    runAutoPublish();
    runHumanizationCheck();
  }, 5000);

  // 1. Article auto-publish — Mon-Fri 06:00 UTC (5/week)
  cron.schedule('0 6 * * 1-5', async () => {
    console.log(`[cron] auto-publish ${new Date().toISOString()}`);
    try { runAutoPublish(); } catch (e) { console.error('[cron] auto-publish failed:', e); }
  }, { timezone: 'UTC' });

  // 2. Humanization check — every 12 hours (00:00 and 12:00 UTC)
  cron.schedule('0 0,12 * * *', async () => {
    console.log(`[cron] humanization-check ${new Date().toISOString()}`);
    try { runHumanizationCheck(); } catch (e) { console.error('[cron] humanization-check failed:', e); }
  }, { timezone: 'UTC' });

  // 3. Product spotlight — Saturday 08:00 UTC (1/week)
  cron.schedule('0 8 * * 6', async () => {
    console.log(`[cron] product-spotlight ${new Date().toISOString()}`);
    try { productSpotlight(); } catch (e) { console.error('[cron] product-spotlight failed:', e); }
  }, { timezone: 'UTC' });

  // 4. Product freshness check (ASIN health) — Sunday 05:00 UTC
  cron.schedule('0 5 * * 0', async () => {
    console.log(`[cron] product-freshness ${new Date().toISOString()}`);
    try { await runProductFreshnessCheck(); } catch (e) { console.error('[cron] product-freshness failed:', e); }
  }, { timezone: 'UTC' });

  // 5. Product metadata refresh (titles, prices, availability) — Wednesday 04:00 UTC
  cron.schedule('0 4 * * 3', async () => {
    console.log(`[cron] product-meta-refresh ${new Date().toISOString()}`);
    try { await runProductMetaRefresh(); } catch (e) { console.error('[cron] product-meta-refresh failed:', e); }
  }, { timezone: 'UTC' });

  console.log('[cron] AUTO_GEN_ENABLED = true');
  console.log('[cron] All 5 node-cron schedules registered:');
  console.log('  1. Auto-publish:          Mon-Fri 06:00 UTC');
  console.log('  2. Humanization check:    00:00 & 12:00 UTC daily');
  console.log('  3. Product spotlight:     Saturday 08:00 UTC');
  console.log('  4. Product freshness:     Sunday 05:00 UTC');
  console.log('  5. Product meta refresh:  Wednesday 04:00 UTC');
} else {
  console.log('[cron] AUTO_GEN_ENABLED != "true" — cron disabled');
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
