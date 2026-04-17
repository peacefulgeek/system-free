#!/usr/bin/env node
/**
 * audit-images.mjs — Check every article hero image URL for broken links.
 * Also scans body HTML for <img> tags and checks those.
 *
 * Usage: node scripts/audit-images.mjs > broken-images.json
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const dataPath = join(ROOT, 'client', 'src', 'data', 'articles.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

const broken = [];

for (const a of data.articles) {
  const urls = [
    a.heroImage,
    ...[...a.body.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1])
  ].filter(Boolean);

  for (const url of urls) {
    if (url.startsWith('data:')) continue;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status !== 200) {
        broken.push({ slug: a.slug, url, status: res.status });
      }
    } catch (e) {
      broken.push({ slug: a.slug, url, error: e.message });
    }
    await new Promise(r => setTimeout(r, 100));
  }
}

console.log(JSON.stringify(broken, null, 2));
