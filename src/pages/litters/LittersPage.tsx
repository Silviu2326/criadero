import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { littersApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  Baby,
  Plus,
  Search,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Grid3X3,
  List,
  TrendingUp,
  PawPrint,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export function LittersPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: litters, isLoading } = useQuery(
    ['litters', kennelId],
    () => littersApi.getAll({ kennelId }).then((r) => r.data.litters),
    { enabled: !!kennelId }
  );

  const filteredLitters = litters?.filter((litter: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      litter.father?.name?.toLowerCase().includes(searchLower) ||
      litter.mother?.name?.toLowerCase().includes(searchLower) ||
      litter.notes?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate stats
  const stats = {
    total: litters?.length || 0,
    totalPuppies: litters?.reduce((acc: number, l: any) => acc + (l.puppyCount || 0), 0) || 0,
    thisMonth: litters?.filter((l: any) => {
      const date = new Date(l.birthDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length || 0,
    avgLitterSize: litters?.length
      ? Math.round(litters.reduce((acc: number, l: any) => acc + (l.puppyCount || 0), 0) / litters.length)
      : 0,
  };

  // Get age in weeks
  const getAgeInWeeks = (birthDate: string) => {
    const days = differenceInDays(new Date(), new Date(birthDate));
    return Math.floor(days / 7);
  };

  // Get puppy status based on age
  const getPuppyStatus = (birthDate: string) => {
    const weeks = getAgeInWeeks(birthDate);
    if (weeks < 2) return { label: 'Recién nacidos', color: 'bg-pink-100 text-pink-700' };
    if (weeks < 4) return { label: 'Lactancia', color: 'bg-blue-100 text-blue-700' };
    if (weeks < 8) return { label: 'Destete', color: 'bg-amber-100 text-amber-700' };
    if (weeks < 12) return { label: 'Disponibles pronto', color: 'bg-green-100 text-green-700' };
    return { label: 'Disponibles', color: 'bg-green-100 text-green-700' };
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Camadas" subtitle="Registro de camadas y cachorros" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="h-32 skeleton" />
              <div className="p-6 space-y-3">
                <div className="skeleton h-5 w-32" />
                <div className="skeleton h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Camadas"
        subtitle={`${stats.total} camadas registradas • ${stats.totalPuppies} cachorros nacidos`}
        action={
          isBreeder && (
            <Link to="/litters/create" className="btn-primary">
              <Plus size={18} />
              Nueva camada
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Camadas"
          value={stats.total}
          icon={Baby}
          color="blue"
        />
        <StatCard
          title="Cachorros Nacidos"
          value={stats.totalPuppies}
          icon={PawPrint}
          color="purple"
        />
        <StatCard
          title="Este Mes"
          value={stats.thisMonth}
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Promedio por Camada"
          value={stats.avgLitterSize}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por padres o notas..."
              className="input-apple pl-11 w-full"
            />
          </div>

          <div className="flex items-center gap-2 bg-apple-gray rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-white shadow-sm text-apple-blue' : 'text-apple-gray-100'
              )}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-white shadow-sm text-apple-blue' : 'text-apple-gray-100'
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredLitters?.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Baby className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay camadas</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search
              ? 'No se encontraron camadas con ese criterio de búsqueda'
              : 'Comienza registrando tu primera camada de cachorros'}
          </p>
          {isBreeder && !search && (
            <Link to="/litters/create" className="btn-primary">
              <Plus size={18} />
              Registrar Camada
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
              {filteredLitters?.map((litter: any) => {
                const weeks = getAgeInWeeks(litter.birthDate);
                const status = getPuppyStatus(litter.birthDate);
                const puppyCount = litter._count?.puppies || litter.puppies?.length || litter.puppyCount || 0;

                return (
                  <Link
                    key={litter.id}
                    to={`/litters/${litter.id}`}
                    className="group card overflow-hidden card-interactive flex flex-col"
                  >
                    {/* Header with gradient */}
                    <div className="h-28 bg-gradient-to-br from-pink-400 via-pink-300 to-purple-300 relative">
                      <div className="absolute top-4 left-4">
                        <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-apple-black text-xs font-medium backdrop-blur-sm">
                          <Clock size={12} />
                          {weeks} semanas
                        </span>
                      </div>

                      {/* Puppy count badge */}
                      <div className="absolute -bottom-6 left-6">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-2xl font-bold text-apple-black">{puppyCount}</span>
                            <span className="text-xs text-apple-gray-100 block -mt-1">cachorros</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-8 px-6 pb-6 flex-1 flex flex-col">
                      {/* Parents */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium mb-1">Padre</p>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">♂</span>
                            <p className="font-medium text-apple-black truncate">
                              {litter.father?.name || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
                          <p className="text-xs text-pink-600 font-medium mb-1">Madre</p>
                          <div className="flex items-center gap-2">
                            <span className="text-pink-500">♀</span>
                            <p className="font-medium text-apple-black truncate">
                              {litter.mother?.name || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Birth date */}
                      <div className="flex items-center gap-2 text-sm text-apple-gray-200 mb-3">
                        <Calendar size={14} />
                        <span>Nacidos el {format(new Date(litter.birthDate), 'dd MMMM yyyy', { locale: es })}</span>
                      </div>

                      {litter.notes && (
                        <p className="text-sm text-apple-gray-200 line-clamp-2 mb-4">
                          {litter.notes}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="mt-auto pt-4 border-t border-apple-gray-300/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-sm text-apple-gray-200">
                              <CheckCircle2 size={14} className="text-green-500" />
                              <span>{litter.puppyCount} vivos</span>
                            </div>
                            {litter.deadPuppies > 0 && (
                              <div className="flex items-center gap-1.5 text-sm text-apple-gray-200">
                                <AlertCircle size={14} className="text-red-500" />
                                <span>{litter.deadPuppies} fallecidos</span>
                              </div>
                            )}
                          </div>
                          <ChevronRight size={18} className="text-apple-gray-300 group-hover:text-apple-blue group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="table-container">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Camada</th>
                    <th>Padres</th>
                    <th>Fecha</th>
                    <th>Cachorros</th>
                    <th>Edad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLitters?.map((litter: any) => {
                    const weeks = getAgeInWeeks(litter.birthDate);
                    const status = getPuppyStatus(litter.birthDate);
                    const puppyCount = litter._count?.puppies || litter.puppies?.length || litter.puppyCount || 0;

                    return (
                      <tr key={litter.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0">
                              <Baby className="text-pink-600" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-apple-black">
                                Camada #{litter.id.slice(-6)}
                              </p>
                              {litter.notes && (
                                <p className="text-xs text-apple-gray-200 truncate max-w-[200px]">
                                  {litter.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm">
                              <span className="text-blue-500">♂</span>
                              <span className="text-apple-gray-200">{litter.father?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm">
                              <span className="text-pink-500">♀</span>
                              <span className="text-apple-gray-200">{litter.mother?.name || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-sm text-apple-gray-200">
                            <Calendar size={14} />
                            {format(new Date(litter.birthDate), 'dd MMM yyyy', { locale: es })}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 font-semibold text-sm">
                              {puppyCount}
                            </span>
                            <span className="text-sm text-apple-gray-200">cachorros</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm text-apple-gray-200">{weeks} semanas</span>
                        </td>
                        <td>
                          <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', status.color)}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/litters/${litter.id}`}
                            className="text-apple-link hover:text-apple-blue text-sm font-medium"
                          >
                            Ver detalles →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
