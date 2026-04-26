import { useState, useEffect, FormEvent } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { useWorkspace } from '../hooks/useWorkspace';
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
  MessageSquare,
  Phone,
  Mail,
  MoreVertical,
  ChevronRight,
  Loader2,
  Mic
} from 'lucide-react';
import { 
  format, 
  isToday, 
  isTomorrow, 
  isPast, 
  addDays, 
  startOfDay, 
  endOfDay,
  isSameDay,
  parseISO
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import QuickLeadCaptureModal from '../components/quick-lead/QuickLeadCaptureModal';
import { getQuickLeadTaskType, type QuickLeadParsedData } from '../lib/quick-lead-capture';
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

export default function Today() {
  const { workspace, profile, hasAccess, loading: wsLoading } = useWorkspace();
  const [leads, setLeads] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Add States
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', dealValue: '', source: 'other', status: 'new' });
  const [newTask, setNewTask] = useState({ title: '', type: 'follow_up', date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });
  const [newEvent, setNewEvent] = useState({ title: '', type: 'meeting', startAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"), endAt: format(addDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm") });

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const leadsQuery = query(
      collection(db, 'leads'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', 'not-in', ['won', 'lost']),
      orderBy('status'),
      orderBy('updatedAt', 'desc')
    );

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'todo'),
      orderBy('date', 'asc')
    );

    const eventsQuery = query(
      collection(db, 'events'),
      where('ownerId', '==', auth.currentUser.uid),
      where('status', '==', 'scheduled'),
      orderBy('startAt', 'asc')
    );

    const unsubscribeLeads = onSnapshot(leadsQuery, (snap) => {
      setLeads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeTasks = onSnapshot(tasksQuery, (snap) => {
      setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeEvents = onSnapshot(eventsQuery, (snap) => {
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeLeads();
      unsubscribeTasks();
      unsubscribeEvents();
    };
  }, [workspace]);

  const handleAddLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Twój trial wygasł. Opłać subskrypcję, aby dodawać leady.');
    try {
      await addDoc(collection(db, 'leads'), {
        ...newLead,
        dealValue: Number(newLead.dealValue) || 0,
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        isAtRisk: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Lead dodany');
      setIsLeadOpen(false);
      setNewLead({ name: '', email: '', dealValue: '', source: 'other', status: 'new' });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleQuickLeadConfirm = async (data: QuickLeadParsedData) => {
    if (!hasAccess) throw new Error('Twój trial wygasł. Opłać subskrypcję, aby dodawać leady.');
    if (!workspace?.id || !auth.currentUser?.uid) throw new Error('Brak aktywnego workspace lub użytkownika.');

    const leadName = data.contactName || data.companyName || data.need || 'Nowy lead z szybkiej notatki';
    const leadRef = await addDoc(collection(db, 'leads'), {
      name: leadName,
      company: data.companyName || '',
      email: data.email || '',
      phone: data.phone || '',
      source: data.source || 'other',
      dealValue: 0,
      status: data.suggestedStatus || 'new',
      priority: data.priority,
      notes: data.need ? `Potrzeba: ${data.need}` : '',
      nextActionAt: data.nextActionAt || null,
      ownerId: auth.currentUser.uid,
      workspaceId: workspace.id,
      isAtRisk: !data.nextActionAt,
      createdFromQuickCapture: true,
      quickCaptureProvider: 'rule_parser',
      quickCaptureConfirmedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (data.nextAction || data.nextActionAt) {
      const actionDate = data.nextActionAt ? new Date(data.nextActionAt) : new Date();
      await addDoc(collection(db, 'tasks'), {
        title: data.nextAction ? `${data.nextAction}: ${leadName}` : `Follow-up: ${leadName}`,
        type: getQuickLeadTaskType(data.nextAction),
        date: format(actionDate, 'yyyy-MM-dd'),
        priority: data.priority === 'high' ? 'high' : data.priority === 'low' ? 'low' : 'medium',
        status: 'todo',
        leadId: leadRef.id,
        ownerId: auth.currentUser.uid,
        workspaceId: workspace.id,
        reminderAt: data.nextActionAt || null,
        scheduledAt: data.nextActionAt || null,
        dueAt: data.nextActionAt || format(actionDate, 'yyyy-MM-dd'),
        createdFromQuickCapture: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await addDoc(collection(db, 'activities'), {
      type: 'lead_created',
      title: 'Utworzono leada z szybkiej notatki',
      description: data.need || 'Lead utworzony z modułu szybkiego dodawania.',
      leadId: leadRef.id,
      ownerId: auth.currentUser.uid,
      workspaceId: workspace.id,
      createdAt: serverTimestamp(),
    });
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Twój trial wygasł.');
    try {
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        status: 'todo',
        scheduledAt: newTask.date,
        dueAt: newTask.date,
        ownerId: auth.currentUser?.uid,
        workspaceId: workspace.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Zadanie dodane');
      setIsTaskOpen(false);
      setNewTask({ title: '', type: 'follow_up', date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasAccess) return toast.error('Twój trial wygasł.');
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
      toast.success('Wydarzenie dodane');
      setIsEventOpen(false);
      setNewEvent({ title: '', type: 'meeting', startAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"), endAt: format(addDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm") });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: currentStatus === 'todo' ? 'done' : 'todo',
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      toast.error('Błąd: ' + error.message);
    }
  };

  if (wsLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const todayTasks = tasks.filter(t => isToday(parseISO(t.date)));
  const overdueTasks = tasks.filter(t => isPast(parseISO(t.date)) && !isToday(parseISO(t.date)));
  const todayEvents = events.filter(e => isToday(parseISO(e.startAt)));
  const actionLeads = leads.filter(l => l.nextActionAt && isToday(parseISO(l.nextActionAt)));
  const noStepLeads = leads.filter(l => !l.nextActionAt);

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Witaj, {profile?.fullName?.split(' ')[0]}!</h1>
            <p className="text-slate-500">Oto co wymaga Twojej uwagi dzisiaj.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <QuickLeadCaptureModal
              disabled={!hasAccess}
              onConfirm={handleQuickLeadConfirm}
              trigger={
                <Button variant="default" className="rounded-xl shadow-sm" disabled={!hasAccess}>
                  <Mic className="w-4 h-4 mr-2" /> Szybki lead
                </Button>
              }
            />

            <Dialog open={isLeadOpen} onOpenChange={setIsLeadOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-2" /> Lead</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Szybkie dodanie leada</DialogTitle></DialogHeader>
                <form onSubmit={handleAddLead} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Imię i nazwisko / Firma</Label>
                    <Input value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Wartość (PLN)</Label>
                      <Input type="number" value={newLead.dealValue} onChange={e => setNewLead({...newLead, dealValue: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Źródło</Label>
                      <Select value={newLead.source} onValueChange={v => setNewLead({...newLead, source: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="messenger">Messenger</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="form">Formularz</SelectItem>
                          <SelectItem value="phone">Telefon</SelectItem>
                          <SelectItem value="referral">Polecenie</SelectItem>
                          <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                          <SelectItem value="other">Inne</SelectItem>
                        </SelectContent>
                      </Select>
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
                <Button variant="outline" className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-2" /> Zadanie</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nowe zadanie</DialogTitle></DialogHeader>
                <form onSubmit={handleAddTask} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tytuł zadania</Label>
                    <Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <Select value={newTask.type} onValueChange={v => setNewTask({...newTask, type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow_up">Follow-up</SelectItem>
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
                      <Input type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} required />
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
                <Button variant="outline" className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-2" /> Wydarzenie</Button>
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
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overdue Section */}
            {overdueTasks.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Zaległe</h2>
                  <Badge variant="destructive" className="rounded-full">{overdueTasks.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {overdueTasks.map(task => (
                    <Card key={task.id} className="border-rose-100 bg-rose-50/30">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleTask(task.id, task.status)} className="w-5 h-5 rounded border border-rose-300 flex items-center justify-center">
                            {task.status === 'done' && <CheckSquare className="w-4 h-4 text-rose-600" />}
                          </button>
                          <div>
                            <p className="font-medium text-slate-900">{task.title}</p>
                            <p className="text-xs text-rose-500 font-medium">{format(parseISO(task.date), 'd MMMM', { locale: pl })}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild><Link to="/tasks"><ChevronRight className="w-4 h-4" /></Link></Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Today's Focus */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Dzisiaj</h2>
                </div>
                <span className="text-sm text-slate-500 font-medium">{format(new Date(), 'EEEE, d MMMM', { locale: pl })}</span>
              </div>

              <div className="grid gap-6">
                {/* Events */}
                {todayEvents.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Wydarzenia</h3>
                    {todayEvents.map(event => (
                      <Card key={event.id} className="border-indigo-100 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 text-center border-r border-slate-100 pr-4">
                            <p className="text-xs font-bold text-indigo-600">{format(parseISO(event.startAt), 'HH:mm')}</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{event.title}</p>
                            <p className="text-xs text-slate-500">{event.type === 'meeting' ? 'Spotkanie' : 'Rozmowa'}</p>
                          </div>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Teraz</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Tasks */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Zadania na dziś</h3>
                  {todayTasks.length > 0 ? (
                    <div className="grid gap-3">
                      {todayTasks.map(task => (
                        <Card key={task.id} className="hover:border-primary/30 transition-colors shadow-sm">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button onClick={() => toggleTask(task.id, task.status)} className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center hover:border-primary">
                                {task.status === 'done' && <CheckSquare className="w-4 h-4 text-primary" />}
                              </button>
                              <p className="font-medium text-slate-900">{task.title}</p>
                            </div>
                            <Badge variant="secondary" className="text-[10px] uppercase">{task.type}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-slate-50/50">
                      <CardContent className="p-8 text-center">
                        <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Brak zadań na dziś. Odpocznij albo zaplanuj coś!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </section>

            {/* Neglected Leads */}
            {noStepLeads.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Bez następnego kroku</h2>
                  <Badge variant="outline" className="rounded-full border-amber-200 text-amber-700 bg-amber-50">{noStepLeads.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {noStepLeads.slice(0, 4).map(lead => (
                    <Card key={lead.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{lead.name}</h4>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Zaniedbany</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">{lead.company || 'Brak firmy'}</p>
                        <Button variant="outline" size="sm" className="w-full rounded-lg" asChild>
                          <Link to={`/leads/${lead.id}`}>Ustal kolejny krok <ArrowRight className="w-3 h-3 ml-2" /></Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Stats Card */}
            <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-24 h-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-400">Wartość lejka</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {leads.reduce((acc, l) => acc + (l.dealValue || 0), 0).toLocaleString()} PLN
                </div>
                <p className="text-xs text-slate-400">Suma aktywnych szans sprzedaży</p>
                
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Aktywne leady</p>
                    <p className="text-xl font-bold">{leads.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Zadania</p>
                    <p className="text-xl font-bold">{tasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Najbliższe dni</h2>
              <div className="space-y-3">
                {[1, 2, 3].map(days => {
                  const date = addDays(new Date(), days);
                  const dayTasks = tasks.filter(t => isSameDay(parseISO(t.date), date));
                  const dayEvents = events.filter(e => isSameDay(parseISO(e.startAt), date));
                  const count = dayTasks.length + dayEvents.length;
                  
                  if (count === 0) return null;

                  return (
                    <div key={days} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">{format(date, 'EEE', { locale: pl })}</p>
                        <p className="text-lg font-bold text-slate-700">{format(date, 'd')}</p>
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-xl border border-slate-100 group-hover:border-primary/30 transition-colors shadow-sm">
                        <p className="text-sm font-medium text-slate-900">{count} {count === 1 ? 'rzecz' : count < 5 ? 'rzeczy' : 'rzeczy'}</p>
                        <p className="text-[10px] text-slate-500">
                          {dayEvents.length > 0 && `${dayEvents.length} wydarzenie `}
                          {dayTasks.length > 0 && `${dayTasks.length} zadanie`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* High Value Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Najcenniejsze</h2>
              <div className="space-y-3">
                {leads
                  .sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0))
                  .slice(0, 3)
                  .map(lead => (
                    <Link key={lead.id} to={`/leads/${lead.id}`} className="block">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-primary/30 transition-colors shadow-sm">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                          <p className="text-[10px] text-slate-500">{lead.company || lead.source}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{(lead.dealValue || 0).toLocaleString()} PLN</p>
                          <Badge variant="outline" className="text-[8px] h-4 px-1">TOP</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
