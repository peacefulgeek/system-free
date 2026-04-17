/**
 * verify-affiliates.mjs — Weekly ASIN health check cron.
 * Verifies all ASINs used in articles are still valid Amazon products.
 * Dead ASINs get auto-swapped with working alternatives.
 *
 * Called by the Sunday 05:00 UTC cron in start-with-cron.mjs.
 * This module wraps the existing runProductFreshnessCheck logic
 * with the enhanced amazon-verify.mjs soft-404 detection.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { verifyAsin } from '../lib/amazon-verify.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');

const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

// Backup ASINs for replacement
const BACKUP_ASINS = [
  { asin: "1635574110", name: "The Price We Pay", tags: ["medical", "billing", "hospital", "cost"] },
  { asin: "0143110853", name: "An American Sickness", tags: ["healthcare", "insurance", "system"] },
  { asin: "0593190009", name: "Never Pay the First Bill", tags: ["debt", "billing", "negotiate"] },
  { asin: "0143115766", name: "Your Money or Your Life", tags: ["financial", "money", "budget"] },
  { asin: "1595555277", name: "Total Money Makeover", tags: ["debt", "budget", "financial"] },
  { asin: "0735213615", name: "Atomic Habits", tags: ["habits", "change", "routine"] },
  { asin: "1501144324", name: "10% Happier", tags: ["mindfulness", "meditation", "stress"] },
  { asin: "0062515675", name: "Food Fix", tags: ["food", "nutrition", "diet"] },
  { asin: "B07PWYGRVG", name: "Blood Pressure Monitor", tags: ["blood pressure", "heart", "device"] },
  { asin: "B0BQ3B3YBN", name: "Berberine Supplement", tags: ["supplement", "blood sugar", "metabolism"] },
];

export async function verifyAffiliateLinks() {
  console.log('[verify-affiliates] Starting ASIN health check...');

  const dataPath = join(ROOT, 'client', 'src', 'data', 'articles.json');
  if (!existsSync(dataPath)) {
    console.log('[verify-affiliates] articles.json not found, skipping');
    return;
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

  // Collect all unique ASINs from articles
  const asinSet = new Set();
  for (const art of data.articles) {
    const matches = art.body.match(/amazon\.com\/dp\/([A-Z0-9]{10})/g) || [];
    for (const m of matches) {
      asinSet.add(m.replace('amazon.com/dp/', ''));
    }
  }

  const allAsins = [...asinSet];
  console.log(`[verify-affiliates] Checking ${allAsins.length} unique ASINs...`);

  const deadAsins = [];
  for (let i = 0; i < allAsins.length; i++) {
    const result = await verifyAsin(allAsins[i]);
    if (!result.valid) {
      deadAsins.push({ asin: allAsins[i], reason: result.reason });
      console.log(`[verify-affiliates] DEAD: ${allAsins[i]} (${result.reason})`);
    }
    if (i < allAsins.length - 1) {
      await new Promise(r => setTimeout(r, 2500));
    }
  }

  if (deadAsins.length === 0) {
    console.log(`[verify-affiliates] All ${allAsins.length} ASINs are valid.`);
    return;
  }

  console.log(`[verify-affiliates] Found ${deadAsins.length} dead ASINs. Replacing...`);

  const usedAsins = new Set(allAsins);
  let totalSwaps = 0;

  for (const { asin: deadAsin } of deadAsins) {
    const backup = BACKUP_ASINS.find(b => !usedAsins.has(b.asin));
    if (!backup) {
      console.log(`[verify-affiliates] No backup for ${deadAsin}, skipping`);
      continue;
    }

    let swapCount = 0;
    for (const art of data.articles) {
      if (art.body.includes(deadAsin)) {
        art.body = art.body.split(deadAsin).join(backup.asin);
        swapCount++;
      }
    }

    usedAsins.add(backup.asin);
    totalSwaps += swapCount;
    console.log(`[verify-affiliates] Replaced ${deadAsin} -> ${backup.asin} (${backup.name}) in ${swapCount} articles`);
  }

  if (totalSwaps > 0) {
    writeFileSync(dataPath, JSON.stringify(data));
    console.log(`[verify-affiliates] ${totalSwaps} total ASIN swaps`);
  }
}
