import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { showsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import {cn} from '@/utils/cn';
import { Search, Wallet, CheckCircle2, XCircle, SlidersHorizontal, X } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  ENTRY: 'Inscripción',
  TRAVEL: 'Viaje',
  LODGING: 'Alojamiento',
  GROOMING: 'Grooming',
  OTHER: 'Otro',
};

const categoryColors: Record<string, string> = {
  ENTRY: 'bg-blue-50 text-blue-700 border-blue-200',
  TRAVEL: 'bg-amber-50 text-amber-700 border-amber-200',
  LODGING: 'bg-purple-50 text-purple-700 border-purple-200',
  GROOMING: 'bg-pink-50 text-pink-700 border-pink-200',
  OTHER: 'bg-gray-50 text-gray-700 border-gray-200',
};

export function ShowBudgetPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '', paid: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isBreeder });
  const kennelId = myKennels?.[0]?.id;

  const { data: budgetRes, isLoading } = useQuery(['showBudget', kennelId], () => showsApi.getShowBudget({ kennelId }), { enabled: !!kennelId });
  const items = (budgetRes?.data?.budgetItems || []) as any[];

  const filtered = useMemo(() => {
    let result = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.concept?.toLowerCase().includes(q) || i.show?.name?.toLowerCase().includes(q));
    }
    if (filters.category) result = result.filter((i) => i.category === filters.category);
    if (filters.paid) result = result.filter((i) => String(i.paid) === filters.paid);
    return result;
  }, [items, search, filters]);

  const activeFiltersCount = [filters.category, filters.paid].filter(Boolean).length;
  const clearFilters = () => { setFilters({ category: '', paid: '' }); setSearch(''); };

  const totalEstimated = filtered.reduce((sum, i) => sum + (i.estimatedCost || 0), 0);
  const totalActual = filtered.reduce((sum, i) => sum + (i.actualCost || 0), 0);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Presupuesto" subtitle="Gastos de exposiciones" />
        <div className="card p-4"><div className="skeleton h-40 rounded-xl" /></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Presupuesto" subtitle={`${filtered.length} conceptos registrados`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><Wallet className="text-blue-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Estimado</p><p className="text-2xl font-semibold text-apple-black">€{totalEstimated.toLocaleString()}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><Wallet className="text-green-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Gastado</p><p className="text-2xl font-semibold text-apple-black">€{totalActual.toLocaleString()}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><Wallet className="text-amber-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Diferencia</p><p className="text-2xl font-semibold text-apple-black">€{(totalEstimated - totalActual).toLocaleString()}</p></div>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar concepto o evento..." className="input-apple pl-11 w-full" />
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
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Pagado</label>
                <select value={filters.paid} onChange={(e) => setFilters({ ...filters, paid: e.target.value })} className="input-apple select-apple w-full">
                  <option value="">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && <button onClick={clearFilters} className="mt-4 text-sm text-apple-link hover:text-apple-blue flex items-center gap-1"><X size={14} /> Limpiar filtros</button>}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><Wallet className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin presupuestos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron conceptos' : 'Añade tu primer gasto de exposición'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Concepto</th>
                <th>Categoría</th>
                <th>Estimado</th>
                <th>Real</th>
                <th>Diferencia</th>
                <th>Pagado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td><span className="text-sm text-apple-gray-200">{i.show?.name}</span></td>
                  <td><span className="font-medium text-apple-black">{i.concept}</span></td>
                  <td><span className={cn('px-2 py-1 rounded-full text-xs font-medium border', categoryColors[i.category])}>{categoryLabels[i.category]}</span></td>
                  <td><span className="text-sm text-apple-gray-200">€{i.estimatedCost}</span></td>
                  <td><span className="text-sm text-apple-black">€{i.actualCost ?? '—'}</span></td>
                  <td><span className={cn('text-sm', (i.actualCost || 0) > i.estimatedCost ? 'text-red-600' : 'text-green-600')}>€{((i.actualCost || 0) - i.estimatedCost).toLocaleString()}</span></td>
                  <td>{i.paid ? <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 size={14} /> Sí</span> : <span className="flex items-center gap-1 text-gray-500 text-sm"><XCircle size={14} /> No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
