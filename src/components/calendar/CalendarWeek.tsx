import { useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  isToday,
  addHours,
  startOfDay,
  getHours,
  getMinutes,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CalendarEvent } from '@/types';

interface CalendarWeekProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

const eventTypeColors: Record<string, string> = {
  VACCINE: 'bg-green-500 border-green-600',
  DEWORMING: 'bg-blue-500 border-blue-600',
  HEAT: 'bg-pink-500 border-pink-600',
  BIRTH: 'bg-purple-500 border-purple-600',
  APPOINTMENT: 'bg-amber-500 border-amber-600',
  OTHER: 'bg-gray-500 border-gray-600',
};

const hours = Array.from({ length: 24 }, (_, i) => i);

export function CalendarWeek({
  events,
  currentDate,
  onDateChange,
  onEventClick,
  onDateClick,
}: CalendarWeekProps) {
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { locale: es });
    const weekEnd = endOfWeek(currentDate, { locale: es });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const handlePrevWeek = () => onDateChange(subWeeks(currentDate, 1));
  const handleNextWeek = () => onDateChange(addWeeks(currentDate, 1));
  const handleToday = () => onDateChange(new Date());

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  const getEventPosition = (event: CalendarEvent) => {
    const eventDate = new Date(event.date);
    const hour = getHours(eventDate);
    const minute = getMinutes(eventDate);
    return {
      top: (hour * 60 + minute) * (64 / 60), // 64px per hour
      height: event.allDay ? 60 : 60, // Default 1 hour duration
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-apple-gray-300/50 overflow-hidden flex flex-col h-[calc(100vh-300px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-apple-gray-300/50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-apple-black">
            Semana del {format(weekDays[0], 'd MMM', { locale: es })} - {format(weekDays[6], 'd MMM yyyy', { locale: es })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevWeek}
              className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
            >
              <ChevronLeft size={20} className="text-apple-gray-200" />
            </button>
            <button
              onClick={handleNextWeek}
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

      {/* Week days header */}
      <div className="grid grid-cols-8 border-b border-apple-gray-300/50">
        <div className="px-2 py-3 text-center text-sm font-medium text-apple-gray-100 border-r border-apple-gray-300/30">
          Hora
        </div>
        {weekDays.map((day) => {
          const isTodayDate = isToday(day);
          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={cn(
                'px-2 py-3 text-center cursor-pointer transition-colors border-r border-apple-gray-300/30 last:border-r-0',
                isTodayDate ? 'bg-blue-50' : 'hover:bg-apple-gray/20'
              )}
            >
              <p className="text-xs text-apple-gray-100 uppercase">{format(day, 'EEE', { locale: es })}</p>
              <p
                className={cn(
                  'text-lg font-semibold mt-1',
                  isTodayDate ? 'text-apple-blue' : 'text-apple-black'
                )}
              >
                {format(day, 'd')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Week grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 min-h-full">
          {/* Hours column */}
          <div className="border-r border-apple-gray-300/30">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 px-2 py-2 text-right text-xs text-apple-gray-100 border-b border-apple-gray-300/20"
              >
                {format(addHours(startOfDay(new Date()), hour), 'HH:mm')}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'relative border-r border-apple-gray-300/30 last:border-r-0',
                  isTodayDate && 'bg-blue-50/30'
                )}
                onClick={() => onDateClick(day)}
              >
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-apple-gray-300/20"
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const position = getEventPosition(event);
                  return (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={cn(
                        'absolute left-1 right-1 px-2 py-1 rounded-md text-left text-xs shadow-sm border-l-4 transition-all hover:shadow-md hover:scale-[1.02]',
                        eventTypeColors[event.type] || 'bg-gray-500 border-gray-600',
                        'bg-opacity-90 text-white'
                      )}
                      style={{
                        top: `${position.top}px`,
                        height: `${Math.max(position.height, 24)}px`,
                      }}
                    >
                      <p className="font-semibold truncate">{event.title}</p>
                      <p className="text-[10px] opacity-90 truncate">
                        {format(new Date(event.date), 'HH:mm')}
                      </p>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
