import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { staffApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Users, Mail, Phone, Briefcase, SlidersHorizontal, X } from 'lucide-react';

const roleLabels: Record<string, string> = {
  CARETAKER: 'Cuidador',
  VETERINARIAN: 'Veterinario',
  RECEPTIONIST: 'Recepcionista',
  HANDLER: 'Handler',
  GROOMER: 'Peluquero',
  MANAGER: 'Gerente',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  ON_LEAVE: 'De baja',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  ACTIVE: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  INACTIVE: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  ON_LEAVE: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export function StaffPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ role: '', status: '' });

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isManager });
  const kennelId = myKennels?.[0]?.id;

  const { data: employeesRes, isLoading } = useQuery(['employees', kennelId], () => staffApi.getEmployees({ kennelId }), { enabled: !!kennelId });
  const employees = (employeesRes?.data?.employees || []) as any[];

  const filtered = useMemo(() => {
    let result = [...employees];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q));
    }
    if (filters.role) result = result.filter((e) => e.role === filters.role);
    if (filters.status) result = result.filter((e) => e.status === filters.status);
    return result;
  }, [employees, search, filters]);

  const activeFiltersCount = [filters.role, filters.status].filter(Boolean).length;
  const clearFilters = () => { setFilters({ role: '', status: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Empleados" subtitle="Directorio del equipo" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-32 rounded-xl" /></div>)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Empleados" subtitle={`${filtered.length} personas en el equipo`} />

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
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Rol</label>
                <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} className="input-apple select-apple w-full">
                  <option value="">Todos</option>
                  {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
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
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><Users className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay empleados</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron empleados' : 'Añade tu primer empleado al equipo'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((e) => (
            <div key={e.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue to-blue-400 flex items-center justify-center text-white font-medium">
                  {e.firstName[0]}{e.lastName[0]}
                </div>
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', statusColors[e.status]?.bg, statusColors[e.status]?.text, statusColors[e.status]?.border)}>{statusLabels[e.status]}</span>
              </div>
              <h3 className="font-semibold text-apple-black">{e.firstName} {e.lastName}</h3>
              <p className="text-sm text-apple-gray-200 mb-3">{roleLabels[e.role]}</p>
              <div className="space-y-1 text-sm text-apple-gray-200">
                <div className="flex items-center gap-2"><Mail size={14} /> <a href={`mailto:${e.email}`} className="hover:text-apple-blue">{e.email}</a></div>
                {e.phone && <div className="flex items-center gap-2"><Phone size={14} /> <a href={`tel:${e.phone}`} className="hover:text-apple-blue">{e.phone}</a></div>}
                <div className="flex items-center gap-2"><Briefcase size={14} /> Desde {format(new Date(e.hireDate), 'MMM yyyy', { locale: es })}</div>
              </div>
              {e.hourlyRate != null && (
                <div className="mt-4 pt-4 border-t border-apple-gray-300/50 text-sm text-apple-gray-300">€{e.hourlyRate}/h</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
