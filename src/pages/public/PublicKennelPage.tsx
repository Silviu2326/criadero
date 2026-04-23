import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { publicApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { SeoHelmet } from '@/components/seo/SeoHelmet';
import { JsonLd } from '@/components/seo/JsonLd';
import { Building2, MapPin, Mail, Phone, Globe, PawPrint, Loader2 } from 'lucide-react';

export function PublicKennelPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ['publicKennel', slug],
    () => publicApi.getKennel(slug!).then((r) => r.data),
    {
      onError: () => {
        // Kennel not found or not public
      },
    }
  );

  const { kennel, dogs } = data || {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-apple-blue" size={32} />
      </div>
    );
  }

  if (!kennel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-display font-semibold text-apple-black mb-2">
            Criadero no encontrado
          </h1>
          <p className="text-apple-gray-100 mb-4">
            El criadero que buscas no existe o no está disponible.
          </p>
          <Link to="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = kennel.name ? `${kennel.name} | Criadero en Petwellly` : 'Criadero en Petwellly';
  const pageDescription = kennel.description || `Perros disponibles en ${kennel.name}. Encuentra tu próximo compañero en este criadero registrado en Petwellly.`;

  return (
    <div className="min-h-screen bg-white">
      <SeoHelmet
        title={pageTitle}
        description={pageDescription}
        canonical={`/k/${slug}`}
      />
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'PetStore',
          name: kennel.name,
          description: kennel.description,
          url: `https://petwellly.com/k/${slug}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: kennel.city,
            addressCountry: kennel.country,
          },
          contactPoint: kennel.email
            ? {
                '@type': 'ContactPoint',
                email: kennel.email,
                telephone: kennel.phone,
                contactType: 'sales',
              }
            : undefined,
        }}
      />

      {/* Header */}
      <header className="bg-apple-gray border-b border-apple-gray-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {kennel.logoUrl ? (
                <img
                  src={kennel.logoUrl}
                  alt={kennel.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-apple-blue/10 rounded-lg flex items-center justify-center">
                  <Building2 className="text-apple-blue" size={28} />
                </div>
              )}
              <div>
                <h1 className="text-xl font-display font-semibold text-apple-black">
                  {kennel.name}
                </h1>
                {kennel.city && (
                  <p className="text-sm text-apple-gray-100 flex items-center gap-1">
                    <MapPin size={14} />
                    {kennel.city}, {kennel.country}
                  </p>
                )}
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-sm">
                  Mi cuenta
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-apple-link hover:underline text-sm"
                  >
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Description */}
      {kennel.description && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-apple-gray-200 text-lg max-w-3xl">
            {kennel.description}
          </p>
        </section>
      )}

      {/* Dogs grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-section font-display font-semibold text-apple-black mb-6">
          Perros disponibles
        </h2>

        {dogs?.length === 0 ? (
          <div className="text-center py-12 bg-apple-gray rounded-apple">
            <PawPrint className="mx-auto text-apple-gray-300 mb-4" size={48} />
            <p className="text-apple-gray-100">
              No hay perros disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs?.map((dog: any) => (
              <div
                key={dog.id}
                className="bg-apple-gray rounded-apple overflow-hidden hover:shadow-card transition-shadow"
              >
                <div className="aspect-square bg-white">
                  {dog.photos?.[0]?.url ? (
                    <img
                      src={dog.photos[0].url}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PawPrint className="text-apple-gray-300" size={64} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-apple-black text-lg">
                    {dog.name}
                  </h3>
                  <p className="text-apple-gray-100">{dog.breed?.name}</p>
                  <p className="text-sm text-apple-gray-200 mt-1">
                    {dog.gender === 'MALE' ? 'Macho' : 'Hembra'} •{' '}
                    {new Date(dog.birthDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </p>

                  {/* Reservation button */}
                  {user?.role === 'CUSTOMER' ? (
                    <button
                      onClick={() => navigate(`/reservations/create?dogId=${dog.id}`)}
                      className="mt-4 w-full btn-primary"
                    >
                      Solicitar reserva
                    </button>
                  ) : !user ? (
                    <Link
                      to={`/register?redirect=/k/${slug}`}
                      className="mt-4 w-full btn-primary text-center block"
                    >
                      Regístrate para reservar
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-apple-gray-300/50">
        <h3 className="text-lg font-medium text-apple-black mb-4">Contacto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kennel.email && (
            <a
              href={`mailto:${kennel.email}`}
              className="flex items-center gap-2 text-apple-link hover:underline"
            >
              <Mail size={18} />
              {kennel.email}
            </a>
          )}
          {kennel.phone && (
            <a
              href={`tel:${kennel.phone}`}
              className="flex items-center gap-2 text-apple-link hover:underline"
            >
              <Phone size={18} />
              {kennel.phone}
            </a>
          )}
          {kennel.website && (
            <a
              href={kennel.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-apple-link hover:underline"
            >
              <Globe size={18} />
              Sitio web
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-apple-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-white/60">
            Powered by{' '}
            <Link to="/" className="text-white hover:underline">
              Petwellly
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
