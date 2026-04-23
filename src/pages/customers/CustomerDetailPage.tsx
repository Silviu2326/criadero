import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { customersApi } from '@/services/api';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading } = useQuery(
    ['customer', id],
    () => customersApi.getById(id!).then((r) => r.data.customer)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue"></div>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center py-12">Cliente no encontrado</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/customers" className="p-2 hover:bg-apple-gray rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-apple-gray-100">Detalles del cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-apple p-6">
          <h3 className="text-lg font-medium text-apple-black mb-4">Información de contacto</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-apple-blue" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-apple-blue" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-apple-blue" />
                <span>{customer.address}, {customer.city}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-apple-blue" />
              <span>
                Cliente desde{' '}
                {format(new Date(customer.createdAt), 'MMMM yyyy', { locale: es })}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-apple p-6">
          <h3 className="text-lg font-medium text-apple-black mb-4">Historial de reservas</h3>
          {customer.reservations?.length ? (
            <div className="space-y-3">
              {customer.reservations.map((reservation: any) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 bg-apple-gray rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Package size={20} className="text-apple-blue" />
                    <div>
                      <p className="font-medium">{reservation.dog?.name}</p>
                      <p className="text-sm text-apple-gray-100">
                        {format(new Date(reservation.createdAt), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      reservation.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : reservation.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-apple-gray-100 text-center py-8">No hay reservas</p>
          )}
        </div>
      </div>
    </div>
  );
}
