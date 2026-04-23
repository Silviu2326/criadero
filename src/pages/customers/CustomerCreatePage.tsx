import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { customersApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export function CustomerCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: user?.role === 'MANAGER' || user?.role === 'BREEDER' }
  );

  const kennelId = myKennels?.[0]?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>();

  const createMutation = useMutation(
    async (data: CustomerFormData) => {
      const response = await customersApi.create({
        ...data,
        kennelId: kennelId || '',
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        addNotification({
          type: 'success',
          message: 'Cliente creado exitosamente',
        });
        navigate(`/customers/${data.customer.id}`);
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear el cliente',
        });
      },
    }
  );

  const onSubmit = (data: CustomerFormData) => {
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
          to="/customers"
          className="p-2 hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Nuevo cliente
          </h1>
          <p className="text-apple-gray-100">Registra un nuevo cliente en tu criadero</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <User size={16} className="inline mr-1" />
                Nombre *
              </label>
              <input
                {...register('firstName', { required: 'Nombre requerido' })}
                className="input-apple"
                placeholder="Ej. Juan"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <User size={16} className="inline mr-1" />
                Apellido *
              </label>
              <input
                {...register('lastName', { required: 'Apellido requerido' })}
                className="input-apple"
                placeholder="Ej. García"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Mail size={16} className="inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email requerido',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido',
                  },
                })}
                className="input-apple"
                placeholder="juan@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">
                <FileText size={16} className="inline mr-1" />
                Notas
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-apple resize-none"
                placeholder="Información adicional sobre el cliente..."
              />
            </div>
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
            Guardar cliente
          </button>
          <Link to="/customers" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
