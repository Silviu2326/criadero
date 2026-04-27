import { useAuthStore } from '@/store/authStore';
import { useQuery } from 'react-query';
import { reportsApi, kennelsApi, tasksApi, financeApi } from '@/services/api';
import { useKennel } from '@/hooks/useKennel';
import {
  Dog,
  Users,
  Wallet,
  Heart,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  CheckCircle2,
  X,
  PawPrint,
  CheckSquare,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/utils/cn';

// Chart data
const activityData = [
  { day: 'Lun', registros: 60, reservas: 20 },
  { day: 'Mar', registros: 30, reservas: 12 },
  { day: 'Mié', registros: 35, reservas: 24 },
  { day: 'Jue', registros: 72, reservas: 10 },
  { day: 'Vie', registros: 70, reservas: 8 },
  { day: 'Sáb', registros: 30, reservas: 20 },
  { day: 'Dom', registros: 50, reservas: 15 },
];

// Sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Stat Card Component
interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend: number;
  trendLabel?: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
  linkTo: string;
  linkLabel: string;
  sparklineData: number[];
}

const colorConfig = {
  green: {
    text: 'text-accent-green',
    bg: 'bg-accent-green',
    bgLight: 'bg-accent-green-bg',
    border: 'border-accent-green-bg',
    spark: '#22C55E',
  },
  blue: {
    text: 'text-accent-blue',
    bg: 'bg-accent-blue',
    bgLight: 'bg-accent-blue-bg',
    border: 'border-accent-blue-bg',
    spark: '#3B82F6',
  },
  purple: {
    text: 'text-accent-purple',
    bg: 'bg-accent-purple',
    bgLight: 'bg-accent-purple-bg',
    border: 'border-accent-purple-bg',
    spark: '#8B5CF6',
  },
  orange: {
    text: 'text-accent-orange',
    bg: 'bg-accent-orange',
    bgLight: 'bg-accent-orange-bg',
    border: 'border-accent-orange-bg',
    spark: '#F97316',
  },
};

function DashboardStatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs mes anterior',
  color,
  linkTo,
  linkLabel,
  sparklineData,
}: DashboardStatCardProps) {
  const c = colorConfig[color];

  return (
    <div className="bg-white rounded-2xl border border-dashboard-border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={cn('text-[11px] font-bold uppercase tracking-wider mb-1', c.text)}>
            {label}
          </p>
          <p className="text-4xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', c.bg)}>
          <Icon size={22} className="text-white" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', c.bgLight, c.text)}>
          <TrendingUp size={10} />
          {trend}%
        </span>
        <span className="text-xs text-gray-400">{trendLabel}</span>
      </div>

      <div className="flex items-center justify-between">
        <Sparkline data={sparklineData} color={c.spark} />
        <Link
          to={linkTo}
          className={cn('inline-flex items-center gap-1 text-[13px] font-medium transition-colors hover:gap-1.5', c.text)}
        >
          {linkLabel}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [showWelcome, setShowWelcome] = useState(true);

  const { kennelId } = useKennel();

  const { data: kennelStats } = useQuery(
    ['kennelStats', kennelId],
    () => kennelsApi.getStats(kennelId!).then((r) => r.data.stats),
    { enabled: !!kennelId }
  );

  const { data: managerReport } = useQuery(
    ['managerReport', kennelId],
    () => reportsApi.getManagerReport({ kennelId }).then((r) => r.data.report),
    { enabled: isManager && !!kennelId }
  );

  // Tasks query
  const { data: tasksData } = useQuery(
    ['dashboardTasks', kennelId],
    () => tasksApi.getAll({ kennelId: kennelId!, status: 'PENDING' }).then((r) => r.data),
    { enabled: !!kennelId }
  );

  // Finance summary query
  const { data: financeSummary } = useQuery(
    ['financeSummary', kennelId],
    () => financeApi.getFinancialSummary(kennelId!, { period: 'month' }).then((r) => r.data),
    { enabled: !!kennelId }
  );

  // Default values when loading
  const totalDogs = managerReport?.totals?.dogs ?? kennelStats?.dogs?.reduce((acc: number, d: any) => acc + (d._count?.status || 0), 0) ?? 0;
  const totalCustomers = managerReport?.totals?.customers ?? 0;
  const totalUsers = managerReport?.totals?.users ?? 0;
  const monthlyIncome = financeSummary?.summary?.income ?? 12500;

  return (
    <div className="animate-fade-in pb-8">
      {/* Page header with welcome banner */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight mb-1">
            Hola, {user?.firstName} 👋
          </h1>
          <p className="text-base text-gray-500">
            Aquí está el resumen de tu criadero hoy
          </p>
        </div>

        {showWelcome && (
          <div className="hidden lg:flex items-center gap-3 bg-accent-green-bg border border-green-200 rounded-xl px-5 py-3 animate-fade-in-scale">
            <div className="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-green-800">
              ¡Bienvenido, {user?.firstName}! 👋
            </span>
            <button
              onClick={() => setShowWelcome(false)}
              className="p-1 rounded-lg hover:bg-green-200/50 transition-colors ml-2"
            >
              <X size={14} className="text-green-600" />
            </button>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <DashboardStatCard
          label="INGRESOS ESTE MES"
          value={`€${(monthlyIncome || 12500).toLocaleString('es-ES')}`}
          icon={Wallet}
          trend={8}
          trendLabel="vs mes anterior"
          color="green"
          linkTo="/finance"
          linkLabel="Ver finanzas"
          sparklineData={[8500, 9200, 8800, 10500, 11200, 11800, 12500]}
        />
        <DashboardStatCard
          label="TOTAL PERROS"
          value={totalDogs || 8}
          icon={Dog}
          trend={8}
          color="blue"
          linkTo="/dogs"
          linkLabel="Ver todos"
          sparklineData={[40, 35, 45, 50, 48, 55, 60]}
        />
        <DashboardStatCard
          label="TOTAL USUARIOS"
          value={totalUsers || 5}
          icon={Users}
          trend={5}
          color="purple"
          linkTo="/users"
          linkLabel="Ver todos"
          sparklineData={[20, 25, 22, 30, 28, 35, 38]}
        />
        <DashboardStatCard
          label="CLIENTES"
          value={totalCustomers || 3}
          icon={Heart}
          trend={15}
          color="orange"
          linkTo="/customers"
          linkLabel="Ver todos"
          sparklineData={[15, 18, 16, 22, 25, 28, 32]}
        />
      </div>

      {/* Bottom row: Activity chart + Active breeders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-dashboard-border p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Actividad semanal</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">Nuevas reservas y registros</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashboard-border text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Calendar size={16} className="text-gray-400" />
              <span>Última semana</span>
            </button>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRegistros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradReservas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDE9" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#9AA89E"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#9AA89E"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickCount={5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E8EDE9',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="registros"
                  stroke="#22C55E"
                  strokeWidth={2.5}
                  fill="url(#gradRegistros)"
                  dot={{ r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#22C55E', strokeWidth: 2, stroke: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="reservas"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#gradReservas)"
                  dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-dashboard-border">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
              <span className="text-sm text-gray-600">Registros</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
              <span className="text-sm text-gray-600">Reservas</span>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl border border-dashboard-border p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-green-bg flex items-center justify-center">
                <CheckSquare size={16} className="text-accent-green" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Tareas pendientes</h3>
            </div>
            <span className="px-2.5 py-1 bg-accent-green-bg text-accent-green text-xs font-bold rounded-full">
              {(tasksData?.tasks?.length || 4)} pendientes
            </span>
          </div>

          {/* Tasks list */}
          <div className="space-y-2.5">
            {(tasksData?.tasks?.slice(0, 5) || [
              { id: '1', title: 'Revisar vacunas de Luna', dueDate: '2026-04-25', priority: 'HIGH' },
              { id: '2', title: 'Actualizar pedigrí de Max', dueDate: '2026-04-26', priority: 'MEDIUM' },
              { id: '3', title: 'Llamar a Juan Pérez', dueDate: '2026-04-26', priority: 'LOW' },
              { id: '4', title: 'Preparar envío camada #3', dueDate: '2026-04-28', priority: 'HIGH' },
            ]).map((task: any) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  task.priority === 'HIGH' ? 'bg-red-100' :
                  task.priority === 'MEDIUM' ? 'bg-amber-100' : 'bg-blue-100'
                )}>
                  {task.priority === 'HIGH' ? (
                    <AlertCircle size={16} className="text-red-600" />
                  ) : (
                    <Clock size={16} className={cn(
                      task.priority === 'MEDIUM' ? 'text-amber-600' : 'text-blue-600'
                    )} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha'}
                  </p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 uppercase",
                  task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                  task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                )}>
                  {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/tasks"
            className="flex items-center justify-center gap-1 mt-4 text-sm font-medium text-accent-green hover:text-green-700 transition-colors"
          >
            Ver todas las tareas
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
