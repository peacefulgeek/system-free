/**
 * article-quality-gate.mjs — THE PAUL VOICE GATE (NON-NEGOTIABLE)
 *
 * Every article generated (whether by bulk-seed or cron) must pass this gate.
 * If it fails, the caller must regenerate (up to 4 attempts).
 * Do not store failed articles.
 *
 * Checks:
 *   1. Banned Words (regex match, case-insensitive) → FAIL AND REGENERATE
 *   2. Banned Phrases (string match, case-insensitive) → FAIL AND REGENERATE
 *   3. Em-dashes (— or –) → auto-replace, then FAIL if any survive
 *   4. Word Count: 1,200–2,500 → FAIL AND REGENERATE if outside
 *   5. Amazon Affiliate Links: exactly 3 or 4 → FAIL AND REGENERATE
 *   6. Voice & Tone: direct address, contractions, dialogue markers
 */

// ─── Section 6.1: Banned Words (EXACT from addendum) ─────────────────────────
const BANNED_WORDS = [
  'utilize', 'delve', 'tapestry', 'landscape', 'paradigm', 'synergy',
  'leverage', 'unlock', 'empower', 'pivotal', 'embark', 'underscore',
  'paramount', 'seamlessly', 'robust', 'beacon', 'foster', 'elevate',
  'curate', 'curated', 'bespoke', 'resonate', 'harness', 'intricate',
  'plethora', 'myriad', 'groundbreaking', 'innovative', 'cutting-edge',
  'state-of-the-art', 'game-changer', 'ever-evolving', 'rapidly-evolving',
  'stakeholders', 'navigate', 'ecosystem', 'framework', 'comprehensive',
  'transformative', 'holistic', 'nuanced', 'multifaceted', 'profound',
  'furthermore'
];

// ─── Section 6.2: Banned Phrases (EXACT from addendum) ───────────────────────
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
  "plays a crucial role"
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Strip HTML tags for text analysis.
 */
function stripHtml(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Count words in HTML body.
 */
export function countWords(text) {
  const stripped = stripHtml(text);
  return stripped ? stripped.split(/\s+/).length : 0;
}

/**
 * Count Amazon affiliate links in the body.
 */
export function countAmazonLinks(text) {
  const matches = text.match(/amazon\.com\/dp\/[A-Z0-9]{10}\?tag=/g) || [];
  return matches.length;
}

/**
 * Extract ASINs from text.
 */
export function extractAsinsFromText(text) {
  const matches = text.match(/amazon\.com\/dp\/([A-Z0-9]{10})/g) || [];
  return [...new Set(matches.map(m => m.replace('amazon.com/dp/', '')))];
}

/**
 * Section 6.3: Auto-replace em-dashes with " - " (hyphen with spaces).
 * Returns the cleaned text.
 */
export function replaceEmDashes(text) {
  return text.replace(/[\u2014\u2013]/g, ' - ');
}

/**
 * Check if any em-dashes survived after replacement (should never happen
 * if replaceEmDashes was called first, but this is the safety check).
 */
export function hasEmDash(text) {
  return text.includes('\u2014') || text.includes('\u2013');
}

/**
 * Section 6.1: Find banned words in text.
 */
export function findBannedWords(text) {
  const stripped = stripHtml(text).toLowerCase();
  const found = [];
  for (const word of BANNED_WORDS) {
    const escaped = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(stripped)) {
      found.push(word);
    }
  }
  return found;
}

/**
 * Section 6.2: Find banned phrases in text.
 */
export function findBannedPhrases(text) {
  const stripped = stripHtml(text).toLowerCase().replace(/\s+/g, ' ');
  return BANNED_PHRASES.filter(p => stripped.includes(p.toLowerCase()));
}

/**
 * Section 6.7: Voice & Tone signals.
 */
export function voiceSignals(text) {
  const stripped = stripHtml(text);
  const lower = stripped.toLowerCase();

  // Contractions
  const contractions = (lower.match(/\b\w+'(s|re|ve|d|ll|m|t)\b/g) || []).length;

  // Direct address (you, your, you're)
  const directAddress = (lower.match(/\byou('re|r|rself)?\b/g) || []).length;

  // Conversational dialogue markers from addendum
  const dialogueMarkers = [
    /right\?!/i, /know what i mean\??/i, /does that land\??/i,
    /how does that make you feel\??/i, /here's the thing/i,
    /look,/i, /honestly/i, /truth is/i, /think about it/i,
    /so yeah/i, /you know\??/i
  ];
  const markerCount = dialogueMarkers.filter(r => r.test(stripped)).length;

  return { contractions, directAddress, markerCount };
}

/**
 * THE PAUL VOICE GATE — Run all checks.
 *
 * The caller MUST call replaceEmDashes() on the body BEFORE passing it here.
 * If this returns passed=false, the article must be regenerated.
 *
 * @param {string} body - Article HTML body (em-dashes already replaced)
 * @returns {Object} { passed, failures, wordCount, amazonLinks, asins }
 */
export function runQualityGate(body) {
  const failures = [];

  // Section 6.4: Word Count (1,200–2,500)
  const words = countWords(body);
  if (words < 1200) failures.push(`words-too-low:${words}`);
  if (words > 2500) failures.push(`words-too-high:${words}`);

  // Section 6.5: Amazon Affiliate Links (exactly 3 or 4)
  const links = countAmazonLinks(body);
  if (links < 3) failures.push(`amazon-links-too-few:${links}`);
  if (links > 4) failures.push(`amazon-links-too-many:${links}`);

  // Section 6.3: Em-dashes (should be zero after replaceEmDashes)
  if (hasEmDash(body)) failures.push('contains-em-dash');

  // Section 6.1: Banned Words
  const bannedWords = findBannedWords(body);
  if (bannedWords.length > 0) failures.push(`banned-words:${bannedWords.join(',')}`);

  // Section 6.2: Banned Phrases
  const bannedPhrases = findBannedPhrases(body);
  if (bannedPhrases.length > 0) failures.push(`banned-phrases:${bannedPhrases.join('|')}`);

  // Section 6.7: Voice & Tone
  const voice = voiceSignals(body);
  const per1k = (n) => (n / words) * 1000;

  // Must use contractions (at least 4 per 1000 words)
  if (per1k(voice.contractions) < 4) {
    failures.push(`contractions-too-few:${voice.contractions}`);
  }

  // Must use direct address ("you")
  if (voice.directAddress < 3) {
    failures.push(`no-direct-address:${voice.directAddress}`);
  }

  // Must have 2-3 conversational dialogue markers
  if (voice.markerCount < 2) {
    failures.push(`dialogue-markers-too-few:${voice.markerCount}`);
  }

  return {
    passed: failures.length === 0,
    failures,
    wordCount: words,
    amazonLinks: links,
    asins: extractAsinsFromText(body),
    voice
  };
}
