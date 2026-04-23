import { Link } from 'react-router-dom';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  PawPrint,
  HeartPulse,
  Users,
  Calendar,
  Globe,
  BarChart3,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Eye,
  Lock,
  ClipboardList,
  Zap,
  Smartphone,
  CreditCard,
  Award,
} from 'lucide-react';

const modules = [
  {
    icon: PawPrint,
    color: 'from-emerald-500 to-emerald-700',
    lightColor: 'bg-emerald-100 text-emerald-700',
    title: 'Gestión de perros',
    items: [
      'Registro completo: nombre, raza, sexo, fecha de nacimiento, color y microchip.',
      'Almacenamiento de hasta 10 fotos por perro.',
      'Vinculación de padre y madre para árbol genealógico.',
      'Estados: Disponible, Reservado, Vendido, Reproductivo, Retirado.',
      'Notas internas visibles solo para el criador y manager.',
    ],
  },
  {
    icon: Calendar,
    color: 'from-amber-500 to-orange-600',
    lightColor: 'bg-amber-100 text-amber-700',
    title: 'Control de camadas',
    items: [
      'Registro de fecha de nacimiento, madre y padre.',
      'Control de cachorros vivos y fallecidos.',
      'Creación automática de fichas individuales a partir de la camada.',
      'Notas y seguimiento de cada parto.',
    ],
  },
  {
    icon: HeartPulse,
    color: 'from-rose-500 to-rose-700',
    lightColor: 'bg-rose-100 text-rose-700',
    title: 'Historial veterinario',
    items: [
      'Registro de vacunas con lote, laboratorio y próxima dosis.',
      'Desparasitaciones con producto, peso y fecha siguiente.',
      'Consultas generales con motivo, diagnóstico y tratamiento.',
      'Adjunto de PDFs e imágenes de pruebas.',
      'Alertas automáticas 30 días antes del vencimiento.',
    ],
  },
  {
    icon: Users,
    color: 'from-blue-500 to-indigo-700',
    lightColor: 'bg-blue-100 text-blue-700',
    title: 'Clientes y reservas',
    items: [
      'Base de clientes por criadero con datos de contacto completos.',
      'Seguimiento de reservas: Pendiente, Confirmada, Completada, Cancelada.',
      'Cambio automático de estado del perro al confirmar o completar.',
      'Historial de compras vinculado al perfil del cliente.',
      'Notificaciones por email en cada cambio de estado.',
    ],
  },
  {
    icon: Globe,
    color: 'from-cyan-500 to-teal-700',
    lightColor: 'bg-cyan-100 text-cyan-700',
    title: 'Página pública del criadero',
    items: [
      'URL única para cada criadero sin necesidad de login.',
      'Galería de perros marcados como públicos.',
      'Información de contacto configurable.',
      'Botón de solicitud de reserva para clientes registrados.',
      'Personalización de elementos visibles desde el panel.',
    ],
  },
  {
    icon: BarChart3,
    color: 'from-purple-500 to-violet-700',
    lightColor: 'bg-purple-100 text-purple-700',
    title: 'Reportes y estadísticas',
    items: [
      'Resumen mensual de perros registrados, vendidos y disponibles.',
      'Listado de ventas por rango de fechas.',
      'Próximas vacunaciones y desparasitaciones pendientes.',
      'Métricas globales para el rol Manager.',
    ],
  },
];

