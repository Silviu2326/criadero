import { useState } from 'react';
import { useQuery } from 'react-query';
import { documentsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  FileText,
  Download,
  Eye,
  FileCheck,
  Award,
  Stethoscope,
  File,
  Search,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/utils/cn';

interface Document {
  id: string;
  name: string;
  type: 'PEDIGREE' | 'CONTRACT' | 'HEALTH_CERT' | 'INVOICE' | 'OTHER';
  description?: string;
  url: string;
  createdAt: string;
  dogName?: string;
}

const documentTypes = {
  PEDIGREE: { label: 'Pedigree', icon: Award, color: 'text-purple-600 bg-purple-100' },
  CONTRACT: { label: 'Contrato', icon: FileCheck, color: 'text-blue-600 bg-blue-100' },
  HEALTH_CERT: { label: 'Certificado de Salud', icon: Stethoscope, color: 'text-green-600 bg-green-100' },
  INVOICE: { label: 'Factura', icon: FileText, color: 'text-amber-600 bg-amber-100' },
  OTHER: { label: 'Otro', icon: File, color: 'text-gray-600 bg-gray-100' },
};

export function MyDocumentsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const { data: documentsData, isLoading } = useQuery(
    ['myDocuments', user?.customerId],
    () => documentsApi.getAll({ customerId: user?.customerId }).then((r) => r.data),
    { enabled: !!user?.customerId }
  );

  const documents: Document[] = documentsData?.documents || [];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
                         doc.dogName?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDownload = (doc: Document) => {
    window.open(doc.url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-section font-display font-semibold text-apple-black">
            Mis Documentos
          </h1>
          <p className="text-apple-gray-100 mt-1">
            Aquí encontrarás todos tus documentos relacionados con tus perros
          </p>
        </div>

        <div className="card p-12 text-center">
          <div className="w-24 h-24 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-apple-gray-300" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">
            No tienes documentos aún
          </h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">
            Cuando adquieras un perro, recibirás aquí el contrato, pedigree y certificados de salud
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-section font-display font-semibold text-apple-black">
          Mis Documentos
        </h1>
        <p className="text-apple-gray-100 mt-1">
          {documents.length} {documents.length === 1 ? 'documento' : 'documentos'} disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar documentos..."
              className="input-apple pl-11 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-apple-gray-100" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-apple select-apple"
            >
              <option value="">Todos los tipos</option>
              <option value="PEDIGREE">Pedigrees</option>
              <option value="CONTRACT">Contratos</option>
              <option value="HEALTH_CERT">Certificados de salud</option>
              <option value="INVOICE">Facturas</option>
              <option value="OTHER">Otros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-apple-gray-100">
              No se encontraron documentos con los filtros seleccionados
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const config = documentTypes[doc.type];
            const Icon = config.icon;

            return (
              <div
                key={doc.id}
                className="card p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0', config.color)}>
                  <Icon size={28} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-apple-black truncate">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-apple-gray-100">
                    {config.label}
                    {doc.dogName && (
                      <span className="ml-2">
                        • {doc.dogName}
                      </span>
                    )}
                  </p>
                  {doc.description && (
                    <p className="text-xs text-apple-gray-200 mt-1">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-sm text-apple-gray-200">
                    {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 rounded-lg hover:bg-apple-gray text-apple-gray-200 hover:text-apple-blue transition-colors"
                    title="Ver documento"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 rounded-lg hover:bg-apple-gray text-apple-gray-200 hover:text-apple-blue transition-colors"
                    title="Descargar"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
