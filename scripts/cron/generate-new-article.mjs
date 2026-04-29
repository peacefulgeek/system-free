/**
 * generate-new-article.mjs — Article publisher cron.
 *
 * Flow:
 *   1. Check queue for articles with status='queued'
 *   2. If queue has articles → publish one (assign hero image, set status='published')
 *   3. If queue is empty → generate a new article via DeepSeek V4-Pro, queue it, then publish
 *   4. Regenerate sitemap.xml and rss.xml
 *
 * Schedule:
 *   Phase 1 (published < 60): 5x/day (07:00, 10:00, 13:00, 16:00, 19:00 UTC) every day
 *   Phase 2 (published >= 60): 1x/weekday (08:00 UTC) Monday-Friday only
 *
 * Hero images: Pulled from Bunny CDN library (/library/lib-01.webp to lib-40.webp),
 * downloaded and re-uploaded to /images/{slug}.webp for unique Google-indexable URLs.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { generateArticle } from '../lib/generate-article.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');

// ─── DeepSeek V4-Pro client ─────────────────────────────────────────────────
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-82bdad0a1fd34987b73030504ae67080',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com',
});
const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';

// ─── Bunny CDN — HARDCODED, NOT ENV VARS ────────────────────────────────────
const BUNNY_STORAGE_ZONE = 'system-free';
const BUNNY_API_KEY = '19da758b-3c72-4d9f-92100673489e-2690-47ac';
const BUNNY_PULL_ZONE = 'https://system-free.b-cdn.net';
const BUNNY_HOSTNAME = 'ny.storage.bunnycdn.com';

// ─── Categories ──────────────────────────────────────────────────────────────
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

// ─── ASIN Pool (verified, healthcare sovereignty niche) ─────────────────────
const ASIN_POOL = [
  { asin: '1635574110', name: 'The Price We Pay', tags: ['medical', 'billing', 'hospital'] },
  { asin: '0143110853', name: 'An American Sickness', tags: ['healthcare', 'insurance', 'system'] },
  { asin: '0593190009', name: 'Never Pay the First Bill', tags: ['debt', 'billing', 'negotiate'] },
  { asin: '0143115766', name: 'Your Money or Your Life', tags: ['financial', 'money', 'budget'] },
  { asin: '1595555277', name: 'Total Money Makeover', tags: ['debt', 'budget', 'financial'] },
  { asin: '1732403805', name: 'The Healthcare Handbook', tags: ['healthcare', 'system', 'insurance'] },
  { asin: '1250076226', name: 'Being Mortal', tags: ['healthcare', 'aging', 'end-of-life'] },
  { asin: '0451495527', name: 'When Breath Becomes Air', tags: ['health', 'mortality', 'meaning'] },
  { asin: '1250193192', name: 'The Body Keeps the Score', tags: ['trauma', 'healing', 'body'] },
  { asin: '1642937851', name: 'Breath', tags: ['breathing', 'health', 'alternative'] },
  { asin: '1948647044', name: 'Outlive', tags: ['longevity', 'health', 'prevention'] },
  { asin: '0465054749', name: 'The Emperor of All Maladies', tags: ['cancer', 'medicine', 'history'] },
  { asin: '0374535337', name: 'Thinking Fast and Slow', tags: ['decisions', 'psychology', 'bias'] },
  { asin: '0425238091', name: 'Wheat Belly', tags: ['diet', 'nutrition', 'inflammation'] },
  { asin: '0307452425', name: 'In Defense of Food', tags: ['nutrition', 'food', 'health'] },
  { asin: '0865478007', name: 'Nourishing Traditions', tags: ['nutrition', 'traditional', 'food'] },
  { asin: '1616209488', name: 'How Not to Die', tags: ['nutrition', 'prevention', 'plant-based'] },
];

// ─── Product catalog loader ──────────────────────────────────────────────────
function loadProductCatalog() {
  try {
    const catalogPath = join(ROOT, 'client', 'src', 'data', 'product-catalog.ts');
    if (!existsSync(catalogPath)) return ASIN_POOL;
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
    return products.length > 0 ? products : ASIN_POOL;
  } catch (e) {
    return ASIN_POOL;
  }
}

// ─── Bunny CDN Image Library System ─────────────────────────────────────────
/**
 * Assigns a hero image from the pre-generated library.
 * Downloads from /library/lib-XX.webp and re-uploads to /images/{slug}.webp
 * This gives Google a unique, indexable URL for every article.
 */
async function assignHeroImage(slug) {
  const sourceFile = `lib-${String(Math.floor(Math.random() * 40) + 1).padStart(2, '0')}.webp`;
  const destFile = `${slug}.webp`;

  try {
    // Download from library
    const sourceUrl = `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
    const downloadRes = await fetch(sourceUrl);
    if (!downloadRes.ok) throw new Error(`Download failed: ${downloadRes.status}`);
    const imageBuffer = await downloadRes.arrayBuffer();

    // Re-upload to /images/{slug}.webp
    const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/images/${destFile}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'AccessKey': BUNNY_API_KEY, 'Content-Type': 'image/webp' },
      body: imageBuffer,
    });

    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
    return `${BUNNY_PULL_ZONE}/images/${destFile}`;
  } catch (err) {
    console.error(`[assign-hero] Error for ${slug}: ${err.message}`);
    // Fallback: link directly to library image
    return `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
  }
}

