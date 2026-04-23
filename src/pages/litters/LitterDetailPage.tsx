import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { littersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Baby, PawPrint, Loader2, Dog } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
};

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  SOLD: 'bg-blue-100 text-blue-800',
};

export function LitterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: litter, isLoading } = useQuery(
    ['litter', id],
    () => littersApi.getById(id!).then((r) => r.data.litter)
  );

  const promoteMutation = useMutation(
    ({ puppyId, name }: { puppyId: string; name?: string }) =>
      littersApi.promotePuppy(id!, puppyId, { name }).then((r) => r.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['litter', id]);
        addNotification({
          type: 'success',
          message: 'Cachorro convertido en perro exitosamente',
        });
        if (data?.dog?.id) {
          navigate(`/dogs/${data.dog.id}`);
        }
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al convertir cachorro',
        });
      },
    }
  );

  const handlePromote = (puppy: any) => {
    const name = window.prompt('Nombre para el perro:', puppy.name || `Cachorro ${puppy.id.slice(-4)}`);
    if (name === null) return; // cancelled
    promoteMutation.mutate({ puppyId: puppy.id, name: name || undefined });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
      </div>
    );
  }

  if (!litter) {
    return <div className="text-center py-12">Camada no encontrada</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/litters" className="p-2 hover:bg-apple-gray rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Camada
          </h1>
          <p className="text-apple-gray-100">
            {format(new Date(litter.birthDate), 'dd MMMM yyyy', { locale: es })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parents info */}
        <div className="bg-white rounded-apple p-6">
          <h2 className="text-lg font-medium text-apple-black mb-4">Progenitores</h2>
          <div className="space-y-4">
            <div className="p-4 bg-apple-gray rounded-lg">
              <p className="text-sm text-apple-gray-100 mb-1">Padre</p>
              {litter.father ? (
                <Link
                  to={`/dogs/${litter.father.id}`}
                  className="font-medium text-apple-blue hover:underline"
                >
                  {litter.father.name}
                </Link>
              ) : (
                <p className="text-apple-gray-200">No registrado</p>
              )}
            </div>
            <div className="p-4 bg-apple-gray rounded-lg">
              <p className="text-sm text-apple-gray-100 mb-1">Madre</p>
              {litter.mother ? (
                <Link
                  to={`/dogs/${litter.mother.id}`}
                  className="font-medium text-apple-blue hover:underline"
                >
                  {litter.mother.name}
                </Link>
              ) : (
                <p className="text-apple-gray-200">No registrada</p>
              )}
            </div>
          </div>

          {litter.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-apple-black mb-2">Notas</h3>
              <p className="text-apple-gray-200">{litter.notes}</p>
            </div>
          )}
        </div>

        {/* Puppies */}
        <div className="lg:col-span-2 bg-white rounded-apple p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-apple-black">Cachorros</h2>
            <span className="text-apple-gray-100">
              {litter.puppies?.length || 0} cachorros
            </span>
          </div>

          {litter.puppies?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {litter.puppies.map((puppy: any) => (
                <div
                  key={puppy.id}
                  className="p-4 bg-apple-gray rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center">
                      {puppy.dogId ? (
                        <Dog size={18} className="text-apple-blue" />
                      ) : (
                        <PawPrint size={18} className="text-apple-blue" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-apple-black">
                        {puppy.name || `Cachorro ${puppy.id.slice(-4)}`}
                      </p>
                      <p className="text-sm text-apple-gray-100">
                        {puppy.gender === 'MALE' ? 'Macho' : 'Hembra'}
                        {puppy.color && ` • ${puppy.color}`}
                      </p>
                      {puppy.dogId && (
                        <Link
                          to={`/dogs/${puppy.dogId}`}
                          className="text-xs text-apple-blue hover:underline"
                        >
                          Ver perro →
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[puppy.status]
                      }`}
                    >
                      {statusLabels[puppy.status]}
                    </span>
                    {isBreeder && !puppy.dogId && (
                      <button
                        onClick={() => handlePromote(puppy)}
                        disabled={promoteMutation.isLoading}
                        className="ml-2 p-1.5 rounded-lg bg-apple-blue text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                        title="Convertir en perro"
                      >
                        {promoteMutation.isLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Dog size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Baby className="mx-auto text-apple-gray-300 mb-4" size={48} />
              <p className="text-apple-gray-100">No hay cachorros registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
