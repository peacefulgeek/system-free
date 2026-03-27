#!/usr/bin/env node
/**
 * Auto-publish pipeline for Free From the System
 * 
 * This script manages the drip-feed publishing of articles.
 * Run daily via cron: node scripts/auto-publish.mjs
 * 
 * What it does:
 * 1. Reads articles-final.json
 * 2. Checks which articles should be live based on today's date
 * 3. Regenerates sitemap.xml and rss.xml with newly live articles
 * 4. Outputs a summary of what was published
 * 
 * The React app already filters by date, so articles become visible
 * automatically. This script just keeps the sitemap/RSS current.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const today = new Date().toISOString().split('T')[0];
console.log(`Auto-publish check for ${today}`);

// Read article data
const data = JSON.parse(readFileSync(join(ROOT, 'client/src/data/articles.json'), 'utf-8'));
const articles = data.articles;
const live = articles.filter(a => a.dateISO <= today);
const newToday = articles.filter(a => a.dateISO === today);

console.log(`Total articles: ${articles.length}`);
console.log(`Live articles: ${live.length}`);
console.log(`New today: ${newToday.length}`);

if (newToday.length > 0) {
  console.log('\\nNewly published:');
  newToday.forEach(a => console.log(`  - ${a.title} (${a.categoryName})`));
}

// Regenerate sitemap
const staticPages = [
  ['/', '1.0', 'weekly'],
  ['/articles', '0.9', 'daily'],
  ['/start-here', '0.8', 'monthly'],
  ['/about', '0.7', 'monthly'],
  ['/compare', '0.7', 'monthly'],
  ['/quizzes', '0.7', 'monthly'],
  ['/privacy', '0.3', 'yearly'],
  ['/terms', '0.3', 'yearly'],
];

const categories = ['the-escape', 'the-alternative', 'the-math', 'the-debt', 'the-sovereignty'];

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';
staticPages.forEach(([path, priority, freq]) => {
  sitemap += `  <url><loc>https://systemfree.love${path}</loc><priority>${priority}</priority><changefreq>${freq}</changefreq><lastmod>${today}</lastmod></url>\\n`;
});
categories.forEach(cat => {
  sitemap += `  <url><loc>https://systemfree.love/category/${cat}</loc><priority>0.8</priority><changefreq>weekly</changefreq><lastmod>${today}</lastmod></url>\\n`;
});
live.forEach(a => {
  sitemap += `  <url><loc>https://systemfree.love/articles/${a.slug}</loc><priority>0.6</priority><changefreq>monthly</changefreq><lastmod>${a.dateISO}</lastmod></url>\\n`;
});
sitemap += '</urlset>';
writeFileSync(join(ROOT, 'client/public/sitemap.xml'), sitemap);

// Regenerate RSS
const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let rss = '<?xml version="1.0" encoding="UTF-8"?>\\n';
rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\\n<channel>\\n';
rss += '<title>Free From the System</title>\\n';
rss += '<link>https://systemfree.love</link>\\n';
rss += '<description>The system is broken. Your health doesn\\'t have to be.</description>\\n';
rss += '<language>en-us</language>\\n';
rss += `<lastBuildDate>${today}T00:00:00Z</lastBuildDate>\\n`;
rss += '<atom:link href="https://systemfree.love/rss.xml" rel="self" type="application/rss+xml"/>\\n';

live.slice(0, 20).forEach(a => {
  rss += '<item>\\n';
  rss += `<title>${escapeXml(a.title)}</title>\\n`;
  rss += `<link>https://systemfree.love/articles/${a.slug}</link>\\n`;
  rss += `<guid>https://systemfree.love/articles/${a.slug}</guid>\\n`;
  rss += `<description>${escapeXml(a.description)}</description>\\n`;
  rss += `<pubDate>${a.dateISO}T00:00:00Z</pubDate>\\n`;
  rss += `<category>${escapeXml(a.categoryName)}</category>\\n`;
  rss += '</item>\\n';
});

rss += '</channel>\\n</rss>';
writeFileSync(join(ROOT, 'client/public/rss.xml'), rss);

console.log(`\\nSitemap updated: ${live.length} article URLs`);
console.log(`RSS updated: ${Math.min(20, live.length)} latest articles`);
console.log('Done.');
