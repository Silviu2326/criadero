import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { logisticsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Search, ShieldCheck, AlertCircle, Download, X, SlidersHorizontal } from 'lucide-react';

const typeLabels: Record<string, string> = {
  PASSPORT: 'Pasaporte',
  SANITEF: 'SANITEF',
  HEALTH_CERT: 'Certificado sanitario',
  CITES: 'CITES',
  OTHER: 'Otro',
};

export function LogisticsDocumentsPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ type: '', valid: '' });

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );
  const kennelId = myKennels?.[0]?.id;

  const { data: docsRes, isLoading } = useQuery(
    ['transitDocuments', kennelId],
    () => logisticsApi.getTransitDocuments({ kennelId }),
    { enabled: !!kennelId }
  );
  const documents = (docsRes?.data?.documents || []) as any[];

  const filtered = useMemo(() => {
    let result = [...documents];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.name?.toLowerCase().includes(q));
    }
    if (filters.type) result = result.filter((d) => d.type === filters.type);
    if (filters.valid) result = result.filter((d) => String(d.isValid) === filters.valid);
    return result;
  }, [documents, search, filters]);

  const activeFiltersCount = [filters.type, filters.valid].filter(Boolean).length;
  const clearFilters = () => { setFilters({ type: '', valid: '' }); setSearch(''); };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Documentos de tránsito" subtitle="Pasaportes, SANITEF y certificados" />
        <div className="table-container">
          <table className="table-modern">
            <thead><tr><th>Documento</th><th>Tipo</th><th>Validez</th><th>Acciones</th></tr></thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={4}><div className="skeleton h-10 rounded" /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Documentos de tránsito" subtitle="Gestión documental de envíos internacionales" />

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar documento..."
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
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Tipo</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todos</option>
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Vigente</label>
                <select
                  value={filters.valid}
                  onChange={(e) => setFilters({ ...filters, valid: e.target.value })}
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
            <FileText className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay documentos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">{search || activeFiltersCount > 0 ? 'No se encontraron documentos' : 'Sube tu primer documento de tránsito'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Envío</th>
                <th>Emisión</th>
                <th>Expiración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-apple-gray flex items-center justify-center">
                        <FileText size={18} className="text-apple-gray-200" />
                      </div>
                      <span className="font-medium text-apple-black">{d.name}</span>
                    </div>
                  </td>
                  <td><span className="text-sm text-apple-gray-200">{typeLabels[d.type] || d.type}</span></td>
                  <td><span className="text-xs font-mono text-apple-gray-300">{d.shipmentId}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{d.issuedDate ? format(new Date(d.issuedDate), 'dd MMM yyyy', { locale: es }) : '—'}</span></td>
                  <td><span className="text-sm text-apple-gray-200">{d.expiryDate ? format(new Date(d.expiryDate), 'dd MMM yyyy', { locale: es }) : '—'}</span></td>
                  <td>
                    {d.isValid ? (
                      <span className="badge badge-success text-xs flex items-center gap-1"><ShieldCheck size={12} /> Vigente</span>
                    ) : (
                      <span className="badge badge-danger text-xs flex items-center gap-1"><AlertCircle size={12} /> Vencido</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="p-2 text-apple-gray-100 hover:text-apple-blue hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Descarga de documentos disponible próximamente' })}
                    >
                      <Download size={18} />
                    </button>
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
