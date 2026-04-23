import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSection } from "@/components/landing/LandingSection";
import {
  ArrowRight, HeartPulse, Syringe, Pill, Stethoscope, FileText,
  Clock, Bell, UserCheck, ShieldCheck, AlertCircle,
} from "lucide-react";

export function ControlSanitarioPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Control sanitario de perros: cartilla digital"
        description="Digitaliza la cartilla sanitaria de tu criadero. Controla vacunas, desparasitaciones, consultas veterinarias y recibe alertas automáticas para mantener la salud de tus perros al día."
        canonical="/control-sanitario-perros"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Control sanitario de perros: cartilla digital",
        }}
      />
      <LandingHero
        badge="Salud y bienestar canino"
        title="Control sanitario de perros:"
        highlightedText="cartilla digital"
        description="Olvida las cartillas de papel. Con Petwellly llevas el historial veterinario de cada perro siempre actualizado, con alertas automáticas y acceso para veterinarios colaboradores."
        ctaPrimary={{ text: "Crear cartilla digital", to: "/register" }}
        ctaSecondary={{ text: "Ver funcionalidades", to: "/features" }}
        centered
      />

      <LandingSection variant="mid">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-10">
            Qué debe incluir el <span className="text-gradient-premium">control sanitario</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-ultra rounded-[28px] p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0"><Syringe className="text-emerald-700" size={24} /></div>
              <div><h3 className="font-semibold text-apple-black mb-1">Vacunación completa</h3><p className="text-apple-gray-200 text-sm leading-relaxed">Registra cada dosis con fecha de administración, laboratorio, número de lote, veterinario responsable y fecha de la próxima revacunación.</p></div>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><Pill className="text-amber-700" size={24} /></div>
              <div><h3 className="font-semibold text-apple-black mb-1">Desparasitaciones</h3><p className="text-apple-gray-200 text-sm leading-relaxed">Internas y externas con producto utilizado, peso del animal en el momento del tratamiento y programación de la siguiente dosis.</p></div>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0"><Stethoscope className="text-rose-700" size={24} /></div>
              <div><h3 className="font-semibold text-apple-black mb-1">Consultas veterinarias</h3><p className="text-apple-gray-200 text-sm leading-relaxed">Motivo de la visita, diagnóstico, tratamiento prescrito, evolución y notas del profesional. Todo vinculado a la ficha del perro.</p></div>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><FileText className="text-blue-700" size={24} /></div>
              <div><h3 className="font-semibold text-apple-black mb-1">Documentación adjunta</h3><p className="text-apple-gray-200 text-sm leading-relaxed">Sube PDFs de analíticas, radiografías, ecografías, certificados de salud y cualquier documento relevante para el seguimiento clínico.</p></div>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0"><HeartPulse className="text-purple-700" size={24} /></div>
              <div><h3 className="font-semibold text-apple-black mb-1">Estado general de salud</h3><p className="text-apple-gray-200 text-sm leading-relaxed">Registro de peso periódico, observaciones sobre alimentación, comportamiento y cualquier indicador de bienestar a lo largo del tiempo.</p></div>
            </div>
            <div className="glass-ultra rounded-[28px] p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0"><ShieldCheck className="text-cyan-700" size={24} /></div>
              <div><h3 className="font-semibold text-apple-black mb-1">Pruebas genéticas y de salud</h3><p className="text-apple-gray-200 text-sm leading-relaxed">Resultados de tests de displasia, oculares, cardíacos o cualquier prueba específica de la raza con fechas y centros autorizados.</p></div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="dark">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="kinetic-subhead text-white mb-6">Alertas <span className="text-gradient-amber-premium">automáticas</span> que nunca fallan</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">Una de las mayores ventajas de digitalizar el control sanitario son las notificaciones automáticas. Petwellly monitoriza las fechas de vencimiento de vacunas, desparasitaciones y revisiones veterinarias, enviándote alertas con antelación para que nada se te pase.</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0"><Bell className="text-emerald-400" size={20} /></div><div><p className="font-semibold text-white">Alertas 30 días antes del vencimiento</p><p className="text-white/60 text-sm">Tiempo suficiente para concertar cita con el veterinario.</p></div></li>
              <li className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0"><Clock className="text-amber-400" size={20} /></div><div><p className="font-semibold text-white">Recordatorios de tratamientos en curso</p><p className="text-white/60 text-sm">No olvides ninguna dosis de medicación ni tratamiento preventivo.</p></div></li>
              <li className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0"><AlertCircle className="text-rose-400" size={20} /></div><div><p className="font-semibold text-white">Notificaciones por email</p><p className="text-white/60 text-sm">Recibe los avisos directamente en tu bandeja de entrada o en el panel de Petwellly.</p></div></li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200/20 via-amber-200/20 to-rose-200/20 rounded-[40px] blur-2xl" />
            <div className="relative glass-ultra-dark rounded-[32px] p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5"><div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><Bell className="text-emerald-400" size={18} /></div><div><p className="text-white font-medium">Vacuna polivalente de Luna vence en 12 días</p><p className="text-white/50 text-sm">Programada para el 25 de octubre</p></div></div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5"><div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center"><Clock className="text-amber-400" size={18} /></div><div><p className="text-white font-medium">Desparasitación interna de los cachorros de la camada C-2024-03</p><p className="text-white/50 text-sm">Pendiente para esta semana</p></div></div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5"><div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center"><Stethoscope className="text-rose-400" size={18} /></div><div><p className="text-white font-medium">Revisión anual de Max programada</p><p className="text-white/50 text-sm">Veterinario: Dra. Martínez</p></div></div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="light">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-10">Colaboración con <span className="text-gradient-premium">veterinarios</span></h2>
          <div className="glass-ultra rounded-[32px] p-8 lg:p-12">
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-8">Petwellly no solo sirve para el criador: también facilita el trabajo del equipo veterinario. Puedes dar acceso a veterinarios colaboradores para que consulten el historial sanitario de los perros, añadan nuevas entradas o adjunten resultados de pruebas. Todo queda registrado, firmado por usuario y fecha, garantizando la trazabilidad completa.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white/60">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4"><UserCheck className="text-emerald-700" size={28} /></div>
                <h3 className="font-semibold text-apple-black mb-2">Acceso controlado</h3>
                <p className="text-apple-gray-200 text-sm">Asigna permisos de lectura o escritura a cada veterinario según tu confianza y necesidades.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/60">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4"><FileText className="text-amber-700" size={28} /></div>
                <h3 className="font-semibold text-apple-black mb-2">Documentación compartida</h3>
                <p className="text-apple-gray-200 text-sm">Radiografías, analíticas y certificados disponibles para el veterinario sin necesidad de enviar archivos por email.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/60">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4"><ShieldCheck className="text-rose-700" size={28} /></div>
                <h3 className="font-semibold text-apple-black mb-2">Historial inmutable</h3>
                <p className="text-apple-gray-200 text-sm">Cada entrada queda firmada digitalmente con usuario, fecha y hora, evitando confusiones o disputas.</p>
              </div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="mid">
        <div className="relative overflow-hidden rounded-[40px] bg-apple-black px-8 py-16 lg:px-16 lg:py-24 text-center">
          <div className="orb orb-gold w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
          <div className="orb orb-green w-[400px] h-[400px] -bottom-20 -left-20 animate-float-slow" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="kinetic-subhead text-white mb-6">Protege la salud de tus <span className="text-gradient-amber-premium">perros</span> hoy mismo</h2>
            <p className="text-white/70 text-lg mb-10">Digitaliza el control sanitario de tu criadero y olvídate de las cartillas de papel. Petwellly te ayuda a mantener la salud de tus animales al día con alertas automáticas y acceso para todo tu equipo.</p>
            <Link to="/register" className="btn-shimmer px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3">Empezar prueba gratuita<ArrowRight size={22} /></Link>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
