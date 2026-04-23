import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSection } from "@/components/landing/LandingSection";
import {
  ArrowRight, CheckCircle2, XCircle, BarChart3, ShieldCheck, Users,
  Calendar, FileSpreadsheet, Globe, HeartPulse, Zap,
} from "lucide-react";

export function SoftwareGestionPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Software de gestión para criaderos de perros"
        description="Descubre el software de gestión diseñado exclusivamente para criaderos de perros. Olvida Excel y centraliza perros, camadas, clientes y reservas en una sola plataforma profesional."
        canonical="/software-gestion-criaderos-perros"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Software de gestión para criaderos de perros",
        }}
      />
      <LandingHero
        badge="ERP para criadores profesionales"
        title="Software de gestión para"
        highlightedText="criaderos de perros"
        description="Deja atrás las hojas de cálculo y los papeles sueltos. Centraliza la administración de tu criadero canino en una plataforma moderna, segura y diseñada específicamente para el sector."
        ctaPrimary={{ text: "Probar gratis 14 días", to: "/register" }}
        ctaSecondary={{ text: "Ver funcionalidades", to: "/features" }}
        centered
      />

      <LandingSection variant="mid">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="kinetic-subhead text-apple-black mb-6">
              Por qué dejar <span className="text-gradient-premium">Excel</span> atrás
            </h2>
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-8">
              Durante años, muchos criadores han gestionado sus perros, camadas y clientes con hojas de cálculo. Pero a medida que el negocio crece, Excel se convierte en un freno: errores humanos, versiones desactualizadas, pérdida de información y imposibilidad de compartir datos en tiempo real.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60">
                <XCircle className="text-rose-500 shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="font-semibold text-apple-black">Errores de copia y pegado</p>
                  <p className="text-apple-gray-200 text-sm">Una celda mal escrita puede confundir pedigríes, fechas de nacimiento o estados de salud.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60">
                <XCircle className="text-rose-500 shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="font-semibold text-apple-black">Sin acceso simultáneo</p>
                  <p className="text-apple-gray-200 text-sm">Si varias personas trabajan en el criadero, compartir archivos por email es lento e inseguro.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60">
                <XCircle className="text-rose-500 shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="font-semibold text-apple-black">Sin alertas ni recordatorios</p>
                  <p className="text-apple-gray-200 text-sm">Excel no avisa cuando toca una vacuna, una reserva pendiente o una camada próxima a nacer.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200/30 via-amber-200/20 to-rose-200/30 rounded-[40px] blur-2xl" />
            <div className="relative glass-ultra rounded-[32px] p-8 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-black/5">
                <CheckCircle2 className="text-emerald-600" size={24} />
                <span className="font-semibold text-apple-black">Datos centralizados en la nube</span>
              </div>
              <div className="flex items-center gap-3 pb-4 border-b border-black/5">
                <CheckCircle2 className="text-emerald-600" size={24} />
                <span className="font-semibold text-apple-black">Acceso multiusuario en tiempo real</span>
              </div>
              <div className="flex items-center gap-3 pb-4 border-b border-black/5">
                <CheckCircle2 className="text-emerald-600" size={24} />
                <span className="font-semibold text-apple-black">Alertas automáticas de sanidad y reservas</span>
              </div>
              <div className="flex items-center gap-3 pb-4 border-b border-black/5">
                <CheckCircle2 className="text-emerald-600" size={24} />
                <span className="font-semibold text-apple-black">Historial inmutable y trazable</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600" size={24} />
                <span className="font-semibold text-apple-black">Página web pública integrada</span>
              </div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="light">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-apple-black mb-4">
            Beneficios de un <span className="text-gradient-premium">ERP canino</span>
          </h2>
          <p className="text-apple-gray-200 text-lg">
            Un software de gestión para criaderos de perros no es solo un reemplazo de Excel. Es una transformación digital que afecta a todos los departamentos de tu operación.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-ultra rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
              <BarChart3 className="text-emerald-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">Decisiones basadas en datos</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">Genera reportes de ventas, camadas nacidas, razas más demandadas y evolución de tu negocio mes a mes.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <ShieldCheck className="text-amber-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">Cumplimiento normativo</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">Mantén la documentación sanitaria, pedigríes y contratos siempre disponibles para inspecciones y trámites legales.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
              <Users className="text-rose-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">Mejor experiencia de cliente</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">Responde en segundos sobre disponibilidad, historial veterinario o estado de una reserva con toda la información centralizada.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Zap className="text-blue-700" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">Ahorro de tiempo</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">Automatiza tareas repetitivas como recordatorios de vacunas, cambios de estado de reservas y generación de documentos.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="dark">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="orb orb-gold w-[400px] h-[400px] -top-20 -left-20 animate-pulse-glow" />
              <div className="orb orb-green w-[300px] h-[300px] bottom-0 right-0 animate-float-slow" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="glass-ultra-dark rounded-[28px] p-6 text-white">
                  <Calendar className="text-amber-400 mb-4" size={28} />
                  <p className="font-semibold">Calendario de camadas</p>
                </div>
                <div className="glass-ultra-dark rounded-[28px] p-6 text-white mt-8">
                  <HeartPulse className="text-emerald-400 mb-4" size={28} />
                  <p className="font-semibold">Cartilla sanitaria digital</p>
                </div>
                <div className="glass-ultra-dark rounded-[28px] p-6 text-white">
                  <Globe className="text-cyan-400 mb-4" size={28} />
                  <p className="font-semibold">Página pública propia</p>
                </div>
                <div className="glass-ultra-dark rounded-[28px] p-6 text-white mt-8">
                  <FileSpreadsheet className="text-rose-400 mb-4" size={28} />
                  <p className="font-semibold">Exportación de informes</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="kinetic-subhead text-white mb-6">
              Características <span className="text-gradient-amber-premium">clave</span> de Petwellly
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">Nuestro software de gestión para criaderos de perros incluye todos los módulos que necesitas para operar de forma profesional, desde el primer cachorro hasta la venta final.</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-emerald-400" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Registro completo de perros</p>
                  <p className="text-white/60 text-sm">Datos identificativos, fotos, pedigríe, estado reproductivo y vinculación con padres y camadas.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-amber-400" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Control de camadas profesional</p>
                  <p className="text-white/60 text-sm">Seguimiento de partos, cachorros vivos, fallecidos y creación automática de fichas individuales.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-rose-400" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Historial veterinario trazable</p>
                  <p className="text-white/60 text-sm">Vacunas, desparasitaciones, consultas y documentos adjuntos con alertas de vencimiento.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-cyan-400" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Gestión de clientes y reservas</p>
                  <p className="text-white/60 text-sm">Base de datos de compradores, seguimiento de reservas y comunicación automatizada por email.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Página web pública del criadero</p>
                  <p className="text-white/60 text-sm">Muestra tus perros disponibles, información de contacto y recibe solicitudes de reserva online.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="mid">
        <div className="relative overflow-hidden rounded-[40px] bg-apple-black px-8 py-16 lg:px-16 lg:py-24 text-center">
          <div className="orb orb-gold w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
          <div className="orb orb-green w-[400px] h-[400px] -bottom-20 -left-20 animate-float-slow" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="kinetic-subhead text-white mb-6">
              Empieza a gestionar tu criadero como un <span className="text-gradient-amber-premium">profesional</span>
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Únete a cientos de criadores que ya han digitalizado su operación con Petwellly. Prueba gratis durante 14 días, sin tarjeta de crédito.
            </p>
            <Link
              to="/register"
              className="btn-shimmer px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3"
            >
              Crear cuenta gratuita
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
