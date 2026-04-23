import { useState } from 'react';
import { useQuery } from 'react-query';
import { dogsApi } from '@/services/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Dog, Search } from 'lucide-react';
import { PedigreeTree } from '@/components/dogs/PedigreeTree';

export function GeneticsPedigreePage() {
  const [dogId, setDogId] = useState('d1');

  const { data: pedigreeRes, isLoading, refetch } = useQuery(
    ['pedigree', dogId],
    () => dogsApi.getPedigree(dogId),
    { enabled: !!dogId }
  );
  const p = pedigreeRes?.data?.pedigree;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Pedigree" subtitle="Árbol genealógico interactivo hasta 5 generaciones" />

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={dogId}
              onChange={(e) => setDogId(e.target.value)}
              placeholder="ID de perro..."
              className="input-apple pl-11 w-full"
            />
          </div>
          <button className="btn-primary" onClick={() => refetch()}>Ver pedigree</button>
        </div>
      </div>

      {isLoading ? (
        <div className="card p-8"><div className="skeleton h-64 rounded-xl" /></div>
      ) : !p ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4"><Dog className="text-apple-gray-300" size={32} /></div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin datos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">No se encontró pedigree para el perro indicado.</p>
        </div>
      ) : (
        <PedigreeTree pedigree={p} />
      )}
    </div>
  );
}
