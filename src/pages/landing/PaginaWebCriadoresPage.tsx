import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSection } from "@/components/landing/LandingSection";
import { ArrowRight, Globe, Smartphone, Search, Share2, ShieldCheck, Eye, Zap } from "lucide-react";

export function PaginaWebCriadoresPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Página web para criadores de perros"
        description="Crea tu página web de criadero profesional con Petwellly. Muestra tus perros disponibles, recibe solicitudes de reserva y mejora tu presencia digital sin conocimientos técnicos."
        canonical="/pagina-web-para-criadores-de-perros"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Página web para criadores de perros",
        }}
      />
      <LandingHero
        badge="Presencia digital profesional"
        title="Página web para"
        highlightedText="criadores de perros"
        description="Tu criadero merece una vitrina online profesional. Con Petwellly obtienes una página web pública optimizada para móviles, buscadores y conversiones, sin necesidad de saber programar."
        ctaPrimary={{ text: "Crear mi página web", to: "/register" }}
        ctaSecondary={{ text: "Ver funcionalidades", to: "/features" }}
        centered
      />

      <LandingSection variant="mid">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-8">
            La importancia de la <span className="text-gradient-premium">presencia digital</span>
          </h2>
          <div className="glass-ultra rounded-[32px] p-8 lg:p-12">
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-6">En el mundo actual, la primera impresión de un criadero profesional ocurre en internet. Los compradores potenciales buscan en Google antes de contactar, revisan fotos en el móvil y comparan opciones antes de tomar una decisión. No tener una página web propia significa perder ventas frente a competidores que sí invierten en su imagen digital.</p>
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-6">Una página web para criadores de perros no es solo un catálogo de fotos: es una herramienta de captación de clientes, una plataforma de comunicación y una prueba de profesionalidad. Los criadores que cuentan con una web actualizada, con información clara sobre sus perros, camadas disponibles y datos de contacto, generan mucha más confianza que quienes dependen únicamente de redes sociales o marketplaces genéricos.</p>
            <p className="text-apple-gray-200 text-lg leading-relaxed">Petwellly resuelve este problema de forma integral. Cada criadero que utiliza nuestra plataforma obtiene automáticamente una página pública personalizada, sincronizada en tiempo real con el ERP. Cuando registras un perro como disponible, actualizas una camada o modificas tu teléfono de contacto, la web se actualiza sola. Sin diseñadores, sin programadores, sin complicaciones.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="light">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-apple-black mb-4">
            Cómo funciona tu <span className="text-gradient-premium">página pública</span> en Petwellly
          </h2>
          <p className="text-apple-gray-200 text-lg">Tu web de criadero se genera automáticamente a partir de los datos que ya introduces en el ERP. Estos son los pasos:</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="glass-ultra rounded-[28px] p-6 text-center hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5"><Globe className="text-emerald-700" size={28} /></div>
            <div className="text-sm font-semibold text-emerald-600 mb-2">Paso 1</div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">Activa tu página</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">Desde la configuración de tu criadero, activas la página pública con un solo clic. Elige qué información quieres mostrar.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-6 text-center hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5"><Smartphone className="text-amber-700" size={28} /></div>
            <div className="text-sm font-semibold text-amber-600 mb-2">Paso 2</div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">Diseño responsive</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">La página se adapta perfectamente a móviles, tablets y ordenadores, ofreciendo una experiencia profesional en cualquier dispositivo.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-6 text-center hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-5"><Search className="text-rose-700" size={28} /></div>
            <div className="text-sm font-semibold text-rose-600 mb-2">Paso 3</div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">SEO integrado</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">Metaetiquetas automáticas, URLs limpias y estructura optimizada para que Google indexe tu criadero correctamente.</p>
          </div>
          <div className="glass-ultra rounded-[28px] p-6 text-center hover-lift">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5"><Share2 className="text-blue-700" size={28} /></div>
            <div className="text-sm font-semibold text-blue-600 mb-2">Paso 4</div>
            <h3 className="text-lg font-semibold text-apple-black mb-2">Comparte y recibe reservas</h3>
            <p className="text-apple-gray-200 text-sm leading-relaxed">Comparte el enlace en redes sociales, WhatsApp o email. Los visitantes pueden ver tus perros y solicitar reservas directamente.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="dark">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-white mb-4">Ventajas de tu página web con <span className="text-gradient-amber-premium">Petwellly</span></h2>
          <p className="text-white/70 text-lg">No es solo una web: es una extensión de tu ERP que trabaja 24 horas para captar clientes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5"><Eye className="text-emerald-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-3">Visibilidad constante</h3>
            <p className="text-white/70 leading-relaxed">Tu criadero está disponible para ser encontrado en cualquier momento, incluso cuando duermes o estás ocupado cuidando de los perros.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-5"><ShieldCheck className="text-amber-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-3">Imagen profesional</h3>
            <p className="text-white/70 leading-relaxed">Una web limpia, moderna y actualizada transmite seriedad y diferencia a los criadores amateur de los profesionales.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-5"><Zap className="text-rose-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-3">Cero mantenimiento técnico</h3>
            <p className="text-white/70 leading-relaxed">Olvídate de hosting, actualizaciones de plugins o caídas del servidor. Petwellly gestiona todo por ti.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="mid">
        <div className="relative overflow-hidden rounded-[40px] bg-apple-black px-8 py-16 lg:px-16 lg:py-24 text-center">
          <div className="orb orb-gold w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
          <div className="orb orb-green w-[400px] h-[400px] -bottom-20 -left-20 animate-float-slow" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="kinetic-subhead text-white mb-6">Dale a tu criadero la <span className="text-gradient-amber-premium">visibilidad</span> que merece</h2>
            <p className="text-white/70 text-lg mb-10">Cientos de criadores ya tienen su página web profesional con Petwellly. Empieza hoy mismo y convierte visitantes en clientes.</p>
            <Link to="/register" className="btn-shimmer px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3">Crear mi web gratis<ArrowRight size={22} /></Link>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
