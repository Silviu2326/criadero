import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { nutritionApi, kennelsApi, breedsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const dietTypes = [
  { value: 'DRY', label: 'Pienso seco' },
  { value: 'WET', label: 'Húmedo' },
  { value: 'BARF', label: 'BARF' },
  { value: 'HOME_COOKED', label: 'Casero' },
  { value: 'MIXED', label: 'Mixto' },
];

const activityLevels = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MODERATE', label: 'Moderada' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'VERY_HIGH', label: 'Muy alta' },
];

export function NutritionPlanCreatePage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const { data: breedsData } = useQuery(
    'breeds',
    () => breedsApi.getAll().then((r) => r.data.breeds)
  );

  const kennelId = myKennels?.[0]?.id;
  const breeds = breedsData || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      dietType: 'DRY',
      targetBreedId: '',
      minAgeMonths: '',
      maxAgeMonths: '',
      minWeightKg: '',
      maxWeightKg: '',
      activityLevel: 'MODERATE',
      dailyGramsPerKg: '',
      instructions: '',
    },
  });

  const mutation = useMutation(
    (data: any) =>
      nutritionApi.createPlan({
        ...data,
        kennelId: kennelId!,
        targetBreedId: data.targetBreedId || undefined,
        minAgeMonths: data.minAgeMonths ? Number(data.minAgeMonths) : undefined,
        maxAgeMonths: data.maxAgeMonths ? Number(data.maxAgeMonths) : undefined,
        minWeightKg: data.minWeightKg ? Number(data.minWeightKg) : undefined,
        maxWeightKg: data.maxWeightKg ? Number(data.maxWeightKg) : undefined,
        dailyGramsPerKg: Number(data.dailyGramsPerKg),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-plans']);
        addNotification({ type: 'success', message: 'Plan creado correctamente' });
        navigate('/nutrition/plans');
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al crear el plan' });
      },
    }
  );

  if (!kennelId) {
    return (
      <div className="animate-fade-in p-8 text-center">
        <p className="text-apple-gray-100">Cargando datos del criadero...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/nutrition/plans"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a planes
        </Link>
      </div>

      <div className="card">
        <div className="p-6 border-b border-apple-gray-300/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <ChefHat size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-apple-black">Nuevo plan de alimentación</h1>
            <p className="text-sm text-apple-gray-100">Define las características del plan nutricional</p>
          </div>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">Nombre del plan</label>
              <input
                type="text"
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="input-apple w-full"
                placeholder="Ej: Pienso premium adulto grande"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Tipo de dieta</label>
              <select {...register('dietType')} className="input-apple select-apple w-full">
                {dietTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Raza objetivo (opcional)</label>
              <select {...register('targetBreedId')} className="input-apple select-apple w-full">
                <option value="">Todas las razas</option>
                {breeds.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Edad mínima (meses)</label>
              <input
                type="number"
                {...register('minAgeMonths')}
                className="input-apple w-full"
                placeholder="Ej: 12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Edad máxima (meses)</label>
              <input
                type="number"
                {...register('maxAgeMonths')}
                className="input-apple w-full"
                placeholder="Ej: 84"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Peso mínimo (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register('minWeightKg')}
                className="input-apple w-full"
                placeholder="Ej: 5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Peso máximo (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register('maxWeightKg')}
                className="input-apple w-full"
                placeholder="Ej: 40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Nivel de actividad</label>
              <select {...register('activityLevel')} className="input-apple select-apple w-full">
                {activityLevels.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Ración diaria (g/kg)</label>
              <input
                type="number"
                step="0.1"
                {...register('dailyGramsPerKg', { required: 'La ración diaria es obligatoria' })}
                className="input-apple w-full"
                placeholder="Ej: 25"
              />
              {errors.dailyGramsPerKg && (
                <p className="text-red-500 text-xs mt-1">{errors.dailyGramsPerKg.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">Instrucciones</label>
            <textarea
              {...register('instructions')}
              rows={4}
              className="input-apple w-full"
              placeholder="Instrucciones de preparación o notas adicionales..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-apple-gray-300/50">
            <Link to="/nutrition/plans" className="btn-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Creando...' : 'Crear plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
