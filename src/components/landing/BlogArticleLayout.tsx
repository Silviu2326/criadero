import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';

interface RelatedArticle {
  slug: string;
  title: string;
  category: string;
  categoryColor: string;
}

interface BlogArticleLayoutProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor?: string;
  children: React.ReactNode;
  relatedArticles?: RelatedArticle[];
}

export function BlogArticleLayout({
  title,
  date,
  readTime,
  category,
  categoryColor = 'bg-emerald-100 text-emerald-700',
  children,
  relatedArticles,
}: BlogArticleLayoutProps) {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 aurora-bg noise-overlay overflow-hidden">
        <div className="orb orb-gold w-[500px] h-[500px] -top-40 -left-40 animate-pulse-glow" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-apple-gray-100 hover:text-apple-black transition-colors mb-6 px-4 py-2 rounded-full glass-ultra hover:bg-white/80"
          >
            <ArrowLeft size={16} />
            Volver al blog
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs text-apple-gray-100 mb-5">
            <span className={`px-3 py-1 rounded-full font-semibold ${categoryColor}`}>{category}</span>
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {readTime}
            </span>
          </div>
          <h1 className="kinetic-subhead font-display text-apple-black">{title}</h1>
        </div>
      </section>

      {/* Content */}
      <article className="relative py-16 lg:py-24 bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-apple-gray rounded-[32px] p-8 lg:p-12 glow-border">
            <div className="space-y-6 text-apple-gray-200 leading-relaxed text-lg">{children}</div>
          </div>
        </div>
      </article>

      {/* Related */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="relative py-16 lg:py-24 aurora-mid noise-overlay overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <h3 className="font-display font-bold text-xl text-apple-black mb-6">Artículos relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="p-6 bg-white rounded-[24px] shadow-sm hover:shadow-lg transition-all group border border-apple-gray-300/20"
                >
                  <div className={`flex items-center gap-2 text-xs font-semibold mb-2 ${article.categoryColor}`}>
                    {article.category}
                  </div>
                  <p className="font-semibold text-apple-black group-hover:text-apple-blue transition-colors">
                    {article.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
