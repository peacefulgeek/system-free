#!/usr/bin/env node
/**
 * OG Image generation notes for Free From the System
 * 
 * All 300 article OG images + site OG image have been pre-generated
 * and uploaded to Bunny CDN at:
 *   https://system-free.b-cdn.net/images/og/{slug}.webp
 *   https://system-free.b-cdn.net/images/hero/{slug}.webp
 * 
 * The site-level OG image is at:
 *   https://system-free.b-cdn.net/images/og/site-og.webp
 * 
 * To regenerate images, use the FAL.ai API with the prompts
 * stored in each article's imagePrompt field.
 */

console.log('OG images are pre-generated and hosted on Bunny CDN.');
console.log('See article data for image URLs.');
