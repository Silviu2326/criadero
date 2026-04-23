import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { nutritionApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Plus, Search, AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';

const severityLabels: Record<string, string> = {
  MILD: 'Leve',
  MODERATE: 'Moderada',
  SEVERE: 'Grave',
  LIFE_THREATENING: 'Vital',
};

const severityColors: Record<string, string> = {
  MILD: 'bg-yellow-100 text-yellow-700',
  MODERATE: 'bg-orange-100 text-orange-700',
  SEVERE: 'bg-red-100 text-red-700',
  LIFE_THREATENING: 'bg-red-200 text-red-800',
};

export function IntolerancesPage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: intolerancesData, isLoading } = useQuery(
    ['nutrition-intolerances', kennelId, severityFilter],
    () =>
      nutritionApi
        .getIntolerances({ kennelId, severity: severityFilter || undefined })
        .then((r) => r.data.intolerances),
    { enabled: !!kennelId }
  );

  const deleteMutation = useMutation(
    (id: string) => nutritionApi.deleteIntolerance(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-intolerances']);
        addNotification({ type: 'success', message: 'Intolerancia eliminada' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const intolerances = intolerancesData || [];

  const filtered = useMemo(() => {
    if (!search) return intolerances;
    const searchLower = search.toLowerCase();
    return intolerances.filter(
      (i: any) =>
        i.foodName.toLowerCase().includes(searchLower) ||
        i.dog?.name?.toLowerCase().includes(searchLower) ||
        i.symptoms?.toLowerCase().includes(searchLower)
    );
  }, [intolerances, search]);

  const stats = useMemo(() => {
    const total = intolerances.length;
    const active = intolerances.filter((i: any) => i.isActive).length;
    const severe = intolerances.filter((i: any) => i.severity === 'SEVERE' || i.severity === 'LIFE_THREATENING').length;
    return { total, active, severe };
  }, [intolerances]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Intolerancias" subtitle="Control de intolerancias alimentarias" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="skeleton h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Intolerancias alimentarias"
        subtitle="Registro y seguimiento de intolerancias alimentarias"
        action={
          isBreeder && (
            <Link to="/nutrition/intolerances/new" className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Registrar intolerancia
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total registradas" value={stats.total} icon={AlertTriangle} />
        <StatCard title="Activas" value={stats.active} icon={AlertTriangle} />
        <StatCard title="Graves / Vitales" value={stats.severe} icon={AlertTriangle} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-200" size={18} />
          <input
            type="text"
            placeholder="Buscar por alimento, perro o síntoma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-apple w-full pl-10"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="input-apple w-full sm:w-48"
        >
          <option value="">Todas las severidades</option>
          {Object.entries(severityLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-apple-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-apple-black mb-2">No hay intolerancias</h3>
          <p className="text-apple-gray-200 mb-6">Registra la primera intolerancia alimentaria</p>
          {isBreeder && (
            <Link to="/nutrition/intolerances/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Registrar intolerancia
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>Perro</th>
                <th>Alimento</th>
                <th>Severidad</th>
                <th>Síntomas</th>
                <th>Reacciones</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((intolerance: any) => (
                <tr key={intolerance.id} className={cn(!intolerance.isActive && 'opacity-50')}>
                  <td>
                    <div className="flex items-center gap-3">
                      {intolerance.dog?.photos?.[0]?.url ? (
                        <img src={intolerance.dog.photos[0].url} alt={intolerance.dog.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-apple-gray-200 flex items-center justify-center text-white text-xs font-medium">
                          {intolerance.dog?.name?.[0]}
                        </div>
                      )}
                      <span className="font-medium">{intolerance.dog?.name}</span>
                    </div>
                  </td>
                  <td className="font-medium">{intolerance.foodName}</td>
                  <td>
                    <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium', severityColors[intolerance.severity])}>
                      {severityLabels[intolerance.severity]}
                    </span>
                  </td>
                  <td className="text-sm text-apple-gray-200 max-w-xs truncate">{intolerance.symptoms || '-'}</td>
                  <td className="text-sm">{intolerance._count?.reactions || 0}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/nutrition/intolerances/${intolerance.id}`}
                        className="p-2 text-apple-blue hover:bg-apple-blue/10 rounded-lg transition-colors"
                      >
                        <ArrowRight size={16} />
                      </Link>
                      {isBreeder && (
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar esta intolerancia?')) {
                              deleteMutation.mutate(intolerance.id);
                            }
                          }}
                          className="p-2 text-apple-gray-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
