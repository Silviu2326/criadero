import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-apple-gray flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="text-red-600" size={32} />
        </div>
        <h1 className="text-3xl font-display font-semibold text-apple-black mb-4">
          Acceso denegado
        </h1>
        <p className="text-apple-gray-200 mb-8">
          No tienes permisos para acceder a esta página. Contacta a un administrador si crees que esto es un error.
        </p>
        <Link
          to="/"
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
