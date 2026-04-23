import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { nutritionApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  Plus,
  Search,
  ChefHat,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';

const dietTypeLabels: Record<string, string> = {
  DRY: 'Pienso seco',
  WET: 'Húmedo',
  BARF: 'BARF',
  HOME_COOKED: 'Casero',
  MIXED: 'Mixto',
};

const dietTypeColors: Record<string, string> = {
  DRY: 'bg-amber-100 text-amber-700',
  WET: 'bg-blue-100 text-blue-700',
  BARF: 'bg-green-100 text-green-700',
  HOME_COOKED: 'bg-orange-100 text-orange-700',
  MIXED: 'bg-purple-100 text-purple-700',
};

export function NutritionPlansPage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dietTypeFilter, setDietTypeFilter] = useState('');
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: plansData, isLoading } = useQuery(
    ['nutrition-plans', kennelId, dietTypeFilter],
    () =>
      nutritionApi
        .getPlans({ kennelId, dietType: dietTypeFilter || undefined })
        .then((r) => r.data.plans),
    { enabled: !!kennelId }
  );

  const deleteMutation = useMutation(
    (id: string) => nutritionApi.deletePlan(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-plans']);
        addNotification({ type: 'success', message: 'Plan eliminado' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const plans = plansData || [];

  const filteredPlans = useMemo(() => {
    if (!search) return plans;
    const searchLower = search.toLowerCase();
    return plans.filter(
      (p: any) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.instructions?.toLowerCase().includes(searchLower)
    );
  }, [plans, search]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Planes de alimentación" subtitle="Gestión de planes nutricionales" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="skeleton h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/nutrition"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a Nutrición
        </Link>
      </div>

      <PageHeader
        title="Planes de alimentación"
        subtitle={`${plans.length} planes registrados`}
        action={
          isBreeder && (
            <Link to="/nutrition/plans/new" className="btn-primary">
              <Plus size={18} />
              Nuevo plan
            </Link>
          )
        }
      />

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar planes..."
              className="input-apple pl-11 w-full"
            />
          </div>

          <select
            value={dietTypeFilter}
            onChange={(e) => setDietTypeFilter(e.target.value)}
            className="input-apple select-apple"
          >
            <option value="">Todos los tipos</option>
            <option value="DRY">Pienso seco</option>
            <option value="WET">Húmedo</option>
            <option value="BARF">BARF</option>
            <option value="HOME_COOKED">Casero</option>
            <option value="MIXED">Mixto</option>
          </select>
        </div>
      </div>

      {/* Plans grid */}
      {filteredPlans.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay planes</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || dietTypeFilter
              ? 'No se encontraron planes con los filtros seleccionados'
              : 'Comienza creando tu primer plan de alimentación'}
          </p>
          {isBreeder && !search && !dietTypeFilter && (
            <Link to="/nutrition/plans/new" className="btn-primary">
              <Plus size={18} />
              Nuevo Plan
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan: any) => (
            <div key={plan.id} className="card p-5 card-interactive">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      dietTypeColors[plan.dietType]
                    )}
                  >
                    <ChefHat size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-apple-black">{plan.name}</h4>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        dietTypeColors[plan.dietType]
                      )}
                    >
                      {dietTypeLabels[plan.dietType]}
                    </span>
                  </div>
                </div>
                {!plan.isActive && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                    Inactivo
                  </span>
                )}
              </div>

              {plan.instructions && (
                <p className="text-sm text-apple-gray-100 mb-4 line-clamp-2">{plan.instructions}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-apple-gray-100">Ración</p>
                  <p className="font-semibold text-apple-black">{plan.dailyGramsPerKg}g/kg</p>
                </div>
                <div>
                  <p className="text-xs text-apple-gray-100">Actividad</p>
                  <p className="font-semibold text-apple-black">{plan.activityLevel}</p>
                </div>
                {plan.targetBreed && (
                  <div>
                    <p className="text-xs text-apple-gray-100">Raza objetivo</p>
                    <p className="font-semibold text-apple-black truncate">{plan.targetBreed.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-apple-gray-100">Asignaciones</p>
                  <p className="font-semibold text-apple-black">{plan._count?.dogDiets || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteMutation.mutate(plan.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
