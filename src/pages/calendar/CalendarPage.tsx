import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, List, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageHeader } from '@/components/common/PageHeader';
import { CalendarMonth, CalendarWeek, CalendarDay, EventModal, EventList } from '@/components/calendar';
import { calendarApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
// Note: UI store notification will be implemented when available
import { cn } from '@/utils/cn';
import type { CalendarEvent, CreateCalendarEventData } from '@/types';

type ViewType = 'month' | 'week' | 'day' | 'list';

export function CalendarPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  // TODO: Add notification system when UI store supports it
  const showNotification = (notification: { type: 'success' | 'error'; message: string }) => {
    console.log(`[${notification.type.toUpperCase()}]`, notification.message);
  };
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: myKennels } = useQuery(
    'myKennelsCalendarPage',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  // Calculate date range for fetching events
  const dateRange = useMemo(() => {
    switch (view) {
      case 'month':
        return {
          startDate: format(startOfWeek(startOfMonth(currentDate)), 'yyyy-MM-dd'),
          endDate: format(endOfWeek(endOfMonth(currentDate)), 'yyyy-MM-dd'),
        };
      case 'week':
        return {
          startDate: format(startOfWeek(currentDate, { locale: es }), 'yyyy-MM-dd'),
          endDate: format(endOfWeek(currentDate, { locale: es }), 'yyyy-MM-dd'),
        };
      case 'day':
      case 'list':
        return {
          startDate: format(addDays(currentDate, -30), 'yyyy-MM-dd'),
          endDate: format(addDays(currentDate, 30), 'yyyy-MM-dd'),
        };
      default:
        return {
          startDate: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
        };
    }
  }, [view, currentDate]);

  const { data: events, isLoading } = useQuery(
    ['calendarEvents', kennelId, dateRange.startDate, dateRange.endDate],
    () =>
      calendarApi
        .getByRange({
          kennelId: kennelId!,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        })
        .then((r) => r.data.events),
    { enabled: !!kennelId }
  );

  // Mutations
  const createMutation = useMutation(
    (data: CreateCalendarEventData) => calendarApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('calendarEvents');
        showNotification({
          type: 'success',
          message: 'Evento creado correctamente',
        });
        setIsModalOpen(false);
        setSelectedDate(null);
      },
      onError: () => {
        showNotification({
          type: 'error',
          message: 'Error al crear el evento',
        });
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<CreateCalendarEventData> }) =>
      calendarApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('calendarEvents');
        showNotification({
          type: 'success',
          message: 'Evento actualizado correctamente',
        });
        setIsModalOpen(false);
        setSelectedEvent(null);
      },
      onError: () => {
        showNotification({
          type: 'error',
          message: 'Error al actualizar el evento',
        });
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => calendarApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('calendarEvents');
        showNotification({
          type: 'success',
          message: 'Evento eliminado correctamente',
        });
        setIsModalOpen(false);
        setSelectedEvent(null);
      },
      onError: () => {
        showNotification({
          type: 'error',
          message: 'Error al eliminar el evento',
        });
      },
    }
  );

  const handleSave = (data: CreateCalendarEventData) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (id: string, data: Partial<CreateCalendarEventData>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setSelectedDate(currentDate);
    setIsModalOpen(true);
  };

  const viewOptions: { value: ViewType; label: string; icon: typeof CalendarIcon }[] = [
    { value: 'month', label: 'Mes', icon: CalendarIcon },
    { value: 'week', label: 'Semana', icon: CalendarIcon },
    { value: 'day', label: 'Día', icon: CalendarIcon },
    { value: 'list', label: 'Lista', icon: List },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Calendario"
        subtitle="Gestiona eventos, citas y recordatorios"
        action={
          isBreeder && (
            <button onClick={handleNewEvent} className="btn-primary">
              <Plus size={18} />
              Nuevo evento
            </button>
          )
        }
      />

      {/* View Selector */}
      <div className="flex items-center gap-2 mb-6">
        {viewOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => setView(option.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                view === option.value
                  ? 'bg-apple-blue text-white'
                  : 'bg-white text-apple-gray-200 hover:bg-apple-gray border border-apple-gray-300/50'
              )}
            >
              <Icon size={16} />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Calendar Views */}
      {isLoading ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto" />
          <p className="mt-4 text-apple-gray-200">Cargando eventos...</p>
        </div>
      ) : (
        <>
          {view === 'month' && (
            <CalendarMonth
              events={events || []}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          )}

          {view === 'week' && (
            <CalendarWeek
              events={events || []}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          )}

          {view === 'day' && (
            <CalendarDay
              events={events || []}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'list' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-apple-black mb-4">
                Próximos eventos
              </h3>
              <EventList
                events={events || []}
                onEventClick={handleEventClick}
                emptyMessage="No hay eventos en este período"
              />
            </div>
          )}
        </>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        event={selectedEvent}
        selectedDate={selectedDate || undefined}
        kennelId={kennelId}
      />
    </div>
  );
}
