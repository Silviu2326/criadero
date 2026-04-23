import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { financeApi, kennelsApi, dogsApi, customersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Dog,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface TransactionFormData {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string;
  description: string;
  notes: string;
  categoryId: string;
  paymentMethod: string;
  reference: string;
  dogId: string;
  customerId: string;
}

export function TransactionCreatePage() {
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

  const { data: categories } = useQuery(
    ['transactionCategories', kennelId],
    () => financeApi.getCategories(kennelId!).then((r) => r.data.categories),
    { enabled: !!kennelId }
  );

  const { data: dogs } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const { data: customers } = useQuery(
    ['customers', kennelId],
    () => customersApi.getAll({ kennelId }).then((r) => r.data.customers),
    { enabled: !!kennelId }
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: 'INCOME',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH',
    },
  });

  const transactionType = watch('type');

  const createMutation = useMutation(
    async (data: TransactionFormData) => {
      const response = await financeApi.createTransaction(kennelId!, {
        ...data,
        amount: parseFloat(data.amount.toString()),
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions']);
        queryClient.invalidateQueries(['financeSummary']);
        addNotification({
          type: 'success',
          message: 'Transacción creada exitosamente',
        });
        navigate('/finance/transactions');
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear la transacción',
        });
      },
    }
  );

  const incomeCategories = categories?.filter((c: any) => c.type === 'INCOME') || [];
  const expenseCategories = categories?.filter((c: any) => c.type === 'EXPENSE') || [];

  const onSubmit = (data: TransactionFormData) => {
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
        <Link to="/finance/transactions" className="p-2 hover:bg-apple-gray rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">Nueva transacción</h1>
          <p className="text-apple-gray-100">Registra un ingreso o gasto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-3">Tipo de transacción *</label>
            <div className="flex items-center gap-4">
              <label
                className={cn(
                  'flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors',
                  transactionType === 'INCOME'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  value="INCOME"
                  {...register('type')}
                  className="sr-only"
                />
                <TrendingUp className={transactionType === 'INCOME' ? 'text-green-600' : 'text-gray-400'} size={24} />
                <div>
                  <p className={cn('font-medium', transactionType === 'INCOME' ? 'text-green-700' : 'text-gray-600')}>
                    Ingreso
                  </p>
                  <p className="text-xs text-gray-400">Venta, señal, etc.</p>
                </div>
              </label>

              <label
                className={cn(
                  'flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors',
                  transactionType === 'EXPENSE'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  value="EXPENSE"
                  {...register('type')}
                  className="sr-only"
                />
                <TrendingDown className={transactionType === 'EXPENSE' ? 'text-red-600' : 'text-gray-400'} size={24} />
                <div>
                  <p className={cn('font-medium', transactionType === 'EXPENSE' ? 'text-red-700' : 'text-gray-600')}>
                    Gasto
                  </p>
                  <p className="text-xs text-gray-400">Compra, servicio, etc.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <DollarSign size={16} className="inline mr-1" />
                Monto (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('amount', { required: 'Monto requerido', valueAsNumber: true })}
                className="input-apple"
                placeholder="0.00"
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha *
              </label>
              <input
                type="date"
                {...register('date', { required: 'Fecha requerida' })}
                className="input-apple"
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <Tag size={16} className="inline mr-1" />
              Categoría *
            </label>
            <select
              {...register('categoryId', { required: 'Categoría requerida' })}
              className="input-apple"
            >
              <option value="">Selecciona una categoría</option>
              {(transactionType === 'INCOME' ? incomeCategories : expenseCategories).map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">Descripción *</label>
            <input
              {...register('description', { required: 'Descripción requerida' })}
              className="input-apple"
              placeholder="Ej. Venta de cachorro Max"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Payment Method and Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Método de pago</label>
              <select {...register('paymentMethod')} className="input-apple">
                <option value="CASH">Efectivo</option>
                <option value="CARD">Tarjeta</option>
                <option value="TRANSFER">Transferencia</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Referencia/Factura</label>
              <input
                {...register('reference')}
                className="input-apple"
                placeholder="Número de factura o referencia"
              />
            </div>
          </div>

          {/* Related Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Dog size={16} className="inline mr-1" />
                Perro relacionado (opcional)
              </label>
              <select {...register('dogId')} className="input-apple">
                <option value="">Sin perro relacionado</option>
                {dogs?.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} ({dog.breed?.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <User size={16} className="inline mr-1" />
                Cliente relacionado (opcional)
              </label>
              <select {...register('customerId')} className="input-apple">
                <option value="">Sin cliente relacionado</option>
                {customers?.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <FileText size={16} className="inline mr-1" />
              Notas
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-apple resize-none"
              placeholder="Información adicional..."
            />
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
            Guardar transacción
          </button>
          <Link to="/finance/transactions" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
