import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { nutritionApi } from '@/services/api';
import { ArrowLeft, ChefHat, DollarSign, Users } from 'lucide-react';
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


export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: recipeData, isLoading } = useQuery(
    ['nutrition-recipe', id],
    () => nutritionApi.getRecipeById(id!).then((r) => r.data.recipe),
    { enabled: !!id }
  );

  const { data: costData } = useQuery(
    ['nutrition-recipe-cost', id],
    () => nutritionApi.calculateRecipeCost(id!).then((r) => r.data),
    { enabled: !!id }
  );

  const recipe = recipeData;

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="skeleton h-8 w-48 mb-4" />
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

  if (!recipe) {
    return (
      <div className="card p-12 text-center">
        <h3 className="text-lg font-semibold text-apple-black mb-2">Receta no encontrada</h3>
        <Link to="/nutrition/recipes" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Volver a recetas
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/nutrition/recipes"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </Link>
      </div>

      <PageHeader
        title={recipe.name}
        subtitle={dietTypeLabels[recipe.dietType] || recipe.dietType}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ingredientes"
          value={recipe.ingredients?.length || 0}
          icon={ChefHat}
        />
        <StatCard
          title="Costo total"
          value={`${costData?.totalCost?.toFixed(2) || '0.00'}€`}
          icon={DollarSign}
        />
        <StatCard
          title="Costo por porción"
          value={`${costData?.costPerPortion?.toFixed(2) || '0.00'}€`}
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-apple-black mb-4">Ingredientes</h3>
          {recipe.ingredients?.length === 0 ? (
            <p className="text-apple-gray-200">Sin ingredientes registrados</p>
          ) : (
            <div className="space-y-3">
              {recipe.ingredients.map((ing: any) => (
                <div key={ing.id} className="flex items-center justify-between p-3 bg-apple-gray rounded-lg">
                  <div>
                    <p className="font-medium text-apple-black">{ing.name}</p>
                    <p className="text-sm text-apple-gray-200">
                      {ing.quantity} {ing.unit}
                    </p>
                  </div>
                  {ing.costPerUnit && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-apple-black">
                        {(ing.costPerUnit * ing.quantity).toFixed(2)}€
                      </p>
                      <p className="text-xs text-apple-gray-200">
                        {ing.costPerUnit}€/{ing.unit}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">Información</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-apple-gray-200">Porciones</span>
                <span className="font-medium">{recipe.portions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-gray-200">Estado</span>
                <span className={cn('font-medium', recipe.isActive ? 'text-green-600' : 'text-apple-gray-200')}>
                  {recipe.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              {recipe.instructions && (
                <div className="pt-3 border-t border-apple-gray-100">
                  <span className="text-apple-gray-200 block mb-1">Instrucciones</span>
                  <p className="text-sm text-apple-black whitespace-pre-wrap">{recipe.instructions}</p>
                </div>
              )}
              {recipe.notes && (
                <div className="pt-3 border-t border-apple-gray-100">
                  <span className="text-apple-gray-200 block mb-1">Notas</span>
                  <p className="text-sm text-apple-black">{recipe.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dogs using this recipe */}
          {recipe.dogDiets?.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-apple-black mb-4 flex items-center gap-2">
                <Users size={18} /> Perros asignados
              </h3>
              <div className="space-y-2">
                {recipe.dogDiets.map((diet: any) => (
                  <Link
                    key={diet.id}
                    to={`/dogs/${diet.dog.id}`}
                    className="flex items-center gap-3 p-3 bg-apple-gray rounded-lg hover:bg-apple-gray-100 transition-colors"
                  >
                    {diet.dog.photos?.[0]?.url ? (
                      <img src={diet.dog.photos[0].url} alt={diet.dog.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-apple-gray-200 flex items-center justify-center text-white text-sm font-medium">
                        {diet.dog.name[0]}
                      </div>
                    )}
                    <span className="font-medium text-apple-black">{diet.dog.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
