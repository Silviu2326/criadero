import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { littersApi, dogsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2, Baby, Plus, Minus, Dog } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LitterFormData {
  birthDate: string;
  fatherId: string;
  motherId: string;
  puppyCount: number;
  deadPuppies: number;
  notes: string;
}

export function LitterCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [puppyDetails, setPuppyDetails] = useState<{ name: string; gender: 'MALE' | 'FEMALE'; color: string }[]>([]);

  const defaultFatherId = searchParams.get('fatherId') || '';
  const defaultMotherId = searchParams.get('motherId') || '';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: user?.role === 'MANAGER' || user?.role === 'BREEDER' }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: dogs } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const maleDogs = dogs?.filter((d: any) => d.gender === 'MALE') || [];
  const femaleDogs = dogs?.filter((d: any) => d.gender === 'FEMALE') || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LitterFormData>({
    defaultValues: {
      fatherId: defaultFatherId,
      motherId: defaultMotherId,
      puppyCount: 0,
      deadPuppies: 0,
    },
  });

  useEffect(() => {
    if (defaultFatherId && maleDogs.some((d: any) => d.id === defaultFatherId)) {
      setValue('fatherId', defaultFatherId);
    }
    if (defaultMotherId && femaleDogs.some((d: any) => d.id === defaultMotherId)) {
      setValue('motherId', defaultMotherId);
    }
  }, [maleDogs, femaleDogs, defaultFatherId, defaultMotherId, setValue]);

  const puppyCount = watch('puppyCount');

  const createMutation = useMutation(
    async (data: LitterFormData) => {
      const response = await littersApi.create({
        ...data,
        kennelId: kennelId || '',
        puppies: puppyDetails.slice(0, data.puppyCount),
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        addNotification({
          type: 'success',
          message: 'Camada creada exitosamente',
        });
        navigate(`/litters/${data.litter.id}`);
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear la camada',
        });
      },
    }
  );

  const updatePuppyCount = (increment: number) => {
    const newCount = Math.max(0, (puppyCount || 0) + increment);
    setValue('puppyCount', newCount);

    // Adjust puppyDetails array
    if (newCount > puppyDetails.length) {
      const newPuppies = Array(newCount - puppyDetails.length).fill(null).map(() => ({
        name: '',
        gender: 'MALE' as const,
        color: '',
      }));
      setPuppyDetails([...puppyDetails, ...newPuppies]);
    } else if (newCount < puppyDetails.length) {
      setPuppyDetails(puppyDetails.slice(0, newCount));
    }
  };

  const updatePuppyDetail = (index: number, field: string, value: string) => {
    const updated = [...puppyDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPuppyDetails(updated);
  };

  const onSubmit = (data: LitterFormData) => {
    if (!kennelId) {
      addNotification({
        type: 'error',
        message: 'No tienes un criadero asignado',
      });
      return;
    }
    if (!data.fatherId || !data.motherId) {
      addNotification({
        type: 'error',
        message: 'Debes seleccionar padre y madre',
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
          to="/litters"
          className="p-2 hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Nueva camada
          </h1>
          <p className="text-apple-gray-100">Registra una nueva camada de cachorros</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Parents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Dog size={16} className="inline mr-1 text-blue-500" />
                Padre *
              </label>
              <select
                {...register('fatherId', { required: 'Padre requerido' })}
                className="input-apple"
              >
                <option value="">Selecciona el padre</option>
                {maleDogs.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} ({dog.breed?.name})
                  </option>
                ))}
              </select>
              {errors.fatherId && (
                <p className="mt-1 text-sm text-red-600">{errors.fatherId.message}</p>
              )}
              {maleDogs.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  No hay perros machos registrados. <Link to="/dogs/create" className="underline">Crear uno</Link>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Dog size={16} className="inline mr-1 text-pink-500" />
                Madre *
              </label>
              <select
                {...register('motherId', { required: 'Madre requerida' })}
                className="input-apple"
              >
                <option value="">Selecciona la madre</option>
                {femaleDogs.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} ({dog.breed?.name})
                  </option>
                ))}
              </select>
              {errors.motherId && (
                <p className="mt-1 text-sm text-red-600">{errors.motherId.message}</p>
              )}
              {femaleDogs.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  No hay perros hembras registrados. <Link to="/dogs/create" className="underline">Crear una</Link>
                </p>
              )}
            </div>
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Fecha de nacimiento *
            </label>
            <input
              type="date"
              {...register('birthDate', { required: 'Fecha requerida' })}
              className="input-apple"
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
            )}
          </div>

          {/* Puppy count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Baby size={16} className="inline mr-1" />
                Cachorros vivos
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updatePuppyCount(-1)}
                  className="p-2 rounded-lg bg-apple-gray hover:bg-apple-gray-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="0"
                  {...register('puppyCount', { valueAsNumber: true })}
                  className="input-apple w-24 text-center"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => updatePuppyCount(1)}
                  className="p-2 rounded-lg bg-apple-gray hover:bg-apple-gray-300 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Cachorros fallecidos
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setValue('deadPuppies', Math.max(0, (watch('deadPuppies') || 0) - 1))}
                  className="p-2 rounded-lg bg-apple-gray hover:bg-apple-gray-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min="0"
                  {...register('deadPuppies', { valueAsNumber: true })}
                  className="input-apple w-24 text-center"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setValue('deadPuppies', (watch('deadPuppies') || 0) + 1)}
                  className="p-2 rounded-lg bg-apple-gray hover:bg-apple-gray-300 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Puppy details */}
          {puppyCount > 0 && (
            <div>
              <label className="block text-sm font-medium text-apple-black mb-3">
                Detalles de cachorros (opcional)
              </label>
              <div className="space-y-3">
                {puppyDetails.map((puppy, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-apple-gray rounded-lg">
                    <span className="text-sm font-medium text-apple-gray-100 w-8">
                      #{index + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Nombre (opcional)"
                      value={puppy.name}
                      onChange={(e) => updatePuppyDetail(index, 'name', e.target.value)}
                      className="input-apple py-2 text-sm flex-1"
                    />
                    <select
                      value={puppy.gender}
                      onChange={(e) => updatePuppyDetail(index, 'gender', e.target.value)}
                      className="input-apple py-2 text-sm w-28"
                    >
                      <option value="MALE">Macho</option>
                      <option value="FEMALE">Hembra</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Color"
                      value={puppy.color}
                      onChange={(e) => updatePuppyDetail(index, 'color', e.target.value)}
                      className="input-apple py-2 text-sm w-32"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Notas
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-apple resize-none"
              placeholder="Información adicional sobre la camada..."
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
            Guardar camada
          </button>
          <Link to="/litters" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
