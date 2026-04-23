import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Plus,
  Award,
  Search,
  Download,
  Trash2,
  Eye,
  Dog,
  ChevronRight,
  Dna,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { documentsApi, dogsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import type { Dog as DogType, Document } from '@/types';

export function PedigreesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const [selectedDog, setSelectedDog] = useState<DogType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: myKennels } = useQuery(
    'myKennelsPedigrees',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: dogs } = useQuery(
    ['dogs', kennelId],
    () => dogsApi.getAll({ kennelId: kennelId! }).then((r) => r.data.dogs),
    { enabled: !!kennelId }
  );

  const { data: pedigrees } = useQuery(
    ['pedigrees', kennelId],
    () =>
      documentsApi
        .getAll({ kennelId: kennelId!, type: 'PEDIGREE' })
        .then((r) => r.data.documents),
    { enabled: !!kennelId }
  );

  const generateMutation = useMutation(
    (dogId: string) => documentsApi.generatePedigree({ dogId, kennelId: kennelId! }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pedigrees');
        setIsGenerating(false);
        setSelectedDog(null);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => documentsApi.delete(id),
    {
      onSuccess: () => queryClient.invalidateQueries('pedigrees'),
    }
  );

  const handleGenerate = async () => {
    if (!selectedDog) return;
    setIsGenerating(true);
    generateMutation.mutate(selectedDog.id);
  };

  const filteredDogs = dogs?.filter(
    (dog: DogType) =>
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dogsWithPedigree = new Set(pedigrees?.map((p: Document) => p.dogId));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Pedigrees"
        subtitle="Genera y gestiona certificados de pedigree"
        action={
          isBreeder && (
            <button
              onClick={() => setSelectedDog({} as DogType)}
              className="btn-primary"
            >
              <Plus size={18} />
              Generar Pedigree
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dogs List */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">
              Perros del Criadero
            </h3>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input
                type="text"
                placeholder="Buscar perro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-10"
              />
            </div>

            <div className="space-y-3">
              {filteredDogs?.map((dog: DogType) => {
                const hasPedigree = dogsWithPedigree.has(dog.id);
                return (
                  <div
                    key={dog.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer',
                      hasPedigree
                        ? 'border-green-200 bg-green-50'
                        : 'border-apple-gray-300/50 hover:border-apple-blue/50'
                    )}
                    onClick={() => setSelectedDog(dog)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center overflow-hidden">
                        {dog.photos?.[0]?.url ? (
                          <img
                            src={dog.photos[0].url}
                            alt={dog.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Dog className="text-apple-gray-200" size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-apple-black">{dog.name}</h4>
                        <p className="text-sm text-apple-gray-100">
                          {dog.breed?.name} • {dog.gender === 'MALE' ? 'Macho' : 'Hembra'}
                        </p>
                        {(dog.fatherId || dog.motherId) && (
                          <div className="flex items-center gap-2 mt-1">
                            <Dna size={12} className="text-apple-blue" />
                            <span className="text-xs text-apple-gray-200">
                              Padre: {dog.father?.name || 'N/A'} •
                              Madre: {dog.mother?.name || 'N/A'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasPedigree ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <Award size={12} />
                          Pedigree generado
                        </span>
                      ) : (
                        <span className="text-sm text-apple-gray-100">Sin pedigree</span>
                      )}
                      <ChevronRight size={18} className="text-apple-gray-200" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generated Pedigrees */}
        <div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">
              Pedigrees Generados
            </h3>

            <div className="space-y-3">
              {pedigrees?.length === 0 ? (
                <p className="text-apple-gray-200 text-center py-8">
                  No hay pedigrees generados
                </p>
              ) : (
                pedigrees?.map((pedigree: Document) => (
                  <div
                    key={pedigree.id}
                    className="p-4 rounded-xl border border-apple-gray-300/50 hover:border-apple-blue/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Award className="text-amber-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-apple-black">
                            {pedigree.dog?.name || 'Sin nombre'}
                          </h4>
                          <p className="text-xs text-apple-gray-100">
                            {new Date(pedigree.createdAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => window.open(pedigree.url, '_blank')}
                          className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
                          title="Ver"
                        >
                          <Eye size={16} className="text-apple-gray-200" />
                        </button>
                        <button
                          onClick={() => documentsApi.download(pedigree.id)}
                          className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
                          title="Descargar"
                        >
                          <Download size={16} className="text-apple-gray-200" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(pedigree.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      {selectedDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDog(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-apple-black mb-4">
              Generar Pedigree
            </h2>

            {selectedDog.id ? (
              <div className="space-y-4">
                <div className="p-4 bg-apple-gray/30 rounded-xl">
                  <h3 className="font-semibold text-apple-black">{selectedDog.name}</h3>
                  <p className="text-sm text-apple-gray-100">
                    {selectedDog.breed?.name} • {selectedDog.gender === 'MALE' ? 'Macho' : 'Hembra'}
                  </p>
                  {(selectedDog.fatherId || selectedDog.motherId) ? (
                    <div className="mt-2 text-sm text-apple-gray-200">
                      <p>Padre: {selectedDog.father?.name || 'No registrado'}</p>
                      <p>Madre: {selectedDog.mother?.name || 'No registrada'}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-amber-600">
                      ⚠️ Este perro no tiene padres registrados. El pedigree será limitado.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedDog(null)}
                    className="btn-secondary"
                    disabled={isGenerating}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="btn-primary"
                  >
                    {isGenerating ? 'Generando...' : 'Generar Pedigree'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-apple-gray-200">
                  Selecciona un perro de la lista para generar su certificado de pedigree.
                </p>
                <button
                  onClick={() => setSelectedDog(null)}
                  className="btn-secondary w-full"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
