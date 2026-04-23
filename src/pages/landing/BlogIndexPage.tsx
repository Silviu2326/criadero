import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalendarDays, ArrowRight, Clock, BookOpen, Mail } from 'lucide-react';

const categories = ['Todas', 'Gestión', 'Salud', 'Reproducción', 'Legal', 'Marketing', 'Nutrición'];

const posts = [
  {
    slug: 'gestion-criaderos',
    title: 'Cómo gestionar un criadero de perros de forma profesional',
    excerpt:
      'Descubre las mejores prácticas para organizar la información de tu criadero, desde el registro de perros hasta el seguimiento de camadas y clientes.',
    date: '12 de abril de 2026',
    readTime: '8 min de lectura',
    category: 'Gestión',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    slug: 'historial-veterinario-perros',
    title: 'El historial veterinario como pilar de la cría responsable',
    excerpt:
      'Por qué un registro médico completo y actualizado es fundamental para la salud de tus perros y la confianza de tus clientes.',
    date: '10 de abril de 2026',
    readTime: '6 min de lectura',
    category: 'Salud',
    color: 'from-rose-500 to-rose-700',
  },
  {
    slug: 'camadas-registro-profesional',
    title: 'Registro profesional de camadas: qué datos importan',
    excerpt:
      'Aprende a documentar cada parto de manera estructurada para mantener la trazabilidad genética y sanitaria de tus cachorros.',
    date: '8 de abril de 2026',
    readTime: '7 min de lectura',
    category: 'Reproducción',
    color: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'calendario-celos-perros-guia',
    title: 'Calendario de celos en perros: guía completa para criadores',
    excerpt:
      'Fases del ciclo reproductivo, señales de celo, cálculo óptimo de monta y cómo llevar un registro eficaz para maximizar la productividad de tu criadero.',
    date: '14 de abril de 2026',
    readTime: '9 min de lectura',
    category: 'Reproducción',
    color: 'from-pink-500 to-rose-600',
  },
  {
    slug: 'contrato-venta-cachorros-plantilla',
    title: 'Contrato de venta de cachorros: qué debe incluir y plantilla gratis',
    excerpt:
      'Cláusulas legales esenciales, garantías sanitarias, compromisos del comprador y una plantilla básica descargable para proteger tu trabajo.',
    date: '13 de abril de 2026',
    readTime: '8 min de lectura',
    category: 'Legal',
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'normativa-criaderos-perros-espana',
    title: 'Normativa de criaderos de perros en España: todo lo que debes saber',
    excerpt:
      'Registro obligatorio, licencias de actividad, bienestar animal, inspecciones y sanciones. Guía actualizada para criadores españoles.',
    date: '11 de abril de 2026',
    readTime: '10 min de lectura',
    category: 'Legal',
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    slug: 'como-elegir-reproductor-perro',
    title: 'Cómo elegir un reproductor para tu criadero: criterios genéticos y sanitarios',
    excerpt:
      'Pruebas de salud recomendadas, análisis de temperamento, estándar de raza, consanguinidad y cómo documentar la selección en tu ERP.',
    date: '9 de abril de 2026',
    readTime: '8 min de lectura',
    category: 'Reproducción',
    color: 'from-violet-500 to-violet-700',
  },
  {
    slug: 'alimentacion-cachorros-recien-nacidos',
    title: 'Alimentación de cachorros recién nacidos: guía para criadores',
    excerpt:
      'Lactancia materna, suplementación con fórmula, destete progresivo, errores comunes y calendario nutricional desde el día 1.',
    date: '7 de abril de 2026',
    readTime: '7 min de lectura',
    category: 'Nutrición',
    color: 'from-lime-500 to-emerald-600',
  },
  {
    slug: 'marketing-digital-criaderos-perros',
    title: 'Marketing digital para criaderos de perros: 10 estrategias que funcionan',
    excerpt:
      'Redes sociales, SEO local, página web propia, testimonios de clientes, fotografía profesional y cómo diferenciarte en un mercado competitivo.',
    date: '6 de abril de 2026',
    readTime: '9 min de lectura',
    category: 'Marketing',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    slug: 'enfermedades-hereditarias-perros-prevencion',
    title: 'Enfermedades hereditarias en perros: cómo prevenirlas desde el criadero',
    excerpt:
      'Pruebas genéticas disponibles, selección de reproductores sanos, certificaciones oficiales y protocolos de cría responsable.',
    date: '5 de abril de 2026',
    readTime: '8 min de lectura',
    category: 'Salud',
    color: 'from-red-500 to-rose-700',
  },
];

