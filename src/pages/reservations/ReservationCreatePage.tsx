import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { reservationsApi, dogsApi, customersApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2, Dog, User, Wallet, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReservationFormData {
  dogId: string;
  customerId: string;
  amount: number;
  deposit: number;
  notes: string;
}

export function ReservationCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryDogId = searchParams.get('dogId');

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: user?.role === 'MANAGER' || user?.role === 'BREEDER' }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: dogs } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId, status: 'AVAILABLE' }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const { data: customers } = useQuery(
    ['customers', kennelId],
    () => customersApi.getAll({ kennelId }).then((r) => r.data.customers),
    { enabled: !!kennelId }
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormData>();

  const selectedDogId = watch('dogId');
  const selectedDog = dogs?.find((d: any) => d.id === selectedDogId);

  useEffect(() => {
    if (queryDogId && dogs) {
      const dogExists = dogs.some((d: any) => d.id === queryDogId);
      if (dogExists) {
        setValue('dogId', queryDogId);
      }
    }
  }, [queryDogId, dogs, setValue]);

  useEffect(() => {
    if (selectedDog?.price) {
      setValue('deposit', Math.round(selectedDog.price * 0.2 * 100) / 100);
    }
  }, [selectedDog, setValue]);

  const createMutation = useMutation(
    async (data: ReservationFormData) => {
      const response = await reservationsApi.create({
        ...data,
        kennelId: kennelId || '',
      });
      return response.data;
    },
    {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Reserva creada exitosamente',
        });
        navigate(`/reservations`);
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear la reserva',
        });
      },
    }
  );

  const onSubmit = (data: ReservationFormData) => {
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/reservations"
          className="p-2 hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Nueva reserva
          </h1>
          <p className="text-apple-gray-100">Crea una nueva reserva para un cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Dog selection */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <Dog size={16} className="inline mr-1" />
              Perro *
            </label>
            <select
              {...register('dogId', { required: 'Perro requerido' })}
              className="input-apple"
            >
              <option value="">Selecciona un perro</option>
              {dogs?.map((dog: any) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name} ({dog.breed?.name}) - {dog.gender === 'MALE' ? 'Macho' : 'Hembra'}
                </option>
              ))}
            </select>
            {errors.dogId && (
              <p className="mt-1 text-sm text-red-600">{errors.dogId.message}</p>
            )}
            {dogs?.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                No hay perros disponibles. <Link to="/dogs/create" className="underline">Crear uno</Link>
              </p>
            )}

            {/* Selected dog preview */}
            {selectedDog && (
              <div className="mt-3 p-4 bg-apple-gray rounded-xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                  {selectedDog.photos?.[0]?.url ? (
                    <img
                      src={selectedDog.photos[0].url}
                      alt={selectedDog.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Dog className="w-full h-full p-4 text-apple-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-apple-black">{selectedDog.name}</p>
                  <p className="text-sm text-apple-gray-100">
                    {selectedDog.breed?.name} • {selectedDog.color}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Customer selection */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <User size={16} className="inline mr-1" />
              Cliente *
            </label>
            <select
              {...register('customerId', { required: 'Cliente requerido' })}
              className="input-apple"
            >
              <option value="">Selecciona un cliente</option>
              {customers?.map((customer: any) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} ({customer.email})
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
            )}
            {customers?.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                No hay clientes registrados. <Link to="/customers/create" className="underline">Crear uno</Link>
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Wallet size={16} className="inline mr-1" />
                Monto total (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="input-apple"
                placeholder="1500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Señal/Depósito (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('deposit', { valueAsNumber: true })}
                className="input-apple"
                placeholder="300"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <FileText size={16} className="inline mr-1" />
              Notas
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-apple resize-none"
              placeholder="Condiciones especiales, detalles del acuerdo..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isLoading || !kennelId}
            className="btn-primary h-12 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
            Guardar reserva
          </button>
          <Link to="/reservations" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
