import { Link } from 'react-router-dom';
import { BlogArticleLayout } from '@/components/landing/BlogArticleLayout';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';

export function RegistroCamadasArticle() {
  return (
    <>
      <SeoHelmet
        title="Registro profesional de camadas: qué datos importan"
        description="Aprende a documentar cada parto de manera estructurada para mantener la trazabilidad genética y sanitaria de tus cachorros."
        canonical="/blog/camadas-registro-profesional"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: 'Registro profesional de camadas: qué datos importan',
          author: { '@type': 'Organization', name: 'Petwellly' },
          datePublished: '2026-04-14',
        }}
      />
      <BlogArticleLayout
        title="Registro profesional de camadas: qué datos importan"
        date="8 de abril de 2026"
        readTime="7 min de lectura"
        category="Reproducción"
        categoryColor="bg-amber-100 text-amber-700"
        relatedArticles={[
          {
            slug: 'gestion-criaderos',
            title: 'Cómo gestionar un criadero de perros de forma profesional',
            category: 'Gestión',
            categoryColor: 'text-emerald-600',
          },
          {
            slug: 'historial-veterinario-perros',
            title: 'El historial veterinario como pilar de la cría responsable',
            category: 'Salud',
            categoryColor: 'text-rose-600',
          },
        ]}
      >
        <p>
          Cada camada representa meses de planificación, selección de reproductores,
          cuidado de la gestación y atención durante el parto. Pero todo ese esfuerzo puede
          perderse si no se documenta correctamente. El registro profesional de camadas no
          solo organiza la información: construye el patrimonio genético y sanitario de tu
          criadero.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          Datos esenciales de cada camada
        </h2>
        <p>
          Un registro completo de camadas debe incluir al menos los siguientes datos desde
          el momento del parto:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Fecha y hora de nacimiento:</strong> punto de partida para todo el
            seguimiento veterinario posterior.
          </li>
          <li>
            <strong>Madre:</strong> vinculación directa con la ficha de la perra en el
            sistema.
          </li>
          <li>
            <strong>Padre:</strong> vinculación con el perro del criadero o anotación si es
            externo.
          </li>
          <li>
            <strong>Número de cachorros vivos y fallecidos:</strong> dato clínico y
            estadístico.
          </li>
          <li>
            <strong>Sexo de los cachorros:</strong> para planificar disponibilidad desde el
            primer día.
          </li>
          <li>
            <strong>Notas del parto:</strong> complicaciones, intervenciones veterinarias,
            observaciones relevantes.
          </li>
        </ul>

        <div className="my-10 p-6 bg-white rounded-2xl border-l-4 border-amber-500 shadow-sm">
          <p className="font-medium text-apple-black mb-2">Dato clave</p>
          <p className="text-sm">
            La documentación detallada del parto puede ayudar al veterinario a identificar
            factores de riesgo en futuras gestaciones de la misma perra.
          </p>
        </div>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          De la camada a la ficha individual
        </h2>
        <p>
          Una de las mejores prácticas en la gestión de criaderos es la{' '}
          <strong>creación automática de fichas individuales</strong> a partir del registro
          de la camada. Esto garantiza que cada cachorro tenga su propio historial desde el
          nacimiento, con los progenitores ya vinculados y la fecha de nacimiento
          documentada.
        </p>
        <p>
          Este vínculo entre camada y perro individual permite rastrear con facilidad la
          genealogía de cualquier ejemplar adulto. Si años más tarde un comprador solicita
          información sobre los abuelos de su perro, el sistema debe poder reconstruir esa
          línea sin depender de la memoria del criador.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          Trazabilidad sanitaria desde el día cero
        </h2>
        <p>
          La salud de una camada comienza a documentarse mucho antes del nacimiento, pero
          el parto marca el inicio del seguimiento individual. Las primeras vacunas,
          desparasitaciones y controles veterinarios deben quedar asociados tanto a la ficha
          de cada cachorro como, en muchos casos, a la camada en conjunto.
        </p>
        <p>
          Tener esta trazabilidad clara es especialmente útil cuando surgen problemas de
          salud hereditarios. Si varios cachorros de una misma camada presentan una
          condición similar, el registro profesional permite identificar patrones y tomar
          decisiones informadas sobre futuras cruces.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          Gestión comercial de la camada
        </h2>
        <p>
          Además de la información sanitaria y genealógica, el registro de camadas tiene un
          componente comercial. Saber cuántos cachorros están disponibles, cuántos están
          reservados y cuántos ya fueron entregados permite al criador proyectar ingresos y
          gestionar expectativas con los clientes.
        </p>
        <p>
          Un sistema integrado como{' '}
          <Link to="/features" className="text-apple-blue font-semibold hover:underline">Petwellly</Link>{' '}
          conecta el registro de camadas con el módulo de reservas y ventas. Así, cuando un
          cliente solicita un cachorro, el criador puede ver inmediatamente la
          disponibilidad sin tener que consultar múltiples fuentes de información.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          Conclusión
        </h2>
        <p>
          El registro profesional de camadas es mucho más que una lista de nacimientos. Es
          la base de la trazabilidad genética, la herramienta de seguimiento sanitario y el
          soporte de la gestión comercial de tu criadero. Documentar cada parto con rigor
          es una inversión que se traduce en mejor salud para tus perros, más confianza
          para tus clientes y un conocimiento acumulado invaluable.
        </p>
        <p>
          Si quieres llevar el control de tus camadas al siguiente nivel, te recomendamos
          leer también nuestra guía sobre{' '}
          <Link to="/blog/gestion-criaderos" className="text-apple-blue font-semibold hover:underline">
            cómo gestionar un criadero de forma profesional
          </Link>{' '}
          y nuestro artículo sobre{' '}
          <Link to="/blog/historial-veterinario-perros" className="text-apple-blue font-semibold hover:underline">
            el historial veterinario como pilar de la cría responsable
          </Link>.
        </p>
      </BlogArticleLayout>
    </>
  );
}
