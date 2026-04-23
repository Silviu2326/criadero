import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { medicalApi, dogsApi } from '@/services/api';
import { useUIStore } from '@/store/uiStore';
import {
  ArrowLeft,
  Loader2,
  Dog,
  Calendar,
  FileText,
  Upload,
  Paperclip,
  X,
  Stethoscope,
  Syringe,
  Pill,
  ClipboardList,
  Activity,
} from 'lucide-react';

interface MedicalRecordFormData {
  dogId: string;
  type: 'VACCINE' | 'DEWORMING' | 'CONSULTATION' | 'EXAM' | 'SURGERY' | 'OTHER';
  date: string;
  description: string;
  nextDate: string;
  attachmentUrl: string;
  vaccineName: string;
  vaccineLot: string;
  vaccineLab: string;
  dewormerProduct: string;
  weightAtDate: number | '';
  diagnosis: string;
  treatment: string;
  postOpNotes: string;
}

const typeLabels: Record<string, string> = {
  VACCINE: 'Vacuna',
  DEWORMING: 'Desparasitación',
  CONSULTATION: 'Consulta',
  EXAM: 'Examen',
  SURGERY: 'Cirugía',
  OTHER: 'Otro',
};

const typeIcons: Record<string, React.ElementType> = {
  VACCINE: Syringe,
  DEWORMING: Pill,
  CONSULTATION: Stethoscope,
  EXAM: ClipboardList,
  SURGERY: Activity,
  OTHER: FileText,
};

