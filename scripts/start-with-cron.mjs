#!/usr/bin/env node
/**
 * start-with-cron.mjs — Starts the Express server AND runs the auto-publish
 * pipeline on a schedule.
 *
 * Schedule:
 *   - Phase 1 (first 54 days after launch): 5 articles/day
 *   - Phase 2 (after all 300 are live): 5 articles/week (for new content)
 *
 * The React app already filters by dateISO <= today, so articles become
 * visible automatically. This script regenerates sitemap.xml and rss.xml
 * to keep them current.
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

  // Regenerate sitemap.xml
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
  writeFileSync(sitemapPath, sitemap);
  console.log(`[cron] Sitemap updated: ${live.length} articles`);

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
  writeFileSync(rssPath, rss);
  console.log(`[cron] RSS updated: ${rssArticles.length} items`);
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ─── Schedule ───────────────────────────────────────────────────────────────
// Run immediately on startup
setTimeout(runAutoPublish, 5000);

// Then run every 6 hours (4x/day covers the 5/day drip schedule)
const SIX_HOURS = 6 * 60 * 60 * 1000;
setInterval(runAutoPublish, SIX_HOURS);

console.log("[cron] Auto-publish scheduled: every 6 hours");
console.log("[cron] Phase 1: 5 articles/day (articles have staggered dateISO values)");
console.log("[cron] Phase 2: After all 300 are live, new content at 5/week pace");

// ─── Product Spotlight Cron ────────────────────────────────────────────────
// Log a weekly product spotlight reminder (actual spotlight rotation is client-side)
function productSpotlight() {
  const spotlights = [
    "Blood Pressure Monitor", "Berberine Supplement", "Meditation Cushion",
    "Functional Medicine Guide", "EMF Meter", "Water Filter", "Air Purifier",
    "Grounding Mat", "Red Light Therapy", "Vitamin D3+K2"
  ];
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const current = spotlights[weekNum % spotlights.length];
  console.log(`[cron] Product Spotlight this week: ${current}`);
}

setTimeout(productSpotlight, 10000);
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
setInterval(productSpotlight, ONE_WEEK);
console.log("[cron] Product spotlight rotation: weekly");

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
