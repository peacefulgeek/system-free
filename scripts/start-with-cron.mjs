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
          // Preserve capitalization
          if (match[0] === match[0].toUpperCase()) {
            return replacement[0].toUpperCase() + replacement.slice(1);
          }
          return replacement;
        });
        fixes++;
      }
    }

    article.body = body;
  }

  if (fixes > 0) {
    writeFileSync(dataPath, JSON.stringify(data));
    console.log(`[cron] Humanization: ${fixes} fixes applied`);
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

console.log("[cron] Schedules active:");
console.log("  - Auto-publish: every 6 hours");
console.log("  - Humanization check: every 12 hours");
console.log("  - Product spotlight: weekly");
console.log("  - Phase 1: 5 articles/day (staggered dateISO)");
console.log("  - Phase 2: After all 300 live, weekly refresh");

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
