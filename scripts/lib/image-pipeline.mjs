/**
 * image-pipeline.mjs — Bunny CDN Image Library System
 *
 * NO MORE IMAGE GENERATION. We use a pre-generated library of 40 WebP images
 * hosted on Bunny CDN at /library/lib-01.webp through /library/lib-40.webp.
 *
 * When an article is published, assignHeroImage():
 *   1. Randomly selects one of the 40 library images
 *   2. Downloads it from the pull zone
 *   3. Re-uploads it to /images/{article-slug}.webp
 *   4. Returns the unique CDN URL for that article
 *
 * This gives Google a unique, indexable image URL per article while
 * eliminating recurring image generation costs.
 *
 * CREDENTIALS ARE HARDCODED. DO NOT PUT THEM IN ENV VARS.
 */

// ─── Bunny CDN Credentials (HARDCODED) ──────────────────────────────────────
const BUNNY_STORAGE_ZONE = 'system-free';
const BUNNY_API_KEY = '19da758b-3c72-4d9f-92100673489e-2690-47ac';
const BUNNY_PULL_ZONE = 'https://system-free.b-cdn.net';
const BUNNY_HOSTNAME = 'ny.storage.bunnycdn.com';

/**
 * Assign a hero image to an article by downloading from the library
 * and re-uploading with a unique slug-based filename.
 *
 * @param {string} slug - The article slug (used as the filename)
 * @returns {string} The public CDN URL for the article's hero image
 */
export async function assignHeroImage(slug) {
  const sourceFile = `lib-${String(Math.floor(Math.random() * 40) + 1).padStart(2, '0')}.webp`;
  const destFile = `${slug}.webp`;

  try {
    // 1. Download from library
    const sourceUrl = `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
    const downloadRes = await fetch(sourceUrl);
    if (!downloadRes.ok) throw new Error(`Download failed: ${downloadRes.status}`);
    const imageBuffer = await downloadRes.arrayBuffer();

    // 2. Re-upload to /images/{slug}.webp
    const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/images/${destFile}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'AccessKey': BUNNY_API_KEY, 'Content-Type': 'image/webp' },
      body: imageBuffer,
    });

    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
    console.log(`[image-pipeline] Assigned hero: ${BUNNY_PULL_ZONE}/images/${destFile}`);
    return `${BUNNY_PULL_ZONE}/images/${destFile}`;
  } catch (err) {
    console.error(`[image-pipeline] Error for ${slug}: ${err.message}`);
    // Fallback: link directly to the library image if copy fails
    return `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
  }
}

/**
 * Upload raw data directly to Bunny CDN at a custom path.
 *
 * @param {Buffer|ArrayBuffer} data - File data
 * @param {string} remotePath - Path within the storage zone (e.g., "images/custom.webp")
 * @param {string} contentType - MIME type (default: "image/webp")
 * @returns {string} The public CDN URL
 */
export async function uploadToBunny(data, remotePath, contentType = 'image/webp') {
  const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${remotePath}`;
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'AccessKey': BUNNY_API_KEY, 'Content-Type': contentType },
    body: data,
  });

  if (!res.ok) throw new Error(`Bunny upload failed: ${res.status}`);
  return `${BUNNY_PULL_ZONE}/${remotePath}`;
}

/**
 * Check if an image exists on Bunny CDN (returns 200).
 *
 * @param {string} url - Full CDN URL to check
 * @returns {boolean}
 */
export async function verifyImageUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch {
    return false;
  }
}
