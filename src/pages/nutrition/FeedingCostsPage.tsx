import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { nutritionApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { DollarSign, TrendingUp, Dog } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export function FeedingCostsPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';
  const [dateFrom, setDateFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: costsData, isLoading } = useQuery(
    ['nutrition-feeding-costs', kennelId, dateFrom, dateTo],
    () =>
      nutritionApi.getFeedingCosts({ kennelId, dateFrom, dateTo }).then((r) => r.data.costs),
    { enabled: !!kennelId }
  );

  const { data: summaryData } = useQuery(
    ['nutrition-feeding-costs-summary', kennelId, dateFrom, dateTo],
    () =>
      nutritionApi.getFeedingCostSummary({ kennelId, dateFrom, dateTo }).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const costs = costsData || [];
  const summary = summaryData;

  const maxCost = useMemo(() => {
    return Math.max(...costs.map((c: any) => c.totalCost || 0), 1);
  }, [costs]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Coste de alimentación" subtitle="Análisis de costes reales de alimentación" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="skeleton h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Coste real de alimentación" subtitle="Análisis de costes por perro y período" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div>
          <label className="block text-xs font-medium text-apple-gray-200 mb-1">Desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input-apple"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-apple-gray-200 mb-1">Hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input-apple"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Costo total"
          value={`${summary?.totalCost?.toFixed(2) || '0.00'}€`}
          icon={DollarSign}
        />
        <StatCard
          title="Promedio por perro"
          value={`${summary?.avgCostPerDog?.toFixed(2) || '0.00'}€`}
          icon={Dog}
        />
        <StatCard
          title="Promedio por día"
          value={`${summary?.avgCostPerDay?.toFixed(2) || '0.00'}€`}
          icon={TrendingUp}
        />
        <StatCard
          title="Perro más costoso"
          value={summary?.mostExpensiveDog?.name || '-'}
          icon={TrendingUp}
        />
      </div>

      {/* Chart */}
      {costs.length > 0 && (
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-apple-black mb-4">Costo por perro</h3>
          <div className="space-y-3">
            {costs.map((cost: any) => (
              <div key={cost.dogId} className="flex items-center gap-4">
                <div className="w-32 shrink-0">
                  <p className="text-sm font-medium text-apple-black truncate">{cost.dogName}</p>
                </div>
                <div className="flex-1 h-6 bg-apple-gray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-apple-blue rounded-full transition-all"
                    style={{ width: `${(cost.totalCost / maxCost) * 100}%` }}
                  />
                </div>
                <div className="w-24 text-right shrink-0">
                  <p className="text-sm font-medium text-apple-black">{cost.totalCost.toFixed(2)}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <h3 className="text-lg font-semibold text-apple-black p-6 pb-0">Detalle por perro</h3>
        {costs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-apple-gray-200">No hay datos de costes para el período seleccionado</p>
          </div>
        ) : (
          <table className="table-modern w-full">
            <thead>
              <tr>
                <th>Perro</th>
                <th>Plan / Receta</th>
                <th className="text-right">Gramos consumidos</th>
                <th className="text-right">Costo total</th>
                <th className="text-right">Costo/día</th>
                <th className="text-right">Días registrados</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost: any) => (
                <tr key={cost.dogId}>
                  <td>
                    <div className="flex items-center gap-3">
                      {cost.dogPhoto ? (
                        <img src={cost.dogPhoto} alt={cost.dogName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-apple-gray-200 flex items-center justify-center text-white text-xs font-medium">
                          {cost.dogName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{cost.dogName}</p>
                        <p className="text-xs text-apple-gray-200">{cost.breed}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-apple-gray-200">
                    {cost.recipeName || cost.planName || '-'}
                  </td>
                  <td className="text-right text-sm">{cost.totalGramsConsumed.toFixed(0)}g</td>
                  <td className="text-right font-medium">{cost.totalCost.toFixed(2)}€</td>
                  <td className="text-right text-sm">{cost.costPerDay.toFixed(2)}€</td>
                  <td className="text-right text-sm">{cost.daysWithLogs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
