/**
 * image-pipeline.mjs — Fetch source image (from FAL or any URL), convert to WebP,
 * compress to under 200KB, upload to Bunny CDN, return the CDN URL.
 */

import sharp from 'sharp';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL;

/**
 * Take a source image URL, fetch it, convert to WebP,
 * compress to under 200KB, upload to Bunny, return the CDN URL.
 */
export async function processAndUploadImage(sourceUrl, filename) {
  if (!BUNNY_STORAGE_ZONE || !BUNNY_API_KEY || !BUNNY_PULL_ZONE_URL) {
    throw new Error('Missing Bunny CDN env vars (BUNNY_STORAGE_ZONE, BUNNY_API_KEY, BUNNY_PULL_ZONE_URL)');
  }

  // 1. Fetch source
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const inputBuffer = Buffer.from(await res.arrayBuffer());

  // 2. Convert to WebP, start at quality 82, drop if over 200KB
  let quality = 82;
  let outBuffer;
  while (quality >= 50) {
    outBuffer = await sharp(inputBuffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
    if (outBuffer.length <= 200 * 1024) break;
    quality -= 8;
  }
  if (outBuffer.length > 200 * 1024) {
    // Still too big, force smaller width
    outBuffer = await sharp(inputBuffer)
      .resize({ width: 1200 })
      .webp({ quality: 70 })
      .toBuffer();
  }

  // 3. Upload to Bunny
  const safeName = filename.replace(/[^a-z0-9-_.]/gi, '-').toLowerCase();
  const finalName = safeName.endsWith('.webp') ? safeName : `${safeName}.webp`;
  const uploadUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/images/${finalName}`;

  const upload = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'image/webp'
    },
    body: outBuffer
  });
  if (!upload.ok) throw new Error(`Bunny upload failed: ${upload.status} ${await upload.text()}`);

  return `${BUNNY_PULL_ZONE_URL}/images/${finalName}`;
}

/**
 * Check if a Bunny CDN image URL returns 200.
 */
export async function verifyImageUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch {
    return false;
  }
}
