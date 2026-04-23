import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { financeApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: 'Completado', color: 'text-green-700', bg: 'bg-green-50' },
  PENDING: { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-50' },
  CANCELLED: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-50' },
};

export function TransactionsPage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: transactionsData, isLoading } = useQuery(
    ['transactions', kennelId, typeFilter],
    () =>
      financeApi
        .getTransactions(kennelId!, { type: typeFilter || undefined, limit: 100 })
        .then((r) => r.data),
    { enabled: !!kennelId }
  );

  const transactions = transactionsData?.transactions || [];

  const deleteMutation = useMutation(
    (id: string) => financeApi.deleteTransaction(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions']);
        queryClient.invalidateQueries(['financeSummary']);
        addNotification({ type: 'success', message: 'Transacción eliminada' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const filteredTransactions = useMemo(() => {
    if (!search) return transactions;
    const searchLower = search.toLowerCase();
    return transactions.filter(
      (t: any) =>
        t.description.toLowerCase().includes(searchLower) ||
        t.category?.name.toLowerCase().includes(searchLower)
    );
  }, [transactions, search]);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t: any) => t.type === 'INCOME' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t: any) => t.type === 'EXPENSE' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Transacciones" subtitle="Registro de ingresos y gastos" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
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
    <div className="animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/finance"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a Finanzas
        </Link>
      </div>

      <PageHeader
        title="Transacciones"
        subtitle={`${transactions.length} transacciones registradas`}
        action={
          isBreeder && (
            <Link to="/finance/transactions/new" className="btn-primary">
              <Plus size={18} />
              Nueva transacción
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard title="Ingresos" value={`€${stats.income.toLocaleString()}`} icon={TrendingUp} color="green" />
        <StatCard title="Gastos" value={`€${stats.expenses.toLocaleString()}`} icon={TrendingDown} color="red" />
        <StatCard
          title="Balance"
          value={`€${stats.balance.toLocaleString()}`}
          icon={stats.balance >= 0 ? TrendingUp : TrendingDown}
          color={stats.balance >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar transacciones..."
              className="input-apple pl-11 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn('btn-outline', showFilters && 'bg-apple-gray', typeFilter && 'border-apple-blue text-apple-blue')}
            >
              <Filter size={16} />
              Filtros
              {typeFilter && <span className="ml-1.5 w-5 h-5 bg-apple-blue text-white text-xs rounded-full flex items-center justify-center">1</span>}
            </button>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-apple select-apple"
            >
              <option value="">Todos los tipos</option>
              <option value="INCOME">Ingresos</option>
              <option value="EXPENSE">Gastos</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-apple-gray-300/50 animate-fade-in">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-apple-gray-100">Filtrar por tipo:</span>
              {(['', 'INCOME', 'EXPENSE'] as const).map((type) => (
                <button
                  key={type || 'all'}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    typeFilter === type
                      ? 'bg-apple-blue text-white'
                      : 'bg-apple-gray text-apple-gray-200 hover:bg-apple-gray-300/30'
                  )}
                >
                  {!type && 'Todas'}
                  {type === 'INCOME' && 'Ingresos'}
                  {type === 'EXPENSE' && 'Gastos'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay transacciones</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || typeFilter
              ? 'No se encontraron transacciones con los filtros seleccionados'
              : 'Comienza registrando tu primera transacción'}
          </p>
          {isBreeder && !search && !typeFilter && (
            <Link to="/finance/transactions/new" className="btn-primary">
              <Plus size={18} />
              Nueva Transacción
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction: any) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-apple-gray-100" />
                        <span className="text-sm">
                          {format(new Date(transaction.date), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-apple-black">{transaction.description}</p>
                        {transaction.notes && (
                          <p className="text-xs text-apple-gray-100 truncate max-w-[200px]">{transaction.notes}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: transaction.category?.color || '#ccc' }}
                        />
                        <span className="text-sm">{transaction.category?.name}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'font-semibold',
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        €{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          statusLabels[transaction.status]?.bg,
                          statusLabels[transaction.status]?.color
                        )}
                      >
                        {statusLabels[transaction.status]?.label}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/finance/transactions/${transaction.id}/edit`}
                          className="p-2 rounded-lg hover:bg-apple-gray text-apple-gray-100 transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => deleteMutation.mutate(transaction.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
