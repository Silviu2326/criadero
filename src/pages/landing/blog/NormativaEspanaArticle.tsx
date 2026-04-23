import { BlogArticleLayout } from "@/components/landing/BlogArticleLayout";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";

export function NormativaEspanaArticle() {
  return (
    <>
      <SeoHelmet
        title="Normativa de criaderos de perros en Espana: todo lo que debes saber"
        description="Registro obligatorio, licencias de actividad, bienestar animal, inspecciones y sanciones. Guia actualizada para criadores espanoles."
        canonical="/blog/normativa-criaderos-perros-espana"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "Normativa de criaderos de perros en Espana: todo lo que debes saber",
          author: { "@type": "Organization", name: "Petwellly" },
          datePublished: "2026-04-14",
        }}
      />
      <BlogArticleLayout
        title="Normativa de criaderos de perros en Espana: todo lo que debes saber"
        date="11 de abril de 2026"
        readTime="10 min de lectura"
        category="Legal"
        categoryColor="bg-indigo-100 text-indigo-700"
        relatedArticles={[
          {
            slug: "contrato-venta-cachorros-plantilla",
            title: "Contrato de venta de cachorros: que debe incluir y plantilla gratis",
            category: "Legal",
            categoryColor: "text-slate-600",
          },
          {
            slug: "gestion-criaderos",
            title: "Como gestionar un criadero de perros de forma profesional",
            category: "Gestion",
            categoryColor: "text-emerald-600",
          },
        ]}
      >
        <p>Contenido completo de normativa.</p>
      </BlogArticleLayout>
    </>
  );
}
