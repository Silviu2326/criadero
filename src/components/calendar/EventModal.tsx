import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { format, parseISO } from 'date-fns';
import { X, Calendar, MapPin, Dog, Users } from 'lucide-react';
import { cn } from '@/utils/cn';
import { dogsApi, customersApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { CalendarEvent, CalendarEventType, CreateCalendarEventData } from '@/types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCalendarEventData) => void;
  onUpdate?: (id: string, data: Partial<CreateCalendarEventData>) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent | null;
  selectedDate?: Date;
  kennelId?: string;
}

const eventTypes: { value: CalendarEventType; label: string; color: string }[] = [
  { value: 'VACCINE', label: 'Vacuna', color: 'bg-green-500' },
  { value: 'DEWORMING', label: 'Desparasitación', color: 'bg-blue-500' },
  { value: 'HEAT', label: 'Celo', color: 'bg-pink-500' },
  { value: 'BIRTH', label: 'Parto', color: 'bg-purple-500' },
  { value: 'APPOINTMENT', label: 'Cita', color: 'bg-amber-500' },
  { value: 'OTHER', label: 'Otro', color: 'bg-gray-500' },
];

export function EventModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  event,
  selectedDate,
  kennelId: propKennelId,
}: EventModalProps) {
  const { user } = useAuthStore();
  const isEditing = !!event;
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennelsCalendar',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder && !propKennelId }
  );

  const effectiveKennelId = propKennelId || myKennels?.[0]?.id;

  const { data: dogs } = useQuery(
    ['dogs', effectiveKennelId],
    () => dogsApi.getAll({ kennelId: effectiveKennelId! }).then((r) => r.data.dogs),
    { enabled: !!effectiveKennelId }
  );

  const { data: customers } = useQuery(
    ['customers', effectiveKennelId],
    () => customersApi.getAll({ kennelId: effectiveKennelId! }).then((r) => r.data.customers),
    { enabled: !!effectiveKennelId }
  );

  const [formData, setFormData] = useState<CreateCalendarEventData>({
    title: '',
    type: 'OTHER',
    date: format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm"),
    allDay: true,
    reminderDays: 1,
    notes: '',
    location: '',
    kennelId: effectiveKennelId || '',
    dogId: undefined,
    customerId: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        type: event.type,
        date: format(parseISO(event.date), "yyyy-MM-dd'T'HH:mm"),
        endDate: event.endDate ? format(parseISO(event.endDate), "yyyy-MM-dd'T'HH:mm") : undefined,
        allDay: event.allDay,
        reminderDays: event.reminderDays,
        notes: event.notes || '',
        location: event.location || '',
        kennelId: event.kennelId,
        dogId: event.dogId || undefined,
        customerId: event.customerId || undefined,
      });
    } else {
      setFormData({
        title: '',
        type: 'OTHER',
        date: format(selectedDate || new Date(), "yyyy-MM-dd'T'HH:mm"),
        allDay: true,
        reminderDays: 1,
        notes: '',
        location: '',
        kennelId: effectiveKennelId || '',
        dogId: undefined,
        customerId: undefined,
      });
    }
  }, [event, selectedDate, effectiveKennelId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.date) newErrors.date = 'La fecha es obligatoria';
    if (!formData.kennelId) newErrors.kennelId = 'El criadero es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && onUpdate && event) {
      onUpdate(event.id, formData);
    } else {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (event && onDelete && confirm('¿Estás seguro de eliminar este evento?')) {
      onDelete(event.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-apple-gray-300/50">
          <h2 className="text-xl font-semibold text-apple-black">
            {isEditing ? 'Editar evento' : 'Nuevo evento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
          >
            <X size={20} className="text-apple-gray-200" />
          </button>
        </div>

        {/* Form */}
        <form id="event-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-5">
            {/* Kennel loading / error */}
            {!effectiveKennelId && isBreeder && !propKennelId && (
              <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                Cargando criadero...
              </p>
            )}
            {errors.kennelId && (
              <p className="text-sm text-red-500">{errors.kennelId}</p>
            )}
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Tipo de evento
              </label>
              <div className="grid grid-cols-3 gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      formData.type === type.value
                        ? 'bg-apple-blue text-white'
                        : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/50'
                    )}
                  >
                    <span className={cn('w-2 h-2 rounded-full', type.color)} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={cn(
                  'input w-full',
                  errors.title && 'border-red-500 focus:border-red-500'
                )}
                placeholder="Ej: Vacuna de rabia"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-apple-black mb-1.5">
                  Fecha y hora <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                  <input
                    type={formData.allDay ? 'date' : 'datetime-local'}
                    value={formData.allDay ? formData.date.split('T')[0] : formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={cn(
                      'input w-full pl-10',
                      errors.date && 'border-red-500 focus:border-red-500'
                    )}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-black mb-1.5">
                  Recordatorio (días antes)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({ ...formData, reminderDays: parseInt(e.target.value) || 0 })}
                  className="input w-full"
                />
              </div>
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="allDay"
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                className="w-4 h-4 rounded border-apple-gray-300 text-apple-blue focus:ring-apple-blue"
              />
              <label htmlFor="allDay" className="text-sm text-apple-black">
                Todo el día
              </label>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">
                Ubicación
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input w-full pl-10"
                  placeholder="Ej: Clínica veterinaria"
                />
              </div>
            </div>

            {/* Related Dog */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">
                Perro relacionado
              </label>
              <div className="relative">
                <Dog className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <select
                  value={formData.dogId || ''}
                  onChange={(e) => setFormData({ ...formData, dogId: e.target.value || undefined })}
                  className="input w-full pl-10"
                >
                  <option value="">Sin perro relacionado</option>
                  {dogs?.map((dog: any) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name} {dog.breed ? `(${dog.breed.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Related Customer */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">
                Cliente relacionado
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <select
                  value={formData.customerId || ''}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value || undefined })}
                  className="input w-full pl-10"
                >
                  <option value="">Sin cliente relacionado</option>
                  {customers?.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">
                Notas
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input w-full h-24 resize-none"
                placeholder="Notas adicionales..."
              />
            </div>

            {/* Status (only for editing) */}
            {isEditing && event && (
              <div>
                <label className="block text-sm font-medium text-apple-black mb-1.5">
                  Estado
                </label>
                <div className="flex gap-2">
                  {(['PENDING', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onUpdate?.(event.id, { status })}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        event.status === status
                          ? status === 'COMPLETED'
                            ? 'bg-green-500 text-white'
                            : status === 'CANCELLED'
                            ? 'bg-red-500 text-white'
                            : 'bg-amber-500 text-white'
                          : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/50'
                      )}
                    >
                      {status === 'COMPLETED' ? 'Completado' : status === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-apple-gray-300/50 bg-apple-gray/30">
          {isEditing ? (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Eliminar
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={!effectiveKennelId}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Guardar cambios' : 'Crear evento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
