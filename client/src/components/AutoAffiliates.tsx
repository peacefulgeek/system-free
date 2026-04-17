import { matchProducts, amazonUrl, type Product } from "@/data/product-catalog";
import { getCachedPrice, getCachedAvailability } from "@/data/product-cache-types";

interface AutoAffiliatesProps {
  articleTitle: string;
  articleCategory: string;
  articleTags?: string[];
}

function ProductCard({ product }: { product: Product }) {
  const price = getCachedPrice(product.asin);
  const avail = getCachedAvailability(product.asin);

  return (
    <a
      href={amazonUrl(product.asin)}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex items-start gap-4 p-4 rounded-xl bg-white/80 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all duration-300"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-800 group-hover:text-amber-800 transition-colors text-sm leading-snug">
          {product.name}
        </p>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          {product.sentence}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {price && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ~{price}
            </span>
          )}
          {avail === "unavailable" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-600 border border-red-200">
              Unavailable
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 group-hover:text-amber-800">
            View on Amazon
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function AutoAffiliates({ articleTitle, articleCategory, articleTags = [] }: AutoAffiliatesProps) {
  const products = matchProducts({ articleTitle, articleTags, articleCategory });

  if (products.length === 0) return null;

  return (
    <aside className="my-10 p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 to-stone-50/80 border border-amber-100/60">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="font-serif text-lg text-stone-800">Tools That Support This Work</h3>
      </div>
      <p className="text-sm text-stone-500 mb-4 leading-relaxed">
        These are resources I genuinely recommend. As an Amazon Associate, I earn from qualifying purchases - at no extra cost to you. Prices shown are approximate and may vary.
      </p>
      <div className="grid gap-3">
        {products.map((product) => (
          <ProductCard key={product.asin} product={product} />
        ))}
      </div>
    </aside>
  );
}
