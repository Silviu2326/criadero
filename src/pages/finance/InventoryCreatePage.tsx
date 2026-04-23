import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { financeApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  ArrowLeft,
  Loader2,
  Package,
  Tag,
  Box,
  AlertTriangle,
  DollarSign,
  Truck,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface InventoryFormData {
  name: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  minStock: number;
  cost: number;
  supplier: string;
}

const categories = [
  { value: 'FOOD', label: 'Alimento', color: 'bg-blue-100 text-blue-700' },
  { value: 'MEDICINE', label: 'Medicina', color: 'bg-red-100 text-red-700' },
  { value: 'SUPPLY', label: 'Suministro', color: 'bg-amber-100 text-amber-700' },
  { value: 'EQUIPMENT', label: 'Equipamiento', color: 'bg-purple-100 text-purple-700' },
  { value: 'OTHER', label: 'Otro', color: 'bg-gray-100 text-gray-700' },
];

const units = [
  { value: 'unidad', label: 'Unidad' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'litros', label: 'Litros' },
  { value: 'caja', label: 'Caja' },
  { value: 'bolsa', label: 'Bolsa' },
  { value: 'botella', label: 'Botella' },
  { value: 'dosis', label: 'Dosis' },
  { value: 'metros', label: 'Metros' },
];

export function InventoryCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: user?.role === 'MANAGER' || user?.role === 'BREEDER' }
  );

  const kennelId = myKennels?.[0]?.id;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InventoryFormData>({
    defaultValues: {
      category: 'FOOD',
      unit: 'unidad',
      quantity: 0,
      minStock: 0,
    },
  });

  const selectedCategory = watch('category');

  const createMutation = useMutation(
    async (data: InventoryFormData) => {
      const response = await financeApi.createInventoryItem(kennelId!, {
        ...data,
        quantity: parseFloat(data.quantity.toString()),
        minStock: parseFloat(data.minStock.toString()),
        cost: data.cost ? parseFloat(data.cost.toString()) : undefined,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);
        queryClient.invalidateQueries(['inventoryStats']);
        addNotification({
          type: 'success',
          message: 'Producto creado exitosamente',
        });
        navigate('/finance/inventory');
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear el producto',
        });
      },
    }
  );

  const onSubmit = (data: InventoryFormData) => {
    if (!kennelId) {
      addNotification({ type: 'error', message: 'No tienes un criadero asignado' });
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/finance/inventory" className="p-2 hover:bg-apple-gray rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Nuevo producto
          </h1>
          <p className="text-apple-gray-100">Agregar producto al inventario</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <Package size={16} className="inline mr-1" />
              Nombre del producto *
            </label>
            <input
              {...register('name', { required: 'Nombre requerido' })}
              className="input-apple"
              placeholder="Ej. Pienso Premium Adulto"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-3">
              <Tag size={16} className="inline mr-1" />
              Categoría *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    selectedCategory === cat.value
                      ? 'border-apple-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={cat.value}
                    {...register('category', { required: 'Categoría requerida' })}
                    className="sr-only"
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <FileText size={16} className="inline mr-1" />
              Descripción
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-apple resize-none"
              placeholder="Descripción del producto, características, uso..."
            />
          </div>

          {/* Stock Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Box size={16} className="inline mr-1" />
                Cantidad inicial *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('quantity', {
                  required: 'Cantidad requerida',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Cantidad mínima 0' }
                })}
                className="input-apple"
                placeholder="0"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Unidad *
              </label>
              <select {...register('unit', { required: 'Unidad requerida' })} className="input-apple">
                {units.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <AlertTriangle size={16} className="inline mr-1" />
                Stock mínimo
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('minStock', { valueAsNumber: true })}
                className="input-apple"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-apple-gray-100">
                Alerta cuando el stock esté por debajo de este número
              </p>
            </div>
          </div>

          {/* Cost and Supplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Costo unitario (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('cost', { valueAsNumber: true })}
                className="input-apple"
                placeholder="0.00"
              />
              <p className="mt-1 text-xs text-apple-gray-100">
                Precio de costo por unidad (opcional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Truck size={16} className="inline mr-1" />
                Proveedor
              </label>
              <input
                {...register('supplier')}
                className="input-apple"
                placeholder="Ej. Royal Canin, Amazon..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="btn-primary h-12 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
            Guardar producto
          </button>
          <Link to="/finance/inventory" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
