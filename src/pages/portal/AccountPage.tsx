import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { authApi } from '@/services/api';
import { useMutation } from 'react-query';
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  Save,
  MapPin,
  Home,
} from 'lucide-react';

export function AccountPage() {
  const { user, updateUser } = useAuthStore();
  const { addNotification } = useUIStore();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
  });

  const updateProfileMutation = useMutation(
    (data: Partial<typeof formData>) => authApi.updateProfile(data),
    {
      onSuccess: (response) => {
        updateUser(response.data.user);
        addNotification({ type: 'success', message: 'Perfil actualizado correctamente' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al actualizar el perfil' });
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-section font-display font-semibold text-apple-black">
          Mi Cuenta
        </h1>
        <p className="text-apple-gray-100 mt-1">
          Gestiona tu información personal
        </p>
      </div>

      <div className="card p-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-apple-gray-300">
          <div className="relative">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-apple-gray"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-apple-blue to-blue-400 flex items-center justify-center text-white text-2xl font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
            <button
              className="absolute bottom-0 right-0 w-8 h-8 bg-apple-blue text-white rounded-full flex items-center justify-center shadow-lg hover:bg-apple-blue-hover transition-colors"
              onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Cambio de foto disponible próximamente' })}
            >
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-apple-black">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-apple-gray-100">{user?.email}</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 mt-2 text-xs font-medium bg-apple-blue/10 text-apple-blue rounded-full">
              Cliente
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-apple pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Apellidos
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-apple pl-11"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type="email"
                value={formData.email}
                disabled
                className="input-apple pl-11 bg-apple-gray/50"
              />
            </div>
            <p className="text-xs text-apple-gray-100 mt-1">El correo no se puede cambiar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-apple pl-11"
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Dirección
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-apple pl-11"
                  placeholder="Calle Mayor 123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Ciudad
              </label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-apple pl-11"
                  placeholder="Madrid"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-apple-gray-300">
            <button
              type="submit"
              disabled={updateProfileMutation.isLoading}
              className="btn-primary"
            >
              {updateProfileMutation.isLoading && (
                <Loader2 className="animate-spin" size={18} />
              )}
              <Save size={18} />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
