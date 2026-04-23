import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { showsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface ShowFormData {
  name: string;
  organizer: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  entryFee: number;
  federation: string;
  website: string;
}

const statusLabels: Record<string, string> = {
  UPCOMING: 'Próximo',
  ONGOING: 'En curso',
  COMPLETED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

export function ShowCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: kennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShowFormData>({
    defaultValues: {
      status: 'UPCOMING',
    },
  });

  const createMutation = useMutation(
    async (data: ShowFormData) => {
      const response = await showsApi.create({
        ...data,
        kennelId: kennels?.[0]?.id || '',
      });
      return response.data;
    },
    {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Evento creado exitosamente',
        });
        navigate('/shows');
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear el evento',
        });
      },
    }
  );

  const onSubmit = (data: ShowFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/shows" className="p-2 hover:bg-apple-gray rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">Nuevo evento</h1>
          <p className="text-apple-gray-100">Agrega una exposición al calendario</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">Nombre *</label>
              <input
                {...register('name', { required: 'Nombre requerido' })}
                className="input-apple w-full"
                placeholder="Ej. Exposición Canina Internacional de Madrid"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Organizador</label>
              <input
                {...register('organizer')}
                className="input-apple w-full"
                placeholder="Ej. RSCE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Ubicación *</label>
              <input
                {...register('location', { required: 'Ubicación requerida' })}
                className="input-apple w-full"
                placeholder="Ej. Madrid, ES"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Fecha de inicio *</label>
              <input
                type="date"
                {...register('startDate', { required: 'Fecha requerida' })}
                className="input-apple w-full"
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Fecha de fin</label>
              <input
                type="date"
                {...register('endDate')}
                className="input-apple w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Estado</label>
              <select {...register('status')} className="input-apple w-full">
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Federación</label>
              <input
                {...register('federation')}
                className="input-apple w-full"
                placeholder="Ej. FCI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Cuota de inscripción (€)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                {...register('entryFee', { valueAsNumber: true })}
                className="input-apple w-full"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Sitio web</label>
              <input
                type="url"
                {...register('website')}
                className="input-apple w-full"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="btn-primary h-12 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
            Guardar evento
          </button>
          <Link to="/shows" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
