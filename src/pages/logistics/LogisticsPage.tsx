import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { logisticsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Truck,
  Plus,
  Search,
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Programado',
  IN_TRANSIT: 'En tránsito',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  DELAYED: 'Retrasado',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  SCHEDULED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  IN_TRANSIT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  DELIVERED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CANCELLED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  DELAYED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export function LogisticsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', mode: '' });

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );
  const kennelId = myKennels?.[0]?.id;

  const { data: shipmentsRes, isLoading } = useQuery(
    ['shipments', kennelId],
    () => logisticsApi.getShipments({ kennelId }),
    { enabled: !!kennelId }
  );
  const shipments = (shipmentsRes?.data?.shipments || []) as any[];

  const filteredShipments = useMemo(() => {
    let result = [...shipments];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        s.trackingNumber?.toLowerCase().includes(q) ||
        s.destination?.toLowerCase().includes(q) ||
        s.dog?.name?.toLowerCase().includes(q)
      );
    }
    if (filters.status) result = result.filter((s) => s.status === filters.status);
    if (filters.mode) result = result.filter((s) => s.mode === filters.mode);
    return result;
  }, [shipments, search, filters]);

  const activeFiltersCount = [filters.status, filters.mode].filter(Boolean).length;
  const clearFilters = () => { setFilters({ status: '', mode: '' }); setSearch(''); };

  const stats = [
    { label: 'Activos', value: shipments.filter((s) => s.status === 'IN_TRANSIT').length, icon: Truck, color: 'text-amber-600' },
    { label: 'Entregados', value: shipments.filter((s) => s.status === 'DELIVERED').length, icon: Package, color: 'text-green-600' },
    { label: 'Total envíos', value: shipments.length, icon: Calendar, color: 'text-blue-600' },
  ];

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Logística" subtitle="Envíos y transporte de animales" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5"><div className="skeleton h-16 rounded-xl" /></div>
          ))}
        </div>
        <div className="card p-4"><div className="skeleton h-8 w-1/3 mb-4 rounded" /><div className="skeleton h-40 rounded-xl" /></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Logística"
        subtitle="Envíos programados y en tránsito"
        action={
          isBreeder && (
            <button className="btn-primary" onClick={() => navigate('/logistics/shipments/new')}>
              <Plus size={18} />
              Nuevo envío
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center">
              <s.icon className={cn('w-6 h-6', s.color)} />
            </div>
            <div>
              <p className="text-sm text-apple-gray-100">{s.label}</p>
              <p className="text-2xl font-semibold text-apple-black">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar envío, destino o perro..."
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
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todos</option>
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Modo</label>
                <select
                  value={filters.mode}
                  onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todos</option>
                  <option value="GROUND">Terrestre</option>
                  <option value="AIR">Aéreo</option>
                  <option value="SEA">Marítimo</option>
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

      {filteredShipments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay envíos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || activeFiltersCount > 0 ? 'No se encontraron envíos con los filtros aplicados' : 'Comienza registrando tu primer envío'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredShipments.map((s) => (
            <div key={s.id} className="card p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 hover:shadow-sm transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', statusColors[s.status]?.bg, statusColors[s.status]?.text, statusColors[s.status]?.border)}>
                    {statusLabels[s.status]}
                  </span>
                  <span className="text-xs text-apple-gray-300 font-mono">{s.trackingNumber}</span>
                </div>
                <h3 className="font-semibold text-apple-black flex items-center gap-2">
                  {s.origin}
                  <ArrowUpRight size={16} className="text-apple-gray-300 rotate-45" />
                  {s.destination}
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-apple-gray-200">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(s.scheduledDate), 'dd MMM yyyy', { locale: es })}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {s.mode === 'AIR' ? 'Aéreo' : s.mode === 'SEA' ? 'Marítimo' : 'Terrestre'}</span>
                  {s.dog && <span className="flex items-center gap-1.5"><Package size={14} /> {s.dog.name}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-apple-gray-100">Transportista</p>
                  <p className="font-medium text-apple-black">{s.carrier?.name || '—'}</p>
                  {s.cost != null && <p className="text-sm text-apple-gray-200">€{s.cost}</p>}
                </div>
                <Link to={`/logistics/tracking?tracking=${s.trackingNumber}`} className="btn-outline">
                  Seguimiento
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
