import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { geneticsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Heart, SlidersHorizontal, X } from 'lucide-react';

const statusLabels: Record<string, string> = {
  PLANNED: 'Planificado',
  APPROVED: 'Aprobado',
  EXECUTED: 'Ejecutado',
  CANCELLED: 'Cancelado',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  PLANNED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  APPROVED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  EXECUTED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CANCELLED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export function GeneticsBreedingPlanPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isBreeder });
  const kennelId = myKennels?.[0]?.id;

  const { data: plansRes, isLoading } = useQuery(['breedingPlans', kennelId], () => geneticsApi.getBreedingPlans({ kennelId }), { enabled: !!kennelId });
  const plans = (plansRes?.data?.plans || []) as any[];

  const filtered = useMemo(() => {
    let result = [...plans];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.father?.name?.toLowerCase().includes(q) || p.mother?.name?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter((p) => p.status === filters.status);
    return result;
  }, [plans, search, filters]);

  const activeFiltersCount = [filters.status].filter(Boolean).length;
  const clearFilters = () => { setFilters({ status: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Planificación de cruces" subtitle="Planes genéticos futuros" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-32 rounded-xl" /></div>)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Planificación de cruces" subtitle={`${filtered.length} planes`} />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar plan o perro..." className="input-apple pl-11 w-full" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={cn('btn-outline relative', showFilters && 'bg-apple-gray', activeFiltersCount > 0 && 'border-apple-blue text-apple-blue')}>
            <SlidersHorizontal size={16} />Filtros
            {activeFiltersCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Estado</label>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input-apple select-apple w-full">
                  <option value="">Todos</option>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && <button onClick={clearFilters} className="mt-4 text-sm text-apple-link hover:text-apple-blue flex items-center gap-1"><X size={14} /> Limpiar filtros</button>}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin planes</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron planes' : 'Crea tu primer plan de cruza'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-apple-black">{p.name}</h3>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', statusColors[p.status]?.bg, statusColors[p.status]?.text, statusColors[p.status]?.border)}>{statusLabels[p.status]}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-apple-gray rounded-lg p-3">
                  <p className="text-xs text-apple-gray-100">Padre</p>
                  <p className="font-medium text-apple-black">{p.father?.name}</p>
                </div>
                <div className="bg-apple-gray rounded-lg p-3">
                  <p className="text-xs text-apple-gray-100">Madre</p>
                  <p className="font-medium text-apple-black">{p.mother?.name}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-apple-gray-200">
                <p><span className="font-medium">COI estimado:</span> {p.predictedCoi ?? '—'}%</p>
                <p><span className="font-medium">Fecha planificada:</span> {p.plannedDate ? format(new Date(p.plannedDate), 'dd MMM yyyy', { locale: es }) : '—'}</p>
                <p><span className="font-medium">Objetivo:</span> {p.goal || '—'}</p>
                {p.notes && <p className="text-apple-gray-300">{p.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
