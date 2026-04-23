import { useEffect, useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { onSnapshot, collection, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { isSupabaseConfigured } from '../lib/supabase-fallback';
import { Button } from './ui/button';

type DatedItem = {
  date: string;
};

function getDayTone(hasEvent: boolean, hasTask: boolean, today: boolean) {
  if (today) return 'bg-primary text-white';
  if (hasEvent && hasTask) return 'bg-amber-100 text-amber-800';
  if (hasEvent) return 'bg-indigo-100 text-indigo-800';
  if (hasTask) return 'bg-emerald-100 text-emerald-800';
  return 'text-slate-700 hover:bg-slate-100';
}

export function SidebarMiniCalendar() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [taskDates, setTaskDates] = useState<DatedItem[]>([]);
  const [eventDates, setEventDates] = useState<DatedItem[]>([]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      void fetchCalendarBundleFromSupabase()
        .then((bundle) => {
          setTaskDates(bundle.tasks.map((item) => ({ date: item.date })));
          setEventDates(bundle.events.map((item) => ({ date: item.startAt })));
        })
        .catch(() => {
          setTaskDates([]);
          setEventDates([]);
        });
      return;
    }

    if (!auth.currentUser) {
      setTaskDates([]);
      setEventDates([]);
      return;
    }

    const unsubscribers = [
      onSnapshot(query(collection(db, 'tasks'), where('ownerId', '==', auth.currentUser.uid), orderBy('date', 'asc')), (snapshot) => {
        setTaskDates(snapshot.docs
          .map((entry) => entry.data().date)
          .filter((date): date is string => typeof date === 'string' && Boolean(date))
          .map((date) => ({ date })));
      }),
      onSnapshot(query(collection(db, 'events'), where('ownerId', '==', auth.currentUser.uid), orderBy('startAt', 'asc')), (snapshot) => {
        setEventDates(snapshot.docs
          .map((entry) => entry.data().startAt)
          .filter((date): date is string => typeof date === 'string' && Boolean(date))
          .map((date) => ({ date })));
      }),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  }, [currentMonth]);

  return (
    <div className="mt-4 rounded-2xl border app-border p-2 app-surface-strong">
      <div className="mb-2 flex items-center justify-between gap-1">
        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[9px] font-bold uppercase tracking-[0.16em] app-muted">
            {format(currentMonth, 'LLLL yyyy', { locale: pl })}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-w-[148px]">
        <div className="grid grid-cols-7 gap-0.5">
          {['P', 'W', 'S', 'C', 'P', 'S', 'N'].map((day, index) => (
            <div key={`${day}-${index}`} className="py-0.5 text-center text-[7px] font-bold uppercase text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-0.5">
          {monthDays.map((day) => {
            const hasTask = taskDates.some((item) => isSameDay(parseISO(item.date), day));
            const hasEvent = eventDates.some((item) => isSameDay(parseISO(item.date), day));

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => navigate(`/calendar?focus=${format(day, 'yyyy-MM-dd')}`)}
                className={[
                  'flex h-5 items-center justify-center rounded-md text-[9px] font-semibold transition-colors',
                  !isSameMonth(day, currentMonth) ? 'text-slate-300' : getDayTone(hasEvent, hasTask, isToday(day)),
                ].join(' ')}
                title={hasEvent || hasTask ? 'Ten dzień ma zaplanowane działania' : 'Brak aktywności'}
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
