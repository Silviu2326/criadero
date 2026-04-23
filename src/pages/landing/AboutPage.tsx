import { Link } from 'react-router-dom';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';
import { Heart, Target, Shield, Users, Mail, Sparkles, Briefcase, Calendar } from 'lucide-react';

const values = [
  {
    icon: Target,
    color: 'bg-amber-100 text-amber-700',
    title: 'Enfoque en la operación real',
    desc: 'No añadimos funcionalidades por moda. Cada módulo resuelve un problema concreto que los criadores enfrentan en su día a día.',
  },
  {
    icon: Shield,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Privacidad y control',
    desc: 'Creemos que tú decides qué mostrar y qué no. El control granular de visibilidad es un derecho, no un extra.',
  },
  {
    icon: Users,
    color: 'bg-blue-100 text-blue-700',
    title: 'Colaboración estructurada',
    desc: 'Facilitamos la comunicación entre criadores, veterinarios y clientes sin depender de grupos de mensajería dispersos.',
  },
  {
    icon: Heart,
    color: 'bg-rose-100 text-rose-700',
    title: 'Bienestar animal primero',
    desc: 'Una gestión ordenada permite mejores decisiones de salud, reproducción y cuidado. La tecnología debe servir al perro.',
  },
];

export function AboutPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Sobre nosotros | Petwellly"
        description="Conoce al equipo detrás de Petwellly, nuestra misión, visión y valores. Construimos el ERP definitivo para criadores de perros profesionales."
        keywords="sobre Petwellly, equipo Petwellly, misión Petwellly, ERP criadores perros"
        canonical="/about"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Petwellly',
          url: 'https://petwellly.com',
          logo: 'https://petwellly.com/og-default.svg',
          sameAs: [],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'hola@petwellly.com',
            contactType: 'sales',
          },
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 aurora-bg noise-overlay overflow-hidden">
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-40 animate-pulse-glow" />
        <div className="orb orb-green w-[500px] h-[500px] top-1/3 right-0 animate-float-slow" />
        <div className="deco-ring deco-ring-amber w-96 h-96 top-20 right-20 deco-dashed animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-aurora mb-5 inline-flex">Nosotros</span>
          <h1 className="kinetic-headline font-display text-apple-black text-glow">
            Sobre{' '}
            <span className="text-gradient-premium">Petwellly</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-apple-gray-200 max-w-2xl mx-auto leading-relaxed">
            Somos un equipo apasionado por la cría profesional de perros y convencidos de que
            la tecnología puede transformar la forma en que se gestionan los criaderos.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-apple-gray rounded-[32px] p-8 lg:p-10 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 glow-border">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                  <Target className="text-emerald-700" size={26} />
                </div>
                <h2 className="font-display font-bold text-2xl text-apple-black mb-4">
                  Nuestra misión
                </h2>
                <p className="text-apple-gray-200 leading-relaxed">
                  Organizar la cría profesional de perros mediante una plataforma unificada que
                  centralice la gestión de animales, salud, clientes y operaciones comerciales.
                  Queremos que ningún criadero profesional dependa de hojas de cálculo sueltas o
                  mensajes perdidos para gestionar su operación.
                </p>
              </div>
            </div>
            <div className="bg-apple-black text-white rounded-[32px] p-8 lg:p-10 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <Sparkles className="text-amber-300" size={26} />
                </div>
                <h2 className="font-display font-bold text-2xl mb-4">Nuestra visión</h2>
                <p className="text-white/60 leading-relaxed">
                  Ser la plataforma de referencia para criadores profesionales en habla hispana,
                  reconocida por su simplicidad, control de privacidad y respeto por el bienestar
                  animal. Imaginamos un ecosistema donde criadores, veterinarios y clientes
                  colaboren de forma transparente y estructurada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="badge-aurora mb-4 inline-flex">Valores</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-3">
              Los valores que nos guían
            </h2>
            <p className="mt-4 text-lg text-apple-gray-200">
              Cada decisión de diseño y desarrollo parte de estos principios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="group bg-white rounded-[28px] p-7 shadow-sm border border-apple-gray-300/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <div className={`w-14 h-14 rounded-2xl ${v.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <v.icon size={26} />
                </div>
                <h3 className="font-display font-bold text-lg text-apple-black mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-apple-gray-200 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-apple-gray rounded-[32px] p-8 lg:p-12 glow-border">
            <h2 className="kinetic-subhead font-display text-apple-black mb-6">
              Por qué construimos esto
            </h2>
            <div className="space-y-5 text-apple-gray-200 leading-relaxed">
              <p>
                Petwellly nació de la observación directa de cómo operan los criadores
                profesionales. Durante meses de conversaciones con criadores de diferentes razas
                y tamaños, detectamos un patrón común: la información crítica estaba dispersa en
                hojas de Excel, fotos del móvil, mensajes de WhatsApp y cuadernos de papel.
              </p>
              <p>
                Esa dispersión no solo generaba pérdida de tiempo: provocaba errores costosos.
                Se perdían datos de vacunas, se confundían fechas de celos, se olvidaban
                reservas pendientes y, lo peor, se degradaba el conocimiento genealógico y de
                salud que tanto trabajo había costado construir.
              </p>
              <p>
                Decidimos crear una plataforma que no fuera un software genérico adaptado a
                perros, sino un ERP pensado desde cero para la industria de la cría profesional.
                Cada módulo —perros, camadas, veterinario, clientes, reservas, página pública—
                responde a un flujo de trabajo real que observamos en el campo.
              </p>
              <p>
                Hoy seguimos construyendo. No tenemos una lista interminable de &quot;clientes
                satisfechos&quot; porque aún estamos en las primeras etapas de crecimiento, y eso es
                algo que valoramos. Significa que podemos escuchar de cerca a cada criadero que
                confía en nosotros y mejorar el producto con feedback genuino.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="badge-aurora mb-4 inline-flex">Equipo</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-3">Quienes construyen Petwellly</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: 'Marta Ríos', role: 'CEO & Cofundadora', color: 'bg-rose-100 text-rose-700' },
              { name: 'Luis Fernández', role: 'CTO & Cofundador', color: 'bg-blue-100 text-blue-700' },
              { name: 'Carmen Vega', role: 'Product Manager', color: 'bg-emerald-100 text-emerald-700' },
              { name: 'Diego Molina', role: 'Head of Customer Success', color: 'bg-amber-100 text-amber-700' },
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-[28px] p-7 text-center shadow-sm border border-apple-gray-300/20 transition-all hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 font-display font-bold text-xl`}>
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h3 className="font-display font-bold text-lg text-apple-black">{member.name}</h3>
                <p className="text-sm text-apple-gray-200">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="badge-aurora mb-4 inline-flex">Historia</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-3">Nuestra evolución</h2>
          </div>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-apple-gray-300 before:to-transparent">
            {[
              { year: '2023', title: 'El origen', desc: 'Identificamos la necesidad de un ERP específico para criadores tras meses de conversaciones con el sector.' },
              { year: '2024', title: 'MVP y primeros usuarios', desc: 'Lanzamos la primera versión con gestión de perros, camadas y veterinario. Recibimos feedback de más de 50 criadores.' },
              { year: '2025', title: 'Escalando funcionalidades', desc: 'Añadimos página pública, reservas, múltiples roles y reportes avanzados. El equipo creció a 8 personas.' },
              { year: '2026', title: 'Consolidación internacional', desc: 'Ampliamos soporte a múltiples países hispanohablantes y comenzamos el desarrollo de la app móvil.' },
            ].map((item) => (
              <div key={item.year} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-apple-gray-300 group-hover:bg-apple-blue group-hover:text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors">
                  <Calendar size={16} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-apple-gray rounded-[24px] p-6 glow-border">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-2">{item.year}</span>
                  <h3 className="font-display font-bold text-lg text-apple-black mb-1">{item.title}</h3>
                  <p className="text-sm text-apple-gray-200 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS KIT */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-apple-black text-white rounded-[32px] p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Briefcase size={20} className="text-amber-300" />
              </div>
              <span className="text-sm font-semibold text-white/60">Kit de prensa</span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-3">¿Eres periodista o blogger?</h3>
            <p className="text-white/60 leading-relaxed mb-6">
              Estamos abiertos a colaboraciones, entrevistas y cobertura mediática. Si necesitas
              logos, fotos del equipo o declaraciones para tu artículo, escríbenos y te lo
              enviamos en menos de 24 horas.
            </p>
            <a
              href="mailto:hola@petwellly.com?subject=Solicitud%20kit%20de%20prensa"
              className="inline-flex items-center gap-2 btn-shimmer px-6 py-3 rounded-xl font-semibold"
            >
              <Mail size={18} />
              Solicitar kit de prensa
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative section-xl aurora-dark text-white overflow-hidden noise-overlay-dark">
        <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="orb orb-gold w-[500px] h-[500px] -top-20 -right-20 animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ultra-dark text-sm font-semibold mb-6 border border-white/10">
                <Mail size={16} className="text-amber-300" />
                Contacto
              </div>
              <h2 className="kinetic-subhead font-display text-white">
                ¿Quieres
                <br />
                <span className="text-gradient-amber-premium text-glow-amber">saber más?</span>
              </h2>
              <p className="text-white/60 leading-relaxed mt-5 mb-6 max-w-lg">
                Estamos abiertos a conversar con criadores, asociaciones y veterinarios que
                quieran colaborar en la evolución de la plataforma. No necesitas ser usuario
                para ponerte en contacto.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:hola@petwellly.com"
                  className="btn-shimmer px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  <Mail size={18} />
                  Escríbenos
                </a>
                <Link
                  to="/features"
                  className="px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 glass-ultra-dark hover:bg-white/10 transition-colors border border-white/10"
                >
                  Explorar funcionalidades
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-apple-blue/30 to-amber-500/20 rounded-[32px] blur-2xl" />
              <div className="relative glass-ultra-dark rounded-[32px] p-7 md:p-8 border border-white/10">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Email</p>
                      <p className="text-sm text-white/50">hola@petwellly.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Partnerships</p>
                      <p className="text-sm text-white/50">
                        Abiertos a colaboraciones con veterinarios, asociaciones y escuelas caninas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shrink-0">
                      <Target size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Roadmap abierto</p>
                      <p className="text-sm text-white/50">
                        Estamos trabajando en pasarelas de pago, app móvil e integraciones con
                        registros caninos oficiales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
