import { Link } from "wouter";
import type { Article } from "@/data";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured }: ArticleCardProps) {
  if (featured) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block no-underline"
      >
        <article className="grid md:grid-cols-2 gap-6 bg-card rounded-lg overflow-hidden border border-border hover:border-health/30 transition-all duration-300 hover:shadow-lg">
          <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-health">
                {article.categoryName}
              </span>
              <span className="text-xs text-muted-foreground">
                {article.readingTime} min read
              </span>
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl text-liberty mb-3 group-hover:text-health transition-colors">
              {article.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.description}
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              {article.dateHuman}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block no-underline"
    >
      <article className="bg-card rounded-lg overflow-hidden border border-border hover:border-health/30 transition-all duration-300 hover:shadow-md h-full flex flex-col">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-health">
              {article.categoryName}
            </span>
            <span className="text-xs text-muted-foreground">
              {article.readingTime} min
            </span>
          </div>
          <h3 className="font-serif text-lg text-liberty mb-2 group-hover:text-health transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {article.description}
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            {article.dateHuman}
          </div>
        </div>
      </article>
    </Link>
  );
}
