import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSection } from "@/components/landing/LandingSection";
import { ArrowRight, CheckCircle2, BarChart3, ShieldCheck, Users, Zap, Minus } from "lucide-react";

export function MejorErpPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="El mejor ERP para criadores caninos"
        description="Descubre por qué Petwellly es el mejor ERP para criadores caninos. Comparativa con Excel, funcionalidades exclusivas y testimonios de criadores profesionales."
        canonical="/mejor-erp-criadores-caninos"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "El mejor ERP para criadores caninos",
        }}
      />
      <LandingHero
        badge="ERP líder para criadores de perros"
        title="El mejor ERP para"
        highlightedText="criadores caninos"
        description="Petwellly no es solo software: es la herramienta que transforma la gestión de tu criadero. Descubre por qué cientos de profesionales nos eligen cada día."
        ctaPrimary={{ text: "Probar gratis 14 días", to: "/register" }}
        ctaSecondary={{ text: "Ver funcionalidades", to: "/features" }}
        centered
      />

      <LandingSection variant="mid">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-10">
            Qué debe tener un ERP para <span className="text-gradient-premium">criadores</span>
          </h2>
          <div className="glass-ultra rounded-[32px] p-8 lg:p-12">
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-8">No todo software de gestión sirve para un criadero de perros. Un ERP verdaderamente útil debe entender las particularidades del sector: camadas, pedigríes, sanidad, reservas y normativa. Estas son las funcionalidades imprescindibles:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 className="text-emerald-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Registro de perros y camadas</h3><p className="text-apple-gray-200 text-sm">Ficha completa por animal con fotos, pedigree, estado de salud y vinculación con padres.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><CheckCircle2 className="text-amber-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Control sanitario digital</h3><p className="text-apple-gray-200 text-sm">Cartilla de vacunas, desparasitaciones, pruebas genéticas y alertas automáticas.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><CheckCircle2 className="text-rose-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Gestión de clientes y reservas</h3><p className="text-apple-gray-200 text-sm">Base de datos de compradores, seguimiento de reservas y comunicación automatizada.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><CheckCircle2 className="text-blue-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Página web pública integrada</h3><p className="text-apple-gray-200 text-sm">Vitrina online sincronizada con el ERP para mostrar perros disponibles y recibir solicitudes.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0"><CheckCircle2 className="text-purple-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Reportes y analíticas</h3><p className="text-apple-gray-200 text-sm">Métricas de ventas, camadas, rentabilidad y evolución del negocio en el tiempo.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0"><CheckCircle2 className="text-cyan-700" size={20} /></div><div><h3 className="font-semibold text-apple-black">Acceso multiusuario seguro</h3><p className="text-apple-gray-200 text-sm">Roles diferenciados para criadores, veterinarios y administradores con permisos controlados.</p></div></div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="light">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="kinetic-subhead text-apple-black mb-4">Comparativa: <span className="text-gradient-premium">Petwellly</span> vs Excel</h2>
          <p className="text-apple-gray-200 text-lg">¿Sigues usando hojas de cálculo? Esta comparativa te mostrará por qué un ERP especializado marca la diferencia.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="glass-ultra rounded-[32px] p-6 lg:p-10 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-apple-gray-300/30">
                  <th className="text-left py-4 font-display font-bold text-apple-black">Característica</th>
                  <th className="text-center py-4 font-display font-bold text-apple-black">Excel / Hojas de cálculo</th>
                  <th className="text-center py-4 font-display font-bold text-apple-black">Petwellly ERP</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-apple-gray-300/20"><td className="py-4 text-apple-gray-200 font-medium">Registro de perros</td><td className="py-4 text-center"><Minus size={18} className="mx-auto text-apple-gray-300" /></td><td className="py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-600" /></td></tr>
                <tr className="border-b border-apple-gray-300/20"><td className="py-4 text-apple-gray-200 font-medium">Pedigree y árbol genealógico</td><td className="py-4 text-center"><Minus size={18} className="mx-auto text-apple-gray-300" /></td><td className="py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-600" /></td></tr>
                <tr className="border-b border-apple-gray-300/20"><td className="py-4 text-apple-gray-200 font-medium">Alertas sanitarias automáticas</td><td className="py-4 text-center"><Minus size={18} className="mx-auto text-apple-gray-300" /></td><td className="py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-600" /></td></tr>
                <tr className="border-b border-apple-gray-300/20"><td className="py-4 text-apple-gray-200 font-medium">Gestión de reservas</td><td className="py-4 text-center"><Minus size={18} className="mx-auto text-apple-gray-300" /></td><td className="py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-600" /></td></tr>
                <tr className="border-b border-apple-gray-300/20"><td className="py-4 text-apple-gray-200 font-medium">Página web del criadero</td><td className="py-4 text-center"><Minus size={18} className="mx-auto text-apple-gray-300" /></td><td className="py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-600" /></td></tr>
                <tr className="border-b border-apple-gray-300/20"><td className="py-4 text-apple-gray-200 font-medium">Acceso multiusuario en tiempo real</td><td className="py-4 text-center"><Minus size={18} className="mx-auto text-apple-gray-300" /></td><td className="py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-600" /></td></tr>
                <tr><td className="py-4 text-apple-gray-200 font-medium">Soporte especializado canino</td><td className="py-4 text-center"><Minus size={18} className="mx-auto text-apple-gray-300" /></td><td className="py-4 text-center"><CheckCircle2 size={18} className="mx-auto text-emerald-600" /></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="dark">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-white mb-4">Por qué <span className="text-gradient-amber-premium">elegirnos</span></h2>
          <p className="text-white/70 text-lg">Petwellly no es un software genérico adaptado: ha sido diseñado desde cero pensando en las necesidades reales de los criadores profesionales.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-ultra-dark rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4"><BarChart3 className="text-emerald-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Crecimiento real</h3>
            <p className="text-white/70 text-sm leading-relaxed">Nuestros clientes reportan un ahorro medio de 10 horas semanales y una reducción de errores administrativos del 80%.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4"><ShieldCheck className="text-amber-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Seguridad de datos</h3>
            <p className="text-white/70 text-sm leading-relaxed">Encriptación HTTPS, backups automáticos y separación estricta de datos entre criaderos.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4"><Users className="text-rose-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Comunidad de criadores</h3>
            <p className="text-white/70 text-sm leading-relaxed">Formamos una comunidad activa de profesionales que comparten conocimientos y mejores prácticas.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-6 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4"><Zap className="text-cyan-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-2">Mejoras constantes</h3>
            <p className="text-white/70 text-sm leading-relaxed">Escuchamos a nuestros usuarios y lanzamos actualizaciones mensuales con nuevas funcionalidades.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="mid">
        <div className="relative overflow-hidden rounded-[40px] bg-apple-black px-8 py-16 lg:px-16 lg:py-24 text-center">
          <div className="orb orb-gold w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
          <div className="orb orb-green w-[400px] h-[400px] -bottom-20 -left-20 animate-float-slow" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="kinetic-subhead text-white mb-6">Elige el mejor ERP para tu <span className="text-gradient-amber-premium">criadero</span></h2>
            <p className="text-white/70 text-lg mb-10">Únete a la comunidad de criadores profesionales que ya han digitalizado su operación con Petwellly. Empieza gratis durante 14 días.</p>
            <Link to="/register" className="btn-shimmer px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3">Crear cuenta gratuita<ArrowRight size={22} /></Link>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
