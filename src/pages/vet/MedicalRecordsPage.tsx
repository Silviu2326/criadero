import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { medicalApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Plus, Stethoscope, Calendar, Paperclip, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const recordTypes: Record<string, string> = {
  VACCINE: 'Vacuna',
  DEWORMING: 'Desparasitación',
  CONSULTATION: 'Consulta',
  EXAM: 'Examen',
  SURGERY: 'Cirugía',
  OTHER: 'Otro',
};

export function MedicalRecordsPage() {
  const { dogId } = useParams<{ dogId?: string }>();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const isVet = user?.role === 'VETERINARIAN' || user?.role === 'MANAGER';

  const { data: records } = useQuery(
    ['medicalRecords', dogId],
    () => medicalApi.getByDog(dogId!).then((r) => r.data.records),
    { enabled: !!dogId }
  );

  const deleteMutation = useMutation(
    (id: string) => medicalApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['medicalRecords', dogId]);
        addNotification({ type: 'success', message: 'Registro eliminado' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar el registro' });
      },
    }
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            Historial Médico
          </h1>
          <p className="text-apple-gray-100 mt-1">
            Registros médicos del perro
          </p>
        </div>
        {isVet && dogId && (
          <Link
            to={`/vet/records/create?dogId=${dogId}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Nuevo registro
          </Link>
        )}
      </div>

      <div className="bg-white rounded-apple overflow-hidden">
        {records?.length ? (
          <div className="divide-y divide-apple-gray-300/50">
            {records.map((record: any) => (
              <div key={record.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-apple-blue/10 rounded-apple">
                    <Stethoscope className="text-apple-blue" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-apple-black">
                        {recordTypes[record.type]}
                      </h3>
                      <span className="text-sm text-apple-gray-100">
                        {format(new Date(record.date), 'dd MMMM yyyy', { locale: es })}
                      </span>
                    </div>
                    <p className="text-apple-gray-200 mb-2">{record.description}</p>
                    {record.vaccineName && (
                      <p className="text-sm text-apple-gray-100">
                        Vacuna: {record.vaccineName} {record.vaccineLab && `(${record.vaccineLab})`}
                      </p>
                    )}
                    {record.nextDate && (
                      <p className="text-sm text-yellow-600 mt-2 flex items-center gap-1">
                        <Calendar size={14} />
                        Próxima dosis: {format(new Date(record.nextDate), 'dd MMM yyyy', { locale: es })}
                      </p>
                    )}
                    {record.attachmentUrl && (
                      <a
                        href={record.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm text-apple-blue hover:underline"
                      >
                        <Paperclip size={14} />
                        Ver adjunto
                      </a>
                    )}
                  </div>
                  {isVet && (
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este registro médico?')) {
                          deleteMutation.mutate(record.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Stethoscope className="mx-auto text-apple-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-apple-black mb-2">
              No hay registros
            </h3>
            <p className="text-apple-gray-100">
              Comienza agregando el primer registro médico
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
