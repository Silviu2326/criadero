import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { nutritionApi, kennelsApi, dogsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, ClipboardList, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@/components/common/PageHeader';

export function NutritionDailyLogPage() {
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

  const { data: plansData } = useQuery(
    ['nutrition-plans', kennelId],
    () => nutritionApi.getPlans({ kennelId, isActive: true }).then((r) => r.data.plans),
    { enabled: !!kennelId }
  );

  const { data: logsData, isLoading } = useQuery(
    ['nutrition-logs', kennelId],
    () => nutritionApi.getLogs({ kennelId }).then((r) => r.data.logs),
    { enabled: !!kennelId }
  );

  const dogs = dogsData || [];
  const plans = plansData || [];
  const logs = logsData || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      dogId: '',
      planId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      gramsServed: '',
      gramsLeftovers: '0',
      notes: '',
    },
  });

  const createMutation = useMutation(
    (data: any) =>
      nutritionApi.createLog({
        ...data,
        gramsServed: Number(data.gramsServed),
        gramsLeftovers: Number(data.gramsLeftovers),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-logs']);
        queryClient.invalidateQueries(['nutrition-logs-today']);
        addNotification({ type: 'success', message: 'Registro guardado' });
        reset();
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al guardar' });
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => nutritionApi.deleteLog(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-logs']);
        queryClient.invalidateQueries(['nutrition-logs-today']);
        addNotification({ type: 'success', message: 'Registro eliminado' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const selectedDogId = watch('dogId');
  const selectedPlanId = watch('planId');

  const recommendedRation = () => {
    const dog = dogs.find((d: any) => d.id === selectedDogId);
    const plan = plans.find((p: any) => p.id === selectedPlanId);
    if (dog && plan && plan.dailyGramsPerKg) {
      // Usamos peso estimado de 25kg si no tenemos el peso real en este formulario
      return Math.round(plan.dailyGramsPerKg * 25);
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/nutrition"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a Nutrición
        </Link>
      </div>

      <PageHeader
        title="Registro diario"
        subtitle="Anota las comidas servidas y los sobrantes"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
            <h3 className="font-semibold text-apple-black">Nuevo registro</h3>
          </div>

          <form
            onSubmit={handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Perro</label>
              <select
                {...register('dogId', { required: 'Selecciona un perro' })}
                className="input-apple select-apple w-full"
              >
                <option value="">Seleccionar perro</option>
                {dogs.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name}
                  </option>
                ))}
              </select>
              {errors.dogId && <p className="text-red-500 text-xs mt-1">{errors.dogId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Plan</label>
              <select
                {...register('planId', { required: 'Selecciona un plan' })}
                className="input-apple select-apple w-full"
              >
                <option value="">Seleccionar plan</option>
                {plans.map((plan: any) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              {errors.planId && <p className="text-red-500 text-xs mt-1">{errors.planId.message}</p>}
            </div>

            {recommendedRation() && (
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                <strong>Ración recomendada aproximada:</strong>{' '}
                {recommendedRation()}g (basado en 25kg de peso)
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Fecha</label>
              <input type="date" {...register('date')} className="input-apple w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-apple-black mb-1">Servido (g)</label>
                <input
                  type="number"
                  {...register('gramsServed', { required: 'Obligatorio' })}
                  className="input-apple w-full"
                  placeholder="Gramos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-black mb-1">Sobrante (g)</label>
                <input
                  type="number"
                  {...register('gramsLeftovers')}
                  className="input-apple w-full"
                  placeholder="Gramos"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Notas</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-apple w-full"
                placeholder="Observaciones..."
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? 'Guardando...' : 'Guardar registro'}
            </button>
          </form>
        </div>

        {/* Logs list */}
        <div className="card lg:col-span-2">
          <div className="p-5 border-b border-apple-gray-300/50">
            <h3 className="font-semibold text-apple-black text-lg">Historial de registros</h3>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-apple-gray-100">No hay registros aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-modern w-full">
                <thead>
                  <tr>
                    <th className="text-left">Fecha</th>
                    <th className="text-left">Perro</th>
                    <th className="text-left">Plan</th>
                    <th className="text-left">Servido</th>
                    <th className="text-left">Sobrante</th>
                    <th className="text-left">Consumido</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id}>
                      <td className="text-apple-gray-100">
                        {log.date ? format(new Date(log.date), 'dd MMM yyyy') : '-'}
                      </td>
                      <td className="font-medium text-apple-black">{log.dog?.name}</td>
                      <td>{log.plan?.name}</td>
                      <td>{log.gramsServed}g</td>
                      <td>{log.gramsLeftovers}g</td>
                      <td className="font-semibold text-green-600">
                        {log.gramsServed - log.gramsLeftovers}g
                      </td>
                      <td>
                        <button
                          onClick={() => deleteMutation.mutate(log.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
