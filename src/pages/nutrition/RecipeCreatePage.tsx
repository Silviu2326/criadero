import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { nutritionApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';

const dietTypeLabels: Record<string, string> = {
  DRY: 'Pienso seco',
  WET: 'Húmedo',
  BARF: 'BARF',
  HOME_COOKED: 'Casero',
  MIXED: 'Mixto',
};

export function RecipeCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const [ingredients, setIngredients] = useState<
    { name: string; quantity: number; unit: string; costPerUnit?: number; notes?: string }[]
  >([{ name: '', quantity: 0, unit: 'g' }]);

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      dietType: 'DRY',
      portions: 1,
      instructions: '',
      notes: '',
    },
  });

  const createMutation = useMutation(
    (data: any) => nutritionApi.createRecipe({ ...data, kennelId, ingredients }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-recipes']);
        addNotification({ type: 'success', message: 'Receta creada correctamente' });
        navigate('/nutrition/recipes');
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al crear la receta' });
      },
    }
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: 'g' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const onSubmit = (data: any) => {
    if (!kennelId) {
      addNotification({ type: 'error', message: 'No se encontró un criadero activo' });
      return;
    }
    createMutation.mutate(data);
  };

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

      <PageHeader title="Nueva receta" subtitle="Crea una receta de alimentación reutilizable" />

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">Nombre *</label>
              <input
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="input-apple w-full"
                placeholder="Ej: Dieta BARF pollo y verduras"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-1.5">Tipo de dieta *</label>
              <select {...register('dietType')} className="select-apple w-full">
                {Object.entries(dietTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Porciones</label>
            <input
              {...register('portions', { valueAsNumber: true })}
              type="number"
              min={1}
              className="input-apple w-full md:w-32"
              placeholder="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Instrucciones</label>
            <textarea
              {...register('instructions')}
              rows={4}
              className="input-apple w-full"
              placeholder="Describe el proceso de preparación..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1.5">Notas</label>
            <textarea
              {...register('notes')}
              rows={2}
              className="input-apple w-full"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-apple-black">Ingredientes</label>
              <button
                type="button"
                onClick={addIngredient}
                className="btn-secondary flex items-center gap-1 text-sm"
              >
                <Plus size={14} /> Añadir ingrediente
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-apple-gray rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="Nombre del ingrediente"
                      className="input-apple w-full text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={ing.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="Cantidad"
                        className="input-apple w-28 text-sm"
                      />
                      <select
                        value={ing.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        className="select-apple w-24 text-sm"
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="units">ud</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={ing.costPerUnit || ''}
                        onChange={(e) => updateIngredient(index, 'costPerUnit', parseFloat(e.target.value) || undefined)}
                        placeholder="Costo/unidad"
                        className="input-apple w-32 text-sm"
                      />
                    </div>
                  </div>
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-apple-gray-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-apple-gray-100">
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="btn-primary"
            >
              {createMutation.isLoading ? 'Creando...' : 'Crear receta'}
            </button>
            <Link to="/nutrition/recipes" className="btn-outline">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
