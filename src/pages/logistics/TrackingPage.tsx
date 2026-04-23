import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { logisticsApi } from '@/services/api';
import { useUIStore } from '@/store/uiStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Package,
  Search,
  Truck,
  Calendar,
  ExternalLink,
  Info,
  Loader2,
  Save,
  User,
} from 'lucide-react';

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Programado',
  IN_TRANSIT: 'En tránsito',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  DELAYED: 'Retrasado',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  SCHEDULED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  IN_TRANSIT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  DELIVERED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CANCELLED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  DELAYED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addNotification } = useUIStore();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('tracking') || '');
  const [query, setQuery] = useState(searchParams.get('tracking') || '');
  const [editableStatus, setEditableStatus] = useState('');

  const { data: trackingRes, isLoading, refetch } = useQuery(
    ['tracking', query],
    () => logisticsApi.getShipmentByTracking(query),
    { enabled: !!query }
  );

  const shipment = trackingRes?.data?.shipment as any;

  useEffect(() => {
    if (shipment?.status) {
      setEditableStatus(shipment.status);
    }
  }, [shipment?.status]);

  const updateMutation = useMutation(
    async (newStatus: any) => {
      if (!shipment?.id) throw new Error('No hay envío');
      return logisticsApi.updateShipment(shipment.id, {
        status: newStatus,
      });
    },
    {
      onSuccess: () => {
        addNotification({ type: 'success', message: 'Estado actualizado' });
        refetch();
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          message: error?.message || 'Error al actualizar el estado',
        });
      },
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    setQuery(trimmed);
    if (trimmed) {
      setSearchParams({ tracking: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const handleSaveStatus = () => {
    if (editableStatus && editableStatus !== shipment?.status) {
      updateMutation.mutate(editableStatus);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Seguimiento" subtitle="Consulta y actualiza el estado de tus envíos" />

      <div className="card p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Introduce número de seguimiento..."
              className="input-apple pl-11 w-full"
            />
          </div>
          <button type="submit" className="btn-primary">
            <Truck size={18} />
            Buscar
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="card p-8">
          <div className="skeleton h-8 w-1/3 mb-6 rounded" />
          <div className="skeleton h-40 rounded-xl" />
        </div>
      ) : !query ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Busca un envío</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">
            Introduce el número de seguimiento para ver los detalles del envío.
          </p>
        </div>
      ) : !shipment ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-apple-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">Sin resultados</h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">
            No se encontró ningún envío con el número <span className="font-mono font-medium">{query}</span>.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-apple-gray flex items-center justify-center shrink-0">
                <Info className="text-apple-blue" size={24} />
              </div>
              <div>
                <p className="font-medium text-apple-black">Seguimiento manual</p>
                <p className="text-sm text-apple-gray-200">
                  Este sistema no tiene conexión con las empresas de transporte. El estado que ves aquí
                  depende de lo que tú registres manualmente. Para seguimiento en tiempo real,
                  usa el enlace del transportista si está disponible.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold border',
                      statusColors[shipment.status]?.bg,
                      statusColors[shipment.status]?.text,
                      statusColors[shipment.status]?.border
                    )}
                  >
                    {statusLabels[shipment.status] || shipment.status}
                  </span>
                  <span className="text-xs text-apple-gray-300 font-mono">{shipment.trackingNumber}</span>
                </div>
                <h2 className="text-xl font-semibold text-apple-black flex items-center gap-2">
                  {shipment.origin}
                  <span className="text-apple-gray-300">→</span>
                  {shipment.destination}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-apple-gray-200">
                  {shipment.scheduledDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> Salida: {format(parseISO(shipment.scheduledDate), 'dd MMM yyyy', { locale: es })}
                    </span>
                  )}
                  {shipment.estimatedArrival && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> Llegada estimada: {format(parseISO(shipment.estimatedArrival), 'dd MMM yyyy', { locale: es })}
                    </span>
                  )}
                  {shipment.actualArrival && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> Entregado: {format(parseISO(shipment.actualArrival), 'dd MMM yyyy', { locale: es })}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} /> {shipment.mode === 'AIR' ? 'Aéreo' : shipment.mode === 'SEA' ? 'Marítimo' : 'Terrestre'}
                  </span>
                </div>
              </div>

              <div className="w-full lg:w-auto lg:min-w-[16rem]">
                <label className="block text-sm font-medium text-apple-black mb-2">
                  Actualizar estado
                </label>
                <div className="flex gap-2">
                  <select
                    value={editableStatus}
                    onChange={(e) => setEditableStatus(e.target.value)}
                    className="input-apple select-apple w-full"
                  >
                    <option value="SCHEDULED">Programado</option>
                    <option value="IN_TRANSIT">En tránsito</option>
                    <option value="DELIVERED">Entregado</option>
                    <option value="DELAYED">Retrasado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                  <button
                    onClick={handleSaveStatus}
                    disabled={updateMutation.isLoading || editableStatus === shipment.status}
                    className="btn-primary px-3 disabled:opacity-50"
                    title="Guardar estado"
                  >
                    {updateMutation.isLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-apple-gray-300/50 my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-apple-gray-100 mb-1">Transportista</p>
                <p className="font-medium text-apple-black">{shipment.carrier?.name || '—'}</p>
              </div>

              <div>
                <p className="text-sm text-apple-gray-100 mb-1">Coste</p>
                <p className="font-medium text-apple-black">
                  {shipment.cost != null ? <>€{Number(shipment.cost).toFixed(2)}</> : '—'}
                </p>
              </div>

              <div>
                <p className="text-sm text-apple-gray-100 mb-1">Perro</p>
                <p className="font-medium text-apple-black flex items-center gap-2">
                  <Package size={16} className="text-apple-gray-200" />
                  {shipment.dog?.name || '—'}
                  {shipment.dog?.breed?.name && (
                    <span className="text-sm text-apple-gray-200">({shipment.dog.breed.name})</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-apple-gray-100 mb-1">Cliente destinatario</p>
                <p className="font-medium text-apple-black flex items-center gap-2">
                  <User size={16} className="text-apple-gray-200" />
                  {shipment.customer
                    ? `${shipment.customer.firstName} ${shipment.customer.lastName}`
                    : '—'}
                </p>
              </div>

              {shipment.externalTrackingUrl && (
                <div className="md:col-span-2">
                  <p className="text-sm text-apple-gray-100 mb-1">Seguimiento externo</p>
                  <a
                    href={shipment.externalTrackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-apple-blue hover:underline font-medium"
                  >
                    <ExternalLink size={16} />
                    {shipment.externalTrackingUrl}
                  </a>
                </div>
              )}

              {shipment.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-apple-gray-100 mb-1">Notas</p>
                  <p className="text-apple-black whitespace-pre-line">{shipment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
