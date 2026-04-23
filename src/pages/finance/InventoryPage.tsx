import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { financeApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  Plus,
  Search,
  Package,
  AlertCircle,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  Trash2,
  Archive,
  ArrowLeft,
  Loader2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

const categoryLabels: Record<string, string> = {
  FOOD: 'Alimento',
  MEDICINE: 'Medicina',
  SUPPLY: 'Suministro',
  EQUIPMENT: 'Equipamiento',
  OTHER: 'Otro',
};

const categoryColors: Record<string, string> = {
  FOOD: 'bg-blue-100 text-blue-700',
  MEDICINE: 'bg-red-100 text-red-700',
  SUPPLY: 'bg-amber-100 text-amber-700',
  EQUIPMENT: 'bg-purple-100 text-purple-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

export function InventoryPage() {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [adjustItem, setAdjustItem] = useState<any | null>(null);
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: inventoryData, isLoading } = useQuery(
    ['inventory', kennelId, categoryFilter, showLowStock],
    () =>
      financeApi
        .getInventoryItems(kennelId!, {
          category: categoryFilter || undefined,
          lowStock: showLowStock,
          limit: 100,
        })
        .then((r) => r.data),
    { enabled: !!kennelId }
  );

  const { data: stats } = useQuery(
    ['inventoryStats', kennelId],
    () => financeApi.getInventoryStats(kennelId!).then((r) => r.data),
    { enabled: !!kennelId }
  );

  const items = inventoryData?.items || [];

  const deleteMutation = useMutation(
    (id: string) => financeApi.deleteInventoryItem(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);
        queryClient.invalidateQueries(['inventoryStats']);
        addNotification({ type: 'success', message: 'Producto eliminado' });
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al eliminar' });
      },
    }
  );

  const adjustMutation = useMutation(
    ({ id, newQuantity, reason }: { id: string; newQuantity: number; reason: string }) =>
      financeApi.adjustInventory(id, { newQuantity, reason }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);
        queryClient.invalidateQueries(['inventoryStats']);
        addNotification({ type: 'success', message: 'Stock ajustado correctamente' });
        setAdjustItem(null);
      },
      onError: () => {
        addNotification({ type: 'error', message: 'Error al ajustar el stock' });
      },
    }
  );

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const searchLower = search.toLowerCase();
    return items.filter(
      (i: any) =>
        i.name.toLowerCase().includes(searchLower) ||
        i.description?.toLowerCase().includes(searchLower)
    );
  }, [items, search]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Inventario" subtitle="Control de stock" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
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
        title="Inventario"
        subtitle={`${items.length} productos registrados`}
        action={
          isBreeder && (
            <Link to="/finance/inventory/new" className="btn-primary">
              <Plus size={18} />
              Nuevo producto
            </Link>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total productos"
          value={stats?.totalItems || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Stock bajo"
          value={stats?.lowStockItems || 0}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Valor total"
          value={`€${(stats?.totalValue || 0).toLocaleString()}`}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Categorías"
          value={stats?.categoryBreakdown?.length || 0}
          icon={Archive}
          color="purple"
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
              placeholder="Buscar productos..."
              className="input-apple pl-11 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-apple select-apple"
            >
              <option value="">Todas las categorías</option>
              <option value="FOOD">Alimento</option>
              <option value="MEDICINE">Medicina</option>
              <option value="SUPPLY">Suministro</option>
              <option value="EQUIPMENT">Equipamiento</option>
              <option value="OTHER">Otro</option>
            </select>

            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className={cn(
                'btn-outline',
                showLowStock && 'bg-red-50 border-red-200 text-red-600'
              )}
            >
              <AlertCircle size={16} />
              Stock bajo
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">No hay productos</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
            {search || categoryFilter || showLowStock
              ? 'No se encontraron productos con los filtros seleccionados'
              : 'Comienza agregando tu primer producto'}
          </p>
          {isBreeder && !search && !categoryFilter && !showLowStock && (
            <Link to="/finance/inventory/new" className="btn-primary">
              <Plus size={18} />
              Nuevo Producto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item: any) => {
            const isLow = item.isLowStock || item.quantity <= (item.minStock || 0);
            return (
              <div
                key={item.id}
                className={cn(
                  'card p-5 transition-all',
                  isLow ? 'border-red-300 bg-red-50 shadow-red-100' : 'card-interactive'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', categoryColors[item.category])}>
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-apple-black">{item.name}</h4>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[item.category])}>
                        {categoryLabels[item.category]}
                      </span>
                    </div>
                  </div>
                  {isLow && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <AlertCircle size={12} />
                      Stock bajo
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-apple-gray-100 mb-4 line-clamp-2">{item.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-apple-gray-100">Cantidad</p>
                    <p className={cn('font-semibold', isLow ? 'text-red-600' : 'text-apple-black')}>
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-apple-gray-100">Mínimo</p>
                    <p className="font-semibold text-apple-black">
                      {item.minStock} {item.unit}
                    </p>
                  </div>
                  {item.cost && (
                    <div>
                      <p className="text-xs text-apple-gray-100">Costo unitario</p>
                      <p className="font-semibold text-apple-black">€{item.cost}</p>
                    </div>
                  )}
                  {item.supplier && (
                    <div>
                      <p className="text-xs text-apple-gray-100">Proveedor</p>
                      <p className="font-semibold text-apple-black truncate">{item.supplier}</p>
                    </div>
                  )}
                </div>

                {/* Recent movements */}
                {item.movements?.length > 0 && (
                  <div className="border-t border-apple-gray-300/50 pt-4 mb-4">
                    <p className="text-xs text-apple-gray-100 mb-2">Últimos movimientos</p>
                    <div className="space-y-1">
                      {item.movements.slice(0, 2).map((m: any) => (
                        <div key={m.id} className="flex items-center gap-2 text-sm">
                          {m.type === 'IN' ? (
                            <ArrowUp size={14} className="text-green-500" />
                          ) : (
                            <ArrowDown size={14} className="text-red-500" />
                          )}
                          <span className={m.type === 'IN' ? 'text-green-600' : 'text-red-600'}>
                            {m.type === 'IN' ? '+' : '-'}{m.quantity} {item.unit}
                          </span>
                          <span className="text-apple-gray-100 text-xs">
                            {format(new Date(m.createdAt), 'dd MMM')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdjustItem(item)}
                    className="flex-1 btn-secondary text-center text-sm py-2 flex items-center justify-center gap-1"
                  >
                    <SlidersHorizontal size={14} />
                    Ajustar stock
                  </button>
                  <Link
                    to={`/finance/inventory/${item.id}`}
                    className="px-3 py-2 rounded-lg border border-apple-gray-300 hover:bg-apple-gray text-sm text-apple-gray-200 transition-colors"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustItem && (
        <AdjustStockModal
          item={adjustItem}
          onClose={() => setAdjustItem(null)}
          onSubmit={({ newQuantity, reason }) =>
            adjustMutation.mutate({ id: adjustItem.id, newQuantity, reason })
          }
          isLoading={adjustMutation.isLoading}
        />
      )}
    </div>
  );
}

function AdjustStockModal({
  item,
  onClose,
  onSubmit,
  isLoading,
}: {
  item: any;
  onClose: () => void;
  onSubmit: (data: { newQuantity: number; reason: string }) => void;
  isLoading: boolean;
}) {
  const [newQuantity, setNewQuantity] = useState<number>(item.quantity || 0);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number.isNaN(newQuantity) || newQuantity < 0) return;
    if (!reason.trim()) return;
    onSubmit({ newQuantity, reason: reason.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-apple-black">Ajustar stock</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-apple-gray">
            <X size={18} className="text-apple-gray-200" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-apple-gray-200 mb-1">Producto</label>
            <p className="font-medium text-apple-black">{item.name}</p>
            <p className="text-xs text-apple-gray-100">
              Stock actual: {item.quantity} {item.unit}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Nueva cantidad</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseFloat(e.target.value))}
              className="input-apple w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-black mb-1">Motivo del ajuste</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="input-apple w-full resize-none"
              placeholder="Ej. Inventario físico, corrección de error..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim() || Number.isNaN(newQuantity)}
              className="btn-primary disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={16} />}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
