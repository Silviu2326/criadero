import { BlogArticleLayout } from "@/components/landing/BlogArticleLayout";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";

export function AlimentacionCachorrosArticle() {
  return (
    <>
      <SeoHelmet
        title="Alimentación de cachorros: guía completa para criadores"
        description="Descubre cómo alimentar a los cachorros de manera correcta desde el destete hasta su primera año. Consejos prácticos para criadores profesionales."
        canonical="/blog/alimentacion-cachorros-guia"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "Alimentación de cachorros: guía completa para criadores",
          author: { "@type": "Organization", name: "Petwellly" },
          datePublished: "2026-04-14",
        }}
      />
      <BlogArticleLayout
        title="Alimentación de cachorros: guía completa para criadores"
        date="14 de abril de 2026"
        readTime="8 min de lectura"
        category="Nutrición"
        categoryColor="bg-green-100 text-green-700"
        relatedArticles={[]}
      >
        <p>Contenido completo sobre alimentación de cachorros.</p>
      </BlogArticleLayout>
    </>
  );
}
