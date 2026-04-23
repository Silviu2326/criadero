import { Outlet } from 'react-router-dom';
import { Dog, Heart } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-apple-gray flex">
      {/* Left panel - decorative, hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#4A5D52]">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Soft gradient orb */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-apple-gray/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-apple-gray">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apple-gray/20 backdrop-blur flex items-center justify-center">
              <Dog size={22} className="text-apple-gray" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Petwellly</span>
          </div>

          <div className="max-w-md">
            <blockquote className="text-2xl font-display font-medium leading-relaxed mb-6">
              “El cuidado de un criadero comienza con la organización de cada detalle.”
            </blockquote>
            <div className="flex items-center gap-3 text-apple-gray/80">
              <div className="w-10 h-10 rounded-full bg-apple-gray/20 flex items-center justify-center">
                <Heart size={18} />
              </div>
              <div>
                <p className="font-medium text-sm">Diseñado para criadores profesionales</p>
                <p className="text-xs text-apple-gray/60">Gestión, salud y finanzas en un solo lugar</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-apple-gray/50">
            © {new Date().getFullYear()} Petwellly. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
