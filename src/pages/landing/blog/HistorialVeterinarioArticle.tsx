import { Link } from 'react-router-dom';
import { BlogArticleLayout } from '@/components/landing/BlogArticleLayout';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';

export function HistorialVeterinarioArticle() {
  return (
    <>
      <SeoHelmet
        title="El historial veterinario como pilar de la cría responsable"
        description="Por qué un registro médico completo y actualizado es fundamental para la salud de tus perros y la confianza de tus clientes."
        canonical="/blog/historial-veterinario-perros"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: 'El historial veterinario como pilar de la cría responsable',
          author: { '@type': 'Organization', name: 'Petwellly' },
          datePublished: '2026-04-14',
        }}
      />
      <BlogArticleLayout
        title="El historial veterinario como pilar de la cría responsable"
        date="10 de abril de 2026"
        readTime="6 min de lectura"
        category="Salud"
        categoryColor="bg-rose-100 text-rose-700"
        relatedArticles={[
          {
            slug: 'gestion-criaderos',
            title: 'Cómo gestionar un criadero de perros de forma profesional',
            category: 'Gestión',
            categoryColor: 'text-emerald-600',
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
          La cría profesional de perros conlleva una responsabilidad enorme hacia los
          animales y hacia los futuros propietarios. Entre todas las prácticas que definen
          un criadero serio, el historial veterinario ocupa un lugar central. Sin él, no es
          posible garantizar la salud de los ejemplares ni ofrecer transparencia a los
          compradores.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          ¿Qué debe incluir un historial veterinario completo?
        </h2>
        <p>
          Un historial médico de calidad no se limita a anotar la fecha de una vacuna. Debe
          abarcar todos los eventos sanitarios relevantes de la vida del perro:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Vacunaciones:</strong> tipo de vacuna, lote, laboratorio, fecha de
            aplicación y fecha de la próxima dosis.
          </li>
          <li>
            <strong>Desparasitaciones:</strong> producto utilizado, peso del animal en el
            momento del tratamiento y fecha siguiente.
          </li>
          <li>
            <strong>Consultas generales:</strong> motivo de la visita, diagnóstico,
            tratamiento prescrito y observaciones del veterinario.
          </li>
          <li>
            <strong>Pruebas y exámenes:</strong> tipo de prueba, fecha, resultado y
            documentos adjuntos (PDF o imágenes).
          </li>
          <li>
            <strong>Cirugías y procedimientos:</strong> descripción del procedimiento,
            veterinario responsable y notas post-operatorias.
          </li>
        </ul>

        <div className="my-10 p-6 bg-white rounded-2xl border-l-4 border-rose-500 shadow-sm">
          <p className="font-medium text-apple-black mb-2">Buena práctica</p>
          <p className="text-sm">
            Conserva siempre una copia digital de las facturas y resultados veterinarios.
            Los documentos físicos se pierden, pero los digitales permanecen.
          </p>
        </div>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          La importancia de las alertas preventivas
        </h2>
        <p>
          Uno de los mayores riesgos en la gestión de la salud canina es la{' '}
          <strong>demora en las revacunaciones o desparasitaciones</strong>. Un sistema que
          genere alertas automáticas con anticipación —por ejemplo, 30 días antes del
          vencimiento— permite planificar la visita al veterinario con calma y evitar
          lapsos de protección.
        </p>
        <p>
          En un criadero con varios ejemplares y múltiples camadas al año, mantener estas
          fechas en la cabeza o en notas sueltas es inviable. La automatización de alertas
          se convierte en una herramienta imprescindible para el veterinario y el criador.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          Colaboración estructurada con el veterinario
        </h2>
        <p>
          La relación entre criador y veterinario no debería depender de mensajes de texto
          o llamadas telefónicas esporádicas. Un ERP especializado permite que el
          veterinario asignado acceda a los perros del criadero, registre eventos médicos
          directamente en la plataforma y adjunte documentos de respaldo.
        </p>
        <p>
          Esta colaboración estructurada tiene beneficios claros: elimina la pérdida de
          información, garantiza que todos los registros queden fechados y firmados por el
          profesional sanitario, y permite al criador consultar el historial en cualquier
          momento desde cualquier dispositivo.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          El historial veterinario como argumento de venta
        </h2>
        <p>
          Los compradores de hoy son cada vez más exigentes. Quieren saber que el cachorro
          que están llevando a casa ha nacido en un entorno controlado, con seguimiento
          sanitario riguroso. Poder mostrar un historial veterinario completo, limpio y
          profesionalmente presentado diferencia a un criadero serio de uno informal.
        </p>

        <h2 className="font-display font-bold text-2xl text-apple-black mt-12 mb-4">
          Conclusión
        </h2>
        <p>
          El historial veterinario no es un mero formulario: es el pilar sobre el que se
          sustenta la cría responsable. Documentar cada vacuna, cada consulta y cada
          desparasitación de forma estructurada protege la salud de tus perros, facilita la
          colaboración con veterinarios y transmite confianza a tus clientes.
        </p>
        <p>
          Si estás buscando una forma de centralizar toda esta información, puedes explorar
          cómo <Link to="/features" className="text-apple-blue font-semibold hover:underline">Petwellly</Link>{' '}
          organiza el historial médico con alertas automáticas y acceso multiusuario.
        </p>
      </BlogArticleLayout>
    </>
  );
}