export function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const filteredPosts = activeCategory === 'Todas' ? posts : posts.filter((p) => p.category === activeCategory);

  const blogPostingSchema = posts.slice(0, 6).map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://petwellly.com/blog/${post.slug}`,
    datePublished: '2026-04-14',
    author: { '@type': 'Organization', name: 'Petwellly' },
  }));

  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Blog | Petwellly"
        description="Artículos, guías y consejos sobre gestión de criaderos, salud canina, reproducción, legalidad y marketing para criadores profesionales."
        keywords="blog criadores perros, gestión criadero, salud canina, reproducción perros, marketing criaderos"
        canonical="/blog"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Blog de Petwellly',
          url: 'https://petwellly.com/blog',
          blogPost: blogPostingSchema,
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 aurora-bg noise-overlay overflow-hidden">
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-40 animate-pulse-glow" />
        <div className="orb orb-terracotta w-[400px] h-[400px] bottom-0 right-0 animate-float-slow" />
        <div className="deco-ring deco-ring-amber w-96 h-96 top-20 right-20 deco-dashed animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-aurora mb-5 inline-flex">
            <BookOpen size={14} className="mr-1" />
            Blog
          </span>
          <h1 className="kinetic-headline font-display text-apple-black text-glow">
            Blog para
            <br />
            <span className="text-gradient-premium">criadores profesionales</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-apple-gray-200 max-w-2xl mx-auto leading-relaxed">
            Artículos, guías y consejos sobre gestión de criaderos, salud canina, reproducción
            y organización de tu operación.
          </p>
        </div>
      </section>

      {/* Posts list */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-apple-black text-white'
                    : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col bg-apple-gray rounded-[28px] overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-sm border border-apple-gray-300/20 hover:shadow-xl"
              >
                <div className={`h-48 bg-gradient-to-br ${post.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold border border-white/20">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-apple-gray-100 mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl text-apple-black mb-3 group-hover:text-apple-blue transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-apple-gray-200 leading-relaxed flex-1 mb-5">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-apple-blue hover:gap-3 transition-all"
                  >
                    Leer artículo
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-apple-black text-white rounded-[32px] p-8 lg:p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Mail size={26} className="text-amber-300" />
            </div>
            <h2 className="kinetic-subhead font-display mb-3">Recibe contenido exclusivo</h2>
            <p className="text-white/60 leading-relaxed mb-8 max-w-lg mx-auto">
              Únete a nuestro newsletter mensual con guías, consejos y novedades pensadas
              exclusivamente para criadores profesionales.
            </p>
            <form
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                alert('¡Gracias por suscribirte! Pronto recibirás nuestro contenido exclusivo.');
              }}
            >
              <input
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="w-full sm:w-auto btn-shimmer px-6 py-3.5 rounded-xl font-semibold whitespace-nowrap"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-xl aurora-bg overflow-hidden noise-overlay">
        <div className="orb orb-green w-[600px] h-[600px] bottom-0 left-0 animate-pulse-glow" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-ultra rounded-[40px] p-10 lg:p-14">
            <h2 className="kinetic-subhead font-display text-apple-black">
              ¿Listo para llevar tu criadero al siguiente nivel?
            </h2>
            <p className="mt-4 text-lg text-apple-gray-200">
              Crea tu cuenta gratuita y descubre cómo Petwellly puede transformar tu operación.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn-shimmer px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2"
              >
                Crear cuenta gratuita
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/features"
                className="px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 bg-white hover:bg-apple-gray border border-apple-gray-300 text-apple-black transition-all"
              >
                Ver funcionalidades
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
