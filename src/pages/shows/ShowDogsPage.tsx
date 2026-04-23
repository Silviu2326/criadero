import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { showsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { Search, SlidersHorizontal, X, Dog, Award, User } from 'lucide-react';

const statusLabels: Record<string, string> = {
  REGISTERED: 'Inscrito',
  CONFIRMED: 'Confirmado',
  WITHDRAWN: 'Retirado',
  COMPETED: 'Compitió',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  REGISTERED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  CONFIRMED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  WITHDRAWN: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  COMPETED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export function ShowDogsPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isBreeder });
  const kennelId = myKennels?.[0]?.id;

  const { data: dogsRes, isLoading } = useQuery(['showDogs', kennelId], () => showsApi.getShowDogs({ kennelId }), { enabled: !!kennelId });
  const showDogs = (dogsRes?.data?.showDogs || []) as any[];

  const filtered = useMemo(() => {
    let result = [...showDogs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((sd) => sd.dog?.name?.toLowerCase().includes(q) || sd.show?.name?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter((sd) => sd.status === filters.status);
    return result;
  }, [showDogs, search, filters]);

  const activeFiltersCount = [filters.status].filter(Boolean).length;
  const clearFilters = () => { setFilters({ status: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Perros inscritos" subtitle="Gestión de inscripciones a exposiciones" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-32 rounded-xl" /></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Perros inscritos" subtitle={`${filtered.length} inscripciones`} />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar perro o evento..." className="input-apple pl-11 w-full" />
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
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><Dog className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay inscripciones</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron inscripciones' : 'Inscribe tu primer perro a una exposición'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((sd) => (
            <div key={sd.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', statusColors[sd.status]?.bg, statusColors[sd.status]?.text, statusColors[sd.status]?.border)}>{statusLabels[sd.status]}</span>
              </div>
              <h3 className="font-semibold text-apple-black">{sd.dog?.name}</h3>
              <p className="text-sm text-apple-gray-200 mb-3">{sd.dog?.breed?.name}</p>
              <div className="space-y-2 text-sm text-apple-gray-200">
                <div className="flex items-center gap-2"><Award size={14} /> {sd.className || '—'}</div>
                <div className="flex items-center gap-2"><User size={14} /> {sd.handlerName || '—'}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-apple-gray-300/50 text-xs text-apple-gray-300 truncate">{sd.show?.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
