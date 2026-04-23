import { BlogArticleLayout } from "@/components/landing/BlogArticleLayout";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";

export function CalendarioCelosArticle() {
  return (
    <>
      <SeoHelmet
        title="Calendario de celos en perros: guia completa para criadores"
        description="Fases del ciclo reproductivo, señales de celo, calculo optimo de monta y como llevar un registro eficaz para maximizar la productividad de tu criadero."
        canonical="/blog/calendario-celos-perros-guia"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "Calendario de celos en perros: guia completa para criadores",
          author: { "@type": "Organization", name: "Petwellly" },
          datePublished: "2026-04-14",
        }}
      />
      <BlogArticleLayout
        title="Calendario de celos en perros: guia completa para criadores"
        date="14 de abril de 2026"
        readTime="9 min de lectura"
        category="Reproduccion"
        categoryColor="bg-pink-100 text-pink-700"
        relatedArticles={[
          {
            slug: "como-elegir-reproductor-perro",
            title: "Como elegir un reproductor para tu criadero: criterios geneticos y sanitarios",
            category: "Reproduccion",
            categoryColor: "text-violet-600",
          },
          {
            slug: "camadas-registro-profesional",
            title: "Registro profesional de camadas: que datos importan",
            category: "Reproduccion",
            categoryColor: "text-amber-600",
          },
        ]}
      >
        <p>Contenido completo del calendario de celos.</p>
      </BlogArticleLayout>
    </>
  );
}
