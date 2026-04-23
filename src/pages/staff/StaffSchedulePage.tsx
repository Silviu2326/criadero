import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { staffApi, kennelsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/utils/cn';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';

const typeColors: Record<string, string> = {
  MORNING: 'bg-blue-50 text-blue-700 border-blue-200',
  AFTERNOON: 'bg-amber-50 text-amber-700 border-amber-200',
  NIGHT: 'bg-purple-50 text-purple-700 border-purple-200',
};

const typeLabels: Record<string, string> = {
  MORNING: 'Mañana',
  AFTERNOON: 'Tarde',
  NIGHT: 'Noche',
};

export function StaffSchedulePage() {
  const { user } = useAuthStore();
  const isManager = user?.role === 'MANAGER';
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const { data: myKennels } = useQuery('myKennels', () => kennelsApi.getMyKennels().then((r) => r.data.kennels), { enabled: isManager });
  const kennelId = myKennels?.[0]?.id;

  const dateFrom = format(weekStart, 'yyyy-MM-dd');
  const dateTo = format(addDays(weekStart, 6), 'yyyy-MM-dd');

  const { data: shiftsRes, isLoading } = useQuery(
    ['shifts', kennelId, dateFrom, dateTo],
    () => staffApi.getShifts({ kennelId, dateFrom, dateTo }),
    { enabled: !!kennelId }
  );
  const shifts = (shiftsRes?.data?.shifts || []) as any[];

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const filtered = useMemo(() => {
    return shifts.filter((s) => {
      const d = parseISO(s.date);
      return d >= weekStart && d <= addDays(weekStart, 6);
    });
  }, [shifts, weekStart]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Horarios" subtitle="Planificación semanal de turnos" />
        <div className="card p-5"><div className="skeleton h-64 rounded-xl" /></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Horarios" subtitle="Turnos y guardias del equipo" />

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setWeekStart((d) => addDays(d, -7))} className="btn-ghost"><ChevronLeft size={18} />Anterior</button>
        <div className="text-sm font-medium text-apple-black">Semana del {format(weekStart, 'dd MMM')} - {format(addDays(weekStart, 6), 'dd MMM yyyy', { locale: es })}</div>
        <button onClick={() => setWeekStart((d) => addDays(d, 7))} className="btn-ghost">Siguiente<ChevronRight size={18} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayShifts = filtered.filter((s) => isSameDay(parseISO(s.date), day));
          return (
            <div key={day.toISOString()} className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-apple-gray flex items-center justify-center"><CalendarDays size={16} className="text-apple-gray-200" /></div>
                <div>
                  <p className="text-xs text-apple-gray-100 uppercase">{format(day, 'EEE', { locale: es })}</p>
                  <p className="font-semibold text-apple-black">{format(day, 'dd')}</p>
                </div>
              </div>
              <div className="space-y-2">
                {dayShifts.length === 0 && <p className="text-xs text-apple-gray-300">Sin turnos</p>}
                {dayShifts.map((s) => (
                  <div key={s.id} className={cn('rounded-lg border p-2 text-xs', typeColors[s.type])}>
                    <div className="font-medium">{typeLabels[s.type]}</div>
                    <div className="flex items-center gap-1 mt-1 opacity-90"><User size={10} /> {s.employee?.firstName} {s.employee?.lastName}</div>
                    <div className="flex items-center gap-1 opacity-90"><Clock size={10} /> {s.startTime} - {s.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
