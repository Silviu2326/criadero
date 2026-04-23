import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { tasksApi, kennelsApi, dogsApi, customersApi, usersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Loader2, CheckSquare, FileText, Calendar, Tag, User, Dog, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TaskFormData {
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  tags: string;
  recurrenceRule: string;
  assignedTo: string;
  dogId: string;
  customerId: string;
  isTemplate: boolean;
}

export function TaskCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryDogId = searchParams.get('dogId');
  const queryCustomerId = searchParams.get('customerId');

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: user?.role === 'MANAGER' || user?.role === 'BREEDER' || user?.role === 'VETERINARIAN' }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: dogsData } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const { data: customersData } = useQuery(
    ['customers', kennelId],
    () => customersApi.getAll({ kennelId }).then((r) => r.data.customers),
    { enabled: !!kennelId }
  );

  const { data: usersData } = useQuery(
    'users',
    () => usersApi.getAll().then((r) => r.data.users),
    { enabled: !!kennelId }
  );

  const { data: tasksData } = useQuery(
    ['tasks', kennelId],
    () => tasksApi.getAll({ kennelId }).then((r) => r.data.tasks),
    { enabled: !!kennelId }
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      status: 'PENDING',
      priority: 'MEDIUM',
    },
  });

  const createMutation = useMutation(
    async (data: TaskFormData) => {
      const payload: any = {
        ...data,
        kennelId: kennelId || '',
      };
      if (!payload.dueDate) delete payload.dueDate;
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dogId) delete payload.dogId;
      if (!payload.customerId) delete payload.customerId;
      if (!payload.recurrenceRule) delete payload.recurrenceRule;
      if (!payload.tags) delete payload.tags;

      const response = await tasksApi.create(payload);
      return response.data;
    },
    {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Tarea creada exitosamente',
        });
        navigate('/tasks');
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear la tarea',
        });
      },
    }
  );

  const onSubmit = (data: TaskFormData) => {
    if (!kennelId) {
      addNotification({
        type: 'error',
        message: 'No tienes un criadero asignado',
      });
      return;
    }
    createMutation.mutate(data);
  };

  const dogs = dogsData || [];
  const customers = customersData || [];
  const users = usersData || [];

  useEffect(() => {
    if (queryDogId && dogs.length) {
      const dogExists = dogs.some((d: any) => d.id === queryDogId);
      if (dogExists) {
        setValue('dogId', queryDogId);
      }
    }
  }, [queryDogId, dogs, setValue]);

  useEffect(() => {
    if (queryCustomerId && customers.length) {
      const customerExists = customers.some((c: any) => c.id === queryCustomerId);
      if (customerExists) {
        setValue('customerId', queryCustomerId);
      }
    }
  }, [queryCustomerId, customers, setValue]);

  const suggestedAssignee = useMemo(() => {
    if (!users.length || !tasksData) return null;
    const pendingCount = new Map<string, number>();
    users.forEach((u: any) => pendingCount.set(u.id, 0));
    tasksData.forEach((t: any) => {
      if (t.status === 'PENDING' || t.status === 'IN_PROGRESS') {
        const count = pendingCount.get(t.assignedTo) || 0;
        if (t.assignedTo) pendingCount.set(t.assignedTo, count + 1);
      }
    });
    let minUser: any = null;
    let minCount = Infinity;
    users.forEach((u: any) => {
      const count = pendingCount.get(u.id) || 0;
      if (count < minCount) {
        minCount = count;
        minUser = u;
      }
    });
    return minUser ? { user: minUser, count: minCount } : null;
  }, [users, tasksData]);

  useEffect(() => {
    if (suggestedAssignee && !watch('assignedTo')) {
      setValue('assignedTo', suggestedAssignee.user.id);
    }
  }, [suggestedAssignee, setValue, watch]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tasks" className="p-2 hover:bg-apple-gray rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">Nueva tarea</h1>
          <p className="text-apple-gray-100">Crea una tarea para tu equipo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">
                <CheckSquare size={16} className="inline mr-1" />
                Título *
              </label>
              <input
                {...register('title', { required: 'Título requerido' })}
                className="input-apple"
                placeholder="Ej. Revisar vacunas de la camada A"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-apple-black mb-2">
                <FileText size={16} className="inline mr-1" />
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-apple resize-none"
                placeholder="Describe los detalles de la tarea..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Estado</label>
              <select {...register('status')} className="input-apple">
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En progreso</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Prioridad</label>
              <select {...register('priority')} className="input-apple">
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha límite
              </label>
              <input type="datetime-local" {...register('dueDate')} className="input-apple" />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Tag size={16} className="inline mr-1" />
                Etiquetas
              </label>
              <input
                {...register('tags')}
                className="input-apple"
                placeholder="vacuna, urgente, limpieza"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <User size={16} className="inline mr-1" />
                Asignado a
              </label>
              <select {...register('assignedTo')} className="input-apple">
                <option value="">Sin asignar</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.role})
                  </option>
                ))}
              </select>
              {suggestedAssignee && (
                <p className="mt-1 text-xs text-apple-gray-100">
                  Sugerido: {suggestedAssignee.user.firstName} {suggestedAssignee.user.lastName} ({suggestedAssignee.count} tareas pendientes)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Dog size={16} className="inline mr-1" />
                Perro relacionado
              </label>
              <select {...register('dogId')} className="input-apple">
                <option value="">Ninguno</option>
                {dogs.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Users size={16} className="inline mr-1" />
                Cliente relacionado
              </label>
              <select {...register('customerId')} className="input-apple">
                <option value="">Ninguno</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">Recurrencia</label>
              <select {...register('recurrenceRule')} className="input-apple">
                <option value="">Sin recurrencia</option>
                <option value="DAILY">Diaria</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </div>

            <div className="flex items-center gap-2 h-full pt-6">
              <input id="isTemplate" type="checkbox" {...register('isTemplate')} className="w-4 h-4 rounded border-slate-300" />
              <label htmlFor="isTemplate" className="text-sm text-apple-black">
                Guardar como plantilla
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isLoading || !kennelId}
            className="btn-primary h-12 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
            Guardar tarea
          </button>
          <Link to="/tasks" className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
