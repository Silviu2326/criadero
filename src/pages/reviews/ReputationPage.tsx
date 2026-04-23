import { useQuery } from 'react-query';
import { reviewsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { Star, ShieldCheck, Award, TrendingUp, MessageSquare } from 'lucide-react';

export function ReputationPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isManager });
  const kennelId = myKennels?.[0]?.id;

  const { data: repRes, isLoading } = useQuery(['reputation', kennelId], () => reviewsApi.getReputation(kennelId || ''), { enabled: !!kennelId });
  const rep = repRes?.data?.reputation as any;

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Reputación" subtitle="Score general del criadero" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-24 rounded-xl" /></div>)}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Reputación" subtitle="Métricas de reputación online" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><TrendingUp className="text-blue-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Score general</p><p className="text-2xl font-semibold text-apple-black">{rep?.overall ?? 0}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><Star className="text-amber-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Media estrellas</p><p className="text-2xl font-semibold text-apple-black">{rep?.avgRating ?? '—'}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><MessageSquare className="text-purple-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Total reseñas</p><p className="text-2xl font-semibold text-apple-black">{rep?.totalReviews ?? 0}</p></div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center"><ShieldCheck className="text-green-600" size={24} /></div>
          <div><p className="text-sm text-apple-gray-100">Respuesta</p><p className="text-2xl font-semibold text-apple-black">{rep?.responseRate ?? 0}%</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold text-apple-black mb-4">Distribución de estrellas</h3>
          <div className="space-y-3">
            {[
              { label: '5 estrellas', value: rep?.fiveStar || 0 },
              { label: '4 estrellas', value: rep?.fourStar || 0 },
              { label: '3 estrellas', value: rep?.threeStar || 0 },
              { label: '2 estrellas', value: rep?.twoStar || 0 },
              { label: '1 estrella', value: rep?.oneStar || 0 },
            ].map((row) => {
              const total = rep?.totalReviews || 1;
              const pct = Math.round((row.value / total) * 100);
              return (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-apple-gray-200">{row.label}</span>
                  <div className="flex-1 h-2 bg-apple-gray rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', row.label === '5 estrellas' ? 'bg-green-500' : row.label === '1 estrella' ? 'bg-red-500' : 'bg-amber-400')} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm text-apple-gray-200">{row.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-apple-black mb-4">Insignias del criadero</h3>
          <div className="space-y-3">
            <div className={cn('flex items-center gap-3 p-3 rounded-xl border', rep?.verifiedBadge ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200')}>
              <ShieldCheck className={cn('w-6 h-6', rep?.verifiedBadge ? 'text-green-600' : 'text-gray-400')} />
              <div>
                <p className={cn('font-medium', rep?.verifiedBadge ? 'text-green-800' : 'text-gray-600')}>Criadero Verificado</p>
                <p className="text-xs text-apple-gray-200">{rep?.verifiedBadge ? 'Identidad confirmada' : 'Pendiente de verificación'}</p>
              </div>
            </div>
            <div className={cn('flex items-center gap-3 p-3 rounded-xl border', rep?.pedigreeBadge ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200')}>
              <Award className={cn('w-6 h-6', rep?.pedigreeBadge ? 'text-blue-600' : 'text-gray-400')} />
              <div>
                <p className={cn('font-medium', rep?.pedigreeBadge ? 'text-blue-800' : 'text-gray-600')}>Pedigree Certificado</p>
                <p className="text-xs text-apple-gray-200">{rep?.pedigreeBadge ? 'Documentación validada' : 'Pendiente de validación'}</p>
              </div>
            </div>
            <div className={cn('flex items-center gap-3 p-3 rounded-xl border', rep?.healthBadge ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200')}>
              <Star className={cn('w-6 h-6', rep?.healthBadge ? 'text-purple-600' : 'text-gray-400')} />
              <div>
                <p className={cn('font-medium', rep?.healthBadge ? 'text-purple-800' : 'text-gray-600')}>Sanidad Garantizada</p>
                <p className="text-xs text-apple-gray-200">{rep?.healthBadge ? 'Inspección veterinaria aprobada' : 'Pendiente de inspección'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
