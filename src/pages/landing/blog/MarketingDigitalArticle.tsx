import { BlogArticleLayout } from "@/components/landing/BlogArticleLayout";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";

export function MarketingDigitalArticle() {
  return (
    <>
      <SeoHelmet
        title="Marketing digital para criadores de perros: guía 2026"
        description="Aprende a promocionar tu criadero de perros en internet con estrategias de marketing digital efectivas, redes sociales y SEO local."
        canonical="/blog/marketing-digital-criadores-perros"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "Marketing digital para criadores de perros: guía 2026",
          author: { "@type": "Organization", name: "Petwellly" },
          datePublished: "2026-04-14",
        }}
      />
      <BlogArticleLayout
        title="Marketing digital para criadores de perros: guía 2026"
        date="14 de abril de 2026"
        readTime="12 min de lectura"
        category="Marketing"
        categoryColor="bg-pink-100 text-pink-700"
        relatedArticles={[]}
      >
        <p>Contenido completo sobre marketing digital para criadores.</p>
      </BlogArticleLayout>
    </>
  );
}
