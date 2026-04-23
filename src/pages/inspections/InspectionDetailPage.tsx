import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { inspectionsApi } from '@/services/api';
import { useUIStore } from '@/store/uiStore';
import { Inspection, InspectionStatus, InspectionResult } from '@/types';
import { cn } from '@/utils/cn';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Save,
  Loader2,
} from 'lucide-react';

const statusConfig: Record<InspectionStatus, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: 'Programada', color: 'text-slate-600', bg: 'bg-slate-100' },
  IN_PROGRESS: { label: 'En curso', color: 'text-blue-600', bg: 'bg-blue-100' },
  COMPLETED: { label: 'Completada', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  CANCELLED: { label: 'Cancelada', color: 'text-red-600', bg: 'bg-red-100' },
};

const resultConfig: Record<InspectionResult, { label: string; color: string; bg: string; border: string }> = {
  PASS: { label: 'APROBADA', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  CONDITIONAL: { label: 'CONDICIONAL', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  FAIL: { label: 'NO APROBADA', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  LOW: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Baja' },
  MEDIUM: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Media' },
  HIGH: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'Alta' },
  CRITICAL: { color: 'text-red-700', bg: 'bg-red-100', label: 'Critica' },
};

export function InspectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();
  const [activeTab, setActiveTab] = useState<'checklist' | 'evaluations' | 'findings'>('checklist');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeForm, setCompleteForm] = useState({ overallResult: 'PASS' as InspectionResult, overallNotes: '' });
  const [findingForm, setFindingForm] = useState({ severity: 'MEDIUM', category: 'HEALTH', description: '', correctiveAction: '' });
  const [showFindingForm, setShowFindingForm] = useState(false);

  const { data, isLoading } = useQuery(
    ['inspection', id],
    () => inspectionsApi.getById(id!).then((r) => r.data.inspection as Inspection),
    { enabled: !!id }
  );

  const { data: contextData } = useQuery(
    ['inspectionContext', id],
    () => inspectionsApi.getContext(id!).then((r) => r.data),
    { enabled: !!id }
  );

  const inspection = data;
  const context = contextData?.context;

  const startMutation = useMutation(() => inspectionsApi.start(id!).then((r) => r.data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['inspection', id]);
      addNotification({ type: 'success', message: 'Inspeccion iniciada' });
    },
    onError: () => addNotification({ type: 'error', message: 'Error al iniciar' }),
  });

  const completeMutation = useMutation(
    () => inspectionsApi.complete(id!, completeForm).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inspection', id]);
        setShowCompleteModal(false);
        addNotification({ type: 'success', message: 'Inspeccion completada' });
      },
      onError: () => addNotification({ type: 'error', message: 'Error al completar' }),
    }
  );

  const cancelMutation = useMutation(() => inspectionsApi.cancel(id!).then((r) => r.data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['inspection', id]);
      addNotification({ type: 'success', message: 'Inspeccion cancelada' });
    },
    onError: () => addNotification({ type: 'error', message: 'Error al cancelar' }),
  });

  const checklistMutation = useMutation(
    ({ itemId, data }: { itemId: string; data: any }) =>
      inspectionsApi.updateChecklistItem(id!, itemId, data).then((r) => r.data),
    {
      onSuccess: () => queryClient.invalidateQueries(['inspection', id]),
    }
  );

  const findingMutation = useMutation(
    () => inspectionsApi.createFinding(id!, findingForm).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inspection', id]);
        setShowFindingForm(false);
        setFindingForm({ severity: 'MEDIUM', category: 'HEALTH', description: '', correctiveAction: '' });
        addNotification({ type: 'success', message: 'Hallazgo registrado' });
      },
      onError: () => addNotification({ type: 'error', message: 'Error al registrar hallazgo' }),
    }
  );

  const deleteFindingMutation = useMutation(
    (findingId: string) => inspectionsApi.deleteFinding(id!, findingId).then((r) => r.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inspection', id]);
        addNotification({ type: 'success', message: 'Hallazgo eliminado' });
      },
    }
  );

  if (isLoading || !inspection) {
    return (
      <div className="animate-fade-in">
        <div className="skeleton h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-96" />
          <div className="skeleton h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  const statusCfg = statusConfig[inspection.status];
  const isEditable = inspection.status === 'IN_PROGRESS';

  const categories = [...new Set(inspection.checklistItems.map((i) => i.category))];

  const toggleCategory = (cat: string) => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCategories(next);
  };

  const handleChecklistChange = (itemId: string, result: string) => {
    checklistMutation.mutate({ itemId, data: { result } });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate('/inspections')} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </button>
          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', statusCfg.bg, statusCfg.color)}>
            {statusCfg.label}
          </span>
          {inspection.overallResult && (
            <span className={cn('px-3 py-1 rounded-full text-xs font-bold border', resultConfig[inspection.overallResult].bg, resultConfig[inspection.overallResult].color, resultConfig[inspection.overallResult].border)}>
              {resultConfig[inspection.overallResult].label}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-apple-black">{inspection.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-apple-gray-100">
          <span className="flex items-center gap-1"><ClipboardCheck size={14} /> {inspection.type}</span>
          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(inspection.scheduledDate).toLocaleDateString('es-ES')}</span>
          <span className="flex items-center gap-1"><User size={14} /> {inspection.inspector?.firstName} {inspection.inspector?.lastName}</span>
          {inspection.overallScore !== null && (
            <span className="font-semibold text-apple-black">Score: {inspection.overallScore}/100</span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      {inspection.status !== 'COMPLETED' && inspection.status !== 'CANCELLED' && (
        <div className="flex items-center gap-3 mb-6">
          {inspection.status === 'SCHEDULED' && (
            <button onClick={() => startMutation.mutate()} className="btn-primary" disabled={startMutation.isLoading}>
              {startMutation.isLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
              Iniciar Inspeccion
            </button>
          )}
          {inspection.status === 'IN_PROGRESS' && (
            <>
              <button onClick={() => setShowCompleteModal(true)} className="btn-primary">
                <CheckCircle size={18} />
                Completar
              </button>
              <button onClick={() => cancelMutation.mutate()} className="btn-outline text-red-600 border-red-200 hover:bg-red-50" disabled={cancelMutation.isLoading}>
                <XCircle size={18} />
                Cancelar
              </button>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Context */}
        <div className="space-y-4">
          {/* Dog Context */}
          {inspection.dog && (
            <div className="card p-4">
              <h3 className="font-semibold text-sm text-apple-black mb-3">Perro evaluado</h3>
              <div className="flex items-center gap-3">
                {inspection.dog.photos?.[0]?.url ? (
                  <img src={inspection.dog.photos[0].url} alt={inspection.dog.name} className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-apple-gray flex items-center justify-center">
                    <User size={24} className="text-apple-gray-200" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-apple-black">{inspection.dog.name}</p>
                  <p className="text-xs text-apple-gray-100">{inspection.dog.breedId}</p>
                  <p className="text-xs text-apple-gray-100">{new Date(inspection.dog.birthDate).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
              {context?.dogMedicalSummary && (
                <div className="mt-3 pt-3 border-t border-apple-gray-300/50">
                  <p className="text-xs text-apple-gray-100 mb-1">Registros medicos: {context.dogMedicalSummary.totalRecords}</p>
                  {context.dogMedicalSummary.upcomingVaccines?.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertTriangle size={12} />
                      Proxima vacuna: {new Date(context.dogMedicalSummary.upcomingVaccines[0].nextDate!).toLocaleDateString('es-ES')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Litter Context */}
          {inspection.litter && (
            <div className="card p-4">
              <h3 className="font-semibold text-sm text-apple-black mb-3">Camada</h3>
              <p className="text-sm text-apple-gray-200">Nacimiento: {new Date(inspection.litter.birthDate).toLocaleDateString('es-ES')}</p>
              <p className="text-sm text-apple-gray-200">Cachorros: {inspection.litter.puppyCount}</p>
              {context?.puppies && (
                <p className="text-sm text-apple-gray-200 mt-1">Registrados: {context.puppies.length}</p>
              )}
            </div>
          )}

          {/* Financial Context */}
          {context?.financialSummary && (
            <div className="card p-4">
              <h3 className="font-semibold text-sm text-apple-black mb-3">Resumen Financiero</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-apple-gray-100">Ingresos:</span><span className="font-semibold text-emerald-600">${context.financialSummary.totalIncome?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-apple-gray-100">Gastos:</span><span className="font-semibold text-red-600">${context.financialSummary.totalExpense?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-apple-gray-100">Facturas pendientes:</span><span className="font-semibold">{context.financialSummary.pendingInvoices}</span></div>
              </div>
            </div>
          )}

          {/* Kennel Context for Facility/Welfare */}
          {context?.dogsInKennel && (
            <div className="card p-4">
              <h3 className="font-semibold text-sm text-apple-black mb-3">Perros en criadero</h3>
              <p className="text-2xl font-bold text-apple-black mb-2">{context.kennelStats?.totalDogs}</p>
              {context.recentMedicalAlerts?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-apple-gray-300/50">
                  <p className="text-xs text-amber-600 font-medium mb-1">Alertas proximas:</p>
                  {context.recentMedicalAlerts.slice(0, 3).map((alert: any) => (
                    <p key={alert.id} className="text-xs text-apple-gray-100">{alert.dog?.name} - {new Date(alert.nextDate).toLocaleDateString('es-ES')}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center + Right Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-apple-gray rounded-xl p-1">
            {[
              { key: 'checklist', label: `Checklist (${inspection.checklistItems.length})` },
              { key: 'evaluations', label: `Evaluaciones (${inspection.dogEvaluations.length})` },
              { key: 'findings', label: `Hallazgos (${inspection.findings.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.key ? 'bg-white shadow-sm text-apple-black' : 'text-apple-gray-100 hover:text-apple-black'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              {categories.map((category) => {
                const items = inspection.checklistItems.filter((i) => i.category === category);
                const isExpanded = expandedCategories.has(category) || inspection.status === 'IN_PROGRESS';
                const passedCount = items.filter((i) => i.result === 'PASS').length;
                const totalCount = items.length;

                return (
                  <div key={category} className="card overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 hover:bg-apple-gray/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-apple-black">{category}</span>
                        <span className="text-xs text-apple-gray-100 bg-apple-gray px-2 py-0.5 rounded-full">
                          {passedCount}/{totalCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp size={18} className="text-apple-gray-100" /> : <ChevronDown size={18} className="text-apple-gray-100" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-apple-gray-300/50 divide-y divide-apple-gray-300/30">
                        {items.map((item) => (
                          <div key={item.id} className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={cn('text-sm', item.isCritical ? 'font-semibold text-apple-black' : 'text-apple-gray-200')}>
                                    {item.itemText}
                                  </p>
                                  {item.isCritical && (
                                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">CRITICO</span>
                                  )}
                                </div>
                                {isEditable && (
                                  <div className="flex items-center gap-2 mt-2">
                                    {(['PASS', 'FAIL', 'N/A'] as const).map((res) => (
                                      <button
                                        key={res}
                                        onClick={() => handleChecklistChange(item.id, res)}
                                        className={cn(
                                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                                          item.result === res
                                            ? res === 'PASS'
                                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                              : res === 'FAIL'
                                              ? 'bg-red-50 border-red-300 text-red-700'
                                              : 'bg-slate-50 border-slate-300 text-slate-700'
                                            : 'bg-white border-apple-gray-300 text-apple-gray-100 hover:bg-apple-gray'
                                        )}
                                      >
                                        {res === 'PASS' ? 'Cumple' : res === 'FAIL' ? 'No cumple' : 'N/A'}
                                      </button>
                                    ))}
                                  </div>
                                )}
                                {!isEditable && item.result && (
                                  <span className={cn(
                                    'inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium',
                                    item.result === 'PASS' ? 'bg-emerald-100 text-emerald-700' : item.result === 'FAIL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                  )}>
                                    {item.result === 'PASS' ? 'Cumple' : item.result === 'FAIL' ? 'No cumple' : 'N/A'}
                                  </span>
                                )}
                                {item.notes && (
                                  <p className="text-xs text-apple-gray-100 mt-1">{item.notes}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Evaluations Tab */}
          {activeTab === 'evaluations' && (
            <div className="space-y-3">
              {inspection.dogEvaluations.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-apple-gray-100">No hay evaluaciones registradas</p>
                </div>
              ) : (
                inspection.dogEvaluations.map((evalItem) => (
                  <div key={evalItem.id} className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-apple-black">{evalItem.dog?.name}</span>
                        {evalItem.needsFollowUp && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Seguimiento</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {evalItem.bodyCondition && <div><span className="text-apple-gray-100">Condicion:</span> <span className="font-medium">{evalItem.bodyCondition}</span></div>}
                      {evalItem.coatCondition && <div><span className="text-apple-gray-100">Pelaje:</span> <span className="font-medium">{evalItem.coatCondition}</span></div>}
                      {evalItem.behavior && <div><span className="text-apple-gray-100">Comportamiento:</span> <span className="font-medium">{evalItem.behavior}</span></div>}
                      {evalItem.weight && <div><span className="text-apple-gray-100">Peso:</span> <span className="font-medium">{evalItem.weight}kg</span></div>}
                      {evalItem.temperature && <div><span className="text-apple-gray-100">Temp:</span> <span className="font-medium">{evalItem.temperature}C</span></div>}
                    </div>
                    {evalItem.observations && <p className="text-sm text-apple-gray-200 mt-2">{evalItem.observations}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Findings Tab */}
          {activeTab === 'findings' && (
            <div className="space-y-3">
              {isEditable && (
                <button
                  onClick={() => setShowFindingForm(!showFindingForm)}
                  className="w-full card p-3 flex items-center justify-center gap-2 text-sm font-medium text-apple-blue hover:bg-apple-gray transition-colors"
                >
                  <Plus size={16} />
                  Nuevo hallazgo
                </button>
              )}

              {showFindingForm && (
                <div className="card p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-apple-gray-100">Severidad</label>
                      <select
                        value={findingForm.severity}
                        onChange={(e) => setFindingForm({ ...findingForm, severity: e.target.value })}
                        className="input-apple w-full mt-1"
                      >
                        <option value="LOW">Baja</option>
                        <option value="MEDIUM">Media</option>
                        <option value="HIGH">Alta</option>
                        <option value="CRITICAL">Critica</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-apple-gray-100">Categoria</label>
                      <select
                        value={findingForm.category}
                        onChange={(e) => setFindingForm({ ...findingForm, category: e.target.value })}
                        className="input-apple w-full mt-1"
                      >
                        <option value="HEALTH">Salud</option>
                        <option value="DOCUMENTATION">Documentacion</option>
                        <option value="FACILITY">Instalaciones</option>
                        <option value="FINANCIAL">Finanzas</option>
                        <option value="BEHAVIOR">Comportamiento</option>
                        <option value="OTHER">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-apple-gray-100">Descripcion</label>
                    <textarea
                      value={findingForm.description}
                      onChange={(e) => setFindingForm({ ...findingForm, description: e.target.value })}
                      className="input-apple w-full mt-1 h-20 resize-none"
                      placeholder="Describe el hallazgo..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-apple-gray-100">Accion correctiva</label>
                    <input
                      value={findingForm.correctiveAction}
                      onChange={(e) => setFindingForm({ ...findingForm, correctiveAction: e.target.value })}
                      className="input-apple w-full mt-1"
                      placeholder="Que se debe hacer para corregirlo?"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setShowFindingForm(false)} className="btn-ghost text-sm">Cancelar</button>
                    <button onClick={() => findingMutation.mutate()} className="btn-primary text-sm" disabled={findingMutation.isLoading}>
                      {findingMutation.isLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                      Guardar
                    </button>
                  </div>
                </div>
              )}

              {inspection.findings.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-apple-gray-100">No hay hallazgos registrados</p>
                </div>
              ) : (
                inspection.findings.map((finding) => {
                  const sev = severityConfig[finding.severity];
                  return (
                    <div key={finding.id} className="card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('px-2 py-0.5 rounded text-xs font-bold', sev.bg, sev.color)}>{sev.label}</span>
                            <span className="text-xs text-apple-gray-100">{finding.category}</span>
                          </div>
                          <p className="text-sm text-apple-black">{finding.description}</p>
                          {finding.correctiveAction && (
                            <p className="text-xs text-apple-gray-100 mt-1">Accion: {finding.correctiveAction}</p>
                          )}
                        </div>
                        {isEditable && (
                          <button
                            onClick={() => deleteFindingMutation.mutate(finding.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-apple-black mb-4">Completar Inspeccion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-apple-black mb-2">Resultado global</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PASS', 'CONDITIONAL', 'FAIL'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setCompleteForm({ ...completeForm, overallResult: res })}
                      className={cn(
                        'px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all',
                        completeForm.overallResult === res
                          ? res === 'PASS'
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : res === 'CONDITIONAL'
                            ? 'border-amber-400 bg-amber-50 text-amber-700'
                            : 'border-red-400 bg-red-50 text-red-700'
                          : 'border-transparent bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/30'
                      )}
                    >
                      {res === 'PASS' ? 'Aprobada' : res === 'CONDITIONAL' ? 'Condicional' : 'No aprobada'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-apple-black mb-2">Notas finales</label>
                <textarea
                  value={completeForm.overallNotes}
                  onChange={(e) => setCompleteForm({ ...completeForm, overallNotes: e.target.value })}
                  className="input-apple w-full h-24 resize-none"
                  placeholder="Conclusiones de la inspeccion..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowCompleteModal(false)} className="btn-ghost">Cancelar</button>
              <button
                onClick={() => completeMutation.mutate()}
                className="btn-primary"
                disabled={completeMutation.isLoading}
              >
                {completeMutation.isLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
