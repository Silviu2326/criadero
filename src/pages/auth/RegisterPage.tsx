import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Loader2, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Nombre muy corto'),
  lastName: z.string().min(2, 'Apellido muy corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation(
    async (data: RegisterForm) => {
      const { confirmPassword, ...registerData } = data;
      const response = await authApi.register(registerData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        login(data.user, data.token);
        addNotification({
          type: 'success',
          message: 'Cuenta creada exitosamente!',
        });
        switch (data.user.role) {
          case 'VETERINARIAN':
            navigate('/vet');
            break;
          case 'CUSTOMER':
            navigate('/account');
            break;
          default:
            navigate('/dashboard');
        }
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear cuenta',
        });
      },
    }
  );

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="animate-fade-in-scale">
      {/* Back link */}
      <div className="mb-4 lg:hidden">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-apple-gray-200 hover:text-apple-black transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio de sesión
        </Link>
      </div>

      {/* Card */}
      <div className="bg-[#FDFCFA] rounded-2xl shadow-[0_8px_40px_rgba(44,42,38,0.08)] p-8 sm:p-10 border border-apple-gray-300/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#E8EEEB] flex items-center justify-center mb-4 shadow-sm">
            <User className="text-[#4A5D52]" size={28} />
          </div>
          <h1 className="text-section font-display font-semibold text-apple-black mb-1">
            Crear cuenta
          </h1>
          <p className="text-sm text-apple-gray-100">
            Regístrate gratis y comienza a gestionar tu criadero
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full pl-11 pr-4 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all"
                  placeholder="Juan"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-[#A14E4E] flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#A14E4E]" />
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Apellido
              </label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full px-4 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all"
                placeholder="Pérez"
              />
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-[#A14E4E] flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#A14E4E]" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full pl-11 pr-4 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all"
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-[#A14E4E] flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-[#A14E4E]" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Teléfono <span className="text-apple-gray-100 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type="tel"
                {...register('phone')}
                className="w-full pl-11 pr-4 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all"
                placeholder="+1 555-0123"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className="w-full pl-11 pr-4 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-[#A14E4E] flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-[#A14E4E]" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full px-4 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all"
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-[#A14E4E] flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-[#A14E4E]" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={registerMutation.isLoading}
            className="w-full h-12 flex items-center justify-center gap-2 bg-[#4A5D52] hover:bg-[#3D4D44] text-[#FDFCFA] rounded-xl font-medium shadow-md shadow-[#4A5D52]/20 hover:shadow-lg hover:shadow-[#4A5D52]/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {registerMutation.isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Crear cuenta gratis'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-apple-gray-200">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#4A5D52] hover:text-[#4A5D52]-hover font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
