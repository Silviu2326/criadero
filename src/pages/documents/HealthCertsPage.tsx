import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Plus,
  Stethoscope,
  Search,
  Trash2,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { documentsApi, dogsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import { format, parseISO, isAfter, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Document, Dog as DogType } from '@/types';

export function HealthCertsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: myKennels } = useQuery(
    'myKennelsHealthCerts',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: healthCerts } = useQuery(
    ['healthCerts', kennelId],
    () =>
      documentsApi
        .getAll({ kennelId: kennelId!, type: 'HEALTH_CERT' })
        .then((r) => r.data.documents),
    { enabled: !!kennelId }
  );

  const deleteMutation = useMutation(
    (id: string) => documentsApi.delete(id),
    {
      onSuccess: () => queryClient.invalidateQueries('healthCerts'),
    }
  );

  const filteredCerts = healthCerts?.filter((cert: Document) =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.dog?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: healthCerts?.length || 0,
    valid: healthCerts?.filter((c: Document) => c.status === 'ACTIVE').length || 0,
    expired: healthCerts?.filter((c: Document) => c.status === 'EXPIRED').length || 0,
    expiringSoon: healthCerts?.filter((c: Document) => {
      if (!c.expiryDate || c.status === 'EXPIRED') return false;
      const expiry = parseISO(c.expiryDate);
      const thirtyDaysFromNow = addDays(new Date(), 30);
      return isAfter(expiry, new Date()) && isAfter(thirtyDaysFromNow, expiry);
    }).length || 0,
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Certificados de Salud"
        subtitle="Gestiona certificados veterinarios y de salud"
        action={
          isBreeder && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              <Plus size={18} />
              Subir Certificado
            </button>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.total}</p>
            <p className="text-sm text-apple-gray-100">Total</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.valid}</p>
            <p className="text-sm text-apple-gray-100">Válidos</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <XCircle className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.expired}</p>
            <p className="text-sm text-apple-gray-100">Expirados</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <AlertCircle className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.expiringSoon}</p>
            <p className="text-sm text-apple-gray-100">Expiran pronto</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-apple-gray-100" />
          <input
            type="text"
            placeholder="Buscar certificados..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input flex-1"
          />
        </div>
      </div>

      {/* Certificates List */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-apple-black mb-4">
          Certificados ({filteredCerts?.length || 0})
        </h3>

        <div className="space-y-3">
          {filteredCerts?.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="mx-auto h-12 w-12 text-apple-gray-100" />
              <p className="mt-4 text-apple-gray-200">No hay certificados</p>
              {isBreeder && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 text-apple-blue hover:underline"
                >
                  Subir primer certificado
                </button>
              )}
            </div>
          ) : (
            filteredCerts?.map((cert: Document) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl border border-apple-gray-300/50 hover:border-apple-blue/50 transition-all cursor-pointer"
                onClick={() => setSelectedCert(cert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      cert.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-600'
                        : cert.status === 'EXPIRED'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-600'
                    )}>
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-apple-black">{cert.name}</h4>
                      {cert.dog && (
                        <p className="text-sm text-apple-gray-100">
                          Perro: {cert.dog.name}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-apple-gray-200">
                        {cert.issuedDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Emitido: {format(parseISO(cert.issuedDate), 'dd/MM/yyyy')}
                          </span>
                        )}
                        {cert.expiryDate && (
                          <span className={cn(
                            'flex items-center gap-1',
                            cert.status === 'EXPIRED' && 'text-red-600'
                          )}>
                            <AlertCircle size={12} />
                            Expira: {format(parseISO(cert.expiryDate), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      cert.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : cert.status === 'EXPIRED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    )}>
                      {cert.status === 'ACTIVE' ? 'Válido' : cert.status === 'EXPIRED' ? 'Expirado' : 'Revocado'}
                    </span>
                    <ChevronRight size={18} className="text-apple-gray-200" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <HealthCertUploadModal
          kennelId={kennelId!}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries('healthCerts');
            setShowUploadModal(false);
          }}
        />
      )}

      {/* Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCert(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Stethoscope className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-apple-black">{selectedCert.name}</h3>
                  <p className="text-sm text-apple-gray-100">
                    {selectedCert.dog?.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedCert(null)} className="p-2 rounded-lg hover:bg-apple-gray">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedCert.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Descripción</h4>
                  <p className="text-apple-black">{selectedCert.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedCert.issuedDate && (
                  <div>
                    <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Fecha de emisión</h4>
                    <p className="text-apple-black">
                      {format(parseISO(selectedCert.issuedDate), 'dd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                )}
                {selectedCert.expiryDate && (
                  <div>
                    <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Fecha de expiración</h4>
                    <p className={cn(
                      'text-apple-black',
                      selectedCert.status === 'EXPIRED' && 'text-red-600 font-medium'
                    )}>
                      {format(parseISO(selectedCert.expiryDate), 'dd MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Estado</h4>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  selectedCert.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : selectedCert.status === 'EXPIRED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                )}>
                  {selectedCert.status === 'ACTIVE' ? 'Válido' : selectedCert.status === 'EXPIRED' ? 'Expirado' : 'Revocado'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-apple-gray/30">
              <button
                onClick={() => deleteMutation.mutate(selectedCert.id)}
                className="btn-danger"
              >
                <Trash2 size={18} />
                Eliminar
              </button>
              <button
                onClick={() => window.open(selectedCert.url, '_blank')}
                className="btn-primary"
              >
                <Eye size={18} />
                Ver Documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Health Cert Upload Modal
function HealthCertUploadModal({
  kennelId,
  onClose,
  onSuccess,
}: {
  kennelId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dogId: '',
    issuedDate: '',
    expiryDate: '',
  });

  const { data: dogs } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('name', formData.name || file.name);
    data.append('type', 'HEALTH_CERT');
    data.append('kennelId', kennelId);
    if (formData.dogId) data.append('dogId', formData.dogId);
    if (formData.description) data.append('description', formData.description);
    if (formData.issuedDate) data.append('issuedDate', formData.issuedDate);
    if (formData.expiryDate) data.append('expiryDate', formData.expiryDate);

    try {
      await documentsApi.upload(data);
      onSuccess();
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-apple-black mb-4">
          Subir Certificado de Salud
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Archivo *</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              required
            />
            <p className="text-xs text-apple-gray-100 mt-1">PDF o imagen (máx. 10MB)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Nombre *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Certificado veterinario anual"
              className="input w-full"
              required
            />
          </div>

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
                  {dog.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Fecha de emisión</label>
              <input
                type="date"
                value={formData.issuedDate}
                onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-black mb-1">Fecha de expiración</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full h-20 resize-none"
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="btn-primary disabled:opacity-50"
            >
              {uploading ? 'Subiendo...' : 'Subir Certificado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
