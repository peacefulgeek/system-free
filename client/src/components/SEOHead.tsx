import { useEffect } from "react";
import { SITE_CONFIG } from "@/data";

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  publishedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown>;
}

export default function SEOHead({
  title,
  description,
  url,
  image,
  type = "website",
  publishedTime,
  author,
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title
    ? `${title} — ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} — Healthcare Sovereignty Starts Here`;
  const desc = description || SITE_CONFIG.description;
  const fullUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;
  const ogImage =
    image || "https://system-free.b-cdn.net/images/og/site-og.webp";

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(
        `meta[property="${property}"], meta[name="${property}"]`
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        if (property.startsWith("og:") || property.startsWith("article:")) {
          el.setAttribute("property", property);
        } else {
          el.setAttribute("name", property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:url", fullUrl);
    setMeta("og:image", ogImage);
    setMeta("og:type", type);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", ogImage);

    if (publishedTime) {
      setMeta("article:published_time", publishedTime);
    }
    if (author) {
      setMeta("article:author", author);
    }

    // Set canonical
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

    // JSON-LD
    if (jsonLd) {
      const existingScript = document.querySelector(
        'script[data-seo-jsonld]'
      );
      if (existingScript) existingScript.remove();
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [fullTitle, desc, fullUrl, ogImage, type, publishedTime, author, jsonLd]);

  return null;
}
