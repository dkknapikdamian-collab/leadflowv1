import { useEffect, useMemo, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from './ui/button';
import { fetchEventsFromSupabase, fetchLeadsFromSupabase, fetchTasksFromSupabase, isSupabaseConfigured } from '../lib/supabase-fallback';

type DatedItem = {
  date: string;
};

function getDayTone(hasLead: boolean, hasEvent: boolean, hasTask: boolean, today: boolean) {
  if (today) return 'bg-primary text-white';
  if (hasLead && hasEvent) return 'bg-fuchsia-100 text-fuchsia-800';
  if (hasEvent && hasTask) return 'bg-amber-100 text-amber-800';
  if (hasLead) return 'bg-cyan-100 text-cyan-800';
  if (hasEvent) return 'bg-indigo-100 text-indigo-800';
  if (hasTask) return 'bg-emerald-100 text-emerald-800';
  return 'text-slate-700 hover:bg-slate-100';
}

export function SidebarMiniCalendar() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [taskDates, setTaskDates] = useState<DatedItem[]>([]);
  const [eventDates, setEventDates] = useState<DatedItem[]>([]);
  const [leadDates, setLeadDates] = useState<DatedItem[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setTaskDates([]);
      setEventDates([]);
      setLeadDates([]);
      return;
    }

    void Promise.all([fetchTasksFromSupabase(), fetchEventsFromSupabase(), fetchLeadsFromSupabase()])
      .then(([tasks, events, leads]) => {
        setTaskDates(
          (tasks as Array<Record<string, unknown>>)
            .filter((item) => typeof item.date === 'string' && item.date)
            .map((item) => ({ date: String(item.date) }))
        );
        setEventDates(
          (events as Array<Record<string, unknown>>)
            .filter((item) => typeof item.startAt === 'string' && item.startAt)
            .map((item) => ({ date: String(item.startAt) }))
        );
        setLeadDates(
          (leads as Array<Record<string, unknown>>)
            .filter((item) => typeof item.nextActionAt === 'string' && item.nextActionAt)
            .map((item) => ({ date: String(item.nextActionAt) }))
        );
      })
      .catch(() => {
        setTaskDates([]);
        setEventDates([]);
        setLeadDates([]);
      });
  }, []);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  }, [currentMonth]);

  return (
    <div className="mx-4 mb-4 rounded-2xl border app-border p-3 app-surface-strong app-shadow">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 text-center">
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.18em] app-muted">Kalendarz</p>
          <p className="truncate text-sm font-bold app-text capitalize">{format(currentMonth, 'LLLL yyyy', { locale: pl })}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="aspect-square">
        <div className="grid grid-cols-7 gap-1">
          {['P', 'W', 'Ś', 'C', 'P', 'S', 'N'].map((day, index) => (
            <div key={`${day}-${index}`} className="py-0.5 text-center text-[9px] font-bold uppercase text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {monthDays.map((day) => {
            const hasTask = taskDates.some((item) => isSameDay(parseISO(item.date), day));
            const hasEvent = eventDates.some((item) => isSameDay(parseISO(item.date), day));
            const hasLead = leadDates.some((item) => isSameDay(parseISO(item.date), day));

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => navigate(`/calendar?focus=${format(day, 'yyyy-MM-dd')}`)}
                className={[
                  'flex h-7 items-center justify-center rounded-md text-[11px] font-semibold transition-colors',
                  !isSameMonth(day, currentMonth) ? 'text-slate-300' : getDayTone(hasLead, hasEvent, hasTask, isToday(day)),
                ].join(' ')}
                title={hasLead || hasEvent || hasTask ? 'Ten dzień ma zaplanowany ruch' : 'Brak aktywności'}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
