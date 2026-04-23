import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { nutritionApi, kennelsApi, dogsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';

const severityOptions = [
  { value: 'MILD', label: 'Leve' },
  { value: 'MODERATE', label: 'Moderada' },
  { value: 'SEVERE', label: 'Grave' },
  { value: 'LIFE_THREATENING', label: 'Vital (riesgo de vida)' },
];

export function IntoleranceCreatePage() {
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

  const dogs = dogsData || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dogId: '',
      foodName: '',
      severity: 'MILD',
      symptoms: '',
      notes: '',
    },
  });

  const createMutation = useMutation(
    (data: any) => nutritionApi.createIntolerance(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-intolerances']);
        addNotification({ type: 'success', message: 'Intolerancia registrada correctamente' });
        navigate('/nutrition/intolerances');
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al registrar la intolerancia' });
      },
    }
  );

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/nutrition/intolerances"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </Link>
      </div>

      <PageHeader title="Registrar intolerancia" subtitle="Registra una nueva intolerancia alimentaria" />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
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
            <label className="block text-sm font-medium text-apple-black mb-1.5">Alimento / Ingrediente *</label>
            <input
              {...register('foodName', { required: 'El alimento es obligatorio' })}
              className="input-apple w-full"
              placeholder="Ej: Pollo, trigo, lactosa..."
            />
            {errors.foodName && <p className="text-red-500 text-xs mt-1">{errors.foodName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Severidad *</label>
            <select {...register('severity')} className="select-apple w-full">
              {severityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Síntomas típicos</label>
            <textarea
              {...register('symptoms')}
              rows={3}
              className="input-apple w-full"
              placeholder="Describe los síntomas que presenta el perro..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Notas</label>
            <textarea
              {...register('notes')}
              rows={2}
              className="input-apple w-full"
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-apple-gray-100">
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="btn-primary"
            >
              {createMutation.isLoading ? 'Registrando...' : 'Registrar intolerancia'}
            </button>
            <Link to="/nutrition/intolerances" className="btn-outline">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
