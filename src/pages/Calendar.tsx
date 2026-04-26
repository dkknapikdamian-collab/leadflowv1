import { useState, useEffect, FormEvent } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Target, 
  Briefcase,
  Loader2
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO,
  isToday
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Calendar() {
  const { workspace, hasAccess } = useWorkspace();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'meeting', startAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"), endAt: format(addDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm") });

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const eventsQuery = query(
      collection(db, 'events'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'scheduled')
    );

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'todo')
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeTasks = onSnapshot(tasksQuery, (snap) => {
      setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeTasks();
    };
  }, [workspace]);

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Trial wygasł.');
    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        status: 'scheduled',
        date: newEvent.startAt.slice(0, 10),
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Wydarzenie zaplanowane');
      setIsNewEventOpen(false);
      setNewEvent({ title: '', type: 'meeting', startAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"), endAt: format(addDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm") });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 capitalize">{format(currentMonth, 'MMMM yyyy', { locale: pl })}</h1>
        <p className="text-slate-500">Twój harmonogram działań.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="rounded-lg"><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" onClick={() => setCurrentMonth(new Date())} className="text-sm font-bold px-4">Dzisiaj</Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="w-4 h-4 mr-2" /> Wydarzenie</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Zaplanuj wydarzenie</DialogTitle></DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tytuł</Label>
                <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Typ</Label>
                  <Select value={newEvent.type} onValueChange={v => setNewEvent({...newEvent, type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Spotkanie</SelectItem>
                      <SelectItem value="phone_call">Rozmowa</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input type="datetime-local" value={newEvent.startAt} onChange={e => setNewEvent({...newEvent, startAt: e.target.value})} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Zaplanuj</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 border-t border-l border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
        {calendarDays.map((day, i) => {
          const dayEvents = events.filter(e => isSameDay(parseISO(e.startAt), day));
          const dayTasks = tasks.filter(t => isSameDay(parseISO(t.date), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDay = isToday(day);

          return (
            <div 
              key={i} 
              className={`min-h-[120px] p-2 border-r border-b border-slate-100 transition-colors hover:bg-slate-50/50 ${
                !isCurrentMonth ? 'bg-slate-50/30 text-slate-300' : 'text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                  isTodayDay ? 'bg-primary text-white' : ''
                }`}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div key={event.id} className="text-[10px] p-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 truncate font-medium">
                    {format(parseISO(event.startAt), 'HH:mm')} {event.title}
                  </div>
                ))}
                {dayTasks.map(task => (
                  <div key={task.id} className="text-[10px] p-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 truncate font-medium">
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </Layout>
  );
}
