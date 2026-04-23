import { Link } from 'react-router-dom';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';
import { Check, Minus, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Ideal para criadores que están comenzando o gestionan un solo criadero.',
    price: '19',
    period: '/mes',
    cta: 'Comenzar',
    href: '/register',
    features: [
      { text: '1 criadero', included: true },
      { text: 'Hasta 25 perros', included: true },
      { text: 'Página pública básica', included: true },
      { text: 'Gestión de camadas', included: true },
      { text: 'Historial veterinario', included: true },
      { text: 'Clientes y reservas', included: true },
      { text: 'Reportes básicos', included: true },
      { text: 'Soporte por email', included: true },
      { text: 'Veterinarios ilimitados', included: false },
      { text: 'Dominio personalizado', included: false },
      { text: 'API de integración', included: false },
    ],
  },
  {
    name: 'Professional',
    description: 'Para criadores establecidos que necesitan escalar y profesionalizar su operación.',
    price: '49',
    period: '/mes',
    cta: 'Elegir Professional',
    href: '/register',
    popular: true,
    features: [
      { text: '3 criaderos', included: true },
      { text: 'Perros ilimitados', included: true },
      { text: 'Página pública avanzada', included: true },
      { text: 'Gestión de camadas', included: true },
      { text: 'Historial veterinario', included: true },
      { text: 'Clientes y reservas', included: true },
      { text: 'Reportes avanzados', included: true },
      { text: 'Soporte prioritario', included: true },
      { text: 'Veterinarios ilimitados', included: true },
      { text: 'Dominio personalizado', included: true },
      { text: 'API de integración', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'Solución a medida para grupos de criaderos, asociaciones o operadores grandes.',
    price: null,
    period: null,
    cta: 'Contactar ventas',
    href: '/about',
    features: [
      { text: 'Criaderos ilimitados', included: true },
      { text: 'Perros ilimitados', included: true },
      { text: 'Página pública avanzada', included: true },
      { text: 'Gestión de camadas', included: true },
      { text: 'Historial veterinario', included: true },
      { text: 'Clientes y reservas', included: true },
      { text: 'Reportes personalizados', included: true },
      { text: 'Soporte dedicado', included: true },
      { text: 'Veterinarios ilimitados', included: true },
      { text: 'Dominio personalizado', included: true },
      { text: 'API de integración', included: true },
    ],
  },
];

const faqs = [
  {
    q: '¿Puedo cambiar de plan en cualquier momento?',
    a: 'Sí. Puedes subir o bajar de plan desde tu panel de configuración. Los cambios se aplican en el siguiente ciclo de facturación.',
  },
  {
    q: '¿Hay un periodo de prueba gratuito?',
    a: 'Ofrecemos 14 días de prueba gratuita en el plan Professional para que explores todas las funcionalidades sin compromiso.',
  },
  {
    q: '¿Qué significa "página pública del criadero"?',
    a: 'Es una landing page única asociada a tu criadero donde puedes mostrar los perros marcados como públicos, tu información de contacto y recibir solicitudes de reserva.',
  },
  {
    q: '¿Necesito conocimientos técnicos para usar Petwellly?',
    a: 'No. La plataforma está diseñada para ser intuitiva. Solo necesitas un navegador web y conexión a internet.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Utilizamos encriptación HTTPS/TLS, almacenamos contraseñas con bcrypt y aplicamos separación de datos entre criaderos.',
  },
  {
    q: '¿Puedo facturar anualmente?',
    a: 'Sí. Ofrecemos descuentos especiales para pagos anuales. Contacta con nuestro equipo de ventas para conocer las tarifas actualizadas.',
  },
  {
    q: '¿Hay límite de perros en el plan Professional?',
    a: 'No. El plan Professional permite perros ilimitados y hasta 3 criaderos. Es ideal para criadores establecidos que gestionan varias líneas de cría.',
  },
  {
    q: '¿Puedo migrar mis datos desde otra plataforma o Excel?',
    a: 'Sí. Todos los planes incluyen importación básica por CSV. Los planes Professional y Enterprise incluyen asistencia personalizada en la migración de datos.',
  },
  {
    q: '¿Qué incluye el soporte dedicado de Enterprise?',
    a: 'Enterprise incluye un canal de soporte directo con tiempo de respuesta garantizado, sesiones de onboarding para tu equipo y prioridad en el desarrollo de nuevas funcionalidades.',
  },
];

const comparisonFeatures = [
  { name: 'Perros', starter: 'Hasta 25', pro: 'Ilimitados', enterprise: 'Ilimitados' },
  { name: 'Criaderos', starter: '1', pro: '3', enterprise: 'Ilimitados' },
  { name: 'Página pública', starter: 'Básica', pro: 'Avanzada + dominio', enterprise: 'Avanzada + dominio' },
  { name: 'Historial veterinario', starter: true, pro: true, enterprise: true },
  { name: 'Gestión de camadas', starter: true, pro: true, enterprise: true },
  { name: 'Clientes y reservas', starter: true, pro: true, enterprise: true },
  { name: 'Reportes', starter: 'Básicos', pro: 'Avanzados', enterprise: 'Personalizados' },
  { name: 'Soporte', starter: 'Email', pro: 'Prioritario', enterprise: 'Dedicado' },
  { name: 'API de integración', starter: false, pro: false, enterprise: true },
];

export function PricingPage() {
  return (
    <div className="overflow-hidden">
      <SeoHelmet
        title="Precios | Petwellly"
        description="Planes simples y transparentes para criadores de perros. Starter $19/mes, Professional $49/mes, Enterprise personalizado. Prueba gratis 14 días."
        keywords="precios Petwellly, planes criadero perros, software criadero precio, ERP perros costo"
        canonical="/pricing"
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Petwellly',
          description: 'ERP para criadores de perros profesionales',
          offers: [
            {
              '@type': 'Offer',
              name: 'Starter',
              price: '19',
              priceCurrency: 'USD',
              priceValidUntil: '2026-12-31',
            },
            {
              '@type': 'Offer',
              name: 'Professional',
              price: '49',
              priceCurrency: 'USD',
              priceValidUntil: '2026-12-31',
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 aurora-bg noise-overlay overflow-hidden">
        <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-40 animate-pulse-glow" />
        <div className="orb orb-terracotta w-[400px] h-[400px] bottom-0 right-0 animate-float-slow" />
        <div className="deco-ring deco-ring-amber w-96 h-96 top-20 right-20 deco-dashed animate-float-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="badge-aurora mb-5 inline-flex">Precios</span>
          <h1 className="kinetic-headline font-display text-apple-black text-glow">
            Planes simples,
            <br />
            <span className="text-gradient-premium">sin sorpresas</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-apple-gray-200 max-w-2xl mx-auto leading-relaxed">
            Elige el plan que se ajuste al tamaño de tu operación. Todos incluyen acceso completo
            a las funcionalidades core del ERP.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular
                    ? 'bg-apple-black text-white shadow-2xl shadow-apple-black/20 scale-[1.02] z-10'
                    : 'bg-apple-gray text-apple-black glow-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Sparkles size={14} />
                    Más popular
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-display font-bold text-2xl">{plan.name}</h3>
                  <p className={`mt-2 text-sm ${plan.popular ? 'text-white/60' : 'text-apple-gray-200'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  {plan.price ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-display font-bold">${plan.price}</span>
                      <span className={plan.popular ? 'text-white/60' : 'text-apple-gray-100'}>
                        {plan.period}
                      </span>
                    </div>
                  ) : (
                    <div className="text-3xl font-display font-bold">Personalizado</div>
                  )}
                </div>

                <Link
                  to={plan.href}
                  className={`mb-8 text-center justify-center py-3.5 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'btn-shimmer'
                      : 'bg-apple-black text-white hover:bg-apple-black/90'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-3 text-sm">
                      {f.included ? (
                        <Check
                          size={18}
                          className={plan.popular ? 'text-emerald-300 shrink-0' : 'text-emerald-600 shrink-0'}
                        />
                      ) : (
                        <Minus
                          size={18}
                          className={plan.popular ? 'text-white/30 shrink-0' : 'text-apple-gray-300 shrink-0'}
                        />
                      )}
                      <span className={!f.included ? (plan.popular ? 'text-white/40' : 'text-apple-gray-100') : ''}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="relative section-xl bg-white noise-overlay overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-apple-gray to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="badge-aurora mb-4 inline-flex">Comparativa</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-3">Comparativa de planes</h2>
          </div>
          <div className="bg-apple-gray rounded-[32px] p-6 lg:p-10 glow-border overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-apple-gray-300/30">
                  <th className="text-left py-4 font-display font-bold text-apple-black">Característica</th>
                  <th className="text-center py-4 font-display font-bold text-apple-black">Starter</th>
                  <th className="text-center py-4 font-display font-bold text-apple-black">Professional</th>
                  <th className="text-center py-4 font-display font-bold text-apple-black">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={row.name} className={idx !== comparisonFeatures.length - 1 ? 'border-b border-apple-gray-300/20' : ''}>
                    <td className="py-4 text-apple-gray-200 font-medium">{row.name}</td>
                    <td className="py-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check size={18} className="mx-auto text-emerald-600" /> : <Minus size={18} className="mx-auto text-apple-gray-300" />
                      ) : (
                        <span className="text-apple-gray-100">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check size={18} className="mx-auto text-emerald-600" /> : <Minus size={18} className="mx-auto text-apple-gray-300" />
                      ) : (
                        <span className="text-apple-gray-100">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check size={18} className="mx-auto text-emerald-600" /> : <Minus size={18} className="mx-auto text-apple-gray-300" />
                      ) : (
                        <span className="text-apple-gray-100">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative section-xl aurora-mid noise-overlay overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="badge-aurora mb-4 inline-flex">FAQ</span>
            <h2 className="kinetic-subhead font-display text-apple-black mt-3">
              Preguntas frecuentes
            </h2>
            <p className="mt-3 text-apple-gray-200">
              Todo lo que necesitas saber antes de comenzar.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
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

      {/* CTA */}
      <section className="relative section-xl aurora-bg overflow-hidden noise-overlay">
        <div className="orb orb-green w-[600px] h-[600px] bottom-0 left-0 animate-pulse-glow" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-ultra rounded-[40px] p-10 lg:p-14">
            <h2 className="kinetic-subhead font-display text-apple-black">
              ¿Tienes dudas sobre qué plan elegir?
            </h2>
            <p className="mt-4 text-lg text-apple-gray-200">
              Escríbenos y te ayudamos a encontrar la opción que mejor se adapte a tu criadero.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn-shimmer px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2"
              >
                Probar 14 días gratis
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 bg-white hover:bg-apple-gray border border-apple-gray-300 text-apple-black transition-all"
              >
                Contactar ventas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