export function MedicalRecordCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useUIStore();
  const queryDogId = searchParams.get('dogId');
  const [uploadingFile, setUploadingFile] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MedicalRecordFormData>({
    defaultValues: {
      type: 'CONSULTATION',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedType = watch('type');
  const selectedDogId = watch('dogId');

  const { data: dog } = useQuery(
    ['dog', selectedDogId],
    () => dogsApi.getById(selectedDogId).then((r) => r.data.dog),
    { enabled: !!selectedDogId }
  );

  useEffect(() => {
    if (queryDogId) {
      setValue('dogId', queryDogId);
    }
  }, [queryDogId, setValue]);

  const createMutation = useMutation(
    async (data: MedicalRecordFormData) => {
      const payload: any = {
        dogId: data.dogId,
        type: data.type,
        date: data.date,
        description: data.description,
        nextDate: data.nextDate || undefined,
        attachmentUrl: data.attachmentUrl || undefined,
      };

      if (data.type === 'VACCINE') {
        payload.vaccineName = data.vaccineName || undefined;
        payload.vaccineLot = data.vaccineLot || undefined;
        payload.vaccineLab = data.vaccineLab || undefined;
      }
      if (data.type === 'DEWORMING') {
        payload.dewormerProduct = data.dewormerProduct || undefined;
        payload.weightAtDate = data.weightAtDate ? Number(data.weightAtDate) : undefined;
      }
      if (data.type === 'CONSULTATION' || data.type === 'SURGERY') {
        payload.diagnosis = data.diagnosis || undefined;
        payload.treatment = data.treatment || undefined;
        payload.postOpNotes = data.postOpNotes || undefined;
      }

      const response = await medicalApi.create(payload);
      return response.data;
    },
    {
      onSuccess: () => {
        addNotification({ type: 'success', message: 'Registro médico creado correctamente' });
        navigate(queryDogId ? `/dogs/${queryDogId}` : '/vet/records');
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.response?.data?.error || 'Error al crear el registro médico',
        });
      },
    }
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const response = await medicalApi.uploadAttachment(file);
      setValue('attachmentUrl', response.data.url);
      addNotification({ type: 'success', message: 'Archivo subido correctamente' });
    } catch {
      addNotification({ type: 'error', message: 'Error al subir el archivo' });
    } finally {
      setUploadingFile(false);
    }
  };

  const removeAttachment = () => {
    setValue('attachmentUrl', '');
  };

  const onSubmit = (data: MedicalRecordFormData) => {
    if (!data.dogId) {
      addNotification({ type: 'error', message: 'Selecciona un perro' });
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to={queryDogId ? `/dogs/${queryDogId}` : '/vet/records'}
          className="p-2 hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">Nuevo registro médico</h1>
          <p className="text-apple-gray-100">Crea un nuevo registro para un perro</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
        <div className="bg-white rounded-apple p-6 space-y-6">
          {/* Dog selection */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <Dog size={16} className="inline mr-1" />
              Perro *
            </label>
            {queryDogId && dog ? (
              <div className="p-4 bg-apple-gray rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                  {dog.photos?.[0]?.url ? (
                    <img src={dog.photos[0].url} alt={dog.name} className="w-full h-full object-cover" />
                  ) : (
                    <Dog className="w-full h-full p-2 text-apple-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-apple-black">{dog.name}</p>
                  <p className="text-sm text-apple-gray-100">
                    {dog.breed?.name} • {dog.gender === 'MALE' ? 'Macho' : 'Hembra'}
                  </p>
                </div>
                <input type="hidden" {...register('dogId', { required: true })} />
              </div>
            ) : (
              <input
                {...register('dogId', { required: 'Perro requerido' })}
                className="input-apple"
                placeholder="ID del perro"
              />
            )}
            {errors.dogId && <p className="mt-1 text-sm text-red-600">{errors.dogId.message}</p>}
          </div>

          {/* Record type */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">Tipo de registro *</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Object.entries(typeLabels).map(([type, label]) => {
                const Icon = typeIcons[type];
                const isSelected = selectedType === type;
                return (
                  <label
                    key={type}
                    className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                      isSelected
                        ? 'border-apple-blue bg-apple-blue/5'
                        : 'border-apple-gray-300 hover:border-apple-blue/50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register('type')}
                      className="sr-only"
                    />
                    <Icon className={`mx-auto mb-1 ${isSelected ? 'text-apple-blue' : 'text-apple-gray-200'}`} size={20} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-apple-blue' : 'text-apple-gray-200'}`}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha del registro *
              </label>
              <input
                type="date"
                {...register('date', { required: 'Fecha requerida' })}
                className="input-apple"
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-apple-black mb-2">
                Próxima fecha
              </label>
              <input
                type="date"
                {...register('nextDate')}
                className="input-apple"
              />
            </div>
          </div>

          {/* Dynamic fields per type */}
          {selectedType === 'VACCINE' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-medium text-apple-black flex items-center gap-2">
                <Syringe size={18} className="text-apple-blue" />
                Datos de la vacuna
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Vacuna</label>
                  <input {...register('vaccineName')} className="input-apple" placeholder="Ej. Rabia" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Lote</label>
                  <input {...register('vaccineLot')} className="input-apple" placeholder="Lote" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Laboratorio</label>
                  <input {...register('vaccineLab')} className="input-apple" placeholder="Lab" />
                </div>
              </div>
            </div>
          )}

          {selectedType === 'DEWORMING' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-xl">
              <h3 className="font-medium text-apple-black flex items-center gap-2">
                <Pill size={18} className="text-green-600" />
                Datos de la desparasitación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Producto</label>
                  <input {...register('dewormerProduct')} className="input-apple" placeholder="Ej. Drontal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Peso (kg)</label>
                  <input type="number" step="0.1" {...register('weightAtDate', { valueAsNumber: true })} className="input-apple" placeholder="0.0" />
                </div>
              </div>
            </div>
          )}

          {(selectedType === 'CONSULTATION' || selectedType === 'SURGERY') && (
            <div className="space-y-4 p-4 bg-amber-50 rounded-xl">
              <h3 className="font-medium text-apple-black flex items-center gap-2">
                <Stethoscope size={18} className="text-amber-600" />
                {selectedType === 'SURGERY' ? 'Datos de cirugía' : 'Datos de consulta'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Diagnóstico</label>
                  <input {...register('diagnosis')} className="input-apple" placeholder="Diagnóstico" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Tratamiento</label>
                  <input {...register('treatment')} className="input-apple" placeholder="Tratamiento" />
                </div>
              </div>
              {selectedType === 'SURGERY' && (
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Notas post-operatorio</label>
                  <textarea {...register('postOpNotes')} rows={2} className="input-apple resize-none" placeholder="Notas..." />
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <FileText size={16} className="inline mr-1" />
              Descripción *
            </label>
            <textarea
              {...register('description', { required: 'Descripción requerida' })}
              rows={4}
              className="input-apple resize-none"
              placeholder="Describe el procedimiento, síntomas o resultado..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-sm font-medium text-apple-black mb-2">
              <Paperclip size={16} className="inline mr-1" />
              Adjunto (radiografía, análisis, etc.)
            </label>

            {watch('attachmentUrl') ? (
              <div className="flex items-center gap-3 p-4 bg-apple-gray rounded-xl">
                <Paperclip size={20} className="text-apple-blue" />
                <span className="flex-1 text-sm text-apple-black truncate">{watch('attachmentUrl')}</span>
                <button
                  type="button"
                  onClick={removeAttachment}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 p-4 border-2 border-dashed border-apple-gray-300 rounded-xl cursor-pointer hover:border-apple-blue transition-colors">
                <Upload size={20} className="text-apple-gray-100" />
                <span className="text-sm text-apple-gray-100">
                  {uploadingFile ? 'Subiendo archivo...' : 'Haz clic para subir un archivo'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isLoading || uploadingFile}
            className="btn-primary h-12 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {createMutation.isLoading && <Loader2 className="animate-spin" size={18} />}
            Guardar registro
          </button>
          <Link to={queryDogId ? `/dogs/${queryDogId}` : '/vet/records'} className="text-apple-link hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
