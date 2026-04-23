import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from 'react-query';
import { dogsApi, breedsApi, kennelsApi } from '@/services/api';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2, Upload, X, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DogFormData {
  name: string;
  breedId: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  color: string;
  microchip: string;
  pedigree: string;
  price: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'REPRODUCTIVE' | 'RETIRED';
  visibility: 'PUBLIC' | 'PRIVATE';
  internalNotes: string;
  fatherId?: string;
  motherId?: string;
}

export function DogCreatePage() {
  const navigate = useNavigate();
  const { addNotification } = useUIStore();
  const [photos, setPhotos] = useState<string[]>([]);

  const { data: kennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels)
  );

  const { data: breeds } = useQuery(
    'breeds',
    () => breedsApi.getAll().then((r) => r.data.breeds)
  );

  const { data: availableParents } = useQuery(
    'parents',
    () => dogsApi.getParents({ kennelId: kennels?.[0]?.id || '', gender: 'MALE' }).then((r) => r.data.dogs),
    { enabled: !!kennels?.[0]?.id }
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DogFormData>({
    defaultValues: {
      status: 'AVAILABLE',
      visibility: 'PRIVATE',
    },
  });

  const createMutation = useMutation(
    async (data: DogFormData) => {
      const response = await dogsApi.create({
        ...data,
        kennelId: kennels?.[0]?.id || '',
        photos,
        price: data.price ? parseFloat(data.price) : undefined,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        addNotification({
          type: 'success',
          message: 'Perro creado exitosamente',
        });
        navigate(`/dogs/${data.dog.id}`);
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear el perro',
        });
      },
    }
  );

  const visibility = watch('visibility');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you'd upload to a storage service
    // For now, we'll create object URLs
    Array.from(files).forEach((file) => {
      if (photos.length >= 10) {
        addNotification({
          type: 'warning',
          message: 'Máximo 10 fotos permitidas',
        });
        return;
      }
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, url]);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: DogFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/dogs"
          className="p-2 hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Nuevo perro
          </h1>
          <p className="text-apple-gray-100">Agrega un perro a tu criadero</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-3">
              Fotos ({photos.length}/10)
            </label>
            <div className="grid grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {photos.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-apple-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-apple-blue transition-colors">
                  <Upload size={24} className="text-apple-gray-100 mb-2" />
                  <span className="text-xs text-apple-gray-100">Agregar</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Nombre *
              </label>
              <input
                {...register('name', { required: 'Nombre requerido' })}
                className="input-apple"
                placeholder="Ej. Max"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Raza *
              </label>
              <select
                {...register('breedId', { required: 'Raza requerida' })}
                className="input-apple"
              >
                <option value="">Selecciona una raza</option>
                {breeds?.map((breed: any) => (
                  <option key={breed.id} value={breed.id}>{breed.name}</option>
                ))}
              </select>
              {errors.breedId && (
                <p className="mt-1 text-sm text-red-600">{errors.breedId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Sexo *
              </label>
              <select {...register('gender')} className="input-apple">
                <option value="MALE">Macho</option>
                <option value="FEMALE">Hembra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Fecha de nacimiento *
              </label>
              <input
                type="date"
                {...register('birthDate', { required: 'Fecha requerida' })}
                className="input-apple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Color
              </label>
              <input
                {...register('color')}
                className="input-apple"
                placeholder="Ej. Dorado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Número de microchip
              </label>
              <input
                {...register('microchip')}
                className="input-apple"
                placeholder="9851..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Precio (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('price')}
                className="input-apple"
                placeholder="1500"
              />
            </div>
          </div>

          {/* Status and visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Estado
              </label>
              <select {...register('status')} className="input-apple">
                <option value="AVAILABLE">Disponible</option>
                <option value="RESERVED">Reservado</option>
                <option value="SOLD">Vendido</option>
                <option value="REPRODUCTIVE">Reproductivo</option>
                <option value="RETIRED">Retirado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Visibilidad
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="PUBLIC"
                    {...register('visibility')}
                    className="sr-only"
                  />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    visibility === 'PUBLIC'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <Eye size={18} />
                    <span>Público</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="PRIVATE"
                    {...register('visibility')}
                    className="sr-only"
                  />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    visibility === 'PRIVATE'
                      ? 'border-gray-500 bg-gray-100 text-gray-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <EyeOff size={18} />
                    <span>Privado</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Parents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Padre
              </label>
              <select {...register('fatherId')} className="input-apple">
                <option value="">Sin padre registrado</option>
                {availableParents
                  ?.filter((p: any) => p.gender === 'MALE')
                  .map((parent: any) => (
                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Madre
              </label>
              <select {...register('motherId')} className="input-apple">
                <option value="">Sin madre registrada</option>
                {availableParents
                  ?.filter((p: any) => p.gender === 'FEMALE')
                  .map((parent: any) => (
                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Internal notes */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Notas internas
            </label>
            <textarea
              {...register('internalNotes')}
              rows={3}
              className="input-apple resize-none"
              placeholder="Notas solo visibles para ti..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="btn-primary h-12 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
            Guardar perro
          </button>
          <Link to="/dogs" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
