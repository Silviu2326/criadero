import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useUIStore } from '@/store/uiStore';
import {
  Plus,
  FileText,
  FileImage,
  File,
  Download,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Folder,
  FileSignature,
  Award,
  Stethoscope,
  Tag,
  Calendar,
  AlertCircle,
  XCircle,
  Upload,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { documentsApi, kennelsApi, API_URL } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import { format, parseISO, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Document } from '@/types';

const documentTypeOptions = [
  { value: '', label: 'Todos los tipos', icon: File },
  { value: 'PEDIGREE', label: 'Pedigrees', icon: Award },
  { value: 'CONTRACT', label: 'Contratos', icon: FileSignature },
  { value: 'HEALTH_CERT', label: 'Certificados de salud', icon: Stethoscope },
  { value: 'VACCINE_CERT', label: 'Certificados de vacunas', icon: FileText },
  { value: 'MICROCHIP', label: 'Microchips', icon: Tag },
  { value: 'PHOTO', label: 'Fotos', icon: FileImage },
  { value: 'INVOICE', label: 'Facturas', icon: FileText },
  { value: 'OTHER', label: 'Otros', icon: File },
];

const documentTypeColors: Record<string, string> = {
  PEDIGREE: 'bg-amber-100 text-amber-700',
  CONTRACT: 'bg-blue-100 text-blue-700',
  HEALTH_CERT: 'bg-green-100 text-green-700',
  VACCINE_CERT: 'bg-teal-100 text-teal-700',
  MICROCHIP: 'bg-purple-100 text-purple-700',
  PHOTO: 'bg-pink-100 text-pink-700',
  INVOICE: 'bg-orange-100 text-orange-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

export function DocumentsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { data: myKennels } = useQuery(
    'myKennelsDocuments',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: documents, isLoading } = useQuery(
    ['documents', kennelId, selectedType, searchQuery],
    () =>
      documentsApi
        .getAll({
          kennelId: kennelId!,
          type: selectedType || undefined,
          search: searchQuery || undefined,
        })
        .then((r) => r.data.documents),
    { enabled: !!kennelId }
  );

  const deleteMutation = useMutation(
    (id: string) => documentsApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
        setSelectedDocument(null);
      },
    }
  );

  const handleDownload = async (doc: Document) => {
    try {
      const response = await documentsApi.download(doc.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName || doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleDelete = (document: Document) => {
    if (confirm(`¿Estás seguro de eliminar "${document.name}"?`)) {
      deleteMutation.mutate(document.id);
    }
  };

  // Stats
  const stats = {
    total: documents?.length || 0,
    expired: documents?.filter((d: Document) => d.status === 'EXPIRED').length || 0,
    expiringSoon: documents?.filter((d: Document) => {
      if (!d.expiryDate) return false;
      const expiry = parseISO(d.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return isAfter(expiry, new Date()) && isAfter(thirtyDaysFromNow, expiry);
    }).length || 0,
  };

  const filteredDocuments = documents || [];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Documentos"
        subtitle="Gestiona pedigrees, contratos, certificados y más"
        action={
          isBreeder && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-secondary"
              >
                <Upload size={18} />
                Subir
              </button>
              <button
                className="btn-primary"
                onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Creación de documentos desde plantillas disponible próximamente' })}
              >
                <Plus size={18} />
                Nuevo
              </button>
            </div>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Folder className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.total}</p>
            <p className="text-sm text-apple-gray-100">Documentos totales</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.expired}</p>
            <p className="text-sm text-apple-gray-100">Expirados</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Calendar className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-apple-black">{stats.expiringSoon}</p>
            <p className="text-sm text-apple-gray-100">Expiran pronto</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={18} className="text-apple-gray-100" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input flex-1"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-apple-gray-100" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input"
            >
              {documentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-apple-gray rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-white text-apple-blue shadow-sm'
                  : 'text-apple-gray-200 hover:text-apple-black'
              )}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-apple-blue shadow-sm'
                  : 'text-apple-gray-200 hover:text-apple-black'
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {documentTypeOptions.slice(1).map((opt) => {
            const Icon = opt.icon;
            const count = documents?.filter((d: Document) => d.type === opt.value).length || 0;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedType(selectedType === opt.value ? '' : opt.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  selectedType === opt.value
                    ? 'bg-apple-blue text-white'
                    : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/50'
                )}
              >
                <Icon size={14} />
                {opt.label}
                {count > 0 && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-xs',
                      selectedType === opt.value
                        ? 'bg-white/20 text-white'
                        : 'bg-apple-gray-300 text-apple-gray-200'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto" />
          <p className="mt-4 text-apple-gray-200">Cargando documentos...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card p-12 text-center">
          <Folder className="mx-auto h-12 w-12 text-apple-gray-100" />
          <p className="mt-4 text-apple-gray-200">No hay documentos</p>
          {isBreeder && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 text-apple-blue hover:underline"
            >
              Subir tu primer documento
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((document: Document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onPreview={() => {
                setSelectedDocument(document);
                setIsPreviewModalOpen(true);
              }}
              onDownload={() => handleDownload(document)}
              onDelete={() => handleDelete(document)}
            />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-apple-gray/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-apple-gray-200">Documento</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-apple-gray-200">Tipo</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-apple-gray-200">Relacionado</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-apple-gray-200">Fecha</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-apple-gray-200">Estado</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-apple-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-gray-300/30">
              {filteredDocuments.map((document: Document) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  onPreview={() => {
                    setSelectedDocument(document);
                    setIsPreviewModalOpen(true);
                  }}
                  onDownload={() => handleDownload(document)}
                  onDelete={() => handleDelete(document)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal
          kennelId={kennelId!}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries('documents');
            setIsUploadModalOpen(false);
          }}
        />
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedDocument && (
        <PreviewModal
          document={selectedDocument}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedDocument(null);
          }}
          onDownload={() => handleDownload(selectedDocument)}
          onDelete={() => handleDelete(selectedDocument)}
        />
      )}
    </div>
  );
}

// Document Card Component
function DocumentCard({
  document,
  onPreview,
  onDownload,
  onDelete,
}: {
  document: Document;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const typeOption = documentTypeOptions.find((o) => o.value === document.type);
  const Icon = typeOption?.icon || File;

  return (
    <div
      className="card p-4 group cursor-pointer hover:shadow-lg transition-all"
      onClick={onPreview}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            documentTypeColors[document.type] || 'bg-gray-100 text-gray-700'
          )}
        >
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-apple-black truncate">{document.name}</h4>
          <p className="text-sm text-apple-gray-100">{typeOption?.label}</p>
          {document.dog && (
            <p className="text-xs text-apple-gray-200 mt-1">{document.dog.name}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-apple-gray-200">
          {format(parseISO(document.createdAt), 'dd MMM yyyy', { locale: es })}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
          >
            <Download size={16} className="text-apple-gray-200" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>

      {document.expiryDate && (
        <div
          className={cn(
            'mt-3 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1',
            document.status === 'EXPIRED'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          )}
        >
          <Calendar size={12} />
          {document.status === 'EXPIRED'
            ? `Expiró el ${format(parseISO(document.expiryDate), 'dd/MM/yyyy')}`
            : `Expira el ${format(parseISO(document.expiryDate), 'dd/MM/yyyy')}`}
        </div>
      )}
    </div>
  );
}

// Document Row Component
function DocumentRow({
  document,
  onPreview,
  onDownload,
  onDelete,
}: {
  document: Document;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const typeOption = documentTypeOptions.find((o) => o.value === document.type);
  const Icon = typeOption?.icon || File;

  return (
    <tr className="hover:bg-apple-gray/30 transition-colors cursor-pointer" onClick={onPreview}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              documentTypeColors[document.type] || 'bg-gray-100 text-gray-700'
            )}
          >
            <Icon size={20} />
          </div>
          <span className="font-medium text-apple-black">{document.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-apple-gray-200">{typeOption?.label}</td>
      <td className="px-4 py-3 text-sm text-apple-gray-200">
        {document.dog?.name || document.customer?.firstName || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-apple-gray-200">
        {format(parseISO(document.createdAt), 'dd MMM yyyy', { locale: es })}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            document.status === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
              : document.status === 'EXPIRED'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700'
          )}
        >
          {document.status === 'ACTIVE' ? 'Activo' : document.status === 'EXPIRED' ? 'Expirado' : 'Revocado'}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
          >
            <Download size={16} className="text-apple-gray-200" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Upload Modal
function UploadModal({
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
    type: 'OTHER',
    description: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('name', formData.name || file.name);
    data.append('type', formData.type);
    data.append('kennelId', kennelId);
    if (formData.description) data.append('description', formData.description);
    if (formData.tags) data.append('tags', formData.tags);

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
        <h2 className="text-xl font-semibold text-apple-black mb-4">Subir Documento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Archivo</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={file?.name || 'Nombre del documento'}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input w-full"
            >
              {documentTypeOptions.slice(1).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full h-20 resize-none"
              placeholder="Descripción opcional..."
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
              {uploading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Preview Modal
function PreviewModal({
  document,
  onClose,
  onDownload,
  onDelete,
}: {
  document: Document;
  onClose: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const typeOption = documentTypeOptions.find((o) => o.value === document.type);

  const isPdf = document.mimeType?.includes('pdf') || document.url?.endsWith('.pdf');
  const isImage = document.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(document.url || '');
  const isHtml = document.mimeType?.includes('html') || document.url?.endsWith('.html');
  const canPreview = isPdf || isImage || isHtml;
  const previewUrl = API_URL.replace(/\/api\/?$/, '') + document.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                documentTypeColors[document.type] || 'bg-gray-100 text-gray-700'
              )}
            >
              {typeOption && <typeOption.icon size={20} />}
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">{document.name}</h3>
              <p className="text-sm text-apple-gray-100">{typeOption?.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-apple-gray">
            <XCircle size={20} className="text-apple-gray-200" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {canPreview ? (
            <div className="w-full h-80 rounded-xl overflow-hidden border border-apple-gray-300 mb-6">
              {isImage ? (
                <img
                  src={previewUrl}
                  alt={document.name}
                  className="w-full h-full object-contain bg-black/5"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title={document.name}
                  className="w-full h-full"
                />
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-apple-gray rounded-xl mb-6">
              <FileText size={48} className="mx-auto text-apple-gray-300 mb-2" />
              <p className="text-sm text-apple-gray-200">Vista previa no disponible para este tipo de archivo</p>
            </div>
          )}

          {document.description && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Descripción</h4>
              <p className="text-apple-black">{document.description}</p>
            </div>
          )}

          {document.dog && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Perro</h4>
              <p className="text-apple-black">{document.dog.name}</p>
            </div>
          )}

          {document.customer && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Cliente</h4>
              <p className="text-apple-black">
                {document.customer.firstName} {document.customer.lastName}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Fecha de creación</h4>
              <p className="text-apple-black">
                {format(parseISO(document.createdAt), 'dd MMMM yyyy', { locale: es })}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Estado</h4>
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  document.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : document.status === 'EXPIRED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                )}
              >
                {document.status === 'ACTIVE'
                  ? 'Activo'
                  : document.status === 'EXPIRED'
                  ? 'Expirado'
                  : 'Revocado'}
              </span>
            </div>
          </div>

          {document.fileSize && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-apple-gray-200 mb-1">Tamaño</h4>
              <p className="text-apple-black">{(document.fileSize / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-apple-gray/30">
          <button onClick={onDelete} className="btn-danger">
            <Trash2 size={18} />
            Eliminar
          </button>
          <button onClick={onDownload} className="btn-primary">
            <Download size={18} />
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
