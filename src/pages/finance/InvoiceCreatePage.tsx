import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { financeApi, kennelsApi, customersApi, dogsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  FileText,
  User,
  Calendar,
  Dog,
  Euro,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';

interface InvoiceFormData {
  customerId: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  taxRate: number;
  items: { description: string; quantity: number; unitPrice: number; dogId?: string }[];
}

export function InvoiceCreatePage() {
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

  const { data: customers } = useQuery(
    ['customers', kennelId],
    () => customersApi.getAll({ kennelId }).then((r) => r.data.customers),
    { enabled: !!kennelId }
  );

  const { data: dogs } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      taxRate: 21,
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const taxRate = watch('taxRate');

  const subtotal = items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const total = subtotal + taxAmount;

  const createMutation = useMutation(
    async (data: InvoiceFormData) => {
      const response = await financeApi.createInvoice(kennelId!, {
        ...data,
        items: data.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity.toString()),
          unitPrice: parseFloat(item.unitPrice.toString()),
        })),
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices']);
        addNotification({ type: 'success', message: 'Factura creada exitosamente' });
        navigate('/finance/invoices');
      },
      onError: (error: any) => {
        addNotification({ type: 'error', message: error?.response?.data?.error || 'Error al crear factura' });
      },
    }
  );

  const onSubmit = (data: InvoiceFormData) => {
    if (!kennelId) {
      addNotification({ type: 'error', message: 'No tienes un criadero asignado' });
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/finance/invoices" className="p-2 hover:bg-apple-gray rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">Nueva factura</h1>
          <p className="text-apple-gray-100">Crear factura para cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-apple p-6">
              <h3 className="text-lg font-semibold text-apple-black mb-4 flex items-center gap-2">
                <FileText size={20} />
                Datos de la factura
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-2">
                    <User size={16} className="inline mr-1" />
                    Cliente *
                  </label>
                  <select {...register('customerId', { required: 'Cliente requerido' })} className="input-apple">
                    <option value="">Selecciona un cliente</option>
                    {customers?.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.email})
                      </option>
                    ))}
                  </select>
                  {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-black mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Fecha emision *
                    </label>
                    <input type="date" {...register('issueDate', { required: true })} className="input-apple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-black mb-2">Vencimiento *</label>
                    <input type="date" {...register('dueDate', { required: true })} className="input-apple" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-apple p-6">
              <h3 className="text-lg font-semibold text-apple-black mb-4">Conceptos</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 bg-apple-gray rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <input
                          {...register(`items.${index}.description` as const, { required: 'Descripcion requerida' })}
                          className="input-apple"
                          placeholder="Descripcion del concepto"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-apple-gray-100">Cantidad</label>
                            <input type="number" min="1" {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} className="input-apple" />
                          </div>
                          <div>
                            <label className="text-xs text-apple-gray-100">Precio unitario</label>
                            <input type="number" step="0.01" min="0" {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })} className="input-apple" />
                          </div>
                          <div>
                            <label className="text-xs text-apple-gray-100">Total</label>
                            <p className="font-semibold text-apple-black py-3">
                              €{((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-apple-gray-100 mb-1 block">
                            <Dog size={12} className="inline mr-1" />
                            Perro relacionado (opcional)
                          </label>
                          <select {...register(`items.${index}.dogId` as const)} className="input-apple text-sm">
                            <option value="">Sin perro relacionado</option>
                            {dogs?.map((d: any) => (
                              <option key={d.id} value={d.id}>{d.name} ({d.breed?.name})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={fields.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                  className="w-full py-3 border-2 border-dashed border-apple-gray-300 rounded-xl text-apple-gray-100 hover:border-apple-blue hover:text-apple-blue transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Agregar concepto
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-apple p-6">
              <h3 className="text-lg font-semibold text-apple-black mb-4 flex items-center gap-2">
                <Euro size={20} />
                Totales
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-apple-gray-100">Subtotal</span>
                  <span className="font-medium">€{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-apple-gray-100">IVA (%)</span>
                  <input type="number" {...register('taxRate', { valueAsNumber: true })} className="w-20 input-apple py-1 text-sm text-right" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-apple-gray-100">IVA (€)</span>
                  <span className="font-medium">€{taxAmount.toLocaleString()}</span>
                </div>
                <hr className="border-apple-gray-300" />
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-apple-blue">€{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-apple p-6">
              <label className="block text-sm font-medium text-apple-black mb-2">Notas</label>
              <textarea {...register('notes')} rows={4} className="input-apple resize-none" placeholder="Notas adicionales para el cliente..." />
            </div>

            <div className="flex flex-col gap-3">
              <button type="submit" disabled={createMutation.isLoading} className="btn-primary h-12 flex items-center justify-center gap-2 disabled:opacity-50">
                {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
                Crear factura
              </button>
              <Link to="/finance/invoices" className="btn-secondary h-12 flex items-center justify-center">Cancelar</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
