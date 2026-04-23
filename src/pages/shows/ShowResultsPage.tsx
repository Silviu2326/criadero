import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { showsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { Search, Trophy, Medal, SlidersHorizontal, X } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  BIS: 'BIS', BOB: 'BOB', BOS: 'BOS', G1: 'G1', G2: 'G2', G3: 'G3', G4: 'G4', RES: 'RES', JCAC: 'JCAC', CAC: 'CAC', CACIB: 'CACIB',
};

export function ShowResultsPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isBreeder });
  const kennelId = myKennels?.[0]?.id;

  const { data: resultsRes, isLoading } = useQuery(['showResults', kennelId], () => showsApi.getShowResults({ kennelId }), { enabled: !!kennelId });
  const results = (resultsRes?.data?.results || []) as any[];

  const filtered = useMemo(() => {
    let result = [...results];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.dog?.name?.toLowerCase().includes(q) || r.show?.name?.toLowerCase().includes(q));
    }
    if (filters.category) result = result.filter((r) => r.category === filters.category);
    return result;
  }, [results, search, filters]);

  const activeFiltersCount = [filters.category].filter(Boolean).length;
  const clearFilters = () => { setFilters({ category: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Resultados" subtitle="Títulos y logros obtenidos" />
        <div className="table-container"><table className="table-modern"><thead><tr><th>Evento</th><th>Perro</th><th>Categoría</th><th>Puesto</th><th>Puntos</th></tr></thead><tbody>{Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={5}><div className="skeleton h-10 rounded" /></td></tr>)}</tbody></table></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Resultados" subtitle={`${filtered.length} resultados registrados`} />

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
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Categoría</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input-apple select-apple w-full">
                  <option value="">Todas</option>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
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
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin resultados</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron resultados' : 'Registra los títulos obtenidos en exposiciones'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Perro</th>
                <th>Categoría</th>
                <th>Puesto</th>
                <th>Puntos</th>
                <th>Juez</th>
                <th>Título</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><span className="text-sm text-apple-gray-200">{r.show?.name}</span></td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-apple-gray flex items-center justify-center"><Medal size={18} className="text-apple-gray-200" /></div>
                      <span className="font-medium text-apple-black">{r.dog?.name}</span>
                    </div>
                  </td>
                  <td><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">{categoryLabels[r.category] || r.category}</span></td>
                  <td><span className="font-medium text-apple-black">#{r.placement}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{r.points}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{r.judgeName || '—'}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{r.titleEarned || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
