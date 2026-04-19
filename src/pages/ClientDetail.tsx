import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { addHours, format, isAfter, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  Phone,
  Plus,
  Save,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';

import { auth, db } from '../firebase';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  buildClientDirectory,
  buildClientIdFromLead,
  clientHealthLabel,
  clientHealthTone,
  getDaysSinceTouch,
  portalStatusLabel,
  toJsDate,
  type ClientCaseLike,
  type ClientLeadLike,
  type ClientRecord,
} from '../lib/clients';

type TaskRecord = {
  id: string;
  title: string;
  type?: string;
  date: string;
  status?: 'todo' | 'done';
  priority?: 'low' | 'medium' | 'high';
  leadId?: string;
  leadName?: string;
  caseId?: string;
  caseTitle?: string;
  clientId?: string;
  clientName?: string;
};

type EventRecord = {
  id: string;
  title: string;
  type?: string;
  startAt: string;
  endAt?: string;
  status?: string;
  leadId?: string;
  leadName?: string;
  caseId?: string;
  caseTitle?: string;
  clientId?: string;
  clientName?: string;
};

const TASK_TYPE_OPTIONS = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'phone', label: 'Telefon' },
  { value: 'reply', label: 'Odpisać' },
  { value: 'send_offer', label: 'Wysłać ofertę' },
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'other', label: 'Inne' },
] as const;

const EVENT_TYPE_OPTIONS = [
  { value: 'meeting', label: 'Spotkanie' },
  { value: 'phone_call', label: 'Rozmowa' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'deadline', label: 'Deadline' },
] as const;

