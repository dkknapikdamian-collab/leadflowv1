import { useState, useEffect, FormEvent, useMemo, type ReactNode } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
import { getLeadSourceLabel, LEAD_SOURCE_OPTIONS } from '../lib/leadSources';
import { ensureCurrentUserWorkspace } from '../lib/workspace';
import { insertLeadToSupabase, insertTaskToSupabase, isSupabaseConfigured } from '../lib/supabase-fallback';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  Calendar,
  CheckSquare,
  Target,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Loader2,
  ChevronRight,
  Mail,
  Phone,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  format,
  isToday,
  isPast,
  addDays,
  isSameDay,
  parseISO,
  differenceInCalendarDays,
  startOfDay,
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

type LeadRecord = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  dealValue?: number;
  source?: string;
  status?: string;
  nextStep?: string;
  nextActionAt?: string;
  isAtRisk?: boolean;
  updatedAt?: Timestamp;
};

type TaskRecord = {
  id: string;
  title: string;
  date: string;
  type: string;
  status: string;
};

type EventRecord = {
  id: string;
  title: string;
  type: string;
  startAt: string;
  endAt?: string;
  status: string;
};

const ACTIVE_LEAD_STATUSES = ['new', 'contacted', 'qualification', 'proposal_sent', 'follow_up', 'negotiation'];

function toDate(value?: string | Timestamp | null) {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return parseISO(value);
    } catch {
      return null;
    }
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  return null;
}

function leadReason(lead: LeadRecord) {
  const nextActionDate = toDate(lead.nextActionAt);
  const updatedDate = toDate(lead.updatedAt);

  if (!lead.nextActionAt) return 'Brak ustawionego kolejnego kroku';
  if (nextActionDate && isPast(nextActionDate) && !isToday(nextActionDate)) return 'Termin kolejnego ruchu już minął';
  if (lead.isAtRisk) return 'Lead oznaczony jako zagrożony';
  if (updatedDate && differenceInCalendarDays(new Date(), updatedDate) >= 5) return 'Lead jest bez ruchu od kilku dni';
  if ((lead.dealValue || 0) >= 5000) return 'Wysoka wartość, warto go ruszyć';
  return 'Wymaga Twojej uwagi';
}

