import { useState } from 'react';
import { useQuery } from 'react-query';
import { reportsApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PawPrint,
  Users,
  Building2,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#4A5D52', '#5A7D6E', '#B87B5C', '#8B7355', '#A14E4E', '#6B8291'];

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
  REPRODUCTIVE: 'Reproductivo',
  RETIRED: 'Retirado',
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export function ReportsPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: true }
  );

  // Manager can select any kennel from their list; breeder uses their own
  const [selectedKennelId, setSelectedKennelId] = useState<string | undefined>(
    myKennels?.[0]?.id
  );

  const activeKennelId = selectedKennelId || myKennels?.[0]?.id;

  const { data: kennelReport } = useQuery(
    ['kennelReport', activeKennelId, dateRange],
    () =>
      reportsApi.getKennelReport(activeKennelId!, dateRange).then((r) => r.data.report),
    { enabled: !!activeKennelId }
  );

  const { data: managerReport } = useQuery(
    ['managerReport', activeKennelId, dateRange],
    () => reportsApi.getManagerReport({ kennelId: activeKennelId, ...dateRange }).then((r) => r.data.report),
    { enabled: isManager && !!activeKennelId }
  );

  const { data: salesReport } = useQuery(
    ['salesReport', activeKennelId, dateRange],
    () =>
      reportsApi
        .getSalesReport({ kennelId: activeKennelId, ...dateRange })
        .then((r) => r.data.report),
    { enabled: !!activeKennelId }
  );

  const report = isManager ? managerReport : kennelReport;

  const dogStatusData = kennelReport?.dogs?.map((stat: any) => ({
    name: statusLabels[stat.status] || stat.status,
    value: stat._count.status,
  })) || [];

  const reservationStatusData = kennelReport?.reservations?.map((stat: any) => ({
    name: statusLabels[stat.status] || stat.status,
    value: stat._count.status,
  })) || [];

  if (!report) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      <PageHeader
        title="Reportes"
        subtitle="Análisis y estadísticas de tu criadero"
        variant="bento"
        action={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isManager && myKennels && myKennels.length > 0 && (
              <select
                value={activeKennelId}
                onChange={(e) => setSelectedKennelId(e.target.value)}
                className="input-apple select-apple text-sm py-2 px-3"
              >
                {myKennels.map((kennel: any) => (
                  <option key={kennel.id} value={kennel.id}>
                    {kennel.name}
                  </option>
                ))}
              </select>
            )}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="input-apple py-2 text-sm"
              />
              <span className="text-apple-gray-100 text-sm">a</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="input-apple py-2 text-sm"
              />
            </div>
          </div>
        }
      />

      {/* Quick action */}
      <div className="mb-6">
        <Link
          to="/reports/client"
          className="card p-5 card-interactive flex items-center justify-between group max-w-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">Informes al cliente</h3>
              <p className="text-sm text-apple-gray-100">Generar informes de entrega profesionales</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
        {isManager ? (
          <>
            <StatCard
              title="Total Criaderos"
              value={managerReport?.totals?.kennels || 0}
              icon={Building2}
              color="blue"
              variant="bento"
            />
            <StatCard
              title="Total Perros"
              value={managerReport?.totals?.dogs || 0}
              icon={PawPrint}
              color="green"
              variant="bento"
            />
            <StatCard
              title="Total Usuarios"
              value={managerReport?.totals?.users || 0}
              icon={Users}
              color="purple"
              variant="bento"
            />
            <StatCard
              title="Total Clientes"
              value={managerReport?.totals?.customers || 0}
              icon={TrendingUp}
              color="orange"
              variant="bento"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Ventas Totales"
              value={`$${salesReport?.totalSales?.toLocaleString() || 0}`}
              icon={DollarSign}
              color="green"
              variant="bento"
            />
            <StatCard
              title="Transacciones"
              value={salesReport?.totalTransactions || 0}
              icon={TrendingUp}
              color="blue"
              variant="bento"
            />
            <StatCard
              title="Perros Vendidos"
              value={
                kennelReport?.dogs?.find((d: any) => d.status === 'SOLD')?._count
                  ?.status || 0
              }
              icon={PawPrint}
              color="orange"
              variant="bento"
            />
            <StatCard
              title="Vacunas Próximas"
              value={kennelReport?.upcomingVaccines || 0}
              icon={BarChart3}
              color="purple"
              variant="bento"
            />
          </>
        )}
      </div>

      {/* Quick mini stats for breeder */}
      {!isManager && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bento-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-apple-gray-100">
              Disponibles
            </p>
            <p className="text-xl font-display font-bold text-apple-black mt-1">
              {kennelReport?.dogs?.find((d: any) => d.status === 'AVAILABLE')?._count
                ?.status || 0}
            </p>
          </div>
          <div className="bento-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-apple-gray-100">
              Reservados
            </p>
            <p className="text-xl font-display font-bold text-apple-black mt-1">
              {kennelReport?.dogs?.find((d: any) => d.status === 'RESERVED')?._count
                ?.status || 0}
            </p>
          </div>
          <div className="bento-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-apple-gray-100">
              Reservas Pendientes
            </p>
            <p className="text-xl font-display font-bold text-apple-black mt-1">
              {kennelReport?.reservations?.find((r: any) => r.status === 'PENDING')
                ?._count?.status || 0}
            </p>
          </div>
          <div className="bento-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-apple-gray-100">
              Camadas Activas
            </p>
            <p className="text-xl font-display font-bold text-apple-black mt-1">
              {kennelReport?.activeLitters || 0}
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Dog Status */}
        <div className="bento-card p-6">
          <h2 className="bento-title mb-4">Estado de perros</h2>
          {dogStatusData.length > 0 ? (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dogStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dogStatusData.map((_entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(44,42,38,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {dogStatusData.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-apple-gray-200">{item.name}</span>
                    <span className="font-medium text-apple-black ml-auto">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-apple-gray-100 text-center py-12 text-sm">
              No hay datos disponibles para el criadero seleccionado
            </p>
          )}
        </div>

        {/* Reservations */}
        <div className="bento-card p-6">
          <h2 className="bento-title mb-4">Reservas por estado</h2>
          {reservationStatusData.length > 0 ? (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reservationStatusData}
                    layout="vertical"
                    margin={{ left: 0, right: 16 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#DCD7CF"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      stroke="#9A948D"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#9A948D"
                      fontSize={11}
                      width={90}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(44,42,38,0.1)',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
                      {reservationStatusData.map(
                        (_entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {reservationStatusData.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-apple-gray-200">{item.name}</span>
                    <span className="font-medium text-apple-black ml-auto">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-apple-gray-100 text-center py-12 text-sm">
              No hay datos disponibles para el criadero seleccionado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
