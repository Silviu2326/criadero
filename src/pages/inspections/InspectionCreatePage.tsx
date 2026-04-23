import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { inspectionsApi, kennelsApi, dogsApi, littersApi, usersApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { PageHeader } from '@/components/common/PageHeader';
import { InspectionType } from '@/types';
import { cn } from '@/utils/cn';
import {
  ClipboardCheck,
  ArrowLeft,
  Stethoscope,
  Calculator,
  Building2,
  FileCheck,
  Search,
  Baby,
  Dna,
  HeartHandshake,
  Truck,
} from 'lucide-react';

const typeOptions: { value: InspectionType; label: string; icon: any; description: string }[] = [
  { value: 'HEALTH', label: 'Sanitaria', icon: Stethoscope, description: 'Evaluacion del estado de salud' },
  { value: 'FINANCIAL', label: 'Economica', icon: Calculator, description: 'Auditoria de finanzas' },
  { value: 'FACILITY', label: 'Instalaciones', icon: Building2, description: 'Revision de instalaciones' },
  { value: 'DOCUMENTARY', label: 'Documental', icon: FileCheck, description: 'Verificacion de documentacion' },
  { value: 'PRE_PURCHASE', label: 'Pre-compra', icon: Search, description: 'Inspeccion antes de venta' },
  { value: 'LITTER', label: 'Camada', icon: Baby, description: 'Evaluacion de camada' },
  { value: 'BREEDING', label: 'Reproduccion', icon: Dna, description: 'Revision de plan de cruza' },
  { value: 'WELFARE', label: 'Bienestar', icon: HeartHandshake, description: 'Evaluacion de bienestar' },
  { value: 'TRANSPORT', label: 'Transporte', icon: Truck, description: 'Inspeccion de envio' },
];

interface FormData {
  title: string;
  type: InspectionType;
  scheduledDate: string;
  kennelId: string;
  dogId?: string;
  litterId?: string;
  inspectorId?: string;
}

export function InspectionCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [selectedType, setSelectedType] = useState<InspectionType>('HEALTH');

  const { data: myKennels } = useQuery('myKennels', () =>
    kennelsApi.getMyKennels().then((r) => r.data.kennels)
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: dogsData } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const { data: littersData } = useQuery(
    ['litters', kennelId],
    () => littersApi.getAll({ kennelId }).then((r) => r.data.litters),
    { enabled: !!kennelId }
  );

  const { data: vetsData } = useQuery('veterinarians', () =>
    usersApi.getVeterinarians().then((r) => r.data.veterinarians)
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'HEALTH',
      scheduledDate: new Date().toISOString().split('T')[0],
      kennelId: kennelId || '',
    },
  });

  const createMutation = useMutation(
    (data: FormData) => inspectionsApi.create(data).then((r) => r.data.inspection),
    {
      onSuccess: (inspection) => {
        queryClient.invalidateQueries(['inspections']);
        addNotification({ type: 'success', message: 'Inspeccion creada correctamente' });
        navigate(`/inspections/${inspection.id}`);
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al crear la inspeccion' });
      },
    }
  );

  const onSubmit = (data: FormData) => {
    createMutation.mutate({
      ...data,
      type: selectedType,
      kennelId: kennelId || data.kennelId,
    });
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title="Nueva Inspeccion"
        subtitle="Programa una nueva inspeccion para tu criadero"
        action={
          <button onClick={() => navigate('/inspections')} className="btn-ghost">
            <ArrowLeft size={18} />
            Volver
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Type Selection */}
        <div className="card p-6">
          <label className="block text-sm font-semibold text-apple-black mb-3">Tipo de Inspeccion</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {typeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(opt.value);
                    setValue('type', opt.value);
                  }}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                    isSelected
                      ? 'border-[#4A5D52] bg-[#4A5D52]/5'
                      : 'border-transparent bg-apple-gray hover:bg-apple-gray-300/30'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-[#4A5D52] text-white' : 'bg-white text-apple-gray-200'
                  )}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={cn('font-semibold text-sm', isSelected ? 'text-[#4A5D52]' : 'text-apple-black')}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-apple-gray-100 mt-0.5">{opt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-apple-black mb-2">Titulo</label>
            <input
              {...register('title', { required: 'El titulo es obligatorio' })}
              className="input-apple w-full"
              placeholder={`Inspeccion ${typeOptions.find(t => t.value === selectedType)?.label}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-apple-black mb-2">Fecha programada</label>
              <input
                type="date"
                {...register('scheduledDate', { required: 'La fecha es obligatoria' })}
                className="input-apple w-full"
              />
              {errors.scheduledDate && <p className="text-red-500 text-xs mt-1">{errors.scheduledDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-apple-black mb-2">Inspector</label>
              <select {...register('inspectorId')} className="input-apple w-full">
                <option value="">Selecciona inspector</option>
                <option value={user?.id}>Yo ({user?.firstName} {user?.lastName})</option>
                {vetsData?.map((vet: any) => (
                  <option key={vet.userId} value={vet.userId}>
                    {vet.user?.firstName} {vet.user?.lastName} - {vet.specialization || 'Veterinario'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Related entity */}
          {selectedType === 'HEALTH' || selectedType === 'PRE_PURCHASE' ? (
            <div>
              <label className="block text-sm font-semibold text-apple-black mb-2">Perro (opcional)</label>
              <select {...register('dogId')} className="input-apple w-full">
                <option value="">Selecciona un perro</option>
                {dogsData?.map((dog: any) => (
                  <option key={dog.id} value={dog.id}>{dog.name} - {dog.breed?.name}</option>
                ))}
              </select>
            </div>
          ) : selectedType === 'LITTER' ? (
            <div>
              <label className="block text-sm font-semibold text-apple-black mb-2">Camada (opcional)</label>
              <select {...register('litterId')} className="input-apple w-full">
                <option value="">Selecciona una camada</option>
                {littersData?.map((litter: any) => (
                  <option key={litter.id} value={litter.id}>
                    {new Date(litter.birthDate).toLocaleDateString('es-ES')} - {litter.puppyCount} cachorros
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/inspections')} className="btn-ghost">
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={createMutation.isLoading}>
            {createMutation.isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <ClipboardCheck size={18} />
                Crear Inspeccion
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
