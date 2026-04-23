import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { clientReportApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

const severityLabels: Record<string, string> = {
  MILD: 'Leve',
  MODERATE: 'Moderada',
  SEVERE: 'Grave',
  LIFE_THREATENING: 'Vital',
};

const severityColors: Record<string, string> = {
  MILD: 'bg-yellow-100 text-yellow-700',
  MODERATE: 'bg-orange-100 text-orange-700',
  SEVERE: 'bg-red-100 text-red-700',
  LIFE_THREATENING: 'bg-red-200 text-red-800',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Borrador',
  FINALIZED: 'Finalizado',
  SENT: 'Enviado',
};

export function ClientReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [isPrinting, setIsPrinting] = useState(false);

  const { data: reportData, isLoading } = useQuery(
    ['client-report', id],
    () => clientReportApi.getById(id!).then((r) => r.data.report),
    { enabled: !!id }
  );

  const finalizeMutation = useMutation(
    () => clientReportApi.finalize(id!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['client-report', id]);
        addNotification({ type: 'success', message: 'Informe finalizado' });
      },
    }
  );

  const report = reportData;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-96 w-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="card p-12 text-center">
        <h3 className="text-lg font-semibold text-apple-black mb-2">Informe no encontrado</h3>
        <Link to="/reports/client" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Actions bar - hidden on print */}
      <div className="no-print flex items-center justify-between mb-6">
        <Link
          to="/reports/client"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </Link>
        <div className="flex items-center gap-2">
          {isBreeder && report.status === 'DRAFT' && (
            <button
              onClick={() => finalizeMutation.mutate()}
              disabled={finalizeMutation.isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle size={18} />
              {finalizeMutation.isLoading ? 'Finalizando...' : 'Finalizar informe'}
            </button>
          )}
          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center gap-2"
          >
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </div>

      {/* Report Document */}
      <div className={cn('bg-white rounded-2xl shadow-sm border border-apple-gray-100 overflow-hidden', isPrinting && 'shadow-none border-none')}>
        {/* Header */}
        <div className="p-8 border-b border-apple-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-apple-black mb-1">{report.title}</h1>
              <p className="text-apple-gray-200">
                Generado el {format(new Date(report.generatedAt), 'dd/MM/yyyy')}
              </p>
            </div>
            <div className="text-right">
              {report.kennel?.logoUrl && (
                <img src={report.kennel.logoUrl} alt={report.kennel.name} className="h-16 object-contain mb-2 ml-auto" />
              )}
              <p className="font-semibold text-apple-black">{report.kennel?.name}</p>
              <p className="text-sm text-apple-gray-200">{report.kennel?.city}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium',
              report.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
              report.status === 'FINALIZED' ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'
            )}>
              {statusLabels[report.status]}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Dog Info */}
          <section>
            <h2 className="text-lg font-semibold text-apple-black mb-4 pb-2 border-b border-apple-gray-100">
              Datos del cachorro
            </h2>
            <div className="flex items-start gap-6">
              {report.dog?.photos?.[0]?.url ? (
                <img src={report.dog.photos[0].url} alt={report.dog.name} className="w-32 h-32 rounded-xl object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-apple-gray flex items-center justify-center text-4xl text-apple-gray-200 font-medium">
                  {report.dog?.name?.[0]}
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-xs text-apple-gray-200 uppercase tracking-wide">Nombre</p>
                  <p className="font-medium text-apple-black">{report.dog?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-apple-gray-200 uppercase tracking-wide">Raza</p>
                  <p className="font-medium text-apple-black">{report.dog?.breed?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-apple-gray-200 uppercase tracking-wide">Fecha de nacimiento</p>
                  <p className="font-medium text-apple-black">
                    {report.dog?.birthDate ? format(new Date(report.dog.birthDate), 'dd/MM/yyyy') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-apple-gray-200 uppercase tracking-wide">Microchip</p>
                  <p className="font-medium text-apple-black">{report.dog?.microchip || '-'}</p>
                </div>
                {report.dog?.father && (
                  <div>
                    <p className="text-xs text-apple-gray-200 uppercase tracking-wide">Padre</p>
                    <p className="font-medium text-apple-black">{report.dog.father.name}</p>
                  </div>
                )}
                {report.dog?.mother && (
                  <div>
                    <p className="text-xs text-apple-gray-200 uppercase tracking-wide">Madre</p>
                    <p className="font-medium text-apple-black">{report.dog.mother.name}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Nutrition */}
          <section>
            <h2 className="text-lg font-semibold text-apple-black mb-4 pb-2 border-b border-apple-gray-100">
              Historial de alimentación
            </h2>
            {report.dog?.dogNutritions?.length > 0 ? (
              <div className="space-y-4">
                {report.dog.dogNutritions.map((diet: any) => (
                  <div key={diet.id} className="p-4 bg-apple-gray rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-apple-gray-200">Plan</p>
                        <p className="font-medium">{diet.plan?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-apple-gray-200">Tipo</p>
                        <p className="font-medium">{diet.plan?.dietType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-apple-gray-200">Ración</p>
                        <p className="font-medium">{diet.plan?.dailyGramsPerKg}g/kg</p>
                      </div>
                      {diet.recipe && (
                        <div>
                          <p className="text-xs text-apple-gray-200">Receta</p>
                          <p className="font-medium">{diet.recipe.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-apple-gray-200">No hay planes nutricionales activos registrados</p>
            )}
          </section>

          {/* Supplements */}
          {report.dog?.supplements?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-apple-black mb-4 pb-2 border-b border-apple-gray-100">
                Suplementación
              </h2>
              <div className="space-y-2">
                {report.dog.supplements.map((supp: any) => (
                  <div key={supp.id} className="flex items-center justify-between p-3 bg-apple-gray rounded-lg">
                    <div>
                      <p className="font-medium">{supp.name}</p>
                      <p className="text-sm text-apple-gray-200">{supp.dosage} — {supp.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Intolerances */}
          {report.dog?.foodIntolerances?.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-apple-black mb-4 pb-2 border-b border-apple-gray-100">
                Intolerancias registradas
              </h2>
              <div className="space-y-2">
                {report.dog.foodIntolerances.map((intol: any) => (
                  <div key={intol.id} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium', severityColors[intol.severity])}>
                        {severityLabels[intol.severity]}
                      </span>
                      <span className="font-medium">{intol.foodName}</span>
                    </div>
                    {intol.symptoms && (
                      <p className="text-sm text-red-700">{intol.symptoms}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {report.notes && (
            <section>
              <h2 className="text-lg font-semibold text-apple-black mb-4 pb-2 border-b border-apple-gray-100">
                Notas adicionales
              </h2>
              <p className="text-apple-black whitespace-pre-wrap">{report.notes}</p>
            </section>
          )}

          {/* Recommendations */}
          {report.recommendations && (
            <section>
              <h2 className="text-lg font-semibold text-apple-black mb-4 pb-2 border-b border-apple-gray-100">
                Recomendaciones personalizadas
              </h2>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-apple-black whitespace-pre-wrap leading-relaxed">{report.recommendations}</p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-apple-gray-100 bg-apple-gray">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-apple-black">{report.kennel?.name}</p>
              <p className="text-sm text-apple-gray-200">{report.kennel?.address}, {report.kennel?.city}</p>
            </div>
            <div className="text-right">
              {report.kennel?.phone && <p className="text-sm text-apple-gray-200">{report.kennel.phone}</p>}
              {report.kennel?.email && <p className="text-sm text-apple-gray-200">{report.kennel.email}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .animate-fade-in > div:last-child {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
