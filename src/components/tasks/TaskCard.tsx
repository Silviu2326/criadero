import { Task, TaskStatus } from '@/types';
import { cn } from '@/utils/cn';
import { formatDistanceToNow, isPast, isToday, isTomorrow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dog, User, Calendar, MoreHorizontal, AlertCircle, ArrowRightCircle, CheckCircle2, XCircle, Circle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  compact?: boolean;
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string; icon: any }> = {
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

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Baja', color: 'text-slate-500 bg-slate-100' },
  MEDIUM: { label: 'Media', color: 'text-amber-600 bg-amber-50' },
  HIGH: { label: 'Alta', color: 'text-red-600 bg-red-50' },
};

function DueDateBadge({ dueDate, status }: { dueDate?: string; status: TaskStatus }) {
  if (!dueDate || status === 'COMPLETED' || status === 'CANCELLED') {
    return null;
  }
  const date = new Date(dueDate);
  const isOverdue = isPast(date) && !isToday(date);

  let text = formatDistanceToNow(date, { addSuffix: true, locale: es });
  if (isToday(date)) text = 'Hoy';
  if (isTomorrow(date)) text = 'Mañana';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded',
        isOverdue ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
      )}
    >
      <Calendar size={10} />
      {isOverdue && <AlertCircle size={10} />}
      {text}
    </span>
  );
}

export function TaskCard({ task, onStatusChange, compact }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const StatusIcon = status.icon;

  return (
    <div className="card p-4 group hover:shadow-md transition-all">
      {/* Header: title + quick status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-apple-black text-sm leading-snug line-clamp-2">
          {task.title}
        </h4>
        {!compact && (
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Cambiar estado"
            >
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
            <button className="p-1.5 rounded-md hover:bg-apple-gray text-apple-gray-100">
              <MoreHorizontal size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Meta Row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', priority.color)}>
          {priority.label}
        </span>
        <DueDateBadge dueDate={task.dueDate} status={task.status} />
      </div>

      {/* Description (only if not compact) */}
      {!compact && task.description && (
        <p className="text-xs text-apple-gray-100 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Related entities */}
      <div className="flex flex-col gap-1.5 mb-3">
        {task.dog && (
          <div className="flex items-center gap-1.5 text-xs text-apple-gray-200">
            <Dog size={12} />
            <span className="truncate">{task.dog.name}</span>
          </div>
        )}
        {task.customer && (
          <div className="flex items-center gap-1.5 text-xs text-apple-gray-200">
            <User size={12} />
            <span className="truncate">
              {task.customer.firstName} {task.customer.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Footer: assignee + status icon */}
      <div className="flex items-center justify-between pt-3 border-t border-apple-gray-300/30">
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue text-[10px] font-medium">
              {task.assignee.firstName[0]}{task.assignee.lastName[0]}
            </div>
            <span className="text-[10px] text-apple-gray-200 truncate max-w-[80px]">
              {task.assignee.firstName}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-apple-gray-300">Sin asignar</span>
        )}

        <span
          className={cn(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border',
            status.bg,
            status.color
          )}
        >
          <StatusIcon size={10} />
          {status.label}
        </span>
      </div>
    </div>
  );
}

export function TaskRow({ task, onStatusChange }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const StatusIcon = status.icon;

  return (
    <tr className="group hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-apple-black text-sm">{task.title}</span>
          {task.description && (
            <span className="text-xs text-apple-gray-100 line-clamp-1">{task.description}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', priority.color)}>
          {priority.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border',
            status.bg,
            status.color
          )}
        >
          <StatusIcon size={10} />
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        {task.dueDate ? (
          <span className="text-sm text-apple-gray-200">
            {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: es })}
          </span>
        ) : (
          <span className="text-sm text-apple-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue text-[10px] font-medium">
              {task.assignee.firstName[0]}{task.assignee.lastName[0]}
            </div>
            <span className="text-sm text-apple-gray-200">
              {task.assignee.firstName} {task.assignee.lastName}
            </span>
          </div>
        ) : (
          <span className="text-sm text-apple-gray-300">Sin asignar</span>
        )}
      </td>
      <td className="px-4 py-3">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="input-apple text-xs py-1.5 pr-6"
        >
          <option value="PENDING">Pendiente</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="COMPLETED">Completada</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
      </td>
    </tr>
  );
}
