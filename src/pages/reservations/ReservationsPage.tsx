import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { reservationsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Dog,
  Wallet,
  Download,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const statusLabels: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: {
    label: 'Pendiente',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmada',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: 'Completada',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelada',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: XCircle,
  },
};

export function ReservationsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showFilters, setShowFilters] = useState(false);
  const [draggedReservationId, setDraggedReservationId] = useState<string | null>(null);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: reservations, isLoading } = useQuery(
    ['reservations', kennelId],
    () =>
      reservationsApi.getAll({ kennelId }).then((r) => r.data.reservations),
    { enabled: !!kennelId }
  );

  const statusMutation = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      reservationsApi.update(id, { status }).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reservations', kennelId]);
      },
    }
  );

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  const onDragStart = (e: React.DragEvent, reservationId: string) => {
    setDraggedReservationId(reservationId);
    e.dataTransfer.setData('text/plain', reservationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const reservationId = e.dataTransfer.getData('text/plain') || draggedReservationId;
    if (reservationId) {
      const reservation = (reservations || []).find((r: any) => r.id === reservationId);
      if (reservation && reservation.status !== status) {
        handleStatusChange(reservationId, status);
      }
    }
    setDraggedReservationId(null);
  };

  // Filter reservations
  const filteredReservations = useMemo(() => {
    if (!reservations) return [];

    return reservations.filter((r: any) => {
      const matchesSearch =
        !search ||
        r.dog?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.customer?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        r.customer?.lastName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  // Group by status for board view
  const reservationsByStatus = useMemo(() => {
    const grouped: Record<string, any[]> = {
      PENDING: [],
      CONFIRMED: [],
      COMPLETED: [],
      CANCELLED: [],
    };
    filteredReservations.forEach((r: any) => {
      if (grouped[r.status]) {
        grouped[r.status].push(r);
      }
    });
    return grouped;
  }, [filteredReservations]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredReservations.length;
    const pending = filteredReservations.filter((r: any) => r.status === 'PENDING').length;
    const confirmed = filteredReservations.filter((r: any) => r.status === 'CONFIRMED').length;
    const completed = filteredReservations.filter((r: any) => r.status === 'COMPLETED').length;
    const totalAmount = filteredReservations
      .filter((r: any) => r.status !== 'CANCELLED')
      .reduce((acc: number, r: any) => acc + (r.amount || 0), 0);
    const pendingAmount = filteredReservations
      .filter((r: any) => r.status === 'CONFIRMED')
      .reduce((acc: number, r: any) => acc + ((r.amount || 0) - (r.deposit || 0)), 0);

    return { total, pending, confirmed, completed, totalAmount, pendingAmount };
  }, [filteredReservations]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Reservas" subtitle="Gestiona las reservas de tus perros" />
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
        title="Reservas"
        subtitle={`${stats.total} reservas en total`}
        action={
          isBreeder && (
            <Link to="/reservations/create" className="btn-primary">
              <Plus size={18} />
              Nueva reserva
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <StatCard
          title="Total Reservas"
          value={stats.total}
          icon={CalendarDays}
          color="blue"
        />
        <StatCard
          title="Pendientes"
          value={stats.pending}
          icon={Clock}
          color="orange"
          trend={{ value: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0, label: 'del total', positive: false }}
        />
        <StatCard
          title="Confirmadas"
          value={stats.confirmed}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Ingresos Estimados"
          value={`€${stats.totalAmount.toLocaleString()}`}
          icon={Wallet}
          color="purple"
        />
        <StatCard
          title="Pendiente de Cobro"
          value={`€${stats.pendingAmount.toLocaleString()}`}
          icon={Wallet}
          color="red"
        />
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
                placeholder="Buscar por perro o cliente..."
                className="input-apple pl-11 w-full"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-outline',
                showFilters && 'bg-apple-gray',
                statusFilter && 'border-apple-blue text-apple-blue'
              )}
            >
              <Filter size={16} />
              Filtros
              {statusFilter && (
                <span className="ml-1.5 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 bg-apple-gray rounded-lg p-1">
              <button
                onClick={() => setViewMode('board')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  viewMode === 'board' ? 'bg-white shadow-sm text-apple-blue' : 'text-apple-gray-100'
                )}
              >
                Tablero
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  viewMode === 'list' ? 'bg-white shadow-sm text-apple-blue' : 'text-apple-gray-100'
                )}
              >
                Lista
              </button>
            </div>
          </div>

          <button
            className="btn-ghost"
            onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Exportación disponible próximamente' })}
          >
            <Download size={16} />
            Exportar
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-apple-gray-100">Filtrar por estado:</span>
              {(['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
                <button
                  key={status || 'all'}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    statusFilter === status
                      ? 'bg-apple-blue text-white'
                      : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/30'
                  )}
                >
                  {status ? statusLabels[status].label : 'Todas'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredReservations.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay reservas</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || statusFilter
              ? 'No se encontraron reservas con los filtros seleccionados'
              : 'Comienza creando tu primera reserva'}
          </p>
          {isBreeder && !search && !statusFilter && (
            <Link to="/reservations/create" className="btn-primary">
              <Plus size={18} />
              Crear Reserva
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Board View */}
          {viewMode === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((status) => {
                const statusReservations = reservationsByStatus[status];
                const config = statusLabels[status];
                const Icon = config.icon;
                const isActiveDrop = draggedReservationId && (reservations || []).find((r: any) => r.id === draggedReservationId)?.status !== status;

                return (
                  <div
                    key={status}
                    className={cn(
                      'flex flex-col rounded-2xl transition-colors',
                      isActiveDrop ? 'bg-apple-gray-300/20' : ''
                    )}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, status)}
                  >
                    {/* Column Header */}
                    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl mb-4 border', config.bg)}>
                      <Icon size={18} className={config.color} />
                      <span className={cn('font-semibold text-sm', config.color)}>
                        {config.label}
                      </span>
                      <span className="ml-auto text-xs font-medium text-apple-gray-200 bg-white/50 px-2 py-0.5 rounded-full">
                        {statusReservations.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3 min-h-[120px]">
                      {statusReservations.map((reservation: any) => (
                        <div
                          key={reservation.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, reservation.id)}
                          className={cn(
                            'card p-4 group hover:shadow-md transition-all cursor-grab active:cursor-grabbing',
                            draggedReservationId === reservation.id ? 'opacity-50' : ''
                          )}
                        >
                          {/* Dog Info */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-apple-gray flex-shrink-0 overflow-hidden">
                              {reservation.dog?.photos?.[0]?.url ? (
                                <img
                                  src={reservation.dog.photos[0].url}
                                  alt={reservation.dog.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Dog className="w-full h-full p-3 text-apple-gray-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-apple-black truncate">
                                {reservation.dog?.name}
                              </p>
                              <p className="text-xs text-apple-gray-100">
                                {reservation.dog?.breed?.name}
                              </p>
                            </div>
                          </div>

                          {/* Customer */}
                          <div className="flex items-center gap-2 text-sm text-apple-gray-200 mb-3">
                            <User size={14} />
                            <span className="truncate">
                              {reservation.customer?.firstName} {reservation.customer?.lastName}
                            </span>
                          </div>

                          {/* Amount */}
                          {reservation.amount && (
                            <div className="flex items-center justify-between pt-3 border-t border-apple-gray-300/30">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="font-semibold text-apple-black">
                                  €{reservation.amount.toLocaleString()}
                                </span>
                                {reservation.deposit && (
                                  <span className="text-xs text-apple-gray-100">
                                    (señal: €{reservation.deposit})
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-apple-gray-300">
                                {formatDistanceToNow(new Date(reservation.createdAt), { addSuffix: true, locale: es })}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="table-container">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Perro</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation: any) => (
                    <tr key={reservation.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-apple-gray overflow-hidden">
                            {reservation.dog?.photos?.[0]?.url ? (
                              <img
                                src={reservation.dog.photos[0].url}
                                alt={reservation.dog.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Dog className="w-full h-full p-2 text-apple-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-apple-black">{reservation.dog?.name}</p>
                            <p className="text-xs text-apple-gray-100">{reservation.dog?.breed?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue font-medium text-sm">
                            {reservation.customer?.firstName[0]}{reservation.customer?.lastName[0]}
                          </div>
                          <span className="text-sm text-apple-gray-200">
                            {reservation.customer?.firstName} {reservation.customer?.lastName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                            statusLabels[reservation.status].bg,
                            statusLabels[reservation.status].color
                          )}
                        >
                          {(() => {
                            const Icon = statusLabels[reservation.status].icon;
                            return <Icon size={12} />;
                          })()}
                          {statusLabels[reservation.status].label}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium text-apple-black">
                            €{reservation.amount?.toLocaleString() || 0}
                          </p>
                          {reservation.deposit && (
                            <p className="text-xs text-apple-gray-100">
                              Señal: €{reservation.deposit}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-apple-gray-200">
                          {format(new Date(reservation.createdAt), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </td>
                      <td>
                        <button className="p-2 rounded-lg hover:bg-apple-gray text-apple-gray-100 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {statusMutation.isLoading && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-100 text-sm text-slate-600">
          <Loader2 className="animate-spin" size={16} />
          Actualizando...
        </div>
      )}
    </div>
  );
}
