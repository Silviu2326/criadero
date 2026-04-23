import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { financeApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  Plus,
  Search,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusLabels: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: {
    label: 'Pendiente',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: Clock,
  },
  PAID: {
    label: 'Pagada',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle,
  },
  OVERDUE: {
    label: 'Vencida',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: AlertCircle,
  },
  CANCELLED: {
    label: 'Cancelada',
    color: 'text-gray-600',
    bg: 'bg-gray-100 border-gray-200',
    icon: XCircle,
  },
};

export function InvoicesPage() {
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

  const { data: invoicesData, isLoading } = useQuery(
    ['invoices', kennelId, statusFilter],
    () =>
      financeApi
        .getInvoices(kennelId!, { status: statusFilter || undefined, limit: 100 })
        .then((r) => r.data),
    { enabled: !!kennelId }
  );

  const { data: stats } = useQuery(
    ['invoiceStats', kennelId],
    () => financeApi.getInvoiceStats(kennelId!).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const invoices = invoicesData?.invoices || [];

  const deleteMutation = useMutation(
    (id: string) => financeApi.deleteInvoice(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices']);
        addNotification({ type: 'success', message: 'Factura eliminada' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const filteredInvoices = useMemo(() => {
    if (!search) return invoices;
    const searchLower = search.toLowerCase();
    return invoices.filter(
      (i: any) =>
        i.number.toLowerCase().includes(searchLower) ||
        `${i.customer?.firstName} ${i.customer?.lastName}`.toLowerCase().includes(searchLower)
    );
  }, [invoices, search]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Facturas" subtitle="Gestión de facturas" />
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
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/finance"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a Finanzas
        </Link>
      </div>

      <PageHeader
        title="Facturas"
        subtitle={`${invoices.length} facturas registradas`}
        action={
          isBreeder && (
            <Link to="/finance/invoices/new" className="btn-primary">
              <Plus size={18} />
              Nueva factura
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total facturado"
          value={`€${(stats?.totalInvoiced || 0).toLocaleString()}`}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Pagado"
          value={`€${(stats?.totalPaid || 0).toLocaleString()}`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pendiente"
          value={`€${(stats?.totalPending || 0).toLocaleString()}`}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Vencido"
          value={`€${(stats?.totalOverdue || 0).toLocaleString()}`}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar facturas..."
              className="input-apple pl-11 w-full"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-apple select-apple"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="PAID">Pagadas</option>
            <option value="OVERDUE">Vencidas</option>
            <option value="CANCELLED">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay facturas</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || statusFilter
              ? 'No se encontraron facturas con los filtros seleccionados'
              : 'Comienza creando tu primera factura'}
          </p>
          {isBreeder && !search && !statusFilter && (
            <Link to="/finance/invoices/new" className="btn-primary">
              <Plus size={18} />
              Nueva Factura
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice: any) => {
                  const statusConfig = statusLabels[invoice.status];
                  const StatusIcon = statusConfig?.icon;
                  return (
                    <tr key={invoice.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-apple-blue" />
                          <span className="font-medium">{invoice.number}</span>
                        </div>
                      </td>
                      <td>
                        <p className="font-medium text-apple-black">
                          {invoice.customer?.firstName} {invoice.customer?.lastName}
                        </p>
                        <p className="text-xs text-apple-gray-100">{invoice.customer?.email}</p>
                      </td>
                      <td>
                        <div className="text-sm">
                          <p>{format(new Date(invoice.issueDate), 'dd MMM yyyy', { locale: es })}</p>
                          <p className="text-xs text-apple-gray-100">
                            Vence: {format(new Date(invoice.dueDate), 'dd MMM yyyy', { locale: es })}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-semibold text-apple-black">
                            €{invoice.total.toLocaleString()}
                          </p>
                          {invoice.balance > 0 && (
                            <p className="text-xs text-red-500">
                              Pendiente: €{invoice.balance.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                            statusConfig?.bg,
                            statusConfig?.color
                          )}
                        >
                          {StatusIcon && <StatusIcon size={12} />}
                          {statusConfig?.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/finance/invoices/${invoice.id}`}
                            className="p-2 rounded-lg hover:bg-apple-gray text-apple-gray-100 transition-colors"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => deleteMutation.mutate(invoice.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
