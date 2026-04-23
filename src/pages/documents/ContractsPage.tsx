import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Plus,
  FileSignature,
  FileText,
  Trash2,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { documentsApi, dogsApi, customersApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Document, Dog as DogType, Customer } from '@/types';

export function ContractsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const [selectedContract, setSelectedContract] = useState<Document | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const { data: myKennels } = useQuery(
    'myKennelsContracts',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: contracts } = useQuery(
    ['contracts', kennelId],
    () =>
      documentsApi
        .getAll({ kennelId: kennelId!, type: 'CONTRACT' })
        .then((r) => r.data.documents),
    { enabled: !!kennelId }
  );

  const deleteMutation = useMutation(
    (id: string) => documentsApi.delete(id),
    {
      onSuccess: () => queryClient.invalidateQueries('contracts'),
    }
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Contratos"
        subtitle="Genera y gestiona contratos de venta y adopción"
        action={
          isBreeder && (
            <button
              onClick={() => setShowGenerator(true)}
              className="btn-primary"
            >
              <Plus size={18} />
              Generar Contrato
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracts List */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">
              Contratos Generados
            </h3>

            <div className="space-y-3">
              {contracts?.length === 0 ? (
                <div className="text-center py-12">
                  <FileSignature className="mx-auto h-12 w-12 text-apple-gray-100" />
                  <p className="mt-4 text-apple-gray-200">No hay contratos generados</p>
                  <button
                    onClick={() => setShowGenerator(true)}
                    className="mt-4 text-apple-blue hover:underline"
                  >
                    Generar tu primer contrato
                  </button>
                </div>
              ) : (
                contracts?.map((contract: Document) => (
                  <div
                    key={contract.id}
                    className="p-4 rounded-xl border border-apple-gray-300/50 hover:border-apple-blue/50 transition-all cursor-pointer"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <FileSignature className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-apple-black">{contract.name}</h4>
                          <p className="text-sm text-apple-gray-100">
                            {contract.customer
                              ? `${contract.customer.firstName} ${contract.customer.lastName}`
                              : 'Sin cliente asignado'}
                          </p>
                          {contract.dog && (
                            <p className="text-xs text-apple-gray-200 mt-1">
                              Perro: {contract.dog.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-apple-gray-200">
                          {format(parseISO(contract.createdAt), 'dd MMM yyyy', { locale: es })}
                        </span>
                        <ChevronRight size={18} className="text-apple-gray-200" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">Resumen</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-apple-gray/30 rounded-lg">
                <span className="text-apple-gray-200">Total contratos</span>
                <span className="font-semibold text-apple-black">{contracts?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-apple-gray/30 rounded-lg">
                <span className="text-apple-gray-200">Este mes</span>
                <span className="font-semibold text-apple-black">
                  {contracts?.filter((c: Document) => {
                    const date = parseISO(c.createdAt);
                    const now = new Date();
                    return (
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                    );
                  }).length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">
              Plantillas
            </h3>
            <p className="text-sm text-apple-gray-200 mb-4">
              Usa plantillas predefinidas para generar contratos más rápido.
            </p>
            <button
              className="btn-secondary w-full"
              onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Gestión de plantillas disponible próximamente' })}
            >
              <FileText size={18} />
              Ver plantillas
            </button>
          </div>
        </div>
      </div>

      {/* Contract Generator Modal */}
      {showGenerator && (
        <ContractGenerator
          kennelId={kennelId!}
          onClose={() => setShowGenerator(false)}
          onSuccess={() => {
            queryClient.invalidateQueries('contracts');
            setShowGenerator(false);
          }}
        />
      )}

      {/* Contract Preview Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedContract(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-apple-black">{selectedContract.name}</h3>
              <button onClick={() => setSelectedContract(null)} className="p-2 rounded-lg hover:bg-apple-gray">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedContract.contractData && (
                <div className="prose max-w-none">
                  {(() => {
                    try {
                      const data = JSON.parse(selectedContract.contractData!);
                      return (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-apple-gray-200">Comprador</h4>
                              <p className="text-apple-black">{data.customerName || 'N/A'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-apple-gray-200">Perro</h4>
                              <p className="text-apple-black">{data.dogName || 'N/A'}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-apple-gray-200">Precio</h4>
                              <p className="text-apple-black">€{data.price || 0}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-apple-gray-200">Señal</h4>
                              <p className="text-apple-black">€{data.deposit || 0}</p>
                            </div>
                          </div>

                          {data.terms && (
                            <div>
                              <h4 className="font-medium text-apple-gray-200 mb-2">Términos</h4>
                              <p className="text-apple-black whitespace-pre-wrap">{data.terms}</p>
                            </div>
                          )}
                        </div>
                      );
                    } catch {
                      return <p>No hay datos disponibles</p>;
                    }
                  })()}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-apple-gray/30">
              <button
                onClick={() => deleteMutation.mutate(selectedContract.id)}
                className="btn-danger"
              >
                <Trash2 size={18} />
                Eliminar
              </button>
              <button
                onClick={() => window.open(selectedContract.url, '_blank')}
                className="btn-primary"
              >
                <Eye size={18} />
                Ver completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Contract Generator Component
function ContractGenerator({
  kennelId,
  onClose,
  onSuccess,
}: {
  kennelId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    dogId: '',
    contractType: 'SALE',
    price: '',
    deposit: '',
    terms: '',
    templateId: '',
  });

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


  const handleSubmit = async () => {
    setGenerating(true);
    try {
      await documentsApi.generateContract({
        kennelId,
        customerId: formData.customerId || undefined,
        dogId: formData.dogId || undefined,
        contractType: formData.contractType,
        price: formData.price ? parseFloat(formData.price) : undefined,
        deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
        terms: formData.terms || undefined,
        templateId: formData.templateId || undefined,
      });
      onSuccess();
    } catch (error) {
      console.error('Error generating contract:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-apple-black">Generar Contrato</h2>
          <p className="text-apple-gray-100">Paso {step} de 3</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-apple-black">Selecciona el perro y el cliente</h3>

              <div>
                <label className="block text-sm font-medium text-apple-black mb-1">Perro</label>
                <select
                  value={formData.dogId}
                  onChange={(e) => setFormData({ ...formData, dogId: e.target.value })}
                  className="input w-full"
                >
                  <option value="">Seleccionar perro...</option>
                  {dogs?.map((dog: DogType) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name} {dog.breed ? `(${dog.breed.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-black mb-1">Cliente</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="input w-full"
                >
                  <option value="">Seleccionar cliente...</option>
                  {customers?.map((customer: Customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-apple-black">Detalles del contrato</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Precio (€)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input w-full"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-black mb-1">Señal/Depósito (€)</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="input w-full"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-black mb-1">Términos adicionales</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="input w-full h-32 resize-none"
                  placeholder="Escribe aquí cualquier término adicional..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-apple-black">Revisar y generar</h3>

              <div className="p-4 bg-apple-gray/30 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-apple-gray-200">Perro:</span>
                  <span className="font-medium">{dogs?.find((d: DogType) => d.id === formData.dogId)?.name || 'No seleccionado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-gray-200">Cliente:</span>
                  <span className="font-medium">
                    {customers?.find((c: Customer) => c.id === formData.customerId)
                      ? `${customers.find((c: Customer) => c.id === formData.customerId)!.firstName} ${customers.find((c: Customer) => c.id === formData.customerId)!.lastName}`
                      : 'No seleccionado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-gray-200">Precio:</span>
                  <span className="font-medium">€{formData.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-gray-200">Señal:</span>
                  <span className="font-medium">€{formData.deposit || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-xl">
                <FileText className="text-blue-600" size={20} />
                <p className="text-sm text-blue-700">
                  El contrato se generará en formato HTML y podrás descargarlo o imprimirlo.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between p-6 border-t bg-apple-gray/30">
          <button
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="btn-secondary"
            disabled={generating}
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </button>

          <button
            onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
            disabled={generating || (step === 1 && !formData.dogId)}
            className="btn-primary disabled:opacity-50"
          >
            {generating ? 'Generando...' : step === 3 ? 'Generar Contrato' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
