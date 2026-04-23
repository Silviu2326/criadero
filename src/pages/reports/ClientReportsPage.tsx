import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { clientReportApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Plus, Search, FileText, Trash2, ArrowRight, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';

const statusLabels: Record<string, string> = {
  DRAFT: 'Borrador',
  FINALIZED: 'Finalizado',
  SENT: 'Enviado',
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  FINALIZED: 'bg-blue-100 text-blue-700',
  SENT: 'bg-green-100 text-green-700',
};

export function ClientReportsPage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: reportsData, isLoading } = useQuery(
    ['client-reports', kennelId, statusFilter],
    () =>
      clientReportApi
        .getAll({ kennelId, status: statusFilter || undefined })
        .then((r) => r.data.reports),
    { enabled: !!kennelId }
  );

  const deleteMutation = useMutation(
    (id: string) => clientReportApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['client-reports']);
        addNotification({ type: 'success', message: 'Informe eliminado' });
      },
    }
  );

  const reports = reportsData || [];

  const filtered = useMemo(() => {
    if (!search) return reports;
    const searchLower = search.toLowerCase();
    return reports.filter(
      (r: any) =>
        r.title.toLowerCase().includes(searchLower) ||
        r.dog?.name?.toLowerCase().includes(searchLower) ||
        r.customer?.firstName?.toLowerCase().includes(searchLower)
    );
  }, [reports, search]);

  const stats = useMemo(() => {
    const total = reports.length;
    const draft = reports.filter((r: any) => r.status === 'DRAFT').length;
    const finalized = reports.filter((r: any) => r.status === 'FINALIZED' || r.status === 'SENT').length;
    return { total, draft, finalized };
  }, [reports]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Informes al cliente" subtitle="Informes profesionales de entrega" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="skeleton h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Informes al cliente"
        subtitle="Informes profesionales para la entrega de cachorros"
        action={
          isBreeder && (
            <Link to="/reports/client/new" className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Generar informe
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total informes" value={stats.total} icon={FileText} />
        <StatCard title="Borradores" value={stats.draft} icon={FileText} />
        <StatCard title="Finalizados" value={stats.finalized} icon={CheckCircle} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-200" size={18} />
          <input
            type="text"
            placeholder="Buscar por título, perro o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-apple w-full pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-apple w-full sm:w-48"
        >
          <option value="">Todos los estados</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-apple-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-apple-black mb-2">No hay informes</h3>
          <p className="text-apple-gray-200 mb-6">Genera tu primer informe profesional para un cliente</p>
          {isBreeder && (
            <Link to="/reports/client/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Generar informe
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>Informe</th>
                <th>Perro</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report: any) => (
                <tr key={report.id}>
                  <td>
                    <p className="font-medium text-apple-black">{report.title}</p>
                    <p className="text-xs text-apple-gray-200">{report.reportType}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {report.dog?.photos?.[0]?.url ? (
                        <img src={report.dog.photos[0].url} alt={report.dog.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-apple-gray-200 flex items-center justify-center text-white text-xs font-medium">
                          {report.dog?.name?.[0]}
                        </div>
                      )}
                      <span>{report.dog?.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-apple-gray-200">
                    {report.customer ? `${report.customer.firstName} ${report.customer.lastName}` : '-'}
                  </td>
                  <td>
                    <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium', statusColors[report.status])}>
                      {statusLabels[report.status]}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/reports/client/${report.id}`}
                        className="p-2 text-apple-blue hover:bg-apple-blue/10 rounded-lg transition-colors"
                      >
                        <ArrowRight size={16} />
                      </Link>
                      {isBreeder && report.status === 'DRAFT' && (
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este informe?')) {
                              deleteMutation.mutate(report.id);
                            }
                          }}
                          className="p-2 text-apple-gray-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
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
