import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { staffApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, GraduationCap, AlertTriangle, CheckCircle2, SlidersHorizontal, X } from 'lucide-react';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  EXPIRED: 'Vencido',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  EXPIRED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export function StaffTrainingPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isManager });
  const kennelId = myKennels?.[0]?.id;

  const { data: coursesRes, isLoading } = useQuery(['trainingCourses', kennelId], () => staffApi.getTrainingCourses({ kennelId }), { enabled: !!kennelId });
  const courses = (coursesRes?.data?.courses || []) as any[];

  const filtered = useMemo(() => {
    let result = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name?.toLowerCase().includes(q) || c.employee?.firstName?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter((c) => c.status === filters.status);
    return result;
  }, [courses, search, filters]);

  const activeFiltersCount = [filters.status].filter(Boolean).length;
  const clearFilters = () => { setFilters({ status: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Formación" subtitle="Cursos y certificaciones del equipo" />
        <div className="table-container"><table className="table-modern"><thead><tr><th>Curso</th><th>Empleado</th><th>Estado</th><th>Vencimiento</th></tr></thead><tbody>{Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={4}><div className="skeleton h-10 rounded" /></td></tr>)}</tbody></table></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Formación" subtitle={`${filtered.length} cursos y certificaciones`} />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar curso o empleado..." className="input-apple pl-11 w-full" />
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
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><GraduationCap className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin cursos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron cursos' : 'Registra el primer curso de formación'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead><tr><th>Curso</th><th>Empleado</th><th>Proveedor</th><th>Completado</th><th>Vencimiento</th><th>Estado</th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td><span className="font-medium text-apple-black">{c.name}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{c.employee?.firstName} {c.employee?.lastName}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{c.provider || '—'}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{c.completedDate ? format(new Date(c.completedDate), 'dd MMM yyyy', { locale: es }) : '—'}</span></td>
                  <td>
                    <span className={cn('text-sm', c.status === 'EXPIRED' ? 'text-red-600' : 'text-apple-gray-200')}>
                      {c.expiryDate ? format(new Date(c.expiryDate), 'dd MMM yyyy', { locale: es }) : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit', statusColors[c.status]?.bg, statusColors[c.status]?.text, statusColors[c.status]?.border)}>
                      {c.status === 'EXPIRED' ? <AlertTriangle size={12} /> : c.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : null}
                      {statusLabels[c.status]}
                    </span>
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
