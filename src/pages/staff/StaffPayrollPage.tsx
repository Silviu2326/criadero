import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { staffApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Euro, SlidersHorizontal, X } from 'lucide-react';

const statusLabels: Record<string, string> = {
  DRAFT: 'Borrador',
  APPROVED: 'Aprobado',
  PAID: 'Pagado',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  APPROVED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  PAID: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

export function StaffPayrollPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isManager });
  const kennelId = myKennels?.[0]?.id;

  const { data: payrollRes, isLoading } = useQuery(['payroll', kennelId], () => staffApi.getPayroll({ kennelId }), { enabled: !!kennelId });
  const payroll = (payrollRes?.data?.payroll || []) as any[];

  const filtered = useMemo(() => {
    let result = [...payroll];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.employee?.firstName?.toLowerCase().includes(q) || p.employee?.lastName?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter((p) => p.status === filters.status);
    return result;
  }, [payroll, search, filters]);

  const activeFiltersCount = [filters.status].filter(Boolean).length;
  const clearFilters = () => { setFilters({ status: '' }); setSearch(''); };

  const totalPay = filtered.reduce((sum, p) => sum + (p.totalPay || 0), 0);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Nómina" subtitle="Pagos y horas extras" />
        <div className="table-container"><table className="table-modern"><thead><tr><th>Empleado</th><th>Período</th><th>Total</th><th>Estado</th></tr></thead><tbody>{Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={4}><div className="skeleton h-10 rounded" /></td></tr>)}</tbody></table></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Nómina" subtitle={`${filtered.length} registros · Total €${totalPay.toLocaleString()}`} />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empleado..." className="input-apple pl-11 w-full" />
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
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><Euro className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin nómina</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron registros' : 'Registra el primer pago del equipo'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead><tr><th>Empleado</th><th>Período</th><th>Horas</th><th>Extras</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue to-blue-400 flex items-center justify-center text-white font-medium">
                        {p.employee?.firstName?.[0]}{p.employee?.lastName?.[0]}
                      </div>
                      <span className="font-medium text-apple-black">{p.employee?.firstName} {p.employee?.lastName}</span>
                    </div>
                  </td>
                  <td><span className="text-sm text-apple-gray-200">{format(new Date(p.periodStart), 'dd MMM', { locale: es })} - {format(new Date(p.periodEnd), 'dd MMM yyyy', { locale: es })}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{p.regularHours}h</span></td>
                  <td><span className="text-sm text-apple-gray-200">{p.overtimeHours}h</span></td>
                  <td><span className="font-medium text-apple-black">€{p.totalPay.toLocaleString()}</span></td>
                  <td><span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', statusColors[p.status]?.bg, statusColors[p.status]?.text, statusColors[p.status]?.border)}>{statusLabels[p.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
