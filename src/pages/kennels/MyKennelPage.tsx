import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { kennelsApi } from '@/services/api';
import { useKennel } from '@/hooks/useKennel';
import { useUIStore } from '@/store/uiStore';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit,
  ExternalLink,
  Save,
  X,
  Dog,
  Users,
  Baby,
  CalendarDays,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Link } from 'react-router-dom';

export function MyKennelPage() {
  const { kennel, kennelId, isLoading } = useKennel();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, any>>({});

  const updateMutation = useMutation(
    (data: any) => kennelsApi.update(kennelId!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kennel', kennelId]);
        setIsEditing(false);
        addNotification({
          type: 'success',
          message: 'Criadero actualizado correctamente',
        });
      },
      onError: () => {
        addNotification({
          type: 'error',
          message: 'Error al actualizar el criadero',
        });
      },
    }
  );

  const handleEdit = () => {
    setEditData({
      name: kennel?.name || '',
      description: kennel?.description || '',
      address: kennel?.address || '',
      city: kennel?.city || '',
      country: kennel?.country || '',
      phone: kennel?.phone || '',
      email: kennel?.email || '',
      website: kennel?.website || '',
      logoUrl: kennel?.logoUrl || '',
      isPublic: kennel?.isPublic ?? true,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A5D52]"></div>
      </div>
    );
  }

  if (!kennel) {
    return (
      <div className="text-center py-12">
        <p className="text-apple-gray-100">No se encontró información del criadero.</p>
      </div>
    );
  }

  const dogCount = kennel._count?.dogs || 0;
  const customerCount = kennel._count?.customers || 0;
  const litterCount = kennel._count?.litters || 0;
  const reservationCount = kennel._count?.reservations || 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Mi Criadero"
        subtitle={kennel.name}
        action={
          isEditing ? (
            <div className="flex items-center gap-2">
              <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
                <Save size={18} />
                Guardar
              </button>
              <button onClick={handleCancel} className="btn-outline inline-flex items-center gap-2">
                <X size={18} />
                Cancelar
              </button>
            </div>
          ) : (
            <button onClick={handleEdit} className="btn-secondary inline-flex items-center gap-2">
              <Edit size={18} />
              Editar
            </button>
          )
        }
      />

      {/* Header card */}
      <div className="card overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-apple-blue to-blue-400 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-xl p-1.5">
              {kennel.logoUrl ? (
                <img
                  src={kennel.logoUrl}
                  alt={kennel.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <div className="w-full h-full bg-apple-blue/10 rounded-xl flex items-center justify-center">
                  <Building2 className="text-apple-blue" size={40} />
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border shadow-sm ${
                kennel.status === 'ACTIVE'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              {kennel.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        <div className="pt-14 px-8 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="input-apple text-xl font-semibold w-full max-w-md"
                  placeholder="Nombre del criadero"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-apple-black">{kennel.name}</h2>
              )}
              {kennel.city && !isEditing && (
                <p className="text-apple-gray-100 flex items-center gap-1.5 mt-1">
                  <MapPin size={16} />
                  {kennel.city}, {kennel.country}
                </p>
              )}
              {isEditing ? (
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="input-apple mt-4 w-full max-w-2xl"
                  rows={3}
                  placeholder="Descripción del criadero"
                />
              ) : (
                kennel.description && (
                  <p className="text-apple-gray-200 mt-4 max-w-2xl">{kennel.description}</p>
                )
              )}
            </div>
            <div className="flex items-center gap-3">
              {kennel.isPublic && (
                <a
                  href={`/k/${kennel.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-apple-gray-300 hover:bg-apple-gray transition-colors text-apple-gray-200"
                  title="Ver página pública"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Link to="/dogs" className="group">
          <StatCard title="Perros" value={dogCount} icon={Dog} color="purple" />
        </Link>
        <Link to="/customers" className="group">
          <StatCard title="Clientes" value={customerCount} icon={Users} color="green" />
        </Link>
        <Link to="/litters" className="group">
          <StatCard title="Camadas" value={litterCount} icon={Baby} color="red" />
        </Link>
        <Link to="/reservations" className="group">
          <StatCard title="Reservas" value={reservationCount} icon={CalendarDays} color="blue" />
        </Link>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-medium text-apple-black mb-4">Información de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-apple-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-apple-gray-100">Dirección</p>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <input
                      type="text"
                      value={editData.address || ''}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="input-apple w-full"
                      placeholder="Dirección"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editData.city || ''}
                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                        className="input-apple flex-1"
                        placeholder="Ciudad"
                      />
                      <input
                        type="text"
                        value={editData.country || ''}
                        onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                        className="input-apple flex-1"
                        placeholder="País"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-apple-black">
                    {kennel.address || 'No especificada'}
                    {kennel.city && `, ${kennel.city}`}
                    {kennel.country && `, ${kennel.country}`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-apple-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-apple-gray-100">Teléfono</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="input-apple w-full mt-1"
                    placeholder="Teléfono"
                  />
                ) : (
                  <p className="text-apple-black">{kennel.phone || 'No especificado'}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-apple-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-apple-gray-100">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="input-apple w-full mt-1"
                    placeholder="Email del criadero"
                  />
                ) : (
                  <p className="text-apple-black">{kennel.email || 'No especificado'}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe size={18} className="text-apple-blue mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-apple-gray-100">Sitio web</p>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    className="input-apple w-full mt-1"
                    placeholder="https://..."
                  />
                ) : kennel.website ? (
                  <a
                    href={kennel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-apple-link hover:underline"
                  >
                    {kennel.website}
                  </a>
                ) : (
                  <p className="text-apple-black">No especificado</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.isPublic}
                  onChange={(e) => setEditData({ ...editData, isPublic: e.target.checked })}
                  className="w-4 h-4 rounded border-apple-gray-300 text-[#4A5D52] focus:ring-[#4A5D52]"
                />
                <span className="text-sm text-apple-gray-200">Página pública visible</span>
              </label>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-apple-black mb-4">Página pública</h3>
          <p className="text-sm text-apple-gray-100 mb-4">
            {kennel.isPublic
              ? 'Tu criadero está visible para el público'
              : 'Tu criadero está oculto'}
          </p>
          {kennel.isPublic && (
            <a
              href={`/k/${kennel.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill text-sm inline-flex items-center"
            >
              Ver página pública →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
