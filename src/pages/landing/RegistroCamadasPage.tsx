import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSection } from "@/components/landing/LandingSection";
import {
  ArrowRight, CheckCircle2, Calendar, Users, FileText, TrendingUp,
  HeartPulse, Dog, ClipboardList, Euro,
} from "lucide-react";

export function RegistroCamadasPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Registro de camadas de perros: guía profesional"
        description="Aprende a registrar camadas de perros como un profesional. Descubre qué datos son esenciales, qué documentación necesitas y cómo gestionar la venta desde el nacimiento con Petwellly."
        canonical="/registro-camadas-perros"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Registro de camadas de perros: guía profesional",
        }}
      />
      <LandingHero
        badge="Guía para criadores profesionales"
        title="Registro de camadas de perros:"
        highlightedText="guía profesional"
        description="El registro correcto de cada camada es la base de un criadero serio. Te explicamos qué datos recopilar, qué documentación guardar y cómo Petwellly automatiza todo el proceso desde el nacimiento hasta la venta."
        ctaPrimary={{ text: "Gestionar mis camadas", to: "/register" }}
        ctaSecondary={{ text: "Ver funcionalidades", to: "/features" }}
        centered
      />

      <LandingSection variant="mid">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-10">
            Datos esenciales de cada <span className="text-gradient-premium">camada</span>
          </h2>
          <div className="glass-ultra rounded-[32px] p-8 lg:p-12">
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-8">Un registro completo de camadas no solo organiza tu trabajo: es una herramienta de trazabilidad, marketing y cumplimiento normativo. Estos son los datos que todo criador profesional debe documentar:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0"><Calendar className="text-emerald-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Fecha y hora del parto</h3><p className="text-apple-gray-200 text-sm">Registra el día y la hora exactos del nacimiento para cálculos de edad y programación de vacunas.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><Dog className="text-amber-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Madre y padre vinculados</h3><p className="text-apple-gray-200 text-sm">Conecta la camada con los perros reproductores para generar automáticamente el pedigree de cada cachorro.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><Users className="text-rose-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Número de cachorros</h3><p className="text-apple-gray-200 text-sm">Total de cachorros nacidos, vivos y, si aplica, fallecidos. Diferenciación por sexo y color cuando es posible.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><HeartPulse className="text-blue-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Estado de salud inicial</h3><p className="text-apple-gray-200 text-sm">Observaciones del parto, complicaciones, peso al nacer y primeras revisiones veterinarias.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0"><ClipboardList className="text-purple-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Notas del parto</h3><p className="text-apple-gray-200 text-sm">Cualquier detalle relevante para futuras camadas: duración, asistencia veterinaria, comportamiento de la madre, etc.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0"><TrendingUp className="text-cyan-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Evolución y pesajes</h3><p className="text-apple-gray-200 text-sm">Seguimiento del crecimiento de los cachorros con pesos semanales y observaciones de desarrollo.</p></div></div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="light">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-10">Documentación <span className="text-gradient-premium">necesaria</span></h2>
          <div className="glass-ultra rounded-[32px] p-8 lg:p-12">
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-8">La buena documentación protege al criador, al comprador y, sobre todo, al perro. Mantener los papeles en orden es señal de profesionalidad y cumplimiento legal. En Petwellly puedes adjuntar todos estos documentos a la ficha de cada camada:</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/60"><CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={22} /><div><p className="font-semibold text-apple-black">Certificado de nacimiento o registro de camada</p><p className="text-apple-gray-200 text-sm">Documento emitido por el club canino o entidad reguladora que acredita el nacimiento de la camada.</p></div></li>
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/60"><CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={22} /><div><p className="font-semibold text-apple-black">Pedigree de los progenitores</p><p className="text-apple-gray-200 text-sm">Copias del pedigree de madre y padre para acreditar la pureza racial y la línea de sangre.</p></div></li>
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/60"><CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={22} /><div><p className="font-semibold text-apple-black">Informes veterinarios del parto</p><p className="text-apple-gray-200 text-sm">Revisiones postparto, certificados de salud de la madre y primeras vacunaciones de los cachorros.</p></div></li>
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/60"><CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={22} /><div><p className="font-semibold text-apple-black">Contratos de reserva y venta</p><p className="text-apple-gray-200 text-sm">Documentos legales que regulan la relación comercial con los compradores, garantías incluidas.</p></div></li>
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/60"><CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={22} /><div><p className="font-semibold text-apple-black">Fotografías de la camada</p><p className="text-apple-gray-200 text-sm">Imágenes de calidad para la página pública del criadero, redes sociales y comunicación con clientes.</p></div></li>
            </ul>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="dark">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-white mb-4">Gestión comercial desde el <span className="text-gradient-amber-premium">nacimiento</span></h2>
          <p className="text-white/70 text-lg">Una camada bien registrada no solo organiza tu criadero: también acelera las ventas y mejora la experiencia del comprador.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-5"><FileText className="text-emerald-400" size={28} /></div>
            <h3 className="text-xl font-semibold text-white mb-3">Fichas automáticas de cachorros</h3>
            <p className="text-white/70 leading-relaxed">Al registrar una camada, Petwellly genera automáticamente una ficha individual para cada cachorro, lista para completar con fotos, estado y precio.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-5"><Euro className="text-amber-400" size={28} /></div>
            <h3 className="text-xl font-semibold text-white mb-3">Reservas desde el primer día</h3>
            <p className="text-white/70 leading-relaxed">Publica la camada en tu página web del criadero y empieza a recibir solicitudes de reserva incluso antes de que los cachorros estén disponibles.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-5"><TrendingUp className="text-rose-400" size={28} /></div>
            <h3 className="text-xl font-semibold text-white mb-3">Análisis de rentabilidad</h3>
            <p className="text-white/70 leading-relaxed">Calcula los costes de cada camada y compáralos con los ingresos por ventas para entender la rentabilidad real de tu actividad.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="mid">
        <div className="relative overflow-hidden rounded-[40px] bg-apple-black px-8 py-16 lg:px-16 lg:py-24 text-center">
          <div className="orb orb-gold w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
          <div className="orb orb-green w-[400px] h-[400px] -bottom-20 -left-20 animate-float-slow" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="kinetic-subhead text-white mb-6">Registra tus camadas como un <span className="text-gradient-amber-premium">profesional</span></h2>
            <p className="text-white/70 text-lg mb-10">Empieza a usar Petwellly y descubre cómo automatizar el registro de camadas, la generación de fichas y la gestión comercial de tus cachorros.</p>
            <Link to="/register" className="btn-shimmer px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3">Probar gratis 14 días<ArrowRight size={22} /></Link>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
