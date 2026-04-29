/**
 * generate-article.mjs — Article generation with Paul Voice Gate enforcement.
 *
 * Uses DeepSeek V4-Pro via OpenAI-compatible client.
 * Every article must pass the quality gate (up to 4 attempts).
 * Failed articles are never stored.
 *
 * Usage:
 *   import { generateArticle } from './lib/generate-article.mjs';
 *   const result = await generateArticle({ title, category, tags, description, asinPool });
 */

import OpenAI from 'openai';
import { runQualityGate, replaceEmDashes } from './article-quality-gate.mjs';

// DeepSeek V4-Pro via OpenAI-compatible client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-82bdad0a1fd34987b73030504ae67080',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com',
});

const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';
const MAX_RETRIES = 4;
const AMAZON_TAG = 'spankyspinola-20';

/**
 * The ASIN pool for this site (healthcare sovereignty / medical freedom niche).
 * Keep adding verified ASINs. Do not use fake or 404 ASINs.
 */
const DEFAULT_ASIN_POOL = [
  { asin: '1635574110', name: 'The Price We Pay' },
  { asin: '0143110853', name: 'An American Sickness' },
  { asin: '0593190009', name: 'Never Pay the First Bill' },
  { asin: '0143115766', name: 'Your Money or Your Life' },
  { asin: '1595555277', name: 'The Total Money Makeover' },
  { asin: '0735213615', name: 'Atomic Habits' },
  { asin: '1501144324', name: '10% Happier' },
  { asin: '0062515675', name: 'Food Fix' },
  { asin: '0062316117', name: 'Sapiens' },
  { asin: 'B07PWYGRVG', name: 'Blood Pressure Monitor' },
  { asin: 'B0BQ3B3YBN', name: 'Berberine Supplement' },
  { asin: 'B0D57PP7G3', name: 'Wellness Journal' },
  { asin: '0399590528', name: 'Breath by James Nestor' },
  { asin: '0062457713', name: 'The Wahls Protocol' },
  { asin: '0316387800', name: 'Why We Sleep' },
  { asin: '0544609719', name: 'Being Mortal' },
  { asin: '0062656244', name: 'How Not to Die' },
  { asin: '1250127572', name: 'Genius Foods' },
  { asin: '0062349481', name: 'The Body Keeps the Score' },
  { asin: '0307352153', name: 'Born to Run' },
];

/**
 * Build the system prompt enforcing Paul's voice.
 */
function buildSystemPrompt() {
  return `You are Paul, the writer behind "Free From the System." You've spent years navigating the broken healthcare system - fighting medical bills, questioning doctors who push pills over prevention, and building a life of health sovereignty. You write like you talk: direct, warm, occasionally irreverent, always grounded in real experience.

You write in HTML (paragraph tags, headings, links). No markdown. No code blocks. No wrapping in \`\`\`.

VOICE RULES (NON-NEGOTIABLE):
- Address the reader as "you" throughout. This is a conversation, not a lecture.
- Use contractions EVERYWHERE: don't, can't, it's, you're, we're, that's, I've, I'd.
- Include 2-3 conversational dialogue markers like: "Right?!", "Know what I mean?", "Does that land?", "How does that make you feel?"
- Compassionate, connective tone. You're talking to someone who's been screwed by the system too.
- Short punchy sentences mixed with longer flowing ones. Vary the rhythm.

ABSOLUTE BANS (using ANY of these = instant failure):
Words: utilize, delve, tapestry, landscape, paradigm, synergy, leverage, unlock, empower, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, curated, bespoke, resonate, harness, intricate, plethora, myriad, groundbreaking, innovative, cutting-edge, state-of-the-art, game-changer, ever-evolving, rapidly-evolving, stakeholders, navigate, ecosystem, framework, comprehensive, transformative, holistic, nuanced, multifaceted, profound, furthermore.

Phrases: "it's important to note that", "it's worth noting that", "in conclusion", "in summary", "a holistic approach", "in the realm of", "dive deep into", "at the end of the day", "in today's fast-paced world", "plays a crucial role".

FORMATTING:
- Zero em-dashes (— or –). Use commas, colons, periods, or " - " instead.
- Word count: 1,200-2,500 words. No less, no more.
- Use <h2> for section headings. No <h1> (handled by page template).
- Start with the first paragraph directly. No title repetition.`;
}

/**
 * Build the user prompt for a specific article.
 */
