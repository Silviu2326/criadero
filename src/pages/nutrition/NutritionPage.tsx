import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { nutritionApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  Plus,
  ClipboardList,
  Apple,
  Pill,
  ChefHat,
  ArrowRight,
  Scale,
  BookOpen,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { format } from 'date-fns';

const dietTypeLabels: Record<string, string> = {
  DRY: 'Pienso seco',
  WET: 'Húmedo',
  BARF: 'BARF',
  HOME_COOKED: 'Casero',
  MIXED: 'Mixto',
};

const activityLabels: Record<string, string> = {
  LOW: 'Baja',
  MODERATE: 'Moderada',
  HIGH: 'Alta',
  VERY_HIGH: 'Muy alta',
};

export function NutritionPage() {
  const { user } = useAuthStore();
  const isBreeder = user?.role === 'BREEDER' || user?.role === 'MANAGER';

  const { data: myKennels } = useQuery(
    'myKennels',
    () => kennelsApi.getMyKennels().then((r) => r.data.kennels),
    { enabled: isBreeder }
  );

  const kennelId = myKennels?.[0]?.id;

  const { data: dietsData } = useQuery(
    ['nutrition-diets', kennelId],
    () => nutritionApi.getDogNutritions({ kennelId, active: true }).then((r) => r.data.diets),
    { enabled: !!kennelId }
  );

  const { data: plansData } = useQuery(
    ['nutrition-plans', kennelId],
    () => nutritionApi.getPlans({ kennelId, isActive: true }).then((r) => r.data.plans),
    { enabled: !!kennelId }
  );

  const { data: logsData } = useQuery(
    ['nutrition-logs-today', kennelId],
    () =>
      nutritionApi
        .getLogs({ kennelId, dateFrom: format(new Date(), 'yyyy-MM-dd'), dateTo: format(new Date(), 'yyyy-MM-dd') })
        .then((r) => r.data.logs),
    { enabled: !!kennelId }
  );

  const { data: supplementsData } = useQuery(
    ['nutrition-supplements', kennelId],
    () => nutritionApi.getSupplements({ kennelId, active: true }).then((r) => r.data.supplements),
    { enabled: !!kennelId }
  );

  const diets = dietsData || [];
  const plans = plansData || [];
  const logs = logsData || [];
  const supplements = supplementsData || [];

  const stats = useMemo(() => {
    const totalGramsServed = logs.reduce((sum: number, log: any) => sum + log.gramsServed, 0);
    return {
      activeDiets: diets.length,
      todayLogs: logs.length,
      activeSupplements: supplements.length,
      availablePlans: plans.length,
      totalGramsServed,
    };
  }, [diets, logs, supplements, plans]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Nutrición"
        subtitle="Gestión de dietas, registros diarios y suplementos"
        action={
          isBreeder && (
            <div className="flex items-center gap-3">
              <Link to="/nutrition/daily-log" className="btn-secondary">
                <ClipboardList size={18} />
                Registro diario
              </Link>
              <Link to="/nutrition/plans/new" className="btn-primary">
                <Plus size={18} />
                Nuevo plan
              </Link>
            </div>
          )
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <StatCard title="Dietas activas" value={stats.activeDiets} icon={Apple} color="green" />
        <StatCard title="Registros hoy" value={stats.todayLogs} icon={ClipboardList} color="blue" />
        <StatCard title="Suplementos activos" value={stats.activeSupplements} icon={Pill} color="purple" />
        <StatCard title="Planes disponibles" value={stats.availablePlans} icon={ChefHat} color="orange" />
        <StatCard
          title="Gramos servidos hoy"
          value={`${stats.totalGramsServed.toLocaleString()}g`}
          icon={Scale}
          color="blue"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <Link
          to="/nutrition/plans"
          className="card p-5 card-interactive flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ChefHat size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">Planes de alimentación</h3>
              <p className="text-sm text-apple-gray-100">{plans.length} planes activos</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
        </Link>

        <Link
          to="/nutrition/daily-log"
          className="card p-5 card-interactive flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ClipboardList size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">Registro diario</h3>
              <p className="text-sm text-apple-gray-100">Registrar comidas y sobrantes</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
        </Link>

        <Link
          to="/nutrition/supplements"
          className="card p-5 card-interactive flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Pill size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">Suplementos</h3>
              <p className="text-sm text-apple-gray-100">{supplements.length} suplementos activos</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
        </Link>

        <Link
          to="/nutrition/recipes"
          className="card p-5 card-interactive flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">Recetas</h3>
              <p className="text-sm text-apple-gray-100">Recetas reutilizables</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
        </Link>

        <Link
          to="/nutrition/intolerances"
          className="card p-5 card-interactive flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">Intolerancias</h3>
              <p className="text-sm text-apple-gray-100">Control de intolerancias</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
        </Link>

        <Link
          to="/nutrition/feeding-costs"
          className="card p-5 card-interactive flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-apple-black">Coste de alimentación</h3>
              <p className="text-sm text-apple-gray-100">Análisis de costes reales</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-apple-gray-100 group-hover:text-apple-black transition-colors" />
        </Link>
      </div>

      {/* Active diets */}
      <div className="card">
        <div className="p-5 border-b border-apple-gray-300/50 flex items-center justify-between">
          <h3 className="font-semibold text-apple-black text-lg">Dietas activas</h3>
          {isBreeder && (
            <Link to="/nutrition/plans/new" className="btn-primary text-sm py-2">
              <Plus size={16} />
              Asignar dieta
            </Link>
          )}
        </div>

        {diets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <Apple className="text-apple-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-apple-black mb-2">No hay dietas activas</h3>
            <p className="text-apple-gray-100 max-w-md mx-auto mb-6">
              Asigna un plan de alimentación a tus perros para empezar a registrar su nutrición.
            </p>
            {isBreeder && (
              <Link to="/nutrition/plans/new" className="btn-primary">
                <Plus size={18} />
                Crear plan y asignar
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern w-full">
              <thead>
                <tr>
                  <th className="text-left">Perro</th>
                  <th className="text-left">Plan</th>
                  <th className="text-left">Tipo</th>
                  <th className="text-left">Peso actual</th>
                  <th className="text-left">Ración recomendada</th>
                  <th className="text-left">Actividad</th>
                  <th className="text-left">Inicio</th>
                </tr>
              </thead>
              <tbody>
                {diets.map((diet: any) => {
                  const recommended = diet.plan?.dailyGramsPerKg && diet.currentWeightKg
                    ? Math.round(diet.plan.dailyGramsPerKg * diet.currentWeightKg)
                    : '-';
                  return (
                    <tr key={diet.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {diet.dog?.photos?.[0]?.url ? (
                            <img
                              src={diet.dog.photos[0].url}
                              alt={diet.dog.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-apple-gray flex items-center justify-center text-apple-gray-300 font-semibold">
                              {diet.dog?.name?.[0]}
                            </div>
                          )}
                          <span className="font-medium text-apple-black">{diet.dog?.name}</span>
                        </div>
                      </td>
                      <td className="text-apple-black font-medium">{diet.plan?.name}</td>
                      <td>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                          {dietTypeLabels[diet.plan?.dietType] || diet.plan?.dietType}
                        </span>
                      </td>
                      <td>{diet.currentWeightKg} kg</td>
                      <td className="font-semibold text-apple-black">{typeof recommended === 'number' ? `${recommended}g` : recommended}</td>
                      <td>{activityLabels[diet.plan?.activityLevel] || diet.plan?.activityLevel}</td>
                      <td className="text-apple-gray-100">
                        {diet.startDate ? format(new Date(diet.startDate), 'dd MMM yyyy') : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
