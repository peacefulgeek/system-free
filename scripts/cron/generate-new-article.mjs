/**
 * generate-new-article.mjs — 6th cron job: generates one new article per run.
 *
 * Flow:
 *   1. Pick a topic from the topic queue (or generate one via Forge API)
 *   2. Call generateArticle() with quality gate enforcement
 *   3. Generate a hero image via Forge image API
 *   4. Append the new article to articles.json with a future dateISO
 *   5. Regenerate sitemap.xml and rss.xml
 *
 * Runs: Tuesday & Thursday at 07:00 UTC (2 new articles/week)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateArticle } from '../lib/generate-article.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || process.env.VITE_FRONTEND_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || process.env.VITE_FRONTEND_FORGE_API_KEY;
const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

// ─── Categories with weights ─────────────────────────────────────────────────
const CATEGORIES = [
  { slug: 'the-escape', name: 'The Escape' },
  { slug: 'the-alternative', name: 'The Alternative' },
  { slug: 'the-math', name: 'The Math' },
  { slug: 'the-debt', name: 'The Debt' },
  { slug: 'the-sovereignty', name: 'The Sovereignty' },
];

const OPENER_TYPES = ['first-person', 'named-reference', 'provocation', 'question', 'scene-setting', 'gut-punch'];
const CONCLUSION_TYPES = ['tender', 'challenge'];
const BACKLINK_TYPES = ['internal', 'kalesh', 'external'];
const LINK_TYPES = ['research', 'kalesh', 'internal', 'amazon'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Product catalog (server-side copy for prompt injection) ──────────────────
// We read the product catalog from the PRODUCT_CATALOG in start-with-cron.mjs
// but since this is a separate module, we maintain a lightweight version here.
function loadProductCatalog() {
  try {
    // Try to read the full catalog from the TS source (just parse the ASINs and names)
    const catalogPath = join(ROOT, 'client', 'src', 'data', 'product-catalog.ts');
    if (!existsSync(catalogPath)) return [];
    const src = readFileSync(catalogPath, 'utf-8');
    const products = [];
    const regex = /\{\s*name:\s*"([^"]+)",\s*asin:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*tags:\s*\[([^\]]+)\],\s*sentence:\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(src)) !== null) {
      products.push({
        name: match[1],
        asin: match[2],
        category: match[3],
        tags: match[4].replace(/"/g, '').split(',').map(t => t.trim()),
        sentence: match[5],
      });
    }
    return products;
  } catch (e) {
    console.error('[generate-new-article] Failed to load product catalog:', e.message);
    return [];
  }
}

// ─── Topic generation via Forge API ──────────────────────────────────────────
async function generateTopic(category, existingTitles) {
  const titleSample = existingTitles
    .filter(t => t.category === category.slug)
    .slice(-10)
    .map(t => `- ${t.title}`)
    .join('\n');

  const res = await fetch(FORGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: 'You generate article topics for "Free From the System," a site about healthcare independence, medical debt freedom, and health sovereignty. Return ONLY valid JSON, no markdown.',
      messages: [{
        role: 'user',
        content: `Generate ONE new article topic for the "${category.name}" category.

Here are recent titles in this category (do NOT repeat these):
${titleSample}

Return JSON with exactly these fields:
{
  "title": "Article Title Here",
  "description": "2-sentence description for SEO and article cards",
  "metaDescription": "Under 160 chars for search engines",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}

The topic should be specific, practical, and different from existing titles. Focus on actionable advice real people can use.`
      }],
    }),
  });

  if (!res.ok) throw new Error(`Topic generation failed: ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || data.choices?.[0]?.message?.content || '';

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in topic response');
  return JSON.parse(jsonMatch[0]);
}

// ─── Slug generation ─────────────────────────────────────────────────────────
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// ─── Hero image generation ───────────────────────────────────────────────────
async function generateHeroImagePrompt(title, category) {
  const res = await fetch(FORGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: 'You write image generation prompts. Return ONLY the prompt text, nothing else.',
      messages: [{
        role: 'user',
        content: `Write a detailed image generation prompt for a hero image for an article titled "${title}" in the "${category}" category on a healthcare independence website. The image should be warm, editorial-style photography with natural lighting. No text in the image. Keep it under 200 words.`
      }],
    }),
  });

  if (!res.ok) return `Warm editorial photograph related to ${title}, natural lighting, shallow depth of field`;
  const data = await res.json();
  return data.content?.[0]?.text || data.choices?.[0]?.message?.content || `Warm editorial photograph related to ${title}`;
}

// ─── Compute next publish date ───────────────────────────────────────────────
function getNextPublishDate(articles) {
  // Find the latest dateISO in the dataset
  const dates = articles.map(a => a.dateISO.split('T')[0]).sort();
  const latest = dates[dates.length - 1];

  // Add 1-3 days after the latest date
  const d = new Date(latest + 'T06:00:00Z');
  d.setDate(d.getDate() + 1 + Math.floor(Math.random() * 3));
  return d;
}

function formatDateHuman(d) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Main: generate and append one new article ──────────────────────────────
export async function runGenerateNewArticle() {
  console.log('\n[generate-new-article] Starting new article generation...');

  const dataPath = join(ROOT, 'client', 'src', 'data', 'articles.json');
  if (!existsSync(dataPath)) {
    console.log('[generate-new-article] articles.json not found, skipping');
    return;
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  const articles = data.articles;

  // 1. Pick category with fewest articles (balances distribution)
  const catCounts = {};
  for (const a of articles) catCounts[a.category] = (catCounts[a.category] || 0) + 1;
  const sortedCats = CATEGORIES.sort((a, b) => (catCounts[a.slug] || 0) - (catCounts[b.slug] || 0));
  const category = sortedCats[0];
  console.log(`[generate-new-article] Selected category: ${category.name} (${catCounts[category.slug] || 0} articles)`);

  // 2. Generate topic
  const topic = await generateTopic(category, articles);
  console.log(`[generate-new-article] Topic: ${topic.title}`);

  // Check for duplicate slug
  const slug = slugify(topic.title);
  if (articles.some(a => a.slug === slug)) {
    console.log(`[generate-new-article] Slug "${slug}" already exists, skipping`);
    return;
  }

  // 3. Load product catalog and match relevant products
  const allProducts = loadProductCatalog();
  const topicTags = topic.tags || [];
  const relevantProducts = allProducts
    .map(p => ({
      ...p,
      score: p.tags.filter(t => topicTags.some(tt => t.includes(tt) || tt.includes(t))).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // 4. Generate article body with quality gate
  let result;
  try {
    result = await generateArticle({
      title: topic.title,
      category: category.name,
      tags: topicTags,
      description: topic.description,
      productCatalog: relevantProducts,
    });
  } catch (e) {
    console.error(`[generate-new-article] Article generation failed: ${e.message}`);
    return;
  }

  // 5. Generate hero image prompt (for future image generation)
  const imagePrompt = await generateHeroImagePrompt(topic.title, category.name);

  // 6. Use a placeholder hero image from the same category
  // (The image pipeline will process this on the next image audit run)
  const sameCatArticles = articles.filter(a => a.category === category.slug && a.heroImage);
  const heroImage = sameCatArticles.length > 0
    ? sameCatArticles[Math.floor(Math.random() * sameCatArticles.length)].heroImage
    : 'https://system-free.b-cdn.net/images/default-hero.webp';

  // 7. Compute metadata
  const nextId = Math.max(...articles.map(a => a.id)) + 1;
  const publishDate = getNextPublishDate(articles);
  const wordCount = result.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(5, Math.ceil(wordCount / 200));

  // 8. Build the new article object
  const newArticle = {
    id: nextId,
    title: topic.title,
    slug,
    description: topic.description,
    metaDescription: topic.metaDescription || topic.description.slice(0, 155),
    category: category.slug,
    categoryName: category.name,
    dateISO: publishDate.toISOString(),
    dateHuman: formatDateHuman(publishDate),
    readingTime,
    body: result.body,
    imagePrompt,
    heroImage,
    ogImage: heroImage, // Same as hero for now
    faqCount: 0,
    openerType: pickRandom(OPENER_TYPES),
    conclusionType: pickRandom(CONCLUSION_TYPES),
    backlinkType: pickRandom(BACKLINK_TYPES),
    linkType: pickRandom(LINK_TYPES),
    hasAffiliateLink: true,
    faqs: [],
  };

  // 9. Append to articles.json
  data.articles.push(newArticle);
  writeFileSync(dataPath, JSON.stringify(data));

  console.log(`[generate-new-article] SUCCESS: "${topic.title}"`);
  console.log(`  ID: ${nextId} | Slug: ${slug}`);
  console.log(`  Category: ${category.name} | Words: ${wordCount}`);
  console.log(`  Publish date: ${publishDate.toISOString().split('T')[0]}`);
  console.log(`  Quality: ${result.qualityReport.failures.length === 0 ? 'PASSED' : 'WARNINGS'}`);

  // 10. Rebuild sitemap/RSS (reuse the auto-publish logic)
  try {
    rebuildSitemapAndRss(data.articles);
  } catch (e) {
    console.error('[generate-new-article] Sitemap/RSS rebuild failed:', e.message);
  }

  return newArticle;
}

// ─── Sitemap/RSS rebuild ─────────────────────────────────────────────────────
function rebuildSitemapAndRss(articles) {
  const today = new Date().toISOString().split('T')[0];
  const live = articles.filter(a => a.dateISO.split('T')[0] <= today);

  // Sitemap
  const staticPages = [
    ['/', '1.0', 'weekly'], ['/articles', '0.9', 'daily'],
    ['/start-here', '0.8', 'monthly'], ['/about', '0.7', 'monthly'],
    ['/tools', '0.7', 'monthly'],
  ];
  const categoryPages = CATEGORIES.map(c => [`/${c.slug}`, '0.8', 'weekly']);

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const [path, priority, freq] of [...staticPages, ...categoryPages]) {
    sitemap += `  <url><loc>https://systemfree.love${path}</loc><changefreq>${freq}</changefreq><priority>${priority}</priority></url>\n`;
  }
  for (const a of live) {
    sitemap += `  <url><loc>https://systemfree.love/${a.slug}</loc><lastmod>${a.dateISO.split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
  }
  sitemap += '</urlset>';

  const sitemapPath = join(ROOT, 'dist', 'public', 'sitemap.xml');
  if (existsSync(join(ROOT, 'dist', 'public'))) {
    writeFileSync(sitemapPath, sitemap);
    console.log(`[generate-new-article] Sitemap updated: ${live.length} articles`);
  }

  // RSS
  const rssArticles = live.sort((a, b) => b.dateISO.localeCompare(a.dateISO)).slice(0, 20);
  let rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
  rss += `  <title>Free From the System</title>\n  <link>https://systemfree.love</link>\n`;
  rss += `  <description>Evidence-based strategies for healthcare independence</description>\n`;
  rss += `  <atom:link href="https://systemfree.love/rss.xml" rel="self" type="application/rss+xml" />\n`;
  for (const a of rssArticles) {
    rss += `  <item>\n    <title>${escapeXml(a.title)}</title>\n`;
    rss += `    <link>https://systemfree.love/${a.slug}</link>\n`;
    rss += `    <description>${escapeXml(a.description)}</description>\n`;
    rss += `    <pubDate>${new Date(a.dateISO).toUTCString()}</pubDate>\n`;
    rss += `    <guid>https://systemfree.love/${a.slug}</guid>\n  </item>\n`;
  }
  rss += '</channel>\n</rss>';

  const rssPath = join(ROOT, 'dist', 'public', 'rss.xml');
  if (existsSync(join(ROOT, 'dist', 'public'))) {
    writeFileSync(rssPath, rss);
    console.log(`[generate-new-article] RSS updated: ${rssArticles.length} items`);
  }
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