function buildUserPrompt({ title, category, tags, description, asinPool }) {
  const products = asinPool || DEFAULT_ASIN_POOL;
  // Pick 6-8 random products to offer as choices
  const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
  const productList = shuffled.map(p => `- ${p.name} (ASIN: ${p.asin})`).join('\n');

  return `Write an article titled: "${title}"

Category: ${category}
Tags: ${tags.join(', ')}
Brief: ${description}

Pick exactly 3 or 4 products from this list to link naturally within the article:
${productList}

Amazon link format (use EXACTLY this):
<a href="https://www.amazon.com/dp/{ASIN}?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>

CRITICAL:
- Exactly 3 or 4 Amazon affiliate links. Not 2, not 5.
- Zero em-dashes. Use commas, colons, or " - " instead.
- 1,200-2,500 words.
- Write the full article body in HTML. Start with the first paragraph.`;
}

/**
 * Call DeepSeek V4-Pro.
 */
async function callDeepSeek(systemPrompt, userPrompt) {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.72,
  });

  return response.choices?.[0]?.message?.content || '';
}

/**
 * Generate an article with Paul Voice Gate enforcement.
 * Retries up to 4 times. Throws if all attempts fail.
 *
 * @param {Object} opts
 * @param {string} opts.title - Article title
 * @param {string} opts.category - Category name
 * @param {string[]} opts.tags - Article tags
 * @param {string} opts.description - Brief description
 * @param {Array} opts.asinPool - Available ASINs (optional, uses default pool)
 * @returns {Object} { body, qualityReport }
 */
export async function generateArticle({ title, category, tags = [], description, asinPool }) {
  const systemPrompt = buildSystemPrompt();
  let userPrompt = buildUserPrompt({ title, category, tags, description, asinPool });
  let lastReport = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[generate-article] Attempt ${attempt}/${MAX_RETRIES}: ${title}`);

    let body = await callDeepSeek(systemPrompt, userPrompt);

    if (!body || body.length < 500) {
      console.log(`[generate-article] Empty/short response (${body?.length || 0} chars), retrying...`);
      continue;
    }

    // Strip markdown code fences if the model wraps in them
    body = body.replace(/^```html?\s*/i, '').replace(/\s*```$/i, '');

    // Section 6.3: Auto-replace em-dashes before quality gate
    body = replaceEmDashes(body);

    // Run the Paul Voice Gate
    const report = runQualityGate(body);
    lastReport = report;

    if (report.passed) {
      console.log(`[generate-article] PASSED on attempt ${attempt} (${report.wordCount} words, ${report.amazonLinks} links)`);
      return { body, qualityReport: report };
    }

    // Failed — build feedback for retry
    console.log(`[generate-article] FAILED: ${report.failures.join(', ')}`);

    if (attempt < MAX_RETRIES) {
      const feedback = report.failures.map(f => {
        if (f.startsWith('banned-words:')) return `REMOVE these banned words: ${f.replace('banned-words:', '')}`;
        if (f.startsWith('banned-phrases:')) return `REMOVE these banned phrases: ${f.replace('banned-phrases:', '')}`;
        if (f === 'contains-em-dash') return 'You used em-dashes. Replace ALL with commas, colons, or " - ".';
        if (f.startsWith('words-too-low:')) return `Too short (${f.split(':')[1]} words). Write at least 1,200 words.`;
        if (f.startsWith('words-too-high:')) return `Too long (${f.split(':')[1]} words). Keep under 2,500 words.`;
        if (f.startsWith('amazon-links-too-few:')) return `Only ${f.split(':')[1]} Amazon links. Include exactly 3 or 4.`;
        if (f.startsWith('amazon-links-too-many:')) return `${f.split(':')[1]} Amazon links is too many. Include exactly 3 or 4.`;
        if (f.startsWith('contractions-too-few:')) return 'Use MORE contractions: don\'t, can\'t, it\'s, you\'re, we\'re, that\'s.';
        if (f.startsWith('no-direct-address:')) return 'Use "you" and "your" much more throughout.';
        if (f.startsWith('dialogue-markers-too-few:')) return 'Add 2-3 dialogue markers: "Right?!", "Know what I mean?", "Does that land?"';
        return `Fix: ${f}`;
      }).join('\n');

      userPrompt += `\n\n--- YOUR PREVIOUS ATTEMPT FAILED. FIX THESE: ---\n${feedback}\n\nRewrite the ENTIRE article from scratch.`;
    }
  }

  // All retries exhausted — do not store
  throw new Error(`Quality gate failed after ${MAX_RETRIES} attempts. Last: ${lastReport?.failures?.join(', ')}`);
}
