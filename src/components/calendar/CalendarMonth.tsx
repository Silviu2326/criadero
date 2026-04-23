import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CalendarEvent } from '@/types';

interface CalendarMonthProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
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

export function CalendarMonth({
  events,
  currentDate,
  onDateChange,
  onEventClick,
  onDateClick,
}: CalendarMonthProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { locale: es });
    const calendarEnd = endOfWeek(monthEnd, { locale: es });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  const handlePrevMonth = () => onDateChange(subMonths(currentDate, 1));
  const handleNextMonth = () => onDateChange(addMonths(currentDate, 1));
  const handleToday = () => onDateChange(new Date());

  return (
    <div className="bg-white rounded-2xl border border-apple-gray-300/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-apple-gray-300/50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-apple-black capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
            >
              <ChevronLeft size={20} className="text-apple-gray-200" />
            </button>
            <button
              onClick={handleNextMonth}
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
      <div className="grid grid-cols-7 border-b border-apple-gray-300/50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-sm font-medium text-apple-gray-100"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              onClick={() => {
                setSelectedDate(day);
                onDateClick(day);
              }}
              className={cn(
                'min-h-[120px] p-2 border-b border-r border-apple-gray-300/30 cursor-pointer transition-colors',
                !isCurrentMonth && 'bg-apple-gray/30',
                isSelected && 'bg-blue-50/50',
                !isSelected && isCurrentMonth && 'hover:bg-apple-gray/20',
                index % 7 === 6 && 'border-r-0' // Remove right border on last column
              )}
            >
              {/* Day number */}
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                    isTodayDate
                      ? 'bg-apple-blue text-white'
                      : isCurrentMonth
                      ? 'text-apple-black'
                      : 'text-apple-gray-100'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs text-apple-gray-100">
                    {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={cn(
                      'w-full text-left text-xs px-2 py-1 rounded-md truncate transition-colors',
                      eventTypeColors[event.type] || 'bg-gray-500',
                      'bg-opacity-10 hover:bg-opacity-20'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block w-2 h-2 rounded-full mr-1.5',
                        eventTypeColors[event.type] || 'bg-gray-500'
                      )}
                    />
                    <span className="text-apple-black font-medium">
                      {event.title}
                    </span>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-xs text-apple-gray-100 px-2">
                    +{dayEvents.length - 3} más
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-apple-gray-300/50 flex flex-wrap gap-4">
        {Object.entries(eventTypeLabels).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2">
            <span
              className={cn(
                'w-3 h-3 rounded-full',
                eventTypeColors[type] || 'bg-gray-500'
              )}
            />
            <span className="text-sm text-apple-gray-200">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
