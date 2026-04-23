import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { kennelsApi } from '@/services/api';
import { Building2, MapPin, Phone, Mail, Globe, Edit, ArrowLeft } from 'lucide-react';

export function KennelDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: kennel, isLoading } = useQuery(
    ['kennel', id],
    () => kennelsApi.getById(id!).then((r) => r.data.kennel)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
      </div>
    );
  }

  if (!kennel) {
    return (
      <div className="text-center py-12">
        <p className="text-apple-gray-100">Criadero no encontrado</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/kennels"
          className="p-2 hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-section font-display font-semibold text-apple-black">
            {kennel.name}
          </h1>
          <p className="text-apple-gray-100">Detalles del criadero</p>
        </div>
        <Link
          to={`/kennels/${id}/edit`}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Editar
        </Link>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-apple p-6">
            <div className="flex items-start gap-6">
              {kennel.logoUrl ? (
                <img
                  src={kennel.logoUrl}
                  alt={kennel.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-apple-blue/10 rounded-lg flex items-center justify-center">
                  <Building2 className="text-apple-blue" size={40} />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-medium text-apple-black">
                    {kennel.name}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      kennel.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {kennel.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {kennel.description && (
                  <p className="text-apple-gray-200 mt-2">{kennel.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-apple p-6">
            <h3 className="text-lg font-medium text-apple-black mb-4">
              Información de contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kennel.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Dirección</p>
                    <p className="text-apple-black">
                      {kennel.address}
                      {kennel.city && `, ${kennel.city}`}
                      {kennel.country && `, ${kennel.country}`}
                    </p>
                  </div>
                </div>
              )}
              {kennel.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Teléfono</p>
                    <p className="text-apple-black">{kennel.phone}</p>
                  </div>
                </div>
              )}
              {kennel.email && (
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Email</p>
                    <p className="text-apple-black">{kennel.email}</p>
                  </div>
                </div>
              )}
              {kennel.website && (
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Sitio web</p>
                    <a
                      href={kennel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-apple-link hover:underline"
                    >
                      {kennel.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-apple p-6">
            <h3 className="text-lg font-medium text-apple-black mb-4">
              Estadísticas
            </h3>
            <div className="space-y-4">
              <Link
                to={`/dogs?kennelId=${id}`}
                className="flex items-center justify-between p-4 bg-apple-gray rounded-lg hover:bg-apple-gray-300/30 transition-colors"
              >
                <span className="text-apple-gray-200">Perros</span>
                <span className="text-2xl font-medium text-apple-black">
                  {kennel._count?.dogs || 0}
                </span>
              </Link>
              <Link
                to={`/customers?kennelId=${id}`}
                className="flex items-center justify-between p-4 bg-apple-gray rounded-lg hover:bg-apple-gray-300/30 transition-colors"
              >
                <span className="text-apple-gray-200">Clientes</span>
                <span className="text-2xl font-medium text-apple-black">
                  {kennel._count?.customers || 0}
                </span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-apple p-6">
            <h3 className="text-lg font-medium text-apple-black mb-4">
              Página pública
            </h3>
            <p className="text-sm text-apple-gray-100 mb-4">
              {kennel.isPublic
                ? 'Tu criadero está visible para el público'
                : 'Tu criadero está oculto'}
            </p>
            {kennel.isPublic && (
              <a
                href={`/k/${kennel.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill text-sm inline-flex items-center"
              >
                Ver página pública →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
