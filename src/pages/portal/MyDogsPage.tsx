import { useQuery } from 'react-query';
import { dogsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  Dog,
  Calendar,
  Syringe,
  FileText,
  Heart,
  ChevronRight,
  PawPrint,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/utils/cn';

interface DogMedicalRecord {
  type: string;
  date: string;
  description: string;
  nextDate?: string;
}

interface Dog {
  id: string;
  name: string;
  breed: { name: string };
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  color: string;
  microchip?: string;
  photos?: { url: string; isMain: boolean }[];
  medicalRecords?: DogMedicalRecord[];
}

export function MyDogsPage() {
  const { user } = useAuthStore();

  const { data: dogsData, isLoading } = useQuery(
    ['myDogs', user?.id],
    () => dogsApi.getAll({ customerId: user?.customerId }).then((r) => r.data),
    { enabled: !!user?.customerId }
  );

  const dogs: Dog[] = dogsData?.dogs || [];

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-48 w-full mb-4 rounded-xl" />
              <div className="skeleton h-6 w-32 mb-2" />
              <div className="skeleton h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-section font-display font-semibold text-apple-black">
            Mis Perros
          </h1>
          <p className="text-apple-gray-100 mt-1">
            Aquí aparecerán los perros que has adquirido en nuestro criadero
          </p>
        </div>

        <div className="card p-12 text-center">
          <div className="w-24 h-24 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-6">
            <Dog className="text-apple-gray-300" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-apple-black mb-2">
            Aún no tienes perros registrados
          </h3>
          <p className="text-apple-gray-100 max-w-md mx-auto">
            Cuando adquieras un perro de nuestro criadero, aparecerá aquí con toda su información
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-section font-display font-semibold text-apple-black">
          Mis Perros
        </h1>
        <p className="text-apple-gray-100 mt-1">
          {dogs.length} {dogs.length === 1 ? 'perro registrado' : 'perros registrados'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dogs.map((dog) => {
          const upcomingMedical = (dog.medicalRecords || [])
            .filter((r) => r.nextDate && new Date(r.nextDate) >= new Date())
            .sort((a, b) => new Date(a.nextDate!).getTime() - new Date(b.nextDate!).getTime())[0];

          const lastMedical = (dog.medicalRecords || [])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

          return (
            <div
              key={dog.id}
              className="card overflow-hidden card-interactive group"
            >
              <div className="relative h-64 overflow-hidden">
                {dog.photos?.find((p) => p.isMain)?.url ? (
                  <img
                    src={dog.photos.find((p) => p.isMain)!.url}
                    alt={dog.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-apple-gray to-apple-gray-300 flex items-center justify-center">
                    <PawPrint className="text-apple-gray-100" size={64} />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      dog.gender === 'MALE'
                        ? 'bg-blue-500/80 text-white'
                        : 'bg-pink-500/80 text-white'
                    )}
                  >
                    {dog.gender === 'MALE' ? 'Macho' : 'Hembra'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-apple-black group-hover:text-apple-blue transition-colors">
                      {dog.name}
                    </h3>
                    <p className="text-apple-gray-100">{dog.breed.name}</p>
                  </div>
                  <ChevronRight className="text-apple-gray-300 group-hover:text-apple-blue transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-apple-gray-100" />
                    <span className="text-sm text-apple-gray-200">
                      {format(new Date(dog.birthDate), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-apple-gray-100" />
                    <span className="text-sm text-apple-gray-200">{dog.color}</span>
                  </div>
                </div>

                {dog.microchip && (
                  <div className="flex items-center gap-2 p-3 bg-apple-gray rounded-lg mb-4">
                    <FileText size={16} className="text-apple-gray-100" />
                    <span className="text-sm text-apple-gray-200">Microchip: {dog.microchip}</span>
                  </div>
                )}

                {upcomingMedical ? (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <Syringe size={16} className="text-amber-500" />
                    <span className="text-sm text-amber-700">
                      Próxima cita: {format(new Date(upcomingMedical.nextDate!), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                ) : lastMedical ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <Syringe size={16} className="text-green-500" />
                    <span className="text-sm text-green-700">
                      Última revisión: {format(new Date(lastMedical.date), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
