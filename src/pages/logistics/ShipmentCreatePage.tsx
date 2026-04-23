import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { logisticsApi, kennelsApi, dogsApi, customersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2, Truck, MapPin, Calendar, DollarSign, Package, User, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ShipmentStatus, TransportMode } from '@/types';

interface ShipmentFormData {
  trackingNumber: string;
  origin: string;
  destination: string;
  mode: TransportMode;
  status: ShipmentStatus;
  scheduledDate: string;
  estimatedArrival: string;
  cost: number;
  carrierId: string;
  dogId: string;
  customerId: string;
  notes: string;
  externalTrackingUrl: string;
}

export function ShipmentCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );
  const kennelId = myKennels?.[0]?.id;

  const { data: dogs } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs as any[]),
    { enabled: !!kennelId }
  );

  const { data: customers } = useQuery(
    ['customers', kennelId],
    () => customersApi.getAll({ kennelId }).then((r) => r.data.customers as any[]),
    { enabled: !!kennelId }
  );

  const { data: carriers } = useQuery(
    ['carriers', kennelId],
    () => logisticsApi.getCarriers({ kennelId }).then((r) => r.data.carriers as any[]),
    { enabled: !!kennelId }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShipmentFormData>({
    defaultValues: {
      status: 'SCHEDULED',
      mode: 'GROUND',
    },
  });

  const createMutation = useMutation(
    async (data: ShipmentFormData) => {
      const response = await logisticsApi.createShipment({
        trackingNumber: data.trackingNumber?.trim() || undefined,
        origin: data.origin,
        destination: data.destination,
        mode: data.mode,
        status: data.status,
        scheduledDate: data.scheduledDate,
        estimatedArrival: data.estimatedArrival || undefined,
        cost: data.cost ? Number(data.cost) : undefined,
        carrierId: data.carrierId || undefined,
        dogId: data.dogId || undefined,
        customerId: data.customerId || undefined,
        notes: data.notes,
        externalTrackingUrl: data.externalTrackingUrl,
        kennelId: kennelId || '',
      });
      return response.data;
    },
    {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Envío creado exitosamente',
        });
        navigate('/logistics');
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.message || 'Error al crear el envío',
        });
      },
    }
  );

  const onSubmit = (data: ShipmentFormData) => {
    if (!kennelId) {
      addNotification({
        type: 'error',
        message: 'No tienes un criadero asignado',
      });
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/logistics" className="p-2 hover:bg-apple-gray rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">Nuevo envío</h1>
          <p className="text-apple-gray-100">Registra un nuevo envío de animal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Truck size={16} className="inline mr-1" />
                Número de seguimiento
              </label>
              <input
                {...register('trackingNumber')}
                className="input-apple"
                placeholder="Dejar en blanco para generar automáticamente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Estado inicial
              </label>
              <select {...register('status')} className="input-apple select-apple w-full">
                <option value="SCHEDULED">Programado</option>
                <option value="IN_TRANSIT">En tránsito</option>
                <option value="DELIVERED">Entregado</option>
                <option value="DELAYED">Retrasado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <MapPin size={16} className="inline mr-1" />
                Origen *
              </label>
              <input
                {...register('origin', { required: 'Origen requerido' })}
                className="input-apple"
                placeholder="Ej. Madrid, ES"
              />
              {errors.origin && <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <MapPin size={16} className="inline mr-1" />
                Destino *
              </label>
              <input
                {...register('destination', { required: 'Destino requerido' })}
                className="input-apple"
                placeholder="Ej. Berlín, DE"
              />
              {errors.destination && <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Modo de transporte</label>
              <select {...register('mode')} className="input-apple select-apple w-full">
                <option value="GROUND">Terrestre</option>
                <option value="AIR">Aéreo</option>
                <option value="SEA">Marítimo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Truck size={16} className="inline mr-1" />
                Transportista
              </label>
              <select {...register('carrierId')} className="input-apple select-apple w-full">
                <option value="">Seleccionar transportista</option>
                {carriers?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha de salida *
              </label>
              <input
                type="date"
                {...register('scheduledDate', { required: 'Fecha de salida requerida' })}
                className="input-apple"
              />
              {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha estimada de llegada
              </label>
              <input type="date" {...register('estimatedArrival')} className="input-apple" />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Coste (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('cost')}
                className="input-apple"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Package size={16} className="inline mr-1" />
                Perro
              </label>
              <select {...register('dogId')} className="input-apple select-apple w-full">
                <option value="">Sin perro asignado</option>
                {dogs?.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} ({(dog as any).breed?.name || 'Sin raza'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <User size={16} className="inline mr-1" />
                Cliente destinatario
              </label>
              <select {...register('customerId')} className="input-apple select-apple w-full">
                <option value="">Sin cliente asignado</option>
                {customers?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">
                <ExternalLink size={16} className="inline mr-1" />
                URL de seguimiento externo
              </label>
              <input
                type="url"
                {...register('externalTrackingUrl')}
                className="input-apple"
                placeholder="https://transportista.com/seguimiento?numero=..."
              />
              <p className="text-xs text-apple-gray-200 mt-1">
                Enlace a la web del transportista donde se puede consultar el estado real del envío.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">
                <FileText size={16} className="inline mr-1" />
                Notas
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-apple resize-none"
                placeholder="Información adicional sobre el envío..."
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isLoading || !kennelId}
            className="btn-primary h-12 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
            Guardar envío
          </button>
          <Link to="/logistics" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
