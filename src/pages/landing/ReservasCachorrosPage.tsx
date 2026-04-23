import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSection } from "@/components/landing/LandingSection";
import { ArrowRight, Calendar, CheckCircle2, Clock, FileText, CreditCard, Bell, Users, TrendingUp } from "lucide-react";

export function ReservasCachorrosPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Software para gestionar reservas de cachorros"
        description="Gestiona las reservas de tus cachorros de forma profesional con Petwellly. Controla estados, pagos, lista de espera y comunicación con compradores desde un único panel."
        canonical="/reservas-cachorros-software"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Software para gestionar reservas de cachorros",
        }}
      />
      <LandingHero
        badge="Gestión comercial para criadores"
        title="Software para gestionar"
        highlightedText="reservas de cachorros"
        description="Olvida las reservas en papel, WhatsApp y Excel. Petwellly te ofrece un sistema completo para gestionar solicitudes, pagos, estados y comunicación con los compradores de tus cachorros."
        ctaPrimary={{ text: "Gestionar mis reservas", to: "/register" }}
        ctaSecondary={{ text: "Ver funcionalidades", to: "/features" }}
        centered
      />

      <LandingSection variant="mid">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-10">
            El ciclo de una <span className="text-gradient-premium">reserva</span>
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="glass-ultra rounded-[28px] p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Users className="text-emerald-700" size={24} /></div>
              <div className="text-sm font-semibold text-emerald-600 mb-1">1. Solicitud</div>
              <p className="text-apple-gray-200 text-sm">El comprador contacta o solicita reserva online.</p>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4"><FileText className="text-amber-700" size={24} /></div>
              <div className="text-sm font-semibold text-amber-600 mb-1">2. Evaluación</div>
              <p className="text-apple-gray-200 text-sm">Revisas datos del comprador y compatibilidad.</p>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="text-rose-700" size={24} /></div>
              <div className="text-sm font-semibold text-rose-600 mb-1">3. Confirmación</div>
              <p className="text-apple-gray-200 text-sm">Aceptas la reserva y bloqueas el cachorro.</p>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4"><CreditCard className="text-blue-700" size={24} /></div>
              <div className="text-sm font-semibold text-blue-600 mb-1">4. Pago</div>
              <p className="text-apple-gray-200 text-sm">Registras señal y pagos parciales o totales.</p>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4"><Calendar className="text-purple-700" size={24} /></div>
              <div className="text-sm font-semibold text-purple-600 mb-1">5. Entrega</div>
              <p className="text-apple-gray-200 text-sm">Programas la entrega con documentación lista.</p>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="light">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-apple-black mb-4">Estados y <span className="text-gradient-premium">trazabilidad</span></h2>
          <p className="text-apple-gray-200 text-lg">Cada reserva pasa por estados claros que te permiten saber exactamente dónde está cada cachorro y cada comprador.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-ultra rounded-[28px] p-8 hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5"><Clock className="text-emerald-700" size={28} /></div>
            <h3 className="text-xl font-semibold text-apple-black mb-3">Pendiente de revisión</h3>
            <p className="text-apple-gray-200 leading-relaxed">La solicitud ha llegado pero aún no has evaluado al comprador. Puedes añadir notas internas y recordatorios.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-8 hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-5"><CheckCircle2 className="text-amber-700" size={28} /></div>
            <h3 className="text-xl font-semibold text-apple-black mb-3">Confirmada con señal</h3>
            <p className="text-apple-gray-200 leading-relaxed">El comprador ha pagado la señal y el cachorro queda reservado. El sistema bloquea automáticamente la disponibilidad.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-8 hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-5"><TrendingUp className="text-rose-700" size={28} /></div>
            <h3 className="text-xl font-semibold text-apple-black mb-3">Lista de espera</h3>
            <p className="text-apple-gray-200 leading-relaxed">Si no hay cachorros disponibles, el comprador entra en lista de espera y recibe notificación cuando haya nueva camada.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="dark">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="kinetic-subhead text-white mb-6">Pagos y <span className="text-gradient-amber-premium">facturación</span> integrados</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">Petwellly te permite registrar cada pago asociado a una reserva: señales, pagos parciales y liquidaciones finales. Todo queda vinculado a la ficha del comprador y del cachorro, generando un historial financiero completo y ordenado.</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0"><CreditCard className="text-emerald-400" size={20} /></div><div><p className="font-semibold text-white">Registro de señales y pagos</p><p className="text-white/60 text-sm">Anota importes, fechas y métodos de pago de forma estructurada.</p></div></li>
              <li className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0"><Bell className="text-amber-400" size={20} /></div><div><p className="font-semibold text-white">Recordatorios de cobro</p><p className="text-white/60 text-sm">Recibe alertas cuando un pago pendiente esté próximo a su fecha de vencimiento.</p></div></li>
              <li className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0"><FileText className="text-rose-400" size={20} /></div><div><p className="font-semibold text-white">Documentación legal vinculada</p><p className="text-white/60 text-sm">Adjunta contratos, facturas y garantías directamente a cada reserva.</p></div></li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200/20 via-amber-200/20 to-rose-200/20 rounded-[40px] blur-2xl" />
            <div className="relative glass-ultra-dark rounded-[32px] p-8 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5"><span className="text-white font-medium">Señal reserva #R-2024-08</span><span className="text-emerald-400 font-semibold">+300 EUR</span></div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5"><span className="text-white font-medium">Pago parcial reserva #R-2024-08</span><span className="text-emerald-400 font-semibold">+500 EUR</span></div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5"><span className="text-white font-medium">Liquidación final #R-2024-08</span><span className="text-emerald-400 font-semibold">+700 EUR</span></div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between"><span className="text-white/70">Total recaudado</span><span className="text-white text-xl font-bold">1.500 EUR</span></div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="mid">
        <div className="relative overflow-hidden rounded-[40px] bg-apple-black px-8 py-16 lg:px-16 lg:py-24 text-center">
          <div className="orb orb-gold w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
          <div className="orb orb-green w-[400px] h-[400px] -bottom-20 -left-20 animate-float-slow" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="kinetic-subhead text-white mb-6">Gestiona tus reservas como un <span className="text-gradient-amber-premium">profesional</span></h2>
            <p className="text-white/70 text-lg mb-10">Olvida el caos de WhatsApp y papel. Con Petwellly tienes un software de reservas diseñado específicamente para criadores de perros.</p>
            <Link to="/register" className="btn-shimmer px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3">Probar gratis 14 días<ArrowRight size={22} /></Link>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
