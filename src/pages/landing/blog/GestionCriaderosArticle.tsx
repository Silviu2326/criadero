import { Link } from 'react-router-dom';
import { BlogArticleLayout } from '@/components/landing/BlogArticleLayout';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';

export function GestionCriaderosArticle() {
  return (
    <>
      <SeoHelmet
        title="Cómo gestionar un criadero de perros de forma profesional"
        description="Descubre las mejores prácticas para organizar la información de tu criadero, desde el registro de perros hasta el seguimiento de camadas y clientes."
        canonical="/blog/gestion-criaderos"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: 'Cómo gestionar un criadero de perros de forma profesional',
          author: { '@type': 'Organization', name: 'Petwellly' },
          datePublished: '2026-04-14',
        }}
      />
      <BlogArticleLayout
        title="Cómo gestionar un criadero de perros de forma profesional"
        date="12 de abril de 2026"
        readTime="8 min de lectura"
        category="Gestión"
        categoryColor="bg-emerald-100 text-emerald-700"
        relatedArticles={[
          {
            slug: 'historial-veterinario-perros',
            title: 'El historial veterinario como pilar de la cría responsable',
            category: 'Salud',
            categoryColor: 'text-rose-600',
          },
          {
            slug: 'camadas-registro-profesional',
            title: 'Registro profesional de camadas: qué datos importan',
            category: 'Reproducción',
            categoryColor: 'text-amber-600',
          },
        ]}
      >
        <p>
          Gestionar un criadero de perros de manera profesional implica coordinar múltiples
          variables: la salud de los reproductores, el seguimiento de camadas, el registro
          de clientes, las reservas, los documentos legales y sanitarios, y cada vez más, la
          presencia digital. Cuando estos elementos se administran de forma dispersa —hojas
          de cálculo, mensajes de texto, cuadernos de papel— es fácil que se pierda
          información valiosa.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          1. Centraliza la información de tus perros
        </h2>
        <p>
          El primer paso hacia una gestión profesional es contar con un{' '}
          <strong>registro único y centralizado</strong> para cada animal. Esto incluye datos
          básicos como raza, sexo, fecha de nacimiento, color y número de microchip, pero
          también información genealógica: quién es el padre, quién es la madre, y qué
          camadas ha protagonizado.
        </p>
        <p>
          Un ERP como <Link to="/features" className="text-apple-blue font-semibold hover:underline">Petwellly</Link>{' '}
          permite almacenar hasta 10 fotos por perro, vincular progenitores y mantener un
          historial de estados (disponible, reservado, vendido, reproductivo, retirado).
          Esto no solo organiza tu operación, sino que te da credibilidad ante posibles
          compradores.
        </p>

        <div className="my-10 p-6 bg-white rounded-2xl border-l-4 border-apple-blue shadow-sm">
          <p className="font-medium text-apple-black mb-2">Dato clave</p>
          <p className="text-sm">
            Los criadores que mantienen un registro genealógico estructurado logran una
            percepción de profesionalidad significativamente mayor entre los compradores.
          </p>
        </div>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          2. Documenta cada camada con rigor
        </h2>
        <p>
          Cada parto es un hito en la historia de tu criadero. Registrar la fecha de
          nacimiento, la madre, el padre, el número de cachorros vivos y fallecidos, y las
          notas médicas del parto te permitirá detectar patrones genéticos y de salud a lo
          largo del tiempo.
        </p>
        <p>
          Además, contar con un{' '}
          <Link to="/blog/camadas-registro-profesional" className="text-apple-blue font-semibold hover:underline">
            registro profesional de camadas
          </Link>{' '}
          facilita la creación de fichas individuales para cada cachorro, manteniendo la
          trazabilidad desde el primer día de vida.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          3. Mantén un historial veterinario completo
        </h2>
        <p>
          La salud es el pilar de cualquier criadero responsable. Las vacunas,
          desparasitaciones, consultas generales y pruebas diagnósticas deben quedar
          documentadas de forma estructurada. Esto no solo protege a tus animales, sino que
          también transmite confianza a los futuros propietarios.
        </p>
        <p>
          Un sistema que genere{' '}
          <Link to="/blog/historial-veterinario-perros" className="text-apple-blue font-semibold hover:underline">
            alertas automáticas de próximas vacunas
          </Link>{' '}
          puede marcar la diferencia entre una gestión reactiva y una gestión preventiva.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          4. Gestiona clientes y reservas sin perder el hilo
        </h2>
        <p>
          El ciclo comercial de un criadero incluye consultas, reservas, pagos y entregas.
          Cuando esta información vive en mensajes de WhatsApp o correos electrónicos
          dispersos, es fácil cometer errores: vender el mismo cachorro dos veces, olvidar
          una reserva confirmada o perder los datos de contacto de un comprador.
        </p>
        <p>
          Tener un módulo de clientes y reservas te permite ver en un solo lugar quién ha
          reservado qué, en qué estado se encuentra cada operación, y cuál es el historial
          de compras de cada persona.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          5. Apuesta por la visibilidad digital controlada
        </h2>
        <p>
          En la era actual, tener presencia online no es opcional. Sin embargo, no todos los
          perros de tu criadero necesitan estar expuestos públicamente. La clave está en el
          <strong> control de visibilidad</strong>: decidir qué animales aparecen en tu página
          pública y cuáles permanecen solo para uso interno.
        </p>
        <p>
          Petwellly ofrece una{' '}
          <Link to="/features" className="text-apple-blue font-semibold hover:underline">
            página pública configurable por criadero
          </Link>
          , con URL única y validación automática de contenido antes de publicar. Esto te
          permite mostrar tu trabajo al mundo sin depender de programadores ni diseñadores.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          Conclusión
        </h2>
        <p>
          Gestionar un criadero de forma profesional no requiere una infraestructura enorme,
          pero sí una herramienta que unifique todos los flujos de trabajo. Desde el
          registro de perros y camadas hasta el historial veterinario, las reservas y la
          página pública, cada detalle cuenta para construir una operación sólida,
          transparente y sostenible en el tiempo.
        </p>
      </BlogArticleLayout>
    </>
  );
}
