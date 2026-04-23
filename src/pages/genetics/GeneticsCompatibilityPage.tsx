import { useState } from 'react';
import { useQuery } from 'react-query';
import { geneticsApi } from '@/services/api';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { Heart, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

export function GeneticsCompatibilityPage() {
  const [fatherId, setFatherId] = useState('d1');
  const [motherId, setMotherId] = useState('d4');
  const [query, setQuery] = useState<{ fatherId: string; motherId: string } | null>(null);

  const { data: coiRes, isLoading } = useQuery(
    ['coi', query?.fatherId, query?.motherId],
    () => geneticsApi.calculateCoi(query!.fatherId, query!.motherId),
    { enabled: !!query }
  );
  const coi = coiRes?.data;

  const handleCalculate = () => {
    if (fatherId && motherId) setQuery({ fatherId, motherId });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Compatibilidad" subtitle="Calculadora de coeficiente de consanguinidad (COI)" />

      <div className="card p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-apple-gray-200 mb-2 block">ID Padre</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input type="text" value={fatherId} onChange={(e) => setFatherId(e.target.value)} className="input-apple pl-11 w-full" placeholder="Ej: d1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-apple-gray-200 mb-2 block">ID Madre</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
              <input type="text" value={motherId} onChange={(e) => setMotherId(e.target.value)} className="input-apple pl-11 w-full" placeholder="Ej: d4" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handleCalculate} className="btn-primary">
            <Heart size={18} />
            Calcular COI
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="card p-8">
          <div className="skeleton h-24 rounded-xl" />
        </div>
      )}

      {!isLoading && coi && (
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center',
              coi.riskLevel === 'LOW' ? 'bg-green-100 text-green-700' : coi.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            )}>
              {coi.riskLevel === 'LOW' ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-apple-gray-100">Coeficiente de consanguinidad</p>
              <p className="text-4xl font-bold text-apple-black">{coi.coi}%</p>
              <p className={cn(
                'mt-1 inline-flex px-2 py-1 rounded-md text-sm font-medium',
                coi.riskLevel === 'LOW' ? 'bg-green-50 text-green-700' : coi.riskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              )}>
                Riesgo: {coi.riskLevel === 'LOW' ? 'Bajo' : coi.riskLevel === 'MEDIUM' ? 'Medio' : 'Alto'}
              </p>
              <p className="mt-2 text-sm text-apple-gray-200">{coi.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
