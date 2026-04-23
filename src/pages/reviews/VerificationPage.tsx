import { useQuery } from 'react-query';
import { reviewsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { CheckCircle2, Circle, Loader2, XCircle, ShieldCheck } from 'lucide-react';

const statusLabels: Record<string, string> = {
  NOT_STARTED: 'No iniciado',
  IN_PROGRESS: 'En progreso',
  VERIFIED: 'Verificado',
  REJECTED: 'Rechazado',
};

const stepStatusIcons: Record<string, any> = {
  PENDING: Circle,
  IN_PROGRESS: Loader2,
  COMPLETED: CheckCircle2,
  REJECTED: XCircle,
};

const stepStatusColors: Record<string, string> = {
  PENDING: 'text-apple-gray-300',
  IN_PROGRESS: 'text-amber-500',
  COMPLETED: 'text-green-600',
  REJECTED: 'text-red-600',
};

export function VerificationPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isManager });
  const kennelId = myKennels?.[0]?.id;

  const { data: verRes, isLoading } = useQuery(['verification', kennelId], () => reviewsApi.getVerification(kennelId || ''), { enabled: !!kennelId });
  const v = verRes?.data?.verification as any;

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Verificación" subtitle="Proceso de verificación del criadero" />
        <div className="card p-8"><div className="skeleton h-40 rounded-xl" /></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Verificación" subtitle="Validez e identidad del criadero" />

      <div className="card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            v?.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : v?.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
          )}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-sm text-apple-gray-100">Estado actual</p>
            <p className="text-2xl font-bold text-apple-black">{statusLabels[v?.status] || v?.status}</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-apple-gray-300" />
          <div className="space-y-6">
            {(v?.steps || []).map((step: any) => {
              const Icon = stepStatusIcons[step.status] || Circle;
              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  <div className={cn('relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white', stepStatusColors[step.status], step.status === 'COMPLETED' ? 'border-green-600' : 'border-apple-gray-300')}>
                    <Icon size={18} className={step.status === 'IN_PROGRESS' ? 'animate-spin' : ''} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-medium text-apple-black">{step.name}</p>
                    <p className="text-sm text-apple-gray-200">{step.description}</p>
                    {step.completedAt && <p className="text-xs text-apple-gray-300 mt-1">Completado el {step.completedAt}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
