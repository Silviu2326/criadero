import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  dogsApi,
  documentsApi,
  tasksApi,
  calendarApi,
  nutritionApi,
} from '@/services/api';
import { PedigreeTree } from '@/components/dogs/PedigreeTree';
import { Tabs, Tab, TabPanel } from '@/components/ui/Tabs';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Heart,
  Stethoscope,
  Calendar,
  MapPin,
  PawPrint,
  Dna,
  Loader2,
  AlertTriangle,
  FileText,
  CheckSquare,
  Apple,
  Pill,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/utils/cn';

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
  REPRODUCTIVE: 'Reproductivo',
  RETIRED: 'Retirado',
};

const taskStatusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const taskStatusColors: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const eventTypeColors: Record<string, string> = {
  VACCINE: 'bg-green-500',
  DEWORMING: 'bg-blue-500',
  HEAT: 'bg-pink-500',
  BIRTH: 'bg-purple-500',
  APPOINTMENT: 'bg-amber-500',
  OTHER: 'bg-gray-500',
};

const docTypeLabels: Record<string, string> = {
  PEDIGREE: 'Pedigree',
  CONTRACT: 'Contrato',
  HEALTH_CERT: 'Cert. salud',
  VACCINE_CERT: 'Cert. vacunas',
  MICROCHIP: 'Microchip',
  PHOTO: 'Foto',
  INVOICE: 'Factura',
  OTHER: 'Otro',
};

