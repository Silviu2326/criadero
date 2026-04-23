import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Loader2, Mail, Lock, Eye, EyeOff, Dog, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const loginMutation = useMutation(
    async (data: LoginForm) => {
      const response = await authApi.login(data.email, data.password);
      return response.data;
    },
    {
      onSuccess: (data) => {
        login(data.user, data.token);
        addNotification({
          type: 'success',
          message: `Bienvenido, ${data.user.firstName}!`,
        });
        switch (data.user.role) {
          case 'VETERINARIAN':
            navigate('/vet');
            break;
          case 'CUSTOMER':
            navigate('/kennels');
            break;
          default:
            navigate('/dashboard');
        }
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al iniciar sesión',
        });
      },
    }
  );

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const quickLogins = [
    { label: 'Manager', email: 'manager@petwellly.com', password: 'Manager123!' },
    { label: 'Breeder', email: 'breeder@petwellly.com', password: 'Breeder123!' },
    { label: 'Veterinario', email: 'vet@petwellly.com', password: 'Vet123!' },
    { label: 'Cliente', email: 'customer@petwellly.com', password: 'Customer123!' },
  ];

  return (
    <div className="animate-fade-in-scale">
      {/* Card */}
      <div className="bg-[#FDFCFA] rounded-2xl shadow-[0_8px_40px_rgba(44,42,38,0.08)] p-8 sm:p-10 border border-apple-gray-300/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#E8EEEB] flex items-center justify-center mb-4 shadow-sm">
            <Dog className="text-[#4A5D52]" size={28} />
          </div>
          <h1 className="text-section font-display font-semibold text-apple-black mb-1">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-apple-gray-100">
            Ingresa tus datos para acceder a tu criadero
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className="w-full pl-11 pr-11 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-apple-gray-100 hover:text-apple-black rounded-lg hover:bg-apple-gray transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-[#A14E4E] flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-[#A14E4E]" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded-md border-apple-gray-300 text-[#4A5D52] focus:ring-[#4A5D52]/20 cursor-pointer"
              />
              <span className="text-sm text-apple-gray-200 group-hover:text-apple-black transition-colors">
                Recuérdame
              </span>
            </label>
            <button
              type="button"
              onClick={() => addNotification({ type: 'info', message: 'Recuperación de contraseña disponible próximamente' })}
              className="text-sm text-[#4A5D52] hover:text-[#4A5D52]-hover font-medium"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loginMutation.isLoading}
            className="w-full h-12 flex items-center justify-center gap-2 bg-[#4A5D52] hover:bg-[#3D4D44] text-[#FDFCFA] rounded-xl font-medium shadow-md shadow-[#4A5D52]/20 hover:shadow-lg hover:shadow-[#4A5D52]/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginMutation.isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-apple-gray-200">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[#4A5D52] hover:text-[#4A5D52]-hover font-medium">
            Crear cuenta gratis
          </Link>
        </p>
      </div>

      {/* Quick testing panel */}
      <div className="mt-6 bg-[#FDFCFA]/70 backdrop-blur rounded-2xl border border-apple-gray-300/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#4A5D52]" />
          <p className="text-xs font-semibold text-apple-black uppercase tracking-wider">
            Acceso rápido para testing
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickLogins.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => loginMutation.mutate({ email: q.email, password: q.password })}
              disabled={loginMutation.isLoading}
              className="px-3 py-2.5 rounded-xl border border-apple-gray-300 bg-apple-gray/40 hover:bg-[#FDFCFA] hover:border-[#4A5D52]/40 hover:text-[#4A5D52] text-sm font-medium text-apple-gray-200 transition-all text-left disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
