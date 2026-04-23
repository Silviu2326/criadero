import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { showsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trophy, Calendar, MapPin, Search, SlidersHorizontal, X, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusLabels: Record<string, string> = {
  UPCOMING: 'Próximo',
  ONGOING: 'En curso',
  COMPLETED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  UPCOMING: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  ONGOING: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CANCELLED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export function ShowsPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isBreeder });
  const kennelId = myKennels?.[0]?.id;

  const { data: showsRes, isLoading } = useQuery(['shows', kennelId], () => showsApi.getShows({ kennelId }), { enabled: !!kennelId });
  const shows = (showsRes?.data?.shows || []) as any[];

  const filtered = useMemo(() => {
    let result = [...shows];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name?.toLowerCase().includes(q) || s.location?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter((s) => s.status === filters.status);
    return result;
  }, [shows, search, filters]);

  const activeFiltersCount = [filters.status].filter(Boolean).length;
  const clearFilters = () => { setFilters({ status: '' }); setSearch(''); };

  const upcomingCount = shows.filter((s) => s.status === 'UPCOMING').length;

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Exposiciones" subtitle="Calendario de eventos caninos" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-16 rounded-xl" /></div>)}
        </div>
        <div className="card p-4"><div className="skeleton h-40 rounded-xl" /></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Exposiciones" subtitle={`${shows.length} eventos registrados`} action={isBreeder && <Link to="/shows/create" className="btn-primary"><Plus size={18} />Nuevo evento</Link>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><Trophy className="text-amber-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Próximos</p><p className="text-2xl font-semibold text-apple-black">{upcomingCount}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><Calendar className="text-blue-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Este año</p><p className="text-2xl font-semibold text-apple-black">{shows.filter((s) => new Date(s.startDate).getFullYear() === 2026).length}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><MapPin className="text-purple-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Países</p><p className="text-2xl font-semibold text-apple-black">{new Set(shows.map((s) => s.location?.split(',').pop()?.trim())).size}</p></div>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar evento o ubicación..." className="input-apple pl-11 w-full" />
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
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><Trophy className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay eventos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron eventos' : 'Comienza añadiendo tu primera exposición'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="card p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 hover:shadow-sm transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', statusColors[s.status]?.bg, statusColors[s.status]?.text, statusColors[s.status]?.border)}>{statusLabels[s.status]}</span>
                  {s.federation && <span className="text-xs text-apple-gray-300 font-medium">{s.federation}</span>}
                </div>
                <h3 className="font-semibold text-apple-black">{s.name}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-apple-gray-200">
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {s.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(s.startDate), 'dd MMM yyyy', { locale: es })} {s.endDate && ` - ${format(new Date(s.endDate), 'dd MMM yyyy', { locale: es })}`}</span>
                  <span className="flex items-center gap-1.5"><Trophy size={14} /> €{s.entryFee}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {s.website && (
                  <a href={s.website} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={16} />Web</a>
                )}
                <button
                  className="btn-outline"
                  onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Inscripción de perros disponible próximamente' })}
                >
                  Inscribir perro
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
