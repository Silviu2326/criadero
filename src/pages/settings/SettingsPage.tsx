import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { authApi } from '@/services/api';
import { useMutation } from 'react-query';
import {
  User,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NotificationSettings {
  emailReservations: boolean;
  emailPayments: boolean;
  emailUpdates: boolean;
  pushMessages: boolean;
  pushReminders: boolean;
}

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { addNotification } = useUIStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailReservations: true,
    emailPayments: true,
    emailUpdates: false,
    pushMessages: true,
    pushReminders: true,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data: typeof profileForm) => authApi.updateProfile(data),
    {
      onSuccess: (response) => {
        setUser({ ...user!, ...response.data.user });
        addNotification({ type: 'success', message: 'Perfil actualizado correctamente' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al actualizar el perfil' });
      },
    }
  );

  // Change password mutation
  const changePasswordMutation = useMutation(
    (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data.currentPassword, data.newPassword),
    {
      onSuccess: () => {
        addNotification({ type: 'success', message: 'Contraseña cambiada correctamente' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al cambiar la contraseña' });
      },
    }
  );

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      addNotification({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ] as const;

  const cardClass = 'bg-[#FDFCFA] rounded-2xl border border-apple-gray-300/50 shadow-[0_8px_40px_rgba(44,42,38,0.08)]';
  const inputClass = 'w-full px-4 py-3 bg-apple-gray/40 border border-apple-gray-300 rounded-xl text-sm text-apple-black placeholder:text-apple-gray-100 focus:outline-none focus:border-[#4A5D52] focus:ring-4 focus:ring-[#4A5D52]/10 transition-all';
  const btnPrimaryClass = 'inline-flex items-center justify-center gap-2 bg-[#4A5D52] hover:bg-[#3D4D44] text-[#FDFCFA] rounded-xl font-medium shadow-md shadow-[#4A5D52]/20 hover:shadow-lg hover:shadow-[#4A5D52]/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2.5 text-sm';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-section font-display font-semibold text-apple-black">
          Configuración
        </h1>
        <p className="text-apple-gray-100 mt-1">
          Gestiona tu perfil, preferencias y seguridad
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className={`${cardClass} p-2 space-y-1`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-[#4A5D52] text-[#FDFCFA] shadow-md shadow-[#4A5D52]/20'
                      : 'text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray'
                  )}
                >
                  <Icon size={18} />
                  {tab.label}
                  <ChevronRight
                    size={16}
                    className={cn(
                      'ml-auto transition-transform',
                      activeTab === tab.id ? 'rotate-90' : ''
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`${cardClass} p-6`}>
              <h2 className="text-xl font-semibold text-apple-black mb-6">
                Información del perfil
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-black mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, firstName: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-black mb-2">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, lastName: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-black mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className={`${inputClass} opacity-70`}
                    disabled
                  />
                  <p className="text-xs text-apple-gray-100 mt-1.5">
                    El correo electrónico no se puede cambiar
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-black mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className={inputClass}
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-apple-gray-300">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className={btnPrimaryClass}
                  >
                    {updateProfileMutation.isLoading && (
                      <Loader2 className="animate-spin" size={18} />
                    )}
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className={`${cardClass} p-6`}>
              <h2 className="text-xl font-semibold text-apple-black mb-6">
                Preferencias de notificaciones
              </h2>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-sm font-semibold text-apple-black mb-4 flex items-center gap-2">
                    <Mail size={18} className="text-apple-gray-200" />
                    Notificaciones por email
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'emailReservations',
                        label: 'Nuevas reservas',
                        description: 'Recibe un email cuando un cliente hace una reserva',
                      },
                      {
                        key: 'emailPayments',
                        label: 'Pagos y facturas',
                        description: 'Recibe notificaciones sobre pagos recibidos',
                      },
                      {
                        key: 'emailUpdates',
                        label: 'Actualizaciones del sistema',
                        description: 'Novedades y mejoras de la plataforma',
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-apple-gray cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof NotificationSettings]}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="mt-1 w-4 h-4 rounded border-apple-gray-300 text-[#4A5D52] focus:ring-[#4A5D52]/20 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-apple-black">
                            {item.label}
                          </p>
                          <p className="text-xs text-apple-gray-100">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="pt-6 border-t border-apple-gray-300">
                  <h3 className="text-sm font-semibold text-apple-black mb-4 flex items-center gap-2">
                    <Smartphone size={18} className="text-apple-gray-200" />
                    Notificaciones push
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'pushMessages',
                        label: 'Mensajes nuevos',
                        description: 'Notificaciones cuando recibes un mensaje',
                      },
                      {
                        key: 'pushReminders',
                        label: 'Recordatorios',
                        description: 'Alertas de eventos y tareas pendientes',
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-apple-gray cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof NotificationSettings]}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="mt-1 w-4 h-4 rounded border-apple-gray-300 text-[#4A5D52] focus:ring-[#4A5D52]/20 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-apple-black">
                            {item.label}
                          </p>
                          <p className="text-xs text-apple-gray-100">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-apple-gray-300">
                  <button
                    onClick={() =>
                      addNotification({
                        type: 'success',
                        message: 'Preferencias guardadas',
                      })
                    }
                    className={btnPrimaryClass}
                  >
                    Guardar preferencias
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className={`${cardClass} p-6`}>
              <h2 className="text-xl font-semibold text-apple-black mb-6">
                Seguridad de la cuenta
              </h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-2">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className={`${inputClass} pr-11`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-apple-gray-100 hover:text-apple-black rounded-lg hover:bg-apple-gray transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-apple-gray-300">
                  <label className="block text-sm font-medium text-apple-black mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className={`${inputClass} pr-11`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-apple-gray-100 hover:text-apple-black rounded-lg hover:bg-apple-gray transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-black mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Repite la nueva contraseña"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-apple-gray-300">
                  <button
                    type="submit"
                    disabled={
                      changePasswordMutation.isLoading ||
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      !passwordForm.confirmPassword
                    }
                    className={btnPrimaryClass}
                  >
                    {changePasswordMutation.isLoading && (
                      <Loader2 className="animate-spin" size={18} />
                    )}
                    <Lock size={18} />
                    Cambiar contraseña
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
