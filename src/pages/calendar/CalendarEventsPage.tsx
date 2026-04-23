import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { parseISO } from 'date-fns';
import { PageHeader } from '@/components/common/PageHeader';
import { EventList, EventModal } from '@/components/calendar';
import { calendarApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { CalendarEvent, CreateCalendarEventData } from '@/types';

const eventTypeOptions = [
  { value: '', label: 'Todos los tipos' },
  { value: 'VACCINE', label: 'Vacunas' },
  { value: 'DEWORMING', label: 'Desparasitaciones' },
  { value: 'HEAT', label: 'Celos' },
  { value: 'BIRTH', label: 'Partos' },
  { value: 'APPOINTMENT', label: 'Citas' },
  { value: 'OTHER', label: 'Otros' },
];

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'COMPLETED', label: 'Completados' },
  { value: 'CANCELLED', label: 'Cancelados' },
];

export function CalendarEventsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  // TODO: Add notification system when UI store supports it
  const showNotification = (notification: { type: 'success' | 'error'; message: string }) => {
    console.log(`[${notification.type.toUpperCase()}]`, notification.message);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || 'PENDING',
    search: searchParams.get('search') || '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: myKennels } = useQuery(
    'myKennelsCalendarEvents',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: events, isLoading } = useQuery(
    ['calendarEventsList', kennelId, filters],
    () =>
      calendarApi
        .getAll({
          kennelId: kennelId!,
          type: filters.type || undefined,
          status: filters.status || undefined,
        })
        .then((r) => r.data.events),
    {
      enabled: !!kennelId,
      select: (data) => {
        // Filter by search term client-side
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          return data.filter(
            (event: CalendarEvent) =>
              event.title.toLowerCase().includes(searchLower) ||
              event.notes?.toLowerCase().includes(searchLower) ||
              event.dog?.name.toLowerCase().includes(searchLower) ||
              event.customer?.firstName.toLowerCase().includes(searchLower) ||
              event.customer?.lastName.toLowerCase().includes(searchLower)
          );
        }
        return data;
      },
    }
  );

  // Mutations
  const createMutation = useMutation(
    (data: CreateCalendarEventData) => calendarApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('calendarEventsList');
        showNotification({
          type: 'success',
          message: 'Evento creado correctamente',
        });
        setIsModalOpen(false);
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
        queryClient.invalidateQueries('calendarEventsList');
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
        queryClient.invalidateQueries('calendarEventsList');
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

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setSearchParams(newFilters);
  };

  // Stats
  const stats = {
    pending: events?.filter((e: CalendarEvent) => e.status === 'PENDING').length || 0,
    completed: events?.filter((e: CalendarEvent) => e.status === 'COMPLETED').length || 0,
    today: events?.filter((e: CalendarEvent) => {
      const eventDate = parseISO(e.date);
      const today = new Date();
      return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    }).length || 0,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Eventos del Calendario"
        subtitle="Lista completa de eventos y citas"
        action={
          isBreeder && (
            <button onClick={handleNewEvent} className="btn-primary">
              <Plus size={18} />
              Nuevo evento
            </button>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <AlertCircle className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.pending}</p>
            <p className="text-sm text-apple-gray-100">Pendientes</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.completed}</p>
            <p className="text-sm text-apple-gray-100">Completados</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.today}</p>
            <p className="text-sm text-apple-gray-100">Hoy</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={18} className="text-apple-gray-100" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={filters.search}
              onChange={(e) => updateFilters('search', e.target.value)}
              className="input flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-apple-gray-100" />
            <select
              value={filters.type}
              onChange={(e) => updateFilters('type', e.target.value)}
              className="input"
            >
              {eventTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filters.status}
              onChange={(e) => updateFilters('status', e.target.value)}
              className="input"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-apple-black mb-4">
          {events?.length || 0} eventos encontrados
        </h3>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto" />
            <p className="mt-4 text-apple-gray-200">Cargando eventos...</p>
          </div>
        ) : (
          <EventList
            events={events || []}
            onEventClick={handleEventClick}
            emptyMessage="No se encontraron eventos con los filtros seleccionados"
          />
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate || undefined}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        event={selectedEvent}
        kennelId={kennelId}
      />
    </div>
  );
}
