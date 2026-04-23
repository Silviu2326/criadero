import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { customersApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Building2,
  Calendar,
  ArrowUpDown,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  kennelId: string;
  isArchived: boolean;
  createdAt: string;
  _count?: {
    reservations: number;
  };
  user?: {
    avatarUrl?: string;
  };
}

type SortField = 'name' | 'email' | 'city' | 'reservations' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export function CustomersPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: customers, isLoading } = useQuery(
    ['customers', kennelId, search],
    () =>
      customersApi.getAll({ kennelId, search }).then((r) => r.data.customers),
    { enabled: !!kennelId }
  );

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    let result = [...customers];

    // Filter by status
    if (filterStatus === 'active') {
      result = result.filter((c: Customer) => !c.isArchived);
    } else if (filterStatus === 'archived') {
      result = result.filter((c: Customer) => c.isArchived);
    }

    // Sort
    result.sort((a: Customer, b: Customer) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'city':
          comparison = (a.city || '').localeCompare(b.city || '');
          break;
        case 'reservations':
          comparison = (a._count?.reservations || 0) - (b._count?.reservations || 0);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [customers, filterStatus, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-apple-gray-300" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp size={14} className="text-apple-blue" />
    ) : (
      <ChevronDown size={14} className="text-apple-blue" />
    );
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="Clientes"
          subtitle="Gestiona tus clientes y sus reservas"
          action={
            isBreeder && (
              <Link to="/customers/create" className="btn-primary">
                <Plus size={18} />
                Nuevo Cliente
              </Link>
            )
          }
        />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Clientes"
        subtitle={`${filteredCustomers.length} clientes registrados`}
        action={
          isBreeder && (
            <Link to="/customers/create" className="btn-primary">
              <Plus size={18} />
              Nuevo Cliente
            </Link>
          )
        }
      />

      {/* Filters Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o teléfono..."
              className="input-apple pl-11 w-full"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline ${showFilters ? 'bg-apple-gray' : ''}`}
          >
            <Filter size={16} />
            Filtros
          </button>

          {/* Export */}
          <button
            className="btn-ghost ml-auto"
            onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Exportación disponible próximamente' })}
          >
            <Download size={16} />
            Exportar
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-apple-gray-100">Estado:</span>
              {(['all', 'active', 'archived'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-apple-blue text-white'
                      : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300'
                  }`}
                >
                  {status === 'all' ? 'Todos' : status === 'active' ? 'Activos' : 'Archivados'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay clientes</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search
              ? 'No se encontraron clientes que coincidan con tu búsqueda'
              : 'Comienza agregando tu primer cliente para gestionar tus reservas'}
          </p>
          {isBreeder && !search && (
            <Link to="/customers/create" className="btn-primary">
              <Plus size={18} />
              Agregar Cliente
            </Link>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>
                <th className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    Cliente
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-2">
                    Contacto
                    <SortIcon field="email" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('city')}>
                  <div className="flex items-center gap-2">
                    Ubicación
                    <SortIcon field="city" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('reservations')}>
                  <div className="flex items-center gap-2">
                    Reservas
                    <SortIcon field="reservations" />
                  </div>
                </th>
                <th className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">
                    Registro
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer: Customer) => (
                <tr key={customer.id}>
                  <td>
                    <Link
                      to={`/customers/${customer.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="relative">
                        {customer.user?.avatarUrl ? (
                          <img
                            src={customer.user.avatarUrl}
                            alt={`${customer.firstName} ${customer.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue to-blue-400 flex items-center justify-center text-white font-medium">
                            {customer.firstName[0]}
                            {customer.lastName[0]}
                          </div>
                        )}
                        {!customer.isArchived && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-apple-black group-hover:text-apple-blue transition-colors">
                          {customer.firstName} {customer.lastName}
                        </p>
                        {customer.isArchived && (
                          <span className="badge badge-neutral text-xs">Archivado</span>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <a
                        href={`mailto:${customer.email}`}
                        className="flex items-center gap-2 text-sm text-apple-gray-200 hover:text-apple-blue transition-colors"
                      >
                        <Mail size={14} />
                        {customer.email}
                      </a>
                      {customer.phone && (
                        <a
                          href={`tel:${customer.phone}`}
                          className="flex items-center gap-2 text-sm text-apple-gray-200 hover:text-apple-blue transition-colors"
                        >
                          <Phone size={14} />
                          {customer.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    {customer.city ? (
                      <div className="flex items-center gap-2 text-sm text-apple-gray-200">
                        <MapPin size={14} />
                        <span>{customer.city}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-apple-gray-300">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      (customer._count?.reservations || 0) > 0
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Building2 size={12} />
                      {customer._count?.reservations || 0}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm text-apple-gray-200">
                      <Calendar size={14} />
                      {format(new Date(customer.createdAt), 'dd MMM yyyy', { locale: es })}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="p-2 text-apple-gray-100 hover:text-apple-blue hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <MoreHorizontal size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
