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
        <article className="rich-card grid md:grid-cols-2 gap-0">
          <div className="overflow-hidden">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover"
              style={{ aspectRatio: '16/10', minHeight: '280px' }}
              loading="lazy"
            />
          </div>
          <div className="p-7 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-category">{article.categoryName}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {article.readingTime} min read
              </span>
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl text-liberty mb-3 group-hover:text-health transition-colors duration-300 leading-tight">
              {article.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
              {article.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{article.dateHuman}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>By Kalesh</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block no-underline h-full"
    >
      <article className="rich-card h-full flex flex-col">
        <div className="overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full object-cover"
            style={{ aspectRatio: '16/10' }}
            loading="lazy"
          />
        </div>
        <div className="p-5 md:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="badge-category">{article.categoryName}</span>
            <span className="text-xs text-muted-foreground font-medium">
              {article.readingTime} min
            </span>
          </div>
          <h3 className="font-serif text-lg text-liberty mb-2 group-hover:text-health transition-colors duration-300 leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {article.description}
          </p>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
            <span>{article.dateHuman}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>By Kalesh</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
