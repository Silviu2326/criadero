import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2, Upload, X, Building2, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KennelFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
}

export function KennelCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [logo, setLogo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KennelFormData>();

  const createMutation = useMutation(
    async (data: KennelFormData) => {
      const response = await kennelsApi.create({
        ...data,
        breederId: user?.id || '',
        logoUrl: logo || undefined,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        addNotification({
          type: 'success',
          message: 'Criadero creado exitosamente',
        });
        navigate(`/kennels/${data.kennel.id}`);
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear el criadero',
        });
      },
    }
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setLogo(url);
  };

  const removeLogo = () => {
    setLogo(null);
  };

  const onSubmit = (data: KennelFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/kennels"
          className="p-2 hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Nuevo criadero
          </h1>
          <p className="text-apple-gray-100">Registra un nuevo criadero en el sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-3">
              Logo
            </label>
            <div className="flex items-center gap-4">
              {logo ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 border-2 border-dashed border-apple-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-apple-blue transition-colors">
                  <Upload size={24} className="text-apple-gray-100 mb-1" />
                  <span className="text-xs text-apple-gray-100">Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              )}
              <p className="text-sm text-apple-gray-100">
                Opcional. Se mostrará en la página pública del criadero.
              </p>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Building2 size={16} className="inline mr-1" />
                Nombre del criadero *
              </label>
              <input
                {...register('name', { required: 'Nombre requerido' })}
                className="input-apple"
                placeholder="Ej. Criadero Los Pinos"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-apple resize-none"
                placeholder="Describe tu criadero, especialidades, historia..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Mail size={16} className="inline mr-1" />
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-apple"
                placeholder="contacto@criadero.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Phone size={16} className="inline mr-1" />
                Teléfono
              </label>
              <input
                {...register('phone')}
                className="input-apple"
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Globe size={16} className="inline mr-1" />
                Sitio web
              </label>
              <input
                {...register('website')}
                className="input-apple"
                placeholder="https://www.criadero.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <MapPin size={16} className="inline mr-1" />
                Dirección
              </label>
              <input
                {...register('address')}
                className="input-apple"
                placeholder="Calle Principal 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Ciudad
              </label>
              <input
                {...register('city')}
                className="input-apple"
                placeholder="Madrid"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                País
              </label>
              <input
                {...register('country')}
                className="input-apple"
                placeholder="España"
              />
            </div>
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
            Guardar criadero
          </button>
          <Link to="/kennels" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