function startEventValue(offsetHours = 2) {
  return format(addHours(new Date(), offsetHours), "yyyy-MM-dd'T'HH:mm");
}

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { workspace, hasAccess, access } = useWorkspace();

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [leads, setLeads] = useState<ClientLeadLike[]>([]);
  const [cases, setCases] = useState<ClientCaseLike[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });
  const [newTask, setNewTask] = useState({ title: '', type: 'follow_up', date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });
  const [newEvent, setNewEvent] = useState({ title: '', type: 'meeting', startAt: startEventValue(2), endAt: startEventValue(3) });

  useEffect(() => {
    if (!auth.currentUser || !workspace) return;

    const unsubscribers: Array<() => void> = [];

    unsubscribers.push(onSnapshot(
      query(collection(db, 'clients'), where('ownerId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc')),
      (snapshot) => {
        setClients(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ClientRecord, 'id'>) })));
        setLoading(false);
      }
    ));

    unsubscribers.push(onSnapshot(
      query(collection(db, 'leads'), where('ownerId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc')),
      (snapshot) => setLeads(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ClientLeadLike, 'id'>) })))
    ));

    unsubscribers.push(onSnapshot(
      query(collection(db, 'cases'), where('ownerId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc')),
      (snapshot) => setCases(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<ClientCaseLike, 'id'>) })))
    ));

    unsubscribers.push(onSnapshot(
      query(collection(db, 'tasks'), where('ownerId', '==', auth.currentUser.uid), orderBy('date', 'asc')),
      (snapshot) => setTasks(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<TaskRecord, 'id'>) })))
    ));

    unsubscribers.push(onSnapshot(
      query(collection(db, 'events'), where('ownerId', '==', auth.currentUser.uid), orderBy('startAt', 'asc')),
      (snapshot) => setEvents(snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<EventRecord, 'id'>) })))
    ));

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [workspace]);

  const directory = useMemo(() => buildClientDirectory(clients, leads, cases), [clients, leads, cases]);
  const client = useMemo(() => directory.find((entry) => entry.id === clientId) ?? null, [clientId, directory]);

  useEffect(() => {
    if (!client) return;
    setClientForm({
      name: client.name || '',
      company: client.company || '',
      email: client.email || '',
      phone: client.phone || '',
      notes: client.notes || '',
    });
  }, [client]);

  const relatedLeads = useMemo(
    () => leads.filter((lead) => client?.linkedLeadIds.includes(lead.id)),
    [client?.linkedLeadIds, leads]
  );

  const relatedCases = useMemo(
    () => cases.filter((caseRecord) => client?.linkedCaseIds.includes(caseRecord.id)),
    [cases, client?.linkedCaseIds]
  );

  const relatedTasks = useMemo(() => {
    if (!client) return [];
    return tasks.filter((task) =>
      task.clientId === client.id
      || (task.leadId ? client.linkedLeadIds.includes(task.leadId) : false)
      || (task.caseId ? client.linkedCaseIds.includes(task.caseId) : false)
    );
  }, [client, tasks]);

  const relatedEvents = useMemo(() => {
    if (!client) return [];
    return events.filter((event) =>
      event.clientId === client.id
      || (event.leadId ? client.linkedLeadIds.includes(event.leadId) : false)
      || (event.caseId ? client.linkedCaseIds.includes(event.caseId) : false)
    );
  }, [client, events]);

  const clientHealth = useMemo(() => {
    if (!client) return 'Do spięcia';
    return clientHealthLabel({
      daysSinceTouch: getDaysSinceTouch(client.updatedAt),
      linkedCaseCount: client.linkedCaseIds.length,
      linkedLeadCount: client.linkedLeadIds.length,
      portalReady: client.portalReady,
    });
  }, [client]);

  if (!loading && !client) {
    return (
      <Layout>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
          <Card className="border-none app-surface-strong">
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="rounded-full p-4 app-primary-chip"><UserRound className="h-7 w-7" /></div>
              <div>
                <p className="text-lg font-semibold app-text">Nie znaleziono klienta</p>
                <p className="mt-1 text-sm app-muted">Ten rekord nie istnieje albo nie jest jeszcze spięty z Twoją bazą klientów.</p>
              </div>
              <Link to="/clients"><Button className="rounded-2xl">Wróć do klientów</Button></Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading || !client) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[color:var(--app-primary)]" />
        </div>
      </Layout>
    );
  }

  async function promoteFallbackClient() {
    if (!auth.currentUser || !workspace) return;
    if (!hasAccess) return toast.error('Dostęp jest w trybie podglądu.');

    const targetId = client.id.startsWith('client-') ? client.id : buildClientIdFromLead({
      leadId: client.primaryLeadId || client.primaryCaseId || client.id,
      email: client.email,
      phone: client.phone,
      name: client.name,
    });

    setSaving(true);
    try {
      await setDoc(doc(db, 'clients', targetId), {
        ownerId: auth.currentUser.uid,
        workspaceId: workspace.id,
        name: clientForm.name.trim() || client.name,
        company: clientForm.company.trim() || null,
        email: clientForm.email.trim().toLowerCase() || null,
        phone: clientForm.phone.trim() || null,
        notes: clientForm.notes.trim() || null,
        linkedLeadIds: client.linkedLeadIds,
        linkedCaseIds: client.linkedCaseIds,
        primaryLeadId: client.primaryLeadId || null,
        primaryCaseId: client.primaryCaseId || null,
        portalReady: client.portalReady,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });

      if (client.primaryLeadId) {
        await setDoc(doc(db, 'leads', client.primaryLeadId), {
          linkedClientId: targetId,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      if (client.primaryCaseId) {
        await setDoc(doc(db, 'cases', client.primaryCaseId), {
          clientId: targetId,
          clientName: clientForm.name.trim() || client.name,
          clientEmail: clientForm.email.trim().toLowerCase() || null,
          clientPhone: clientForm.phone.trim() || null,
          company: clientForm.company.trim() || null,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      toast.success('Klient został spięty w stały rekord.');
      if (targetId !== client.id) navigate(`/clients/${targetId}`, { replace: true });
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveClient(event: FormEvent) {
    event.preventDefault();
    if (!auth.currentUser || !workspace) return;
    if (!hasAccess) return toast.error('Dostęp jest w trybie podglądu.');

    if (client.source !== 'client') {
      await promoteFallbackClient();
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'clients', client.id), {
        ownerId: auth.currentUser.uid,
        workspaceId: workspace.id,
        name: clientForm.name.trim() || client.name,
        company: clientForm.company.trim() || null,
        email: clientForm.email.trim().toLowerCase() || null,
        phone: clientForm.phone.trim() || null,
        notes: clientForm.notes.trim() || null,
        linkedLeadIds: client.linkedLeadIds,
        linkedCaseIds: client.linkedCaseIds,
        primaryLeadId: client.primaryLeadId || null,
        primaryCaseId: client.primaryCaseId || null,
        portalReady: client.portalReady,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      if (client.primaryCaseId) {
        await setDoc(doc(db, 'cases', client.primaryCaseId), {
          clientName: clientForm.name.trim() || client.name,
          clientEmail: clientForm.email.trim().toLowerCase() || null,
          clientPhone: clientForm.phone.trim() || null,
          company: clientForm.company.trim() || null,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      toast.success('Dane klienta zapisane.');
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateTask(event: FormEvent) {
    event.preventDefault();
    if (!auth.currentUser || !workspace) return;
    if (!hasAccess) return toast.error('Dostęp jest w trybie podglądu.');
    if (!newTask.title.trim()) return toast.error('Podaj tytuł zadania.');

    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask.title.trim(),
        type: newTask.type,
        date: newTask.date,
        priority: newTask.priority,
        status: 'todo',
        ownerId: auth.currentUser.uid,
        workspaceId: workspace.id,
        clientId: client.id,
        clientName: clientForm.name.trim() || client.name,
        leadId: client.primaryLeadId || null,
        leadName: relatedLeads[0]?.name || null,
        caseId: client.primaryCaseId || null,
        caseTitle: relatedCases[0]?.title || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Zadanie klienta dodane.');
      setIsTaskOpen(false);
      setNewTask({ title: '', type: 'follow_up', date: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  async function handleCreateEvent(event: FormEvent) {
    event.preventDefault();
    if (!auth.currentUser || !workspace) return;
    if (!hasAccess) return toast.error('Dostęp jest w trybie podglądu.');
    if (!newEvent.title.trim()) return toast.error('Podaj tytuł wydarzenia.');

    try {
      await addDoc(collection(db, 'events'), {
        title: newEvent.title.trim(),
        type: newEvent.type,
        startAt: newEvent.startAt,
        endAt: isAfter(parseISO(newEvent.endAt), parseISO(newEvent.startAt)) ? newEvent.endAt : newEvent.startAt,
        status: 'scheduled',
        ownerId: auth.currentUser.uid,
        workspaceId: workspace.id,
        clientId: client.id,
        clientName: clientForm.name.trim() || client.name,
        leadId: client.primaryLeadId || null,
        leadName: relatedLeads[0]?.name || null,
        caseId: client.primaryCaseId || null,
        caseTitle: relatedCases[0]?.title || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Wydarzenie klienta zaplanowane.');
      setIsEventOpen(false);
      setNewEvent({ title: '', type: 'meeting', startAt: startEventValue(2), endAt: startEventValue(3) });
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    }
  }

  const updatedAt = toJsDate(client.updatedAt);

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Link to="/clients" className="inline-flex items-center gap-2 text-sm font-semibold app-muted hover:text-[color:var(--app-primary)]">
              <ArrowLeft className="h-4 w-4" /> Wróć do klientów
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] app-primary-chip">
              <Sparkles className="h-3.5 w-3.5" /> Centrum klienta
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold app-text">{client.name}</h1>
                <Badge className={clientHealthTone(clientHealth)}>{clientHealth}</Badge>
                <Badge variant="outline">{portalStatusLabel(client.portalReady)}</Badge>
                {client.source !== 'client' ? <Badge variant="outline">Fallback bez stałego rekordu</Badge> : null}
              </div>
              <p className="mt-2 max-w-2xl text-sm md:text-base app-muted">
                Jedno miejsce do prowadzenia klienta po sprzedaży: kontakt, sprawy, zadania, wydarzenia i dalsze uruchamianie portalu.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {client.primaryLeadId ? (
              <Link to={`/leads/${client.primaryLeadId}`}>
                <Button variant="outline" className="rounded-2xl"><Target className="mr-2 h-4 w-4" /> Lead</Button>
              </Link>
            ) : null}
            {client.primaryCaseId ? (
              <Link to={`/case/${client.primaryCaseId}`}>
                <Button variant="outline" className="rounded-2xl"><Briefcase className="mr-2 h-4 w-4" /> Sprawa</Button>
              </Link>
            ) : null}
            {client.primaryCaseId && client.portalReady ? (
              <Link to="/cases">
                <Button variant="outline" className="rounded-2xl"><FileText className="mr-2 h-4 w-4" /> Portal</Button>
              </Link>
            ) : null}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Leady', value: client.linkedLeadIds.length, icon: Target },
            { label: 'Sprawy', value: client.linkedCaseIds.length, icon: Briefcase },
            { label: 'Zadania', value: relatedTasks.filter((task) => task.status !== 'done').length, icon: CheckCircle2 },
            { label: 'Wydarzenia', value: relatedEvents.length, icon: Calendar },
          ].map((stat) => (
            <Card key={stat.label} className="border-none app-surface-strong">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold app-text">{stat.value}</p>
                </div>
                <div className="rounded-2xl p-3 app-primary-chip"><stat.icon className="h-5 w-5" /></div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle>Dane klienta</CardTitle>
              <CardDescription>Edytuj rekord, żeby nie rozjechały się dane między klientem, sprawą i portalem.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSaveClient}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Nazwa</Label>
                    <Input id="client-name" value={clientForm.name} onChange={(e) => setClientForm((state) => ({ ...state, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-company">Firma</Label>
                    <Input id="client-company" value={clientForm.company} onChange={(e) => setClientForm((state) => ({ ...state, company: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">E-mail</Label>
                    <Input id="client-email" type="email" value={clientForm.email} onChange={(e) => setClientForm((state) => ({ ...state, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Telefon</Label>
                    <Input id="client-phone" value={clientForm.phone} onChange={(e) => setClientForm((state) => ({ ...state, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-notes">Notatka operatora</Label>
                  <Textarea id="client-notes" rows={5} value={clientForm.notes} onChange={(e) => setClientForm((state) => ({ ...state, notes: e.target.value }))} placeholder="Najważniejsze ustalenia, uwagi, ryzyka albo preferencje klienta." />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm app-muted">
                    Ostatni ruch: {updatedAt ? updatedAt.toLocaleDateString('pl-PL') : 'brak danych'}
                  </div>
                  <Button type="submit" className="rounded-2xl" disabled={saving || !hasAccess}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {client.source !== 'client' ? 'Zepnij i zapisz klienta' : 'Zapisz zmiany'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none app-surface-strong">
            <CardHeader>
              <CardTitle>Stan procesu</CardTitle>
              <CardDescription>Szybki skrót, czy klient jest jeszcze w sprzedaży, onboardingu czy już w realizacji.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border app-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold app-text">{clientHealth}</p>
                    <p className="text-xs app-muted">{portalStatusLabel(client.portalReady)}</p>
                  </div>
                  <Badge className={clientHealthTone(clientHealth)}>{clientHealth}</Badge>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border app-border p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Kontakt</p>
                  <div className="mt-3 space-y-2 text-sm app-text">
                    <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4 app-muted" /> {clientForm.email || 'Brak e-maila'}</p>
                    <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4 app-muted" /> {clientForm.phone || 'Brak telefonu'}</p>
                  </div>
                </div>
                <div className="rounded-2xl border app-border p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] app-muted">Ruch</p>
                  <div className="mt-3 space-y-2 text-sm app-text">
                    <p className="inline-flex items-center gap-2"><Clock className="h-4 w-4 app-muted" /> {getDaysSinceTouch(client.updatedAt)} dni od ostatniego ruchu</p>
                    <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 app-muted" /> {relatedTasks.filter((task) => task.status !== 'done').length} aktywnych zadań</p>
                  </div>
                </div>
              </div>
              {!hasAccess ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm app-muted">
                  Tryb podglądu jest aktywny. Możesz przejrzeć klienta, ale zapis nowych akcji jest zablokowany. <Link to="/billing" className="font-semibold text-[color:var(--app-primary)]">{access.ctaLabel}</Link>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl p-1 lg:grid-cols-4">
            <TabsTrigger value="tasks" className="rounded-xl">Zadania</TabsTrigger>
            <TabsTrigger value="events" className="rounded-xl">Wydarzenia</TabsTrigger>
            <TabsTrigger value="leads" className="rounded-xl">Leady</TabsTrigger>
            <TabsTrigger value="cases" className="rounded-xl">Sprawy</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold app-text">Zadania klienta</h2>
                <p className="text-sm app-muted">Wszystkie zadania spięte bezpośrednio z klientem albo jego leadem i sprawą.</p>
              </div>
              <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl"><Plus className="mr-2 h-4 w-4" /> Dodaj zadanie</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nowe zadanie klienta</DialogTitle></DialogHeader>
                  <form className="space-y-4 py-2" onSubmit={handleCreateTask}>
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Tytuł</Label>
                      <Input id="task-title" value={newTask.title} onChange={(e) => setNewTask((state) => ({ ...state, title: e.target.value }))} required />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="task-date">Data</Label>
                        <Input id="task-date" type="date" value={newTask.date} onChange={(e) => setNewTask((state) => ({ ...state, date: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-priority">Priorytet</Label>
                        <Input id="task-priority" value={newTask.priority} onChange={(e) => setNewTask((state) => ({ ...state, priority: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-type">Typ</Label>
                      <select id="task-type" className="flex h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={newTask.type} onChange={(e) => setNewTask((state) => ({ ...state, type: e.target.value }))}>
                        {TASK_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="rounded-2xl">Zapisz zadanie</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {relatedTasks.length === 0 ? (
              <Card className="border-dashed app-surface-strong"><CardContent className="py-12 text-center text-sm app-muted">Brak zadań powiązanych z tym klientem.</CardContent></Card>
            ) : (
              <div className="grid gap-3">
                {relatedTasks.map((task) => (
                  <Card key={task.id} className="border-none app-surface-strong">
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold app-text">{task.title}</p>
                          <Badge variant={task.status === 'done' ? 'secondary' : 'outline'}>{task.status === 'done' ? 'Zrobione' : 'Aktywne'}</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs app-muted">
                          <span>{TASK_TYPE_OPTIONS.find((entry) => entry.value === task.type)?.label || 'Inne'}</span>
                          <span>{format(parseISO(task.date), 'd MMMM yyyy', { locale: pl })}</span>
                          {task.caseTitle ? <span>Sprawa: {task.caseTitle}</span> : null}
                          {task.leadName ? <span>Lead: {task.leadName}</span> : null}
                        </div>
                      </div>
                      {task.caseId ? <Link to={`/case/${task.caseId}`}><Button variant="outline" className="rounded-2xl">Otwórz sprawę <ArrowRight className="ml-2 h-4 w-4" /></Button></Link> : task.leadId ? <Link to={`/leads/${task.leadId}`}><Button variant="outline" className="rounded-2xl">Otwórz lead <ArrowRight className="ml-2 h-4 w-4" /></Button></Link> : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold app-text">Wydarzenia klienta</h2>
                <p className="text-sm app-muted">Spotkania, follow-upy i terminy podpięte pod klienta.</p>
              </div>
              <Dialog open={isEventOpen} onOpenChange={setIsEventOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl"><Plus className="mr-2 h-4 w-4" /> Dodaj wydarzenie</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nowe wydarzenie klienta</DialogTitle></DialogHeader>
                  <form className="space-y-4 py-2" onSubmit={handleCreateEvent}>
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Tytuł</Label>
                      <Input id="event-title" value={newEvent.title} onChange={(e) => setNewEvent((state) => ({ ...state, title: e.target.value }))} required />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="event-start">Start</Label>
                        <Input id="event-start" type="datetime-local" value={newEvent.startAt} onChange={(e) => setNewEvent((state) => ({ ...state, startAt: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-end">Koniec</Label>
                        <Input id="event-end" type="datetime-local" value={newEvent.endAt} onChange={(e) => setNewEvent((state) => ({ ...state, endAt: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Typ</Label>
                      <select id="event-type" className="flex h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={newEvent.type} onChange={(e) => setNewEvent((state) => ({ ...state, type: e.target.value }))}>
                        {EVENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="rounded-2xl">Zapisz wydarzenie</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {relatedEvents.length === 0 ? (
              <Card className="border-dashed app-surface-strong"><CardContent className="py-12 text-center text-sm app-muted">Brak wydarzeń powiązanych z tym klientem.</CardContent></Card>
            ) : (
              <div className="grid gap-3">
                {relatedEvents.map((event) => (
                  <Card key={event.id} className="border-none app-surface-strong">
                    <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold app-text">{event.title}</p>
                          <Badge variant="outline">{EVENT_TYPE_OPTIONS.find((entry) => entry.value === event.type)?.label || 'Wydarzenie'}</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs app-muted">
                          <span>{format(parseISO(event.startAt), 'd MMMM yyyy, HH:mm', { locale: pl })}</span>
                          {event.caseTitle ? <span>Sprawa: {event.caseTitle}</span> : null}
                          {event.leadName ? <span>Lead: {event.leadName}</span> : null}
                        </div>
                      </div>
                      <Link to="/calendar"><Button variant="outline" className="rounded-2xl">Pokaż w kalendarzu <ExternalLink className="ml-2 h-4 w-4" /></Button></Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            {relatedLeads.length === 0 ? (
              <Card className="border-dashed app-surface-strong"><CardContent className="py-12 text-center text-sm app-muted">Brak powiązanych leadów.</CardContent></Card>
            ) : (
              relatedLeads.map((lead) => (
                <Card key={lead.id} className="border-none app-surface-strong">
                  <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold app-text">{lead.name}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs app-muted">
                        <span>Status: {lead.status || 'nowy'}</span>
                        {lead.company ? <span>Firma: {lead.company}</span> : null}
                        {lead.email ? <span>{lead.email}</span> : null}
                      </div>
                    </div>
                    <Link to={`/leads/${lead.id}`}><Button variant="outline" className="rounded-2xl">Otwórz lead <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            {relatedCases.length === 0 ? (
              <Card className="border-dashed app-surface-strong"><CardContent className="py-12 text-center text-sm app-muted">Brak powiązanych spraw.</CardContent></Card>
            ) : (
              relatedCases.map((caseRecord) => (
                <Card key={caseRecord.id} className="border-none app-surface-strong">
                  <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold app-text">{caseRecord.title || 'Sprawa bez tytułu'}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs app-muted">
                        <span>Status: {caseRecord.status || 'w realizacji'}</span>
                        {caseRecord.company ? <span>Firma: {caseRecord.company}</span> : null}
                        {caseRecord.portalReady ? <span>Portal gotowy</span> : <span>Portal jeszcze niegotowy</span>}
                      </div>
                    </div>
                    <Link to={`/case/${caseRecord.id}`}><Button variant="outline" className="rounded-2xl">Otwórz sprawę <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
