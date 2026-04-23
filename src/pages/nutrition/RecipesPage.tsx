import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { nutritionApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Plus, Search, ChefHat, Trash2, ArrowRight, DollarSign } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
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

export function RecipesPage() {
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

  const { data: recipesData, isLoading } = useQuery(
    ['nutrition-recipes', kennelId, dietTypeFilter],
    () =>
      nutritionApi
        .getRecipes({ kennelId, dietType: dietTypeFilter || undefined })
        .then((r) => r.data.recipes),
    { enabled: !!kennelId }
  );

  const deleteMutation = useMutation(
    (id: string) => nutritionApi.deleteRecipe(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-recipes']);
        addNotification({ type: 'success', message: 'Receta eliminada' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const recipes = recipesData || [];

  const filteredRecipes = useMemo(() => {
    if (!search) return recipes;
    const searchLower = search.toLowerCase();
    return recipes.filter(
      (r: any) =>
        r.name.toLowerCase().includes(searchLower) ||
        r.instructions?.toLowerCase().includes(searchLower)
    );
  }, [recipes, search]);

  const stats = useMemo(() => {
    const total = recipes.length;
    const active = recipes.filter((r: any) => r.isActive).length;
    const avgIngredients =
      total > 0
        ? recipes.reduce((sum: number, r: any) => sum + (r.ingredients?.length || 0), 0) / total
        : 0;
    return { total, active, avgIngredients: Math.round(avgIngredients) };
  }, [recipes]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Recetas" subtitle="Recetas de alimentación reutilizables" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
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
      <PageHeader
        title="Recetas"
        subtitle="Recetas de alimentación reutilizables para tus perros"
        action={
          isBreeder && (
            <Link to="/nutrition/recipes/new" className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Nueva receta
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total recetas" value={stats.total} icon={ChefHat} />
        <StatCard title="Recetas activas" value={stats.active} icon={ChefHat} />
        <StatCard title="Ingredientes promedio" value={stats.avgIngredients} icon={DollarSign} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-200" size={18} />
          <input
            type="text"
            placeholder="Buscar recetas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-apple w-full pl-10"
          />
        </div>
        <select
          value={dietTypeFilter}
          onChange={(e) => setDietTypeFilter(e.target.value)}
          className="input-apple w-full sm:w-48"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(dietTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="card p-12 text-center">
          <ChefHat className="mx-auto h-12 w-12 text-apple-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-apple-black mb-2">No hay recetas</h3>
          <p className="text-apple-gray-200 mb-6">Crea tu primera receta de alimentación</p>
          {isBreeder && (
            <Link to="/nutrition/recipes/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Nueva receta
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe: any) => (
            <div
              key={recipe.id}
              className={cn(
                'card card-interactive p-6',
                !recipe.isActive && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className={cn(
                      'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2',
                      dietTypeColors[recipe.dietType] || 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {dietTypeLabels[recipe.dietType] || recipe.dietType}
                  </span>
                  <h3 className="text-lg font-semibold text-apple-black">{recipe.name}</h3>
                </div>
                {isBreeder && (
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar esta receta?')) {
                        deleteMutation.mutate(recipe.id);
                      }
                    }}
                    className="p-2 text-apple-gray-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-apple-gray-200">
                  <span className="font-medium">{recipe.ingredients?.length || 0}</span> ingredientes
                </p>
                <p className="text-sm text-apple-gray-200">
                  <span className="font-medium">{recipe.portions}</span> porciones
                </p>
                {recipe._count?.dogDiets > 0 && (
                  <p className="text-sm text-apple-blue">
                    Asignada a {recipe._count.dogDiets} perro(s)
                  </p>
                )}
              </div>

              {recipe.instructions && (
                <p className="text-sm text-apple-gray-200 line-clamp-2 mb-4">{recipe.instructions}</p>
              )}

              <Link
                to={`/nutrition/recipes/${recipe.id}`}
                className="flex items-center gap-1 text-sm font-medium text-apple-blue hover:underline"
              >
                Ver detalle <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