function LeadActionCard({
  lead,
  badge,
}: {
  lead: LeadRecord;
  badge: ReactNode;
}) {
  return (
    <Card className="border-none app-surface-strong app-shadow">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold app-text">{lead.name}</h3>
            {badge}
          </div>
          <p className="text-sm app-muted">{leadReason(lead)}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs app-muted">
            {lead.company ? <span>{lead.company}</span> : null}
            {lead.dealValue ? <span>{lead.dealValue.toLocaleString()} PLN</span> : null}
            {lead.source ? <span>{getLeadSourceLabel(lead.source)}</span> : null}
            {lead.nextStep ? <span>{lead.nextStep}</span> : null}
            {lead.nextActionAt ? (
              <span>{format(parseISO(lead.nextActionAt), 'd MMMM, HH:mm', { locale: pl })}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/leads/${lead.id}`}>Otwórz</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={`/leads/${lead.id}`}>Ustaw ruch <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionBlock({
  id,
  title,
  count,
  icon,
  accent,
  children,
}: {
  id?: string;
  title: string;
  count: number;
  icon: ReactNode;
  accent?: 'danger' | 'warning' | 'primary' | 'default';
  children: ReactNode;
}) {
  const toneClass = accent === 'danger'
    ? 'text-rose-500'
    : accent === 'warning'
      ? 'text-amber-500'
      : accent === 'primary'
        ? 'text-[color:var(--app-primary)]'
        : 'app-text';

  return (
    <section id={id} className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className={`flex items-center gap-2 ${toneClass}`}>
          {icon}
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <Badge variant="outline" className="rounded-full">{count}</Badge>
      </div>
      {children}
    </section>
  );
}

export default function Today() {
  const { workspace, profile, hasAccess, loading: wsLoading } = useWorkspace();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    dealValue: '',
    source: 'other',
    status: 'new',
    nextStep: '',
    nextActionAt: format(new Date(), "yyyy-MM-dd'T'09:00"),
  });
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'follow_up',
    date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'meeting',
    startAt: format(new Date(), "yyyy-MM-dd'T'10:00"),
    endAt: format(new Date(), "yyyy-MM-dd'T'11:00"),
  });

  const openSectionOrRoute = (sectionId: string, fallbackPath: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.location.href = fallbackPath;
  };

  useEffect(() => {
    if (!auth.currentUser || !workspace) {
      setLeads([]);
      setTasks([]);
      setEvents([]);
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const leadsQuery = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('date', 'asc')
    );

    const eventsQuery = query(
      collection(db, 'events'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('startAt', 'asc')
    );

    const unsubscribeLeads = onSnapshot(
      leadsQuery,
      (snap) => {
        setLeads(snap.docs.map((snapshot) => ({ id: snapshot.id, ...(snapshot.data() as Omit<LeadRecord, 'id'>) })));
      },
      () => {
        setLeads([]);
        setLoading(false);
      }
    );

    const unsubscribeTasks = onSnapshot(
      tasksQuery,
      (snap) => {
        setTasks(snap.docs.map((snapshot) => ({ id: snapshot.id, ...(snapshot.data() as Omit<TaskRecord, 'id'>) })));
      },
      () => {
        setTasks([]);
        setLoading(false);
      }
    );

    const unsubscribeEvents = onSnapshot(
      eventsQuery,
      (snap) => {
        setEvents(snap.docs.map((snapshot) => ({ id: snapshot.id, ...(snapshot.data() as Omit<EventRecord, 'id'>) })));
        setLoading(false);
      },
      () => {
        setEvents([]);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeLeads();
      unsubscribeTasks();
      unsubscribeEvents();
    };
  }, [workspace]);

  const handleAddLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error('Brak aktywnej sesji.');
    if (!hasAccess) return toast.error('Twój trial wygasł. Opłać subskrypcję, aby dodawać leady.');

    try {
      const ensuredWorkspace = workspace ?? await ensureCurrentUserWorkspace();
      const usingSupabase = isSupabaseConfigured();
      if (usingSupabase) {
        await insertLeadToSupabase({
          name: newLead.name,
          email: newLead.email,
          source: newLead.source,
          dealValue: Number(newLead.dealValue) || 0,
          nextStep: newLead.nextStep,
          nextActionAt: newLead.nextActionAt,
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
        });
      } else {
        await addDoc(collection(db, 'leads'), {
          name: newLead.name,
          email: newLead.email,
          dealValue: Number(newLead.dealValue) || 0,
          source: newLead.source,
          status: newLead.status,
          nextStep: newLead.nextStep,
          nextActionAt: newLead.nextActionAt,
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
          isAtRisk: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      if (usingSupabase) {
        setLeads((prev) => [
          {
            id: crypto.randomUUID(),
            name: newLead.name,
            email: newLead.email,
            source: newLead.source,
            dealValue: Number(newLead.dealValue) || 0,
            status: 'new',
            nextStep: newLead.nextStep,
            nextActionAt: newLead.nextActionAt,
            isAtRisk: false,
          },
          ...prev,
        ]);
      }
      toast.success('Lead dodany');
      setIsLeadOpen(false);
      setNewLead({
        name: '',
        email: '',
        dealValue: '',
        source: 'other',
        status: 'new',
        nextStep: '',
        nextActionAt: format(new Date(), "yyyy-MM-dd'T'09:00"),
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error('Brak aktywnej sesji.');
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      const ensuredWorkspace = workspace ?? await ensureCurrentUserWorkspace();
      const usingSupabase = isSupabaseConfigured();
      if (usingSupabase) {
        await insertTaskToSupabase({
          title: newTask.title,
          type: newTask.type,
          date: newTask.date,
          priority: newTask.priority,
          status: 'todo',
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
        });
      } else {
        await addDoc(collection(db, 'tasks'), {
          ...newTask,
          status: 'todo',
          ownerId: auth.currentUser.uid,
          workspaceId: ensuredWorkspace.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      if (usingSupabase) {
        setTasks((prev) => [
          {
            id: crypto.randomUUID(),
            title: newTask.title,
            type: newTask.type,
            date: newTask.date,
            status: 'todo',
          },
          ...prev,
        ]);
      }
      toast.success('Zadanie dodane');
      setIsTaskOpen(false);
      setNewTask({ title: '', type: 'follow_up', date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error('Brak aktywnej sesji.');
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        status: 'scheduled',
        ownerId: auth.currentUser.uid,
        workspaceId: (workspace ?? await ensureCurrentUserWorkspace()).id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Wydarzenie dodane');
      setIsEventOpen(false);
      setNewEvent({
        title: '',
        type: 'meeting',
        startAt: format(new Date(), "yyyy-MM-dd'T'10:00"),
        endAt: format(new Date(), "yyyy-MM-dd'T'11:00"),
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: currentStatus === 'todo' ? 'done' : 'todo',
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const activeLeads = useMemo(
    () => leads.filter((lead) => ACTIVE_LEAD_STATUSES.includes(lead.status || 'new')),
    [leads]
  );

  const todayTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'done' && isToday(parseISO(task.date))),
    [tasks]
  );
  const overdueTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'done' && isPast(parseISO(task.date)) && !isToday(parseISO(task.date))),
    [tasks]
  );
  const todayEvents = useMemo(
    () => events.filter((event) => event.status !== 'completed' && event.status !== 'cancelled' && isToday(parseISO(event.startAt))),
    [events]
  );

  const todayLeads = useMemo(
    () => activeLeads.filter((lead) => lead.nextActionAt && isToday(parseISO(lead.nextActionAt))),
    [activeLeads]
  );
  const overdueLeads = useMemo(
    () => activeLeads.filter((lead) => lead.nextActionAt && isPast(parseISO(lead.nextActionAt)) && !isToday(parseISO(lead.nextActionAt))),
    [activeLeads]
  );
  const noStepLeads = useMemo(() => activeLeads.filter((lead) => !lead.nextActionAt), [activeLeads]);
  const staleLeads = useMemo(
    () => activeLeads.filter((lead) => {
      const updatedDate = toDate(lead.updatedAt);
      return updatedDate ? differenceInCalendarDays(new Date(), updatedDate) >= 5 : false;
    }),
    [activeLeads]
  );
  const waitingTooLongLeads = useMemo(
    () => activeLeads.filter((lead) => {
      if (!['contacted', 'proposal_sent', 'follow_up', 'negotiation'].includes(lead.status || '')) return false;
      const updatedDate = toDate(lead.updatedAt);
      if (!updatedDate) return false;
      return differenceInCalendarDays(new Date(), updatedDate) >= 3 && !(lead.nextActionAt && isPast(parseISO(lead.nextActionAt)) && !isToday(parseISO(lead.nextActionAt)));
    }),
    [activeLeads]
  );
  const highValueAtRisk = useMemo(
    () => [...activeLeads]
      .filter((lead) => lead.isAtRisk || (!lead.nextActionAt && (lead.dealValue || 0) >= 2000) || (lead.dealValue || 0) >= 5000)
      .sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0))
      .slice(0, 5),
    [activeLeads]
  );

  const priorityList = useMemo(() => {
    const scored = activeLeads.map((lead) => {
      let score = 0;
      if (!lead.nextActionAt) score += 4;
      if (lead.nextActionAt && isPast(parseISO(lead.nextActionAt))) score += 5;
      if (lead.isAtRisk) score += 4;
      if ((lead.dealValue || 0) >= 5000) score += 3;
      const updatedDate = toDate(lead.updatedAt);
      if (updatedDate) {
        score += Math.min(4, Math.max(0, differenceInCalendarDays(new Date(), updatedDate) - 2));
      }
      return { lead, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || (b.lead.dealValue || 0) - (a.lead.dealValue || 0))
      .slice(0, 5);
  }, [activeLeads]);

  const nextDays = useMemo(
    () => [1, 2, 3]
      .map((offset) => {
        const date = addDays(new Date(), offset);
        const dayTasks = tasks.filter((task) => isSameDay(parseISO(task.date), date));
        const dayEvents = events.filter((event) => isSameDay(parseISO(event.startAt), date));
        return { offset, date, count: dayTasks.length + dayEvents.length, dayTasks, dayEvents };
      })
      .filter((bucket) => bucket.count > 0),
    [tasks, events]
  );

  const funnelValue = activeLeads.reduce((acc, lead) => acc + (lead.dealValue || 0), 0);

  if (wsLoading || loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[color:var(--app-primary)]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-8">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-3xl font-bold app-text">Witaj, {profile?.fullName?.split(' ')[0] || 'Operatorze'}!</h1>
            <p className="mt-1 app-muted">To jest ekran decyzji. Wchodzisz i od razu widzisz, gdzie trzeba ruszyć proces.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isLeadOpen} onOpenChange={setIsLeadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-sm"><Plus className="h-4 w-4" /> Lead</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Szybkie dodanie leada</DialogTitle>
                  <DialogDescription>
                    Uzupelnij podstawowe dane, aby szybko dodac leada do lejka.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddLead} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Imię i nazwisko / firma</Label>
                    <Input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Wartość (PLN)</Label>
                      <Input type="number" value={newLead.dealValue} onChange={(e) => setNewLead({ ...newLead, dealValue: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Źródło</Label>
                      <select
                        value={newLead.source}
                        onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                        className="app-input flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm"
                      >
                        {LEAD_SOURCE_OPTIONS.map((sourceOption) => (
                          <option key={sourceOption.value} value={sourceOption.value}>
                            {sourceOption.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Następny krok</Label>
                    <Input value={newLead.nextStep} onChange={(e) => setNewLead({ ...newLead, nextStep: e.target.value })} placeholder="Np. zadzwonić i domknąć termin rozmowy" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Termin ruchu</Label>
                      <Input type="datetime-local" value={newLead.nextActionAt} onChange={(e) => setNewLead({ ...newLead, nextActionAt: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input type="email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Dodaj leada</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl"><Plus className="h-4 w-4" /> Zadanie</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nowe zadanie</DialogTitle>
                  <DialogDescription>
                    Dodaj zadanie operacyjne na dzis lub na wybrany termin.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTask} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Tytuł zadania</Label>
                    <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow_up">Dalszy kontakt</SelectItem>
                          <SelectItem value="phone">Telefon</SelectItem>
                          <SelectItem value="reply">Odpisać</SelectItem>
                          <SelectItem value="send_offer">Wysłać ofertę</SelectItem>
                          <SelectItem value="meeting">Spotkanie</SelectItem>
                          <SelectItem value="other">Inne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Dodaj zadanie</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl"><Plus className="h-4 w-4" /> Wydarzenie</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Zaplanuj wydarzenie</DialogTitle>
                  <DialogDescription>
                    Ustaw tytul, typ i termin, aby dodac wydarzenie do kalendarza.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Tytuł</Label>
                    <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Spotkanie</SelectItem>
                          <SelectItem value="phone_call">Rozmowa</SelectItem>
                          <SelectItem value="follow_up">Dalszy kontakt</SelectItem>
                          <SelectItem value="deadline">Termin końcowy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Start</Label>
                      <Input type="datetime-local" value={newEvent.startAt} onChange={(e) => setNewEvent({ ...newEvent, startAt: e.target.value })} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Zaplanuj</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card
            className="border-none app-surface-strong app-shadow cursor-pointer transition-transform hover:-translate-y-0.5"
            onClick={() => openSectionOrRoute('sekcja-priorytety', '/leads')}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Priorytety dziś</p>
                <p className="mt-2 text-3xl font-bold app-text">{priorityList.length}</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><Sparkles className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card
            className="border-none app-surface-strong app-shadow cursor-pointer transition-transform hover:-translate-y-0.5"
            onClick={() => openSectionOrRoute('sekcja-zalegle', '/tasks')}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Zaległe</p>
                <p className="mt-2 text-3xl font-bold text-rose-500">{overdueTasks.length + overdueLeads.length}</p>
              </div>
              <div className="rounded-2xl bg-rose-500/12 p-3 text-rose-500"><AlertTriangle className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card
            className="border-none app-surface-strong app-shadow cursor-pointer transition-transform hover:-translate-y-0.5"
            onClick={() => openSectionOrRoute('sekcja-bez-kroku', '/leads')}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Bez kroku</p>
                <p className="mt-2 text-3xl font-bold text-amber-500">{noStepLeads.length}</p>
              </div>
              <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-500"><ShieldAlert className="h-6 w-6" /></div>
            </CardContent>
          </Card>
          <Card
            className="border-none app-surface-strong app-shadow cursor-pointer transition-transform hover:-translate-y-0.5"
            onClick={() => openSectionOrRoute('sekcja-wartosc', '/leads')}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Wartość lejka</p>
                <p className="mt-2 text-3xl font-bold app-text">{funnelValue.toLocaleString()} PLN</p>
              </div>
              <div className="rounded-2xl p-3 app-primary-chip"><TrendingUp className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <div className="space-y-8">
            <SectionBlock id="sekcja-priorytety" title="Najważniejsze ruchy dziś" count={priorityList.length} icon={<Sparkles className="h-5 w-5" />} accent="primary">
              {priorityList.length > 0 ? (
                <div className="grid gap-3">
                  {priorityList.map(({ lead, score }) => (
                    <div key={lead.id}>
                      <LeadActionCard
                        lead={lead}
                        badge={<Badge className="app-primary-chip border-none">Priorytet {score}</Badge>}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed app-surface-strong">
                  <CardContent className="p-8 text-center">
                    <Sparkles className="mx-auto mb-3 h-8 w-8 app-muted" />
                    <p className="font-medium app-text">Na ten moment nie ma niczego, co pali się natychmiast.</p>
                    <p className="mt-1 text-sm app-muted">Możesz spokojnie wejść w leady albo uzupełnić kolejne kroki tam, gdzie ich brakuje.</p>
                  </CardContent>
                </Card>
              )}
            </SectionBlock>

            {overdueTasks.length + overdueLeads.length > 0 ? (
              <SectionBlock id="sekcja-zalegle" title="Zaległe" count={overdueTasks.length + overdueLeads.length} icon={<AlertTriangle className="h-5 w-5" />} accent="danger">
                <div className="grid gap-3">
                  {overdueTasks.map((task) => (
                    <Card key={task.id} className="border-none app-surface-strong app-shadow">
                      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTask(task.id, task.status)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500"
                          >
                            <CheckSquare className="h-4 w-4" />
                          </button>
                          <div>
                            <p className="font-semibold app-text">{task.title}</p>
                            <p className="text-sm text-rose-500">Termin minął {format(parseISO(task.date), 'd MMMM', { locale: pl })}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/tasks">Zobacz zadania</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {overdueLeads.map((lead) => (
                    <div key={lead.id}><LeadActionCard lead={lead} badge={<Badge variant="destructive">Lead po terminie</Badge>} /></div>
                  ))}
                </div>
              </SectionBlock>
            ) : null}

            <SectionBlock title="Do ruchu dziś" count={todayLeads.length + todayTasks.length + todayEvents.length} icon={<Clock className="h-5 w-5" />}>
              <div className="grid gap-3">
                {todayLeads.map((lead) => (
                  <div key={lead.id}><LeadActionCard lead={lead} badge={<Badge className="app-primary-chip border-none">Lead dziś</Badge>} /></div>
                ))}

                {todayTasks.map((task) => (
                  <Card key={task.id} className="border-none app-surface-strong app-shadow">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold app-text">{task.title}</p>
                        <p className="text-sm app-muted">Zadanie na dziś • {task.type}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toggleTask(task.id, task.status)}>Oznacz jako zrobione</Button>
                    </CardContent>
                  </Card>
                ))}

                {todayEvents.map((event) => (
                  <Card key={event.id} className="border-none app-surface-strong app-shadow">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl p-3 app-primary-chip"><Calendar className="h-5 w-5" /></div>
                        <div>
                          <p className="font-semibold app-text">{event.title}</p>
                          <p className="text-sm app-muted">
                            {format(parseISO(event.startAt), 'HH:mm', { locale: pl })} • {event.type}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/calendar">Kalendarz</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {todayLeads.length === 0 && todayTasks.length === 0 && todayEvents.length === 0 ? (
                  <Card className="border-dashed app-surface-strong">
                    <CardContent className="p-8 text-center">
                      <Clock className="mx-auto mb-3 h-8 w-8 app-muted" />
                      <p className="font-medium app-text">Dziś nie ma ustawionych ruchów.</p>
                      <p className="mt-1 text-sm app-muted">To dobry moment, żeby ustawić kolejne kroki na leadach bez terminu.</p>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </SectionBlock>

            {waitingTooLongLeads.length > 0 ? (
              <SectionBlock title="Czekają za długo" count={waitingTooLongLeads.length} icon={<Mail className="h-5 w-5" />} accent="warning">
                <div className="grid gap-3 md:grid-cols-2">
                  {waitingTooLongLeads.slice(0, 4).map((lead) => (
                    <div key={lead.id}><LeadActionCard lead={lead} badge={<Badge variant="outline" className="border-amber-500/25 text-amber-500">Brak odpowiedzi</Badge>} /></div>
                  ))}
                </div>
              </SectionBlock>
            ) : null}

            {noStepLeads.length > 0 ? (
              <SectionBlock id="sekcja-bez-kroku" title="Bez następnego kroku" count={noStepLeads.length} icon={<ShieldAlert className="h-5 w-5" />} accent="warning">
                <div className="grid gap-3 md:grid-cols-2">
                  {noStepLeads.slice(0, 6).map((lead) => (
                    <div key={lead.id}><LeadActionCard lead={lead} badge={<Badge variant="outline" className="border-amber-500/25 text-amber-500">Brak kroku</Badge>} /></div>
                  ))}
                </div>
              </SectionBlock>
            ) : null}
          </div>

          <aside className="space-y-6">
            <Card id="sekcja-wartosc" className="border-none app-surface-strong app-shadow">
              <CardHeader>
                <CardTitle className="text-lg app-text">Najcenniejsze do ruszenia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {highValueAtRisk.length > 0 ? highValueAtRisk.map((lead) => (
                  <div key={lead.id} className="rounded-2xl border p-4 app-border app-surface">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold app-text">{lead.name}</p>
                        <p className="text-xs app-muted">{lead.company || 'Brak firmy'}</p>
                      </div>
                      <Badge variant={lead.isAtRisk ? 'destructive' : 'secondary'}>
                        {(lead.dealValue || 0).toLocaleString()} PLN
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm app-muted">{leadReason(lead)}</p>
                    <Button variant="ghost" size="sm" className="mt-3 px-0" asChild>
                      <Link to={`/leads/${lead.id}`}>Wejdź w rekord <ChevronRight className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                )) : (
                  <p className="text-sm app-muted">Brak leadów, które wyglądają dziś na drogie i zaniedbane jednocześnie.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong app-shadow">
              <CardHeader>
                <CardTitle className="text-lg app-text">Najbliższe dni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nextDays.length > 0 ? nextDays.map((bucket) => (
                  <div key={bucket.offset} className="flex items-center gap-4 rounded-2xl border p-4 app-border app-surface">
                    <div className="w-12 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] app-muted">{format(bucket.date, 'EEE', { locale: pl })}</p>
                      <p className="text-lg font-bold app-text">{format(bucket.date, 'd')}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium app-text">{bucket.count} {bucket.count === 1 ? 'rzecz' : 'rzeczy'}</p>
                      <p className="text-xs app-muted">
                        {bucket.dayEvents.length > 0 ? `${bucket.dayEvents.length} wydarzenie ` : ''}
                        {bucket.dayTasks.length > 0 ? `${bucket.dayTasks.length} zadanie` : ''}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm app-muted">Na trzy najbliższe dni nie ma jeszcze nic w kalendarzu ani zadaniach.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-none app-surface-strong app-shadow">
              <CardHeader>
                <CardTitle className="text-lg app-text">Leady bez ruchu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {waitingTooLongLeads.length > 0 ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="font-semibold text-amber-600">{waitingTooLongLeads.length} leadów czeka już za długo</p>
                    <p className="mt-1 text-sm text-amber-600/90">Nie są jeszcze po terminie, ale wiszą bez odpowiedzi i zaczynają robić się niebezpieczne.</p>
                  </div>
                ) : null}
                {staleLeads.length > 0 ? staleLeads.slice(0, 5).map((lead) => {
                  const updatedDate = toDate(lead.updatedAt);
                  const days = updatedDate ? differenceInCalendarDays(startOfDay(new Date()), startOfDay(updatedDate)) : 0;
                  return (
                    <div key={lead.id} className="rounded-2xl border p-4 app-border app-surface">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold app-text">{lead.name}</p>
                          <p className="text-xs app-muted">Bez ruchu od {days} dni</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/leads/${lead.id}`}>Ruszyć</Link>
                        </Button>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm app-muted">Nie ma teraz leadów, które leżą bez ruchu dłużej niż 5 dni.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
