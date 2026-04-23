import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-apple-gray flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-display font-semibold text-apple-black mb-4">
          404
        </h1>
        <p className="text-xl text-apple-gray-200 mb-2">Página no encontrada</p>
        <p className="text-apple-gray-100 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