export function DogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [activePhoto, setActivePhoto] = useState(0);
  const [activeTab, setActiveTab] = useState('general');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const isVet = user?.role === 'VETERINARIAN';

  const { data: dog, isLoading } = useQuery(
    ['dog', id],
    () => dogsApi.getById(id!).then((r) => r.data.dog)
  );

  const kennelId = dog?.kennelId;

  const { data: pedigree, isLoading: isPedigreeLoading } = useQuery(
    ['pedigree', id],
    () => dogsApi.getPedigree(id!).then((r) => r.data.pedigree),
    { enabled: !!id }
  );

  const { data: documentsRes } = useQuery(
    ['documents', kennelId, id],
    () => documentsApi.getAll({ kennelId, dogId: id }).then((r) => r.data.documents),
    { enabled: !!kennelId && !!id }
  );

  const { data: tasksRes } = useQuery(
    ['tasks', kennelId],
    () => tasksApi.getAll({ kennelId }).then((r) => r.data.tasks),
    { enabled: !!kennelId }
  );

  const dogTasks = useMemo(() => {
    return (tasksRes || []).filter((t: any) => t.dogId === id);
  }, [tasksRes, id]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const future90 = format(addDays(new Date(), 90), 'yyyy-MM-dd');

  const { data: calendarRes } = useQuery(
    ['calendar', kennelId, id],
    () => calendarApi.getAll({ kennelId, dogId: id, startDate: today, endDate: future90 }).then((r) => r.data.events),
    { enabled: !!kennelId && !!id }
  );

  const { data: nutritionRes } = useQuery(
    ['nutrition', kennelId, id],
    () => nutritionApi.getDogNutritions({ kennelId, dogId: id }).then((r) => r.data.dogNutritions),
    { enabled: !!kennelId && !!id }
  );

  const { data: supplementsRes } = useQuery(
    ['supplements', kennelId, id],
    () => nutritionApi.getSupplements({ kennelId, dogId: id }).then((r) => r.data.supplements),
    { enabled: !!kennelId && !!id }
  );

  const toggleVisibilityMutation = useMutation(
    () => dogsApi.toggleVisibility(id!).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['dog', id]);
        addNotification({ type: 'success', message: 'Visibilidad actualizada' });
      },
    }
  );

  const deleteMutation = useMutation(
    () => dogsApi.delete(id!).then((r) => r.data),
    {
      onSuccess: () => {
        addNotification({ type: 'success', message: 'Perro eliminado' });
        navigate('/dogs');
      },
    }
  );

  const taskStatusMutation = useMutation(
    ({ taskId, status }: { taskId: string; status: string }) =>
      tasksApi.updateStatus(taskId, status as any).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', kennelId]);
        addNotification({ type: 'success', message: 'Estado actualizado' });
      },
    }
  );

  const handleDownloadDocument = async (docId: string, fileName?: string) => {
    try {
      const response = await documentsApi.download(docId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'documento';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      addNotification({ type: 'error', message: 'Error al descargar documento' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="text-center py-12">
        <p className="text-apple-gray-100">Perro no encontrado</p>
      </div>
    );
  }

  const photos = dog.photos || [];
  const lightboxImages = photos.map((p: any) => ({ url: p.url, alt: dog.name }));

  const combinedLitters = [
    ...(dog.fatherLitters || []).map((l: any) => ({ ...l, role: 'Padre' })),
    ...(dog.motherLitters || []).map((l: any) => ({ ...l, role: 'Madre' })),
  ].sort((a: any, b: any) => new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime());

  const upcomingMedical = (dog.medicalRecords || [])
    .filter((r: any) => r.nextDate && new Date(r.nextDate) >= new Date())
    .sort((a: any, b: any) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/dogs" className="p-2 hover:bg-apple-gray rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-section font-display font-semibold text-apple-black">{dog.name}</h1>
            <p className="text-apple-gray-100">
              {dog.breed?.name} • {dog.gender === 'MALE' ? 'Macho' : 'Hembra'}
            </p>
          </div>
        </div>

        {isBreeder && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleVisibilityMutation.mutate()}
              disabled={toggleVisibilityMutation.isLoading}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                dog.visibility === 'PUBLIC' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              )}
            >
              {toggleVisibilityMutation.isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : dog.visibility === 'PUBLIC' ? (
                <><Eye size={18} /> Público</>
              ) : (
                <><EyeOff size={18} /> Privado</>
              )}
            </button>
            <Link
              to={`/reservations/create?dogId=${id}`}
              className="btn-secondary flex items-center gap-2"
            >
              <FileText size={18} />
              Nueva reserva
            </Link>
            <Link
              to={`/tasks/create?dogId=${id}`}
              className="btn-secondary flex items-center gap-2"
            >
              <CheckSquare size={18} />
              Nueva tarea
            </Link>
            <Link to={`/dogs/${id}/edit`} className="btn-secondary flex items-center gap-2">
              <Edit size={18} />
              Editar
            </Link>
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de eliminar este perro?')) deleteMutation.mutate();
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Photo */}
          <div className="bg-white rounded-apple overflow-hidden">
            <div
              className="aspect-square bg-apple-gray cursor-zoom-in"
              onClick={() => photos.length > 0 && setLightboxOpen(true)}
            >
              {photos[activePhoto]?.url ? (
                <img src={photos[activePhoto].url} alt={dog.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PawPrint className="text-apple-gray-300" size={80} />
                </div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {photos.map((photo: any, index: number) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhoto(index)}
                    className={cn(
                      'w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                      activePhoto === index ? 'border-apple-blue' : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-apple p-6">
            <h3 className="text-sm font-medium text-apple-gray-100 uppercase tracking-wide mb-4">
              Información básica
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-apple-blue" />
                <div>
                  <p className="text-sm text-apple-gray-100">Nacimiento</p>
                  <p className="font-medium">{format(new Date(dog.birthDate), 'dd MMMM yyyy', { locale: es })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Heart size={18} className="text-apple-blue" />
                <div>
                  <p className="text-sm text-apple-gray-100">Estado</p>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    dog.status === 'AVAILABLE' && 'bg-green-100 text-green-800',
                    dog.status === 'RESERVED' && 'bg-yellow-100 text-yellow-800',
                    dog.status === 'SOLD' && 'bg-blue-100 text-blue-800',
                    dog.status === 'REPRODUCTIVE' && 'bg-purple-100 text-purple-800',
                    dog.status === 'RETIRED' && 'bg-gray-100 text-gray-800',
                  )}>
                    {statusLabels[dog.status]}
                  </span>
                </div>
              </div>
              {dog.microchip && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-apple-blue" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Microchip</p>
                    <p className="font-medium">{dog.microchip}</p>
                  </div>
                </div>
              )}
              {dog.pedigree && (
                <div className="flex items-center gap-3">
                  <Dna size={18} className="text-apple-blue" />
                  <div>
                    <p className="text-sm text-apple-gray-100">Pedigree</p>
                    <p className="font-medium">{dog.pedigree}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tab value="general" label="General" activeValue={activeTab} onClick={setActiveTab} />
            <Tab value="medical" label="Médico" activeValue={activeTab} onClick={setActiveTab} />
            <Tab value="documents" label="Documentos" activeValue={activeTab} onClick={setActiveTab} />
            <Tab value="tasks" label="Tareas" activeValue={activeTab} onClick={setActiveTab} />
            <Tab value="nutrition" label="Nutrición" activeValue={activeTab} onClick={setActiveTab} />
            <Tab value="calendar" label="Calendario" activeValue={activeTab} onClick={setActiveTab} />
          </Tabs>

          {/* General Tab */}
          <TabPanel value="general" activeValue={activeTab}>
            <div className="space-y-6">
              {/* Genealogy */}
              <div className="bg-white rounded-apple p-6">
                <h2 className="text-lg font-medium text-apple-black mb-4 flex items-center gap-2">
                  <Dna size={20} className="text-apple-blue" />
                  Genealogía
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-apple-gray rounded-lg">
                    <p className="text-sm text-apple-gray-100 mb-1">Padre</p>
                    {dog.father ? (
                      <Link to={`/dogs/${dog.father.id}`} className="font-medium text-apple-blue hover:underline">
                        {dog.father.name}
                      </Link>
                    ) : (
                      <p className="text-apple-gray-200">No registrado</p>
                    )}
                  </div>
                  <div className="p-4 bg-apple-gray rounded-lg">
                    <p className="text-sm text-apple-gray-100 mb-1">Madre</p>
                    {dog.mother ? (
                      <Link to={`/dogs/${dog.mother.id}`} className="font-medium text-apple-blue hover:underline">
                        {dog.mother.name}
                      </Link>
                    ) : (
                      <p className="text-apple-gray-200">No registrada</p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-apple-gray-100 uppercase tracking-wide mb-3">
                    Árbol genealógico
                  </h3>
                  {isPedigreeLoading ? (
                    <div className="card p-8"><div className="skeleton h-64 rounded-xl" /></div>
                  ) : (
                    <PedigreeTree pedigree={pedigree} />
                  )}
                </div>
              </div>

              {/* Litters */}
              <div className="bg-white rounded-apple p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-apple-black">Camadas</h2>
                  {isBreeder && (
                    <Link
                      to={`/litters/create?${dog.gender === 'FEMALE' ? 'motherId' : 'fatherId'}=${dog.id}`}
                      className="btn-primary text-sm flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Registrar camada
                    </Link>
                  )}
                </div>
                {combinedLitters.length > 0 ? (
                  <div className="space-y-3">
                    {combinedLitters.map((litter: any) => (
                      <Link
                        key={litter.id}
                        to={`/litters/${litter.id}`}
                        className="flex items-center justify-between p-4 bg-apple-gray rounded-lg hover:bg-apple-gray-300/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium">
                            Camada del {format(new Date(litter.birthDate), 'dd MMM yyyy', { locale: es })}
                          </p>
                          <p className="text-sm text-apple-gray-100">
                            {litter.role} • {litter.puppyCount} cachoros
                            {litter.role === 'Madre' && litter.father ? ` • Padre: ${litter.father.name}` : ''}
                            {litter.role === 'Padre' && litter.mother ? ` • Madre: ${litter.mother.name}` : ''}
                          </p>
                        </div>
                        <span className="text-sm text-apple-blue font-medium">Ver →</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-apple-gray-100 text-center py-8">Este perro no ha participado en ninguna camada.</p>
                )}
              </div>

              {/* Reservations */}
              {isBreeder && dog.reservations?.length > 0 && (
                <div className="bg-white rounded-apple p-6">
                  <h2 className="text-lg font-medium text-apple-black mb-4">Reservas</h2>
                  <div className="space-y-3">
                    {dog.reservations.map((reservation: any) => (
                      <div key={reservation.id} className="flex items-center justify-between p-4 bg-apple-gray rounded-lg">
                        <div>
                          <p className="font-medium">
                            {reservation.customer?.firstName} {reservation.customer?.lastName}
                          </p>
                          <p className="text-sm text-apple-gray-100">
                            {format(new Date(reservation.createdAt), 'dd MMM yyyy', { locale: es })}
                          </p>
                        </div>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          reservation.status === 'PENDING' && 'bg-yellow-100 text-yellow-800',
                          reservation.status === 'CONFIRMED' && 'bg-green-100 text-green-800',
                          reservation.status === 'COMPLETED' && 'bg-blue-100 text-blue-800',
                          reservation.status === 'CANCELLED' && 'bg-red-100 text-red-800',
                        )}>
                          {reservation.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              {isBreeder && dog.internalNotes && (
                <div className="bg-yellow-50 rounded-apple p-6 border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <AlertTriangle size={18} />
                    <h3 className="font-medium">Notas internas</h3>
                  </div>
                  <p className="text-yellow-900">{dog.internalNotes}</p>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Medical Tab */}
          <TabPanel value="medical" activeValue={activeTab}>
            <div className="bg-white rounded-apple p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-apple-black flex items-center gap-2">
                  <Stethoscope size={20} className="text-apple-blue" />
                  Historial médico completo
                </h2>
                {isVet && (
                  <Link to={`/vet/records/create?dogId=${id}`} className="btn-primary text-sm">
                    Agregar registro
                  </Link>
                )}
              </div>
              {dog.medicalRecords?.length ? (
                <div className="space-y-3">
                  {dog.medicalRecords.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-apple-gray rounded-lg">
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-apple-gray-100">
                          {format(new Date(record.date), 'dd MMM yyyy', { locale: es })}
                          {record.vet?.user && ` • Dr. ${record.vet.user.lastName}`}
                        </p>
                      </div>
                      {record.nextDate ? (
                        <span className="text-sm text-apple-gray-200">
                          Próxima: {format(new Date(record.nextDate), 'dd MMM yyyy', { locale: es })}
                        </span>
                      ) : (
                        <span className="text-sm text-apple-gray-300">Sin fecha siguiente</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-apple-gray-100 text-center py-8">No hay registros médicos</p>
              )}
            </div>

            {upcomingMedical.length > 0 && (
              <div className="bg-white rounded-apple p-6 mt-6">
                <h2 className="text-lg font-medium text-apple-black mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-apple-blue" />
                  Próximos controles médicos
                </h2>
                <div className="space-y-3">
                  {upcomingMedical.map((record: any) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-apple-gray rounded-lg">
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-apple-gray-100">
                          {format(new Date(record.date), 'dd MMM yyyy', { locale: es })}
                          {record.vet?.user && ` • Dr. ${record.vet.user.lastName}`}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-apple-blue">
                        Próxima: {format(new Date(record.nextDate), 'dd MMM yyyy', { locale: es })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabPanel>

          {/* Documents Tab */}
          <TabPanel value="documents" activeValue={activeTab}>
            <div className="bg-white rounded-apple p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-apple-black flex items-center gap-2">
                  <FileText size={20} className="text-apple-blue" />
                  Documentos
                </h2>
                {isBreeder && (
                  <Link to={`/documents?dogId=${id}`} className="btn-primary text-sm">
                    Ver todos
                  </Link>
                )}
              </div>
              {documentsRes?.length ? (
                <div className="space-y-3">
                  {documentsRes.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-apple-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-apple-gray-300/50">
                          <FileText size={18} className="text-apple-gray-200" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-apple-gray-100">
                            {docTypeLabels[doc.type] || doc.type}
                            {doc.issuedDate && ` • ${format(new Date(doc.issuedDate), 'dd MMM yyyy', { locale: es })}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(doc.id, doc.fileName || doc.name)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-apple-blue"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-apple-gray-100 text-center py-8">No hay documentos adjuntos</p>
              )}
            </div>
          </TabPanel>

          {/* Tasks Tab */}
          <TabPanel value="tasks" activeValue={activeTab}>
            <div className="bg-white rounded-apple p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-apple-black flex items-center gap-2">
                  <CheckSquare size={20} className="text-apple-blue" />
                  Tareas asignadas
                </h2>
                {isBreeder && (
                  <Link to={`/tasks/create?dogId=${id}`} className="btn-primary text-sm flex items-center gap-1">
                    <Plus size={16} />
                    Nueva tarea
                  </Link>
                )}
              </div>
              {dogTasks.length ? (
                <div className="space-y-3">
                  {dogTasks.map((task: any) => (
                    <div key={task.id} className="flex items-start justify-between p-4 bg-apple-gray rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-apple-gray-100">
                          {task.dueDate ? `Vence: ${format(new Date(task.dueDate), 'dd MMM yyyy', { locale: es })}` : 'Sin fecha límite'}
                          {task.assignee ? ` • Asignado: ${task.assignee.firstName} ${task.assignee.lastName}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium border',
                            task.priority === 'HIGH' && 'bg-red-100 text-red-700 border-red-200',
                            task.priority === 'MEDIUM' && 'bg-amber-100 text-amber-700 border-amber-200',
                            task.priority === 'LOW' && 'bg-green-100 text-green-700 border-green-200',
                          )}>
                            {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                          </span>
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', taskStatusColors[task.status])}>
                            {taskStatusLabels[task.status]}
                          </span>
                        </div>
                      </div>
                      {isBreeder && (
                        <button
                          onClick={() =>
                            taskStatusMutation.mutate({
                              taskId: task.id,
                              status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
                            })
                          }
                          disabled={taskStatusMutation.isLoading}
                          className="p-2 rounded-lg hover:bg-white transition-colors"
                          title={task.status === 'COMPLETED' ? 'Marcar pendiente' : 'Marcar completada'}
                        >
                          {task.status === 'COMPLETED' ? (
                            <XCircle size={20} className="text-apple-gray-200" />
                          ) : (
                            <CheckCircle2 size={20} className="text-green-600" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-apple-gray-100 text-center py-8">No hay tareas asignadas a este perro</p>
              )}
            </div>
          </TabPanel>

          {/* Nutrition Tab */}
          <TabPanel value="nutrition" activeValue={activeTab}>
            <div className="space-y-6">
              {/* Diet Plans */}
              <div className="bg-white rounded-apple p-6">
                <h2 className="text-lg font-medium text-apple-black mb-4 flex items-center gap-2">
                  <Apple size={20} className="text-apple-blue" />
                  Planes de alimentación
                </h2>
                {nutritionRes?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nutritionRes.map((plan: any) => (
                      <div key={plan.id} className="p-4 bg-apple-gray rounded-lg">
                        <p className="font-medium">{plan.plan?.name || 'Plan personalizado'}</p>
                        <p className="text-sm text-apple-gray-100">
                          Inicio: {format(new Date(plan.startDate), 'dd MMM yyyy', { locale: es })}
                        </p>
                        <p className="text-sm text-apple-gray-200 mt-1">
                          Peso actual: {plan.currentWeightKg} kg
                        </p>
                        {plan.notes && (
                          <p className="text-sm text-apple-gray-300 mt-2 italic">{plan.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-apple-gray-100 text-center py-8">No hay planes de alimentación registrados</p>
                )}
              </div>

              {/* Supplements */}
              <div className="bg-white rounded-apple p-6">
                <h2 className="text-lg font-medium text-apple-black mb-4 flex items-center gap-2">
                  <Pill size={20} className="text-apple-blue" />
                  Suplementos
                </h2>
                {supplementsRes?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supplementsRes.map((sup: any) => (
                      <div key={sup.id} className="p-4 bg-apple-gray rounded-lg">
                        <p className="font-medium">{sup.name}</p>
                        <p className="text-sm text-apple-gray-100">
                          {sup.dosage} • {sup.frequency}
                        </p>
                        <p className="text-sm text-apple-gray-200 mt-1">
                          Desde {format(new Date(sup.startDate), 'dd MMM yyyy', { locale: es })}
                          {sup.endDate && ` hasta ${format(new Date(sup.endDate), 'dd MMM yyyy', { locale: es })}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-apple-gray-100 text-center py-8">No hay suplementos registrados</p>
                )}
              </div>
            </div>
          </TabPanel>

          {/* Calendar Tab */}
          <TabPanel value="calendar" activeValue={activeTab}>
            <div className="bg-white rounded-apple p-6">
              <h2 className="text-lg font-medium text-apple-black mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-apple-blue" />
                Eventos próximos (90 días)
              </h2>
              {calendarRes?.length ? (
                <div className="space-y-3">
                  {calendarRes
                    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((evt: any) => (
                      <div key={evt.id} className="flex items-start justify-between p-4 bg-apple-gray rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className={cn('w-3 h-3 rounded-full mt-1.5', eventTypeColors[evt.type] || 'bg-gray-400')} />
                          <div>
                            <p className="font-medium">{evt.title}</p>
                            <p className="text-sm text-apple-gray-100">
                              {format(new Date(evt.date), 'dd MMM yyyy', { locale: es })}
                              {evt.location && ` • ${evt.location}`}
                            </p>
                          </div>
                        </div>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          evt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          evt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        )}>
                          {evt.status === 'COMPLETED' ? 'Completado' :
                           evt.status === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-apple-gray-100 text-center py-8">No hay eventos próximos</p>
              )}
            </div>
          </TabPanel>
        </div>
      </div>

      <ImageLightbox
        images={lightboxImages}
        currentIndex={activePhoto}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setActivePhoto((p) => Math.max(0, p - 1))}
        onNext={() => setActivePhoto((p) => Math.min(photos.length - 1, p + 1))}
      />
    </div>
  );
}
