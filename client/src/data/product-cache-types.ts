/**
 * Product Cache Types & Helpers
 * 
 * The product-cache.json file is maintained by a weekly cron in start-with-cron.mjs.
 * It stores fetched Amazon product metadata: title, price, availability, and last-checked date.
 * The frontend reads this cache to display current prices and availability badges.
 */

export interface CachedProduct {
  title: string;
  price: string | null;       // e.g. "$13.14" or null if not found
  availability: "in-stock" | "unavailable" | "unknown";
  lastChecked: string;         // ISO date string
}

export interface ProductCache {
  lastFullRefresh: string | null;
  products: Record<string, CachedProduct>;  // keyed by ASIN
}

import cacheData from "./product-cache.json";

const cache = cacheData as ProductCache;

/**
 * Get cached metadata for an ASIN.
 * Returns null if the ASIN has never been checked.
 */
export function getCachedProduct(asin: string): CachedProduct | null {
  return cache.products[asin] || null;
}

/**
 * Get the price string for an ASIN, or null if not cached.
 */
export function getCachedPrice(asin: string): string | null {
  const p = cache.products[asin];
  return p?.price || null;
}

/**
 * Get availability status for an ASIN.
 */
export function getCachedAvailability(asin: string): "in-stock" | "unavailable" | "unknown" {
  const p = cache.products[asin];
  return p?.availability || "unknown";
}

/**
 * Get the last full refresh date, or null if never refreshed.
 */
export function getLastRefreshDate(): string | null {
  return cache.lastFullRefresh;
}

/**
 * Format a price for display with "~" prefix to indicate approximate.
 * Returns null if no price cached.
 */
export function formatCachedPrice(asin: string): string | null {
  const price = getCachedPrice(asin);
  if (!price) return null;
  // Already has $ sign from the cron
  return `~${price}`;
}
