#!/usr/bin/env node
/**
 * audit-quality.mjs — Run the quality gate against all existing articles in articles.json.
 * Outputs a JSON report of which articles pass and which fail.
 *
 * Usage: node scripts/audit-quality.mjs > quality-audit.json
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runQualityGate } from './lib/article-quality-gate.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const dataPath = join(ROOT, 'client', 'src', 'data', 'articles.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

const report = { total: data.articles.length, passed: 0, failed: [] };

for (const a of data.articles) {
  const g = runQualityGate(a.body);
  if (g.passed) {
    report.passed++;
  } else {
    report.failed.push({
      slug: a.slug,
      failures: g.failures,
      warnings: g.warnings,
      wordCount: g.wordCount,
      amazonLinks: g.amazonLinks,
    });
  }
}

console.log(JSON.stringify(report, null, 2));
