import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { dogsApi, kennelsApi, breedsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ActionDropdown } from '@/components/ui/ActionDropdown';
import {
  Dog,
  Plus,
  Search,
  Eye,
  EyeOff,
  PawPrint,
  Grid3X3,
  List,
  Calendar,
  Dna,
  SlidersHorizontal,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
  REPRODUCTIVE: 'Reproductivo',
  RETIRED: 'Retirado',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  AVAILABLE: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  RESERVED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  SOLD: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  REPRODUCTIVE: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  RETIRED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

const genderLabels: Record<string, string> = {
  MALE: 'Macho',
  FEMALE: 'Hembra',
};

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'birthDate' | 'status' | 'breed' | 'gender';
type SortOrder = 'asc' | 'desc';

function exportToCSV(dogs: any[]) {
  const headers = ['Nombre', 'Raza', 'Sexo', 'Nacimiento', 'Estado', 'Visibilidad', 'Microchip', 'Pedigree'];
  const rows = dogs.map((d) => [
    d.name,
    d.breed?.name || '',
    genderLabels[d.gender] || d.gender,
    d.birthDate ? format(new Date(d.birthDate), 'dd/MM/yyyy') : '',
    statusLabels[d.status] || d.status,
    d.visibility === 'PUBLIC' ? 'Pública' : 'Privada',
    d.microchip || '',
    d.pedigree || '',
  ]);
  const csv = [headers, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `perros_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function DogsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    gender: '',
    visibility: '',
    breedId: '',
    fatherId: '',
    motherId: '',
    birthDateFrom: '',
    birthDateTo: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder || user?.role === 'VETERINARIAN' }
  );

  const kennelId = searchParams.get('kennelId') || myKennels?.[0]?.id;

  const { data: dogs, isLoading } = useQuery(
    ['dogs', kennelId, filters.status, filters.gender, filters.visibility, filters.breedId, filters.fatherId, filters.motherId, filters.birthDateFrom, filters.birthDateTo, search],
    () => dogsApi.getAll({
      kennelId,
      status: filters.status,
      gender: filters.gender,
      visibility: filters.visibility,
      breedId: filters.breedId,
      fatherId: filters.fatherId,
      motherId: filters.motherId,
      birthDateFrom: filters.birthDateFrom,
      birthDateTo: filters.birthDateTo,
      search,
    }).then((r) => r.data.dogs),
    { enabled: !!kennelId || !isBreeder }
  );

  const { data: breeds } = useQuery(
    'breeds',
    () => breedsApi.getAll().then((r) => r.data.breeds)
  );

  const { data: allDogs } = useQuery(
    ['allDogsForFilter', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  // Sorting client-side for fields not sorted by backend
  const filteredDogs = useMemo(() => {
    if (!dogs) return [];
    const result = [...dogs];
    result.sort((a: any, b: any) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'birthDate':
          comparison = new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'breed':
          comparison = (a.breed?.name || '').localeCompare(b.breed?.name || '');
          break;
        case 'gender':
          comparison = a.gender.localeCompare(b.gender);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [dogs, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredDogs.length / itemsPerPage);
  const paginatedDogs = filteredDogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      status: '', gender: '', visibility: '', breedId: '', fatherId: '', motherId: '', birthDateFrom: '', birthDateTo: ''
    });
    setSearch('');
    setCurrentPage(1);
  };

  const toggleVisibilityMutation = useMutation(
    (id: string) => dogsApi.toggleVisibility(id).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['dogs']);
        addNotification({ type: 'success', message: 'Visibilidad actualizada' });
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => dogsApi.delete(id).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['dogs']);
        addNotification({ type: 'success', message: 'Perro eliminado' });
      },
    }
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleVisibility = (id: string) => {
    toggleVisibilityMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Perros" subtitle="Gestiona tu catálogo de perros" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-square" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-24" />
                <div className="skeleton h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Perros"
        subtitle={`${filteredDogs.length} perros registrados`}
        action={
          isBreeder && (
            <Link to="/dogs/create" className="btn-primary">
              <Plus size={18} />
              Nuevo perro
            </Link>
          )
        }
      />

      {/* Filters Bar */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre, raza, microchip o pedigree..."
              className="input-apple pl-11 w-full"
            />
          </div>

          <div className="flex items-center gap-2 bg-apple-gray rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-white shadow-sm text-apple-blue' : 'text-apple-gray-100'
              )}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-white shadow-sm text-apple-blue' : 'text-apple-gray-100'
              )}
            >
              <List size={18} />
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn-outline relative',
              showFilters && 'bg-apple-gray',
              activeFiltersCount > 0 && 'border-apple-blue text-apple-blue'
            )}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => exportToCSV(filteredDogs)}
            className="btn-ghost flex items-center gap-2"
            disabled={!filteredDogs.length}
          >
            <Download size={16} />
            Exportar
          </button>

          <div className="relative">
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortField(field as SortField);
                setSortOrder(order as SortOrder);
              }}
              className="input-apple select-apple pr-10"
            >
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="birthDate-desc">Más recientes</option>
              <option value="birthDate-asc">Más antiguos</option>
              <option value="status-asc">Estado</option>
              <option value="breed-asc">Raza</option>
              <option value="gender-asc">Sexo</option>
            </select>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todos</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Género</label>
                <select
                  value={filters.gender}
                  onChange={(e) => { setFilters({ ...filters, gender: e.target.value }); setCurrentPage(1); }}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todos</option>
                  <option value="MALE">Macho</option>
                  <option value="FEMALE">Hembra</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Visibilidad</label>
                <select
                  value={filters.visibility}
                  onChange={(e) => { setFilters({ ...filters, visibility: e.target.value }); setCurrentPage(1); }}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todas</option>
                  <option value="PUBLIC">Pública</option>
                  <option value="PRIVATE">Privada</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Raza</label>
                <select
                  value={filters.breedId}
                  onChange={(e) => { setFilters({ ...filters, breedId: e.target.value }); setCurrentPage(1); }}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Todas</option>
                  {breeds?.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Padre</label>
                <select
                  value={filters.fatherId}
                  onChange={(e) => { setFilters({ ...filters, fatherId: e.target.value }); setCurrentPage(1); }}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Cualquiera</option>
                  {allDogs?.filter((d: any) => d.gender === 'MALE').map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Madre</label>
                <select
                  value={filters.motherId}
                  onChange={(e) => { setFilters({ ...filters, motherId: e.target.value }); setCurrentPage(1); }}
                  className="input-apple select-apple w-full"
                >
                  <option value="">Cualquiera</option>
                  {allDogs?.filter((d: any) => d.gender === 'FEMALE').map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Nac. desde</label>
                <input
                  type="date"
                  value={filters.birthDateFrom}
                  onChange={(e) => { setFilters({ ...filters, birthDateFrom: e.target.value }); setCurrentPage(1); }}
                  className="input-apple w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-apple-gray-200 mb-2 block">Nac. hasta</label>
                <input
                  type="date"
                  value={filters.birthDateTo}
                  onChange={(e) => { setFilters({ ...filters, birthDateTo: e.target.value }); setCurrentPage(1); }}
                  className="input-apple w-full"
                />
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-apple-link hover:text-apple-blue flex items-center gap-1"
              >
                <X size={14} />
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {filteredDogs.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {Object.entries(
            filteredDogs.reduce((acc: Record<string, number>, dog: any) => {
              acc[dog.status] = (acc[dog.status] || 0) + 1;
              return acc;
            }, {})
          ).map(([status, count]) => (
            <div
              key={status}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border',
                statusColors[status]?.bg,
                statusColors[status]?.text,
                statusColors[status]?.border
              )}
            >
              <span className="font-medium">{count}</span>
              <span>{statusLabels[status]}</span>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredDogs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay perros</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || activeFiltersCount > 0
              ? 'No se encontraron perros con los filtros seleccionados'
              : 'Comienza agregando tu primer perro al catálogo'}
          </p>
          {isBreeder && !search && activeFiltersCount === 0 && (
            <Link to="/dogs/create" className="btn-primary">
              <Plus size={18} />
              Agregar Perro
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {paginatedDogs.map((dog: any) => (
                <div key={dog.id} className="group card overflow-hidden card-interactive relative">
                  <Link to={`/dogs/${dog.id}`} className="block">
                    <div className="aspect-square relative overflow-hidden">
                      {dog.photos?.[0]?.url ? (
                        <img
                          src={dog.photos[0].url}
                          alt={dog.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-apple-gray to-apple-gray-300">
                          <Dog className="text-apple-gray-100" size={64} />
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm',
                          statusColors[dog.status]?.bg,
                          statusColors[dog.status]?.text,
                          statusColors[dog.status]?.border
                        )}>
                          {statusLabels[dog.status]}
                        </span>
                      </div>

                      {isBreeder && (
                        <div className={cn(
                          "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md",
                          dog.visibility === 'PUBLIC'
                            ? 'bg-green-500/90 text-white'
                            : 'bg-gray-500/90 text-white'
                        )}>
                          {dog.visibility === 'PUBLIC' ? <Eye size={14} /> : <EyeOff size={14} />}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-apple-black group-hover:text-apple-blue transition-colors text-lg">
                        {dog.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1 mb-3">
                        <Dna size={14} className="text-apple-gray-100" />
                        <p className="text-sm text-apple-gray-200">{dog.breed?.name}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-apple-gray-300/50">
                        <div className="flex items-center gap-1.5 text-sm text-apple-gray-200">
                          {dog.gender === 'MALE' ? (
                            <span className="text-blue-500">♂</span>
                          ) : (
                            <span className="text-pink-500">♀</span>
                          )}
                          <span>{genderLabels[dog.gender]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-apple-gray-200">
                          <Calendar size={14} />
                          <span>{format(new Date(dog.birthDate), 'MMM yyyy', { locale: es })}</span>
                        </div>
                      </div>

                      {dog.microchip && (
                        <div className="mt-3 text-xs text-apple-gray-300 font-mono bg-apple-gray rounded px-2 py-1">
                          #{dog.microchip}
                        </div>
                      )}
                    </div>
                  </Link>

                  {isBreeder && (
                    <div className="absolute top-12 right-3">
                      <ActionDropdown
                        actions={[
                          { label: 'Editar', onClick: () => navigate(`/dogs/${dog.id}/edit`) },
                          { label: dog.visibility === 'PUBLIC' ? 'Hacer privado' : 'Hacer público', onClick: () => handleToggleVisibility(dog.id) },
                          { label: 'Eliminar', onClick: () => handleDelete(dog.id, dog.name), destructive: true },
                        ]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="table-container animate-fade-in">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">
                        Perro
                        {sortField === 'name' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="cursor-pointer" onClick={() => handleSort('breed')}>
                      <div className="flex items-center gap-2">
                        Raza
                        {sortField === 'breed' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="cursor-pointer" onClick={() => handleSort('gender')}>
                      <div className="flex items-center gap-2">
                        Género
                        {sortField === 'gender' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="cursor-pointer" onClick={() => handleSort('birthDate')}>
                      <div className="flex items-center gap-2">
                        Nacimiento
                        {sortField === 'birthDate' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th>Estado</th>
                    <th>Visibilidad</th>
                    <th className="w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDogs.map((dog: any) => (
                    <tr key={dog.id}>
                      <td>
                        <Link to={`/dogs/${dog.id}`} className="flex items-center gap-3 group">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-apple-gray">
                            {dog.photos?.[0]?.url ? (
                              <img src={dog.photos[0].url} alt={dog.name} className="w-full h-full object-cover" />
                            ) : (
                              <Dog className="w-full h-full p-3 text-apple-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-apple-black group-hover:text-apple-blue transition-colors">
                              {dog.name}
                            </p>
                            {dog.microchip && (
                              <p className="text-xs text-apple-gray-300 font-mono">#{dog.microchip}</p>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td>
                        <span className="text-apple-gray-200">{dog.breed?.name}</span>
                      </td>
                      <td>
                        <span className={cn(
                          'inline-flex items-center gap-1',
                          dog.gender === 'MALE' ? 'text-blue-600' : 'text-pink-600'
                        )}>
                          {dog.gender === 'MALE' ? '♂' : '♀'}
                          {genderLabels[dog.gender]}
                        </span>
                      </td>
                      <td>
                        <span className="text-apple-gray-200">
                          {format(new Date(dog.birthDate), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </td>
                      <td>
                        <span className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium border',
                          statusColors[dog.status]?.bg,
                          statusColors[dog.status]?.text,
                          statusColors[dog.status]?.border
                        )}>
                          {statusLabels[dog.status]}
                        </span>
                      </td>
                      <td>
                        <span className={cn(
                          'inline-flex items-center gap-1.5 text-sm',
                          dog.visibility === 'PUBLIC' ? 'text-green-600' : 'text-gray-500'
                        )}>
                          {dog.visibility === 'PUBLIC' ? <Eye size={14} /> : <EyeOff size={14} />}
                          {dog.visibility === 'PUBLIC' ? 'Pública' : 'Privada'}
                        </span>
                      </td>
                      <td>
                        {isBreeder ? (
                          <ActionDropdown
                            actions={[
                              { label: 'Editar', onClick: () => navigate(`/dogs/${dog.id}/edit`) },
                              { label: dog.visibility === 'PUBLIC' ? 'Hacer privado' : 'Hacer público', onClick: () => handleToggleVisibility(dog.id) },
                              { label: 'Eliminar', onClick: () => handleDelete(dog.id, dog.name), destructive: true },
                            ]}
                          />
                        ) : (
                          <Link to={`/dogs/${dog.id}`} className="text-apple-link hover:text-apple-blue text-sm font-medium">
                            Ver →
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-apple-gray-100">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredDogs.length)} de {filteredDogs.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-apple-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-apple-gray transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-10 h-10 rounded-lg font-medium transition-colors',
                      currentPage === page
                        ? 'bg-apple-blue text-white'
                        : 'border border-apple-gray-300 hover:bg-apple-gray'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-apple-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-apple-gray transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {(toggleVisibilityMutation.isLoading || deleteMutation.isLoading) && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-100 text-sm text-slate-600">
          <Loader2 className="animate-spin" size={16} />
          Procesando...
        </div>
      )}
    </div>
  );
}
