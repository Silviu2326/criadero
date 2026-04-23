import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { logisticsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { Search, Star, Award, Phone, Mail, ShieldCheck, X, SlidersHorizontal } from 'lucide-react';

export function CarriersPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ certified: '', active: '' });

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );
  const kennelId = myKennels?.[0]?.id;

  const { data: carriersRes, isLoading } = useQuery(
    ['carriers', kennelId],
    () => logisticsApi.getCarriers({ kennelId }),
    { enabled: !!kennelId }
  );
  const carriers = (carriersRes?.data?.carriers || []) as any[];

  const filtered = useMemo(() => {
    let result = [...carriers];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.name?.toLowerCase().includes(q) || c.contactName?.toLowerCase().includes(q)
      );
    }
    if (filters.certified) result = result.filter((c) => String(c.isCertified) === filters.certified);
    if (filters.active) result = result.filter((c) => String(c.active) === filters.active);
    return result;
  }, [carriers, search, filters]);

  const activeFiltersCount = [filters.certified, filters.active].filter(Boolean).length;
  const clearFilters = () => { setFilters({ certified: '', active: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Transportistas" subtitle="Gestión de transportistas certificados" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5"><div className="skeleton h-16 rounded-xl" /></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Transportistas" subtitle="Transportistas certificados y contactos" />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar transportista..."
              className="input-apple pl-11 w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn('btn-outline relative', showFilters && 'bg-apple-gray', activeFiltersCount > 0 && 'border-apple-blue text-apple-blue')}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">{activeFiltersCount}</span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Certificado</label>
                <select
                  value={filters.certified}
                  onChange={(e) => setFilters({ ...filters, certified: e.target.value })}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Activo</label>
                <select
                  value={filters.active}
                  onChange={(e) => setFilters({ ...filters, active: e.target.value })}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="mt-4 text-sm text-apple-link hover:text-apple-blue flex items-center gap-1">
                <X size={14} /> Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay transportistas</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron resultados' : 'Registra tu primer transportista certificado'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="card p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-apple-black">{c.name}</h3>
                  {c.isCertified && <span className="badge badge-success text-xs flex items-center gap-1"><ShieldCheck size={12} /> Certificado</span>}
                  {!c.active && <span className="badge badge-neutral text-xs">Inactivo</span>}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-apple-gray-200">
                  <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-500" /> {c.rating || '—'}</span>
                  {c.contactName && <span>{c.contactName}</span>}
                  {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 hover:text-apple-blue"><Phone size={14} /> {c.phone}</a>}
                  {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-apple-blue"><Mail size={14} /> {c.email}</a>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(c.certifications || []).map((cert: string) => (
                  <span key={cert} className="px-2 py-1 rounded-md bg-apple-gray text-xs font-medium text-apple-gray-200 flex items-center gap-1">
                    <Award size={12} /> {cert}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
