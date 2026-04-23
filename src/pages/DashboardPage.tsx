import { useAuthStore } from '@/store/authStore';
import { useQuery } from 'react-query';
import { reportsApi, kennelsApi } from '@/services/api';
import {
  Dog,
  Users,
  CalendarDays,
  Baby,
  TrendingUp,
  DollarSign,
  Stethoscope,
  Building2,
  ArrowUpRight,
  Activity,
  PawPrint,
  Heart,
  FileText,
  Bell,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/common/StatCard';
import { PageHeader } from '@/components/common/PageHeader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/utils/cn';

// Chart colors
const COLORS = ['#4A5D52', '#5A7D6E', '#B87B5C', '#8B7355', '#A14E4E', '#6B8291'];

// Mock data for charts - in production this would come from API
const generateTrendData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    name: format(subDays(new Date(), 6 - i), 'EEE', { locale: es }),
    value: Math.floor(Math.random() * 50) + 20,
    reservations: Math.floor(Math.random() * 20) + 5,
  }));
};

const trendData = generateTrendData();

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
  color: string;
  gradient: string;
}

function QuickActionCard({ title, description, icon: Icon, to, gradient }: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className="group bento-card p-4 flex flex-col justify-between h-full min-h-[120px] card-interactive"
    >
      <div className="flex items-start justify-between"
      >
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-md transition-transform duration-300 group-hover:scale-110',
            gradient
          )}
        >
          <Icon size={20} className="text-[#FDFCFA]" />
        </div>
        <ArrowUpRight
          size={18}
          className="text-apple-gray-300 group-hover:text-[var(--apple-link)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      <div className="mt-3"
      >
        <h3 className="font-semibold text-[var(--apple-black)] text-sm group-hover:text-[var(--apple-link)] transition-colors"
        >
          {title}
        </h3>
        <p className="text-xs text-apple-gray-100 mt-0.5 line-clamp-1">{description}</p>
      </div>
    </Link>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ icon: Icon, iconColor, bgColor, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-apple-gray-300/30 last:border-0"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0"
      >
        <p className="font-medium text-[var(--apple-black)] text-sm">{title}</p>
        <p className="text-xs text-apple-gray-100 mt-0.5">{description}</p>
      </div>
      <span className="text-[11px] text-apple-gray-100 flex-shrink-0 font-medium">{time}</span>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const isBreeder = user?.role === 'BREEDER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder || isManager }
  );

  const kennelId = myKennels?.[0]?.id;

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

  const getStatCount = (stats: any[], key: string) => {
    return stats?.find((s) => s.status === key)?._count?.status || 0;
  };

  // Prepare chart data
  const dogStatusData = kennelStats?.dogs?.map((stat: any) => ({
    name:
      stat.status === 'AVAILABLE'
        ? 'Disponibles'
        : stat.status === 'RESERVED'
          ? 'Reservados'
          : stat.status === 'REPRODUCTIVE'
            ? 'Reproductivos'
            : stat.status === 'SOLD'
              ? 'Vendidos'
              : stat.status,
    value: stat._count.status,
  })) || [];

  const reservationStatusData = kennelStats?.reservations?.map((stat: any) => ({
    name:
      stat.status === 'PENDING'
        ? 'Pendientes'
        : stat.status === 'CONFIRMED'
          ? 'Confirmadas'
          : stat.status === 'COMPLETED'
            ? 'Completadas'
            : stat.status === 'CANCELLED'
              ? 'Canceladas'
              : stat.status,
    value: stat._count.status,
  })) || [];

  if (isManager && managerReport) {
    return (
      <div className="animate-fade-in pb-8"
      >
        <PageHeader
          title={`Hola, ${user?.firstName} 👋`}
          subtitle="Aquí está el resumen de tu criadero hoy"
          variant="bento"
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children"
        >
          <StatCard
            title="Total Criaderos"
            value={managerReport.totals.kennels}
            icon={Building2}
            color="blue"
            variant="bento"
            trend={{ value: 12, label: 'vs mes anterior', positive: true }}
            link={{ to: '/kennels', label: 'Ver todos' }}
            sparkline={[12, 18, 15, 22, 28, 25, 32]}
          />
          <StatCard
            title="Total Perros"
            value={managerReport.totals.dogs}
            icon={Dog}
            color="green"
            variant="bento"
            trend={{ value: 8, label: 'vs mes anterior', positive: true }}
            link={{ to: '/dogs', label: 'Ver todos' }}
            sparkline={[45, 52, 48, 60, 58, 65, 72]}
          />
          <StatCard
            title="Total Usuarios"
            value={managerReport.totals.users}
            icon={Users}
            color="purple"
            variant="bento"
            trend={{ value: 5, label: 'vs mes anterior', positive: true }}
            link={{ to: '/users', label: 'Ver todos' }}
            sparkline={[24, 28, 26, 32, 35, 34, 40]}
          />
          <StatCard
            title="Clientes"
            value={managerReport.totals.customers}
            icon={Heart}
            color="orange"
            variant="bento"
            trend={{ value: 15, label: 'vs mes anterior', positive: true }}
            link={{ to: '/customers', label: 'Ver todos' }}
            sparkline={[18, 22, 20, 28, 32, 30, 38]}
          />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* Weekly Activity - Large Tile */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-6"
          >
            <div className="flex items-center justify-between mb-4"
            >
              <div>
                <h3 className="bento-title">Actividad Semanal</h3>
                <p className="text-xs text-apple-gray-100 mt-0.5">Nuevas reservas y registros</p>
              </div>
              <select className="input-apple select-apple text-xs py-1.5 px-3 w-auto"
              >
                <option>Última semana</option>
                <option>Último mes</option>
                <option>Último año</option>
              </select>
            </div>
            <div className="h-56"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A5D52" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4A5D52" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5A7D6E" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5A7D6E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--apple-gray-300)" />
                  <XAxis dataKey="name" stroke="var(--apple-gray-100)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--apple-gray-100)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--apple-gray)',
                      border: '1px solid var(--apple-gray-300)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(44,42,38,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#4A5D52"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="reservations"
                    stroke="#5A7D6E"
                    fillOpacity={1}
                    fill="url(#colorReservations)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Kennels */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-6"
          >
            <h3 className="bento-title mb-4">Criaderos Activos</h3>
            <div className="space-y-3"
            >
              {managerReport.kennelActivity?.slice(0, 5).map((kennel: any, index: number) => (
                <div
                  key={kennel.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-apple-gray/40 hover:bg-apple-gray transition-colors"
                >
                  <div className="flex items-center gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-[#FDFCFA] text-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {kennel.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--apple-black)] text-sm">{kennel.name}</p>
                      <p className="text-xs text-apple-gray-100">
                        {kennel._count.dogs} perros • {kennel._count.customers} clientes
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[11px] font-semibold',
                      kennel.status === 'ACTIVE'
                        ? 'bg-[#E8F0EC] text-[#4A5D52]'
                        : 'bg-[#E8E4DC] text-[#6B6560]'
                    )}
                  >
                    {kennel.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/kennels"
              className="flex items-center justify-center gap-2 mt-4 py-2.5 text-xs font-semibold text-[var(--apple-link)] hover:text-[#5A7D6E] transition-colors border border-dashed border-apple-gray-300 rounded-xl hover:border-[var(--apple-link)]"
            >
              Ver todos los criaderos
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* User Stats */}
          <div className="bento-card p-6"
          >
            <h3 className="bento-title mb-4">Usuarios por Rol</h3>
            <div className="space-y-3"
            >
              {managerReport.userStats?.map((stat: any) => {
                const roleLabels: Record<string, string> = {
                  MANAGER: 'Administradores',
                  BREEDER: 'Criadores',
                  VETERINARIAN: 'Veterinarios',
                  CUSTOMER: 'Clientes',
                };
                const roleColors: Record<string, string> = {
                  MANAGER: '#4A5D52',
                  BREEDER: '#5A7D6E',
                  VETERINARIAN: '#8B7355',
                  CUSTOMER: '#B87B5C',
                };
                const percentage =
                  managerReport.totals.users > 0
                    ? (stat._count.role / managerReport.totals.users) * 100
                    : 0;
                return (
                  <div key={stat.role} className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: roleColors[stat.role] || '#9A948D' }}
                      />
                      <span className="text-xs text-apple-gray-200">{roleLabels[stat.role] || stat.role}</span>
                    </div>
                    <div className="flex items-center gap-2"
                    >
                      <div className="w-16 h-1.5 bg-apple-gray-300 rounded-full overflow-hidden"
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: roleColors[stat.role] || '#9A948D',
                          }}
                        />
                      </div>
                      <span className="font-semibold text-[var(--apple-black)] text-xs w-6 text-right">
                        {stat._count.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats / Mini Chart */}
          <div className="bento-card p-6"
          >
            <h3 className="bento-title mb-3">Nuevos Registros</h3>
            <div className="h-32"
            >
              <ResponsiveContainer width="100%" height="100%"
              >
                <BarChart data={trendData}
                >
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(44,42,38,0.03)' }}
                    contentStyle={{
                      backgroundColor: 'var(--apple-gray)',
                      border: '1px solid var(--apple-gray-300)',
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(44,42,38,0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="#4A5D52" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-2"
            >
              <span className="text-xs text-apple-gray-100">Esta semana</span>
              <span className="text-sm font-semibold text-[var(--apple-black)]">+128</span>
            </div>
          </div>

          {/* Recent Activity - Wide Tile */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-6"
          >
            <div className="flex items-center justify-between mb-3"
            >
              <div>
                <h3 className="bento-title">Actividad Reciente</h3>
                <p className="text-xs text-apple-gray-100 mt-0.5">Últimas acciones en el sistema</p>
              </div>
              <Link
                to="/reports"
                className="text-xs font-semibold text-[var(--apple-link)] hover:text-[#5A7D6E] transition-colors"
              >
                Ver reportes →
              </Link>
            </div>
            <div className="divide-y divide-apple-gray-300/30"
            >
              <ActivityItem
                icon={Users}
                iconColor="#4A5D52"
                bgColor="#E8F0EC"
                title="Nuevo cliente registrado"
                description="Juan Pérez se ha registrado como cliente"
                time="Hace 5 min"
              />
              <ActivityItem
                icon={DollarSign}
                iconColor="#5A7D6E"
                bgColor="#E8F0EC"
                title="Reserva confirmada"
                description="Reserva #1234 confirmada para Golden Retriever"
                time="Hace 15 min"
              />
              <ActivityItem
                icon={Dog}
                iconColor="#8B7355"
                bgColor="#F1EBE5"
                title="Nuevo perro registrado"
                description="Max (Labrador) añadido al criadero"
                time="Hace 1 hora"
              />
              <ActivityItem
                icon={Stethoscope}
                iconColor="#B87B5C"
                bgColor="#FAF5E3"
                title="Vacuna aplicada"
                description="Vacuna polivalente registrada para Bella"
                time="Hace 2 horas"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-6"
          >
            <h3 className="bento-title mb-4">Accesos Rápidos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <QuickActionCard
                title="Nuevo Perro"
                description="Registrar ejemplar"
                icon={Dog}
                to="/dogs/create"
                color="#4A5D52"
                gradient="from-[#4A5D52] to-[#5A7D6E]"
              />
              <QuickActionCard
                title="Nueva Camada"
                description="Registrar nacimiento"
                icon={Baby}
                to="/litters/create"
                color="#5A7D6E"
                gradient="from-[#5A7D6E] to-[#4A5D52]"
              />
              <QuickActionCard
                title="Nuevo Cliente"
                description="Agregar cliente"
                icon={Users}
                to="/customers/create"
                color="#8B7355"
                gradient="from-[#8B7355] to-[#B87B5C]"
              />
              <QuickActionCard
                title="Documento"
                description="Subir nuevo archivo"
                icon={FileText}
                to="/documents"
                color="#B87B5C"
                gradient="from-[#B87B5C] to-[#C9A227]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isBreeder && kennelStats) {
    const totalDogs = kennelStats.dogs?.reduce((acc: number, d: any) => acc + d._count.status, 0) || 0;

    return (
      <div className="animate-fade-in pb-8"
      >
        <PageHeader
          title={`Hola, ${user?.firstName} 👋`}
          subtitle="Aquí está el resumen de tu criadero hoy"
          variant="bento"
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children"
        >
          <StatCard
            title="Perros Totales"
            value={totalDogs}
            icon={Dog}
            color="blue"
            variant="bento"
            trend={{ value: 8, label: 'vs mes anterior', positive: true }}
            link={{ to: '/dogs', label: 'Ver todos' }}
            sparkline={[12, 15, 14, 18, 22, 20, 25]}
          />
          <StatCard
            title="Disponibles"
            value={getStatCount(kennelStats.dogs, 'AVAILABLE')}
            icon={TrendingUp}
            color="green"
            variant="bento"
            link={{ to: '/dogs?status=AVAILABLE', label: 'Ver disponibles' }}
            sparkline={[5, 8, 7, 10, 12, 11, 14]}
          />
          <StatCard
            title="Reservas Pendientes"
            value={getStatCount(kennelStats.reservations, 'PENDING')}
            icon={CalendarDays}
            color="orange"
            variant="bento"
            trend={{ value: 3, label: 'nuevas esta semana', positive: true }}
            link={{ to: '/reservations?status=PENDING', label: 'Ver reservas' }}
            sparkline={[2, 3, 2, 4, 5, 4, 6]}
          />
          <StatCard
            title="Vacunas Próximas"
            value={kennelStats.upcomingVaccines || 0}
            icon={Stethoscope}
            color="purple"
            variant="bento"
            link={{ to: '/vet', label: 'Ver calendario' }}
            sparkline={[1, 2, 1, 3, 2, 4, 3]}
          />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* Dog Status Chart */}
          <div className="bento-card p-6"
          >
            <h3 className="bento-title mb-1">Estado de Perros</h3>
            <p className="text-xs text-apple-gray-100 mb-4">Distribución por estado</p>
            <div className="h-40 flex items-center justify-center"
            >
              {dogStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dogStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dogStatusData.map((_entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--apple-gray)',
                        border: '1px solid var(--apple-gray-300)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(44,42,38,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-apple-gray-100 text-sm">No hay datos disponibles</div>
              )}
            </div>
            <div className="space-y-1.5 mt-2"
            >
              {dogStatusData.slice(0, 3).map((entry: { name: string; value: number }, index: number) => (
                <div key={entry.name} className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-apple-gray-200">{entry.name}</span>
                  </div>
                  <span className="font-medium text-[var(--apple-black)]">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reservations Chart */}
          <div className="bento-card p-6"
          >
            <h3 className="bento-title mb-1">Reservas</h3>
            <p className="text-xs text-apple-gray-100 mb-4">Estado de reservas</p>
            <div className="h-40"
            >
              {reservationStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reservationStatusData} layout="vertical" margin={{ left: 0, right: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--apple-gray-300)" horizontal={false} />
                    <XAxis type="number" stroke="var(--apple-gray-100)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="var(--apple-gray-100)"
                      fontSize={10}
                      width={70}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--apple-gray)',
                        border: '1px solid var(--apple-gray-300)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(44,42,38,0.1)',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}
                    >
                      {reservationStatusData.map((_entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-apple-gray-100 text-sm">
                  No hay reservas registradas
                </div>
              )}
            </div>
          </div>

          {/* Weekly Trend - Large Tile */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-6"
          >
            <div className="flex items-center justify-between mb-4"
            >
              <div>
                <h3 className="bento-title">Tendencia Semanal</h3>
                <p className="text-xs text-apple-gray-100 mt-0.5">Registros vs reservas</p>
              </div>
            </div>
            <div className="h-48"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}
                >
                  <defs>
                    <linearGradient id="breederValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A5D52" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4A5D52" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="breederReservations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5A7D6E" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5A7D6E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--apple-gray-300)" />
                  <XAxis dataKey="name" stroke="var(--apple-gray-100)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--apple-gray-100)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--apple-gray)',
                      border: '1px solid var(--apple-gray-300)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(44,42,38,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#4A5D52"
                    fillOpacity={1}
                    fill="url(#breederValue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="reservations"
                    stroke="#5A7D6E"
                    fillOpacity={1}
                    fill="url(#breederReservations)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActionCard
            title="Nuevo Perro"
            description="Registrar un nuevo ejemplar"
            icon={Dog}
            to="/dogs/create"
            color="#4A5D52"
            gradient="from-[#4A5D52] to-[#5A7D6E]"
          />
          <QuickActionCard
            title="Nueva Camada"
            description="Registrar nacimiento de cachorros"
            icon={Baby}
            to="/litters/create"
            color="#5A7D6E"
            gradient="from-[#5A7D6E] to-[#4A5D52]"
          />
          <QuickActionCard
            title="Nuevo Cliente"
            description="Agregar un nuevo cliente"
            icon={Users}
            to="/customers/create"
            color="#8B7355"
            gradient="from-[#8B7355] to-[#B87B5C]"
          />
          <QuickActionCard
            title="Ver Reservas"
            description="Gestionar reservas pendientes"
            icon={DollarSign}
            to="/reservations"
            color="#B87B5C"
            gradient="from-[#B87B5C] to-[#C9A227]"
          />

          {/* Recent Activity - Wide Tile */}
          <div className="md:col-span-2 lg:col-span-2 bento-card p-6"
          >
            <div className="flex items-center justify-between mb-3"
            >
              <div>
                <h3 className="bento-title">Actividad Reciente</h3>
                <p className="text-xs text-apple-gray-100 mt-0.5">Últimas acciones en tu criadero</p>
              </div>
              <Link
                to="/reports"
                className="text-xs font-semibold text-[var(--apple-link)] hover:text-[#5A7D6E] transition-colors"
              >
                Ver reportes →
              </Link>
            </div>
            <div className="divide-y divide-apple-gray-300/30"
            >
              <ActivityItem
                icon={PawPrint}
                iconColor="#4A5D52"
                bgColor="#E8F0EC"
                title="Nueva reserva recibida"
                description="Juan Pérez solicitó reservar a Max"
                time="Hace 10 min"
              />
              <ActivityItem
                icon={Stethoscope}
                iconColor="#5A7D6E"
                bgColor="#E8F0EC"
                title="Vacuna registrada"
                description="Vacuna polivalente aplicada a Luna"
                time="Hace 2 horas"
              />
              <ActivityItem
                icon={Baby}
                iconColor="#8B7355"
                bgColor="#F1EBE5"
                title="Camada actualizada"
                description="Camada de San Valentín - 6 cachorros"
                time="Hace 5 horas"
              />
              <ActivityItem
                icon={Activity}
                iconColor="#B87B5C"
                bgColor="#FAF5E3"
                title="Cliente actualizado"
                description="Datos de contacto actualizados para Laura G."
                time="Ayer"
              />
            </div>
          </div>

          {/* Small reminder / tip tile */}
          <div className="md:col-span-2 lg:col-span-2 bento-card-accent p-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#B87B5C] flex items-center justify-center flex-shrink-0 shadow-md"
            >
              <Bell size={20} className="text-[#FDFCFA]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--apple-black)] text-sm">Recordatorio</h3>
              <p className="text-xs text-apple-gray-100 mt-1">
                Tienes {kennelStats.upcomingVaccines || 0} vacunas programadas para esta semana.{' '}
                <Link to="/vet" className="text-[var(--apple-link)] hover:text-[#5A7D6E] font-medium">
                  Ver calendario →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-96"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A5D52]"></div>
    </div>
  );
}
