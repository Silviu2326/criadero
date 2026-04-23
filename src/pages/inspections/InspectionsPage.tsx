import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { inspectionsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { Inspection, InspectionStatus, InspectionType, InspectionResult } from '@/types';
import { cn } from '@/utils/cn';
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  AlertTriangle,
  Stethoscope,
  Calculator,
  Building2,
  FileCheck,
  Search as SearchIcon,
  Baby,
  Dna,
  HeartHandshake,
  Truck,
  ChevronRight,
} from 'lucide-react';

const typeConfig: Record<InspectionType, { label: string; icon: any; color: string }> = {
  HEALTH: { label: 'Sanitaria', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50' },
  FINANCIAL: { label: 'Economica', icon: Calculator, color: 'text-blue-600 bg-blue-50' },
  FACILITY: { label: 'Instalaciones', icon: Building2, color: 'text-slate-600 bg-slate-50' },
  DOCUMENTARY: { label: 'Documental', icon: FileCheck, color: 'text-amber-600 bg-amber-50' },
  PRE_PURCHASE: { label: 'Pre-compra', icon: SearchIcon, color: 'text-violet-600 bg-violet-50' },
  LITTER: { label: 'Camada', icon: Baby, color: 'text-pink-600 bg-pink-50' },
  BREEDING: { label: 'Reproduccion', icon: Dna, color: 'text-indigo-600 bg-indigo-50' },
  WELFARE: { label: 'Bienestar', icon: HeartHandshake, color: 'text-rose-600 bg-rose-50' },
  TRANSPORT: { label: 'Transporte', icon: Truck, color: 'text-orange-600 bg-orange-50' },
};

const statusConfig: Record<InspectionStatus, { label: string; color: string; bg: string; icon: any }> = {
  SCHEDULED: { label: 'Programada', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', icon: Calendar },
  IN_PROGRESS: { label: 'En curso', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: PlayCircle },
  COMPLETED: { label: 'Completada', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelada', color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: XCircle },
};

const resultConfig: Record<InspectionResult, { label: string; color: string; bg: string }> = {
  PASS: { label: 'Aprobada', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  CONDITIONAL: { label: 'Condicional', color: 'text-amber-700', bg: 'bg-amber-100' },
  FAIL: { label: 'No aprobada', color: 'text-red-700', bg: 'bg-red-100' },
};

export function InspectionsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder || user?.role === 'VETERINARIAN' }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: inspectionsData, isLoading } = useQuery(
    ['inspections', kennelId],
    () => inspectionsApi.getAll({ kennelId }).then((r) => r.data.inspections as Inspection[]),
    { enabled: !!kennelId }
  );

  const inspections = inspectionsData || [];

  const filtered = useMemo(() => {
    return inspections.filter((i) => {
      const matchesSearch = !search || i.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || i.type === typeFilter;
      const matchesStatus = !statusFilter || i.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [inspections, search, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: inspections.length,
      scheduled: inspections.filter((i) => i.status === 'SCHEDULED').length,
      inProgress: inspections.filter((i) => i.status === 'IN_PROGRESS').length,
      completed: inspections.filter((i) => i.status === 'COMPLETED').length,
      overdue: inspections.filter((i) => i.status === 'SCHEDULED' && new Date(i.scheduledDate) < new Date()).length,
    };
  }, [inspections]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Inspecciones" subtitle="Cargando..." />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Inspecciones"
        subtitle={`${stats.total} inspecciones registradas`}
        action={
          isBreeder && (
            <Link to="/inspections/create" className="btn-primary">
              <Plus size={18} />
              Nueva Inspeccion
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <ClipboardCheck className="text-slate-600" size={20} />
            </div>
            <span className="text-sm text-apple-gray-100">Total</span>
          </div>
          <p className="text-2xl font-bold text-apple-black">{stats.total}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-apple-gray-100">Programadas</span>
          </div>
          <p className="text-2xl font-bold text-apple-black">{stats.scheduled}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <span className="text-sm text-apple-gray-100">Completadas</span>
          </div>
          <p className="text-2xl font-bold text-apple-black">{stats.completed}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <span className="text-sm text-apple-gray-100">Vencidas</span>
          </div>
          <p className="text-2xl font-bold text-apple-black">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar inspecciones..."
                className="input-apple pl-11 w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-outline',
                showFilters && 'bg-apple-gray',
                (typeFilter || statusFilter) && 'border-apple-blue text-apple-blue'
              )}
            >
              <Filter size={16} />
              Filtros
              {(typeFilter || statusFilter) && (
                <span className="ml-1.5 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">
                  {(typeFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-sm text-apple-gray-100">Tipo:</span>
              <button onClick={() => setTypeFilter('')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', !typeFilter ? 'bg-apple-blue text-white' : 'bg-apple-gray text-apple-gray-200')}>Todos</button>
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setTypeFilter(key)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', typeFilter === key ? 'bg-apple-blue text-white' : 'bg-apple-gray text-apple-gray-200')}>
                  {cfg.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-apple-gray-100">Estado:</span>
              <button onClick={() => setStatusFilter('')} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', !statusFilter ? 'bg-apple-blue text-white' : 'bg-apple-gray text-apple-gray-200')}>Todos</button>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setStatusFilter(key)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium', statusFilter === key ? 'bg-apple-blue text-white' : 'bg-apple-gray text-apple-gray-200')}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay inspecciones</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || typeFilter || statusFilter
              ? 'No se encontraron inspecciones con los filtros seleccionados'
              : 'Comienza creando tu primera inspeccion'}
          </p>
          {isBreeder && !search && !typeFilter && !statusFilter && (
            <Link to="/inspections/create" className="btn-primary">
              <Plus size={18} />
              Crear Inspeccion
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inspection) => {
            const typeCfg = typeConfig[inspection.type] || typeConfig.HEALTH;
            const statusCfg = statusConfig[inspection.status];
            const TypeIcon = typeCfg.icon;
            const StatusIcon = statusCfg.icon;
            const isOverdue = inspection.status === 'SCHEDULED' && new Date(inspection.scheduledDate) < new Date();

            return (
              <Link
                key={inspection.id}
                to={`/inspections/${inspection.id}`}
                className="card card-interactive p-5 flex flex-col lg:flex-row lg:items-center gap-4 group"
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', typeCfg.color)}>
                  <TypeIcon size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-apple-black truncate">{inspection.title}</h3>
                    {isOverdue && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Vencida
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-apple-gray-100">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(inspection.scheduledDate).toLocaleDateString('es-ES')}
                    </span>
                    {inspection.dog && (
                      <span className="flex items-center gap-1">
                        <Stethoscope size={14} />
                        {inspection.dog.name}
                      </span>
                    )}
                    {inspection.litter && (
                      <span className="flex items-center gap-1">
                        <Baby size={14} />
                        Camada
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {inspection._count?.checklistItems || 0} items
                    </span>
                    {(inspection._count?.findings || 0) > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <AlertTriangle size={14} />
                        {inspection._count?.findings} hallazgos
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {inspection.overallResult && (
                    <span className={cn('px-3 py-1 rounded-lg text-xs font-semibold', resultConfig[inspection.overallResult].bg, resultConfig[inspection.overallResult].color)}>
                      {resultConfig[inspection.overallResult].label}
                    </span>
                  )}
                  <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border', statusCfg.bg, statusCfg.color)}>
                    <StatusIcon size={14} />
                    {statusCfg.label}
                  </div>
                  <ChevronRight size={18} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
