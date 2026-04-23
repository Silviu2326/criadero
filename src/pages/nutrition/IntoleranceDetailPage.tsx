import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { nutritionApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, AlertTriangle, Plus, Trash2, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
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

export function IntoleranceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [showReactionForm, setShowReactionForm] = useState(false);
  const [reactionForm, setReactionForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    symptoms: '',
    severity: 'MILD',
    notes: '',
  });

  const { data: intoleranceData, isLoading } = useQuery(
    ['nutrition-intolerance', id],
    () => nutritionApi.getIntoleranceById(id!).then((r) => r.data.intolerance),
    { enabled: !!id }
  );

  const createReactionMutation = useMutation(
    () => nutritionApi.createIntoleranceReaction(id!, reactionForm),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-intolerance', id]);
        addNotification({ type: 'success', message: 'Reacción registrada' });
        setShowReactionForm(false);
        setReactionForm({ date: format(new Date(), 'yyyy-MM-dd'), symptoms: '', severity: 'MILD', notes: '' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al registrar' });
      },
    }
  );

  const deleteReactionMutation = useMutation(
    (reactionId: string) => nutritionApi.deleteIntoleranceReaction(reactionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-intolerance', id]);
        addNotification({ type: 'success', message: 'Reacción eliminada' });
      },
    }
  );

  const resolveReactionMutation = useMutation(
    (reactionId: string) => nutritionApi.updateIntoleranceReaction(reactionId, { resolvedAt: new Date().toISOString() }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['nutrition-intolerance', id]);
        addNotification({ type: 'success', message: 'Reacción marcada como resuelta' });
      },
    }
  );

  const intolerance = intoleranceData;

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-32 w-full" />
      </div>
    );
  }

  if (!intolerance) {
    return (
      <div className="card p-12 text-center">
        <h3 className="text-lg font-semibold text-apple-black mb-2">Intolerancia no encontrada</h3>
        <Link to="/nutrition/intolerances" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/nutrition/intolerances"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </Link>
      </div>

      <PageHeader
        title={intolerance.foodName}
        subtitle={`Intolerancia de ${intolerance.dog?.name}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">Detalles</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-apple-gray-200">Perro</span>
                <Link to={`/dogs/${intolerance.dog?.id}`} className="font-medium text-apple-blue hover:underline">
                  {intolerance.dog?.name}
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-apple-gray-200">Severidad</span>
                <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', severityColors[intolerance.severity])}>
                  {severityLabels[intolerance.severity]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-apple-gray-200">Estado</span>
                <span className={cn('font-medium', intolerance.isActive ? 'text-green-600' : 'text-apple-gray-200')}>
                  {intolerance.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              {intolerance.symptoms && (
                <div className="pt-3 border-t border-apple-gray-100">
                  <span className="text-apple-gray-200 block mb-1">Síntomas típicos</span>
                  <p className="text-sm text-apple-black">{intolerance.symptoms}</p>
                </div>
              )}
              {intolerance.notes && (
                <div className="pt-3 border-t border-apple-gray-100">
                  <span className="text-apple-gray-200 block mb-1">Notas</span>
                  <p className="text-sm text-apple-black">{intolerance.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Alert box */}
          <div className="card p-6 border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-red-700 mb-1">Precaución alimentaria</h4>
                <p className="text-sm text-red-600">
                  Este perro tiene una intolerancia registrada a <strong>{intolerance.foodName}</strong>.
                  Verificar siempre los ingredientes antes de asignar alimentación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reactions */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-apple-black">Historial de reacciones</h3>
              {isBreeder && (
                <button
                  onClick={() => setShowReactionForm(!showReactionForm)}
                  className="btn-secondary flex items-center gap-1 text-sm"
                >
                  <Plus size={14} /> Registrar reacción
                </button>
              )}
            </div>

            {showReactionForm && (
              <div className="p-4 bg-apple-gray rounded-lg mb-6 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-apple-black mb-1">Fecha</label>
                    <input
                      type="date"
                      value={reactionForm.date}
                      onChange={(e) => setReactionForm({ ...reactionForm, date: e.target.value })}
                      className="input-apple w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-apple-black mb-1">Severidad</label>
                    <select
                      value={reactionForm.severity}
                      onChange={(e) => setReactionForm({ ...reactionForm, severity: e.target.value })}
                      className="select-apple w-full text-sm"
                    >
                      {Object.entries(severityLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-apple-black mb-1">Síntomas observados</label>
                  <textarea
                    value={reactionForm.symptoms}
                    onChange={(e) => setReactionForm({ ...reactionForm, symptoms: e.target.value })}
                    rows={2}
                    className="input-apple w-full text-sm"
                    placeholder="Describe los síntomas..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-apple-black mb-1">Notas</label>
                  <textarea
                    value={reactionForm.notes}
                    onChange={(e) => setReactionForm({ ...reactionForm, notes: e.target.value })}
                    rows={2}
                    className="input-apple w-full text-sm"
                    placeholder="Notas adicionales..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => createReactionMutation.mutate()}
                    disabled={!reactionForm.symptoms || createReactionMutation.isLoading}
                    className="btn-primary text-sm"
                  >
                    {createReactionMutation.isLoading ? 'Guardando...' : 'Guardar reacción'}
                  </button>
                  <button
                    onClick={() => setShowReactionForm(false)}
                    className="btn-outline text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {intolerance.reactions?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-apple-gray-200">No hay reacciones registradas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {intolerance.reactions.map((reaction: any) => (
                  <div key={reaction.id} className={cn('p-4 rounded-lg border', reaction.resolvedAt ? 'bg-green-50 border-green-200' : 'bg-white border-apple-gray-100')}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium', severityColors[reaction.severity])}>
                            {severityLabels[reaction.severity]}
                          </span>
                          <span className="text-xs text-apple-gray-200">
                            {format(new Date(reaction.date), 'dd/MM/yyyy')}
                          </span>
                          {reaction.resolvedAt && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                              <CheckCircle size={12} /> Resuelta
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-apple-black">{reaction.symptoms}</p>
                        {reaction.notes && (
                          <p className="text-xs text-apple-gray-200 mt-1">{reaction.notes}</p>
                        )}
                      </div>
                      {isBreeder && !reaction.resolvedAt && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => resolveReactionMutation.mutate(reaction.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Marcar como resuelta"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('¿Eliminar esta reacción?')) {
                                deleteReactionMutation.mutate(reaction.id);
                              }
                            }}
                            className="p-2 text-apple-gray-200 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
