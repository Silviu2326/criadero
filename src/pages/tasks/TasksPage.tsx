import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { tasksApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { TaskCard, TaskRow } from '@/components/tasks';
import { Task, TaskStatus } from '@/types';
import { cn } from '@/utils/cn';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRightCircle,
  Circle,
  Download,
  Loader2,
} from 'lucide-react';

const statusLabels: Record<TaskStatus, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: {
    label: 'Pendiente',
    color: 'text-slate-700',
    bg: 'bg-slate-50 border-slate-200',
    icon: Circle,
  },
  IN_PROGRESS: {
    label: 'En progreso',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: ArrowRightCircle,
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

const priorityOptions = [
  { value: '', label: 'Todas' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'LOW', label: 'Baja' },
];

export function TasksPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showFilters, setShowFilters] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder || user?.role === 'VETERINARIAN' }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: tasksData, isLoading: tasksLoading } = useQuery(
    ['tasks', kennelId],
    () => tasksApi.getAll({ kennelId }).then((r) => r.data.tasks as Task[]),
    { enabled: !!kennelId }
  );

  const { data: statsData, isLoading: statsLoading } = useQuery(
    ['taskStats', kennelId],
    () => tasksApi.getStats(kennelId!).then((r) => r.data.stats),
    { enabled: !!kennelId }
  );

  const statusMutation = useMutation(
    ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.updateStatus(id, status).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', kennelId]);
        queryClient.invalidateQueries(['taskStats', kennelId]);
      },
    }
  );

  const tasks = tasksData || [];
  const stats = statsData || { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0, overdue: 0 };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !search || t.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || t.status === statusFilter;
      const matchesPriority = !priorityFilter || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      PENDING: [],
      IN_PROGRESS: [],
      COMPLETED: [],
      CANCELLED: [],
    };
    filteredTasks.forEach((t) => {
      if (grouped[t.status]) grouped[t.status].push(t);
    });
    return grouped;
  }, [filteredTasks]);

  const handleStatusChange = (id: string, status: TaskStatus) => {
    statusMutation.mutate({ id, status });
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== status) {
        handleStatusChange(taskId, status);
      }
    }
    setDraggedTaskId(null);
  };

  if (tasksLoading || statsLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Tareas" subtitle="Gestiona las tareas de tu criadero" />
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
        title="Tareas"
        subtitle={`${stats.total} tareas en total`}
        action={
          isBreeder && (
            <Link to="/tasks/create" className="btn-primary">
              <Plus size={18} />
              Nueva tarea
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Tareas" value={stats.total} icon={CheckSquare} color="blue" />
        <StatCard
          title="Pendientes"
          value={stats.pending}
          icon={Clock}
          color="orange"
          trend={{
            value: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0,
            label: 'del total',
            positive: false,
          }}
        />
        <StatCard title="En Progreso" value={stats.inProgress} icon={ArrowRightCircle} color="blue" />
        <StatCard
          title={stats.overdue > 0 ? `Vencidas (${stats.overdue})` : 'Completadas'}
          value={stats.overdue > 0 ? stats.overdue : stats.completed}
          icon={stats.overdue > 0 ? AlertCircle : CheckCircle2}
          color={stats.overdue > 0 ? 'red' : 'green'}
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
                placeholder="Buscar tareas..."
                className="input-apple pl-11 w-full"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-outline',
                showFilters && 'bg-apple-gray',
                (statusFilter || priorityFilter) && 'border-apple-blue text-apple-blue'
              )}
            >
              <Filter size={16} />
              Filtros
              {(statusFilter || priorityFilter) && (
                <span className="ml-1.5 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">
                  {(statusFilter ? 1 : 0) + (priorityFilter ? 1 : 0)}
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
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-sm text-apple-gray-100">Estado:</span>
              {(['', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
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
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-apple-gray-100">Prioridad:</span>
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value || 'all'}
                  onClick={() => setPriorityFilter(opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    priorityFilter === opt.value
                      ? 'bg-apple-blue text-white'
                      : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/30'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay tareas</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || statusFilter || priorityFilter
              ? 'No se encontraron tareas con los filtros seleccionados'
              : 'Comienza creando tu primera tarea'}
          </p>
          {isBreeder && !search && !statusFilter && !priorityFilter && (
            <Link to="/tasks/create" className="btn-primary">
              <Plus size={18} />
              Crear Tarea
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Board View */}
          {viewMode === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as TaskStatus[]).map((status) => {
                const statusTasks = tasksByStatus[status];
                const config = statusLabels[status];
                const Icon = config.icon;
                const isActiveDrop = draggedTaskId && tasks.find((t) => t.id === draggedTaskId)?.status !== status;

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
                    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl mb-4 border', config.bg)}>
                      <Icon size={18} className={config.color} />
                      <span className={cn('font-semibold text-sm', config.color)}>{config.label}</span>
                      <span className="ml-auto text-xs font-medium text-apple-gray-200 bg-white/50 px-2 py-0.5 rounded-full">
                        {statusTasks.length}
                      </span>
                    </div>
                    <div className="space-y-3 min-h-[120px]">
                      {statusTasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, task.id)}
                          className={cn(
                            'cursor-grab active:cursor-grabbing',
                            draggedTaskId === task.id ? 'opacity-50' : ''
                          )}
                        >
                          <TaskCard
                            task={task}
                            onStatusChange={handleStatusChange}
                          />
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
                    <th>Tarea</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Fecha límite</th>
                    <th>Asignado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <TaskRow key={task.id} task={task} onStatusChange={handleStatusChange} />
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
