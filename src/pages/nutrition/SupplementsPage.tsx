import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { nutritionApi, kennelsApi, dogsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Pill, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';

export function SupplementsPage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [showForm, setShowForm] = useState(false);

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

  const { data: supplementsData, isLoading } = useQuery(
    ['nutrition-supplements', kennelId],
    () => nutritionApi.getSupplements({ kennelId }).then((r) => r.data.supplements),
    { enabled: !!kennelId }
  );

  const dogs = dogsData || [];
  const supplements = supplementsData || [];

  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      dogId: '',
      name: '',
      dosage: '',
      frequency: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      notes: '',
    },
  });

  const createMutation = useMutation(
    (data: any) =>
      nutritionApi.createSupplement({
        ...data,
        endDate: data.endDate || undefined,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-supplements']);
        addNotification({ type: 'success', message: 'Suplemento añadido' });
        reset();
        setShowForm(false);
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al añadir' });
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => nutritionApi.deleteSupplement(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-supplements']);
        addNotification({ type: 'success', message: 'Suplemento eliminado' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const isActive = (s: any) => !s.endDate || new Date(s.endDate) > new Date();

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
        title="Suplementos"
        subtitle={`${supplements.length} suplementos registrados`}
        action={
          isBreeder && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <Plus size={18} />
              {showForm ? 'Cerrar' : 'Añadir suplemento'}
            </button>
          )
        }
      />

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-apple-black mb-4">Nuevo suplemento</h3>
          <form
            onSubmit={handleSubmit((data) => createMutation.mutate(data))}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Perro</label>
              <select
                {...register('dogId', { required: 'Selecciona un perro' })}
                className="input-apple select-apple w-full"
              >
                <option value="">Seleccionar</option>
                {dogs.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Nombre</label>
              <input
                type="text"
                {...register('name', { required: 'Obligatorio' })}
                className="input-apple w-full"
                placeholder="Ej: Glucosamina"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Dosis</label>
              <input
                type="text"
                {...register('dosage', { required: 'Obligatorio' })}
                className="input-apple w-full"
                placeholder="Ej: 1 comprimido"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Frecuencia</label>
              <input
                type="text"
                {...register('frequency', { required: 'Obligatorio' })}
                className="input-apple w-full"
                placeholder="Ej: 1 vez al día"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Inicio</label>
              <input type="date" {...register('startDate')} className="input-apple w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Fin (opcional)</label>
              <input type="date" {...register('endDate')} className="input-apple w-full" />
            </div>

            <div className="md:col-span-2 lg:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-1">Notas</label>
              <input
                type="text"
                {...register('notes')}
                className="input-apple w-full"
                placeholder="Observaciones..."
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={createMutation.isLoading}>
                {createMutation.isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="skeleton h-8 w-32" />
            </div>
          ))}
        </div>
      ) : supplements.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay suplementos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">
            Añade vitaminas, glucosamina u otros suplementos para tus perros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {supplements.map((supplement: any) => {
            const active = isActive(supplement);
            return (
              <div key={supplement.id} className="card p-5 card-interactive">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        active ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      <Pill size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-apple-black">{supplement.name}</h4>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {active ? 'Activo' : 'Finalizado'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(supplement.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-apple-gray-100">Perro</span>
                    <span className="font-medium text-apple-black">{supplement.dog?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-apple-gray-100">Dosis</span>
                    <span className="font-medium text-apple-black">{supplement.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-apple-gray-100">Frecuencia</span>
                    <span className="font-medium text-apple-black">{supplement.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-apple-gray-100">Inicio</span>
                    <span className="font-medium text-apple-black">
                      {supplement.startDate ? format(new Date(supplement.startDate), 'dd MMM yyyy') : '-'}
                    </span>
                  </div>
                  {supplement.endDate && (
                    <div className="flex justify-between">
                      <span className="text-apple-gray-100">Fin</span>
                      <span className="font-medium text-apple-black">
                        {format(new Date(supplement.endDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                {supplement.notes && (
                  <p className="text-sm text-apple-gray-100 border-t border-apple-gray-300/50 pt-3">
                    {supplement.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
