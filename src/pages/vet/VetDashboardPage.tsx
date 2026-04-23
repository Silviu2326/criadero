import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { veterinarianApi, medicalApi, dogsApi } from '@/services/api';
import { Building2, AlertTriangle, Search, PawPrint } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function VetDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profile } = useQuery('vetProfile', () =>
    veterinarianApi.getProfile().then((r) => r.data.veterinarian)
  );

  const { data: kennels } = useQuery('vetKennels', () =>
    veterinarianApi.getMyKennels().then((r) => r.data.kennels)
  );

  const { data: alerts } = useQuery('medicalAlerts', () =>
    medicalApi.getAlerts().then((r) => r.data.alerts)
  );

  const { data: searchResults } = useQuery(
    ['dogSearch', searchQuery],
    () => dogsApi.getAll({ search: searchQuery }).then((r) => r.data.dogs),
    { enabled: searchQuery.length >= 2 }
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-section font-display font-semibold text-apple-black">
          Panel Veterinario
        </h1>
        <p className="text-apple-gray-100 mt-1">
          Bienvenido, Dr. {profile?.user?.lastName}
        </p>
      </div>

      {/* Global dog search */}
      <div className="bg-white rounded-apple p-6 mb-8">
        <label className="block text-sm font-medium text-apple-black mb-2">
          <Search size={16} className="inline mr-1" />
          Buscar perro por nombre o microchip
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej. Max o 985112345678901"
            className="input-apple pl-11 w-full"
          />
        </div>

        {searchQuery.length >= 2 && searchResults && (
          <div className="mt-4 space-y-2">
            {searchResults.length === 0 ? (
              <p className="text-sm text-apple-gray-100">No se encontraron perros</p>
            ) : (
              searchResults.map((dog: any) => (
                <Link
                  key={dog.id}
                  to={`/dogs/${dog.id}`}
                  className="flex items-center gap-4 p-3 bg-apple-gray rounded-lg hover:bg-apple-gray-300/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    {dog.photos?.[0]?.url ? (
                      <img src={dog.photos[0].url} alt={dog.name} className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint className="w-full h-full p-2 text-apple-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-apple-black truncate">{dog.name}</p>
                    <p className="text-xs text-apple-gray-100">
                      {dog.breed?.name} • {dog.gender === 'MALE' ? 'Macho' : 'Hembra'}
                      {dog.microchip && ` • ${dog.microchip}`}
                    </p>
                  </div>
                  <Link
                    to={`/vet/records/create?dogId=${dog.id}`}
                    className="btn-primary text-xs px-3 py-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    + Registro
                  </Link>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-apple p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-apple-blue/10 rounded-apple">
              <Building2 className="text-apple-blue" size={24} />
            </div>
            <div>
              <p className="text-sm text-apple-gray-100">Criaderos asignados</p>
              <p className="text-2xl font-semibold">{kennels?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-apple p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-apple">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-apple-gray-100">Alertas próximas</p>
              <p className="text-2xl font-semibold">{alerts?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-apple p-6">
          <h2 className="text-lg font-medium text-apple-black mb-4">
            Mis criaderos
          </h2>
          {kennels?.length ? (
            <div className="space-y-3">
              {kennels.map((kennel: any) => (
                <Link
                  key={kennel.id}
                  to={`/kennels/${kennel.id}`}
                  className="flex items-center justify-between p-4 bg-apple-gray rounded-lg hover:bg-apple-gray-300/30 transition-colors"
                >
                  <span className="font-medium">{kennel.name}</span>
                  <span className="text-sm text-apple-gray-100">
                    {kennel._count?.dogs} perros
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-apple-gray-100 text-center py-8">
              No tienes criaderos asignados
            </p>
          )}
        </div>

        <div className="bg-white rounded-apple p-6">
          <h2 className="text-lg font-medium text-apple-black mb-4">
            Próximas vacunas
          </h2>
          {alerts?.length ? (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert: any) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100"
                >
                  <div>
                    <p className="font-medium">{alert.dog?.name}</p>
                    <p className="text-sm text-apple-gray-100">
                      {alert.type} • {alert.vaccineName || alert.dewormerProduct}
                    </p>
                  </div>
                  <span className="text-sm text-yellow-700">
                    {format(new Date(alert.nextDate), 'dd MMM', { locale: es })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-apple-gray-100 text-center py-8">
              No hay alertas próximas
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
