/**
 * generate-article.mjs — Article generation pipeline with built-in quality gate.
 *
 * Flow:
 *   1. Build prompt with HARD_RULES appended
 *   2. Call Forge API (Anthropic Claude) to generate article body
 *   3. Run quality gate on the result
 *   4. If it fails, retry up to 2 more times with failure feedback
 *   5. Return the article body + metadata, or throw if all retries fail
 *
 * Usage:
 *   import { generateArticle } from './lib/generate-article.mjs';
 *   const result = await generateArticle({ title, category, tags, description });
 */

import { runQualityGate } from './article-quality-gate.mjs';
import { HARD_RULES } from './generation-prompt-rules.mjs';

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || process.env.VITE_FRONTEND_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || process.env.VITE_FRONTEND_FORGE_API_KEY;
const MAX_RETRIES = 3;
const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

/**
 * Build the system prompt for article generation.
 */
function buildSystemPrompt() {
  return `You are a health writer for "Free From the System," a site about healthcare independence, medical debt freedom, and health sovereignty. You write like a real person who's been through the system and came out the other side. Your tone is warm, direct, occasionally irreverent, and always grounded in real experience.

You write in HTML (paragraph tags, headings, links). No markdown. No code blocks.

${HARD_RULES}`;
}

/**
 * Build the user prompt for a specific article.
 */
function buildUserPrompt({ title, category, tags, description, productCatalog }) {
  // Pick 6-8 relevant products from catalog for the AI to choose from
  const relevantProducts = productCatalog || [];
  const productList = relevantProducts.slice(0, 8).map(p =>
    `- ${p.name} (ASIN: ${p.asin}) — ${p.sentence}`
  ).join('\n');

  return `Write an article titled: "${title}"

Category: ${category}
Tags: ${tags.join(', ')}
Description: ${description}

Available products to link (pick 3-4 that fit naturally):
${productList}

Amazon tag for all links: ${AMAZON_TAG}
Link format: https://www.amazon.com/dp/{ASIN}?tag=${AMAZON_TAG}
After each link, add "(paid link)" in plain text.

Write the full article body in HTML. Start with the first paragraph, no <h1> title (that's handled by the page template). Use <h2> for section headings. Keep it real, keep it human.`;
}

/**
 * Call the Forge API to generate text.
 */
async function callForgeAPI(systemPrompt, userPrompt) {
  if (!FORGE_API_URL || !FORGE_API_KEY) {
    throw new Error('Missing FORGE_API_URL or FORGE_API_KEY env vars');
  }

  const res = await fetch(FORGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Forge API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || data.choices?.[0]?.message?.content || '';
}

/**
 * Generate an article with quality gate enforcement.
 * Retries up to MAX_RETRIES times if the quality gate fails.
 *
 * @param {Object} opts
 * @param {string} opts.title - Article title
 * @param {string} opts.category - Category name
 * @param {string[]} opts.tags - Article tags
 * @param {string} opts.description - Article description/summary
 * @param {Array} opts.productCatalog - Available products to link
 * @returns {Object} { body, qualityReport }
 */
export async function generateArticle({ title, category, tags = [], description, productCatalog = [] }) {
  const systemPrompt = buildSystemPrompt();
  let userPrompt = buildUserPrompt({ title, category, tags, description, productCatalog });
  let lastReport = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[generate-article] Attempt ${attempt}/${MAX_RETRIES} for: ${title}`);

    const body = await callForgeAPI(systemPrompt, userPrompt);

    if (!body || body.length < 500) {
      console.log(`[generate-article] Empty or too-short response (${body.length} chars), retrying...`);
      continue;
    }

    // Run quality gate
    const report = runQualityGate(body);
    lastReport = report;

    if (report.passed) {
      console.log(`[generate-article] PASSED quality gate on attempt ${attempt}`);
      console.log(`  Words: ${report.wordCount}, Links: ${report.amazonLinks}`);
      return { body, qualityReport: report };
    }

    // Failed — build feedback for retry
    console.log(`[generate-article] FAILED quality gate on attempt ${attempt}:`);
    console.log(`  Failures: ${report.failures.join(', ')}`);

    if (attempt < MAX_RETRIES) {
      // Append failure feedback to the prompt for the next attempt
      const failureFeedback = report.failures.map(f => {
        if (f.startsWith('ai-flagged-words:')) return `Remove these AI-flagged words: ${f.replace('ai-flagged-words:', '')}`;
        if (f.startsWith('ai-flagged-phrases:')) return `Remove these AI-flagged phrases: ${f.replace('ai-flagged-phrases:', '')}`;
        if (f === 'contains-em-dash') return 'You used em-dashes. Replace ALL em-dashes with commas, periods, or colons.';
        if (f.startsWith('words-too-low:')) return `Too short (${f.split(':')[1]} words). Write at least 1,600 words.`;
        if (f.startsWith('words-too-high:')) return `Too long (${f.split(':')[1]} words). Keep under 2,000 words.`;
        if (f.startsWith('amazon-links-too-few:')) return `Only ${f.split(':')[1]} Amazon links. Include 3-4 product links.`;
        if (f.startsWith('contractions-too-few:')) return 'Use more contractions throughout. You\'re, don\'t, it\'s, that\'s, I\'ve.';
        if (f === 'no-direct-address-or-first-person') return 'Use "you" or "I" throughout the piece.';
        if (f.startsWith('sentence-variance-too-low:')) return 'Vary sentence length more. Some very short. Some long and flowing.';
        if (f.startsWith('too-few-short-sentences:')) return 'Add more short punchy sentences (6 words or fewer).';
        return `Fix: ${f}`;
      }).join('\n');

      userPrompt += `\n\nYOUR PREVIOUS ATTEMPT FAILED QUALITY CHECK. Fix these issues:\n${failureFeedback}\n\nRewrite the ENTIRE article from scratch, fixing all issues above.`;
    }
  }

  // All retries exhausted
  throw new Error(`Quality gate failed after ${MAX_RETRIES} attempts. Last failures: ${lastReport?.failures?.join(', ')}`);
}
