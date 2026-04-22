/**
 * image-pipeline.mjs — Fetch source image (from Forge or any URL), convert to WebP,
 * compress to under 200KB, upload to Bunny CDN (system-free zone), return the CDN URL.
 *
 * Bunny CDN credentials (system-free storage zone, NY region):
 *   Storage Zone: system-free
 *   API Host:     ny.storage.bunnycdn.com
 *   API Key:      19da758b-3c72-4d9f-92100673489e-2690-47ac
 *   Pull Zone:    https://system-free.b-cdn.net
 */

import sharp from 'sharp';

// ─── Hardcoded Bunny CDN credentials (system-free zone, NY region) ───────────
const BUNNY_STORAGE_ZONE = 'system-free';
const BUNNY_API_HOST = 'ny.storage.bunnycdn.com';
const BUNNY_API_KEY = '19da758b-3c72-4d9f-92100673489e-2690-47ac';
const BUNNY_PULL_ZONE_URL = 'https://system-free.b-cdn.net';

/**
 * Take a source image URL, fetch it, convert to WebP,
 * compress to under 200KB, upload to Bunny, return the CDN URL.
 */
export async function processAndUploadImage(sourceUrl, filename) {
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

  // 3. Upload to Bunny (NY region endpoint)
  const safeName = filename.replace(/[^a-z0-9-_.]/gi, '-').toLowerCase();
  const finalName = safeName.endsWith('.webp') ? safeName : `${safeName}.webp`;
  const uploadUrl = `https://${BUNNY_API_HOST}/${BUNNY_STORAGE_ZONE}/images/${finalName}`;

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
 * Upload a raw buffer directly to Bunny CDN (skip fetch step).
 * Used when we already have the image data in memory (e.g., from Forge image API).
 */
export async function uploadBufferToBunny(buffer, filename, contentType = 'image/webp') {
  const safeName = filename.replace(/[^a-z0-9-_.]/gi, '-').toLowerCase();
  const finalName = safeName.endsWith('.webp') ? safeName : `${safeName}.webp`;

  // Convert to WebP if not already
  let outBuffer;
  if (contentType !== 'image/webp') {
    let quality = 82;
    while (quality >= 50) {
      outBuffer = await sharp(buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();
      if (outBuffer.length <= 200 * 1024) break;
      quality -= 8;
    }
  } else {
    outBuffer = buffer;
  }

  const uploadUrl = `https://${BUNNY_API_HOST}/${BUNNY_STORAGE_ZONE}/images/${finalName}`;

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
