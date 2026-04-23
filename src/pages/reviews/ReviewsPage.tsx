import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { reviewsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star, MessageSquare, Search, SlidersHorizontal, X } from 'lucide-react';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PUBLISHED: 'Publicada',
  REJECTED: 'Rechazada',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  PUBLISHED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const sourceLabels: Record<string, string> = {
  INTERNAL: 'Interna',
  TRUSTPILOT: 'Trustpilot',
  GOOGLE: 'Google',
};

export function ReviewsPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', source: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isManager });
  const kennelId = myKennels?.[0]?.id;

  const { data: reviewsRes, isLoading } = useQuery(['reviews', kennelId], () => reviewsApi.getReviews({ kennelId }), { enabled: !!kennelId });
  const reviews = (reviewsRes?.data?.reviews || []) as any[];

  const filtered = useMemo(() => {
    let result = [...reviews];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.comment?.toLowerCase().includes(q) || r.customer?.firstName?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter((r) => r.status === filters.status);
    if (filters.source) result = result.filter((r) => r.source === filters.source);
    return result;
  }, [reviews, search, filters]);

  const activeFiltersCount = [filters.status, filters.source].filter(Boolean).length;
  const clearFilters = () => { setFilters({ status: '', source: '' }); setSearch(''); };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Reseñas" subtitle="Opiniones de clientes" />
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-24 rounded-xl" /></div>)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Reseñas" subtitle={`${filtered.length} reseñas · Media ${avgRating} ⭐`} />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar reseña o cliente..." className="input-apple pl-11 w-full" />
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
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Origen</label>
                <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })} className="input-apple select-apple w-full">
                  <option value="">Todos</option>
                  {Object.entries(sourceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && <button onClick={clearFilters} className="mt-4 text-sm text-apple-link hover:text-apple-blue flex items-center gap-1"><X size={14} /> Limpiar filtros</button>}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><MessageSquare className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay reseñas</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron reseñas' : 'Aún no tienes reseñas registradas'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-apple-black">{r.customer?.firstName} {r.customer?.lastName}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', statusColors[r.status]?.bg, statusColors[r.status]?.text, statusColors[r.status]?.border)}>{statusLabels[r.status]}</span>
                    {r.verifiedPurchase && <span className="text-xs text-green-600 font-medium">Compra verificada</span>}
                    <span className="text-xs text-apple-gray-300">{sourceLabels[r.source]}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-apple-gray-300'} />
                    ))}
                  </div>
                  <p className="text-sm text-apple-gray-200">{r.comment || 'Sin comentario'}</p>
                  {r.reply && (
                    <div className="mt-3 bg-apple-gray rounded-lg p-3 text-sm text-apple-gray-200">
                      <span className="font-medium text-apple-black">Respuesta:</span> {r.reply}
                    </div>
                  )}
                </div>
                <div className="text-xs text-apple-gray-300">{format(new Date(r.createdAt), 'dd MMM yyyy', { locale: es })}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
