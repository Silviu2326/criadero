import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { clientReportApi, kennelsApi, dogsApi, customersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';

export function ClientReportCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: dogsData } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const { data: customersData } = useQuery(
    ['customers', kennelId],
    () => customersApi.getAll({ kennelId }).then((r) => r.data.customers),
    { enabled: !!kennelId }
  );

  const dogs = dogsData || [];
  const customers = customersData || [];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dogId: '',
      customerId: '',
      title: '',
      notes: '',
      recommendations: '',
    },
  });

  const selectedDogId = watch('dogId');
  const selectedDog = dogs.find((d: any) => d.id === selectedDogId);

  const createMutation = useMutation(
    (data: any) => clientReportApi.generate({ ...data, kennelId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['client-reports']);
        addNotification({ type: 'success', message: 'Informe generado correctamente' });
        navigate('/reports/client');
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al generar el informe' });
      },
    }
  );

  const onSubmit = (data: any) => {
    if (!kennelId) {
      addNotification({ type: 'error', message: 'No se encontró un criadero activo' });
      return;
    }
    const title = data.title || `Informe de entrega - ${selectedDog?.name || ''}`;
    createMutation.mutate({ ...data, title });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/reports/client"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </Link>
      </div>

      <PageHeader title="Generar informe" subtitle="Crea un informe profesional para el cliente" />

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">Perro *</label>
              <select
                {...register('dogId', { required: 'Selecciona un perro' })}
                className="select-apple w-full"
              >
                <option value="">Seleccionar perro...</option>
                {dogs.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>{dog.name}</option>
                ))}
              </select>
              {errors.dogId && <p className="text-red-500 text-xs mt-1">{errors.dogId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">Cliente (opcional)</label>
              <select {...register('customerId')} className="select-apple w-full">
                <option value="">Sin cliente asignado</option>
                {customers.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Título</label>
            <input
              {...register('title')}
              className="input-apple w-full"
              placeholder={`Ej: Informe de entrega - ${selectedDog?.name || ''}`}
            />
            <p className="text-xs text-apple-gray-200 mt-1">Se generará automáticamente si se deja vacío</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Notas adicionales</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-apple w-full"
              placeholder="Notas que aparecerán en el informe..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Recomendaciones personalizadas</label>
            <textarea
              {...register('recommendations')}
              rows={5}
              className="input-apple w-full"
              placeholder="Recomendaciones específicas para el nuevo dueño..."
            />
            <p className="text-xs text-apple-gray-200 mt-1">
              Si se deja vacío, se generarán automáticamente a partir de los datos del perro
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-apple-gray-100">
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="btn-primary"
            >
              {createMutation.isLoading ? 'Generando...' : 'Generar informe'}
            </button>
            <Link to="/reports/client" className="btn-outline">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
