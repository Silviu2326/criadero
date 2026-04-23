import { BlogArticleLayout } from "@/components/landing/BlogArticleLayout";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";

export function ContratoVentaArticle() {
  return (
    <>
      <SeoHelmet
        title="Contrato de venta de cachorros: qué debe incluir y plantilla gratis"
        description="Todo lo que necesitas saber para redactar un contrato de venta de cachorros profesional. Incluye cláusulas esenciales y plantilla descargable."
        canonical="/blog/contrato-venta-cachorros-plantilla"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "Contrato de venta de cachorros: qué debe incluir y plantilla gratis",
          author: { "@type": "Organization", name: "Petwellly" },
          datePublished: "2026-04-14",
        }}
      />
      <BlogArticleLayout
        title="Contrato de venta de cachorros: qué debe incluir y plantilla gratis"
        date="14 de abril de 2026"
        readTime="10 min de lectura"
        category="Legal"
        categoryColor="bg-indigo-100 text-indigo-700"
        relatedArticles={[]}
      >
        <p>Contenido completo sobre contratos de venta de cachorros.</p>
      </BlogArticleLayout>
    </>
  );
}
