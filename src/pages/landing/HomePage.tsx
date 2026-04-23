import { Link } from 'react-router-dom';
import { useSpotlight } from '@/hooks/useSpotlight';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  PawPrint,
  HeartPulse,
  Users,
  Calendar,
  Globe,
  Eye,
  FileSpreadsheet,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Dog,
  Quote,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export function HomePage() {
  const spotlight1 = useSpotlight<HTMLDivElement>();
  const spotlight2 = useSpotlight<HTMLDivElement>();
  const spotlight3 = useSpotlight<HTMLDivElement>();

  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Petwellly | ERP para Criadores de Perros Profesionales"
        description="Gestiona perros, camadas, historial veterinario, clientes, reservas y tu página pública desde una sola plataforma diseñada para criadores profesionales."
        keywords="ERP criadero de perros, software criador perros, gestión criadero canino, registro camadas perros, historial veterinario perros, página pública criadero"
        canonical="/"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Petwellly',
          url: 'https://petwellly.com',
          logo: 'https://petwellly.com/og-default.svg',
          sameAs: [],
        }}
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Petwellly',
          url: 'https://petwellly.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://petwellly.com/blog?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* HERO */}
      <section className="relative min-h-screen aurora-bg flex items-center pt-28 pb-20 noise-overlay">
        {/* Decorative orbs */}
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-40 animate-pulse-glow" />
        <div className="orb orb-green w-[500px] h-[500px] top-1/3 right-0 animate-float-slow" />
        <div className="orb orb-terracotta w-[400px] h-[400px] bottom-0 left-1/3 animate-float-orbit" />

        {/* Decorative rings */}
        <div className="deco-ring deco-ring-amber w-96 h-96 top-20 right-20 deco-dashed animate-float-slow" />
        <div className="deco-ring w-64 h-64 bottom-40 left-10 animate-float-medium" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-aurora mb-8 reveal-animate">
                <Sparkles size={16} className="text-amber-600" />
                <span>ERP diseñado exclusivamente para criadores</span>
              </div>

              <h1 className="kinetic-headline font-display text-apple-black text-glow reveal-animate delay-100">
                Todo tu{' '}
                <span className="text-gradient-premium">criadero</span>
                <br />
                en un solo lugar.
              </h1>

              <p className="mt-8 text-lg md:text-xl text-apple-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed reveal-animate delay-200">
                Deja las hojas de cálculo y los papeles sueltos. Centraliza la gestión de tus
                perros, camadas, historial veterinario, clientes y reservas en una plataforma
                diseñada específicamente para criadores profesionales.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 reveal-animate delay-300">
                <Link
                  to="/register"
                  className="btn-shimmer px-8 py-4 rounded-xl text-base inline-flex items-center gap-2"
                >
                  Comenzar gratis
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/features"
                  className="px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 glass-ultra hover:bg-white/80 text-apple-black transition-all"
                >
                  Ver funcionalidades
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-apple-gray-100 reveal-animate delay-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-emerald-700" />
                  </div>
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck size={12} className="text-emerald-700" />
                  </div>
                  <span>14 días de prueba</span>
                </div>
              </div>
            </div>

            {/* Right: visual composition */}
            <div className="relative hidden lg:block reveal-scale delay-300">
              {/* Main dashboard card */}
              <div className="relative z-10 glass-ultra rounded-[32px] p-7 shadow-2xl animate-float-slow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-apple-blue to-emerald-700 flex items-center justify-center shadow-lg">
                      <Dog size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-apple-black text-sm">Mi Criadero</p>
                      <p className="text-xs text-apple-gray-100">Panel de control</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    Activo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Perros registrados', value: '24' },
                    { label: 'Camadas este año', value: '3' },
                    { label: 'Reservas pendientes', value: '5', highlight: true },
                    { label: 'Clientes', value: '18' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/60 rounded-2xl p-4 border border-white/60">
                      <p className="text-[11px] text-apple-gray-100 font-semibold uppercase tracking-wide mb-1">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.highlight ? 'text-amber-600' : 'text-apple-black'}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-xl border border-white/60">
                    <div className="flex items-center gap-3">
                      <PawPrint size={16} className="text-apple-blue" />
                      <span className="text-sm font-medium">Vacuna de Luna vence en 3 días</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-xl border border-white/60">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-apple-blue" />
                      <span className="text-sm font-medium">Nueva camada registrada</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Floating satellite cards */}
              <div className="absolute -top-8 -right-8 glass-ultra rounded-2xl p-4 shadow-xl animate-float-medium border border-white/70 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                    <Globe size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-apple-gray-100 font-semibold uppercase tracking-wide">Página pública</p>
                    <p className="font-bold text-sm">8 visitas hoy</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 glass-ultra rounded-2xl p-4 shadow-xl animate-float-slow border border-white/70 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-md">
                    <HeartPulse size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-apple-gray-100 font-semibold uppercase tracking-wide">Veterinario</p>
                    <p className="font-bold text-sm">Dr. García conectado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="relative section-xl bg-white noise-overlay">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="badge-aurora mb-5 inline-flex">El problema</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-4">
              La gestión de un criadero
              <br />
              no debería ser un <span className="text-gradient-premium">rompecabezas</span>
            </h2>
            <p className="mt-5 text-lg text-apple-gray-200">
              Hemos diseñado Petwellly para resolver los problemas que enfrentan los
              criadores día a día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div ref={spotlight1} className="group cursor-spotlight relative bg-apple-gray rounded-[28px] p-8 hover-lift glow-border overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <FileSpreadsheet className="text-apple-blue" size={26} />
                </div>
                <h3 className="font-display font-bold text-xl text-apple-black mb-3">Información dispersa</h3>
                <p className="text-apple-gray-200 leading-relaxed">Hojas de cálculo, mensajes y papeles que se pierden entre diferentes herramientas.</p>
              </div>
            </div>
            <div ref={spotlight2} className="group cursor-spotlight relative bg-apple-gray rounded-[28px] p-8 hover-lift glow-border overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <PawPrint className="text-apple-blue" size={26} />
                </div>
                <h3 className="font-display font-bold text-xl text-apple-black mb-3">Linajes olvidados</h3>
                <p className="text-apple-gray-200 leading-relaxed">Sin un registro centralizado, los datos genealógicos y de salud se degradan con el tiempo.</p>
              </div>
            </div>
            <div ref={spotlight3} className="group cursor-spotlight relative bg-apple-gray rounded-[28px] p-8 hover-lift glow-border overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <TrendingUp className="text-apple-blue" size={26} />
                </div>
                <h3 className="font-display font-bold text-xl text-apple-black mb-3">Falta de trazabilidad</h3>
                <p className="text-apple-gray-200 leading-relaxed">Es imposible saber quién reservó qué, cuándo se vendió un cachorro o su estado actual.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — BENTO GRID */}
      <section className="relative section-xl aurora-mid noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="badge-aurora mb-5 inline-flex">Características</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-4">
              Todo lo que necesitas,
              <br />
              <span className="text-gradient-premium">donde lo necesitas</span>
            </h2>
            <p className="mt-5 text-lg text-apple-gray-200">Cada módulo responde a una necesidad real de la cría profesional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* Large card 1 */}
            <div className="md:col-span-2 lg:col-span-2 bg-apple-black text-white rounded-[32px] p-9 lg:p-10 relative overflow-hidden group hover-lift cursor-default">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
              <div className="relative z-10 max-w-lg">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <PawPrint className="text-emerald-300" size={28} />
                </div>
                <h3 className="font-display font-bold text-3xl lg:text-4xl mb-4">Gestión completa de perros</h3>
                <p className="text-white/50 leading-relaxed mb-6 text-lg">
                  Registro con fotos, pedigree, microchip, árbol genealógico y estados de disponibilidad. Todo lo que necesitas para mantener el control de tu plantel.
                </p>
                <Link to="/features" className="inline-flex items-center gap-2 text-emerald-300 font-semibold hover:gap-3 transition-all">
                  Explorar funcionalidades <ArrowRight size={18} />
                </Link>
              </div>
              <div className="absolute bottom-6 right-6 hidden md:block">
                <div className="glass-ultra-dark rounded-2xl p-5 w-56 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <PawPrint size={18} className="text-emerald-300" />
                    </div>
                    <span className="font-semibold">Max</span>
                  </div>
                  <div className="space-y-2 text-xs text-white/40">
                    <div className="flex justify-between"><span>Raza</span><span className="text-white/70">Golden Retriever</span></div>
                    <div className="flex justify-between"><span>Pedigree</span><span className="text-white/70">#GR-2023-88</span></div>
                    <div className="flex justify-between"><span>Estado</span><span className="text-emerald-300">Disponible</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[28px] p-8 relative overflow-hidden group hover-lift shadow-sm border border-apple-gray-300/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="text-amber-700" size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-apple-black mb-2">Control de camadas</h3>
              <p className="text-apple-gray-200 text-sm leading-relaxed">Seguimiento de nacimientos, vinculación de progenitores y creación de fichas individuales.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[28px] p-8 relative overflow-hidden group hover-lift shadow-sm border border-apple-gray-300/30">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HeartPulse className="text-rose-700" size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-apple-black mb-2">Historial veterinario</h3>
              <p className="text-apple-gray-200 text-sm leading-relaxed">Vacunas, desparasitaciones, consultas y alertas automáticas para que no se te pase nada.</p>
            </div>

            {/* Large card 4 */}
            <div className="md:col-span-2 bg-gradient-to-br from-apple-blue to-emerald-800 text-white rounded-[32px] p-9 lg:p-10 relative overflow-hidden group hover-lift">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <Users className="text-amber-300" size={28} />
                  </div>
                  <h3 className="font-display font-bold text-3xl lg:text-4xl mb-4">Clientes y reservas</h3>
                  <p className="text-white/60 leading-relaxed text-lg">Base de clientes por criadero con estados de reserva y seguimiento de ventas. El sistema actualiza automáticamente la disponibilidad.</p>
                </div>
                <div className="glass-ultra-dark rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold">Reservas recientes</span>
                    <span className="text-xs text-white/40">+12% este mes</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Carlos M.', dog: 'Thor', status: 'Confirmada' },
                      { name: 'Ana L.', dog: 'Luna', status: 'Pendiente' },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{r.name[0]}</div>
                          <div>
                            <p className="font-semibold">{r.name}</p>
                            <p className="text-xs text-white/40">{r.dog}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${r.status === 'Confirmada' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-[28px] p-8 relative overflow-hidden group hover-lift shadow-sm border border-apple-gray-300/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-apple-blue via-amber-500 to-emerald-500" />
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-blue-700" size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-apple-black mb-2">Página pública</h3>
              <p className="text-apple-gray-200 text-sm leading-relaxed">Cada criadero tiene su propia URL para mostrar perros disponibles sin necesidad de programar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISIBILITY HIGHLIGHT */}
      <section className="relative section-xl aurora-dark text-white overflow-hidden noise-overlay-dark">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-900/40 rounded-full blur-[140px]" />
        <div className="orb orb-gold w-[500px] h-[500px] -top-20 -right-20 animate-pulse-glow" />
        <div className="orb orb-terracotta w-[400px] h-[400px] bottom-0 left-0 animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ultra-dark text-sm font-semibold mb-8 border border-white/10">
                <Eye size={16} className="text-amber-300" />
                Control total de visibilidad
              </div>
              <h2 className="kinetic-subhead font-display text-white">
                Tú decides
                <br />
                <span className="text-gradient-amber-premium text-glow-amber">qué se muestra</span>
                <br />
                y qué no.
              </h2>
              <p className="mt-6 text-lg text-white/50 leading-relaxed max-w-lg">
                Cada perro tiene su propio interruptor de visibilidad. Los que marques como públicos aparecerán automáticamente en la página de tu criadero. Los privados solo los verán tú, tu equipo y los veterinarios asignados.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Sin conocimientos técnicos ni programadores.',
                  'URL única para cada criadero.',
                  'Validación automática antes de publicar.',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="text-emerald-300" size={14} />
                    </div>
                    <span className="text-white/70">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 rounded-[32px] blur-2xl" />
              <div className="relative glass-ultra-dark rounded-[32px] p-7 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
                      <PawPrint size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold">Panel de visibilidad</p>
                      <p className="text-sm text-white/40">Criadero principal</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Max', breed: 'Golden Retriever', public: true },
                    { name: 'Thor', breed: 'Labrador', public: false },
                    { name: 'Bella', breed: 'Beagle', public: true },
                    { name: 'Rocky', breed: 'Pastor Alemán', public: false },
                  ].map((dog) => (
                    <div key={dog.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><PawPrint size={18} className="text-white/50" /></div>
                        <div>
                          <p className="font-semibold text-sm">{dog.name}</p>
                          <p className="text-xs text-white/40">{dog.breed}</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${dog.public ? 'bg-emerald-500' : 'bg-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${dog.public ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative section-xl bg-white overflow-hidden noise-overlay">
        <div className="absolute inset-0 pattern-kibble opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-center">
            {[
              { value: '6', label: 'Módulos integrados' },
              { value: '4', label: 'Roles de usuario' },
              { value: '99.5%', label: 'Uptime garantizado' },
              { value: '30 días', label: 'Retención de backups' },
            ].map((stat) => (
              <div key={stat.label} className="relative group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] font-bold text-transparent opacity-20 group-hover:opacity-30 transition-opacity" style={{ WebkitTextStroke: '1px rgba(74,93,82,0.15)' }}>
                  {stat.value.replace(/[^0-9]/g, '')}
                </div>
                <div className="relative z-10">
                  <p className="text-5xl lg:text-6xl font-display font-bold text-apple-black mb-2">{stat.value}</p>
                  <p className="text-apple-gray-200 font-semibold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-aurora mb-5 inline-flex">Cómo funciona</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-4">
              Empieza en <span className="text-gradient-premium">3 pasos</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Crea tu cuenta',
                desc: 'Regístrate gratis en menos de 2 minutos. No necesitas tarjeta de crédito para probar todas las funcionalidades.',
              },
              {
                step: '2',
                title: 'Configura tu criadero',
                desc: 'Añade tu información de contacto, registra tus perros y configura los catálogos de razas, estados y servicios.',
              },
              {
                step: '3',
                title: 'Publica y gestiona',
                desc: 'Activa tu página pública, registra camadas, controla el historial veterinario y gestiona reservas desde un solo lugar.',
              },
            ].map((s) => (
              <div key={s.step} className="relative bg-white rounded-[28px] p-8 shadow-sm border border-apple-gray-300/20 text-center hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-apple-blue to-emerald-700 text-white font-display font-bold text-xl flex items-center justify-center mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="font-display font-bold text-lg text-apple-black mb-2">{s.title}</h3>
                <p className="text-sm text-apple-gray-200 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-aurora mb-5 inline-flex">Testimonios</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-4">
              Lo que dicen los <span className="text-gradient-premium">criadores</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Carlos Mendoza',
                role: 'Criador de Golden Retrievers',
                quote: 'Antes tenía la información repartida entre 4 hojas de Excel y un grupo de WhatsApp. Ahora todo está centralizado y puedo ver el pedigree de cualquier perro en segundos.',
              },
              {
                name: 'Ana Lucero',
                role: 'Criadora de Beagles',
                quote: 'El control de camadas me ha cambiado la vida. Registrar una camada completa y crear las fichas individuales de cada cachorro antes me llevaba horas, ahora minutos.',
              },
              {
                name: 'Dr. Javier Ríos',
                role: 'Veterinario colaborador',
                quote: 'Como veterinario, poder acceder al historial médico completo de los perros de mis clientes criadores me permite dar un diagnóstico más preciso y rápido.',
              },
            ].map((t) => (
              <div key={t.name} className="bg-apple-gray rounded-[28px] p-8 glow-border relative hover:-translate-y-1 transition-transform">
                <Quote className="text-amber-400 mb-4" size={28} />
                <p className="text-apple-gray-200 leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-apple-black">{t.name}</p>
                  <p className="text-sm text-apple-gray-100">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ MINI */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="badge-aurora mb-4 inline-flex">FAQ</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-3">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: '¿Necesito conocimientos técnicos para usar Petwellly?',
                a: 'No. La plataforma está diseñada para ser intuitiva. Solo necesitas un navegador web y conexión a internet.',
              },
              {
                q: '¿Puedo migrar mis datos desde Excel?',
                a: 'Sí. Ofrecemos plantillas de importación en CSV para perros, clientes y camadas, y nuestro equipo puede ayudarte en la migración si contratas un plan Professional o Enterprise.',
              },
              {
                q: '¿Qué pasa con mis datos si cancelo la suscripción?',
                a: 'Tus datos te pertenecen. Puedes exportar toda tu información en cualquier momento. Conservamos los datos durante 30 días tras la cancelación por si decides volver.',
              },
              {
                q: '¿Pueden los veterinarios acceder a mis datos?',
                a: 'Solo si tú los invitas. Puedes asignar veterinarios a criaderos específicos y revocar su acceso cuando quieras.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-[24px] p-6 shadow-sm border border-apple-gray-300/20 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center shrink-0">
                    <HelpCircle className="text-apple-blue" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-apple-black mb-2">{faq.q}</h3>
                    <p className="text-sm text-apple-gray-200 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG HIGHLIGHT */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge-aurora mb-4 inline-flex">
                <BookOpen size={14} className="mr-1" />
                Blog
              </span>
              <h2 className="kinetic-subhead font-display text-apple-black mt-3">Artículos destacados</h2>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center gap-2 text-apple-blue font-semibold hover:gap-3 transition-all">
              Ver todos los artículos <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                slug: 'gestion-criaderos',
                title: 'Cómo gestionar un criadero de perros de forma profesional',
                excerpt: 'Descubre las mejores prácticas para organizar la información de tu criadero, desde el registro de perros hasta el seguimiento de camadas y clientes.',
                category: 'Gestión',
                color: 'bg-emerald-100 text-emerald-700',
              },
              {
                slug: 'historial-veterinario-perros',
                title: 'El historial veterinario como pilar de la cría responsable',
                excerpt: 'Por qué un registro médico completo y actualizado es fundamental para la salud de tus perros y la confianza de tus clientes.',
                category: 'Salud',
                color: 'bg-rose-100 text-rose-700',
              },
              {
                slug: 'camadas-registro-profesional',
                title: 'Registro profesional de camadas: qué datos importan',
                excerpt: 'Aprende a documentar cada parto de manera estructurada para mantener la trazabilidad genética y sanitaria de tus cachorros.',
                category: 'Reproducción',
                color: 'bg-amber-100 text-amber-700',
              },
            ].map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block bg-apple-gray rounded-[28px] p-7 hover:-translate-y-2 transition-all shadow-sm border border-apple-gray-300/20 hover:shadow-xl"
              >
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${post.color}`}>{post.category}</span>
                <h3 className="font-display font-bold text-lg text-apple-black mb-3 group-hover:text-apple-blue transition-colors">{post.title}</h3>
                <p className="text-sm text-apple-gray-200 leading-relaxed">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-xl aurora-bg overflow-hidden noise-overlay">
        <div className="orb orb-green w-[600px] h-[600px] bottom-0 left-0 animate-pulse-glow" />
        <div className="orb orb-terracotta w-[500px] h-[500px] top-0 right-0 animate-float-slow" />
        <div className="deco-ring deco-ring-amber w-80 h-80 bottom-20 left-20 animate-float-orbit" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-ultra rounded-[40px] p-10 lg:p-14">
            <h2 className="kinetic-subhead font-display text-apple-black">
              Empieza a organizar
              <br />
              tu criadero hoy
            </h2>
            <p className="mt-5 text-lg text-apple-gray-200 max-w-xl mx-auto">
              Crea tu cuenta en minutos y descubre cómo la centralización puede cambiar la forma en que gestionas tu operación.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-shimmer px-10 py-4 rounded-xl text-base inline-flex items-center gap-2">
                Crear cuenta gratuita
                <ArrowRight size={20} />
              </Link>
              <Link to="/pricing" className="px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 bg-white hover:bg-apple-gray border border-apple-gray-300 text-apple-black transition-all">
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
