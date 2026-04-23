import { useMemo } from 'react';
import {
  format,
  addDays,
  subDays,
  isToday,
  addHours,
  startOfDay,
  getHours,
  getMinutes,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CalendarEvent } from '@/types';

interface CalendarDayProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const eventTypeColors: Record<string, string> = {
  VACCINE: 'bg-green-500 border-green-600',
  DEWORMING: 'bg-blue-500 border-blue-600',
  HEAT: 'bg-pink-500 border-pink-600',
  BIRTH: 'bg-purple-500 border-purple-600',
  APPOINTMENT: 'bg-amber-500 border-amber-600',
  OTHER: 'bg-gray-500 border-gray-600',
};

const eventTypeBgColors: Record<string, string> = {
  VACCINE: 'bg-green-50 border-green-200',
  DEWORMING: 'bg-blue-50 border-blue-200',
  HEAT: 'bg-pink-50 border-pink-200',
  BIRTH: 'bg-purple-50 border-purple-200',
  APPOINTMENT: 'bg-amber-50 border-amber-200',
  OTHER: 'bg-gray-50 border-gray-200',
};

const hours = Array.from({ length: 24 }, (_, i) => i);

export function CalendarDay({
  events,
  currentDate,
  onDateChange,
  onEventClick,
}: CalendarDayProps) {
  const dayEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === currentDate.getDate() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, currentDate]);

  const allDayEvents = dayEvents.filter((e) => e.allDay);
  const timedEvents = dayEvents.filter((e) => !e.allDay);

  const handlePrevDay = () => onDateChange(subDays(currentDate, 1));
  const handleNextDay = () => onDateChange(addDays(currentDate, 1));
  const handleToday = () => onDateChange(new Date());

  const getEventPosition = (event: CalendarEvent) => {
    const eventDate = new Date(event.date);
    const hour = getHours(eventDate);
    const minute = getMinutes(eventDate);
    return {
      top: (hour * 60 + minute) * (80 / 60), // 80px per hour
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-apple-gray-300/50 overflow-hidden flex flex-col h-[calc(100vh-300px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-apple-gray-300/50">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-apple-gray-100 uppercase">
              {format(currentDate, 'EEEE', { locale: es })}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <h2
                className={cn(
                  'text-2xl font-bold',
                  isToday(currentDate) ? 'text-apple-blue' : 'text-apple-black'
                )}
              >
                {format(currentDate, 'd MMMM yyyy', { locale: es })}
              </h2>
              {isToday(currentDate) && (
                <span className="px-2 py-0.5 bg-apple-blue text-white text-xs font-semibold rounded-full">
                  Hoy
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
            >
              <ChevronLeft size={20} className="text-apple-gray-200" />
            </button>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
            >
              <ChevronRight size={20} className="text-apple-gray-200" />
            </button>
          </div>
        </div>
        <button
          onClick={handleToday}
          className="px-4 py-2 text-sm font-medium text-apple-blue hover:bg-blue-50 rounded-lg transition-colors"
        >
          Hoy
        </button>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="px-6 py-3 border-b border-apple-gray-300/50 bg-apple-gray/20">
          <p className="text-xs font-medium text-apple-gray-100 mb-2">Todo el día</p>
          <div className="space-y-2">
            {allDayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left border-l-4 transition-all hover:shadow-sm',
                  eventTypeBgColors[event.type] || 'bg-gray-50 border-gray-200'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    eventTypeColors[event.type]?.split(' ')[0] || 'bg-gray-500'
                  )}
                />
                <span className="font-medium text-apple-black">{event.title}</span>
                {event.dog && (
                  <span className="text-sm text-apple-gray-100 ml-auto">
                    {event.dog.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative min-h-[1440px]">
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex items-start h-20 border-b border-apple-gray-300/20"
            >
              <div className="w-20 px-4 py-2 text-right text-xs text-apple-gray-100 flex-shrink-0">
                {format(addHours(startOfDay(new Date()), hour), 'HH:mm')}
              </div>
              <div className="flex-1" />
            </div>
          ))}

          {/* Timed events */}
          {timedEvents.map((event) => {
            const position = getEventPosition(event);
            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={cn(
                  'absolute left-24 right-4 px-4 py-3 rounded-xl text-left shadow-sm border-l-4 transition-all hover:shadow-md hover:scale-[1.01]',
                  eventTypeBgColors[event.type] || 'bg-gray-50 border-gray-200',
                  'min-h-[60px]'
                )}
                style={{ top: `${position.top}px` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          eventTypeColors[event.type]?.split(' ')[0] || 'bg-gray-500'
                        )}
                      />
                      <h4 className="font-semibold text-apple-black truncate">
                        {event.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-apple-gray-100">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(event.date), 'HH:mm')}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </span>
                      )}
                    </div>
                    {event.notes && (
                      <p className="mt-1 text-sm text-apple-gray-200 line-clamp-2">
                        {event.notes}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        event.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : event.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {event.status === 'COMPLETED'
                        ? 'Completado'
                        : event.status === 'CANCELLED'
                        ? 'Cancelado'
                        : 'Pendiente'}
                    </span>
                    {event.dog && (
                      <p className="mt-1 text-xs text-apple-gray-100">
                        {event.dog.name}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
