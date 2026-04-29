/**
 * start-with-cron.mjs — Starts the Express server AND runs the 5-cron pipeline.
 *
 * CRON ARCHITECTURE (per addendum):
 *   1. Article Publisher — Phase 1 (5x/day every day) / Phase 2 (1x/weekday)
 *   2. Product Spotlight — Saturdays 08:00 UTC
 *   3. Monthly Refresh — 1st of month 03:00 UTC
 *   4. Quarterly Refresh — 1st of Jan/Apr/Jul/Oct 04:00 UTC
 *   5. ASIN Health Check — Sundays 05:00 UTC
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
import { runGenerateNewArticle } from "./cron/generate-new-article.mjs";
import { verifyAffiliateLinks } from "./cron/verify-affiliates.mjs";
import { assignHeroImage } from "./lib/image-pipeline.mjs";
import { generateArticle } from "./lib/generate-article.mjs";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// ─── Auto-gen master switch ─────────────────────────────────────────────────
const AUTO_GEN_ENABLED = (process.env.AUTO_GEN_ENABLED ?? "true") === "true";

// ─── DeepSeek V4-Pro client (for product spotlight) ─────────────────────────
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-82bdad0a1fd34987b73030504ae67080',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com',
});
const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';

// ─── ASIN Pool (verified, healthcare sovereignty niche) ─────────────────────
const ASIN_POOL = [
  { asin: '1635574110', name: 'The Price We Pay', tags: ['medical', 'billing', 'hospital'] },
  { asin: '0143110853', name: 'An American Sickness', tags: ['healthcare', 'insurance', 'system'] },
  { asin: '0593190009', name: 'Never Pay the First Bill', tags: ['debt', 'billing', 'negotiate'] },
  { asin: '0143115766', name: 'Your Money or Your Life', tags: ['financial', 'money', 'budget'] },
  { asin: '1595555277', name: 'Total Money Makeover', tags: ['debt', 'budget', 'financial'] },
  { asin: '0735213615', name: 'Atomic Habits', tags: ['habits', 'change', 'routine'] },
  { asin: '1501144324', name: '10% Happier', tags: ['mindfulness', 'meditation', 'stress'] },
  { asin: '0062515675', name: 'Food Fix', tags: ['food', 'nutrition', 'diet'] },
  { asin: '0062316117', name: 'Sapiens', tags: ['health', 'evolution', 'body'] },
  { asin: 'B07PWYGRVG', name: 'Blood Pressure Monitor', tags: ['blood pressure', 'heart', 'device'] },
  { asin: 'B0BQ3B3YBN', name: 'Berberine Supplement', tags: ['supplement', 'blood sugar', 'metabolism'] },
  { asin: 'B0D57PP7G3', name: 'Wellness Journal', tags: ['journal', 'writing', 'reflection'] },
  { asin: '0399590528', name: 'Breath by James Nestor', tags: ['breathing', 'health', 'body'] },
  { asin: '0062457713', name: 'The Wahls Protocol', tags: ['autoimmune', 'diet', 'healing'] },
  { asin: '0316387800', name: 'Why We Sleep', tags: ['sleep', 'health', 'brain'] },
  { asin: '0544609719', name: 'Being Mortal', tags: ['aging', 'end of life', 'medical'] },
  { asin: '0062656244', name: 'How Not to Die', tags: ['nutrition', 'disease', 'prevention'] },
  { asin: '1250127572', name: 'Genius Foods', tags: ['brain', 'nutrition', 'cognitive'] },
  { asin: '0062349481', name: 'The Body Keeps the Score', tags: ['trauma', 'healing', 'mental health'] },
  { asin: '0307352153', name: 'Born to Run', tags: ['exercise', 'running', 'fitness'] },
];

const AMAZON_TAG = "spankyspinola-20";

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

// ─── Helpers ────────────────────────────────────────────────────────────────
function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getDataPath() {
  return join(ROOT, "client", "src", "data", "articles.json");
}

function loadArticles() {
  const dataPath = getDataPath();
  if (!existsSync(dataPath)) return null;
  return JSON.parse(readFileSync(dataPath, "utf-8"));
}

function saveArticles(data) {
  writeFileSync(getDataPath(), JSON.stringify(data));
}

function formatDateHuman(d) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── CRON 1: Article Publisher ──────────────────────────────────────────────
// Phase 1 (published < 60): 5x/day every day (07:00, 10:00, 13:00, 16:00, 19:00 UTC)
// Phase 2 (published >= 60): 1x/weekday (08:00 UTC Mon-Fri)
// Pulls from queue, assigns hero image, sets status='published'.
// If queue is empty, generates a new article.

async function runArticlePublisher() {
  console.log(`\n[publisher] Starting... ${new Date().toISOString()}`);
  try {
    await runGenerateNewArticle();
  } catch (e) {
    console.error('[publisher] Error:', e.message);
  }

  // Rebuild sitemap/RSS after publishing
  try {
    const data = loadArticles();
    if (data) rebuildSitemapAndRss(data.articles);
  } catch (e) {
    console.error('[publisher] Sitemap/RSS rebuild failed:', e.message);
  }
}

// ─── CRON 2: Product Spotlight ──────────────────────────────────────────────
// Saturdays 08:00 UTC. Generates a review of a verified ASIN.
// Uses assignHeroImage(). Inserts directly as published.

async function runProductSpotlight() {
  console.log(`\n[spotlight] Starting... ${new Date().toISOString()}`);

  const data = loadArticles();
  if (!data) return;

  // Pick a random ASIN from the pool
  const product = pickRandom(ASIN_POOL);
  console.log(`[spotlight] Reviewing: ${product.name} (${product.asin})`);

  // Generate a product review article
  const title = `${product.name} Review: Is It Worth Your Money?`;
  const slug = slugify(title);

  // Check for duplicate slug
  if (data.articles.some(a => a.slug === slug)) {
    console.log(`[spotlight] Slug "${slug}" already exists, trying alternate title`);
    const altTitle = `Why ${product.name} Keeps Showing Up in My Recommendations`;
    const altSlug = slugify(altTitle);
    if (data.articles.some(a => a.slug === altSlug)) {
      console.log(`[spotlight] Both slugs exist, skipping this week`);
      return;
    }
  }

  const finalTitle = data.articles.some(a => a.slug === slug)
    ? `Why ${product.name} Keeps Showing Up in My Recommendations`
    : title;
  const finalSlug = slugify(finalTitle);

  try {
    const result = await generateArticle({
      title: finalTitle,
      category: 'The Sovereignty',
      tags: product.tags,
      description: `An honest review of ${product.name} - what it does, who it's for, and whether it's worth your money.`,
      productCatalog: ASIN_POOL.filter(p => p.asin !== product.asin).slice(0, 8),
    });

    // Assign hero image from Bunny CDN library
    const heroUrl = await assignHeroImage(finalSlug);

    const wordCount = result.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const nextId = Math.max(...data.articles.map(a => a.id)) + 1;

    const newArticle = {
      id: nextId,
      title: finalTitle,
      slug: finalSlug,
      description: `An honest review of ${product.name} - what it does, who it's for, and whether it's worth your money.`,
      metaDescription: `${product.name} review: honest take on whether this is worth buying for your health sovereignty journey.`,
      category: 'the-sovereignty',
      categoryName: 'The Sovereignty',
      dateISO: new Date().toISOString(),
      dateHuman: formatDateHuman(new Date()),
      readingTime: Math.max(5, Math.ceil(wordCount / 200)),
      body: result.body,
      imagePrompt: '',
      heroImage: heroUrl,
      ogImage: heroUrl,
      faqCount: 0,
      openerType: 'first-person',
      conclusionType: 'tender',
      backlinkType: 'internal',
      linkType: 'amazon',
      hasAffiliateLink: true,
      faqs: [],
      status: 'published',
      queued_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    };

    data.articles.push(newArticle);
    saveArticles(data);
    console.log(`[spotlight] Published: "${finalTitle}" (${wordCount} words)`);
  } catch (e) {
    console.error(`[spotlight] Failed: ${e.message}`);
  }
}

// ─── CRON 3: Monthly Refresh ────────────────────────────────────────────────
// 1st of month 03:00 UTC. Refreshes humanization, fixes banned words,
// ensures all Amazon links have correct tag, adds links where missing.

const BANNED_WORDS = [
  "utilize", "delve", "tapestry", "landscape", "paradigm", "synergy", "leverage",
  "unlock", "empower", "pivotal", "embark", "underscore", "paramount", "seamlessly",
  "robust", "beacon", "foster", "elevate", "curate", "curated", "bespoke",
  "resonate", "harness", "intricate", "plethora", "myriad", "groundbreaking",
  "innovative", "cutting-edge", "state-of-the-art", "game-changer", "ever-evolving",
  "rapidly-evolving", "stakeholders", "navigate", "ecosystem", "framework",
  "comprehensive", "transformative", "holistic", "nuanced", "multifaceted",
  "profound", "furthermore",
];

const BANNED_PHRASES = [
  "it's important to note that",
  "it's worth noting that",
  "in conclusion",
  "in summary",
  "a holistic approach",
  "in the realm of",
  "dive deep into",
  "at the end of the day",
  "in today's fast-paced world",
  "plays a crucial role",
];

const REPLACEMENTS = {
  "utilize": "use", "delve": "dig", "tapestry": "web", "landscape": "terrain",
  "paradigm": "model", "synergy": "connection", "leverage": "use", "unlock": "open",
  "empower": "support", "pivotal": "key", "embark": "start", "underscore": "highlight",
  "paramount": "critical", "seamlessly": "smoothly", "robust": "strong",
  "beacon": "signal", "foster": "build", "elevate": "raise", "curate": "pick",
  "curated": "picked", "bespoke": "custom", "resonate": "connect", "harness": "use",
  "intricate": "detailed", "plethora": "many", "myriad": "many",
  "groundbreaking": "new", "innovative": "creative", "cutting-edge": "modern",
  "state-of-the-art": "modern", "game-changer": "shift", "ever-evolving": "changing",
  "rapidly-evolving": "changing", "stakeholders": "people involved",
  "navigate": "work through", "ecosystem": "system", "framework": "structure",
  "comprehensive": "thorough", "transformative": "life-changing",
  "holistic": "whole-person", "nuanced": "layered", "multifaceted": "complex",
  "profound": "real", "furthermore": "Also",
};

// Product catalog for link injection
const PRODUCT_CATALOG = [
  { asin: "1635574110", tags: ["medical billing", "hospital", "pricing", "healthcare cost", "insurance"], sentence: 'One option that many people like is <a href="https://www.amazon.com/dp/1635574110?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">The Price We Pay (paid link)</a>, which breaks down exactly how hospital pricing works' },
  { asin: "0143110853", tags: ["healthcare system", "insurance", "medical industry", "profit"], sentence: 'A tool that often helps with this is <a href="https://www.amazon.com/dp/0143110853?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">An American Sickness (paid link)</a>, which traces how every branch of medicine became a profit center' },
  { asin: "0593190009", tags: ["medical debt", "billing", "negotiate", "hospital bill", "financial"], sentence: 'Something worth considering might be <a href="https://www.amazon.com/dp/0593190009?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">Never Pay the First Bill (paid link)</a>, a step-by-step playbook for fighting medical charges' },
  { asin: "0143115766", tags: ["financial freedom", "money", "budget", "independence"], sentence: 'One option that many people like is <a href="https://www.amazon.com/dp/0143115766?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">Your Money or Your Life (paid link)</a>, the classic guide to financial independence' },
  { asin: "1595555277", tags: ["debt", "budget", "financial", "money", "savings"], sentence: 'A tool that often helps with debt is <a href="https://www.amazon.com/dp/1595555277?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">The Total Money Makeover (paid link)</a> by Dave Ramsey' },
  { asin: "0735213615", tags: ["habits", "behavior", "change", "routine", "health"], sentence: 'Something worth considering might be <a href="https://www.amazon.com/dp/0735213615?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">Atomic Habits (paid link)</a> by James Clear, which shows how small changes compound' },
  { asin: "1501144324", tags: ["mindfulness", "meditation", "stress", "anxiety", "calm"], sentence: 'You could also try <a href="https://www.amazon.com/dp/1501144324?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">10% Happier (paid link)</a> by Dan Harris, a practical guide to meditation for skeptics' },
  { asin: "0062515675", tags: ["food", "nutrition", "diet", "eating", "health"], sentence: 'For those looking at food differently, <a href="https://www.amazon.com/dp/0062515675?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">Food Fix (paid link)</a> by Mark Hyman shows how what we eat connects to the larger system' },
  { asin: "B07PWYGRVG", tags: ["blood pressure", "monitor", "heart", "device", "health"], sentence: 'One practical step is getting a <a href="https://www.amazon.com/dp/B07PWYGRVG?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">home blood pressure monitor (paid link)</a> so you can track your own numbers' },
  { asin: "B0BQ3B3YBN", tags: ["berberine", "supplement", "blood sugar", "glucose", "metabolism"], sentence: 'Something many readers have found helpful is <a href="https://www.amazon.com/dp/B0BQ3B3YBN?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">berberine supplements (paid link)</a> for supporting healthy blood sugar levels' },
  { asin: "B0D57PP7G3", tags: ["journal", "writing", "reflection", "mindfulness", "healing"], sentence: 'A tool that often helps with the inner work is a <a href="https://www.amazon.com/dp/B0D57PP7G3?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">wellness journal (paid link)</a> for tracking what actually works for your body' },
];

function runMonthlyRefresh() {
  console.log(`\n[monthly] Refresh starting... ${new Date().toISOString()}`);

  const data = loadArticles();
  if (!data) return;

  let wordFixes = 0;
  let phraseFixes = 0;
  let dashFixes = 0;
  let linkFixes = 0;
  let tagFixes = 0;

  for (const article of data.articles) {
    let body = article.body;

    // 1. Replace em-dashes and en-dashes with spaced hyphens
    if (body.includes("\u2014") || body.includes("\u2013")) {
      body = body.replace(/[\u2014\u2013]/g, " - ");
      dashFixes++;
    }

    // 2. Replace banned words (case-insensitive)
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
        wordFixes++;
      }
    }

    // 3. Replace banned phrases (case-insensitive)
    for (const phrase of BANNED_PHRASES) {
      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
      if (regex.test(body)) {
        body = body.replace(regex, "");
        phraseFixes++;
      }
    }

    // 4. Ensure 3+ Amazon affiliate links
    const amazonLinkCount = (body.match(/amazon\.com\/dp\//g) || []).length;
    if (amazonLinkCount < 3) {
      const needed = 3 - amazonLinkCount;
      const existingAsins = new Set((body.match(/amazon\.com\/dp\/([A-Z0-9]+)/g) || []).map(m => m.replace('amazon.com/dp/', '')));
      const articleText = (article.title + ' ' + article.description + ' ' + (article.category || '')).toLowerCase();
      const candidates = PRODUCT_CATALOG
        .filter(p => !existingAsins.has(p.asin))
        .sort((a, b) => {
          const scoreA = a.tags.filter(t => articleText.includes(t)).length;
          const scoreB = b.tags.filter(t => articleText.includes(t)).length;
          return scoreB - scoreA;
        });

      const paragraphs = body.split('</p>');
      let inserted = 0;
      if (paragraphs.length > 4 && candidates.length >= needed) {
        const spacing = Math.floor((paragraphs.length - 2) / (needed + 1));
        for (let i = 0; i < needed && i < candidates.length; i++) {
          const insertIdx = Math.min(2 + spacing * (i + 1), paragraphs.length - 2);
          paragraphs[insertIdx] = paragraphs[insertIdx] + '</p><p>' + candidates[i].sentence + '.</p';
          inserted++;
        }
        body = paragraphs.join('</p>');
        linkFixes += inserted;
      }
    }

    // 5. Verify all Amazon links have the correct tag
    body = body.replace(/amazon\.com\/dp\/([A-Z0-9]+)(\?tag=[a-zA-Z0-9_-]+)?/g, (match, asin, existingTag) => {
      if (existingTag !== `?tag=${AMAZON_TAG}`) {
        tagFixes++;
        return `amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
      }
      return match;
    });

    article.body = body;
  }

  if (wordFixes > 0 || phraseFixes > 0 || dashFixes > 0 || linkFixes > 0 || tagFixes > 0) {
    saveArticles(data);
    console.log(`[monthly] Fixes: ${wordFixes} words, ${phraseFixes} phrases, ${dashFixes} dashes, ${linkFixes} links added, ${tagFixes} tags fixed`);
  } else {
    console.log(`[monthly] All clean, no fixes needed`);
  }
}

// ─── CRON 4: Quarterly Refresh ──────────────────────────────────────────────
// 1st of Jan/Apr/Jul/Oct 04:00 UTC. Deep content audit + sitemap rebuild.

function runQuarterlyRefresh() {
  console.log(`\n[quarterly] Refresh starting... ${new Date().toISOString()}`);

  const data = loadArticles();
  if (!data) return;

  // Run the monthly refresh first (all word/phrase/link fixes)
  runMonthlyRefresh();

  // Reload after monthly fixes
  const freshData = loadArticles();
  if (!freshData) return;

  const articles = freshData.articles;
  const published = articles.filter(a => a.status === 'published');

  // Check for articles with missing or broken hero images
  let heroFixes = 0;
  for (const art of published) {
    if (!art.heroImage || art.heroImage === '' || art.heroImage.includes('placeholder')) {
      // Will be assigned on next publish cycle
      console.log(`[quarterly] Missing hero: ${art.slug}`);
      heroFixes++;
    }
  }

  // Rebuild sitemap/RSS with all published articles
  rebuildSitemapAndRss(published);

  console.log(`[quarterly] Complete: ${published.length} published, ${heroFixes} missing heroes flagged`);
  console.log(`[quarterly] Next quarterly: ${getNextQuarterDate()}`);
}

function getNextQuarterDate() {
  const now = new Date();
  const quarters = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
  const currentMonth = now.getMonth();
  const nextQuarter = quarters.find(q => q > currentMonth) || quarters[0];
  const year = nextQuarter <= currentMonth ? now.getFullYear() + 1 : now.getFullYear();
  return `${year}-${String(nextQuarter + 1).padStart(2, '0')}-01`;
}

// ─── Sitemap/RSS Rebuild ────────────────────────────────────────────────────
function rebuildSitemapAndRss(publishedArticles) {
  const staticPages = [
    ['/', '1.0', 'weekly'], ['/articles', '0.9', 'daily'],
    ['/start-here', '0.8', 'monthly'], ['/about', '0.7', 'monthly'],
    ['/compare', '0.7', 'monthly'], ['/quizzes', '0.7', 'monthly'],
    ['/assessments', '0.7', 'monthly'], ['/tools', '0.7', 'monthly'],
    ['/privacy', '0.3', 'yearly'], ['/terms', '0.3', 'yearly'],
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
  for (const a of publishedArticles) {
    sitemap += `  <url><loc>https://systemfree.love/articles/${a.slug}</loc><priority>0.6</priority><changefreq>monthly</changefreq><lastmod>${(a.dateISO || '').split('T')[0]}</lastmod></url>\n`;
  }
  sitemap += `</urlset>\n`;

  const sitemapPath = join(ROOT, "dist", "public", "sitemap.xml");
  try {
    writeFileSync(sitemapPath, sitemap);
    console.log(`[sitemap] Updated: ${publishedArticles.length} articles`);
  } catch (e) {
    console.log(`[sitemap] Write skipped (dist not found yet)`);
  }

  // RSS
  const rssArticles = publishedArticles
    .sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''))
    .slice(0, 20);

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
    rss += `    <description>${escapeXml(a.description || '')}</description>\n`;
    rss += `    <pubDate>${new Date(a.dateISO).toUTCString()}</pubDate>\n`;
    rss += `    <guid>https://systemfree.love/articles/${a.slug}</guid>\n`;
    rss += `  </item>\n`;
  }

  rss += `</channel>\n</rss>\n`;

  const rssPath = join(ROOT, "dist", "public", "rss.xml");
  try {
    writeFileSync(rssPath, rss);
    console.log(`[rss] Updated: ${rssArticles.length} items`);
  } catch (e) {
    console.log(`[rss] Write skipped (dist not found yet)`);
  }
}

// ─── Schedule (node-cron) ──────────────────────────────────────────────────
if (AUTO_GEN_ENABLED) {
  // Determine phase based on published count
  const data = loadArticles();
  const publishedCount = data ? data.articles.filter(a => a.status === 'published').length : 0;
  // Legacy articles without status field count as published
  const legacyPublished = data ? data.articles.filter(a => !a.status && a.dateISO <= new Date().toISOString()).length : 0;
  const totalPublished = publishedCount + legacyPublished;

  const isPhase1 = totalPublished < 60;

  console.log(`[cron] Published count: ${totalPublished} (${isPhase1 ? 'PHASE 1' : 'PHASE 2'})`);

  // Run once on startup (after server has time to bind)
  setTimeout(() => {
    runArticlePublisher();
  }, 10000);

  // ─── CRON 1: Article Publisher ─────────────────────────────────────────────
  if (isPhase1) {
    // Phase 1: 5x/day every day (07:00, 10:00, 13:00, 16:00, 19:00 UTC)
    cron.schedule('0 7,10,13,16,19 * * *', async () => {
      console.log(`[cron] article-publisher (phase1) ${new Date().toISOString()}`);
      try { await runArticlePublisher(); } catch (e) { console.error('[cron] publisher failed:', e.message); }
    }, { timezone: 'UTC' });
    console.log('  1. Article Publisher:   Phase 1 — 5x/day (07,10,13,16,19 UTC) every day');
  } else {
    // Phase 2: 1x/weekday (08:00 UTC Mon-Fri)
    cron.schedule('0 8 * * 1-5', async () => {
      console.log(`[cron] article-publisher (phase2) ${new Date().toISOString()}`);
      try { await runArticlePublisher(); } catch (e) { console.error('[cron] publisher failed:', e.message); }
    }, { timezone: 'UTC' });
    console.log('  1. Article Publisher:   Phase 2 — 1x/weekday (08:00 UTC Mon-Fri)');
  }

  // ─── CRON 2: Product Spotlight — Saturday 08:00 UTC ────────────────────────
  cron.schedule('0 8 * * 6', async () => {
    console.log(`[cron] product-spotlight ${new Date().toISOString()}`);
    try { await runProductSpotlight(); } catch (e) { console.error('[cron] spotlight failed:', e.message); }
  }, { timezone: 'UTC' });
  console.log('  2. Product Spotlight:   Saturday 08:00 UTC');

  // ─── CRON 3: Monthly Refresh — 1st of month 03:00 UTC ─────────────────────
  cron.schedule('0 3 1 * *', () => {
    console.log(`[cron] monthly-refresh ${new Date().toISOString()}`);
    try { runMonthlyRefresh(); } catch (e) { console.error('[cron] monthly failed:', e.message); }
  }, { timezone: 'UTC' });
  console.log('  3. Monthly Refresh:     1st of month 03:00 UTC');

  // ─── CRON 4: Quarterly Refresh — 1st of Jan/Apr/Jul/Oct 04:00 UTC ─────────
  cron.schedule('0 4 1 1,4,7,10 *', () => {
    console.log(`[cron] quarterly-refresh ${new Date().toISOString()}`);
    try { runQuarterlyRefresh(); } catch (e) { console.error('[cron] quarterly failed:', e.message); }
  }, { timezone: 'UTC' });
  console.log('  4. Quarterly Refresh:   1st of Jan/Apr/Jul/Oct 04:00 UTC');

  // ─── CRON 5: ASIN Health Check — Sunday 05:00 UTC ─────────────────────────
  cron.schedule('0 5 * * 0', async () => {
    console.log(`[cron] asin-health-check ${new Date().toISOString()}`);
    try { await verifyAffiliateLinks(); } catch (e) { console.error('[cron] asin-check failed:', e.message); }
  }, { timezone: 'UTC' });
  console.log('  5. ASIN Health Check:   Sunday 05:00 UTC');

  console.log('[cron] AUTO_GEN_ENABLED = true');
  console.log('[cron] All 5 crons registered.');
} else {
  console.log('[cron] AUTO_GEN_ENABLED != "true" — crons disabled');
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
