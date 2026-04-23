import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Dog, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Funcionalidades', href: '/features' },
  { label: 'Precios', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Nosotros', href: '/about' },
];

export function MarketingLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-apple-gray flex flex-col">
      {/* Header - Premium Floating Pill */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6">
        <div
          className={`max-w-6xl mx-auto transition-all duration-500 ${
            scrolled
              ? 'bg-white/75 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/60'
              : 'bg-white/40 backdrop-blur-md border border-white/40'
          } rounded-2xl`}
        >
          <div className="flex items-center justify-between h-16 px-5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 text-apple-black group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-apple-blue to-emerald-700 flex items-center justify-center shadow-lg shadow-apple-blue/25 group-hover:shadow-apple-blue/40 group-hover:scale-105 transition-all duration-300">
                <Dog size={20} className="text-white" />
              </div>
              <span className="font-bold text-base tracking-tight hidden sm:inline">
                Petwellly
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? 'text-apple-black'
                      : 'text-apple-gray-100 hover:text-apple-black'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute inset-0 bg-apple-gray rounded-xl -z-10" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-shimmer px-5 py-2.5 rounded-xl text-sm"
                >
                  Mi cuenta
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-apple-gray-100 hover:text-apple-black transition-colors px-4 py-2"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="btn-shimmer px-5 py-2.5 rounded-xl text-sm"
                  >
                    Empezar gratis
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2.5 rounded-xl text-apple-black hover:bg-apple-gray transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden mt-2 max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-xl">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-semibold px-4 py-3 rounded-xl transition-colors ${
                      isActive(link.href)
                        ? 'bg-apple-black text-white'
                        : 'text-apple-gray-200 hover:bg-apple-gray'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-apple-gray-300/50 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate('/dashboard');
                      }}
                      className="btn-shimmer text-base w-full justify-center py-3 rounded-xl"
                    >
                      Mi cuenta
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="text-base font-semibold text-apple-gray-200 hover:text-apple-black px-4 py-3 rounded-xl hover:bg-apple-gray text-center"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="btn-shimmer text-base w-full justify-center py-3 rounded-xl text-center"
                      >
                        Empezar gratis
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 pt-0">
        <Outlet />
      </main>

      {/* Footer — Premium Dark */}
      <footer className="bg-[#0a0908] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] orb orb-green opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] orb orb-gold opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb orb-terracotta opacity-20" />
        <div className="absolute inset-0 noise-overlay-dark" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-apple-blue to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                  <Dog size={22} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">
                  Petwellly
                </span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-sm mb-6">
                ERP diseñado desde cero para criadores profesionales de perros.
                Gestión, salud, colaboración y presencia digital en una sola
                plataforma.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Plataforma activa
                </span>
              </div>
            </div>

            {/* Producto */}
            <div>
              <h4 className="font-bold text-sm mb-5 text-white/90">Producto</h4>
              <ul className="space-y-3 text-sm text-white/40">
                <li><Link to="/features" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Precios</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="font-bold text-sm mb-5 text-white/90">Recursos</h4>
              <ul className="space-y-3 text-sm text-white/40">
                <li><Link to="/blog/gestion-criaderos" className="hover:text-white transition-colors">Gestión de criaderos</Link></li>
                <li><Link to="/blog/historial-veterinario-perros" className="hover:text-white transition-colors">Historial veterinario</Link></li>
                <li><Link to="/blog/camadas-registro-profesional" className="hover:text-white transition-colors">Registro de camadas</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm mb-5 text-white/90">Legal</h4>
              <ul className="space-y-3 text-sm text-white/40">
                <li><Link to="/about" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
                <li><button className="hover:text-white transition-colors text-left" onClick={() => alert('Página en construcción')}>Privacidad</button></li>
                <li><button className="hover:text-white transition-colors text-left" onClick={() => alert('Página en construcción')}>Términos de uso</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} Petwellly. Todos los derechos reservados.
            </p>
            <p className="text-sm text-white/30">
              Diseñado para criadores profesionales.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
