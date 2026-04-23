import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { usersApi } from '@/services/api';
import { UserCog, Plus, Search } from 'lucide-react';

const roleLabels: Record<string, string> = {
  MANAGER: 'Administrador',
  BREEDER: 'Criador',
  VETERINARIAN: 'Veterinario',
  CUSTOMER: 'Cliente',
};

const roleColors: Record<string, string> = {
  MANAGER: 'bg-purple-100 text-purple-800',
  BREEDER: 'bg-green-100 text-green-800',
  VETERINARIAN: 'bg-blue-100 text-blue-800',
  CUSTOMER: 'bg-gray-100 text-gray-800',
};

export function UsersPage() {
  const [search, setSearch] = useState('');
  const { data: users, isLoading } = useQuery(['users', search], () =>
    usersApi.getAll({ search }).then((r) => r.data.users)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Usuarios
          </h1>
          <p className="text-apple-gray-100 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        {/* NOTE: /users/create page does not exist yet */}
        {/* <Link to="/users/create" className="btn-primary inline-flex items-center justify-center gap-2">
          <Plus size={18} />
          Nuevo usuario
        </Link> */}
      </div>

      {/* Search */}
      <div className="bg-white rounded-apple p-4 mb-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuarios..."
            className="input-apple pl-11 w-full"
          />
        </div>
      </div>

      {/* Users list */}
      {users?.length === 0 ? (
        <div className="bg-white rounded-apple p-12 text-center">
          <UserCog className="mx-auto text-apple-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-apple-black mb-2">
            No hay usuarios
          </h3>
          <p className="text-apple-gray-100">
            {search ? 'No se encontraron usuarios' : 'Comienza creando un usuario'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-apple overflow-hidden">
          <div className="divide-y divide-apple-gray-300/50">
            {users?.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-6 hover:bg-apple-gray/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue font-medium">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-apple-black">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-apple-gray-100">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      roleColors[user.role]
                    }`}
                  >
                    {roleLabels[user.role]}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