// ─── Topic generation via DeepSeek ──────────────────────────────────────────
async function generateTopic(category, existingTitles) {
  const titleSample = existingTitles
    .filter(t => t.category === category.slug)
    .slice(-10)
    .map(t => `- ${t.title}`)
    .join('\n');

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You generate article topics for "Free From the System," a site about healthcare independence, medical debt freedom, and health sovereignty. Return ONLY valid JSON, no markdown.',
      },
      {
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
      },
    ],
    temperature: 0.72,
  });

  const text = response.choices?.[0]?.message?.content || '';
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

// ─── Date helpers ────────────────────────────────────────────────────────────
function formatDateHuman(d) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Main: Publish from queue or generate new ───────────────────────────────
export async function runGenerateNewArticle() {
  console.log('\n[article-publisher] Starting...');

  const dataPath = join(ROOT, 'client', 'src', 'data', 'articles.json');
  if (!existsSync(dataPath)) {
    console.log('[article-publisher] articles.json not found, skipping');
    return;
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  const articles = data.articles;

  // Count published articles
  const publishedCount = articles.filter(a => a.status === 'published').length;
  console.log(`[article-publisher] Published: ${publishedCount} | Total: ${articles.length}`);

  // Check queue
  const queued = articles.filter(a => a.status === 'queued');
  console.log(`[article-publisher] Queued: ${queued.length}`);

  if (queued.length > 0) {
    // Publish from queue (oldest first)
    const toPublish = queued.sort((a, b) => (a.queued_at || '').localeCompare(b.queued_at || ''))[0];
    console.log(`[article-publisher] Publishing from queue: "${toPublish.title}"`);

    // Assign unique hero image
    const heroUrl = await assignHeroImage(toPublish.slug);
    toPublish.heroImage = heroUrl;
    toPublish.ogImage = heroUrl;
    toPublish.status = 'published';
    toPublish.published_at = new Date().toISOString();
    toPublish.dateISO = new Date().toISOString();
    toPublish.dateHuman = formatDateHuman(new Date());

    writeFileSync(dataPath, JSON.stringify(data));
    console.log(`[article-publisher] Published: "${toPublish.title}" → ${heroUrl}`);
  } else {
    // Queue is empty — generate a new article and publish it directly
    console.log('[article-publisher] Queue empty, generating new article...');

    // Pick category with fewest articles
    const catCounts = {};
    for (const a of articles) catCounts[a.category] = (catCounts[a.category] || 0) + 1;
    const sortedCats = [...CATEGORIES].sort((a, b) => (catCounts[a.slug] || 0) - (catCounts[b.slug] || 0));
    const category = sortedCats[0];

    // Generate topic
    const topic = await generateTopic(category, articles);
    const slug = slugify(topic.title);
    if (articles.some(a => a.slug === slug)) {
      console.log(`[article-publisher] Slug "${slug}" already exists, skipping`);
      return;
    }

    // Load products and generate article
    const allProducts = loadProductCatalog();
    const topicTags = topic.tags || [];
    const relevantProducts = allProducts
      .map(p => ({ ...p, score: (p.tags || []).filter(t => topicTags.some(tt => t.includes(tt) || tt.includes(t))).length }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

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
      console.error(`[article-publisher] Generation failed: ${e.message}`);
      return;
    }

    // Assign hero image from library
    const heroUrl = await assignHeroImage(slug);

    // Build new article
    const nextId = Math.max(...articles.map(a => a.id)) + 1;
    const wordCount = result.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

    const newArticle = {
      id: nextId,
      title: topic.title,
      slug,
      description: topic.description,
      metaDescription: topic.metaDescription || topic.description.slice(0, 155),
      category: category.slug,
      categoryName: category.name,
      dateISO: new Date().toISOString(),
      dateHuman: formatDateHuman(new Date()),
      readingTime: Math.max(5, Math.ceil(wordCount / 200)),
      body: result.body,
      imagePrompt: '',
      heroImage: heroUrl,
      ogImage: heroUrl,
      faqCount: 0,
      openerType: pickRandom(OPENER_TYPES),
      conclusionType: pickRandom(CONCLUSION_TYPES),
      backlinkType: pickRandom(BACKLINK_TYPES),
      linkType: pickRandom(LINK_TYPES),
      hasAffiliateLink: true,
      faqs: [],
      status: 'published',
      queued_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    };

    data.articles.push(newArticle);
    writeFileSync(dataPath, JSON.stringify(data));
    console.log(`[article-publisher] Generated & published: "${topic.title}" (${wordCount} words)`);
  }

  // Rebuild sitemap/RSS
  try {
    rebuildSitemapAndRss(data.articles);
  } catch (e) {
    console.error('[article-publisher] Sitemap/RSS rebuild failed:', e.message);
  }
}

// ─── Sitemap/RSS rebuild ─────────────────────────────────────────────────────
function rebuildSitemapAndRss(articles) {
  const live = articles.filter(a => a.status === 'published');

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
    console.log(`[article-publisher] Sitemap updated: ${live.length} articles`);
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
  }
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
