import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { financeApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  ShoppingCart,
  FileText,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Download,
  CreditCard,
  Receipt,
  ArrowRight,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';
import { format, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
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

const COLORS = ['#4A5D52', '#5A7D6E', '#B87B5C', '#8B7355', '#A14E4E', '#6B8291', '#C9A227', '#6B6560'];

const categoryLabels: Record<string, string> = {
  SALES: 'Ventas',
  SERVICES: 'Servicios',
  BREEDING: 'Cría',
  FOOD: 'Alimentación',
  VETERINARY: 'Veterinario',
  SUPPLIES: 'Suministros',
  EQUIPMENT: 'Equipamiento',
  OTHER: 'Otros',
};

interface PeriodOption {
  value: string;
  label: string;
  shortLabel: string;
}

const periodOptions: PeriodOption[] = [
  { value: 'week', label: 'Esta semana', shortLabel: 'Semana' },
  { value: 'month', label: 'Este mes', shortLabel: 'Mes' },
  { value: 'year', label: 'Este año', shortLabel: 'Año' },
];

export function FinanceDashboardPage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [period, setPeriod] = useState('month');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: summary, isLoading: summaryLoading } = useQuery(
    ['financeSummary', kennelId, period],
    () => financeApi.getFinancialSummary(kennelId!, { period }).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const { data: transactionsData } = useQuery(
    ['recentTransactions', kennelId],
    () => financeApi.getTransactions(kennelId!, { limit: 5 }).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const { data: invoicesData } = useQuery(
    ['recentInvoices', kennelId],
    () => financeApi.getInvoices(kennelId!, { limit: 5 }).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const { data: inventoryData } = useQuery(
    ['lowStockInventory', kennelId],
    () => financeApi.getInventoryItems(kennelId!, { lowStock: true, limit: 5 }).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const { data: overdueInvoices } = useQuery(
    ['overdueInvoices', kennelId],
    () => financeApi.getOverdueInvoices(kennelId!).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const { data: invoiceStats } = useQuery(
    ['invoiceStats', kennelId],
    () => financeApi.getInvoiceStats(kennelId!).then((r) => r.data),
    { enabled: !!kennelId }
  );

  // Transform data for charts
  const monthlyData = summary?.monthlyTrend || [];

  const incomeByCategory = useMemo(() => {
    if (!summary?.breakdown?.incomeByCategory) return [];
    return Object.entries(summary.breakdown.incomeByCategory).map(([name, value]) => ({
      name: categoryLabels[name] || name,
      value,
    }));
  }, [summary]);

  const expensesByCategory = useMemo(() => {
    if (!summary?.breakdown?.expensesByCategory) return [];
    return Object.entries(summary.breakdown.expensesByCategory).map(([name, value]) => ({
      name: categoryLabels[name] || name,
      value,
    }));
  }, [summary]);

  // Cash flow data (cumulative)
  const cashFlowData = useMemo(() => {
    if (!monthlyData.length) return [];
    let balance = 0;
    return monthlyData.map((month: any) => {
      balance += (month.income || 0) - (month.expenses || 0);
      return {
        month: month.month,
        balance,
        income: month.income || 0,
        expenses: month.expenses || 0,
      };
    });
  }, [monthlyData]);

  const recentTransactions = transactionsData?.transactions || [];
  const recentInvoices = invoicesData?.invoices || [];
  const lowStockItems = inventoryData?.items || [];

  const stats = {
    income: summary?.summary?.income || 0,
    expenses: summary?.summary?.expenses || 0,
    balance: summary?.summary?.balance || 0,
    pendingInvoices: overdueInvoices?.totalOverdue || 0,
    totalPaid: invoiceStats?.totalPaid || 0,
    totalPending: invoiceStats?.totalPending || 0,
    transactionCount: summary?.summary?.transactionCount || 0,
  };

  // Calculate trends by comparing with previous period
  const trends = summary?.trends || { income: 0, expenses: 0, balance: 0 };

  const currentPeriodLabel = periodOptions.find(p => p.value === period)?.label || 'Este mes';

  const handleExport = (type: string) => {
    addNotification({
      type: 'success',
      message: `Exportando ${type}...`,
    });
    setShowExportMenu(false);
  };

  if (summaryLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Finanzas" subtitle="Gestión financiera del criadero" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-apple-black">Finanzas</h1>
          <p className="text-apple-gray-100">Resumen financiero - {currentPeriodLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-apple-gray rounded-lg p-1">
            {periodOptions.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  period === p.value
                    ? 'bg-white text-apple-black shadow-sm'
                    : 'text-apple-gray-200 hover:text-apple-black'
                )}
              >
                {p.shortLabel}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn-outline flex items-center gap-2"
            >
              <Download size={16} />
              Exportar
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-apple-gray-300/50 py-1 z-10">
                <button
                  onClick={() => handleExport('resumen')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-apple-gray transition-colors"
                >
                  Resumen financiero
                </button>
                <button
                  onClick={() => handleExport('transacciones')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-apple-gray transition-colors"
                >
                  Transacciones
                </button>
                <button
                  onClick={() => handleExport('facturas')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-apple-gray transition-colors"
                >
                  Facturas
                </button>
              </div>
            )}
          </div>

          {isBreeder && (
            <Link to="/finance/transactions/new" className="btn-primary">
              <Plus size={18} />
              Nueva transacción
            </Link>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Ingresos"
          value={`€${stats.income.toLocaleString()}`}
          icon={TrendingUp}
          color="green"
          trend={{
            value: Math.abs(trends.income || 0),
            label: 'vs período anterior',
            positive: (trends.income || 0) >= 0,
          }}
        />
        <StatCard
          title="Gastos"
          value={`€${stats.expenses.toLocaleString()}`}
          icon={TrendingDown}
          color="red"
          trend={{
            value: Math.abs(trends.expenses || 0),
            label: 'vs período anterior',
            positive: (trends.expenses || 0) <= 0,
          }}
        />
        <StatCard
          title="Balance"
          value={`€${stats.balance.toLocaleString()}`}
          icon={Wallet}
          color={stats.balance >= 0 ? 'blue' : 'red'}
          trend={{
            value: Math.abs(trends.balance || 0),
            label: 'vs período anterior',
            positive: (trends.balance || 0) >= 0,
          }}
        />
        <StatCard
          title="Transacciones"
          value={stats.transactionCount}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="text-blue-600" size={18} />
            <span className="text-sm text-blue-700 font-medium">Total Facturado</span>
          </div>
          <p className="text-xl font-bold text-blue-900">
            €{(invoiceStats?.totalInvoiced || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="text-green-600" size={18} />
            <span className="text-sm text-green-700 font-medium">Pagado</span>
          </div>
          <p className="text-xl font-bold text-green-900">
            €{stats.totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-amber-600" size={18} />
            <span className="text-sm text-amber-700 font-medium">Pendiente</span>
          </div>
          <p className="text-xl font-bold text-amber-900">
            €{stats.totalPending.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-4 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600" size={18} />
            <span className="text-sm text-red-700 font-medium">Vencido</span>
          </div>
          <p className="text-xl font-bold text-red-900">
            €{stats.pendingInvoices.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-apple-black">Evolución del balance</h3>
              <p className="text-sm text-apple-gray-100">
                {period === 'year' ? 'Balance acumulado mensual' : 'Balance acumulado diario'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-apple-blue" />
                <span className="text-apple-gray-200">Balance</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cashFlowData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A5D52" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4A5D52" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCD7CF" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={period === 'month' ? 4 : 0}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `€${v}`}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => `€${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(44,42,38,0.1)' }}
                  labelFormatter={(label) => `${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#4A5D52"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-apple-black mb-2">Distribución</h3>
          <p className="text-sm text-apple-gray-100 mb-6">Ingresos y gastos por categoría</p>

          <div className="space-y-6">
            {/* Income Categories */}
            <div>
              <p className="text-sm font-medium text-apple-black mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-green-500" />
                Ingresos
              </p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {incomeByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Categories */}
            <div>
              <p className="text-sm font-medium text-apple-black mb-3 flex items-center gap-2">
                <TrendingDown size={14} className="text-red-500" />
                Gastos
              </p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {expensesByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Bar Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-apple-black">
              {period === 'year' ? 'Tendencia anual' : period === 'week' ? 'Tendencia semanal' : 'Tendencia mensual'}
            </h3>
            <p className="text-sm text-apple-gray-100">
              {period === 'year' ? 'Comparación mensual' : 'Comparación diaria'} de ingresos vs gastos
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-apple-gray-200">Ingresos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-apple-gray-200">Gastos</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#DCD7CF" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={period === 'month' ? 4 : 0}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${v}`}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => `€${value.toLocaleString()}`}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(44,42,38,0.1)' }}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="income" name="Ingresos" fill="#5A7D6E" radius={[2, 2, 0, 0]} maxBarSize={period === 'year' ? 40 : 20} />
              <Bar dataKey="expenses" name="Gastos" fill="#A14E4E" radius={[2, 2, 0, 0]} maxBarSize={period === 'year' ? 40 : 20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-apple-black flex items-center gap-2">
              <RefreshCw size={18} className="text-apple-blue" />
              Últimas transacciones
            </h3>
            <Link
              to="/finance/transactions"
              className="text-sm text-apple-link hover:text-apple-blue flex items-center gap-1"
            >
              Ver todas
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-apple-gray-100 text-center py-4">No hay transacciones recientes</p>
            ) : (
              recentTransactions.slice(0, 5).map((t: any) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-apple-gray hover:bg-apple-gray-300/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        t.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                      )}
                    >
                      {t.type === 'INCOME' ? (
                        <ArrowUpRight size={18} className="text-green-600" />
                      ) : (
                        <ArrowDownRight size={18} className="text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-apple-black text-sm">{t.description}</p>
                      <p className="text-xs text-apple-gray-100">
                        {format(new Date(t.date), 'dd MMM', { locale: es })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'font-semibold text-sm',
                      t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {t.type === 'INCOME' ? '+' : '-'}€{t.amount.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-apple-black flex items-center gap-2">
              <FileText size={18} className="text-apple-blue" />
              Facturas recientes
            </h3>
            <Link
              to="/finance/invoices"
              className="text-sm text-apple-link hover:text-apple-blue flex items-center gap-1"
            >
              Ver todas
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.length === 0 ? (
              <p className="text-sm text-apple-gray-100 text-center py-4">No hay facturas recientes</p>
            ) : (
              recentInvoices.slice(0, 5).map((inv: any) => {
                const isOverdue = inv.status === 'OVERDUE' || (inv.status === 'PENDING' && isPast(new Date(inv.dueDate)));
                return (
                  <Link
                    key={inv.id}
                    to={`/finance/invoices/${inv.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-apple-gray hover:bg-apple-gray-300/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          inv.status === 'PAID' ? 'bg-green-100' : isOverdue ? 'bg-red-100' : 'bg-amber-100'
                        )}
                      >
                        <FileText
                          size={18}
                          className={
                            inv.status === 'PAID' ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-amber-600'
                          }
                        />
                      </div>
                      <div>
                        <p className="font-medium text-apple-black text-sm">{inv.number}</p>
                        <p className="text-xs text-apple-gray-100">
                          {inv.customer?.firstName} {inv.customer?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-apple-black text-sm">€{inv.total.toLocaleString()}</p>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          inv.status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : isOverdue
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        )}
                      >
                        {inv.status === 'PAID' ? 'Pagada' : isOverdue ? 'Vencida' : 'Pendiente'}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-apple-black flex items-center gap-2">
                <Package size={18} className="text-amber-500" />
                Stock bajo
              </h3>
              {lowStockItems.length > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  {lowStockItems.length}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-apple-gray-100 text-center py-4">No hay productos con stock bajo</p>
              ) : (
                lowStockItems.slice(0, 4).map((item: any) => (
                  <Link
                    key={item.id}
                    to={`/finance/inventory/${item.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="text-sm font-medium text-apple-black">{item.name}</span>
                    </div>
                    <span className="text-sm text-red-600 font-semibold">
                      {item.quantity} {item.unit}
                    </span>
                  </Link>
                ))
              )}
            </div>
            <Link
              to="/finance/inventory"
              className="mt-4 text-sm text-apple-link hover:text-apple-blue flex items-center justify-center gap-1"
            >
              Ver inventario
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-apple-black mb-4">Acciones rápidas</h3>
            <div className="space-y-3">
              <Link
                to="/finance/transactions/new"
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 border border-green-100 hover:from-green-100 hover:to-green-200/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-sm">
                  <Plus className="text-white" size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-apple-black">Nueva transacción</p>
                  <p className="text-xs text-apple-gray-100">Registrar ingreso o gasto</p>
                </div>
              </Link>
              <Link
                to="/finance/invoices/new"
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-100 hover:from-blue-100 hover:to-blue-200/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
                  <FileText className="text-white" size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-apple-black">Nueva factura</p>
                  <p className="text-xs text-apple-gray-100">Crear y enviar factura</p>
                </div>
              </Link>
              <Link
                to="/finance/inventory/new"
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-100 hover:from-purple-100 hover:to-purple-200/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shadow-sm">
                  <ShoppingCart className="text-white" size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-apple-black">Nuevo producto</p>
                  <p className="text-xs text-apple-gray-100">Agregar al inventario</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
