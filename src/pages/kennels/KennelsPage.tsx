import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  Building2,
  Plus,
  MapPin,
  Dog,
  Users,
  Globe,
  Phone,
  Mail,
  Search,
  Filter,
  Star,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Baby,
  CalendarDays,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';

export function KennelsPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: myKennels, isLoading } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels)
  );

  const singleKennel = myKennels?.length === 1 ? myKennels[0] : null;

  const filteredKennels = myKennels?.filter((kennel: any) => {
    const matchesSearch =
      !search ||
      kennel.name.toLowerCase().includes(search.toLowerCase()) ||
      kennel.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || kennel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for list view
  const stats = {
    total: myKennels?.length || 0,
    active: myKennels?.filter((k: any) => k.status === 'ACTIVE').length || 0,
    inactive: myKennels?.filter((k: any) => k.status === 'INACTIVE').length || 0,
    totalDogs: myKennels?.reduce((acc: number, k: any) => acc + (k._count?.dogs || 0), 0) || 0,
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Criaderos" subtitle="Cargando..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="skeleton w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-32" />
                  <div className="skeleton h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single kennel view (My Kennel)
  if (singleKennel) {
    const kennel = singleKennel;
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
            isManager && (
              <Link to="/kennels/create" className="btn-primary">
                <Plus size={18} />
                Nuevo criadero
              </Link>
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
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-semibold border shadow-sm',
                  kennel.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                )}
              >
                {kennel.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
          <div className="pt-14 px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-apple-black">{kennel.name}</h2>
                {kennel.city && (
                  <p className="text-apple-gray-100 flex items-center gap-1.5 mt-1">
                    <MapPin size={16} />
                    {kennel.city}, {kennel.country}
                  </p>
                )}
                {kennel.description && (
                  <p className="text-apple-gray-200 mt-4 max-w-2xl">{kennel.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/kennels/${kennel.id}`} className="btn-secondary">
                  Ver detalles completos
                </Link>
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
          <Link to={`/dogs?kennelId=${kennel.id}`} className="group">
            <StatCard
              title="Perros"
              value={dogCount}
              icon={Dog}
              color="purple"
            />
          </Link>
          <Link to={`/customers?kennelId=${kennel.id}`} className="group">
            <StatCard
              title="Clientes"
              value={customerCount}
              icon={Users}
              color="green"
            />
          </Link>
          <Link to={`/litters`} className="group">
            <StatCard
              title="Camadas"
              value={litterCount}
              icon={Baby}
              color="red"
            />
          </Link>
          <Link to={`/reservations`} className="group">
            <StatCard
              title="Reservas"
              value={reservationCount}
              icon={CalendarDays}
              color="blue"
            />
          </Link>
        </div>

        {/* Contact + Public */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6">
            <h3 className="text-lg font-medium text-apple-black mb-4">Información de contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kennel.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Dirección</p>
                    <p className="text-apple-black">
                      {kennel.address}
                      {kennel.city && `, ${kennel.city}`}
                      {kennel.country && `, ${kennel.country}`}
                    </p>
                  </div>
                </div>
              )}
              {kennel.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Teléfono</p>
                    <p className="text-apple-black">{kennel.phone}</p>
                  </div>
                </div>
              )}
              {kennel.email && (
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Email</p>
                    <p className="text-apple-black">{kennel.email}</p>
                  </div>
                </div>
              )}
              {kennel.website && (
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-apple-blue mt-0.5" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Sitio web</p>
                    <a
                      href={kennel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-apple-link hover:underline"
                    >
                      {kennel.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
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

  // Multiple kennels list view
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Criaderos"
        subtitle={`${stats.total} criaderos registrados`}
        action={
          isManager && (
            <Link to="/kennels/create" className="btn-primary">
              <Plus size={18} />
              Nuevo criadero
            </Link>
          )
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Criaderos"
          value={stats.total}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Activos"
          value={stats.active}
          icon={CheckCircle2}
          color="green"
          trend={{ value: Math.round((stats.active / Math.max(stats.total, 1)) * 100), label: 'del total', positive: true }}
        />
        <StatCard
          title="Inactivos"
          value={stats.inactive}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Total Perros"
          value={stats.totalDogs}
          icon={Dog}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar criaderos..."
              className="input-apple pl-11 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-outline',
                showFilters && 'bg-apple-gray',
                (statusFilter) && 'border-apple-blue text-apple-blue'
              )}
            >
              <Filter size={16} />
              Filtros
              {statusFilter && (
                <span className="ml-1.5 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-apple select-apple"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kennels Grid */}
      {filteredKennels?.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay criaderos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || statusFilter
              ? 'No se encontraron criaderos con los filtros seleccionados'
              : isManager
              ? 'Crea tu primer criadero para comenzar'
              : 'No tienes criaderos asignados'}
          </p>
          {isManager && !search && !statusFilter && (
            <Link to="/kennels/create" className="btn-primary">
              <Plus size={18} />
              Crear Criadero
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {filteredKennels?.map((kennel: any) => (
            <div
              key={kennel.id}
              className="group card overflow-hidden card-interactive flex flex-col"
            >
              {/* Header with gradient */}
              <div className="h-24 bg-gradient-to-r from-apple-blue to-blue-400 relative">
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 rounded-xl bg-white shadow-lg p-1">
                    {kennel.logoUrl ? (
                      <img
                        src={kennel.logoUrl}
                        alt={kennel.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-apple-blue/10 rounded-lg flex items-center justify-center">
                        <Building2 className="text-apple-blue" size={28} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm',
                      kennel.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    )}
                  >
                    {kennel.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-apple-black text-lg truncate group-hover:text-apple-blue transition-colors">
                      {kennel.name}
                    </h3>
                    {kennel.city && (
                      <p className="text-sm text-apple-gray-100 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {kennel.city}, {kennel.country}
                      </p>
                    )}
                  </div>
                  {kennel.isPublic && (
                    <span className="text-amber-500" title="Criadero público">
                      <Star size={16} fill="currentColor" />
                    </span>
                  )}
                </div>

                {kennel.description && (
                  <p className="text-sm text-apple-gray-200 mt-3 line-clamp-2">
                    {kennel.description}
                  </p>
                )}

                {/* Contact info */}
                <div className="mt-4 space-y-2">
                  {kennel.email && (
                    <a
                      href={`mailto:${kennel.email}`}
                      className="flex items-center gap-2 text-sm text-apple-gray-200 hover:text-apple-blue transition-colors"
                    >
                      <Mail size={14} />
                      <span className="truncate">{kennel.email}</span>
                    </a>
                  )}
                  {kennel.phone && (
                    <a
                      href={`tel:${kennel.phone}`}
                      className="flex items-center gap-2 text-sm text-apple-gray-200 hover:text-apple-blue transition-colors"
                    >
                      <Phone size={14} />
                      {kennel.phone}
                    </a>
                  )}
                  {kennel.website && (
                    <a
                      href={kennel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-apple-link hover:text-apple-blue transition-colors"
                    >
                      <Globe size={14} />
                      <span className="truncate">{kennel.website}</span>
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-apple-gray-300/50">
                  <div className="flex items-center gap-3 p-3 bg-apple-gray rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Dog className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-apple-black">
                        {kennel._count?.dogs || 0}
                      </p>
                      <p className="text-xs text-apple-gray-100">Perros</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-apple-gray rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Users className="text-green-600" size={18} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-apple-black">
                        {kennel._count?.customers || 0}
                      </p>
                      <p className="text-xs text-apple-gray-100">Clientes</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-apple-gray-300/50">
                  <Link
                    to={`/kennels/${kennel.id}`}
                    className="flex-1 btn-secondary text-center text-sm"
                  >
                    Ver detalles
                  </Link>
                  {kennel.website && (
                    <a
                      href={kennel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border border-apple-gray-300 hover:bg-apple-gray transition-colors text-apple-gray-200"
                      title="Visitar sitio web"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
