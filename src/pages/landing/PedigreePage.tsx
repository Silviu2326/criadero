import { Link } from "react-router-dom";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSection } from "@/components/landing/LandingSection";
import {
  ArrowRight, FileText, Share2, ShieldCheck, TreePine, Eye, Award,
} from "lucide-react";

export function PedigreePage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Pedigree de perros online y árbol genealógico"
        description="Gestiona el pedigree de tus perros de forma digital. Crea árboles genealógicos completos, comparte trazabilidad con compradores y cumple con los estándares de los criaderos profesionales."
        canonical="/pedigree-perros-online"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Pedigree de perros online y árbol genealógico",
        }}
      />
      <LandingHero
        badge="Trazabilidad genética profesional"
        title="Pedigree de perros online y"
        highlightedText="árbol genealógico"
        description="Registra, consulta y comparte el pedigree de tus perros desde cualquier dispositivo. Petwellly te permite construir árboles genealógicos completos y mantener la historia de cada línea de cría siempre accesible."
        ctaPrimary={{ text: "Crear mi árbol genealógico", to: "/register" }}
        ctaSecondary={{ text: "Ver funcionalidades", to: "/features" }}
        centered
      />

      <LandingSection variant="mid">
        <div className="max-w-4xl mx-auto">
          <h2 className="kinetic-subhead text-apple-black text-center mb-8">
            Qué es el <span className="text-gradient-premium">pedigree</span> y por qué importa
          </h2>
          <div className="glass-ultra rounded-[32px] p-8 lg:p-12">
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-6">El pedigree es el documento oficial que certifica el origen genealógico de un perro de raza. En él se recogen los datos de sus ascendientes: padres, abuelos, bisabuelos y, en ocasiones, tatarabuelos. Este registro no solo acredita la pureza racial del ejemplar, sino que también permite evaluar la línea de sangre, detectar consanguinidades y planificar cruces futuros con criterio.</p>
            <p className="text-apple-gray-200 text-lg leading-relaxed mb-6">Para un criador profesional, el pedigree es mucho más que un papel: es una herramienta de marketing, una garantía de calidad y un requisito legal en muchos países. Los compradores exigen cada vez más transparencia, y contar con un pedigree digital, consultable y bien estructurado marca la diferencia entre un criadero amateur y uno profesional.</p>
            <p className="text-apple-gray-200 text-lg leading-relaxed">En Petwellly hemos digitalizado todo este proceso. Cada perro que registras en la plataforma puede vincularse automáticamente con su madre y su padre, generando un árbol genealógico visual que crece y se actualiza a medida que añades nuevas camadas. Olvídate de archivar papeles y de perder tiempo buscando ancestros en cajones.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="light">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-apple-black mb-4">
            Cómo gestiona Petwellly el <span className="text-gradient-premium">pedigree</span>
          </h2>
          <p className="text-apple-gray-200 text-lg">Nuestro sistema convierte la gestión genealógica en un proceso sencillo, visual y siempre actualizado.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-[32px] blur-xl" />
            <div className="relative glass-ultra rounded-[28px] p-8 h-full">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                <FileText className="text-emerald-700" size={28} />
              </div>
              <div className="text-sm font-semibold text-emerald-600 mb-2">Paso 1</div>
              <h3 className="text-xl font-semibold text-apple-black mb-3">Registro de perros reproductores</h3>
              <p className="text-apple-gray-200 leading-relaxed">Introduce los datos de los padres en el sistema. Puedes adjuntar fotos, documentos oficiales y notas internas sobre características fenotípicas y genotípicas.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-amber-200/20 to-transparent rounded-[32px] blur-xl" />
            <div className="relative glass-ultra rounded-[28px] p-8 h-full">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                <TreePine className="text-amber-700" size={28} />
              </div>
              <div className="text-sm font-semibold text-amber-600 mb-2">Paso 2</div>
              <h3 className="text-xl font-semibold text-apple-black mb-3">Vinculación automática en camadas</h3>
              <p className="text-apple-gray-200 leading-relaxed">Al registrar una nueva camada, seleccionas madre y padre. Petwellly genera automáticamente el árbol genealógico de cada cachorro con todos los ancestros disponibles.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-rose-200/20 to-transparent rounded-[32px] blur-xl" />
            <div className="relative glass-ultra rounded-[28px] p-8 h-full">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                <Share2 className="text-rose-700" size={28} />
              </div>
              <div className="text-sm font-semibold text-rose-600 mb-2">Paso 3</div>
              <h3 className="text-xl font-semibold text-apple-black mb-3">Comparte el pedigree digital</h3>
              <p className="text-apple-gray-200 leading-relaxed">Desde la ficha de cada perro puedes exportar o compartir el árbol genealógico con veterinarios, asociaciones caninas o compradores potenciales de forma profesional.</p>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="dark">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="kinetic-subhead text-white mb-4">Ventajas de la <span className="text-gradient-amber-premium">trazabilidad digital</span></h2>
          <p className="text-white/70 text-lg">El pedigree online no solo organiza tu información: potencia la reputación de tu criadero y facilita la toma de decisiones.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5"><Eye className="text-emerald-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-3">Transparencia total</h3>
            <p className="text-white/70 leading-relaxed">Los compradores pueden consultar el historial genealógico completo del cachorro que les interesa, generando confianza desde el primer contacto.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-5"><ShieldCheck className="text-amber-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-3">Evita consanguinidades</h3>
            <p className="text-white/70 leading-relaxed">Visualiza rápidamente las líneas de sangre repetidas y planifica cruces saludables respetando los coeficientes de consanguinidad recomendados.</p>
          </div>
          <div className="glass-ultra-dark rounded-[28px] p-8 hover-lift">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-5"><Award className="text-rose-400" size={24} /></div>
            <h3 className="text-lg font-semibold text-white mb-3">Valor añadido para tu marca</h3>
            <p className="text-white/70 leading-relaxed">Un criadero que entrega pedigree digital bien documentado se posiciona como referente de calidad y profesionalidad en el mercado.</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection variant="mid">
        <div className="relative overflow-hidden rounded-[40px] bg-apple-black px-8 py-16 lg:px-16 lg:py-24 text-center">
          <div className="orb orb-gold w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
          <div className="orb orb-green w-[400px] h-[400px] -bottom-20 -left-20 animate-float-slow" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="kinetic-subhead text-white mb-6">Construye el <span className="text-gradient-amber-premium">futuro</span> de tu línea de cría</h2>
            <p className="text-white/70 text-lg mb-10">Empieza hoy mismo a digitalizar el pedigree de tus perros. Petwellly te acompaña en cada paso para que tu criadero destaque por su profesionalidad.</p>
            <Link to="/register" className="btn-shimmer px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3">Probar gratis 14 días<ArrowRight size={22} /></Link>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
