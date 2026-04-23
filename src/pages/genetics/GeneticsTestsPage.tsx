import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { geneticsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, FlaskConical, SlidersHorizontal, X } from 'lucide-react';

const resultLabels: Record<string, { label: string; color: string }> = {
  CLEAR: { label: 'Libre', color: 'bg-green-50 text-green-700 border-green-200' },
  CARRIER: { label: 'Portador', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  AFFECTED: { label: 'Afectado', color: 'bg-red-50 text-red-700 border-red-200' },
  PENDING: { label: 'Pendiente', color: 'bg-gray-50 text-gray-700 border-gray-200' },
};

export function GeneticsTestsPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ result: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isBreeder });
  const kennelId = myKennels?.[0]?.id;

  const { data: testsRes, isLoading } = useQuery(['geneticTests', kennelId], () => geneticsApi.getGeneticTests({ kennelId }), { enabled: !!kennelId });
  const tests = (testsRes?.data?.tests || []) as any[];

  const filtered = useMemo(() => {
    let result = [...tests];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.dog?.name?.toLowerCase().includes(q) || t.testName?.toLowerCase().includes(q));
    }
    if (filters.result) result = result.filter((t) => t.result === filters.result);
    return result;
  }, [tests, search, filters]);

  const activeFiltersCount = [filters.result].filter(Boolean).length;
  const clearFilters = () => { setFilters({ result: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Pruebas genéticas" subtitle="Resultados de ADN y pruebas de salud" />
        <div className="table-container">
          <table className="table-modern"><thead><tr><th>Perro</th><th>Prueba</th><th>Resultado</th><th>Fecha</th></tr></thead><tbody>{Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={4}><div className="skeleton h-10 rounded" /></td></tr>)}</tbody></table>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Pruebas genéticas" subtitle={`${filtered.length} resultados`} />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar perro o prueba..." className="input-apple pl-11 w-full" />
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
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Resultado</label>
                <select value={filters.result} onChange={(e) => setFilters({ ...filters, result: e.target.value })} className="input-apple select-apple w-full">
                  <option value="">Todos</option>
                  {Object.entries(resultLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && <button onClick={clearFilters} className="mt-4 text-sm text-apple-link hover:text-apple-blue flex items-center gap-1"><X size={14} /> Limpiar filtros</button>}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><FlaskConical className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin pruebas</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron resultados' : 'Añade tu primera prueba genética'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead><tr><th>Perro</th><th>Prueba</th><th>Laboratorio</th><th>Resultado</th><th>Fecha</th></tr></thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-apple-gray flex items-center justify-center"><FlaskConical size={18} className="text-apple-gray-200" /></div>
                      <span className="font-medium text-apple-black">{t.dog?.name}</span>
                    </div>
                  </td>
                  <td><span className="text-sm text-apple-gray-200">{t.testName}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{t.labName || '—'}</span></td>
                  <td><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', resultLabels[t.result]?.color)}>{resultLabels[t.result]?.label || t.result}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{format(new Date(t.testDate), 'dd MMM yyyy', { locale: es })}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
