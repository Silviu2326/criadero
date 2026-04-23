import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  MapPin,
  Dog,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CalendarEvent } from '@/types';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  showDate?: boolean;
}

const eventTypeColors: Record<string, string> = {
  VACCINE: 'bg-green-500',
  DEWORMING: 'bg-blue-500',
  HEAT: 'bg-pink-500',
  BIRTH: 'bg-purple-500',
  APPOINTMENT: 'bg-amber-500',
  OTHER: 'bg-gray-500',
};

const eventTypeLabels: Record<string, string> = {
  VACCINE: 'Vacuna',
  DEWORMING: 'Desparasitación',
  HEAT: 'Celo',
  BIRTH: 'Parto',
  APPOINTMENT: 'Cita',
  OTHER: 'Otro',
};

const eventTypeBgColors: Record<string, string> = {
  VACCINE: 'bg-green-50 border-green-200',
  DEWORMING: 'bg-blue-50 border-blue-200',
  HEAT: 'bg-pink-50 border-pink-200',
  BIRTH: 'bg-purple-50 border-purple-200',
  APPOINTMENT: 'bg-amber-50 border-amber-200',
  OTHER: 'bg-gray-50 border-gray-200',
};

function getRelativeDateLabel(date: Date): string {
  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Mañana';
  if (isYesterday(date)) return 'Ayer';
  return format(date, 'EEEE d MMM', { locale: es });
}

export function EventCard({ event, onClick, showDate = true }: EventCardProps) {
  const eventDate = parseISO(event.date);
  const isCompleted = event.status === 'COMPLETED';
  const isCancelled = event.status === 'CANCELLED';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer',
        eventTypeBgColors[event.type] || 'bg-gray-50 border-gray-200',
        (isCompleted || isCancelled) && 'opacity-60',
        'hover:shadow-md hover:scale-[1.01]'
      )}
    >
      {/* Type Icon / Date */}
      <div className="flex-shrink-0">
        {showDate ? (
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white',
              eventTypeColors[event.type] || 'bg-gray-500'
            )}
          >
            <span className="text-xs font-medium uppercase">
              {format(eventDate, 'MMM', { locale: es })}
            </span>
            <span className="text-xl font-bold">{format(eventDate, 'd')}</span>
          </div>
        ) : (
          <div
            className={cn(
              'w-3 h-3 rounded-full mt-2',
              eventTypeColors[event.type] || 'bg-gray-500'
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4
              className={cn(
                'font-semibold text-apple-black truncate',
                (isCompleted || isCancelled) && 'line-through'
              )}
            >
              {event.title}
            </h4>
            <p className="text-sm text-apple-gray-100 mt-0.5">
              {eventTypeLabels[event.type]}
            </p>
          </div>
          <StatusBadge status={event.status} />
        </div>

        {/* Details */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-apple-gray-200">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {event.allDay
              ? 'Todo el día'
              : format(eventDate, 'HH:mm', { locale: es })}
          </span>

          {showDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {getRelativeDateLabel(eventDate)}
            </span>
          )}

          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {event.location}
            </span>
          )}
        </div>

        {/* Related entities */}
        {(event.dog || event.customer) && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {event.dog && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs text-apple-gray-200">
                <Dog size={12} />
                {event.dog.name}
              </span>
            )}
            {event.customer && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs text-apple-gray-200">
                <Users size={12} />
                {event.customer.firstName} {event.customer.lastName}
              </span>
            )}
          </div>
        )}

        {/* Notes preview */}
        {event.notes && (
          <p className="mt-2 text-sm text-apple-gray-200 line-clamp-2">
            {event.notes}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    PENDING: {
      icon: AlertCircle,
      label: 'Pendiente',
      className: 'bg-amber-100 text-amber-700',
    },
    COMPLETED: {
      icon: CheckCircle2,
      label: 'Completado',
      className: 'bg-green-100 text-green-700',
    },
    CANCELLED: {
      icon: XCircle,
      label: 'Cancelado',
      className: 'bg-red-100 text-red-700',
    },
  };

  const config = configs[status as keyof typeof configs] || configs.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        config.className
      )}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

export function EventList({
  events,
  onEventClick,
  emptyMessage = 'No hay eventos',
}: {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  emptyMessage?: string;
}) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-apple-gray-100" />
        <p className="mt-2 text-apple-gray-200">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onClick={() => onEventClick(event)}
        />
      ))}
    </div>
  );
}