export function FeaturesPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Funcionalidades | Petwellly"
        description="Descubre todos los módulos de Petwellly: gestión de perros, camadas, historial veterinario, clientes, reservas, página pública y reportes."
        keywords="funcionalidades Petwellly, gestión perros, control camadas, historial veterinario, página pública criadero"
        canonical="/features"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Petwellly',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '19',
            priceCurrency: 'USD',
          },
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 aurora-bg noise-overlay overflow-hidden">
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-40 animate-pulse-glow" />
        <div className="orb orb-green w-[500px] h-[500px] top-1/3 right-0 animate-float-slow" />
        <div className="deco-ring deco-ring-amber w-96 h-96 top-20 right-20 deco-dashed animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-aurora mb-5 inline-flex">Características</span>
          <h1 className="kinetic-headline font-display text-apple-black text-glow">
            Todo lo que tu
            <br />
            <span className="text-gradient-premium">criadero necesita</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-apple-gray-200 max-w-2xl mx-auto leading-relaxed">
            Petwellly reúne en una sola plataforma las herramientas esenciales para
            gestionar perros, camadas, salud, clientes y visibilidad pública.
          </p>
        </div>
      </section>

      {/* Modules grid */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map((m) => (
              <div
                key={m.title}
                className="group relative bg-apple-gray rounded-[28px] p-8 overflow-hidden glow-border transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-apple-blue/5 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl ${m.lightColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <m.icon size={28} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-apple-black mb-4">
                    {m.title}
                  </h3>
                  <ul className="space-y-3">
                    {m.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-apple-gray-200">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0 mt-0.5`}>
                          <ShieldCheck className="text-white" size={12} />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visibility deep dive */}
      <section className="relative section-xl aurora-dark text-white overflow-hidden noise-overlay-dark">
        <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="orb orb-gold w-[500px] h-[500px] -top-20 -right-20 animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-ultra-dark rounded-[32px] p-7 md:p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                      <Eye className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="font-semibold">Visibilidad del perro</p>
                      <p className="text-sm text-white/50">Control público / privado</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                    Activo
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Luna', breed: 'Golden Retriever', public: true },
                    { name: 'Thor', breed: 'Labrador', public: false },
                    { name: 'Bella', breed: 'Beagle', public: true },
                  ].map((dog) => (
                    <div
                      key={dog.name}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PawPrint size={18} className="text-white/40" />
                        <div>
                          <p className="text-sm font-medium">{dog.name}</p>
                          <p className="text-xs text-white/40">{dog.breed}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          dog.public
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-white/5 text-white/50 border-white/10'
                        }`}
                      >
                        {dog.public ? 'Público' : 'Privado'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ultra-dark text-sm font-semibold mb-6 border border-white/10">
                <Zap size={16} className="text-amber-300" />
                Diferenciador clave
              </div>
              <h2 className="kinetic-subhead font-display text-white">
                Publica solo
                <br />
                <span className="text-gradient-amber-premium text-glow-amber">lo que quieras mostrar</span>
              </h2>
              <p className="text-white/60 leading-relaxed mt-5 mb-6 max-w-md">
                El control de visibilidad es uno de los pilares de Petwellly. Cada perro
                tiene su propio atributo de visibilidad independiente. Cuando marcas un perro
                como público, el sistema verifica automáticamente que tenga al menos una foto y
                una raza definida antes de publicarlo.
              </p>
              <ul className="space-y-3 max-w-md">
                {[
                  'Toggle rápido desde el listado general.',
                  'Cambio en tiempo real sin redespliegue.',
                  'Validación automática de contenido mínimo.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white/70">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="text-amber-300" size={12} />
                    </div>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="badge-aurora mb-4 inline-flex">Roles</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-3">
              Diseñados para cada persona del equipo
            </h2>
            <p className="mt-4 text-lg text-apple-gray-200">
              Permisos claros y separación de datos entre criaderos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShieldCheck,
                light: 'bg-emerald-100 text-emerald-700',
                title: 'Manager',
                desc: 'Acceso global. Crea criaderos, usuarios, configura catálogos y ve reportes consolidados.',
              },
              {
                icon: PawPrint,
                light: 'bg-amber-100 text-amber-700',
                title: 'Criador',
                desc: 'Gestiona su criadero: perros, camadas, clientes, reservas y página pública.',
              },
              {
                icon: Stethoscope,
                light: 'bg-rose-100 text-rose-700',
                title: 'Veterinario',
                desc: 'Registra y consulta historial médico de los perros de los criaderos asignados.',
              },
              {
                icon: Users,
                light: 'bg-blue-100 text-blue-700',
                title: 'Cliente',
                desc: 'Navega páginas públicas, envía solicitudes de reserva y consulta su historial.',
              },
            ].map((r) => (
              <div
                key={r.title}
                className="group bg-white rounded-[28px] p-7 text-center shadow-sm border border-apple-gray-300/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl ${r.light} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <r.icon size={26} />
                </div>
                <h3 className="font-display font-bold text-lg text-apple-black mb-2">
                  {r.title}
                </h3>
                <p className="text-sm text-apple-gray-200 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="relative section-xl aurora-dark text-white overflow-hidden noise-overlay-dark">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/30 rounded-full blur-[120px]" />
        <div className="orb orb-green w-[500px] h-[500px] bottom-0 left-0 animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ultra-dark text-sm font-semibold mb-6 border border-white/10">
                <Lock size={16} className="text-emerald-300" />
                Seguridad de nivel empresarial
              </div>
              <h2 className="kinetic-subhead font-display text-white">
                Tus datos,
                <br />
                <span className="text-gradient-amber-premium text-glow-amber">siempre protegidos</span>
              </h2>
              <p className="text-white/60 leading-relaxed mt-5 mb-6 max-w-lg">
                Cada criadero funciona como un tenant independiente. Un criador no puede acceder
                a los datos de otro criadero. Las contraseñas se almacenan con bcrypt, las
                comunicaciones usan HTTPS/TLS y las operaciones críticas quedan auditadas.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ultra-dark text-sm border border-white/10">
                  <Lock size={14} />
                  bcrypt 12+
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ultra-dark text-sm border border-white/10">
                  <ShieldCheck size={14} />
                  Multi-tenancy
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ultra-dark text-sm border border-white/10">
                  <ClipboardList size={14} />
                  Auditoría
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-amber-500/10 rounded-[32px] blur-2xl" />
              <div className="relative glass-ultra-dark rounded-[32px] p-7 md:p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                    <Lock className="text-white" size={26} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Aislamiento de datos</p>
                    <p className="text-sm text-white/50">kennel_id en cada registro relevante</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Autenticación', value: 'JWT + expiración' },
                    { label: 'Rate limiting', value: '5 intentos / minuto' },
                    { label: 'Backups', value: 'Diarios, 30 días' },
                    { label: 'Uptime objetivo', value: '99.5 % mensual' },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                    >
                      <span className="text-white/60">{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-aurora mb-5 inline-flex">Casos de uso</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-4">
              Un ERP para cada tipo de <span className="text-gradient-premium">criadero</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Criador hobby',
                desc: 'Gestiona tu único criadero con facilidad. Controla camadas, vacunas y reservas sin complicaciones ni costos elevados.',
                features: ['Hasta 25 perros', 'Página pública básica', 'Historial veterinario'],
              },
              {
                title: 'Criadero comercial',
                desc: 'Escala tu operación con múltiples criaderos, reportes avanzados y dominio personalizado para tu marca.',
                features: ['Criaderos ilimitados', 'Reportes avanzados', 'Soporte prioritario'],
              },
              {
                title: 'Asociación o grupo',
                desc: 'Coordina veterinarios, criadores y clientes en una sola plataforma con roles diferenciados y auditoría completa.',
                features: ['Roles de equipo', 'Auditoría', 'API de integración'],
              },
            ].map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-[28px] p-8 shadow-sm border border-apple-gray-300/20 hover:-translate-y-2 transition-transform">
                <h3 className="font-display font-bold text-xl text-apple-black mb-3">{useCase.title}</h3>
                <p className="text-apple-gray-200 leading-relaxed mb-6 text-sm">{useCase.desc}</p>
                <ul className="space-y-2">
                  {useCase.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-apple-gray-100">
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS / ROADMAP */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-aurora mb-5 inline-flex">Roadmap</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-4">
              Integraciones y novedades <span className="text-gradient-premium">próximas</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                title: 'App móvil',
                desc: 'Gestiona tu criadero desde el móvil con notificaciones push de vacunas, celos y reservas.',
                status: 'En desarrollo',
              },
              {
                icon: CreditCard,
                title: 'Pasarelas de pago',
                desc: 'Permite a tus clientes pagar reservas y compras directamente desde la página pública de tu criadero.',
                status: 'Próximamente',
              },
              {
                icon: Award,
                title: 'Registros oficiales',
                desc: 'Integración con registros caninos oficiales para validar pedigrees y agilizar trámites.',
                status: 'Planeado',
              },
            ].map((item) => (
              <div key={item.title} className="bg-apple-gray rounded-[28px] p-8 glow-border hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5">
                  <item.icon className="text-apple-blue" size={26} />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-3">{item.status}</span>
                <h3 className="font-display font-bold text-lg text-apple-black mb-2">{item.title}</h3>
                <p className="text-sm text-apple-gray-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-xl aurora-bg overflow-hidden noise-overlay">
        <div className="orb orb-gold w-[500px] h-[500px] -bottom-40 -left-40 animate-pulse-glow" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-ultra rounded-[40px] p-10 lg:p-14">
            <h2 className="kinetic-subhead font-display text-apple-black">
              ¿Listo para probarlo?
            </h2>
            <p className="mt-4 text-lg text-apple-gray-200">
              Explora todas las funcionalidades con una cuenta gratuita. Sin tarjeta de crédito.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn-shimmer px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2"
              >
                Crear cuenta gratis
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/pricing"
                className="px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 bg-white hover:bg-apple-gray border border-apple-gray-300 text-apple-black transition-all"
              >
                Ver planes y precios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
